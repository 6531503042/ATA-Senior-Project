export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  departments: DepartmentSummary[];
  roles: string[];
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentSummary = {
  id: number;
  name: string;
};

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password: string;
  phone?: string;
  department?: string;
  position?: string;
}

export interface UpdateUserRequest {
  id: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
  phone?: string;
  department?: string;
  position?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRoles: number;
}

export interface UserFilters {
  role?: UserRole[];
  status?: UserStatus[];
  search?: string;
  department?: string[];
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserResponse {
  users: User[];
  stats: UserStats;
  pagination: UserPagination;
}
