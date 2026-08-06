"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import type { LessonModule } from "@/lib/types";
import { useAuthStore } from "@/lib/authStore";
import { saveGameResult, generateId } from "@/lib/dataStore";
import { MatchingGame } from "./MatchingGame";
import { DragDropGame } from "./DragDropGame";
import { MemoryGame } from "./MemoryGame";
import { FlashCardsGame } from "./FlashCardsGame";
import { SpinWheelGame } from "./SpinWheelGame";

const MODE_LABELS: Record<string, string> = {
  matching: "Сәйкестендіру ойыны",
  memory: "Жады карточкалары",
  flashcards: "Флэш-карточкалар",
  dragdrop: "Сүйреп апару ойыны",
  spinwheel: "Айналмалы дөңгелек",
};

export function GameRouter({ mod }: { mod: LessonModule }) {
  const user = useAuthStore((s) => s.user);
  const availableModes = ["matching", "memory", "flashcards", "dragdrop", "spinwheel"] as const;
  const [mode, setMode] = useState<(typeof availableModes)[number]>(
    (mod.game.type as any) === "dragdrop" ? "dragdrop" : "matching"
  );
  const [lastScore, setLastScore] = useState<number | null>(null);

  async function handleComplete(score: number) {
    setLastScore(score);
    if (!user) return;
    await saveGameResult({
      id: generateId("game"),
      moduleId: mod.id,
      userId: user.uid,
      gameType: mode as any,
      score,
      completedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {availableModes.map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setLastScore(null);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              mode === m
                ? "bg-brand-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-brand-50 dark:bg-white/5 dark:text-slate-300"
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">{mod.game.instructions}</p>

      {mode === "matching" && mod.game.pairs && (
        <MatchingGame key={`matching-${mod.id}`} pairs={mod.game.pairs} onComplete={handleComplete} />
      )}
      {mode === "dragdrop" && mod.game.pairs && (
        <DragDropGame key={`dragdrop-${mod.id}`} pairs={mod.game.pairs} onComplete={handleComplete} />
      )}
      {mode === "memory" && mod.game.pairs && (
        <MemoryGame key={`memory-${mod.id}`} pairs={mod.game.pairs} onComplete={handleComplete} />
      )}
      {mode === "flashcards" && (
        <FlashCardsGame key={`flash-${mod.id}`} terms={mod.glossary} onComplete={handleComplete} />
      )}
      {mode === "spinwheel" && (
        <SpinWheelGame key={`wheel-${mod.id}`} questions={mod.quiz.slice(0, 6)} onComplete={handleComplete} />
      )}

      {lastScore !== null && (
        <div className="glass-card flex items-center gap-3">
          <Trophy className="text-amber-500" />
          <p className="text-sm font-semibold">Ойын нәтижесі: {lastScore} / 100 ұпай. Ұпай құзыреттілік бағасына қосылады.</p>
        </div>
      )}
    </div>
  );
}
