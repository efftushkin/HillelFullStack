function validateUserInput(req, res, next) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).send('Missing required fields: username and password');
  }

  next();
}

function validateUserId(req, res, next) {
  const { userId } = req.params;

  if (!/^\d+$/.test(userId)) {
    return res.status(400).send(`Invalid userId: ${userId}`);
  }

  next();
}

module.exports = { validateUserInput, validateUserId };
