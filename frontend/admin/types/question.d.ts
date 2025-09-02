export interface Question {
  id: number;
  text: string;
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'RATING' | 'BOOLEAN';
  required: boolean;
  order: number;
  category?: string;
  options?: QuestionOption[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOption {
  id: number;
  text: string;
  value: string;
  order: number;
}

export interface CreateQuestionRequest {
  text: string;
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'RATING' | 'BOOLEAN';
  required: boolean;
  order: number;
  category?: string;
  options?: Omit<QuestionOption, 'id'>[];
}

export interface UpdateQuestionRequest {
  text?: string;
  type?: 'TEXT' | 'MULTIPLE_CHOICE' | 'RATING' | 'BOOLEAN';
  required?: boolean;
  order?: number;
  category?: string;
  options?: Omit<QuestionOption, 'id'>[];
}

export interface QuestionCategory {
  id: string;
  name: string;
  description?: string;
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
  required?: boolean;
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
