'use client';

import { Message } from '@/types';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div 
      className={`flex w-full animate-fadeIn ${
        message.isUser ? 'justify-end' : 'justify-start'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex max-w-[85%] md:max-w-[70%] ${
        message.isUser ? 'flex-row-reverse' : 'flex-row'
      }`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${
          message.isUser ? 'ml-3' : 'mr-3'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            message.isUser 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
          }`}>
            {message.isUser ? '👤' : '🤖'}
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className={`relative group ${
            message.isUser
              ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 text-white rounded-2xl rounded-br-md shadow-lg hover:shadow-purple-500/25'
              : 'bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 rounded-2xl rounded-bl-md border border-gray-600/50 shadow-lg hover:shadow-gray-700/50 backdrop-blur-sm'
          } px-5 py-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}>
            {/* Copy button */}
            {isHovered && (
              <button
                onClick={copyToClipboard}
                className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md hover:bg-black hover:bg-opacity-10 ${
                  message.isUser ? 'text-white' : 'text-gray-400'
                }`}
                title="Copy message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            )}
            
            {/* Message text */}
            <div className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
              message.isUser ? 'text-white' : 'text-gray-100'
            }`}>
              {message.text}
            </div>
          </div>
          
          {/* Timestamp */}
          <div className={`mt-1 text-xs px-1 ${
            message.isUser ? 'text-right text-purple-200' : 'text-left text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}