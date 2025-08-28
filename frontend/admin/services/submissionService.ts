import { api } from '@/libs/apiClient';

export interface SubmissionResponse {
  items: any[];
  total: number;
}

export async function getSubmissionsByFeedback(feedbackId: string): Promise<SubmissionResponse> {
  try {
    const response = await api.get<any[]>(`/api/submissions?feedbackId=${feedbackId}`);
    return {
      items: Array.isArray(response) ? response : [],
      total: Array.isArray(response) ? response.length : 0,
    };
  } catch (error) {
    console.error('Error fetching submissions by feedback:', error);
    return {
      items: [],
      total: 0,
    };
  }
}
