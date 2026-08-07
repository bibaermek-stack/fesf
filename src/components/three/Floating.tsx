"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * Ambient float plus cursor parallax, applied to whatever it wraps.
 *
 * The pointer is read from the r3f state (already normalised to -1..1) and
 * eased toward with a per-frame lerp rather than a spring, so the object never
 * overshoots into geometry beside it. Rotation is clamped to a few degrees:
 * enough to feel alive, not enough to spin an object away from its intended
 * silhouette.
 *
 * All of this mutates the group's transform inside useFrame — no React state,
 * so a page full of these costs nothing in renders.
 */
export function Floating({
  children,
  /** Peak vertical travel of the idle bob, in world units. */
  amplitude = 0.12,
  /** Bob period multiplier; lower is slower. */
  speed = 1,
  /** Maximum cursor-driven tilt, in radians. */
  tilt = 0.22,
  /** Constant spin about Y, radians per second. 0 disables. */
  spin = 0,
  /** Phase offset so a group of objects does not bob in unison. */
  phase = 0,
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  /** Set by the parent when reduced motion is on: hold a static pose. */
  frozen = false,
}: {
  children: React.ReactNode;
  amplitude?: number;
  speed?: number;
  tilt?: number;
  spin?: number;
  phase?: number;
  position?: [number, number, number];
  scale?: number;
  frozen?: boolean;
}) {
  const group = useRef<THREE.Group>(null!);
  const { pointer } = useThree();
  const targetRX = useRef(0);
  const targetRY = useRef(0);
  const spinRef = useRef(0);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g || frozen) return;

    const t = performance.now() * 0.001;

    // Idle bob.
    g.position.y = position[1] + Math.sin(t * speed + phase) * amplitude;

    // Cursor lean, eased. Clamp delta so a dropped frame cannot jump the pose.
    const k = 1 - Math.pow(0.0015, Math.min(delta, 0.05));
    targetRY.current = pointer.x * tilt;
    targetRX.current = -pointer.y * tilt * 0.7;
    spinRef.current += spin * delta;

    g.rotation.y += (targetRY.current + spinRef.current - g.rotation.y) * k;
    g.rotation.x += (targetRX.current - g.rotation.x) * k;
    // A touch of roll tied to the bob keeps it from looking like a lift.
    g.rotation.z = Math.sin(t * speed * 0.6 + phase) * 0.04;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {children}
    </group>
  );
}
