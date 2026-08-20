const express = require('express');
const rootRoutes = require('./rootRoutes');
const usersRoutes = require('./usersRoutes');
const articlesRoutes = require('./articlesRoutes');

const router = express.Router();

router.use('/', rootRoutes);
router.use('/users', usersRoutes);
router.use('/articles', articlesRoutes);

module.exports = router;
