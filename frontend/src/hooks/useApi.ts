import { useState, useCallback } from "react";
import api from "@/utils/api";
import { AxiosError, AxiosRequestConfig } from "axios";

interface UseApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (config?: AxiosRequestConfig) => Promise<T>;
  reset: () => void;
}

export function useApi<T>(
  endpoint: string,
  defaultConfig: AxiosRequestConfig = {},
): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  const execute = useCallback(
    async (config: AxiosRequestConfig = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedConfig = {
          ...defaultConfig,
          ...config,
        };

        const response = await api.request<T>({
          url: endpoint,
          ...mergedConfig,
        });

        setData(response.data);
        return response.data;
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred";
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, defaultConfig],
  );

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}
