import { useState, useEffect, useCallback } from 'react';
import { addToast } from '@heroui/react';

import { Question, CreateQuestionRequest, UpdateQuestionRequest } from '@/types/question';
import { apiRequest } from '@/utils/api';

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<Question[]>('/api/questions', 'GET');
      setQuestions(Array.isArray(res.data) ? res.data : []);
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
  }, []);

  const createQuestion = async (questionData: CreateQuestionRequest) => {
    try {
      const res = await apiRequest<Question>('/api/questions', 'POST', questionData);
      
      addToast({
        title: 'Success',
        description: 'Question created successfully',
        color: 'success',
      });

      // Refresh questions list
      await fetchQuestions();
      return res.data;
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to create question.'
        : 'Failed to create question.';

      addToast({
        title: 'Failed to create question',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    }
  };

  const updateQuestion = async (id: number, questionData: UpdateQuestionRequest) => {
    try {
      const res = await apiRequest<Question>(`/api/questions/${id}`, 'PUT', questionData);
      
      addToast({
        title: 'Success',
        description: 'Question updated successfully',
        color: 'success',
      });

      // Refresh questions list
      await fetchQuestions();
      return res.data;
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to update question.'
        : 'Failed to update question.';

      addToast({
        title: 'Failed to update question',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    }
  };

  const deleteQuestion = async (id: number) => {
    try {
      await apiRequest(`/api/questions/${id}`, 'DELETE');
      
      addToast({
        title: 'Success',
        description: 'Question deleted successfully',
        color: 'success',
      });

      // Refresh questions list
      await fetchQuestions();
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to delete question.'
        : 'Failed to delete question.';

      addToast({
        title: 'Failed to delete question',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    }
  };

  const getQuestionById = async (id: number) => {
    try {
      const res = await apiRequest<Question>(`/api/questions/${id}`, 'GET');
      return res.data;
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to fetch question.'
        : 'Failed to fetch question.';

      addToast({
        title: 'Failed to fetch question',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    }
  };

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionById,
  };
}
