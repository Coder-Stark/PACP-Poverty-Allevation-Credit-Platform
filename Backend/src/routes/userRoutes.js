const express = require('express');
const {getUserData, getAllUsers} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getUserData);
router.get('/all', authMiddleware, getAllUsers);      //only for admins

module.exports = router;
