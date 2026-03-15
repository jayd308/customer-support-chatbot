const FAQ = require('../models/FAQ');

const getFAQs = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { page = 1, limit = 10, category } = req.query;
    
    const query = { businessId, isActive: true };
    if (category) {
      query.category = category;
    }
    
    const faqs = await FAQ.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await FAQ.countDocuments(query);
    
    res.json({
      faqs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.user;
    
    const faq = await FAQ.findOne({ _id: id, businessId });
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createFAQ = async (req, res) => {
  try {
    const { businessId } = req.user;
    
    // Check if similar FAQ exists
    const existingFAQ = await FAQ.findOne({
      businessId,
      'question.en': req.body.question.en
    });
    
    if (existingFAQ) {
      return res.status(400).json({ message: 'FAQ with this question already exists' });
    }
    
    const faq = await FAQ.create({
      ...req.body,
      businessId
    });
    
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.user;
    
    const faq = await FAQ.findOneAndUpdate(
      { _id: id, businessId },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.user;
    
    const faq = await FAQ.findOneAndDelete({ _id: id, businessId });
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const bulkImportFAQs = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { faqs } = req.body;
    
    // Validate FAQs
    const validFAQs = faqs.filter(faq => 
      faq.question?.en && faq.answer?.en
    );
    
    const faqsWithBusiness = validFAQs.map(faq => ({
      ...faq,
      businessId,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    const created = await FAQ.insertMany(faqsWithBusiness);
    
    res.status(201).json({
      message: `Successfully imported ${created.length} FAQs`,
      imported: created.length,
      failed: faqs.length - created.length,
      faqs: created
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFAQsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { businessId } = req.user;
    
    const faqs = await FAQ.find({ 
      businessId, 
      category,
      isActive: true 
    }).sort({ priority: -1 });
    
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchFAQs = async (req, res) => {
  try {
    const { q, language = 'en' } = req.query;
    const { businessId } = req.user;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const faqs = await FAQ.find({
      businessId,
      isActive: true,
      $or: [
        { [`question.${language}`]: { $regex: q, $options: 'i' } },
        { [`answer.${language}`]: { $regex: q, $options: 'i' } },
        { keywords: { $in: [new RegExp(q, 'i')] } }
      ]
    }).sort({ priority: -1, usageCount: -1 });
    
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getFAQs,
  getFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  bulkImportFAQs,
  getFAQsByCategory,
  searchFAQs
};