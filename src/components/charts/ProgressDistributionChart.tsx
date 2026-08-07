"use client";

import "./ChartSetup";
import { Bar } from "react-chartjs-2";
import { PROGRESS_BUCKETS } from "@/data/cohort";

/**
 * How the cohort is spread across progress bands. An average hides whether the
 * group is uniform or split into "finished" and "stalled"; this does not.
 */
export function ProgressDistributionChart({ buckets }: { buckets: number[] }) {
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
      data={data}
      options={{
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (t) => `${t.formattedValue} студент` } },
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
          x: { grid: { display: false } },
        },
      }}
    />
  );
}
