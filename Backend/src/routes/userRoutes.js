const express = require('express');
const {getUserData, getAllUsers, getAllAdmins} = require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../middleware/authMiddlware');

const router = express.Router();

router.get('/me', authMiddleware, getUserData);

router.get('/allusers', authMiddleware, isAdmin, getAllUsers);      //only for admins

router.get('/alladmins', authMiddleware, isAdmin, getAllAdmins);      //only for admins

module.exports = router;
