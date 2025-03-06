import api from '@/utils/api';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const TOKEN_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    fullname: string;
    gender: string;
}

export interface AuthResponse {
    id: number;
    username: string;
    email: string;
    fullname: string;
    roles: string[];
}

interface TokenData {
    token: string;
    expiresAt: number;
}

export const auth = {
    async login(data: LoginRequest) {
        try {
            console.log('Attempting login with:', {
                url: '/auth/login',
                data
            });

            const response = await api.post('/auth/login', data);
            
            console.log('Login response:', {
                status: response.status,
                headers: response.headers,
                data: response.data
            });

            // Extract tokens from headers
            const accessToken = response.headers['authorization']?.replace('Bearer ', '');
            const refreshToken = response.headers['refresh-token'];
            
            if (!accessToken || !refreshToken) {
                throw new Error('Authentication tokens not received');
            }

            // Calculate expiration time (current time + 1 day)
            const expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;
            
            // Store tokens in cookies
            setCookie('accessToken', accessToken);
            setCookie('refreshToken', refreshToken);
            
            // Store token expiration time
            localStorage.setItem('tokenExpiration', JSON.stringify({
                token: accessToken,
                expiresAt
            }));
            
            // Store user info from response body
            if (response.data?.user_info) {
                localStorage.setItem('user', JSON.stringify(response.data.user_info));
                
                // Store role in cookie for middleware
                if (response.data.user_info.roles?.length > 0) {
                    setCookie('user_role', response.data.user_info.roles[0]);
                }
            }
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(data: RegisterRequest) {
        try {
            const response = await api.post('/auth/register', data);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear all auth data
            deleteCookie('accessToken');
            deleteCookie('refreshToken');
            deleteCookie('user_role');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiration');
        }
    },

    async validateToken() {
        try {
            // First check if token is expired locally
            if (!this.isTokenValid()) {
                return false;
            }

            const token = getCookie('accessToken');
            if (!token) return false;

            const response = await api.get('/auth/validate');
            return response.data.valid;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    },

    async refreshToken() {
        try {
            const refreshToken = getCookie('refreshToken');
            if (!refreshToken) return false;

            const response = await api.post('/auth/refresh', {}, {
                headers: {
                    'Refresh-Token': refreshToken
                }
            });

            // Extract new access token from response
            const newAccessToken = response.headers['authorization']?.replace('Bearer ', '');
            const newRefreshToken = response.headers['refresh-token'];
            
            if (!newAccessToken) {
                return false;
            }

            // Calculate new expiration time
            const expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;
            
            // Update tokens in cookies
            setCookie('accessToken', newAccessToken);
            if (newRefreshToken) {
                setCookie('refreshToken', newRefreshToken);
            }
            
            // Update token expiration
            localStorage.setItem('tokenExpiration', JSON.stringify({
                token: newAccessToken,
                expiresAt
            }));
            
            return true;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    },

    async checkAuthority(requiredRole: string) {
        try {
            if (!this.isTokenValid()) {
                return false;
            }

            const response = await api.get('/auth/hasAuthority', {
                params: { requireRole: requiredRole }
            });
            return response.data.valid;
        } catch (error) {
            console.error('Authority check error:', error);
            return false;
        }
    },

    getUser(): AuthResponse | null {
        if (typeof window === 'undefined') return null;
        
        // If token is expired, consider user as logged out
        if (!this.isTokenValid()) {
            return null;
        }
        
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        // Check both if token exists and is not expired
        return !!getCookie('accessToken') && this.isTokenValid();
    },

    getUserRole(): string | null {
        const user = this.getUser();
        return user?.roles?.[0] || null;
    },

    // New methods for token expiration handling

    isTokenValid(): boolean {
        try {
            const tokenData = this.getTokenData();
            if (!tokenData) return false;
            
            return Date.now() < tokenData.expiresAt;
        } catch (error) {
            console.error('Error checking token validity:', error);
            return false;
        }
    },

    getTokenData(): TokenData | null {
        if (typeof window === 'undefined') return null;
        
        try {
            const tokenDataStr = localStorage.getItem('tokenExpiration');
            if (!tokenDataStr) return null;
            
            return JSON.parse(tokenDataStr);
        } catch (error) {
            console.error('Error parsing token data:', error);
            return null;
        }
    },

    getTimeUntilExpiration(): number | null {
        const tokenData = this.getTokenData();
        if (!tokenData) return null;
        
        const remainingTime = tokenData.expiresAt - Date.now();
        return remainingTime > 0 ? remainingTime : 0;
    },

    isTokenAboutToExpire(minutes = 5): boolean {
        const timeRemaining = this.getTimeUntilExpiration();
        const threshold = minutes * 60 * 1000;
        
        return timeRemaining !== null && timeRemaining < threshold && timeRemaining > 0;
    }
};