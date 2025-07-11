import React, { useState } from 'react';
import VoiceChat from './VoiceChat';

const ChatInput = ({ onSendMessage, darkMode }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end">
      <div className="relative flex-1 mr-2">
        <textarea
          className="w-full p-3 pr-12 rounded-lg resize-none border border-[#2a2a2a] bg-[#121212] text-[#d6d4d4] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f75600] focus:border-[#f75600] transition-all"
          placeholder="Type your message here..."
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="button"
          className="absolute right-3 bottom-3 text-gray-500 hover:text-[#f75600] transition-colors"
          onClick={() => setMessage('')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <VoiceChat setInputText={setMessage}/>
      <button
        type="submit"
        disabled={!message.trim()}
        className={`p-4 mb-1 rounded-lg ${message.trim()
            ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-[#d6d4d4] hover:shadow-md transition-all cursor-pointer'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;