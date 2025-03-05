import axios, { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { cacheManager } from '@/lib/cache';

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
  timeout: 30000 // Increased timeout to 30 seconds
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

// Add retry logic for failed requests
aiApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;
    
    if (!config || !config.url) {
      return Promise.reject(error);
    }

    // @ts-ignore
    config.__retryCount = config.__retryCount || 0;

    // @ts-ignore
    if (config.__retryCount >= 2) {
      return Promise.reject(error);
    }

    // @ts-ignore
    config.__retryCount += 1;

    // Exponential backoff
    const backoff = new Promise(resolve => {
      // @ts-ignore
      setTimeout(() => resolve(null), 1000 * (config.__retryCount ** 2));
    });

    await backoff;
    return aiApi(config);
  }
);

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

// Add these type definitions at the top
export interface ApiErrorResponse {
  error: string;
  status: number;
}

export interface ApiErrorData {
  message?: string;
  error?: string;
  details?: string;
}

export interface AnalysisData {
  feedbackId: number;
  overall_score: number;
  overall_sentiment: string;
  executive_summary: {
    overall_rating: string;
    strengths: Array<{
      category: string;
      score: number;
      description: string;
    }>;
    weaknesses: Array<{
      category: string;
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
    question_id: number;
    question_text: string;
    question_type: string;
    response: string;
    score: number;
    sentiment: string;
    suggestions: Array<{
      type: string;
      content: string;
      score?: number;
      details?: string[];
    }>;
    improvement_priorities: Array<{
      category: string;
      score: number;
      description: string;
    }>;
    category: string;
  }>;
  key_metrics: {
    overall_satisfaction: number;
    response_quality: number;
    sentiment_score: number;
    improvement_count: number;
  };
}

export interface AnalysisResponse {
  feedbackId: number;
  analysis: AnalysisData;
  confidence: number;
  timestamp: string;
}

export interface SatisfactionAnalysisResponse {
  feedbackId: number;
  satisfactionOverview: {
    satisfactionRate: number;
    totalSubmissions: number;
  };
  sentimentDistribution: {
    positive: { emoji: string; percentage: number; label: string };
    neutral: { emoji: string; percentage: number; label: string };
    negative: { emoji: string; percentage: number; label: string };
  };
  suggestions: string[];
}

export interface AIInsightsResponse {
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

// Error handler helper
export const handleApiError = (error: AxiosError<ApiErrorData>): ApiErrorResponse => {
  if (error.code === 'ECONNABORTED') {
    return {
      error: 'Request timed out. Please try again.',
      status: 408
    };
  }

  if (!error.response) {
    return {
      error: 'Network error. Please check your connection.',
      status: 0
    };
  }

  const errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      error.response.data?.details ||
                      'An unexpected error occurred';

  return {
    error: errorMessage,
    status: error.response.status
  };
};

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
    if (error instanceof AxiosError) {
      const { error: errorMessage, status } = handleApiError(error);
      throw new Error(`Failed to fetch submissions: ${errorMessage} (${status})`);
    }
    throw error;
  }
};

export const getSubmissionAnalysis = async (feedbackId: number): Promise<AnalysisResponse> => {
  try {
    const response = await aiApi.get(`/api/analysis/feedback/${feedbackId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const { error: errorMessage, status } = handleApiError(error);
      throw new Error(`Failed to fetch analysis: ${errorMessage} (${status})`);
    }
    throw error;
  }
};

export const getSatisfactionAnalysis = async (feedbackId: number): Promise<SatisfactionAnalysisResponse> => {
  try {
    const response = await aiApi.get(`/api/analysis/satisfaction/${feedbackId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const { error: errorMessage, status } = handleApiError(error);
      throw new Error(`Failed to fetch satisfaction analysis: ${errorMessage} (${status})`);
    }
    throw error;
  }
};

export const getAIInsights = async (feedbackId: number): Promise<AIInsightsResponse> => {
  try {
    const response = await aiApi.get(`/api/analysis/insights/${feedbackId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const { error: errorMessage, status } = handleApiError(error);
      throw new Error(`Failed to fetch AI insights: ${errorMessage} (${status})`);
    }
    throw error;
  }
};

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

// Add batch fetching function
export const getFeedbackData = async (feedbackId: number) => {
  // Try to get cached data first
  const cachedData = cacheManager.getFeedbackData(feedbackId);
  if (cachedData) {
    return cachedData;
  }

  // Fetch all data in parallel
  const [submissions, analysis, satisfaction, insights] = await Promise.allSettled([
    getAllSubmissions(),
    getSubmissionAnalysis(feedbackId),
    getSatisfactionAnalysis(feedbackId),
    getAIInsights(feedbackId)
  ]);

  const data = {
    submissions: submissions.status === 'fulfilled' ? submissions.value : [],
    analysis: analysis.status === 'fulfilled' ? analysis.value : null,
    satisfaction: satisfaction.status === 'fulfilled' ? satisfaction.value : null,
    insights: insights.status === 'fulfilled' ? insights.value : null
  };

  // Cache the successful responses
  cacheManager.setFeedbackData(feedbackId, data);

  return data;
}; 