'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { ShieldX, ArrowLeft, LogOut, Home } from 'lucide-react';

import useAuthStore from '@/stores/authStore';

export default function AccessDeniedPage() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push('/login');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950 dark:via-zinc-900 dark:to-orange-950 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="w-full flex flex-col items-center gap-4">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <ShieldX className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Access Denied
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                You don't have permission to access this area
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-0 space-y-6">
          <div className="text-center">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Current User:</strong> {user?.username || 'Unknown'}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                <strong>Role:</strong> {user?.roles?.join(', ') || 'User'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              This admin panel requires administrator privileges. 
              Please contact your system administrator if you believe this is an error.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
                You will be automatically redirected to the login page in a few seconds.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              color="primary"
              variant="solid"
              size="lg"
              startContent={<LogOut className="w-4 h-4" />}
              onPress={handleSignOut}
              className="w-full"
            >
              Sign Out & Return to Login
            </Button>
            
            <Button
              color="default"
              variant="bordered"
              size="lg"
              startContent={<ArrowLeft className="w-4 h-4" />}
              onPress={handleGoBack}
              className="w-full"
            >
              Go Back
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Need help? Contact your system administrator
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


