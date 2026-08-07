"use client";

import "./ChartSetup";
import { Bar } from "react-chartjs-2";
import { PROGRESS_BUCKETS } from "@/data/cohort";
import { useChartTheme } from "./useChartTheme";

/**
 * How the cohort is spread across progress bands. An average hides whether the
 * group is uniform or split into "finished" and "stalled"; this does not.
 */
export function ProgressDistributionChart({ buckets }: { buckets: number[] }) {
  const t = useChartTheme();
  const data = {
    labels: PROGRESS_BUCKETS,
    datasets: [
      {
        label: "Студент саны",
        data: buckets,
        backgroundColor: ["#e11d48", "#f59e0b", "#94a3b8", "#5c8dff", "#10b981"],
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
            callbacks: { label: (c) => `${c.formattedValue} студент` },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: t.grid },
            border: { display: false },
            ticks: { color: t.textMuted, font: { size: 11 }, precision: 0 },
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
