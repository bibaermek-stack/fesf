import { NextRequest, NextResponse } from "next/server";
import { runAiTask, type AiRequest } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as AiRequest;
  if (!body?.task) {
    return NextResponse.json({ error: "task өрісі міндетті" }, { status: 400 });
  }
  const reply = await runAiTask(body);
  return NextResponse.json({ reply });
}
