const { THEME_COOKIE_NAME, VALID_THEMES, DEFAULT_THEME } = require('../config/theme');

// Reads the saved theme cookie (if any) and exposes it as `theme` to every
// view via res.locals, so templates can render without each controller
// having to pass it explicitly.
function themeLoader(req, res, next) {
  const cookieTheme = req.cookies && req.cookies[THEME_COOKIE_NAME];
  res.locals.theme = VALID_THEMES.includes(cookieTheme) ? cookieTheme : DEFAULT_THEME;
  next();
}

module.exports = themeLoader;
