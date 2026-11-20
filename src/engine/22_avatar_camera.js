/* ============================================================
   自キャラ (三人称視点用) と カメラ
   ============================================================ */
const avatar = new THREE.Group(); scene.add(avatar);
const limb = (w, h, d, mat, px, py) => { const pivot = new THREE.Group(); pivot.position.set(px, py, 0); box(w, h, d, mat, 0, -h / 2, 0, pivot); avatar.add(pivot); return pivot; };
const AV = {
  legL: limb(0.22, 0.82, 0.24, lam({ color: 0x2c3550 }), -0.13, 0.84), legR: limb(0.22, 0.82, 0.24, lam({ color: 0x2c3550 }), 0.13, 0.84),
  armL: limb(0.16, 0.62, 0.18, lam({ color: 0xe8b020 }), -0.37, 1.48), armR: limb(0.16, 0.62, 0.18, lam({ color: 0xe8b020 }), 0.37, 1.48),
};
box(0.56, 0.66, 0.3, lam({ color: 0xe8b020 }), 0, 1.2, 0, avatar);
box(0.42, 0.46, 0.16, lam({ color: 0x2f62b8 }), 0, 1.24, -0.23, avatar);
box(0.32, 0.32, 0.32, lam({ color: 0xe8c09a }), 0, 1.71, 0, avatar);
box(0.36, 0.12, 0.36, lam({ color: 0xc0302a }), 0, 1.9, 0, avatar);
box(0.3, 0.04, 0.16, lam({ color: 0xc0302a }), 0, 1.86, 0.24, avatar);
box(0.2, 0.05, 0.02, lam({ color: 0x1a1a1a }), 0, 1.74, 0.165, avatar);
const blob = new THREE.Mesh(new THREE.CircleGeometry(0.45, 10).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }));
scene.add(blob);
avatar.rotation.y = P.heading; avatar.rotation.order = 'YXZ';

