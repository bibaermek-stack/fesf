"use client";

import dynamic from "next/dynamic";
import { FileDown, Sheet } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { ActivityBarChart } from "@/components/charts/ActivityBarChart";
import { CompetencyRadarChart } from "@/components/charts/CompetencyRadarChart";
import { LessonScoreChart } from "@/components/charts/LessonScoreChart";
import { ProgressDistributionChart } from "@/components/charts/ProgressDistributionChart";
import { CompletionFunnel } from "@/components/charts/CompletionFunnel";
import { ActionList } from "@/components/teacher/ActionList";
import { ALL_MODULES } from "@/data/modules";
import {
  COHORT,
  cohortSummary,
  cohortWeekly,
  lessonAverages,
  lessonCompletion,
  progressDistribution,
  studentAverage,
  studentProgress,
  type StudentRow,
} from "@/data/cohort";
import { buildActions } from "@/data/recommendations";

// three.js only ships when this page is opened, same as the lesson simulations.
const ScoreMatrix3D = dynamic(
  () => import("@/components/charts/ScoreMatrix3D").then((m) => m.ScoreMatrix3D),
  {
    ssr: false,
    loading: () => (
      <div className="surface-sunken flex h-[360px] items-center justify-center text-body text-slate-500">
        3D диаграмма дайындалуда…
      </div>
    ),
  }
);

const COMPETENCY = [4, 3, 4, 3, 3, 4, 3, 3, 4, 3];

export default function TeacherAnalyticsPage() {
  const summary = cohortSummary();
  const averages = lessonAverages();
  const completion = lessonCompletion();
  const actions = buildActions();

  const weakest = averages.indexOf(Math.min(...averages.filter((a) => a > 0)));
  const strongest = averages.indexOf(Math.max(...averages));

  const columns: Column<StudentRow>[] = [
    { key: "name", header: "Студент", render: (r) => r.fullName },
    { key: "group", header: "Топ", width: "80px", render: (r) => r.group },
    {
      key: "progress",
      header: "Прогресс",
      numeric: true,
      render: (r) => `${studentProgress(r)}%`,
    },
    { key: "avg", header: "Орташа ұпай", numeric: true, render: (r) => `${studentAverage(r)}%` },
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
        const p = studentProgress(r);
        const a = studentAverage(r);
        if (p < 50 && a < 65) return <Badge variant="danger">Қауіп тобы</Badge>;
        if (r.daysSinceActive >= 7) return <Badge variant="warning">Белсенді емес</Badge>;
        return <Badge variant="success">Белсенді</Badge>;
      },
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <SectionHeader
          as="h1"
          title="Есептер мен аналитика"
          description={`${summary.students} студент · ${ALL_MODULES.length} сабақ · апталық белсенділік ${summary.weeklyMinutes} минут`}
          action={
            <div className="flex gap-2">
              <button className="btn-secondary px-4 py-2 text-sm">
                <Sheet size={16} /> Excel экспорт
              </button>
              <button onClick={() => window.print()} className="btn-secondary px-4 py-2 text-sm">
                <FileDown size={16} /> PDF экспорт
              </button>
            </div>
          }
        />

        {/* What to do — placed above the charts, because it is the answer the
            charts exist to produce. */}
        <section>
          <SectionHeader
            title="Не істеу керек"
            description="Төмендегі көрсеткіштерден шыққан, маңыздылығы бойынша реттелген тізім."
          />
          <div className="mt-3">
            <ActionList items={actions} />
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Орташа курс прогресі"
            value={summary.avgProgress}
            unit="%"
            context={`${summary.students} студент бойынша`}
            tone="brand"
          />
          <StatCard
            label="Орташа викторина ұпайы"
            value={summary.avgScore}
            unit="%"
            context={`Ең әлсіз: ${weakest + 1}-сабақ (${averages[weakest]}%)`}
            tone="emerald"
          />
          <StatCard
            label="Орташа құзыреттілік"
            value={summary.avgCompetency}
            unit="/ 5"
            context="10 критерийлі рубрика"
            tone="amber"
          />
          <StatCard
            label="Тексерілмеген тапсырма"
            value={summary.ungraded}
            context="БӨЖ кері байланыс күтуде"
            tone={summary.ungraded > 0 ? "rose" : "default"}
          />
        </div>

        {/* 3D matrix ------------------------------------------------------- */}
        <Card>
          <SectionHeader
            title="Студенттер × сабақтар: ұпай матрицасы (3D)"
            description="Бір бағанның толық төмен болуы — қиын сабақ; бір қатардың төмен болуы — қиналып жүрген студент."
          />
          <div className="mt-4">
            <ScoreMatrix3D rows={COHORT} />
          </div>
        </Card>

        {/* Flat charts ----------------------------------------------------- */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <p className="mb-1 text-h3">Сабақтар бойынша орташа ұпай</p>
            <p className="mb-4 text-micro text-slate-600 dark:text-slate-400">
              Ең жоғары: {strongest + 1}-сабақ ({averages[strongest]}%) · ең төмен: {weakest + 1}-сабақ (
              {averages[weakest]}%)
            </p>
            <LessonScoreChart values={averages} />
          </Card>

          <Card>
            <p className="mb-1 text-h3">Прогресс таралуы</p>
            <p className="mb-4 text-micro text-slate-600 dark:text-slate-400">
              Орташа мән топтың біркелкі екенін көрсетпейді — таралу көрсетеді.
            </p>
            <ProgressDistributionChart buckets={progressDistribution()} />
          </Card>

          <Card>
            <p className="mb-1 text-h3">Сабақтарды аяқтау және шығып қалу</p>
            <p className="mb-4 text-micro text-slate-600 dark:text-slate-400">
              Оң жақтағы қызыл сан — алдыңғы сабақпен салыстырғанда жетпеген студент саны.
            </p>
            <CompletionFunnel counts={completion} total={COHORT.length} />
          </Card>

          <Card>
            <p className="mb-4 text-h3">Топтың апталық белсенділігі (минут)</p>
            <ActivityBarChart values={cohortWeekly()} />
          </Card>

          <Card className="lg:col-span-2">
            <p className="mb-4 text-h3">Топтың орташа құзыреттілік радары</p>
            <div className="mx-auto max-w-xl">
              <CompetencyRadarChart values={COMPETENCY} />
            </div>
          </Card>
        </div>

        {/* Roster ---------------------------------------------------------- */}
        <section>
          <SectionHeader
            title="Студенттер тізімі"
            description="Мәртебе жоғарыдағы «не істеу керек» тізімімен бір ережеден есептеледі."
          />
          <div className="mt-3">
            <DataTable columns={columns} rows={COHORT} rowKey={(r) => r.id} />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
