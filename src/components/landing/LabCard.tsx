"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/motion/Magnetic";
import { StemObject, type StemObjectKind } from "@/components/three/ObjectStage";

/**
 * A laboratory as a floating glass card with its own 3D object.
 *
 * The tilt, lift and pointer-tracked sheen come from <TiltCard/>; the animated
 * gradient hairline is the `.edge-glow` recipe in globals.css, which paints a
 * masked gradient border without a second element or a repaint.
 */
export function LabCard({
  id,
  title,
  description,
  kind,
  tag,
}: {
  id: number;
  title: string;
  description: string;
  kind: StemObjectKind;
  tag: string;
}) {
  return (
    <TiltCard className="group relative h-full" max={8} lift={8}>
      <Link
        href={`/modules/${id}`}
        className="glass glass-lit edge-glow relative flex h-full flex-col overflow-hidden rounded-3xl2 p-6"
      >
        {/* Background glow that blooms on hover */}
        <span className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-brand-500/0 blur-3xl transition-colors duration-500 group-hover:bg-brand-500/30" />

        <div className="relative flex items-start justify-between gap-3">
          <span className="data-num text-data-sm text-slate-400 dark:text-slate-500">
            {String(id).padStart(2, "0")}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-micro font-medium text-slate-600 dark:text-slate-300">
            {tag}
          </span>
        </div>

        {/* The 3D object, lifting slightly with the card */}
        <div className="relative mx-auto h-36 w-full transition-transform duration-500 group-hover:-translate-y-1.5">
          <StemObject
            kind={kind}
            className="h-full w-full"
            scale={0.95}
            distance={3.8}
            amplitude={0.09}
            speed={0.8}
            phase={id * 0.7}
          />
        </div>

        <h3 className="relative mt-2 text-h3 text-slate-900 dark:text-white">{title}</h3>
        <p className="relative mt-1.5 line-clamp-2 text-body text-slate-600 dark:text-slate-400">
          {description}
        </p>

        <span className="relative mt-4 inline-flex items-center gap-1.5 text-body font-semibold text-brand-600 dark:text-brand-300">
          Зертханаға кіру
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </Link>
    </TiltCard>
  );
}
