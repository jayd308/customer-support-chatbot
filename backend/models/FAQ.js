const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'pricing', 'hours', 'location', 'products', 'support', 'other'],
    default: 'general'
  },
  question: {
    en: { type: String, required: true },
    rw: { type: String }
  },
  answer: {
    en: { type: String, required: true },
    rw: { type: String }
  },
  keywords: [String],
  priority: {
    type: Number,
    default: 0,
    min: -10,
    max: 10
  },
  usageCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

faqSchema.index({ businessId: 1, category: 1 });
faqSchema.index({ 'question.en': 'text', 'question.rw': 'text', keywords: 'text' });

module.exports = mongoose.model('FAQ', faqSchema);