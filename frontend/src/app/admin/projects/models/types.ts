export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD'
}

export interface Project {
  id: number;
  name: string;
  description: string;
  memberIds: number[];
  projectStartDate: string;
  projectEndDate: string;
  createdAt: string;
  updatedAt: string;
  status?: ProjectStatus;
}

export interface ProjectStats {
  active: number;
  teamMembers: number;
  upcoming: number;
  completed: number;
  totalMembers: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageTeamSize: number;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  projectStartDate: string;
  projectEndDate: string;
}

export interface ProjectMembersDto {
  memberIds: number[];
}

export interface ProjectFilters {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 