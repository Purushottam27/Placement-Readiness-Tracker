# How to Add Realistic Data to Your App

## Quick Guide: 3 Methods to Add Data

### Method 1: Through the App (Easiest - Recommended) ✅

**Steps:**
1. **Login** to your app using Firebase Auth (Google Sign-In or Email/Password)
2. **Complete Profile**: When prompted, enter:
   - Branch: e.g., "Computer Science Engineering"
   - Graduation Year: e.g., 2025
3. **Add Daily Logs**: Use the "Daily Preparation Form" to add entries
   - Fill in DSA hours, topics, core subjects, projects, and self-rating
   - Submit the form
   - Data automatically saves to Firestore

**Pros**: 
- Real user authentication
- Data automatically linked to your user ID
- Tests the full flow

**Cons**: 
- Takes time to enter multiple days manually

---

### Method 2: Firebase Console (Quick for Testing) 🚀

**Steps:**

1. **Get Your User ID**:
   - Login to your app
   - Open browser console (F12)
   - Type: `console.log(auth.currentUser.uid)` or check Firebase Console → Authentication → Users
   - Copy the UID (looks like: `abc123xyz789...`)

2. **Add User Profile**:
   - Go to Firebase Console → Firestore Database
   - Click "Start collection" → Name: `users`
   - Document ID: Paste your UID
   - Add fields:
     ```
     branch (string): "Computer Science Engineering"
     graduationYear (number): 2025
     createdAt (timestamp): [current date/time]
     email (string): "your@email.com"
     displayName (string): "Your Name"
     ```

3. **Add Daily Logs**:
   - Create collection: `dailyLogs`
   - Add documents (one per day) with these fields:
     ```
     userId (string): [your UID from step 1]
     date (string): "2024-01-15"
     dsaHours (number): 3.5
     dsaTopics (string): "Arrays, Two Pointers"
     coreSubjects (array):
       - { name: "Operating Systems", hours: 2.0 }
       - { name: "Database Management", hours: 1.5 }
     projects (string): "Built REST API..."
     selfRating (number): 4
     createdAt (timestamp): [date/time]
     ```

**Sample Document Structure in Firebase Console:**

For `users/{your-uid}`:
```
Field          Type        Value
─────────────────────────────────────────
branch         string      Computer Science Engineering
graduationYear number      2025
createdAt      timestamp   2024-01-01 09:00:00
email          string      student@example.com
displayName    string      John Doe
```

For `dailyLogs/{auto-id}`:
```
Field          Type        Value
─────────────────────────────────────────
userId         string      [your-uid]
date           string      2024-01-15
dsaHours       number      3.5
dsaTopics      string      Arrays, Two Pointers
coreSubjects   array       [see below]
projects       string      Completed LeetCode problems...
selfRating     number      4
createdAt      timestamp   2024-01-15 20:00:00
```

**For `coreSubjects` array in Firebase Console:**
- Click "Add field" → Type: `array`
- Add items:
  - Item 0: `{ name: "Operating Systems", hours: 2.0 }`
  - Item 1: `{ name: "Database Management", hours: 1.5 }`

**Pros**: 
- Fast for adding multiple days
- Visual interface

**Cons**: 
- Manual data entry
- Need to know your User ID

---

### Method 3: Seed Script (For Developers) 💻

**Steps:**

1. **Update the seed script** (`scripts/seedData.js`):
   - Replace `USER_ID` with your Firebase Auth UID
   - Update Firebase config if needed

2. **Run the script**:
   ```bash
   node scripts/seedData.js
   ```

**Pros**: 
- Automated
- Good for testing

**Cons**: 
- Requires Node.js setup
- Need to configure Firebase in script

---

## Sample Realistic Data (Copy-Paste Ready)

### User Profile
```json
{
  "branch": "Computer Science Engineering",
  "graduationYear": 2025,
  "email": "student@college.edu",
  "displayName": "John Doe"
}
```

### Daily Logs (7 Days)

**Day 1:**
```json
{
  "date": "2024-01-15",
  "dsaHours": 3.5,
  "dsaTopics": "Arrays, Two Pointers, Sliding Window",
  "coreSubjects": [
    {"name": "Operating Systems", "hours": 2.0},
    {"name": "Database Management", "hours": 1.5}
  ],
  "projects": "Completed LeetCode problems 1-10. Reviewed OS concepts.",
  "selfRating": 4
}
```

**Day 2:**
```json
{
  "date": "2024-01-16",
  "dsaHours": 4.0,
  "dsaTopics": "Binary Search, Linked Lists",
  "coreSubjects": [
    {"name": "Computer Networks", "hours": 2.5},
    {"name": "Operating Systems", "hours": 1.0}
  ],
  "projects": "Built a chat application using WebSockets.",
  "selfRating": 5
}
```

**Day 3:**
```json
{
  "date": "2024-01-17",
  "dsaHours": 2.0,
  "dsaTopics": "Stacks, Queues",
  "coreSubjects": [
    {"name": "Database Management", "hours": 3.0}
  ],
  "projects": "Designed database schema for e-commerce platform.",
  "selfRating": 3
}
```

**Day 4:**
```json
{
  "date": "2024-01-18",
  "dsaHours": 5.0,
  "dsaTopics": "Trees, Binary Trees, BST",
  "coreSubjects": [
    {"name": "Operating Systems", "hours": 1.5},
    {"name": "Computer Networks", "hours": 1.0}
  ],
  "projects": "Solved 15 tree-based problems. Mock interview practice.",
  "selfRating": 4
}
```

**Day 5:**
```json
{
  "date": "2024-01-19",
  "dsaHours": 3.0,
  "dsaTopics": "Graphs, DFS, BFS",
  "coreSubjects": [
    {"name": "Database Management", "hours": 2.0},
    {"name": "Operating Systems", "hours": 2.0}
  ],
  "projects": "Implemented graph algorithms. Reviewed DBMS normalization.",
  "selfRating": 4
}
```

**Day 6:**
```json
{
  "date": "2024-01-20",
  "dsaHours": 2.5,
  "dsaTopics": "Dynamic Programming basics",
  "coreSubjects": [
    {"name": "Computer Networks", "hours": 2.5}
  ],
  "projects": "Started DP problems. Network protocols revision.",
  "selfRating": 3
}
```

**Day 7:**
```json
{
  "date": "2024-01-21",
  "dsaHours": 4.5,
  "dsaTopics": "Dynamic Programming, Greedy Algorithms",
  "coreSubjects": [
    {"name": "Operating Systems", "hours": 2.0},
    {"name": "Database Management", "hours": 1.5}
  ],
  "projects": "Solved 10 DP problems. System design practice.",
  "selfRating": 5
}
```

---

## Important Notes

1. **User ID**: Every daily log MUST have the correct `userId` matching your Firebase Auth UID
2. **Date Format**: Use `YYYY-MM-DD` format (e.g., "2024-01-15")
3. **Core Subjects**: Common ones include:
   - Operating Systems
   - Database Management
   - Computer Networks
   - System Design
   - Object-Oriented Programming
4. **Self Rating**: Must be a number between 1-5
5. **Timestamps**: Use ISO format or Firebase Timestamp type

---

## Quick Test Checklist

After adding data, verify:
- ✅ User profile appears in `users` collection
- ✅ Daily logs appear in `dailyLogs` collection
- ✅ All logs have correct `userId`
- ✅ Dashboard shows charts with data
- ✅ Streak counter calculates correctly
- ✅ AI analysis button works with your data


