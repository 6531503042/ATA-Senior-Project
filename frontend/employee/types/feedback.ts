import type { QuestionType } from './questions';

export type FeedbackStatus = 'unread' | 'in_review' | 'resolved';
export type FeedbackVisibility = 'anonymous' | 'identified';

export interface FeedbackAnswer {
  questionId: string;
  type: QuestionType;
  title: string;                    // snapshot of the question title used
  value: string | string[] | number | boolean; // normalized answer
}

export interface Feedback {
  id: string;
  subject: string;
  message: string;
  projectName: string;
  category?: string;
  status: FeedbackStatus;
  visibility: FeedbackVisibility;
  createdAt: string;
  reporter?: { name?: string | null; email?: string | null } | null;
  answers?: FeedbackAnswer[];       // NEW
}

export interface CreateFeedbackRequest {
  subject: string;
  message: string;
  projectName: string;
  category?: string;
  visibility: FeedbackVisibility;
  reporter?: { name?: string | null; email?: string | null } | null;
  answers: FeedbackAnswer[];        // NEW
}

export interface UpdateFeedbackRequest extends Partial<CreateFeedbackRequest> {
  id: string;
  status?: FeedbackStatus;
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });

export const statusMeta: Record<FeedbackStatus, { label: string; color: 'default' | 'warning' | 'success' }> = {
  unread: { label: 'Unread', color: 'warning' },
  in_review: { label: 'In Review', color: 'default' },
  resolved: { label: 'Resolved', color: 'success' },
};
