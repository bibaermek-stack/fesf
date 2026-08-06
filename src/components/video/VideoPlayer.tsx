"use client";

import { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function VideoPlayer({
  youtubeId,
  title,
  description,
  durationMinutes,
}: {
  youtubeId: string;
  title: string;
  description: string;
  durationMinutes: number;
}) {
  const [watched, setWatched] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="overflow-hidden rounded-xl2 border border-slate-200/60 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/40">
      <div className="relative aspect-video w-full bg-black">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setProgress(30)}
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          </div>
          {watched && (
            <span className="badge shrink-0 !bg-emerald-100 !text-emerald-700 dark:!bg-emerald-900/40 dark:!text-emerald-200">
              <CheckCircle2 size={14} /> Аяқталды
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Clock size={14} />
          <span>Ұзақтығы: {durationMinutes} мин</span>
        </div>
        <ProgressBar value={progress} label="Дәрісті көру барысы" />
        {!watched && (
          <button
            className="btn-secondary text-sm"
            onClick={() => {
              setProgress(100);
              setWatched(true);
            }}
          >
            Дәрісті аяқталды деп белгілеу
          </button>
        )}
      </div>
    </div>
  );
}
