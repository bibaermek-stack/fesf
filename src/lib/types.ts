// Core domain types shared across the app.
// Comments are in English per project convention; all UI-facing strings live in src/data (Kazakh).

export type UserRole = "student" | "teacher" | "admin";

export interface AppUser {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  group?: string; // student group / cohort
  createdAt: string;
  competencyScore?: number; // 0-100 aggregate
  badges?: string[];
  xp?: number;
}

export interface BloomOutcomes {
  remember: string;
  understand: string;
  apply: string;
  analyze: string;
  evaluate: string;
  create: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type GameType =
  | "matching"
  | "crossword"
  | "memory"
  | "flashcards"
  | "wordsearch"
  | "dragdrop"
  | "fillblank"
  | "timeline"
  | "puzzle"
  | "spinwheel"
  | "sorting"
  | "conceptmap";

export interface GamePair {
  left: string;
  right: string;
}

export interface ModuleGame {
  type: GameType;
  title: string;
  instructions: string;
  pairs?: GamePair[]; // matching / memory
  words?: string[]; // wordsearch / crossword
  cards?: { front: string; back: string }[]; // flashcards
  blanks?: { text: string; answer: string }[]; // fillblank
  timelineEvents?: { year: string; label: string }[]; // timeline
  sortingCategories?: { category: string; items: string[] }[]; // sorting
}

export interface BOZhAssignment {
  scenario: string; // real-life engineering situation description
  tasks: string[]; // forces / acceleration / energy / friction, etc.
  submissionTypes: ("text" | "image" | "pdf" | "video" | "voice")[];
}

export interface LessonModule {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  youtubeId: string; // just the video id, admin-editable
  videoDurationMinutes: number;
  objectives: string[];
  bloom: BloomOutcomes;
  lectureSummary: string[]; // paragraphs
  keyConcepts: string[];
  glossary: GlossaryTerm[];
  reflectionQuestions: string[];
  assignment: BOZhAssignment;
  quiz: QuizQuestion[];
  game: ModuleGame;
}

export interface QuizAttempt {
  id: string;
  moduleId: number;
  userId: string;
  score: number; // out of 10
  total: number;
  answers: { questionId: string; chosenIndex: number; correct: boolean }[];
  takenAt: string;
}

export interface GameResult {
  id: string;
  moduleId: number;
  userId: string;
  gameType: GameType;
  score: number; // 0-100
  completedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  moduleId: number;
  userId: string;
  type: "text" | "image" | "pdf" | "video" | "voice";
  content: string; // text content or file reference
  submittedAt: string;
  teacherFeedback?: string;
  grade?: number; // 0-100
  status: "pending" | "reviewed";
}

export interface RubricCriterionScore {
  criterion: RubricCriterionKey;
  level: 1 | 2 | 3 | 4 | 5; // Beginning..Expert
}

export type RubricCriterionKey =
  | "knowledge"
  | "ict"
  | "infoSearch"
  | "digitalComm"
  | "criticalThinking"
  | "independentLearning"
  | "aiUsage"
  | "practicalApplication"
  | "creativity"
  | "reflection";

export interface CompetencyAssessment {
  id: string;
  userId: string;
  moduleId: number;
  scores: RubricCriterionScore[];
  averageLevel: number; // 1-5
  percent: number; // 0-100
  assessedAt: string;
  assessorType: "self" | "ai" | "teacher";
}

export interface FinalGradeBreakdown {
  video: number; // %
  quiz: number;
  games: number;
  bozh: number;
  googleForm: number;
  aiActivity: number;
  forum: number;
  portfolio: number;
  finalProject: number;
  reflectionJournal: number;
}

export interface FinalGradeResult {
  userId: string;
  breakdown: FinalGradeBreakdown;
  weightedTotal: number; // 0-100
  competencyLevel: "Бастапқы" | "Дамушы" | "Құзыретті" | "Жетік" | "Сарапшы";
  updatedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseName: string;
  issuedAt: string;
  qrData: string;
  verifyUrl: string;
}

export interface LeaderboardEntry {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  xp: number;
  competencyScore: number;
  rank: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: "info" | "success" | "warning" | "ai";
}

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface AnalyticsSnapshot {
  userId: string;
  weeklyActivityMinutes: number[]; // 7 values
  monthlyActivityMinutes: number[]; // ~30 values
  quizAverages: number[]; // per module
  competencyRadar: { criterion: RubricCriterionKey; value: number }[];
  timeSpentTotalMinutes: number;
}
