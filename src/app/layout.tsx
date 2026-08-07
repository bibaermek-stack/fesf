import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { SceneBackground } from "@/components/fx/SceneBackground";
import { LoadingScreen } from "@/components/fx/LoadingScreen";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ObjectStageProvider } from "@/components/three/ObjectStage";
import { PageTransition } from "@/components/motion/PageTransition";

export const metadata: Metadata = {
  title: "Механика AI LMS — Ақпараттық-коммуникативтік құзыреттілік платформасы",
  description:
    "Механиканы қашықтықтан оқыту жағдайында студенттердің ақпараттық-коммуникативтік құзыреттілігін қалыптастыруға арналған жасанды интеллект негізіндегі білім беру платформасы",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#05070f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // `dark` is set here as well as in AppProviders so the first paint is
    // already dark — otherwise the page flashes white before hydration.
    <html lang="kk" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <AppProviders>
          {/* Background and the shared 3D canvas live above the router, so
              they survive navigation instead of being torn down and rebuilt
              (which would recompile every shader on each route change). */}
          <SceneBackground />
          <SmoothScroll />
          <LoadingScreen />
          <ObjectStageProvider>
            <PageTransition>{children}</PageTransition>
          </ObjectStageProvider>
        </AppProviders>
      </body>
    </html>
  );
}
