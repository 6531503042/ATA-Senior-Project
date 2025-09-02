export interface Feedback {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  projectTitle: string;
  questionIds: number[];
  startDate: string;
  endDate: string;
  createdBy: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  allowAnonymous: boolean;
  isDepartmentWide: boolean;
  departmentId: string;
  departmentName: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'DRAFT';
  targetUserIds: number[];
  targetDepartmentIds: string[];
  allowedUserIds: number[];
  submissionCount: number;
  canSubmit: boolean;
}

export interface CreateFeedbackRequest {
  title: string;
  description: string;
  projectId: number;
  questionIds: number[];
  startDate: string;
  endDate: string;
  allowAnonymous: boolean;
  isDepartmentWide: boolean;
  departmentId: string;
  targetUserIds: number[];
  targetDepartmentIds: string[];
}

export interface UpdateFeedbackRequest {
  title?: string;
  description?: string;
  projectId?: number;
  questionIds?: number[];
  startDate?: string;
  endDate?: string;
  allowAnonymous?: boolean;
  isDepartmentWide?: boolean;
  departmentId?: string;
  targetUserIds?: number[];
  targetDepartmentIds?: string[];
  status?: 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'DRAFT';
}

export interface FeedbackStatusUpdate {
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'DRAFT';
}

export interface FeedbackResponse {
  id: number;
  content: string;
  responderId: number;
  responderName: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackScope {
  type: 'PROJECT' | 'DEPARTMENT' | 'CUSTOM';
  projectId?: number;
  departmentId?: string;
  customUserIds?: number[];
}

export interface FeedbackVisibility {
  startDate: string;
  endDate: string;
  isActive: boolean;
  canSubmit: boolean;
}

export interface FeedbackFilters {
  search?: string;
  projectId?: number;
  departmentId?: string;
  status?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// สำหรับ table display
export interface FeedbackTableItem {
  id: string;
  title: string;
  description: string;
  projectName: string;
  departmentName: string;
  scope: string;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  visibility: string;
  questionsCount: number;
  submissionCount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}
