# Deployment Guide — Механика AI LMS

This guide covers taking the project from the included mock-backend demo to a fully wired production deployment.

## 1. Prerequisites

- Node.js 18.18+ (Node 20 recommended)
- A Firebase project (free Spark plan is enough for a thesis demo)
- A Google Cloud project with OAuth consent screen configured (for Google Login / Sheets / Drive / Forms)
- An OpenAI or Google AI Studio (Gemini) API key

## 2. Firebase setup

1. Go to https://console.firebase.google.com → **Add project**.
2. Enable **Authentication** → Sign-in method → Email/Password and Google.
3. Enable **Firestore Database** → Start in production mode → choose a region.
4. Enable **Storage** (for future file uploads of BOZh submissions).
5. Project Settings → General → "Your apps" → Add a Web app → copy the config values into `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_USE_MOCK_BACKEND=false
```

6. Apply Firestore security rules (see `docs/firestore-schema.md` for the collection list). A minimal starting rule set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{collection}/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

Tighten these before real production use (teacher-only writes to `courses`/`questions`, etc).

## 3. AI provider setup

Choose one:

**OpenAI**
```
NEXT_PUBLIC_AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.5
```

**Google Gemini**
```
NEXT_PUBLIC_AI_PROVIDER=gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-pro
```

Leave `NEXT_PUBLIC_AI_PROVIDER=mock` (or omit the key) to keep using the built-in Kazakh mock responses — useful for offline thesis defense demos where you don't want to depend on network/API availability.

## 4. Google Workspace setup

1. https://console.cloud.google.com → APIs & Services → Enable: **Google Sheets API**, **Google Drive API**, **Google Forms API** (or link an existing Form + Sheet manually).
2. Credentials → Create OAuth client ID → Web application → Authorized redirect URI: `https://<your-domain>/api/auth/google/callback`.
3. Fill `.env.local`:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://<your-domain>/api/auth/google/callback
GOOGLE_SHEETS_ID=<spreadsheet id from the URL>
GOOGLE_FORMS_ID=<form id from the URL>
GOOGLE_DRIVE_FOLDER_ID=<shared drive folder id>
```

4. Create a Google Form for the competency self-assessment; link its responses to the Sheet referenced by `GOOGLE_SHEETS_ID`. `src/lib/googleWorkspace.ts` reads rows `A2:E` (`studentEmail, studentName, moduleTitle, score, submittedAt`) — adjust the range/columns to match your Form's response sheet.

## 5. Deploying to Vercel (recommended)

1. Push the `mechanics-lms` folder to a GitHub repository.
2. https://vercel.com → New Project → import the repo.
3. Framework preset: Next.js (auto-detected).
4. Add all variables from `.env.local` under Project Settings → Environment Variables.
5. Deploy. Vercel builds with `next build` automatically.

## 6. Deploying to Firebase Hosting (alternative)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting          # choose "Use an existing project", output dir: .next (with the Next.js adapter) or use `next export` for a static subset
npm run build
firebase deploy
```

For full SSR support on Firebase, use **Firebase App Hosting** (supports Next.js natively) instead of static Hosting.

## 7. Post-deploy checklist

- [ ] Firebase Auth sign-in works (Google + Email)
- [ ] Firestore rules deployed and tested
- [ ] AI tutor returns real model responses (not mock) when a key is set
- [ ] Google Sheets grade sync returns real rows
- [ ] Certificates QR code resolves to `/verify/[id]` on the deployed domain
- [ ] Lighthouse PWA check passes (manifest, service worker optional for v1)
- [ ] Dark mode toggle persists across reload
