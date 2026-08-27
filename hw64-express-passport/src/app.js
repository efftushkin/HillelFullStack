const path = require('path');
const express = require('express');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const { SESSION_SECRET, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } = require('./config/session');
const routes = require('./routes');
const requestLogger = require('./middlewares/logger');
const themeLoader = require('./middlewares/theme');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// PUG is the default view engine (used by /users routes); EJS is registered
// separately and selected explicitly via the .ejs extension (used by /articles routes).
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.engine('ejs', ejs.renderFile);

app.use(requestLogger);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: SESSION_COOKIE_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // Only sent over HTTPS in production - the app runs over plain HTTP in
      // local development, where a `secure` cookie would never reach the server.
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_COOKIE_MAX_AGE,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Serves static assets from src/public, including /favicon.ico requested by every page.
app.use(express.static(path.join(__dirname, 'public')));
app.use(themeLoader);

app.use('/', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
