import React from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Sidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  theme,
}) {
  return (
    <aside className="hidden sm:flex flex-col w-full sm:w-1/3 md:w-1/4 h-full border-r bg-white">
      {/* Fixed Header */}
      <div
        className={`flex-none p-4 border-b font-bold z-10 ${theme.sidebarHeader}`}
      >
        Conversations
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`flex items-center p-3 cursor-pointer border-b ${theme.sideBarHover}  ${
              selectedConversationId === conv.id ? theme.sidebarActiveChat : ""
            }`}
          >
            <FaUserCircle className="text-gray-500 text-3xl mr-3" />
            <div className="flex-1">
              <div className="font-medium text-left">{conv.patientName}</div>
              <div className="text-sm text-gray-500 truncate text-left">
                {conv.lastMessage}
              </div>
            </div>
            <div className="text-xs text-gray-400 ml-2">{conv.timestamp}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
