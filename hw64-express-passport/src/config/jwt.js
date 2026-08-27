const JWT_SECRET = process.env.JWT_SECRET || 'hw63-dev-secret-key';
const JWT_EXPIRES_IN = '1h';
const TOKEN_COOKIE_NAME = 'token';
const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 1000; // 1 hour, matches JWT_EXPIRES_IN

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  TOKEN_COOKIE_NAME,
  TOKEN_COOKIE_MAX_AGE,
};
