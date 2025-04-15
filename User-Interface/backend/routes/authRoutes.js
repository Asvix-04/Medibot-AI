const express = require('express');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// This route will verify if a token is valid (used by frontend to check auth status)
router.get('/verify', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      uid: req.user.firebaseId,
      email: req.user.email,
      emailVerified: req.user.emailVerified
    }
  });
});

// Note: Most authentication is handled by Firebase directly in the frontend
// This file primarily serves API routes that work with the Firebase auth system

module.exports = router;