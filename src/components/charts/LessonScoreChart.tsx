"use client";

import "./ChartSetup";
import { Bar } from "react-chartjs-2";
import { LESSON_SHORT } from "@/data/cohort";
import { useChartTheme } from "./useChartTheme";

/**
 * Score per lesson — used both for a cohort average (teacher analytics) and a
 * single student's own best attempt (student dashboard), coloured against the
 * pass threshold so weak topics separate themselves without the reader
 * comparing bar lengths. `null` means "not attempted yet" and is drawn as a
 * neutral grey stub rather than a failing red bar.
 */
export function LessonScoreChart({
  values,
  threshold = 72,
  label = "Ұпай, %",
}: {
  values: (number | null)[];
  threshold?: number;
  label?: string;
}) {
  const t = useChartTheme();
  const data = {
    labels: LESSON_SHORT,
    datasets: [
      {
        label,
        data: values.map((v) => v ?? 0),
        backgroundColor: values.map((v) =>
          v === null ? "#cbd5e1" : v < 60 ? "#e11d48" : v < threshold ? "#f59e0b" : "#3366ff"
        ),
        borderRadius: 4,
      },
    ],
  };

  return (
    <Bar
      key={t.version}
      data={data}
      options={{
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: t.tooltipBg,
            titleColor: t.tooltipText,
            bodyColor: t.tooltipText,
            borderColor: t.gridStrong,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
              title: (t) => `${t[0].label}-сабақ`,
              label: (t) => {
                const v = values[t.dataIndex];
                return v === null ? "Әлі тапсырылмаған" : `${label}: ${t.formattedValue}%`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: t.grid },
            border: { display: false },
            ticks: { color: t.textMuted, font: { size: 11 }, callback: (v) => `${v}%` },
          },
          x: {
            grid: { display: false },
            border: { color: t.grid },
            ticks: { color: t.textMuted, font: { size: 11 } },
          },
        },
      }}
    />
  );
}
