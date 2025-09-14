import { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';

export interface EmployeeFeedback {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  questions: EmployeeQuestion[];
  status: 'pending' | 'in_progress' | 'completed';
  submittedAt?: string;
}

export interface EmployeeQuestion {
  id: number;
  text: string;
  description?: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT_BASED' | 'SENTIMENT';
  required: boolean;
  answers?: { text: string; value: string }[];
  category: string;
}

export interface EmployeeSubmission {
  id: string;
  feedbackId: string;
  feedbackTitle: string;
  projectName: string;
  submittedAt: string;
  status: 'pending' | 'analyzed' | 'error';
  overallSentiment?: 'positive' | 'neutral' | 'negative';
  privacyLevel: 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS';
}

export function useEmployeeFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<EmployeeFeedback[]>([]);
  const [submissions, setSubmissions] = useState<EmployeeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [feedbacksResponse, submissionsResponse] = await Promise.all([
        employeeService.getMyFeedbacks(),
        employeeService.getMySubmissions(),
      ]);

      // Handle paginated response structure
      const feedbacksData = (feedbacksResponse as any)?.content || feedbacksResponse || [];
      const submissionsData = (submissionsResponse as any)?.content || submissionsResponse || [];

      setFeedbacks(Array.isArray(feedbacksData) ? feedbacksData : []);
      setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch feedbacks');
      console.error('Error fetching employee feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (
    feedbackId: string,
    data: {
      responses: Record<string, string>;
      overallComments: string;
      privacyLevel: 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS';
    }
  ) => {
    try {
      await employeeService.submitFeedback(feedbackId, data);
      // Refresh data after successful submission
      await fetchFeedbacks();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to submit feedback');
    }
  };

  const getFeedbackById = async (id: string) => {
    try {
      const response = await employeeService.getFeedbackById(id);
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to fetch feedback details');
    }
  };

  const getSubmissionById = async (id: string) => {
    try {
      const response = await employeeService.getMySubmissionById(id);
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to fetch submission details');
    }
  };

  // Get feedbacks that haven't been submitted yet
  const getPendingFeedbacks = () => {
    if (!submissions || !Array.isArray(submissions)) {
      return feedbacks.filter(f => f.active);
    }
    const submittedFeedbackIds = new Set(submissions.map(s => s.feedbackId));
    return feedbacks.filter(f => !submittedFeedbackIds.has(f.id) && f.active);
  };

  // Get completed feedbacks
  const getCompletedFeedbacks = () => {
    if (!submissions || !Array.isArray(submissions)) {
      return [];
    }
    const submittedFeedbackIds = new Set(submissions.map(s => s.feedbackId));
    return feedbacks.filter(f => submittedFeedbackIds.has(f.id));
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return {
    feedbacks,
    submissions,
    loading,
    error,
    refresh: fetchFeedbacks,
    submitFeedback,
    getFeedbackById,
    getSubmissionById,
    getPendingFeedbacks,
    getCompletedFeedbacks,
  };
}
