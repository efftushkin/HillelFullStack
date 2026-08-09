'use strict';

const querystring = require('querystring');
const { sendHtml } = require('./response');
const { escapeHtml } = require('./sanitize');
const {
  formSubmittedPage,
  badRequestPage,
  payloadTooLargePage,
  serverErrorPage,
} = require('./htmlTemplates');

const MAX_BODY_SIZE = 1024 * 1024; // 1 MB

// Handles POST /submit: reads the request body in chunks (rejecting anything
// over MAX_BODY_SIZE without buffering it), parses application/x-www-form-urlencoded
// data, validates required fields and responds with a sanitized confirmation page.
function handleSubmit(req, res) {
  let body = '';
  let bodySize = 0;
  let rejected = false;

  req.on('data', (chunk) => {
    if (rejected) {
      return;
    }

    bodySize += chunk.length;

    if (bodySize > MAX_BODY_SIZE) {
      rejected = true;
      sendHtml(res, 413, payloadTooLargePage());
      req.destroy();
      return;
    }

    body += chunk;
  });

  req.on('end', () => {
    if (rejected) {
      return;
    }

    try {
      const parsed = querystring.parse(body);
      const name = typeof parsed.name === 'string' ? parsed.name.trim() : '';
      const email = typeof parsed.email === 'string' ? parsed.email.trim() : '';

      if (!name || !email) {
        sendHtml(res, 400, badRequestPage('Invalid form data'));
        return;
      }

      sendHtml(res, 200, formSubmittedPage(escapeHtml(name), escapeHtml(email)));
    } catch (err) {
      console.error('Error parsing form data:', err);
      sendHtml(res, 500, serverErrorPage());
    }
  });

  req.on('error', (err) => {
    console.error('Request stream error:', err);
    if (!res.headersSent) {
      sendHtml(res, 500, serverErrorPage());
    }
  });
}

module.exports = { handleSubmit };
