// Seed data for the MongoDB "articles" collection (src/scripts/seedArticles.js).
// Several articles per author and publish dates spread across three years (2022-2024),
// so the /articles/stats/* aggregation and cursor routes have something meaningful to group over.
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
  {
    id: 4,
    title: 'Building REST APIs with Express Router',
    author: 'John Doe',
    publishedAt: '2022-05-10',
    content:
      'Express Router lets you group related route handlers into modular, mountable route files instead of defining every endpoint directly on the app instance. This keeps large APIs organized by resource and makes it easy to apply middleware to just one group of routes.',
  },
  {
    id: 5,
    title: 'Error Handling Patterns in Express Middleware',
    author: 'John Doe',
    publishedAt: '2023-07-14',
    content:
      'Centralizing error handling in a single Express middleware, registered after all routes, avoids duplicating try/catch blocks across every controller and makes sure every unexpected failure still returns a consistent JSON response.',
  },
  {
    id: 6,
    title: 'Securing Express Apps with Helmet and CORS',
    author: 'Jane Smith',
    publishedAt: '2022-08-02',
    content:
      'The helmet package sets a range of security-related HTTP headers with a single line of middleware, while cors controls which origins are allowed to call your API from the browser.',
  },
  {
    id: 7,
    title: 'Testing Express Routes with Supertest',
    author: 'Jane Smith',
    publishedAt: '2023-09-19',
    content:
      'Supertest wraps an Express app so HTTP requests can be sent directly to it in tests without binding to a real port, making route-level integration tests fast and easy to write alongside unit tests.',
  },
  {
    id: 8,
    title: 'Server-Side Rendering Strategies in Node.js',
    author: 'Mike Wilson',
    publishedAt: '2022-11-05',
    content:
      'Server-side rendering sends fully formed HTML to the browser on the first request, improving perceived load time and search engine indexing compared to shipping an empty page that renders everything on the client.',
  },
  {
    id: 9,
    title: 'Choosing Between PUG, EJS and Handlebars',
    author: 'Mike Wilson',
    publishedAt: '2023-12-01',
    content:
      'PUG favors terse, indentation-based syntax, EJS stays close to plain HTML with embedded JavaScript, and Handlebars enforces logic-less templates; the right choice usually comes down to how much your team wants templates to look like regular HTML.',
  },
  {
    id: 10,
    title: 'Introduction to MongoDB Atlas',
    author: 'Alice Johnson',
    publishedAt: '2022-03-15',
    content:
      'MongoDB Atlas is a fully managed cloud database service that handles provisioning, backups, scaling and patching, so teams can focus on modeling data instead of operating database servers themselves.',
  },
  {
    id: 11,
    title: 'Designing Schemas with Mongoose',
    author: 'Alice Johnson',
    publishedAt: '2022-12-20',
    content:
      'A Mongoose schema declares the shape, types and validation rules for documents in a collection up front, catching malformed data before it ever reaches MongoDB.',
  },
  {
    id: 12,
    title: 'Indexing Strategies for MongoDB Collections',
    author: 'Alice Johnson',
    publishedAt: '2023-05-08',
    content:
      "Without the right index, MongoDB has to scan every document in a collection to satisfy a query; a well-chosen index on the fields used for filtering and sorting can turn that full collection scan into a lookup that only touches the matching documents, which matters far more as a collection grows into the millions of documents.",
  },
  {
    id: 13,
    title: 'Connection Pooling and Performance in Mongoose',
    author: 'Alice Johnson',
    publishedAt: '2024-04-10',
    content:
      'Mongoose reuses a pool of open connections to MongoDB instead of opening a new one per request, which avoids the overhead of a fresh TCP and authentication handshake on every single database call.',
  },
  {
    id: 14,
    title: 'Aggregation Pipelines Explained',
    author: 'Robert Chen',
    publishedAt: '2023-01-22',
    content:
      'An aggregation pipeline processes documents through a sequence of stages such as $match, $group and $sort, transforming and reshaping data on the database server itself instead of pulling every document back to the application and reducing it there.',
  },
  {
    id: 15,
    title: 'Working with MongoDB Cursors in Node.js',
    author: 'Robert Chen',
    publishedAt: '2023-06-17',
    content:
      'Calling find() returns a cursor, not an array; the driver only fetches documents from the server in batches as you iterate the cursor, which keeps memory usage low even when a query matches millions of documents.',
  },
  {
    id: 16,
    title: 'Streaming Large Datasets from MongoDB',
    author: 'Robert Chen',
    publishedAt: '2023-10-30',
    content:
      'Piping a MongoDB cursor directly into an HTTP response lets a server start sending data to the client as soon as the first batch arrives from the database, instead of waiting to load an entire result set into memory before writing anything at all.',
  },
  {
    id: 17,
    title: 'Optimizing Queries with Indexes and Explain Plans',
    author: 'Robert Chen',
    publishedAt: '2024-05-02',
    content:
      "Running a query through explain() shows whether MongoDB used an index scan or fell back to a full collection scan, along with how many documents it examined versus how many it actually returned.",
  },
  {
    id: 18,
    title: 'Authentication with Passport.js',
    author: 'Priya Patel',
    publishedAt: '2022-06-25',
    content:
      "Passport separates authentication into pluggable strategies, so the same session and serialization logic keeps working whether users log in with a local email/password form, a Google account, or any other supported strategy.",
  },
  {
    id: 19,
    title: 'Managing Sessions with express-session',
    author: 'Priya Patel',
    publishedAt: '2023-03-11',
    content:
      'express-session stores a session identifier in a cookie and keeps the actual session data on the server, so sensitive state never has to round-trip to the client on every request.',
  },
  {
    id: 20,
    title: 'Role-Based Access Control in Express APIs',
    author: 'Priya Patel',
    publishedAt: '2024-05-15',
    content:
      "Checking a user's role in a middleware, before the request reaches the controller, keeps authorization rules in one place instead of scattering permission checks throughout business logic.",
  },
];

module.exports = articles;
