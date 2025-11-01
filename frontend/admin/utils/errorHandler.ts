/**
 * Error handling utilities for better error management
 */

export interface ApiErrorDetails {
  status: number;
  statusText: string;
  url: string;
  message: string;
  data?: any;
  timestamp: string;
}

/**
 * Create a detailed error object for API errors
 */
export function createApiError(
  status: number,
  statusText: string,
  url: string,
  message: string,
  data?: any
): ApiErrorDetails {
  return {
    status,
    statusText,
    url,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Log API errors with consistent format
 */
export function logApiError(error: ApiErrorDetails, context?: string): void {
  const prefix = context ? `[${context}]` : '[API]';
  console.error(`${prefix} Error:`, {
    ...error,
    context,
  });
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error instanceof TypeError ||
    error.message?.includes('fetch') ||
    error.message?.includes('network') ||
    error.message?.includes('Failed to fetch')
  );
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: any): boolean {
  return (
    error.message?.includes('timeout') ||
    error.message?.includes('TIMEOUT') ||
    error.code === 'TIMEOUT'
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: any): string {
  if (isNetworkError(error)) {
    return 'Unable to connect to server. Please check your internet connection.';
  }
  
  if (isTimeoutError(error)) {
    return 'Request timed out. Please try again.';
  }
  
  if (error?.status === 401) {
    return 'Please log in to continue.';
  }
  
  if (error?.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error?.status === 404) {
    return 'The requested resource was not found.';
  }
  
  if (error?.status >= 500) {
    return 'Server error occurred. Please try again later.';
  }
  
  return error?.message || 'An unexpected error occurred.';
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const status = typeof (error as any)?.status === 'number' ? (error as any).status : undefined;
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Don't retry on certain errors
      if (status === 401 || status === 403 || status === 404) {
        break;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
