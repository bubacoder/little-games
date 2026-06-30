// ─── Scene 4: Synthwave City ──────────────────────────────────────────────────
import * as THREE from 'three';

/**
 * @param {THREE.Scene} scene
 * @param {THREE.Group} frameGroup  - persistent window-frame group
 * @returns {{ animateFn(t: number): void, cleanup(): void }}
 */
export function buildScene4(scene, frameGroup) {
  scene.background = new THREE.Color(0x0a0015);
  scene.fog = new THREE.FogExp2(0x0a0015, 0.032);

  // ── Horizon glow ─────────────────────────────────────────────────────────
  const horizonMat = new THREE.MeshBasicMaterial({ color: 0xff0080, transparent: true, opacity: 0.18 });
  const horizon = new THREE.Mesh(new THREE.PlaneGeometry(80, 6), horizonMat);
  horizon.position.set(0, -0.5, -38);
  scene.add(horizon);

  const horizonMat2 = new THREE.MeshBasicMaterial({ color: 0x6600cc, transparent: true, opacity: 0.22 });
  const horizon2 = new THREE.Mesh(new THREE.PlaneGeometry(80, 10), horizonMat2);
  horizon2.position.set(0, 2, -40);
  scene.add(horizon2);

  // ── Retro sun ─────────────────────────────────────────────────────────────
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xff4488 });
  const sun = new THREE.Mesh(new THREE.CircleGeometry(3.5, 64), sunMat);
  sun.position.set(0, 1.2, -36);
  scene.add(sun);

  const lineMat = new THREE.MeshBasicMaterial({ color: 0x0a0015 });
  const lineCount = 10;
  for (let i = 0; i < lineCount; i++) {
    const frac = i / lineCount;
    const h = 0.08 + frac * 0.18;
    const line = new THREE.Mesh(new THREE.PlaneGeometry(7.2, h), lineMat);
    line.position.set(0, 1.2 - 1.0 + frac * 2.2 - 1.1, -35.9);
    scene.add(line);
  }

  const haloMat = new THREE.MeshBasicMaterial({ color: 0xff0066, transparent: true, opacity: 0.12 });
  const halo = new THREE.Mesh(new THREE.CircleGeometry(7, 32), haloMat);
  halo.position.set(0, 1.2, -37);
  scene.add(halo);

  // ── Stars ─────────────────────────────────────────────────────────────────
  const sGeo = new THREE.BufferGeometry();
  const sCount = 1200;
  const sPos = new Float32Array(sCount * 3);
  for (let i = 0; i < sCount; i++) {
    sPos[i * 3]     = (Math.random() - 0.5) * 100;
    sPos[i * 3 + 1] = 4 + Math.random() * 30;
    sPos[i * 3 + 2] = -10 - Math.random() * 60;
  }
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, sizeAttenuation: true })));

  // ── Neon grid floor ───────────────────────────────────────────────────────
  const gridMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.55 });
  const farGrid = new THREE.Mesh(new THREE.PlaneGeometry(60, 60, 24, 24), gridMat);
  farGrid.rotation.x = -Math.PI / 2;
  farGrid.position.set(0, -3.5, -18);
  scene.add(farGrid);

  const midGridMat = new THREE.MeshBasicMaterial({ color: 0xcc00ff, wireframe: true, transparent: true, opacity: 0.45 });
  const midGrid = new THREE.Mesh(new THREE.PlaneGeometry(20, 10, 12, 8), midGridMat);
  midGrid.rotation.x = -Math.PI / 2;
  midGrid.position.set(0, -3.5, -4);
  scene.add(midGrid);

  const floorMat = new THREE.MeshStandardMaterial({ color: 0x080010, roughness: 0.8, metalness: 0.4 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -3.51, 0);
  scene.add(floor);

  const horizLineMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  const horizLine = new THREE.Mesh(new THREE.PlaneGeometry(60, 0.06), horizLineMat);
  horizLine.position.set(0, -3.5, -30);
  scene.add(horizLine);

  // Vertical perspective lines
  const vLineMat = new THREE.MeshBasicMaterial({ color: 0xff00cc, transparent: true, opacity: 0.5 });
  [-6, -4, -2, 0, 2, 4, 6].forEach(x => {
    const vl = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 35), vLineMat);
    vl.rotation.x = -Math.PI / 2;
    vl.rotation.z = Math.PI / 2;
    vl.position.set(x, -3.49, -15);
    scene.add(vl);
  });

  // ── Palm tree silhouettes ─────────────────────────────────────────────────
  function makePalm(x, z, scale = 1) {
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color: 0x0a0015 });

    const segments = 5;
    let cy = -3.5, cx = 0;
    for (let i = 0; i < segments; i++) {
      const r = (0.12 - i * 0.015) * scale;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 0.015 * scale, 0.9 * scale, 6), mat);
      const lean = (i * 0.06 - 0.1) * scale;
      trunk.position.set(cx + lean * 0.5, cy + 0.45 * scale, 0);
      trunk.rotation.z = lean * 0.15;
      g.add(trunk);
      cy += 0.85 * scale;
      cx += lean * 0.15;
    }

    const topY = cy;
    const topX = cx;
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.ConeGeometry(0.08 * scale, 1.6 * scale, 4), mat);
      frond.position.set(
        topX + Math.cos(angle) * 0.5 * scale,
        topY + 0.4 * scale,
        Math.sin(angle) * 0.3 * scale
      );
      frond.rotation.z = Math.cos(angle) * 0.9;
      frond.rotation.x = Math.sin(angle) * 0.5;
      g.add(frond);
    }

    g.position.set(x, 0, z);
    scene.add(g);
    return g;
  }

  makePalm(-7,  -2, 1.3);
  makePalm( 7,  -2, 1.3);
  makePalm(-9, -10, 1.0);
  makePalm( 9, -10, 1.0);
  makePalm(-5, -20, 0.7);
  makePalm( 5, -20, 0.7);
  makePalm(-11,-18, 0.6);
  makePalm( 11,-18, 0.6);

  // ── City silhouette ───────────────────────────────────────────────────────
  const cityMat = new THREE.MeshBasicMaterial({ color: 0x0a0015 });
  const buildings = [
    [-14, 2.5, 0.8], [-11, 3.5, 1.0], [-8, 2.0, 0.7], [-6, 4.0, 0.6],
    [-4,  1.8, 0.5], [-2, 3.0, 0.8],  [0,  5.0, 0.9], [2,  2.8, 0.6],
    [4,   3.5, 0.7], [6,  1.5, 0.5],  [8,  4.2, 0.9], [11, 2.8, 1.0],
    [14,  3.0, 0.8],
  ];
  buildings.forEach(([bx, bh, bw]) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(bw * 2, bh, 0.4), cityMat);
    b.position.set(bx, -3.5 + bh / 2 - 0.5, -28);
    scene.add(b);

    if (Math.random() > 0.4) {
      const wMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0xff00ff : 0x00ffff,
        transparent: true, opacity: 0.7
      });
      const win = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.12), wMat);
      win.position.set(bx + (Math.random() - 0.5) * bw, -3.5 + bh * 0.6, -27.8);
      scene.add(win);
    }
  });

  // ── Neon window frame ─────────────────────────────────────────────────────
  const neonFrameMat = new THREE.MeshStandardMaterial({
    color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2, roughness: 0.1
  });
  function nbar(w, h, d, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), neonFrameMat);
    m.position.set(x, y, z);
    frameGroup.add(m);
  }
  const fz = 5.5, fw = 9, fh = 6.5;
  nbar(fw + 0.4, 0.2, 0.2,  0,       fh / 2, fz);
  nbar(fw + 0.4, 0.2, 0.2,  0,      -fh / 2, fz);
  nbar(0.2, fh + 0.2, 0.2, -fw / 2,  0,      fz);
  nbar(0.2, fh + 0.2, 0.2,  fw / 2,  0,      fz);

  // ── Speed streaks ─────────────────────────────────────────────────────────
  const streaks = [];
  const streakMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
  for (let i = 0; i < 18; i++) {
    const len = 0.3 + Math.random() * 1.2;
    const streak = new THREE.Mesh(new THREE.PlaneGeometry(0.04, len), streakMat);
    streak.position.set(
      (Math.random() - 0.5) * 16,
      -1 + Math.random() * 4,
      -5 - Math.random() * 20
    );
    streak.rotation.x = Math.PI / 2;
    streak.userData.speed = 0.05 + Math.random() * 0.12;
    scene.add(streak);
    streaks.push(streak);
  }

  // ── Lights ────────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x110022, 1.0));

  const sunGlow = new THREE.PointLight(0xff0088, 20, 40);
  sunGlow.position.set(0, 1.2, -30);
  scene.add(sunGlow);

  const magentaFill = new THREE.PointLight(0xff00ff, 12, 20);
  magentaFill.position.set(-5, 2, -5);
  scene.add(magentaFill);

  const cyanFill = new THREE.PointLight(0x00ffff, 10, 18);
  cyanFill.position.set(5, -1, -3);
  scene.add(cyanFill);

  const groundGlow = new THREE.PointLight(0xcc00ff, 8, 12);
  groundGlow.position.set(0, -2, 0);
  scene.add(groundGlow);

  return {
    animateFn(time) {
      streaks.forEach(s => {
        s.position.z += s.userData.speed;
        if (s.position.z > 6) {
          s.position.z = -22;
          s.position.x = (Math.random() - 0.5) * 16;
          s.position.y = -1 + Math.random() * 4;
        }
      });

      sunGlow.intensity      = 18 + Math.sin(time * 0.8) * 4;
      farGrid.material.opacity  = 0.45 + Math.sin(time * 0.5) * 0.1;
      midGrid.material.opacity  = 0.35 + Math.sin(time * 0.7 + 1) * 0.1;
      magentaFill.intensity  = 10 + Math.sin(time * 1.1) * 3;
      cyanFill.intensity     = 8  + Math.sin(time * 1.3 + 2) * 3;
    },
    cleanup() {}
  };
}
