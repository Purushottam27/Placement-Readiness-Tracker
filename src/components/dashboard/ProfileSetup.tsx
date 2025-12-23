// Profile setup component for first-time users

import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createUserProfile } from '../../services/firebase/firestore';

interface ProfileSetupProps {
  onSaved: () => void;
}

const BRANCHES = [
  'Computer Science Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other',
];

export default function ProfileSetup({ onSaved }: ProfileSetupProps) {
  const { user } = useAuth();
  const [branch, setBranch] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [customBranch, setCustomBranch] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('User not authenticated');
      return;
    }

    const finalBranch = branch === 'Other' ? customBranch : branch;

    if (!finalBranch || !graduationYear) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSaving(true);
      await createUserProfile(user.uid, {
        branch: finalBranch,
        graduationYear: parseInt(graduationYear),
        email: user.email || '',
        displayName: user.displayName || 'User',
      });
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
          <button
            onClick={onSaved}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Please provide some information to get personalized insights.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
              Branch
            </label>
            <select
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select your branch...</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {branch === 'Other' && (
            <div>
              <label htmlFor="customBranch" className="block text-sm font-medium text-gray-700 mb-2">
                Specify Branch
              </label>
              <input
                id="customBranch"
                type="text"
                value={customBranch}
                onChange={(e) => setCustomBranch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your branch"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
              Graduation Year
            </label>
            <select
              id="graduationYear"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select graduation year...</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}


