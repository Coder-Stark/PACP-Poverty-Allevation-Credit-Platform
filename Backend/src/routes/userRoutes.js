const express = require('express');
const {getUserData, getAllUsers} = require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../middleware/authMiddlware');

const router = express.Router();

router.get('/me', authMiddleware, getUserData);

router.get('/all', authMiddleware, isAdmin, getAllUsers);      //only for admins

module.exports = router;
