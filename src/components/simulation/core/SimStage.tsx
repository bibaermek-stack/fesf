"use client";

// The shared 3D stage: canvas, lighting rig, floor and camera controls.
// Deliberately free of any asset that would be fetched from a CDN — the
// lighting is analytic and the floor grid is drei's shader-based <Grid/>.

import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Grid, Html, OrbitControls } from "@react-three/drei";
import type { SimEngine } from "./useSimEngine";

/**
 * Metals need something to reflect or they render almost black. Rather than
 * fetch an HDR from a CDN, this bakes a tiny cubemap from a few coloured
 * shapes — a bright sky dome, a soft ceiling panel and a floor bounce — which
 * is enough to make aluminium read as aluminium.
 */
function StudioEnvironment() {
  return (
    <Environment resolution={64} frames={1}>
      <mesh scale={12}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshBasicMaterial color="#dbe6f7" side={THREE.BackSide} />
      </mesh>
      {/* overhead softbox */}
      <mesh position={[0, 6, 1]} rotation={[Math.PI / 2, 0, 0]} scale={[7, 5, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* warm key from the front-right, cool fill from the back-left */}
      <mesh position={[6, 2.5, 5]} scale={[4, 4, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#fff2e0" />
      </mesh>
      <mesh position={[-6, 2, -5]} scale={[4, 4, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#c9dcff" />
      </mesh>
      {/* floor bounce */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[10, 10, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#9aa6b8" />
      </mesh>
    </Environment>
  );
}

/** Steps the physics from inside the render loop. Must live in the Canvas. */
export function SimDriver<S>({ engine }: { engine: SimEngine<S> }) {
  useFrame((_, delta) => engine.advance(delta));
  return null;
}

function Loader() {
  return (
    <Html center>
      <div className="whitespace-nowrap rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-raised">
        3D жабдық жүктелуде…
      </div>
    </Html>
  );
}

/** Frames the scene once on mount without pulling in drei's <Bounds/>. */
function CameraRig({ target }: { target: [number, number, number] }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(target[0], target[1], target[2]);
  }, [camera, target]);
  return null;
}

export interface SimStageProps {
  children: React.ReactNode;
  /** Camera position in metres. */
  camera?: [number, number, number];
  /** Orbit pivot in metres. */
  target?: [number, number, number];
  /** Scene scale hint used for the floor grid and shadow plane. */
  extent?: number;
  className?: string;
}

export function SimStage({
  children,
  camera = [1.1, 0.75, 1.4],
  target = [0, 0.15, 0],
  extent = 3,
  className,
}: SimStageProps) {
  return (
    <div
      className={
        className ??
        "sim-stage relative h-[400px] w-full overflow-hidden rounded-xl2 shadow-lg ring-1 ring-slate-900/10 dark:ring-white/10 sm:h-[500px]"
      }
    >
      <Canvas shadows dpr={[1, 2]} camera={{ position: camera, fov: 40, near: 0.01, far: 60 }}>
        <CameraRig target={target} />
        {/* Three-point studio rig: cool sky fill, warm key, cool rim. */}
        <hemisphereLight args={["#e7eeff", "#7b8496", 1.15]} />
        <directionalLight
          position={[2.2, 3.4, 2.0]}
          intensity={2.0}
          color="#fff6e8"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-extent}
          shadow-camera-right={extent}
          shadow-camera-top={extent}
          shadow-camera-bottom={-extent}
          shadow-bias={-0.0008}
        />
        <directionalLight position={[-2.4, 1.8, -1.6]} intensity={0.65} color="#cfe0ff" />
        <directionalLight position={[0, 1.2, -3]} intensity={0.35} color="#ffffff" />
        <StudioEnvironment />

        <Suspense fallback={<Loader />}>{children}</Suspense>

        {/* A quiet floor grid: present enough to give scale, faint enough that
            the apparatus stays the subject. */}
        <Grid
          position={[0, -0.001, 0]}
          args={[extent * 4, extent * 4]}
          cellSize={0.25}
          cellThickness={0.5}
          cellColor="#aab6c6"
          sectionSize={1}
          sectionThickness={0.9}
          sectionColor="#7f9bd1"
          fadeDistance={extent * 2.2}
          fadeStrength={2}
          infiniteGrid
          followCamera={false}
        />
        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.42}
          scale={extent * 2.5}
          blur={2.6}
          far={1.6}
        />

        <OrbitControls
          target={target}
          enablePan
          minDistance={0.35}
          maxDistance={extent * 4}
          maxPolarAngle={Math.PI / 2 - 0.02}
          enableDamping
          dampingFactor={0.08}
          makeDefault
        />
      </Canvas>

      {/* Soft vignette so the corners fall away and the eye lands centre-stage */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 85% at 50% 42%, transparent 55%, rgba(15,23,42,0.10) 100%)",
        }}
      />

      <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
        <span>Сүйреу — айналдыру</span>
        <span className="opacity-40">·</span>
        <span>Дөңгелек — масштаб</span>
      </div>
    </div>
  );
}
