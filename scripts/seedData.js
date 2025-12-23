/**
 * Seed Script for Populating Firestore with Realistic Test Data
 * 
 * Usage:
 * 1. Make sure you have Firebase initialized in your project
 * 2. Update the USER_ID constant with your Firebase Auth UID
 * 3. Run: node scripts/seedData.js
 * 
 * To get your USER_ID:
 * - Login to your app
 * - Check browser console: console.log(auth.currentUser.uid)
 * - Or check Firebase Console → Authentication → Users
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Import your Firebase config
// Replace with your actual config or import from your config file
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// IMPORTANT: Replace with your actual Firebase Auth UID
// Get this from Firebase Console → Authentication → Users
// Or login to app and check: auth.currentUser.uid
const USER_ID = 'YOUR_FIREBASE_AUTH_UID_HERE';

// Sample User Profile
const userProfile = {
  branch: 'Computer Science Engineering',
  graduationYear: 2025,
  createdAt: new Date('2024-01-01T09:00:00Z'),
  email: 'student@example.com',
  displayName: 'Test Student'
};

// Sample Daily Logs (Last 7 days)
const dailyLogs = [
  {
    userId: USER_ID,
    date: '2024-01-15',
    dsaHours: 3.5,
    dsaTopics: 'Arrays, Two Pointers, Sliding Window',
    coreSubjects: [
      { name: 'Operating Systems', hours: 2.0 },
      { name: 'Database Management', hours: 1.5 }
    ],
    projects: 'Completed LeetCode problems 1-10. Reviewed OS concepts.',
    selfRating: 4,
    createdAt: new Date('2024-01-15T20:00:00Z')
  },
  {
    userId: USER_ID,
    date: '2024-01-16',
    dsaHours: 4.0,
    dsaTopics: 'Binary Search, Linked Lists',
    coreSubjects: [
      { name: 'Computer Networks', hours: 2.5 },
      { name: 'Operating Systems', hours: 1.0 }
    ],
    projects: 'Built a chat application using WebSockets. Practiced networking concepts.',
    selfRating: 5,
    createdAt: new Date('2024-01-16T19:30:00Z')
  },
  {
    userId: USER_ID,
    date: '2024-01-17',
    dsaHours: 2.0,
    dsaTopics: 'Stacks, Queues',
    coreSubjects: [
      { name: 'Database Management', hours: 3.0 }
    ],
    projects: 'Designed database schema for e-commerce platform. SQL practice.',
    selfRating: 3,
    createdAt: new Date('2024-01-17T21:00:00Z')
  },
  {
    userId: USER_ID,
    date: '2024-01-18',
    dsaHours: 5.0,
    dsaTopics: 'Trees, Binary Trees, BST',
    coreSubjects: [
      { name: 'Operating Systems', hours: 1.5 },
      { name: 'Computer Networks', hours: 1.0 }
    ],
    projects: 'Solved 15 tree-based problems. Mock interview practice.',
    selfRating: 4,
    createdAt: new Date('2024-01-18T18:45:00Z')
  },
  {
    userId: USER_ID,
    date: '2024-01-19',
    dsaHours: 3.0,
    dsaTopics: 'Graphs, DFS, BFS',
    coreSubjects: [
      { name: 'Database Management', hours: 2.0 },
      { name: 'Operating Systems', hours: 2.0 }
    ],
    projects: 'Implemented graph algorithms. Reviewed DBMS normalization.',
    selfRating: 4,
    createdAt: new Date('2024-01-19T20:15:00Z')
  },
  {
    userId: USER_ID,
    date: '2024-01-20',
    dsaHours: 2.5,
    dsaTopics: 'Dynamic Programming basics',
    coreSubjects: [
      { name: 'Computer Networks', hours: 2.5 }
    ],
    projects: 'Started DP problems. Network protocols revision.',
    selfRating: 3,
    createdAt: new Date('2024-01-20T19:00:00Z')
  },
  {
    userId: USER_ID,
    date: '2024-01-21',
    dsaHours: 4.5,
    dsaTopics: 'Dynamic Programming, Greedy Algorithms',
    coreSubjects: [
      { name: 'Operating Systems', hours: 2.0 },
      { name: 'Database Management', hours: 1.5 }
    ],
    projects: 'Solved 10 DP problems. System design practice.',
    selfRating: 5,
    createdAt: new Date('2024-01-21T21:30:00Z')
  }
];

/**
 * Seed User Profile
 */
async function seedUserProfile() {
  try {
    const userRef = doc(db, 'users', USER_ID);
    await setDoc(userRef, userProfile);
    console.log('✅ User profile seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding user profile:', error);
  }
}

/**
 * Seed Daily Logs
 */
async function seedDailyLogs() {
  try {
    const logsRef = collection(db, 'dailyLogs');
    const promises = dailyLogs.map(log => addDoc(logsRef, log));
    await Promise.all(promises);
    console.log(`✅ ${dailyLogs.length} daily logs seeded successfully!`);
  } catch (error) {
    console.error('❌ Error seeding daily logs:', error);
  }
}

/**
 * Main seed function
 */
async function seed() {
  if (USER_ID === 'YOUR_FIREBASE_AUTH_UID_HERE') {
    console.error('❌ Please update USER_ID in the script with your Firebase Auth UID');
    console.log('💡 Get your UID from Firebase Console → Authentication → Users');
    return;
  }

  console.log('🌱 Starting data seeding...');
  await seedUserProfile();
  await seedDailyLogs();
  console.log('✨ Seeding completed!');
}

// Run seed
seed().then(() => process.exit(0)).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});


