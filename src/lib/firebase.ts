// Firebase bootstrap. Falls back to `null` app/services when env vars are
// missing or NEXT_PUBLIC_USE_MOCK_BACKEND=true, so the rest of the codebase
// (see src/lib/dataStore.ts) can transparently use local mock data instead.
"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.projectId &&
  process.env.NEXT_PUBLIC_USE_MOCK_BACKEND !== "true";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage };

/**
 * Firestore collection names — kept in one place so the schema documented in
 * docs/firestore-schema.md always matches the code.
 */
export const COLLECTIONS = {
  users: "users",
  courses: "courses",
  lessons: "lessons",
  videos: "videos",
  quizzes: "quizzes",
  questions: "questions",
  assignments: "assignments",
  games: "games",
  progress: "progress",
  competencies: "competencies",
  certificates: "certificates",
  leaderboard: "leaderboard",
  analytics: "analytics",
} as const;
