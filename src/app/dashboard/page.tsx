"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LessonCard } from "@/components/ui/LessonCard";
import { ALL_MODULES } from "@/data/modules";
import { useAuthStore } from "@/lib/authStore";
import { getQuizAttempts } from "@/lib/dataStore";
import { ArrowRight } from "lucide-react";

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>([]);

  useEffect(() => {
    if (!user) return;
    getQuizAttempts(user.uid).then((attempts) => {
      const ids = Array.from(new Set(attempts.filter((a) => a.score >= a.total * 0.6).map((a) => a.moduleId)));
      setCompletedModuleIds(ids);
    });
  }, [user]);

  const progressPercent = Math.round((completedModuleIds.length / ALL_MODULES.length) * 100);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <SectionHeader
          as="h1"
          title={`Қош келдің, ${user?.fullName?.split(" ")[0] ?? "Студент"}`}
          description="Механика курсындағы прогресіңді осында бақыла."
          action={
            <Link href="/modules" className="btn-primary">
              Оқуды жалғастыру <ArrowRight size={16} />
            </Link>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Аяқталған сабақтар"
            value={`${completedModuleIds.length}/${ALL_MODULES.length}`}
            context={`Курстың ${progressPercent}%-ы`}
            tone="brand"
          />
          <StatCard
            label="Құзыреттілік деңгейі"
            value={user?.competencyScore ?? 0}
            unit="%"
            context="10 критерий бойынша рубрика"
            tone="emerald"
          />
          <StatCard
            label="Жинаған ұпай"
            value={user?.xp ?? 0}
            unit="XP"
            context="Викторина, ойын және БӨЖ үшін"
            tone="amber"
          />
          <StatCard label="Оқу сериясы" value={5} unit="күн" context="Қатарынан белсенді күн" />
        </div>

        <Card>
          <p className="mb-3 text-h3">Жалпы курс прогресі</p>
          <ProgressBar
            value={progressPercent}
            segments={ALL_MODULES.length}
            tone="emerald"
            label="Аяқталған сабақтар"
          />
        </Card>

        <div>
          <SectionHeader title="Оқу сабақтары" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_MODULES.map((m) => (
              <LessonCard
                key={m.id}
                id={m.id}
                title={m.title}
                description={m.shortDescription}
                minutes={m.videoDurationMinutes}
                done={completedModuleIds.includes(m.id)}
              />
            ))}
          </div>
        </div>

        {user?.badges && user.badges.length > 0 && (
          <Card>
            <p className="mb-3 text-h3">Жетістіктерің</p>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((b, i) => (
                <Badge key={b} variant="default" marker={String(i + 1)}>
                  {b}
                </Badge>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
