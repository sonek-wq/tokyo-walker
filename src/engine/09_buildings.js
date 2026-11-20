/* ============================================================
   建物: 登録 → チャンク毎・マテリアル毎に1つのメッシュへ結合 (描画負荷を抑える)
   ============================================================ */
function bucket(holder, key) { return holder.buckets[key] || (holder.buckets[key] = { pos: [], nor: [], uv: [] }); }
function pushQuad(t, a, b, c, d, n, u0, v0, u1, v1) {
  t.pos.push(...a, ...b, ...c, ...a, ...c, ...d);
  for (let i = 0; i < 6; i++) t.nor.push(...n);
  t.uv.push(u0, v0, u1, v0, u1, v1, u0, v0, u1, v1, u0, v1);
}
function pushBox(wall, top, x0, y0, z0, x1, y1, z1) {
  const W = x1 - x0, D = z1 - z0, vb = y0 / 16, vt = y1 / 16;
  pushQuad(wall, [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [1, 0, 0], 0, vb, D / 16, vt);
  pushQuad(wall, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0], 0, vb, D / 16, vt);
  pushQuad(wall, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], 0, vb, W / 16, vt);
  pushQuad(wall, [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1], 0, vb, W / 16, vt);
  pushQuad(top, [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], [0, 1, 0], x0 / 16, -z1 / 16, x1 / 16, -z0 / 16);
}
// 全体マップで建物の種類がひと目で分かるよう、足元の色を用途別に変える
function fpColor(k) {
  if (/^(glass|glassDark)/.test(k)) return '#33465c';
  if (/^office/.test(k)) return '#3e4654';
  if (/^(resi|house|brick)/.test(k)) return '#5c4e46';
  if (/^shop/.test(k)) return '#7a3c34';
  if (/^konbini/.test(k)) return '#2e7a56';
  if (/^gz/.test(k)) return '#6a4a7a';
  if (/^ital/.test(k)) return '#a8683e';
  if (/^soko/.test(k)) return '#6a7480';
  if (/^(hotel|theatre)/.test(k)) return '#6a5a3e';
  return '#4a4a52';
}
function addBuilding(x0, z0, x1, z1, h, key, opt = {}) {
  const holder = h >= 150 ? FAR : chunkAt((x0 + x1) / 2, (z0 + z1) / 2);
  pushBox(bucket(holder, key), bucket(holder, 'ROOF'), x0, 0, z0, x1, h, z1);
  if (opt.solid !== false) solid(x0, z0, x1, z1, 0, h);
  if (opt.paint !== false) fr(x0, z0, x1, z1, opt.fp || fpColor(key));
  const w = x1 - x0, d = z1 - z0;
  if (h > 14 && !opt.noRoofBox && rnd() < 0.6) { // 屋上の塔屋
    const bw = w * rr(0.25, 0.5), bd = d * rr(0.25, 0.5), bh = rr(2, 5), bx = (x0 + x1) / 2 + rr(-w, w) * 0.15, bz = (z0 + z1) / 2 + rr(-d, d) * 0.15;
    const c = bucket(holder, 'CONC');
    pushBox(c, c, bx - bw / 2, h, bz - bd / 2, bx + bw / 2, h + bh, bz + bd / 2);
    if (opt.solid !== false) solid(bx - bw / 2, bz - bd / 2, bx + bw / 2, bz + bd / 2, h, h + bh);
  }
}
function buildMerged() {
  for (const holder of [FAR, ...CHUNKS.values()]) {
    for (const [key, t] of Object.entries(holder.buckets)) {
      if (!t.pos.length) continue;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(t.pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(t.nor, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(t.uv, 2));
      holder.group.add(new THREE.Mesh(g, WALL[key]));
    }
    holder.buckets = {};
  }
}
// 街区を区画割りしてビルを並べる
function fillBlocks(blocks, reserved, opt = {}) {
  for (const [bx0, bz0, bx1, bz1] of blocks) {
    for (let x = bx0; x < bx1 - 8;) {
      let w = rr(opt.minW || 20, opt.maxW || 38); if (bx1 - (x + w) < 12) w = bx1 - x;
      for (let z = bz0; z < bz1 - 8;) {
        let d = rr(opt.minW || 18, opt.maxW || 34); if (bz1 - (z + d) < 12) d = bz1 - z;
        const g = opt.gap || 1.5, f = [x + g, z + g, x + w - g, z + d - g];
        if (!reserved.some(r => overlap(r, f)) && rnd() > 0.08) {
          const q = rnd(); const h = opt.low ? (q < 0.6 ? rr(8, 24) : q < 0.92 ? rr(24, 60) : rr(60, 140)) : q < 0.7 ? rr(12, 40) : q < 0.95 ? rr(40, 80) : rr(80, 130);
          addBuilding(...f, h, pick(GEN), opt);
        }
        z += d;
      }
      x += w;
    }
  }
}
for (const [x0, z0, x1, z1, h, k] of LANDMARKS) addBuilding(x0, z0, x1, z1, h, k);
const RESERVED = [...LANDMARKS.map(r => [r[0] - 3, r[1] - 3, r[2] + 3, r[3] + 3]),
  [-150, -48, -36, 128], [-404, 148, -262, 320], [-880, -92, -840, -28]];
// 竹芝周辺の街区は、個性のある街区関数でつくり直した (下の「竹芝周辺の街区」)
// マップの外側: 街が続いているように見せる (歩けない・当たり判定なし)

