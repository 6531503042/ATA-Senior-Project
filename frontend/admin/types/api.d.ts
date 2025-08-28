// API Types for Backend Integration

// Common API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
  timestamp: string;
}

// API Endpoints
export interface ApiEndpoints {
  // Auth
  auth: {
    login: '/api/auth/login';
    register: '/api/auth/register';
    validate: '/api/auth/validate';
    refresh: '/api/auth/refresh-token';
    logout: '/api/auth/logout';
  };

  // Users
  users: {
    list: '/api/users';
    get: (id: number) => `/api/users/${id}`;
    me: '/api/users/me';
    create: '/api/users';
    update: (id: number) => `/api/users/${id}`;
    delete: (id: number) => `/api/users/${id}`;
    activate: (id: number) => `/api/users/${id}/activate`;
    deactivate: (id: number) => `/api/users/${id}/deactivate`;
    changePassword: (id: number) => `/api/users/${id}/password`;
    updateRoles: (id: number) => `/api/users/${id}/roles`;
    search: '/api/users/search';
    byRole: (roleName: string) => `/api/users/by-role/${roleName}`;
  };

  // Questions
  questions: {
    list: '/api/questions';
    get: (id: number) => `/api/questions/${id}`;
    create: '/api/questions';
    update: (id: number) => `/api/questions/${id}`;
    delete: (id: number) => `/api/questions/${id}`;
    types: '/api/questions/types';
    categories: '/api/questions/categories';
  };

  // Projects
  projects: {
    list: '/api/projects';
    get: (id: number) => `/api/projects/${id}`;
    create: '/api/projects';
    update: (id: number) => `/api/projects/${id}`;
    delete: (id: number) => `/api/projects/${id}`;
    addMembers: (id: number) => `/api/projects/${id}/members`;
    removeMembers: (id: number) => `/api/projects/${id}/members`;
  };

  // Project Authority
  projectAuthority: {
    init: '/api/projects/authority/init';
    roles: '/api/projects/authority/roles';
    getRole: (roleId: number) => `/api/projects/authority/roles/${roleId}`;
    createRole: '/api/projects/authority/roles';
    assignRole: (
      projectId: number,
    ) => `/api/projects/authority/${projectId}/assign`;
    bulkAssign: (
      projectId: number,
    ) => `/api/projects/authority/${projectId}/bulk-assign`;
    removeMember: (
      projectId: number,
      userId: number,
    ) => `/api/projects/authority/${projectId}/members/${userId}`;
    getMembers: (
      projectId: number,
    ) => `/api/projects/authority/${projectId}/members`;
    checkPermission: (
      projectId: number,
    ) => `/api/projects/authority/${projectId}/check-permission`;
    overview: '/api/projects/authority/overview';
    permissions: '/api/projects/authority/permissions';
  };

  // Departments
  departments: {
    list: '/api/departments';
    get: (id: number) => `/api/departments/${id}`;
    create: '/api/departments';
    update: (id: number) => `/api/departments/${id}`;
    delete: (id: number) => `/api/departments/${id}`;
  };

  // Feedback
  feedbacks: {
    list: '/api/feedbacks';
    available: '/api/feedbacks/available';
    get: (id: number) => `/api/feedbacks/${id}`;
    create: '/api/feedbacks';
    update: (id: number) => `/api/feedbacks/${id}`;
    delete: (id: number) => `/api/feedbacks/${id}`;
    addQuestions: (id: number) => `/api/feedbacks/${id}/questions`;
    removeQuestions: (id: number) => `/api/feedbacks/${id}/questions`;
    addTargetUsers: (id: number) => `/api/feedbacks/${id}/target-users`;
    removeTargetUsers: (id: number) => `/api/feedbacks/${id}/target-users`;
    addTargetDepartments: (
      id: number,
    ) => `/api/feedbacks/${id}/target-departments`;
    removeTargetDepartments: (
      id: number,
    ) => `/api/feedbacks/${id}/target-departments`;
    getProjectMembers: (
      projectId: number,
    ) => `/api/feedbacks/projects/${projectId}/members`;
    canSubmit: (id: number) => `/api/feedbacks/${id}/can-submit`;
    statistics: '/api/feedbacks/statistics';
    metrics: '/api/feedbacks/metrics';
    recent: '/api/feedbacks/recent';
    byUser: (userId: string) => `/api/feedbacks/user/${userId}`;
    byDepartment: (
      departmentId: number,
    ) => `/api/feedbacks/department/${departmentId}`;
    departmentWide: (
      departmentId: number,
    ) => `/api/feedbacks/department/${departmentId}/wide`;
    activate: (id: number) => `/api/feedbacks/${id}/activate`;
    close: (id: number) => `/api/feedbacks/${id}/close`;
  };

  // Feedback Validation
  feedbackValidation: {
    canSubmit: (
      feedbackId: number,
    ) => `/api/feedbacks/validation/${feedbackId}/can-submit`;
    constraints: (
      feedbackId: number,
    ) => `/api/feedbacks/validation/${feedbackId}/constraints`;
    validate: (
      feedbackId: number,
    ) => `/api/feedbacks/validation/${feedbackId}/validate`;
  };

  // Submissions
  submissions: {
    list: '/api/submits';
    get: (id: number) => `/api/submits/${id}`;
    create: '/api/submits';
    byFeedback: (feedbackId: number) => `/api/submits/feedback/${feedbackId}`;
    mySubmissions: '/api/submits/me';
  };

  // Dashboard
  dashboard: {
    stats: '/api/dashboard';
    advanced: '/api/dashboard/advanced';
    metrics: '/api/dashboard/metrics';
    departments: '/api/dashboard/departments';
    timeseries: '/api/dashboard/timeseries';
    activityFeed: '/api/dashboard/activity-feed';
    quickActions: '/api/dashboard/quick-actions';
    widgets: '/api/dashboard/widgets';
    realtimeMetrics: '/api/dashboard/realtime-metrics';
    notifications: '/api/dashboard/notifications';
    health: '/api/dashboard/health';
  };

  // Employee
  employees: {
    profile: '/api/employees/profile';
    myProjects: '/api/employees/my-projects';
    myFeedbacks: '/api/employees/my-feedbacks';
    mySubmissions: '/api/employees/my-submissions';
    pendingFeedbacks: '/api/employees/pending-feedbacks';
    dashboardSummary: '/api/employees/dashboard-summary';
    activitySummary: '/api/employees/activity-summary';
    performanceMetrics: '/api/employees/performance-metrics';
    departmentColleagues: '/api/employees/department-colleagues';
    statistics: '/api/employees/statistics';
  };

  // Roles
  roles: {
    list: '/api/roles';
    get: (id: number) => `/api/roles/${id}`;
    create: '/api/roles';
    update: (id: number) => `/api/roles/${id}`;
    delete: (id: number) => `/api/roles/${id}`;
  };
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request Options
export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  signal?: AbortSignal;
  auth?: boolean;
}

// Pagination Query Parameters
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
}

// Filter Query Parameters
export interface FilterQuery extends PaginationQuery {
  [key: string]: any;
}

// API Client Configuration
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  onError?: (error: ApiError) => void;
  onUnauthorized?: () => void;
}
