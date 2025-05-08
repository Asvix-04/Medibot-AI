import React from 'react';

const SuggestionChips = ({ suggestions, onSuggestionClick, darkMode }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-3 py-1.5 text-sm rounded-full font-medium transition-all 
            bg-[#1a1a1a] text-[#d6d4d4] hover:bg-[#232323] border border-[#2a2a2a] hover:border-[#f75600]
            flex items-center cursor-pointer"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;