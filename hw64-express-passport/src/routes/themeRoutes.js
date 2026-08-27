const express = require('express');
const { setTheme } = require('../controllers/themeController');

const router = express.Router();

router.post('/', setTheme);

module.exports = router;
