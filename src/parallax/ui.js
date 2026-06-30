// ─── UI event handlers ────────────────────────────────────────────────────────
import { state } from './state.js';
import { frameGroup } from './renderer.js';
import { loadScene } from './scenes/index.js';
import { startWebcam, enableMouseMode, setStatus } from './tracking.js';

export function initUI() {
  const settingsEl    = document.getElementById('settings');
  const sensSlider    = document.getElementById('sens-slider');
  const smoothSlider  = document.getElementById('smooth-slider');
  const mirrorToggle  = document.getElementById('mirror-toggle');
  const mirrorYToggle = document.getElementById('mirrory-toggle');
  const video         = document.getElementById('webcam');

  // ── Permission overlay ────────────────────────────────────────────────────
  document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('permission-overlay').style.display = 'none';
    startWebcam();
  });
  document.getElementById('skip-btn').addEventListener('click', () => {
    document.getElementById('permission-overlay').style.display = 'none';
    enableMouseMode();
  });

  // ── Settings sliders & toggles ────────────────────────────────────────────
  sensSlider.addEventListener('input', () => {
    state.sensitivity = parseFloat(sensSlider.value);
    document.getElementById('sens-val').textContent = sensSlider.value;
  });

  smoothSlider.addEventListener('input', () => {
    const v = parseInt(smoothSlider.value) / 100;
    state.smoothing = v;
    document.getElementById('smooth-val').textContent = v.toFixed(2);
  });

  mirrorToggle.addEventListener('change', () => {
    state.mirrorX = mirrorToggle.checked;
    document.getElementById('mirror-val').textContent = state.mirrorX ? 'On' : 'Off';
  });

  mirrorYToggle.addEventListener('change', () => {
    state.mirrorY = mirrorYToggle.checked;
    document.getElementById('mirrory-val').textContent = state.mirrorY ? 'On' : 'Off';
  });

  document.getElementById('frame-toggle').addEventListener('change', (e) => {
    frameGroup.visible = e.target.checked;
    document.getElementById('frame-val').textContent = e.target.checked ? 'On' : 'Off';
  });

  // ── Scene buttons ─────────────────────────────────────────────────────────
  document.querySelectorAll('.scene-btn').forEach(btn => {
    btn.addEventListener('click', () => loadScene(parseInt(btn.dataset.scene)));
  });

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      state.paused = !state.paused;
      setStatus(
        state.paused ? 'Paused' : (state.faceDetected ? 'Tracking' : 'Active'),
        state.paused ? 'warning' : 'active'
      );
    }
    if (e.code === 'KeyS') settingsEl.classList.toggle('visible');
    if (e.code === 'KeyD') video.style.display = video.style.display === 'none' ? 'block' : 'none';
    if (e.code === 'KeyF') {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }
  });

  // ── Visibility change — auto-pause when tab hidden ────────────────────────
  document.addEventListener('visibilitychange', () => {
    state.paused = document.hidden;
  });
}
