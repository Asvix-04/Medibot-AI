import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import SuggestionChips from "./SuggestionChips";
import TypingIndicator from "./TypingIndicator";
import medibot_logo from "../../assets/medibot_logo.jpg";

/**
 * Recent changes:
 * - Added support for edit & copy functionality in ChatMessage
 * - Added thumbs up / thumbs down / speaker feedback buttons in ChatMessage
 */

const ChatArea = ({
  messages,
  darkMode,
  isTyping = false,
  onSendMessage,
  onEditSubmit, //New: passed down for editing functionality
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  //chime sound for send and received msgs 
    const chimeAudio = useRef(new Audio(chimeSound));
  
    useEffect(() => {
      if (messages.length === 0) return;
      chimeAudio.current.play();
    }, [messages]);

  const handleSuggestionClick = (suggestion) => {
    if (onSendMessage) {
      onSendMessage(suggestion);
    }
  };

  const getSuggestions = () => {
    if (!messages.length) {
      return [
        "What are the symptoms of diabetes?",
        "How can I manage my blood pressure?",
        "Tell me about common cold remedies",
      ];
    }

    const lastBotMessage = [...messages]
      .reverse()
      .find((m) => m.role === "bot");
    if (!lastBotMessage) return [];

    const content = lastBotMessage.content.toLowerCase();

    if (
      content.includes("medication") ||
      content.includes("drug") ||
      content.includes("medicine")
    ) {
      return [
        "What are the side effects?",
        "How often should I take it?",
        "Are there any alternative treatments?",
      ];
    } else if (
      content.includes("symptom") ||
      content.includes("pain") ||
      content.includes("feeling")
    ) {
      return [
        "Could this be serious?",
        "What diagnostic tests might I need?",
        "When should I see a doctor?",
      ];
    } else if (
      content.includes("diet") ||
      content.includes("nutrition") ||
      content.includes("food")
    ) {
      return [
        "Foods I should avoid?",
        "What nutrients do I need more of?",
        "Can you suggest a meal plan?",
      ];
    } else if (
      content.includes("exercise") ||
      content.includes("activity") ||
      content.includes("workout")
    ) {
      return [
        "What exercises are safe for me?",
        "How often should I exercise?",
        "What should I avoid doing?",
      ];
    }

    return [
      "Tell me more about treatments",
      "What preventive measures should I take?",
      "Are there any related conditions I should know about?",
    ];
  };

  return (
    <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-full py-12 sm:px-6 lg:px-8">
          <div className="p-4 rounded-full bg-gradient-to-r from-[#1a1a1a] to-[#232323] border border-[#2a2a2a]">
            <img
              src={medibot_logo}
              alt="Medibot Logo"
              className="w-20 h-20 sm:w-16 sm:h-16 rounded-full border-2 border-[#2a2a2a] shadow-lg"
            />
          </div>
          <h1 className="mt-6 sm:text-2xl text-2xl font-bold text-[#d6d4d4]">
            How can I help you today?
          </h1>
          <p className="mt-2 text-center text-[#a8a8a8] max-w-md sm:text-sm">
            I'm your medical assistant. Ask me about symptoms, health
            information, or medical advice.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
            <div
              className="p-3 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-[#6366f1]"
              onClick={() =>
                handleSuggestionClick(
                  "I have a headache and feeling tired. What could it be?"
                )
              }
            >
              <p className="text-sm sm:text-sm font-medium text-[#6366f1]">
                🩺 Symptom Checker
              </p>
              <p className="text-xs sm:text-xs text-[#a8a8a8]">
                Describe your symptoms
              </p>
            </div>
            <div
              className="p-3 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-[#6366f1]"
              onClick={() =>
                handleSuggestionClick(
                  "Tell me about common blood pressure medications"
                )
              }
            >
              <p className="text-sm font-medium text-[#6366f1] sm:text-sm">
                💊 Medication Info
              </p>
              <p className="text-xs text-[#a8a8a8] sm:text-xs">
                Learn about your prescriptions
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Renders all chat messages */}
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onEditSubmit={onEditSubmit} // NEW: Enables editing user messages
              darkMode={darkMode}
            />
          ))}

          {isTyping && <TypingIndicator darkMode={darkMode} />}

          {messages.length > 0 &&
            !isTyping &&
            messages[messages.length - 1].role === "bot" && (
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