# FitTrack

Your daily fitness tracker powered by AI. Track your food intake, monitor activities, set fitness goals, and analyze food images using Google Gemini AI.

## Features

- **User Authentication**: Secure login/signup with Firebase Authentication
- **Onboarding Flow**: 3-step wizard to set up your profile and goals
- **Food Logging**: Manual entry or AI-powered food image analysis
- **Activity Tracking**: Log workouts and physical activities
- **Dashboard**: Visual overview of your daily progress with charts
- **Dark Mode**: Full support for light and dark themes
- **Responsive Design**: Mobile-first design with bottom navigation on mobile

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **AI Integration**: Google Gemini API (@google/generative-ai)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (free tier)
- Google AI Studio API key (free tier)

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd FitTrack
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Authentication → Email/Password
4. Create Firestore database in production mode
5. Add a web app to your project
6. Copy the Firebase config to `.env.local`

### 3. Google Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add the key to `.env.local` as `GEMINI_API_KEY`

### 4. Environment Variables

Create `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini API Key (server-side only)
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Firestore Security Rules

Go to Firestore Database → Rules and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
  }
}
```

### 6. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
FitTrack/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx      # Auth layout (no sidebar)
│   │   └── login/
│   │       └── page.tsx    # Login/signup page
│   ├── (dashboard)/
│   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   ├── page.tsx        # Dashboard home
│   │   ├── food/
│   │   │   └── page.tsx    # Food log page
│   │   ├── activity/
│   │   │   └── page.tsx    # Activity log page
│   │   └── profile/
│   │       └── page.tsx    # Profile page
│   ├── api/
│   │   └── analyze-image/
│   │       └── route.ts    # Gemini AI image analysis
│   ├── onboarding/
│   │   └── page.tsx        # 3-step onboarding
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Root redirect
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── Sidebar.tsx         # Desktop navigation
│   └── BottomNav.tsx       # Mobile navigation
├── context/
│   ├── theme-context.tsx   # Theme provider
│   └── app-context.tsx     # Global state + Firebase
├── lib/
│   ├── firebase.ts         # Firebase config
│   └── firestore.ts        # Firestore helpers
├── types/
│   └── index.ts            # TypeScript types
├── assets/
│   └── data.ts             # Static data + helpers
└── public/
    └── favicon.svg
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

**Important**: Add all environment variables from `.env.local` to Vercel:
- All `NEXT_PUBLIC_FIREBASE_*` variables
- `GEMINI_API_KEY`

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## API Routes

### POST /api/analyze-image

Analyzes a food image using Google Gemini AI.

**Request**: `multipart/form-data`
- `image`: Image file (JPEG/PNG)

**Response**:
```json
{
  "success": true,
  "result": {
    "name": "Grilled Chicken Salad",
    "calories": 350
  }
}
```

## Features In Detail

### Authentication
- Email/password authentication via Firebase
- Automatic session persistence
- Protected routes with redirect logic

### Onboarding
- Step 1: Age (13-120 years)
- Step 2: Weight (kg) and Height (cm, optional)
- Step 3: Fitness goal with auto-calculated calorie targets

### Food Logging
- Quick meal type buttons
- Manual entry form
- AI food snap - take a photo for automatic calorie estimation
- Grouped by meal type (breakfast, lunch, dinner, snack)
- Delete entries with confirmation

### Activity Tracking
- Quick activity buttons with emoji
- Custom activity entry
- Auto-calculated calories based on activity rate
- Duration-based calorie calculation for quick activities

### Dashboard
- Real-time calorie tracking (intake vs burn)
- Progress bars for daily goals
- BMI calculator (if height provided)
- Weekly chart showing intake vs burn
- Motivational messages based on progress

### Profile
- View/edit personal info
- Theme toggle (light/dark mode)
- Today's stats summary
- Logout functionality

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

- Icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)
- AI powered by [Google Gemini](https://ai.google.dev)
