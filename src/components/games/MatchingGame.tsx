"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { shuffle } from "@/data/modules";
import type { GamePair } from "@/lib/types";

export function MatchingGame({
  pairs,
  onComplete,
}: {
  pairs: GamePair[];
  onComplete: (score: number) => void;
}) {
  const leftItems = useMemo(() => pairs.map((p) => p.left), [pairs]);
  const rightItems = useMemo(() => shuffle(pairs.map((p) => p.right)), [pairs]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const isDone = Object.keys(matched).length === pairs.length;

  function handleRightClick(right: string) {
    if (!selectedLeft) return;
    const correctPair = pairs.find((p) => p.left === selectedLeft);
    if (correctPair?.right === right) {
      const next = { ...matched, [selectedLeft]: right };
      setMatched(next);
      setSelectedLeft(null);
      if (Object.keys(next).length === pairs.length) {
        onComplete(100);
      }
    } else {
      setWrongFlash(right);
      setTimeout(() => setWrongFlash(null), 500);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        {leftItems.map((left) => {
          const isMatched = !!matched[left];
          return (
            <button
              key={left}
              disabled={isMatched}
              onClick={() => setSelectedLeft(left)}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                isMatched
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200"
                  : selectedLeft === left
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                  : "border-slate-200 hover:border-brand-300 dark:border-white/10"
              }`}
            >
              {left}
              {isMatched && <CheckCircle2 size={16} />}
            </button>
          );
        })}
      </div>
      <div className="space-y-2">
        {rightItems.map((right) => {
          const isUsed = Object.values(matched).includes(right);
          return (
            <button
              key={right}
              disabled={isUsed}
              onClick={() => handleRightClick(right)}
              className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                isUsed
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 opacity-60 dark:bg-emerald-900/20 dark:text-emerald-200"
                  : wrongFlash === right
                  ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20"
                  : "border-slate-200 hover:border-brand-300 dark:border-white/10"
              }`}
            >
              {right}
            </button>
          );
        })}
      </div>
      {isDone && (
        <p className="col-span-full rounded-xl bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
          🎉 Керемет! Барлық жұптарды дұрыс сәйкестендірдіңіз.
        </p>
      )}
    </div>
  );
}
