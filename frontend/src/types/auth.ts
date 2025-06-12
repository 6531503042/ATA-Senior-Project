export interface User {
  id: number;
  fullname: string;
  username: string;
  email: string;
  gender: string;
  avatar?: string;
  roles: string[];
}

export interface AuthResponse {
  token: AuthResponse;
  access_token: string;
  refresh_token: string;
  user_info: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
