"use client";

import { ParticleField } from "./ParticleField";

/**
 * The ambient layer every page sits on: aurora blobs, a masked grid, light
 * rays and a particle field.
 *
 * Mounted once in the root layout and fixed to the viewport, so navigating
 * between routes never re-creates it — the background stays continuous while
 * page content transitions over the top of it. Everything here is
 * `pointer-events: none` and animates transform/opacity only, which keeps it
 * on the compositor rather than triggering layout.
 */
export function SceneBackground({ variant = "app" }: { variant?: "app" | "hero" }) {
  const showRays = variant === "hero";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash: deep space on dark, barely-there tint on light */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#05070f]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(51,102,255,0.10),transparent_60%)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(51,102,255,0.22),transparent_62%)]" />

      {/* Aurora blobs — three, on different timings so they never sync up */}
      <div
        className="aurora-blob animate-drift left-[-12%] top-[-14%] h-[46vw] w-[46vw] bg-brand-500/40 dark:bg-brand-500/50"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="aurora-blob animate-drift-slow right-[-14%] top-[6%] h-[42vw] w-[42vw] bg-violet-500/35 dark:bg-violet-500/45"
        style={{ animationDelay: "-7s" }}
      />
      <div
        className="aurora-blob animate-drift bottom-[-18%] left-[22%] h-[40vw] w-[40vw] bg-cyan-500/25 dark:bg-cyan-500/35"
        style={{ animationDelay: "-14s" }}
      />

      {/* Grid, faded out toward the bottom by the mask in globals.css */}
      <div className="bg-grid-lines absolute inset-0 opacity-70 dark:opacity-100" />

      {showRays && <div className="light-rays absolute inset-x-0 top-0 h-[70vh]" />}

      <ParticleField density={variant === "hero" ? 0.00011 : 0.00006} />

      {/* Vignette so page content always wins the contrast fight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_40%,transparent_55%,rgba(2,6,23,0.35)_100%)] dark:bg-[radial-gradient(ellipse_100%_70%_at_50%_40%,transparent_45%,rgba(2,6,23,0.75)_100%)]" />
    </div>
  );
}
