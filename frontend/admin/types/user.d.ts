// User Types for Backend API Integration

export interface DepartmentSummary {
  id: number;
  name: string;
}

export interface User {
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
  // Additional fields for UI compatibility
  role?: string; // For backward compatibility with UI components
  status?: 'active' | 'inactive' | 'pending' | 'suspended'; // For backward compatibility with UI components
  lastLogin?: string; // Alias for lastLoginAt
  department?: string; // Alias for department name
  position?: string; // Optional position field
}

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  phone?: string;
  departmentId?: number;
  roles?: string[];
  active?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  departmentId?: number;
  active?: boolean;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRoles: number;
}

export interface UserFilters {
  role?: string[];
  status?: ('active' | 'inactive')[];
  search?: string;
  departmentId?: number[];
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

// Employee-specific types
export interface EmployeeDashboardSummary {
  user: User;
  projectCount: number;
  availableFeedbacks: number;
  totalSubmissions: number;
  pendingFeedbacks: number;
  timestamp: string;
}

export interface EmployeeActivityData {
  userId: number;
  username: string;
  lastLoginAt?: string;
  submissionsLast30Days: number;
  projectsJoinedLast30Days: number;
  feedbacksCompletedLast30Days: number;
  activityScore: number;
}

export interface EmployeePerformanceData {
  userId: number;
  username: string;
  averageSubmissionTimeMinutes: number;
  completionRate: number;
  averageRatingGiven: number;
  contributionScore: number;
  overallPerformanceScore: number;
}
