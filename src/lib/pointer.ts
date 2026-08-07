/**
 * Viewport-normalised cursor position (-1..1 on both axes), tracked once for
 * the whole app.
 *
 * The 3D objects cannot use r3f's own `state.pointer`: each drei <View/> runs
 * in its own portal store and rebinds the shared canvas's event target to its
 * tracked element, so with a dozen views on screen only one of them has a
 * meaningful pointer at any moment. A single passive window listener gives
 * every object the same, always-correct value.
 *
 * Exported as a mutable object rather than state so `useFrame` can read it
 * without causing renders.
 */
export const pointer = { x: 0, y: 0 };

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );
}
