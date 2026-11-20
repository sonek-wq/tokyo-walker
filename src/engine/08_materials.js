/* ============================================================
   マテリアル
   ============================================================ */
const roofMat = lam({ map: tex(8, 8, x => { for (let i = 0; i < 64; i++) { const v = 95 + rnd() * 30 | 0; x.fillStyle = `rgb(${v},${v},${v + 4})`; x.fillRect(i % 8, i >> 3, 1, 1); } }) });
const WALL = {};
const wallMats = (key, t) => { const m = lam({ map: t.map, emissive: 0xffffff, emissiveMap: t.emi, emissiveIntensity: 0 }); GLOW.push([m, 1]); WALL[key] = m; return [m, m, roofMat, roofMat, m, m]; };
const MATS = {
  glass: wallMats('glass', windowTex('#6d8aa3', '#a9c6dc', '#d6e6f0', 'curtain')),
  glassDark: wallMats('glassDark', windowTex('#2f4054', '#5a7a98', '#8fb0c8', 'curtain')),
  office: wallMats('office', windowTex('#bdb6a8', '#3d4c5c', '#5d6f80', 'ribbon')),
  office2: wallMats('office2', windowTex('#9aa0a6', '#2c3a48', '#4a5a6a', 'ribbon')),
  resi: wallMats('resi', windowTex('#ddd5c4', '#4f5f70', '#6f8090', 'balcony')),
  resi2: wallMats('resi2', windowTex('#c8b8a0', '#46525e', '#66727e', 'balcony')),
  brick: wallMats('brick', windowTex('#8e6a55', '#2f3a44', '#4c5864', 'punched')),
  hotel: wallMats('hotel', windowTex('#cdbb9c', '#3f4d5a', '#5a6a78', 'punched')),
  theatre: wallMats('theatre', windowTex('#e9e3d6', '#c9c2b4', '#7a8ea0', 'theatre')),
  terminal: wallMats('terminal', windowTex('#8fb0c0', '#bcd6e2', '#e0eef4', 'curtain')),
  station: wallMats('station', windowTex('#a8a8a8', '#5a6670', '#7a8690', 'ribbon')),
  cabin: wallMats('cabin', windowTex('#f2f2ee', '#26323e', '#3a4a5a', 'ribbon')),
};
const GEN = ['office', 'office2', 'resi', 'resi2', 'brick', 'glass', 'office', 'resi'];
const concrete = lam({ color: 0x9a968e }), white = lam({ color: 0xf0f0ea }), dark = lam({ color: 0x3a3a40 });
WALL.ROOF = roofMat; WALL.CONC = concrete;
// --- 街並み用の追加テクスチャ: 1階が店舗のビル / 戸建て / コンビニ / 瓦屋根
function makeTex(draw) {
  const mc = document.createElement('canvas'), ec = document.createElement('canvas'); mc.width = mc.height = ec.width = ec.height = 32;
  const x = mc.getContext('2d'), y = ec.getContext('2d'); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
  draw(x, y); return { map: canvasTex(mc), emi: canvasTex(ec) };
}
const shopTex = (bg, awn) => makeTex((x, y) => {
  x.fillStyle = bg; x.fillRect(0, 0, 32, 32);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 8; i++) { // 2階以上の窓
    x.fillStyle = rnd() < 0.3 ? '#5a6a78' : '#3a4654'; x.fillRect(i * 4 + 1, j * 8 + 2, 2, 4);
    y.fillStyle = rnd() < 0.5 ? pick(LIT) : '#000'; y.fillRect(i * 4 + 1, j * 8 + 2, 2, 4);
  }
  x.fillStyle = awn; x.fillRect(0, 23, 32, 2);                   // 看板帯
  x.fillStyle = '#26303a'; x.fillRect(1, 25, 30, 7);               // 1階の店先(ガラス)
  y.fillStyle = '#ffe2a8'; y.fillRect(1, 25, 30, 7);
  x.fillStyle = bg; y.fillStyle = '#000'; for (let i = 0; i < 32; i += 8) { x.fillRect(i, 25, 1, 7); y.fillRect(i, 25, 1, 7); }
});
const houseTex = (bg, win) => makeTex((x, y) => {
  x.fillStyle = bg; x.fillRect(0, 0, 32, 32);
  x.fillStyle = 'rgba(0,0,0,.08)'; for (let k = 0; k < 32; k += 2) x.fillRect(0, k, 32, 1); // サイディング
  for (let f = 0; f < 5; f++) { const by = 32 - f * 6; // 3mごとの階
    for (let i = 0; i < 4; i++) { if (rnd() < 0.35) continue; x.fillStyle = win; x.fillRect(i * 8 + 2, by - 4, 3, 2); y.fillStyle = rnd() < 0.5 ? pick(LIT) : '#000'; y.fillRect(i * 8 + 2, by - 4, 3, 2); }
  }
  x.fillStyle = '#5a4434'; x.fillRect(13, 28, 3, 4);              // 玄関
});
const konbiniTex = (c1, c2) => makeTex((x, y) => {
  x.fillStyle = '#f2f2ee'; x.fillRect(0, 0, 32, 32);
  x.fillStyle = c1; x.fillRect(0, 21, 32, 2); x.fillStyle = c2; x.fillRect(0, 23, 32, 1);
  x.fillStyle = '#9ab8c8'; x.fillRect(0, 25, 32, 7); y.fillStyle = '#fffaf0'; y.fillRect(0, 25, 32, 7);
  y.fillStyle = c1; y.fillRect(0, 21, 32, 2);
  x.fillStyle = '#ddd'; for (let i = 0; i < 32; i += 6) x.fillRect(i, 25, 1, 7);
});
const roofTex = (c1, c2) => tex(16, 16, x => { x.fillStyle = c1; x.fillRect(0, 0, 16, 16); x.fillStyle = c2; for (let k = 0; k < 16; k += 3) x.fillRect(0, k, 16, 1); });
const SHOPS = [], AWN_COLS = [0xc0392b, 0x2a6ab0, 0x2f8a4a, 0xe0a020, 0x8a3a8a, 0xd06020];
[['#d8cfc0', '#c0392b'], ['#c8c0b4', '#2a6ab0'], ['#e4dccc', '#2f8a4a'], ['#b8a890', '#e0a020'], ['#d0d0cc', '#8a3a8a']].forEach(([bg, a], i) => {
  MATS['shop' + i] = wallMats('shop' + i, shopTex(bg, a)); SHOPS.push('shop' + i);
});
const HOUSES = ['house0', 'house1', 'house2', 'house3'];
[['#e8e0cc', '#44525e'], ['#dcdcd8', '#3e4a56'], ['#c8b49a', '#3a4450'], ['#b8c4c8', '#3a4652']].forEach(([bg, w], i) => MATS['house' + i] = wallMats('house' + i, houseTex(bg, w)));
const KONBINI = ['konbini0', 'konbini1', 'konbini2'];
[['#2a9a5a', '#2a6ab0'], ['#2a6ab0', '#7ab0e0'], ['#e06020', '#2a9a5a']].forEach(([a, b], i) => MATS['konbini' + i] = wallMats('konbini' + i, konbiniTex(a, b)));
const ROOFS = ['RF0', 'RF1', 'RF2'];
[['#4a5868', '#3a4656'], ['#6a4a3a', '#5a3c2e'], ['#3e3e44', '#2e2e34']].forEach(([a, b], i) => WALL['RF' + i] = lam({ map: roofTex(a, b) }));
WALL.RF_COPPER = lam({ map: roofTex('#4a7a68', '#3c6858') });
WALL.WOOD = lam({ color: 0x8a4a2e });
// 銀座: 石とガラスの旗艦店。夜は外壁ごと光る
const gzTex = (bg, glass, band) => makeTex((x, y) => {
  x.fillStyle = bg; x.fillRect(0, 0, 32, 32);
  for (let j = 0; j < 3; j++) { x.fillStyle = glass; x.fillRect(1, j * 8 + 2, 30, 4); y.fillStyle = band; y.fillRect(1, j * 8 + 2, 30, 4); }
  x.fillStyle = '#1c2026'; x.fillRect(1, 25, 30, 7); y.fillStyle = '#fff6e0'; y.fillRect(2, 26, 28, 5);
  x.fillStyle = bg; for (let i = 0; i < 32; i += 5) x.fillRect(i, 0, 1, 24);
});
const GINZA = [];
[['#d8d0c0', '#4a5868', '#ffe8b8'], ['#22262c', '#5a6a80', '#c8e0ff'], ['#e8e4dc', '#a8b8c4', '#fff4d8'], ['#3a3026', '#8a6a40', '#ffd890']].forEach(([a, b, c], i) => { MATS['gz' + i] = wallMats('gz' + i, gzTex(a, b, c)); GINZA.push('gz' + i); });
// イタリア街: パステル調の壁、アーチ窓と緑の鎧戸
const italTex = bg => makeTex((x, y) => {
  x.fillStyle = bg; x.fillRect(0, 0, 32, 32);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) {
    const px = i * 8 + 2, py = j * 8 + 1;
    x.fillStyle = '#3a6a4a'; x.fillRect(px - 1, py + 1, 1, 5); x.fillRect(px + 4, py + 1, 1, 5);
    x.fillStyle = '#2a3036'; x.fillRect(px, py + 1, 4, 5); x.fillRect(px + 1, py, 2, 1);
    y.fillStyle = rnd() < 0.5 ? '#ffd890' : '#000'; y.fillRect(px, py + 1, 4, 5);
  }
  x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(0, 24, 32, 1);
  for (let i = 0; i < 4; i++) { x.fillStyle = '#2a2420'; x.fillRect(i * 8 + 1, 26, 6, 6); x.fillRect(i * 8 + 2, 25, 4, 1); y.fillStyle = '#ffe0a0'; y.fillRect(i * 8 + 1, 26, 6, 6); }
});
const ITAL = [];
['#e8c070', '#d88a5a', '#e8b0a0', '#f0e0c0', '#c8a070'].forEach((c, i) => { MATS['ital' + i] = wallMats('ital' + i, italTex(c)); ITAL.push('ital' + i); });
WALL.RF_TERRA = lam({ map: roofTex('#b8603e', '#a05030') });
// ニュー新橋ビル: 白い格子状のファサード
MATS.nsb = wallMats('nsb', makeTex((x, y) => {
  x.fillStyle = '#3a4048'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
  for (let j = 0; j < 24; j += 6) for (let i = 0; i < 32; i += 4) { y.fillStyle = rnd() < 0.5 ? pick(LIT) : '#000'; y.fillRect(i + 1, j + 1, 2, 4); }
  x.strokeStyle = '#eef0f0'; x.lineWidth = 1;
  for (let i = -32; i < 32; i += 4) { x.beginPath(); x.moveTo(i, 24); x.lineTo(i + 24, 0); x.moveTo(i + 24, 24); x.lineTo(i, 0); x.stroke(); }
  x.fillStyle = '#6a3a30'; x.fillRect(0, 24, 32, 8); y.fillStyle = '#ffd890'; y.fillRect(1, 25, 30, 6);
}));
// 倉庫: 波板の外壁と大きなシャッター
['#8a9aa8', '#a8a49a', '#9aa890'].forEach((bg, i) => {
  MATS['soko' + i] = wallMats('soko' + i, makeTex((x, y) => {
    x.fillStyle = bg; x.fillRect(0, 0, 32, 32); x.fillStyle = 'rgba(0,0,0,.12)'; for (let k = 0; k < 32; k += 2) x.fillRect(k, 0, 1, 32);
    x.fillStyle = '#5a5e64'; x.fillRect(4, 18, 10, 14); x.fillRect(18, 18, 10, 14); x.fillStyle = 'rgba(255,255,255,.15)'; for (let k = 19; k < 32; k += 2) { x.fillRect(4, k, 10, 1); x.fillRect(18, k, 10, 1); }
    x.fillStyle = '#2a3a5a'; x.fillRect(2, 4, 6, 6); y.fillStyle = '#ffe0a0'; y.fillRect(22, 6, 6, 2);
  }));
});
// 明治の赤レンガ (新橋の高架・旧新橋停車場)
const brickTex = tex(16, 16, x => { x.fillStyle = '#9a4a34'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#7a3a2a'; for (let j = 0; j < 16; j += 2) { x.fillRect(0, j, 16, 1); for (let i = (j / 2) % 2 * 2; i < 16; i += 4) x.fillRect(i, j, 1, 2); } });
const stoneTex = tex(16, 16, x => { x.fillStyle = '#d8d0bc'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#b8b09c'; for (let j = 0; j < 16; j += 4) x.fillRect(0, j, 16, 1); x.fillStyle = '#4a5058'; for (let i = 2; i < 16; i += 5) x.fillRect(i, 6, 2, 6); });

function box(w, h, d, mat, x, y, z, parent = scene) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); parent.add(m); return m;
}
// ブロック (見た目 + 当たり判定)
function blk(x0, y0, z0, x1, y1, z1, mat, sol = true) {
  box(x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  if (sol) solid(x0, z0, x1, z1, y0, y1);
}

