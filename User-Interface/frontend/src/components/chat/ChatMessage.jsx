import React from 'react';
import medibot_logo from '../../assets/medibot_logo.jpg';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ChatMessage = ({ message, darkMode }) => {
  const isBot = message.role === 'bot';
  
  return (
    <>
      <div className={`flex items-start ${isBot ? '' : 'justify-end'}`}>
        {isBot && (
          <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] mr-2">
            <img src={medibot_logo} alt="Medibot" className="h-8 w-8 rounded-full" />
          </div>
        )}

        <div className="max-w-[85%]">
          <div className={`rounded-lg px-4 py-2 shadow-sm ${isBot
            ? ` ${darkMode ? 'bg-[#1a1a1a] text-[#d6d4d4] border border-[#2a2a2a]' : 'bg-[#4c4a4a] text-[#d6d4d4] border border-[#2a2a2a]'}`
            : `  ${darkMode ? 'bg-[#14254E] text-[#e8e2e7]' : 'bg-blue-600/20 text-[#3b393b]'}`
            }`}>
            <p className="whitespace-pre-wrap">{message.content}</p>

            {/* Icons */}
            <div className="flex space-x-2 mt-2">
              {/* Copy Button */}
              <button title="Copy Message" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white h-6 w-6">
                <svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="lucide lucide-copy">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4
               a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>

              {/* Edit Button */}
              <button title="Edit Message" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white h-6 w-6">
                <svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="lucide lucide-edit">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14 a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                </svg>
              </button>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-gray-400">
              {dayjs(message.date).format('DD MMM YYYY, hh:mm A')}
            </div>
          </div>
        </div>

        {!isBot && (
          <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center dark:bg-blue-600 bg-[#7f7fe0] border border-[#2a2a2a] ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d6d4d4]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatMessage;