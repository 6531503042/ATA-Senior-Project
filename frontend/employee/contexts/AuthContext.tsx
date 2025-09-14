'use client';

import type { AuthContextType } from '../types/auth';

import { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import useAuthStore from '../stores/authStore';
import { canAccessEmployee } from '../utils/roleUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Protected routes that require authentication
  const protectedRoutes = [
    '/',
    '/feedback-center',
    '/feedbacks',
    '/feedback',
  ];
  const authRoutes = ['/login', '/logout'];

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = auth.isLoggedIn();
      const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
      const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route),
      );

      if (!isLoggedIn && isProtectedRoute) {
        // Redirect to login if not authenticated and trying to access protected route
        router.push('/login');
      } else if (isLoggedIn && isAuthRoute && pathname !== '/logout') {
        // Redirect to home if authenticated and trying to access auth routes
        router.push('/');
      } else if (isLoggedIn && isProtectedRoute) {
        // Check if user has employee privileges for employee panel access
        const hasEmployeeAccess = canAccessEmployee(auth.user?.roles);
        if (!hasEmployeeAccess) {
          // Redirect non-employee users to a restricted access page
          router.push('/access-denied');
        }
      }
    };

    checkAuth();
  }, [auth, router, pathname]);

  // Auto-refresh token with better scheduling
  useEffect(() => {
    const startTokenRefresh = async () => {
      if (auth.isLoggedIn()) {
        // Initial check - only if user is logged in
        try {
          await auth.ensureValidSession();
        } catch (error) {
          console.warn('Initial token validation failed:', error);
        }

        // Set up interval for periodic checks (every 10 minutes instead of 4)
        refreshIntervalRef.current = setInterval(
          async () => {
            if (auth.isLoggedIn()) {
              try {
                console.log('Performing periodic token validation...');
                const success = await auth.ensureValidSession();

                if (!success) {
                  // If refresh failed, redirect to login
                  console.log('Token refresh failed, redirecting to login');
                  router.push('/login');
                }
              } catch (error) {
                console.warn('Periodic token validation failed:', error);
                // Don't redirect immediately on error, let it retry
              }
            }
          },
          10 * 60 * 1000,
        ); // Check every 10 minutes instead of 4
      }
    };

    const stopTokenRefresh = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };

    // Start token refresh when component mounts or auth state changes
    startTokenRefresh();

    // Cleanup on unmount
    return () => {
      stopTokenRefresh();
    };
  }, [auth, router]);

  // Additional effect to handle auth state changes
  useEffect(() => {
    if (!auth.isLoggedIn()) {
      // Clear interval if user is not logged in
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }
  }, [auth.isLoggedIn()]);

  const contextValue: AuthContextType = {
    user: auth.user,
    loading: auth.loading,
    signIn: async (username: string, password: string) => {
      const success = await auth.signIn(username, password);

      if (success) {
        router.push('/');
      }
    },
    signOut: async () => {
      // Clear refresh interval before signing out
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      await auth.signOut();
      router.push('/login');
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}