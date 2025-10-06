import { env } from '../env';

// API Configuration
export const API_CONFIG = {
  BASE_URL: env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login/',
  SIGNUP: '/auth/signup/',
  LOGOUT: '/auth/logout/',
  REFRESH: '/auth/refresh/',
  SEND_RESET_EMAIL: '/auth/send_reset_password_email/',
  RESET_PASSWORD: '/auth/reset_password/',
  VERIFY_EMAIL: '/auth/verify_email/',
  RESEND_VERIFICATION_CODE: '/auth/resend_verification_code/',
  HEALTH_CHECK: '/auth/test/',
  CSRF_TOKEN: '/auth/csrf_token/',
} as const;

// Messaging/Chat Endpoints
export const MESSAGING_ENDPOINTS = {
  SEND_MESSAGE: '/messaging/send/',
  GET_MESSAGES: '/messaging/messages/',
  GET_CONVERSATIONS: '/messaging/conversations/',
  DELETE_CONVERSATION: '/messaging/conversations/delete/',
  UPDATE_CONVERSATION: '/messaging/conversations/update/',
} as const;


// Utility function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Utility function to build URL with query parameters
export const buildApiUrlWithParams = (endpoint: string, params: Record<string, string | number>): string => {
  const url = new URL(endpoint, API_CONFIG.BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  return url.toString();
};

// Export all endpoints in one object for easy access
export const API_ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  ...MESSAGING_ENDPOINTS,
} as const;

// Type for all possible endpoints
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];