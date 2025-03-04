import type { SubmissionResponse, FeedbackAnalysis, SatisfactionAnalysis, AIInsights } from './api/submissions';

interface FeedbackCache {
  submissions: SubmissionResponse[];
  analysis: FeedbackAnalysis | null;
  satisfaction: SatisfactionAnalysis | null;
  insights: AIInsights | null;
  timestamp: number;
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = 'feedback_cache_';

export const cacheManager = {
  setFeedbackData(feedbackId: number, data: Partial<FeedbackCache>) {
    try {
      const cacheKey = `${CACHE_PREFIX}${feedbackId}`;
      const existingData = this.getFeedbackData(feedbackId);
      const newData = {
        ...existingData,
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(newData));
    } catch (error) {
      console.warn('Failed to cache feedback data:', error);
    }
  },

  getFeedbackData(feedbackId: number): FeedbackCache | null {
    try {
      const cacheKey = `${CACHE_PREFIX}${feedbackId}`;
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const data = JSON.parse(cached) as FeedbackCache;
      const isExpired = Date.now() - data.timestamp > CACHE_EXPIRY;
      
      return isExpired ? null : data;
    } catch (error) {
      console.warn('Failed to retrieve cached feedback data:', error);
      return null;
    }
  },

  clearCache(feedbackId?: number) {
    try {
      if (feedbackId) {
        localStorage.removeItem(`${CACHE_PREFIX}${feedbackId}`);
      } else {
        Object.keys(localStorage)
          .filter(key => key.startsWith(CACHE_PREFIX))
          .forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  },

  isCacheValid(feedbackId: number): boolean {
    const data = this.getFeedbackData(feedbackId);
    if (!data) return false;
    return Date.now() - data.timestamp < CACHE_EXPIRY;
  }
}; 