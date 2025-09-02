'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import useAuthStore from '@/stores/authStore';

export default function LogoutPage() {
  const { signOut } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut();
      router.push('/login');
    };

    handleLogout();
  }, [signOut, router]);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Logging out...</h2>
        <p className="text-muted-foreground">
          Please wait while we sign you out.
        </p>
      </div>
    </div>
  );
}
