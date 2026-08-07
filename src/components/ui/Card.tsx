import clsx from "clsx";

/**
 * The one panel used across the app. Depth comes from a solid fill, a hairline
 * border and a soft shadow — see `.surface` in globals.css for why blur was
 * dropped.
 */
export function Card({
  children,
  className,
  padded = true,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  /** `sunken` for inset data areas, `raised` for popovers. */
  tone?: "default" | "sunken" | "raised";
}) {
  const base =
    tone === "sunken" ? "surface-sunken" : tone === "raised" ? "surface-raised" : "surface";
  return <div className={clsx(base, padded && "p-5", className)}>{children}</div>;
}
