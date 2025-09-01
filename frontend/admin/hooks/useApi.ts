import { useState } from "react";

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// General API Hook
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async <T, B = unknown>(
    endpoint: string,
    method: string = "GET",
    body?: B,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    try {
      setLoading(true);
      setError(null);

      const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;  // Using NEXT_PUBLIC_API_URL

      console.log(`Making ${method} request to ${url}`, { body, options });

      const headers: HeadersInit = {};

      if (["POST", "PUT", "PATCH"].includes(method) && body) {
        if (body instanceof FormData) {
          // Browser will automatically set the boundary for FormData
        } else {
          headers["Content-Type"] = "application/json";
        }
      }

      if (options.headers) {
        Object.assign(headers, options.headers);
      }

      const requestOptions: RequestInit = {
        method,
        headers,
        credentials: "include",
        ...options,
      };

      if (body && !["GET", "DELETE"].includes(method)) {
        requestOptions.body = body instanceof FormData ? body : JSON.stringify(body);
      }

      console.log("Request options:", requestOptions);

      const response = await fetch(url, requestOptions);

      console.log("Response status:", response.status);

      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();

      console.log("Response data:", data);

      if (!response.ok) {
        const errorMessage = data.message || `HTTP error! status: ${response.status}`;

        console.error("API Error:", { status: response.status, message: errorMessage, data });
        throw new Error(errorMessage);
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error("Request error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};

// สำหรับ Golang ไว้ใช้กับ Golang Hook เท่านั้น
export const useGolangApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async <T, B = unknown>(
    endpoint: string,
    method: string = "GET",
    body?: B,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    try {
      setLoading(true);
      setError(null);

      const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
 
      console.log(`Making ${method} request to ${url}`, { body, options });

      const headers: HeadersInit = {};

      if (["POST", "PUT", "PATCH"].includes(method) && body) {
        if (body instanceof FormData) {
          // Browser will automatically set the boundary for FormData
        } else {
          headers["Content-Type"] = "application/json";
        }
      }

      if (options.headers) {
        Object.assign(headers, options.headers);
      }

      const requestOptions: RequestInit = {
        method,
        headers,
        credentials: "include",
        ...options,
      };

      if (body && !["GET", "DELETE"].includes(method)) {
        requestOptions.body = body instanceof FormData ? body : JSON.stringify(body);
      }

      console.log("Request options:", requestOptions);

      const response = await fetch(url, requestOptions);

      console.log("Response status:", response.status);

      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();

      console.log("Response data:", data);

      if (!response.ok) {
        const errorMessage = data.message || `HTTP error! status: ${response.status}`;

        console.error("API Error:", { status: response.status, message: errorMessage, data });
        throw new Error(errorMessage);
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error("Request error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};
