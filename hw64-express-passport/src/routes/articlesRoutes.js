const express = require('express');
const { checkArticleAccess, validateArticleId } = require('../middlewares/articleAccess');
const {
  getArticles,
  createArticle,
  getArticleById,
  updateArticleById,
  deleteArticleById,
} = require('../controllers/articlesController');

const router = express.Router();

router.use(checkArticleAccess);

router.get('/', getArticles);
router.post('/', createArticle);
router.get('/:articleId', validateArticleId, getArticleById);
router.put('/:articleId', validateArticleId, updateArticleById);
router.delete('/:articleId', validateArticleId, deleteArticleById);

module.exports = router;
