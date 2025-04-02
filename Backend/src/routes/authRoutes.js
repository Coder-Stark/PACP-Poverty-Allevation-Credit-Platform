const express = require('express');
const {signup, login} = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

module.exports = router;