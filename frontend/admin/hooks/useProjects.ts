import { useCallback, useEffect, useState } from 'react';
import { api } from '../libs/apiClient';
import type { Project, CreateProjectRequest, UpdateProjectRequest, ProjectMembersRequestDto } from '../types/project';
import type { PageResponse } from '../types/pagination';

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
      .then((res) => {
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

export async function addProjectMembers(projectId: number, memberIds: number[]) {
  const body: ProjectMembersRequestDto = { memberIds };
  return api.post<void>(`/api/projects/${projectId}/members`, body);
}

export async function removeProjectMembers(projectId: number, memberIds: number[]) {
  const body: ProjectMembersRequestDto = { memberIds };
  return api.delete<void>(`/api/projects/${projectId}/members`, { body } as any);
}
