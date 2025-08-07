'use client';

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { PlusIcon, FolderIcon, UsersIcon, TrendingUpIcon } from 'lucide-react';
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectsModal } from "./_components/ProjectsModal";
import ProjectTable from "./_components/ProjectTable";
import { useProjects } from "@/hooks/useProjects";
import type { Project, CreateProjectRequest, UpdateProjectRequest } from "@/types/project";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { projects, stats, loading, error, addProject, editProject, removeProject, refreshProjects } = useProjects();

  const handleCreateProject = async (data: CreateProjectRequest) => {
    try {
      await addProject(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleEditProject = async (data: UpdateProjectRequest) => {
    try {
      await editProject(data);
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await removeProject(projectId);
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    if (editingProject) {
      await handleEditProject(data as UpdateProjectRequest);
    } else {
      await handleCreateProject(data as CreateProjectRequest);
    }
  };

  const statsCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects.toString(),
      icon: FolderIcon,
      color: "text-blue-600",
      description: "All projects"
    },
    {
      title: "Active Projects", 
      value: stats.activeProjects.toString(),
      icon: TrendingUpIcon,
      color: "text-green-600",
      description: "Currently active"
    },
    {
      title: "Completed Projects",
      value: stats.completedProjects.toString(),
      icon: FolderIcon,
      color: "text-purple-600",
      description: "Successfully completed"
    },
    {
      title: "Total Members",
      value: stats.totalMembers.toString(),
      icon: UsersIcon,
      color: "text-orange-600",
      description: "Team members"
    }
  ];

  return (
    <>
      <PageHeader 
        description='Manage and track all your projects in one place' 
        icon={<FolderIcon />} 
      />
      
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-default-900">Projects</h1>
            <p className="text-default-600 mt-1">Manage and track all your projects in one place</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              color="primary"
              variant="shadow"
              startContent={<PlusIcon className="w-4 h-4" />}
              onPress={() => setIsModalOpen(true)}
              className="w-full sm:w-auto font-semibold"
            >
              Create Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-default-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-default-900">{stat.value}</p>
                    <p className="text-xs text-default-400 mt-1">{stat.description}</p>
                  </div>
                  <div className="p-3 rounded-full bg-default-100">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Projects Table */}
        <Card className="border-none shadow-xl">
          <CardHeader className="pb-6">
            <div className="w-full">
              <h3 className="text-xl font-bold text-default-900">Project List</h3>
              <p className="text-sm text-default-600">View and manage all your projects</p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-default-400">Loading projects...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-red-500">Error: {error}</div>
              </div>
            ) : (
              <ProjectTable
                projects={projects}
                onEdit={handleEdit}
                onDelete={handleDeleteProject}
                onRefresh={refreshProjects}
              />
            )}
          </CardBody>
        </Card>
      </div>

      <ProjectsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        project={editingProject || undefined}
        mode={editingProject ? "edit" : "create"}
      />
    </>
  );
}
