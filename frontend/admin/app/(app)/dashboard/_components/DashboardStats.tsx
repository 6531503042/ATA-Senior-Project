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
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import type { QuickStats } from '@/types/dashboard';

interface DashboardStatsProps {
  stats: QuickStats | null;
  loading?: boolean;
}

export function DashboardStats({ stats, loading = false }: DashboardStatsProps) {
  const statsConfig = [
    {
      title: 'Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/users',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Departments',
      value: stats?.totalDepartments || 0,
      icon: Building,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/departments',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Questions',
      value: stats?.totalQuestions || 0,
      icon: HelpCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/questions',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Feedbacks',
      value: stats?.totalFeedbacks || 0,
      icon: MessageSquare,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/feedbacks',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Submissions',
      value: stats?.totalSubmissions || 0,
      icon: Send,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '/submissions',
      trend: '+22%',
      trendUp: true
    },
    {
      title: 'Projects',
      value: stats?.totalProjects || 0,
      icon: FileText,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      href: '/projects',
      trend: '+18%',
      trendUp: true
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="shadow-sm border border-default-200">
            <CardBody className="p-4">
              <div className="space-y-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="w-3/4 h-4 rounded" />
                  <Skeleton className="w-1/2 h-6 rounded" />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        const StatCard = (
          <Card 
            key={index} 
            className="shadow-sm border border-default-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            isPressable
          >
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-default-600">{stat.title}</p>
                    <p className="text-xl font-bold text-default-900">{stat.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {stat.trendUp ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        );

        return stat.href ? (
          <Link key={index} href={stat.href}>
            {StatCard}
          </Link>
        ) : (
          StatCard
        );
      })}
    </div>
  );
}