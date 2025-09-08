'use client';

import type { SubmissionItem, SubmissionPrivacy, SubmissionStatus, SubmissionSentiment } from '@/types/submission';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { apiRequest } from '@/utils/api';

export type SubmissionsFilters = {
  query: string;
  privacy: SubmissionPrivacy[];
  status: SubmissionStatus[]; // kept for future extensibility
};

export type SubmissionsPagination = {
  page: number;
  rowsPerPage: number;
};

export type SubmissionsStats = {
  total: number;
  analyzed: number;
  pending: number;
};

export function useSubmissions(initial?: Partial<SubmissionsFilters & SubmissionsPagination>) {
  const [allItems, setAllItems] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<SubmissionsFilters>({
    query: initial?.query ?? '',
    privacy: (initial?.privacy as SubmissionPrivacy[]) ?? [],
    status: (initial?.status as SubmissionStatus[]) ?? [],
  });

  const [pagination, setPagination] = useState<SubmissionsPagination>({
    page: initial?.page ?? 1,
    rowsPerPage: initial?.rowsPerPage ?? 10,
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch submissions from backend
      const res = await apiRequest<{ content?: SubmissionItem[] }>('/api/submits/me', 'GET');
      let submissions = Array.isArray(res.data?.content) ? res.data?.content : [];
      
      // Enhance submissions with additional data for UI display
      const enhancedSubmissions = await Promise.all(
        submissions.map(async (submission) => {
          try {
            // Fetch feedback details to get title
            const feedbackRes = await apiRequest<{ title?: string; projectId?: number }>(`/api/feedbacks/${submission.feedbackId}`, 'GET');
            const feedbackTitle = feedbackRes.data?.title || `Feedback #${submission.feedbackId}`;
            
            // Fetch project details if available
            let projectName = '';
            if (feedbackRes.data?.projectId) {
              try {
                const projectRes = await apiRequest<{ name?: string }>(`/api/projects/${feedbackRes.data.projectId}`, 'GET');
                projectName = projectRes.data?.name || '';
              } catch {
                // Ignore project fetch errors
              }
            }
            
            return {
              ...submission,
              feedbackTitle,
              projectName,
              status: 'analyzed' as SubmissionStatus, // Default status
              overallSentiment: 'neutral' as SubmissionSentiment, // Default sentiment
            };
          } catch {
            // If enhancement fails, return original submission
            return {
              ...submission,
              feedbackTitle: `Feedback #${submission.feedbackId}`,
              projectName: '',
              status: 'analyzed' as SubmissionStatus,
              overallSentiment: 'neutral' as SubmissionSentiment,
            };
          }
        })
      );
      
      setAllItems(enhancedSubmissions);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load submissions');
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    let items = Array.isArray(allItems) ? [...allItems] : [];

    if (q) {
      items = items.filter(i =>
        String(i.id).includes(q) ||
        (i as any).feedbackTitle?.toLowerCase?.().includes(q) ||
        (i as any).projectName?.toLowerCase?.().includes(q) ||
        (i.submittedBy ? String(i.submittedBy).toLowerCase().includes(q) : false),
      );
    }

    if (filters.privacy.length > 0) {
      const set = new Set(filters.privacy);
      items = items.filter(i => (i as any).privacyLevel ? set.has((i as any).privacyLevel) : false);
    }

    if (filters.status.length > 0) {
      const set = new Set(filters.status);
      items = items.filter(i => (i as any).status ? set.has((i as any).status as SubmissionStatus) : false);
    }

    return items;
  }, [allItems, filters]);

  const items = useMemo(() => {
    const start = (pagination.page - 1) * pagination.rowsPerPage;
    const end = start + pagination.rowsPerPage;
    return filtered.slice(start, end);
  }, [filtered, pagination]);

  const stats: SubmissionsStats = useMemo(() => {
    return {
      total: filtered.length,
      analyzed: filtered.filter(i => (i as any).status === 'analyzed').length,
      pending: filtered.filter(i => (i as any).status === 'pending').length,
    };
  }, [filtered]);

  const setQuery = (query: string) => setFilters(prev => ({ ...prev, query }));
  const setPrivacy = (privacy: SubmissionPrivacy[]) => setFilters(prev => ({ ...prev, privacy }));
  const setStatus = (status: SubmissionStatus[]) => setFilters(prev => ({ ...prev, status }));

  return {
    items,
    allItems,
    stats,
    loading,
    error,
    filters,
    pagination,
    setPagination,
    setQuery,
    setPrivacy,
    setStatus,
    refresh,
  };
}

export async function createSubmission(body: any) {
  return apiRequest('/api/submits', 'POST', body);
}

export function useSubmissionsByFeedback(feedbackId?: number, params?: Record<string, any>) {
  const [data, setData] = useState<SubmissionItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(!!feedbackId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!feedbackId) return;
    setLoading(true);
    apiRequest<{ content?: SubmissionItem[] }>(`/api/submits/feedback/${feedbackId}`, 'GET', params)
      .then(res => { 
        if (mounted) { 
          const submissions = Array.isArray(res.data?.content) ? res.data?.content : [];
          setData(submissions); 
          setError(null); 
        } 
      })
      .catch((e: any) => { if (mounted) { setError(e?.message || 'Failed to load submissions'); } })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [feedbackId, params]);

  return { data, loading, error };
}

export async function fetchSubmissionStats(): Promise<SubmissionsStats> {
  try {
    const res = await apiRequest<{ total?: number; analyzed?: number; pending?: number }>('/api/dashboard/stats/submissions', 'GET');
    return {
      total: res.data?.total ?? 0,
      analyzed: res.data?.analyzed ?? 0,
      pending: res.data?.pending ?? 0,
    };
  } catch {
    return { total: 0, analyzed: 0, pending: 0 };
  }
}
