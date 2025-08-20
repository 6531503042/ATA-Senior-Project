// สำหรับใช้เป็น template ทุกการใช้ hook (Default Hook Style)

import { useState } from 'react';

import { getToken } from '@/utils/storage';

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
    method: string,
    body?: B,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
      const cleanEndpoint = endpoint.replace(/^\//, '');
      const url = `${baseUrl}/${cleanEndpoint}`;

      // eslint-disable-next-line no-console
      console.log(`Making ${method} request to ${url}`, { body, options });

      const headers: HeadersInit = {};

      // Attach bearer token if available (client-side only)
      try {
        const token =
          typeof window !== 'undefined' ? getToken('accessToken') : null;

        if (token) {
          (headers as Record<string, string>)['Authorization'] =
            `Bearer ${token}`;
        }
      } catch {}

      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        if (body instanceof FormData) {
          // Browser will automatically set the boundary for Formdata
        } else {
          (headers as Record<string, string>)['Content-Type'] =
            'application/json';
        }
      }

      if (options.headers) {
        Object.assign(headers, options.headers);
      }

      const requestOptions: RequestInit = {
        method,
        headers,
        credentials: 'include',
        ...options,
      };

      if (body && !['GET', 'DELETE'].includes(method)) {
        requestOptions.body =
          body instanceof FormData ? body : JSON.stringify(body);
      }

      // eslint-disable-next-line no-console
      console.log('Request options:', requestOptions);

      const response = await fetch(url, requestOptions);

      // eslint-disable-next-line no-console
      console.log('Response status:', response.status);

      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();

      // eslint-disable-next-line no-console
      console.log('Response data:', data);

      if (!response.ok) {
        const errorMessage =
          data.message || `HTTP error! status: ${response.status}`;

        // eslint-disable-next-line no-console
        console.error('API Error:', {
          status: response.status,
          message: errorMessage,
          data,
        });
        throw new Error(errorMessage);
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Request error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';

      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};

// Non-hook request helper for service modules (no React state, safe outside components)
export async function apiRequest<T, B = unknown>(
  endpoint: string,
  method: string,
  body?: B,
  options: RequestInit = {},
): Promise<{ success: boolean; data?: T }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const url = `${baseUrl}/${cleanEndpoint}`;

  const headers: HeadersInit = {};

  try {
    const token =
      typeof window !== 'undefined' ? getToken('accessToken') : null;

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  } catch {}

  if (
    ['POST', 'PUT', 'PATCH'].includes(method) &&
    body &&
    !(body instanceof FormData)
  ) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  if ((options as any).headers) {
    Object.assign(headers, (options as any).headers);
  }

  const requestOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
    ...options,
  };

  if (body && !['GET', 'DELETE'].includes(method)) {
    (requestOptions as any).body =
      body instanceof FormData ? body : JSON.stringify(body);
  }

  const response = await fetch(url, requestOptions);

  if (response.status === 204) return { success: true };
  const data = await response.json();

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) || `HTTP ${response.status}`;

    throw new Error(message);
  }

  return { success: true, data: data.data || data };
}
