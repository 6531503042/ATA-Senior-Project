import axios from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getCookie('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request details
        console.log('API Request:', {
            url: `${config.baseURL}${config.url}`,
            method: config.method,
            headers: {
                ...config.headers,
                Authorization: config.headers.Authorization ? 'Bearer ****' : 'None'
            }
        });

        return config;
    },
    (error) => {
        console.error('Request configuration error:', error.message);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful responses
        const authHeader = response.headers['authorization'];
        const refreshToken = response.headers['refresh-token'];

        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            setCookie('accessToken', token);
        }
        if (refreshToken) {
            setCookie('refreshToken', refreshToken);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getCookie('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call refresh token endpoint
                const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, {
                    headers: {
                        'Refresh-Token': refreshToken as string
                    }
                });

                if (response.data) {
                    const newAccessToken = response.headers['authorization']?.replace('Bearer ', '');
                    const newRefreshToken = response.headers['refresh-token'];

                    if (newAccessToken) {
                        setCookie('accessToken', newAccessToken);
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    if (newRefreshToken) {
                        setCookie('refreshToken', newRefreshToken);
                    }

                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Clear auth data and redirect to login
                deleteCookie('accessToken');
                deleteCookie('refreshToken');
                deleteCookie('user_role');
                localStorage.removeItem('user');
                window.location.href = '/auth/login?error=session_expired';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 