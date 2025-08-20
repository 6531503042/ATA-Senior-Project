'use client';

import type {
  SubmissionItem,
  SubmissionStats,
  SubmissionFilters,
  SubmissionPagination,
} from '@/types/submission';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { apiRequest } from '@/libs/apiClient';

const base = '/api/submits';

function toItem(api: any): SubmissionItem {
  return {
    id: String(api.id),
    feedbackId: String(api.feedbackId),
    feedbackTitle: String(api.feedbackTitle ?? 'Feedback'),
    projectName: String(api.projectName ?? 'Project'),
    submittedBy: api.submittedBy ?? null,
    privacy: api.privacyLevel === 'PUBLIC' ? 'PUBLIC' : 'ANONYMOUS',
    submittedAt: String(api.submittedAt ?? api.updatedAt ?? new Date().toISOString()),
    status: 'analyzed',
    overallSentiment: null,
  };
}

export function useSubmissions() {
  const [items, setItems] = useState<SubmissionItem[]>([]);
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    analyzed: 0,
    pending: 0,
    errors: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<SubmissionFilters>({
    query: '',
    privacy: [],
    status: [],
  });
  const [pagination, setPagination] = useState<SubmissionPagination>({
    page: 1,
    rowsPerPage: 10,
  });

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiRequest<any[]>(`${base}/me`, 'GET');
      const raw = (res.data || []).map(toItem);

      const query = (filters?.query || '').toLowerCase();
      const privacySet = new Set(filters?.privacy || []);
      const statusSet = new Set(filters?.status || []);

      const filtered = raw.filter(it => {
        const matchesQuery =
          !query ||
          it.id.includes(query) ||
          it.feedbackTitle.toLowerCase().includes(query) ||
          it.projectName.toLowerCase().includes(query) ||
          (it.submittedBy || '').toLowerCase().includes(query);
        const matchesPrivacy = privacySet.size === 0 || privacySet.has(it.privacy);
        const matchesStatus = statusSet.size === 0 || statusSet.has(it.status);
        return matchesQuery && matchesPrivacy && matchesStatus;
      });

      setItems(filtered);
      setStats({ total: filtered.length, analyzed: filtered.length, pending: 0, errors: 0 });
    } catch (e: any) {
      setError(e?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pagedItems = useMemo(() => {
    const start = (pagination.page - 1) * pagination.rowsPerPage;
    return items.slice(start, start + pagination.rowsPerPage);
  }, [items, pagination]);

  const setQuery = (query: string) => setFilters(f => ({ ...f, query }));
  const setPrivacy = (privacy: SubmissionFilters['privacy']) =>
    setFilters(f => ({ ...f, privacy }));
  const setStatus = (status: SubmissionFilters['status']) =>
    setFilters(f => ({ ...f, status }));

  return {
    items: pagedItems,
    allItems: items,
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
