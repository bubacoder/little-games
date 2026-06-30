// ─── Scene 2: Forest with Animals ────────────────────────────────────────────
import * as THREE from 'three';

/**
 * @param {THREE.Scene} scene
 * @param {THREE.Group} frameGroup  - persistent window-frame group
 * @returns {{ animateFn(t: number): void, cleanup(): void }}
 */
export function buildScene2(scene, frameGroup) {
  scene.background = new THREE.Color(0x0d1f0a);
  scene.fog = new THREE.FogExp2(0x0d1f0a, 0.045);

  const objects = [];

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ color: 0x1a3a10, roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -3.2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Moon
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfffde7, emissive: 0xfffde7, emissiveIntensity: 0.6 })
  );
  moon.position.set(-6, 7, -25);
  scene.add(moon);

  // Stars (sparse, night forest)
  const sGeo = new THREE.BufferGeometry();
  const sPos = new Float32Array(600 * 3);
  for (let i = 0; i < 600 * 3; i++) sPos[i] = (Math.random() - 0.5) * 80;
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const starPts = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.12 }));
  starPts.position.y = 15;
  starPts.position.z = -30;
  scene.add(starPts);

  // ── Trees ─────────────────────────────────────────────────────────────────
  function makeTree(x, z, s = 1) {
    const group = new THREE.Group();

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15 * s, 0.22 * s, 1.8 * s, 7),
      new THREE.MeshStandardMaterial({ color: 0x4a2f1a, roughness: 1 })
    );
    trunk.position.y = -2.3 + 0.9 * s;
    trunk.castShadow = true;
    group.add(trunk);

    const leafColor = new THREE.MeshStandardMaterial({ color: 0x1a5c1a, roughness: 0.8 });
    [[1.4 * s, 2.2 * s, 0], [1.1 * s, 1.8 * s, 0.9 * s], [0.7 * s, 1.4 * s, 1.8 * s]].forEach(([r, h, yo]) => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), leafColor);
      cone.position.y = -2.3 + 1.8 * s + yo;
      cone.castShadow = true;
      group.add(cone);
    });

    group.position.set(x, 0, z);
    scene.add(group);
    return group;
  }

  const treePositions = [
    [-12,-18],[-8,-20],[-4,-19],[0,-21],[4,-20],[8,-19],[12,-18],[16,-20],[-16,-19],
    [-10,-12],[-6,-11],[-2,-13],[2,-12],[6,-11],[10,-13],[14,-12],[-14,-11],
    [-8,-7],[-4,-6],[4,-7],[8,-6],[12,-7],[-12,-6],
    [-9,-3],[9,-3],[-11,-1],[11,-1],
  ];
  treePositions.forEach(([x, z]) => makeTree(x, z, 0.7 + Math.random() * 0.6));

  // ── Animals ───────────────────────────────────────────────────────────────
  function makeDeer(x, z) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x8b5e3c, roughness: 0.8 });

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.7, 4, 8), mat);
    body.rotation.z = Math.PI / 2;
    body.position.set(0, -1.8, 0);
    g.add(body);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.5, 6), mat);
    neck.rotation.z = -0.4;
    neck.position.set(0.4, -1.4, 0);
    g.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), mat);
    head.position.set(0.65, -1.1, 0);
    g.add(head);

    const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.25, 6), mat);
    snout.rotation.z = Math.PI / 2;
    snout.position.set(0.88, -1.15, 0);
    g.add(snout);

    const legMat = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.9 });
    [[-0.25, 0.15], [-0.25, -0.15], [0.25, 0.15], [0.25, -0.15]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.9, 5), legMat);
      leg.position.set(lx, -2.6, lz);
      g.add(leg);
    });

    const antMat = new THREE.MeshStandardMaterial({ color: 0x5a3a1a });
    [[0.08], [-0.08]].forEach(([az]) => {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.45, 4), antMat);
      stem.position.set(0.65, -0.72, az);
      g.add(stem);
      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.3, 4), antMat);
      branch.rotation.z = 0.5;
      branch.position.set(0.78, -0.52, az);
      g.add(branch);
    });

    g.position.set(x, 0, z);
    g.castShadow = true;
    scene.add(g);
    objects.push(g);
    return g;
  }

  function makeOwl(x, y, z) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x6b4f2a, roughness: 0.9 });

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.3, 4, 8), mat);
    body.position.y = 0;
    g.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), mat);
    head.position.y = 0.42;
    g.add(head);

    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffdd44, emissive: 0xffdd44, emissiveIntensity: 0.4 });
    [-0.07, 0.07].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), eyeMat);
      eye.position.set(ex, 0.44, 0.13);
      g.add(eye);
    });

    const earMat = new THREE.MeshStandardMaterial({ color: 0x5a3e1a });
    [-0.07, 0.07].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 4), earMat);
      ear.position.set(ex, 0.6, 0);
      g.add(ear);
    });

    const wingMat = new THREE.MeshStandardMaterial({ color: 0x7a5a2a, roughness: 1 });
    [-1, 1].forEach(side => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.22), wingMat);
      wing.position.set(side * 0.24, 0, 0);
      g.add(wing);
    });

    const branch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.07, 1.2, 6),
      new THREE.MeshStandardMaterial({ color: 0x3a2210, roughness: 1 })
    );
    branch.rotation.z = Math.PI / 2;
    branch.position.y = -0.35;
    g.add(branch);

    g.position.set(x, y, z);
    scene.add(g);
    objects.push(g);
    return g;
  }

  function makeRabbit(x, z) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xd4c5a9, roughness: 0.9 });

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.22, 4, 8), mat);
    body.position.y = -2.9;
    g.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), mat);
    head.position.set(0.18, -2.68, 0);
    g.add(head);

    [0.06, -0.06].forEach(ez => {
      const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.22, 4, 6), mat);
      ear.position.set(0.14, -2.46, ez);
      g.add(ear);
    });

    g.position.set(x, 0, z);
    scene.add(g);
    objects.push(g);
    return g;
  }

  const deer1   = makeDeer(-2, -8);
  const deer2   = makeDeer(3.5, -10);
  deer2.rotation.y = Math.PI * 0.7;
  const owl     = makeOwl(5, 0.3, -7);
  const rabbit1 = makeRabbit(-4, -5);
  const rabbit2 = makeRabbit(1.5, -5.5);
  rabbit2.rotation.y = 1.2;

  // ── Fireflies ─────────────────────────────────────────────────────────────
  const ffGeo = new THREE.BufferGeometry();
  const ffCount = 40;
  const ffPos = new Float32Array(ffCount * 3);
  for (let i = 0; i < ffCount; i++) {
    ffPos[i * 3]     = (Math.random() - 0.5) * 14;
    ffPos[i * 3 + 1] = -2 + Math.random() * 3;
    ffPos[i * 3 + 2] = -5 - Math.random() * 10;
  }
  ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
  const ffMesh = new THREE.Points(ffGeo, new THREE.PointsMaterial({
    color: 0xaaff66, size: 0.12, sizeAttenuation: true,
    transparent: true, opacity: 0.85
  }));
  scene.add(ffMesh);

  // Window frame (wooden)
  const wFrameMat = new THREE.MeshStandardMaterial({ color: 0x3d2010, roughness: 0.95, metalness: 0.05 });
  function wbar(w, h, d, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wFrameMat);
    m.position.set(x, y, z);
    frameGroup.add(m);
  }
  const fz = 5.5, fw = 9, fh = 6.5;
  wbar(fw + 0.4, 0.45, 0.45,  0,       fh / 2,  fz);
  wbar(fw + 0.4, 0.45, 0.45,  0,      -fh / 2,  fz);
  wbar(0.45, fh + 0.45, 0.45, -fw / 2, 0,       fz);
  wbar(0.45, fh + 0.45, 0.45,  fw / 2, 0,       fz);
  wbar(fw + 0.4, 0.22, 0.22,   0,       0,       fz);
  wbar(0.22, fh + 0.45, 0.22,  0,       0,       fz);

  // Lighting (moonlit)
  scene.add(new THREE.AmbientLight(0x112233, 0.9));
  const moonLight = new THREE.DirectionalLight(0x99bbff, 1.2);
  moonLight.position.set(-4, 10, 5);
  moonLight.castShadow = true;
  scene.add(moonLight);
  const warmFill = new THREE.PointLight(0xff9944, 8, 15);
  warmFill.position.set(0, 0, 2);
  scene.add(warmFill);

  return {
    animateFn(time) {
      // Firefly bobbing
      const pos = ffGeo.attributes.position.array;
      for (let i = 0; i < ffCount; i++) {
        pos[i * 3 + 1] += Math.sin(time * 2.1 + i * 1.3) * 0.003;
      }
      ffGeo.attributes.position.needsUpdate = true;
      ffMesh.material.opacity = 0.5 + 0.5 * Math.sin(time * 1.5);

      // Gentle deer head bobbing
      deer1.children[2].position.y = -1.1 + Math.sin(time * 0.8) * 0.04;
      deer2.children[2].position.y = -1.1 + Math.sin(time * 0.9 + 1) * 0.04;

      // Owl head swivel
      owl.children[1].rotation.y = Math.sin(time * 0.4) * 0.5;

      // Rabbit twitch
      rabbit1.rotation.y = Math.sin(time * 1.2) * 0.15;
    },
    cleanup() {}
  };
}
