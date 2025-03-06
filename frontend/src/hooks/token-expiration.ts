// lib/api/auth.ts
import axios from 'axios';
import type { User, LoginCredentials, AuthResponse } from '@/types/auth';

interface TokenData {
  token: string;
  expiration: number; // Timestamp when token expires
  user: User;
}

class AuthService {
  private storageKey = 'auth_data';
  private tokenExpirationKey = 'token_expiration';
  private tokenExpirationCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start token expiration check if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.setupExpirationCheck();
    }
  }

  // Setup periodic token expiration check
  private setupExpirationCheck() {
    // Clear any existing interval
    if (this.tokenExpirationCheckInterval) {
      clearInterval(this.tokenExpirationCheckInterval);
    }
    
    // Check token expiration every minute
    this.tokenExpirationCheckInterval = setInterval(() => {
      if (this.isTokenExpired()) {
        console.log('Token has expired, logging out');
        this.logout();
        
        // If we want to notify the user about expiration
        if (typeof window !== 'undefined') {
          // Use a custom event that components can listen for
          window.dispatchEvent(new CustomEvent('auth:token_expired'));
        }
      }
    }, 60000); // Check every minute
  }

  // Store authentication data with expiration
  private storeAuthData(token: string, user: User) {
    const now = new Date();
    const expiration = now.getTime() + (60 * 60 * 1000); // Current time + 1 hour
    
    const tokenData: TokenData = {
      token,
      expiration,
      user
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(tokenData));
    localStorage.setItem(this.tokenExpirationKey, expiration.toString());
    
    // Also store in memory for quicker access
    this._tokenData = tokenData;
  }

  private _tokenData: TokenData | null = null;

  // Get authentication data from storage
  private getAuthData(): TokenData | null {
    // Return from memory if available
    if (this._tokenData) {
      return this._tokenData;
    }
    
    try {
      const authDataStr = localStorage.getItem(this.storageKey);
      if (!authDataStr) return null;
      
      const authData = JSON.parse(authDataStr) as TokenData;
      this._tokenData = authData;
      return authData;
    } catch (e) {
      console.error('Error parsing auth data:', e);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const expirationStr = localStorage.getItem(this.tokenExpirationKey);
    if (!expirationStr) return true;
    
    const expiration = parseInt(expirationStr, 10);
    const now = new Date().getTime();
    
    return now >= expiration;
  }

  // Get time remaining before token expires (in seconds)
  getTokenTimeRemaining(): number {
    const expirationStr = localStorage.getItem(this.tokenExpirationKey);
    if (!expirationStr) return 0;
    
    const expiration = parseInt(expirationStr, 10);
    const now = new Date().getTime();
    
    const remainingMs = Math.max(0, expiration - now);
    return Math.floor(remainingMs / 1000); // Convert to seconds
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthData() && !this.isTokenExpired();
  }

  // Get the current authentication token
  getToken(): string | null {
    const authData = this.getAuthData();
    if (!authData || this.isTokenExpired()) return null;
    return authData.token;
  }

  // Get the current user
  getUser(): User | null {
    const authData = this.getAuthData();
    if (!authData || this.isTokenExpired()) return null;
    return authData.user;
  }

  // Validate token with the server
  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const response = await axios.post('/api/auth/validate', { token });
      return response.status === 200;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/api/auth/login', credentials);
    
    if (response.data && response.data.token && response.data.user_info) {
      this.storeAuthData(response.data.token, response.data.user_info);
      this.setupExpirationCheck(); // Set up expiration check on login
    }
    
    return response.data;
  }

  // Refresh token
  async refreshToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const response = await axios.post<AuthResponse>('/api/auth/refresh', { token });
      
      if (response.data && response.data.token && response.data.user_info) {
        this.storeAuthData(response.data.token, response.data.user_info);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.tokenExpirationKey);
    this._tokenData = null;
    
    // Clear interval when logging out
    if (this.tokenExpirationCheckInterval) {
      clearInterval(this.tokenExpirationCheckInterval);
      this.tokenExpirationCheckInterval = null;
    }
  }
}

export const auth = new AuthService();