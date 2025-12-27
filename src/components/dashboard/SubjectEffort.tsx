// Subject-wise effort chart component using Recharts

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';
import { DailyLog } from '../../types';

interface SubjectEffortProps {
  logs: DailyLog[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function SubjectEffort({ logs }: SubjectEffortProps) {
  const subjectData = useMemo(() => {
    const subjectMap = new Map<string, number>();

    logs.forEach((log) => {
      log.coreSubjects.forEach((cs) => {
        if (cs.name && cs.hours > 0) {
          const current = subjectMap.get(cs.name) || 0;
          subjectMap.set(cs.name, current + cs.hours);
        }
      });
    });

    return Array.from(subjectMap.entries())
      .map(([name, hours]) => ({ name, hours }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 7); // Top 7 subjects
  }, [logs]);

  if (subjectData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Subject-Wise Effort</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No core subjects logged yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Subject-Wise Effort</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={subjectData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="hours"
          >
            {subjectData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toFixed(1)} hours`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


