const express = require('express');
const ensureAuthenticated = require('../middlewares/auth');
const { register, login, logout, getCurrentUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', ensureAuthenticated, getCurrentUser);

module.exports = router;
