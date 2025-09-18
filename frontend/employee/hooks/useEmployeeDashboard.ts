import { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';

export interface EmployeeDashboardData {
  stats: {
    totalFeedbacks: number;
    pendingFeedbacks: number;
    completedFeedbacks: number;
    totalSubmissions: number;
  };
  recentFeedbacks: Array<{
    id: string;
    title: string;
    projectName: string;
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed';
  }>;
  recentSubmissions: Array<{
    id: string;
    feedbackTitle: string;
    projectName: string;
    submittedAt: string;
    status: 'pending' | 'analyzed' | 'error';
    overallSentiment?: 'positive' | 'neutral' | 'negative';
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    status: 'active' | 'completed' | 'pending';
    startDate: string;
    endDate: string;
  }>;
}

export function useEmployeeDashboard() {
  const [dashboardData, setDashboardData] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch summary plus recent submissions in parallel
      const [summaryResponse, submissionsResponse] = await Promise.all([
        employeeService.getDashboardData(),
        employeeService.getMySubmissions(),
      ]);

      const submissionsData = (submissionsResponse as any)?.content || submissionsResponse || [];

      const recentSubmissions = Array.isArray(submissionsData)
        ? submissionsData
            .slice()
            .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
            .slice(0, 5)
            .map((s: any) => ({
              id: String(s.id ?? s.submissionId ?? ''),
              feedbackTitle: String(s.feedbackTitle ?? s.title ?? 'Feedback'),
              projectName: String(s.projectName ?? s.project ?? '—'),
              submittedAt: String(s.submittedAt ?? s.createdAt ?? new Date().toISOString()),
              status: (s.status as any) || 'pending',
              overallSentiment: s.overallSentiment as any,
            }))
        : [];

      // Transform the summary response to match our interface
      const transformedData: EmployeeDashboardData = {
        stats: {
          totalFeedbacks: (summaryResponse as any)?.availableFeedbacks || 0,
          pendingFeedbacks: (summaryResponse as any)?.pendingFeedbacks || 0,
          completedFeedbacks: (summaryResponse as any)?.totalSubmissions || recentSubmissions.length || 0,
          totalSubmissions: (summaryResponse as any)?.totalSubmissions || recentSubmissions.length || 0,
        },
        recentFeedbacks: [],
        recentSubmissions,
        projects: [],
      };

      setDashboardData(transformedData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Error fetching employee dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    refresh: fetchDashboardData,
  };
}
