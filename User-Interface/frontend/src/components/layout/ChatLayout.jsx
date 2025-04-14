import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from '../sidebar';
import { ChatArea, ChatInput } from '../chat';
import ProfileDropdown from '../ui/ProfileDropdown';
import Logo from '../ui/Logo';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';

const ChatLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false); // Add this line

  // API base URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  // Load dark mode preference on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle('dark', savedDarkMode);
  }, []);

  // Update document class when dark mode changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const token = await user.getIdToken();
      
      const response = await axios.get(`${API_URL}/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Format messages for the component
      const formattedMessages = response.data.data.messages.map(msg => ({
        id: msg._id || Date.now(),
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const token = await user.getIdToken();
      
      const response = await axios.get(`${API_URL}/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setConversations(response.data.data);
      
      // If there are conversations and none is selected, select the first one
      if (response.data.data.length > 0 && !currentConversationId) {
        setCurrentConversationId(response.data.data[0].id);
        // Use function reference to avoid circular dependency
        const conversationId = response.data.data[0].id;
        setTimeout(() => {
          fetchMessages(conversationId);
        }, 0);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [currentConversationId, API_URL, fetchMessages]); // Add API_URL to dependency array

  // Fetch conversations when component mounts
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Create new conversation
  const createNewConversation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const token = await user.getIdToken();
      
      const response = await axios.post(`${API_URL}/conversations`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const newConversation = {
        id: response.data.data._id,
        title: response.data.data.title,
        preview: '',
        timestamp: response.data.data.createdAt
      };
      
      setConversations([newConversation, ...conversations]);
      setCurrentConversationId(newConversation.id);
      setMessages([]);
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Failed to create new conversation');
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (content) => {
    if (!content.trim()) return;
    
    // Add user message to local state immediately for UI responsiveness
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setIsTyping(true); // Add this line to show typing indicator

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const token = await user.getIdToken();
      
      // If we don't have a current conversation, create one
      let conversationId = currentConversationId;
      
      if (!conversationId) {
        const convResponse = await axios.post(`${API_URL}/conversations`, {
          initialMessage: content
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        conversationId = convResponse.data.data._id;
        
        const newConversation = {
          id: conversationId,
          title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
          timestamp: new Date(),
          preview: content
        };
        
        setConversations([newConversation, ...conversations]);
        setCurrentConversationId(conversationId);
      }
      
      // Save the user message to the backend
      await axios.post(`${API_URL}/conversations/${conversationId}/messages`, {
        role: 'user',
        content
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Simulate AI response
      // In a real app, you would call your AI service here
      setTimeout(async () => {
        const botResponse = `This is a response to: "${content}"`;
        
        // Add bot message to local state
        const botMessage = {
          id: Date.now() + 1,
          role: 'bot',
          content: botResponse,
          timestamp: new Date()
        };
        
        setIsTyping(false); // Add this line to hide typing indicator
        setMessages(prev => [...prev, botMessage]);
        
        // Save the bot message to the backend
        await axios.post(`${API_URL}/conversations/${conversationId}/messages`, {
          role: 'bot',
          content: botResponse
        }, {
          headers: {
            Authorization: `Bearer ${token}`
        }
        });
        
        // Update conversations list with new preview
        const updatedConversations = conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              preview: botResponse.substring(0, 40) + (botResponse.length > 40 ? '...' : ''),
              timestamp: new Date()
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
        
        // Refresh the conversations list to update the UI
        fetchConversations();
      }, 1000);
      
    } catch (err) {
      setIsTyping(false); // Add this line to hide typing on error
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Handle selecting conversation from sidebar
  const handleSelectConversation = (id) => {
    setCurrentConversationId(id);
    fetchMessages(id);
  };

  return (
    <div className={`flex h-screen bg-gray-50 ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar with New Chat button */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        currentConversationId={currentConversationId}
        onNewChat={createNewConversation}
        darkMode={darkMode}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full transition-all duration-200 dark:bg-gray-900">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 via-sky-500 to-indigo-600 dark:from-purple-700 dark:via-sky-700 dark:to-indigo-800 text-white shadow-md">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Logo darkMode={darkMode} useColor={true} />
          </div>

          <div className="flex items-center space-x-4">
            {loading && (
              <div className="text-sm text-white/80">Loading...</div>
            )}
            {error && (
              <div className="text-sm text-red-300">{error}</div>
            )}
            <Link 
              to="/settings"
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <ProfileDropdown darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </header>

        {/* Chat area */}
        <main className="flex-1 overflow-y-auto p-4">
          <ChatArea 
            messages={messages} 
            darkMode={darkMode} 
            isTyping={isTyping} 
            onSendMessage={handleSendMessage} 
          />
        </main>

        {/* Chat input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <ChatInput onSendMessage={handleSendMessage} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;