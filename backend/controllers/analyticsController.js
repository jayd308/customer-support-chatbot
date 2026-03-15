const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const getOverview = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const totalConversations = await Conversation.countDocuments({
      businessId,
      ...dateFilter
    });
    
    const totalMessages = await Message.countDocuments({
      conversationId: { $in: await Conversation.find({ businessId }).distinct('_id') },
      ...dateFilter
    });
    
    const botMessages = await Message.countDocuments({
      conversationId: { $in: await Conversation.find({ businessId }).distinct('_id') },
      sender: 'bot',
      ...dateFilter
    });
    
    const resolvedConversations = await Conversation.countDocuments({
      businessId,
      status: 'resolved',
      ...dateFilter
    });
    
    res.json({
      totalConversations,
      totalMessages,
      botMessages,
      resolvedConversations,
      botResponseRate: totalMessages > 0 ? (botMessages / totalMessages * 100).toFixed(2) : 0,
      resolutionRate: totalConversations > 0 ? (resolvedConversations / totalConversations * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      businessId: req.user.businessId
    })
    .sort({ lastMessageAt: -1 })
    .limit(100);
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.query;
    
    const messages = await Message.find({
      conversationId
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPerformance = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    
    // Group messages by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const performance = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversationId',
          foreignField: '_id',
          as: 'conversation'
        }
      },
      {
        $match: {
          'conversation.businessId': businessId
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            sender: '$sender'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCustomerSatisfaction = async (req, res) => {
  try {
    // This would typically come from ratings/feedback
    // For now, return mock data
    res.json({
      average: 4.5,
      total: 150,
      distribution: {
        5: 80,
        4: 40,
        3: 20,
        2: 8,
        1: 2
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getExportData = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    const { format } = req.query;
    
    const conversations = await Conversation.find({ businessId })
      .populate('messages')
      .lean();
    
    if (format === 'csv') {
      // Convert to CSV
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
      // Send CSV data
    } else {
      res.json(conversations);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getOverview,
  getConversations,
  getMessages,
  getPerformance,
  getCustomerSatisfaction,
  getExportData
};