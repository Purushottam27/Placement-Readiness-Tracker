// Navigation bar component

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { LogOut, LayoutDashboard, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthOperations } from '../../hooks/useAuth';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { signOut } = useAuthOperations();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {

      console.error('Sign out error:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">AI Placement Tracker</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/dashboard')
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Dashboard
              </Link>
              <Link
                to="/log"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/log')
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <FileText className="w-4 h-4 mr-1" />
                Add Log
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user && (
              <>
                <span className="text-sm text-gray-700 mr-4 hidden sm:block">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


