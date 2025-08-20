'use client';

import type { Project } from '@/types/dashboard';

import { Button } from '@heroui/react';
import { LayoutDashboard, PlusIcon, DownloadIcon } from 'lucide-react';
import { useState } from 'react';

import { DashboardOverview } from './_components/DashboardOverview';
import { DashboardProjects } from './_components/DashboardProjects';
import { DashboardFeedbacks } from './_components/DashboardFeedbacks';
import { DashboardChart } from './_components/DashboardChart';
import { ProjectModal } from './_components/ProjectModal';

import { PageHeader } from '@/components/ui/page-header';
import { useDashboard } from '@/hooks/useDashboard';

export default function Dashboard() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const { dashboardData, addProject, exportData } = useDashboard();

  const handleCreateProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: projectData.title || '',
      description: projectData.description || '',
      participants: projectData.participants || 0,
      createdAt: 'Just now',
      status: projectData.status || 'pending',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024g',
      progress: 0,
    };

    addProject(newProject);
  };

  return (
    <>
      <PageHeader
        description="System overview — quickly access key modules, recent activity, and system statistics."
        icon={<LayoutDashboard />}
      />

      <div className="h-fit w-full flex flex-row justify-between items-center">
        <h1 className="text-3xl font-semibold">Overview</h1>
        <div className="flex gap-3">
          <Button
            startContent={<DownloadIcon className="w-4 h-4" />}
            variant="light"
            onPress={exportData}
          >
            Export
          </Button>
          <Button
            color="primary"
            size="lg"
            startContent={<PlusIcon className="w-4 h-4" />}
            variant="shadow"
            onPress={() => setIsProjectModalOpen(true)}
          >
            New Project
          </Button>
        </div>
      </div>

      <DashboardOverview data={dashboardData.overview} />

      <div className="space-y-10">
        <div>
          <h2 className="text-3xl font-bold text-default-900 mb-6">
            Analytics
          </h2>
          <div className="w-full min-h-[600px] rounded-3xl shadow-xl overflow-hidden">
            <DashboardChart data={dashboardData.chartData} />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-default-900 mb-6">
            Recent Activity
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <DashboardProjects projects={dashboardData.recentProjects} />
            <DashboardFeedbacks feedbacks={dashboardData.recentFeedbacks} />
          </div>
        </div>
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        mode="create"
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </>
  );
}
