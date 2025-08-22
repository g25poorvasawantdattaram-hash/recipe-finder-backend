const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');
const protect = require('../middleware/auth');

// Register new user
router.post('/register', register);

// Login existing user
router.post('/login', login);

// Get current user (protected route)
router.get('/me', protect, me);

router.get('/me', auth, (req, res) => {res.json({ user: req.user });
});


module.exports = router;
