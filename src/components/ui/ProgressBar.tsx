import clsx from "clsx";

/**
 * Progress as countable segments rather than one sliding fill: "3 of 10" is
 * readable at a glance without any animation, which a smooth bar can only
 * convey by moving. Pass `segments` for course progress, omit it for a
 * continuous percentage (a quiz being filled in, say).
 */
export function ProgressBar({
  value,
  className,
  label,
  segments,
  tone = "brand",
}: {
  value: number; // 0-100
  className?: string;
  label?: string;
  segments?: number;
  tone?: "brand" | "emerald" | "amber";
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const fills = {
    brand: "bg-brand-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  };
  const filled = segments ? Math.round((clamped / 100) * segments) : 0;

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="truncate">{label}</span>
          <span className="data-num shrink-0 font-semibold">
            {segments ? `${filled}/${segments}` : `${Math.round(clamped)}%`}
          </span>
        </div>
      )}

      {segments ? (
        <div className="flex gap-1" role="img" aria-label={`${filled}/${segments}`}>
          {Array.from({ length: segments }).map((_, i) => (
            <span
              key={i}
              className={clsx(
                "h-2.5 flex-1 rounded-sm",
                i < filled ? fills[tone] : "bg-slate-200 dark:bg-white/10"
              )}
            />
          ))}
        </div>
      ) : (
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className={clsx("h-full rounded-full", fills[tone])} style={{ width: `${clamped}%` }} />
        </div>
      )}
    </div>
  );
}
