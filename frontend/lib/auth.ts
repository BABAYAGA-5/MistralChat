import { User } from '@/types';

// Token storage key
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

/**
 * Set a cookie (works on both client and server)
 */
function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

/**
 * Remove a cookie
 */
function removeCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set authentication token in localStorage and cookies
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  setCookie('access_token', token);
}

/**
 * Remove authentication token from localStorage and cookies
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  // Clear localStorage items
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  
  // Clear cookies
  removeCookie('access_token');
  removeCookie('user_data');
  
  // Also clear any other auth-related localStorage items that might exist
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('auth_') || key.startsWith('user_')) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Store user data in localStorage and cookies
 */
export function setUserData(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setCookie('user_data', JSON.stringify(user));
}

/**
 * Get user data from localStorage
 */
export function getUserData(): User | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      removeAuthToken();
      return false;
    }
    
    return true;
  } catch {
    // Invalid token format
    removeAuthToken();
    return false;
  }
}

/**
 * Get user data from JWT token
 */
export function getUserFromToken(): User | null {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}