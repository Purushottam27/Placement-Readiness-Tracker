# AI Placement Readiness Tracker

A production-ready hackathon prototype for tracking student placement preparation with AI-powered insights.

## Features

- 🔐 **Firebase Authentication** - Google Sign-In and Email/Password
- 📊 **Progress Dashboard** - Weekly charts, streak counter, subject-wise effort
- 📝 **Daily Logs** - Track DSA hours, core subjects, projects, and self-rating
- 🤖 **AI Analysis** - Google Gemini API integration for personalized insights
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI**: Google Gemini API

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable "Google" provider
   - Enable "Email/Password" provider
3. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)
4. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll down to "Your apps"
   - Copy the Firebase configuration

### 3. Gemini API Setup

1. Get Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Copy your API key

### 4. Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase and Gemini credentials in `.env`:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

### 5. Firestore Security Rules

Add these rules in Firebase Console → Firestore Database → Rules:

```javascript
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

### 6. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. **Sign In**: Use Google Sign-In or create an account with Email/Password
2. **Complete Profile**: Enter your branch and graduation year
3. **Add Daily Logs**: Track your daily preparation (DSA, core subjects, projects, self-rating)
4. **View Dashboard**: See your progress with charts and statistics
5. **Get AI Insights**: Click "Analyze My Placement Readiness" for personalized feedback

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard components
│   ├── forms/         # Form components
│   └── layout/        # Layout components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── services/
│   ├── firebase/      # Firebase services
│   └── gemini/        # Gemini API service
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## License

MIT


