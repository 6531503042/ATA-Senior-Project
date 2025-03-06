import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, LoginCredentials } from '@/types/auth';
import { AxiosError } from 'axios';
import { auth } from '@/lib/api/auth';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
}

interface ApiErrorResponse {
  message: string;
  status: number;
  error?: string;
  details?: string[];
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      try {
        // Check if authenticated according to auth service
        if (auth.isAuthenticated()) {
          // Get user data
          const userData = auth.getUser();
          
          if (userData && isMounted) {
            setUser(userData as User);
          } else {
            // If no user data but supposedly authenticated, try to validate
            const isValid = await auth.validateToken();
            if (!isValid && isMounted) {
              // If token is invalid, clean up
              auth.logout();
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        // Don't automatically redirect on error, just clear the state
        auth.logout();
        setUser(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    initAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Simplified logout function that doesn't force redirect
  const handleLogout = useCallback(() => {
    console.log('Logging out user');
    auth.logout();
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await auth.login(credentials);
      
      if (!response) {
        throw new Error('No response received from login');
      }

      const userInfo = response.user_info;
      if (!userInfo) {
        throw new Error('User info is missing from response');
      }

      setUser(userInfo);
      
      // Redirect based on role
      if (userInfo.roles?.includes('ROLE_ADMIN')) {
        console.log('Redirecting to admin dashboard');
        router.push('/admin/dashboard');
      } else {
        console.log('Redirecting to employee dashboard');
        router.push('/employee');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse;
        console.error('API Error Response:', apiError);
        
        // Handle different error scenarios
        if (apiError.status === 500) {
          setError('Server error. Please try again later.');
        } else if (apiError.details?.length) {
          setError(apiError.details[0]);
        } else {
          setError(apiError.message || 'Login failed. Please check your credentials.');
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    error,
  };
}