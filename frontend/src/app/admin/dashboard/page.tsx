'use client';

import React from 'react';
import { 
  Folders, 
  Users, 
  MessageSquare, 
  HelpCircle, 
  TrendingUp,
  BarChart2,
  Calendar,
  Target,
  Activity,
  ChevronUp,
  Clock,
  Download,
  UserCheck,
  Briefcase,
  LineChart,
  PieChart,
  Star,
  Award,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getProjectStats } from '@/lib/api/projects';
import { ProjectStats } from '../projects/models/types';
import { cn } from '@/lib/utils';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                {trendValue && (
                  <p className={cn("ml-2 text-sm flex items-center gap-1", trendColor)}>
                    <ChevronUp className="h-3 w-3" />
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
            <div className={cn(
              "p-3 rounded-xl",
              color.replace('text', 'bg').replace('600', '100')
            )}>
              <Icon className={cn("h-5 w-5", color)} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

const PerformanceCard = ({ title, value, target, icon: Icon, color }: {
  title: string;
  value: number;
  target: number;
  icon: React.ElementType;
  color: string;
}) => {
  const percentage = (value / target) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border",
        "hover:shadow-md transition-all duration-300"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-12 h-12 rounded-xl",
        color.replace('text', 'bg').replace('600', '50'),
        "flex items-center justify-center"
      )}>
        <Icon className={cn("h-6 w-6", color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-gray-900">{title}</span>
          <span className="font-bold text-gray-900">{value}/{target}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={cn(
              "h-full rounded-full",
              color.replace('text', 'bg')
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};

const HighlightCard = ({ title, value, description, icon: Icon, color }: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={cn(
      "p-6 rounded-2xl border",
      "bg-gradient-to-br",
      color.includes('violet') ? "from-violet-50 to-purple-50" :
      color.includes('blue') ? "from-blue-50 to-cyan-50" :
      color.includes('green') ? "from-green-50 to-emerald-50" :
      "from-yellow-50 to-amber-50"
    )}
  >
    <div className="flex items-center gap-4">
      <div className={cn(
        "p-3 rounded-xl",
        color.replace('text', 'bg').replace('600', '100')
      )}>
        <Icon className={cn("h-6 w-6", color)} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
    </div>
    <p className="mt-4 text-sm text-gray-500">{description}</p>
  </motion.div>
);

export default function DashboardPage() {
  const [stats, setStats] = React.useState<ProjectStats>({
    active: 0,
    upcoming: 0,
    completed: 0,
    teamMembers: 0,
    totalMembers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    averageTeamSize: 0,
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

  const performanceMetrics = [
    {
      title: 'Project Completion',
      value: stats.completedProjects,
      target: stats.totalProjects,
      icon: Target,
      color: 'text-violet-600'
    },
    {
      title: 'Team Utilization',
      value: stats.teamMembers,
      target: stats.totalMembers,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      target: stats.totalProjects,
      icon: Activity,
      color: 'text-green-600'
    }
  ];

  const hrHighlights = [
    {
      title: 'Team Engagement',
      value: '92%',
      description: 'High engagement rate across all projects with positive feedback',
      icon: UserCheck,
      color: 'text-violet-600'
    },
    {
      title: 'Project Efficiency',
      value: '85%',
      description: 'Projects completed within estimated timeline and budget',
      icon: Zap,
      color: 'text-blue-600'
    },
    {
      title: 'Skill Development',
      value: '+15%',
      description: 'Increase in team skill assessments over the last quarter',
      icon: Award,
      color: 'text-green-600'
    },
    {
      title: 'Resource Allocation',
      value: '94%',
      description: 'Optimal resource utilization across all active projects',
      icon: Briefcase,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">HR Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Comprehensive overview of team performance and project management metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Last 30 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <BarChart2 className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-violet-600 font-medium">Total Projects</p>
                  <p className="text-lg font-bold text-violet-700">{stats.totalProjects}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Team Size</p>
                  <p className="text-lg font-bold text-blue-700">{stats.totalMembers}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Completion Rate</p>
                  <p className="text-lg font-bold text-green-700">
                    {((stats.completedProjects / stats.totalProjects) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Team Performance</p>
                  <p className="text-lg font-bold text-yellow-700">4.8/5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HR Highlights */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">HR Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hrHighlights.map((highlight, index) => (
              <HighlightCard key={index} {...highlight} />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="bg-white shadow-sm animate-pulse">
                <div className="p-6">
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

        {/* Performance Metrics and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <Target className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                  <p className="text-sm text-gray-500">Key performance indicators and goals</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Last 30 days</span>
              </div>
            </div>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <PerformanceCard key={index} {...metric} />
              ))}
            </div>
          </Card>

          <Card className="bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <LineChart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Team Analytics</h3>
                  <p className="text-sm text-gray-500">Performance trends and insights</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <PieChart className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {/* Team Analytics Content */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-600">Team Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">92%</p>
                  <p className="text-xs text-gray-500 mt-1">Based on feedback surveys</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-600">Skill Growth</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">+15%</p>
                  <p className="text-xs text-gray-500 mt-1">Quarter-over-quarter</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Team Distribution</p>
                  <span className="text-xs text-gray-500">By project type</span>
                </div>
                <div className="h-32 flex items-center justify-center">
                  <p className="text-sm text-gray-500">Distribution chart will be shown here</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 