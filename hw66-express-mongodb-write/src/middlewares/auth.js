// Guards a route behind Passport's session-based login state. `req.isAuthenticated()`
// is added by passport.session() and returns true only when the session cookie
// maps to a still-valid, deserialized account (see src/config/passport.js).
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ message: 'Access denied. Please log in first.' });
}

module.exports = ensureAuthenticated;
