'use strict';

const http = require('http');
const { handleRequest } = require('./router');
const { sendHtml } = require('./response');
const { serverErrorPage } = require('./htmlTemplates');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  try {
    handleRequest(req, res);
  } catch (err) {
    console.error('Unhandled server error:', err);
    if (!res.headersSent) {
      sendHtml(res, 500, serverErrorPage());
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});

module.exports = server;
