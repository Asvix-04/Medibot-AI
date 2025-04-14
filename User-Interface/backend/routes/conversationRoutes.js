const express = require('express');
const { 
  getConversations, 
  getConversation, 
  createConversation, 
  addMessage,
  deleteConversation 
} = require('../controllers/conversationController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

router.get('/', getConversations);
router.get('/:id', getConversation);
router.post('/', createConversation);
router.post('/:id/messages', addMessage);
router.delete('/:id', deleteConversation);

module.exports = router;