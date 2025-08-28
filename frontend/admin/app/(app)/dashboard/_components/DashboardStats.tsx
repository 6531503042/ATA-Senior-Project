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
      textColor: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      href: '/users',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Departments',
      value: stats?.totalDepartments || 0,
      icon: Building,
      textColor: 'text-purple-600',
      gradient: 'from-purple-500 to-violet-600',
      href: '/departments',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Questions',
      value: stats?.totalQuestions || 0,
      icon: HelpCircle,
      textColor: 'text-green-600',
      gradient: 'from-green-500 to-emerald-600',
      href: '/questions',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Feedbacks',
      value: stats?.totalFeedbacks || 0,
      icon: MessageSquare,
      textColor: 'text-orange-600',
      gradient: 'from-orange-500 to-amber-600',
      href: '/feedbacks',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Submissions',
      value: stats?.totalSubmissions || 0,
      icon: Send,
      textColor: 'text-red-600',
      gradient: 'from-red-500 to-pink-600',
      href: '/submissions',
      trend: '+22%',
      trendUp: true
    },
    {
      title: 'Projects',
      value: stats?.totalProjects || 0,
      icon: FileText,
      textColor: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-600',
      href: '/projects',
      trend: '+18%',
      trendUp: true
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="shadow-xl border-0 rounded-2xl bg-gradient-to-br from-gray-50 to-white">
            <CardBody className="p-5">
              <div className="space-y-3">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="w-3/4 h-5 rounded" />
                  <Skeleton className="w-1/2 h-7 rounded" />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        const StatCard = (
          <Card 
            key={index} 
            className="bg-white shadow-xl border-0 rounded-2xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ring-1 ring-default-200/60"
            isPressable
          >
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl shadow-md flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-default-600">{stat.title}</p>
                    <p className="text-3xl font-extrabold text-default-900 leading-tight">{stat.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-default-100/80 px-2.5 py-1.5 rounded-full border border-default-200">
                  {stat.trendUp ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
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