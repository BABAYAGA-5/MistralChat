'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout(() => router.push('/'));
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-gray-700/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="relative p-1 rounded-xl transition-all duration-300">
              <Image 
                src="/logo.svg" 
                alt="MistralChat Logo" 
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                MistralChat
              </span>
              <span className="text-xs text-gray-400 font-medium tracking-wide">
                AI Companion
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-700/30 animate-pulse" />
            ) : user ? (
              <>
                <Link href="/chat" className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800/30 hover:bg-gray-700/40 transition-all text-gray-200 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="hidden sm:inline text-sm">Chat</span>
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-800/30 hover:bg-gray-700/40 transition-all group text-gray-200 hover:text-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden md:inline text-sm">{user.email}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 shadow-xl overflow-hidden">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-700/50">
                          <p className="text-sm text-gray-400">Signed in as</p>
                          <p className="text-sm font-medium truncate text-gray-200">{user.email}</p>
                        </div>
                        
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm hover:bg-gray-800/50 transition-all text-gray-200 hover:text-white"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          View Profile
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-500/20 transition-all text-left group text-gray-200"
                        >
                          <svg className="w-4 h-4 mr-3 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="group-hover:text-red-400">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="px-4 py-2 text-sm rounded-xl hover:bg-gray-800/30 transition-all text-gray-200 hover:text-white">
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 transition-all text-white">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
