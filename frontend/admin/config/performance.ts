/**
 * Performance configuration for the admin frontend
 * These settings help prevent excessive API calls and improve performance
 */

export const PERFORMANCE_CONFIG = {
  // API throttling settings
  API_THROTTLE: {
    DASHBOARD: 5000, // 5 seconds
    ENHANCED_DASHBOARD: 5000, // 5 seconds
    ACTIVITY_FEED: 10000, // 10 seconds
    NOTIFICATIONS: 15000, // 15 seconds
    REAL_TIME_METRICS: 30000, // 30 seconds
    SYSTEM_HEALTH: 60000, // 1 minute
    COMBINED_REFRESH: 10000, // 10 seconds
  },

  // Debounce settings
  DEBOUNCE: {
    SEARCH: 300, // 300ms
    INPUT: 500, // 500ms
    FILTER: 1000, // 1 second
  },

  // Request limits
  LIMITS: {
    MAX_CONCURRENT_REQUESTS: 5,
    MAX_RETRY_ATTEMPTS: 3,
    REQUEST_TIMEOUT: 10000, // 10 seconds
  },

  // Cache settings
  CACHE: {
    DASHBOARD_DATA: 300000, // 5 minutes
    USER_DATA: 600000, // 10 minutes
    STATIC_DATA: 1800000, // 30 minutes
  },

  // UI performance
  UI: {
    LOADING_DELAY: 2000, // 2 seconds
    ANIMATION_DURATION: 300, // 300ms
    DEBOUNCE_RENDER: 100, // 100ms
  },
} as const;

/**
 * Check if enough time has passed since last request
 */
export function shouldThrottleRequest(
  lastRequestTime: number,
  throttleMs: number
): boolean {
  return Date.now() - lastRequestTime < throttleMs;
}

/**
 * Get throttled delay for staggered requests
 */
export function getStaggeredDelay(index: number, baseDelay: number = 1000): number {
  return index * baseDelay;
}
