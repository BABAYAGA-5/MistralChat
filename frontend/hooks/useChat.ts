'use client';

import { useState, useCallback } from 'react';
import { sendChatMessage, getConversations, getMessages } from '@/lib/api';
import { Message, Conversation } from '@/types';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getConversations();
      setConversations(response.conversations);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: number) => {
    try {
      setIsLoading(true);
      
      // Check localStorage first
      const cacheKey = `conversation_${conversationId}`;
      const cachedMessages = localStorage.getItem(cacheKey);
      
      if (cachedMessages) {
        try {
          const parsedMessages = JSON.parse(cachedMessages);
          const formattedMessages: Message[] = parsedMessages.map((msg: any, index: number) => {
            // Handle both message formats: {sender, text} and {role, content}
            const isUser = msg.sender === 'user' || msg.role === 'user';
            const content = msg.text || msg.content || '';
            
            return {
              id: `${conversationId}-${index}`,
              text: content,
              isUser: isUser,
              timestamp: new Date(msg.timestamp)
            };
          });
          setMessages(formattedMessages);
          setCurrentConversationId(conversationId);
          setIsLoading(false);
          return; // Use cached data, no need to fetch from server
        } catch (parseError) {
          console.error('Error parsing cached messages:', parseError);
          // Continue to fetch from server if cache is corrupted
        }
      }
      
      // Fetch from server if not in cache
      const response = await getMessages(conversationId);
      const formattedMessages: Message[] = response.messages.map((msg: any, index: number) => {
        // Handle both message formats: {sender, text} and {role, content}
        const isUser = msg.sender === 'user' || msg.role === 'user';
        const content = msg.text || msg.content || '';
        
        return {
          id: `${conversationId}-${index}`,
          text: content,
          isUser: isUser,
          timestamp: new Date(msg.timestamp)
        };
      });
      
      // Cache the messages
      localStorage.setItem(cacheKey, JSON.stringify(response.messages));
      
      setMessages(formattedMessages);
      setCurrentConversationId(conversationId);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
    setError(null);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setError(null);
    setIsTyping(true);

    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await sendChatMessage(text.trim(), currentConversationId || undefined);
      
      // If this was a new conversation, update the current conversation ID
      if (!currentConversationId && response.conversation_id) {
        setCurrentConversationId(response.conversation_id);
        // Reload conversations to include the new one
        loadConversations();
      }

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.content,
        isUser: false,
        timestamp: new Date(response.timestamp),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Clear cache for this conversation since we have new messages
      if (response.conversation_id) {
        const cacheKey = `conversation_${response.conversation_id}`;
        localStorage.removeItem(cacheKey);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      // Remove the user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsTyping(false);
    }
  }, [currentConversationId, loadConversations]);

  return {
    messages,
    conversations,
    currentConversationId,
    isTyping,
    error,
    isLoading,
    sendMessage,
    loadConversations,
    loadMessages,
    startNewConversation,
    clearError,
  };
}