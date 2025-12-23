// Utility functions for date manipulation and formatting

/**
 * Format date to YYYY-MM-DD format
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return formatDate(new Date());
}

/**
 * Get last 7 days dates in YYYY-MM-DD format
 */
export function getLast7Days(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  
  return dates;
}

/**
 * Check if date is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayDate();
}

/**
 * Format date for display (e.g., "Jan 15, 2024")
 */
export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format date for chart (e.g., "Jan 15")
 */
export function formatDateForChart(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}


