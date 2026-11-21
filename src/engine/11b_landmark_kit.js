/* ============================================================
   名所づくりの道具 (駅ファイルの build(st) から使う)
   - 線路の向きに合わせて回転した座標系 (frame) で建物を建てる
   - 多角形の建物・屋根・地面 / 道路の追加 / 自動生成の街を置かない範囲
   - 毎フレームの動き・実績・うんちく・ねこ・地図ラベルの登録口
   ============================================================ */
const LM_ZONES = [];      // 凸多角形 [[x,z],...]: この中には自動生成の建物・木を置かない
const LM_UPDATERS = [];   // (dt, t) => {}  毎フレーム呼ばれる
const LM_ACH = [];        // [id, 名前, 説明, () => 達成したか]
const LM_NOTES = {};      // 地名 → うんちく
const LM_CATS = [];       // ねこ [x, z, y]
const LM_STREET = [];     // 季節で色が変わる街路樹 [x, z, s]
const LM_LABELS = [];     // 全体マップのラベル (MAP_LABELS と同じ形)
const LM_PEOPLE = [];     // 歩く人 [[x0, z0, x1, z1], 人数]
const ROAD_STOPS = [];    // 信号で車が止まる交差点 { rect, red: ns => 赤信号か }

const zbb = P => P.bb || (P.bb = polyBB(P));   // 範囲の外接長方形 (一度だけ計算)
const inZone = (x, z) => LM_ZONES.some(P => inR(zbb(P), x, z, 0.01) && inPoly(P, x, z));
const zoneHitsRect = r => LM_ZONES.some(P => overlap(zbb(P), r) && polyHitsRect(P, r));

// ---- 回転した座標系: u = 軸方向, v = それに直交する向き (vHint の側)
function frame(ox, oz, ux, uz, vhx, vhz) {
  const l = Math.hypot(ux, uz); ux /= l; uz /= l;
  let vx = -uz, vz = ux; if (vx * vhx + vz * vhz < 0) { vx = -vx; vz = -vz; }
  const F = { ox, oz, ux, uz, vx, vz, ang: Math.atan2(ux, uz) };
  F.w = (u, v) => [ox + u * ux + v * vx, oz + u * uz + v * vz];
  F.rect = (u0, v0, u1, v1) => [F.w(u0, v0), F.w(u1, v0), F.w(u1, v1), F.w(u0, v1)];
  return F;
}
const AXIS = frame(0, 0, 1, 0, 0, 1);   // 回転なし (u = x, v = z)

// ---- 建物 (多角形の柱): 壁は外向き、天井は上向きに張る。チャンク毎・マテリアル毎に結合される
const holderFor = (x, z, h) => h >= 150 ? FAR : chunkAt(x, z);
function pushPrism(wallKey, topKey, P, y0, y1, opt = {}) {
  const c = polyC(P), H = opt.holder || holderFor(c[0], c[1], y1), wt = bucket(H, wallKey), tt = topKey ? bucket(H, topKey) : null;
  let acc = 0;
  for (let i = 0; i < P.length; i++) {
    let a = P[i], b = P[(i + 1) % P.length], nx = a[1] - b[1], nz = b[0] - a[0];
    const L = Math.hypot(nx, nz); if (L < 1e-6) continue; nx /= L; nz /= L;
    if (nx * ((a[0] + b[0]) / 2 - c[0]) + nz * ((a[1] + b[1]) / 2 - c[1]) < 0) { [a, b] = [b, a]; nx = -nx; nz = -nz; }
    pushQuad(wt, [a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], [nx, 0, nz], acc / 16, y0 / 16, (acc + L) / 16, y1 / 16);
    acc += L;
  }
  if (tt) for (let i = 1; i < P.length - 1; i++) {
    let a = P[0], b = P[i], d = P[i + 1];
    if ((b[1] - a[1]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[1] - a[1]) < 0) [b, d] = [d, b];
    pushTri(tt, [a[0], y1, a[1]], [b[0], y1, b[1]], [d[0], y1, d[1]], [0, 1, 0], [a[0] / 16, -a[1] / 16, b[0] / 16, -b[1] / 16, d[0] / 16, -d[1] / 16]);
  }
  if (opt.bottom) for (let i = 1; i < P.length - 1; i++) {   // 底面 (下から見える橋など)
    let a = P[0], b = P[i], d = P[i + 1];
    if ((b[1] - a[1]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[1] - a[1]) > 0) [b, d] = [d, b];
    pushTri(bucket(H, opt.bottom === true ? wallKey : opt.bottom), [a[0], y0, a[1]], [b[0], y0, b[1]], [d[0], y0, d[1]], [0, -1, 0], [0, 0, 1, 0, 1, 1]);
  }
  if (opt.solid !== false) polySolid(P, y0, y1);
  if (opt.fp) polyFr(P, opt.fp);
}
// 平らでない面 (屋根など): 凸多角形 pts3 を hint の向きに表を向けて張る
function pushFace(t, pts, hint, uScale = 4) {
  let [p0, p1, p2] = pts;
  let n = norm3((p1[1] - p0[1]) * (p2[2] - p0[2]) - (p1[2] - p0[2]) * (p2[1] - p0[1]), (p1[2] - p0[2]) * (p2[0] - p0[0]) - (p1[0] - p0[0]) * (p2[2] - p0[2]), (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]));
  if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0) { pts = [...pts].reverse(); n = n.map(v => -v); }
  const ax = norm3(pts[1][0] - pts[0][0], 0, pts[1][2] - pts[0][2]);
  const uv = p => [(p[0] * ax[0] + p[2] * ax[2]) / uScale, p[1] / 1.5];
  for (let i = 1; i < pts.length - 1; i++) pushTri(t, pts[0], pts[i], pts[i + 1], n, [...uv(pts[0]), ...uv(pts[i]), ...uv(pts[i + 1])]);
}
function polySolid(P, y0, y1, soft) {   // 回転した多角形は 2.5m 角の箱を並べて当たり判定にする
  const bb = polyBB(P);
  if (P.length === 4 && P.every(p => (p[0] === bb[0] || p[0] === bb[2]) && (p[1] === bb[1] || p[1] === bb[3]))) return solid(...bb, y0, y1, soft);
  const G = 2.5;
  for (let x = bb[0]; x < bb[2]; x += G) for (let z = bb[1]; z < bb[3]; z += G) {
    const x1 = Math.min(x + G, bb[2]), z1 = Math.min(z + G, bb[3]);
    if (inPoly(P, (x + x1) / 2, (z + z1) / 2)) solid(x, z, x1, z1, y0, y1, soft);
  }
}
const oBox = (F, key, u0, v0, u1, v1, y0, y1, opt = {}) => pushPrism(key, opt.top === undefined ? 'ROOF' : opt.top, F.rect(u0, v0, u1, v1), y0, y1, opt);
// 寄棟屋根 (長い方向に棟)
function oHip(F, key, u0, v0, u1, v1, y, rh, opt = {}) {
  const c = F.w((u0 + u1) / 2, (v0 + v1) / 2), t = bucket(opt.holder || holderFor(c[0], c[1], y + rh), key), o = opt.over ?? 0.4;
  u0 -= o; v0 -= o; u1 += o; v1 += o;
  const P = (u, v, yy) => { const [x, z] = F.w(u, v); return [x, yy, z]; }, up = [0, 1, 0];
  const out = (u, v) => { const [x, z] = F.w(u, v), [cx, cz] = c; return [x - cx, 1, z - cz]; };
  if (u1 - u0 >= v1 - v0) {
    const d = (v1 - v0) / 2, vm = (v0 + v1) / 2, ua = u0 + d, ub = u1 - d;
    pushFace(t, [P(u0, v0, y), P(u1, v0, y), P(ub, vm, y + rh), P(ua, vm, y + rh)], out((u0 + u1) / 2, v0));
    pushFace(t, [P(u1, v1, y), P(u0, v1, y), P(ua, vm, y + rh), P(ub, vm, y + rh)], out((u0 + u1) / 2, v1));
    pushFace(t, [P(u0, v1, y), P(u0, v0, y), P(ua, vm, y + rh)], out(u0, vm));
    pushFace(t, [P(u1, v0, y), P(u1, v1, y), P(ub, vm, y + rh)], out(u1, vm));
  } else {
    const d = (u1 - u0) / 2, um = (u0 + u1) / 2, va = v0 + d, vb = v1 - d;
    pushFace(t, [P(u0, v1, y), P(u0, v0, y), P(um, va, y + rh), P(um, vb, y + rh)], out(u0, (v0 + v1) / 2));
    pushFace(t, [P(u1, v0, y), P(u1, v1, y), P(um, vb, y + rh), P(um, va, y + rh)], out(u1, (v0 + v1) / 2));
    pushFace(t, [P(u0, v0, y), P(u1, v0, y), P(um, va, y + rh)], out(um, v0));
    pushFace(t, [P(u1, v1, y), P(u0, v1, y), P(um, vb, y + rh)], out(um, v1));
  }
  if (opt.solid !== false) polySolid(F.rect(u0 + (u1 - u0) * 0.25, v0 + (v1 - v0) * 0.25, u1 - (u1 - u0) * 0.25, v1 - (v1 - v0) * 0.25), y, y + rh * 0.6);
}

// ---- 地面 (地図・地面テクスチャに描く)
function polyFr(P, c) {
  DL.push({ bb: polyBB(P), f: g => { g.fillStyle = c; g.beginPath(); P.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill(); } });
}
function oDraw(F, u0, v0, u1, v1, draw) {   // 回転座標系で描く (draw(g) は u,v 座標で描く)
  DL.push({ bb: polyBB(F.rect(u0, v0, u1, v1)), f: g => { g.save(); g.transform(F.ux, F.uz, F.vx, F.vz, F.ox, F.oz); draw(g); g.restore(); } });
}
const oFr = (F, u0, v0, u1, v1, c) => oDraw(F, u0, v0, u1, v1, g => { g.fillStyle = c; g.fillRect(u0, v0, u1 - u0, v1 - v0); });
const oTiles = (F, u0, v0, u1, v1, c1, c2, s) => oDraw(F, u0, v0, u1, v1, g => {
  g.fillStyle = c1; g.fillRect(u0, v0, u1 - u0, v1 - v0); g.fillStyle = c2;
  for (let u = u0; u < u1; u += s) g.fillRect(u, v0, 0.4, v1 - v0);
  for (let v = v0; v < v1; v += s) g.fillRect(u0, v, u1 - u0, 0.4);
});
// 回転した道路 (車は走らない。中央線と横断歩道)
function oRoad(F, u0, v0, u1, v1, alongU, cross = []) {
  oDraw(F, u0, v0, u1, v1, g => {
    g.fillStyle = '#3c3c42'; g.fillRect(u0, v0, u1 - u0, v1 - v0); g.fillStyle = '#e8e6dc';
    if (alongU) { const m = (v0 + v1) / 2; for (let u = u0; u < u1; u += 6) g.fillRect(u, m - 0.15, 3, 0.3); g.fillRect(u0, v0 + 0.5, u1 - u0, 0.2); g.fillRect(u0, v1 - 0.7, u1 - u0, 0.2); }
    else { const m = (u0 + u1) / 2; for (let v = v0; v < v1; v += 6) g.fillRect(m - 0.15, v, 0.3, 3); g.fillRect(u0 + 0.5, v0, 0.2, v1 - v0); g.fillRect(u1 - 0.7, v0, 0.2, v1 - v0); }
    for (const c of cross) {   // 横断歩道: 道路の向きに直交する縞
      if (alongU) for (let v = v0 + 1; v < v1 - 1; v += 1.6) g.fillRect(c, v, 4, 0.8);
      else for (let u = u0 + 1; u < u1 - 1; u += 1.6) g.fillRect(u, c, 0.8, 4);
    }
  });
}
// ---- 車の走る道路 (軸に沿った長方形)。ROADS に加わり、車・信号・街路樹が自動で付く
function addRoads(list) {
  for (const r of list) {
    const [x0, z0, x1, z1, d, name] = r; ROADS.push([x0, z0, x1, z1, d]);
    fr(x0, z0, x1, z1, '#3c3c42');
    if (d === 'ns') { const m = (x0 + x1) / 2; for (let z = z0; z < z1; z += 6) fr(m - 0.15, z, m + 0.15, z + 3, '#e8e6dc'); fr(x0 + 0.5, z0, x0 + 0.7, z1, '#e8e6dc'); fr(x1 - 0.7, z0, x1 - 0.5, z1, '#e8e6dc'); }
    else { const m = (z0 + z1) / 2; for (let x = x0; x < x1; x += 6) fr(x, m - 0.15, x + 3, m + 0.15, '#e8e6dc'); fr(x0, z0 + 0.5, x1, z0 + 0.7, '#e8e6dc'); fr(x0, z1 - 0.7, x1, z1 - 0.5, '#e8e6dc'); }
    if (name) DIST_AREAS.push([name, x0, z0, x1, z1]);
  }
  for (const a of list.filter(r => r[4] === 'ns')) for (const b of list.filter(r => r[4] === 'ew')) {
    const o = clip(a, b); if (!o) continue;
    fr(...o, '#3c3c42');
    for (const [za, zb] of [[o[1] - 5, o[1] - 1], [o[3] + 1, o[3] + 5]]) if (za >= a[1] && zb <= a[3]) for (let x = o[0] + 1; x < o[2] - 1; x += 1.6) fr(x, za, x + 0.8, zb, '#e8e6dc');
    for (const [xa, xb] of [[o[0] - 5, o[0] - 1], [o[2] + 1, o[2] + 5]]) if (xa >= b[0] && xb <= b[2]) for (let z = o[1] + 1; z < o[3] - 1; z += 1.6) fr(xa, z, xb, z + 0.8, '#e8e6dc');
  }
}
// 線路の周り (自動の街づくり関数に渡す「建てない場所」)
function ringRes(R, m = 18) {
  const out = [];
  for (let s = 0; s < RING_LEN; s += 10) { const q = ringAt(s); if (inR(R, q.x, q.z, m + 10)) out.push([q.x - m, q.z - m, q.x + m, q.z + m]); }
  return out;
}
// ---- 置き物 (チャンクに入れて、遠くでは描かない)
function mesh(geo, mat, x, y, z, ry = 0, far = false) {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.y = ry;
  (far ? FAR.group : chunkAt(x, z).group).add(m); return m;
}
// 窓の柄のテクスチャ (32px = 16m)。夜は窓が灯る
const LM_MAT = (key, draw) => { if (!WALL[key]) MATS[key] = wallMats(key, makeTex(draw)); return key; };
// 大型ビジョン: 色の変わる広告映像 (架空の広告)
const VISIONS = [];
function visionTex(seed) {
  const c = document.createElement('canvas'); c.width = 64; c.height = 36; const t = canvasTex(c, false);
  const v = { c, g: c.getContext('2d'), t, seed, k: 0 }; VISIONS.push(v); drawVision(v, 0); return t;
}
const VISION_ADS = [['NEW', '#e8305a', '#ffe0ea'], ['SALE', '#f0c020', '#2a2a2a'], ['TOKYO', '#2a6ad0', '#ffffff'], ['LIVE', '#20b080', '#ffffff'], ['♪', '#8a3ad0', '#ffe8ff'], ['COFFEE', '#6a3a20', '#ffe8c0'], ['SKY', '#40a8e8', '#ffffff'], ['GAME', '#d03020', '#fff0a0']];
function drawVision(v, t) {
  const g = v.g, a = VISION_ADS[(v.seed + Math.floor(t / 6)) % VISION_ADS.length], ph = (t % 6) / 6;
  g.fillStyle = a[1]; g.fillRect(0, 0, 64, 36);
  g.fillStyle = 'rgba(255,255,255,.18)'; for (let i = 0; i < 5; i++) g.fillRect(((i * 17 + ph * 80) % 90) - 20, 0, 6, 36);
  g.fillStyle = a[2]; g.font = `bold ${a[0].length > 4 ? 12 : 16}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(a[0], 32 + Math.sin(ph * 6.28) * 3, 18);
  v.t.needsUpdate = true;
}
let visionTick = 0;
LM_UPDATERS.push((dt, t) => { if ((visionTick -= dt) > 0) return; visionTick = 0.25; VISIONS.forEach((v, i) => drawVision(v, t + i * 1.7)); });
const visionMat = seed => { const t = visionTex(seed), m = new THREE.MeshBasicMaterial({ map: t }); return m; };
// 共通の素材: 石垣 / 白い石 / 膜屋根 / 屋上の芝生
WALL.ISHIGAKI = lam({ map: tex(16, 16, x => { x.fillStyle = '#8e877a'; x.fillRect(0, 0, 16, 16); for (let j = 0; j < 16; j += 4) for (let i = (j / 4) % 2 * 3; i < 16; i += 6) { x.fillStyle = rnd() < 0.5 ? '#a39b8c' : '#7a7468'; x.fillRect(i, j, 5, 3); } }) });
WALL.TKSTONE = lam({ color: 0xe6dcc6 });
WALL.MEMBRANE = lam({ color: 0xf2f2ee, emissive: 0x9a9890, side: THREE.DoubleSide });   // 下から見ても白く明るい膜
WALL.GRASSTOP = lam({ map: tex(16, 16, x => { x.fillStyle = '#5a8a3c'; x.fillRect(0, 0, 16, 16); for (let i = 0; i < 30; i++) { x.fillStyle = rnd() < 0.5 ? '#6a9a48' : '#4a7a30'; x.fillRect(rnd() * 16 | 0, rnd() * 16 | 0, 1, 2); } }) });
WALL.BRONZE = lam({ color: 0x4a4436 });
WALL.SLATE = lam({ map: roofTex('#4a5058', '#3c4248') });
WALL.ASPH = lam({ color: 0x46464c });
// 傾いた板 (橋の路面・欄干など): 中心線 a → b、半幅 hw、高さ ya → yb、厚さ th。なめらかな坂になる
function pushSlope(topKey, sideKey, a, b, hw, ya, yb, th) {
  const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz), nx = -dz / l * hw, nz = dx / l * hw;
  const H = holderFor((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.max(ya, yb)), T = bucket(H, topKey), S = bucket(H, sideKey);
  const p = (c, s, y) => [c[0] + nx * s, y, c[1] + nz * s];
  pushFace(T, [p(a, 1, ya), p(b, 1, yb), p(b, -1, yb), p(a, -1, ya)], [0, 1, 0]);
  pushFace(S, [p(a, 1, ya - th), p(b, 1, yb - th), p(b, -1, yb - th), p(a, -1, ya - th)], [0, -1, 0]);
  pushFace(S, [p(a, 1, ya), p(b, 1, yb), p(b, 1, yb - th), p(a, 1, ya - th)], [nx, 0, nz]);
  pushFace(S, [p(a, -1, ya), p(b, -1, yb), p(b, -1, yb - th), p(a, -1, ya - th)], [-nx, 0, -nz]);
}
