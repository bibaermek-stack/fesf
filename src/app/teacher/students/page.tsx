import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/Badge";

const STUDENTS = [
  { name: "Айгерім Болатқызы", group: "МТ-21", progress: 68, competency: 74, status: "Белсенді" },
  { name: "Динара Нұрланқызы", group: "МТ-21", progress: 95, competency: 92, status: "Белсенді" },
  { name: "Ерасыл Тоқтарұлы", group: "МТ-22", progress: 88, competency: 88, status: "Белсенді" },
  { name: "Мадина Сәрсенқызы", group: "МТ-21", progress: 52, competency: 71, status: "Пассивті" },
  { name: "Асхат Жомартұлы", group: "МТ-22", progress: 40, competency: 65, status: "Пассивті" },
];

export default function TeacherStudentsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Студенттерді басқару</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Барлық студенттердің прогресі мен құзыреттілігі.</p>
        </div>
        <div className="overflow-hidden rounded-xl2 border border-slate-200/60 dark:border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Студент</th>
                <th className="px-4 py-3">Топ</th>
                <th className="px-4 py-3">Прогресс</th>
                <th className="px-4 py-3">Құзыреттілік</th>
                <th className="px-4 py-3">Мәртебе</th>
              </tr>
            </thead>
            <tbody>
              {STUDENTS.map((s) => (
                <tr key={s.name} className="border-t border-slate-100 dark:border-white/5">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{s.group}</td>
                  <td className="px-4 py-3">{s.progress}%</td>
                  <td className="px-4 py-3">{s.competency}%</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.status === "Белсенді" ? "success" : "warning"}>{s.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
