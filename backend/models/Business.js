const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  address: String,
  website: String,
  industry: String,
  description: String,
  logo: String,
  settings: {
    languages: {
      type: [String],
      default: ['en', 'rw']
    },
    workingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    timezone: {
      type: String,
      default: 'Africa/Kigali'
    }
  },
  integrations: {
    whatsapp: {
      enabled: { type: Boolean, default: false },
      phoneNumber: String,
      apiKey: String
    },
    telegram: {
      enabled: { type: Boolean, default: false },
      botToken: String,
      botUsername: String
    },
    website: {
      enabled: { type: Boolean, default: true },
      widgetColor: { type: String, default: '#2563eb' },
      widgetPosition: { type: String, default: 'bottom-right' }
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'past_due'],
      default: 'active'
    },
    expiresAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Business', businessSchema);