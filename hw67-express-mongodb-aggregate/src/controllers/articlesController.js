const Article = require('../models/Article');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Builds a MongoDB projection object from a comma-separated "fields" query param.
// "title,author" -> include only those fields; "-content" -> include everything except content.
// Mixing inclusion and exclusion (besides _id) is rejected, same as the MongoDB driver would reject it.
function buildProjection(fields) {
  if (!fields) {
    return { projection: { _id: 0 }, error: null };
  }

  const fieldList = fields
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean);

  const isExclude = fieldList.every((field) => field.startsWith('-'));
  const isInclude = fieldList.every((field) => !field.startsWith('-'));

  if (!isExclude && !isInclude) {
    return { projection: null, error: 'Cannot mix inclusion and exclusion fields in the "fields" projection.' };
  }

  const projection = { _id: 0 };
  fieldList.forEach((field) => {
    if (isExclude) {
      projection[field.slice(1)] = 0;
    } else {
      projection[field] = 1;
    }
  });

  return { projection, error: null };
}

async function getNextArticleId() {
  const lastArticle = await Article.findOne().sort({ id: -1 });
  return lastArticle ? lastArticle.id + 1 : 1;
}

const getArticles = async (req, res) => {
  const articles = await Article.find().sort({ id: 1 });
  res.render('articles/list.ejs', { title: 'Articles', articles });
};

// GET /articles/search?author=...&id=...&fields=title,author (find + projection, JSON)
const searchArticles = async (req, res) => {
  const { author, id, fields } = req.query;

  const filter = {};
  if (author) filter.author = new RegExp(escapeRegExp(author), 'i');
  if (id !== undefined) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      return res.status(400).json({ message: `Invalid id filter: ${id}` });
    }
    filter.id = numericId;
  }

  const { projection, error } = buildProjection(fields);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const articles = await Article.find(filter, projection).sort({ id: 1 });
  res.json({ count: articles.length, articles });
};

// GET /articles/export (NDJSON, streamed via a cursor)
// Reads the collection through Article.find().cursor() instead of Article.find() (which would
// load every matching document into an array before a single byte is written to the response).
// Each document is written to the response as soon as the cursor yields it, so memory usage stays
// roughly constant no matter how large the collection grows, and the client starts receiving data
// immediately instead of waiting for the whole collection to be read and serialized first.
const exportArticles = async (req, res) => {
  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');

  const cursor = Article.find({}, { _id: 0 }).sort({ id: 1 }).lean().cursor();

  try {
    for await (const article of cursor) {
      res.write(`${JSON.stringify(article)}\n`);
    }
  } finally {
    res.end();
  }
};

// GET /articles/stats/cursor-summary (manual reduction over a cursor)
// Computes the same kind of headline numbers as /articles/stats/summary, but by iterating a
// cursor and accumulating totals in Node instead of letting MongoDB reduce them with an
// aggregation pipeline. Still only ever holds one document at a time in memory (unlike
// Article.find() followed by an Array#reduce, which needs the full array first), which is the
// right trade-off when the reduction logic is easier to express in JavaScript than in an
// aggregation pipeline.
const getCursorStatsSummary = async (req, res) => {
  const cursor = Article.find({}, { author: 1, content: 1, _id: 0 }).lean().cursor();

  let articlesCount = 0;
  let totalContentLength = 0;
  let totalWordCount = 0;
  const authors = new Set();

  for await (const article of cursor) {
    articlesCount += 1;
    totalContentLength += article.content.length;
    totalWordCount += article.content.trim().split(/\s+/).filter(Boolean).length;
    authors.add(article.author);
  }

  res.json({
    articlesCount,
    uniqueAuthorsCount: authors.size,
    avgContentLength: articlesCount ? Number((totalContentLength / articlesCount).toFixed(2)) : 0,
    avgWordCount: articlesCount ? Number((totalWordCount / articlesCount).toFixed(2)) : 0,
  });
};

// GET /articles/stats/by-author (aggregate: $group by author)
// Computes per-author statistics entirely on the database side - only the already-reduced,
// one-row-per-author result crosses the network, instead of fetching every article's full
// content back to the app and grouping it in JavaScript.
const getAuthorStats = async (req, res) => {
  const stats = await Article.aggregate([
    {
      $addFields: {
        wordCount: { $size: { $split: ['$content', ' '] } },
        contentLength: { $strLenCP: '$content' },
      },
    },
    {
      $group: {
        _id: '$author',
        articlesCount: { $sum: 1 },
        avgWordCount: { $avg: '$wordCount' },
        avgContentLength: { $avg: '$contentLength' },
        firstPublishedAt: { $min: '$publishedAt' },
        lastPublishedAt: { $max: '$publishedAt' },
        titles: { $push: '$title' },
      },
    },
    { $sort: { articlesCount: -1, _id: 1 } },
    {
      $project: {
        _id: 0,
        author: '$_id',
        articlesCount: 1,
        avgWordCount: { $round: ['$avgWordCount', 2] },
        avgContentLength: { $round: ['$avgContentLength', 2] },
        firstPublishedAt: 1,
        lastPublishedAt: 1,
        titles: 1,
      },
    },
  ]);

  res.json({ authorsCount: stats.length, stats });
};

// GET /articles/stats/summary (aggregate: $facet)
// Runs three grouping stages against the same input documents in a single round trip to
// MongoDB: an overall summary (count, average/min/max content length), a distinct-author count,
// and a per-year breakdown - all computed and reduced by the database, not by Node.
const getStatsSummary = async (req, res) => {
  const [result] = await Article.aggregate([
    {
      $addFields: {
        wordCount: { $size: { $split: ['$content', ' '] } },
        contentLength: { $strLenCP: '$content' },
        year: { $toInt: { $substrCP: ['$publishedAt', 0, 4] } },
      },
    },
    {
      $facet: {
        overall: [
          {
            $group: {
              _id: null,
              totalArticles: { $sum: 1 },
              avgContentLength: { $avg: '$contentLength' },
              avgWordCount: { $avg: '$wordCount' },
              minContentLength: { $min: '$contentLength' },
              maxContentLength: { $max: '$contentLength' },
            },
          },
        ],
        uniqueAuthors: [{ $group: { _id: '$author' } }, { $count: 'count' }],
        articlesPerYear: [
          { $group: { _id: '$year', articlesCount: { $sum: 1 } } },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, year: '$_id', articlesCount: 1 } },
        ],
      },
    },
  ]);

  const overall = result.overall[0] || {
    totalArticles: 0,
    avgContentLength: 0,
    avgWordCount: 0,
    minContentLength: 0,
    maxContentLength: 0,
  };

  res.json({
    totalArticles: overall.totalArticles,
    uniqueAuthorsCount: result.uniqueAuthors[0]?.count || 0,
    avgContentLength: Number(overall.avgContentLength.toFixed(2)),
    avgWordCount: Number(overall.avgWordCount.toFixed(2)),
    minContentLength: overall.minContentLength,
    maxContentLength: overall.maxContentLength,
    articlesPerYear: result.articlesPerYear,
  });
};

// POST /articles (insertOne)
const createArticle = async (req, res) => {
  const { title, author, publishedAt, content } = req.body;
  const id = await getNextArticleId();

  const article = await Article.insertOne({ id, title, author, publishedAt, content });
  res.status(201).json({ message: 'Article created', article });
};

// POST /articles/many (insertMany)
const createArticles = async (req, res) => {
  let nextId = await getNextArticleId();

  const docs = req.body.map((item) => ({
    id: nextId++,
    title: item.title,
    author: item.author,
    publishedAt: item.publishedAt,
    content: item.content,
  }));

  const articles = await Article.insertMany(docs);
  res.status(201).json({ message: `${articles.length} article(s) created`, articles });
};

const getArticleById = async (req, res) => {
  const { articleId } = req.params;
  const article = await Article.findOne({ id: Number(articleId) });

  if (!article) {
    return res.status(404).render('articles/not-found.ejs', { title: 'Article not found', articleId });
  }

  res.render('articles/details.ejs', { title: article.title, article });
};

// PUT /articles/:articleId (replaceOne) - the whole document is replaced, only the numeric id is kept.
const replaceArticleById = async (req, res) => {
  const { articleId } = req.params;
  const { title, author, publishedAt, content } = req.body;
  const id = Number(articleId);

  const result = await Article.replaceOne({ id }, { id, title, author, publishedAt, content });
  if (result.matchedCount === 0) {
    return res.status(404).json({ message: `Article with id ${articleId} not found` });
  }

  const article = await Article.findOne({ id });
  res.json({ message: 'Article replaced', article });
};

// PATCH /articles/:articleId (updateOne) - only the fields sent in the body are changed.
const updateArticleById = async (req, res) => {
  const { articleId } = req.params;
  const id = Number(articleId);

  const updates = { ...req.body };
  delete updates.id;

  const result = await Article.updateOne({ id }, { $set: updates });
  if (result.matchedCount === 0) {
    return res.status(404).json({ message: `Article with id ${articleId} not found` });
  }

  const article = await Article.findOne({ id });
  res.json({ message: 'Article updated', article });
};

// PATCH /articles (updateMany) - { filter, update } applies $set: update to every matching document.
const updateArticles = async (req, res) => {
  const { filter, update } = req.body;

  const result = await Article.updateMany(filter, { $set: update });
  res.json({ message: 'Articles updated', matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
};

// DELETE /articles/:articleId (deleteOne)
const deleteArticleById = async (req, res) => {
  const { articleId } = req.params;

  const result = await Article.deleteOne({ id: Number(articleId) });
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: `Article with id ${articleId} not found` });
  }

  res.json({ message: `Article with id ${articleId} deleted` });
};

// DELETE /articles (deleteMany) - { filter } removes every document matching it.
const deleteArticles = async (req, res) => {
  const { filter } = req.body;

  const result = await Article.deleteMany(filter);
  res.json({ message: 'Articles deleted', deletedCount: result.deletedCount });
};

module.exports = {
  getArticles,
  searchArticles,
  exportArticles,
  getCursorStatsSummary,
  getAuthorStats,
  getStatsSummary,
  createArticle,
  createArticles,
  getArticleById,
  replaceArticleById,
  updateArticleById,
  updateArticles,
  deleteArticleById,
  deleteArticles,
};
