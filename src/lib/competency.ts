// Competency-based assessment engine.
// Implements the 10-criterion rubric (Beginning..Expert, 1-5) and the
// weighted final-grade formula described in the thesis methodology.
import type {
  FinalGradeBreakdown,
  FinalGradeResult,
  RubricCriterionKey,
  RubricCriterionScore,
} from "./types";

export const RUBRIC_LEVEL_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Бастапқы (Beginning)",
  2: "Дамушы (Developing)",
  3: "Құзыретті (Competent)",
  4: "Жетік (Advanced)",
  5: "Сарапшы (Expert)",
};

export const RUBRIC_CRITERIA: { key: RubricCriterionKey; label: string; description: string }[] = [
  { key: "knowledge", label: "Механика білімі", description: "Механика заңдары мен ұғымдарын меңгеру деңгейі" },
  { key: "ict", label: "АКТ құзыреттілігі", description: "Цифрлық құралдарды тиімді пайдалану дағдысы" },
  { key: "infoSearch", label: "Ақпарат іздеу дағдысы", description: "Қажетті ақпаратты тауып, іріктей білу" },
  { key: "digitalComm", label: "Цифрлық коммуникация", description: "Онлайн ортада тиімді қарым-қатынас жасау" },
  { key: "criticalThinking", label: "Сыни тұрғыдан ойлау", description: "Ақпаратты талдап, негізделген қорытынды жасау" },
  { key: "independentLearning", label: "Өзіндік оқу дағдысы", description: "Өз бетінше жоспарлап, оқуды басқару" },
  { key: "aiUsage", label: "ЖИ құралдарын пайдалану", description: "AI тьюторды тиімді әрі этикалық пайдалану" },
  { key: "practicalApplication", label: "Практикалық қолдану", description: "Теорияны нақты есептерге қолдана білу" },
  { key: "creativity", label: "Шығармашылық", description: "Түпнұсқа шешімдер мен идеялар ұсыну" },
  { key: "reflection", label: "Рефлексия", description: "Өз оқу үдерісін бағалап, жетілдіру" },
];

export function averageRubricLevel(scores: RubricCriterionScore[]): number {
  if (!scores.length) return 0;
  const sum = scores.reduce((acc, s) => acc + s.level, 0);
  return Math.round((sum / scores.length) * 100) / 100;
}

export function rubricLevelToPercent(avgLevel: number): number {
  // Level 1 -> 20%, Level 5 -> 100%
  return Math.round((avgLevel / 5) * 100);
}

// Weights per project spec (must sum to 100).
export const GRADE_WEIGHTS: Record<keyof FinalGradeBreakdown, number> = {
  video: 10,
  quiz: 20,
  games: 10,
  bozh: 20,
  googleForm: 15,
  aiActivity: 10,
  forum: 5,
  portfolio: 5,
  finalProject: 5,
  reflectionJournal: 5,
};

export function computeFinalGrade(userId: string, breakdown: FinalGradeBreakdown): FinalGradeResult {
  const weightedTotal = (Object.keys(GRADE_WEIGHTS) as (keyof FinalGradeBreakdown)[]).reduce(
    (sum, key) => sum + (breakdown[key] / 100) * GRADE_WEIGHTS[key],
    0
  );
  const rounded = Math.round(weightedTotal * 100) / 100;
  return {
    userId,
    breakdown,
    weightedTotal: rounded,
    competencyLevel: gradeToCompetencyLevel(rounded),
    updatedAt: new Date().toISOString(),
  };
}

export function gradeToCompetencyLevel(percent: number): FinalGradeResult["competencyLevel"] {
  if (percent >= 90) return "Сарапшы";
  if (percent >= 75) return "Жетік";
  if (percent >= 60) return "Құзыретті";
  if (percent >= 40) return "Дамушы";
  return "Бастапқы";
}
