"use client";

import { useEffect, useState } from "react";

/**
 * Chart.js colours for the current theme.
 *
 * Chart.js paints to a canvas, so it cannot inherit CSS — every axis, grid line
 * and label colour has to be handed to it explicitly. On the dark shell the
 * library's defaults (near-black text, a white tick backdrop) are invisible or
 * worse, which is what left the radar's 1–5 ticks sitting in little white
 * boxes.
 *
 * Watches the `dark` class on <html> so flipping the theme repaints the charts
 * without a reload.
 */
export interface ChartTheme {
  dark: boolean;
  text: string;
  textMuted: string;
  grid: string;
  gridStrong: string;
  tooltipBg: string;
  tooltipText: string;
  /** Bumped whenever the theme flips; use as a React key to force a redraw. */
  version: number;
}

const LIGHT: Omit<ChartTheme, "version" | "dark"> = {
  text: "#334155",
  textMuted: "#64748b",
  grid: "rgba(148,163,184,0.25)",
  gridStrong: "rgba(100,116,139,0.4)",
  tooltipBg: "rgba(15,23,42,0.94)",
  tooltipText: "#f8fafc",
};

const DARK: Omit<ChartTheme, "version" | "dark"> = {
  text: "#cbd5e1",
  textMuted: "#94a3b8",
  grid: "rgba(148,163,184,0.16)",
  gridStrong: "rgba(203,213,225,0.28)",
  tooltipBg: "rgba(2,6,23,0.94)",
  tooltipText: "#f8fafc",
};

export function useChartTheme(): ChartTheme {
  const [dark, setDark] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const read = () => document.documentElement.classList.contains("dark");
    setDark(read());

    const mo = new MutationObserver(() => {
      setDark((prev) => {
        const next = read();
        if (next !== prev) setVersion((v) => v + 1);
        return next;
      });
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  return { dark, version, ...(dark ? DARK : LIGHT) };
}
