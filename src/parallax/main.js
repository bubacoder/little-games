// ─── Entry point ──────────────────────────────────────────────────────────────
import { startRenderLoop } from './renderer.js';
import { loadScene } from './scenes/index.js';
import { initUI } from './ui.js';

// Boot sequence:
// 1. Load initial scene (before render loop so scene is ready on first frame)
// 2. Wire up all UI / event handlers
// 3. Start the render / animation loop
loadScene(1);
initUI();
startRenderLoop();
