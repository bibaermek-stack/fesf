import clsx from "clsx";

/**
 * A single figure carrying a card: label above, large tabular number, context
 * below. The number is the visual interest — no decorative icon needed. The
 * dashboard, the teacher dashboard and the analytics page all used a slightly
 * different hand-rolled version of this; they now share one.
 */
export function StatCard({
  label,
  value,
  unit,
  context,
  tone = "default",
}: {
  label: string;
  value: string | number;
  unit?: string;
  context?: string;
  tone?: "default" | "brand" | "emerald" | "amber" | "rose";
}) {
  const spines = {
    default: "bg-slate-300 dark:bg-white/20",
    brand: "bg-brand-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };
  return (
    <div className="surface relative overflow-hidden p-4 pl-5">
      <span className={clsx("absolute inset-y-3 left-0 w-1 rounded-r-full", spines[tone])} />
      <p className="text-label uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="data-num mt-1.5 text-data text-slate-900 dark:text-white">
        {value}
        {unit && <span className="ml-1 text-h3 font-semibold text-slate-500 dark:text-slate-400">{unit}</span>}
      </p>
      {context && <p className="mt-1 text-micro text-slate-500 dark:text-slate-400">{context}</p>}
    </div>
  );
}
