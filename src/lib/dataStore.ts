// Unified data-access layer. Every read/write in the app goes through this
// module. If Firebase is configured (see src/lib/firebase.ts) it talks to
// Firestore; otherwise it transparently falls back to localStorage so the
// app is fully demoable with zero setup.
"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured, COLLECTIONS } from "./firebase";
import type {
  AppUser,
  QuizAttempt,
  GameResult,
  AssignmentSubmission,
  CompetencyAssessment,
  Certificate,
  LeaderboardEntry,
  Notification,
  AnalyticsSnapshot,
  FinalGradeResult,
} from "./types";

const LS_PREFIX = "mechanics-lms:";

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(LS_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

// ---------------------------------------------------------------------------
// Users / Auth profile
// ---------------------------------------------------------------------------
export async function getCurrentUserProfile(uidValue: string): Promise<AppUser | null> {
  if (isFirebaseConfigured && db) {
    const snap = await getDoc(doc(db, COLLECTIONS.users, uidValue));
    return snap.exists() ? (snap.data() as AppUser) : null;
  }
  const users = lsGet<Record<string, AppUser>>("users", {});
  return users[uidValue] ?? null;
}

export async function upsertUserProfile(user: AppUser): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, COLLECTIONS.users, user.uid), user, { merge: true });
    return;
  }
  const users = lsGet<Record<string, AppUser>>("users", {});
  users[user.uid] = { ...users[user.uid], ...user };
  lsSet("users", users);
}

// ---------------------------------------------------------------------------
// Quiz attempts
// ---------------------------------------------------------------------------
export async function saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
  if (isFirebaseConfigured && db) {
    await addDoc(collection(db, COLLECTIONS.progress), { ...attempt, kind: "quiz" });
    return;
  }
  const attempts = lsGet<QuizAttempt[]>("quizAttempts", []);
  attempts.unshift(attempt);
  lsSet("quizAttempts", attempts);
}

export async function getQuizAttempts(userId: string, moduleId?: number): Promise<QuizAttempt[]> {
  if (isFirebaseConfigured && db) {
    const q = query(
      collection(db, COLLECTIONS.progress),
      where("userId", "==", userId),
      where("kind", "==", "quiz"),
      orderBy("takenAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => d.data() as QuizAttempt);
  }
  const attempts = lsGet<QuizAttempt[]>("quizAttempts", []);
  return attempts.filter((a) => a.userId === userId && (!moduleId || a.moduleId === moduleId));
}

// ---------------------------------------------------------------------------
// Game results
// ---------------------------------------------------------------------------
export async function saveGameResult(result: GameResult): Promise<void> {
  if (isFirebaseConfigured && db) {
    await addDoc(collection(db, COLLECTIONS.games), result);
    return;
  }
  const results = lsGet<GameResult[]>("gameResults", []);
  results.unshift(result);
  lsSet("gameResults", results);
}

export async function getGameResults(userId: string): Promise<GameResult[]> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, COLLECTIONS.games), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => d.data() as GameResult);
  }
  return lsGet<GameResult[]>("gameResults", []).filter((r) => r.userId === userId);
}

// ---------------------------------------------------------------------------
// BOZh assignment submissions
// ---------------------------------------------------------------------------
export async function submitAssignment(submission: AssignmentSubmission): Promise<void> {
  if (isFirebaseConfigured && db) {
    await addDoc(collection(db, COLLECTIONS.assignments), submission);
    return;
  }
  const list = lsGet<AssignmentSubmission[]>("assignmentSubmissions", []);
  list.unshift(submission);
  lsSet("assignmentSubmissions", list);
}

export async function getAssignmentSubmissions(userId?: string): Promise<AssignmentSubmission[]> {
  if (isFirebaseConfigured && db) {
    const q = userId
      ? query(collection(db, COLLECTIONS.assignments), where("userId", "==", userId))
      : collection(db, COLLECTIONS.assignments);
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => d.data() as AssignmentSubmission);
  }
  const list = lsGet<AssignmentSubmission[]>("assignmentSubmissions", []);
  return userId ? list.filter((a) => a.userId === userId) : list;
}

// ---------------------------------------------------------------------------
// Competency assessments
// ---------------------------------------------------------------------------
export async function saveCompetencyAssessment(assessment: CompetencyAssessment): Promise<void> {
  if (isFirebaseConfigured && db) {
    await addDoc(collection(db, COLLECTIONS.competencies), assessment);
    return;
  }
  const list = lsGet<CompetencyAssessment[]>("competencyAssessments", []);
  list.unshift(assessment);
  lsSet("competencyAssessments", list);
}

export async function getCompetencyAssessments(userId: string): Promise<CompetencyAssessment[]> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, COLLECTIONS.competencies), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => d.data() as CompetencyAssessment);
  }
  return lsGet<CompetencyAssessment[]>("competencyAssessments", []).filter((c) => c.userId === userId);
}

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------
export async function issueCertificate(cert: Certificate): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, COLLECTIONS.certificates, cert.id), cert);
    return;
  }
  const list = lsGet<Certificate[]>("certificates", []);
  list.unshift(cert);
  lsSet("certificates", list);
}

export async function getCertificates(userId: string): Promise<Certificate[]> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, COLLECTIONS.certificates), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => d.data() as Certificate);
  }
  return lsGet<Certificate[]>("certificates", []).filter((c) => c.userId === userId);
}

// ---------------------------------------------------------------------------
// Leaderboard (usually a derived/materialized collection)
// ---------------------------------------------------------------------------
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, COLLECTIONS.leaderboard), orderBy("xp", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => d.data() as LeaderboardEntry);
  }
  return lsGet<LeaderboardEntry[]>("leaderboard", []).sort((a, b) => b.xp - a.xp);
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export async function getNotifications(userId: string): Promise<Notification[]> {
  return lsGet<Notification[]>("notifications", []).filter((n) => n.userId === userId);
}

export async function pushNotification(n: Notification): Promise<void> {
  const list = lsGet<Notification[]>("notifications", []);
  list.unshift(n);
  lsSet("notifications", list);
}

// ---------------------------------------------------------------------------
// Analytics snapshot (in real deployment this would be computed by a
// scheduled Cloud Function aggregating the collections above)
// ---------------------------------------------------------------------------
export async function getAnalyticsSnapshot(userId: string): Promise<AnalyticsSnapshot> {
  return lsGet<AnalyticsSnapshot>(`analytics:${userId}`, {
    userId,
    weeklyActivityMinutes: [0, 0, 0, 0, 0, 0, 0],
    monthlyActivityMinutes: Array.from({ length: 30 }, () => 0),
    quizAverages: Array.from({ length: 10 }, () => 0),
    competencyRadar: [],
    timeSpentTotalMinutes: 0,
  });
}

export async function saveFinalGrade(result: FinalGradeResult): Promise<void> {
  const map = lsGet<Record<string, FinalGradeResult>>("finalGrades", {});
  map[result.userId] = result;
  lsSet("finalGrades", map);
}

export async function getFinalGrade(userId: string): Promise<FinalGradeResult | null> {
  const map = lsGet<Record<string, FinalGradeResult>>("finalGrades", {});
  return map[userId] ?? null;
}

export { uid as generateId };
