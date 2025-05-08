import React from 'react';
import SidebarHeader from './SidebarHeader';
import ChatHistory from './ChatHistory';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ 
  isOpen, 
  toggleSidebar, 
  conversations, 
  onSelectConversation,
  currentConversationId,
  onNewChat,
  darkMode
}) => {
  return (
    <div 
      className={`flex flex-col w-64 h-full bg-gray-50 border-r border-gray-200 transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full absolute'
      } dark:bg-gray-800 dark:border-gray-700 shadow-lg`}
    >
      <div className="bg-gradient-to-r from-[#6366f1] to-[#818cf8] p-4 text-white flex items-center">
        <div className="text-lg font-bold">Medibot Chat</div>
      </div>
      <SidebarHeader onNewChat={onNewChat} darkMode={darkMode} />
      <ChatHistory 
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={onSelectConversation}
        darkMode={darkMode}
      />
      <SidebarFooter darkMode={darkMode} />
    </div>
  );
};

export default Sidebar;