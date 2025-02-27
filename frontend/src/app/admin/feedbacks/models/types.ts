import { Project } from '../../projects/models/types';

export interface Feedback {
  id: number;
  title: string;
  description: string;
  project: Project;
  questionIds: number[];
  startDate: string;
  endDate: string;
  createdBy: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  allowAnonymous: boolean;
  allowedUserIds: number[];
}

export interface CreateFeedbackDto {
  title: string;
  description: string;
  projectId: number;
  questionIds: number[];
  startDate: string;
  endDate: string;
  allowAnonymous?: boolean;
  allowedUserIds?: number[];
}

export interface FeedbackFilters {
  search?: string;
  projectId?: number;
  active?: boolean;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
} 