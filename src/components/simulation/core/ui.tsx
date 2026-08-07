"use client";

// HUD building blocks for the simulations: transport bar, sliders, segmented
// switches, readout cards and energy bars. All labels are Kazakh.

import clsx from "clsx";
import { Pause, Play, RotateCcw, Gauge } from "lucide-react";
import type { SimEngine } from "./useSimEngine";

export function PlayBar<S>({
  engine,
  speeds = [0.25, 0.5, 1, 2],
}: {
  engine: SimEngine<S>;
  speeds?: number[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={engine.toggle}
          className={clsx(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors",
            engine.playing
              ? "bg-slate-700 hover:bg-slate-800"
              : "bg-brand-500 hover:bg-brand-600"
          )}
        >
          {engine.playing ? <Pause size={15} /> : <Play size={15} />}
          {engine.playing ? "Кідірту" : "Бастау"}
        </button>
        <button
          onClick={engine.reset}
          title="Қайта бастау"
          aria-label="Қайта бастау"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 p-2.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <div className="flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 dark:bg-white/5">
        <Gauge size={13} className="ml-1.5 mr-0.5 shrink-0 text-slate-500" />
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => engine.setSpeed(s)}
            className={clsx(
              "flex-1 rounded-lg px-2 py-1 text-xs font-semibold transition-colors",
              engine.speed === s
                ? "bg-white text-brand-600 shadow-sm dark:bg-brand-500 dark:text-white"
                : "text-slate-500 hover:bg-white/70 dark:text-slate-400 dark:hover:bg-white/10"
            )}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}

export function Slider({
  label,
  unit,
  value,
  min,
  max,
  step = 0.01,
  decimals = 2,
  onChange,
  hint,
}: {
  label: string;
  unit?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  decimals?: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  // The track is filled up to the current value, so the slider reads as a gauge.
  const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
        <span className="truncate">{label}</span>
        <span className="shrink-0 rounded-md bg-brand-50 px-1.5 py-0.5 font-mono text-[11px] font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          {value.toFixed(decimals)}
          {unit ? ` ${unit}` : ""}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--fill" as string]: `${fill}%` }}
        className="sim-range mt-2 w-full cursor-pointer"
      />
      {hint && <span className="mt-1.5 block text-[10px] leading-snug text-slate-500">{hint}</span>}
    </label>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={clsx(
              "flex-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
              value === o.value
                ? "bg-brand-500 text-white shadow"
                : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={clsx(
        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
        checked
          ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
          : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400"
      )}
    >
      <span>{label}</span>
      <span
        className={clsx(
          "relative h-4 w-8 rounded-full transition-colors",
          checked ? "bg-brand-500" : "bg-slate-300 dark:bg-white/20"
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 h-3 w-3 rounded-full bg-white",
            checked ? "left-[18px]" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}

export function Readout({
  items,
}: {
  items: { label: string; value: string; unit?: string; tone?: "brand" | "amber" | "emerald" | "rose" | "slate" }[];
}) {
  // Each card carries a coloured spine so related quantities group visually.
  const tones: Record<string, { text: string; spine: string }> = {
    brand: { text: "text-brand-700 dark:text-brand-300", spine: "bg-brand-500" },
    amber: { text: "text-amber-700 dark:text-amber-400", spine: "bg-amber-500" },
    emerald: { text: "text-emerald-700 dark:text-emerald-400", spine: "bg-emerald-500" },
    rose: { text: "text-rose-700 dark:text-rose-400", spine: "bg-rose-500" },
    slate: { text: "text-slate-700 dark:text-slate-200", spine: "bg-slate-300 dark:bg-white/20" },
  };
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => {
        const tone = tones[it.tone ?? "slate"];
        return (
          <div
            key={it.label}
            className="relative overflow-hidden rounded-xl bg-slate-50 py-2 pl-3.5 pr-2.5 ring-1 ring-inset ring-slate-900/5 dark:bg-white/5 dark:ring-white/10"
          >
            <span className={clsx("absolute inset-y-1.5 left-1 w-0.5 rounded-full", tone.spine)} />
            <p className="truncate text-label uppercase text-slate-500 dark:text-slate-400">
              {it.label}
            </p>
            <p className={clsx("font-mono text-[15px] font-bold tabular-nums leading-tight", tone.text)}>
              {it.value}
              {it.unit && (
                <span className="ml-0.5 text-[10px] font-medium opacity-80">{it.unit}</span>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function BarMeter({
  items,
  max,
  unit = "Дж",
}: {
  items: { label: string; value: number; color: string }[];
  max: number;
  unit?: string;
}) {
  const safeMax = max > 1e-9 ? max : 1;
  return (
    <div className="space-y-2.5">
      {items.map((it) => (
        <div key={it.label}>
          <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: it.color }}
              />
              <span className="truncate">{it.label}</span>
            </span>
            <span className="shrink-0 font-mono tabular-nums text-slate-600 dark:text-slate-300">
              {it.value.toFixed(3)}
              {unit && <span className="ml-0.5 opacity-60">{unit}</span>}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
            <div
              className="h-full rounded-full transition-[width]"
              style={{
                width: `${Math.min(100, Math.max(0, (it.value / safeMax) * 100))}%`,
                background: `linear-gradient(90deg, ${it.color}bb, ${it.color})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Panel({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "surface p-4",
        className
      )}
    >
      {title && (
        <p className="mb-3 flex items-center gap-2 text-label uppercase text-slate-500 dark:text-slate-400">
          <span className="h-3 w-0.5 rounded-full bg-brand-400" />
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

export function Formula({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-brand-50 px-3 py-2 text-center font-mono text-xs text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
      {children}
    </p>
  );
}

export function fmt(v: number, decimals = 2): string {
  if (!Number.isFinite(v)) return "—";
  if (Math.abs(v) < 10 ** -decimals / 2) return (0).toFixed(decimals);
  return v.toFixed(decimals);
}
