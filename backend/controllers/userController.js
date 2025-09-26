const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's active properties count
    const activePropertiesCount = await Property.countDocuments({
      agent: req.params.id,
      status: 'active'
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          activeProperties: activePropertiesCount,
          totalProperties: await Property.countDocuments({ agent: req.params.id })
        }
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile'
    });
  }
};

// @desc    Get user's properties
// @route   GET /api/users/:id/properties
// @access  Public
exports.getUserProperties = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const properties = await Property.find({ 
      agent: req.params.id,
      status: 'active'
    })
      .populate('agent', 'fullName email phone company')
      .sort({ dateAdded: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments({ 
      agent: req.params.id,
      status: 'active'
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      data: properties
    });
  } catch (error) {
    console.error('Get user properties error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user properties'
    });
  }
};

// @desc    Update user profile (admin only)
// @route   PUT /api/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating user'
    });
  }
};

// @desc    Get all agents
// @route   GET /api/users/agents
// @access  Public
exports.getAgents = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const agents = await User.find({ userType: 'agent', isActive: true })
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ userType: 'agent', isActive: true });

    // Get properties count for each agent
    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
        const propertiesCount = await Property.countDocuments({
          agent: agent._id,
          status: 'active'
        });
        
        return {
          ...agent.toObject(),
          activeProperties: propertiesCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: agents.length,
      total,
      data: agentsWithStats
    });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching agents'
    });
  }
};