// src/routes/healthDataRoutes.js
const express = require('express');
const { getHealthProfile, updateHealthProfile } = require('../controllers/healthController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

router.get('/profile', getHealthProfile);
router.post('/profile', updateHealthProfile);
router.put('/profile', updateHealthProfile);

module.exports = router;