/* ============================================================
   山手線の環 (デフォルメ縮尺: 場所と場所の間はおよそ実際の 1/2)
   ============================================================ */
// 実座標 → ゲーム座標。浜松町駅を基準に縦横 1/2 に縮める。
// 浜松町〜新橋の緯度帯だけは、既存エリアの作り込みを残すため南北を少し伸ばしている
const W_SCALE = 0.5, M_LON = 90400, M_LAT = 110950, HAMA_LL = [35.6553, 139.7571], SHIM_LAT = 35.6663;
function warp(lat, lon) {
  const k = Math.max(0, Math.min(1, (lat - HAMA_LL[0]) / (SHIM_LAT - HAMA_LL[0])));
  return [-450 + W_SCALE * (lon - HAMA_LL[1]) * M_LON, 80 - W_SCALE * (lat - HAMA_LL[0]) * M_LAT - 382 * k];
}
// 山手線 全30駅: 駅ごとのファイル (stations/) が STATION({...}) で登録する。JY番号順 = 内回り
const STN = STATION_DEFS.sort((a, b) => a.no - b.no).map(d => {
  const [x, z] = d.fixed || warp(d.lat, d.lon);
  return { ...d, code: 'JY' + String(d.no).padStart(2, '0'), x, z };
});
// 線路の形: 駅を通る閉じた曲線 (浜松町〜新橋は既存の直線区間に合わせる補助点を入れる)
{
  const C = [];
  for (const st of STN) {
    C.push(...(st.before || []), [st.x, st.z], ...(st.after || []));   // 補助点で線路の形を整える
  }
  const N = C.length, P0 = [];
  for (let i = 0; i < N; i++) {
    const p0 = C[(i - 1 + N) % N], p1 = C[i], p2 = C[(i + 1) % N], p3 = C[(i + 2) % N];
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 3));
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      P0.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  var RP = P0;
}
const RL = [0];
for (let i = 1; i <= RP.length; i++) { const a = RP[i - 1], b = RP[i % RP.length]; RL.push(RL[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
const RING_LEN = RL[RP.length];
const RC = STN.reduce((a, st) => [a[0] + st.x / STN.length, a[1] + st.z / STN.length], [0, 0]);   // 環の中心
// 外向きの法線の向き (環全体で一定にする)
const RING_SIDE = (() => { let far = 0, fd = 0; RP.forEach((p, i) => { const d = Math.hypot(p[0] - RC[0], p[1] - RC[1]); if (d > fd) { fd = d; far = i; } });
  const a = RP[far], b = RP[(far + 1) % RP.length], tx = b[0] - a[0], tz = b[1] - a[1]; return (tz * (a[0] - RC[0]) - tx * (a[1] - RC[1])) > 0 ? 1 : -1; })();
const wrapS = s => ((s % RING_LEN) + RING_LEN) % RING_LEN;
const sDiff = (a, b) => { let d = wrapS(a - b); return d > RING_LEN / 2 ? d - RING_LEN : d; };   // a - b (-L/2〜L/2)
function ringAt(s) {
  s = wrapS(s); let lo = 0, hi = RP.length;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (RL[m] <= s) lo = m; else hi = m; }
  const a = RP[lo], b = RP[(lo + 1) % RP.length], len = RL[lo + 1] - RL[lo], t = (s - RL[lo]) / len;
  const tx = (b[0] - a[0]) / len, tz = (b[1] - a[1]) / len;
  return { x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, tx, tz, ang: Math.atan2(tx, tz), nx: tz * RING_SIDE, nz: -tx * RING_SIDE };
}
// 線路の近くを素早く調べるための格子
const RHG = 50, RHASH = new Map();
RP.forEach((p, i) => { const k = Math.floor(p[0] / RHG) * 100003 + Math.floor(p[1] / RHG); let a = RHASH.get(k); if (!a) RHASH.set(k, a = []); a.push(i); });
function ringNearest(x, z) {
  let bi = -1, bd = Infinity; const ci = Math.floor(x / RHG), cj = Math.floor(z / RHG);
  for (let i = ci - 1; i <= ci + 1; i++) for (let j = cj - 1; j <= cj + 1; j++) for (const k of RHASH.get(i * 100003 + j) || []) {
    const d = Math.hypot(RP[k][0] - x, RP[k][1] - z); if (d < bd) { bd = d; bi = k; } }
  return bi < 0 ? null : { i: bi, d: bd, s: RL[bi] };
}
function ringNearRect(f, m) {
  for (let i = Math.floor((f[0] - m) / RHG); i <= Math.floor((f[2] + m) / RHG); i++) for (let j = Math.floor((f[1] - m) / RHG); j <= Math.floor((f[3] + m) / RHG); j++)
    for (const k of RHASH.get(i * 100003 + j) || []) {
      const [px, pz] = RP[k], dx = Math.max(f[0] - px, 0, px - f[2]), dz = Math.max(f[1] - pz, 0, pz - f[3]);
      if (dx * dx + dz * dz < m * m) return true;
    }
  return false;
}
for (const st of STN) { const n = ringNearest(st.x, st.z); st.s = n.s; }
const stationAtS = s => STN.find(st => Math.abs(sDiff(s, st.s)) < 100);
// マップの範囲 = 既存エリア + 山手線の環の外側 約350m
// 西側は西新宿の高層ビル群・新宿中央公園が入るよう広めにとる
const MINX = Math.min(-1680, Math.floor((Math.min(...RP.map(p => p[0])) - 750) / 100) * 100), MAXX = Math.max(430, GEO_MAXX, Math.ceil((Math.max(...RP.map(p => p[0])) + 350) / 100) * 100);
const MINZ = Math.min(-1300, Math.floor((Math.min(...RP.map(p => p[1])) - 350) / 100) * 100), MAXZ = Math.max(320, Math.ceil((Math.max(...RP.map(p => p[1])) + 350) / 100) * 100);
const WW = MAXX - MINX, WH = MAXZ - MINZ;
// 自動生成の街の陸地 (既存エリアの外側)。東は隅田川・東京湾
const GEO_RECTS = GEO_LAND.map(([n, x0, z0, x1, z1]) => clip([x0, z0, x1, z1], [MINX, MINZ, MAXX, MAXZ])).filter(Boolean);
const GEO_WALLED = GEO_LAND.filter(g => !(g[5] && g[5].beach)).map(([n, x0, z0, x1, z1]) => clip([x0, z0, x1, z1], [MINX, MINZ, MAXX, MAXZ])).filter(Boolean);   // 護岸のある陸地 (砂浜は除く)
// 地面の高さ (砂浜の坂。川は11_groundで掘り下げる)
function groundY(x, z) {
  for (const [x0, z0, x1, z1, ys, yl, dir] of GEO_SLOPES) if (x >= x0 && x <= x1 && z >= z0 && z <= z1) return dir === 'flat' ? ys : ys + (yl - ys) * (z - z0) / (z1 - z0);
  return 0;
}   // 東側の陸地 (regions/00_geography.js)
const PROC_LAND = [[MINX, MINZ, -1680, 290], [-1680, MINZ, -300, -1080], [-300, MINZ, 430, -1300], [MINX, 320, -320, 700], [MINX, 700, -600, MAXZ], ...GEO_RECTS];
/* ---- 川 (折れ線に幅をつけた多角形)。地面はこの中だけ低く掘り下げ、水面がのぞく */
const RIVERS = GEO_RIVERS.map(r => ({ ...r, polys: [] })), RIVER_HASH = new Map(), RHC = 100;
for (const r of RIVERS) {
  const add = P => { const bb = polyBB(P); r.polys.push(P);
    for (let i = Math.floor((bb[0] - r.plain - 20) / RHC); i <= Math.floor((bb[2] + r.plain + 20) / RHC); i++) for (let j = Math.floor((bb[1] - r.plain - 20) / RHC); j <= Math.floor((bb[3] + r.plain + 20) / RHC); j++) {
      const k = i * 100003 + j; let a = RIVER_HASH.get(k); if (!a) RIVER_HASH.set(k, a = []); a.push([P, r]); } };
  r.pts.forEach((p, i) => {
    add(regularPoly(p[0], p[1], r.w / Math.cos(Math.PI / 8), 8, Math.PI / 8));   // 折れ目をふさぐ八角形
    const q = r.pts[i + 1]; if (!q) return;
    const dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz), nx = -dz / l * r.w, nz = dx / l * r.w;
    add([[p[0] + nx, p[1] + nz], [q[0] + nx, q[1] + nz], [q[0] - nx, q[1] - nz], [p[0] - nx, p[1] - nz]]);
  });
}
// (x, z) からいちばん近い川の中心線までの距離 → 川の情報 (中: 水面 / 岸から plain 以内: 河川敷)
function riverInfo(x, z, extra = 0) {
  const c = RIVER_HASH.get(Math.floor(x / RHC) * 100003 + Math.floor(z / RHC)); if (!c) return null;
  let best = null;
  for (const [, r] of c) {
    if (best && best.r === r) continue;
    for (let i = 0; i < r.pts.length - 1; i++) {
      const [ax, az] = r.pts[i], [bx, bz] = r.pts[i + 1], dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
      const d = Math.hypot(x - ax - dx * t, z - az - dz * t);
      if (d < r.w + r.plain + extra && (!best || d - r.w < best.d - best.r.w)) best = { r, d, i, t };
    }
  }
  return best;
}
const inRiver = (x, z) => { const c = RIVER_HASH.get(Math.floor(x / RHC) * 100003 + Math.floor(z / RHC)); return !!c && c.some(([P]) => inPoly(P, x, z)); };
const riverHitsRect = (f, m = 0) => {
  const e = [f[0] - m, f[1] - m, f[2] + m, f[3] + m];
  for (let i = Math.floor(e[0] / RHC); i <= Math.floor(e[2] / RHC); i++) for (let j = Math.floor(e[1] / RHC); j <= Math.floor(e[3] / RHC); j++)
    for (const [P, r] of RIVER_HASH.get(i * 100003 + j) || []) if (polyHitsRect(P, [e[0] - r.plain, e[1] - r.plain, e[2] + r.plain, e[3] + r.plain])) return true;
  return false;
};
const BRIDGE_POLYS = [];   // 川・海の上の橋 (この上は歩ける)。[多角形, 名前]
// 海かどうか (地図の外の「見えるだけの街」にも使う)
const GEO_ALL = GEO_LAND.map(([n, x0, z0, x1, z1]) => [x0, z0, x1, z1]);
const isWaterXZ = (x, z) => inRiver(x, z) || (!GEO_ALL.some(r => inR(r, x, z)) && ((x > 430 && z > -600) || (x > -320 && z >= 320 && z < 700) || (x > -600 && z >= 700)));
// 古川を渡る橋 (自動生成の街の大通り)
const RIVER_BR = [];
for (let x = Math.ceil(MINX / 400) * 400; x < -1680; x += 400) RIVER_BR.push([x - 10, 290, x + 10, 320]);
// 駅ファイルが指定した水面 (お濠など) を陸地から切り抜き、橋や歩ける場所を足す
for (const st of STN) if (typeof st.land === 'function') st.land = st.land(st);   // 線路の位置から決まる橋など
const LM_WATER = STN.flatMap(st => (st.land && st.land.water) || []);
function carveRect(list, h) {
  const out = [];
  for (const r of list) {
    if (!overlap(r, h)) { out.push(r); continue; }
    if (h[1] > r[1]) out.push([r[0], r[1], r[2], h[1]]);
    if (h[3] < r[3]) out.push([r[0], h[3], r[2], r[3]]);
    const z0 = Math.max(r[1], h[1]), z1 = Math.min(r[3], h[3]);
    if (h[0] > r[0]) out.push([r[0], z0, h[0], z1]);
    if (h[2] < r[2]) out.push([h[2], z0, r[2], z1]);
  }
  return out;
}
{ const c = LM_WATER.reduce(carveRect, PROC_LAND); PROC_LAND.length = 0; PROC_LAND.push(...c); }
const LM_BRIDGES = STN.flatMap(st => (st.land && st.land.bridges) || []), LM_WALK = STN.flatMap(st => (st.land && st.land.walk) || []);
WALK.push(...PROC_LAND, ...RIVER_BR, ...LM_BRIDGES, ...LM_WALK, ...GEO_BRIDGES.flat); BRIDGES.push(...RIVER_BR, ...LM_BRIDGES, ...GEO_BRIDGES.flat);

const LANDMARKS = [ // x0,z0,x1,z1,h,material
  [-145, -35, -55, 55, 18, 'glass'], [-130, -20, -72, 38, 200, 'glass'], [-205, 65, -172, 100, 76, 'resi'],
  [-398, 0, -338, 62, 235, 'glassDark'],
  [30, -150, 70, -110, 110, 'office'], [76, -150, 116, -82, 24, 'theatre'], [60, -45, 116, -10, 10, 'terminal'],
  [48, 60, 116, 124, 85, 'hotel'], [46, 160, 112, 214, 100, 'glassDark'], [46, 232, 112, 300, 85, 'office'],
  [-415, -460, -365, -415, 210, 'glassDark'], [-355, -440, -310, -395, 170, 'glass'], [-415, -370, -365, -320, 190, 'office2'], [-355, -300, -310, -250, 140, 'glassDark'],
  [-1330, 165, -1180, 225, 40, 'hotel'],               // 東京プリンスホテル
  [-1640, 20, -1580, 90, 140, 'glassDark'],            // ザ・プリンス パークタワー東京
  [TOWER[0] - 30, TOWER[1] - 30, TOWER[0] + 30, TOWER[1] + 30, 18, 'glass'], // 東京タワー フットタウン
];
const AREAS = [
  ['竹芝桟橋', 140, -60, 260, 70], ['竹芝客船ターミナル', 40, -50, 116, -8], ['ゆりかもめ 竹芝駅', -8, -40, 30, 40],
  ['竹芝ふ頭公園', 30, -8, 140, 56], ['浜離宮恩賜庭園', -300, -480, 220, -205], ['旧芝離宮恩賜庭園', -404, 148, -262, 320],
  ['東京ポートシティ竹芝', -210, -50, -36, 130], ['WATERS takeshiba', 20, -170, 120, -70], ['インターコンチネンタル東京ベイ', 40, 56, 120, 130],
  ['ニューピア竹芝', 40, 150, 120, 320], ['竹芝ウォーターフロント', 116, -170, 140, 320], ['海岸通り', -36, -170, -4, 320],
  ['浜松町駅', -476, 20, -424, 140], ['JR線路', -473, -480, -427, 320], ['汐留', -480, -480, -300, -170], ['海岸一丁目', -476, -170, -262, 148],
];
// 拡張エリアの地名 (名所 → 街区 → 通り → 広域 の順に判定。build時に追加)
const SPOT_AREAS = [], DIST_AREAS = [];

