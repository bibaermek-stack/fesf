"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Award, ShieldCheck, Printer, ExternalLink, Check, Copy, Sparkles, Download } from "lucide-react";
import type { Certificate } from "@/lib/types";

export function CertificateCard({
  certificate,
  studentName,
  onOpenModal,
}: {
  certificate: Certificate;
  studentName: string;
  onOpenModal?: (cert: Certificate) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, certificate.verifyUrl, {
        width: 100,
        margin: 1,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });
    }
  }, [certificate.verifyUrl]);

  function copyLink() {
    navigator.clipboard.writeText(certificate.verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const name = studentName || "Студент";

  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-amber-300/60 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 text-white shadow-2xl transition-all hover:border-amber-400 hover:shadow-amber-500/10 dark:border-amber-500/30">
      {/* Decorative Metallic Gold Corners */}
      <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-amber-500/10 blur-xl" />
      <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-brand-500/10 blur-xl" />
      <div className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-amber-400/50" />
      <div className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-amber-400/50" />
      <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-amber-400/50" />
      <div className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-amber-400/50" />

      {/* Certificate Header Badge */}
      <div className="flex items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40">
            <Award size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Электронды Сертификат
            </span>
            <p className="text-micro text-slate-400">Механика AI LMS</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 ring-1 ring-emerald-500/30">
          <ShieldCheck size={13} /> Расталған
        </span>
      </div>

      {/* Certificate Body */}
      <div className="my-5 text-center">
        <p className="text-micro font-medium uppercase tracking-widest text-slate-400">
          Осымен аталған құжат растайды:
        </p>
        <h2 className="mt-2 text-2xl font-black text-amber-300 font-serif tracking-wide drop-shadow-sm">
          {name}
        </h2>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          «<strong>{certificate.courseName}</strong>» арнайы оқыту курсын 100% аяқтап, виртуалды симуляциялар мен рубрика бағалауынан сәтті өтті.
        </p>
      </div>

      {/* QR Code and Date Details */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="overflow-hidden rounded-lg border border-white/20 bg-white p-1 shadow-inner">
            <canvas ref={canvasRef} />
          </div>
          <div className="text-left text-micro">
            <p className="font-semibold text-slate-200">QR тексеру:</p>
            <p className="font-mono text-[10px] text-amber-400">{certificate.id}</p>
            <p className="mt-1 text-[10px] text-slate-400">
              Берілді: {new Date(certificate.issuedAt).toLocaleDateString("kk-KZ")}
            </p>
          </div>
        </div>

        {/* Official Gold Seal Graphic */}
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[9px] font-black text-slate-950 shadow-lg ring-4 ring-amber-400/20">
          <span>АИ LMS</span>
          <span className="text-[7px] uppercase tracking-tighter">ОФИЦИАЛДЫ</span>
          <span>2026</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
        <button
          onClick={() => onOpenModal && onOpenModal(certificate)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-micro font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors"
        >
          <Sparkles size={14} /> Диплом форматы
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-micro font-medium text-slate-300 hover:bg-white/10 transition-colors"
            title="Растау сілтемесін көшіру"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? "Көшірілді" : "Сілтеме"}
          </button>

          <a
            href={certificate.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-micro font-medium text-slate-300 hover:bg-white/10 transition-colors"
          >
            <ExternalLink size={14} /> Растау
          </a>
        </div>
      </div>
    </div>
  );
}

export default CertificateCard;
