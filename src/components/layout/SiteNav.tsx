"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";

const LINKS = [
  { href: "#labs", label: "Зертханалар" },
  { href: "#stack", label: "Технология" },
  { href: "#numbers", label: "Нәтижелер" },
];

/**
 * Marketing navbar: glass panel that hides on scroll down and returns on
 * scroll up.
 *
 * The hide/show decision is made from a motion value subscription rather than
 * React state on every scroll event — only the boolean flip re-renders, so
 * scrolling a long page does not thrash the component.
 */
export function SiteNav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    // Small threshold stops the bar flickering on trackpad jitter.
    if (y > prev && y > 140) setHidden(true);
    else if (prev - y > 6) setHidden(false);
    setSolid(y > 24);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
      animate={{ y: hidden ? -110 : 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl2 px-4 py-2.5 transition-all duration-500 ${
          solid ? "glass glass-lit" : "border border-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl2 bg-aurora-brand font-bold text-white shadow-glow-brand">
            М
          </span>
          <span className="text-h3 text-slate-900 dark:text-white">Механика AI</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-3.5 py-2 text-body font-medium text-slate-600 transition-colors hover:bg-white/50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-xl2 px-4 py-2 text-body font-semibold text-slate-600 transition-colors hover:text-slate-900 sm:inline-flex dark:text-slate-300 dark:hover:text-white"
          >
            Кіру
          </Link>
          <Magnetic strength={0.25}>
            <Link href="/dashboard" className="btn-primary px-4 py-2 text-sm">
              Платформаға өту <ArrowRight size={15} />
            </Link>
          </Magnetic>
        </div>
      </nav>
    </motion.header>
  );
}
