import { useState, useEffect, useCallback } from 'react';
import { addToast } from '@heroui/react';

import { Question, CreateQuestionRequest, UpdateQuestionRequest } from '@/types/question';
import { apiRequest } from '@/utils/api';

function normalizeQuestion(raw: any): Question {
  const normalizedType = (raw?.questionType ?? raw?.type ?? '').toString().toUpperCase();
  const allowed = new Set(['TEXT', 'MULTIPLE_CHOICE', 'RATING', 'BOOLEAN']);
  const type = (allowed.has(normalizedType) ? normalizedType : 'TEXT') as Question['type'];
  const category = (raw?.category || '').toString();
  const choices: string[] = Array.isArray(raw?.choices) ? raw.choices : [];
  const options = choices.length
    ? choices.map((c: string, i: number) => ({ id: i, text: c, value: c, order: i + 1 }))
    : Array.isArray(raw?.options)
      ? raw.options
      : [];
  return {
    ...(raw as Question),
    type,
    category,
    options,
  };
}

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{content: Question[], totalElements: number, totalPages: number} | Question[]>('/api/questions', 'GET');
      
      if (res.data && typeof res.data === 'object' && 'content' in res.data) {
        const content = Array.isArray(res.data.content) ? res.data.content : [];
        setQuestions(content.map(normalizeQuestion));
      } else if (Array.isArray(res.data)) {
        setQuestions(res.data.map(normalizeQuestion));
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
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const createQuestion = async (questionData: CreateQuestionRequest) => {
    try {
      const payload = {
        text: questionData.text,
        questionType: questionData.type,
        category: questionData.category,
        required: questionData.required,
        order: questionData.order,
        validationRules: undefined,
        options: questionData.options?.map(o => ({ text: o.text, value: (o as any).value ?? o.text, order: o.order })),
      };
      const res = await apiRequest<any>('/api/questions', 'POST', payload);
      addToast({ title: 'Success', description: 'Question created successfully', color: 'success' });
      await fetchQuestions();
      return normalizeQuestion(res.data);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to create question.'
        : 'Failed to create question.';
      addToast({ title: 'Failed to create question', description: errorMessage, color: 'danger' });
      throw err;
    }
  };

  const updateQuestion = async (id: number, questionData: UpdateQuestionRequest) => {
    try {
      const payload = {
        text: questionData.text,
        questionType: questionData.type,
        category: questionData.category,
        required: questionData.required,
        order: questionData.order,
        validationRules: undefined,
        options: questionData.options?.map(o => ({ text: o.text, value: (o as any).value ?? o.text, order: o.order })),
      };
      const res = await apiRequest<any>(`/api/questions/${id}`, 'PUT', payload);
      addToast({ title: 'Success', description: 'Question updated successfully', color: 'success' });
      await fetchQuestions();
      return normalizeQuestion(res.data);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to update question.'
        : 'Failed to update question.';
      addToast({ title: 'Failed to update question', description: errorMessage, color: 'danger' });
      throw err;
    }
  };

  const deleteQuestion = async (id: number) => {
    try {
      await apiRequest(`/api/questions/${id}`, 'DELETE');
      addToast({ title: 'Success', description: 'Question deleted successfully', color: 'success' });
      await fetchQuestions();
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to delete question.'
        : 'Failed to delete question.';
      addToast({ title: 'Failed to delete question', description: errorMessage, color: 'danger' });
      throw err;
    }
  };

  const getQuestionById = async (id: number) => {
    try {
      const res = await apiRequest<Question | null>(`/api/questions/${id}`, 'GET');
      if (!res.data) {
        throw new Error('Question not found');
      }
      return normalizeQuestion(res.data);
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to fetch question.'
        : 'Failed to fetch question.';
      addToast({ title: 'Failed to fetch question', description: errorMessage, color: 'danger' });
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
