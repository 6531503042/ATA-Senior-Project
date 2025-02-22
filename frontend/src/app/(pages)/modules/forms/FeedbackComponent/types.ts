export interface Post {
    id: number;
    text: string;
    questionType: string;
    category: string;
  }
  
  export interface Project {
    id: number;
    name: string;
    description: string;
    memberIds: number[];
    projectStartDate: string;
    projectEndDate: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface FeedbackFormResponse {
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
    confidentialUserIds: number[];
    allowedUserIds: number[];
  }
  
  export interface CreateFeedbackFormData {
    title: string;
    description: string;
    projectId: number;
    questionIds: number[];
    startDate: string;
    endDate: string;
  }