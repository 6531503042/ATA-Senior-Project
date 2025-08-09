"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  SubmissionItem,
  SubmissionStats,
  SubmissionFilters,
  SubmissionPagination,
} from "@/types/submission";
import { getSubmissions } from "@/services/submissionService";

export function useSubmissions() {
  const [items, setItems] = useState<SubmissionItem[]>([]);
  const [stats, setStats] = useState<SubmissionStats>({ total: 0, analyzed: 0, pending: 0, errors: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<SubmissionFilters>({ query: "", privacy: [], status: [] });
  const [pagination, setPagination] = useState<SubmissionPagination>({ page: 1, rowsPerPage: 10 });

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getSubmissions(filters);
      setItems(res.items);
      setStats(res.stats);
    } catch (e: any) {
      setError(e?.message || "Failed to load submissions");
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

  const setQuery = (query: string) => setFilters((f) => ({ ...f, query }));
  const setPrivacy = (privacy: SubmissionFilters["privacy"]) => setFilters((f) => ({ ...f, privacy }));
  const setStatus = (status: SubmissionFilters["status"]) => setFilters((f) => ({ ...f, status }));

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


