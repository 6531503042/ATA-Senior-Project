import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login, logout, refresh, validate } from '../services/authService';
import { setToken, clearTokens } from '../libs/storage';
import type { AuthStore } from '../types/auth';
import type { User, UserRole, UserStatus } from '../types/user';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,

      // Computed properties
      get isLoggedIn() {
        return !!this.user && !!this.accessToken;
      },

      // Actions
      signIn: async (username: string, password: string) => {
        try {
          set({ loading: true, error: null });
          
          const response = await login({ username, password });
          const { accessToken, refreshToken, userId, username: responseUsername, email, roles } = response;
          
          // Create user object from response
          const user: User = {
            id: userId.toString(),
            username: responseUsername,
            email,
            firstName: responseUsername, // Use username as firstName for now
            lastName: '', // Empty for now
            role: 'user' as UserRole, // Default role
            roles: roles || [],
            status: 'active' as UserStatus, // Default status
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          // Check if user has employee access
          const hasEmployeeAccess = user.roles.includes('employee') || user.roles.includes('user') || user.roles.includes('ADMIN');
          if (!hasEmployeeAccess) {
            throw new Error('Access denied. Employee role required.');
          }

          // Store tokens in storage
          setToken('accessToken', accessToken);
          setToken('refreshToken', refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            loading: false,
            error: null,
          });
          return true;
        } catch (error: any) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            loading: false,
            error: error.message || 'Login failed',
          });
          throw error;
        }
      },

      signOut: async () => {
        try {
          const { accessToken } = get();
          if (accessToken) {
            await logout();
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear tokens from storage
          clearTokens();
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            loading: false,
            error: null,
          });
        }
      },

      refreshTokens: async (): Promise<string> => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await refresh(refreshToken);
          const { accessToken } = response;
          
          // Update token in storage
          setToken('accessToken', accessToken);
          
          set({
            accessToken,
            loading: false,
            error: null,
          });

          return accessToken;
        } catch (error: any) {
          // Clear tokens from storage on refresh failure
          clearTokens();
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            loading: false,
            error: error.message || 'Token refresh failed',
          });
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      ensureValidSession: async () => {
        try {
          const { accessToken, refreshToken } = get();
          if (!accessToken) {
            return false;
          }

          // Validate current token
          try {
            await validate();
            return true;
          } catch (error) {
            // Try to refresh token
            if (refreshToken) {
              try {
                await get().refreshTokens();
                return true;
              } catch (refreshError) {
                // Refresh failed, clear session
                get().signOut();
                return false;
              }
            }
            return false;
          }
        } catch (error) {
          console.error('Session validation error:', error);
          return false;
        }
      },
    }),
    {
      name: 'employee-auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
