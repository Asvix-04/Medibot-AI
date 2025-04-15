import React from 'react';

const SuggestionChips = ({ suggestions, onSuggestionClick, darkMode }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all 
            ${darkMode 
              ? 'bg-indigo-900/30 text-indigo-200 hover:bg-indigo-800/50 border border-indigo-700/50' 
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            } flex items-center`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;