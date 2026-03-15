const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getOverview,
  getConversations,
  getMessages,
  getPerformance,
  getCustomerSatisfaction,
  getExportData
} = require('../controllers/analyticsController');

// All routes require authentication
router.use(protect);

// Analytics routes
router.get('/overview', getOverview);
router.get('/conversations', getConversations);
router.get('/messages', getMessages);
router.get('/performance', getPerformance);
router.get('/satisfaction', getCustomerSatisfaction);
router.get('/export', getExportData);

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Analytics routes are working',
    user: req.user,
    timestamp: new Date()
  });
});

module.exports = router;