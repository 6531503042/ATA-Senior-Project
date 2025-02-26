'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from '../../components/ProjectForm';
import { getProjectById, updateProject } from '@/lib/api/projects';
import { useToast } from '@/hooks/use-toast';
import type { Project, CreateProjectDto } from '../../models/types';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [project, setProject] = React.useState<Project | undefined>(undefined);
  const projectId = React.use(Promise.resolve(params.id));

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const data = await getProjectById(parseInt(projectId, 10));
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch project details. Please try again.',
          variant: 'destructive',
        });
        router.push('/admin/projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, router, toast]);

  const handleSubmit = async (data: Partial<CreateProjectDto>) => {
    try {
      setIsLoading(true);
      await updateProject(parseInt(projectId, 10), data);
      toast({
        title: 'Success',
        description: 'Project updated successfully.',
      });
      router.push('/admin/projects');
    } catch (error) {
      console.error('Failed to update project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Project</h1>
        <button
          onClick={() => router.push('/admin/projects')}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Back to Projects
        </button>
      </div>

      <ProjectForm
        project={project}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        users={[]} // TODO: Fetch users from API
      />
    </div>
  );
} 