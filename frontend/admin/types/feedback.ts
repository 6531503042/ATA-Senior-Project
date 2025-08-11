export type FeedbackStatus = 'unread' | 'in_review' | 'resolved';
export type FeedbackVisibility = 'anonymous' | 'identified';

export interface Feedback {
  id: string;
  subject: string;
  message: string;
  projectName: string;
  category?: string;
  status: FeedbackStatus;
  visibility: FeedbackVisibility; // 'anonymous' means hide reporter info
  createdAt: string; // ISO
  reporter?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export const statusMeta: Record<FeedbackStatus, { label: string; color: 'default' | 'warning' | 'success' }> = {
  unread: { label: 'Unread', color: 'warning' },
  in_review: { label: 'In Review', color: 'default' },
  resolved: { label: 'Resolved', color: 'success' },
};

export interface CreateFeedbackRequest {
  subject: string;
  message: string;
  projectName: string;
  category?: string;
  visibility: FeedbackVisibility; // 'anonymous' | 'identified'
  reporter?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export interface UpdateFeedbackRequest extends Partial<CreateFeedbackRequest> {
  id: string;
  status?: FeedbackStatus;
}