"use client";

// Renders one of the scanned PASCO devices at true physical scale.
//
// The raw scans are unit-normalised and arbitrarily oriented, so we rotate
// first (per the catalogue calibration), then measure the rotated bounding box
// and scale it down to the device's real size in metres. Everything else in the
// scenes is modelled in metres, so a cart really is 25 cm long next to a 1.2 m
// track.

import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { PascoSpec } from "./pascoCatalog";

/** Rotate → measure → centre → scale to real size. Shared by both exports. */
function normalise(scene: THREE.Object3D, spec: PascoSpec) {
  const inner = scene.clone(true);
  inner.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (mat) {
      // Scans come in fully metallic, which reads as near-black under our lights.
      mat.metalness = Math.min(mat.metalness ?? 1, 0.35);
      mat.roughness = Math.max(mat.roughness ?? 1, 0.45);
    }
  });

  // Apply the calibration rotation, then measure what we actually got.
  const aligned = new THREE.Group();
  aligned.add(inner);
  aligned.rotation.set(...spec.rotation);
  aligned.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(aligned);
  const size = box.getSize(new THREE.Vector3());
  const centre = box.getCenter(new THREE.Vector3());
  const factor = spec.realSize / Math.max(size.x, size.y, size.z);

  // Shift so the rotated bounding box is centred on the origin.
  aligned.position.copy(centre).multiplyScalar(-1);

  const outer = new THREE.Group();
  outer.add(aligned);
  outer.scale.setScalar(factor);

  return { outer, size: size.multiplyScalar(factor) };
}

export interface PascoModelProps {
  spec: PascoSpec;
  /** Sit the device on y = 0 instead of centring it on the origin. */
  groundAlign?: boolean;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function PascoModel({
  spec,
  groundAlign = true,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: PascoModelProps) {
  // useDraco = false keeps the loader from reaching out to the gstatic CDN;
  // useMeshopt = true uses the decoder bundled with three-stdlib.
  const { scene } = useGLTF(spec.url, false, true);
  const { outer, size } = useMemo(() => normalise(scene, spec), [scene, spec]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group position={[0, groundAlign ? size.y / 2 : 0, 0]}>
        <primitive object={outer} />
      </group>
    </group>
  );
}

/** Rotated-and-scaled footprint of a device, useful for laying scenes out. */
export function usePascoSize(spec: PascoSpec): THREE.Vector3 {
  const { scene } = useGLTF(spec.url, false, true);
  return useMemo(() => normalise(scene, spec).size, [scene, spec]);
}

export function preloadPasco(spec: PascoSpec) {
  useGLTF.preload(spec.url, false, true);
}
