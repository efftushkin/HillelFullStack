const Article = require('../models/Article');

const getArticles = async (req, res) => {
  const articles = await Article.find().sort({ id: 1 });
  res.render('articles/list.ejs', { title: 'Articles', articles });
};

const createArticle = (req, res) => {
  res.send('Post articles route');
};

const getArticleById = async (req, res) => {
  const { articleId } = req.params;
  const article = await Article.findOne({ id: Number(articleId) });

  if (!article) {
    return res.status(404).render('articles/not-found.ejs', { title: 'Article not found', articleId });
  }

  res.render('articles/details.ejs', { title: article.title, article });
};

const updateArticleById = (req, res) => {
  const { articleId } = req.params;
  res.send(`Put article by Id route: ${articleId}`);
};

const deleteArticleById = (req, res) => {
  const { articleId } = req.params;
  res.send(`Delete article by Id route: ${articleId}`);
};

module.exports = {
  getArticles,
  createArticle,
  getArticleById,
  updateArticleById,
  deleteArticleById,
};
