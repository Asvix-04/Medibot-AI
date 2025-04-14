import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import medibot_logo from '../../assets/medibot_logo.jpg';

const ChatArea = ({ messages, darkMode, isTyping = false, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  const handleSuggestionClick = (suggestion) => {
    // When a suggestion is clicked, send it as a new message
    if (onSendMessage) {
      onSendMessage(suggestion);
    }
  };

  return (
    <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <div className="p-4 rounded-full bg-gradient-to-r from-purple-100 via-sky-100 to-indigo-100 dark:from-purple-900/30 dark:via-sky-900/30 dark:to-indigo-900/30">
            <img 
              src={medibot_logo} // Use the imported logo
              alt="Medibot Logo" 
              className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
            />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
            How can I help you today?
          </h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400 max-w-md">
            I'm your medical assistant. Ask me about symptoms, health information, or medical advice.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div 
              className="p-3 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-purple-300 dark:hover:border-purple-700"
              onClick={() => handleSuggestionClick("I have a headache and feeling tired. What could it be?")}
            >
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">🩺 Symptom Checker</p>
              <p className="text-xs text-gray-500">Describe your symptoms</p>
            </div>
            <div 
              className="p-3 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-purple-300 dark:hover:border-purple-700"
              onClick={() => handleSuggestionClick("Tell me about common blood pressure medications")}
            >
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">💊 Medication Info</p>
              <p className="text-xs text-gray-500">Learn about your prescriptions</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              darkMode={darkMode}
              onSuggestionClick={handleSuggestionClick}
            />
          ))}
          {isTyping && <TypingIndicator darkMode={darkMode} />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;