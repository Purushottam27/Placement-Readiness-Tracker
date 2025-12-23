// Custom hook for daily logs operations

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createDailyLog as createLog,
  getDailyLogs as fetchDailyLogs,
  getWeeklyLogs as fetchWeeklyLogs,
  subscribeToDailyLogs,
} from '../services/firebase/firestore';
import { DailyLog } from '../types';

export function useDailyLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) {
      setLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToDailyLogs(user.uid, (updatedLogs) => {
      setLogs(updatedLogs);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, [user]);

  const createDailyLog = async (logData: Omit<DailyLog, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      setError(null);
      await createLog(user.uid, logData);
    } catch (err: any) {
      setError(err.message || 'Failed to save daily log');
      throw err;
    }
  };

  const getDailyLogs = async (): Promise<DailyLog[]> => {
    if (!user) {
      return [];
    }

    try {
      setError(null);
      return await fetchDailyLogs(user.uid);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch daily logs');
      throw err;
    }
  };

  const getWeeklyLogs = async (): Promise<DailyLog[]> => {
    if (!user) {
      return [];
    }

    try {
      setError(null);
      return await fetchWeeklyLogs(user.uid);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weekly logs');
      throw err;
    }
  };

  return {
    logs,
    loading,
    error,
    createDailyLog,
    getDailyLogs,
    getWeeklyLogs,
  };
}


