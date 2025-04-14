import React from 'react';

const TypingIndicator = ({ darkMode }) => {
  return (
    <div className="flex items-start max-w-[85%]">
      <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      </div>
      <div className={`rounded-lg px-4 py-2 shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20`}>
        <div className="flex space-x-1">
          <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
          <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;