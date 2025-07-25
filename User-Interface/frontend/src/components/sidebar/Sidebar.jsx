import React, { useState } from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import SidebarHeader from './SidebarHeader';
import ChatHistory from './ChatHistory';
import SidebarFooter from './SidebarFooter';
import Logo from '../ui/Logo';

const Sidebar = ({ isOpen, toggleSidebar, conversations, onSelectConversation, currentConversationId, onNewChat, darkMode, isBackgroundBlur }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out bg-white dark:bg-[#0d1117] text-black dark:text-white flex flex-col
                      ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-[250px] md:relative md:translate-x-0 ${isCollapsed ? 'md:w-[70px]' : 'md:w-[250px]'}`}
    >
      {isBackgroundBlur && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300 rounded-md" />
      )}
      <div
        className={`h-screen dark:bg-[#0d1117] bg-white text-black dark:text-white flex flex-col transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-[70px]' : 'w-[250px]'}`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Logo darkMode={darkMode} useColor={darkMode} isCollapsed={isCollapsed} />
          </div>
          <button
            onClick={handleToggle}
            className="p-2 hidden md:block text-gray-400 dark:text-white hover:bg-gray-700 rounded-full transition"
          >
            {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
          {/* Mobile-only Close Button */}
          <div className="flex justify-end md:hidden p-2">
            <button
              onClick={toggleSidebar}
              className="text-gray-800 dark:text-white p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <SidebarHeader onNewChat={onNewChat} darkMode={darkMode} isCollapsed={isCollapsed} />
        <ChatHistory
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={onSelectConversation}
          darkMode={darkMode}
          isCollapsed={isCollapsed}
        />
        <SidebarFooter isOpen={!isCollapsed} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Sidebar;