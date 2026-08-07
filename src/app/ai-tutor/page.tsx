import { DashboardShell } from "@/components/layout/DashboardShell";
import { AiTutorWidget } from "@/components/ai/AiTutorWidget";

export default function AiTutorPage() {
  return (
    <DashboardShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-h1">AI Тьютор</h1>
          <p className="text-body text-slate-600 dark:text-slate-400">
            Механика бойынша кез келген сұрағыңды қой — жасанды интеллект қазақ тілінде түсіндіреді.
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <AiTutorWidget />
        </div>
      </div>
    </DashboardShell>
  );
}
