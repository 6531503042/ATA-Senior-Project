import type { User } from './user';

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshToken: () => Promise<string>;
  };
  
export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
}

export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  userId: number;
  username: string;
  roles: string[];
  message: string;
}

export interface AuthStore {
  loading: boolean;
  error: string | null;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshTokens: () => Promise<string>;
  isLoggedIn: boolean;
  ensureValidSession: () => Promise<boolean>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
}