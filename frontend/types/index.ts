// Chat related types
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Conversation {
  id: number;
  user: number;
  title: string;
  created_at: string;
  updated_at: string;
}

// Auth related types
export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  first_name?: string;
  last_name?: string;
}

// Django API response types
export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  access: string;
  refresh: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  error?: string;
}

// Chat API types
export interface ChatResponse {
  message: string;
  content: string;
  conversation_id: number;
  timestamp: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface MessagesResponse {
  conversation_id: number;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

// Password reset types
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  new_password: string;
  new_password_confirmation: string;
}

// Email verification types
export interface EmailVerificationRequest {
  email: string;
  verification_code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user_id: number;
  email: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  user: User;
  access: string;
  refresh: string;
}