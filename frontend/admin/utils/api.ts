import { getToken } from './storage';

export interface ApiResponse<T> {
  statusCode: number;
  message: string | null;
  data: T | null;
}

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: object | FormData,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    console.log(`Making ${method} request to ${url}`, { body, options });

    const headers: HeadersInit = {};

    // Add JWT token to headers
    const token = getToken('accessToken');
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

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
      ...options,
    };

    if (body && !["GET", "DELETE"].includes(method)) {
      requestOptions.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    console.log("Request options:", requestOptions);

    const response = await fetch(url, requestOptions);

    console.log("Response status:", response.status);

    if (response.status === 204) {
      return {
        statusCode: 204,
        message: "No content",
        data: null,
      };
    }

    const data = await response.json();

    console.log("Response data:", data);

    if (!response.ok) {
      const errorMessage = data.message || `HTTP error! status: ${response.status}`;

      console.error("API Error:", { status: response.status, message: errorMessage, data });
      throw new Error(errorMessage);
    }

    return {
      statusCode: response.status,
      message: data.message || "Success",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Request error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    throw error;
  }
}

export async function apiGolangRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: object | FormData,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${process.env.NEXT_PUBLIC_GOLANG_API_URL}${endpoint}`;

    console.log(`Making ${method} request to ${url}`, { body, options });

    const headers: HeadersInit = {};

    // Add JWT token to headers
    const token = getToken('accessToken');
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

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
      ...options,
    };

    if (body && !["GET", "DELETE"].includes(method)) {
      requestOptions.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    console.log("Request options:", requestOptions);

    const response = await fetch(url, requestOptions);

    console.log("Response status:", response.status);

    if (response.status === 204) {
      return {
        statusCode: 204,
        message: "No content",
        data: null,
      };
    }

    const data = await response.json();

    console.log("Response data:", data);

    if (!response.ok) {
      const errorMessage = data.message || `HTTP error! status: ${response.status}`;

      console.error("API Error:", { status: response.status, message: errorMessage, data });
      throw new Error(errorMessage);
    }

    return {
      statusCode: response.status,
      message: data.message || "Success",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Request error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    throw error;
  }
}
