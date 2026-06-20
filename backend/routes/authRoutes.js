const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validate');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), authUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;

