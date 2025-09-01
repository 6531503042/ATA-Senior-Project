import { useState, useEffect } from 'react';
import { addToast } from '@heroui/react';

import { Project } from '@/types/project';
import { PageResponse } from '@/types/shared';
import { apiRequest } from '@/utils/api';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<PageResponse<Project>>('/api/projects?limit=0', 'GET');

      if (res.data?.content) {
        setProjects(Array.isArray(res.data.content) ? res.data.content : []);
      } else {
        setProjects([]);
      }
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to fetch projects.'
        : 'Failed to fetch projects.';

      setError(errorMessage);
      addToast({
        title: 'Failed to fetch projects',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Partial<Project>) => {
    try {
      setLoading(true);
      const res = await apiRequest<Project>('/api/projects', 'POST', projectData);

      if (res.data) {
        setProjects((prev) => [...prev, res.data!]);
        addToast({
          title: 'Project created successfully!',
          color: 'success',
        });
        return res.data;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create project.';

      setError(errorMessage);
      addToast({
        title: 'Failed to create project',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: number, projectData: Partial<Project>) => {
    try {
      setLoading(true);
      const res = await apiRequest<Project>(`/api/projects/${id}`, 'PUT', projectData);

      if (res.data) {
        setProjects((prev) => prev.map((project) => (project.id === id ? res.data! : project)));
        addToast({
          title: 'Project updated successfully!',
          color: 'success',
        });
        return res.data;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update project.';

      setError(errorMessage);
      addToast({
        title: 'Failed to update project',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      setLoading(true);
      await apiRequest(`/api/projects/${id}`, 'DELETE');

      setProjects((prev) => prev.filter((project) => project.id !== id));
      addToast({
        title: 'Project deleted successfully!',
        color: 'success',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete project.';

      setError(errorMessage);
      addToast({
        title: 'Failed to delete project',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addProjectMembers = async (projectId: number, memberIds: number[]) => {
    try {
      setLoading(true);
      await apiRequest(`/api/projects/${projectId}/members`, 'POST', { memberIds });

      addToast({
        title: 'Members added successfully!',
        color: 'success',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add members.';

      setError(errorMessage);
      addToast({
        title: 'Failed to add members',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProjectMembers = async (projectId: number, memberIds: number[]) => {
    try {
      setLoading(true);
      await apiRequest(`/api/projects/${projectId}/members`, 'DELETE', { memberIds });

      addToast({
        title: 'Members removed successfully!',
        color: 'success',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to remove members.';

      setError(errorMessage);
      addToast({
        title: 'Failed to remove members',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addProjectMembers,
    removeProjectMembers,
    clearError,
  };
}
