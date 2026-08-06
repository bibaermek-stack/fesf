"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";

export function SpinWheelGame({
  questions,
  onComplete,
}: {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [current, setCurrent] = useState<QuizQuestion | null>(null);
  const [answered, setAnswered] = useState<Record<string, boolean>>({});
  const colors = ["#3366ff", "#1a39b8", "#5c8dff", "#1f47e6", "#8fb4ff", "#1a3391"];
  const slice = 360 / questions.length;

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setCurrent(null);
    const pickedIndex = Math.floor(Math.random() * questions.length);
    const targetRotation = 360 * 4 + pickedIndex * slice + slice / 2;
    setRotation((r) => r + targetRotation);
    setTimeout(() => {
      setSpinning(false);
      setCurrent(questions[pickedIndex]);
    }, 2200);
  }

  function handleAnswer(q: QuizQuestion, i: number) {
    const correct = i === q.correctIndex;
    const next = { ...answered, [q.id]: correct };
    setAnswered(next);
    const correctCount = Object.values(next).filter(Boolean).length;
    onComplete(Math.round((correctCount / questions.length) * 100));
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-56 w-56">
        <div
          className="h-full w-full rounded-full border-4 border-brand-600 shadow-lg transition-transform duration-[2200ms] ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${questions
              .map((_, i) => `${colors[i % colors.length]} ${i * slice}deg ${(i + 1) * slice}deg`)
              .join(", ")})`,
          }}
        />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1 text-2xl">🔻</div>
      </div>
      <button onClick={spin} disabled={spinning} className="btn-primary">
        {spinning ? "Айналуда..." : "Дөңгелекті айналдыру"}
      </button>

      {current && !spinning && (
        <div className="glass-card w-full max-w-md space-y-3">
          <p className="font-semibold">{current.question}</p>
          <div className="grid gap-2">
            {current.options.map((opt, i) => (
              <button
                key={i}
                disabled={answered[current.id] !== undefined}
                onClick={() => handleAnswer(current, i)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-left text-sm hover:border-brand-300 dark:border-white/10"
              >
                {opt}
              </button>
            ))}
          </div>
          {answered[current.id] !== undefined && (
            <p className={answered[current.id] ? "text-emerald-600" : "text-rose-600"}>
              {answered[current.id] ? "✅ Дұрыс жауап!" : "❌ Қате жауап. Түсіндірме: " + current.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
