import React from 'react';
import SidebarHeader from './SidebarHeader';
import ChatHistory from './ChatHistory';
import SidebarFooter from './SidebarFooter';
import Logo from '../ui/Logo';

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
      className={`chatpage-sidebar fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col lg:static lg:inset-0 w-[250px] ${
        isOpen ? 'translate-x-0' : '-translate-x-full absolute'
      }${darkMode} dark:border-gray-700 shadow-lg`}
    >
      <div className="p-4 text-white flex items-center">
         <Logo darkMode={darkMode} useColor={darkMode} />
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