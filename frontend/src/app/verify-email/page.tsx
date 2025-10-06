'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail, resendVerificationCode } from '@/lib/api';

function VerifyEmailForm() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !verificationCode) {
      setError('Please enter email and verification code');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await verifyEmail({ email, verification_code: verificationCode });
      
      // Don't store auth token - user should log in manually after verification
      
      setMessage('Email verified successfully! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 2000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsResending(true);
    setError('');
    setMessage('');

    try {
      await resendVerificationCode({ email });
      setMessage('Verification code sent successfully!');
      setCountdown(60); // 60 second cooldown
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification code';
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Verify Your Email
            </h1>
            <p className="text-gray-300 mt-2">
              Enter the 6-digit verification code sent to your email
            </p>
          </div>

          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-200 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                <p className="text-sm text-green-200">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !verificationCode}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm mb-4">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="text-purple-400 hover:text-purple-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </span>
              ) : countdown > 0 ? (
                `Resend code in ${countdown}s`
              ) : (
                'Resend verification code'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-gray-400 hover:text-gray-200 text-sm transition-colors duration-200"
            >
              ← Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}