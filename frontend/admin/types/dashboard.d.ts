// Base types matching backend DTOs
export interface DashboardOverview {
  totalProjects: number;
  totalSubmissions: number;
  totalMembers: number;
  completionRate: number;
  projectsGrowth: string;
  submissionsGrowth: string;
  membersGrowth: string;
  completionGrowth: string;
}

export interface AdvancedMetrics {
  totalActiveFeedbacks: number;
  totalCompletedFeedbacks: number;
  totalActiveUsers: number;
  averageResponseRate: number;
  averageRating: number;
  uniqueSubmitters: number;
  engagementRate: string;
}

export interface DepartmentMetrics {
  departmentId: number | null;
  departmentName: string;
  activeMembers: number;
  totalSubmissions: number;
  averageRating: number;
  participationRate: string;
}

export interface TimeSeriesMetric {
  period: string;
  value: number;
  category: string;
}

export interface ProjectItem {
  id: number | null;
  title: string;
  description: string;
  participants: number;
  createdAt: string;
  status: string;
  avatar: string;
  progress: number;
  dueDate?: string;
}

export interface FeedbackItem {
  id: number | null;
  projectTitle: string;
  description: string;
  participants: number;
  createdAt: string;
  status: string;
  avatar: string;
  sentiment: string;
  score: number;
}

// Legacy aliases for backward compatibility
export type Project = ProjectItem;
export type Feedback = FeedbackItem;

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface DashboardStats {
  overview: DashboardOverview;
  recentProjects: ProjectItem[];
  recentFeedbacks: FeedbackItem[];
  chartData: ChartData;
}

export interface EnhancedDashboardStats {
  overview: DashboardOverview;
  advanced: AdvancedMetrics;
  recentProjects: ProjectItem[];
  recentFeedbacks: FeedbackItem[];
  departmentMetrics: DepartmentMetrics[];
  chartData: ChartData;
  timeSeriesData: TimeSeriesMetric[];
}

// Real-time dashboard features
export interface RealTimeUpdate {
  type: 'notification' | 'metric_update' | 'activity';
  message: string;
  data: any;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export interface ActivityFeed {
  id: number | null;
  actorName: string;
  action: string;
  targetType: string;
  targetName: string;
  timestamp: string;
  icon: string;
  color: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  category: string;
  enabled: boolean;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'list' | 'table';
  data: any;
  gridX: number;
  gridY: number;
  gridW: number;
  gridH: number;
  visible: boolean;
}

export interface SystemHealth {
  totalProjects: number;
  activeFeedbacks: number;
  totalSubmissions: number;
  activeUsers: number;
  healthScore: number;
}

export interface RealTimeMetrics {
  submissionsLastHour: number;
  projectsLastHour: number;
  feedbacksLastHour: number;
  activeUsersLastHour: number;
  timestamp: string;
}

// Quick stats interface for dashboard overview cards
export interface QuickStats {
  totalUsers: number;
  totalDepartments: number;
  totalQuestions: number;
  totalFeedbacks: number;
  totalSubmissions: number;
  totalProjects: number;
}

// Dashboard component props
export interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'default';
  href?: string;
  loading?: boolean;
  trend?: string;
}

export interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'default';
  loading?: boolean;
}
