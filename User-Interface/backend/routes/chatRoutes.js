const express = require('express');
const axios = require('axios');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Forward chat requests to the ML service
router.post('/medical', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'No message provided'
      });
    }
    
    // Forward the request to the Python ML service
    const response = await axios.post('http://localhost:5050/api/medical-chat', {
      message
    });
    
    // Return the response from the ML service
    return res.status(200).json({
      success: true,
      data: {
        content: response.data.response,
        role: 'bot'
      }
    });
    
  } catch (error) {
    console.error('Error in medical chat:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing medical chat request',
      error: error.message
    });
  }
});

module.exports = router;