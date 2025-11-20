import { useState, useEffect, useCallback } from 'react';
import { addToast } from '@heroui/react';

import { Feedback, CreateFeedbackRequest, UpdateFeedbackRequest, FeedbackStatusUpdate, FeedbackFilters } from '@/types/feedback';
import { PageResponse } from '@/types/shared';
import { apiRequest } from '@/utils/api';

export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(async (filters: FeedbackFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', (filters.page - 1).toString());
      if (filters.limit) params.append('size', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.projectId) params.append('projectId', filters.projectId.toString());
      if (filters.departmentId && filters.departmentId !== 'all') params.append('departmentId', filters.departmentId);
      if (filters.active !== undefined) params.append('active', filters.active.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const res = await apiRequest<PageResponse<Feedback>>(`/api/feedbacks?${params.toString()}`, 'GET');

      if (res.data?.content) {
        setFeedbacks(Array.isArray(res.data.content) ? res.data.content : []);
      } else {
        setFeedbacks([]);
      }
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to fetch feedbacks.'
        : 'Failed to fetch feedbacks.';

      setError(errorMessage);
      addToast({
        title: 'Failed to fetch feedbacks',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createFeedback = async (formData: FormData) => {
    try {
      const status = formData.get('status') as 'ACTIVE' | 'DRAFT' | null;
      const projectIdValue = formData.get('projectId');
      const departmentIdValue = formData.get('departmentId');
      
      const feedbackData: CreateFeedbackRequest & { active?: boolean } = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        projectId: projectIdValue ? parseInt(projectIdValue as string) : 0,
        questionIds: formData.getAll('questionIds')
          .filter(id => id != null && id !== '')
          .map(id => parseInt(id as string)),
        startDate: formData.get('startDate') as string || '',
        endDate: formData.get('endDate') as string || '',
        allowAnonymous: formData.get('allowAnonymous') === 'true',
        isDepartmentWide: formData.get('isDepartmentWide') === 'true',
        departmentId: departmentIdValue ? (departmentIdValue as string) : '',
        targetUserIds: formData.getAll('targetUserIds')
          .filter(id => id != null && id !== '')
          .map(id => parseInt(id as string)),
        targetDepartmentIds: formData.getAll('targetDepartmentIds')
          .filter(id => id != null && id !== '')
          .map(id => id as string),
        // Map status to active for backend
        active: status === 'ACTIVE' || status === null, // Default to true if not specified
      };

      const res = await apiRequest<Feedback>('/api/feedbacks', 'POST', feedbackData);
      
      addToast({
        title: 'Success',
        description: 'Feedback created successfully',
        color: 'success',
      });

      return res.data;
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to create feedback.'
        : 'Failed to create feedback.';

      addToast({
        title: 'Failed to create feedback',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    }
  };

  const updateFeedback = async (id: number, formData: FormData) => {
    try {
      const status = formData.get('status') as 'ACTIVE' | 'DRAFT' | null;
      const projectIdValue = formData.get('projectId');
      const departmentIdValue = formData.get('departmentId');
      
      const feedbackData: UpdateFeedbackRequest & { active?: boolean } = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        projectId: projectIdValue ? parseInt(projectIdValue as string) : undefined,
        questionIds: formData.getAll('questionIds')
          .filter(id => id != null && id !== '')
          .map(id => parseInt(id as string)),
        startDate: formData.get('startDate') as string || undefined,
        endDate: formData.get('endDate') as string || undefined,
        allowAnonymous: formData.get('allowAnonymous') === 'true',
        isDepartmentWide: formData.get('isDepartmentWide') === 'true',
        departmentId: departmentIdValue ? (departmentIdValue as string) : undefined,
        targetUserIds: formData.getAll('targetUserIds')
          .filter(id => id != null && id !== '')
          .map(id => parseInt(id as string)),
        targetDepartmentIds: formData.getAll('targetDepartmentIds')
          .filter(id => id != null && id !== '')
          .map(id => parseInt(id as string)),
        // Map status to active for backend compatibility
        active: status === 'ACTIVE',
      };

      const res = await apiRequest<Feedback>(`/api/feedbacks/${id}`, 'PUT', feedbackData);
      
      addToast({
        title: 'Success',
        description: 'Feedback updated successfully',
        color: 'success',
      });

      return res.data;
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to update feedback.'
        : 'Failed to update feedback.';

      addToast({
        title: 'Failed to update feedback',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    }
  };

  const deleteFeedback = async (id: number) => {
    try {
      await apiRequest(`/api/feedbacks/${id}`, 'DELETE');
      
      addToast({
        title: 'Success',
        description: 'Feedback deleted successfully',
        color: 'success',
      });

      // Refresh feedbacks list
      await fetchFeedbacks();
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to delete feedback.'
        : 'Failed to delete feedback.';

      addToast({
        title: 'Failed to delete feedback',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    }
  };

  const updateFeedbackStatus = async (id: number, status: FeedbackStatusUpdate) => {
    try {
      const res = await apiRequest<Feedback>(`/api/feedbacks/${id}/status`, 'PATCH', status);
      
      addToast({
        title: 'Success',
        description: 'Feedback status updated successfully',
        color: 'success',
      });

      // Refresh feedbacks list
      await fetchFeedbacks();
      return res.data;
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to update feedback status.'
        : 'Failed to update feedback status.';

      addToast({
        title: 'Failed to update feedback status',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    }
  };

  const getFeedbackById = async (id: number) => {
    try {
      const res = await apiRequest<Feedback>(`/api/feedbacks/${id}`, 'GET');
      return res.data;
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to fetch feedback.'
        : 'Failed to fetch feedback.';

      addToast({
        title: 'Failed to fetch feedback',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    }
  };

  const getFeedbacksByScope = async (scope: 'PROJECT' | 'DEPARTMENT' | 'CUSTOM', id: number | string) => {
    try {
      const params = new URLSearchParams();
      params.append('scope', scope);
      params.append('id', id.toString());

      const res = await apiRequest<Feedback[]>(`/api/feedbacks/scope?${params.toString()}`, 'GET');
      return res.data;
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to fetch feedbacks by scope.'
        : 'Failed to fetch feedbacks by scope.';

      addToast({
        title: 'Failed to fetch feedbacks by scope',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    }
  };

  return {
    feedbacks,
    loading,
    error,
    fetchFeedbacks,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    updateFeedbackStatus,
    getFeedbackById,
    getFeedbacksByScope,
  };
}
