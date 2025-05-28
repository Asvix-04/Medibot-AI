const emailService = require('../services/emailService');

exports.sendWelcomeEmail = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const emailSent = await emailService.sendWelcomeEmail({
      email: req.user.email,
      fullName: req.body.fullName || req.user.fullName || 'there'
    });

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: 'Welcome email sent successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send welcome email'
      });
    }
  } catch (error) {
    console.error('Error in welcome email route:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};