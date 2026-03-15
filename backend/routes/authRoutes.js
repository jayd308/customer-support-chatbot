const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Auth routes are working',
    timestamp: new Date()
  });
});

module.exports = router;