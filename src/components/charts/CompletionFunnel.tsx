import { ALL_MODULES } from "@/data/modules";

/**
 * Lesson-by-lesson drop-off. Drawn as plain rows rather than a chart library
 * shape: the useful comparison is "how many students are left" against "how
 * many started", and a labelled bar with both figures says that directly.
 */
export function CompletionFunnel({ counts, total }: { counts: number[]; total: number }) {
  return (
    <ol className="space-y-1.5">
      {counts.map((c, i) => {
        const pct = total > 0 ? Math.round((c / total) * 100) : 0;
        const dropped = i > 0 ? counts[i - 1] - c : 0;
        return (
          <li key={i} className="flex items-center gap-2.5">
            <span className="data-num w-5 shrink-0 text-right text-micro text-slate-500 dark:text-slate-400">
              {ALL_MODULES[i].id}
            </span>
            <span className="h-4 flex-1 overflow-hidden rounded bg-slate-100 dark:bg-white/10">
              <span
                className="block h-full rounded bg-brand-500"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="data-num w-14 shrink-0 text-right text-micro font-semibold text-slate-700 dark:text-slate-200">
              {c}/{total}
            </span>
            <span
              className={`data-num w-10 shrink-0 text-right text-micro ${
                dropped > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-600"
              }`}
            >
              {dropped > 0 ? `−${dropped}` : "—"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
