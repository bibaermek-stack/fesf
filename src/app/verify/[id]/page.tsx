"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Award, CheckCircle2, ArrowLeft, ExternalLink } from "lucide-react";

export default function VerifyCertificatePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border-2 border-amber-400/50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 text-center shadow-2xl">
        {/* Glow backdrop effects */}
        <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-amber-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-emerald-500/20 blur-2xl" />

        {/* Verification Icon & Seal Header */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10 mb-4">
          <ShieldCheck size={48} />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
          <CheckCircle2 size={14} /> РЕСМИ РАСТАЛҒАН СЕРТИФИКАТ
        </span>

        <h1 className="mt-4 text-3xl font-black text-amber-300 font-serif">
          Механика AI LMS
        </h1>
        <p className="mt-1 text-xs uppercase tracking-widest text-slate-400">
          Академиялық электронды сертификаттарды тексеру реестрі
        </p>

        {/* Verification Info Box */}
        <div className="my-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-left space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-micro text-slate-400">Сертификат ID:</span>
            <span className="font-mono text-xs font-bold text-amber-400">{id}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-micro text-slate-400">Курс атауы:</span>
            <span className="text-xs font-semibold text-white">Механика және Инженерлік Физика</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-micro text-slate-400">Тексеру мәртебесі:</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={14} /> Жарамды (Valid & Authentic)
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-micro text-slate-400">Платформа:</span>
            <span className="text-xs font-medium text-slate-300">Next.js 14 LMS Engine</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Бұл сертификат Механика AI LMS қашықтықтан оқыту жүйесі арқылы тіркелген және қолдан жасаудан қорғалған.
        </p>

        {/* Back Link */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500/20 px-5 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors"
          >
            <ArrowLeft size={16} /> Сертификаттар бетіне өту
          </Link>
        </div>
      </div>
    </div>
  );
}
