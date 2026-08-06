"use client";

import { useParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function VerifyCertificatePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card max-w-md text-center">
        <ShieldCheck className="mx-auto mb-3 text-emerald-500" size={48} />
        <h1 className="text-xl font-bold">Сертификат расталды</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Сертификат ID: <span className="font-mono">{id}</span>
        </p>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Бұл сертификат Механика AI LMS платформасы арқылы расталған және жарамды болып табылады.
        </p>
      </div>
    </div>
  );
}
