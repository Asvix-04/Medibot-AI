import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import SuggestionChips from "./SuggestionChips";
import TypingIndicator from "./TypingIndicator";
import medibot_logo from "../../assets/medibot_logo.jpg";
import chimeSound from '../../assets/Text_Dispatch.mp3'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


dayjs.extend(relativeTime);

const getDateLabel = (date) => {
  const today = dayjs().startOf('day');
  const messageDay = dayjs(date).startOf('day');

  const diffDays = today.diff(messageDay, 'day');

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return dayjs(date).format('DD MMM YYYY');
};

const ChatArea = ({ messages, darkMode, isTyping = false, onSendMessage, onEditSubmit, }, date) => {

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
    <div className="flex flex-col space-y-2 sm:space-y-4 max-w-3xl mx-auto px-2 sm:px-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-4 sm:py-6 md:py-12">
          {/* Updated welcome screen gradient to match theme */}
          <div className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-[#1a1a1a] to-[#232323] border border-[#2a2a2a]">
            <img
              src={medibot_logo}
              alt="Medibot Logo"
              className="w-12 sm:w-16 md:w-16 h-12 sm:h-16 md:h-16 rounded-full border-2 border-[#2a2a2a] shadow-lg"
            />
          </div>
          {/* Updated heading text color */}
          <h1 className="mt-3 sm:mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white text-center">
            How can I help you today?
          </h1>
          {/* Updated paragraph text color */}
          <p className="mt-1 sm:mt-2 text-center text-sm sm:text-base md:text-base text-gray-600 dark:text-white max-w-xs sm:max-w-md">
            I'm your medical assistant. Ask me about symptoms, health information, or medical advice.
          </p>
          <div className="mt-3 sm:mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {/* Updated suggestion boxes */}
            <div
              className="p-2 sm:p-3 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-[#6366f1]"
              onClick={() => handleSuggestionClick("I have a headache and feeling tired. What could it be?")}
            >
              <p className="text-xs sm:text-sm font-medium text-[#bb63f1]">🩺 Symptom Checker</p>
              <p className="text-xs text-[#a8a8a8]">Describe your symptoms</p>
            </div>
            <div
              className="p-2 sm:p-3 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-[#6366f1]"
              onClick={() => handleSuggestionClick("Tell me about common blood pressure medications")}
            >
              <p className="text-xs sm:text-sm font-medium text-[#bb63f1]">💊 Medication Info</p>
              <p className="text-xs text-[#a8a8a8]">Learn about your prescriptions</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Renders all chat messages */}
          <div className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">{getDateLabel(date)}</div>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onEditSubmit={onEditSubmit}
              darkMode={darkMode}
            />
          ))}

          {isTyping && <TypingIndicator darkMode={darkMode} />}

          {messages.length > 0 &&
            !isTyping &&
            messages[messages.length - 1].role === "bot" && (
              <div className="mt-2 sm:mt-4 mb-1 sm:mb-2">
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