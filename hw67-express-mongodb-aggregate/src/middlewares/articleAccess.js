const WRITE_ROLES = ['admin', 'editor'];
const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

function checkArticleAccess(req, res, next) {
  const role = req.headers['x-role'] || 'guest';

  if (WRITE_METHODS.includes(req.method) && !WRITE_ROLES.includes(role)) {
    return res.status(403).send(`Access denied. Role "${role}" is not allowed to modify articles.`);
  }

  req.userRole = role;
  next();
}

function validateArticleId(req, res, next) {
  const { articleId } = req.params;

  if (!/^\d+$/.test(articleId)) {
    return res.status(400).send(`Invalid articleId: ${articleId}`);
  }

  next();
}

module.exports = { checkArticleAccess, validateArticleId };
