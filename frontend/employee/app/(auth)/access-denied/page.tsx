'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody } from '@heroui/react';
import { ShieldX, ArrowLeft, LogOut, User } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

export default function AccessDeniedPage() {
  const { user, signOut } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleGoBack = () => {
    router.back();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent_60%)]" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 backdrop-blur-sm rounded-full mb-6">
            <ShieldX className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/70">You don't have permission to access this area</p>
        </div>

        {/* Access Denied Card */}
        <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
          <CardBody className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Employee Access Required</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                This area is restricted to employees only. You need proper employee credentials to access the feedback system.
              </p>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-4 h-4 text-white/60" />
                  <span className="text-sm font-medium text-white/80">Current User</span>
                </div>
                <p className="text-white/70 text-sm">
                  {user.firstName} {user.lastName} ({user.username})
                </p>
                <p className="text-white/60 text-xs mt-1">
                  Roles: {user.roles.join(', ')}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoBack}
                className="w-full bg-white/15 hover:bg-white/25 text-white border border-white/20 font-medium"
                startContent={<ArrowLeft className="w-4 h-4" />}
              >
                Go Back
              </Button>
              
              <Button
                onClick={handleSignOut}
                variant="bordered"
                className="w-full border-red-400/50 text-red-300 hover:bg-red-500/20 font-medium"
                startContent={<LogOut className="w-4 h-4" />}
              >
                Sign Out
              </Button>
            </div>

            {/* Auto Redirect Notice */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/50 text-xs">
                You will be automatically redirected to the login page in 10 seconds.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-xs">
            Need help? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
