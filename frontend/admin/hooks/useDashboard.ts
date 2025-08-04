import { useState, useCallback } from "react";
import { mockDashboardData } from "@/config/dashboard-data";
import type { DashboardStats, Project, Feedback } from "@/types/dashboard";

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardStats>(mockDashboardData);

  const addProject = useCallback((project: Project) => {
    setDashboardData(prev => ({
      ...prev,
      recentProjects: [project, ...prev.recentProjects.slice(0, 2)],
      overview: {
        ...prev.overview,
        totalProjects: prev.overview.totalProjects + 1
      }
    }));
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setDashboardData(prev => ({
      ...prev,
      recentProjects: prev.recentProjects.map(project =>
        project.id === projectId ? { ...project, ...updates } : project
      )
    }));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setDashboardData(prev => ({
      ...prev,
      recentProjects: prev.recentProjects.filter(project => project.id !== projectId),
      overview: {
        ...prev.overview,
        totalProjects: Math.max(0, prev.overview.totalProjects - 1)
      }
    }));
  }, []);

  const addFeedback = useCallback((feedback: Feedback) => {
    setDashboardData(prev => ({
      ...prev,
      recentFeedbacks: [feedback, ...prev.recentFeedbacks.slice(0, 2)],
      overview: {
        ...prev.overview,
        totalSubmissions: prev.overview.totalSubmissions + 1
      }
    }));
  }, []);

  const updateFeedback = useCallback((feedbackId: string, updates: Partial<Feedback>) => {
    setDashboardData(prev => ({
      ...prev,
      recentFeedbacks: prev.recentFeedbacks.map(feedback =>
        feedback.id === feedbackId ? { ...feedback, ...updates } : feedback
      )
    }));
  }, []);

  const deleteFeedback = useCallback((feedbackId: string) => {
    setDashboardData(prev => ({
      ...prev,
      recentFeedbacks: prev.recentFeedbacks.filter(feedback => feedback.id !== feedbackId),
      overview: {
        ...prev.overview,
        totalSubmissions: Math.max(0, prev.overview.totalSubmissions - 1)
      }
    }));
  }, []);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dashboard-data.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [dashboardData]);

  return {
    dashboardData,
    addProject,
    updateProject,
    deleteProject,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    exportData
  };
} 