const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const accounts = require('../data/accounts');
const { JWT_SECRET, JWT_EXPIRES_IN, TOKEN_COOKIE_NAME, TOKEN_COOKIE_MAX_AGE } = require('../config/jwt');

function issueToken(res, account) {
  const token = jwt.sign({ id: account.id, username: account.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: TOKEN_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });

  return token;
}

function register(req, res) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing required fields: username and password' });
  }

  if (accounts.some((account) => account.username === username)) {
    return res.status(409).json({ message: `Username "${username}" is already taken` });
  }

  const account = {
    id: accounts.length ? Math.max(...accounts.map((a) => a.id)) + 1 : 1,
    username,
    passwordHash: bcrypt.hashSync(password, 10),
  };
  accounts.push(account);

  const token = issueToken(res, account);
  res.status(201).json({
    message: 'Registration successful',
    user: { id: account.id, username: account.username },
    token,
  });
}

function login(req, res) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing required fields: username and password' });
  }

  const account = accounts.find((a) => a.username === username);

  if (!account || !bcrypt.compareSync(password, account.passwordHash)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = issueToken(res, account);
  res.json({
    message: 'Login successful',
    user: { id: account.id, username: account.username },
    token,
  });
}

function logout(req, res) {
  res.clearCookie(TOKEN_COOKIE_NAME);
  res.json({ message: 'Logout successful' });
}

function getCurrentUser(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, logout, getCurrentUser };
