import React from 'react';
import medibot_logo from '../../assets/medibot_logo.jpg';

const Logo = ({ darkMode, useColor = false }) => {
  return (
    <div className="flex items-center">
      <div className={`h-10 w-10 rounded-full overflow-hidden border-2 ${useColor ? 'border-white' : 'border-gray-200'}`}>
        <img src={medibot_logo} alt="Medibot Logo" className="h-full w-full object-cover" />
      </div>
      <span className={`ml-2 text-xl font-bold ${
        useColor ? 'text-white' : (darkMode ? 'text-white' : 'text-black')
      }`}>
        Medibot
        <span className="text-xs font-normal bg-white/30 px-2 py-0.5 rounded-full ml-1 backdrop-blur-sm">AI</span>
      </span>
    </div>
  );
};

export default Logo;