import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar';
import { ChatArea, ChatInput } from '../chat';
import ProfileDropdown from '../ui/ProfileDropdown';
import Logo from '../ui/Logo';
import ThemeToggle from '../ui/ThemeToggle';

const ChatLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Save preference to localStorage
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

  // Create new conversation
  const createNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      title: 'New Conversation',
      timestamp: new Date(),
      preview: '',
    };
    
    setConversations([newConversation, ...conversations]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
  };

  // Send message
  const handleSendMessage = (content) => {
    if (!content.trim()) return;
    
    // Create a user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    // Add the message to the state
    setMessages([...messages, userMessage]);
    
    // Mock AI response after delay
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: `This is a simulated response to: "${content}"`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation preview
      if (currentConversationId) {
        const updatedConversations = conversations.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
              preview: aiMessage.content.substring(0, 40) + (aiMessage.content.length > 40 ? '...' : ''),
              timestamp: new Date(),
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
      }
    }, 1000);
  };

  // Handle selecting conversation from sidebar
  const handleSelectConversation = (id) => {
    setCurrentConversationId(id);
    // In a real app, you would fetch messages for this conversation
    setMessages([
      {
        id: 1,
        role: 'user',
        content: 'This is a sample message for the selected conversation',
        timestamp: new Date(),
      },
      {
        id: 2,
        role: 'bot',
        content: 'This is a sample response for the selected conversation',
        timestamp: new Date(),
      }
    ]);
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
        {/* Header - NO New Chat button here */}
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
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <ProfileDropdown />
          </div>
        </header>

        {/* Rest of your layout remains unchanged */}
        <main className="flex-1 overflow-y-auto p-4">
          <ChatArea messages={messages} darkMode={darkMode} />
        </main>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <ChatInput onSendMessage={handleSendMessage} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;