"use client";

// Technology / engineering / maths objects.

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BRAND, CYAN, VIOLET, anodised, chrome, film, glow, plastic } from "../materials";

/** Microchip: substrate, die, and pins down two edges. */
export function Microchip({ scale = 1 }: { scale?: number }) {
  const pins = useMemo(() => Array.from({ length: 9 }, (_, i) => -0.4 + i * 0.1), []);

  return (
    <group scale={scale} rotation={[0.3, 0.4, 0]}>
      <mesh castShadow receiveShadow material={plastic("#1e2740")}>
        <boxGeometry args={[1, 0.11, 1]} />
      </mesh>
      {/* Die */}
      <mesh position={[0, 0.075, 0]} castShadow material={glow(BRAND, 0.55)}>
        <boxGeometry args={[0.52, 0.05, 0.52]} />
      </mesh>
      {/* Trace grid etched on the substrate */}
      {[-0.32, -0.16, 0, 0.16, 0.32].map((o) => (
        <group key={o}>
          <mesh position={[o, 0.058, 0]} material={film(CYAN, 0.5)}>
            <boxGeometry args={[0.012, 0.002, 0.9]} />
          </mesh>
          <mesh position={[0, 0.058, o]} material={film(CYAN, 0.5)}>
            <boxGeometry args={[0.9, 0.002, 0.012]} />
          </mesh>
        </group>
      ))}
      {/* Pins */}
      {pins.map((p) => (
        <group key={p}>
          <mesh position={[p, -0.02, 0.56]} castShadow material={chrome("#d7dfeb")}>
            <boxGeometry args={[0.05, 0.03, 0.14]} />
          </mesh>
          <mesh position={[p, -0.02, -0.56]} castShadow material={chrome("#d7dfeb")}>
            <boxGeometry args={[0.05, 0.03, 0.14]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Circuit board with components and glowing traces. */
export function CircuitBoard({ scale = 1 }: { scale?: number }) {
  const parts = useMemo(
    () => [
      { p: [-0.3, 0.08, -0.2], s: [0.24, 0.08, 0.16], c: "#334155" },
      { p: [0.26, 0.07, 0.24], s: [0.3, 0.06, 0.12], c: "#475569" },
      { p: [0.3, 0.1, -0.28], s: [0.12, 0.12, 0.12], c: "#1e293b" },
      { p: [-0.34, 0.09, 0.3], s: [0.1, 0.1, 0.1], c: "#3f4a5f" },
    ],
    []
  );

  return (
    <group scale={scale} rotation={[0.42, 0.3, 0]}>
      <mesh castShadow receiveShadow material={plastic("#0f3d2e")}>
        <boxGeometry args={[1.1, 0.06, 0.9]} />
      </mesh>
      {/* Traces */}
      {[-0.3, -0.1, 0.1, 0.3].map((z) => (
        <mesh key={z} position={[0, 0.034, z]} material={film("#7dd3a0", 0.75)}>
          <boxGeometry args={[1.0, 0.002, 0.015]} />
        </mesh>
      ))}
      {[-0.35, 0.05, 0.35].map((x) => (
        <mesh key={x} position={[x, 0.034, 0]} material={film("#7dd3a0", 0.75)}>
          <boxGeometry args={[0.015, 0.002, 0.8]} />
        </mesh>
      ))}
      {parts.map((c, i) => (
        <mesh key={i} position={c.p as [number, number, number]} castShadow material={plastic(c.c)}>
          <boxGeometry args={c.s as [number, number, number]} />
        </mesh>
      ))}
      {/* Status LEDs */}
      {[[-0.1, 0.05, -0.36], [0.1, 0.05, -0.36]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} material={glow(i ? CYAN : "#4ade80", 2.4)}>
          <sphereGeometry args={[0.028, 12, 10]} />
        </mesh>
      ))}
    </group>
  );
}

/** Neural network: a sphere of nodes wired to their nearest neighbours. */
export function NeuralSphere({ scale = 1, nodes = 34 }: { scale?: number; nodes?: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * 0.24;
  });

  const { points, edges } = useMemo(() => {
    // Fibonacci sphere gives an even spread without clustering at the poles.
    const pts: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < nodes; i++) {
      const y = 1 - (i / (nodes - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      pts.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r));
    }

    // Connect each node to its two nearest neighbours — dense enough to read as
    // a network, sparse enough to stay legible in silhouette.
    const segs: THREE.Vector3[] = [];
    pts.forEach((a, i) => {
      const near = pts
        .map((b, j) => ({ j, d: a.distanceTo(b) }))
        .filter((x) => x.j !== i)
        .sort((x, y2) => x.d - y2.d)
        .slice(0, 2);
      near.forEach((n) => segs.push(a, pts[n.j]));
    });

    return { points: pts, edges: new THREE.BufferGeometry().setFromPoints(segs) };
  }, [nodes]);

  const lineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: BRAND, transparent: true, opacity: 0.4 }),
    []
  );
  const lines = useMemo(() => new THREE.LineSegments(edges, lineMat), [edges, lineMat]);

  return (
    <group ref={group} scale={scale}>
      <primitive object={lines} />
      {points.map((p, i) => (
        <mesh key={i} position={p} material={glow(i % 3 === 0 ? CYAN : i % 3 === 1 ? VIOLET : BRAND, 1.8)}>
          <sphereGeometry args={[0.036, 12, 10]} />
        </mesh>
      ))}
      {/* Faint containing shell for depth */}
      <mesh material={film("#8fb4ff", 0.06)}>
        <sphereGeometry args={[0.99, 32, 24]} />
      </mesh>
    </group>
  );
}

/** Rocket with fins, window and an animated exhaust plume. */
export function Rocket({ scale = 1 }: { scale?: number }) {
  const plume = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (!plume.current) return;
    const t = performance.now() * 0.008;
    // Flicker the exhaust rather than animating geometry.
    plume.current.scale.y = 1 + Math.sin(t) * 0.22 + Math.sin(t * 2.7) * 0.08;
  });

  return (
    <group scale={scale}>
      <mesh castShadow material={chrome("#e7edf6")}>
        <capsuleGeometry args={[0.22, 0.66, 10, 28]} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.62, 0]} castShadow material={plastic("#ef4444")}>
        <coneGeometry args={[0.22, 0.36, 28]} />
      </mesh>
      {/* Window */}
      <mesh position={[0, 0.18, 0.2]} rotation={[Math.PI / 2, 0, 0]} material={glow(CYAN, 1.2)}>
        <cylinderGeometry args={[0.075, 0.075, 0.05, 20]} />
      </mesh>
      {/* Fins */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.2, -0.4, Math.sin(a) * 0.2]}
          rotation={[0, -a, 0]}
          castShadow
          material={plastic("#ef4444")}
        >
          <boxGeometry args={[0.03, 0.3, 0.24]} />
        </mesh>
      ))}
      {/* Exhaust */}
      <mesh ref={plume} position={[0, -0.72, 0]} material={glow("#ffb057", 2.6)}>
        <coneGeometry args={[0.16, 0.42, 20, 1, true]} />
      </mesh>
      <pointLight position={[0, -0.8, 0]} color="#ffb057" intensity={2} distance={2.4} decay={2} />
    </group>
  );
}

/** Satellite: bus, dish and two solar wings. */
export function Satellite({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale} rotation={[0.2, 0.5, 0.1]}>
      <mesh castShadow material={chrome("#cbd5e1")}>
        <boxGeometry args={[0.44, 0.4, 0.44]} />
      </mesh>
      {/* Solar wings */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.62, 0, 0]}>
          <mesh castShadow material={anodised("#94a3b8")}>
            <boxGeometry args={[0.8, 0.02, 0.42]} />
          </mesh>
          <mesh position={[0, 0.013, 0]} material={film("#2563eb", 0.9)}>
            <boxGeometry args={[0.76, 0.004, 0.38]} />
          </mesh>
          {/* Cell dividers */}
          {[-0.24, 0, 0.24].map((x) => (
            <mesh key={x} position={[x, 0.017, 0]} material={film("#0f172a", 0.7)}>
              <boxGeometry args={[0.012, 0.003, 0.38]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Dish */}
      <group position={[0, 0.3, 0.22]} rotation={[-0.6, 0, 0]}>
        <mesh castShadow material={chrome("#e2e8f0")}>
          <sphereGeometry args={[0.22, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
        </mesh>
        <mesh position={[0, 0.14, 0]} material={anodised("#64748b")}>
          <cylinderGeometry args={[0.012, 0.012, 0.24, 8]} />
        </mesh>
      </group>
      {/* Antenna */}
      <mesh position={[0, -0.36, 0]} material={anodised("#94a3b8")}>
        <cylinderGeometry args={[0.008, 0.008, 0.32, 8]} />
      </mesh>
    </group>
  );
}

/** Quadcopter drone with spinning rotors. */
export function Drone({ scale = 1 }: { scale?: number }) {
  const rotors = useRef<THREE.Mesh[]>([]);
  useFrame((_, d) => {
    rotors.current.forEach((r, i) => {
      if (r) r.rotation.y += d * (i % 2 ? -34 : 34);
    });
  });

  const arms: [number, number][] = [
    [0.42, 0.42],
    [-0.42, 0.42],
    [0.42, -0.42],
    [-0.42, -0.42],
  ];

  return (
    <group scale={scale} rotation={[0.28, 0.4, 0]}>
      {/* Body */}
      <mesh castShadow material={plastic("#1f2937")}>
        <boxGeometry args={[0.42, 0.13, 0.3]} />
      </mesh>
      <mesh position={[0, -0.08, 0.02]} material={glow(CYAN, 1.6)}>
        <sphereGeometry args={[0.06, 16, 12]} />
      </mesh>

      {arms.map(([x, z], i) => (
        <group key={i}>
          {/* Arm */}
          <mesh
            position={[x / 2, 0, z / 2]}
            rotation={[0, Math.atan2(z, x), 0]}
            castShadow
            material={anodised("#475569")}
          >
            <boxGeometry args={[Math.hypot(x, z), 0.035, 0.05]} />
          </mesh>
          {/* Motor */}
          <mesh position={[x, 0.03, z]} castShadow material={chrome("#94a3b8")}>
            <cylinderGeometry args={[0.055, 0.055, 0.08, 16]} />
          </mesh>
          {/* Rotor disc — a translucent disc reads better than blurred blades */}
          <mesh
            ref={(el) => { if (el) rotors.current[i] = el; }}
            position={[x, 0.08, z]}
            material={film("#cbd5e1", 0.28)}
          >
            <cylinderGeometry args={[0.2, 0.2, 0.004, 24]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Articulated robot arm with a gripper, easing between two poses. */
export function RobotArm({ scale = 1 }: { scale?: number }) {
  const j1 = useRef<THREE.Group>(null!);
  const j2 = useRef<THREE.Group>(null!);

  useFrame(() => {
    const t = performance.now() * 0.00055;
    if (j1.current) j1.current.rotation.z = -0.5 + Math.sin(t) * 0.34;
    if (j2.current) j2.current.rotation.z = 0.9 + Math.sin(t * 1.3 + 1) * 0.4;
  });

  return (
    <group scale={scale} position={[0, -0.35, 0]}>
      {/* Base */}
      <mesh castShadow material={anodised("#475569")}>
        <cylinderGeometry args={[0.3, 0.34, 0.14, 28]} />
      </mesh>
      <mesh position={[0, 0.12, 0]} castShadow material={chrome("#f59e0b")}>
        <cylinderGeometry args={[0.17, 0.19, 0.16, 24]} />
      </mesh>

      <group ref={j1} position={[0, 0.2, 0]}>
        {/* Upper arm */}
        <mesh position={[0, 0.34, 0]} castShadow material={chrome("#f59e0b")}>
          <boxGeometry args={[0.16, 0.7, 0.18]} />
        </mesh>
        <group ref={j2} position={[0, 0.68, 0]}>
          {/* Forearm */}
          <mesh position={[0, 0.3, 0]} castShadow material={chrome("#e2e8f0")}>
            <boxGeometry args={[0.13, 0.62, 0.15]} />
          </mesh>
          {/* Gripper */}
          <group position={[0, 0.66, 0]}>
            <mesh castShadow material={anodised("#334155")}>
              <boxGeometry args={[0.16, 0.1, 0.16]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.08, 0.11, 0]} rotation={[0, 0, s * -0.2]} castShadow material={anodised("#64748b")}>
                <boxGeometry args={[0.035, 0.16, 0.1]} />
              </mesh>
            ))}
          </group>
        </group>
        {/* Joint caps */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={anodised("#1e293b")}>
          <cylinderGeometry args={[0.1, 0.1, 0.22, 20]} />
        </mesh>
      </group>
    </group>
  );
}

/** Stack of tilted books. */
export function BookStack({ scale = 1 }: { scale?: number }) {
  const books = [
    { y: -0.18, rot: 0.05, c: BRAND, w: 0.86 },
    { y: -0.04, rot: -0.09, c: VIOLET, w: 0.8 },
    { y: 0.1, rot: 0.13, c: CYAN, w: 0.74 },
    { y: 0.24, rot: -0.04, c: "#f0abfc", w: 0.68 },
  ];

  return (
    <group scale={scale}>
      {books.map((b, i) => (
        <group key={i} position={[0, b.y, 0]} rotation={[0, b.rot, 0]}>
          <mesh castShadow receiveShadow material={plastic(b.c)}>
            <boxGeometry args={[b.w, 0.11, b.w * 0.72]} />
          </mesh>
          {/* Pages, inset so the cover reads as a cover */}
          <mesh position={[0.02, 0, 0]} material={plastic("#f8fafc")}>
            <boxGeometry args={[b.w - 0.06, 0.085, b.w * 0.72 - 0.05]} />
          </mesh>
          {/* Spine highlight */}
          <mesh position={[-b.w / 2 + 0.012, 0, 0]} material={film("#ffffff", 0.22)}>
            <boxGeometry args={[0.006, 0.09, b.w * 0.68]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Rotating platonic/knot geometry set — the "mathematics" object. */
export function GeometrySet({ scale = 1 }: { scale?: number }) {
  const a = useRef<THREE.Mesh>(null!);
  const b = useRef<THREE.Mesh>(null!);
  const c = useRef<THREE.Mesh>(null!);

  useFrame((_, d) => {
    if (a.current) { a.current.rotation.x += d * 0.3; a.current.rotation.y += d * 0.22; }
    if (b.current) { b.current.rotation.y -= d * 0.36; }
    if (c.current) { c.current.rotation.z += d * 0.28; c.current.rotation.x -= d * 0.18; }
  });

  return (
    <group scale={scale}>
      <mesh ref={a} position={[0, 0.12, 0]} castShadow material={chrome("#a5b4fc")}>
        <torusKnotGeometry args={[0.3, 0.095, 128, 20]} />
      </mesh>
      <mesh ref={b} position={[0.62, -0.3, -0.22]} castShadow material={glow(CYAN, 0.9)}>
        <icosahedronGeometry args={[0.19, 0]} />
      </mesh>
      <mesh ref={c} position={[-0.6, -0.26, 0.2]} castShadow material={plastic(VIOLET)}>
        <octahedronGeometry args={[0.2, 0]} />
      </mesh>
      {/* Wireframe shell suggesting a coordinate volume */}
      <mesh material={film("#8fb4ff", 0.14)}>
        <boxGeometry args={[1.5, 1.1, 1.1]} />
      </mesh>
    </group>
  );
}
