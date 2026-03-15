const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getBusiness,
  updateBusiness,
  getIntegrations,
  updateIntegrations,
  getSubscription,
  updateSubscription,
  getSettings,
  updateSettings,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMemberRole,
  getBillingInfo,
  updateBillingInfo,
  getUsageStats
} = require('../controllers/businessController');

// All routes require authentication
router.use(protect);

// Business profile routes
router.get('/', getBusiness);
router.put('/', updateBusiness);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Integration routes
router.get('/integrations', getIntegrations);
router.put('/integrations', updateIntegrations);

// Subscription routes
router.get('/subscription', getSubscription);
router.put('/subscription', updateSubscription);
router.get('/usage', getUsageStats);

// Team management routes
router.get('/team', getTeamMembers);
router.post('/team', addTeamMember);
router.delete('/team/:userId', removeTeamMember);
router.put('/team/:userId/role', updateTeamMemberRole);

// Billing routes
router.get('/billing', getBillingInfo);
router.put('/billing', updateBillingInfo);

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Business routes are working',
    user: req.user,
    timestamp: new Date()
  });
});

module.exports = router;