// Main dashboard component

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDailyLogs } from '../../hooks/useDailyLogs';
import { getUserProfile } from '../../services/firebase/firestore';
import { UserProfile } from '../../types';
import ProfileSetup from './ProfileSetup';
import WeeklyChart from './WeeklyChart';
import StreakCounter from './StreakCounter';
import SubjectEffort from './SubjectEffort';
import AIAnalysis from './AIAnalysis';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logs, loading } = useDailyLogs();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      setProfileLoading(true);
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      setShowProfileSetup(!profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileSaved = () => {
    loadUserProfile();
    setShowProfileSetup(false);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back{userProfile?.displayName ? `, ${userProfile.displayName}` : ''}!
            </h1>
            <p className="text-gray-600 mt-1">
              Track your placement preparation progress
            </p>
          </div>
          <button
            onClick={() => navigate('/log')}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Daily Log
          </button>
        </div>

        {/* Profile Setup Modal */}
        {showProfileSetup && (
          <ProfileSetup onSaved={handleProfileSaved} />
        )}

        {/* Dashboard Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No preparation logs yet. Start tracking your progress!
            </p>
            <button
              onClick={() => navigate('/log')}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Log
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              <WeeklyChart logs={logs} />
              <SubjectEffort logs={logs} />
            </div>

            {/* Right Column - Stats & AI */}
            <div className="space-y-6">
              <StreakCounter logs={logs} />
              <AIAnalysis logs={logs} userProfile={userProfile} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


