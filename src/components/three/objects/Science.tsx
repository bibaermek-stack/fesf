"use client";

// Physics / chemistry / biology objects. Everything is procedural geometry —
// no GLB downloads, so a page can show a dozen of these for the cost of a few
// hundred triangles each, and every one is parametric.

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BRAND, CYAN, VIOLET, anodised, chrome, film, glass, glow, plastic } from "../materials";

/** Nucleus with three inclined electron shells and orbiting electrons. */
export function Atom({ scale = 1 }: { scale?: number }) {
  const shells = useRef<THREE.Group[]>([]);

  useFrame((_, d) => {
    shells.current.forEach((s, i) => {
      if (s) s.rotation.z += d * (0.5 + i * 0.22);
    });
  });

  const tilts: [number, number, number][] = [
    [Math.PI / 2, 0, 0],
    [Math.PI / 2, 0, Math.PI / 3],
    [Math.PI / 2, 0, -Math.PI / 3],
  ];
  const colors = [BRAND, VIOLET, CYAN];

  return (
    <group scale={scale}>
      {/* Nucleus: a cluster of protons/neutrons rather than one sphere */}
      {[
        [0, 0, 0],
        [0.1, 0.07, 0.05],
        [-0.09, 0.05, -0.06],
        [0.03, -0.1, 0.04],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow material={i % 2 ? glow(CYAN, 1.1) : glow(BRAND, 1.3)}>
          <sphereGeometry args={[0.13, 24, 18]} />
        </mesh>
      ))}

      {tilts.map((rot, i) => (
        <group key={i} rotation={rot} ref={(el) => { if (el) shells.current[i] = el; }}>
          {/* Orbit path */}
          <mesh material={film(colors[i], 0.4)}>
            <torusGeometry args={[0.62 + i * 0.12, 0.006, 8, 96]} />
          </mesh>
          {/* Electron riding it */}
          <mesh position={[0.62 + i * 0.12, 0, 0]} castShadow material={glow(colors[i], 2.4)}>
            <sphereGeometry args={[0.055, 18, 14]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Double helix with base pairs, slowly unwinding about its axis. */
export function DnaHelix({ scale = 1, turns = 2.4, rungs = 26 }: { scale?: number; turns?: number; rungs?: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * 0.42;
  });

  const steps = useMemo(() => {
    const out: { y: number; a: number }[] = [];
    for (let i = 0; i < rungs; i++) {
      const t = i / (rungs - 1);
      out.push({ y: (t - 0.5) * 1.9, a: t * Math.PI * 2 * turns });
    }
    return out;
  }, [rungs, turns]);

  const R = 0.3;

  return (
    <group ref={group} scale={scale}>
      {steps.map((s, i) => {
        const x1 = Math.cos(s.a) * R;
        const z1 = Math.sin(s.a) * R;
        const x2 = Math.cos(s.a + Math.PI) * R;
        const z2 = Math.sin(s.a + Math.PI) * R;
        const len = Math.hypot(x2 - x1, z2 - z1);
        return (
          <group key={i}>
            <mesh position={[x1, s.y, z1]} castShadow material={glow(BRAND, 1.1)}>
              <sphereGeometry args={[0.06, 14, 10]} />
            </mesh>
            <mesh position={[x2, s.y, z2]} castShadow material={glow(CYAN, 1.1)}>
              <sphereGeometry args={[0.06, 14, 10]} />
            </mesh>
            {/* Base pair bridging the two strands */}
            <mesh
              position={[(x1 + x2) / 2, s.y, (z1 + z2) / 2]}
              rotation={[0, -s.a, Math.PI / 2]}
              material={film(i % 2 ? VIOLET : "#9db4e8", 0.55)}
            >
              <cylinderGeometry args={[0.014, 0.014, len, 6]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Star, orbit rings and four planets on independent periods. */
export function SolarSystem({ scale = 1 }: { scale?: number }) {
  const orbits = useRef<THREE.Group[]>([]);
  const planets = useMemo(
    () => [
      { r: 0.45, size: 0.06, color: "#8fb4ff", speed: 0.9 },
      { r: 0.68, size: 0.09, color: "#a78bfa", speed: 0.62 },
      { r: 0.92, size: 0.075, color: "#67e8f9", speed: 0.44, ring: true },
      { r: 1.18, size: 0.05, color: "#f0abfc", speed: 0.3 },
    ],
    []
  );

  useFrame((_, d) => {
    orbits.current.forEach((o, i) => {
      if (o) o.rotation.y += d * planets[i].speed;
    });
  });

  return (
    <group scale={scale} rotation={[0.34, 0, 0]}>
      {/* Star */}
      <mesh castShadow material={glow("#ffd591", 2.2)}>
        <sphereGeometry args={[0.2, 32, 24]} />
      </mesh>
      <pointLight color="#ffd591" intensity={2.2} distance={4} decay={2} />

      {planets.map((p, i) => (
        <group key={i}>
          {/* Orbit path, flat in the XZ plane */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={film("#93a7c8", 0.22)}>
            <torusGeometry args={[p.r, 0.0035, 6, 128]} />
          </mesh>
          <group ref={(el) => { if (el) orbits.current[i] = el; }}>
            <group position={[p.r, 0, 0]}>
              <mesh castShadow material={plastic(p.color)}>
                <sphereGeometry args={[p.size, 24, 18]} />
              </mesh>
              {p.ring && (
                <mesh rotation={[Math.PI / 2.3, 0, 0.3]} material={film("#cbd5e1", 0.5)}>
                  <torusGeometry args={[p.size * 1.9, 0.012, 6, 48]} />
                </mesh>
              )}
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

/** Ball-and-stick molecule (a water-like bent triatomic plus two extra arms). */
export function Molecule({ scale = 1 }: { scale?: number }) {
  const atoms: { p: [number, number, number]; r: number; c: string }[] = [
    { p: [0, 0, 0], r: 0.19, c: "#e2e8f0" },
    { p: [0.42, 0.26, 0.05], r: 0.12, c: BRAND },
    { p: [-0.42, 0.26, -0.05], r: 0.12, c: CYAN },
    { p: [0.05, -0.46, 0.22], r: 0.12, c: VIOLET },
    { p: [-0.08, -0.3, -0.45], r: 0.1, c: "#f0abfc" },
  ];

  return (
    <group scale={scale}>
      {atoms.map((a, i) => (
        <mesh key={i} position={a.p} castShadow material={i === 0 ? chrome("#e2e8f0") : plastic(a.c)}>
          <sphereGeometry args={[a.r, 28, 20]} />
        </mesh>
      ))}
      {atoms.slice(1).map((a, i) => {
        const v = new THREE.Vector3(...a.p);
        const len = v.length();
        // Orient a unit cylinder (Y-up) along the bond direction.
        const q = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          v.clone().normalize()
        );
        const e = new THREE.Euler().setFromQuaternion(q);
        return (
          <mesh
            key={i}
            position={[a.p[0] / 2, a.p[1] / 2, a.p[2] / 2]}
            rotation={[e.x, e.y, e.z]}
            material={anodised("#9fb0cc")}
          >
            <cylinderGeometry args={[0.03, 0.03, len, 12]} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Beaker with a liquid line, plus a test tube in a stand. */
export function LabGlassware({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Beaker */}
      <mesh position={[-0.28, 0, 0]} castShadow material={glass()}>
        <cylinderGeometry args={[0.3, 0.3, 0.52, 40, 1, true]} />
      </mesh>
      <mesh position={[-0.28, -0.26, 0]} material={glass()}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 40]} />
      </mesh>
      <mesh position={[-0.28, -0.12, 0]} material={film(CYAN, 0.6)}>
        <cylinderGeometry args={[0.285, 0.285, 0.26, 40]} />
      </mesh>

      {/* Test tube on a stand */}
      <mesh position={[0.32, 0.02, 0]} castShadow material={glass()}>
        <capsuleGeometry args={[0.09, 0.42, 8, 24]} />
      </mesh>
      <mesh position={[0.32, -0.1, 0]} material={film(VIOLET, 0.65)}>
        <capsuleGeometry args={[0.078, 0.16, 6, 20]} />
      </mesh>
      <mesh position={[0.32, -0.32, 0]} castShadow material={anodised("#64748b")}>
        <boxGeometry args={[0.26, 0.05, 0.2]} />
      </mesh>
    </group>
  );
}

/** Microscope: base, arm, stage and an angled optical tube. */
export function Microscope({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale} position={[0, -0.25, 0]}>
      <mesh position={[0, 0.05, 0.05]} castShadow material={anodised("#5b6b86")}>
        <boxGeometry args={[0.55, 0.1, 0.42]} />
      </mesh>
      {/* Arm */}
      <mesh position={[-0.14, 0.42, 0]} rotation={[0, 0, 0.18]} castShadow material={anodised("#7f8fa8")}>
        <boxGeometry args={[0.12, 0.72, 0.14]} />
      </mesh>
      {/* Stage */}
      <mesh position={[0.08, 0.36, 0.02]} castShadow material={chrome("#aab7cc")}>
        <boxGeometry args={[0.36, 0.035, 0.3]} />
      </mesh>
      {/* Optical tube */}
      <group position={[0.02, 0.78, 0.02]} rotation={[0.34, 0, 0]}>
        <mesh castShadow material={chrome("#c9d4e4")}>
          <cylinderGeometry args={[0.075, 0.075, 0.5, 24]} />
        </mesh>
        <mesh position={[0, -0.3, 0]} castShadow material={glow(CYAN, 1.4)}>
          <cylinderGeometry args={[0.05, 0.035, 0.12, 20]} />
        </mesh>
      </group>
    </group>
  );
}

/** Telescope on a tripod, angled at the sky. */
export function Telescope({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale} position={[0, -0.15, 0]}>
      {/* Tripod */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.22, -0.3, Math.sin(a) * 0.22]}
          rotation={[Math.cos(a) * -0.4, 0, Math.sin(a) * 0.4]}
          castShadow
          material={anodised("#6b7a94")}
        >
          <cylinderGeometry args={[0.022, 0.022, 0.68, 10]} />
        </mesh>
      ))}
      {/* Tube */}
      <group rotation={[0, 0, -0.5]} position={[0, 0.14, 0]}>
        <mesh castShadow material={chrome("#b8c6db")}>
          <cylinderGeometry args={[0.13, 0.15, 0.95, 28]} />
        </mesh>
        <mesh position={[0, 0.5, 0]} material={glass("#cfe4ff")}>
          <cylinderGeometry args={[0.132, 0.132, 0.03, 28]} />
        </mesh>
        {/* Finder scope */}
        <mesh position={[0.16, 0.16, 0]} rotation={[0, 0, 0]} castShadow material={anodised("#8ea3c4")}>
          <cylinderGeometry args={[0.035, 0.035, 0.34, 16]} />
        </mesh>
      </group>
    </group>
  );
}
