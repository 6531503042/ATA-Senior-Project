import type { DashboardStats, Project, Feedback, DashboardOverview, ChartData } from "@/types/dashboard";
import dashboardData from "@/data/dashboard.json";
import overviewStatsConfig from "@/data/overview-stats.json";

// Type-safe data loading functions
export function getDashboardData(): DashboardStats {
  return {
    overview: dashboardData.overview as DashboardOverview,
    recentProjects: dashboardData.recentProjects.map(project => ({
      ...project,
      status: project.status as Project['status']
    })),
    recentFeedbacks: dashboardData.recentFeedbacks.map(feedback => ({
      ...feedback,
      status: feedback.status as Feedback['status'],
      sentiment: feedback.sentiment as Feedback['sentiment']
    })),
    chartData: dashboardData.chartData as ChartData
  };
}

export function getOverviewStatsConfig() {
  return overviewStatsConfig;
}

export function getDashboardOverview(): DashboardOverview {
  return dashboardData.overview as DashboardOverview;
}