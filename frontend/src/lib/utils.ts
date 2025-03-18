import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single class string, using clsx and tailwind-merge
 * to handle conditional classes and remove duplicates.
 * 
 * @param inputs - The class names to merge
 * @returns A single class string with duplicates removed
 */
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

/**
 * Formats a date as a string in the format "MMM DD, YYYY"
 * 
 * @param date - The date to format
 * @returns A formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncates a string to a specified length and adds an ellipsis if needed
 * 
 * @param str - The string to truncate 
 * @param length - The maximum length before truncating
 * @returns The truncated string
 */
export function truncateString(str: string, length: number): string {
  if (!str) return "";
  if (str.length <= length) return str;
  
  return str.substring(0, length) + "...";
}

/**
 * Gets the initials from a name (first letter of each word)
 * 
 * @param name - The name to get initials from
 * @returns The initials (maximum 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return "";
  
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Removes HTML tags from a string
 * 
 * @param html - The HTML string to sanitize
 * @returns The plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
} 