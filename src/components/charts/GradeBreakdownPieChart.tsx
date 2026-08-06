"use client";

import "./ChartSetup";
import { Pie } from "react-chartjs-2";
import type { FinalGradeBreakdown } from "@/lib/types";
import { GRADE_WEIGHTS } from "@/lib/competency";

const LABELS: Record<keyof FinalGradeBreakdown, string> = {
  video: "Бейнедәрісті көру",
  quiz: "Викторина",
  games: "Интерактивті ойындар",
  bozh: "БӨЖ тапсырмасы",
  googleForm: "Google Forms бағалау",
  aiActivity: "AI белсенділігі",
  forum: "Форумға қатысу",
  portfolio: "Цифрлық портфолио",
  finalProject: "Қорытынды жоба",
  reflectionJournal: "Рефлексия күнделігі",
};

const COLORS = [
  "#3366ff", "#5c8dff", "#1f47e6", "#1a3391", "#8fb4ff",
  "#0f1a45", "#1a39b8", "#bcd2ff", "#1a2f73", "#d9e6ff",
];

export function GradeBreakdownPieChart() {
  const keys = Object.keys(GRADE_WEIGHTS) as (keyof FinalGradeBreakdown)[];
  const data = {
    labels: keys.map((k) => `${LABELS[k]} (${GRADE_WEIGHTS[k]}%)`),
    datasets: [
      {
        data: keys.map((k) => GRADE_WEIGHTS[k]),
        backgroundColor: COLORS,
      },
    ],
  };
  return <Pie data={data} options={{ plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } } }} />;
}
