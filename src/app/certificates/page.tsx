"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CertificateCard } from "@/components/certificate/CertificateCard";
import { useAuthStore } from "@/lib/authStore";
import { getCertificates, issueCertificate, generateId } from "@/lib/dataStore";
import type { Certificate } from "@/lib/types";

export default function CertificatesPage() {
  const user = useAuthStore((s) => s.user);
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    if (!user) return;
    getCertificates(user.uid).then(setCerts);
  }, [user]);

  async function handleIssue() {
    if (!user) return;
    const id = generateId("cert");
    const cert: Certificate = {
      id,
      userId: user.uid,
      courseName: "Механика — қашықтықтан оқыту курсы",
      issuedAt: new Date().toISOString(),
      qrData: id,
      verifyUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/verify/${id}`,
    };
    await issueCertificate(cert);
    setCerts((c) => [cert, ...c]);
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Сертификаттарым</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">QR-код арқылы расталатын электронды сертификаттар.</p>
          </div>
          <button onClick={handleIssue} className="btn-primary">Демо сертификат алу</button>
        </div>

        {certs.length === 0 ? (
          <div className="glass-card text-center text-sm text-slate-500 dark:text-slate-400">
            Әзірге сертификатың жоқ. Курсты аяқтап, сертификат алыңыз.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {certs.map((c) => (
              <CertificateCard key={c.id} certificate={c} studentName={user?.fullName ?? ""} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
