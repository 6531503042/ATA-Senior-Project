'use client';

import { useState } from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import {
  RefreshCw,
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  TrendingUp,
} from 'lucide-react';

import { DashboardStats } from './_components/DashboardStats';
import { QuickCreate } from './_components/QuickCreate';
import { DashboardMetrics } from './_components/DashboardMetrics';
import { DashboardChart } from './_components/DashboardChart';
import { DashboardOverview } from './_components/DashboardOverview';
import { RecentActivity } from './_components/RecentActivity';
import { RecentProjects } from './_components/RecentProjects';
import { RecentFeedbacks } from './_components/RecentFeedbacks';

import { CardStat } from '@/components/ui/card-stat';
import { PageHeader } from '@/components/ui/page-header';
import { useAuthContext } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Proper authentication context usage
  const { user, signOut, loading: authLoading } = useAuthContext();

  // Use the comprehensive dashboard data hook
  const {
    dashboard,
    enhanced,
    activityFeed,
    quickActions,
    notifications,
    realTimeMetrics,
    systemHealth,
    loading: dashboardLoading,
    error: dashboardError,
    refresh: refreshDashboard,
  } = useDashboardData();

  const handleRefresh = () => {
    setLoading(true);
    refreshDashboard();
    // Reset loading after a short delay
    setTimeout(() => setLoading(false), 1000);
  };

  // Show loading state while auth is being determined
  if (authLoading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-default-800 mb-2">
            Loading Dashboard
          </h2>
          <p className="text-default-600">
            Please wait while we fetch your data...
          </p>
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
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Authentication Required
            </h2>
            <p className="text-default-600 mb-4">
              You need to be logged in to access the dashboard.
            </p>
            <Button color="primary" variant="flat" onPress={() => signOut()}>
              Go to Login
            </Button>
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
            color="primary"
            isLoading={loading || dashboardLoading}
            size="sm"
            startContent={<RefreshCw size={16} />}
            variant="flat"
            onPress={handleRefresh}
          >
            Refresh
          </Button>
        }
      />

      {/* Quick Stats Section - using DashboardStats component */}
      <div className="mb-6">
        <DashboardStats loading={dashboardLoading} />
      </div>

      {/* Main + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main column */}
        <div className="lg:col-span-9 space-y-6">
          {/* Overview Section */}
          <CardStat
            colors="blue-100"
            defaultOpen={true}
            icon={<TrendingUp className="w-4 h-4" />}
            isClosable={false}
            label="System Overview"
          >
            <div className="w-full">
              <DashboardOverview
                data={dashboard?.overview || null}
                loading={dashboardLoading}
              />
            </div>
          </CardStat>

          {/* Chart Section */}
          <CardStat
            colors="green-100"
            defaultOpen={true}
            icon={<TrendingUp className="w-4 h-4" />}
            label="Analytics Chart"
          >
            <div className="w-full">
              <DashboardChart
                data={dashboard?.chartData || null}
                loading={dashboardLoading}
              />
            </div>
          </CardStat>

          {/* Metrics Section */}
          <CardStat
            colors="purple-100"
            icon={<TrendingUp className="w-4 h-4" />}
            label="Performance Metrics"
          >
            <div className="w-full">
              <DashboardMetrics
                dashboard={dashboard}
                enhanced={enhanced}
                loading={dashboardLoading}
              />
            </div>
          </CardStat>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <CardStat
            colors="cyan-100"
            defaultOpen={true}
            icon={<TrendingUp className="w-4 h-4" />}
            isClosable={false}
            label="Quick Actions"
          >
            <div className="w-full">
              <QuickCreate layout="compact" showRefresh={false} />
            </div>
          </CardStat>

          <CardStat
            colors="orange-100"
            defaultOpen={true}
            icon={<Users className="w-4 h-4" />}
            label="Recent Projects"
          >
            <div className="w-full">
              <RecentProjects
                loading={dashboardLoading}
                projects={dashboard?.recentProjects || []}
              />
            </div>
          </CardStat>

          <CardStat
            colors="red-100"
            defaultOpen={true}
            icon={<MessageSquare className="w-4 h-4" />}
            label="Recent Feedbacks"
          >
            <div className="w-full">
              <RecentFeedbacks
                feedbacks={dashboard?.recentFeedbacks || []}
                loading={dashboardLoading}
              />
            </div>
          </CardStat>

          <CardStat
            colors="indigo-100"
            defaultOpen={true}
            icon={<FileText className="w-4 h-4" />}
            label="Recent Activity"
          >
            <div className="w-full">
              <RecentActivity activities={activityFeed} loading={dashboardLoading} />
            </div>
          </CardStat>
        </div>
      </div>

      {/* Error Display */}
      {(error || dashboardError) && (
        <Card className="mt-6 bg-red-50 border border-red-200">
          <CardBody className="p-6">
            <p className="text-red-600 font-medium">
              Error loading dashboard data
            </p>
            <p className="text-red-500 text-sm mt-1">
              {error?.message || dashboardError}
            </p>
            <Button
              className="mt-4"
              color="danger"
              size="sm"
              variant="flat"
              onPress={handleRefresh}
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
      )}
    </>
  );
}
