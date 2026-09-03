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
  createArticle,
  createArticles,
  getArticleById,
  replaceArticleById,
  updateArticleById,
  updateArticles,
  deleteArticleById,
  deleteArticles,
};
