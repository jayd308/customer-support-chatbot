const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  settings: {
    welcomeMessage: {
      en: { type: String, default: 'Hello! How can I help you today?' },
      rw: { type: String, default: 'Muraho! Nigute nabafasha?' }
    },
    fallbackMessage: {
      en: { type: String, default: "I'm sorry, I didn't understand that. Could you please rephrase?" },
      rw: { type: String, default: 'Mbabarira, ntabwo nasobanukiwe. Nyamuneka subiramo ukundi?' }
    },
    primaryColor: { type: String, default: '#2563eb' },
    secondaryColor: { type: String, default: '#1e40af' },
    fontFamily: { type: String, default: 'Inter' },
    position: { type: String, default: 'bottom-right' },
    aiModel: { type: String, default: 'gpt-3.5-turbo' },
    temperature: { type: Number, default: 0.7 },
    maxTokens: { type: Number, default: 150 }
  },
  training: {
    lastTrained: Date,
    status: {
      type: String,
      enum: ['pending', 'training', 'completed', 'failed'],
      default: 'pending'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chatbot', chatbotSchema);