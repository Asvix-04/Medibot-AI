const Conversation = require('../models/conversationModel');

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.firebaseId })
      .select('title messages.content messages.timestamp updatedAt')
      .sort({ updatedAt: -1 });
    
    // Format the conversations for the client
    const formattedConversations = conversations.map(conv => {
      const lastMessage = conv.messages.length > 0 
        ? conv.messages[conv.messages.length - 1].content 
        : '';
      
      return {
        id: conv._id,
        title: conv.title,
        preview: lastMessage.substring(0, 40) + (lastMessage.length > 40 ? '...' : ''),
        timestamp: conv.updatedAt
      };
    });
    
    res.status(200).json({
      success: true,
      data: formattedConversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};

// Get a single conversation with messages
exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ 
      _id: req.params.id, 
      userId: req.user.firebaseId 
    });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
};

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const { title, initialMessage } = req.body;
    
    const conversation = new Conversation({
      userId: req.user.firebaseId,
      title: title || 'New Conversation',
      messages: initialMessage ? [{
        role: 'user',
        content: initialMessage
      }] : []
    });
    
    await conversation.save();
    
    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating conversation',
      error: error.message
    });
  }
};

// Add a message to a conversation
exports.addMessage = async (req, res) => {
  try {
    const { role, content } = req.body;
    
    if (!role || !content) {
      return res.status(400).json({
        success: false,
        message: 'Role and content are required'
      });
    }
    
    const conversation = await Conversation.findOne({ 
      _id: req.params.id, 
      userId: req.user.firebaseId 
    });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    // Add message
    conversation.messages.push({
      role,
      content,
      timestamp: new Date()
    });
    
    // Update the conversation's updatedAt timestamp
    conversation.updatedAt = new Date();
    
    // If this is the first message, set the title based on user's message
    if (conversation.messages.length === 1 && role === 'user') {
      conversation.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
    }
    
    await conversation.save();
    
    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding message',
      error: error.message
    });
  }
};

// Delete a conversation
exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.firebaseId 
    });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting conversation',
      error: error.message
    });
  }
};