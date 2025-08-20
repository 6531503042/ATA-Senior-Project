export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'text_based'
  | 'rating'
  | 'boolean';

export type QuestionCategory =
  | 'project_satisfaction'
  | 'technical_skills'
  | 'communication'
  | 'leadership'
  | 'work_environment'
  | 'work_life_balance'
  | 'team_collaboration'
  | 'general';

export interface AnswerOption {
  id: string;
  text: string;
  value?: string | number;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  category: QuestionCategory;
  options?: AnswerOption[];
  required: boolean;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionRequest {
  title: string;
  description?: string;
  type: QuestionType;
  category: QuestionCategory;
  options?: AnswerOption[];
  required: boolean;
  order?: number;
}

export interface UpdateQuestionRequest {
  id: string;
  title?: string;
  description?: string;
  type?: QuestionType;
  category?: QuestionCategory;
  options?: AnswerOption[];
  required?: boolean;
  order?: number;
  isActive?: boolean;
}

export interface QuestionStats {
  totalQuestions: number;
  activeQuestions: number;
  inactiveQuestions: number;
  totalCategories: number;
}

export interface QuestionFilters {
  type?: QuestionType[];
  category?: QuestionCategory[];
  search?: string;
  isActive?: boolean;
}

export interface QuestionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface QuestionResponse {
  questions: Question[];
  stats: QuestionStats;
  pagination: QuestionPagination;
}
