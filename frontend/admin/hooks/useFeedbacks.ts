import type {
  Feedback,
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
} from '../types/feedback';
import type { PageResponse } from '../types/pagination';

import { useCallback, useEffect, useState } from 'react';

import { api } from '../libs/apiClient';

export function useFeedbacks(params?: Record<string, any>) {
  const [data, setData] = useState<PageResponse<Feedback> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PageResponse<Feedback>>(
        '/api/feedbacks',
        params,
      );

      setData(res);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { data, loading, error, refresh: fetchList };
}

export function useFeedback(id?: number) {
  const [data, setData] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!id) return;
    setLoading(true);
    api
      .get<Feedback>(`/api/feedbacks/${id}`)
      .then(res => {
        if (!mounted) return;
        setData(res);
        setError(null);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.message || 'Failed to load feedback');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return { data, loading, error };
}

export async function createFeedback(body: CreateFeedbackRequest) {
  return api.post<Feedback>('/api/feedbacks', body);
}

export async function updateFeedback(id: number, body: UpdateFeedbackRequest) {
  return api.put<Feedback>(`/api/feedbacks/${id}`, body);
}

export async function deleteFeedback(id: number) {
  return api.delete<void>(`/api/feedbacks/${id}`);
}

export async function canSubmit(feedbackId: number) {
  return api.get<boolean>(`/api/feedbacks/validation/${feedbackId}/can-submit`);
}
