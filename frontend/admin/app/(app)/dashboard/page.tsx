'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, Spinner } from '@heroui/react';
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

/**
 * NOTES ON RESPONSIVENESS
 * - Container: max width + responsive horizontal padding
 * - Grid: mobile-first single column → 12-col at xl; balanced gaps per breakpoint
 * - Sticky utilities: header/action bar stickiness on small screens
 * - Min-width fixes: min-w-0 on grid children to prevent overflow
 * - Chart: responsive heights via utility classes
 * - Button: auto-switch to icon-only on very small screens
 * - Reduced motion: respect prefers-reduced-motion for spinners
 */

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

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

  // Consolidated error object
  const error = useMemo(() => dashboardError, [dashboardError]);

  const handleRefresh = () => {
    setLoading(true);
    refreshDashboard();
    // Reset loading after a short delay
    setTimeout(() => setLoading(false), 900);
  };

  // Respect prefers-reduced-motion for spinners
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Loading state while auth/dashboard fetching
  if (authLoading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-transparent px-4">
        <div className="text-center">
          {reducedMotion ? (
            <div className="h-12 w-12 mx-auto mb-4 rounded-full border-2 border-default-200" />
          ) : (
            <Spinner size="lg" className="mb-4" />
          )}
          <h2 className="text-lg sm:text-xl font-semibold text-default-800 mb-1">
            Loading dashboard
          </h2>
          <p className="text-default-600 text-sm sm:text-base">
            Fetching your latest metrics…
          </p>
        </div>
      </div>
    );
  }

  // Guard unauthenticated state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-transparent px-4">
        <Card className="w-full max-w-md">
          <CardBody className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Authentication required
            </h2>
            <p className="text-default-600 mb-4">
              You need to be logged in to access the dashboard.
            </p>
            <Button
              color="primary"
              variant="flat"
              onPress={() => signOut()}
              className="w-full sm:w-auto"
            >
              Go to login
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PageHeader
        description="System overview — quickly access key modules, recent activity, and statistics."
        icon={<LayoutDashboard />}
        right={
          <div className="flex items-center gap-2">
            {/* Compact refresh on xs, full on sm+ */}
            <Button
              color="primary"
              isLoading={loading || dashboardLoading}
              size="sm"
              variant="flat"
              onPress={handleRefresh}
              aria-label="Refresh dashboard"
              className="min-w-0"
              startContent={
                <RefreshCw size={16} className="shrink-0" />
              }
            >
              <span className="hidden xs:inline">Refresh</span>
            </Button>
          </div>
        }
      />

      <div className="space-y-8">
        {/* Gradient Banner */}
        <section className="relative overflow-hidden flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl mb-6">
          <div className="relative z-10 flex items-center gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Dashboard</h1>
              <p className="text-white/70 mt-1">System overview, quick actions and recent activity</p>
            </div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-auto font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20"
              color="default"
              startContent={<RefreshCw className="w-4 h-4" />}
              variant="bordered"
              onPress={handleRefresh}
              isLoading={loading || dashboardLoading}
            >
              Refresh
            </Button>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_60%)]" />
        </section>
        {/* Quick Stats Section */}
        <section className="mb-4 sm:mb-6">
          <DashboardStats loading={dashboardLoading} />
        </section>

        {/* Main Content Grid */}
        <section
          className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 lg:gap-6"
          aria-label="Dashboard content"
        >
          {/* Main column */}
          <div className="xl:col-span-9 space-y-4 sm:space-y-5 lg:space-y-6 min-w-0">
            {/* Overview */}
            <CardStat
              colors="blue-100"
              defaultOpen={true}
              icon={<TrendingUp className="w-4 h-4" />}
              isClosable={false}
              label="System Overview"
            >
              <div className="w-full min-w-0">
                <DashboardOverview
                  data={dashboard?.overview || null}
                  loading={dashboardLoading}
                />
              </div>
            </CardStat>

            {/* Chart */}
            <CardStat
              colors="green-100"
              defaultOpen={true}
              icon={<TrendingUp className="w-4 h-4" />}
              label="Analytics Chart"
            >
              <div className="w-full min-w-0">
                <DashboardChart
                  data={dashboard?.chartData || null}
                  loading={dashboardLoading}
                />
              </div>
            </CardStat>

            {/* Metrics */}
            <CardStat
              colors="purple-100"
              icon={<TrendingUp className="w-4 h-4" />}
              label="Performance Metrics"
              defaultOpen={true}
            >
              <div className="w-full min-w-0">
                <DashboardMetrics
                  dashboard={dashboard}
                  enhanced={enhanced}
                  loading={dashboardLoading}
                />
              </div>
            </CardStat>
          </div>

          {/* Right sidebar — stacks under main on <xl */}
          <aside className="xl:col-span-3 space-y-4 min-w-0">
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
              <div className="w-full min-w-0">
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
              <div className="w-full min-w-0">
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
              <div className="w-full min-w-0">
                <RecentActivity
                  activities={activityFeed}
                  loading={dashboardLoading}
                />
              </div>
            </CardStat>
          </aside>
        </section>

        {/* Error Display */}
        {error && (
          <Card className="mt-4 sm:mt-6 bg-red-50 border border-red-200">
            <CardBody className="p-4 sm:p-6">
              <p className="text-red-600 font-medium text-sm sm:text-base">
                Error loading dashboard data
              </p>
              <p className="text-red-500 text-xs sm:text-sm mt-1 break-words">
                {String(error)}
              </p>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  onPress={handleRefresh}
                >
                  Try Again
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
