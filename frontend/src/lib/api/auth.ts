import api from '@/utils/api';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

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

            // Store tokens in cookies
            setCookie('accessToken', accessToken);
            setCookie('refreshToken', refreshToken);
            
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
        }
    },

    async validateToken() {
        try {
            const token = getCookie('accessToken');
            if (!token) return false;

            const response = await api.get('/auth/validate');
            return response.data.valid;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    },

    async checkAuthority(requiredRole: string) {
        try {
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
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        return !!getCookie('accessToken');
    },

    getUserRole(): string | null {
        const user = this.getUser();
        return user?.roles?.[0] || null;
    }
}; 