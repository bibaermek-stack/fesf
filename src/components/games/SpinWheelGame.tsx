"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";

/**
 * Random-question picker. This was a spinning wheel; the rotation carried no
 * information the result did not, so the wheel is now a numbered board — the
 * drawn number is marked, and every question's state (unanswered / correct /
 * wrong) stays visible at once, which the wheel could never show.
 *
 * The component name is unchanged so the game router keeps resolving it.
 */
export function SpinWheelGame({
  questions,
  onComplete,
}: {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}) {
  const [current, setCurrent] = useState<number | null>(null);
  const [answered, setAnswered] = useState<Record<string, boolean>>({});

  const remaining = questions.filter((q) => answered[q.id] === undefined);
  const correctCount = Object.values(answered).filter(Boolean).length;

  function draw() {
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrent(questions.findIndex((q) => q.id === pick.id));
  }

  function handleAnswer(q: QuizQuestion, i: number) {
    const next = { ...answered, [q.id]: i === q.correctIndex };
    setAnswered(next);
    onComplete(
      Math.round((Object.values(next).filter(Boolean).length / questions.length) * 100)
    );
  }

  const question = current !== null ? questions[current] : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {questions.map((q, i) => {
            const state = answered[q.id];
            return (
              <span
                key={q.id}
                className={[
                  "data-num flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold",
                  state === true
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-900/30 dark:text-emerald-200"
                    : state === false
                    ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-900/30 dark:text-rose-200"
                    : current === i
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400",
                ].join(" ")}
              >
                {i + 1}
              </span>
            );
          })}
        </div>
        <span className="data-num text-body font-semibold text-slate-600 dark:text-slate-300">
          {correctCount} / {questions.length}
        </span>
      </div>

      <button onClick={draw} disabled={remaining.length === 0} className="btn-primary">
        <Shuffle size={16} />
        {remaining.length === 0 ? "Барлық сұрақ өтілді" : "Кездейсоқ сұрақ таңдау"}
      </button>

      {question && (
        <div className="surface-card space-y-3">
          <p className="text-label uppercase text-slate-500 dark:text-slate-400">
            {(current ?? 0) + 1}-сұрақ
          </p>
          <p className="text-h3">{question.question}</p>
          <div className="grid gap-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                disabled={answered[question.id] !== undefined}
                onClick={() => handleAnswer(question, i)}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-left text-body transition-colors hover:border-brand-300 hover:bg-brand-50/50 disabled:hover:border-slate-200 disabled:hover:bg-transparent dark:border-white/10 dark:hover:bg-white/5"
              >
                {opt}
              </button>
            ))}
          </div>
          {answered[question.id] !== undefined && (
            <p
              className={
                answered[question.id]
                  ? "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-body font-semibold text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-900/25 dark:text-emerald-200"
                  : "rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-body text-rose-700 dark:border-rose-400/25 dark:bg-rose-900/25 dark:text-rose-200"
              }
            >
              {answered[question.id]
                ? "Дұрыс жауап."
                : `Қате жауап. Түсіндірме: ${question.explanation}`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
