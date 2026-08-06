"use client";

import { useState } from "react";
import { RUBRIC_CRITERIA, RUBRIC_LEVEL_LABELS, averageRubricLevel, rubricLevelToPercent } from "@/lib/competency";
import { useAuthStore } from "@/lib/authStore";
import { saveCompetencyAssessment, generateId } from "@/lib/dataStore";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { RubricCriterionScore } from "@/lib/types";

export function RubricAssessment({ moduleId }: { moduleId: number }) {
  const user = useAuthStore((s) => s.user);
  const [scores, setScores] = useState<Record<string, 1 | 2 | 3 | 4 | 5>>({});
  const [saved, setSaved] = useState(false);

  const complete = Object.keys(scores).length === RUBRIC_CRITERIA.length;
  const scoreList: RubricCriterionScore[] = RUBRIC_CRITERIA.map((c) => ({
    criterion: c.key,
    level: scores[c.key] ?? 1,
  }));
  const avg = complete ? averageRubricLevel(scoreList) : 0;
  const percent = rubricLevelToPercent(avg);

  async function handleSave() {
    if (!user) return;
    await saveCompetencyAssessment({
      id: generateId("assess"),
      userId: user.uid,
      moduleId,
      scores: scoreList,
      averageLevel: avg,
      percent,
      assessedAt: new Date().toISOString(),
      assessorType: "self",
    });
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Өзіңді әр критерий бойынша 1-ден 5-ке дейін бағала. Бұл бағалау сенің құзыреттілік профиліңе қосылады.
      </p>
      {RUBRIC_CRITERIA.map((c) => (
        <div key={c.key} className="glass-card">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="font-semibold">{c.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{c.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {([1, 2, 3, 4, 5] as const).map((level) => (
              <button
                key={level}
                onClick={() => setScores((s) => ({ ...s, [c.key]: level }))}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  scores[c.key] === level
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-slate-200 hover:border-brand-300 dark:border-white/10"
                }`}
              >
                {level} · {RUBRIC_LEVEL_LABELS[level].split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      ))}

      {complete && (
        <div className="glass-card">
          <p className="mb-2 font-semibold">Жалпы құзыреттілік деңгейі: {RUBRIC_LEVEL_LABELS[Math.round(avg) as 1|2|3|4|5]}</p>
          <ProgressBar value={percent} label="Пайыздық көрсеткіш" />
          <button onClick={handleSave} className="btn-primary mt-3 text-sm" disabled={saved}>
            {saved ? "Сақталды ✓" : "Бағалауды сақтау"}
          </button>
        </div>
      )}
    </div>
  );
}
