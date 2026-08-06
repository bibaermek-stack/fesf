"use client";

import { useState } from "react";
import { FileText, Image as ImageIcon, FileUp, Video, Mic, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { submitAssignment, generateId } from "@/lib/dataStore";
import type { AssignmentSubmission, BOZhAssignment } from "@/lib/types";

const TYPE_ICONS = {
  text: FileText,
  image: ImageIcon,
  pdf: FileUp,
  video: Video,
  voice: Mic,
};

const TYPE_LABELS: Record<AssignmentSubmission["type"], string> = {
  text: "Мәтін",
  image: "Сурет",
  pdf: "PDF құжат",
  video: "Бейне",
  voice: "Дауыс",
};

export function BOZhSubmissionForm({ moduleId, assignment }: { moduleId: number; assignment: BOZhAssignment }) {
  const user = useAuthStore((s) => s.user);
  const [type, setType] = useState<AssignmentSubmission["type"]>(assignment.submissionTypes[0]);
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!user || !content.trim()) return;
    await submitAssignment({
      id: generateId("sub"),
      moduleId,
      userId: user.uid,
      type,
      content,
      submittedAt: new Date().toISOString(),
      status: "pending",
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="glass-card flex items-center gap-3">
        <CheckCircle2 className="text-emerald-500" />
        <p className="text-sm">
          Тапсырмаң сәтті жіберілді! Оқытушы тексеріп, кері байланыс қалдырғанда хабарландыру аласың.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass-card">
        <p className="font-semibold">Жағдаят (кейс)</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{assignment.scenario}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {assignment.tasks.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {assignment.submissionTypes.map((t) => {
          const Icon = TYPE_ICONS[t];
          return (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                type === t ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300"
              }`}
            >
              <Icon size={14} /> {TYPE_LABELS[t]}
            </button>
          );
        })}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        placeholder={
          type === "text"
            ? "Шешіміңді осында жаз (күштер талдауы, есептеулер, қорытынды)..."
            : "Файл сілтемесін немесе сипаттамасын осында жаз (демо режимде нақты жүктеу өшірілген)..."
        }
        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-brand-400 dark:border-white/10 dark:bg-white/5"
      />

      <button onClick={handleSubmit} disabled={!content.trim()} className="btn-primary">
        Тапсырманы жіберу
      </button>
    </div>
  );
}
