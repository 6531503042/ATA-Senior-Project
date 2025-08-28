import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectMembersRequestDto,
} from '../types/project';
import type { PageResponse } from '../types/pagination';

import { useCallback, useEffect, useState } from 'react';

import { api } from '../libs/apiClient';

export function useProjects(params?: Record<string, any>) {
  const [data, setData] = useState<PageResponse<Project> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PageResponse<Project>>('/api/projects', params);

      setData(res);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { data, loading, error, refresh: fetchList };
}

// Legacy hook for backward compatibility
export function useProjectsLegacy() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectsResponse = await api.get<PageResponse<Project>>('/api/projects');
      const projectsList = projectsResponse?.content || [];
      
      setProjects(projectsList);
      
      const totalProjects = projectsList.length;
      const activeProjects = projectsList.filter(p => p.active).length;
      const completedProjects = projectsList.filter(p => !p.active).length;
      const totalMembers = projectsList.reduce((acc, p) => acc + 0, 0); // TODO: Add memberCount to Project type
      
      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalMembers,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      // Set fallback data when API fails
      setProjects([]);
      setStats({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalMembers: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = useCallback(async (data: CreateProjectRequest) => {
    try {
      const response = await api.post<Project>('/api/projects', data);
      setProjects(prev => [response, ...prev]);
      return response;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }, []);

  const editProject = useCallback(async (data: UpdateProjectRequest) => {
    try {
      const response = await api.put<Project>(`/api/projects/${data.id}`, data);
      setProjects(prev => prev.map(p => p.id === data.id ? response : p));
      return response;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }, []);

  const removeProject = useCallback(async (projectId: string) => {
    try {
      await api.delete(`/api/projects/${projectId}`);
      setProjects(prev => prev.filter(p => p.id !== Number(projectId)));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    stats,
    loading,
    error,
    addProject,
    editProject,
    removeProject,
    refreshProjects,
  };
}

export function useProjectStats() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll calculate stats from the projects list
      const projectsResponse = await api.get<PageResponse<Project>>('/api/projects');
      const projects = projectsResponse?.content || [];
      
      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.active).length;
      const completedProjects = projects.filter(p => !p.active).length;
      const totalMembers = projects.reduce((acc, p) => acc + 0, 0); // TODO: Add memberCount to Project type
      
      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalMembers,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project stats');
      // Set default values on error
      setStats({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalMembers: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
}

export function useProject(id?: number) {
  const [data, setData] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!id) return;
    setLoading(true);
    api
      .get<Project>(`/api/projects/${id}`)
      .then(res => {
        if (!mounted) return;
        setData(res);
        setError(null);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.message || 'Failed to load project');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return { data, loading, error };
}

export async function createProject(body: CreateProjectRequest) {
  return api.post<Project>('/api/projects', body);
}

export async function updateProject(id: number, body: UpdateProjectRequest) {
  return api.put<Project>(`/api/projects/${id}`, body);
}

export async function deleteProject(id: number) {
  return api.delete<void>(`/api/projects/${id}`);
}

export async function addProjectMembers(
  projectId: number,
  memberIds: number[],
) {
  const body: ProjectMembersRequestDto = { memberIds };

  return api.post<void>(`/api/projects/${projectId}/members`, body);
}

export async function removeProjectMembers(
  projectId: number,
  memberIds: number[],
) {
  const body: ProjectMembersRequestDto = { memberIds };

  return api.delete<void>(`/api/projects/${projectId}/members`, {
    data: body,
  });
}
