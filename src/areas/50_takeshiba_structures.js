/* ============================================================
   竹芝周辺の構造物
   ============================================================ */
{ // 浜離宮: 中島の御茶屋
  box(9, 3, 7, lam({ color: 0x8a6a48 }), 40, 1.5, -337);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(7.5, 3, 4), lam({ color: 0x4a4a52 }));
  roof.position.set(40, 4.4, -337); roof.rotation.y = Math.PI / 4; roof.scale.z = 0.8; scene.add(roof);
  solid(35.5, -340.5, 44.5, -333.5, 0, 5);
}
// ゆりかもめ
const YP = [];
for (let z = 320; z > -116; z -= 2) YP.push([15, z]);
for (let a = 0; a <= 90; a += 3) { const t = a * Math.PI / 180; YP.push([-25 + 40 * Math.cos(t), -116 - 40 * Math.sin(t)]); }
for (let x = -27; x >= -320; x -= 2) YP.push([x, -156]);
for (let a = 3; a <= 90; a += 3) { const t = a * Math.PI / 180; YP.push([-320 - 40 * Math.sin(t), -196 + 40 * Math.cos(t)]); }
for (let z = -198; z >= -900; z -= 2) YP.push([-360, z]); // 汐留 → 新橋
const YL = [0];
for (let i = 1; i < YP.length; i++) YL.push(YL[i - 1] + Math.hypot(YP[i][0] - YP[i - 1][0], YP[i][1] - YP[i - 1][1]));
const Y_LEN = YL[YL.length - 1];
function pathAt(s) {
  s = Math.max(0, Math.min(Y_LEN - 0.001, s));
  let lo = 0, hi = YL.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (YL[m] <= s) lo = m; else hi = m; }
  const t = (s - YL[lo]) / (YL[hi] - YL[lo]), a = YP[lo], b = YP[hi];
  return { x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, ang: Math.atan2(b[0] - a[0], b[1] - a[1]) };
}
{
  const n = Math.ceil(Y_LEN / 6), girder = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), concrete, n * 3);
  const dmy = new THREE.Object3D(); let k = 0;
  for (let i = 0; i < n; i++) {
    const p = pathAt(i * 6 + 3);
    for (const [ox, w, h, y] of [[0, 7, 1.6, 9], [-3.3, 0.4, 1.2, 10.4], [3.3, 0.4, 1.2, 10.4]]) {
      dmy.position.set(p.x + Math.cos(p.ang) * ox, y, p.z - Math.sin(p.ang) * ox);
      dmy.rotation.y = p.ang; dmy.scale.set(w, h, 6.2); dmy.updateMatrix(); girder.setMatrixAt(k++, dmy.matrix);
    }
    const c = Math.abs(Math.cos(p.ang)), sn = Math.abs(Math.sin(p.ang)), hx = 3.5 * c + 3.1 * sn, hz = 3.5 * sn + 3.1 * c;
    solid(p.x - hx, p.z - hz, p.x + hx, p.z + hz, 8.2, 9.8);
  }
  scene.add(girder);
  const pn = Math.floor(Y_LEN / 25), pillars = new THREE.InstancedMesh(new THREE.BoxGeometry(2, 8.2, 2).translate(0, 4.1, 0), concrete, pn);
  for (let i = 0; i < pn; i++) {
    const p = pathAt(i * 25 + 5); dmy.position.set(p.x, 0, p.z); dmy.rotation.y = p.ang; dmy.scale.set(1, 1, 1); dmy.updateMatrix();
    pillars.setMatrixAt(i, dmy.matrix); solid(p.x - 1, p.z - 1, p.x + 1, p.z + 1, 0, 8.2);
  }
  scene.add(pillars);
  const st = new THREE.Mesh(boxGeo(20, 6, 60), MATS.station); st.position.set(15, 6, 0); scene.add(st);
  box(7, 1.2, 60, concrete, 9, 10.2, 0); box(7, 1.2, 60, concrete, 21, 10.2, 0);
  box(22, 0.6, 64, lam({ color: 0xdfe4e8 }), 15, 16.3, 0);
  for (const z of [-28, -10, 10, 28]) for (const x of [6, 24]) box(0.4, 5.5, 0.4, white, x, 13.5, z);
  // (駅から西へのびていた行き止まりの歩道橋は、regions/02_takeshiba_harbor.js の竹芝デッキに置きかえた)
  solid(5, -30, 25, 30, 3, 9);
  solid(5.5, -30, 12.5, 30, 9.6, 10.8); solid(17.5, -30, 24.5, 30, 9.6, 10.8); solid(4, -32, 26, 32, 16, 16.6);
}
const yfront = tex(8, 8, x => { x.fillStyle = '#f0f0ec'; x.fillRect(0, 0, 8, 8); x.fillStyle = '#22303c'; x.fillRect(1, 1, 6, 3); x.fillStyle = '#1f6fc0'; x.fillRect(0, 5, 8, 2); });
const yside = tex(32, 8, x => { x.fillStyle = '#f0f0ec'; x.fillRect(0, 0, 32, 8); x.fillStyle = '#2a3a4a'; for (let i = 2; i < 30; i += 5) x.fillRect(i, 1, 4, 3); x.fillStyle = '#1f6fc0'; x.fillRect(0, 5, 32, 2); });
const ysideE = tex(32, 8, x => { x.fillStyle = '#000'; x.fillRect(0, 0, 32, 8); x.fillStyle = '#fff4d8'; for (let i = 2; i < 30; i += 5) x.fillRect(i, 1, 4, 3); });
const carGeo = new THREE.BoxGeometry(2.6, 3, 9.2);
const ySideM = lam({ map: yside, emissive: 0xffffff, emissiveMap: ysideE, emissiveIntensity: 0 }), yFrontM = lam({ map: yfront });
GLOW.push([ySideM, 1]);
const TRAIN = [];   // (ゆりかもめの車両は乗り物の路線 (engine/12b) で動かす)
function sNear(x, z) { let b = 0, bd = Infinity; YP.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - z); if (d < bd) { bd = d; b = i; } }); return YL[b]; }
// ゆりかもめ 汐留駅・新橋駅
for (const zc of [-620, -870]) {
  const xc = -360, st2 = new THREE.Mesh(boxGeo(20, 6, 60), MATS.station); st2.position.set(xc, 6, zc); scene.add(st2);
  box(7, 1.2, 60, concrete, xc - 6, 10.2, zc); box(7, 1.2, 60, concrete, xc + 6, 10.2, zc);
  box(22, 0.6, 64, lam({ color: 0xdfe4e8 }), xc, 16.3, zc);
  for (const z of [-28, -10, 10, 28]) for (const x of [-9, 9]) box(0.4, 5.5, 0.4, white, xc + x, 13.5, zc + z);
  solid(xc - 10, zc - 30, xc + 10, zc + 30, 3, 9); solid(xc - 9.5, zc - 30, xc - 2.5, zc + 30, 9.6, 10.8); solid(xc + 2.5, zc - 30, xc + 9.5, zc + 30, 9.6, 10.8); solid(xc - 11, zc - 32, xc + 11, zc + 32, 16, 16.6);
  fr(xc - 10, zc - 30, xc + 10, zc + 30, '#55555a');
}
SPOT_AREAS.push(['ゆりかもめ 汐留駅', -372, -655, -348, -585], ['ゆりかもめ 新橋駅', -372, -905, -348, -835]);
// 東京モノレールの車両
const monoSide = tex(32, 8, x => { x.fillStyle = '#f2f4f6'; x.fillRect(0, 0, 32, 8); x.fillStyle = '#26323e'; for (let i = 1; i < 31; i += 4) x.fillRect(i, 1, 3, 3); x.fillStyle = '#1f5fb0'; x.fillRect(0, 5, 32, 1); x.fillStyle = '#e0602a'; x.fillRect(0, 6, 32, 1); });
const monoSideE = tex(32, 8, x => { x.fillStyle = '#000'; x.fillRect(0, 0, 32, 8); x.fillStyle = '#fff4d8'; for (let i = 1; i < 31; i += 4) x.fillRect(i, 1, 3, 3); });
const monoM = lam({ map: monoSide, emissive: 0xffffff, emissiveMap: monoSideE, emissiveIntensity: 0 }); GLOW.push([monoM, 1]);
const MONO_CARS = [];
for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(3, 3.4, 15), [monoM, monoM, white, white, white, white]); scene.add(m); MONO_CARS.push(m); }
const mono = { s: 30, dir: 1, wait: 6 };

function makeShip(len, beam, hull, stripe, levels, funnel) {
  const grp = new THREE.Group(), L = len / 2, B = beam / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-L, -B); shape.lineTo(L - beam * 1.2, -B); shape.lineTo(L, 0); shape.lineTo(L - beam * 1.2, B); shape.lineTo(-L, B); shape.closePath();
  for (const [h, c, y] of [[3, stripe, 0], [4, hull, 3]]) {
    const geo = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false }); geo.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(geo, lam({ color: c })); m.position.y = y; grp.add(m);
  }
  let y = 7, l = len * 0.55, b = beam * 0.85;
  for (let i = 0; i < levels; i++) {
    const m = new THREE.Mesh(boxGeo(l, 2.6, b, 16, 10.4), MATS.cabin); m.position.set(-len * 0.05 - i * len * 0.03, y + 1.3, 0); grp.add(m);
    y += 2.6; l *= 0.75; b *= 0.92;
  }
  box(len * 0.06, 5, beam * 0.3, lam({ color: funnel }), -len * 0.25, y + 2, 0, grp);
  scene.add(grp); return grp;
}
const SHIPS = [
  { g: makeShip(110, 16, 0xf4f4f0, 0x1d3f8f, 4, 0x1d3f8f), x: 196, z: -40, a: Math.PI, ph: 0 }, // 島からの大型客船 (舳先は西向きで着岸)
  { g: makeShip(30, 9, 0xf4f4f0, 0xc0392b, 2, 0xc0392b), x: 205, z: 57, a: Math.PI, ph: 2 },
];
const cruiser = makeShip(22, 6, 0xf0ead8, 0x2a6a4a, 1, 0x2a6a4a);
{ // マスト
  const mx = 95, mz = 26;
  box(5, 1, 5, concrete, mx, 0.5, mz);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, 28, 6), white); mast.position.set(mx, 14, mz); scene.add(mast);
  for (const [y, w] of [[12, 12], [19, 9], [25, 6]]) box(w, 0.3, 0.3, white, mx, y, mz);
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.Float32BufferAttribute([-5.5, 12.3, 0, 5.5, 12.3, 0, 0, 18.7, 0, -4, 19.3, 0, 4, 19.3, 0, 0, 24.7, 0], 3));
  sg.computeVertexNormals();
  const sail = new THREE.Mesh(sg, lam({ color: 0xfaf8f0, side: THREE.DoubleSide })); sail.position.set(mx, 0, mz + 0.3); scene.add(sail);
  box(2, 1.2, 0.1, lam({ color: 0xc0392b }), mx + 1, 27.5, mz);
  solid(mx - 2.5, mz - 2.5, mx + 2.5, mz + 2.5, 0, 1); solid(mx - 0.4, mz - 0.4, mx + 0.4, mz + 0.4, 1, 28);
}
{ // 街灯
  const lamps = []; for (let z = -165; z < 318; z += 20) lamps.push([137, z]);
  for (let x = 145; x < 240; x += 20) lamps.push([x, -28], [x, 48]);
  for (let x = -1100; x < -480; x += 30) lamps.push([x, -74], [x, -46]);
  const pole = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.1, 0.12, 5, 4).translate(0, 2.5, 0), dark, lamps.length);
  const head = new THREE.InstancedMesh(new THREE.BoxGeometry(0.6, 0.3, 0.6).translate(0, 5.1, 0), glow(lam({ color: 0xfff4c8 }), 0xffe0a0, 1.6), lamps.length);
  const d = new THREE.Object3D();
  lamps.forEach(([x, z], i) => { d.position.set(x, 0, z); d.updateMatrix(); pole.setMatrixAt(i, d.matrix); head.setMatrixAt(i, d.matrix); });
  scene.add(pole, head);
}
const gullGeo = new THREE.BufferGeometry();
gullGeo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, -0.3, 0, 0, 0.3, -1.2, 0.35, 0, 0, 0, -0.3, 0, 0, 0.3, 1.2, 0.35, 0], 3));
gullGeo.computeVertexNormals();
const GULLS = [];
for (let i = 0; i < 9; i++) {
  const m = new THREE.Mesh(gullGeo, lam({ color: 0xffffff, side: THREE.DoubleSide })); scene.add(m);
  GULLS.push({ m, r: rr(25, 90), h: rr(14, 38), sp: rr(0.15, 0.35) * (rnd() < 0.5 ? 1 : -1), ph: rr(0, 6), cx: rr(160, 260), cz: rr(-60, 60) });
}

