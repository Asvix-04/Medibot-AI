// src/controllers/healthController.js
const HealthProfile = require('../models/healthProfileModel');
const User = require('../models/userModel');

// Get health profile
exports.getHealthProfile = async (req, res) => {
  try {
    const healthProfile = await HealthProfile.findOne({ userId: req.user.firebaseId });
    
    if (!healthProfile) {
      return res.status(404).json({
        success: false,
        message: 'Health profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: healthProfile
    });
    
  } catch (error) {
    console.error('Error fetching health profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching health profile',
      error: error.message
    });
  }
};

// Create or update health profile
exports.updateHealthProfile = async (req, res) => {
  try {
    const { bloodGroup, pastDiseases, familyHistory, medications, allergies } = req.body;
    
    // Find health profile by user ID or create new one
    let healthProfile = await HealthProfile.findOne({ userId: req.user.firebaseId });
    
    if (!healthProfile) {
      // Check if user exists
      const userExists = await User.findOne({ firebaseId: req.user.firebaseId });
      
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'User not found. Please complete user profile first'
        });
      }
      
      // Create new health profile
      healthProfile = new HealthProfile({
        userId: req.user.firebaseId,
        bloodGroup,
        pastDiseases,
        familyHistory,
        medications,
        allergies
      });
    } else {
      // Update existing health profile
      healthProfile.bloodGroup = bloodGroup || healthProfile.bloodGroup;
      healthProfile.pastDiseases = pastDiseases || healthProfile.pastDiseases;
      healthProfile.familyHistory = familyHistory || healthProfile.familyHistory;
      healthProfile.medications = medications || healthProfile.medications;
      healthProfile.allergies = allergies || healthProfile.allergies;
      healthProfile.updatedAt = Date.now();
    }
    
    await healthProfile.save();
    
    // Update user's profileCreated status
    await User.findOneAndUpdate(
      { firebaseId: req.user.firebaseId },
      { profileCreated: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Health profile updated successfully',
      data: healthProfile
    });
    
  } catch (error) {
    console.error('Error updating health profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating health profile',
      error: error.message
    });
  }
};