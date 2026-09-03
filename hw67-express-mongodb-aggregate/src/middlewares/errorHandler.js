function notFoundHandler(req, res, next) {
  res.status(404).send(`Route not found: ${req.method} ${req.originalUrl}`);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(`${new Date().toISOString()} - Error on ${req.method} ${req.originalUrl}: ${err.message}`);

  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).send('Invalid JSON payload in request body.');
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid data: ${err.message}` });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate key error.', detail: err.message });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).send(`Internal server error: ${err.message}`);
}

module.exports = { notFoundHandler, errorHandler };
