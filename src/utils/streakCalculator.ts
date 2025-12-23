// Utility functions for calculating preparation streaks

import { DailyLog } from '../types';
import { parseDate } from './dateUtils';

/**
 * Calculate consecutive days streak from daily logs
 * Returns the number of consecutive days with logs, ending with the most recent log
 */
export function calculateStreak(logs: DailyLog[]): {
  streak: number;
  lastLogDate: string | null;
} {
  if (logs.length === 0) {
    return { streak: 0, lastLogDate: null };
  }

  // Sort logs by date (most recent first)
  const sortedLogs = [...logs].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const mostRecentDate = parseDate(sortedLogs[0].date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if most recent log is today or yesterday (allow 1 day gap)
  const daysSinceLastLog = Math.floor(
    (today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If last log is more than 1 day ago, streak is broken
  if (daysSinceLastLog > 1) {
    return { streak: 0, lastLogDate: sortedLogs[0].date };
  }

  // Calculate consecutive days
  let streak = 1;
  let currentDate = new Date(mostRecentDate);

  for (let i = 1; i < sortedLogs.length; i++) {
    const logDate = parseDate(sortedLogs[i].date);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - 1);
    expectedDate.setHours(0, 0, 0, 0);

    const logDateOnly = new Date(logDate);
    logDateOnly.setHours(0, 0, 0, 0);

    // Check if this log is exactly 1 day before the previous one
    if (logDateOnly.getTime() === expectedDate.getTime()) {
      streak++;
      currentDate = logDateOnly;
    } else {
      // Gap found, streak ends
      break;
    }
  }

  return {
    streak,
    lastLogDate: sortedLogs[0].date
  };
}

