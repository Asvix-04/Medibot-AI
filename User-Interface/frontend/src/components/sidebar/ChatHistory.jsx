import React from 'react';
import ChatItem from './ChatItem';

const ChatHistory = ({ conversations, onSelectConversation, currentConversationId, darkMode }) => {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      <div className="mb-2 px-2">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
          Recent conversations
        </h2>
      </div>

      <div className="space-y-1">
        {conversations.length > 0 ? (
          conversations.map(chat => (
            <ChatItem
              key={chat.id}
              title={chat.title}
              preview={chat.preview}
              timestamp={chat.timestamp}
              isActive={chat.id === currentConversationId}
              onClick={() => onSelectConversation(chat.id)}
              darkMode={darkMode}
            />
          ))
        ) : (
          <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
            No conversations yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;