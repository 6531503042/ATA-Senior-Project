import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

// Use environment variables with fallbacks
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";

// interface QueueItem {
//   resolve: (value: string | null) => void;
//   reject: (error: Error) => void;
// }

// Create API instance for all services
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

// let isRefreshing = false;
// let failedQueue: QueueItem[] = [];

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details
    console.log("API Request:", {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? "Bearer ****" : "None",
      },
    });

    return config;
  },
  (error) => {
    console.error("Request configuration error:", error.message);
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    const authHeader = response.headers["authorization"];
    const refreshToken = response.headers["refresh-token"];

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      setCookie("accessToken", token);
    }
    if (refreshToken) {
      setCookie("refreshToken", refreshToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getCookie("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh token endpoint
        const response = await api.post(
          "/auth/refresh-token",
          {},
          {
            headers: {
              "Refresh-Token": refreshToken,
            },
          },
        );

        if (response.data) {
          const newAccessToken = response.headers["authorization"]?.replace(
            "Bearer ",
            "",
          );
          const newRefreshToken = response.headers["refresh-token"];

          if (newAccessToken) {
            setCookie("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          if (newRefreshToken) {
            setCookie("refreshToken", newRefreshToken);
          }

          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear auth data and redirect to login
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("user_role");
        localStorage.removeItem("user");
        window.location.href = "/auth/login?error=session_expired";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Add request interceptor for CORS preflight
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      // Add CORS headers for preflight
      if (config.method === "options") {
        config.headers["Access-Control-Request-Method"] =
          config.method.toUpperCase();
        config.headers["Access-Control-Request-Headers"] =
          "content-type,authorization";
      }

      console.log("API Request:", {
        url: `${config.baseURL}${config.url}`,
        method: config.method,
        params: config.params,
        headers: config.headers,
      });

      return config;
    } catch (error) {
      console.error("Request interceptor error:", error);
      return config;
    }
  },
  (error: AxiosError) => {
    console.error("Request configuration error:", error.message);
    return Promise.reject(error);
  },
);

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export const handleApiError = (error: AxiosError<ApiError>): string => {
  console.error("Handling API error:", {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
  });

  if (error.code === "ECONNABORTED") {
    return "Request timeout. Please try again.";
  }

  if (!error.response) {
    return "Cannot connect to the server. Please check if the server is running.";
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  switch (error.response?.status) {
    case 400:
      return "Invalid request. Please check your input.";
    case 401:
      return "Unauthorized. Please login again.";
    case 403:
      return "Access denied. You do not have permission.";
    case 404:
      return "Resource not found.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return `An unexpected error occurred (${error.response?.status || "unknown"}).`;
  }
};

export default api;
