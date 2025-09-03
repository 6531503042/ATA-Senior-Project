'use client';

import { Card, CardBody, Skeleton } from '@heroui/react';
import {
  Users,
  Building,
  HelpCircle,
  MessageSquare,
  Send,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { apiRequest } from '@/utils/api';
import useAuthStore from '@/stores/authStore';

interface StatData {
  totalUsers?: number;
  totalDepartments?: number;
  totalQuestions?: number;
  totalFeedbacks?: number;
  totalSubmissions?: number;
  totalProjects?: number;
  growth?: string;
  [key: string]: any;
}

interface DashboardStatsProps {
  loading?: boolean;
}

export function DashboardStats({ loading = false }: DashboardStatsProps) {
  const [statsData, setStatsData] = useState<StatData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      // Check if user is authenticated
      if (!auth.isLoggedIn()) {
        console.log('User not authenticated');
        setError('Please log in to view dashboard stats');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch all stats in parallel
        const [
          usersResponse,
          departmentsResponse,
          questionsResponse,
          feedbacksResponse,
          submissionsResponse,
          projectsResponse,
        ] = await Promise.all([
          apiRequest<StatData>('/api/dashboard/stats/users', 'GET'),
          apiRequest<StatData>('/api/dashboard/stats/departments', 'GET'),
          apiRequest<StatData>('/api/dashboard/stats/questions', 'GET'),
          apiRequest<StatData>('/api/dashboard/stats/feedbacks', 'GET'),
          apiRequest<StatData>('/api/dashboard/stats/submissions', 'GET'),
          apiRequest<StatData>('/api/dashboard/stats/projects', 'GET'),
        ]);

        const usersStats = usersResponse.data || {};
        const departmentsStats = departmentsResponse.data || {};
        const questionsStats = questionsResponse.data || {};
        const feedbacksStats = feedbacksResponse.data || {};
        const submissionsStats = submissionsResponse.data || {};
        const projectsStats = projectsResponse.data || {};

        setStatsData({
          totalUsers: usersStats.totalUsers || 0,
          totalDepartments: departmentsStats.totalDepartments || 0,
          totalQuestions: questionsStats.totalQuestions || 0,
          totalFeedbacks: feedbacksStats.totalFeedbacks || 0,
          totalSubmissions: submissionsStats.totalSubmissions || 0,
          totalProjects: projectsStats.totalProjects || 0,
          usersGrowth: usersStats.growth || '+0%',
          departmentsGrowth: departmentsStats.growth || '+0%',
          questionsGrowth: questionsStats.growth || '+0%',
          feedbacksGrowth: feedbacksStats.growth || '+0%',
          submissionsGrowth: submissionsStats.growth || '+0%',
          projectsGrowth: projectsStats.growth || '+0%',
        });
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message || 'Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [auth]);

  const statsConfig = [
    {
      title: 'Users',
      value: statsData.totalUsers || 0,
      icon: Users,
      textColor: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      href: '/users',
      trend: statsData.usersGrowth || '+0%',
      trendUp: (statsData.usersGrowth || '+0%').startsWith('+'),
    },
    {
      title: 'Departments',
      value: statsData.totalDepartments || 0,
      icon: Building,
      textColor: 'text-purple-600',
      gradient: 'from-purple-500 to-violet-600',
      href: '/departments',
      trend: statsData.departmentsGrowth || '+0%',
      trendUp: (statsData.departmentsGrowth || '+0%').startsWith('+'),
    },
    {
      title: 'Questions',
      value: statsData.totalQuestions || 0,
      icon: HelpCircle,
      textColor: 'text-green-600',
      gradient: 'from-green-500 to-emerald-600',
      href: '/questions',
      trend: statsData.questionsGrowth || '+0%',
      trendUp: (statsData.questionsGrowth || '+0%').startsWith('+'),
    },
    {
      title: 'Feedbacks',
      value: statsData.totalFeedbacks || 0,
      icon: MessageSquare,
      textColor: 'text-orange-600',
      gradient: 'from-orange-500 to-amber-600',
      href: '/feedbacks',
      trend: statsData.feedbacksGrowth || '+0%',
      trendUp: (statsData.feedbacksGrowth || '+0%').startsWith('+'),
    },
    {
      title: 'Submissions',
      value: statsData.totalSubmissions || 0,
      icon: Send,
      textColor: 'text-red-600',
      gradient: 'from-red-500 to-pink-600',
      href: '/submissions',
      trend: statsData.submissionsGrowth || '+0%',
      trendUp: (statsData.submissionsGrowth || '+0%').startsWith('+'),
    },
    {
      title: 'Projects',
      value: statsData.totalProjects || 0,
      icon: FileText,
      textColor: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-600',
      href: '/projects',
      trend: statsData.projectsGrowth || '+0%',
      trendUp: (statsData.projectsGrowth || '+0%').startsWith('+'),
    },
  ];

  if (loading || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="shadow-sm">
            <CardBody className="p-6">
              <div className="space-y-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-3/4 h-4 rounded" />
                <Skeleton className="w-1/2 h-8 rounded" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm">
        <CardBody className="p-6 text-center">
          <div className="text-red-500 mb-4">Error loading dashboard stats</div>
          <p className="text-sm text-gray-600">{error}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsConfig.map((stat, index) => (
        <Link key={index} href={stat.href}>
          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.textColor}`}>
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {stat.trendUp ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trendUp ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.trend}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}
