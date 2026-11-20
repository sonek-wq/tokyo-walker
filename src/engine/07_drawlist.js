/* ============================================================
   地図の描画リスト (ワールド座標のベクター命令: どの縮尺でも再描画できる)
   ============================================================ */
const DL = [];
const fr = (x0, z0, x1, z1, c) => DL.push({ bb: [x0, z0, x1, z1], f: g => { g.fillStyle = c; g.fillRect(x0, z0, x1 - x0, z1 - z0); } });
const fe = (x, z, rx, rz, c) => DL.push({ bb: [x - rx, z - rz, x + rx, z + rz], f: g => { g.fillStyle = c; g.beginPath(); g.ellipse(x, z, rx, rz, 0, 0, 7); g.fill(); } });
const se = (x, z, rx, rz, w, c) => DL.push({ bb: [x - rx - w, z - rz - w, x + rx + w, z + rz + w], f: g => { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.ellipse(x, z, rx, rz, 0, 0, 7); g.stroke(); } });
const ln = (x0, z0, x1, z1, w, c) => DL.push({ bb: [Math.min(x0, x1) - w, Math.min(z0, z1) - w, Math.max(x0, x1) + w, Math.max(z0, z1) + w], f: g => { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(x0, z0); g.lineTo(x1, z1); g.stroke(); } });
function tiles(x0, z0, x1, z1, c1, c2, s) {
  fr(x0, z0, x1, z1, c1);
  for (let x = x0; x < x1; x += s) fr(x, z0, x + 0.4, z1, c2);
  for (let z = z0; z < z1; z += s) fr(x0, z, x1, z + 0.4, c2);
}
function planks(x0, z0, x1, z1, c1, c2, alongX) {
  fr(x0, z0, x1, z1, c1);
  if (alongX) for (let x = x0; x < x1; x += 1.2) fr(x, z0, x + 0.2, z1, c2);
  else for (let z = z0; z < z1; z += 1.2) fr(x0, z, x1, z + 0.2, c2);
}
const GRASS = '#4f7a34', PATH = '#bba97e';

for (const r of WALK) fr(...r, '#8f8b82');
// --- 竹芝周辺
planks(116, -170, 140, 320, '#7d6245', '#674f36', false);
planks(140, -30, 240, 50, '#8a6c4c', '#715739', true);
planks(30, -205, 42, -170, '#7d6245', '#674f36', false);
tiles(-8, -8, 116, 56, '#b3a68c', '#9d9078', 3);
tiles(-150, -48, -36, 128, '#aaa49a', '#948d84', 2.5);
tiles(-480, -480, -300, -170, '#9b968c', '#878279', 4);
fr(-280, -480, 220, -205, '#6f6a5e'); fr(-274, -474, 214, -211, GRASS);
se(30, -330, 100, 75, 5, PATH); ln(36, -211, 36, -255, 5, PATH); ln(-282, -337, -70, -332, 5, PATH);
fe(30, -330, 80, 55, '#3f7290'); fe(40, -335, 13, 11, GRASS);
planks(37, -326, 43, -274, '#7d6245', '#674f36', false);
fr(-404, 148, -262, 320, '#6f6a5e'); fr(-400, 152, -266, 316, GRASS);
se(-333, 234, 55, 45, 4, PATH); ln(-278, 234, -262, 234, 4, PATH);
fe(-333, 234, 42, 32, '#3f7290'); fe(-333, 234, 8, 6, GRASS);
// --- 拡張: 芝公園・増上寺・東京タワー
fr(-1436, -476, -1134, -172, GRASS);                                     // 芝公園(北)
se(-1290, -300, 110, 90, 5, PATH); ln(-1290, -476, -1290, -390, 5, PATH); ln(-1290, -210, -1290, -172, 5, PATH); ln(-1436, -300, -1400, -300, 5, PATH); ln(-1180, -300, -1134, -300, 5, PATH);
fe(-1270, -285, 27, 27, '#5f8a3e');                                        // 芝丸山古墳
fr(-1436, -148, -1134, 128, GRASS);                                      // 増上寺の境内
fr(-1424, -136, -1134, 18, '#cdbf9e');
fr(-1300, -66, -1134, -54, '#a8a090');                                   // 参道の石畳
tiles(-1676, -404, -1456, -180, '#b0a898', '#9a9284', 4);                // 東京タワー前の広場
fr(-1676, -180, -1456, 0, GRASS); se(-1566, -90, 70, 55, 4, PATH);       // 芝公園4号地
fe(-1566, -90, 26, 17, '#3f7290');                                          // もみじ谷の池
planks(-1680, 272, -476, 290, '#8a8478', '#7a7468', true);                  // 古川の河畔の遊歩道
tiles(-1676, 0, -1456, 110, '#a8a29a', '#948d84', 3);
fr(-1436, 152, -1134, 256, GRASS); ln(-1255, 152, -1255, 165, 5, PATH);  // プリンスホテルの庭
// --- 道路
for (const r of ROADS) fr(r[0], r[1], r[2], r[3], '#3c3c42');
for (const [x0, z0, x1, z1, d] of ROADS) {
  if (d === 'ns') {
    const m = (x0 + x1) / 2;
    for (let z = z0; z < z1; z += 6) fr(m - 0.15, z, m + 0.15, z + 3, '#e8e6dc');
    fr(x0 + 0.5, z0, x0 + 0.7, z1, '#e8e6dc'); fr(x1 - 0.7, z0, x1 - 0.5, z1, '#e8e6dc');
  } else {
    const m = (z0 + z1) / 2;
    for (let x = x0; x < x1; x += 6) fr(x, m - 0.15, x + 3, m + 0.15, '#e8e6dc');
    fr(x0, z0 + 0.5, x1, z0 + 0.7, '#e8e6dc'); fr(x0, z1 - 0.7, x1, z1 - 0.5, '#e8e6dc');
  }
}
for (const a of ROADS.filter(r => r[4] === 'ns')) for (const b of ROADS.filter(r => r[4] === 'ew')) {
  const o = clip(a, b); if (!o) continue;
  fr(...o, '#3c3c42');
  for (const [za, zb] of [[o[1] - 5, o[1] - 1], [o[3] + 1, o[3] + 5]]) if (za >= a[1] && zb <= a[3])
    for (let x = o[0] + 1; x < o[2] - 1; x += 1.6) fr(x, za, x + 0.8, zb, '#e8e6dc');
  for (const [xa, xb] of [[o[0] - 5, o[0] - 1], [o[2] + 1, o[2] + 5]]) if (xa >= b[0] && xb <= b[2])
    for (let z = o[1] + 1; z < o[3] - 1; z += 1.6) fr(xa, z, xb, z + 0.8, '#e8e6dc');
}
// JR の高架下 (道路はガード下をくぐる)
const JR_CROSS = ROADS.filter(r => r[4] === 'ew' && r[0] <= JR[0] && r[2] >= JR[2] && r[1] > JR[1] && r[3] < JR[3]).map(r => [r[1] - 1, r[3] + 1]).sort((a, b) => a[0] - b[0]);
{
  let z = JR[1];
  for (const [a, b] of [...JR_CROSS, GADO, [JR[3], JR[3]]].sort((p, q) => p[0] - q[0])) { if (a > z) fr(JR[0], z, JR[2], a, '#3a3632'); z = b; }
  fr(JR[0], GADO[0], JR[2], GADO[1], '#4e4038'); fr(JR[0] + 6, GADO[0], JR[2] - 6, GADO[1], '#5a4a40');
}

