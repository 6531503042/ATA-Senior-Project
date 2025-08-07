import { useState, useCallback, useEffect } from "react";
import { 
  getQuestions, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion, 
  getQuestionStats 
} from "@/services/questionService";
import type { 
  Question, 
  CreateQuestionRequest, 
  UpdateQuestionRequest, 
  QuestionStats 
} from "@/types/question";

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<QuestionStats>({
    totalQuestions: 0,
    activeQuestions: 0,
    inactiveQuestions: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getQuestions();
      setQuestions(response.questions);
      setStats(response.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getQuestionStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch question stats:', err);
    }
  }, []);

  const addQuestion = useCallback(async (data: CreateQuestionRequest) => {
    try {
      setError(null);
      const newQuestion = await createQuestion(data);
      setQuestions(prev => [newQuestion, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        activeQuestions: prev.activeQuestions + 1
      }));
      
      return newQuestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create question';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const editQuestion = useCallback(async (data: UpdateQuestionRequest) => {
    try {
      setError(null);
      const updatedQuestion = await updateQuestion(data);
      setQuestions(prev => 
        prev.map(question => 
          question.id === data.id ? updatedQuestion : question
        )
      );
      
      // Update stats if active status changed
      if (data.isActive !== undefined) {
        setStats(prev => ({
          ...prev,
          activeQuestions: prev.activeQuestions + (data.isActive ? 1 : -1),
          inactiveQuestions: prev.inactiveQuestions + (data.isActive ? -1 : 1)
        }));
      }
      
      return updatedQuestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update question';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const removeQuestion = useCallback(async (questionId: string) => {
    try {
      setError(null);
      await deleteQuestion(questionId);
      
      // Find the question to update stats
      const questionToDelete = questions.find(q => q.id === questionId);
      
      setQuestions(prev => prev.filter(question => question.id !== questionId));
      
      // Update stats
      if (questionToDelete) {
        setStats(prev => ({
          ...prev,
          totalQuestions: prev.totalQuestions - 1,
          activeQuestions: prev.activeQuestions - (questionToDelete.isActive ? 1 : 0),
          inactiveQuestions: prev.inactiveQuestions - (questionToDelete.isActive ? 0 : 1)
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete question';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [questions]);

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
    refreshQuestions
  };
}
