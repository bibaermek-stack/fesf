"use client";

import { useEffect, useState } from "react";

/**
 * Tracks `prefers-reduced-motion` live, so ambient loops and 3D scenes can be
 * stood down without a reload. Framer Motion ships its own hook, but this one
 * is also consumed by plain canvas/WebGL code that never mounts a motion
 * component, so the whole app reads one source of truth.
 *
 * Starts `false` so server and first client render agree; the effect corrects
 * it before paint-critical animation begins.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
