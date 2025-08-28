import type {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from '../types/question';
import type { PageResponse } from '../types/pagination';

import { useCallback, useEffect, useState } from 'react';

import { api } from '../libs/apiClient';

export function useQuestions(params?: Record<string, any>) {
  const [data, setData] = useState<PageResponse<Question> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PageResponse<Question>>(
        '/api/questions',
        params,
      );

      setData(res);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { data, loading, error, refresh: fetchList };
}

export function useQuestion(id?: number) {
  const [data, setData] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!id) return;
    setLoading(true);
    api
      .get<Question>(`/api/questions/${id}`)
      .then(res => {
        if (!mounted) return;
        setData(res);
        setError(null);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.message || 'Failed to load question');
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

export async function createQuestion(body: CreateQuestionRequest) {
  return api.post<Question>('/api/questions', body);
}

export async function updateQuestion(id: number, body: UpdateQuestionRequest) {
  return api.put<Question>(`/api/questions/${id}`, body);
}

export async function deleteQuestion(id: number) {
  return api.delete<void>(`/api/questions/${id}`);
}
