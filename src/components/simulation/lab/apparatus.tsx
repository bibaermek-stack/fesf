"use client";

// Larger self-made apparatus: the fluids tank, the bending beam with its
// supports, and the accessories that bolt onto the Rotary Motion Sensor shaft.

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Fluids tank
// ---------------------------------------------------------------------------

export interface LiquidHandle {
  /** Set the liquid column height (m) inside the tank. */
  setLevel: (h: number) => void;
}

export const Tank = forwardRef<
  LiquidHandle,
  {
    position: [number, number, number];
    /** Inner half-width in x, half-depth in z, and full height. */
    size: [number, number, number];
    liquidColor?: string;
    initialLevel?: number;
  }
>(function Tank(
  { position, size, liquidColor = "#38bdf8", initialLevel = 0.12 },
  ref
) {
  const [hw, hd, h] = size;
  const liquid = useRef<THREE.Mesh>(null!);
  const wall = 0.004;

  useImperativeHandle(ref, () => ({
    setLevel(level) {
      const m = liquid.current;
      if (!m) return;
      const lv = Math.max(0.001, Math.min(level, h - 0.005));
      m.scale.y = lv;
      m.position.y = lv / 2;
    },
  }));

  const glass = (
    <meshPhysicalMaterial
      color="#e2f2ff"
      transparent
      opacity={0.22}
      roughness={0.08}
      metalness={0}
      side={THREE.DoubleSide}
    />
  );

  return (
    <group position={position}>
      {/* base */}
      <mesh position={[0, wall / 2, 0]} receiveShadow>
        <boxGeometry args={[hw * 2, wall, hd * 2]} />
        <meshPhysicalMaterial color="#cfe6f7" transparent opacity={0.45} roughness={0.1} />
      </mesh>
      {/* four walls */}
      <mesh position={[-hw, h / 2, 0]}>
        <boxGeometry args={[wall, h, hd * 2]} />
        {glass}
      </mesh>
      <mesh position={[hw, h / 2, 0]}>
        <boxGeometry args={[wall, h, hd * 2]} />
        {glass}
      </mesh>
      <mesh position={[0, h / 2, -hd]}>
        <boxGeometry args={[hw * 2, h, wall]} />
        {glass}
      </mesh>
      <mesh position={[0, h / 2, hd]}>
        <boxGeometry args={[hw * 2, h, wall]} />
        {glass}
      </mesh>
      {/* liquid — unit cube scaled in y by the handle */}
      <mesh ref={liquid} position={[0, initialLevel / 2, 0]} scale={[1, initialLevel, 1]}>
        <boxGeometry args={[hw * 2 - wall, 1, hd * 2 - wall]} />
        <meshPhysicalMaterial
          color={liquidColor}
          transparent
          opacity={0.62}
          roughness={0.12}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
});

// ---------------------------------------------------------------------------
// Simply supported beam that visibly bends
// ---------------------------------------------------------------------------

export interface BeamHandle {
  /** Re-shape the beam given a deflection function y(x) in metres. */
  deflect: (fn: (x: number) => number) => void;
}

export const Beam = forwardRef<
  BeamHandle,
  {
    span: number;
    height: number;
    width: number;
    y: number;
    segments?: number;
    color?: string;
  }
>(function Beam({ span, height, width, y, segments = 28, color = "#94a3b8" }, ref) {
  const group = useRef<THREE.Group>(null!);
  const segRefs = useRef<THREE.Mesh[]>([]);
  const segLen = span / segments;

  useImperativeHandle(ref, () => ({
    deflect(fn) {
      for (let i = 0; i < segments; i++) {
        const mesh = segRefs.current[i];
        if (!mesh) continue;
        const xa = i * segLen;
        const xb = (i + 1) * segLen;
        const ya = fn(xa);
        const yb = fn(xb);
        mesh.position.set((xa + xb) / 2, (ya + yb) / 2, 0);
        mesh.rotation.z = Math.atan2(yb - ya, segLen);
      }
    },
  }));

  return (
    <group ref={group} position={[0, y, 0]}>
      {Array.from({ length: segments }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) segRefs.current[i] = m;
          }}
          position={[(i + 0.5) * segLen, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[segLen * 1.02, height, width]} />
          <meshStandardMaterial color={color} metalness={0.55} roughness={0.42} />
        </mesh>
      ))}
    </group>
  );
});

/**
 * Pin support (left) and roller support (right) for the beam. Both stand on
 * `baseY` — the bench top — so nothing is left hovering in mid-air.
 */
export function BeamSupports({
  span,
  y,
  width,
  baseY,
}: {
  span: number;
  y: number;
  width: number;
  baseY: number;
}) {
  const plinth = (x: number, top: number) => (
    <>
      <mesh position={[x, (baseY + top) / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, Math.max(top - baseY, 0.002), width + 0.03]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} metalness={0.35} />
      </mesh>
      <mesh position={[x, baseY + 0.008, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.016, width + 0.06]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
    </>
  );

  return (
    <group>
      {/* pin support — a knife edge on its plinth */}
      {plinth(0, y - 0.05)}
      <mesh position={[0, y - 0.02, 0]} castShadow>
        <coneGeometry args={[0.03, 0.055, 4]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* roller support */}
      {plinth(span, y - 0.034)}
      <mesh position={[span, y - 0.018, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, width + 0.02, 20]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Rotary Motion Sensor accessories (they spin about the sensor's z axis)
// ---------------------------------------------------------------------------

export interface RotaryHandle {
  setAngle: (theta: number) => void;
}

// ---------------------------------------------------------------------------
// Flywheel rig for the moment-of-inertia experiment
// ---------------------------------------------------------------------------

export type FlywheelKind = "disc" | "ring" | "cross";

export interface FlywheelHandle {
  setAngle: (theta: number) => void;
}

/**
 * The rotating body, its drive drum and the index flag, all on one axle that
 * points along +Z. Three interchangeable bodies of the *same* mass and radius
 * give three different moments of inertia, which is the whole point of the
 * experiment. The flag reaches past the rim so a photogate can straddle its
 * path without fouling the body.
 */
export const Flywheel = forwardRef<
  FlywheelHandle,
  {
    position: [number, number, number];
    kind: FlywheelKind;
    radius: number;
    drumRadius: number;
    /** How far past the rim the index flag sticks out. */
    flagOut?: number;
  }
>(function Flywheel({ position, kind, radius, drumRadius, flagOut = 0.03 }, ref) {
  const spin = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => ({
    setAngle(theta) {
      if (spin.current) spin.current.rotation.z = theta;
    },
  }));

  const steel = <meshStandardMaterial color="#c3ccd8" metalness={0.55} roughness={0.32} />;

  return (
    <group position={position}>
      <group ref={spin}>
        {kind === "disc" && (
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[radius, radius, 0.014, 48]} />
            {steel}
          </mesh>
        )}

        {kind === "ring" && (
          <>
            <mesh castShadow receiveShadow>
              <torusGeometry args={[radius - 0.008, 0.008, 12, 48]} />
              {steel}
            </mesh>
            {[0, Math.PI / 2].map((a) => (
              <mesh key={a} rotation={[0, 0, a]} castShadow>
                <boxGeometry args={[radius * 2 - 0.016, 0.006, 0.005]} />
                <meshStandardMaterial color="#b6c0cd" metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
          </>
        )}

        {kind === "cross" && (
          <>
            {[0, Math.PI / 2].map((a) => (
              <mesh key={a} rotation={[0, 0, a]} castShadow receiveShadow>
                <boxGeometry args={[radius * 2, 0.016, 0.012]} />
                {steel}
              </mesh>
            ))}
          </>
        )}

        {/* hub and drive drum */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.03, 20]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, -0.03]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[drumRadius, drumRadius, 0.02, 24]} />
          <meshStandardMaterial color="#1e5aa8" roughness={0.45} />
        </mesh>

        {/* index flag — one pass through the gate per revolution */}
        <mesh position={[0, -(radius + flagOut / 2), 0]} castShadow>
          <boxGeometry args={[0.006, flagOut, 0.02]} />
          <meshStandardMaterial color="#ef4444" roughness={0.55} />
        </mesh>
        <mesh position={[0, -(radius / 2), 0]}>
          <boxGeometry args={[0.004, radius, 0.004]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
});

/** Column and bearing block that carry the flywheel axle. */
export function FlywheelStand({
  x,
  baseY,
  axleY,
  z = 0,
}: {
  x: number;
  baseY: number;
  axleY: number;
  z?: number;
}) {
  const h = axleY - baseY;
  return (
    <group position={[x, baseY, z]}>
      <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.024, 0.16]} />
        <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, h / 2, -0.03]} castShadow>
        <boxGeometry args={[0.04, h, 0.03]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* bearing block the axle runs in */}
      <mesh position={[0, h, 0.0]} castShadow>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshStandardMaterial color="#475569" metalness={0.55} roughness={0.45} />
      </mesh>
      <mesh position={[0, h, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.12, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );
}

/** Simple pendulum: a light rod with a dense bob, pivoting about z. */
export const Pendulum = forwardRef<
  RotaryHandle,
  { position: [number, number, number]; length: number; bobRadius?: number }
>(function Pendulum({ position, length, bobRadius = 0.018 }, ref) {
  const group = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => ({
    setAngle(theta) {
      if (group.current) group.current.rotation.z = theta;
    },
  }));

  return (
    <group ref={group} position={position}>
      <mesh position={[0, -length / 2, 0]} castShadow>
        <cylinderGeometry args={[0.0018, 0.0018, length, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, -length, 0]} castShadow>
        <sphereGeometry args={[bobRadius, 24, 18]} />
        <meshStandardMaterial color="#b45309" metalness={0.75} roughness={0.3} />
      </mesh>
    </group>
  );
});

/** Dashed arc showing where the pendulum swings. */
export function SwingGuide({
  position,
  length,
  maxAngle,
}: {
  position: [number, number, number];
  length: number;
  maxAngle: number;
}) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const n = 40;
    for (let i = 0; i <= n; i++) {
      const a = -maxAngle + (2 * maxAngle * i) / n;
      pts.push(new THREE.Vector3(Math.sin(a) * length, -Math.cos(a) * length, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [length, maxAngle]);

  const object = useMemo(
    () =>
      new THREE.Line(
        geometry,
        new THREE.LineDashedMaterial({ color: "#64748b", dashSize: 0.01, gapSize: 0.008 })
      ),
    [geometry]
  );
  object.computeLineDistances();

  return <primitive object={object} position={position} />;
}
