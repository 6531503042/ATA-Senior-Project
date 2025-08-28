export interface Feedback {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  questionIds: number[];
  questionTitles: string[];
  targetUserIds: number[];
  targetUsernames: string[];
  targetDepartmentIds: number[];
  targetDepartmentNames: string[];
  submissionCount: number;
  canSubmit: boolean;
}

export interface CreateFeedbackRequest {
  title: string;
  description: string;
  projectId: number;
  startDate: string;
  endDate: string;
  active: boolean;
  questionIds: number[];
  targetUserIds?: number[];
  targetDepartmentIds?: number[];
}

export interface UpdateFeedbackRequest {
  id: number;
  title?: string;
  description?: string;
  projectId?: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  questionIds?: number[];
  targetUserIds?: number[];
  targetDepartmentIds?: number[];
}

export interface FeedbackStats {
  totalFeedbacks: number;
  activeFeedbacks: number;
  inactiveFeedbacks: number;
  totalSubmissions: number;
}

export interface FeedbackFilters {
  projectId?: number[];
  active?: boolean;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface FeedbackPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeedbackResponse {
  feedbacks: Feedback[];
  stats: FeedbackStats;
  pagination: FeedbackPagination;
}
