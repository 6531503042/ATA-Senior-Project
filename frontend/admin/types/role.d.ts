// Role Types for Backend API Integration

export type Role = {
  _id: string;
  name: string;
  permissions?: string[];
  metadataSchema?: MetadataSchema;
  metadata?: any;
};

export type MetadataSchema = {
  [key: string]: {
    type: string;
    label: string;
    required: boolean;
  };
};

export interface CreateRoleRequest {
  name: string;
  description: string;
}

export interface UpdateRoleRequest {
  description: string;
}

export interface RoleStats {
  totalRoles: number;
  activeRoles: number;
  inactiveRoles: number;
}

export interface RoleFilters {
  search?: string;
  active?: boolean;
}

export interface RolePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RoleResponse {
  roles: Role[];
  stats: RoleStats;
  pagination: RolePagination;
}

// Project Authority Types
export interface ProjectRole {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}

export interface ProjectPermission {
  name: string;
  description: string;
  category: string;
}

export interface ProjectMemberWithRole {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  joinedAt: string;
  isActive: boolean;
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
