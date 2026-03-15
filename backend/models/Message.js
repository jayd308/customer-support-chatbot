const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: String,
    enum: ['customer', 'bot', 'agent'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['en', 'rw'],
    default: 'en'
  },
  intent: {
    type: String,
    enum: ['greeting', 'question', 'complaint', 'purchase', 'support', 'other']
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  metadata: {
    faqMatched: String,
    aiResponse: Boolean,
    responseTime: Number
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

messageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);