const express = require('express');
const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Test route working!',
    timestamp: new Date()
  });
});

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Echo route for testing POST requests
router.post('/echo', (req, res) => {
  res.json({
    success: true,
    message: 'Echo endpoint',
    data: req.body,
    timestamp: new Date()
  });
});

// Error test route
router.get('/error', (req, res, next) => {
  try {
    throw new Error('Test error');
  } catch (error) {
    next(error);
  }
});

// MongoDB connection test
router.get('/db-status', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    res.json({
      success: true,
      mongodb: {
        connected: mongoose.connection.readyState === 1,
        state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;