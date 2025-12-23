// TypeScript type definitions for the application

import type { Timestamp } from 'firebase/firestore';

// User profile stored in Firestore
export interface UserProfile {
  branch: string;
  graduationYear: number;
  email: string;
  displayName: string;
  createdAt: Date | string | Timestamp;
}

// Core subject with hours spent
export interface CoreSubject {
  name: string;
  hours: number;
}

// Daily preparation log stored in Firestore
export interface DailyLog {
  id?: string; // Firestore document ID
  userId: string;
  date: string; // Format: YYYY-MM-DD
  dsaHours: number;
  dsaTopics: string;
  coreSubjects: CoreSubject[];
  projects: string;
  selfRating: number; // 1-5
  createdAt: Date | string | Timestamp;
}

// AI Analysis response from Gemini API
export interface AIAnalysis {
  consistencyAnalysis: string;
  weakAreas: string[];
  strengths: string[];
  actionPlan: {
    days1to3: string;
    days4to5: string;
    days6to7: string;
  };
  readinessScore: number; // 0-100
}

// Firebase Auth User
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}


