'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { registerUser } from '@/lib/api';
import { RegisterData, SignupResponse } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupResponse, setSignupResponse] = useState<SignupResponse | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/chat');
    }
  }, [user, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: RegisterData) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validatePasswordStrength = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    if (!/\d/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)' };
    }
    
    return { isValid: true, message: 'Password is strong' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    // Strong password validation
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await registerUser(formData);
      setSignupResponse(response);
      // Redirect to verification page with email parameter
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl animate-bounce"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-400 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (signupResponse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl animate-bounce"></div>
        </div>
        <div className="max-w-md w-full text-center relative z-10">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Check Your Email!
            </h3>
            <p className="text-gray-300 mb-4">
              We&apos;ve sent a 6-digit verification code to:
            </p>
            <p className="text-purple-400 font-semibold mb-4">
              {signupResponse.email}
            </p>
            <p className="text-gray-400 text-sm">
              Redirecting to verification page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/20 border border-red-500/30 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-sm text-red-200">{error}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-200">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="First name"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-200">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your password"
              />
              <div className="mt-2 text-xs text-gray-400">
                <p className="font-medium text-gray-300 mb-1">Password must contain:</p>
                <ul className="space-y-1">
                  <li>• At least 8 characters</li>
                  <li>• One uppercase letter (A-Z)</li>
                  <li>• One lowercase letter (a-z)</li>
                  <li>• One number (0-9)</li>
                  <li>• One special character (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)</li>
                </ul>
              </div>
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-200">
                Confirm Password *
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}