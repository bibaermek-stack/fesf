"use client";

// Measuring instruments modelled from scratch, for the two scenes where a
// photogate makes no sense: a spring scale for the buoyancy experiment and a
// dial indicator for the bending beam.

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Spring scale (динамометр)
// ---------------------------------------------------------------------------

export interface SpringScaleHandle {
  /** Set the pointer from a reading expressed as a fraction of full scale. */
  setFraction: (f: number) => void;
}

export const SpringScale = forwardRef<
  SpringScaleHandle,
  { position: [number, number, number]; length?: number }
>(function SpringScale({ position, length = 0.14 }, ref) {
  const pointer = useRef<THREE.Mesh>(null!);
  const travel = length * 0.62;

  useImperativeHandle(ref, () => ({
    setFraction(f) {
      if (!pointer.current) return;
      const t = Math.max(0, Math.min(1, f));
      pointer.current.position.y = length * 0.2 - t * travel;
    },
  }));

  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i <= 10; i++) out.push(length * 0.2 - (i / 10) * travel);
    return out;
  }, [length, travel]);

  return (
    <group position={position}>
      {/* suspension hook */}
      <mesh position={[0, length / 2 + 0.012, 0]}>
        <torusGeometry args={[0.008, 0.0016, 8, 18, Math.PI * 1.5]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* barrel */}
      <mesh castShadow>
        <cylinderGeometry args={[0.014, 0.014, length, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.25} />
      </mesh>
      {/* window with the printed scale */}
      <mesh position={[0, 0, 0.0135]}>
        <boxGeometry args={[0.018, length * 0.86, 0.002]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {ticks.map((y, i) => (
        <mesh key={i} position={[i % 5 === 0 ? -0.0015 : 0.0025, y, 0.0146]}>
          <boxGeometry args={[i % 5 === 0 ? 0.012 : 0.006, 0.0012, 0.0004]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
      {/* red pointer */}
      <mesh ref={pointer} position={[0, length * 0.2, 0.0152]}>
        <boxGeometry args={[0.02, 0.0022, 0.0006]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      {/* collar and lower hook the load hangs from */}
      <mesh position={[0, -length / 2 - 0.006, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.012, 16]} />
        <meshStandardMaterial color="#1e5aa8" roughness={0.45} />
      </mesh>
      <mesh position={[0, -length / 2 - 0.02, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.007, 0.0015, 8, 18, Math.PI * 1.5]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
});

// ---------------------------------------------------------------------------
// Dial indicator (индикатор-сағат) for beam deflection
// ---------------------------------------------------------------------------

export interface DialIndicatorHandle {
  /** `mm` is the plunger travel; the needle makes one turn per millimetre. */
  setReading: (mm: number) => void;
}

export const DialIndicator = forwardRef<
  DialIndicatorHandle,
  { position: [number, number, number]; standHeight: number }
>(function DialIndicator({ position, standHeight }, ref) {
  const needle = useRef<THREE.Group>(null!);
  const plunger = useRef<THREE.Mesh>(null!);
  const dialY = standHeight + 0.055;

  useImperativeHandle(ref, () => ({
    setReading(mm) {
      if (needle.current) needle.current.rotation.z = -mm * Math.PI * 2;
      if (plunger.current) {
        const drop = Math.min(Math.max(mm, 0), 6) * 0.002;
        plunger.current.position.y = standHeight + 0.012 - drop;
      }
    },
  }));

  const ticks = useMemo(() => Array.from({ length: 20 }, (_, i) => (i / 20) * Math.PI * 2), []);

  return (
    <group position={position}>
      {/* base and column */}
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.09, 0.016, 0.07]} />
        <meshStandardMaterial color="#334155" roughness={0.65} metalness={0.3} />
      </mesh>
      <mesh position={[0, standHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, standHeight, 14]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.3} />
      </mesh>
      {/* plunger reaching down to the beam */}
      <mesh ref={plunger} position={[0.03, standHeight + 0.012, 0]} castShadow>
        <cylinderGeometry args={[0.0022, 0.0022, 0.05, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* dial face */}
      <group position={[0.03, dialY, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.026, 0.026, 0.012, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.0068]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.023, 0.023, 0.001, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
        {ticks.map((a, i) => (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.019, Math.cos(a) * 0.019, 0.0075]}
            rotation={[0, 0, -a]}
          >
            <boxGeometry args={[0.0012, i % 5 === 0 ? 0.006 : 0.003, 0.0004]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        ))}
        <group ref={needle} position={[0, 0, 0.0082]}>
          <mesh position={[0, 0.008, 0]}>
            <boxGeometry args={[0.0016, 0.018, 0.0005]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.0086]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.001, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    </group>
  );
});
