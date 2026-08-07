import clsx from "clsx";

/**
 * Loading placeholder without a spinner or shimmer. The waiting state is
 * carried by a text label plus neutral blocks that match the shape of what is
 * coming, so nothing on the page moves while it loads.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx("rounded-lg bg-slate-200/70 dark:bg-white/10", className)}
      aria-hidden
    />
  );
}

export function LoadingBlock({
  label = "Жүктелуде…",
  lines = 3,
  className,
}: {
  label?: string;
  lines?: number;
  className?: string;
}) {
  return (
    <div className={clsx("surface-sunken p-5", className)} role="status" aria-live="polite">
      <p className="text-label uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-3 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={clsx("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
        ))}
      </div>
    </div>
  );
}
