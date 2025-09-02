import { useState, useEffect, useCallback } from 'react';
import { addToast } from '@heroui/react';

import { Project } from '@/types/project';
import { PageResponse } from '@/types/shared';
import { apiRequest } from '@/utils/api';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
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
  }, []);

  const addProject = async (projectData: FormData) => {
    try {
      setLoading(true);
      const res = await apiRequest<Project>('/api/projects', 'POST', projectData);

      if (res.data) {
        addToast({
          title: 'Project created successfully!',
          color: 'success',
        });
        
        // Refresh projects list immediately
        await fetchProjects();
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

  const editProject = async (id: number, projectData: FormData) => {
    try {
      setLoading(true);
      const res = await apiRequest<Project>(`/api/projects/${id}`, 'PUT', projectData);

      if (res.data) {
        addToast({
          title: 'Project updated successfully!',
          color: 'success',
        });
        
        // Refresh projects list immediately
        await fetchProjects();
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

  const removeProject = async (id: number) => {
    try {
      setLoading(true);
      await apiRequest(`/api/projects/${id}`, 'DELETE');

      addToast({
        title: 'Project deleted successfully!',
        color: 'success',
      });

      // Refresh projects list immediately
      await fetchProjects();
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

  const clearError = () => setError(null);

  useEffect(() => {
    fetchProjects();
  }, []); // Empty dependency array to run only once

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    editProject,
    removeProject,
    clearError,
  };
}
