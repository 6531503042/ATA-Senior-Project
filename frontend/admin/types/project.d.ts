export type ProjectStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface ProjectMember {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  role?: string;
}

export interface ProjectTimeline {
  startDate: string;
  endDate: string;
  duration?: number; // in days
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  timeline: ProjectTimeline;
  team: ProjectMember[];
  category?: string;
  tags?: string[];
  client?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  initial: string; // for avatar display
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  teamMembers: string[];
  status: ProjectStatus;
  category?: string;
  tags?: string[];
  client?: string;
  location?: string;
}

export interface UpdateProjectRequest {
  id: string;
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  teamMembers?: string[];
  status?: ProjectStatus;
  category?: string;
  tags?: string[];
  client?: string;
  location?: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalMembers: number;
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  category?: string[];
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ProjectPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProjectResponse {
  projects: Project[];
  stats: ProjectStats;
  pagination: ProjectPagination;
}
