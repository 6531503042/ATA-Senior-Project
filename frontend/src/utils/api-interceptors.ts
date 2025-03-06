// src/utils/api-interceptors.ts
import axios from 'axios';
import { auth } from '@/lib/api/auth';
import { getCookie } from 'cookies-next';

// Add request interceptor to include token in all requests
export const setupInterceptors = () => {
  axios.interceptors.request.use(
    async (config) => {
      // Check if token is expired before making the request
      if (auth.isAuthenticated()) {
        const token = getCookie('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        // If token exists but is expired, try to refresh
        if (getCookie('accessToken') && !auth.isTokenValid()) {
          try {
            const refreshed = await auth.refreshToken();
            if (refreshed) {
              const newToken = getCookie('accessToken');
              if (newToken) {
                config.headers.Authorization = `Bearer ${newToken}`;
              }
            } else {
              // If refresh failed, handle session expiration
              handleSessionExpired();
            }
          } catch (error) {
            handleSessionExpired();
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle expired token errors
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 Unauthorized and we haven't tried to refresh yet
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        getCookie('accessToken')
      ) {
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token
          const refreshSuccess = await auth.refreshToken();
          
          if (refreshSuccess) {
            // If refresh successful, update the Authorization header
            const newToken = getCookie('accessToken');
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              // Retry the original request with the new token
              return axios(originalRequest);
            }
          }
          
          // If refresh failed, handle session expiration
          handleSessionExpired();
        } catch (refreshError) {
          // If token refresh fails, handle session expiration
          handleSessionExpired();
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Helper function to handle expired sessions
const handleSessionExpired = () => {
  // Clear auth data
  auth.logout();
  
  // Dispatch event for components to react to
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:session-expired'));
    
    // Redirect to login page with expired session parameter
    if (!window.location.pathname.includes('/auth/login')) {
      window.location.href = '/auth/login?session=expired';
    }
  }
};

export default setupInterceptors;