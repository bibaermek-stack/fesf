import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { ActionItem } from "@/data/recommendations";

const SEVERITY: Record<
  ActionItem["severity"],
  { label: string; variant: "danger" | "warning" | "neutral"; rule: string }
> = {
  critical: { label: "Шұғыл", variant: "danger", rule: "bg-rose-500" },
  warning: { label: "Назар аудар", variant: "warning", rule: "bg-amber-500" },
  info: { label: "Ұсыныс", variant: "neutral", rule: "bg-slate-300 dark:bg-white/20" },
};

/**
 * "What to do next", derived from the same figures the charts are drawn from.
 * Each row states the evidence and the step, so the teacher does not have to
 * infer an action from a graph.
 */
export function ActionList({ items }: { items: ActionItem[] }) {
  if (items.length === 0) {
    return (
      <div className="surface-sunken p-6 text-center text-body text-slate-600 dark:text-slate-400">
        Қазір назар аударуды қажет ететін мәселе жоқ.
      </div>
    );
  }

  return (
    <ol className="space-y-2">
      {items.map((it, i) => {
        const s = SEVERITY[it.severity];
        return (
          <li key={it.id} className="surface relative overflow-hidden p-4 pl-5">
            <span className={`absolute inset-y-0 left-0 w-1 ${s.rule}`} />
            <div className="flex flex-wrap items-center gap-2">
              <span className="data-num text-micro font-bold text-slate-400 dark:text-slate-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Badge variant={s.variant}>{s.label}</Badge>
              <Badge variant="neutral">{it.kind}</Badge>
            </div>

            <p className="mt-2 text-h3">{it.title}</p>
            <p className="mt-1 text-body text-slate-600 dark:text-slate-400">{it.evidence}</p>

            {it.names && it.names.length > 0 && (
              <p className="mt-1.5 text-micro text-slate-500 dark:text-slate-400">
                {it.names.slice(0, 4).join(", ")}
                {it.names.length > 4 ? ` және тағы ${it.names.length - 4}` : ""}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-white/5">
              <p className="text-body font-semibold text-slate-800 dark:text-slate-100">
                {it.action}
              </p>
              {it.href && (
                <Link
                  href={it.href}
                  className="inline-flex shrink-0 items-center gap-1.5 text-body font-semibold text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
                >
                  Өту <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
