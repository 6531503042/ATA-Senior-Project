import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes a score value to ensure it's between 0 and 100
 * Handles extreme values, NaN, and different scale formats
 * 
 * @param score The score to normalize
 * @param defaultValue The default value to use if score is NaN (default: 0)
 * @returns A normalized score between 0 and 100
 */
export function normalizeScore(score: number, defaultValue: number = 0): number {
  // Handle NaN or undefined
  if (isNaN(score) || score === undefined) {
    return defaultValue;
  }
  
  // Handle negative values
  if (score < 0) {
    return 0;
  }
  
  // If score is greater than 100, it might be:
  // 1. Already a percentage but extreme (e.g., 5240.0%)
  // 2. A raw score that needs to be capped
  if (score > 100) {
    return 100; // Cap at 100%
  } 
  
  // If score is between 0 and 1, it's likely a decimal that needs to be converted to percentage
  if (score > 0 && score <= 1) {
    return score * 100;
  }
  
  // For scores between 1 and 100, keep as is
  return score;
}

/**
 * Formats a score as a percentage string with 1 decimal place
 * 
 * @param score The score to format
 * @param defaultValue The default value to use if score is NaN (default: 0)
 * @returns A formatted percentage string (e.g., "75.0%")
 */
export function formatScoreAsPercentage(score: number, defaultValue: number = 0): string {
  return normalizeScore(score, defaultValue).toFixed(1) + '%';
} 