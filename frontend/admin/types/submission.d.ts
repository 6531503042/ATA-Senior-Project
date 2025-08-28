export type PrivacyLevel = 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS' | 'CONFIDENTIAL';

export type SubmissionStatus = 'analyzed' | 'pending' | 'error';

export type SubmissionSentiment = 'positive' | 'neutral' | 'negative';

export interface Submission {
  id: number;
  feedbackId: number;
  submittedBy?: string;
  responses: Record<number, string>;
  overallComments?: string;
  privacyLevel: PrivacyLevel;
  submittedAt: string;
  updatedAt: string;
}

export interface CreateSubmissionRequest {
  feedbackId: number;
  responses: Record<number, string>;
  overallComments?: string;
  privacyLevel: PrivacyLevel;
}

export interface SubmissionStats {
  total: number;
  analyzed: number;
  pending: number;
  errors: number;
}

export interface SubmissionFilters {
  query: string;
  privacyLevel: PrivacyLevel[];
  feedbackId?: number;
}

export interface SubmissionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SubmissionResponse {
  submissions: Submission[];
  stats: SubmissionStats;
  pagination: SubmissionPagination;
}

// Legacy types for backward compatibility
export type SubmissionPrivacy = PrivacyLevel;
export type SubmissionItem = Submission;
