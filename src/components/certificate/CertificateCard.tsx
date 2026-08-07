"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Award } from "lucide-react";
import type { Certificate } from "@/lib/types";

export function CertificateCard({ certificate, studentName }: { certificate: Certificate; studentName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, certificate.verifyUrl, { width: 96, margin: 1 });
    }
  }, [certificate.verifyUrl]);

  return (
    <div className="relative overflow-hidden rounded-xl2 border-2 border-brand-200 bg-gradient-to-br from-white to-brand-50 p-8 text-center shadow-lg dark:border-brand-900 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-100/60 dark:bg-brand-900/30" />
      <Award className="mx-auto mb-3 text-amber-500" size={48} />
      <p className="text-xs uppercase tracking-widest text-slate-500">Механика AI LMS сертификаты</p>
      <h2 className="mt-2 text-h1">{certificate.courseName}</h2>
      <p className="mt-4 text-lg">
        Осы құжат <strong>{studentName}</strong> атты студенттің курсты сәтті аяқтағанын растайды.
      </p>
      <p className="mt-2 text-body text-slate-600 dark:text-slate-400">
        Берілген күні: {new Date(certificate.issuedAt).toLocaleDateString("kk-KZ")}
      </p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <canvas ref={canvasRef} />
        <div className="text-left text-micro text-slate-600 dark:text-slate-400">
          <p>QR кодты сканерлеп растаңыз</p>
          <p className="font-mono">{certificate.id}</p>
        </div>
      </div>
    </div>
  );
}
