// ─── Shared application state ────────────────────────────────────────────────
// Single mutable object — modules import and mutate it directly.
// No framework; plain reference sharing is intentional for a no-build project.

export const state = {
  headX: 0, headY: 0,
  rawX:  0, rawY:  0,
  sensitivity: 8,
  smoothing: 0.12,
  paused: false,
  mirrorX: true,
  mirrorY: true,
  cameraMode: 'webcam', // 'webcam' | 'mouse'
  faceDetected: false,
  currentScene: 1,
};
