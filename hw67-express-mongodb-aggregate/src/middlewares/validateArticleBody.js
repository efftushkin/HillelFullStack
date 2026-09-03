const ARTICLE_FIELDS = ['title', 'author', 'publishedAt', 'content'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// POST /articles (insertOne) and PUT /articles/:articleId (replaceOne) - both need a full article.
function validateArticlePayload(req, res, next) {
  const missing = ARTICLE_FIELDS.filter((field) => !isNonEmptyString(req.body[field]));

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing or invalid required field(s): ${missing.join(', ')}` });
  }

  next();
}

// POST /articles/many (insertMany) - an array of full articles.
function validateArticlesPayload(req, res, next) {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Request body must be a non-empty array of articles.' });
  }

  for (let i = 0; i < items.length; i += 1) {
    const missing = ARTICLE_FIELDS.filter((field) => !isNonEmptyString(items[i]?.[field]));
    if (missing.length > 0) {
      return res
        .status(400)
        .json({ message: `Article at index ${i} is missing or has invalid field(s): ${missing.join(', ')}` });
    }
  }

  next();
}

// PATCH /articles/:articleId (updateOne) - a partial set of known fields.
function validatePartialArticlePayload(req, res, next) {
  const updates = req.body;

  if (!isPlainObject(updates) || Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'Request body must contain at least one field to update.' });
  }

  const unknown = Object.keys(updates).filter((key) => key !== 'id' && !ARTICLE_FIELDS.includes(key));
  if (unknown.length > 0) {
    return res.status(400).json({ message: `Unknown field(s): ${unknown.join(', ')}` });
  }

  next();
}

// PATCH /articles (updateMany) - { filter, update }, both non-empty objects.
function validateBulkUpdatePayload(req, res, next) {
  const { filter, update } = req.body;

  if (!isPlainObject(filter) || Object.keys(filter).length === 0) {
    return res.status(400).json({ message: 'Request body must contain a non-empty "filter" object.' });
  }

  if (!isPlainObject(update) || Object.keys(update).length === 0) {
    return res.status(400).json({ message: 'Request body must contain a non-empty "update" object.' });
  }

  next();
}

// DELETE /articles (deleteMany) - { filter }, a non-empty object so the whole collection can't be
// wiped out by accident with an empty/missing filter.
function validateBulkDeletePayload(req, res, next) {
  const { filter } = req.body;

  if (!isPlainObject(filter) || Object.keys(filter).length === 0) {
    return res
      .status(400)
      .json({ message: 'Request body must contain a non-empty "filter" object to avoid deleting the entire collection.' });
  }

  next();
}

module.exports = {
  validateArticlePayload,
  validateArticlesPayload,
  validatePartialArticlePayload,
  validateBulkUpdatePayload,
  validateBulkDeletePayload,
};
