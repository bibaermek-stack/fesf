"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, Loader2 } from "lucide-react";
import { askAi } from "@/lib/aiClient";
import type { AiTaskType } from "@/lib/ai";
import type { AiChatMessage } from "@/lib/types";

const QUICK_ACTIONS: { task: AiTaskType; label: string }[] = [
  { task: "explain", label: "Тақырыпты түсіндір" },
  { task: "summarize", label: "Дәрісті қорытында" },
  { task: "example", label: "Мысал бер" },
  { task: "practice-questions", label: "Жаттығу сұрақтары" },
  { task: "formula-explain", label: "Формуланы түсіндір" },
  { task: "motivate", label: "Мені ынталандыр" },
  { task: "misconception", label: "Жиі қателерді көрсет" },
  { task: "recommendation", label: "Жеке ұсыныс бер" },
];

export function AiTutorWidget({ topic }: { topic?: string }) {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Сәлем! Мен сенің AI тьюторыңмын. ${
        topic ? `"${topic}" тақырыбы` : "Механика пәні"
      } бойынша сұрағың болса, жаз немесе төмендегі жылдам әрекеттерді пайдалан.`,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(task: AiTaskType, userMessage?: string) {
    const userMsg: AiChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: userMessage ?? QUICK_ACTIONS.find((a) => a.task === task)?.label ?? "Сұрақ",
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    const reply = await askAi({ task, topic, userMessage });
    setMessages((m) => [
      ...m,
      { id: `a-${Date.now()}`, role: "assistant", content: reply, createdAt: new Date().toISOString() },
    ]);
    setLoading(false);
  }

  return (
    <div className="flex h-[32rem] flex-col overflow-hidden rounded-xl2 border border-slate-200/60 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/40">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-brand-500 to-indigo-600 p-4 text-white dark:border-white/10">
        <Bot size={20} />
        <div>
          <p className="font-semibold">AI Тьютор</p>
          <p className="text-xs text-white/80">Механика бойынша жеке көмекші, тек қазақ тілінде жауап береді</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-brand-500 text-white"
                  : "bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-micro text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> AI жауап жазып жатыр…
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-slate-100 p-2 dark:border-white/10">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.task}
            onClick={() => sendMessage(a.task)}
            disabled={loading}
            className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-brand-50 dark:bg-white/5 dark:text-slate-300"
          >
            <Sparkles size={11} /> {a.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) sendMessage("qa", input.trim());
        }}
        className="flex items-center gap-2 border-t border-slate-100 p-3 dark:border-white/10"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Сұрағыңды осында жаз..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-white/10 dark:bg-white/5"
        />
        <button type="submit" disabled={loading} className="btn-primary !px-3 !py-2">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
