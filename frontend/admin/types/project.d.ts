export type Project = {
  id: number;
  name: string;
  description: string;
  category: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  departmentId?: number;
  createdAt: string;
  updatedAt: string;
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

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
  departmentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  departmentId?: number;
  active?: boolean;
}

export interface UpdateProjectRequest {
  id: number;
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  departmentId?: number;
  active?: boolean;
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
