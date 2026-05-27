/**
 * RadioWavesConstants.ts
 *
 * Tunable model constants, ported from the original sim's `constants.js` so the physics and
 * geometry behave identically. Lengths are in the original's arbitrary model units; the
 * model-view transform scales them to view pixels. (Electron-internal field tuning — the
 * B / static-field / history-length fudge factors — lives in Electron.ts, mirroring the source.)
 */

import { Bounds2, Range, Vector2 } from "scenerystack/dot";

const RadioWavesConstants = {
  // ── Wave propagation ──────────────────────────────────────────────────────
  // Field disturbances travel one history index per model unit; "c" sets how many history
  // indices shift per recorded frame (STEP_SIZE = floor(SPEED_OF_LIGHT)).
  SPEED_OF_LIGHT: 6,

  // ── Fixed-timestep loop ───────────────────────────────────────────────────
  // The original advanced the model in fixed 0.375 s slices, one slice every 0.030 s of
  // wall-clock time (a higher-framerate re-tuning of PhET's original 40 ms / 0.5 s).
  FRAME_DURATION: 0.03, // wall-clock seconds per fixed slice
  DT_PER_FRAME: 0.375, // model seconds advanced per slice
  MAX_CATCHUP_STEPS: 5, // cap slices per frame so a stutter can't spiral

  // ── World geometry ────────────────────────────────────────────────────────
  SIMULATION_BOUNDS: new Bounds2(0, 0, 1000, 700),
  SIMULATION_ORIGIN: new Vector2(108, 345),
  RECEIVING_X_OFFSET: 625, // receiving antenna sits this far to the right of the origin

  // ── Oscillator controls ───────────────────────────────────────────────────
  FREQUENCY_RANGE: new Range(0, 200),
  FREQUENCY_DEFAULT: 100,
  FREQUENCY_SCALE: 1 / 5000, // slider value → strategy frequency
  AMPLITUDE_RANGE: new Range(0, 100),
  AMPLITUDE_DEFAULT: 50,
} as const;

export default RadioWavesConstants;
