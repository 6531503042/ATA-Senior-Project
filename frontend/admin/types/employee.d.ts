export interface EmployeeProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  departmentId?: number;
  departmentName?: string;
  roles: string[];
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDashboardSummary {
  totalProjects: number;
  totalFeedbacks: number;
  totalSubmissions: number;
  pendingFeedbacks: number;
  completedFeedbacks: number;
  averageRating: number;
  participationRate: string;
}

export interface MyProject {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
  departmentId?: number;
  roleName: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyFeedback {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  startDate: string;
  endDate: string;
  active: boolean;
  canSubmit: boolean;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MySubmission {
  id: number;
  feedbackId: number;
  feedbackTitle: string;
  projectName: string;
  submittedBy?: string;
  responses: Record<number, string>;
  overallComments?: string;
  privacyLevel: string;
  submittedAt: string;
  updatedAt: string;
}

export interface PendingFeedback {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  startDate: string;
  endDate: string;
  dueDate: string;
  questionCount: number;
  createdAt: string;
}
