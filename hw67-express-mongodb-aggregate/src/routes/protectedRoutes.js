const express = require('express');
const ensureAuthenticated = require('../middlewares/auth');
const { getProtected } = require('../controllers/protectedController');

const router = express.Router();

router.get('/', ensureAuthenticated, getProtected);

module.exports = router;
