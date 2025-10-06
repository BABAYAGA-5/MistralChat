'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    await logout(() => router.push('/'));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          <p className="text-gray-200">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative pt-32 pb-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <svg className="w-4 h-4 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm text-purple-200">User Profile</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                My Profile
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-2xl">
                  <span className="text-4xl font-bold text-white">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : 'User'
                  }
                </h2>
                <p className="text-lg text-gray-300 mb-4">{user.email}</p>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                    ✓ Email Verified
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                    Active User
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-3">
                <Link
                  href="/chat"
                  className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 text-center"
                >
                  Back to Chat
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="mb-8">
            {/* Account Information */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Account Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                  <div className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                    {user.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <div className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : 'Not set'
                    }
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">User ID</label>
                  <div className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                    #{user.id}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Account Status</label>
                  <div className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-red-300 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Danger Zone
            </h3>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h4 className="text-white font-medium">Sign Out</h4>
                <p className="text-gray-400 text-sm">Sign out of your account on this device</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl font-semibold transition-all border border-red-500/30 hover:border-red-500/50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}