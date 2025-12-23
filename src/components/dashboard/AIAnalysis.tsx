// AI Analysis component using Gemini API

import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { analyzePlacementReadiness } from '../../services/gemini/geminiService';
import type { DailyLog, UserProfile, AIAnalysis as AIAnalysisType } from '../../types/index';

interface AIAnalysisProps {
  logs: DailyLog[];
  userProfile: UserProfile | null;
}

export default function AIAnalysis({ logs, userProfile }: AIAnalysisProps) {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<AIAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (!userProfile) {
      setError('Please complete your profile first');
      return;
    }

    if (logs.length === 0) {
      setError('Please add at least one daily log');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await analyzePlacementReadiness(user.uid);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze placement readiness');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-100 p-3 rounded-full">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">AI Analysis</h2>
      </div>

      {!analysis && !loading && (
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">
            Get AI-powered insights about your preparation
          </p>
          <button
            onClick={handleAnalyze}
            disabled={loading || logs.length === 0}
            className="bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Analyze My Placement Readiness
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Analyzing your preparation data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
          <button
            onClick={handleAnalyze}
            className="ml-2 text-red-800 underline hover:text-red-900"
          >
            Try again
          </button>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Readiness Score */}
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Overall Readiness Score</p>
            <div className="text-5xl font-bold text-purple-600 mb-2">
              {analysis.readinessScore}/100
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${analysis.readinessScore}%` }}
              ></div>
            </div>
          </div>

          {/* Consistency Analysis */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Consistency Analysis</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {analysis.consistencyAnalysis}
            </p>
          </div>

          {/* Weak Areas */}
          {analysis.weakAreas.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-700 mb-2">Weak Areas</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {analysis.weakAreas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {analysis.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Plan */}
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Next 7-Day Action Plan</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-medium">Day 1-3:</span> {analysis.actionPlan.days1to3}
              </div>
              <div>
                <span className="font-medium">Day 4-5:</span> {analysis.actionPlan.days4to5}
              </div>
              <div>
                <span className="font-medium">Day 6-7:</span> {analysis.actionPlan.days6to7}
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Analysis
          </button>
        </div>
      )}
    </div>
  );
}


