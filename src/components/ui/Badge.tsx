import clsx from "clsx";

/**
 * Status chip. Every variant carries a border as well as a fill so the meaning
 * survives greyscale printing and colour-vision differences — colour alone is
 * never the only signal.
 */
export function Badge({
  children,
  variant = "default",
  marker,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "neutral";
  /** Short leading text (a number, "AA", "1/10") shown in a heavier weight. */
  marker?: string;
}) {
  const styles = {
    default:
      "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-400/25 dark:bg-brand-900/40 dark:text-brand-200",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-900/35 dark:text-emerald-200",
    warning:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/25 dark:bg-amber-900/35 dark:text-amber-200",
    danger:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-900/35 dark:text-rose-200",
    neutral:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[variant]
      )}
    >
      {marker && <span className="data-num font-bold opacity-70">{marker}</span>}
      {children}
    </span>
  );
}
