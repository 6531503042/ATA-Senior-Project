import { useState, useCallback, useEffect } from "react";
import { getProjects, createProject, updateProject, deleteProject } from "@/services/projectService";
import type { Project, CreateProjectRequest, UpdateProjectRequest, ProjectResponse } from "@/types/project";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalMembers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ProjectResponse = await getProjects();
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
      const newProject = await createProject(data);
      setProjects(prev => [newProject, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalProjects: prev.totalProjects + 1,
        activeProjects: data.status === 'active' ? prev.activeProjects + 1 : prev.activeProjects
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
      const updatedProject = await updateProject(data);
      setProjects(prev => 
        prev.map(project => 
          project.id === data.id ? updatedProject : project
        )
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
      await deleteProject(projectId);
      setProjects(prev => prev.filter(project => project.id !== projectId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalProjects: Math.max(0, prev.totalProjects - 1)
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
    loadProjects
  };
}
