import { DataTable, type Column } from "@/components/ui/DataTable";
import type { LeaderboardEntry } from "@/lib/types";

/**
 * Ranks are shown as figures rather than medal emoji: the numbers keep working
 * past third place, line up in a column, and read the same on every device.
 * The top three are marked by weight and colour instead.
 */
export function LeaderboardTable({
  entries,
  currentUserId,
}: {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}) {
  const columns: Column<LeaderboardEntry>[] = [
    {
      key: "rank",
      header: "Орын",
      width: "72px",
      render: (_e, i) => (
        <span
          className={
            i < 3
              ? "data-num text-data-sm text-brand-600 dark:text-brand-400"
              : "data-num text-slate-500 dark:text-slate-400"
          }
        >
          {i + 1}
        </span>
      ),
    },
    {
      key: "name",
      header: "Студент",
      render: (e) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
            {e.fullName.charAt(0)}
          </span>
          <span className="truncate">{e.fullName}</span>
        </div>
      ),
    },
    { key: "xp", header: "XP ұпай", numeric: true, render: (e) => e.xp },
    {
      key: "competency",
      header: "Құзыреттілік",
      numeric: true,
      render: (e) => `${e.competencyScore}%`,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={entries}
      rowKey={(e) => e.userId}
      highlight={(e) => e.userId === currentUserId}
      empty="Көшбасшылар кестесі әзірге бос."
    />
  );
}
