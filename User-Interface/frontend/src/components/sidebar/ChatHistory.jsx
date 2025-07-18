import React from 'react';
import ChatItem from './ChatItem';

const ChatHistory = ({ conversations, onSelectConversation, currentConversationId, darkMode }) => {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      <div className="mb-2 px-2">
        <h2 className="text-xs font-medium text-violet-800 uppercase tracking-wider dark:text-violet-400">
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
          <div className="text-center py-6 px-3 rounded-lg bg-violet-50 dark:bg-violet-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-violet-400 dark:text-violet-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-violet-800 dark:text-violet-400 font-medium">
              No conversations yet
            </p>
            <p className="text-xs text-violet-800/70 dark:text-violet-400/70 mt-1">
              Start a new chat to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;