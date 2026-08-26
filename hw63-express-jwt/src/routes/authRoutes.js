const express = require('express');
const authenticate = require('../middlewares/auth');
const { register, login, logout, getCurrentUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
