'use strict';

// Wraps page content in the minimal HTML document structure required by the task.
function pageTemplate(title, heading, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
</head>
<body>
<h1>${heading}</h1>
${bodyHtml}
</body>
</html>`;
}

function getHomePage() {
  return pageTemplate('Home', 'Home', '<p>Welcome to the Home Page</p>');
}

function getAboutPage() {
  return pageTemplate('About', 'About', '<p>Learn more about us</p>');
}

function getContactPage() {
  return pageTemplate('Contact', 'Contact', '<p>Get in touch</p>');
}

function notFoundPage() {
  return pageTemplate('404 Not Found', 'Page Not Found', '<p>Page Not Found</p>');
}

function badRequestPage(message) {
  return pageTemplate('400 Bad Request', 'Bad Request', `<p>${message}</p>`);
}

function payloadTooLargePage() {
  return pageTemplate(
    '413 Payload Too Large',
    'Payload Too Large',
    '<p>The request body exceeds the maximum allowed size of 1 MB.</p>'
  );
}

function serverErrorPage() {
  return pageTemplate('500 Server Error', 'Server Error', '<p>Server Error</p>');
}

function formSubmittedPage(name, email) {
  return pageTemplate(
    'Form Submitted',
    'Form Submitted',
    `<p>Name: ${name}</p>\n<p>Email: ${email}</p>`
  );
}

module.exports = {
  getHomePage,
  getAboutPage,
  getContactPage,
  notFoundPage,
  badRequestPage,
  payloadTooLargePage,
  serverErrorPage,
  formSubmittedPage,
};
