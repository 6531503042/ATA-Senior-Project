import type { 
  EmployeeFeedback, 
  EmployeeSubmission, 
  EmployeeDashboardData 
} from '../types/employee';

import { api } from '../libs/apiClient';

// Employee-specific API functions
export const employeeService = {
  // Get feedbacks available to the current employee
  getMyFeedbacks: () =>
    api.get<EmployeeFeedback[]>('/api/employees/my-feedbacks'),

  // Get feedback details by ID
  getFeedbackById: (id: string) =>
    api.get<EmployeeFeedback>(`/api/feedbacks/${id}`),

  // Submit feedback response
  submitFeedback: (feedbackId: string, data: {
    responses: Record<string, string>;
    overallComments: string;
    privacyLevel: 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS';
  }) =>
    api.post<void>(`/api/submits`, {
      feedbackId: parseInt(feedbackId),
      ...data
    }),

  // Get employee's submission history
  getMySubmissions: () =>
    api.get<EmployeeSubmission[]>('/api/employees/my-submissions'),

  // Get employee's submission by ID
  getMySubmissionById: (id: string) =>
    api.get<EmployeeSubmission>(`/api/submits/${id}`),

  // Get employee's dashboard data
  getDashboardData: () =>
    api.get<EmployeeDashboardData>('/api/employees/dashboard-summary'),

  // Get employee profile
  getProfile: () =>
    api.get<any>('/api/employees/profile'),

  // Update employee profile
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) =>
    api.put<any>('/api/employees/profile', data),

  // Get projects assigned to employee
  getMyProjects: () =>
    api.get<any[]>('/api/employees/my-projects'),

  // Get project details
  getProjectById: (id: string) =>
    api.get<any>(`/api/projects/${id}`),
};

export default employeeService;
