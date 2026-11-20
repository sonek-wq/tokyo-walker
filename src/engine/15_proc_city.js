/* ============================================================
   自動生成の街 (山手線の環の内側と周辺): 100m の区画ごとに道路と街並みを作る
   近づいた区画だけ建物を組み立て、遠ざかったら片付ける
   ============================================================ */
const PC = 100;
const isMajor = i => ((i % 4) + 4) % 4 === 0;                       // 400m ごとに大通り
function hash2(i, j, k = 0) { let h = (i * 374761393 + j * 668265263 + k * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function srng(i, j) { let a = Math.floor(hash2(i, j, 7) * 4294967296) || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const BOUNDS0 = [MINX, MINZ, MAXX, MAXZ];
function nearestStn(x, z) { let b = null, bd = Infinity; for (const st of STN) { const d = Math.hypot(st.x - x, st.z - z); if (d < bd) { bd = d; b = st; } } return [b, bd]; }
const LAYOUT = new Map();
function cellLayout(ci, cj) {
  const key = ci * 100003 + cj; if (LAYOUT.has(key)) return LAYOUT.get(key);
  const x0 = ci * PC, z0 = cj * PC, cx = x0 + PC / 2, cz = z0 + PC / 2, inside = inR(BOUNDS0, cx, cz);
  let rect = null;
  if (inside) { const lr = PROC_LAND.find(r => inR(r, cx, cz)); if (lr) rect = clip([x0, z0, x0 + PC, z0 + PC], lr); }
  else if (!isWaterXZ(cx, cz)) rect = [x0, z0, x0 + PC, z0 + PC];
  if (!rect || rect[2] - rect[0] < 30 || rect[3] - rect[1] < 30) { LAYOUT.set(key, null); return null; }
  const R = srng(ci, cj), rg = (a, b) => a + (b - a) * R();
  const hw = (onLine, major) => onLine ? (major ? 10 : 4) : 2;     // 区画の縁の道路の半分の幅
  const inner = [rect[0] + hw(rect[0] === x0, isMajor(ci)), rect[1] + hw(rect[1] === z0, isMajor(cj)), rect[2] - hw(rect[2] === x0 + PC, isMajor(ci + 1)), rect[3] - hw(rect[3] === z0 + PC, isMajor(cj + 1))];
  const blk2 = [inner[0] + 2.5, inner[1] + 2.5, inner[2] - 2.5, inner[3] - 2.5];   // 歩道の内側
  const [st, sd] = nearestStn(cx, cz), h = R();
  let zone = sd < 170 ? 'core' : sd < 450 ? 'town' : 'resi';
  if (zone !== 'core' && h < 0.06) zone = 'park'; else if (zone === 'resi' && h < 0.085) zone = 'temple';
  const L = { rect, inner, blk: blk2, zone, lots: [], trees: [], outside: !inside, major: [rect[0] === x0 && isMajor(ci), rect[1] === z0 && isMajor(cj), rect[2] === x0 + PC && isMajor(ci + 1), rect[3] === z0 + PC && isMajor(cj + 1)] };
  const bad = f => ringNearRect(f, 15) || STN_RES.some(r => overlap(r, f));
  const lots = (minW, maxW, g, cb) => {
    for (let x = blk2[0]; x < blk2[2] - 4;) {
      let w = rg(minW, maxW); if (blk2[2] - (x + w) < minW * 0.7) w = blk2[2] - x;
      for (let z = blk2[1]; z < blk2[3] - 4;) {
        let d = rg(minW, maxW); if (blk2[3] - (z + d) < minW * 0.7) d = blk2[3] - z;
        const f = [x + g, z + g, x + w - g, z + d - g]; if (f[2] - f[0] > 4 && f[3] - f[1] > 4 && !bad(f)) cb(f);
        z += d;
      }
      x += w;
    }
  };
  const pk = a => a[Math.floor(R() * a.length)];
  if (zone === 'park') {
    for (let k = 0; k < 14; k++) L.trees.push([rg(blk2[0] + 3, blk2[2] - 3), rg(blk2[1] + 3, blk2[3] - 3), rg(0.9, 1.4), 1]);
  } else if (zone === 'temple') {
    const c = [(blk2[0] + blk2[2]) / 2, (blk2[1] + blk2[3]) / 2], f = [c[0] - 11, c[1] - 8, c[0] + 11, c[1] + 8];
    if (!bad(f)) L.lots.push({ f, kind: 'temple' });
    for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; L.trees.push([c[0] + Math.cos(a) * 30, c[1] + Math.sin(a) * 26, rg(1, 1.4), 2]); }
  } else if (zone === 'core') {
    lots(22, 40, 2, f => { const q = R();
      if (q < 0.55) L.lots.push({ f, kind: 'box', h: rg(40, 130), key: pk(['glass', 'glassDark', 'office', 'office2', 'glass']) });
      else if (q < 0.85) L.lots.push({ f, kind: 'box', h: rg(10, 22), key: pk(SHOPS) });
      else { L.lots.push({ f, kind: 'plaza' }); L.trees.push([(f[0] + f[2]) / 2, (f[1] + f[3]) / 2, 1, 1]); } });
  } else if (zone === 'town') {
    lots(11, 20, 1.2, f => { const q = R();
      if (q < 0.4) L.lots.push({ f, kind: 'box', h: rg(7, 15), key: pk(SHOPS) });
      else if (q < 0.84) L.lots.push({ f, kind: 'box', h: rg(12, 42), key: pk(['resi', 'resi2', 'office', 'office2', 'brick']) });
      else if (q < 0.92) L.lots.push({ f, kind: 'parking' });
      else L.lots.push({ f, kind: 'box', h: 5.2, key: pk(KONBINI) }); });
  } else {
    lots(9, 13, 0.7, f => { const q = R();
      if (q < 0.66) L.lots.push({ f, kind: 'gable', h: rg(5.5, 7), rh: rg(2, 3), key: pk(HOUSES), roof: pk(ROOFS) });
      else if (q < 0.94) L.lots.push({ f, kind: 'box', h: rg(9, 22), key: pk(['resi', 'resi2', 'house1']) });
      else { L.lots.push({ f, kind: 'garden' }); L.trees.push([(f[0] + f[2]) / 2, (f[1] + f[3]) / 2, 0.9, 1]); } });
  }
  // 大通り沿いの街路樹
  const ins = L.inner;
  if (L.major[0]) for (let z = ins[1] + 6; z < ins[3] - 3; z += 16) L.trees.push([ins[0] + 1.2, z, 0.9, 0]);
  if (L.major[2]) for (let z = ins[1] + 6; z < ins[3] - 3; z += 16) L.trees.push([ins[2] - 1.2, z, 0.9, 0]);
  if (L.major[1]) for (let x = ins[0] + 6; x < ins[2] - 3; x += 16) L.trees.push([x, ins[1] + 1.2, 0.9, 0]);
  if (L.major[3]) for (let x = ins[0] + 6; x < ins[2] - 3; x += 16) L.trees.push([x, ins[3] - 1.2, 0.9, 0]);
  L.trees = L.trees.filter(([x, z]) => !ringNearRect([x, z, x, z], 9) && !STN_RES.some(r => inR(r, x, z)));
  LAYOUT.set(key, L); return L;
}
// 地面テクスチャ・地図への描画
const ZONE_COL = { core: '#a8a29a', town: '#8f8b82', resi: '#8a867c', park: GRASS, temple: '#b8ad92' };
function procPaint(g, T, simple = false) {
  for (let ci = Math.floor(T[0] / PC); ci <= Math.floor((T[2] - 0.01) / PC); ci++) for (let cj = Math.floor(T[1] / PC); cj <= Math.floor((T[3] - 0.01) / PC); cj++) {
    const L = cellLayout(ci, cj); if (!L || L.outside) continue;
    const [x0, z0, x1, z1] = L.rect, I = L.inner, B = L.blk;
    g.fillStyle = '#3c3c42'; g.fillRect(x0, z0, x1 - x0, z1 - z0);
    g.fillStyle = '#8f8b82'; g.fillRect(I[0], I[1], I[2] - I[0], I[3] - I[1]);
    g.fillStyle = ZONE_COL[L.zone]; g.fillRect(B[0], B[1], B[2] - B[0], B[3] - B[1]);
    if (!simple) {
      g.fillStyle = '#e8e6dc';   // 大通りの中央線
      if (L.major[0]) for (let z = z0; z < z1; z += 6) g.fillRect(x0 - 0.15, z, 0.3, 3);
      if (L.major[1]) for (let x = x0; x < x1; x += 6) g.fillRect(x, z0 - 0.15, 3, 0.3);
    }
    for (const lt of L.lots) {
      const f = lt.f;
      g.fillStyle = lt.kind === 'box' ? fpColor(lt.key) : lt.kind === 'gable' ? (ROOF_FP[lt.roof] || '#3a3436') : lt.kind === 'parking' ? '#46464c'
        : lt.kind === 'plaza' ? '#b4ab9c' : lt.kind === 'garden' ? GRASS : lt.kind === 'temple' ? '#5a3a2a' : '#888';
      g.fillRect(f[0], f[1], f[2] - f[0], f[3] - f[1]);
    }
  }
}
// 建物の組み立て (200m チャンク単位)
const PROC = new Map();
const pTrunk = new THREE.CylinderGeometry(0.25, 0.35, 3, 5).translate(0, 1.5, 0), pCrown = new THREE.IcosahedronGeometry(2.3, 0).translate(0, 4.6, 0), pPine = new THREE.ConeGeometry(2.8, 4.2, 6).translate(0, 4.6, 0);
const pTrunkM = lam({ color: 0x5a4430 }), pCrownM = lam({ color: 0xffffff });
function removeSolid(s) {
  for (let i = Math.floor(s[0] / HG); i <= Math.floor(s[2] / HG); i++) for (let j = Math.floor(s[1] / HG); j <= Math.floor(s[3] / HG); j++) {
    const a = HASH.get(i * 100003 + j); if (a) { const k = a.indexOf(s); if (k >= 0) a.splice(k, 1); }
  }
}
function buildProc(ki, kj) {
  const holder = { buckets: {}, group: new THREE.Group() }, sols = [], trees = [];
  const sol = (x0, z0, x1, z1, y0, y1, soft) => { const s = [x0, z0, x1, z1, y0, y1, !!soft]; sols.push(s);
    for (let i = Math.floor(x0 / HG); i <= Math.floor(x1 / HG); i++) for (let j = Math.floor(z0 / HG); j <= Math.floor(z1 / HG); j++) { const k = i * 100003 + j; let a = HASH.get(k); if (!a) HASH.set(k, a = []); a.push(s); } };
  for (let ci = ki * 2; ci < ki * 2 + 2; ci++) for (let cj = kj * 2; cj < kj * 2 + 2; cj++) {
    const L = cellLayout(ci, cj); if (!L) continue;
    for (const lt of L.lots) {
      const [x0, z0, x1, z1] = lt.f;
      if (lt.kind === 'box') {
        pushBox(bucket(holder, lt.key), bucket(holder, 'ROOF'), x0, 0, z0, x1, lt.h, z1);
        if (!L.outside) sol(x0, z0, x1, z1, 0, lt.h);
        if (lt.h > 30) { const w = (x1 - x0) * 0.35, d = (z1 - z0) * 0.35, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, c = bucket(holder, 'CONC'); pushBox(c, c, cx - w / 2, lt.h, cz - d / 2, cx + w / 2, lt.h + 3, cz + d / 2); if (!L.outside) sol(cx - w / 2, cz - d / 2, cx + w / 2, cz + d / 2, lt.h, lt.h + 3); }
      } else if (lt.kind === 'gable') {
        const w = bucket(holder, lt.key); pushBox(w, bucket(holder, 'ROOF'), x0, 0, z0, x1, lt.h, z1); pushGable(bucket(holder, lt.roof), w, x0, lt.h, z0, x1, lt.h + lt.rh, z1);
        if (!L.outside) { sol(x0, z0, x1, z1, 0, lt.h); const ix = (x1 - x0) * 0.3, iz = (z1 - z0) * 0.3; sol(x0 + ix, z0 + iz, x1 - ix, z1 - iz, lt.h, lt.h + lt.rh * 0.7); }
      } else if (lt.kind === 'temple') {   // お寺の本堂
        const w = bucket(holder, 'WOOD'); pushBox(w, bucket(holder, 'ROOF'), x0, 0, z0, x1, 7, z1); pushGable(bucket(holder, 'RF2'), w, x0, 7, z0, x1, 13, z1);
        if (!L.outside) { sol(x0, z0, x1, z1, 0, 7); sol(x0 + 6, z0 + 5, x1 - 6, z1 - 5, 7, 11); }
      }
    }
    if (!L.outside) for (const t of L.trees) trees.push(t);
  }
  for (const [key, t] of Object.entries(holder.buckets)) {
    if (!t.pos.length) continue;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(t.pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(t.nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(t.uv, 2));
    holder.group.add(new THREE.Mesh(g, WALL[key]));
  }
  if (trees.length) {
    const tr = new THREE.InstancedMesh(pTrunk, pTrunkM, trees.length), cr = new THREE.InstancedMesh(pCrown, pCrownM, trees.length), d = new THREE.Object3D();
    const pines = trees.filter(t => t[3] === 2), pi = pines.length ? new THREE.InstancedMesh(pPine, pCrownM, pines.length) : null; let pk = 0;
    trees.forEach(([x, z, s, type], i) => {
      d.position.set(x, 0, z); d.scale.setScalar(s); d.rotation.set(0, hash2(x | 0, z | 0) * 6, 0); d.updateMatrix(); tr.setMatrixAt(i, d.matrix);
      const col = new THREE.Color(type === 0 ? SEASON.street[i % SEASON.street.length] : ['#4f8a38', '#5f9a40', '#3f7a32'][i % 3]);
      if (type === 2) { pi.setMatrixAt(pk, d.matrix); pi.setColorAt(pk++, new THREE.Color(['#2f5a2a', '#3a6630'][i % 2])); d.scale.setScalar(0); d.updateMatrix(); }
      cr.setMatrixAt(i, d.matrix); cr.setColorAt(i, col);
      sol(x - 0.5 * s, z - 0.5 * s, x + 0.5 * s, z + 0.5 * s, 0, 6.8 * s, true);
    });
    holder.group.add(tr, cr); if (pi) holder.group.add(pi);
  }
  scene.add(holder.group);
  return { group: holder.group, sols };
}
function disposeProc(c) {
  scene.remove(c.group); c.group.traverse(o => { if (o.geometry && o.geometry !== pTrunk && o.geometry !== pCrown && o.geometry !== pPine) o.geometry.dispose(); });
  for (const s of c.sols) removeSolid(s);
}
let procTick = 0;
function streamProc(dt) {
  const cx = camera.position.x, cz = camera.position.z, R = Math.min(1500, 760 + Math.max(0, camera.position.y) * 2.2);
  for (const [k, c] of PROC) if (Math.hypot(c.cx - cx, c.cz - cz) > R + 300) { disposeProc(c); PROC.delete(k); }
  let best = null, bd = Infinity;
  const r = Math.ceil(R / 200);
  const ki0 = Math.floor(cx / 200), kj0 = Math.floor(cz / 200);
  for (let ki = ki0 - r; ki <= ki0 + r; ki++) for (let kj = kj0 - r; kj <= kj0 + r; kj++) {
    const k = ki * 100003 + kj; if (PROC.has(k)) continue;
    const ccx = ki * 200 + 100, ccz = kj * 200 + 100, d = Math.hypot(ccx - cx, ccz - cz); if (d > R || d >= bd) continue;
    if (!(cellLayout(ki * 2, kj * 2) || cellLayout(ki * 2 + 1, kj * 2) || cellLayout(ki * 2, kj * 2 + 1) || cellLayout(ki * 2 + 1, kj * 2 + 1))) { PROC.set(k, { cx: ccx, cz: ccz, group: new THREE.Group(), sols: [] }); continue; }
    bd = d; best = [ki, kj];
  }
  if (best) { const c = buildProc(...best); c.cx = best[0] * 200 + 100; c.cz = best[1] * 200 + 100; PROC.set(best[0] * 100003 + best[1], c); }
}
// 陸と海の境目の護岸 (自動生成の街の東側)
{
  const wall = (x0, z0, x1, z1) => box(x1 - x0, 5, z1 - z0, seawall, (x0 + x1) / 2, -2.5, (z0 + z1) / 2);
  wall(430, -1301, MAXX, -1300); wall(-321, 320, -320, 700); wall(-600, 699, -320, 700); wall(-601, 700, -600, MAXZ);
}

