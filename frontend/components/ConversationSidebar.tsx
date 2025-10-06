'use client';

import { useState } from 'react';
import { Conversation } from '@/types';

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = diffInMs / (1000 * 60);
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInMinutes < 5) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: number | null;
  onSelectConversation: (id: number) => void;
  onNewConversation: () => void;
  isLoading: boolean;
}

export default function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  isLoading,
}: ConversationSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-gradient-to-b from-gray-900 via-slate-900 to-gray-800 text-white transition-all duration-500 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-80'
    } flex flex-col h-screen border-r border-gray-700/50 backdrop-blur-xl relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl animate-bounce"></div>
      </div>
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50 backdrop-blur-sm relative z-10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Conversations</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-110 hover:rotate-180"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4 relative z-10">
        <button
          onClick={onNewConversation}
          className={`w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 hover:-translate-y-1 ${
            isCollapsed ? 'px-3' : 'px-4'
          } backdrop-blur-sm border border-purple-400/20`}
          title="Start new conversation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
        {isLoading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : conversations.length === 0 ? (
          !isCollapsed && (
            <div className="p-4 text-center text-gray-400">
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Start a new chat to begin!</p>
            </div>
          )
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-300 hover:bg-white/10 group backdrop-blur-sm border ${
                  currentConversationId === conversation.id
                    ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-400/50 shadow-lg shadow-purple-500/25 transform scale-105'
                    : 'border-transparent hover:border-purple-400/30 hover:shadow-lg hover:scale-102 hover:-translate-y-1'
                } ${isCollapsed ? 'flex justify-center' : ''}`}
                title={isCollapsed ? conversation.title : undefined}
              >
                {isCollapsed ? (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                    <span className="text-sm font-medium text-white">
                      {conversation.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate mb-1 group-hover:text-purple-200 transition-colors">
                        {conversation.title}
                      </div>
                      <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                        {formatRelativeTime(conversation.updated_at)}
                      </div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}