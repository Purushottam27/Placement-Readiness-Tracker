// Daily preparation log form component

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, X, Calendar } from 'lucide-react';
import { useDailyLogs } from '../../hooks/useDailyLogs';
import { CoreSubject } from '../../types';
import { getTodayDate, formatDateForDisplay } from '../../utils/dateUtils';

const COMMON_SUBJECTS = [
  'Operating Systems',
  'Database Management',
  'Computer Networks',
  'System Design',
  'Object-Oriented Programming',
  'Data Structures',
  'Algorithms',
];

export default function DailyLogForm() {
  const navigate = useNavigate();
  const { createDailyLog, loading, error } = useDailyLogs();
  
  const [date, setDate] = useState(getTodayDate());
  const [dsaHours, setDsaHours] = useState('');
  const [dsaTopics, setDsaTopics] = useState('');
  const [coreSubjects, setCoreSubjects] = useState<CoreSubject[]>([]);
  const [projects, setProjects] = useState('');
  const [selfRating, setSelfRating] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const addCoreSubject = () => {
    setCoreSubjects([...coreSubjects, { name: '', hours: 0 }]);
  };

  const removeCoreSubject = (index: number) => {
    setCoreSubjects(coreSubjects.filter((_, i) => i !== index));
  };

  const updateCoreSubject = (index: number, field: 'name' | 'hours', value: string | number) => {
    const updated = [...coreSubjects];
    updated[index] = { ...updated[index], [field]: value };
    setCoreSubjects(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    // Validate form
    if (!dsaHours || parseFloat(dsaHours) < 0) {
      alert('Please enter valid DSA hours');
      setSubmitting(false);
      return;
    }

    if (coreSubjects.some((cs) => !cs.name || cs.hours < 0)) {
      alert('Please fill in all core subjects correctly');
      setSubmitting(false);
      return;
    }

    try {
      await createDailyLog({
        date,
        dsaHours: parseFloat(dsaHours),
        dsaTopics: dsaTopics.trim() || 'None',
        coreSubjects: coreSubjects.filter((cs) => cs.name && cs.hours > 0),
        projects: projects.trim() || 'None',
        selfRating,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      // Error is handled by useDailyLogs
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Daily Preparation Log</h1>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              Log saved successfully! Redirecting to dashboard...
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={getTodayDate()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {formatDateForDisplay(date)}
              </p>
            </div>

            {/* DSA Hours */}
            <div>
              <label htmlFor="dsaHours" className="block text-sm font-medium text-gray-700 mb-2">
                DSA Hours <span className="text-gray-500">(required)</span>
              </label>
              <input
                id="dsaHours"
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={dsaHours}
                onChange={(e) => setDsaHours(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 3.5"
                required
              />
            </div>

            {/* DSA Topics */}
            <div>
              <label htmlFor="dsaTopics" className="block text-sm font-medium text-gray-700 mb-2">
                DSA Topics Covered
              </label>
              <input
                id="dsaTopics"
                type="text"
                value={dsaTopics}
                onChange={(e) => setDsaTopics(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Arrays, Two Pointers, Binary Search"
              />
            </div>

            {/* Core Subjects */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Core Subjects
                </label>
                <button
                  type="button"
                  onClick={addCoreSubject}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Subject
                </button>
              </div>

              {coreSubjects.length === 0 && (
                <p className="text-sm text-gray-500 mb-2">
                  Click "Add Subject" to add core subjects you studied
                </p>
              )}

              <div className="space-y-3">
                {coreSubjects.map((subject, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <select
                      value={subject.name}
                      onChange={(e) => updateCoreSubject(index, 'name', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select subject...</option>
                      {COMMON_SUBJECTS.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={subject.hours || ''}
                      onChange={(e) => updateCoreSubject(index, 'hours', parseFloat(e.target.value) || 0)}
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Hours"
                    />
                    <button
                      type="button"
                      onClick={() => removeCoreSubject(index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects/Practice */}
            <div>
              <label htmlFor="projects" className="block text-sm font-medium text-gray-700 mb-2">
                Projects / Practice Done
              </label>
              <textarea
                id="projects"
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Built a REST API using Node.js. Practiced system design concepts."
              />
              <p className="mt-1 text-sm text-gray-500">
                {projects.length} characters
              </p>
            </div>

            {/* Self Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Self-Rating: {selfRating}/5
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={selfRating}
                  onChange={(e) => setSelfRating(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <span
                      key={rating}
                      className={`text-lg ${
                        rating <= selfRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || loading}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {submitting ? 'Saving...' : 'Save Log'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


