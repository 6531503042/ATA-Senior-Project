import { useState, useCallback, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { DashboardStats, EnhancedDashboardStats, ActivityFeed } from '@/types/dashboard';

import { getToken } from '@/utils/storage';
import useAuthStore from '@/stores/authStore';

// Mock data for fallback when API fails
const mockDashboardData: DashboardStats = {
  overview: {
    totalProjects: 12,
    totalSubmissions: 45,
    totalMembers: 28,
    completionRate: 78.5,
    projectsGrowth: '+15%',
    submissionsGrowth: '+23%',
    membersGrowth: '+8%',
    completionGrowth: '+5%',
  },
  recentProjects: [
    {
      id: 1,
      title: 'User Experience Research',
      description: 'Comprehensive study of user interaction patterns and feedback collection',
      participants: 15,
      createdAt: '2024-01-15T10:30:00Z',
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?u=project1',
      progress: 75,
      dueDate: '2024-02-15T23:59:59Z',
    },
    {
      id: 2,
      title: 'Product Feedback Analysis',
      description: 'Analysis of customer feedback for product improvement initiatives',
      participants: 22,
      createdAt: '2024-01-10T14:20:00Z',
      status: 'completed',
      avatar: 'https://i.pravatar.cc/150?u=project2',
      progress: 100,
      dueDate: '2024-01-30T23:59:59Z',
    },
    {
      id: 3,
      title: 'Employee Satisfaction Survey',
      description: 'Annual employee satisfaction and engagement survey',
      participants: 45,
      createdAt: '2024-01-05T09:15:00Z',
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?u=project3',
      progress: 60,
      dueDate: '2024-02-28T23:59:59Z',
    },
  ],
  recentFeedbacks: [
    {
      id: 1,
      projectTitle: 'User Experience Research',
      description: 'Excellent interface design, very intuitive navigation',
      participants: 15,
      createdAt: '2024-01-20T16:45:00Z',
      status: 'analyzed',
      avatar: 'https://i.pravatar.cc/150?u=feedback1',
      sentiment: 'positive',
      score: 8.5,
    },
    {
      id: 2,
      projectTitle: 'Product Feedback Analysis',
      description: 'Good overall experience but needs improvement in mobile version',
      participants: 22,
      createdAt: '2024-01-18T11:30:00Z',
      status: 'completed',
      avatar: 'https://i.pravatar.cc/150?u=feedback2',
      sentiment: 'neutral',
      score: 7.0,
    },
    {
      id: 3,
      projectTitle: 'Employee Satisfaction Survey',
      description: 'Very satisfied with the new workplace policies and benefits',
      participants: 45,
      createdAt: '2024-01-16T13:20:00Z',
      status: 'pending',
      avatar: 'https://i.pravatar.cc/150?u=feedback3',
      sentiment: 'positive',
      score: 9.2,
    },
  ],
  chartData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Projects',
        data: [3, 5, 7, 9, 11, 12],
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
      },
      {
        label: 'Submissions',
        data: [12, 18, 25, 32, 38, 45],
        backgroundColor: '#10b981',
        borderColor: '#10b981',
      },
    ],
  },
};

const mockEnhancedData: EnhancedDashboardStats = {
  ...mockDashboardData,
  advanced: {
    totalActiveFeedbacks: 8,
    totalCompletedFeedbacks: 15,
    totalActiveUsers: 24,
    averageResponseRate: 85.2,
    averageRating: 8.1,
    uniqueSubmitters: 32,
    engagementRate: '+12%',
  },
  departmentMetrics: [
    {
      departmentId: 1,
      departmentName: 'Engineering',
      activeMembers: 12,
      totalSubmissions: 18,
      averageRating: 8.5,
      participationRate: '85%',
    },
    {
      departmentId: 2,
      departmentName: 'Design',
      activeMembers: 8,
      totalSubmissions: 12,
      averageRating: 8.2,
      participationRate: '90%',
    },
    {
      departmentId: 3,
      departmentName: 'Marketing',
      activeMembers: 6,
      totalSubmissions: 9,
      averageRating: 7.8,
      participationRate: '75%',
    },
  ],
  timeSeriesData: [
    { period: '2024-01', value: 45, category: 'submissions' },
    { period: '2024-02', value: 52, category: 'submissions' },
    { period: '2024-03', value: 48, category: 'submissions' },
  ],
};

const mockActivityFeed: ActivityFeed[] = [
  {
    id: 1,
    actorName: 'John Doe',
    action: 'created a new project',
    targetType: 'project',
    targetName: 'User Experience Research',
    timestamp: '2024-01-20T10:30:00Z',
    icon: '📁',
    color: 'blue',
  },
  {
    id: 2,
    actorName: 'Jane Smith',
    action: 'submitted feedback',
    targetType: 'feedback',
    targetName: 'Product Feedback Analysis',
    timestamp: '2024-01-19T15:45:00Z',
    icon: '💬',
    color: 'green',
  },
  {
    id: 3,
    actorName: 'Mike Johnson',
    action: 'updated project status',
    targetType: 'project',
    targetName: 'Employee Satisfaction Survey',
    timestamp: '2024-01-18T09:20:00Z',
    icon: '🔄',
    color: 'orange',
  },
];

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
      console.warn('Using mock data due to API error:', errorMessage);
      // Use mock data as fallback
      setData(mockDashboardData);
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
      console.warn('Using mock data due to API error:', errorMessage);
      // Use mock data as fallback
      setData(mockEnhancedData);
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
      console.warn('Using mock data due to API error:', errorMessage);
      // Use mock data as fallback
      setData(mockActivityFeed.slice(0, limit));
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
  const [data, setData] = useState<any[]>([]); // QuickAction type was removed, using any[] for now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<any[]>('/api/dashboard/quick-actions', 'GET'); // QuickAction type was removed, using any[]
      if (res.data) {
        setData(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load quick actions';
      setError(errorMessage);
      console.warn('Using mock data due to API error:', errorMessage);
      // Use mock data as fallback
      setData([]);
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
  const [data, setData] = useState<any[]>([]); // RealTimeUpdate type was removed, using any[] for now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<any[]>(`/api/dashboard/notifications?limit=${limit}`, 'GET'); // RealTimeUpdate type was removed, using any[]
      if (res.data) {
        setData(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load notifications';
      setError(errorMessage);
      console.warn('Using mock data due to API error:', errorMessage);
      // Use mock data as fallback
      setData([]);
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
  const [data, setData] = useState<any | null>(null); // RealTimeMetrics type was removed, using any for now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<any>('/api/dashboard/realtime-metrics', 'GET'); // RealTimeMetrics type was removed, using any
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load real-time metrics';
      setError(errorMessage);
      console.warn('Using mock data due to API error:', errorMessage);
      // Use mock data as fallback
      setData({
        submissionsLastHour: 5,
        projectsLastHour: 2,
        feedbacksLastHour: 8,
        activeUsersLastHour: 12,
        timestamp: new Date().toISOString(),
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
  const [data, setData] = useState<any | null>(null); // SystemHealth type was removed, using any for now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<any>('/api/dashboard/health', 'GET'); // SystemHealth type was removed, using any
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load system health';
      setError(errorMessage);
      console.warn('Using mock data due to API error:', errorMessage);
      // Use mock data as fallback
      setData({
        totalProjects: 12,
        activeFeedbacks: 8,
        totalSubmissions: 45,
        activeUsers: 24,
        healthScore: 95,
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

