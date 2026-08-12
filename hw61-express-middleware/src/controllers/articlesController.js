const getArticles = (req, res) => {
  res.send('Get articles route');
};

const createArticle = (req, res) => {
  res.send('Post articles route');
};

const getArticleById = (req, res) => {
  const { articleId } = req.params;
  res.send(`Get article by Id route: ${articleId}`);
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
