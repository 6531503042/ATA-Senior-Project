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
      const res = await api.get<any>('/api/questions', params);
      console.log('Questions API response:', res);
      
      // Handle different response formats
      let questions: any[] = [];
      if (res?.content && Array.isArray(res.content)) {
        questions = res.content;
      } else if (Array.isArray(res)) {
        questions = res;
      } else if (res?.questions && Array.isArray(res.questions)) {
        questions = res.questions;
      }
      
      // Create a proper PageResponse format
      const pageResponse: PageResponse<Question> = {
        content: questions,
        pageInfo: res?.pageInfo || {
          page: 0,
          limit: 10,
          sortBy: 'id',
          sortDir: 'asc',
          search: null,
        },
        totalElements: res?.totalElements || questions.length,
        totalPages: res?.totalPages || 1,
        first: res?.first || true,
        last: res?.last || true,
        hasNext: res?.hasNext || false,
        hasPrevious: res?.hasPrevious || false,
        nextCursor: res?.nextCursor || null,
        previousCursor: res?.previousCursor || null,
      };

      setData(pageResponse);
      setError(null);
    } catch (e: any) {
      console.error('Error fetching questions:', e);
      setError(e?.message || 'Failed to load questions');
      // Set fallback data
      setData({
        content: [],
        pageInfo: {
          page: 0,
          limit: 10,
          sortBy: 'id',
          sortDir: 'asc',
          search: null,
        },
        totalElements: 0,
        totalPages: 1,
        first: true,
        last: true,
        hasNext: false,
        hasPrevious: false,
        nextCursor: null,
        previousCursor: null,
      });
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
