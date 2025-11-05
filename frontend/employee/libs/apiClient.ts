import type { RequestOptions, ApiError } from '../types/api';

import { getToken } from '../utils/storage';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    console.log('Employee API Client initialized with base URL:', this.baseUrl);
  }

  private buildUrl(path: string, params?: Record<string, any>): string {
    const resolvedBase = this.baseUrl.startsWith('http')
      ? this.baseUrl
      : `${typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:8088')}${this.baseUrl}`;

    // Avoid double "/api" when baseUrl already ends with "/api"
    let normalizedPath = path || '/';
    const baseWithoutTrailing = resolvedBase.replace(/\/$/, '');
    if (baseWithoutTrailing.endsWith('/api') && normalizedPath.startsWith('/api')) {
      normalizedPath = normalizedPath.replace(/^\/api/, '');
      if (!normalizedPath.startsWith('/')) normalizedPath = `/${normalizedPath}`;
    }

    // If path starts with /, it's absolute from origin, so we need to append properly
    let url: URL;
    if (normalizedPath.startsWith('/')) {
      // Remove leading slash and append to base
      const pathWithoutLeading = normalizedPath.substring(1);
      url = new URL(pathWithoutLeading, baseWithoutTrailing + '/');
    } else {
      url = new URL(normalizedPath, baseWithoutTrailing + '/');
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, String(v)));
        } else {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private buildHeaders(opts?: RequestOptions): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(opts?.headers || {}),
    };

    // Check if auth is explicitly disabled
    const authDisabled = opts?.auth === false;

    if (!authDisabled) {
      const token = getToken('accessToken');

      console.log('🔐 Employee Token check:', {
        hasToken: !!token,
        tokenLength: token?.length,
        authDisabled: authDisabled,
      });
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log(
          '✅ Employee Authorization header set:',
          `Bearer ${token.substring(0, 20)}...`,
        );
      } else {
        console.log('❌ No access token found in storage');
      }
    } else {
      console.log('🔓 Auth disabled for this request');
    }

    return headers;
  }

  private async request<T>(
    path: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    const url = this.buildUrl(path, opts.params);

    console.log(`Making ${opts.method || 'GET'} request to:`, url);

    try {
      const requestOptions = {
        method: opts.method || 'GET',
        headers: this.buildHeaders(opts),
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: opts.signal,
      };

      console.log('Request options:', {
        method: requestOptions.method,
        headers: requestOptions.headers,
        body: requestOptions.body ? 'Present' : 'None',
      });

      const res = await fetch(url, requestOptions);

      console.log('Response status:', res.status, res.statusText);

      if (!res.ok) {
        let message = `Request failed with ${res.status}`;
        let errorData: any = {};

        try {
          const data = await res.json();

          message = data?.message || data?.error || message;
          errorData = data;
          console.log('Error response data:', data);
        } catch (e) {
          // If JSON parsing fails, use status text
          message = res.statusText || message;
          console.log('Could not parse error response as JSON');
        }

        // Handle 401/403 errors gracefully for unauthenticated requests
        if (res.status === 401 || res.status === 403) {
          console.log(`[API] Auth error for ${opts.method || 'GET'} ${url}`);
          const authError: ApiError = {
            message: 'Authentication required',
            code: `HTTP_${res.status}`,
            timestamp: new Date().toISOString(),
          };
          throw authError;
        }

        const error: ApiError = {
          message,
          code: `HTTP_${res.status}`,
          details: errorData,
          timestamp: new Date().toISOString(),
        };

        throw error;
      }

      if (res.status === 204) return undefined as unknown as T;

      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await res.json();

        console.log('Response data:', data);

        return data as T;
      }

      // Fallback to text
      const text = await res.text();

      console.log('Response text:', text);

      return text as unknown as T;
    } catch (error) {
      console.error('Request error:', error);

      if (error instanceof Error && 'code' in error) {
        throw error; // Re-throw API errors
      }

      // Handle network errors
      const networkError: ApiError = {
        message: error instanceof Error ? error.message : 'Network error',
        code: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      };

      throw networkError;
    }
  }

  get<T>(path: string, params?: Record<string, any>, opts?: RequestOptions) {
    return this.request<T>(path, { ...opts, params, method: 'GET' });
  }

  post<T>(path: string, body?: any, opts?: RequestOptions) {
    return this.request<T>(path, { ...opts, body, method: 'POST' });
  }

  put<T>(path: string, body?: any, opts?: RequestOptions) {
    return this.request<T>(path, { ...opts, body, method: 'PUT' });
  }

  patch<T>(path: string, body?: any, opts?: RequestOptions) {
    return this.request<T>(path, { ...opts, body, method: 'PATCH' });
  }

  delete<T>(path: string, opts?: RequestOptions) {
    return this.request<T>(path, { ...opts, method: 'DELETE' });
  }
}

// Create API client instance with proper environment variable handling
const getApiBaseUrl = () => {
  // Check for environment variable first (using the same name as admin)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Fallback to localhost for development (same port as admin)
  return 'http://localhost:8080';
};

const apiBaseUrl = getApiBaseUrl();

console.log('Environment API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Using Employee API Base URL:', apiBaseUrl);

export const api = new ApiClient(apiBaseUrl);
