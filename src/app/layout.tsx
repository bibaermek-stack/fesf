import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: "Механика AI LMS — Ақпараттық-коммуникативтік құзыреттілік платформасы",
  description:
    "Механиканы қашықтықтан оқыту жағдайында студенттердің ақпараттық-коммуникативтік құзыреттілігін қалыптастыруға арналған жасанды интеллект негізіндегі білім беру платформасы",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1f47e6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
