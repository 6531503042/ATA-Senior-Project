import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart2,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { AIInsightsCard } from './AIInsightsCard';
import { getCookie } from 'cookies-next';

interface User {
  id: number;
  fullname: string;
  username: string;
  email: string;
  gender: string;
  avatar: string;
  roles: string[];
}

interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'violet' | 'emerald' | 'blue' | 'amber';
}

const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  description, 
  trend,
  color = 'violet' 
}: MetricCardProps) => {
  const colors = {
    violet: {
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      icon: 'text-violet-600',
      trend: {
        positive: 'text-violet-600 bg-violet-50',
        negative: 'text-red-600 bg-red-50'
      }
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      icon: 'text-emerald-600',
      trend: {
        positive: 'text-emerald-600 bg-emerald-50',
        negative: 'text-red-600 bg-red-50'
      }
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: 'text-blue-600',
      trend: {
        positive: 'text-blue-600 bg-blue-50',
        negative: 'text-red-600 bg-red-50'
      }
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      icon: 'text-amber-600',
      trend: {
        positive: 'text-amber-600 bg-amber-50',
        negative: 'text-red-600 bg-red-50'
      }
    }
  };

  return (
    <Card className="bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl", colors[color].bg)}>
          <Icon className={cn("h-5 w-5", colors[color].icon)} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {trend && (
              <span className={cn(
                "text-sm px-2 py-1 rounded-full",
                trend.value >= 0 
                  ? colors[color].trend.positive
                  : colors[color].trend.negative
              )}>
                {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

interface SubmissionMetricsProps {
  totalSubmissions: number;
  analyzedCount: number;
  totalProjects: number;
  totalUsers: number;
  feedbackId: number;
  recentSubmissions: number;
  submittedBy?: string | null;
  trends?: {
    submissions?: number;
    analyzed?: number;
    satisfaction?: number;
  };
}

export function SubmissionMetrics({
  totalSubmissions,
  analyzedCount,
  totalProjects,
  totalUsers,
  feedbackId,
  recentSubmissions,
  submittedBy,
  trends
}: SubmissionMetricsProps) {
  const [aiInsights, setAiInsights] = useState<any | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie('accessToken');
        const [insightsRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:8085/api/analysis/insights/${feedbackId}`),
          submittedBy ? axios.get<User[]>('http://localhost:8081/api/manager/list', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }) : Promise.resolve({ data: [] })
        ]);

        setAiInsights(insightsRes.data);

        if (submittedBy && usersRes.data) {
          const user = usersRes.data.find(u => u.id === parseInt(submittedBy));
          if (user) {
            setUserData(user);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    if (feedbackId) {
      fetchData();
    }
  }, [feedbackId, submittedBy]);

  // Calculate percentages
  const analysisPercentage = totalSubmissions > 0 
    ? Math.round((analyzedCount / totalSubmissions) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* AI Insights Card */}
      {aiInsights && <AIInsightsCard insights={aiInsights} />}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={MessageSquare}
          title="Total Submissions"
          value={totalSubmissions}
          trend={trends?.submissions ? {
            value: trends.submissions,
            label: "vs last period"
          } : {
            value: 0,
            label: "vs last period"
          }}
          color="violet"
        />

        <MetricCard
          icon={CheckCircle2}
          title="Analysis Status"
          value={`${analyzedCount}/${totalSubmissions}`}
          description={`${analysisPercentage}% analyzed`}
          trend={trends?.analyzed ? {
            value: trends.analyzed,
            label: "completion rate"
          } : undefined}
          color="emerald"
        />

        <MetricCard
          icon={BarChart2}
          title="Recent Activity"
          value={recentSubmissions}
          description="New submissions today"
          color="blue"
        />

        <MetricCard
          icon={Users}
          title="Total Participants"
          value={totalUsers}
          description="Unique contributors"
          color="amber"
        />
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Analysis Progress</h3>
            <span className="text-sm text-gray-500">{analysisPercentage}% Complete</span>
          </div>
          <Progress value={analysisPercentage} className="h-2" />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Analyzed</p>
              <p className="text-lg font-semibold text-gray-900">{analyzedCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-lg font-semibold text-gray-900">
                {totalSubmissions - analyzedCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Submission Trends</h3>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="h-[100px] flex items-end justify-between gap-2">
            {[25, 40, 35, 50, 45, 60, 75].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-full bg-violet-100 rounded-t-sm"
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <span key={i}>{day}</span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 