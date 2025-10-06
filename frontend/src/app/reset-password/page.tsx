'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/lib/api';
import { PasswordReset } from '@/types';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState<PasswordReset>({
    token: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      setFormData(prev => ({ ...prev, token }));
    } else {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (formData.new_password !== formData.new_password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    // Strong password validation
    const passwordValidation = validatePasswordStrength(formData.new_password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    if (!formData.token) {
      setError('Invalid reset token');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await resetPassword(formData);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Password Reset Successful
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Redirecting to login page in 3 seconds...
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Go to login now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Enter your new password below
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 backdrop-blur-sm p-3 rounded-xl border border-red-500/20">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  required
                  value={formData.new_password}
                  onChange={handleChange}
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-white/20 placeholder-gray-400 text-white bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your new password"
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
                <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  type="password"
                  required
                  value={formData.new_password_confirmation}
                  onChange={handleChange}
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-white/20 placeholder-gray-400 text-white bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your new password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !formData.token}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
              >
                ← Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}