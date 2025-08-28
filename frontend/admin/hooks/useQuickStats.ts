import type { QuickStats } from '@/types/dashboard';
import type { ApiError } from '@/types/api';

import { useState, useCallback } from 'react';

import { api } from '@/libs/apiClient';

export function useQuickStats() {
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch counts from different endpoints
      const [users, departments, questions, feedbacks, submissions, projects] =
        await Promise.all([
          api
            .get<any>('/api/users', { page: 0, size: 1 })
            .catch(() => ({ totalElements: 0 })),
          api
            .get<any>('/api/departments', { page: 0, size: 1 })
            .catch(() => ({ totalElements: 0 })),
          api
            .get<any>('/api/questions', { page: 0, size: 1 })
            .catch(() => ({ totalElements: 0 })),
          api
            .get<any>('/api/feedbacks', { page: 0, size: 1 })
            .catch(() => ({ totalElements: 0 })),
          api
            .get<any>('/api/submissions', { page: 0, size: 1 })
            .catch(() => ({ totalElements: 0 })),
          api
            .get<any>('/api/projects', { page: 0, size: 1 })
            .catch(() => ({ totalElements: 0 })),
        ]);

      const quickStats: QuickStats = {
        totalUsers: users.totalElements || 0,
        totalDepartments: departments.totalElements || 0,
        totalQuestions: questions.totalElements || 0,
        totalFeedbacks: feedbacks.totalElements || 0,
        totalSubmissions: submissions.totalElements || 0,
        totalProjects: projects.totalElements || 0,
      };

      setStats(quickStats);
    } catch (err) {
      console.error('Failed to load quick stats:', err);
      const apiError = err as ApiError;

      setError(apiError);

      // Set fallback stats
      setStats({
        totalUsers: 0,
        totalDepartments: 0,
        totalQuestions: 0,
        totalFeedbacks: 0,
        totalSubmissions: 0,
        totalProjects: 0,
      });
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
