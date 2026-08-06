"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { ActivityBarChart } from "@/components/charts/ActivityBarChart";
import { CompetencyRadarChart } from "@/components/charts/CompetencyRadarChart";
import { FileDown, Sheet } from "lucide-react";

const GROUP_WEEKLY = [180, 220, 150, 260, 200, 90, 60];
const GROUP_COMPETENCY = [4, 3, 4, 3, 3, 4, 3, 3, 4, 3];

export default function TeacherAnalyticsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Есептер мен аналитика</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Топтың жалпы белсенділігі мен құзыреттілік көрсеткіштері.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm"><Sheet size={16} /> Excel экспорт</button>
            <button onClick={() => window.print()} className="btn-secondary text-sm"><FileDown size={16} /> PDF экспорт</button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <GlassCard>
            <p className="text-2xl font-bold">76%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Орташа курс прогресі</p>
          </GlassCard>
          <GlassCard>
            <p className="text-2xl font-bold">81%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Орташа викторина ұпайы</p>
          </GlassCard>
          <GlassCard>
            <p className="text-2xl font-bold">3.6 / 5</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Орташа құзыреттілік деңгейі</p>
          </GlassCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <p className="mb-3 font-semibold">Топтың апталық белсенділігі (минут)</p>
            <ActivityBarChart values={GROUP_WEEKLY} />
          </GlassCard>
          <GlassCard>
            <p className="mb-3 font-semibold">Топтың орташа құзыреттілік радары</p>
            <CompetencyRadarChart values={GROUP_COMPETENCY} />
          </GlassCard>
        </div>
      </div>
    </DashboardShell>
  );
}
