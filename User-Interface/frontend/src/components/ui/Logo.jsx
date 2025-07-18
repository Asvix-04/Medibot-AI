import React from 'react';
import medibot_logo from '../../assets/medibot_logo.jpg';

const Logo = ({ darkMode, useColor = false }) => {
  return (
    <div className="flex items-center">
      <div className={`h-10 w-10 rounded-full overflow-hidden border-2 ${
        useColor 
          ? 'border-white' 
          : darkMode 
            ? 'border-gray-700' 
            : 'border-violet-100'
      }`}>
        <img src={medibot_logo} alt="Medibot Logo" className="h-full w-full object-cover" />
      </div>
      <span className={`ml-2 text-xl font-bold ${
        useColor 
          ? 'text-white' 
          : darkMode 
            ? 'text-white' 
            : 'text-gray-600'
      }`}>
        Medibot
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ml-1 ${
          useColor 
            ? 'bg-white/30 backdrop-blur-sm' 
            : darkMode 
              ? 'bg-violet-700 text-violet-100' 
              : 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white'
        }`}>AI</span>
      </span>
    </div>
  );
};

export default Logo;