// Catalogue of the real PASCO devices that were 3D-scanned for this course.
// The GLB files in /public/models are decimated + meshopt-compressed versions
// of the original ~60 MB photogrammetry scans.
//
// The scans arrive unit-normalised and in an arbitrary orientation, so each
// entry carries a calibration: `rotation` brings the device upright and
// axis-aligned, `realSize` is the true length (m) of its longest axis once
// rotated. PascoModel uses both to place the scan at correct physical scale.

export type PascoKey = "smartCart" | "motionSensor" | "rotarySensor" | "smartGate";

export interface PascoSpec {
  key: PascoKey;
  url: string;
  /** Kazakh name shown in the simulation UI. */
  label: string;
  /** PASCO catalogue number. */
  partNo: string;
  /** What the device measures — shown in the equipment legend. */
  measures: string;
  /** True size (m) of the longest axis after `rotation` is applied. */
  realSize: number;
  /** Euler XYZ (rad) that makes the scan upright and axis-aligned. */
  rotation: [number, number, number];
}

// Calibration was read off orthographic renders of each scan. In their raw
// orientation all four already stand upright (+Y up); only the photogate needs
// turning so it straddles the track instead of standing along it.
const D = Math.PI / 180;

export const PASCO: Record<PascoKey, PascoSpec> = {
  smartCart: {
    key: "smartCart",
    url: "/models/pasco-smart-cart.glb",
    label: "PASCO Smart Cart",
    partNo: "ME-1240",
    measures: "орын ауыстыру, жылдамдық, үдеу, күш",
    // Long axis = X, wheels on −Y, plunger end on −X. The scan is a little
    // stockier than the catalogue cart, so it is sized so its width matches the
    // track rather than stretching its length to a nominal 25 cm.
    realSize: 0.21,
    rotation: [0, 0, 0],
  },
  motionSensor: {
    key: "motionSensor",
    url: "/models/pasco-motion-sensor.glb",
    label: "Wireless Motion Sensor",
    partNo: "PS-3219",
    measures: "қашықтық, жылдамдық, үдеу",
    // Ultrasonic transducer faces +Z; tallest axis = Y ≈ 8,5 см.
    realSize: 0.085,
    rotation: [0, 0, 0],
  },
  rotarySensor: {
    key: "rotarySensor",
    url: "/models/pasco-rotary-sensor.glb",
    label: "Rotary Motion Sensor",
    partNo: "PS-3225",
    measures: "бұрыш, бұрыштық жылдамдық, бұрыштық үдеу",
    // Shaft and three-step pulley point along +Z. The bounding box includes the
    // coiled cable (roughly 48% of the X extent), so this size spans body +
    // cable and leaves the body itself about 7,8 см wide.
    realSize: 0.16,
    rotation: [0, 0, 0],
  },
  smartGate: {
    key: "smartGate",
    url: "/models/pasco-smart-gate.glb",
    label: "Wireless Smart Gate",
    partNo: "PS-3207",
    measures: "уақыт аралығы, жылдамдық, период",
    // Scanned as an inverted U opening along X — turn it so the beam crosses
    // the track (which runs along X) instead of running parallel to it.
    realSize: 0.13,
    rotation: [0, 90 * D, 0],
  },
};

export const PASCO_LIST = Object.values(PASCO);
