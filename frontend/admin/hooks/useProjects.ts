import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectResponse,
  ProjectStats,
} from '@/types/project';

import { useState, useCallback, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';

const base = '/api/projects';

function mapProject(api: any): Project {
  return {
    id: String(api.id),
    name: String(api.name),
    description: String(api.description ?? ''),
    status: (api.status ?? 'active') as Project['status'],
    timeline: { startDate: api.startDate, endDate: api.endDate },
    team: [],
    category: undefined,
    tags: undefined,
    client: undefined,
    location: undefined,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    initial: String(api.name || '').charAt(0).toUpperCase(),
  };
}

async function fetchProjects(request: ReturnType<typeof useApi>['request']): Promise<ProjectResponse> {
  const res = await request<any[]>(`${base}`, 'GET');
  const projects = (res.data || []).map(mapProject);
  const stats: ProjectStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalMembers: projects.reduce(acc => acc + 0, 0),
  } as any;
  return {
    projects,
    stats,
    pagination: { page: 1, limit: projects.length, total: projects.length, totalPages: 1 },
  };
}

async function createProjectApi(request: ReturnType<typeof useApi>['request'], data: CreateProjectRequest): Promise<Project> {
  const payload = {
    name: data.name,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status,
  };
  const res = await request<any>(`${base}`, 'POST', payload);
  return mapProject(res.data);
}

async function updateProjectApi(request: ReturnType<typeof useApi>['request'], data: UpdateProjectRequest): Promise<Project> {
  const payload: any = {
    name: data.name,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status,
  };
  const res = await request<any>(`${base}/${data.id}`, 'PUT', payload);
  return mapProject(res.data);
}

async function deleteProjectApi(request: ReturnType<typeof useApi>['request'], projectId: string): Promise<void> {
  await request<void>(`${base}/${projectId}`, 'DELETE');
}

export function useProjects() {
  const { request } = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ProjectResponse = await fetchProjects(request);

      setProjects(response.projects);
      setStats(response.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create project
  const addProject = useCallback(async (data: CreateProjectRequest) => {
    try {
      setError(null);
      const newProject = await createProjectApi(request, data);

      setProjects(prev => [newProject, ...prev]);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalProjects: prev.totalProjects + 1,
        activeProjects:
          data.status === 'active'
            ? prev.activeProjects + 1
            : prev.activeProjects,
      }));

      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    }
  }, []);

  // Update project
  const editProject = useCallback(async (data: UpdateProjectRequest) => {
    try {
      setError(null);
      const updatedProject = await updateProjectApi(request, data);

      setProjects(prev =>
        prev.map(project =>
          project.id === data.id ? updatedProject : project,
        ),
      );

      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      throw err;
    }
  }, []);

  // Delete project
  const removeProject = useCallback(async (projectId: string) => {
    try {
      setError(null);
      await deleteProjectApi(request, projectId);
      setProjects(prev => prev.filter(project => project.id !== projectId));

      // Update stats
      setStats(prev => ({
        ...prev,
        totalProjects: Math.max(0, prev.totalProjects - 1),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      throw err;
    }
  }, []);

  // Refresh projects
  const refreshProjects = useCallback(() => {
    loadProjects();
  }, [loadProjects]);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    stats,
    loading,
    error,
    addProject,
    editProject,
    removeProject,
    refreshProjects,
    loadProjects,
  };
}
