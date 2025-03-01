export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  TEXT_BASED = 'TEXT_BASED',
  SENTIMENT = 'SENTIMENT'
}

export enum QuestionCategory {
  GENERAL = 'GENERAL',
  WORK_ENVIRONMENT = 'WORK_ENVIRONMENT',
  WORK_LIFE_BALANCE = 'WORK_LIFE_BALANCE',
  TEAM_COLLABORATION = 'TEAM_COLLABORATION',
  PROJECT_MANAGEMENT = 'PROJECT_MANAGEMENT',
  PROJECT_SATISFACTION = 'PROJECT_SATISFACTION',
  TECHNICAL_SKILLS = 'TECHNICAL_SKILLS',
  COMMUNICATION = 'COMMUNICATION',
  LEADERSHIP = 'LEADERSHIP',
  INNOVATION = 'INNOVATION',
  PERSONAL_GROWTH = 'PERSONAL_GROWTH'
}

export interface Question {
  text: unknown;
  id: number;
  title: string;
  description: string;
  questionType: QuestionType;
  category: QuestionCategory;
  choices?: string[];
  required: boolean;
  validationRules?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionDto {
  text: unknown;
  title: string;
  description: string;
  questionType: QuestionType;
  category: QuestionCategory;
  choices?: string[];
  required?: boolean;
  validationRules?: string;
}

export interface QuestionMetrics {
  totalQuestions: number;
  questionsByType: Record<QuestionType, number>;
  questionsByCategory: Record<QuestionCategory, number>;
}

export interface QuestionResponses {
  [key: string]: {
    responseCount: number;
    choices?: Record<string, number>;
  };
} 