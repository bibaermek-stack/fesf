"use client";

import "./ChartSetup";
import { Bar } from "react-chartjs-2";
import { LESSON_SHORT } from "@/data/cohort";

/**
 * Average score per lesson, coloured against the pass threshold so the weak
 * topics separate themselves without the reader comparing bar lengths.
 */
export function LessonScoreChart({
  values,
  threshold = 72,
}: {
  values: number[];
  threshold?: number;
}) {
  const data = {
    labels: LESSON_SHORT,
    datasets: [
      {
        label: "Орташа ұпай, %",
        data: values,
        backgroundColor: values.map((v) =>
          v < 60 ? "#e11d48" : v < threshold ? "#f59e0b" : "#3366ff"
        ),
        borderRadius: 4,
      },
    ],
  };

  return (
    <Bar
      data={data}
      options={{
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (t) => `${t[0].label}-сабақ`,
              label: (t) => `Орташа ұпай: ${t.formattedValue}%`,
            },
          },
        },
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { callback: (v) => `${v}%` } },
          x: { grid: { display: false } },
        },
      }}
    />
  );
}
