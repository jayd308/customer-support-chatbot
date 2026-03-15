const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  chatbotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatbot',
    required: true
  },
  customerId: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    enum: ['whatsapp', 'telegram', 'website', 'api'],
    required: true
  },
  language: {
    type: String,
    enum: ['en', 'rw'],
    default: 'en'
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated', 'closed'],
    default: 'active'
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    location: String,
    page: String
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

conversationSchema.index({ businessId: 1, lastMessageAt: -1 });
conversationSchema.index({ customerId: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);