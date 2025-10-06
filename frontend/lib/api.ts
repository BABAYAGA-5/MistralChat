import { LoginCredentials, RegisterData, User, AuthResponse, ChatResponse, PasswordResetRequest, PasswordReset, ConversationsResponse, MessagesResponse, EmailVerificationRequest, ResendVerificationRequest, SignupResponse, VerificationResponse } from '@/types';
import { getAuthToken, setUserData, getUserData } from './auth';
import { AUTH_ENDPOINTS, MESSAGING_ENDPOINTS, buildApiUrl, buildApiUrlWithParams } from './endpoints';

class ApiRequestError extends Error {
  public response?: unknown;
  
  constructor(message: string, public status?: number, response?: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.response = response;
  }
}

// CSRF Token Management
function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
}

async function fetchCsrfToken(): Promise<void> {
  try {
    const url = buildApiUrl(AUTH_ENDPOINTS.CSRF_TOKEN);
    await fetch(url, {
      method: 'GET',
      credentials: 'include', // Important for CSRF cookies
    });
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildApiUrl(endpoint);
  const token = getAuthToken();
  const csrfToken = getCsrfToken();
  
  // Determine if this is a state-changing request that needs CSRF protection
  const isStateChanging = options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase());
  
  // Fetch CSRF token if needed and not available
  if (isStateChanging && !csrfToken) {
    await fetchCsrfToken();
  }
  
  const config: RequestInit = {
    credentials: 'include', // Important for CSRF cookies
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(isStateChanging && getCsrfToken() && { 'X-CSRFToken': getCsrfToken()! }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new ApiRequestError(
        data.message || data.error || `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    console.error('DEBUG: API request error:', error);
    if (error instanceof ApiRequestError) {
      throw error;
    }
    throw new ApiRequestError('Network error occurred');
  }
}

// Auth API functions
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (!response.success) {
    throw new ApiRequestError(response.message || 'Login failed');
  }

  return response;
}

export async function registerUser(userData: RegisterData): Promise<SignupResponse> {
  const response = await apiRequest<SignupResponse>(AUTH_ENDPOINTS.SIGNUP, {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (!response.success) {
    throw new ApiRequestError(response.message || 'Registration failed');
  }

  return response;
}

// Email verification functions
export async function verifyEmail(data: EmailVerificationRequest): Promise<VerificationResponse> {
  const response = await apiRequest<VerificationResponse>(AUTH_ENDPOINTS.VERIFY_EMAIL, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.success) {
    throw new ApiRequestError(response.message || 'Email verification failed');
  }

  return response;
}

export async function resendVerificationCode(data: ResendVerificationRequest): Promise<{ message: string }> {
  const response = await apiRequest<{ message: string }>(AUTH_ENDPOINTS.RESEND_VERIFICATION_CODE, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return response;
}

export async function getCurrentUser(): Promise<User> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiRequestError('No authentication token');
  }
  
  // Try to get stored user data first
  const storedUser = getUserData();
  if (storedUser) {
    return storedUser;
  }
  
  // Fallback to decoding JWT if no stored data
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userData = {
      id: payload.user_id,
      email: payload.email || '',
    };
    
    setUserData(userData);
    return userData;
  } catch {
    throw new ApiRequestError('Invalid token');
  }
}

// Chat API functions
export async function sendChatMessage(text: string, conversationId?: number): Promise<ChatResponse> {
  const response = await apiRequest<ChatResponse>(MESSAGING_ENDPOINTS.SEND_MESSAGE, {
    method: 'POST',
    body: JSON.stringify({ 
      text,
      ...(conversationId && { conversation_id: conversationId })
    }),
  });

  return response;
}

export async function getConversations(): Promise<ConversationsResponse> {
  const response = await apiRequest<ConversationsResponse>(MESSAGING_ENDPOINTS.GET_CONVERSATIONS, {
    method: 'GET',
  });
  return response;
}

export async function getMessages(conversationId: number): Promise<MessagesResponse> {
  const url = buildApiUrlWithParams(MESSAGING_ENDPOINTS.GET_MESSAGES, {
    conversation_id: conversationId
  });
  
  // Use direct fetch since we need custom URL with params
  const token = getAuthToken();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch messages' }));
    throw new ApiRequestError(errorData.error || 'Failed to fetch messages');
  }

  const data = await response.json();
  return data;
}

// Password reset functions
export async function sendPasswordResetEmail(data: PasswordResetRequest): Promise<{ message: string }> {
  const response = await apiRequest<{ message: string }>(AUTH_ENDPOINTS.SEND_RESET_EMAIL, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return response;
}

export async function resetPassword(data: PasswordReset): Promise<{ message: string }> {
  const response = await apiRequest<{ message: string }>(AUTH_ENDPOINTS.RESET_PASSWORD, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return response;
}

// Health check
export async function healthCheck(): Promise<{ status: string }> {
  return await apiRequest(AUTH_ENDPOINTS.HEALTH_CHECK);
}

// Initialize CSRF token for the app
export async function initializeCsrfToken(): Promise<void> {
  try {
    await fetchCsrfToken();
  } catch (error) {
    console.warn('Failed to initialize CSRF token:', error);
  }
}

// Debug function to check CSRF token
export function debugCsrfToken(): void {
  const token = getCsrfToken();
  console.log('Current CSRF token:', token);
  console.log('All cookies:', document.cookie);
}