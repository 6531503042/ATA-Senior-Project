import type { ApiError } from '@/types/api';

import { useState, useCallback } from 'react';

import { api } from '@/libs/apiClient';

export interface AdminQuickStats {
  thisMonth: number;
  totalTimeSeconds: number;
  avgRating: number;
  totalUsers?: number;
  totalDepartments?: number;
  totalQuestions?: number;
  totalFeedbacks?: number;
  totalSubmissions?: number;
  totalProjects?: number;
}

export function useQuickStats() {
  const [stats, setStats] = useState<AdminQuickStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const quick = await api.get<AdminQuickStats>('/api/dashboard/quick-stats');

      setStats(quick);
    } catch (err) {
      console.error('Failed to load quick stats:', err);
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStats(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
    reset,
  };
}
