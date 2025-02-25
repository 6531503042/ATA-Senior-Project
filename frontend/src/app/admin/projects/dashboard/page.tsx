'use client';

import React from 'react';
import { Folders, Users, MessageSquare, HelpCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getProjectStats } from '@/lib/api/projects';
import { ProjectStats } from '../models/types';

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
    <Card className="relative overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-gray-900">{value}</p>
              {trendValue && (
                <p className={`ml-2 text-sm ${trendColor}`}>
                  {trendValue}
                </p>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('600', '100')}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
        {(trend || subtitle) && (
          <div className="mt-4">
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
            {trend && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <TrendingUp className="mr-1.5 h-4 w-4" />
                {trend}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default function ProjectDashboard() {
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Project Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor project performance and team productivity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-32" />
            </Card>
          ))
        ) : (
          statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))
        )}
      </div>

      {/* Add more sections here like:
          - Recent Activity
          - Project Timeline
          - Team Performance
          - Resource Allocation
      */}
    </div>
  );
} 