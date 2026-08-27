const express = require('express');
const ensureAuthenticated = require('../middlewares/auth');
const { validateUserInput, validateUserId } = require('../middlewares/validateUser');
const {
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/usersController');

const router = express.Router();

router.use(ensureAuthenticated);

router.get('/', getUsers);
router.post('/', validateUserInput, createUser);
router.get('/:userId', validateUserId, getUserById);
router.put('/:userId', validateUserId, validateUserInput, updateUserById);
router.delete('/:userId', validateUserId, deleteUserById);

module.exports = router;
