const path = require('path');
const express = require('express');
const ejs = require('ejs');
const routes = require('./routes');
const requestLogger = require('./middlewares/logger');
const sessionManager = require('./middlewares/session');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// PUG is the default view engine (used by /users routes); EJS is registered
// separately and selected explicitly via the .ejs extension (used by /articles routes).
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.engine('ejs', ejs.renderFile);

app.use(requestLogger);
app.use(sessionManager);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
