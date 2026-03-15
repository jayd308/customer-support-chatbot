const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getFAQs,
  getFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  bulkImportFAQs,
  getFAQsByCategory,
  searchFAQs
} = require('../controllers/faqController');

// All routes require authentication
router.use(protect);

// FAQ routes
router.get('/', getFAQs);
router.get('/search', searchFAQs);
router.get('/category/:category', getFAQsByCategory);
router.get('/:id', getFAQ);
router.post('/', createFAQ);
router.post('/bulk-import', bulkImportFAQs);
router.put('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'FAQ routes are working',
    user: req.user,
    timestamp: new Date()
  });
});

module.exports = router;