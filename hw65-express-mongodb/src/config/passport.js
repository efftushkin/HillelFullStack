const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcryptjs');
const accounts = require('../data/accounts');

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
    const account = accounts.find((a) => a.email === email);

    if (!account || !bcrypt.compareSync(password, account.passwordHash)) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    return done(null, account);
  })
);

// Only the account id is stored in the session; the full account is looked up
// again on every request by deserializeUser, keeping the session payload small.
passport.serializeUser((account, done) => {
  done(null, account.id);
});

passport.deserializeUser((id, done) => {
  const account = accounts.find((a) => a.id === id);
  done(null, account || false);
});

module.exports = passport;
