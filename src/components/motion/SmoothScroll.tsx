"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Lenis-driven inertial scrolling.
 *
 * Skipped entirely under reduced motion — hijacking the scroll wheel is
 * exactly the kind of motion that setting exists to opt out of. Also skipped
 * when the pointer is coarse (touch), where the OS already provides momentum
 * and Lenis just fights it.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Gentle exponential ease-out; long tail without feeling floaty.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
