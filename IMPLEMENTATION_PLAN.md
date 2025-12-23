# Implementation Plan: AI Placement Readiness Tracker

## Project Overview
Build a production-ready hackathon prototype with React + Vite, Firebase (Auth + Firestore), and Google Gemini API integration. All data will be stored in and retrieved from Firebase (no dummy data).

## Architecture Flow

```
User → React App → Firebase Auth → Firestore → Dashboard → Gemini API → AI Analysis
```

## File Structure

```
ai-placement-tracker/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.tsx          # Google Sign-In + Email/Password
│   │   │   └── ProtectedRoute.tsx  # Route protection wrapper
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx       # Main dashboard container
│   │   │   ├── WeeklyChart.tsx     # Recharts line/bar chart
│   │   │   ├── StreakCounter.tsx   # Streak calculation display
│   │   │   ├── SubjectEffort.tsx   # Pie/bar chart for subjects
│   │   │   ├── AIAnalysis.tsx      # Gemini API integration UI
│   │   │   └── ProfileSetup.tsx    # First-time profile form
│   │   ├── forms/
│   │   │   └── DailyLogForm.tsx    # Daily preparation input form
│   │   └── layout/
│   │       ├── Navbar.tsx          # Navigation with logout
│   │       └── Layout.tsx          # App layout wrapper
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── config.ts           # Firebase initialization
│   │   │   ├── auth.ts             # Auth functions (Google, Email)
│   │   │   └── firestore.ts        # Firestore CRUD operations
│   │   └── gemini/
│   │       └── geminiService.ts    # Gemini API integration
│   ├── contexts/
│   │   └── AuthContext.tsx         # Global auth state management
│   ├── hooks/
│   │   ├── useAuth.ts              # Auth hook
│   │   └── useDailyLogs.ts         # Daily logs hook
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── utils/
│   │   ├── dateUtils.ts            # Date formatting/calculations
│   │   └── streakCalculator.ts     # Streak calculation logic
│   ├── App.tsx                     # Main app with routing
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Tailwind imports
├── .env.example                    # Environment variables template
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

## Implementation Steps

### Phase 1: Project Setup & Configuration

#### 1.1 Initialize Vite + React + TypeScript
- Run `npm create vite@latest . -- --template react-ts`
- Install dependencies:
  ```bash
  npm install firebase @google/generative-ai recharts react-router-dom lucide-react
  npm install -D tailwindcss postcss autoprefixer
  ```

#### 1.2 Configure Tailwind CSS
- Initialize Tailwind: `npx tailwindcss init -p`
- Update `tailwind.config.js` with content paths
- Add Tailwind directives to `index.css`

#### 1.3 Environment Variables Setup
- Create `.env.example` with Firebase and Gemini API placeholders
- Create `.env` (user will fill with their credentials)
- Configure Vite to expose env variables

**Files to create:**
- `package.json` (with all dependencies)
- `tailwind.config.js`
- `postcss.config.js`
- `tsconfig.json`
- `vite.config.ts`
- `.env.example`
- `.gitignore`

### Phase 2: Firebase Integration

#### 2.1 Firebase Configuration
**File: `src/services/firebase/config.ts`**
- Initialize Firebase app with config from env variables
- Export `auth` and `db` instances
- Handle missing config gracefully

#### 2.2 Firebase Auth Service
**File: `src/services/firebase/auth.ts`**
- `signInWithGoogle()` - Google Sign-In popup
- `signInWithEmail(email, password)` - Email/password login
- `signUpWithEmail(email, password)` - Email/password signup
- `signOut()` - Logout function
- `getCurrentUser()` - Get current authenticated user
- Error handling for all auth operations

#### 2.3 Firestore Service
**File: `src/services/firebase/firestore.ts`**
- `createUserProfile(userId, profileData)` - Create/update user profile
- `getUserProfile(userId)` - Fetch user profile
- `createDailyLog(userId, logData)` - Save daily log
- `getDailyLogs(userId)` - Fetch all user logs
- `getWeeklyLogs(userId)` - Get last 7 days logs
- Real-time listeners for live updates
- Proper error handling

**Firestore Collections:**
- `users/{userId}` - User profile (branch, graduationYear, email, displayName, createdAt)
- `dailyLogs/{logId}` - Daily logs (userId, date, dsaHours, dsaTopics, coreSubjects[], projects, selfRating, createdAt)

**Files to create:**
- `src/services/firebase/config.ts`
- `src/services/firebase/auth.ts`
- `src/services/firebase/firestore.ts`

### Phase 3: TypeScript Types

#### 3.1 Type Definitions
**File: `src/types/index.ts`**
```typescript
- UserProfile interface
- DailyLog interface
- CoreSubject interface
- AIAnalysis interface
- AuthUser interface
```

**Files to create:**
- `src/types/index.ts`

### Phase 4: Authentication System

#### 4.1 Auth Context
**File: `src/contexts/AuthContext.tsx`**
- Create AuthContext with user state
- Provide auth state to entire app
- Handle auth state changes (onAuthStateChanged)
- Loading state during auth check

#### 4.2 Auth Hook
**File: `src/hooks/useAuth.ts`**
- Custom hook to access auth context
- Return user, loading, error states
- Auth functions (login, logout, etc.)

#### 4.3 Login Component
**File: `src/components/auth/Login.tsx`**
- Google Sign-In button (primary, prominent)
- Email/Password form (optional, collapsible)
- Form validation
- Error messages display
- Loading states
- Redirect to dashboard after successful login
- Beautiful, modern UI with Tailwind

#### 4.4 Protected Route Component
**File: `src/components/auth/ProtectedRoute.tsx`**
- Wrapper component for protected routes
- Check authentication status
- Redirect to login if not authenticated
- Show loading spinner during auth check

**Files to create:**
- `src/contexts/AuthContext.tsx`
- `src/hooks/useAuth.ts`
- `src/components/auth/Login.tsx`
- `src/components/auth/ProtectedRoute.tsx`

### Phase 5: Daily Log Form

#### 5.1 Daily Log Form Component
**File: `src/components/forms/DailyLogForm.tsx`**
- Form fields:
  - Date picker (default: today, editable)
  - DSA Hours (number input, min: 0, max: 24)
  - DSA Topics (text input, placeholder examples)
  - Core Subjects (dynamic list):
    - Add/remove subjects
    - Subject name dropdown (OS, DBMS, CN, System Design, OOP)
    - Hours input for each subject
  - Projects/Practice (textarea, character count)
  - Self-Rating (1-5 slider or select, visual stars)
- Form validation:
  - Required fields
  - Date not in future
  - Hours >= 0
  - Rating 1-5
- Submit handler:
  - Call `createDailyLog` from hook
  - Show success message
  - Reset form or redirect
- Error handling
- Loading state during submission
- Beautiful, clean UI

#### 5.2 Daily Logs Hook
**File: `src/hooks/useDailyLogs.ts`**
- `createDailyLog(logData)` - Save new log to Firestore
- `getDailyLogs()` - Fetch all user logs (real-time)
- `getWeeklyLogs()` - Get last 7 days
- `getLogsByDateRange(startDate, endDate)` - Flexible date range
- Loading and error states
- Real-time updates using Firestore listeners

**Files to create:**
- `src/components/forms/DailyLogForm.tsx`
- `src/hooks/useDailyLogs.ts`

### Phase 6: Dashboard Components

#### 6.1 Dashboard Container
**File: `src/components/dashboard/Dashboard.tsx`**
- Main dashboard layout
- Fetch user profile (check if exists, prompt setup if missing)
- Fetch daily logs using `useDailyLogs` hook
- Display all dashboard components:
  - Profile setup (if missing)
  - Weekly chart
  - Streak counter
  - Subject effort chart
  - AI Analysis section
- Loading states
- Empty state (no logs yet)
- Responsive grid layout

#### 6.2 Profile Setup Component
**File: `src/components/dashboard/ProfileSetup.tsx`**
- Modal or inline form for first-time users
- Fields: Branch (dropdown/input), Graduation Year (number)
- Save to Firestore user profile
- Show only if profile missing

#### 6.3 Weekly Progress Chart
**File: `src/components/dashboard/WeeklyChart.tsx`**
- Use Recharts library
- Line or Bar chart showing last 7 days
- X-axis: Dates (formatted)
- Y-axis: Total hours per day (DSA + Core Subjects)
- Tooltip with detailed breakdown
- Empty state if < 7 days of data
- Beautiful colors and styling

#### 6.4 Streak Counter
**File: `src/components/dashboard/StreakCounter.tsx`**
- Calculate consecutive days with logs
- Display large streak number with fire icon
- Show last log date
- Handle edge cases (no logs, gaps)
- Visual card design

#### 6.5 Subject Effort Chart
**File: `src/components/dashboard/SubjectEffort.tsx`**
- Recharts Pie or Bar chart
- Aggregate hours by core subject from all logs
- Show subject-wise distribution
- Color-coded legend
- Empty state if no core subjects logged

#### 6.6 Utility Functions
**File: `src/utils/streakCalculator.ts`**
- `calculateStreak(logs)` - Calculate consecutive days
- Handle date gaps, timezone issues
- Return streak count and last log date

**File: `src/utils/dateUtils.ts`**
- `formatDate(date)` - Format for display
- `getLast7Days()` - Get date range
- `isToday(date)` - Check if date is today
- Date manipulation helpers

**Files to create:**
- `src/components/dashboard/Dashboard.tsx`
- `src/components/dashboard/ProfileSetup.tsx`
- `src/components/dashboard/WeeklyChart.tsx`
- `src/components/dashboard/StreakCounter.tsx`
- `src/components/dashboard/SubjectEffort.tsx`
- `src/utils/streakCalculator.ts`
- `src/utils/dateUtils.ts`

### Phase 7: Gemini AI Integration

#### 7.1 Gemini Service
**File: `src/services/gemini/geminiService.ts`**
- `analyzePlacementReadiness(userId)` function:
  1. Fetch user profile from Firestore
  2. Fetch all daily logs from Firestore
  3. Format data according to prompt template:
     ```
     Student Profile:
     - Branch: {branch}
     - Graduation Year: {graduationYear}
     
     Daily Preparation Logs:
     {formatted logs with dates, DSA, core subjects, projects, ratings}
     ```
  4. Call Gemini API with strict prompt (from requirements)
  5. Parse response into structured format:
     - Consistency Analysis (paragraph)
     - Weak Areas (array)
     - Strengths (array)
     - Next 7-Day Action Plan (structured)
     - Overall Readiness Score (number)
  6. Return parsed data
  7. Error handling (API errors, parsing errors)

#### 7.2 AI Analysis Component
**File: `src/components/dashboard/AIAnalysis.tsx`**
- "Analyze My Placement Readiness" button (prominent)
- Loading state during API call (spinner + message)
- Display formatted results:
  - Consistency Analysis (paragraph, styled)
  - Weak Areas (bullet list, warning colors)
  - Strengths (bullet list, success colors)
  - Next 7-Day Action Plan (structured, day-by-day)
  - Overall Readiness Score (large number, progress bar)
- Error handling with retry option
- Empty state if no logs available
- Beautiful card design with icons

**Files to create:**
- `src/services/gemini/geminiService.ts`
- `src/components/dashboard/AIAnalysis.tsx`

### Phase 8: Routing & Navigation

#### 8.1 App Routing
**File: `src/App.tsx`**
- React Router setup
- Routes:
  - `/login` - Login page (redirect to dashboard if already auth)
  - `/dashboard` - Main dashboard (protected)
  - `/log` - Daily log form (protected)
  - `/` - Redirect based on auth status
- Wrap app with AuthContext provider

#### 8.2 Navigation Component
**File: `src/components/layout/Navbar.tsx`**
- Navigation links (Dashboard, Add Log)
- User info display (name, email)
- Logout button
- Responsive mobile menu
- Active route highlighting

#### 8.3 Layout Component
**File: `src/components/layout/Layout.tsx`**
- App layout wrapper
- Include Navbar
- Main content area
- Footer (optional)

**Files to create:**
- `src/App.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Layout.tsx`

### Phase 9: Styling & Polish

#### 9.1 Global Styles
**File: `src/index.css`**
- Tailwind directives
- Custom CSS variables (colors, spacing)
- Global resets
- Font imports (Google Fonts - Inter or similar)

#### 9.2 Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Responsive charts (Recharts responsive prop)
- Mobile-friendly forms
- Touch-friendly buttons

#### 9.3 UI Components
- Consistent button styles
- Form input styles
- Card components
- Loading spinners
- Error messages
- Success notifications
- Empty states

**Files to update:**
- `src/index.css`
- All component files (add responsive classes)

### Phase 10: Error Handling & Edge Cases

#### 10.1 Error Handling
- Try-catch blocks in all async operations
- User-friendly error messages
- Network error handling
- Firebase error handling (permissions, network)
- Gemini API error handling

#### 10.2 Edge Cases
- No logs yet (empty states)
- Missing user profile (prompt setup)
- No data for charts (show message)
- Streak calculation with gaps
- Date edge cases (timezone, formatting)
- Form validation edge cases

#### 10.3 Loading States
- Auth loading (checking user)
- Form submission loading
- Data fetching loading
- API call loading (Gemini)
- Skeleton loaders for better UX

## Key Implementation Details

### Data Flow
1. User logs in → Firebase Auth → AuthContext updates
2. User fills daily form → Save to Firestore → Real-time update
3. Dashboard loads → Fetch logs from Firestore → Display charts
4. User clicks AI button → Fetch logs → Format → Call Gemini → Display results

### Security
- Firestore security rules (users can only access their own data)
- Environment variables for sensitive keys
- Input validation on all forms
- XSS prevention (React handles this)

### Performance
- Real-time listeners (efficient Firestore queries)
- Optimistic UI updates
- Lazy loading for charts
- Memoization where needed

### Code Quality
- TypeScript for type safety
- Comments explaining complex logic
- Reusable components
- Clean code structure
- Consistent naming conventions

## Environment Variables Required

User needs to add to `.env`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_API_KEY=
```

## Firebase Setup Required

1. Create Firebase project
2. Enable Authentication (Google + Email/Password)
3. Create Firestore database
4. Set Firestore security rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /dailyLogs/{logId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```
5. Get API keys and add to `.env`

## Testing Checklist

After implementation:
- [ ] Login with Google works
- [ ] Login with Email/Password works
- [ ] User profile saves correctly
- [ ] Daily log form saves to Firestore
- [ ] Dashboard displays data correctly
- [ ] Weekly chart shows last 7 days
- [ ] Streak counter calculates correctly
- [ ] Subject effort chart displays correctly
- [ ] AI analysis button works
- [ ] Gemini API returns formatted results
- [ ] All data is user-specific (no cross-user data)
- [ ] Responsive design works on mobile
- [ ] Error handling works properly
- [ ] Loading states display correctly

## Timeline Estimate

- Phase 1-2: Project setup & Firebase (1-2 hours)
- Phase 3-4: Types & Authentication (2-3 hours)
- Phase 5: Daily Log Form (2-3 hours)
- Phase 6: Dashboard Components (3-4 hours)
- Phase 7: Gemini Integration (2-3 hours)
- Phase 8-9: Routing & Styling (2-3 hours)
- Phase 10: Polish & Testing (2-3 hours)

**Total: ~15-20 hours** for a production-ready hackathon prototype

