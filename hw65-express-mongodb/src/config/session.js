const SESSION_SECRET = process.env.SESSION_SECRET || 'hw64-dev-session-secret';
const SESSION_COOKIE_NAME = 'sid';
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 1000; // 1 hour

module.exports = {
  SESSION_SECRET,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
};
