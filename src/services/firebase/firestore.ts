// Firestore database service functions

import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import { UserProfile, DailyLog } from '../../types';

/**
 * Create or update user profile in Firestore
 */
export async function createUserProfile(
  userId: string,
  profileData: Omit<UserProfile, 'createdAt'>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const profile: UserProfile = {
      ...profileData,
      createdAt: Timestamp.now(),
    };
    await setDoc(userRef, profile, { merge: true });
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to save user profile');
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as UserProfile;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

/**
 * Create daily log in Firestore
 */
export async function createDailyLog(
  userId: string,
  logData: Omit<DailyLog, 'id' | 'userId' | 'createdAt'>
): Promise<string> {
  try {
    const logsRef = collection(db, 'dailyLogs');
    const log: Omit<DailyLog, 'id'> = {
      ...logData,
      userId,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(logsRef, log);
    return docRef.id;
  } catch (error: any) {
    console.error('Error creating daily log:', error);
    throw new Error('Failed to save daily log');
  }
}

/**
 * Get all daily logs for a user
 */
export async function getDailyLogs(userId: string): Promise<DailyLog[]> {
  try {
    const logsRef = collection(db, 'dailyLogs');
    const q = query(
      logsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const logs: DailyLog[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as DailyLog);
    });
    
    return logs;
  } catch (error: any) {
    console.error('Error getting daily logs:', error);
    throw new Error('Failed to fetch daily logs');
  }
}

/**
 * Get weekly logs (last 7 days) for a user
 */
export async function getWeeklyLogs(userId: string): Promise<DailyLog[]> {
  try {
    const allLogs = await getDailyLogs(userId);
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return allLogs.filter((log) => {
      const logDate = new Date(log.date + 'T00:00:00');
      return logDate >= sevenDaysAgo && logDate <= today;
    });
  } catch (error: any) {
    console.error('Error getting weekly logs:', error);
    throw new Error('Failed to fetch weekly logs');
  }
}

/**
 * Subscribe to real-time updates of daily logs
 * Returns unsubscribe function
 */
export function subscribeToDailyLogs(
  userId: string,
  callback: (logs: DailyLog[]) => void
): () => void {
  try {
    const logsRef = collection(db, 'dailyLogs');
    const q = query(
      logsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const logs: DailyLog[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          logs.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as DailyLog);
        });
        callback(logs);
      },
      (error) => {
        console.error('Error in daily logs subscription:', error);
      }
    );
    
    return unsubscribe;
  } catch (error: any) {
    console.error('Error setting up daily logs subscription:', error);
    throw new Error('Failed to subscribe to daily logs');
  }
}


