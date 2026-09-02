function getProtected(req, res) {
  res.json({
    message: 'You have access to the protected route',
    user: { id: req.user.id, email: req.user.email },
  });
}

module.exports = { getProtected };
