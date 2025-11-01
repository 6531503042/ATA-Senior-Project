export interface EmployeeFeedback {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  questions: EmployeeQuestion[];
  status: 'pending' | 'in_progress' | 'completed';
  submittedAt?: string;
}

export interface EmployeeQuestion {
  id: number;
  text: string;
  description?: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT_BASED' | 'SENTIMENT';
  required: boolean;
  answers?: { text: string; value: string }[];
  category: string;
}

export interface EmployeeSubmission {
  id: string;
  feedbackId: string;
  feedbackTitle: string;
  projectName: string;
  submittedAt: string;
  status: 'pending' | 'analyzed' | 'error';
  overallSentiment?: 'positive' | 'neutral' | 'negative';
  privacyLevel: 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS';
}

export interface EmployeeDashboardData {
  stats: {
    totalFeedbacks: number;
    pendingFeedbacks: number;
    completedFeedbacks: number;
    totalSubmissions: number;
  };
  quickStats?: {
    thisMonth?: number;
    totalTimeSeconds?: number;
  };
  recentFeedbacks: Array<{
    id: string;
    title: string;
    projectName: string;
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed';
  }>;
  recentSubmissions: Array<{
    id: string;
    feedbackTitle: string;
    projectName: string;
    submittedAt: string;
    status: 'pending' | 'analyzed' | 'error';
    overallSentiment?: 'positive' | 'neutral' | 'negative';
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    status: 'active' | 'completed' | 'pending';
    startDate: string;
    endDate: string;
  }>;
}

export interface QuestionCardProps {
  question: EmployeeQuestion;
  currentAnswer: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  isRequired?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}

export type Question = EmployeeQuestion;

export type Privacy = 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS';

export interface FeedbackSubmissionPayload {
  feedbackId: number;
  responses: Record<string, string>;
  overallComments: string;
  privacyLevel: Privacy;
}
