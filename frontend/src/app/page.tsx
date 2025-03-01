'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect authenticated users to their respective dashboards
        if (user?.roles.includes('ROLE_ADMIN')) {
          router.push('/admin/projects');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/auth/login');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // This will briefly show while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to HR Management System
        </h1>
        <p className="text-lg text-gray-600">
          Redirecting you to the appropriate dashboard...
        </p>
      </div>
    </div>
  );
}
