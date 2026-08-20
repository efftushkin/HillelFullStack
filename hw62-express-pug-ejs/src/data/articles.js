const articles = [
  {
    id: 1,
    title: 'Getting Started with Express.js',
    author: 'John Doe',
    publishedAt: '2024-01-20',
    content:
      'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
  },
  {
    id: 2,
    title: 'Understanding Middleware in Express',
    author: 'Jane Smith',
    publishedAt: '2024-02-18',
    content:
      'Middleware functions are functions that have access to the request object, the response object, and the next middleware function in the application request-response cycle.',
  },
  {
    id: 3,
    title: 'Templating with PUG and EJS',
    author: 'Mike Wilson',
    publishedAt: '2024-03-22',
    content:
      'Template engines allow you to use static template files in your application. At runtime, the template engine replaces variables in a template file with actual values.',
  },
];

module.exports = articles;
