'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import ConversationSidebar from '@/components/ConversationSidebar';

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { 
    messages, 
    conversations,
    currentConversationId,
    isTyping, 
    sendMessage, 
    error, 
    isLoading,
    loadConversations,
    loadMessages,
    startNewConversation,
    clearError 
  } = useChat();

  // Redirect to login if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load conversations when user is authenticated
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          <p className="text-gray-200">Loading your chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-hidden">
      {/* Conversation Sidebar - Independent Container */}
      <div className="flex-shrink-0">
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={loadMessages}
          onNewConversation={startNewConversation}
          isLoading={isLoading}
        />
      </div>

      {/* Main Chat Area - Independent Container */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Error Banner */}
        {error && (
          <div className="absolute top-16 left-0 right-0 z-40 bg-red-500/90 backdrop-blur-sm border-b border-red-400/30 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-200 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-100">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-200 hover:text-red-100"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Chat Container - Full Height with Independent Scroll */}
        <div className="flex-1 flex flex-col pt-16 h-screen overflow-hidden">
          {messages.length === 0 && !currentConversationId ? (
            <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
              <div className="text-center">
                <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-400/30">
                  <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Start a conversation</h3>
                <p className="text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
                  Ask me anything! I can help with coding, writing, analysis, creative tasks, and much more.
                </p>
                <div className="space-y-4">
                  <div className="text-sm text-purple-300">Try asking me about:</div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {['Programming help', 'Writing assistance', 'Data analysis', 'Creative ideas'].map((suggestion) => (
                      <span key={suggestion} className="px-4 py-2 bg-white/10 backdrop-blur-sm text-gray-200 rounded-xl text-sm border border-white/20 hover:bg-white/20 transition-all">
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <ChatContainer messages={messages} isTyping={isTyping} />
            </div>
          )}

          {/* Chat Input - Fixed at bottom */}
          <div className="flex-shrink-0">
            <ChatInput 
              onSendMessage={sendMessage} 
              isTyping={isTyping}
              placeholder={currentConversationId ? "Continue the conversation..." : "Start a new conversation..."}
            />
          </div>
        </div>
      </div>
    </div>
  );
}