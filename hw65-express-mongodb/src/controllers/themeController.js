const { THEME_COOKIE_NAME, VALID_THEMES, THEME_COOKIE_MAX_AGE } = require('../config/theme');

function setTheme(req, res) {
  const { theme } = req.body || {};

  if (!VALID_THEMES.includes(theme)) {
    return res.status(400).send(`Invalid theme: ${theme}. Valid values: ${VALID_THEMES.join(', ')}`);
  }

  res.cookie(THEME_COOKIE_NAME, theme, { maxAge: THEME_COOKIE_MAX_AGE, sameSite: 'lax' });

  const redirectTo = req.get('Referer') || '/';
  res.redirect(redirectTo);
}

module.exports = { setTheme };
