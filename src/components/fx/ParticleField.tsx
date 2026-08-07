"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Drifting particles, stars and the occasional sparkle, drawn on a 2D canvas.
 *
 * Deliberately *not* WebGL: the page already spends its GPU budget on the
 * three.js scenes, and a 2D canvas of a few hundred points costs almost
 * nothing while leaving the WebGL context count free for the actual 3D work.
 * The whole field pauses when scrolled out of view and when the tab is hidden,
 * so an idle background tab does no work at all.
 */
export function ParticleField({
  density = 0.00008,
  className = "",
}: {
  /** Particles per pixel of viewport area. */
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      hue: number;
      /** Sparkles twinkle; plain dust does not. */
      twinkle: number;
      phase: number;
    };
    let points: P[] = [];

    const HUES = [216, 258, 190]; // blue, violet, cyan — the brand ramp

    function seed() {
      const count = Math.min(420, Math.max(60, Math.round(width * height * density)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.05 - Math.random() * 0.16, // drift gently upward
        r: Math.random() * 1.5 + 0.4,
        hue: HUES[Math.floor(Math.random() * HUES.length)],
        twinkle: Math.random() < 0.28 ? 1 : 0,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap rather than respawn, so density never visibly dips.
        if (p.y < -4) p.y = height + 4;
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;

        const a = p.twinkle
          ? 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.0022 + p.phase))
          : 0.34;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 95%, 76%, ${a})`;
        ctx!.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    /** One static frame, for reduced-motion and paused states. */
    function drawStatic() {
      ctx!.clearRect(0, 0, width, height);
      for (const p of points) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 95%, 76%, 0.32)`;
        ctx!.fill();
      }
    }

    function start() {
      if (raf || reduced) return;
      raf = requestAnimationFrame(draw);
    }
    function stop() {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    }

    resize();
    if (reduced) {
      drawStatic();
    } else {
      start();
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced || !running) drawStatic();
    });
    ro.observe(canvas);

    // Stop the loop entirely when the field scrolls away or the tab is hidden.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !document.hidden) start();
        else stop();
      },
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (running) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
