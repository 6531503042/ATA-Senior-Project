'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProjectList } from './components/ProjectList';
import { ProjectFilters } from './components/ProjectFilters';
import { CreateProjectForm } from './components/CreateProjectForm';
import { Project, ProjectStatus, ProjectStats } from './models/types';
import { getProjects, deleteProject, getProjectMetrics } from '@/lib/api/projects';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { PlusIcon, TrashIcon, PencilIcon, ChevronDownIcon, FilterIcon, RefreshCwIcon } from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [projectMetrics, setProjectMetrics] = React.useState<ProjectStats>({
    totalMembers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    averageTeamSize: 0,
  });
  const [filters, setFilters] = React.useState({
    search: '',
    status: [] as ProjectStatus[],
    startDate: undefined,
    endDate: undefined,
    page: 1,
    limit: 10,
  });

  const fetchProjectMetrics = React.useCallback(async () => {
    try {
      const metrics = await getProjectMetrics();
      setProjectMetrics(metrics);
    } catch (error) {
      console.error('Failed to fetch project metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch project metrics',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const fetchProjects = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getProjects(filters);
      console.log('Projects response:', response);
      
      if (Array.isArray(response)) {
        setProjects(response);
        if (response.length === 0) {
          toast({
            title: 'No Projects',
            description: 'No projects found matching your criteria.',
            variant: 'default',
          });
        }
      } else {
        setProjects([]);
        toast({
          title: 'Warning',
          description: 'Invalid response format. Please try again.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
      
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          toast({
            title: 'Authentication Error',
            description: 'Please log in again to continue.',
            variant: 'destructive',
          });
          router.push('/auth/login');
          return;
        }
      }
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch projects. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast, router]);

  React.useEffect(() => {
    fetchProjects();
    fetchProjectMetrics();
  }, [fetchProjects, fetchProjectMetrics]);

  const handleFilterChange = (name: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/projects/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id);
      toast({
        title: 'Success',
        description: 'Project deleted successfully.',
        variant: 'success',
      });
      await fetchProjects();
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to delete project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and track all your projects in one place
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<FilterIcon className="w-4 h-4" />}
              >
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetchProjects();
                  fetchProjectMetrics();
                }}
                leftIcon={<RefreshCwIcon className="w-4 h-4" />}
              >
                Refresh
              </Button>
              <Button
                size="sm"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<PlusIcon className="w-4 h-4" />}
              >
                Create Project
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <PlusIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500">Total Projects</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{projectMetrics.totalProjects}</dd>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-green-50 rounded-lg p-3">
                      <ChevronDownIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500">Active Projects</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{projectMetrics.activeProjects}</dd>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <ChevronDownIcon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500">Completed Projects</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{projectMetrics.completedProjects}</dd>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <ChevronDownIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500">Total Members</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{projectMetrics.totalMembers}</dd>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6 bg-white shadow-sm">
            <div className="p-4">
              <ProjectFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </Card>
        )}

        {/* Project List */}
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <ProjectList
              projects={projects}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              actions={(project) => (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(project.id)}
                    leftIcon={<PencilIcon className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    leftIcon={<TrashIcon className="w-4 h-4" />}
                  >
                    Delete
                  </Button>
                </div>
              )}
            />
          </div>
        </Card>
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <CreateProjectForm
          onClose={() => {
            setIsCreateModalOpen(false);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
}