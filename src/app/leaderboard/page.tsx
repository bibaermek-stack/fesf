"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { useAuthStore } from "@/lib/authStore";
import type { LeaderboardEntry } from "@/lib/types";

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { userId: "u1", fullName: "Динара Нұрланқызы", xp: 2450, competencyScore: 92, rank: 1 },
  { userId: "u2", fullName: "Ерасыл Тоқтарұлы", xp: 2210, competencyScore: 88, rank: 2 },
  { userId: "demo-student-1", fullName: "Айгерім Болатқызы", xp: 1280, competencyScore: 74, rank: 3 },
  { userId: "u4", fullName: "Мадина Сәрсенқызы", xp: 1190, competencyScore: 71, rank: 4 },
  { userId: "u5", fullName: "Асхат Жомартұлы", xp: 980, competencyScore: 65, rank: 5 },
];

export default function LeaderboardPage() {
  const user = useAuthStore((s) => s.user);
  const sorted = [...MOCK_LEADERBOARD].sort((a, b) => b.xp - a.xp);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Көшбасшылар кестесі</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Топтастарыңмен жарысып, XP ұпайын жина.</p>
        </div>
        <LeaderboardTable entries={sorted} currentUserId={user?.uid} />
      </div>
    </DashboardShell>
  );
}
