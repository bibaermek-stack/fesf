"use client";

import { useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, OrbitControls } from "@react-three/drei";

const COMPETENCY_LABELS = [
  "Механика негіздері",
  "Кинематика",
  "Динамика",
  "Ньютон заңдары",
  "Энергия сақталуы",
  "Импульс сақталуы",
  "Айналмалы қозғалыс",
  "Тербелістер",
  "Гидромеханика",
  "Инженерлік модельдеу",
];

interface GlobeNode {
  id: number;
  label: string;
  score: number; // 1 to 5
  position: [number, number, number];
  color: string;
}

function getNodeColor(score: number): string {
  if (score >= 4.0) return "#10b981"; // green
  if (score >= 3.0) return "#f59e0b"; // amber
  return "#e11d48"; // red
}

function GlobeContent({
  values,
  onHover,
}: {
  values: number[];
  onHover: (info: { label: string; score: number } | null) => void;
}) {
  const nodes: GlobeNode[] = useMemo(() => {
    const radius = 1.8;
    const count = COMPETENCY_LABELS.length;
    return COMPETENCY_LABELS.map((label, idx) => {
      const score = values[idx] ?? 3.5;
      const phi = Math.acos(-1 + (2 * idx) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      return {
        id: idx,
        label,
        score,
        position: [x, y, z],
        color: getNodeColor(score),
      };
    });
  }, [values]);

  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    nodes.forEach((node) => {
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(...node.position));
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [nodes]);

  return (
    <group>
      {/* Central Core Globe */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          roughness={0.2}
          metalness={0.6}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Inner glowing sphere */}
      <mesh>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshStandardMaterial color="#6366f1" roughness={0.5} opacity={0.6} transparent />
      </mesh>

      {/* Connecting rays to core */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#94a3b8" opacity={0.4} transparent />
      </lineSegments>

      {/* Competency Orbit Nodes */}
      {nodes.map((node) => (
        <group key={node.id} position={node.position}>
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover({ label: node.label, score: node.score });
            }}
            onPointerOut={() => onHover(null)}
          >
            <sphereGeometry args={[0.22 + node.score * 0.03, 16, 16]} />
            <meshStandardMaterial color={node.color} roughness={0.3} metalness={0.2} />
          </mesh>

          <Html position={[0, 0.35, 0]} center zIndexRange={[10, 0]}>
            <div className="pointer-events-none rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-medium text-white shadow-md backdrop-blur-sm dark:bg-black/90">
              {node.label} ({node.score.toFixed(1)})
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

export function CompetencyGlobe3D({ values }: { values?: number[] }) {
  const defaultValues = useMemo(() => [4.2, 3.8, 4.5, 3.2, 3.9, 4.1, 3.5, 3.0, 4.0, 3.7], []);
  const scores = values && values.length === 10 ? values : defaultValues;
  const [hovered, setHovered] = useState<{ label: string; score: number } | null>(null);

  return (
    <div className="sim-stage relative h-[360px] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#818cf8" />
        <Environment resolution={32} frames={1}>
          <mesh scale={20}>
            <sphereGeometry args={[1, 16, 10]} />
            <meshBasicMaterial color="#0f172a" side={THREE.BackSide} />
          </mesh>
        </Environment>

        <GlobeContent values={scores} onHover={setHovered} />

        <OrbitControls autoRotate autoRotateSpeed={1.2} enableZoom enablePan={false} />
      </Canvas>

      <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-micro text-slate-700 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-300">
        {hovered ? (
          <span>
            <span className="font-bold text-brand-600 dark:text-brand-400">{hovered.label}</span> ·
            Құзыреттілік ұпайы: <span className="font-bold">{hovered.score} / 5.0</span>
          </span>
        ) : (
          <span>3D Шардағы сфераларды нұсқаңыз немесе айналдырыңыз</span>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[10px] font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-300">
        3D Сфера · Айналу бейнесі
      </div>
    </div>
  );
}

export default CompetencyGlobe3D;
