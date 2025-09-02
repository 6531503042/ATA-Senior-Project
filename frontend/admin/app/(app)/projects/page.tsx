'use client';

import type { Project } from '@/types/project';
import type { Department } from '@/types/department';
import type { User } from '@/types/user';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { PlusIcon, FolderIcon } from 'lucide-react';

import ProjectModal from './_components/ProjectModal';
import ProjectTable from './_components/ProjectTable';

import { PageHeader } from '@/components/ui/page-header';
import { useProjects } from '@/hooks/useProjects';
import { useDepartment } from '@/hooks/useDepartment';
import { useUsers } from '@/hooks/useUsers';

export default function ProjectsPage() {
  const {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    editProject,
    removeProject,
  } = useProjects();

  const {
    departments,
    fetchDepartments,
  } = useDepartment();

  const {
    users,
    fetchUsers,
  } = useUsers();

  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate stats from projects data
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.active).length,
    inactiveProjects: projects.filter(p => !p.active).length,
    totalMembers: projects.reduce((sum, proj) => sum + (proj.memberCount || 0), 0),
  };

  const statsCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects.toString(),
      description: 'All active and inactive projects',
      gradient: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-600 to-indigo-700',
      icon: FolderIcon,
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects.toString(),
      description: 'Currently active projects',
      gradient: 'from-green-400 to-teal-500',
      bgColor: 'from-green-600 to-teal-700',
      icon: FolderIcon,
    },
    {
      title: 'Inactive Projects',
      value: stats.inactiveProjects.toString(),
      description: 'Projects currently inactive',
      gradient: 'from-red-400 to-rose-500',
      bgColor: 'from-red-600 to-rose-700',
      icon: FolderIcon,
    },
    {
      title: 'Total Members',
      value: stats.totalMembers.toString(),
      description: 'All members in all projects',
      gradient: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-600 to-amber-700',
      icon: FolderIcon,
    },
  ];

  useEffect(() => {
    fetchProjects();
    fetchDepartments();
    fetchUsers();
  }, []); // Run only once on component mount

  const handleAddProject = () => {
    setSelectedProject(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleSubmit = async (formData: FormData, mode: 'create' | 'edit') => {
    try {
      if (mode === 'create') {
        await addProject(formData);
      } else if (mode === 'edit' && selectedProject) {
        await editProject(selectedProject.id, formData);
      }
      handleModalClose();
    } catch (error) {
      console.error('Failed to submit project:', error);
      // Error is already handled by the hook with toast notifications
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await removeProject(parseInt(id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      // Error is already handled by the hook with toast notifications
    }
  };

  const getProjectMembers = async (projectId: number): Promise<User[]> => {
    // This would typically call an API to get project members
    // For now, return empty array - you can implement this later
    return [];
  };

  return (
    <>
      <PageHeader
        description="Manage projects and their members"
        icon={<FolderIcon />}
      />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Project Management
            </h1>
            <p className="text-default-600 mt-1">
              Manage projects and their members
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-auto font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              color="primary"
              startContent={<PlusIcon className="w-4 h-4" />}
              variant="shadow"
              onPress={handleAddProject}
            >
              Add Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, i) => (
            <Card
              key={i}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 overflow-hidden group"
            >
              <CardBody className="p-6 relative">
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
                projects={projects.map(proj => ({
                  id: proj.id.toString(),
                  name: proj.name,
                  description: proj.description,
                  memberCount: proj.memberCount || 0,
                  status: proj.active ? 'active' as const : 'inactive' as const,
                  startDate: proj.startDate,
                  endDate: proj.endDate,
                  createdAt: proj.createdAt,
                }))}
                onDelete={handleDeleteProject}
                onEdit={(project) => {
                  const originalProject = projects.find(p => p.id.toString() === project.id);
                  if (originalProject) handleEditProject(originalProject);
                }}
                onRefresh={fetchProjects}
              />
            )}
          </CardBody>
        </Card>
      </div>

      <ProjectModal
        project={selectedProject || undefined}
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        departments={departments}
        users={users}
        getProjectMembers={getProjectMembers}
      />
    </>
  );
}
