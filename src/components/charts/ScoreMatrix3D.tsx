"use client";

// 3D quiz-score matrix: students on one axis, lessons on the other, bar height
// and colour = the score.
//
// The third dimension earns its place here — a flat chart can show scores per
// lesson *or* per student, but this shows both at once, so the two failure
// patterns separate visually: a low row is a struggling student, a low column
// is a lesson the whole cohort found hard. Gaps are lessons not yet attempted.

import { useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, OrbitControls } from "@react-three/drei";
import { COHORT, LESSON_SHORT, type StudentRow } from "@/data/cohort";

const CELL = 0.42; // spacing between bars
const BAR = 0.3; // bar footprint
const MAX_H = 2.2; // height of a 100% score

/** Red below 60, amber to 80, green above — the same thresholds as the tables. */
function scoreColor(score: number): string {
  if (score < 60) return "#e11d48";
  if (score < 80) return "#f59e0b";
  return "#10b981";
}

function Bars({
  rows,
  onHover,
}: {
  rows: StudentRow[];
  onHover: (info: { student: string; lesson: number; score: number } | null) => void;
}) {
  const bars = useMemo(() => {
    const out: { key: string; pos: [number, number, number]; h: number; color: string; s: number; r: number; c: number }[] = [];
    rows.forEach((row, r) => {
      row.scores.forEach((score, c) => {
        if (score === null) return;
        const h = (score / 100) * MAX_H;
        out.push({
          key: `${r}-${c}`,
          pos: [c * CELL, h / 2, r * CELL],
          h,
          color: scoreColor(score),
          s: score,
          r,
          c,
        });
      });
    });
    return out;
  }, [rows]);

  const width = (LESSON_SHORT.length - 1) * CELL;
  const depth = (rows.length - 1) * CELL;

  return (
    <group position={[-width / 2, 0, -depth / 2]}>
      {/* base plate */}
      <mesh position={[width / 2, -0.015, depth / 2]} receiveShadow>
        <boxGeometry args={[width + CELL * 1.4, 0.03, depth + CELL * 1.4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>

      {bars.map((b) => (
        <mesh
          key={b.key}
          position={b.pos}
          castShadow
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover({ student: rows[b.r].fullName, lesson: b.c + 1, score: b.s });
          }}
          onPointerOut={() => onHover(null)}
        >
          <boxGeometry args={[BAR, b.h, BAR]} />
          <meshStandardMaterial color={b.color} roughness={0.45} metalness={0.1} />
        </mesh>
      ))}

      {/* lesson numbers along the front edge */}
      {LESSON_SHORT.map((label, c) => (
        <Html
          key={`l-${c}`}
          position={[c * CELL, 0, depth + CELL * 0.75]}
          center
          zIndexRange={[5, 0]}
        >
          <span className="data-num select-none text-[10px] font-bold text-slate-500">{label}</span>
        </Html>
      ))}

      {/* student initials down the side */}
      {rows.map((row, r) => (
        <Html key={`s-${r}`} position={[-CELL * 0.8, 0, r * CELL]} center zIndexRange={[5, 0]}>
          <span className="select-none whitespace-nowrap text-[10px] font-semibold text-slate-500">
            {row.fullName.split(" ")[0]}
          </span>
        </Html>
      ))}
    </group>
  );
}

export function ScoreMatrix3D({ rows = COHORT }: { rows?: StudentRow[] }) {
  const [hover, setHover] = useState<{ student: string; lesson: number; score: number } | null>(
    null
  );

  return (
    <div>
      <div className="sim-stage relative h-[360px] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [3.4, 3.2, 4.4], fov: 40 }}>
          <hemisphereLight args={["#e7eeff", "#8892a3", 1.2]} />
          <directionalLight
            position={[4, 6, 3]}
            intensity={1.7}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <Environment resolution={32} frames={1}>
            <mesh scale={20}>
              <sphereGeometry args={[1, 16, 10]} />
              <meshBasicMaterial color="#dfe8f7" side={THREE.BackSide} />
            </mesh>
            <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 8, 1]}>
              <planeGeometry />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </Environment>

          <Bars rows={rows} onHover={setHover} />

          {/* Damping off and auto-rotate off: the view only moves when dragged. */}
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2 - 0.05}
            makeDefault
          />
        </Canvas>

        <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-micro text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
          {hover ? (
            <span>
              <span className="font-semibold">{hover.student}</span> · {hover.lesson}-сабақ ·{" "}
              <span className="data-num font-bold">{hover.score}%</span>
            </span>
          ) : (
            <span>Бағанға тінтуірді апарыңыз</span>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-2.5 right-3 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
          Сүйреу — айналдыру · Дөңгелек — масштаб
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {[
          { c: "#e11d48", t: "60%-дан төмен" },
          { c: "#f59e0b", t: "60–79%" },
          { c: "#10b981", t: "80%-дан жоғары" },
          { c: "#cbd5e1", t: "тапсырылмаған (баған жоқ)" },
        ].map((l) => (
          <span
            key={l.t}
            className="flex items-center gap-1.5 text-micro text-slate-600 dark:text-slate-400"
          >
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: l.c }} />
            {l.t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ScoreMatrix3D;
