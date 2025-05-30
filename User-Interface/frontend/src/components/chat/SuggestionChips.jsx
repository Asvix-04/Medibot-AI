import React from 'react';

const SuggestionChips = ({ suggestions, onSuggestionClick, darkMode }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className={`px-3 py-1.5 text-sm rounded-full cursor-pointer transition-colors
            ${darkMode 
              ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-[#6366f1] hover:bg-gray-700' 
              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:border-[#6366f1] hover:bg-gray-50'
            }`}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
};

export default SuggestionChips;