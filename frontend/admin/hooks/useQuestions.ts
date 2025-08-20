import type {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionStats,
} from '@/types/question';

import { useState, useCallback, useEffect } from 'react';

import { apiRequest } from '@/libs/apiClient';

const base = '/api/questions';

function mapQuestion(api: any): Question {
  return {
    id: String(api.id),
    title: String(api.text),
    description: api.description ?? '',
    type: String(api.questionType).toLowerCase() as Question['type'],
    category: (api.category ?? 'general') as Question['category'],
    options: undefined,
    required: Boolean(api.required),
    order: 1,
    isActive: true,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

async function fetchQuestionsApi() {
  const res = await apiRequest<any[]>(`${base}`, 'GET');
  const questions = (res.data || []).map(mapQuestion);
  const stats: QuestionStats = {
    totalQuestions: questions.length,
    activeQuestions: questions.length,
    inactiveQuestions: 0,
    totalCategories: new Set(questions.map(q => q.category)).size,
  };
  return { questions, stats, pagination: { page: 1, limit: questions.length, total: questions.length, totalPages: 1 } };
}

async function createQuestionApi(data: CreateQuestionRequest): Promise<Question> {
  const payload = {
    text: data.title,
    description: data.description,
    questionType: String(data.type).toUpperCase(),
    category: data.category,
    required: data.required,
    validationRules: '',
  };
  const res = await apiRequest<any>(`${base}`, 'POST', payload);
  return mapQuestion(res.data);
}

async function updateQuestionApi(data: UpdateQuestionRequest): Promise<Question> {
  const payload: any = {
    text: data.title,
    description: data.description,
    questionType: data.type ? String(data.type).toUpperCase() : undefined,
    category: data.category,
    required: data.required,
  };
  const res = await apiRequest<any>(`${base}/${data.id}`, 'PUT', payload);
  return mapQuestion(res.data);
}

async function deleteQuestionApi(id: string) {
  await apiRequest<void>(`${base}/${id}`, 'DELETE');
}

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<QuestionStats>({
    totalQuestions: 0,
    activeQuestions: 0,
    inactiveQuestions: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchQuestionsApi();

      setQuestions(response.questions);
      setStats(response.stats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch questions',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = (await fetchQuestionsApi()).stats;

      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch question stats:', err);
    }
  }, []);

  const addQuestion = useCallback(async (data: CreateQuestionRequest) => {
    try {
      setError(null);
      const newQuestion = await createQuestionApi(data);

      setQuestions(prev => [newQuestion, ...prev]);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        activeQuestions: prev.activeQuestions + 1,
      }));

      return newQuestion;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create question';

      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const editQuestion = useCallback(async (data: UpdateQuestionRequest) => {
    try {
      setError(null);
      const updatedQuestion = await updateQuestionApi(data);

      setQuestions(prev =>
        prev.map(question =>
          question.id === data.id ? updatedQuestion : question,
        ),
      );

      // Update stats if active status changed
      if (data.isActive !== undefined) {
        setStats(prev => ({
          ...prev,
          activeQuestions: prev.activeQuestions + (data.isActive ? 1 : -1),
          inactiveQuestions: prev.inactiveQuestions + (data.isActive ? -1 : 1),
        }));
      }

      return updatedQuestion;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update question';

      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const removeQuestion = useCallback(
    async (questionId: string) => {
      try {
        setError(null);
        await deleteQuestionApi(questionId);

        // Find the question to update stats
        const questionToDelete = questions.find(q => q.id === questionId);

        setQuestions(prev =>
          prev.filter(question => question.id !== questionId),
        );

        // Update stats
        if (questionToDelete) {
          setStats(prev => ({
            ...prev,
            totalQuestions: prev.totalQuestions - 1,
            activeQuestions:
              prev.activeQuestions - (questionToDelete.isActive ? 1 : 0),
            inactiveQuestions:
              prev.inactiveQuestions - (questionToDelete.isActive ? 0 : 1),
          }));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete question';

        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [questions],
  );

  const refreshQuestions = useCallback(() => {
    fetchQuestions();
    fetchStats();
  }, [fetchQuestions, fetchStats]);

  // Initial load
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    questions,
    stats,
    loading,
    error,
    addQuestion,
    editQuestion,
    removeQuestion,
    refreshQuestions,
  };
}
