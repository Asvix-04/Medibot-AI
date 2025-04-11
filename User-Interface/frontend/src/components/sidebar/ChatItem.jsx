import React from 'react';

const ChatItem = ({ title, preview, timestamp, isActive, onClick, darkMode }) => {
  return (
    <div
      onClick={onClick}
      className={`px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border-l-4 border-purple-500 dark:from-purple-900/30 dark:to-indigo-900/30 dark:border-purple-400'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      } dark:text-white`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium truncate">{title}</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
          {new Date(timestamp).toLocaleDateString()}
        </span>
      </div>
      {preview && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
          {preview}
        </p>
      )}
    </div>
  );
};

export default ChatItem;