import type {
  DashboardStats,
  EnhancedDashboardStats,
  ActivityFeed,
  QuickAction,
  RealTimeUpdate,
  SystemHealth,
  RealTimeMetrics,
} from '../types/dashboard';

import { useCallback } from 'react';

import { useGet } from './useApi';

import { getToken } from '@/utils/storage';
import useAuthStore from '@/hooks/useAuth';

// Basic dashboard hook
export function useDashboard(
  autoFetch: boolean = true,
  enabled: boolean = true,
) {
  return useGet<DashboardStats>('/api/dashboard', {
    autoFetch,
    enabled,
    onError: error => {
      console.error('Failed to load dashboard:', error);
    },
  });
}

// Enhanced dashboard hook
export function useEnhancedDashboard(
  autoFetch: boolean = true,
  enabled: boolean = true,
) {
  return useGet<EnhancedDashboardStats>('/api/dashboard/advanced', {
    autoFetch,
    enabled,
    onError: error => {
      console.error('Failed to load enhanced dashboard:', error);
    },
  });
}

// Activity feed hook
export function useActivityFeed(limit: number = 20, enabled: boolean = true) {
  return useGet<ActivityFeed[]>('/api/dashboard/activity-feed', {
    params: { limit },
    autoFetch: true,
    enabled,
    onError: error => {
      console.error('Failed to load activity feed:', error);
    },
  });
}

// Quick actions hook
export function useQuickActions(enabled: boolean = true) {
  return useGet<QuickAction[]>('/api/dashboard/quick-actions', {
    autoFetch: true,
    enabled,
    onError: error => {
      console.error('Failed to load quick actions:', error);
    },
  });
}

// Real-time notifications hook
export function useNotifications(limit: number = 10, enabled: boolean = true) {
  return useGet<RealTimeUpdate[]>('/api/dashboard/notifications', {
    params: { limit },
    autoFetch: true,
    enabled,
    onError: error => {
      console.error('Failed to load notifications:', error);
    },
  });
}

// Real-time metrics hook
export function useRealTimeMetrics(enabled: boolean = true) {
  return useGet<RealTimeMetrics>('/api/dashboard/realtime-metrics', {
    autoFetch: true,
    enabled,
    onError: error => {
      console.error('Failed to load real-time metrics:', error);
    },
  });
}

// System health hook
export function useSystemHealth(enabled: boolean = true) {
  return useGet<SystemHealth>('/api/dashboard/health', {
    autoFetch: true,
    enabled,
    onError: error => {
      console.error('Failed to load system health:', error);
    },
  });
}

// Combined dashboard hook for comprehensive data - Simplified to prevent infinite re-renders
export function useDashboardData() {
  const auth = useAuthStore();
  const token = getToken('accessToken');
  const isEnabled = !!token && !!auth.user;

  const dashboard = useDashboard(true, isEnabled);
  const enhanced = useEnhancedDashboard(true, isEnabled);
  const activityFeed = useActivityFeed(10, isEnabled);
  const quickActions = useQuickActions(isEnabled);
  const notifications = useNotifications(5, isEnabled);
  const realTimeMetrics = useRealTimeMetrics(isEnabled);
  const systemHealth = useSystemHealth(isEnabled);

  const refresh = useCallback(() => {
    if (!isEnabled) return;
    dashboard.refetch();
    enhanced.refetch();
  }, [dashboard, enhanced, isEnabled]);

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
