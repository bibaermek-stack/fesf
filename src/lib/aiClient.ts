"use client";
import type { AiTaskType } from "./ai";

export async function askAi(params: {
  task: AiTaskType;
  topic?: string;
  userMessage?: string;
  context?: string;
}): Promise<string> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    return json.reply ?? "Кешіріңіз, жауап алынбады. Қайталап көріңіз.";
  } catch {
    return "Желі қатесі. Интернет байланысын тексеріп, қайталап көріңіз.";
  }
}
