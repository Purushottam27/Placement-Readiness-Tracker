// Custom hook for authentication operations

import { useState } from 'react';
import { useAuth as useAuthContext } from '../contexts/AuthContext';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
} from '../services/firebase/auth';

export function useAuthOperations() {
  const { user, loading } = useAuthContext();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await signInWithGoogle();
    } catch (error: any) {
      setAuthError(error.message || 'Failed to sign in with Google');
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await signInWithEmail(email, password);
    } catch (error: any) {
      setAuthError(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignUp = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await signUpWithEmail(email, password);
    } catch (error: any) {
      setAuthError(error.message || 'Failed to create account');
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await signOut();
    } catch (error: any) {
      setAuthError(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    user,
    loading: loading || authLoading,
    error: authError,
    signInWithGoogle: handleGoogleSignIn,
    signInWithEmail: handleEmailSignIn,
    signUpWithEmail: handleEmailSignUp,
    signOut: handleSignOut,
  };
}


