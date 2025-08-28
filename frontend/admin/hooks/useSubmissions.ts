'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '../libs/apiClient';
import type { Submission, CreateSubmissionRequest } from '../types/submission';
import type { PageResponse } from '../types/pagination';

export function useSubmissions(params?: Record<string, any>) {
  const [data, setData] = useState<PageResponse<Submission> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PageResponse<Submission>>('/api/submits', params);
      setData(res);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { data, loading, error, refresh: fetchList };
}

export function useSubmissionsByFeedback(feedbackId?: number, params?: Record<string, any>) {
  const [data, setData] = useState<PageResponse<Submission> | null>(null);
  const [loading, setLoading] = useState<boolean>(!!feedbackId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!feedbackId) return;
    setLoading(true);
    api
      .get<PageResponse<Submission>>(`/api/submits/feedback/${feedbackId}`, params)
      .then((res) => {
        if (!mounted) return;
        setData(res);
        setError(null);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.message || 'Failed to load submissions');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [feedbackId, params]);

  return { data, loading, error };
}

export function useMySubmissions(params?: Record<string, any>) {
  const [data, setData] = useState<PageResponse<Submission> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PageResponse<Submission>>('/api/submits/me', params);
      setData(res);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { data, loading, error, refresh: fetchList };
}

export async function createSubmission(body: CreateSubmissionRequest) {
  return api.post<Submission>('/api/submits', body);
}
