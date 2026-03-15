const { body, param, query, validationResult } = require('express-validator');

// Validation rules
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Auth validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('businessName').notEmpty().withMessage('Business name is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Business validation rules
const updateBusinessValidation = [
  body('name').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone(),
  body('address').optional().trim(),
  body('website').optional().isURL(),
  body('industry').optional().trim(),
  body('description').optional().trim(),
  validate
];

const updateIntegrationsValidation = [
  body('whatsapp.enabled').optional().isBoolean(),
  body('whatsapp.phoneNumber').optional().isMobilePhone(),
  body('whatsapp.apiKey').optional().isString(),
  body('telegram.enabled').optional().isBoolean(),
  body('telegram.botToken').optional().isString(),
  body('telegram.botUsername').optional().isString(),
  body('website.enabled').optional().isBoolean(),
  body('website.widgetColor').optional().isHexColor(),
  body('website.widgetPosition').optional().isIn(['bottom-right', 'bottom-left', 'top-right', 'top-left']),
  validate
];

// Chatbot validation rules
const createChatbotValidation = [
  body('name').notEmpty().withMessage('Chatbot name is required'),
  body('settings.welcomeMessage.en').optional().isString(),
  body('settings.welcomeMessage.rw').optional().isString(),
  body('settings.fallbackMessage.en').optional().isString(),
  body('settings.fallbackMessage.rw').optional().isString(),
  body('settings.primaryColor').optional().isHexColor(),
  body('settings.secondaryColor').optional().isHexColor(),
  body('settings.aiModel').optional().isIn(['gpt-3.5-turbo', 'gpt-4']),
  body('settings.temperature').optional().isFloat({ min: 0, max: 2 }),
  body('settings.maxTokens').optional().isInt({ min: 50, max: 500 }),
  validate
];

const updateChatbotValidation = [
  param('id').isMongoId().withMessage('Invalid chatbot ID'),
  body('name').optional().trim(),
  body('settings').optional().isObject(),
  body('isActive').optional().isBoolean(),
  validate
];

// FAQ validation rules
const createFAQValidation = [
  body('category').isIn(['general', 'pricing', 'hours', 'location', 'products', 'support', 'other']),
  body('question.en').notEmpty().withMessage('English question is required'),
  body('answer.en').notEmpty().withMessage('English answer is required'),
  body('question.rw').optional(),
  body('answer.rw').optional(),
  body('keywords').optional().isArray(),
  body('priority').optional().isInt({ min: -10, max: 10 }),
  validate
];

const updateFAQValidation = [
  param('id').isMongoId().withMessage('Invalid FAQ ID'),
  body('category').optional().isIn(['general', 'pricing', 'hours', 'location', 'products', 'support', 'other']),
  body('question.en').optional(),
  body('answer.en').optional(),
  body('question.rw').optional(),
  body('answer.rw').optional(),
  body('keywords').optional().isArray(),
  body('priority').optional().isInt({ min: -10, max: 10 }),
  body('isActive').optional().isBoolean(),
  validate
];

const bulkImportFAQsValidation = [
  body('faqs').isArray().withMessage('FAQs must be an array'),
  body('faqs.*.category').isIn(['general', 'pricing', 'hours', 'location', 'products', 'support', 'other']),
  body('faqs.*.question.en').notEmpty(),
  body('faqs.*.answer.en').notEmpty(),
  validate
];

// ID validation
const validateId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate
];

// Query validation
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sort').optional().isString(),
  validate
];

const dateRangeValidation = [
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  validate
];

const searchValidation = [
  query('q').notEmpty().withMessage('Search query is required'),
  query('language').optional().isIn(['en', 'rw']),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  updateBusinessValidation,
  updateIntegrationsValidation,
  createChatbotValidation,
  updateChatbotValidation,
  createFAQValidation,
  updateFAQValidation,
  bulkImportFAQsValidation,
  validateId,
  paginationValidation,
  dateRangeValidation,
  searchValidation,
  validate
};