'use client';

import React from 'react';
import { Folders, Users, MessageSquare, HelpCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getProjectStats } from '@/lib/api/projects';
import { ProjectStats } from '../projects/models/types';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  trendValue?: string;
  trendColor?: string;
}

function StatCard({
  title,
  value,
  trend,
  subtitle,
  icon: Icon,
  color,
  trendValue,
  trendColor = 'text-green-600',
}: StatCardProps) {
  return (
    <Card className="bg-white shadow-sm hover:shadow transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {trendValue && (
                <p className={`ml-2 text-sm ${trendColor}`}>
                  {trendValue}
                </p>
              )}
            </div>
            {(trend || subtitle) && (
              <div className="mt-2">
                {subtitle && (
                  <p className="text-sm text-gray-500">{subtitle}</p>
                )}
                {trend && (
                  <div className="mt-1 flex items-center text-sm text-green-600">
                    <TrendingUp className="mr-1.5 h-4 w-4" />
                    {trend}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('600', '50')}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = React.useState<ProjectStats>({
    active: 0,
    upcoming: 0,
    completed: 0,
    total: 0,
    teamMembers: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getProjectStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch project stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Active Projects',
      value: stats.active,
      subtitle: 'Currently in progress',
      trend: '75% completion rate',
      icon: Folders,
      color: 'text-violet-600',
      trendValue: '+2 this month',
    },
    {
      title: 'Team Members',
      value: stats.teamMembers,
      subtitle: 'Across all projects',
      trend: '89% engagement rate',
      icon: Users,
      color: 'text-blue-600',
      trendValue: '+5 this week',
    },
    {
      title: 'Upcoming Projects',
      value: stats.upcoming,
      subtitle: 'Starting this month',
      trend: '92% preparation rate',
      icon: MessageSquare,
      color: 'text-green-600',
      trendValue: '+3 new',
    },
    {
      title: 'Completed Projects',
      value: stats.completed,
      subtitle: 'Successfully delivered',
      trend: '95% success rate',
      icon: HelpCircle,
      color: 'text-yellow-600',
      trendValue: '+8 this quarter',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-600">
            Monitor your project performance and team productivity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="bg-white shadow-sm animate-pulse">
                <div className="p-4">
                  <div className="h-20" />
                </div>
              </Card>
            ))
          ) : (
            statCards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No recent activity</div>
                )}
              </div>
            </div>
          </Card>

          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h2>
              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No performance data available</div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 