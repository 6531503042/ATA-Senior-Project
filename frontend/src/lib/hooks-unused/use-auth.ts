import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, LoginCredentials } from '@/types/auth';
import { AxiosError } from 'axios';
import api from '@/utils/api';

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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Validate token
          try {
            const response = await api.get('/auth/validate');
            if (response.data.valid) {
              const userStr = localStorage.getItem('user');
              if (userStr) {
                const userData = JSON.parse(userStr);
                setUser(userData);
              }
            } else {
              handleLogout();
            }
          } catch (err) {
            console.error('Token validation error:', err);
            handleLogout();
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post('/auth/login', credentials);
      
      if (!response.data) {
        throw new Error('No response received from login');
      }

      const userInfo = response.data.user_info;
      if (!userInfo) {
        throw new Error('User info is missing from response');
      }

      // Store tokens
      const accessToken = response.headers['authorization']?.replace('Bearer ', '');
      const refreshToken = response.headers['refresh-token'];
      
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Store user info
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);

      // Redirect based on role
      if (userInfo.roles?.includes('ROLE_ADMIN')) {
        console.log('Redirecting to admin dashboard');
        router.push('/admin/dashboard');
      } else {
        console.log('Redirecting to user dashboard');
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

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
      router.push('/auth/login');
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