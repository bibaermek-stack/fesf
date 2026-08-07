import * as THREE from "three";

/**
 * Shared material palette for the STEM objects.
 *
 * Materials are module-level singletons: a page can show a dozen objects made
 * of the same brushed metal, and giving each its own material would mean a
 * dozen shader programs compiled and a dozen uniform uploads per frame. Sharing
 * them lets three.js batch by program instead.
 *
 * Anything metallic needs an environment map to look like metal at all — an
 * unlit metal surface reflects nothing and renders black. `ObjectStage` mounts
 * a small procedural environment for exactly this reason.
 */

export const BRAND = "#3366ff";
export const VIOLET = "#8b5cf6";
export const CYAN = "#22d3ee";

const cache = new Map<string, THREE.Material>();

function memo<T extends THREE.Material>(key: string, make: () => T): T {
  const hit = cache.get(key);
  if (hit) return hit as T;
  const mat = make();
  cache.set(key, mat);
  return mat;
}

/** Polished metal — chassis, rocket bodies, instrument housings. */
export const chrome = (color = "#c9d4e4") =>
  memo(`chrome-${color}`, () =>
    new THREE.MeshStandardMaterial({ color, metalness: 0.92, roughness: 0.18 })
  );

/** Soft anodised metal — the default body material. */
export const anodised = (color = "#8ea3c4") =>
  memo(`anod-${color}`, () =>
    new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.35 })
  );

/** Matte plastic — panels, book covers, casings. */
export const plastic = (color: string) =>
  memo(`plastic-${color}`, () =>
    new THREE.MeshStandardMaterial({ color, metalness: 0.05, roughness: 0.65 })
  );

/** Emissive core — electrons, nodes, engine plumes, glowing edges. */
export const glow = (color: string, intensity = 1.6) =>
  memo(`glow-${color}-${intensity}`, () =>
    new THREE.MeshStandardMaterial({
      color,
      emissive: new THREE.Color(color),
      emissiveIntensity: intensity,
      metalness: 0,
      roughness: 0.4,
      toneMapped: false,
    })
  );

/** Clear glass — lenses, beakers, orbit shells. */
export const glass = (color = "#bcd8ff") =>
  memo(`glass-${color}`, () =>
    new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0,
      roughness: 0.06,
      transmission: 0.9,
      thickness: 0.4,
      transparent: true,
      opacity: 0.55,
      ior: 1.45,
    })
  );

/** Thin translucent film — orbit rings, holographic planes. */
export const film = (color: string, opacity = 0.35) =>
  memo(`film-${color}-${opacity}`, () =>
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
