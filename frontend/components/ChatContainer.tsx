'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import ChatMessage from './ChatMessage';
import Loader from './Loader';

interface ChatContainerProps {
  messages: Message[];
  isTyping?: boolean;
}

export default function ChatContainer({ messages, isTyping = false }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 px-4 py-6 relative">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-pink-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-64 animate-fadeIn">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300 animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ready to chat!</h3>
              <p className="text-gray-400 text-lg mb-4">Send a message to start an amazing conversation</p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 shadow-sm max-w-xs">
                  <Loader />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}