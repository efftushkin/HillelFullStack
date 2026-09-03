const express = require('express');
const { checkArticleAccess, validateArticleId } = require('../middlewares/articleAccess');
const {
  validateArticlePayload,
  validateArticlesPayload,
  validatePartialArticlePayload,
  validateBulkUpdatePayload,
  validateBulkDeletePayload,
} = require('../middlewares/validateArticleBody');
const {
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
} = require('../controllers/articlesController');

const router = express.Router();

router.use(checkArticleAccess);

// Registered before "/:articleId" so "search" isn't swallowed by that numeric-id route.
router.get('/search', searchArticles);

router.get('/', getArticles);
router.post('/', validateArticlePayload, createArticle);
router.post('/many', validateArticlesPayload, createArticles);
router.patch('/', validateBulkUpdatePayload, updateArticles);
router.delete('/', validateBulkDeletePayload, deleteArticles);

router.get('/:articleId', validateArticleId, getArticleById);
router.put('/:articleId', validateArticleId, validateArticlePayload, replaceArticleById);
router.patch('/:articleId', validateArticleId, validatePartialArticlePayload, updateArticleById);
router.delete('/:articleId', validateArticleId, deleteArticleById);

module.exports = router;
