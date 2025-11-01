export type Project = {
  id: number;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  departmentId?: number;
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
  status?: ProjectStatus;
  category?: string;
  tags?: string[];
  client?: string;
  location?: string;
  timeline?: {
    startDate?: string;
    endDate?: string;
  };
  team?: ProjectMember[];
};

export interface ProjectMember {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  joinedAt: string;
  isActive: boolean;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  departmentId?: number;
  active?: boolean;
  status?: ProjectStatus;
  tags?: string[];
  client?: string;
  location?: string;
  teamMembers?: Array<number | string>;
}

export interface UpdateProjectRequest {
  id: number;
  name?: string;
  description?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  departmentId?: number;
  active?: boolean;
  status?: ProjectStatus;
  tags?: string[];
  client?: string;
  location?: string;
  teamMembers?: Array<number | string>;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  inactiveProjects: number;
  totalMembers: number;
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  departmentId?: number[];
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

// Project Authority Types
export interface ProjectRole {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}

export interface ProjectMembersRequestDto {
  memberIds: number[];
}

export interface ProjectAuthorityOverview {
  projectId: number;
  projectName: string;
  totalMembers: number;
  owners: number;
  managers: number;
  contributors: number;
  viewers: number;
  lastActivityAt: string;
}

export type ProjectStatus = 'active' | 'inactive' | 'completed' | 'pending' | 'cancelled';
