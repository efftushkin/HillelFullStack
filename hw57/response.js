'use strict';

// Sends an HTML response with the required Content-Type, Content-Length and
// security headers set correctly for the given status code.
function sendHtml(res, statusCode, html) {
  const body = Buffer.from(html, 'utf-8');

  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': body.length,
    'X-Content-Type-Options': 'nosniff',
  });

  res.end(body);
}

module.exports = { sendHtml };
