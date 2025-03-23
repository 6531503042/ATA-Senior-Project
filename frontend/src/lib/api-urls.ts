/**
 * API URL utilities to handle different URLs for server-side and client-side requests
 */

// Determine if code is running on server or client
const isServer = typeof window === 'undefined';

// For server-side requests, use internal Docker network service names
// For client-side requests, use browser URLs (through localhost)
export const getUserServiceUrl = (): string => {
  if (isServer) {
    return process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://user-service:8081';
  }
  return process.env.NEXT_PUBLIC_BROWSER_USER_SERVICE_URL || 'http://localhost:8081';
};

export const getFeedbackServiceUrl = (): string => {
  if (isServer) {
    return process.env.NEXT_PUBLIC_FEEDBACK_SERVICE_URL || 'http://feedback-service:8084';
  }
  return process.env.NEXT_PUBLIC_BROWSER_FEEDBACK_SERVICE_URL || 'http://localhost:8084';
};

export const getFeedbackScoringServiceUrl = (): string => {
  if (isServer) {
    return process.env.NEXT_PUBLIC_FEEDBACK_SCORING_SERVICE_URL || 'http://feedback-scoring-service:8085';
  }
  return process.env.NEXT_PUBLIC_BROWSER_FEEDBACK_SCORING_SERVICE_URL || 'http://localhost:8085';
};

// Helper function to build full API URLs
export const buildApiUrl = (baseUrl: string, path: string): string => {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// Commonly used endpoints
export const API_ENDPOINTS = {
  // User Service
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  VALIDATE_TOKEN: '/api/v1/auth/validate-token',
  USER_PROFILE: '/api/v1/users/profile',
  
  // Feedback Service
  AVAILABLE_FEEDBACKS: '/api/v1/feedback-submissions/available',
  SUBMIT_FEEDBACK: '/api/v1/feedback-submissions/submit',
  PROJECTS: '/api/v1/projects',
  
  // Feedback Scoring Service
  ANALYZE_TEXT: '/api/analyze/text',
  FEEDBACK_ANALYSIS: '/api/analysis/feedback',
  SATISFACTION_ANALYSIS: '/api/analysis/satisfaction',
}; 