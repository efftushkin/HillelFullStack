const users = require('../data/users');

const getUsers = (req, res) => {
  res.render('users/list', { title: 'Users', users });
};

const createUser = (req, res) => {
  res.send('Post users route');
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  const user = users.find((u) => u.id === Number(userId));

  if (!user) {
    return res.status(404).render('users/not-found', { title: 'User not found', userId });
  }

  res.render('users/details', { title: `User #${user.id}`, user });
};

const updateUserById = (req, res) => {
  const { userId } = req.params;
  res.send(`Put user by Id route: ${userId}`);
};

const deleteUserById = (req, res) => {
  const { userId } = req.params;
  res.send(`Delete user by Id route: ${userId}`);
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
