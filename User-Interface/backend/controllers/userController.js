// src/controllers/userController.js
const User = require('../models/userModel');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.user.firebaseId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// Create or update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, userType, age } = req.body;
    
    // Find user by Firebase ID or create new user
    let user = await User.findOne({ firebaseId: req.user.firebaseId });
    
    if (!user) {
      // Create new user
      user = new User({
        firebaseId: req.user.firebaseId,
        email: req.user.email,
        fullName,
        phoneNumber,
        userType,
        age,
        profileCreated: true
      });
    } else {
      // Update existing user
      user.fullName = fullName || user.fullName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.userType = userType || user.userType;
      user.age = age || user.age;
      user.profileCreated = true;
      user.updatedAt = Date.now();
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
};