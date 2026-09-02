const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const accounts = require('../data/accounts');

function toSafeAccount(account) {
  return { id: account.id, email: account.email };
}

function register(req, res, next) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields: email and password' });
  }

  if (accounts.some((account) => account.email === email)) {
    return res.status(409).json({ message: `Email "${email}" is already registered` });
  }

  const account = {
    id: accounts.length ? Math.max(...accounts.map((a) => a.id)) + 1 : 1,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
  };
  accounts.push(account);

  req.login(account, (err) => {
    if (err) {
      return next(err);
    }

    res.status(201).json({ message: 'Registration successful', user: toSafeAccount(account) });
  });
}

function login(req, res, next) {
  passport.authenticate('local', (err, account, info) => {
    if (err) {
      return next(err);
    }

    if (!account) {
      return res.status(401).json({ message: (info && info.message) || 'Invalid email or password' });
    }

    req.login(account, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      res.json({ message: 'Login successful', user: toSafeAccount(account) });
    });
  })(req, res, next);
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.json({ message: 'Logout successful' });
  });
}

function getCurrentUser(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  res.json({ user: toSafeAccount(req.user) });
}

module.exports = { register, login, logout, getCurrentUser };
