import axios from 'axios';

// Create axios instance for AI service
export const aiService = axios.create({
  baseURL: 'http://localhost:8085',
  timeout: 10000,
});

// Add response interceptor for logging
aiService.interceptors.response.use(
  (response) => {
    console.log('AI Service Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('AI Service Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Types
export interface QuestionDetail {
  id: number;
  text: string;
  description: string;
  questionType: string;
  category: string;
  choices: string[];
  response: string;
}

export interface SubmissionData {
  id: number;
  feedbackId: number;
  submittedBy: string | null;
  responses: Record<string, string>;
  questionDetails: QuestionDetail[];
  overallComments: string;
  privacyLevel: 'ANONYMOUS' | 'PUBLIC';
  submittedAt: string;
  updatedAt: string;
  status?: 'analyzed' | 'pending' | 'error';
  feedback?: {
    projectName: string;
    title: string;
  };
  overallSentiment?: 'positive' | 'neutral' | 'negative';
  error?: string;
}

export interface SubmissionResponse {
  submission: SubmissionData;
  analysis: Analysis | null;
  error: string | null;
}

export interface Analysis {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topics: string[];
  summary: string;
}

// API Functions
export const getAllSubmissions = async (): Promise<SubmissionResponse[]> => {
  try {
    const response = await aiService.get('/api/submissions/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    throw error;
  }
};

export const getSubmissionAnalysis = async (submissionId: number): Promise<Analysis> => {
  try {
    const response = await aiService.get(`/api/submissions/${submissionId}/analysis`);
    return response.data;
  } catch (error) {
    console.error('Error fetching submission analysis:', error);
    throw error;
  }
}; 