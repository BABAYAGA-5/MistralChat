'use client';

import Navbar from './Navbar';
import { AuthProvider } from '@/contexts/AuthContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <Navbar />
      {children}
    </AuthProvider>
  );
}