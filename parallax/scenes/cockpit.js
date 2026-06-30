// ─── Scene 3: Spaceship Cockpit ───────────────────────────────────────────────
import * as THREE from 'three';

/**
 * @param {THREE.Scene} scene
 * @param {THREE.Group} frameGroup  - persistent window-frame group
 * @returns {{ animateFn(t: number): void, cleanup(): void }}
 */
export function buildScene3(scene, frameGroup) {
  scene.background = new THREE.Color(0x000008);
  scene.fog = new THREE.Fog(0x000008, 30, 80);

  const objects = [];

  // ── Space backdrop ────────────────────────────────────────────────────────
  const sGeo = new THREE.BufferGeometry();
  const sCount = 3000;
  const sPos = new Float32Array(sCount * 3);
  for (let i = 0; i < sCount * 3; i++) sPos[i] = (Math.random() - 0.5) * 120;
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const starField = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, sizeAttenuation: true }));
  starField.position.z = -40;
  scene.add(starField);

  // Nebula blobs
  const nebulaMat1 = new THREE.MeshBasicMaterial({ color: 0x220066, transparent: true, opacity: 0.18 });
  const nebulaMat2 = new THREE.MeshBasicMaterial({ color: 0x003355, transparent: true, opacity: 0.14 });
  [[-8, 3, -50], [6, -2, -55], [0, 5, -60]].forEach(([x, y, z], i) => {
    const nb = new THREE.Mesh(new THREE.SphereGeometry(6 + i * 2, 8, 8), i % 2 === 0 ? nebulaMat1 : nebulaMat2);
    nb.position.set(x, y, z);
    scene.add(nb);
  });

  // Planet + ring
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(4.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x3a5a8a, roughness: 0.7, metalness: 0.1 })
  );
  planet.position.set(8, 2, -35);
  scene.add(planet);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(6.5, 0.4, 4, 60),
    new THREE.MeshStandardMaterial({ color: 0x88aacc, roughness: 0.6, transparent: true, opacity: 0.6 })
  );
  ring.rotation.x = 1.1;
  ring.position.set(8, 2, -35);
  scene.add(ring);

  // ── Material palette ──────────────────────────────────────────────────────
  const metalDark  = new THREE.MeshStandardMaterial({ color: 0x22232e, roughness: 0.4, metalness: 0.85 });
  const metalMid   = new THREE.MeshStandardMaterial({ color: 0x383950, roughness: 0.45, metalness: 0.75 });
  const metalLight = new THREE.MeshStandardMaterial({ color: 0x5a5c70, roughness: 0.5, metalness: 0.6 });
  const glowBlue   = new THREE.MeshStandardMaterial({ color: 0x44aaff, emissive: 0x2266cc, emissiveIntensity: 2.5, roughness: 0.1 });
  const glowOrange = new THREE.MeshStandardMaterial({ color: 0xff8833, emissive: 0xcc4400, emissiveIntensity: 2.5, roughness: 0.1 });
  const glowGreen  = new THREE.MeshStandardMaterial({ color: 0x44ffaa, emissive: 0x00cc66, emissiveIntensity: 2.5, roughness: 0.1 });
  const glowRed    = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xcc0000, emissiveIntensity: 2.5, roughness: 0.1 });
  const glowYellow = new THREE.MeshStandardMaterial({ color: 0xffee44, emissive: 0xddaa00, emissiveIntensity: 2.5, roughness: 0.1 });
  const glass      = new THREE.MeshStandardMaterial({ color: 0x6688aa, roughness: 0, metalness: 0.1, transparent: true, opacity: 0.12 });

  // ── Windshield frame → frameGroup ─────────────────────────────────────────
  const archMat = new THREE.MeshStandardMaterial({ color: 0x30313f, roughness: 0.35, metalness: 0.9 });
  function fbar(w, h, d, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), archMat);
    m.position.set(x, y, z); frameGroup.add(m);
  }
  const fz = 5.5, fw = 9, fh = 6.5;
  fbar(fw + 0.4, 0.45, 0.45,  0,       fh / 2, fz);
  fbar(fw + 0.4, 0.45, 0.45,  0,      -fh / 2, fz);
  fbar(0.45, fh + 0.45, 0.45, -fw / 2, 0,      fz);
  fbar(0.45, fh + 0.45, 0.45,  fw / 2, 0,      fz);
  fbar(fw + 0.4, 0.25, 0.25,   0,       0,      fz);
  fbar(0.25, fh + 0.45, 0.25,  0,       0,      fz);
  [[-2.6, 1], [2.6, 1], [-2.6, -1.5], [2.6, -1.5]].forEach(([px, py]) => {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 3.8), glass);
    pane.position.set(px, py, fz - 0.05); frameGroup.add(pane);
  });

  // ── Ceiling ───────────────────────────────────────────────────────────────
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(12, 0.35, 8), metalDark);
  ceiling.position.set(0, 4.4, 1.5);
  scene.add(ceiling);

  const stripMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaddff, emissiveIntensity: 3 });
  [-3.5, 0, 3.5].forEach(x => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 6), stripMat);
    strip.position.set(x, 4.2, 1.5);
    scene.add(strip);
  });

  // ── Side walls ────────────────────────────────────────────────────────────
  [-5.4, 5.4].forEach((x, side) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 9, 8), metalDark);
    wall.position.set(x, 0, 1.5);
    scene.add(wall);

    const wsMat = new THREE.MeshStandardMaterial({
      color: side === 0 ? 0x003366 : 0x330055,
      emissive: side === 0 ? 0x0055aa : 0x550088,
      emissiveIntensity: 2
    });
    const ws = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.5), wsMat);
    ws.rotation.y = side === 0 ? Math.PI / 2 : -Math.PI / 2;
    ws.position.set(side === 0 ? -5.2 : 5.2, 0.8, 1.5);
    scene.add(ws);
    objects.push(ws);
  });

  // ── Floor ─────────────────────────────────────────────────────────────────
  const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 8), metalMid);
  floor.position.set(0, -4.9, 1.5);
  scene.add(floor);

  // ── Main dashboard ────────────────────────────────────────────────────────
  const dash = new THREE.Mesh(new THREE.BoxGeometry(10.5, 1.6, 2.8), metalMid);
  dash.position.set(0, -3.7, 3.2);
  scene.add(dash);

  const dashTop = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.1, 2.8), metalLight);
  dashTop.position.set(0, -2.9, 3.2);
  scene.add(dashTop);

  // ── Side consoles ─────────────────────────────────────────────────────────
  const consoleMats = [
    new THREE.MeshStandardMaterial({ color: 0x1a2a3a, roughness: 0.4, metalness: 0.8 }),
    new THREE.MeshStandardMaterial({ color: 0x2a1a2a, roughness: 0.4, metalness: 0.8 }),
  ];
  [-4.6, 4.6].forEach((x, i) => {
    const con = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2.4), consoleMats[i]);
    con.position.set(x, -1.8, 3.3);
    scene.add(con);

    const scrMat = new THREE.MeshStandardMaterial({
      color: i === 0 ? 0x004488 : 0x440088,
      emissive: i === 0 ? 0x0088ff : 0x8800ff,
      emissiveIntensity: 3
    });
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.8), scrMat);
    scr.position.set(x, -1.6, 4.42);
    scene.add(scr);
    objects.push(scr);

    for (let row = 0; row < 4; row++) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.04, 0.01),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.5 })
      );
      line.position.set(x, -0.6 + row * -0.75, 4.43);
      scene.add(line);
    }
  });

  // ── Central HUD screen ────────────────────────────────────────────────────
  const hudMat = new THREE.MeshStandardMaterial({ color: 0x002211, emissive: 0x00ff88, emissiveIntensity: 1.5 });
  const hudScreen = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 1.4), hudMat);
  hudScreen.position.set(0, -2.95, 4.42);
  scene.add(hudScreen);

  const hudBorder = new THREE.Mesh(new THREE.BoxGeometry(4.7, 1.6, 0.08), metalLight);
  hudBorder.position.set(0, -2.95, 4.36);
  scene.add(hudBorder);

  // ── Instrument cluster — 5 dials ─────────────────────────────────────────
  const dialFaceMat = new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.15, metalness: 0.95 });
  const needleMats  = [glowRed, glowGreen, glowBlue, glowOrange, glowYellow];
  const needles = [];
  for (let i = 0; i < 5; i++) {
    const cx = -3.6 + i * 1.8;

    const bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.12, 20), metalLight);
    bezel.rotation.x = Math.PI / 2;
    bezel.position.set(cx, -3.6, 4.3);
    scene.add(bezel);

    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 20), dialFaceMat);
    face.rotation.x = Math.PI / 2;
    face.position.set(cx, -3.6, 4.37);
    scene.add(face);

    for (let tick = 0; tick < 4; tick++) {
      const angle = (tick / 4) * Math.PI * 2;
      const tickMesh = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), needleMats[i]);
      tickMesh.position.set(cx + Math.cos(angle) * 0.22, -3.6 + Math.sin(angle) * 0.22, 4.41);
      scene.add(tickMesh);
    }

    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.26, 0.02), needleMats[i]);
    needle.position.set(cx, -3.6, 4.42);
    needle.rotation.z = (Math.random() - 0.5) * Math.PI * 1.2;
    scene.add(needle);
    needles.push(needle);
  }

  // ── Button rows ───────────────────────────────────────────────────────────
  const btnColorArr = [glowBlue, glowGreen, glowOrange, glowRed, glowYellow, glowBlue, glowGreen, glowOrange];
  for (let i = 0; i < 8; i++) {
    const btn = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.1), btnColorArr[i]);
    btn.position.set(-3.0 + i * 0.75, -2.92, 4.42);
    scene.add(btn);

    const halo = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5, transparent: true, opacity: 0.3 }));
    halo.position.set(-3.0 + i * 0.75, -2.92, 4.48);
    scene.add(halo);
  }

  // ── Toggle switches ───────────────────────────────────────────────────────
  for (let i = 0; i < 6; i++) {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.18), metalLight);
    base.position.set(-2.0 + i * 0.8, -3.35, 4.3);
    scene.add(base);
    const lever = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 6), metalLight);
    lever.rotation.z = (Math.random() > 0.5 ? 1 : -1) * 0.4;
    lever.position.set(-2.0 + i * 0.8, -3.22, 4.3);
    scene.add(lever);
  }

  // ── Joystick ──────────────────────────────────────────────────────────────
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x444455, roughness: 0.3, metalness: 0.9 });
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.9, 10), stickMat);
  stick.position.set(0, -3.3, 2.5);
  scene.add(stick);
  const stickKnob = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), glowBlue);
  stickKnob.position.set(0, -2.85, 2.5);
  scene.add(stickKnob);
  objects.push(stickKnob);

  const throttle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 1.2, 8), stickMat);
  throttle.rotation.z = 0.3;
  throttle.position.set(-1.5, -3.0, 2.5);
  scene.add(throttle);
  const throttleKnob = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.18), glowOrange);
  throttleKnob.position.set(-1.8, -2.45, 2.5);
  scene.add(throttleKnob);

  // ── Seats ─────────────────────────────────────────────────────────────────
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.8, metalness: 0.2 });
  [-1.6, 1.6].forEach(x => {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.25, 1.6), seatMat);
    seat.position.set(x, -4.4, 1.3);
    scene.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 0.22), seatMat);
    back.position.set(x, -3.1, 0.4);
    scene.add(back);
    const headrest = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.25), seatMat);
    headrest.position.set(x, -1.8, 0.4);
    scene.add(headrest);
  });

  // ── Overhead console ──────────────────────────────────────────────────────
  const overheadMat = new THREE.MeshStandardMaterial({ color: 0x1e1e2a, roughness: 0.4, metalness: 0.8 });
  const overhead = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 2), overheadMat);
  overhead.position.set(0, 3.9, 2.5);
  scene.add(overhead);
  [glowRed, glowYellow, glowGreen, glowBlue, glowOrange, glowRed].forEach((mat, i) => {
    const sw = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 8), mat);
    sw.position.set(-2.5 + i * 1.0, 3.65, 2.5);
    scene.add(sw);
  });

  // ── Lights ────────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xaabbcc, 1.8));

  const overhead1 = new THREE.PointLight(0xffffff, 60, 18);
  overhead1.position.set(0, 3.5, 2);
  scene.add(overhead1);

  const dashLight = new THREE.PointLight(0x88ddff, 40, 10);
  dashLight.position.set(0, -2, 4.2);
  scene.add(dashLight);

  const leftLight = new THREE.PointLight(0x4488ff, 30, 8);
  leftLight.position.set(-4, -1, 4);
  scene.add(leftLight);

  const rightLight = new THREE.PointLight(0xaa44ff, 30, 8);
  rightLight.position.set(4, -1, 4);
  scene.add(rightLight);

  const fillLight = new THREE.PointLight(0xffeedd, 25, 12);
  fillLight.position.set(0, 1, 7);
  scene.add(fillLight);

  const sunLight = new THREE.DirectionalLight(0xfff5ee, 1.2);
  sunLight.position.set(5, 8, -15);
  scene.add(sunLight);

  const warnLight = new THREE.PointLight(0xff3300, 8, 7);
  warnLight.position.set(-3.5, -1.5, 3.8);
  scene.add(warnLight);

  // ── Asteroids ─────────────────────────────────────────────────────────────
  const asteroids = [];
  for (let i = 0; i < 14; i++) {
    const ast = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.12 + Math.random() * 0.28, 0),
      new THREE.MeshStandardMaterial({ color: 0x776655, roughness: 0.9, metalness: 0.2 })
    );
    ast.position.set(
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 8,
      -8 - Math.random() * 22
    );
    ast.userData.speed = 0.012 + Math.random() * 0.035;
    scene.add(ast);
    asteroids.push(ast);
  }

  return {
    animateFn(time) {
      warnLight.intensity = 6 + Math.sin(time * 2.8) * 4;
      overhead1.intensity = 58 + Math.sin(time * 7.3) * 2;

      planet.rotation.y += 0.0008;
      ring.rotation.z   += 0.0004;

      asteroids.forEach(ast => {
        ast.position.z += ast.userData.speed;
        ast.rotation.x += 0.008;
        ast.rotation.y += 0.006;
        if (ast.position.z > 5) {
          ast.position.z = -28;
          ast.position.x = (Math.random() - 0.5) * 16;
          ast.position.y = (Math.random() - 0.5) * 8;
        }
      });

      hudScreen.material.emissiveIntensity = 1.2 + Math.sin(time * 1.8) * 0.4;
      stickKnob.material.emissiveIntensity = 2 + Math.sin(time * 2.5) * 0.8;

      needles.forEach((n, i) => {
        n.rotation.z += Math.sin(time * (0.3 + i * 0.07)) * 0.004;
      });
    },
    cleanup() {}
  };
}
