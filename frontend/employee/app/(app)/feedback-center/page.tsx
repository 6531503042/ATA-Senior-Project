'use client';

import React from 'react';
import { Card, CardBody, Spinner } from '@heroui/react';
import { useEmployeeDashboard } from '../../../hooks/useEmployeeDashboard';
import { useEmployeeFeedbacks } from '../../../hooks/useEmployeeFeedbacks';
import StatsGrid from './components/StatsGrid';
import PendingFeedbacks from './components/PendingFeedbacks';
import QuickActions from './components/QuickActions';
import ProgressOverview from './components/ProgressOverview';
import RecentActivity from './components/RecentActivity';
import RecentSubmissions from './components/RecentSubmissions';
import MyProjects from './components/MyProjects';
import PerformanceInsights from './components/PerformanceInsights';
import UpcomingDeadlines from './components/UpcomingDeadlines';
import QuickStats from './components/QuickStats';

export default function FeedbackCenter() {
  const { dashboardData, loading: dLoad, error: dErr } = useEmployeeDashboard();
  const { getPendingFeedbacks, loading: fLoad } = useEmployeeFeedbacks();

  if (dLoad || fLoad) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner />
      </div>
    );
  }

  if (dErr) {
    return (
      <Card className="bg-white  border border-slate-200">
        <CardBody>Error: {dErr}</CardBody>
      </Card>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white p-2 transition-colors border border-slate-100 rounded-lg shadow-2xl shadow-stone-100">
      <div className="px-6 py-8 space-y-8">
        <StatsGrid stats={dashboardData?.stats} />
        <PendingFeedbacks feedbacks={getPendingFeedbacks()} />
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1 space-y-6">
            <QuickActions />
            <ProgressOverview />
            <RecentActivity />
          </div>
          <div className="xl:col-span-3 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentSubmissions submissions={dashboardData?.recentSubmissions || []} />
              <MyProjects projects={dashboardData?.projects || []} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PerformanceInsights />
              <UpcomingDeadlines feedbacks={getPendingFeedbacks()} />
              <QuickStats quickStats={dashboardData?.quickStats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
