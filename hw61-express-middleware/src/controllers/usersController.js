const getUsers = (req, res) => {
  res.send('Get users route');
};

const createUser = (req, res) => {
  res.send('Post users route');
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  res.send(`Get user by Id route: ${userId}`);
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
