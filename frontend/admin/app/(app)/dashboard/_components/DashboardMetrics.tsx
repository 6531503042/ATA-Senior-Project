'use client';

import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import { 
  Activity,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import type { DashboardStats, EnhancedDashboardStats } from '@/types/dashboard';

interface DashboardMetricsProps {
  dashboard: DashboardStats | null;
  enhanced: EnhancedDashboardStats | null;
  loading?: boolean;
}

export function DashboardMetrics({ dashboard, enhanced, loading = false }: DashboardMetricsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
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

  const mainMetrics = dashboard ? [
    {
      title: 'Total Projects',
      value: dashboard.overview.totalProjects,
      icon: Target,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: dashboard.overview.projectsGrowth
    },
    {
      title: 'Total Submissions',
      value: dashboard.overview.totalSubmissions,
      icon: Activity,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: dashboard.overview.submissionsGrowth
    },
    {
      title: 'Total Members',
      value: dashboard.overview.totalMembers,
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: dashboard.overview.membersGrowth
    },
    {
      title: 'Completion Rate',
      value: `${dashboard.overview.completionRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: dashboard.overview.completionGrowth
    }
  ] : [];

  const advancedMetrics = enhanced?.advanced ? [
    {
      title: 'Active Feedbacks',
      value: enhanced.advanced.totalActiveFeedbacks,
      icon: Clock,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Completed Feedbacks',
      value: enhanced.advanced.totalCompletedFeedbacks,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Users',
      value: enhanced.advanced.totalActiveUsers,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Response Rate',
      value: `${enhanced.advanced.averageResponseRate.toFixed(1)}%`,
      icon: BarChart3,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ] : [];

  return (
    <div className="space-y-8">
      {/* Main Performance Metrics */}
      {mainMetrics.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
              <p className="text-sm text-gray-600">Key metrics and growth indicators</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainMetrics.map((metric, index) => {
              const Icon = metric.icon;
              const isPositiveTrend = metric.trend?.startsWith('+');
              
              return (
                <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                        <Icon className={`w-6 h-6 ${metric.textColor}`} />
                      </div>
                      {metric.trend && (
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          isPositiveTrend 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-red-600 bg-red-100'
                        }`}>
                          {metric.trend}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      {metric.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                    </p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Advanced Analytics */}
      {advancedMetrics.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Advanced Analytics</h2>
              <p className="text-sm text-gray-600">Detailed engagement and activity metrics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedMetrics.map((metric, index) => {
              const Icon = metric.icon;
              
              return (
                <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                        <Icon className={`w-6 h-6 ${metric.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">
                          {metric.title}
                        </h3>
                        <p className="text-xl font-bold text-gray-900">
                          {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}