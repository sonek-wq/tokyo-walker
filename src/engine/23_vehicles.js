/* ============================================================
   乗り物: 電動スクーター (立ち乗り) / ハンググライダー
   ============================================================ */
const ledM = lam({ color: 0x40d8ff, emissive: 0x30c8ff, emissiveIntensity: 0.9 });
const scooter = new THREE.Group(); scene.add(scooter);
const SC = {};
{
  const body = lam({ color: 0xd4d8dc }), dk = lam({ color: 0x26282c });
  box(0.48, 0.12, 1.15, body, 0, 0.17, 0, scooter);            // デッキ
  box(0.4, 0.02, 0.86, dk, 0, 0.24, -0.06, scooter);            // 滑り止め
  for (const x of [-0.245, 0.245]) box(0.02, 0.03, 1.0, ledM, x, 0.16, 0, scooter); // 水色のLEDライン
  const wheel = z => {
    const g = new THREE.Group(); g.position.set(0, 0.22, z); scooter.add(g);
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 12), dk); t.rotation.z = Math.PI / 2; g.add(t);
    const h = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 8), body); h.rotation.z = Math.PI / 2; g.add(h);
    box(0.13, 0.02, 0.3, ledM, 0, 0, 0.02, g);
    return g;
  };
  SC.wf = wheel(0.62); SC.wr = wheel(-0.6);
  box(0.18, 0.07, 0.5, body, 0, 0.47, -0.6, scooter); box(0.18, 0.07, 0.42, body, 0, 0.47, 0.62, scooter); // フェンダー
  const stem = new THREE.Group(); stem.position.set(0, 0.3, 0.66); stem.rotation.x = -0.18; scooter.add(stem);
  box(0.08, 0.95, 0.08, body, 0, 0.475, 0, stem);
  box(0.62, 0.06, 0.06, body, 0, 0.95, 0, stem);
  for (const x of [-0.29, 0.29]) box(0.1, 0.07, 0.07, dk, x, 0.95, 0, stem);
  box(0.16, 0.05, 0.1, ledM, 0, 0.99, 0.02, stem);               // メーター
  box(0.12, 0.08, 0.05, ledM, 0, 0.52, 0.06, stem);              // ライト
}
const glider = new THREE.Group(); scene.add(glider);
{
  const tri = (pts, col) => {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts.flat(), 3)); g.computeVertexNormals();
    glider.add(new THREE.Mesh(g, lam({ color: col, side: THREE.DoubleSide })));
  };
  // 2点を結ぶ細い棒 (フレーム・LEDライン用)
  const beam = (a, b, t, mat) => {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), m = new THREE.Mesh(new THREE.BoxGeometry(t, t, A.distanceTo(B)), mat);
    m.position.copy(A).add(B).multiplyScalar(0.5); m.lookAt(B); glider.add(m); return m;
  };
  const nose = [0, 3.0, 3.0], rear = [0, 2.9, 0.1], L = [-4.6, 2.7, -0.2], Rt = [4.6, 2.7, -0.2];
  tri([nose, L, rear], 0xd4d8dc); tri([nose, rear, Rt], 0xc4c8cc);              // グレーの翼
  tri([[0, 3.01, 2.7], [-0.35, 2.93, 0.4], [0.35, 2.93, 0.4]], 0x8a9096);         // 中央の濃いグレー帯
  // 光る水色のライン: 前縁・後縁・中央・翼の中ほど
  beam(nose, L, 0.07, ledM); beam(nose, Rt, 0.07, ledM);
  beam(L, rear, 0.05, ledM); beam(rear, Rt, 0.05, ledM);
  beam([0, 3.03, 2.8], [0, 2.94, 0.2], 0.05, ledM);
  beam([-1.6, 2.92, 1.75], [-2.9, 2.8, 0.05], 0.04, ledM); beam([1.6, 2.92, 1.75], [2.9, 2.8, 0.05], 0.04, ledM);
  for (const sd of [-1, 1]) { const tip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.3), ledM); tip.position.set(sd * 4.55, 2.7, -0.2); glider.add(tip); }
  // フレーム (スクーターと同じ白っぽいグレー + 黒いグリップ)
  const fm = lam({ color: 0xd4d8dc }), dk = lam({ color: 0x26282c });
  beam([0, 2.92, 2.9], [0, 2.92, -0.15], 0.07, fm);                              // キール
  beam([-0.85, 2.04, 1.16], [0.85, 2.04, 1.16], 0.06, fm);                        // コントロールバー
  for (const sd of [-1, 1]) { beam([sd * 0.85, 2.04, 1.16], [0, 2.9, 1.05], 0.05, fm); const g = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.08), dk); g.position.set(sd * 0.32, 2.04, 1.16); glider.add(g); }
}
// --- 夜のキャラ視認性: 服をごく弱く自発光 + 足元を照らす控えめなライト
const AV_MATS = new Set();
avatar.traverse(o => { if (o.isMesh) AV_MATS.add(o.material); });
for (const m of AV_MATS) m.emissive.copy(m.color);
const playerLight = new THREE.PointLight(0xffe6c8, 0, 16, 1.6); scene.add(playerLight);
let NIGHT = 0;
function updatePlayerLight() {
  for (const m of AV_MATS) m.emissiveIntensity = NIGHT * 0.18;
  // グライダー中は翼に光が当たって白飛びしないよう、体の下から照らす
  playerLight.intensity = NIGHT * (P.glider ? 5 : 10);
  playerLight.position.set(P.x - Math.sin(P.yaw) * 1.5, P.y + (P.glider ? 0.6 : 3.2), P.z - Math.cos(P.yaw) * 1.5);
}
