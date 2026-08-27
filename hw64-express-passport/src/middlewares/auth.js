const jwt = require('jsonwebtoken');
const { JWT_SECRET, TOKEN_COOKIE_NAME } = require('../config/jwt');

function extractToken(req) {
  const cookieToken = req.cookies && req.cookies[TOKEN_COOKIE_NAME];

  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers['authorization'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length).trim();
  }

  return null;
}

function authenticate(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).send('Access denied. Invalid or expired token.');
  }
}

module.exports = authenticate;
