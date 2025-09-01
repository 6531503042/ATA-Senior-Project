export type DashboardOverview = {
  totalProjects: number;
  totalSubmissions: number;
  totalMembers: number;
  completionRate: number;
  projectsGrowth: string;
  submissionsGrowth: string;
  membersGrowth: string;
  completionGrowth: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  participants: number;
  createdAt: string;
  status: 'active' | 'completed' | 'pending';
  avatar: string;
  progress: number;
};

export type Feedback = {
  id: string;
  projectTitle: string;
  description: string;
  participants: number;
  createdAt: string;
  status: 'pending' | 'analyzed' | 'completed';
  avatar: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
};

export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
};

export type DashboardStats = {
  overview: DashboardOverview;
  recentProjects: Project[];
  recentFeedbacks: Feedback[];
  chartData: ChartData;
}; 