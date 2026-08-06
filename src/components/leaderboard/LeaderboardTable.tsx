import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/types";

export function LeaderboardTable({ entries, currentUserId }: { entries: LeaderboardEntry[]; currentUserId?: string }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="overflow-hidden rounded-xl2 border border-slate-200/60 dark:border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-white/5 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Орын</th>
            <th className="px-4 py-3">Студент</th>
            <th className="px-4 py-3">XP ұпай</th>
            <th className="px-4 py-3">Құзыреттілік</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr
              key={e.userId}
              className={`border-t border-slate-100 dark:border-white/5 ${
                e.userId === currentUserId ? "bg-brand-50 dark:bg-brand-900/20" : ""
              }`}
            >
              <td className="px-4 py-3 font-semibold">
                {i < 3 ? medals[i] : i + 1}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                    {e.fullName.charAt(0)}
                  </div>
                  {e.fullName}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1">
                  <Trophy size={14} className="text-amber-500" /> {e.xp}
                </span>
              </td>
              <td className="px-4 py-3">{e.competencyScore}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
