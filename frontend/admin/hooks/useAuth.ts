"use client"

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addToast } from "@heroui/react";

import { api } from "@/libs/apiClient";
import { getToken, saveToken, removeToken } from "@/utils/storage";
import type { 
  AuthStore, 
  JwtResponse, 
  LoginRequest, 
  TokenValidationResponse
} from "@/types/auth";
import type { User } from "@/types/user";

const useAuth = create<AuthStore>()(
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
          
          const response = await api.post<JwtResponse>('/api/auth/login', loginRequest, { auth: false });
          console.log('Login response received:', response);

          // Save tokens
          saveToken("accessToken", response.accessToken);
          saveToken("refreshToken", response.refreshToken);

          // Create user object from response
          const user: User = {
            id: response.userId,
            username: response.username,
            firstName: response.username, // Backend doesn't provide firstName, using username
            lastName: '', // Backend doesn't provide lastName
            email: response.email,
            roles: response.roles,
            active: true,
            departments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set({ user, loading: false });

          addToast({
            title: "Login successful",
            color: "success",
            description: `Welcome back, ${user.firstName}!`,
            variant: "solid",
          });

          return true;

        } catch (err: any) {
          console.error('Login error details:', err);
          
          let errorMessage = "Login failed. Please check your credentials.";
          
          if (err?.code === 'NETWORK_ERROR') {
            errorMessage = "Cannot connect to server. Please check if the backend is running on http://localhost:8080";
          } else if (err?.code === 'HTTP_401') {
            errorMessage = "Invalid username or password.";
          } else if (err?.code === 'HTTP_404') {
            errorMessage = "Login endpoint not found. Please check the backend API.";
          } else if (err?.code === 'HTTP_500') {
            errorMessage = "Server error. Please try again later.";
          } else if (err?.message) {
            errorMessage = err.message;
          }
          
          set({ error: errorMessage, loading: false });
          
          addToast({
            title: "Login failed",
            color: "danger",
            description: errorMessage,
            variant: "solid",
          });

          return false;
        }
      },

      signOut: async () => {
        try {
          // Call logout endpoint (optional for mock auth)
          await api.post<void>('/api/auth/logout');
        } catch (err) {
          // Continue with logout even if API call fails
          console.warn("Logout API call failed:", err);
        }

        // Clear local state
        set({ user: null, error: null });
        
        // Remove tokens
        removeToken("accessToken");
        removeToken("refreshToken");

        addToast({
          title: "Logged out",
          color: "success",
          description: "You have successfully logged out.",
          variant: "solid",
        });
      },

      refreshToken: async () => {
        try {
          const refreshToken = getToken("refreshToken");
          if (!refreshToken) return false;

          const response = await api.post<JwtResponse>('/api/auth/refresh-token', {}, { 
            headers: { 'Refresh-Token': refreshToken },
            auth: false 
          });

          // Save new tokens
          saveToken("accessToken", response.accessToken);
          saveToken("refreshToken", response.refreshToken);

          // Get updated user profile
          const userResponse = await api.get<User>('/api/users/me');
          set({ user: userResponse });

          return true;
        } catch (err) {
          // Token refresh failed, clear everything
          set({ user: null, error: "Session expired. Please log in again." });
          removeToken("accessToken");
          removeToken("refreshToken");
          
          addToast({
            title: "Session expired",
            color: "warning",
            description: "Please log in again to continue.",
            variant: "solid",
          });

          return false;
        }
      },

      isLoggedIn: () => {
        const accessToken = getToken("accessToken");
        return !!accessToken && !!get().user;
      },

      ensureValidSession: async () => {
        const accessToken = getToken("accessToken");
        if (!accessToken) return false;

        // Check if token is expired
        if (isTokenExpired(accessToken)) {
          return await get().refreshToken();
        }

        // Validate token with backend
        try {
          const validation = await api.get<TokenValidationResponse>('/api/auth/validate', undefined, { auth: false });
          if (!validation.valid) {
            return await get().refreshToken();
          }
          return true;
        } catch (err) {
          return await get().refreshToken();
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        // Don't persist loading and error states
      }),
    }
  )
);

/**
 * Helper to check if JWT is expired
 */
function isTokenExpired(token: string): boolean {
  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    return exp < currentTime;
  } catch (err) {
    console.warn("Error parsing token:", err);
    return true;
  }
}

export default useAuth;