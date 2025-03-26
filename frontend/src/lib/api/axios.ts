import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (error: Error) => void; }[] = [];

const processQueue = (error: Error | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(undefined);
        }
    });
    failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = getCookie('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
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
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

        // If there's no config or it's already retried, reject immediately
        if (!originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        // If the error is 401 (Unauthorized)
        if (error.response?.status === 401) {
            if (isRefreshing) {
                try {
                    // Wait for the token refresh
                    await new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    });
                    // Retry the original request
                    return api(originalRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }

            isRefreshing = true;
            originalRequest._retry = true;

            try {
                const refreshToken = getCookie('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call refresh token endpoint
                const response = await axios.post(
                    `${api.defaults.baseURL}/api/auth/refresh-token`,
                    {},
                    {
                        headers: {
                            'Refresh-Token': refreshToken as string
                        }
                    }
                );

                const newAccessToken = response.headers['authorization']?.replace('Bearer ', '');
                const newRefreshToken = response.headers['refresh-token'];

                if (newAccessToken) {
                    setCookie('accessToken', newAccessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    if (originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    }
                }
                if (newRefreshToken) {
                    setCookie('refreshToken', newRefreshToken);
                }

                processQueue();
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(new Error('Failed to refresh token'));
                deleteCookie('accessToken');
                deleteCookie('refreshToken');
                window.location.href = '/auth/login?error=session_expired';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // For other errors, reject with the original error
        return Promise.reject(error);
    }
);

export default api; 