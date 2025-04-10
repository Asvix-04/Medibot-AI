import React from 'react';

const SidebarHeader = ({ onNewChat, darkMode }) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onNewChat}
        className="flex items-center justify-center w-full p-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 dark:from-purple-700 dark:to-indigo-800 dark:hover:from-purple-800 dark:hover:to-indigo-900 transition-colors duration-300"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Chat
      </button>
    </div>
  );
};

export default SidebarHeader;