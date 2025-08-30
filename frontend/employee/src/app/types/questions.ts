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
  /** Optional machine value (e.g., numeric rating) */
  value?: string | number;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  category: QuestionCategory;
  /** For choice/rating questions; omit for text/boolean */
  options?: AnswerOption[];
  required: boolean;
  order: number;
  isActive: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
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

/** Convenience map for UI: project name/id -> questions assigned to that project */
export type ProjectQuestionsMap = Record<string, Question[]>;

/** Helper for building default 1..max rating options */
export const defaultRatingOptions = (max = 5): AnswerOption[] =>
  Array.from({ length: max }, (_, i) => {
    const n = i + 1;
    return { id: String(n), text: String(n), value: n };
  });