// Weekly progress chart component using Recharts

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyLog } from '../../types';
import { getLast7Days, formatDateForChart } from '../../utils/dateUtils';

interface WeeklyChartProps {
  logs: DailyLog[];
}

export default function WeeklyChart({ logs }: WeeklyChartProps) {
  const chartData = useMemo(() => {
    const last7Days = getLast7Days();
    
    return last7Days.map((date) => {
      const log = logs.find((l) => l.date === date);
      
      if (log) {
        const totalCoreHours = log.coreSubjects.reduce((sum, cs) => sum + cs.hours, 0);
        const totalHours = log.dsaHours + totalCoreHours;
        
        return {
          date: formatDateForChart(date),
          fullDate: date,
          'DSA Hours': log.dsaHours,
          'Core Subjects': totalCoreHours,
          'Total Hours': totalHours,
        };
      }
      
      return {
        date: formatDateForChart(date),
        fullDate: date,
        'DSA Hours': 0,
        'Core Subjects': 0,
        'Total Hours': 0,
      };
    });
  }, [logs]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Progress</h2>
      {logs.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="DSA Hours"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Core Subjects"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Total Hours"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}


