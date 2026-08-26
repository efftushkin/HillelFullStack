function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Access denied. No or invalid credentials sent.');
  }

  const token = authHeader.slice('Bearer '.length).trim();

  if (!token) {
    return res.status(401).send('Access denied. No or invalid credentials sent.');
  }

  req.user = { token };
  next();
}

module.exports = authenticate;
