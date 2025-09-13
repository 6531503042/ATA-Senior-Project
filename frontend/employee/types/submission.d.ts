export type SubmissionPrivacy = "ANONYMOUS" | "PUBLIC";

export type SubmissionStatus = "analyzed" | "pending" | "error";

export type SubmissionSentiment = "positive" | "neutral" | "negative";

export interface SubmissionItem {
  id: string;
  feedbackId: string;
  feedbackTitle: string;
  projectName: string;
  submittedBy: string | null;
  privacy: SubmissionPrivacy;
  submittedAt: string; // ISO
  status: SubmissionStatus;
  overallSentiment?: SubmissionSentiment | null;
}

export interface SubmissionStats {
  total: number;
  analyzed: number;
  pending: number;
  errors: number;
}

export interface SubmissionFilters {
  query: string;
  privacy: SubmissionPrivacy[];
  status: SubmissionStatus[];
}

export interface SubmissionPagination {
  page: number;
  rowsPerPage: number;
}

export interface SubmissionResponse {
  items: SubmissionItem[];
  stats: SubmissionStats;
}


