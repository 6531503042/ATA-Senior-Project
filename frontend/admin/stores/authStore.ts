import type { AuthStore, LoginRequest } from '@/types/auth';
import type { User } from '@/types/user';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { addToast } from '@heroui/react';

import { getToken, saveToken, removeToken } from '@/utils/storage';
import { isTokenExpired, isTokenExpiringSoon } from '@/utils/token';
import { login, logout, refresh, validate } from '@/services/authService';
import { canAccessAdmin } from '@/utils/roleUtils';

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      loading: false,
      error: null,
      user: null,

      signIn: async (username, password) => {
        try {
          set({ loading: true, error: null });
          console.log('Attempting login for user:', username);

          const loginRequest: LoginRequest = { username, password };
          const response = await login(loginRequest);

          console.log('Login response received:', response);

          saveToken('accessToken', response.accessToken);
          saveToken('refreshToken', response.refreshToken);

          const user: User = {
            id: response.userId,
            username: response.username,
            firstName: response.username,
            lastName: '',
            email: response.email,
            roles: response.roles,
            active: true,
            departments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Check if user has admin access
          const hasAdminAccess = canAccessAdmin(user.roles);
          if (!hasAdminAccess) {
            // Clear tokens if user doesn't have admin access
            removeToken('accessToken');
            removeToken('refreshToken');
            
            addToast({
              title: 'Access Denied',
              color: 'danger',
              description: 'You do not have administrator privileges to access this panel.',
              variant: 'solid',
            });
            
            set({ user: null, loading: false, error: 'Insufficient privileges. Admin access required.' });
            return false;
          }

          set({ user, loading: false });

          addToast({
            title: 'Admin Access Granted',
            color: 'success',
            description: `Welcome back, ${user.firstName}! You have administrator privileges.`,
            variant: 'solid',
          });

          return true;
        } catch (err: any) {
          console.error('Login error details:', err);

          let errorMessage = 'Login failed. Please check your credentials.';

          if (err?.code === 'NETWORK_ERROR') {
            errorMessage =
              'Cannot connect to server. Please check if the backend is running on http://localhost:8080';
          } else if (err?.code === 'HTTP_401') {
            errorMessage = 'Invalid username or password.';
          } else if (err?.code === 'HTTP_404') {
            errorMessage =
              'Login endpoint not found. Please check the backend API.';
          } else if (err?.code === 'HTTP_500') {
            errorMessage = 'Server error. Please try again later.';
          } else if (err?.message) {
            errorMessage = err.message;
          }

          set({ error: errorMessage, loading: false });

          addToast({
            title: 'Login failed',
            color: 'danger',
            description: errorMessage,
            variant: 'solid',
          });

          return false;
        }
      },

      signOut: async () => {
        try {
          await logout();
        } catch (err) {
          console.warn('Logout API call failed:', err);
        }

        set({ user: null, error: null });

        removeToken('accessToken');
        removeToken('refreshToken');

        addToast({
          title: 'Logged out',
          color: 'success',
          description: 'You have successfully logged out.',
          variant: 'solid',
        });
      },

      refreshToken: async () => {
        try {
          const refreshToken = getToken('refreshToken');

          if (!refreshToken) {
            console.log('No refresh token available');

            return false;
          }

          console.log('Attempting to refresh token...');
          const response = await refresh(refreshToken);

          saveToken('accessToken', response.accessToken);
          saveToken('refreshToken', response.refreshToken);

          console.log('Token refreshed successfully');

          if (response.userId) {
            const user: User = {
              id: response.userId,
              username: response.username,
              firstName: response.username,
              lastName: '',
              email: response.email,
              roles: response.roles,
              active: true,
              departments: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            set({ user });
          }

          return true;
        } catch (err) {
          console.error('Token refresh failed:', err);

          set({ user: null, error: 'Session expired. Please log in again.' });
          removeToken('accessToken');
          removeToken('refreshToken');

          addToast({
            title: 'Session expired',
            color: 'warning',
            description: 'Please log in again to continue.',
            variant: 'solid',
          });

          return false;
        }
      },

      isLoggedIn: () => {
        const accessToken = getToken('accessToken');

        return !!accessToken && !!get().user;
      },

      ensureValidSession: async () => {
        const accessToken = getToken('accessToken');

        if (!accessToken) {
          console.log('No access token found');

          return false;
        }

        if (isTokenExpiringSoon(accessToken)) {
          console.log('Token expiring soon, refreshing...');

          return await get().refreshToken();
        }

        if (isTokenExpired(accessToken)) {
          console.log('Token expired, refreshing...');

          return await get().refreshToken();
        }

        const lastValidation = getToken('lastValidation');
        const now = Date.now();
        const validationInterval = 10 * 60 * 1000;

        if (
          !lastValidation ||
          now - parseInt(lastValidation) > validationInterval
        ) {
          try {
            console.log('Performing token validation with backend...');
            const validation = await validate();

            saveToken('lastValidation', now.toString());

            if (!validation.valid) {
              console.log('Token validation failed, refreshing...');

              return await get().refreshToken();
            }
          } catch (err) {
            console.log('Token validation error, attempting refresh...', err);

            return await get().refreshToken();
          }
        }

        return true;
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure loading is false after hydration
          state.loading = false;
          console.log('Auth store rehydrated:', { 
            user: state.user?.username, 
            roles: state.user?.roles,
            loading: state.loading 
          });
        }
      },
    },
  ),
);

export default useAuthStore;
