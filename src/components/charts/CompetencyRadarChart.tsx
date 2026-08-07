"use client";

import "./ChartSetup";
import { Radar } from "react-chartjs-2";
import { RUBRIC_CRITERIA, RUBRIC_LEVEL_LABELS } from "@/lib/competency";
import { useChartTheme } from "./useChartTheme";

/**
 * Ten-criterion competency radar.
 *
 * Takes an optional second series so a student's own profile can be read
 * against the cohort average — the shape of the gap is the useful part, and a
 * single polygon cannot show it.
 */
export function CompetencyRadarChart({
  values,
  compare,
  compareLabel = "Топ орташасы",
  label = "Құзыреттілік деңгейі",
}: {
  values: number[];
  compare?: number[];
  compareLabel?: string;
  label?: string;
}) {
  const t = useChartTheme();

  const datasets = [
    {
      label,
      data: values,
      backgroundColor: "rgba(51,102,255,0.22)",
      borderColor: "#5c8dff",
      borderWidth: 2,
      pointBackgroundColor: "#8fb4ff",
      pointBorderColor: t.dark ? "#0b1020" : "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 3.5,
      pointHoverRadius: 5.5,
      fill: true,
    },
  ];

  if (compare) {
    datasets.push({
      label: compareLabel,
      data: compare,
      backgroundColor: "rgba(139,92,246,0.10)",
      borderColor: "rgba(167,139,250,0.85)",
      borderWidth: 1.5,
      pointBackgroundColor: "rgba(167,139,250,0.9)",
      pointBorderColor: t.dark ? "#0b1020" : "#ffffff",
      pointBorderWidth: 1.5,
      pointRadius: 2.5,
      pointHoverRadius: 4.5,
      fill: true,
    });
  }

  return (
    <Radar
      // Forces a full repaint when the theme flips; canvas colours are baked in.
      key={t.version}
      data={{ labels: RUBRIC_CRITERIA.map((c) => c.label), datasets }}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.1,
        // Dots are small; widen the hit area so tooltips are reachable.
        interaction: { mode: "nearest", intersect: false },
        scales: {
          r: {
            min: 0,
            max: 5,
            angleLines: { color: t.grid },
            grid: { color: t.grid, circular: true },
            pointLabels: {
              color: t.textMuted,
              font: { size: 11 },
            },
            ticks: {
              stepSize: 1,
              color: t.textMuted,
              // The library defaults to a white pill behind each tick, which on
              // the dark shell reads as stray boxes stacked up the axis.
              backdropColor: "transparent",
              showLabelBackdrop: false,
              font: { size: 10 },
            },
          },
        },
        plugins: {
          legend: {
            display: Boolean(compare),
            position: "bottom",
            labels: {
              color: t.textMuted,
              usePointStyle: true,
              pointStyle: "circle",
              boxWidth: 7,
              padding: 16,
            },
          },
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
              // Show the rubric wording, not just the number — "3" alone means
              // nothing to a student reading their own profile.
              label: (ctx) => {
                const lvl = Math.round(ctx.parsed.r) as 1 | 2 | 3 | 4 | 5;
                const name = RUBRIC_LEVEL_LABELS[lvl] ?? "—";
                return `${ctx.dataset.label}: ${ctx.parsed.r} — ${name}`;
              },
              afterLabel: (ctx) =>
                RUBRIC_CRITERIA[ctx.dataIndex]?.description ?? "",
            },
          },
        },
      }}
    />
  );
}
