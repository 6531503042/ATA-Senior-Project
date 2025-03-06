import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { LoginRequest } from '@/lib/api/auth';
import { AxiosError } from 'axios';
import { auth } from '@/lib/api/auth';

interface UseAuthReturn {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
  timeUntilExpiration: number | null;
}

interface ApiErrorResponse {
  message: string;
  status: number;
  error?: string;
  details?: string[];
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilExpiration, setTimeUntilExpiration] = useState<number | null>(null);

  // Function to check token status and update state
  const checkTokenStatus = useCallback(() => {
    if (auth.isAuthenticated()) {
      const userData = auth.getUser();
      if (userData) {
        setUser(userData);
        
        // Update time until expiration
        const timeLeft = auth.getTimeUntilExpiration();
        setTimeUntilExpiration(timeLeft);
        
        // If token is about to expire, try to refresh it
        if (auth.isTokenAboutToExpire()) {
          auth.refreshToken().catch(() => {
            console.warn('Failed to refresh token that was about to expire');
          });
        }
      } else {
        // If authenticated but no user data, something is wrong
        auth.logout();
        setUser(null);
        setTimeUntilExpiration(null);
      }
    } else {
      // Not authenticated (possibly expired token)
      auth.logout();
      setUser(null);
      setTimeUntilExpiration(null);
    }
  }, []);

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
            setUser(userData);
            setTimeUntilExpiration(auth.getTimeUntilExpiration());
          } else {
            // If no user data but supposedly authenticated, try to validate
            const isValid = await auth.validateToken();
            if (!isValid && isMounted) {
              // If token is invalid, clean up
              auth.logout();
              setUser(null);
              setTimeUntilExpiration(null);
            }
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        // Don't automatically redirect on error, just clear the state
        auth.logout();
        setUser(null);
        setTimeUntilExpiration(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    initAuth();
    
    // Set up token expiration check interval (every minute)
    const tokenCheckInterval = setInterval(() => {
      if (isMounted) {
        checkTokenStatus();
      }
    }, 30000); // Check every minute
    
    // Set up event listener for session expired events
    const handleSessionExpired = () => {
      if (isMounted) {
        setUser(null);
        setTimeUntilExpiration(null);
        setError('Your session has expired. Please log in again.');
      }
    };
    
    window.addEventListener('auth:session-expired', handleSessionExpired);
    
    return () => {
      isMounted = false;
      clearInterval(tokenCheckInterval);
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [checkTokenStatus]);

  // Simplified logout function
  const handleLogout = useCallback(() => {
    console.log('Logging out user');
    auth.logout();
    setUser(null);
    setTimeUntilExpiration(null);
    router.push('/auth/login');
  }, [router]);

  const handleLogin = async (credentials: LoginRequest) => {
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
      setTimeUntilExpiration(auth.getTimeUntilExpiration());
      
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
    timeUntilExpiration,
  };
}