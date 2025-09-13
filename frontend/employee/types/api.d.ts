// API Types for Employee Frontend

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
    validate: '/api/auth/validate';
    refresh: '/api/auth/refresh';
    logout: '/api/auth/logout';
    me: '/api/auth/me';
  };

  // Employee
  employee: {
    profile: '/api/employees/profile';
    dashboard: '/api/employees/dashboard-summary';
    feedbacks: '/api/employees/my-feedbacks';
    feedbackById: (id: string) => `/api/feedbacks/${id}`;
    submitFeedback: '/api/submits';
    submissions: '/api/employees/my-submissions';
    submissionById: (id: string) => `/api/submits/${id}`;
    projects: '/api/employees/my-projects';
    projectById: (id: string) => `/api/projects/${id}`;
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
