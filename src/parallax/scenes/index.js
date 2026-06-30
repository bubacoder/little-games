// ─── Scene registry: clearScene, loadScene ───────────────────────────────────
import { scene, frameGroup, setActiveScene } from '../renderer.js';
import { state } from '../state.js';
import { buildScene1 } from './space.js';
import { buildScene2 } from './forest.js';
import { buildScene3 } from './cockpit.js';
import { buildScene4 } from './synthwave.js';

let _activeScene = null;

export function clearScene() {
  if (_activeScene && _activeScene.cleanup) _activeScene.cleanup();

  // Remove all objects except frameGroup
  const toRemove = scene.children.filter(o => o !== frameGroup);
  toRemove.forEach(obj => {
    scene.remove(obj);
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
      else obj.material.dispose();
    }
  });

  // Clear frame bars from previous scene
  while (frameGroup.children.length > 0) {
    const obj = frameGroup.children[0];
    frameGroup.remove(obj);
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
  }

  scene.fog = null;
  scene.background = null;
}

export function loadScene(id) {
  clearScene();
  state.currentScene = id;

  if      (id === 1) _activeScene = buildScene1(scene, frameGroup);
  else if (id === 2) _activeScene = buildScene2(scene, frameGroup);
  else if (id === 3) _activeScene = buildScene3(scene, frameGroup);
  else if (id === 4) _activeScene = buildScene4(scene, frameGroup);

  // Pass to renderer so the animate loop can call animateFn
  setActiveScene(_activeScene);

  // Update scene button states
  document.querySelectorAll('.scene-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.scene) === id);
  });
}
