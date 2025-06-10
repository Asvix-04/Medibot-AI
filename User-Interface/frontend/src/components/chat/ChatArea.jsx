import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import SuggestionChips from './SuggestionChips';
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
    if (onSendMessage) {
      onSendMessage(suggestion);
    }
  };
  
  // Generate follow-up suggestions based on context
  const getSuggestions = () => {
    // If there are no bot messages, return medical-specific default questions
    if (!messages.length) {
      return [
        "What are the symptoms of diabetes?",
        "How can I manage my blood pressure?",
        "Tell me about common cold remedies"
      ];
    }
    
    // Get the last bot message
    const lastBotMessage = [...messages].reverse().find(m => m.role === 'bot');
    if (!lastBotMessage) return [];
    
    const content = lastBotMessage.content.toLowerCase();
    
    // Generate contextual suggestions based on last bot message content
    if (content.includes('medication') || content.includes('drug') || content.includes('medicine')) {
      return [
        "What are the side effects?", 
        "How often should I take it?", 
        "Are there any alternative treatments?"
      ];
    } 
    else if (content.includes('symptom') || content.includes('pain') || content.includes('feeling')) {
      return [
        "Could this be serious?", 
        "What diagnostic tests might I need?", 
        "When should I see a doctor?"
      ];
    }
    else if (content.includes('diet') || content.includes('nutrition') || content.includes('food')) {
      return [
        "Foods I should avoid?", 
        "What nutrients do I need more of?", 
        "Can you suggest a meal plan?"
      ];
    }
    else if (content.includes('exercise') || content.includes('activity') || content.includes('workout')) {
      return [
        "What exercises are safe for me?", 
        "How often should I exercise?", 
        "What should I avoid doing?"
      ];
    }
    // Default suggestions
    return [
      "Tell me more about treatments", 
      "What preventive measures should I take?", 
      "Are there any related conditions I should know about?"
    ];
  };

  return (
    <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-12">
          {/* Updated welcome screen gradient to match theme */}
          <div className="p-4 rounded-full bg-gradient-to-r from-[#1a1a1a] to-[#232323] border border-[#2a2a2a]">
            <img 
              src={medibot_logo}
              alt="Medibot Logo" 
              className="w-16 h-16 rounded-full border-2 border-[#2a2a2a] shadow-lg"
            />
          </div>
          {/* Updated heading text color */}
          <h1 className="mt-6 text-2xl font-bold text-[#d6d4d4]">
            How can I help you today?
          </h1>
          {/* Updated paragraph text color */}
          <p className="mt-2 text-center text-[#a8a8a8] max-w-md">
            I'm your medical assistant. Ask me about symptoms, health information, or medical advice.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {/* Updated suggestion boxes */}
            <div 
              className="p-3 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-[#6366f1]"
              onClick={() => handleSuggestionClick("I have a headache and feeling tired. What could it be?")}
            >
              <p className="text-sm font-medium text-[#6366f1]">🩺 Symptom Checker</p>
              <p className="text-xs text-[#a8a8a8]">Describe your symptoms</p>
            </div>
            <div 
              className="p-3 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-[#6366f1]"
              onClick={() => handleSuggestionClick("Tell me about common blood pressure medications")}
            >
              <p className="text-sm font-medium text-[#6366f1]">💊 Medication Info</p>
              <p className="text-xs text-[#a8a8a8]">Learn about your prescriptions</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* All messages */}
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              darkMode={darkMode}
            />
          ))}
          
          {/* Typing indicator */}
          {isTyping && <TypingIndicator darkMode={darkMode} />}
          
          {/* Single set of follow-up suggestions at the bottom */}
          {messages.length > 0 && !isTyping && messages[messages.length-1].role === 'bot' && (
            <div className="mt-4 mb-2">
              <SuggestionChips
                suggestions={getSuggestions()}
                onSuggestionClick={handleSuggestionClick}
                darkMode={darkMode}
              />
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;