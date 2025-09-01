import { useState, useEffect } from 'react';
import { addToast } from '@heroui/react';

import { Question } from '@/types/question';
import { PageResponse } from '@/types/shared';
import { apiRequest } from '@/utils/api';

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<PageResponse<Question>>('/api/questions?limit=0', 'GET');

      if (res.data?.content) {
        setQuestions(Array.isArray(res.data.content) ? res.data.content : []);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to fetch questions.'
        : 'Failed to fetch questions.';

      setError(errorMessage);
      addToast({
        title: 'Failed to fetch questions',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData: Partial<Question>) => {
    try {
      setLoading(true);
      const res = await apiRequest<Question>('/api/questions', 'POST', questionData);

      if (res.data) {
        setQuestions((prev) => [...prev, res.data!]);
        addToast({
          title: 'Question created successfully!',
          color: 'success',
        });
        return res.data;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create question.';

      setError(errorMessage);
      addToast({
        title: 'Failed to create question',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (id: number, questionData: Partial<Question>) => {
    try {
      setLoading(true);
      const res = await apiRequest<Question>(`/api/questions/${id}`, 'PUT', questionData);

      if (res.data) {
        setQuestions((prev) => prev.map((question) => (question.id === id ? res.data! : question)));
        addToast({
          title: 'Question updated successfully!',
          color: 'success',
        });
        return res.data;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update question.';

      setError(errorMessage);
      addToast({
        title: 'Failed to update question',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: number) => {
    try {
      setLoading(true);
      await apiRequest(`/api/questions/${id}`, 'DELETE');

      setQuestions((prev) => prev.filter((question) => question.id !== id));
      addToast({
        title: 'Question deleted successfully!',
        color: 'success',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete question.';

      setError(errorMessage);
      addToast({
        title: 'Failed to delete question',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getQuestionTypes = async () => {
    try {
      const res = await apiRequest<string[]>('/api/questions/types', 'GET');
      return res.data || [];
    } catch (err: any) {
      console.error('Failed to fetch question types:', err);
      return [];
    }
  };

  const getQuestionCategories = async () => {
    try {
      const res = await apiRequest<string[]>('/api/questions/categories', 'GET');
      return res.data || [];
    } catch (err: any) {
      console.error('Failed to fetch question categories:', err);
      return [];
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionTypes,
    getQuestionCategories,
    clearError,
  };
}
