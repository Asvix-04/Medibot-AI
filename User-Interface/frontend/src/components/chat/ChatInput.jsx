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
          className={`w-full p-3 pr-12 rounded-lg resize-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
            darkMode 
              ? 'bg-gray-800 text-white border-gray-700' 
              : 'bg-white text-gray-900'
          }`}
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
          className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
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
            ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-600 hover:to-indigo-700 dark:from-sky-600 dark:to-indigo-700 dark:hover:from-sky-700 dark:hover:to-indigo-800'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
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