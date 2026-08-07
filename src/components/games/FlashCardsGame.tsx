"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import type { GlossaryTerm } from "@/lib/types";

export function FlashCardsGame({
  terms,
  onComplete,
}: {
  terms: GlossaryTerm[];
  onComplete: (score: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set());

  function markSeen(i: number) {
    const next = new Set(seen);
    next.add(i);
    setSeen(next);
    if (next.size === terms.length) onComplete(100);
  }

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => {
      const next = (i + delta + terms.length) % terms.length;
      return next;
    });
  }

  const current = terms[index];

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => {
          setFlipped((f) => !f);
          markSeen(index);
        }}
        className="surface-card flex h-48 w-full max-w-md cursor-pointer items-center justify-center p-6 text-center transition-colors hover:border-brand-300"
      >
        <p className={flipped ? "text-body text-slate-600 dark:text-slate-300" : "text-h2"}>
          {flipped ? current.definition : current.term}
        </p>
      </button>
      <div className="flex items-center gap-3">
        <button onClick={() => go(-1)} className="btn-secondary !px-3 !py-2">
          <ChevronLeft size={16} />
        </button>
        <span className="text-micro text-slate-600 dark:text-slate-400">
          {index + 1} / {terms.length} • Көрілгені: {seen.size}
        </span>
        <button onClick={() => go(1)} className="btn-secondary !px-3 !py-2">
          <ChevronRight size={16} />
        </button>
        <button onClick={() => setFlipped((f) => !f)} className="btn-secondary !px-3 !py-2">
          <RefreshCw size={16} />
        </button>
      </div>
      {seen.size === terms.length && (
        <p className="rounded-xl bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
          Барлық карточкаларды қарап шықтыңыз!
        </p>
      )}
    </div>
  );
}
