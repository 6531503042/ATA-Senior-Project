'use client';

import { Button } from "@heroui/react";
import { LayoutDashboard, PlusIcon, DownloadIcon } from 'lucide-react';
import { useDashboard } from "@/hooks/useDashboard";
import { PageHeader } from "@/components/ui/page-header";
import { DashboardOverview } from "./_components/DashboardOverview";
import { DashboardProjects } from "./_components/DashboardProjects";
import { DashboardFeedbacks } from "./_components/DashboardFeedbacks";
import { DashboardChart } from "./_components/DashboardChart";
import { ProjectModal } from "./_components/ProjectModal";
import { useState } from "react";
import type { Project } from "@/types/dashboard";

export default function Dashboard() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const { dashboardData, addProject, exportData } = useDashboard();

  const handleCreateProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: projectData.title || "",
      description: projectData.description || "",
      participants: projectData.participants || 0,
      createdAt: "Just now",
      status: projectData.status || "pending",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024g",
      progress: 0
    };

    addProject(newProject);
  };

  return (
    <>
      <PageHeader 
        description='System overview — quickly access key modules, recent activity, and system statistics.' 
        icon={<LayoutDashboard />} 
      />
      
      <div className="h-fit w-full flex flex-row justify-between items-center">
        <h1 className="text-3xl font-semibold">Overview</h1>
        <div className="flex gap-3">
          <Button
            variant="light"
            startContent={<DownloadIcon className="w-4 h-4" />}
            onPress={exportData}
          >
            Export
          </Button>
          <Button
            color="primary"
            variant="shadow"
            size="lg"
            startContent={<PlusIcon className="w-4 h-4" />}
            onPress={() => setIsProjectModalOpen(true)}
          >
            New Project
          </Button>
        </div>
      </div>

      <DashboardOverview data={dashboardData.overview} />

      <h1 className="text-2xl font-semibold my-6">Analytics</h1>
      <div className="w-full h-96 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-muted flex items-center justify-center">
        <DashboardChart data={dashboardData.chartData} />
      </div>

      <h1 className="text-2xl font-semibold my-6">Recent Activity</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardProjects projects={dashboardData.recentProjects} />
        <DashboardFeedbacks feedbacks={dashboardData.recentFeedbacks} />
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
        mode="create"
      />
    </>
  );
}
