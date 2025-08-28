'use client';

import { useState } from 'react';
import { Button, Card, CardBody, Skeleton } from '@heroui/react';
import { RefreshCw, LayoutDashboard, Users, Building, HelpCircle, MessageSquare, Send, FileText, TrendingUp } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboard';
import { PageHeader } from '@/components/ui/page-header';
import { CardStat } from '@/components/ui/card-stat';
import { DashboardStats } from './_components/DashboardStats';
import { QuickCreate } from './_components/QuickCreate';
import { DashboardMetrics } from './_components/DashboardMetrics';
import { DashboardChart } from './_components/DashboardChart';
import { DashboardOverview } from './_components/DashboardOverview';
import { RecentActivity } from './_components/RecentActivity';
import { RecentProjects } from './_components/RecentProjects';
import { RecentFeedbacks } from './_components/RecentFeedbacks';

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Real data hooks
  const {
    dashboard,
    enhanced,
    activityFeed,
    loading: dataLoading,
    error: dataError,
    refresh,
  } = useDashboardData();

  // Proper authentication context usage
  const { user, signOut, loading: authLoading } = useAuthContext();

  const handleRefresh = () => {
    setLoading(true);
    try {
      refresh();
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  // Show loading state while auth is being determined
  if (authLoading || loading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-default-800 mb-2">Loading Dashboard</h2>
          <p className="text-default-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  // Show error if no authenticated user
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <Card className="max-w-md">
          <CardBody className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Required</h2>
            <p className="text-default-600 mb-4">You need to be logged in to access the dashboard.</p>
            <Button 
              color="primary" 
              variant="flat" 
              onPress={() => signOut()}
            >
              Go to Login
            </Button>
            
            {/* Debug: Test Login Button */}
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        description="System overview — quickly access key modules, recent activity, and system statistics."
        icon={<LayoutDashboard />}
        right={
          <Button
            size="sm"
            variant="flat"
            color="primary"
            startContent={<RefreshCw size={16} />}
            onPress={handleRefresh}
            isLoading={loading}
          >
            Refresh
          </Button>
        }
      />

      {/* Quick Create row above overall stats */}
      <div className="mb-4 flex justify-end">
        <QuickCreate showRefresh={false} />
      </div>

      {/* Quick Stats Section - larger and tighter spacing */}
      <div className="mb-6">
        <DashboardStats 
          stats={dashboard ? {
            totalUsers: dashboard.overview.totalMembers,
            totalDepartments: 0,
            totalQuestions: 0,
            totalFeedbacks: dashboard.overview.totalSubmissions,
            totalSubmissions: dashboard.overview.totalSubmissions,
            totalProjects: dashboard.overview.totalProjects,
          } : null as any} 
          loading={dataLoading} 
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="space-y-6">
        {/* Overview Section */}
        <CardStat 
          colors="blue-100" 
          icon={<TrendingUp className="w-4 h-4" />} 
          label="System Overview"
          defaultOpen={true}
          isClosable={false}
        >
          <div className="w-full">
            <DashboardOverview data={dashboard?.overview || null} loading={dataLoading} />
          </div>
        </CardStat>

        {/* Chart Section */}
        {dashboard?.chartData && (
          <CardStat 
            colors="green-100" 
            icon={<TrendingUp className="w-4 h-4" />} 
            label="Analytics Chart"
            defaultOpen={true}
          >
            <div className="w-full">
              <DashboardChart data={dashboard.chartData} loading={dataLoading} />
            </div>
          </CardStat>
        )}

        {/* Metrics Section */}
        <CardStat 
          colors="purple-100" 
          icon={<TrendingUp className="w-4 h-4" />} 
          label="Performance Metrics"
        >
          <div className="w-full">
            <DashboardMetrics 
              dashboard={dashboard || null}
              enhanced={enhanced || null}
              loading={dataLoading}
            />
          </div>
        </CardStat>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CardStat 
              colors="orange-100" 
              icon={<Users className="w-4 h-4" />} 
              label="Recent Projects"
            >
              <div className="w-full">
                <RecentProjects projects={dashboard?.recentProjects || []} loading={dataLoading} />
              </div>
            </CardStat>
          </div>

          <div className="lg:col-span-1">
            <CardStat 
              colors="red-100" 
              icon={<MessageSquare className="w-4 h-4" />} 
              label="Recent Feedbacks"
            >
              <div className="w-full">
                <RecentFeedbacks feedbacks={dashboard?.recentFeedbacks || []} loading={dataLoading} />
              </div>
            </CardStat>
          </div>

          <div className="lg:col-span-1">
            <CardStat 
              colors="indigo-100" 
              icon={<FileText className="w-4 h-4" />} 
              label="Recent Activity"
            >
              <div className="w-full">
                <RecentActivity activities={activityFeed} loading={dataLoading} />
              </div>
            </CardStat>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(error || dataError) && (
        <Card className="mt-6 bg-red-50 border border-red-200">
          <CardBody className="p-6">
            <p className="text-red-600 font-medium">Error loading dashboard data</p>
            <p className="text-red-500 text-sm mt-1">{(error || dataError)?.message as any}</p>
            <Button 
              size="sm" 
              color="danger" 
              variant="flat" 
              onPress={handleRefresh}
              className="mt-4"
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
      )}
    </>
  );
}