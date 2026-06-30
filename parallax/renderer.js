// ─── Renderer, camera, scene, and animation loop ─────────────────────────────
import * as THREE from 'three';
import { state } from './state.js';

// ── Core Three.js objects ────────────────────────────────────────────────────
const canvas = document.getElementById('three-canvas');

export const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

export const scene  = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 0, 8);

// Persistent window-frame group — survives scene switches
export const frameGroup = new THREE.Group();
scene.add(frameGroup);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ── Animation loop ───────────────────────────────────────────────────────────
const basePos    = new THREE.Vector3(0, 0, 8);
const lookTarget = new THREE.Vector3(0, 0, 0);
let t = 0;

// activeScene is set by scenes/index.js via setActiveScene()
let activeScene = null;

export function setActiveScene(sceneObj) {
  activeScene = sceneObj;
}

export function startRenderLoop() {
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;

    if (!state.paused) {
      state.headX += (state.rawX - state.headX) * state.smoothing;
      state.headY += (state.rawY - state.headY) * state.smoothing;
    }

    const camX = -state.headX * state.sensitivity;
    const camY = -state.headY * state.sensitivity * 0.6;
    camera.position.set(basePos.x + camX, basePos.y + camY, basePos.z);
    camera.lookAt(lookTarget);

    if (activeScene && activeScene.animateFn) activeScene.animateFn(t);

    renderer.render(scene, camera);
  }
  animate();
}
