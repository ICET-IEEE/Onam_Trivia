/**
 * Normalization functions for answer matching
 */

/**
 * Normalizes an answer string for consistent comparison
 * - Trim leading/trailing whitespace
 * - Collapse multiple spaces into one
 * - Convert to lowercase
 * - Strip punctuation
 */
export function normalizeAnswer(answer: string): string {
  if (!answer) return '';
  
  return answer
    .trim() // Remove leading/trailing whitespace
    .replace(/\s+/g, ' ') // Collapse multiple spaces into one
    .toLowerCase() // Convert to lowercase
    .replace(/[.,!?;:'"(){}[\]<>\\/`~@#$%^&*_\-=+|]/g, '') // Strip punctuation
    .replace(/\s+/g, ' ') // Collapse spaces again after punctuation removal
    .trim(); // Final trim
}

/**
 * Check if two answers match after normalization
 */
export function answersMatch(answer1: string, answer2: string): boolean {
  return normalizeAnswer(answer1) === normalizeAnswer(answer2);
}