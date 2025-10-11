'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';

export default function RootPage() {
  const router = useRouter();
  const auth = useAuthStore();

  useEffect(() => {
    const handleRoute = () => {
      // Wait for hydration
      setTimeout(() => {
        const isLoggedIn = auth.isLoggedIn();
        console.log('Root page routing:', { isLoggedIn, user: auth.user?.username });

        if (isLoggedIn) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      }, 100);
    };

    handleRoute();
  }, [router, auth]);

  // Show loading while determining route
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
