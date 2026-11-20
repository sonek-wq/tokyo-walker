/* ============================================================
   車 / 歩行者 (インスタンシング)
   ============================================================ */
const LANES = [];
for (const [x0, z0, x1, z1, d] of ROADS) {
  const w = d === 'ns' ? x1 - x0 : z1 - z0, n = w >= 20 ? 4 : 2;
  for (let k = 0; k < n; k++) {
    const off = (k + 0.5) / n * w, first = k < n / 2; // 左側通行
    if (d === 'ns') LANES.push({ ns: true, c: x0 + off, dir: first ? -1 : 1, a: z0 + 2, b: z1 - 2 });
    else LANES.push({ ns: false, c: z0 + off, dir: first ? 1 : -1, a: x0 + 2, b: x1 - 2 });
  }
}
// 首都高の車線
for (const [c, dir] of [[296, 1], [300, 1], [304, -1], [308, -1]]) LANES.push({ ns: false, c, dir, a: -3000, b: -532, y: SHUTO_Y });
for (const [c, dir] of [[-516, 1], [-520, 1], [-524, -1], [-528, -1]]) LANES.push({ ns: true, c, dir, a: 312, b: 2490, y: SHUTO_Y });
for (const L of LANES) L.hoko = L.ns && L.c > -140 && L.c < -116 && L.b < -400; // 銀座 中央通り
const CARS = [], carCols = [0xe8e8e8, 0x22252a, 0xb03030, 0x3a5a9a, 0xd8c060, 0x8a8f96, 0x2f6a4a, 0xf0f0f0, 0x1a1a1a];
for (const L of LANES) { const n = Math.max(1, Math.round((L.b - L.a) / 230)); for (let i = 0; i < n; i++) CARS.push({ L, s: rr(L.a, L.b), v: rr(9, 15) }); }
const carParts = [
  new THREE.InstancedMesh(new THREE.BoxGeometry(1.8, 0.9, 4.3).translate(0, 0.75, 0), lam({ color: 0xffffff }), CARS.length + PARKED.length),
  new THREE.InstancedMesh(new THREE.BoxGeometry(1.6, 0.7, 2.2).translate(0, 1.55, -0.2), lam({ color: 0xffffff }), CARS.length + PARKED.length),
  new THREE.InstancedMesh(new THREE.BoxGeometry(1.62, 0.45, 2.0).translate(0, 1.55, -0.2), dark, CARS.length + PARKED.length),
];
CARS.forEach((c, i) => {
  c.taxi = !c.L.y && rnd() < 0.3; // 3割はタクシー
  const col = new THREE.Color(c.taxi ? pick([0xf0c020, 0x1a1a1e, 0x2a7a4a, 0xf2f2ee, 0x3a5ab0]) : pick(carCols)); carParts[0].setColorAt(i, col); carParts[1].setColorAt(i, col);
});
const ZERO_M = new THREE.Matrix4().makeScale(0, 0, 0);
const andon = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.22, 0.25).translate(0, 2.0, -0.2), glow(lam({ color: 0xfff0b0 }), 0xffe080, 1), CARS.length);
for (let i = 0; i < CARS.length; i++) andon.setMatrixAt(i, ZERO_M); andon.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(andon);
PARKED.forEach(([x, z, r], j) => { // 駐車中の車 (動かない)
  const i = CARS.length + j, col = new THREE.Color(pick(carCols)), o = new THREE.Object3D();
  o.position.set(x, 0, z); o.rotation.y = r; o.updateMatrix();
  for (const m of carParts) m.setMatrixAt(i, o.matrix);
  carParts[0].setColorAt(i, col); carParts[1].setColorAt(i, col);
});
for (const m of carParts) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); }

const PPATH = [[129, -160, 129, 310], [133, -160, 133, 310], [-35.5, -150, -35.5, 316], [-4.8, -150, -4.8, 316],
  [-1100, -50, -36, -50], [-1100, -70, 112, -70], [190, -25, 190, 45], [150, 10, 235, 10], [-262, -334, -75, -334], [36, -212, 36, -252], [30, 56, 110, 56],
  [-1132.5, -470, -1132.5, 310], [-1103.5, -470, -1103.5, 310], [-722, -470, -722, 310], [-690, -470, -690, 310],
  [-1136, ZOJO_Z, -1268, ZOJO_Z], [-1650, -200, -1470, -200], [-1420, -300, -1400, -300], [-1290, -470, -1290, -400],
  [-910, 37.5, -728, 37.5], [-910, 42.5, -728, 42.5], [-910, 40, -728, 40],
  [-450, -860, -450, -708], [-560, -900, -500, -960], [-660, -940, -500, -940], [-144 - 2, -1296, -146, -510], [-114, -1296, -114, -510], [-100, -654, 44, -654], [-28, -800, -28, -508], [-1494, -916, -726, -916], [-1494, -892, -726, -892], [-620, -800, -500, -800], [-600, -700, -500, -700], [-28, -1296, -28, -1204], [-270, -995, 50, -995], [-210, -653, -360, -653], [-1670, 280, -490, 280], [-1670, 284, -490, 284], [-600, 0, -520, 0], [-560, -40, -560, 120]];
const PEOPLE = [], shirts = [0xd04030, 0x3060b0, 0xe8e0d0, 0x40a060, 0xe0b030, 0x303038, 0x8a5aa0, 0xf0a0b0];
for (let i = 0; i < 40; i++) { const x = rr(-138, -118); PEOPLE.push({ p: [x, -1290, x + rr(-2, 2), -510], t: rnd(), v: rr(1, 1.5) / 780, d: rnd() < 0.5 ? 1 : -1, ph: rr(0, 6), hk: true }); }
PPATH.push([110, -905, 280, -905], [110, -870, 280, -870], [200, -980, 200, -830], [335, -1185, 425, -1185], [335, -1203, 425, -1203], [104, -1210, 200, -1210]);
for (let i = 0; i < 180; i++) {
  const p = i < 20 ? PPATH[PPATH.length - 7 + (i % 3)] : pick(PPATH); PEOPLE.push({ p, t: rnd(), v: rr(1, 1.6) / Math.hypot(p[2] - p[0], p[3] - p[1]), d: rnd() < 0.5 ? 1 : -1, ph: rr(0, 6) });
}
const pplParts = [
  new THREE.InstancedMesh(new THREE.BoxGeometry(0.42, 0.8, 0.26).translate(0, 0.4, 0), lam({ color: 0xffffff }), PEOPLE.length),
  new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.7, 0.3).translate(0, 1.15, 0), lam({ color: 0xffffff }), PEOPLE.length),
  new THREE.InstancedMesh(new THREE.BoxGeometry(0.28, 0.3, 0.28).translate(0, 1.68, 0), lam({ color: 0xe0b896 }), PEOPLE.length),
  new THREE.InstancedMesh(new THREE.BoxGeometry(0.3, 0.1, 0.3).translate(0, 1.86, 0), lam({ color: 0x201810 }), PEOPLE.length),
];
PEOPLE.forEach((p, i) => { pplParts[0].setColorAt(i, new THREE.Color(pick([0x2a2a35, 0x404a60, 0x6a5a48]))); pplParts[1].setColorAt(i, new THREE.Color(pick(shirts))); });
for (const m of pplParts) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); }

