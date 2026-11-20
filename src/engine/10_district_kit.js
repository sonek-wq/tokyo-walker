/* ============================================================
   拡張エリアの街づくり: 街区ごとに性格を変えてメリハリを出す
   (オフィス街 / 商店街 / 住宅街 / 雑居ビル街 / 神社 / 公園 / 駐車場 …)
   ============================================================ */
const PINES = [], ROUND = [], MAPLES = [], GINKGO = [];
const LAMPS2 = [], DECKS = [];
const SIGNS = [], AWNINGS = [], POLES = [], WIRES = [], VENDS = [], LANTERNS = [], BENCHES = [], PARKED = [], HODO = [];
const norm3 = (x, y, z) => { const l = Math.hypot(x, y, z); return [x / l, y / l, z / l]; };
function pushTri(t, a, b, c, n, uvs) { t.pos.push(...a, ...b, ...c); for (let i = 0; i < 3; i++) t.nor.push(...n); t.uv.push(...uvs); }
// 切妻屋根 (長辺方向に棟)
function pushGable(rt, wt, x0, y1, z0, x1, yr, z1) {
  const o = 0.45, e = y1 - 0.25;
  if (x1 - x0 >= z1 - z0) {
    const zm = (z0 + z1) / 2, L = Math.hypot(zm - z0 + o, yr - e), U = (x1 - x0 + 2 * o) / 4;
    pushQuad(rt, [x1 + o, e, z0 - o], [x0 - o, e, z0 - o], [x0 - o, yr, zm], [x1 + o, yr, zm], norm3(0, zm - z0, -(yr - y1)), 0, 0, U, L / 4);
    pushQuad(rt, [x0 - o, e, z1 + o], [x1 + o, e, z1 + o], [x1 + o, yr, zm], [x0 - o, yr, zm], norm3(0, z1 - zm, yr - y1), 0, 0, U, L / 4);
    pushTri(wt, [x0, y1, z0], [x0, y1, z1], [x0, yr, zm], [-1, 0, 0], [z0 / 16, y1 / 16, z1 / 16, y1 / 16, zm / 16, yr / 16]);
    pushTri(wt, [x1, y1, z1], [x1, y1, z0], [x1, yr, zm], [1, 0, 0], [z1 / 16, y1 / 16, z0 / 16, y1 / 16, zm / 16, yr / 16]);
  } else {
    const xm = (x0 + x1) / 2, L = Math.hypot(xm - x0 + o, yr - e), U = (z1 - z0 + 2 * o) / 4;
    pushQuad(rt, [x0 - o, e, z0 - o], [x0 - o, e, z1 + o], [xm, yr, z1 + o], [xm, yr, z0 - o], norm3(-(yr - y1), xm - x0, 0), 0, 0, U, L / 4);
    pushQuad(rt, [x1 + o, e, z1 + o], [x1 + o, e, z0 - o], [xm, yr, z0 - o], [xm, yr, z1 + o], norm3(yr - y1, x1 - xm, 0), 0, 0, U, L / 4);
    pushTri(wt, [x1, y1, z0], [x0, y1, z0], [xm, yr, z0], [0, 0, -1], [x1 / 16, y1 / 16, x0 / 16, y1 / 16, xm / 16, yr / 16]);
    pushTri(wt, [x0, y1, z1], [x1, y1, z1], [xm, yr, z1], [0, 0, 1], [x0 / 16, y1 / 16, x1 / 16, y1 / 16, xm / 16, yr / 16]);
  }
}
const ROOF_FP = { RF0: '#4a5c70', RF1: '#7a4a38', RF2: '#3e3e46', RF_TERRA: '#b0583a', RF_COPPER: '#3e7a64' };
function gableBuilding(f, h, rh, wallKey, roofKey) {
  const [x0, z0, x1, z1] = f, holder = chunkAt((x0 + x1) / 2, (z0 + z1) / 2), w = bucket(holder, wallKey);
  pushBox(w, bucket(holder, 'ROOF'), x0, 0, z0, x1, h, z1);
  pushGable(bucket(holder, roofKey), w, x0, h, z0, x1, h + rh, z1);
  solid(x0, z0, x1, z1, 0, h);
  const ix = (x1 - x0) * 0.3, iz = (z1 - z0) * 0.3; solid(x0 + ix, z0 + iz, x1 - ix, z1 - iz, h, h + rh * 0.7);
  fr(x0, z0, x1, z1, ROOF_FP[roofKey] || '#3a3436');
}
function placeLots(Rc, minW, maxW, cb) {
  for (let x = Rc[0]; x < Rc[2] - 4;) {
    let w = rr(minW, maxW); if (Rc[2] - (x + w) < minW * 0.7) w = Rc[2] - x;
    for (let z = Rc[1]; z < Rc[3] - 4;) {
      let d = rr(minW, maxW); if (Rc[3] - (z + d) < minW * 0.7) d = Rc[3] - z;
      cb([x, z, x + w, z + d]); z += d;
    }
    x += w;
  }
}
const inset = (r, g) => [r[0] + g, r[1] + g, r[2] - g, r[3] - g];
const okLot = (f, res) => f[2] - f[0] > 4 && f[3] - f[1] > 4 && !res.some(r => overlap(r, f));
function faceOf(f, Rc) { const d = [f[1] - Rc[1], Rc[3] - f[3], f[0] - Rc[0], Rc[2] - f[2]]; return 'nswe'[d.indexOf(Math.min(...d))]; }
// 看板・日よけ: face = 建物のどの面が通りに向いているか
function addSign(f, face, h) {
  const hs = Math.min(4.5, h - 4.6); if (hs < 1.2) return;
  const y = 4.3 + hs / 2, v = Math.floor(rnd() * 5);
  if (face === 's' || face === 'n') SIGNS.push({ x: rr(f[0] + 1, f[2] - 1), z: face === 's' ? f[3] + 0.6 : f[1] - 0.6, y, h: hs, rot: 0, v });
  else SIGNS.push({ x: face === 'e' ? f[2] + 0.6 : f[0] - 0.6, z: rr(f[1] + 1, f[3] - 1), y, h: hs, rot: Math.PI / 2, v });
}
function addAwning(f, face) {
  const c = pick(AWN_COLS);
  if (face === 's' || face === 'n') AWNINGS.push({ x: (f[0] + f[2]) / 2, z: face === 's' ? f[3] + 0.55 : f[1] - 0.55, w: f[2] - f[0] - 0.8, rot: 0, c });
  else AWNINGS.push({ x: face === 'e' ? f[2] + 0.55 : f[0] - 0.55, z: (f[1] + f[3]) / 2, w: f[3] - f[1] - 0.8, rot: Math.PI / 2, c });
}
function poleLine(x0, z0, x1, z1, step = 22) {
  const n = Math.max(1, Math.round(Math.hypot(x1 - x0, z1 - z0) / step)); let prev = null;
  for (let i = 0; i <= n; i++) {
    const p = [x0 + (x1 - x0) * i / n, z0 + (z1 - z0) * i / n, Math.atan2(x1 - x0, z1 - z0)];
    POLES.push(p); solid(p[0] - 0.2, p[1] - 0.2, p[0] + 0.2, p[1] + 0.2, 0, 9, true);
    if (prev) WIRES.push([prev, p]); prev = p;
  }
}
function coinParking(f, face) {
  fr(...f, '#46464c');
  const alongX = face === 's' || face === 'n';
  if (alongX) { for (let x = f[0] + 0.5; x < f[2] - 2.5; x += 2.6) { fr(x, f[1] + 1, x + 0.15, f[1] + 6, '#e8e6dc'); fr(x, f[3] - 6, x + 0.15, f[3] - 1, '#e8e6dc'); if (rnd() < 0.55) PARKED.push([x + 1.3, f[1] + 3.5, 0]); if (rnd() < 0.55) PARKED.push([x + 1.3, f[3] - 3.5, Math.PI]); } }
  else { for (let z = f[1] + 0.5; z < f[3] - 2.5; z += 2.6) { fr(f[0] + 1, z, f[0] + 6, z + 0.15, '#e8e6dc'); fr(f[2] - 6, z, f[2] - 1, z + 0.15, '#e8e6dc'); if (rnd() < 0.55) PARKED.push([f[0] + 3.5, z + 1.3, Math.PI / 2]); if (rnd() < 0.55) PARKED.push([f[2] - 3.5, z + 1.3, -Math.PI / 2]); } }
  const px = face === 'e' ? f[2] - 0.6 : face === 'w' ? f[0] + 0.6 : (f[0] + f[2]) / 2, pz = face === 's' ? f[3] - 0.6 : face === 'n' ? f[1] + 0.6 : (f[1] + f[3]) / 2;
  blk(px - 0.08, 0, pz - 0.08, px + 0.08, 3, pz + 0.08, dark, false); box(1.2, 1.2, 0.15, glow(lam({ color: 0xf0c020 }), 0xf0c020, 0.6), px, 3.4, pz);
}
function konbiniB(f, face) {
  const g = [...f], D = 16;
  if (face === 's') g[1] = Math.max(f[1], f[3] - D); if (face === 'n') g[3] = Math.min(f[3], f[1] + D);
  if (face === 'e') g[0] = Math.max(f[0], f[2] - D); if (face === 'w') g[2] = Math.min(f[2], f[0] + D);
  addBuilding(...g, 5.2, pick(KONBINI), { noRoofBox: true });
  const vx = face === 'e' ? g[2] + 0.5 : face === 'w' ? g[0] - 0.5 : g[0] + 1.5, vz = face === 's' ? g[3] + 0.5 : face === 'n' ? g[1] - 0.5 : g[1] + 1.5;
  VENDS.push([vx, vz, face === 's' ? 0 : face === 'n' ? Math.PI : face === 'e' ? Math.PI / 2 : -Math.PI / 2]);
}
function office(Rc, res) {
  placeLots(Rc, 26, 44, lot => {
    const f = inset(lot, 2); if (!okLot(f, res)) return;
    const q = rnd(), key = pick(['office', 'glass', 'glassDark', 'office2']);
    if (q < 0.14) { // 公開空地 (小さな広場)
      tiles(...f, '#b4ab9c', '#9e968a', 3);
      for (let k = 0; k < 4; k++) ROUND.push([rr(f[0] + 3, f[2] - 3), rr(f[1] + 3, f[3] - 3), 1]);
      BENCHES.push([(f[0] + f[2]) / 2, (f[1] + f[3]) / 2, 0]); return;
    }
    if (q < 0.45 && f[2] - f[0] > 22 && f[3] - f[1] > 22) { // 低層部 + タワー
      addBuilding(...f, rr(10, 18), pick(['office', 'office2', 'station']));
      addBuilding(...inset(f, rr(4, 7)), rr(70, 160), key);
    } else addBuilding(...f, rr(25, 75), key);
  });
}
function mixed(Rc, res) {
  let konbini = false;
  placeLots(Rc, 13, 24, lot => {
    const f = inset(lot, 1.2); if (!okLot(f, res)) return;
    const face = faceOf(f, Rc), q = rnd();
    if (q < 0.07) return coinParking(f, face);
    if (!konbini && q < 0.17) { konbini = true; return konbiniB(f, face); }
    if (q < 0.5) { const h = rr(8, 15); addBuilding(...f, h, pick(SHOPS)); addSign(f, face, h); if (rnd() < 0.6) addAwning(f, face); }
    else { const h = rnd() < 0.8 ? rr(15, 40) : rr(40, 70); addBuilding(...f, h, pick(['resi', 'resi2', 'brick', 'office', 'office2'])); if (rnd() < 0.35) addSign(f, face, 14); }
  });
}
function textTex(text, bg, fg, w = 128, h = 24) {
  return tex(w, h, x => { x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.font = `bold ${h - 6}px "DotGothic16", sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, w / 2, h / 2 + 1); });
}
function shotengai(Rc, res, name, gateText) {
  const zc = (Rc[1] + Rc[3]) / 2, hw = 3.5, L0 = Rc[0], L1 = Rc[2];
  tiles(L0, zc - hw, L1, zc + hw, '#b0a48e', '#9a8e7a', 1.5);
  SPOT_AREAS.push([name, L0, zc - 20, L1, zc + 20]);
  const gm = lam({ color: 0x8a8a90 }), sm = glow(lam({ map: textTex(gateText, '#b02a20', '#fff2c0') }), 0xffffff, 0.8);
  for (const gx of [L0 + 1.2, L1 - 1.2]) {
    for (const dz of [-3.3, 3.3]) blk(gx - 0.3, 0, zc + dz - 0.3, gx + 0.3, 6, zc + dz + 0.3, gm);
    const sb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.4, 7.4), [sm, sm, gm, gm, gm, gm]); sb.position.set(gx, 6.6, zc); scene.add(sb);
    solid(gx - 0.3, zc - 3.7, gx + 0.3, zc + 3.7, 5.9, 7.3);
  }
  for (const side of [-1, 1]) { // 通りの両側に間口の狭い店
    for (let x = L0 + 3; x < L1 - 6;) {
      const w = rr(6, 10), d = rr(11, 15), x1 = Math.min(x + w, L1 - 3);
      const f = side < 0 ? [x, zc - hw - d, x1, zc - hw - 0.3] : [x, zc + hw + 0.3, x1, zc + hw + d];
      if (okLot(f, res)) { const h = rr(7, 14); addBuilding(...f, h, pick(SHOPS)); addSign(f, side < 0 ? 's' : 'n', h); if (rnd() < 0.75) addAwning(f, side < 0 ? 's' : 'n'); }
      x = x1 + 0.4;
    }
    for (let x = L0 + 5; x < L1 - 4; x += 5) LANTERNS.push([x, zc + side * (hw - 0.5)]);
  }
  mixed([Rc[0], Rc[1], Rc[2], zc - hw - 17], res); mixed([Rc[0], zc + hw + 17, Rc[2], Rc[3]], res);
}
function kidsPark(S, name) {
  const f = inset(S, 1.5);
  fr(...S, '#6f6a5e'); fr(...f, '#c8b88a');
  SPOT_AREAS.push([name, ...S]);
  for (let x = f[0] + 2; x < f[2] - 1; x += 7) ROUND.push([x, f[1] + 1.5, 0.8], [x, f[3] - 1.5, 0.8]);
  const cx = (f[0] + f[2]) / 2, cz = (f[1] + f[3]) / 2, red = lam({ color: 0xd04030 }), steel = lam({ color: 0x6a8ab0 });
  blk(cx - 1, 0, cz - 4, cx + 1, 2.4, cz - 2.5, red);                                     // すべり台
  const sl = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 4.3), steel); sl.position.set(cx, 1.25, cz - 0.5); sl.rotation.x = -0.6; scene.add(sl);
  for (const dx of [-2.5, 2.5]) blk(cx + 6 + dx - 0.1, 0, cz - 0.1, cx + 6 + dx + 0.1, 2.6, cz + 0.1, steel); // ブランコ
  blk(cx + 3.4, 2.5, cz - 0.1, cx + 8.6, 2.7, cz + 0.1, steel);
  BENCHES.push([cx - 5, cz + 3, 0]);
}
function residential(Rc, res, name, parkName) {
  const xm = (Rc[0] + Rc[2]) / 2, zm = (Rc[1] + Rc[3]) / 2, lw = 3;
  fr(Rc[0], zm - lw, Rc[2], zm + lw, '#4a4a50'); fr(xm - lw, Rc[1], xm + lw, Rc[3], '#4a4a50');
  for (const d of [-1, 1]) { fr(Rc[0], zm + d * (lw - 0.4) - 0.08, Rc[2], zm + d * (lw - 0.4) + 0.08, '#d8d6cc'); fr(xm + d * (lw - 0.4) - 0.08, Rc[1], xm + d * (lw - 0.4) + 0.08, Rc[3], '#d8d6cc'); }
  const subs = [[Rc[0], Rc[1], xm - lw, zm - lw], [xm + lw, Rc[1], Rc[2], zm - lw], [Rc[0], zm + lw, xm - lw, Rc[3]], [xm + lw, zm + lw, Rc[2], Rc[3]]];
  const pi = Math.floor(rnd() * 4);
  subs.forEach((S, i) => {
    if (i === pi && parkName) { const P2 = [S[0], S[1], Math.min(S[2], S[0] + 40), Math.min(S[3], S[1] + 36)]; kidsPark(P2, parkName); res = [...res, P2]; }
    placeLots(S, 9, 13, lot => {
      const f = inset(lot, 0.7); if (!okLot(f, res)) return;
      if (rnd() < 0.72) gableBuilding(f, rr(5.5, 7), rr(2, 3), pick(HOUSES), pick(ROOFS));
      else addBuilding(...f, rr(9, 22), pick(['resi', 'resi2', 'house1']));
    });
  });
  poleLine(Rc[0] + 2, zm - lw - 0.6, Rc[2] - 2, zm - lw - 0.6); poleLine(xm + lw + 0.6, Rc[1] + 2, xm + lw + 0.6, Rc[3] - 2);
  VENDS.push([xm - lw - 0.6, zm - lw - 1.5, Math.PI / 2], [xm + lw + 0.6, zm + lw + 1.5, -Math.PI / 2]);
  DIST_AREAS.push([name, ...Rc]);
}
function shrine(S, name, ginkgo = 1) {
  const [x0, z0, x1, z1] = S, cx = (x0 + x1) / 2, ver = lam({ color: 0xd2452a }), stone = lam({ color: 0xa8a090 });
  fr(...S, '#bfb497'); fr(cx - 2, z0 + 10, cx + 2, z1, '#a8a090');
  SPOT_AREAS.push([name, ...S]);
  const tz = z1 - 3; // 鳥居
  for (const dx of [-3.2, 3.2]) blk(cx + dx - 0.35, 0, tz - 0.35, cx + dx + 0.35, 6.2, tz + 0.35, ver);
  blk(cx - 4.6, 6.2, tz - 0.5, cx + 4.6, 6.8, tz + 0.5, lam({ color: 0x2a2a2a })); blk(cx - 3.9, 5.1, tz - 0.25, cx + 3.9, 5.5, tz + 0.25, ver, false);
  // 社殿
  const hz0 = z0 + 5, hz1 = z0 + 17, holder = chunkAt(cx, (hz0 + hz1) / 2);
  pushBox(bucket(holder, 'WOOD'), bucket(holder, 'ROOF'), cx - 7, 0.8, hz0, cx + 7, 5, hz1);
  pushGable(bucket(holder, 'RF_COPPER'), bucket(holder, 'WOOD'), cx - 7, 5, hz0, cx + 7, 8.5, hz1);
  blk(cx - 8, 0, hz0 - 1, cx + 8, 0.8, hz1 + 1, stone); solid(cx - 7, hz0, cx + 7, hz1, 0.8, 5); solid(cx - 4, hz0 + 3, cx + 4, hz1 - 3, 5, 7.5);
  fr(cx - 8, hz0 - 1, cx + 8, hz1 + 1, '#5a3a2a');
  for (const dx of [-2.5, 2.5]) blk(cx + dx - 0.4, 0, z1 - 12, cx + dx + 0.4, 1.8, z1 - 11.2, stone); // 灯籠
  for (let k = 0; k < ginkgo; k++) GINKGO.push([cx + (k % 2 ? 1 : -1) * rr(9, (x1 - x0) / 2 - 3), rr(z0 + 6, z1 - 8), 1.6 + rnd() * 0.6]);
  for (let x = x0 + 2; x < x1; x += 6) PINES.push([x, z0 + 2, rr(0.9, 1.3)]);
}
function hodokyo(rd, zc, label) { // 歩道橋 (階段で登れる)
  const x0 = rd[0] - 3.6, x1 = rd[2] + 3.6, H = 5.8, run = 0.55, n = 15, L = n * run;
  const bm = lam({ color: 0x5a7a9a }), gm = lam({ color: 0x8aa0b8 });
  blk(x0, H - 0.6, zc - 1.3, x1, H, zc + 1.3, bm);
  for (const dz of [-1.25, 1.25]) box(x1 - x0, 1.1, 0.1, gm, (x0 + x1) / 2, H + 0.55, zc + dz);
  HODO.push([x0, zc - 1.3, x1, zc + 1.3, label]);
  const stair = (sx0, sx1, zt, dir) => {
    for (let k = 0; k < n; k++) { const a = zt + dir * (L - k * run); solid(sx0, Math.min(a, zt), sx1, Math.max(a, zt), 0, (k + 1) * H / n); }
    const len = Math.hypot(L, H), m = new THREE.Mesh(new THREE.BoxGeometry(sx1 - sx0, 0.35, len), bm);
    m.position.set((sx0 + sx1) / 2, H / 2 - 0.1, zt + dir * L / 2); m.rotation.x = dir * Math.atan2(H, L); scene.add(m);
    fr(sx0, Math.min(zt, zt + dir * L), sx1, Math.max(zt, zt + dir * L), '#6a7a8a');
  };
  stair(x0, x0 + 2.4, zc - 1.3, -1); stair(x1 - 2.4, x1, zc + 1.3, 1);
  fr(x0, zc - 1.3, x1, zc + 1.3, '#5a6a7a');
}
function subwayEntrance(x0, z0, x1, z1, label, col) {
  blk(x0, 0, z0, x1, 2.6, z1, lam({ color: 0xc8ccd0 })); fr(x0, z0, x1, z1, '#6a6e74');
  box(x1 - x0 + 0.2, 0.5, 0.6, glow(lam({ color: col }), col, 0.9), (x0 + x1) / 2, 2.9, z1);
  SPOT_AREAS.push([label, x0 - 4, z0 - 4, x1 + 4, z1 + 4]);
}

// ---- 名所・ランドマーク (拡張エリア)
const C1 = [-688, -505], C2 = [-914, -724], C3 = [-1102, -934];
const R1 = [-476, -172], R2 = [-148, -72], R3 = [-48, 128], R4 = [152, 256];
const B = (c, r) => [c[0], r[0], c[1], r[1]];
const SHRINE1 = [-830, -142, -768, -80], SHRINE2 = [-1428, -240, -1384, -178];
const KUYAKUSHO = [-1090, -252, -1015, -188], BUS = [-604, -44, -509, 124], MONO = [-507, 12, -473, 148];
const KOBAN1 = [-688, -47, -681, -41];
const EXP_RES = [...RESERVED, SHRINE1, KUYAKUSHO, BUS, KOBAN1];
addBuilding(...KUYAKUSHO, 58, 'office2');
SPOT_AREAS.push(['港区役所', -1096, -258, -1009, -182], ['東京モノレール 浜松町駅', -510, 8, -470, 152], ['浜松町駅 西口バスターミナル', -606, -48, -505, 128]);
shrine(SHRINE1, '芝大神宮', 2); shrine(SHRINE2, '芝東照宮', 1);
subwayEntrance(-723.6, -44, -720.6, -38, '大門駅', 0x3a8a5a); subwayEntrance(-691.4, -82, -688.4, -76, '大門駅', 0x3a8a5a);
subwayEntrance(-1105.6, -112, -1102.4, -106, '芝公園駅', 0x2a6ab0); subwayEntrance(-1105.6, -196, -1102.4, -190, '御成門駅', 0x2a6ab0);
hodokyo([-720, 0, -692, 0], -110, '歩道橋 (第一京浜)'); hodokyo([-1130, 0, -1106, 0], 60, '歩道橋 (日比谷通り)');
// ---- 街区 (性格づけ)
office(B(C1, [-476, -172]), EXP_RES); DIST_AREAS.push(['浜松町二丁目', ...B(C1, [-476, -72])]);
mixed(B(C1, R2), EXP_RES);
mixed([C1[0], R3[0], -606, R3[1]], EXP_RES); DIST_AREAS.push(['浜松町一丁目', C1[0], R3[0], -606, R3[1]]);
residential(B(C1, R4), EXP_RES, '芝一丁目', '芝一丁目児童遊園');
office(B(C2, R1), EXP_RES); DIST_AREAS.push(['芝大門二丁目', ...B(C2, R1)]);
mixed(B(C2, R2), EXP_RES); DIST_AREAS.push(['芝大門一丁目', ...B(C2, R2)]);
shotengai(B(C2, R3), EXP_RES, '大門 商店街', '大門商店街'); DIST_AREAS.push(['芝大門一丁目', ...B(C2, R3)]);
residential(B(C2, R4), EXP_RES, '芝二丁目', '芝二丁目児童遊園');
office(B(C3, R1), EXP_RES); DIST_AREAS.push(['御成門', ...B(C3, R1)]);
mixed(B(C3, R2), EXP_RES); DIST_AREAS.push(['芝公園一丁目', ...B(C3, R2)]);
residential(B(C3, R3), EXP_RES, '芝公園二丁目', '芝公園二丁目児童遊園');
mixed(B(C3, R4), EXP_RES); DIST_AREAS.push(['芝三丁目', ...B(C3, R4)]);
residential([-1676, 110, -1456, 256], EXP_RES, '東麻布', '東麻布児童遊園');
mixed([-1676, -476, -1456, -424], EXP_RES); DIST_AREAS.push(['芝公園四丁目', -1676, -476, -1456, -424]);
// ---- 浜松町駅 西口バスターミナル
tiles(...BUS, '#aaa49a', '#948d84', 3);
{
  const sh = lam({ color: 0xd8dce0 }), bus = lam({ color: 0xe8ece4 }), stripe = lam({ color: 0x2f9a5a });
  for (let z = -30; z < 120; z += 34) { blk(-560, 3, z, -548, 3.3, z + 3, sh); for (const x of [-559.5, -548.5]) blk(x - 0.1, 0, z + 1.4, x + 0.1, 3, z + 1.6, dark, false); }
  for (const [x, z] of [[-575, -10], [-575, 40], [-530, 90]]) { blk(x - 1.25, 0.3, z - 5.5, x + 1.25, 3.2, z + 5.5, bus); box(2.55, 0.5, 11.05, stripe, x, 1.2, z); }
  for (let z = 0; z < 60; z += 6) PARKED.push([-520, z, 0]);
  fr(-604, -44, -509, -40, '#3c3c42');
}
// ---- 東京モノレール (浜松町駅 → 南へ。マップ外まで続く)
const MONO_X = -490;
{
  const conc = concrete;
  const beam = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.8, 2200), conc); beam.position.set(MONO_X, 9.2, 1110); scene.add(beam);
  solid(MONO_X - 0.5, 150, MONO_X + 0.5, 290, 8.3, 10.1);
  for (let z = 170; z < 2200; z += 30) { box(1.4, 8.3, 1.4, conc, MONO_X, 4.15, z); if (z < 290) solid(MONO_X - 0.7, z - 0.7, MONO_X + 0.7, z + 0.7, 0, 8.3); }
  const st = new THREE.Mesh(boxGeo(MONO[2] - MONO[0], 7.6, MONO[3] - MONO[1]), MATS.station); st.position.set((MONO[0] + MONO[2]) / 2, 11.8, (MONO[1] + MONO[3]) / 2); scene.add(st);
  solid(...MONO, 8, 15.6);
  for (let z = 20; z < 148; z += 21) for (const x of [MONO[0] + 1, MONO[2] - 1]) { box(1, 8, 1, conc, x, 4, z); solid(x - 0.5, z - 0.5, x + 0.5, z + 0.5, 0, 8); }
}
// ---- 首都高速 都心環状線 (古川の上の高架。上に登れる)
const SHUTO_Y = 11.5;
{
  const roadTexEW = tex(32, 32, x => { x.fillStyle = '#45454b'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#e8e6dc'; for (const v of [0.05, 0.95]) x.fillRect(0, Math.round((1 - v) * 31), 32, 1); for (const v of [0.25, 0.75]) for (let u = 0; u < 32; u += 8) x.fillRect(u, Math.round((1 - v) * 31), 4, 1); x.fillStyle = '#e0b020'; x.fillRect(0, 15, 32, 1); });
  const roadTexNS = tex(32, 32, x => { x.fillStyle = '#45454b'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#e8e6dc'; for (const v of [0.05, 0.95]) x.fillRect(Math.round(v * 31), 0, 1, 32); for (const v of [0.25, 0.75]) for (let u = 0; u < 32; u += 8) x.fillRect(Math.round(v * 31), u, 1, 4); x.fillStyle = '#e0b020'; x.fillRect(15, 0, 1, 32); });
  const side = lam({ color: 0x8e8a82 }), wall = lam({ color: 0xb8c4bc });
  const ew = new THREE.Mesh(boxGeo(2488, 1.5, 20, 16, 20), [side, side, lam({ map: roadTexEW }), side, side, side]); ew.position.set(-1756, SHUTO_Y - 0.75, 302); scene.add(ew);
  const ns = new THREE.Mesh(boxGeo(20, 1.5, 2200, 20, 16), [side, side, lam({ map: roadTexNS }), side, side, side]); ns.position.set(-522, SHUTO_Y - 0.75, 1392); scene.add(ns);
  for (const z of [292.3, 311.7]) box(2468, 1.8, 0.3, wall, -1766, SHUTO_Y + 0.9, z);
  for (const x of [-531.7, -512.3]) box(0.3, 1.8, 2180, wall, x, SHUTO_Y + 0.9, 1402);
  for (let x = -2980; x < -540; x += 40) box(4, SHUTO_Y - 1.5, 3, side, x, (SHUTO_Y - 1.5) / 2, 302);
  for (let z = 340; z < 2400; z += 40) box(3, SHUTO_Y - 1.5, 4, side, -522, (SHUTO_Y - 1.5) / 2, z);
  solid(-1680, 292, -512, 312, SHUTO_Y - 1.5, SHUTO_Y);
  for (const z of [292.3, 311.7]) solid(-1680, z - 0.15, -512, z + 0.15, SHUTO_Y, SHUTO_Y + 1.8);
  SPOT_AREAS.push(['金杉橋', -724, 286, -688, 320], ['芝園橋', -1134, 286, -1102, 320], ['古川 河畔', -1680, 272, -476, 292]);
}
// ---- 芝公園: 芝丸山古墳 / もみじ谷
{
  const gm = lam({ color: 0x5f8a3e });
  for (const [r, h] of [[27, 2.5], [19, 5], [11, 7.5]]) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.92, r, 2.5, 10), gm); c.position.set(-1270, h - 1.25, -285); scene.add(c);
    const q = r * 0.8; solid(-1270 - q, -285 - q, -1270 + q, -285 + q, 0, h);
  }
  PINES.push([-1270, -285, 1.4]);
  SPOT_AREAS.push(['芝丸山古墳', -1300, -315, -1240, -255], ['もみじ谷', -1622, -132, -1510, -48]);
  for (let a = 0; a < Math.PI * 2; a += 0.35) MAPLES.push([-1566 + Math.cos(a) * rr(32, 42), -90 + Math.sin(a) * rr(22, 30), rr(0.8, 1.2)]);
  box(3, 4, 1, lam({ color: 0x6a6a64 }), -1566, 2, -108.5); // 小さな滝
  box(1.6, 3.6, 0.1, glow(lam({ color: 0xbfe0f0 }), 0x8ab0c8, 0.3), -1566, 1.8, -107.9);
}

