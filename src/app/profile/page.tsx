"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/lib/authStore";
import { Mail, Users, Calendar, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-h1 text-white">
            {user?.fullName?.charAt(0) ?? "?"}
          </div>
          <div>
            <h1 className="text-h2">{user?.fullName}</h1>
            <p className="text-body text-slate-600 dark:text-slate-400">{user?.role === "teacher" ? "Оқытушы" : "Студент"}</p>
          </div>
        </Card>

        <Card className="space-y-3">
          <p className="flex items-center gap-2 text-sm"><Mail size={16} className="text-slate-500" /> {user?.email}</p>
          {user?.group && <p className="flex items-center gap-2 text-sm"><Users size={16} className="text-slate-500" /> Топ: {user.group}</p>}
          <p className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-slate-500" /> Тіркелген күні: {user ? new Date(user.createdAt).toLocaleDateString("kk-KZ") : "-"}
          </p>
        </Card>

        {user?.badges && (
          <Card>
            <p className="mb-2 font-semibold">Жетістіктер мен бейджтер</p>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((b) => (
                <Badge key={b} variant="default">{b}</Badge>
              ))}
            </div>
          </Card>
        )}

        <button
          onClick={() => {
            setUser(null);
            router.push("/login");
          }}
          className="btn-secondary w-full text-rose-600"
        >
          <LogOut size={16} /> Жүйеден шығу
        </button>
      </div>
    </DashboardShell>
  );
}
