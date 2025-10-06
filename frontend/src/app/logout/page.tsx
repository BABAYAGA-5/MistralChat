'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout(() => {
        // Redirect to home after logout
        router.push('/');
      });
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Signing you out...
          </h2>
          <p className="text-sm text-gray-500">
            Please wait while we securely log you out.
          </p>
        </div>
      </div>
    </div>
  );
}