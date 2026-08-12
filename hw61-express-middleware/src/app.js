const express = require('express');
const routes = require('./routes');
const requestLogger = require('./middlewares/logger');
const sessionManager = require('./middlewares/session');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(requestLogger);
app.use(sessionManager);
app.use(express.json());

app.use('/', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
