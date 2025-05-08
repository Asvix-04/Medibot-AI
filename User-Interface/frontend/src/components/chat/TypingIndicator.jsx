import React from 'react';
import medibot_logo from '../../assets/medibot_logo.jpg';

const TypingIndicator = () => {
  return (
    <div className="flex items-start max-w-[85%]">
      <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] mr-2">
        <img src={medibot_logo} alt="Medibot" className="h-8 w-8 rounded-full" />
      </div>
      <div className="rounded-lg px-4 py-2 shadow-sm bg-[#1a1a1a] border border-[#2a2a2a]">
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-[#f75600] animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#f75600] animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#f75600] animate-bounce" style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;