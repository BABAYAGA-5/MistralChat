'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  onSendMessage, 
  isTyping = false, 
  placeholder = "Type your message..." 
}: ChatInputProps) {
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;
    
    onSendMessage(inputText);
    setInputText('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="border-t border-gray-700 bg-gray-900 px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
          <div className={`relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl border transition-all duration-300 transform ${
            isFocused 
              ? 'border-purple-500 bg-gradient-to-br from-gray-800 to-gray-700 shadow-2xl ring-4 ring-purple-500/30 scale-[1.02]' 
              : 'border-gray-600 hover:border-purple-400/50 hover:shadow-lg'
          } backdrop-blur-sm`}>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="w-full resize-none bg-transparent px-4 py-3 pr-12 text-gray-100 placeholder-gray-400 focus:outline-none text-sm leading-relaxed min-h-[50px] max-h-[120px]"
              rows={1}
              disabled={isTyping}
            />
            
            {/* Send Button */}
            <div className="absolute bottom-2 right-2">
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  inputText.trim() && !isTyping
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 shadow-lg hover:shadow-purple-500/50 transform hover:scale-110 hover:-translate-y-0.5 animate-pulse'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                }`}
                title={isTyping ? 'AI is typing...' : 'Send message (Enter)'}
              >
                {isTyping ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Helper text */}
          <div className="flex justify-between items-center mt-2 px-1">
            <div className="text-xs text-gray-500">
              {inputText.length > 0 && (
                <span className={inputText.length > 1000 ? 'text-red-400' : ''}>
                  {inputText.length}/1000
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-300 bg-gray-700 border border-gray-600 rounded">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-300 bg-gray-700 border border-gray-600 rounded">Shift+Enter</kbd> for new line
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}