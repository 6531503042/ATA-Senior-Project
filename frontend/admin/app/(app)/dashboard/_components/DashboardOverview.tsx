'use client';

import { Card, CardBody, CardHeader } from '@heroui/react';
import { BarChart3, TrendingUp } from 'lucide-react';
import type { DashboardOverview as DashboardOverviewType } from '@/types/dashboard';

interface DashboardOverviewProps {
  data: DashboardOverviewType | null;
  loading?: boolean;
}

export function DashboardOverview({ data, loading = false }: DashboardOverviewProps) {
  if (loading || !data) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
              <p className="text-sm text-gray-600">Loading performance metrics...</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  const metrics = [
    {
      title: 'Total Projects',
      value: data.totalProjects,
      growth: data.projectsGrowth,
      color: 'text-blue-600'
    },
    {
      title: 'Total Submissions',
      value: data.totalSubmissions,
      growth: data.submissionsGrowth,
      color: 'text-green-600'
    },
    {
      title: 'Total Members',
      value: data.totalMembers,
      growth: data.membersGrowth,
      color: 'text-purple-600'
    },
    {
      title: 'Completion Rate',
      value: `${data.completionRate.toFixed(1)}%`,
      growth: data.completionGrowth,
      color: 'text-orange-600'
    }
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <p className="text-sm text-gray-600">Key performance indicators</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const isPositiveTrend = metric.growth.startsWith('+');
            
            return (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {metric.title}
                </p>
                <p className={`text-2xl font-bold ${metric.color} mb-2`}>
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className={`w-4 h-4 ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ${
                    isPositiveTrend ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.growth}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
