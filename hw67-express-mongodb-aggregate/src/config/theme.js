const THEME_COOKIE_NAME = 'theme';
const VALID_THEMES = ['light', 'dark'];
const DEFAULT_THEME = 'light';
const THEME_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 1 year

module.exports = {
  THEME_COOKIE_NAME,
  VALID_THEMES,
  DEFAULT_THEME,
  THEME_COOKIE_MAX_AGE,
};
