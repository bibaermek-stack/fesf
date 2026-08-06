"use client";

import "./ChartSetup";
import { Bar } from "react-chartjs-2";

const WEEKDAYS = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жс"];

export function ActivityBarChart({ values }: { values: number[] }) {
  const data = {
    labels: WEEKDAYS,
    datasets: [
      {
        label: "Белсенділік (минут)",
        data: values,
        backgroundColor: "#3366ff",
        borderRadius: 6,
      },
    ],
  };
  return <Bar data={data} options={{ plugins: { legend: { display: false } } }} />;
}
