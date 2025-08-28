export type QuestionType = 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'TEXT_BASED' | 'RATING' | 'SENTIMENT';

export type QuestionCategory = 
  | 'WORK_ENVIRONMENT'
  | 'WORK_LIFE_BALANCE'
  | 'TEAM_COLLABORATION'
  | 'PROJECT_MANAGEMENT'
  | 'PROJECT_SATISFACTION'
  | 'TECHNICAL_SKILLS'
  | 'COMMUNICATION'
  | 'LEADERSHIP'
  | 'INNOVATION'
  | 'PERSONAL_GROWTH'
  | 'GENERAL';

export interface Question {
  id: number;
  text: string;
  description?: string;
  questionType: QuestionType;
  category: QuestionCategory;
  required: boolean;
  validationRules?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionRequest {
  text: string;
  description?: string;
  questionType: QuestionType;
  category: QuestionCategory;
  required: boolean;
  validationRules?: string;
}

export interface UpdateQuestionRequest {
  id: number;
  text?: string;
  description?: string;
  questionType?: QuestionType;
  category?: QuestionCategory;
  required?: boolean;
  validationRules?: string;
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
