import axios, { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';

// Service base URLs
const BASE_API_URL = process.env.NEXT_PUBLIC_PROJECT_API_URL || 'http://localhost:8084';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_ANALYSIS_API_URL || 'http://localhost:8085';

// Create axios instances
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const aiApi = axios.create({
  baseURL: AI_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Add request interceptor for auth to main API only
api.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`${config.baseURL} Request Config:`, {
      url: config.url,
      method: config.method,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? 'Bearer ****' : 'None'
      }
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptors for both APIs
[api, aiApi].forEach(instance => {
  instance.interceptors.response.use(
    (response) => {
      console.log(`${response.config.baseURL} Response:`, {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
      return response;
    },
    (error: AxiosError) => {
      console.error(`${error.config?.baseURL} API error:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      return Promise.reject(error);
    }
  );
});

export interface FeedbackDetails {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export interface ImprovementPriority {
  category: string;
  score: number;
  description: string;
}

export interface FeedbackAnalysis {
  feedback_id: number;
  project_id: number;
  project_name: string;
  submitted_by: string | null;
  submitted_at: string;
  executive_summary: {
    overall_rating: string;
    strengths: Array<{
      category: string | null;
      score: number;
      description: string;
    }>;
    weaknesses: Array<{
      category: string | null;
      score: number;
      description: string;
    }>;
    key_insights: string[];
    action_items: Array<{
      description: string;
      category: string;
      priority: string;
    }>;
  };
  question_analyses: Array<{
    question_id: string | number;
    question_text: string;
    question_type: string;
    response: string;
    category: string | null;
    score: number;
    sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
    suggestions: Array<{
      type: string;
      content: string;
      score?: number;
      details?: string[];
    }>;
    improvement_priorities: Array<{
      description: string;
      priority: string;
    }>;
  }>;
  overall_score: number;
  overall_sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  overall_suggestions: string[];
  overall_priorities: Array<{
    name: string;
    score: number;
  }>;
  categories: Record<string, CategoryAnalysis>;
  satisfaction_score: number;
  improvement_areas: Array<{
    category: string;
    score: number;
    recommendations: string[];
  }>;
  key_metrics: {
    overall_satisfaction: number;
    response_quality: number;
    sentiment_score: number;
    improvement_count: number;
  };
}

export interface CategoryAnalysis {
  score: number;
  sentiment: string;
  recommendations: string[];
}

export interface SatisfactionAnalysis {
  feedbackId: number;
  satisfactionOverview: {
    overallSatisfaction: number;
    satisfactionRate: number;
    totalSubmissions: number;
  };
  sentimentDistribution: {
    positive: {
      percentage: number;
      emoji: string;
      label: string;
    };
    neutral: {
      percentage: number;
      emoji: string;
      label: string;
    };
    negative: {
      percentage: number;
      emoji: string;
      label: string;
    };
  };
  suggestions: string[];
}

export interface AIInsights {
  feedbackId: number;
  title: string;
  description: string;
  insights: {
    performanceInsights: {
      title: string;
      aiConfidence: number;
      recommendations: Array<{
        text: string;
        priority: string;
      }>;
    };
    engagementAnalysis: {
      title: string;
      aiConfidence: number;
      recommendations: Array<{
        text: string;
        priority: string;
      }>;
    };
    improvementOpportunities: {
      title: string;
      aiConfidence: number;
      recommendations: Array<{
        text: string;
        priority: string;
      }>;
    };
  };
  metadata: {
    totalSubmissions: number;
    analyzedAt: string;
    categories: string[];
  };
}

export async function getAllFeedbacks(): Promise<FeedbackDetails[]> {
  try {
    console.log('Fetching all feedbacks...');
    const response = await api.get('/api/v1/admin/feedbacks/get-all');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Failed to fetch feedbacks:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error('Unexpected error fetching feedbacks:', error);
    }
    throw error;
  }
}

export const getAllSubmissions = async (): Promise<SubmissionResponse[]> => {
  try {
    const response = await aiApi.get('/api/submissions/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    throw error;
  }
};

export async function getFeedbackAnalysis(feedbackId: number): Promise<FeedbackAnalysis> {
  try {
    console.log(`Fetching feedback analysis for feedback ${feedbackId}...`);
    const response = await aiApi.get(`/api/analysis/feedback/${feedbackId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch feedback analysis:', error);
    throw error;
  }
}

export async function getSatisfactionAnalysis(feedbackId: number): Promise<SatisfactionAnalysis> {
  try {
    console.log(`Fetching satisfaction analysis for feedback ${feedbackId}...`);
    const response = await aiApi.get(`/api/analysis/satisfaction/${feedbackId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch satisfaction analysis:', error);
    throw error;
  }
}

export async function getAIInsights(feedbackId: number): Promise<AIInsights> {
  try {
    console.log(`Fetching AI insights for feedback ${feedbackId}...`);
    const response = await aiApi.get(`/api/analysis/insights/${feedbackId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch AI insights:', error);
    throw error;
  }
}

// Additional API functions for metrics and statistics
export async function getFeedbackStatistics() {
  try {
    const response = await api.get('/api/v1/admin/feedbacks/statistics');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch feedback statistics:', error);
    throw error;
  }
}

export async function getFeedbackMetrics() {
  try {
    const response = await api.get('/api/v1/dashboard/feedback/metrics');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch feedback metrics:', error);
    throw error;
  }
} 