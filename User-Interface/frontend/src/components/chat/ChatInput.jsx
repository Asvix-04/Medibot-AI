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
    <div className='mx-auto max-w-3xl'>
      <div className='flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 px-4 py-3 shadow-lg'>
        <form onSubmit={handleSubmit} className="flex items-end">
          <div className="relative flex-1 mr-2">
            <textarea
              className="outline-none w-full p-3 pr-12 rounded-lg resize-none transition-all bg-transparent text-sm placeholder-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="Ask a health question..."
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
              className="absolute right-3 bottom-3 text-gray-500 transition-colors"
              onClick={() => setMessage('')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <VoiceChat setInputText={setMessage} />
          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-4 mb-1 rounded-lg ${message.trim()
              ?'text-[#c6afaf] hover:shadow-md transition-all cursor-pointer'
              : 'bg-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-600'
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600 dark:text-white" 
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;