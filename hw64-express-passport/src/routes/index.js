const express = require('express');
const rootRoutes = require('./rootRoutes');
const usersRoutes = require('./usersRoutes');
const articlesRoutes = require('./articlesRoutes');
const authRoutes = require('./authRoutes');
const themeRoutes = require('./themeRoutes');
const protectedRoutes = require('./protectedRoutes');

const router = express.Router();

router.use('/', rootRoutes);
router.use('/users', usersRoutes);
router.use('/articles', articlesRoutes);
router.use('/auth', authRoutes);
router.use('/theme', themeRoutes);
router.use('/protected', protectedRoutes);

module.exports = router;
