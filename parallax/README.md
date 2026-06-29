# Parallax Window

A browser demo that uses your webcam to track head position and shift a 3D scene's perspective in real time — creating the illusion of looking through a window into another world.

Inspired by [Johnny Lee's Wii remote head-tracking demo](https://youtu.be/Jd3-eiid-Uw) and the [HoloScope project](https://holoscape.yktis.com/).

## How it works

1. Webcam feed is processed locally by **MediaPipe FaceLandmarker**
2. Nose-tip position is extracted at ~30 fps
3. Head offset from center is mapped to the **Three.js perspective camera**
4. Camera shifts opposite to head movement — the parallax inversion creates the window effect

No video is ever sent to a server. All processing runs in the browser.

## Running

Requires a local HTTP server (browser blocks `getUserMedia` on `file://`).

```bash
cd game/parallax
python3 -m http.server 8765
# then open http://localhost:8765
```

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `S` | Toggle settings panel |
| `F` | Toggle fullscreen |
| `Space` | Pause / resume tracking |
| `D` | Show / hide debug webcam feed |

## Settings

| Setting | Description |
|---------|-------------|
| Scene | Switch between the three scenes |
| Sensitivity | How far the camera shifts per unit of head movement |
| Smoothing | Lerp factor — lower = smoother but more lag |
| Mirror X | Flip horizontal axis (use if left/right is inverted) |
| Mirror Y | Flip vertical axis (use if up/down is inverted) |
| Window Frame | Show or hide the window frame overlay |

## Scenes

| Scene | Description |
|-------|-------------|
| **Space** | Floating geometric objects in a starfield, viewed through a dark metal window frame |
| **Forest** | Moonlit night forest with deer, an owl, rabbits, and fireflies — wooden frame |
| **Cockpit** | Spaceship cockpit with instrument panels, glowing controls, a ringed planet, and incoming asteroids |
| **Synthwave** | Retro 80s neon grid floor, striped sunset sun, palm tree silhouettes, city skyline, cyan speed streaks |

## Mouse fallback

Click **Skip (mouse mode)** on the permission screen to drive the parallax with mouse movement instead of the webcam.

## Tech stack

- [Three.js](https://threejs.org/) — 3D rendering via WebGL
- [MediaPipe Tasks Vision](https://developers.google.com/mediapipe/solutions/vision/face_landmarker) — client-side face landmark detection
- Vanilla JS, no build step — single `index.html`
