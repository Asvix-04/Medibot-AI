import React, { useState } from 'react';

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
      <button
        type="submit"
        disabled={!message.trim()}
        className={`p-3 rounded-lg ${
          message.trim()
            ? 'bg-gradient-to-r from-[#f75600] to-[#E2711D] text-[#d6d4d4] hover:shadow-md transition-all cursor-pointer'
            : 'bg-[#1a1a1a] text-gray-500 border border-[#2a2a2a] cursor-not-allowed'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;