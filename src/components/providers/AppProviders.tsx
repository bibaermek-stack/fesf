"use client";

import { useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { useAuthStore, DEMO_STUDENT } from "@/lib/authStore";
import { getCurrentUserProfile, upsertUserProfile } from "@/lib/dataStore";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    // Restore dark mode preference
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("mechanics-lms:darkMode") : null;
    if (stored === "true") {
      document.documentElement.classList.add("dark");
      useAuthStore.setState({ darkMode: true });
    }
  }, []);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsub = onAuthStateChanged(auth, async (fbUser: User | null) => {
        if (fbUser) {
          let profile = await getCurrentUserProfile(fbUser.uid);
          if (!profile) {
            profile = {
              uid: fbUser.uid,
              fullName: fbUser.displayName ?? "Қолданушы",
              email: fbUser.email ?? "",
              role: "student",
              createdAt: new Date().toISOString(),
              xp: 0,
              badges: [],
            };
            await upsertUserProfile(profile);
          }
          setUser(profile);
        } else {
          setUser(null);
        }
      });
      return () => unsub();
    }
    // Mock mode: auto sign in the demo student so every page is explorable.
    setUser(DEMO_STUDENT);
  }, [setUser, setLoading]);

  return <>{children}</>;
}
