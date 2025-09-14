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
      
      const response = await employeeService.getDashboardData();
      
      // Transform the response to match our interface
      const transformedData: EmployeeDashboardData = {
        stats: {
          totalFeedbacks: response?.availableFeedbacks || 0,
          pendingFeedbacks: response?.pendingFeedbacks || 0,
          completedFeedbacks: response?.totalSubmissions || 0,
          totalSubmissions: response?.totalSubmissions || 0,
        },
        recentFeedbacks: [],
        recentSubmissions: [],
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
