'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await sendPasswordResetEmail({ email: email.trim() });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl animate-bounce"></div>
        </div>
        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              We&apos;ve sent a password reset link to <strong className="text-purple-400">{email}</strong>
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                try again
              </button>
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="font-medium text-purple-400 hover:text-purple-300"
              >
                Back to login
              </Link>
            </div>
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
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email address and we&apos;ll send you a link to reset your password.
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
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Send reset link'
              )}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/login"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Back to login
            </Link>
            <br />
            <Link
              href="/register"
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}