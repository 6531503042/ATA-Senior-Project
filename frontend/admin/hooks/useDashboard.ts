import type {
  DashboardStats,
  EnhancedDashboardStats,
  ActivityFeed,
  QuickAction,
  RealTimeUpdate,
  SystemHealth,
  RealTimeMetrics,
} from '../types/dashboard';

import { useState, useEffect, useCallback } from 'react';
import { addToast } from '@heroui/react';

import { apiRequest } from '@/utils/api';
import { getToken } from '@/utils/storage';
import useAuthStore from '@/hooks/useAuth';

// Basic dashboard hook
export function useDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<DashboardStats>('/api/dashboard', 'GET');
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load dashboard';
      setError(errorMessage);
      addToast({
        title: 'Failed to load dashboard',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = () => fetchData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Enhanced dashboard hook
export function useEnhancedDashboard() {
  const [data, setData] = useState<EnhancedDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<EnhancedDashboardStats>('/api/dashboard/advanced', 'GET');
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load enhanced dashboard';
      setError(errorMessage);
      addToast({
        title: 'Failed to load enhanced dashboard',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = () => fetchData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Activity feed hook
export function useActivityFeed(limit: number = 20) {
  const [data, setData] = useState<ActivityFeed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<ActivityFeed[]>(`/api/dashboard/activity-feed?limit=${limit}`, 'GET');
      if (res.data) {
        setData(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load activity feed';
      setError(errorMessage);
      addToast({
        title: 'Failed to load activity feed',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refetch = () => fetchData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Quick actions hook
export function useQuickActions() {
  const [data, setData] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<QuickAction[]>('/api/dashboard/quick-actions', 'GET');
      if (res.data) {
        setData(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load quick actions';
      setError(errorMessage);
      addToast({
        title: 'Failed to load quick actions',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = () => fetchData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Real-time notifications hook
export function useNotifications(limit: number = 10) {
  const [data, setData] = useState<RealTimeUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<RealTimeUpdate[]>(`/api/dashboard/notifications?limit=${limit}`, 'GET');
      if (res.data) {
        setData(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load notifications';
      setError(errorMessage);
      addToast({
        title: 'Failed to load notifications',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refetch = () => fetchData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Real-time metrics hook
export function useRealTimeMetrics() {
  const [data, setData] = useState<RealTimeMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<RealTimeMetrics>('/api/dashboard/realtime-metrics', 'GET');
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load real-time metrics';
      setError(errorMessage);
      addToast({
        title: 'Failed to load real-time metrics',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = () => fetchData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// System health hook
export function useSystemHealth() {
  const [data, setData] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<SystemHealth>('/api/dashboard/health', 'GET');
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load system health';
      setError(errorMessage);
      addToast({
        title: 'Failed to load system health',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = () => fetchData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Combined dashboard hook for comprehensive data
export function useDashboardData() {
  const auth = useAuthStore();
  const token = getToken('accessToken');
  const isEnabled = !!token && !!auth.user;

  const dashboard = useDashboard();
  const enhanced = useEnhancedDashboard();
  const activityFeed = useActivityFeed(10);
  const quickActions = useQuickActions();
  const notifications = useNotifications(5);
  const realTimeMetrics = useRealTimeMetrics();
  const systemHealth = useSystemHealth();

  const refresh = useCallback(() => {
    if (!isEnabled) return;
    dashboard.refetch();
    enhanced.refetch();
    activityFeed.refetch();
    quickActions.refetch();
    notifications.refetch();
    realTimeMetrics.refetch();
    systemHealth.refetch();
  }, [dashboard, enhanced, activityFeed, quickActions, notifications, realTimeMetrics, systemHealth, isEnabled]);

  const loading = dashboard.loading || enhanced.loading;
  const error = dashboard.error || enhanced.error;

  return {
    // Data
    dashboard: dashboard.data,
    enhanced: enhanced.data,
    activityFeed: activityFeed.data || [],
    quickActions: quickActions.data || [],
    notifications: notifications.data || [],
    realTimeMetrics: realTimeMetrics.data,
    systemHealth: systemHealth.data,

    // States
    loading,
    error,

    // Actions
    refresh,

    // Individual loaders
    dashboardLoading: dashboard.loading,
    enhancedLoading: enhanced.loading,
    activityLoading: activityFeed.loading,
    quickActionsLoading: quickActions.loading,
    notificationsLoading: notifications.loading,
    realTimeMetricsLoading: realTimeMetrics.loading,
    systemHealthLoading: systemHealth.loading,
  } as const;
}
