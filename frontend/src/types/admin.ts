export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  startDate: Date;
  endDate?: Date;
  manager: string;
  team: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  type: 'multiple_choice' | 'text' | 'code';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options?: string[];
  correctAnswer?: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  id: string;
  candidateId: string;
  candidateName: string;
  interviewerId: string;
  interviewerName: string;
  projectId: string;
  rating: number;
  strengths: string[];
  weaknesses: string[];
  comments: string;
  recommendation: 'hire' | 'reject' | 'consider';
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  status?: string[];
  difficulty?: string[];
  category?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
} 