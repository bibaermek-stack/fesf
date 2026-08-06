"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chrome, LogIn } from "lucide-react";
import { useAuthStore, DEMO_STUDENT, DEMO_TEACHER } from "@/lib/authStore";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [role, setRole] = useState<"student" | "teacher">("student");

  function handleDemoLogin() {
    setUser(role === "student" ? DEMO_STUDENT : DEMO_TEACHER);
    router.push(role === "student" ? "/dashboard" : "/teacher");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-xl font-bold text-white">М</div>
          <h1 className="text-xl font-bold">Механика AI LMS-ке кіру</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isFirebaseConfigured ? "Оқу платформасына кіріңіз" : "Демо режим — нақты тіркелгі қажет емес"}
          </p>
        </div>

        <div className="mb-4 flex rounded-xl bg-slate-100 p-1 dark:bg-white/5">
          <button
            onClick={() => setRole("student")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              role === "student" ? "bg-white shadow dark:bg-slate-700" : "text-slate-500"
            }`}
          >
            Студент
          </button>
          <button
            onClick={() => setRole("teacher")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              role === "teacher" ? "bg-white shadow dark:bg-slate-700" : "text-slate-500"
            }`}
          >
            Оқытушы
          </button>
        </div>

        <button onClick={handleDemoLogin} className="btn-primary w-full">
          <LogIn size={16} /> {role === "student" ? "Студент ретінде кіру" : "Оқытушы ретінде кіру"}
        </button>

        <button className="btn-secondary mt-3 w-full" onClick={handleDemoLogin}>
          <Chrome size={16} /> Google аркылы кіру
        </button>

        <p className="mt-4 text-center text-xs text-slate-400">
          Google Login толық іске қосу үшін .env.local файлында GOOGLE_CLIENT_ID мәнін орнатыңыз.
        </p>
      </div>
    </div>
  );
}
