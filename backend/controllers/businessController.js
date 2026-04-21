const Business = require('../models/Business');
const User = require('../models/User');

// emmanuel
const getBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update business profile
const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.user.businessId,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get integrations
const getIntegrations = async (req, res) => {
  try {
    const business = await Business.findById(req.user.businessId);
    res.json(business.integrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update integrations
const updateIntegrations = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.user.businessId,
      { integrations: req.body },
      { new: true }
    );
    res.json(business.integrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get subscription
const getSubscription = async (req, res) => {
  try {
    const business = await Business.findById(req.user.businessId);
    res.json(business.subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update subscription
const updateSubscription = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.user.businessId,
      { subscription: req.body },
      { new: true }
    );
    res.json(business.subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get settings
const getSettings = async (req, res) => {
  try {
    const business = await Business.findById(req.user.businessId);
    res.json(business.settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.user.businessId,
      { settings: req.body },
      { new: true }
    );
    res.json(business.settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get team members
const getTeamMembers = async (req, res) => {
  try {
    const team = await User.find({ 
      businessId: req.user.businessId 
    }).select('-password');
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add team member
const addTeamMember = async (req, res) => {
  try {
    const { email, name, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create temporary password (should send email invitation)
    const tempPassword = Math.random().toString(36).slice(-8);
    
    const user = await User.create({
      name,
      email,
      password: tempPassword,
      role: role || 'business',
      businessId: req.user.businessId
    });
    
    // TODO: Send invitation email
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove team member
const removeTeamMember = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update team member role
const updateTeamMemberRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get billing info
const getBillingInfo = async (req, res) => {
  try {
    const business = await Business.findById(req.user.businessId);
    // This would typically come from a payment provider
    res.json({
      paymentMethod: 'credit_card',
      lastFour: '4242',
      expiryDate: '12/25',
      billingEmail: business.email,
      invoices: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update billing info
const updateBillingInfo = async (req, res) => {
  try {
    // This would integrate with a payment provider
    res.json({ message: 'Billing info updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get usage statistics
const getUsageStats = async (req, res) => {
  try {
    // This would calculate actual usage statistics
    res.json({
      conversationsThisMonth: 150,
      messagesThisMonth: 1250,
      aiTokensUsed: 50000,
      storageUsed: 250, // MB
      apiCalls: 3500
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export all functions
module.exports = {
  getBusiness,
  updateBusiness,
  getIntegrations,
  updateIntegrations,
  getSubscription,
  updateSubscription,
  getSettings,
  updateSettings,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMemberRole,
  getBillingInfo,
  updateBillingInfo,
  getUsageStats
};
