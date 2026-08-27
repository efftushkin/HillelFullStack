const bcrypt = require('bcryptjs');

// In-memory store of registered accounts (separate from the sample `users` data
// used by the /users pages). Seeded with one demo account so /auth/login can be
// tried immediately, without registering first.
const accounts = [
  {
    id: 1,
    email: 'demo@example.com',
    passwordHash: bcrypt.hashSync('demo1234', 10),
  },
];

module.exports = accounts;
