'use client';

import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '@/types/project';

import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { PlusIcon, FolderIcon, UsersIcon, TrendingUpIcon } from 'lucide-react';
import { useState } from 'react';

import { ProjectsModal } from './_components/ProjectsModal';
import ProjectTable from './_components/ProjectTable';

import { PageHeader } from '@/components/ui/page-header';
import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { useProjects } from '@/hooks/useProjects';

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const {
    projects,
    loading,
    error,
    addProject,
    editProject,
    removeProject,
  } = useProjects();

  // Calculate stats from projects data
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.active).length,
    completedProjects: projects.filter(p => !p.active).length,
    totalMembers: 0, // TODO: Implement project member count
  };

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
      await editProject(data.id, data);
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await removeProject(parseInt(projectId));
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleSubmit = async (
    data: CreateProjectRequest | UpdateProjectRequest,
  ) => {
    if (editingProject) {
      await handleEditProject(data as UpdateProjectRequest);
    } else {
      await handleCreateProject(data as CreateProjectRequest);
    }
  };

  const statsCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects.toString(),
      icon: FolderIcon,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-indigo-600',
      description: 'All projects',
      gradient: 'from-blue-50 to-indigo-50',
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects.toString(),
      icon: TrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-600',
      description: 'Currently active',
      gradient: 'from-green-50 to-emerald-50',
    },
    {
      title: 'Completed Projects',
      value: stats.completedProjects.toString(),
      icon: FolderIcon,
      color: 'text-purple-600',
      bgColor: 'from-purple-500 to-violet-600',
      description: 'Successfully completed',
      gradient: 'from-purple-50 to-violet-50',
    },
    {
      title: 'Total Members',
      value: stats.totalMembers.toString(),
      icon: UsersIcon,
      color: 'text-orange-600',
      bgColor: 'from-orange-500 to-amber-600',
      description: 'Team members',
      gradient: 'from-orange-50 to-amber-50',
    },
  ];

  return (
    <>
      <PageHeader
        description="Manage and track all your projects in one place"
        icon={<FolderIcon />}
      />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-default-600 mt-1">
              Manage and track all your projects in one place
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-auto font-semibold"
              color="primary"
              startContent={<PlusIcon className="w-4 h-4" />}
              variant="shadow"
              onPress={() => setIsModalOpen(true)}
            >
              Create Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 overflow-hidden group"
            >
              <CardBody className="p-6 relative">
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-default-500 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-default-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-default-400 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Projects Table */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="pb-6">
            <div className="w-full">
              <h3 className="text-xl font-bold text-default-900">
                Project List
              </h3>
              <p className="text-sm text-default-600">
                View and manage all projects
              </p>
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
          onDelete={(projectId: string) => {
            const project = projects.find(p => p.id.toString() === projectId);
            if (project) handleDelete(project);
          }}
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
        mode={editingProject ? 'edit' : 'create'}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={() => projectToDelete && handleDeleteProject(projectToDelete.id.toString())}
        title="Delete Project"
        body={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
}
