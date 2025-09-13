'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../stores/authStore';
import { validate } from '../services/authService';
import { getToken, setToken, clearTokens } from '../libs/storage';
import type { AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const authStore = useAuthStore();

  // Protected routes that require authentication
  const protectedRoutes = ['/', '/feedback', '/feedbacks', '/feedback-center'];
  const authRoutes = ['/login'];

  const isProtectedRoute = (path: string) => {
    return protectedRoutes.some(route => path.startsWith(route));
  };

  const isAuthRoute = (path: string) => {
    return authRoutes.some(route => path.startsWith(route));
  };

  // Check if user has employee role
  const hasEmployeeAccess = (userRoles: string[]) => {
    return userRoles.includes('employee') || userRoles.includes('user');
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken('accessToken');
        if (token) {
          // Verify token and get user info
          const userData = await validate();
          if (userData && hasEmployeeAccess(userData.roles)) {
            authStore.setUser({
              id: userData.userId,
              username: userData.username,
              email: '',
              firstName: '',
              lastName: '',
              roles: userData.roles,
              active: true,
              createdAt: '',
              updatedAt: ''
            });
            const refreshToken = getToken('refreshToken');
            authStore.setTokens(token, refreshToken || '');
          } else {
            // User doesn't have employee access
            clearTokens();
            authStore.setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearTokens();
        authStore.setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Route protection
  useEffect(() => {
    if (loading) {
      console.log('⏳ Auth loading, skipping route protection');
      return;
    }

    const isAuthenticated = authStore.isLoggedIn;
    const isOnProtectedRoute = isProtectedRoute(pathname);
    const isOnAuthRoute = isAuthRoute(pathname);

    console.log('🛡️ Route protection check:', {
      pathname,
      isAuthenticated,
      isOnProtectedRoute,
      isOnAuthRoute,
      userRoles: authStore.user?.roles,
      hasAccess: hasEmployeeAccess(authStore.user?.roles || [])
    });

    if (!isAuthenticated && isOnProtectedRoute) {
      // Redirect to login if not authenticated and on protected route
      console.log('🔒 Redirecting to login - not authenticated');
      router.replace('/login');
    } else if (isAuthenticated && isOnAuthRoute) {
      // Redirect to home if authenticated and on auth route
      console.log('🏠 Redirecting to home - authenticated on auth route');
      router.replace('/');
    } else if (isAuthenticated && isOnProtectedRoute && !hasEmployeeAccess(authStore.user?.roles || [])) {
      // Redirect to access denied if user doesn't have employee access
      console.log('🚫 Redirecting to access denied - no employee access');
      router.replace('/access-denied');
    } else {
      console.log('✅ Route protection - no redirect needed');
    }
  }, [authStore.user, loading, pathname, router]);

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Starting sign in process...');
      
      await authStore.signIn(username, password);
      console.log('✅ Auth store sign in successful');
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force redirect to home page
      console.log('🔄 Redirecting to home page...');
      window.location.href = '/';
      console.log('✅ Redirect initiated');
      
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authStore.signOut();
      // Clear tokens from storage
      clearTokens();
      router.replace('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = getToken('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const newAccessToken = await authStore.refreshTokens();
      setToken('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, sign out user
      await signOut();
      throw error;
    }
  };

  const value: AuthContextType = {
    user: authStore.user,
    loading: loading || authStore.loading,
    signIn,
    signOut,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
