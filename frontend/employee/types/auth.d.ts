// Auth Types for Backend API Integration

import type { User } from './user';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

export interface TokenValidationResponse {
  valid: boolean;
  userId: number;
  username: string;
  roles: string[];
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserRoleUpdateRequest {
  roles: string[];
}

// Auth Store Interface
export interface AuthStore {
  loading: boolean;
  error: string | null;
  user: User | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  isLoggedIn: () => boolean;
  ensureValidSession: () => Promise<boolean>;
  clearError: () => void;
}

// Profile Store Interface
export interface ProfileStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
}