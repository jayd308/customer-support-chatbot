const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getChatbots,
  getChatbot,
  createChatbot,
  updateChatbot,
  deleteChatbot,
  trainChatbot,
  getChatbotSettings,
  updateChatbotSettings
} = require('../controllers/chatbotController');

// All routes require authentication
router.use(protect);

// Chatbot routes
router.get('/', getChatbots);
router.post('/', createChatbot);
router.get('/:id', getChatbot);
router.put('/:id', updateChatbot);
router.delete('/:id', deleteChatbot);
router.post('/:id/train', trainChatbot);
router.get('/:id/settings', getChatbotSettings);
router.put('/:id/settings', updateChatbotSettings);

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Chatbot routes are working',
    user: req.user,
    timestamp: new Date()
  });
});

module.exports = router;