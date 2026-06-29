# Project Spec: Head-Tracking Parallax Webpage

## Concept

Webpage that tracks user's head position via webcam and shifts a 3D scene's perspective in real-time — creating the illusion of looking *through a window* into a 3D space.

Inspired by Johnny Lee's Wii remote head-tracking demo (2006) and the [HoloScope project discussed on r/SideProject](https://www.reddit.com/r/SideProject/comments/1rs969i/i_built_a_wallpaper_that_shifts_perspective_when/) 

---

## Core Mechanic

1. Webcam feeds into face/head detection model
2. Model outputs X/Y (and optionally Z) head position
3. Position maps to 3D camera offset in scene
4. Scene re-renders with shifted perspective — parallax depth illusion

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Face tracking | [MediaPipe FaceLandmarker](https://developers.google.com/mediapipe/solutions/vision/face_landmarker) or `face-api.js` | Runs client-side, no server, low latency |
| 3D rendering | Three.js | WebGL, perspective camera easy to manipulate |
| Framework | Vanilla JS or minimal Vite | No overhead |
| Camera access | `getUserMedia` | Standard browser API |

---

## Functional Requirements

### Head Tracking
- Request webcam via `getUserMedia`
- Process frames at 30fps (requestAnimationFrame or `setInterval`)
- Detect face bounding box or 3D landmarks
- Extract head center X/Y offset from frame center
- Optional: estimate depth (Z) from face bounding box size

### Perspective Shifting
- Three.js `PerspectiveCamera` moves opposite to head offset (parallax inversion)
- Camera X = `-headX * sensitivity`
- Camera Y = `-headY * sensitivity`
- Scene renders a 3D environment (layered planes, room, or custom asset)
- `lookAt(scene center)` maintained — camera always points at scene origin

### Smoothing
- Lerp/EMA filter on raw head position to reduce jitter:  
  `smoothed = lerp(smoothed, raw, 0.15)`
- Configurable smoothing factor (0.05 = heavy, 0.3 = responsive)

### Scene Options (V1)
- Layered 2D planes at different Z depths (parallax stacking)
- Or: simple 3D room / box scene
- Configurable background image/texture

---

## Non-Functional Requirements

- All processing client-side — no video sent to server
- Camera stream never leaves browser
- Graceful degradation if camera denied (static fallback)
- Runs at 60fps on mid-range hardware
- Works in Chrome/Firefox/Edge (no Safari webcam quirks assumed)

---

## UI / UX

- Full-screen canvas, no chrome
- Small status indicator: camera active / no face detected
- Settings panel (hidden by default):
  - Sensitivity slider
  - Smoothing slider
  - Scene selector
- Optional: keyboard shortcut to pause tracking (`Space`)

---

## Privacy Considerations (from forum feedback)
- Display clear camera permission prompt explaining local-only processing
- Show visible indicator when camera is active
- Pause camera when tab loses focus
- No analytics on webcam feed

---

## Stretch Goals (V2+)

| Feature | Notes |
|---|---|
| Mobile gyroscope support | Use `DeviceOrientationEvent` — no camera needed on mobile |
| Multi-layer parallax images | User uploads image, auto-slice into depth layers |
| Portrait/person in scene | "Mona Lisa effect" — person appears to follow viewer |
| Dual monitor support | Extend scene across displays |
| Wallpaper mode | Electron wrapper, renders behind desktop icons |

---

## Out of Scope (V1)

- Multi-viewer support (perspective is inherently single-POV)
- Server-side processing
- Native desktop app
- Meeting app camera arbitration

---

## Milestones

| Milestone | Deliverable |
|---|---|
| M1 | Webcam access + face bounding box drawn on canvas |
| M2 | Head X/Y mapped to Three.js camera offset, basic cube scene |
| M3 | Smoothing, sensitivity control, jitter reduction |
| M4 | Polished 3D scene (layered planes or room) |
| M5 | Privacy UI, settings panel, fallback states |
| M6 | Mobile gyroscope path |
