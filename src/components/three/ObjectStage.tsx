"use client";

// Shared 3D stage for the marketing surfaces.
//
// A page can show a dozen STEM objects, and giving each its own <Canvas> would
// mean a dozen WebGL contexts — browsers cap out around 16 and start evicting
// the oldest, so the lesson simulations would go black once enough cards were
// on screen. drei's <View> solves this properly: one canvas fixed behind the
// page, and each <StemObject> just reserves a rectangle that the shared
// renderer draws into with its own camera and scene graph.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, View } from "@react-three/drei";
import { Floating } from "./Floating";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  Atom,
  DnaHelix,
  LabGlassware,
  Microscope,
  Molecule,
  SolarSystem,
  Telescope,
} from "./objects/Science";
import {
  BookStack,
  CircuitBoard,
  Drone,
  GeometrySet,
  Microchip,
  NeuralSphere,
  RobotArm,
  Rocket,
  Satellite,
} from "./objects/Tech";

export type StemObjectKind =
  | "atom"
  | "dna"
  | "solar"
  | "molecule"
  | "glassware"
  | "microscope"
  | "telescope"
  | "microchip"
  | "circuit"
  | "neural"
  | "rocket"
  | "satellite"
  | "drone"
  | "robot"
  | "books"
  | "geometry";

const REGISTRY: Record<StemObjectKind, (p: { scale?: number }) => JSX.Element> = {
  atom: Atom,
  dna: DnaHelix,
  solar: SolarSystem,
  molecule: Molecule,
  glassware: LabGlassware,
  microscope: Microscope,
  telescope: Telescope,
  microchip: Microchip,
  circuit: CircuitBoard,
  neural: NeuralSphere,
  rocket: Rocket,
  satellite: Satellite,
  drone: Drone,
  robot: RobotArm,
  books: BookStack,
  geometry: GeometrySet,
};

interface StageApi {
  /** True once the shared canvas exists and views may render into it. */
  ready: boolean;
  /** Called by each <StemObject> on mount/unmount. */
  register: () => () => void;
}

const StageContext = createContext<StageApi>({ ready: false, register: () => () => {} });

/**
 * Lighting rig shared by every view.
 *
 * The procedural environment is the important part: metal with no environment
 * to reflect renders black, and half these objects are chrome. Baking a tiny
 * 64px cubemap from a few coloured planes costs one frame and avoids fetching
 * an HDR from a CDN.
 */
function Rig() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={2.1} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#8fb4ff" />
      <pointLight position={[0, -2, 2]} intensity={0.5} color="#a78bfa" />
      <Environment resolution={64} frames={1}>
        <mesh scale={30}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshBasicMaterial color="#111a33" side={THREE.BackSide} />
        </mesh>
        {/* Key softbox */}
        <mesh position={[0, 10, 4]} rotation={[Math.PI / 2.2, 0, 0]} scale={[12, 10, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Brand-coloured rim lights, so reflections carry the palette */}
        <mesh position={[10, 1, 4]} scale={[7, 7, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#3f6bff" />
        </mesh>
        <mesh position={[-10, 2, -4]} scale={[7, 7, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      </Environment>
    </>
  );
}

/**
 * Mounts the single shared canvas. Place once, high in the tree; it fixes
 * itself to the viewport and only paints where a <StemObject> has reserved
 * space, so it is invisible on pages that use none.
 */
export function ObjectStageProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null!);
  const [ready, setReady] = useState(false);
  // Reference count of mounted <StemObject>s. The canvas — and with it a WebGL
  // context and a render loop — only exists while at least one object is on
  // screen, so the dashboard and teacher pages pay nothing for a stage they
  // never use.
  const [count, setCount] = useState(0);

  const register = useCallback(() => {
    setCount((n) => n + 1);
    return () => setCount((n) => Math.max(0, n - 1));
  }, []);

  const api = useMemo<StageApi>(() => ({ ready: ready && count > 0, register }), [ready, count, register]);

  return (
    <StageContext.Provider value={api}>
      <div ref={ref} className="contents">
        {children}
        {count > 0 && (
          <Canvas
            shadows
            // Cap DPR at 1.6: past that the fill cost of a dozen views
            // outweighs any visible sharpening on these small viewports.
            dpr={[1, 1.6]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            eventSource={ref}
            className="pointer-events-none !fixed inset-0 -z-[5]"
            style={{ position: "fixed" }}
            onCreated={() => setReady(true)}
          >
            <View.Port />
          </Canvas>
        )}
      </div>
    </StageContext.Provider>
  );
}

/**
 * Reserves a rectangle in the page that the shared canvas draws one STEM
 * object into. Falls back to a static, non-animating pose under reduced
 * motion, and to an empty box if the stage provider is missing.
 */
export function StemObject({
  kind,
  className = "",
  scale = 1,
  /** Camera distance; larger frames more of the object. */
  distance = 3.6,
  spin = 0,
  amplitude = 0.1,
  speed = 1,
  tilt = 0.24,
  phase = 0,
}: {
  kind: StemObjectKind;
  className?: string;
  scale?: number;
  distance?: number;
  spin?: number;
  amplitude?: number;
  speed?: number;
  tilt?: number;
  phase?: number;
}) {
  const { ready, register } = useContext(StageContext);
  const reduced = useReducedMotion();
  const Model = REGISTRY[kind];
  const trackRef = useRef<HTMLDivElement>(null!);

  // Registering in an effect (not during render) keeps the provider's state
  // update out of the render phase.
  useEffect(() => register(), [register]);

  const content = useMemo(
    () => (
      <>
        <PerspectiveCamera makeDefault fov={38} position={[0, 0.35, distance]} />
        <Rig />
        <Floating
          amplitude={amplitude}
          speed={speed}
          tilt={tilt}
          spin={spin}
          phase={phase}
          frozen={reduced}
        >
          <Model scale={scale} />
        </Floating>
      </>
    ),
    [Model, amplitude, distance, phase, reduced, scale, speed, spin, tilt]
  );

  return (
    <div ref={trackRef} className={className} aria-hidden>
      {ready && <View track={trackRef}>{content}</View>}
    </div>
  );
}
