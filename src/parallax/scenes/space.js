// ─── Scene 1: Space / Geometric ──────────────────────────────────────────────
import * as THREE from 'three';

/**
 * @param {THREE.Scene} scene
 * @param {THREE.Group} frameGroup  - persistent window-frame group
 * @returns {{ animateFn(t: number): void, cleanup(): void }}
 */
export function buildScene1(scene, frameGroup) {
  scene.background = new THREE.Color(0x0a0a14);
  scene.fog = new THREE.Fog(0x0a0a14, 18, 35);

  const objects = [];

  // Stars
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1800;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 60;
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, sizeAttenuation: true }));
  stars.position.z = -20;
  scene.add(stars);

  // Window frame (dark metal)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e1e2e, roughness: 0.8, metalness: 0.3 });
  function bar(w, h, d, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);
    m.position.set(x, y, z);
    frameGroup.add(m);
  }
  const fz = 5.5, fw = 9, fh = 6.5;
  bar(fw + 0.4, 0.35, 0.35,  0,       fh / 2,  fz);
  bar(fw + 0.4, 0.35, 0.35,  0,      -fh / 2,  fz);
  bar(0.35, fh + 0.35, 0.35, -fw / 2, 0,       fz);
  bar(0.35, fh + 0.35, 0.35,  fw / 2, 0,       fz);
  bar(fw + 0.4, 0.2,  0.2,   0,       0,       fz);
  bar(0.2, fh + 0.35, 0.2,   0,       0,       fz);

  // Floating geometric objects
  function addObj(geo, color, x, y, z) {
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.6 }));
    m.position.set(x, y, z);
    m.castShadow = true;
    scene.add(m);
    objects.push(m);
    return m;
  }
  addObj(new THREE.IcosahedronGeometry(0.7, 0),      0x818cf8,  0,     0,    -2);
  addObj(new THREE.BoxGeometry(0.9, 0.9, 0.9),       0x34d399, -3,     1.2,  -4);
  addObj(new THREE.OctahedronGeometry(0.6),           0xf472b6,  3,    -1,   -3);
  addObj(new THREE.TorusGeometry(0.5, 0.18, 16, 40), 0xfbbf24, -2,    -1.5,  -1);
  addObj(new THREE.ConeGeometry(0.5, 1.1, 6),        0x38bdf8,  2.5,   1.5,  -2.5);

  const grid = new THREE.GridHelper(30, 30, 0x1e293b, 0x1e293b);
  grid.position.set(0, -4, -10);
  scene.add(grid);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const pl1 = new THREE.PointLight(0x818cf8, 40, 20);
  pl1.position.set(0, 4, 2);
  pl1.castShadow = true;
  scene.add(pl1);
  const pl2 = new THREE.PointLight(0x34d399, 25, 20);
  pl2.position.set(-5, -2, -5);
  scene.add(pl2);
  const dl = new THREE.DirectionalLight(0xffffff, 0.8);
  dl.position.set(5, 10, 5);
  scene.add(dl);

  return {
    animateFn(t) {
      objects.forEach((obj, i) => {
        obj.rotation.x += 0.003 + i * 0.0005;
        obj.rotation.y += 0.005 + i * 0.0003;
      });
    },
    cleanup() {}
  };
}
