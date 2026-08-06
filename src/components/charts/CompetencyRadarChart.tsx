"use client";

import "./ChartSetup";
import { Radar } from "react-chartjs-2";
import { RUBRIC_CRITERIA } from "@/lib/competency";

export function CompetencyRadarChart({ values }: { values: number[] }) {
  const data = {
    labels: RUBRIC_CRITERIA.map((c) => c.label),
    datasets: [
      {
        label: "Құзыреттілік деңгейі",
        data: values,
        backgroundColor: "rgba(51,102,255,0.25)",
        borderColor: "#3366ff",
        pointBackgroundColor: "#1f47e6",
      },
    ],
  };
  return (
    <Radar
      data={data}
      options={{
        scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } },
        plugins: { legend: { display: false } },
      }}
    />
  );
}
