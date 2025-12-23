// Streak counter component

import { Flame } from 'lucide-react';
import { DailyLog } from '../../types';
import { calculateStreak } from '../../utils/streakCalculator';
import { formatDateForDisplay } from '../../utils/dateUtils';

interface StreakCounterProps {
  logs: DailyLog[];
}

export default function StreakCounter({ logs }: StreakCounterProps) {
  const { streak, lastLogDate } = calculateStreak(logs);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-orange-100 p-3 rounded-full">
          <Flame className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Current Streak</h2>
      </div>
      
      <div className="text-center">
        <div className="text-5xl font-bold text-orange-600 mb-2">
          {streak}
        </div>
        <p className="text-gray-600 text-sm mb-1">
          {streak === 1 ? 'day' : 'days'} in a row
        </p>
        {lastLogDate && (
          <p className="text-gray-500 text-xs">
            Last log: {formatDateForDisplay(lastLogDate)}
          </p>
        )}
      </div>

      {streak === 0 && logs.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm text-center">
            Start a new streak by logging today!
          </p>
        </div>
      )}
    </div>
  );
}


