'use strict';

const url = require('url');
const { sendHtml } = require('./response');
const { handleSubmit } = require('./submitHandler');
const {
  getHomePage,
  getAboutPage,
  getContactPage,
  notFoundPage,
  serverErrorPage,
} = require('./htmlTemplates');

// Statically generated pages served for GET requests, keyed by pathname.
const GET_ROUTES = {
  '/': getHomePage,
  '/about': getAboutPage,
  '/contact': getContactPage,
};

// Dispatches an incoming request to the matching route handler.
// Any synchronous error that escapes a handler is turned into a 500 response
// here, so a single bug can't crash the whole server.
function handleRequest(req, res) {
  const { pathname } = url.parse(req.url, true);

  try {
    if (req.method === 'GET') {
      const renderPage = GET_ROUTES[pathname];

      if (renderPage) {
        sendHtml(res, 200, renderPage());
      } else {
        sendHtml(res, 404, notFoundPage());
      }
      return;
    }

    if (req.method === 'POST' && pathname === '/submit') {
      handleSubmit(req, res);
      return;
    }

    sendHtml(res, 404, notFoundPage());
  } catch (err) {
    console.error('Request handling error:', err);
    if (!res.headersSent) {
      sendHtml(res, 500, serverErrorPage());
    }
  }
}

module.exports = { handleRequest };
