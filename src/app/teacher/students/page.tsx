"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ALL_MODULES } from "@/data/modules";
import {
  COHORT,
  cohortSummary,
  studentAverage,
  studentProgress,
  type StudentRow,
} from "@/data/cohort";

/** Same rule the analytics recommendations use, so the two pages never disagree. */
function status(r: StudentRow) {
  const p = studentProgress(r);
  const a = studentAverage(r);
  if (p < 50 && a < 65) return { label: "Қауіп тобы", variant: "danger" as const };
  if (r.daysSinceActive >= 7) return { label: "Белсенді емес", variant: "warning" as const };
  return { label: "Белсенді", variant: "success" as const };
}

export default function TeacherStudentsPage() {
  const summary = cohortSummary();
  const atRisk = COHORT.filter((r) => status(r).label === "Қауіп тобы").length;
  const inactive = COHORT.filter((r) => status(r).label === "Белсенді емес").length;

  const columns: Column<StudentRow>[] = [
    { key: "name", header: "Студент", render: (r) => r.fullName },
    { key: "group", header: "Топ", width: "80px", render: (r) => r.group },
    {
      key: "progress",
      header: "Прогресс",
      width: "180px",
      render: (r) => (
        <ProgressBar
          value={studentProgress(r)}
          segments={ALL_MODULES.length}
          tone={studentProgress(r) < 50 ? "amber" : "emerald"}
        />
      ),
    },
    { key: "avg", header: "Орташа ұпай", numeric: true, render: (r) => `${studentAverage(r)}%` },
    {
      key: "ungraded",
      header: "Тексерілмеген",
      numeric: true,
      render: (r) => (r.ungraded > 0 ? r.ungraded : "—"),
    },
    {
      key: "active",
      header: "Соңғы кіру",
      numeric: true,
      render: (r) => (r.daysSinceActive === 0 ? "бүгін" : `${r.daysSinceActive} күн`),
    },
    {
      key: "status",
      header: "Мәртебе",
      width: "150px",
      render: (r) => {
        const s = status(r);
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <SectionHeader
          as="h1"
          title="Студенттерді басқару"
          description="Барлық студенттердің прогресі, ұпайы және белсенділігі."
          action={
            <Link href="/teacher/analytics" className="btn-secondary px-4 py-2 text-sm">
              Аналитикаға өту
            </Link>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Барлық студент" value={summary.students} tone="brand" />
          <StatCard
            label="Қауіп тобында"
            value={atRisk}
            context="Прогресі 50%-дан және ұпайы 65%-дан төмен"
            tone={atRisk > 0 ? "rose" : "default"}
          />
          <StatCard
            label="Бір аптадан бері кірмеген"
            value={inactive}
            tone={inactive > 0 ? "amber" : "default"}
          />
          <StatCard
            label="Орташа прогресс"
            value={summary.avgProgress}
            unit="%"
            tone="emerald"
          />
        </div>

        <DataTable
          columns={columns}
          rows={COHORT}
          rowKey={(r) => r.id}
          highlight={(r) => status(r).label === "Қауіп тобы"}
        />
      </div>
    </DashboardShell>
  );
}
