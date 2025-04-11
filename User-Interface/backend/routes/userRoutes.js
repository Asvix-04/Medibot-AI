// src/routes/userRoutes.js
const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

router.get('/profile', getUserProfile);
router.post('/profile', updateUserProfile);
router.put('/profile', updateUserProfile);

module.exports = router;