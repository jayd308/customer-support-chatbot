const Chatbot = require('../models/Chatbot');

const getChatbots = async (req, res) => {
  try {
    const chatbots = await Chatbot.find({ businessId: req.user.businessId });
    res.json(chatbots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getChatbot = async (req, res) => {
  try {
    const chatbot = await Chatbot.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });
    if (!chatbot) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    res.json(chatbot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createChatbot = async (req, res) => {
  try {
    const chatbot = await Chatbot.create({
      ...req.body,
      businessId: req.user.businessId
    });
    res.status(201).json(chatbot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateChatbot = async (req, res) => {
  try {
    const chatbot = await Chatbot.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.businessId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!chatbot) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    res.json(chatbot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteChatbot = async (req, res) => {
  try {
    const chatbot = await Chatbot.findOneAndDelete({
      _id: req.params.id,
      businessId: req.user.businessId
    });
    if (!chatbot) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    res.json({ message: 'Chatbot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const trainChatbot = async (req, res) => {
  try {
    const chatbot = await Chatbot.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.businessId },
      {
        'training.status': 'training',
        'training.lastTrained': new Date()
      },
      { new: true }
    );
    
    // Here you would trigger actual AI training
    // For now, just simulate it
    setTimeout(async () => {
      await Chatbot.findByIdAndUpdate(req.params.id, {
        'training.status': 'completed'
      });
    }, 5000);
    
    res.json({ message: 'Training started', chatbot });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getChatbotSettings = async (req, res) => {
  try {
    const chatbot = await Chatbot.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });
    res.json(chatbot.settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateChatbotSettings = async (req, res) => {
  try {
    const chatbot = await Chatbot.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.businessId },
      { settings: req.body },
      { new: true }
    );
    res.json(chatbot.settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getChatbots,
  getChatbot,
  createChatbot,
  updateChatbot,
  deleteChatbot,
  trainChatbot,
  getChatbotSettings,
  updateChatbotSettings
};