/* 大学・学術エリア用の小さな道具 (東大・早稲田・慶應・御茶ノ水などで使う)
   - acGothic(): 尖ったアーチ窓が並ぶ壁 (東大の「内田ゴシック」や大隈講堂など)
   - acStatue(): 台座つきの銅像 (人の形をした簡単なブロック)
   - acRoad():   道路 + 歩道 + 街路樹 + 歩く人 (自動生成の街をよける) */
function acGothic(key, bg, win, trim, opt = {}) {
  const rowH = opt.rowH || 8, step = opt.step || 4, ww = opt.ww || 2, wh = opt.wh || 5, lit = opt.lit ?? 0.45;
  return LM_MAT(key, (x, y) => {
    x.fillStyle = bg; x.fillRect(0, 0, 32, 32);
    if (opt.brick) { x.fillStyle = opt.brick; for (let j = 1; j < 32; j += 2) for (let i = (j % 4 ? 0 : 2); i < 32; i += 4) x.fillRect(i, j, 3, 1); }
    for (let j = 32 - rowH; j > 0; j -= rowH) {
      if (trim) { x.fillStyle = trim; x.fillRect(0, j + rowH - 1, 32, 1); }
      for (let i = 1; i + ww <= 32; i += step) {
        const top = j + rowH - 1 - wh;
        x.fillStyle = win; x.fillRect(i, top + 1, ww, wh - 1); x.fillRect(i + (ww > 2 ? 1 : 0), top, Math.max(1, ww - 2), 1);
        if (trim) { x.fillStyle = trim; x.fillRect(i - 1, top + wh, ww + 2, 1); }
        y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, top + 1, ww, wh - 1);
      }
    }
  });
}
// 銅像: 立った人 (s = 高さの倍率。1 で約1.8m)。pose: 'stand' / 'wave' (片手を上げる) / 'reach' (両手を前に広げる)
function acStatue(x, z, y0, s, ry, mat, pose = 'stand', ped = { w: 1.6, h: 1.4, mat: 'TKSTONE' }) {
  if (ped) pushPrism(ped.mat, ped.mat, regularPoly(x, z, ped.w * 0.75, 4, Math.PI / 4 + ry), y0, y0 + ped.h);
  const b = y0 + (ped ? ped.h : 0), c = Math.cos(ry), sn = Math.sin(ry);
  const put = (w, h, d, ox, oy, oz, rx = 0, rz = 0) => {
    const g = new THREE.BoxGeometry(w * s, h * s, d * s); if (rx) g.rotateX(rx); if (rz) g.rotateZ(rz);
    g.rotateY(ry).translate(x + (ox * c + oz * sn) * s, b + oy * s, z + (-ox * sn + oz * c) * s); bake(mat, g);
  };
  put(0.2, 0.85, 0.22, -0.13, 0.43, 0); put(0.2, 0.85, 0.22, 0.13, 0.43, 0);   // 脚
  put(0.56, 0.75, 0.32, 0, 1.22, 0); put(0.28, 0.3, 0.28, 0, 1.75, 0);       // 胴と頭
  if (pose === 'wave') { put(0.15, 0.7, 0.15, -0.38, 1.25, 0, 0, -0.15); put(0.15, 0.7, 0.15, 0.4, 1.85, 0, 0, 0.35); }
  else if (pose === 'reach') { put(0.15, 0.7, 0.15, -0.36, 1.35, -0.25, -1.1, 0); put(0.15, 0.7, 0.15, 0.36, 1.35, -0.25, -1.1, 0); }
  else { put(0.15, 0.7, 0.15, -0.36, 1.2, 0); put(0.15, 0.7, 0.15, 0.36, 1.2, 0); }
  solid(x - 0.5 * s, z - 0.5 * s, x + 0.5 * s, z + 0.5 * s, b, b + 2 * s);
}
// 東西 / 南北の道路。rect = [x0, z0, x1, z1] は車道。歩道 5m と街路樹をつけ、自動生成の街をよける
function acRoad(rect, dir, name, opt = {}) {
  const [x0, z0, x1, z1] = rect, sw = opt.walk ?? 5;
  addRoads([[x0, z0, x1, z1, dir, name]]);
  if (dir === 'ns') { tiles(x0 - sw, z0, x0, z1, '#c8c0b0', '#b6ae9e', 2); tiles(x1, z0, x1 + sw, z1, '#c8c0b0', '#b6ae9e', 2); LM_ZONES.push(rectPoly(x0 - sw - 1, z0, x1 + sw + 1, z1));
    if (opt.trees !== false) for (let z = z0 + 6; z < z1 - 4; z += 11) LM_STREET.push([x0 - sw / 2, z, 1.1], [x1 + sw / 2, z + 5.5, 1.1]);
    LM_PEOPLE.push([[x0 - sw / 2, z0 + 4, x0 - sw / 2, z1 - 4], Math.max(3, Math.round((z1 - z0) / 35))], [[x1 + sw / 2, z1 - 4, x1 + sw / 2, z0 + 4], Math.max(3, Math.round((z1 - z0) / 45))]);
  } else { tiles(x0, z0 - sw, x1, z0, '#c8c0b0', '#b6ae9e', 2); tiles(x0, z1, x1, z1 + sw, '#c8c0b0', '#b6ae9e', 2); LM_ZONES.push(rectPoly(x0, z0 - sw - 1, x1, z1 + sw + 1));
    if (opt.trees !== false) for (let x = x0 + 6; x < x1 - 4; x += 11) LM_STREET.push([x, z0 - sw / 2, 1.1], [x + 5.5, z1 + sw / 2, 1.1]);
    LM_PEOPLE.push([[x0 + 4, z0 - sw / 2, x1 - 4, z0 - sw / 2], Math.max(3, Math.round((x1 - x0) / 35))], [[x1 - 4, z1 + sw / 2, x0 + 4, z1 + sw / 2], Math.max(3, Math.round((x1 - x0) / 45))]);
  }
}
// 木を植えてよい場所か (建物などの当たり判定の箱と、r m 以内で重ならない)
function acFree(x, z, r = 3.2) {
  for (const s of query(x - r, z - r, x + r, z + r)) if (s[0] < x + r && s[2] > x - r && s[1] < z + r && s[3] > z - r && s[4] < 3) return false;
  return true;
}
