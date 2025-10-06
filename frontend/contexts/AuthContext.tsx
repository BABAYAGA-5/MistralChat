'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials } from '@/types';
import { loginUser, getCurrentUser, initializeCsrfToken } from '@/lib/api';
import { getAuthToken, setAuthToken, removeAuthToken, setUserData, getUserData } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<any>;
  logout: (redirectCallback?: () => void) => Promise<void>;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Initialize CSRF token first
      try {
        await initializeCsrfToken();
      } catch (err) {
        console.warn('CSRF token initialization failed:', err);
      }
      
      const token = getAuthToken();
      
      if (token) {
        try {
          // Check token expiration first
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (payload.exp && payload.exp < currentTime) {
            removeAuthToken();
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          // Try to get stored user data first
          const storedUser = getUserData();
          if (storedUser) {
            setUser(storedUser);
            setIsLoading(false);
            return;
          }
          
          // If no stored user, fetch from API
          const userData = await getCurrentUser();
          setUser(userData);
          setUserData(userData);
        } catch (err) {
          console.error('Auth check failed:', err);
          removeAuthToken();
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();

    const tokenCheckInterval = setInterval(() => {
      const token = getAuthToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (payload.exp && payload.exp < currentTime) {
            removeAuthToken();
            setUser(null);
          }
        } catch (err) {
          console.error('Token validation failed:', err);
          removeAuthToken();
          setUser(null);
        }
      }
    }, 60000);

    return () => clearInterval(tokenCheckInterval);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await loginUser(credentials);
      setAuthToken(response.access);
      
      const userData = response.user;
      setUserData(userData);
      setUser(userData);
      
      // Return user data to confirm authentication is complete
      return { success: true, user: userData };
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      
      const requiresVerification = err.response?.requires_verification;
      const email = err.response?.email;
      
      return { 
        success: false, 
        error: errorMessage, 
        requiresVerification,
        email 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (redirectCallback?: () => void) => {
    try {
      setIsLoading(true);
      
      // Clear all authentication data
      removeAuthToken();
      setUser(null);
      setError(null);
      
      // Wait a small moment to ensure state is cleared
      await new Promise(resolve => setTimeout(resolve, 50));
      
      if (redirectCallback) {
        redirectCallback();
      }
    } catch (err) {
      // Even if there's an error, clear everything
      removeAuthToken();
      setUser(null);
      setError(null);
      
      if (redirectCallback) {
        redirectCallback();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}