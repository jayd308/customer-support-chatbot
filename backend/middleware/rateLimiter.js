const rateLimit = require('express-rate-limit');

// Make rate limits higher for development
const isDevelopment = process.env.NODE_ENV === 'development';

const limiter = rateLimit({
  windowMs: isDevelopment ? 60 * 1000 : 15 * 60 * 1000, // 1 minute in dev, 15 min in prod
  max: isDevelopment ? 100 : 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later'
});

const authLimiter = rateLimit({
  windowMs: isDevelopment ? 60 * 1000 : 60 * 60 * 1000, // 1 minute in dev, 1 hour in prod
  max: isDevelopment ? 50 : 10, // 50 attempts per minute in dev
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again later'
});

const apiLimiter = rateLimit({
  windowMs: isDevelopment ? 60 * 1000 : 60 * 1000, // 1 minute
  max: isDevelopment ? 200 : 60, // 200 requests per minute in dev
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many API requests, please try again later'
});

module.exports = { limiter, authLimiter, apiLimiter };