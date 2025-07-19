// chat layout
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "../sidebar";
import { ChatArea, ChatInput } from "../chat";
import ProfileDropdown from "../ui/ProfileDropdown";
import Logo from "../ui/Logo";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import FeedbackForm from "../feedback/FeedbackForm";

const ChatLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // API base URL
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  // Load dark mode preference on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle("dark", savedDarkMode);
  }, []);

  // Update document class when dark mode changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(
    async (conversationId) => {
      try {
        setLoading(true);
        setError(null);

        const user = auth.currentUser;
        if (!user) {
          throw new Error("User not authenticated");
        }

        const token = await user.getIdToken();

        const response = await axios.get(
          `${API_URL}/conversations/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Format messages for the component
        const formattedMessages = response.data.data.messages.map((msg) => ({
          id: msg._id || Date.now(),
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();

      const response = await axios.get(`${API_URL}/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      console.error("Error fetching conversations:", err);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [currentConversationId, API_URL, fetchMessages]);

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
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();
      
      const response = await axios.post(
        `${API_URL}/conversations`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newConversation = {
        id: response.data.data._id,
        title: response.data.data.title,
        preview: "",
        timestamp: response.data.data.createdAt,
      };

      setConversations([newConversation, ...conversations]);
      setCurrentConversationId(newConversation.id);
      setMessages([]);
    } catch (err) {
      console.error("Error creating conversation:", err);
      setError("Failed to create new conversation");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle in-place editing of user messages
   * NEW COMMENT: Added for supporting "Edit" functionality in ChatMessage.jsx
   */

  const handleEditSubmit = (id, newText) => {
    setMessages((prevMessages) =>
      prevMessages.map((m) => (m.id === id ? { ...m, content: newText } : m))
    );
  };
  // Send message
  const handleSendMessage = async (content, file = null) => {
    // const newMessages = [];

    if (!content.trim() && !file) return;

    const newMessage = {
      id: Date.now(),
      role: "user",
      content: content.trim(),
      file: file || null,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();
      let conversationId = currentConversationId;

      // Create conversation if needed
      if (!conversationId) {
        const convResponse = await axios.post(
          `${API_URL}/conversations`,
          {
            initialMessage: content || "📎 File sent",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        conversationId = convResponse.data.data._id;
        setCurrentConversationId(conversationId);

        const newConversation = {
          id: conversationId,
          title: (content || "📎 File sent").substring(0, 30),
          timestamp: new Date(),
          preview: content || "📎 File sent",
        };
        setConversations((prev) => [newConversation, ...prev]);
      }

      // Save to backend: message + file metadata
      await axios.post(
        `${API_URL}/conversations/${conversationId}/messages`,
        {
          role: "user",
          content,
          fileName: file?.name || null,
          fileType: file?.type || null,
          // You can include base64 or file upload later
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get ML response (only if content exists)
      let botResponse = "Got your file!";
      if (content.trim()) {
        const response = await axios.post(
          `${API_URL}/chat/medical`,
          { message: content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        botResponse = response.data.data.content;
      }

      const botMessage = {
        id: Date.now() + 2,
        role: "bot",
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      await axios.post(
        `${API_URL}/conversations/${conversationId}/messages`,
        {
          role: "bot",
          content: botResponse,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update preview
      const updatedConversations = conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              preview:
                botResponse.substring(0, 40) +
                (botResponse.length > 40 ? "..." : ""),
              timestamp: new Date(),
            }
          : conv
      );
      setConversations(updatedConversations);
      fetchConversations();
    } catch (err) {
      console.error("Error sending message:", err);
      setIsTyping(false);
      setError("Failed to send message");

      const errorMessage = {
        id: Date.now() + 3,
        role: "bot",
        content:
          "I'm sorry, I encountered an error processing your request. Please try again.",
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Handle selecting conversation from sidebar
  const handleSelectConversation = (id) => {
    setCurrentConversationId(id);
    fetchMessages(id);
  };

  return (
    <div className={`chat-layout-page flex h-screen min-h-screen overflow-hidden  ${darkMode ? 'dark:bg-gray-900' : 'bg-white'}`}>
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
      <div className="chatpage-main-content flex-1 flex flex-col overflow-hidden">
        {/* Header - updated to violet gradient */}
        <header className="chatpage-header sticky top-0 z-20 flex items-center justify-between p-4 border-b border-gray-200/80 dark:border-gray-700/50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-white hover:bg-violet-700/30 rounded-full transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {sidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
              <h1 className='chatpage-heading text-xl font-bold text-gray-800 dark:text-white'>
                <span className='bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>MediBot</span>
                <span className='text-gray-600 dark:text-gray-300'> - Your Health Assistant</span>
              </h1>
          </div>

          <div className="flex items-center space-x-4">
            {loading && (
              <div className="text-sm text-violet-900 flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-violet-100 animate-spin mr-2"></div>
                Loading...
              </div>
            )}
            {error && (
              <div className="text-sm px-3 py-1 rounded-full bg-red-600/20 text-red-600">{error}</div>
            )}
            <Link
              to="/settings"
              className="p-2  text-gray-800 dark:text-white hover:bg-violet-700/30 rounded-full transition-colors"
              aria-label="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
            <button
              onClick={() => setShowFeedback(true)}
              className="p-2 text-gray-800 dark:text-white hover:bg-violet-700/30 rounded-full transition-colors"
              aria-label="Give Feedback"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
            <ProfileDropdown
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>
        </header>

        {/* Chat area */}
        <main className="chat-area flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <ChatArea
            messages={messages}
            darkMode={darkMode}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onEditSubmit={handleEditSubmit} 
          />
        </main>
        <div className="chat-input w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-x-2 sticky bottom-0 z-10 px-4 pb-6 pt-4">
          <ChatInput onSendMessage={handleSendMessage} darkMode={darkMode} />
        </div>
        <FeedbackForm
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
        />
      </div>
    </div>
  );
};

export default ChatLayout;