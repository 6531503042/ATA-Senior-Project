import type { ApiError } from '@/types/api';

import { useState, useCallback, useEffect, useRef } from 'react';

import { api } from '@/libs/apiClient';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (endpoint: string, options?: any) => Promise<T>;
  reset: () => void;
}

export function useApi<T = any>(options: UseApiOptions = {}): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (endpoint: string, requestOptions: any = {}) => {
      try {
        setLoading(true);
        setError(null);

        const { method = 'GET', body, params, ...opts } = requestOptions;

        let result: T;

        switch (method.toUpperCase()) {
          case 'GET':
            result = await api.get<T>(endpoint, params, opts);
            break;
          case 'POST':
            result = await api.post<T>(endpoint, body, opts);
            break;
          case 'PUT':
            result = await api.put<T>(endpoint, body, opts);
            break;
          case 'PATCH':
            result = await api.patch<T>(endpoint, body, opts);
            break;
          case 'DELETE':
            result = await api.delete<T>(endpoint, opts);
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        setData(result);
        options.onSuccess?.(result);

        return result;
      } catch (err) {
        const apiError = err as ApiError;

        setError(apiError);
        options.onError?.(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [options],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Specialized hooks for common operations
export function useGet<T = any>(
  endpoint: string,
  options: UseApiOptions & {
    autoFetch?: boolean;
    params?: Record<string, any>;
    enabled?: boolean; // new: guard condition
  } = {},
) {
  const { autoFetch = false, params, enabled = true, ...apiOptions } = options;
  const { data, loading, error, execute, reset } = useApi<T>(apiOptions);

  // Prevent duplicate fetches in React StrictMode (dev)
  const didAutoFetchRef = useRef(false);

  const fetch = useCallback(() => {
    return execute(endpoint, { method: 'GET', params });
  }, [execute, endpoint, params]);

  // Auto-fetch on mount if enabled (guarded, once)
  useEffect(() => {
    if (autoFetch && enabled && !didAutoFetchRef.current) {
      didAutoFetchRef.current = true;
      fetch();
    }
  }, [autoFetch, enabled, fetch]);

  return {
    data,
    loading,
    error,
    refetch: fetch,
    reset,
  } as const;
}

export function usePost<T = any>(
  endpoint: string,
  options: UseApiOptions = {},
) {
  const { data, loading, error, execute, reset } = useApi<T>(options);

  const post = useCallback(
    (body?: any, requestOptions?: any) => {
      return execute(endpoint, { method: 'POST', body, ...requestOptions });
    },
    [execute, endpoint],
  );

  return {
    data,
    loading,
    error,
    post,
    reset,
  };
}

export function usePut<T = any>(endpoint: string, options: UseApiOptions = {}) {
  const { data, loading, error, execute, reset } = useApi<T>(options);

  const put = useCallback(
    (body?: any, requestOptions?: any) => {
      return execute(endpoint, { method: 'PUT', body, ...requestOptions });
    },
    [execute, endpoint],
  );

  return {
    data,
    loading,
    error,
    put,
    reset,
  };
}

export function useDelete<T = any>(
  endpoint: string,
  options: UseApiOptions = {},
) {
  const { data, loading, error, execute, reset } = useApi<T>(options);

  const deleteResource = useCallback(
    (requestOptions?: any) => {
      return execute(endpoint, { method: 'DELETE', ...requestOptions });
    },
    [execute, endpoint],
  );

  return {
    data,
    loading,
    error,
    delete: deleteResource,
    reset,
  };
}
