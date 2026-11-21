/* JY01 東京駅 (丸の内)
   赤レンガの丸の内駅舎 (南北のドーム) / 丸の内駅前広場 / 行幸通り / 丸ビル・新丸ビル・KITTE・オアゾ /
   丸の内仲通り / 八重洲口のグランルーフとグラントウキョウ / 皇居外苑・二重橋・伏見櫓・楠木正成像・和田倉噴水公園
   丸の内側は線路の向き (北北東) に合わせた座標系 F で作る: u = 北 (神田方面), v = 西 (皇居側) */
function tkyFrame(st) {
  const A = ringAt(st.s - 170), B = ringAt(st.s + 170), p = ringAt(st.s);
  return frame((A.x + B.x) / 2, (A.z + B.z) / 2, B.x - A.x, B.z - A.z, -p.nx, -p.nz);
}
const TKY_X = -300;   // 日比谷通りの東端 (ここから西が皇居)
STATION({
  no: 1, name: '東京', kana: 'とうきょう', roma: 'Tōkyō', town: '丸の内',
  lat: 35.6812, lon: 139.7671, custom: true,
  // 皇居のお濠 (陸地から切り抜く) と橋。和田倉橋は行幸通りの突き当たりに架ける
  land(st) {
    const F = tkyFrame(st), zAt = x => F.oz + (x - F.ox) / F.vx * F.vz, za = zAt(-336), zb = zAt(-372);
    return {
      water: [[-372, -2150, -336, -1560], [-680, -1880, -640, -1580]],
      bridges: [[-372, Math.min(za, zb) - 13, -336, Math.max(za, zb) + 13], [-372, -1668, -336, -1648]],
      walk: [[-680, -1745, -640, -1733]],   // 二重橋 (正門石橋) は自前で作る
    };
  },
  build(st) {
    const F = tkyFrame(st), vEnd = (TKY_X - F.ox) / F.vx;   // 行幸通りが日比谷通りに突き当たる位置
    const okX = (u0, v0, u1, v1, m = 4) => F.rect(u0, v0, u1, v1).every(p => p[0] > TKY_X + m);
    // ---- 自動生成の街を置かない範囲と、下地
    const zoneM = clipPolyX(F.rect(-335, -140, 335, 300), TKY_X), zoneP = rectPoly(-1000, -2200, TKY_X, -1500);
    LM_ZONES.push(zoneM, zoneP);
    polyFr(zoneM, '#a29c92');
    fr(-1000, -2200, TKY_X, -1500, '#3f5f30');

    // ---- 素材
    const brick = LM_MAT('tkBrick', (x, y) => {   // 赤レンガに白い石の帯、縦長の窓
      x.fillStyle = '#a4513c'; x.fillRect(0, 0, 32, 32);
      x.fillStyle = 'rgba(60,20,10,.25)'; for (let j = 0; j < 32; j += 2) x.fillRect(0, j, 32, 1);
      x.fillStyle = '#e8e0cc'; for (const j of [0, 11, 21, 31]) x.fillRect(0, j, 32, 1);
      y.fillStyle = '#2a120a'; y.fillRect(0, 0, 32, 32);                // ライトアップで外壁がほんのり光る
      for (const [j0, j1] of [[3, 9], [13, 19], [23, 30]]) for (let i = 1; i < 32; i += 4) {
        x.fillStyle = '#efe8d8'; x.fillRect(i - 0.5, j0 - 1, 3, j1 - j0 + 2);
        x.fillStyle = '#2c3640'; x.fillRect(i, j0, 2, j1 - j0);
        y.fillStyle = rnd() < 0.7 ? '#ffd890' : '#3a2010'; y.fillRect(i, j0, 2, j1 - j0);
      }
    });
    const mStone = LM_MAT('mStone', (x, y) => {   // 丸の内の石張りの低層部 (高さ31m = 百尺で揃う)
      x.fillStyle = '#d6cab2'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 2; j < 32; j += 4) for (let i = 1; i < 32; i += 3) { x.fillStyle = '#3e4a56'; x.fillRect(i, j, 2, 2); y.fillStyle = rnd() < 0.55 ? pick(LIT) : '#000'; y.fillRect(i, j, 2, 2); }
      x.fillStyle = '#c2b69c'; x.fillRect(0, 0, 32, 1);
    });
    const mGlass = LM_MAT('mGlass', (x, y) => {
      x.fillStyle = '#5a7a88'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 0; j < 32; j += 2) { x.fillStyle = j % 4 ? '#6e909e' : '#87a8b4'; x.fillRect(0, j, 32, 1); for (let i = 0; i < 32; i += 2) if (rnd() < 0.45) { y.fillStyle = pick(LIT); y.fillRect(i, j, 2, 1); } }
      x.fillStyle = '#c8d0d4'; for (let i = 0; i < 32; i += 4) x.fillRect(i, 0, 1, 32);
    });
    const kitte = LM_MAT('kitte', (x, y) => {      // 旧東京中央郵便局: 白いタイルと規則正しい窓
      x.fillStyle = '#eeece6'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 2; j < 30; j += 5) for (let i = 1; i < 32; i += 4) { x.fillStyle = '#4a5660'; x.fillRect(i, j, 3, 3); y.fillStyle = rnd() < 0.6 ? '#fff0c8' : '#000'; y.fillRect(i, j, 3, 3); }
    });
    const yagura = LM_MAT('yagura', (x, y) => {    // 櫓の白壁 (下は黒い腰板)
      x.fillStyle = '#f2f0ea'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      x.fillStyle = '#2a2a2e'; x.fillRect(0, 26, 32, 6);
      for (let i = 3; i < 32; i += 8) { x.fillStyle = '#3a3a40'; x.fillRect(i, 10, 3, 4); }
    });

    // ===== 丸の内駅舎 =====
    const body = (u0, u1, v0, v1, h, rh) => { oBox(F, brick, u0, v0, u1, v1, 0, h); oHip(F, 'SLATE', u0, v0, u1, v1, h, rh); };
    body(-118, -24, 24, 42, 17, 4); body(24, 118, 24, 42, 17, 4);          // 両翼 (3階建て)
    body(-24, 24, 21, 46, 22, 6);                                            // 中央部 (皇室用の玄関)
    body(-162, -150, 26, 40, 15, 3); body(150, 162, 26, 40, 15, 3);          // 南北の端
    oBox(F, brick, -8, 46, 8, 50, 0, 6); oHip(F, 'SLATE', -8.4, 45.6, 8.4, 50.4, 6, 1.4);   // 車寄せ
    // 南北のドーム (八角形)
    const au = Math.atan2(F.uz, F.ux), DOMES = [];
    for (const du of [-135, 135]) {
      const [cx, cz] = F.w(du, 33); DOMES.push([cx, cz]);
      pushPrism(brick, 'ROOF', regularPoly(cx, cz, 15, 8, au + Math.PI / 8), 0, 22);
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(cx, cz, 15.5, 8, au + Math.PI / 8), 22, 23, { solid: false });
      const prof = [[15.2, 0], [15, 2.5], [13.8, 5.5], [11.5, 8.3], [8.4, 10.6], [4.8, 12.1], [1.6, 12.8], [0.01, 13]].map(([r, y]) => new THREE.Vector2(r, y));
      mesh(new THREE.LatheGeometry(prof, 8), lam({ color: 0x4e555e }), cx, 23, cz, 3 * Math.PI / 8 - au);
      mesh(new THREE.CylinderGeometry(1.2, 1.4, 2.4, 8), WALL.TKSTONE, cx, 37, cz);
      mesh(new THREE.ConeGeometry(1.4, 2.2, 8), lam({ color: 0x4e555e }), cx, 39.3, cz);
      polySolid(regularPoly(cx, cz, 13, 8), 23, 28); polySolid(regularPoly(cx, cz, 8, 8), 28, 33); polySolid(regularPoly(cx, cz, 2, 8), 33, 36);
    }
    // ライトアップの灯り (夜、駅舎の前に並ぶ街灯)
    for (let u = -150; u <= 150; u += 20) LAMPS2.push(F.w(u, 52));

    // ===== 丸の内駅前広場・行幸通り =====
    oTiles(F, -110, 44, 110, 112, '#cfc8b8', '#bab2a2', 4);
    oFr(F, -96, 64, -34, 100, GRASS); oFr(F, 34, 64, 96, 100, GRASS);        // 芝生
    for (const s of [-1, 1]) for (let u = 38; u <= 92; u += 9) ROUND.push([...F.w(s * u, 102), 0.8]);
    for (const [a, b] of [[-200, -112], [112, 200]]) {                         // 南北の交通広場 (タクシー乗り場)
      oFr(F, a, 44, b, 110, '#3c3c42'); oFr(F, a + 10, 60, b - 10, 94, '#b8b0a2');
      for (let u = a + 14; u < b - 14; u += 6) PARKED.push([...F.w(u, 54), F.ang + Math.PI / 2]);
    }
    oRoad(F, -330, 112, 330, 124, true, [-12, 8]);                             // 駅前の通り
    oRoad(F, -25, 124, -13, vEnd, false); oRoad(F, 13, 124, 25, vEnd, false);  // 行幸通り
    oTiles(F, -13, 124, 13, vEnd, '#d4ccb8', '#c0b8a4', 3);
    for (let v = 132; v < vEnd - 4; v += 10) { LM_STREET.push([...F.w(-14.6, v), 1.05], [...F.w(14.6, v), 1.05]); }
    for (let v = 140; v < vEnd; v += 24) LAMPS2.push(F.w(-11.5, v), F.w(11.5, v));
    LM_PEOPLE.push([[...F.w(-5, 60), ...F.w(-5, vEnd + 20)], 10], [[...F.w(5, 60), ...F.w(5, vEnd + 20)], 10], [[...F.w(-100, 80), ...F.w(100, 80)], 14], [[...F.w(-160, 56), ...F.w(160, 56)], 10]);

    // ===== 丸の内のビル街 (低層部は高さ31mでそろう) =====
    const tower = (u0, v0, u1, v1, h, key, podKey = mStone, pod = 31, inset = 8) => {
      oBox(F, podKey, u0, v0, u1, v1, 0, pod);
      if (h > pod) oBox(F, key, u0 + inset, v0 + inset, u1 - inset, v1 - inset, pod, h);
    };
    tower(-118, 130, -31, 204, 180, 'glassDark');                           // 丸ビル
    tower(31, 130, 118, 204, 198, mGlass);                                  // 新丸ビル
    oBox(F, kitte, -202, 128, -128, 204, 0, 31);                            // KITTE: 旧局舎の白い低層部
    oBox(F, 'glass', -196, 168, -134, 202, 31, 200);                        //        奥にJPタワー
    oFr(F, -190, 132, -140, 160, GRASS);                                     //        屋上庭園の芝生は地図にも
    tower(128, 128, 214, 204, 150, 'glass', 'office2', 24, 10);             // 丸の内オアゾ
    // 仲通り (歩行者に優しい石畳の通りと並木)
    oTiles(F, -330, 206, 330, 218, '#c4b496', '#ae9e82', 2);
    for (let u = -320; u < 330; u += 14) { const a = F.w(u, 207.5), b = F.w(u, 216.5); if (a[0] > TKY_X + 6) LM_STREET.push([...a, 0.9]); if (b[0] > TKY_X + 6) LM_STREET.push([...b, 0.9]); }
    LM_PEOPLE.push([[...F.w(-200, 212), ...F.w(320, 212)], 12]);
    for (const [a, b] of [[-212, -202], [-128, -118], [118, 128], [214, 224]]) oRoad(F, a, 124, b, 300, false);
    // 残りの街区: 低層部31m + タワー (皇居側にはみ出す街区は奥行きを詰める)
    const blocks = [[-320, 128, -212, 204], [224, 128, 320, 204], [-320, 220, -212, 296], [-202, 220, -128, 296], [-118, 220, -31, 296], [31, 220, 118, 296], [128, 220, 214, 296], [224, 220, 320, 296]];
    for (let [u0, v0, u1, v1] of blocks) {
      while (v1 - v0 > 30 && !okX(u0, v0, u1, v1)) v1 -= 6;
      if (!okX(u0, v0, u1, v1)) continue;
      const q = rnd(), key = pick(['glassDark', mGlass, 'office2', 'glass']);
      if (q < 0.65) tower(u0 + 2, v0 + 2, u1 - 2, v1 - 2, rr(110, 200), key);
      else oBox(F, mStone, u0 + 2, v0 + 2, u1 - 2, v1 - 2, 0, 31);
    }

    // ===== 八重洲口 =====
    oTiles(F, -150, -62, 150, -30, '#c4beb2', '#b0aa9e', 4);
    oBox(F, 'CONC', -118, -46, 118, -32, 9.4, 10, { top: 'CONC' });           // グランルーフの2階デッキ
    for (let u = -112; u <= 112; u += 28) for (const v of [-44, -34]) oBox(F, 'CONC', u - 0.5, v - 0.5, u + 0.5, v + 0.5, 0, 9.4);
    { // 帆のような白い膜屋根
      const H = holderFor(...F.w(0, -40), 30), t = bucket(H, 'MEMBRANE'), P3 = (u, v, y) => { const [x, z] = F.w(u, v); return [x, y, z]; };
      for (let u = -120; u < 120; u += 15) {
        const y0 = 25.5 + Math.sin(u / 30) * 1.3, y1 = 25.5 + Math.sin((u + 15) / 30) * 1.3;
        pushFace(t, [P3(u, -28, y0), P3(u + 15, -28, y1), P3(u + 15, -52, y1 - 6), P3(u, -52, y0 - 6)], [0, 1, 0]);
      }
      LAMPS2.push(...[-90, -30, 30, 90].map(u => F.w(u, -58)));
    }
    tower(-215, -100, -152, -40, 205, mGlass, 'office2', 30, 4);              // グラントウキョウ サウスタワー
    tower(152, -100, 215, -40, 205, mGlass, 'office2', 30, 4);                // グラントウキョウ ノースタワー
    oRoad(F, -330, -76, 330, -62, true, [-20, 16]);                           // 八重洲駅前の通り
    oRoad(F, -8, -140, 8, -76, false);                                        // 八重洲通り
    for (const [u0, u1] of [[-320, -240], [-130, -12], [12, 130], [240, 320]]) {
      for (let u = u0; u < u1 - 10;) { const w = Math.min(rr(26, 40), u1 - u); const h = rnd() < 0.3 ? rr(60, 120) : rr(20, 50);
        oBox(F, pick(['office', 'office2', 'glass', mStone]), u + 1, -136, u + w - 1, -84, 0, h); u += w; }
    }
    LM_PEOPLE.push([[...F.w(-140, -50), ...F.w(140, -50)], 14]);

    // ===== 皇居 =====
    addRoads([[-330, -2200, -300, -1500, 'ns', '日比谷通り (皇居前)']]);
    // 皇居外苑: 黒松の点在する芝生と玉砂利の広場
    fr(-636, -1990, -376, -1564, GRASS);
    const GRAVEL = '#d8ceb2', zW = F.oz + (-354 - F.ox) / F.vx * F.vz;
    fr(-636, -1800, -556, -1680, GRAVEL);
    const PATHS = [[-376, zW, -590, -1760, 12], [-376, -1658, -590, -1700, 12], [-556, -1990, -556, -1564, 9], [-470, -1990, -470, -1564, 6]];
    for (const [x0, z0, x1, z1, w] of PATHS) ln(x0, z0, x1, z1, w, GRAVEL);
    const nearPath = (x, z) => PATHS.some(([x0, z0, x1, z1, w]) => { const dx = x1 - x0, dz = z1 - z0, t = Math.max(0, Math.min(1, ((x - x0) * dx + (z - z0) * dz) / (dx * dx + dz * dz))); return Math.hypot(x - x0 - dx * t, z - z0 - dz * t) < w / 2 + 3; });
    for (let x = -630; x < -382; x += 15) for (let z = -1984; z < -1570; z += 15) {
      const px = x + rr(-4, 4), pz = z + rr(-4, 4);
      if (!nearPath(px, pz) && !inR([-640, -1806, -550, -1674], px, pz) && !inR([-430, -1615, -395, -1585], px, pz)) PINES.push([px, pz, rr(1.0, 1.5)]);
    }
    LM_PEOPLE.push([[-380, zW, -585, -1758], 8], [[-380, -1658, -585, -1702], 8], [[-630, -1740, -560, -1740], 6]);
    // 和田倉噴水公園
    fr(-636, -2110, -376, -1994, '#bdb6a6'); fr(-600, -2080, -420, -2030, '#4a86a8');
    const JETS = [];
    for (let x = -585; x <= -435; x += 30) { const m = mesh(new THREE.CylinderGeometry(0.5, 1.2, 1, 6).translate(0, 0.5, 0), glow(lam({ color: 0xeef6ff, transparent: true, opacity: 0.85 }), 0xd8ecff, 0.6), x, 0, -2055); JETS.push(m); }
    LM_UPDATERS.push((dt, t) => JETS.forEach((m, i) => m.scale.y = 4 + Math.sin(t * 1.3 + i) * 2.5));
    for (let x = -630; x < -382; x += 14) ROUND.push([x, -2104, 0.9], [x, -2000, 0.9]);
    fr(-636, -2200, -376, -2110, GRASS);
    for (let k = 0; k < 40; k++) ROUND.push([rr(-630, -382), rr(-2195, -2116), rr(1, 1.4)]);
    // 楠木正成像 (騎馬像)
    {
      const cx = -412, cz = -1600, B = 'BRONZE';
      pushPrism('ISHIGAKI', 'ISHIGAKI', rectPoly(cx - 4, cz - 3, cx + 4, cz + 3), 0, 4.5);
      const H = chunkAt(cx, cz), b = (x0, y0, z0, x1, y1, z1) => pushBox(bucket(H, B), bucket(H, B), cx + x0, y0, cz + z0, cx + x1, y1, cz + z1);
      b(-2.2, 6.2, -0.6, 2.2, 8, 0.6);                                             // 馬の胴
      for (const [lx, lz] of [[-1.8, -0.4], [-1.8, 0.4], [1.6, -0.4], [1.6, 0.4]]) b(lx - 0.2, 4.5, lz - 0.2, lx + 0.2, 6.3, lz + 0.2);
      b(-3.4, 7.6, -0.35, -2, 9.6, 0.35); b(-4.3, 9, -0.3, -3.2, 9.8, 0.3);          // 首と頭 (前脚を上げる勢い)
      b(-0.5, 8, -0.5, 0.5, 10.2, 0.5); b(-0.35, 10.2, -0.35, 0.35, 10.9, 0.35); b(-0.5, 10.9, -0.5, 0.5, 11.2, 0.5);   // 武将
      b(1.8, 7, -0.15, 3.2, 7.4, 0.15);                                            // 尾
      solid(cx - 4.5, cz - 1, cx + 3.5, cz + 1, 4.5, 11);
    }
    // 二重橋濠の向こう: 石垣と森 (皇居)
    for (const [z0, z1] of [[-2200, -1880], [-1580, -1552]]) pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(-694, z0, -686, z1), 0, 3.5);   // 外苑との境の石垣
    for (const [z0, z1] of [[-1880, -1747], [-1731, -1580]]) pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(-694, z0, -680, z1), 0, 7);     // お濠に面した高い石垣
    // 正門 (閉ざされた鉄の門) と、奥の正門鉄橋
    pushPrism('CONC', 'CONC', rectPoly(-693, -1747, -684, -1731), 0, 3.6);
    { const H = chunkAt(-690, -1739), d = bucket(H, 'BRONZE'); for (let z = -1746; z < -1732; z += 1) pushBox(d, d, -684.2, 3.6, z, -683.8, 6, z + 0.15); }
    pushPrism('BRONZE', 'CONC', rectPoly(-780, -1748, -736, -1736), 7.4, 8.4);
    for (const z of [-1748, -1736.3]) pushPrism('BRONZE', null, rectPoly(-780, z, -736, z + 0.3), 8.4, 9.5, { solid: false });
    // 二重橋 (正門石橋): 石の二連アーチ
    {
      pushPrism('ISHIGAKI', 'TKSTONE', rectPoly(-680, -1745, -640, -1733), -0.7, 0, { solid: false });
      for (const z of [-1745, -1733.6]) pushPrism('TKSTONE', 'TKSTONE', rectPoly(-680, z, -640, z + 0.6), 0, 1.0);
      for (const x of [-680, -662, -644]) pushPrism('ISHIGAKI', null, rectPoly(x, -1745, x + 4, -1733), -2.2, -0.7, { solid: false });
      const arch = new THREE.TorusGeometry(7.6, 0.9, 5, 10, Math.PI);   // 平たいアーチ (水面から橋桁まで)
      for (const xc of [-669, -651]) for (const z of [-1745.2, -1732.8]) mesh(arch, WALL.ISHIGAKI, xc, -2.2, z).scale.set(1, 0.2, 1);
      const lampM = glow(lam({ color: 0xfff0c8 }), 0xffe0a0, 1.4);
      for (const x of [-676, -660, -644]) for (const z of [-1744.7, -1733.3]) {
        mesh(new THREE.CylinderGeometry(0.15, 0.22, 3.6, 6).translate(0, 1.8, 0), WALL.BRONZE, x, 1, z);
        for (const dz of [-0.45, 0.45]) mesh(new THREE.BoxGeometry(0.45, 0.6, 0.45), lampM, x, 4.4, z + dz);
      }
    }
    // 伏見櫓 (石垣の上の二重櫓) と多聞櫓
    pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(-736, -1832, -694, -1760), 0, 10);
    pushPrism(yagura, 'ROOF', rectPoly(-728, -1826, -700, -1798), 10, 16); oHip(AXIS, 'SLATE', -729, -1827, -699, -1797, 16, 3.2, { over: 1.2 });
    pushPrism(yagura, 'ROOF', rectPoly(-721, -1819, -707, -1805), 18, 22.5); oHip(AXIS, 'SLATE', -722, -1820, -706, -1804, 22.5, 3.4, { over: 1.2 });
    pushPrism(yagura, 'ROOF', rectPoly(-724, -1796, -704, -1764), 10, 14.5); oHip(AXIS, 'SLATE', -725, -1797, -703, -1763, 14.5, 2.6, { over: 0.9 });
    // 皇居の森
    for (let k = 0; k < 520; k++) {
      const x = rr(-995, -700), z = rr(-2195, -1505); if (inR([-745, -1840, -690, -1755], x, z) || inR([-790, -1752, -730, -1732], x, z)) continue;
      (rnd() < 0.35 ? PINES : ROUND).push([x, z, rr(1.1, 1.8)]);
    }
    LM_CATS.push([-715, -1780, 10]);   // 伏見櫓の石垣の上

    // ===== 名所の名前・入口・地図 =====
    const bb = (u0, v0, u1, v1) => polyBB(F.rect(u0, v0, u1, v1));
    st.ent = F.w(0, 70); st.ents = [st.ent, F.w(0, -50)];
    SPOT_AREAS.push(
      ['東京駅 丸の内駅舎 (南ドーム)', ...polyBB(regularPoly(...DOMES[0], 17, 8))], ['東京駅 丸の内駅舎 (北ドーム)', ...polyBB(regularPoly(...DOMES[1], 17, 8))],
      ['KITTE (旧東京中央郵便局)', ...bb(-202, 128, -128, 204)], ['丸ビル', ...bb(-118, 130, -31, 204)], ['新丸ビル', ...bb(31, 130, 118, 204)], ['丸の内オアゾ', ...bb(128, 128, 214, 204)],
      ['グラントウキョウ サウスタワー', ...bb(-215, -100, -152, -40)], ['グラントウキョウ ノースタワー', ...bb(152, -100, 215, -40)],
      ['東京駅 八重洲口 グランルーフ', ...bb(-120, -62, 120, -28)],
      ['東京駅 丸の内駅舎', ...bb(-165, 20, 165, 50)], ['東京駅 丸の内駅前広場', ...bb(-110, 50, 110, 112)], ['行幸通り', ...bb(-25, 112, 25, vEnd)],
      ['丸の内仲通り', ...bb(-330, 206, 330, 218)],
      ['二重橋', -700, -1760, -600, -1718], ['伏見櫓', -740, -1836, -690, -1758], ['楠木正成像', -425, -1612, -398, -1588],
      ['和田倉噴水公園', -636, -2110, -376, -1994], ['和田倉橋', -376, zW - 16, -332, zW + 16],
      ['皇居外苑 (皇居前広場)', -640, -1994, -376, -1560], ['皇居', -1000, -2200, -680, -1500],
      ['東京駅 八重洲口', ...bb(-330, -140, 330, -20)], ['丸の内', ...polyBB(zoneM)]);
    DIST_AREAS.push(['皇居外苑', -680, -2200, TKY_X, -1500]);
    LM_LABELS.push(['丸の内駅舎', ...F.w(0, 33), '🧱', '東京駅 丸の内駅舎'], ['行幸通り', ...F.w(0, 200), '🌳'], ['丸ビル', ...F.w(-75, 160), '🏢'], ['新丸ビル', ...F.w(75, 160), '🏢'],
      ['KITTE', ...F.w(-165, 150), '📮', 'KITTE (旧東京中央郵便局)'], ['グランルーフ', ...F.w(0, -45), '⛵', '東京駅 八重洲口 グランルーフ'],
      ['皇居外苑', -500, -1880, '🌲', '皇居外苑 (皇居前広場)'], ['二重橋', -660, -1760, '🌉'], ['伏見櫓', -716, -1850, '🏯'], ['楠木正成像', -412, -1620, '🐎'],
      ['和田倉噴水公園', -510, -2060, '⛲'], ['皇居', -850, -1850, '🌲']);
    Object.assign(LM_NOTES, {
      '東京駅 丸の内駅舎': '1914年開業の赤レンガ駅舎。設計は辰野金吾。2012年に創建時の3階建て・ドーム屋根の姿へ復原された',
      '東京駅 丸の内駅舎 (南ドーム)': 'ドームの内側には干支のレリーフ。壁を登ればドームのてっぺんまで行ける',
      '東京駅 丸の内駅舎 (北ドーム)': '南北のドームは戦災で焼け、戦後は八角形の屋根で長く仮復旧されていた',
      '東京駅 丸の内駅前広場': '皇居へまっすぐ続く行幸通りの起点。2017年に今の広い歩行者広場に整備された',
      '行幸通り': '天皇の行幸や、新任の大使が皇居へ向かう馬車列が通る道。イチョウ並木が続く',
      '丸ビル': '初代 (1923年) は「東洋一のビル」。今のビルは低層部の高さ31m (百尺) を受け継ぐ',
      '新丸ビル': '丸の内の低層部は高さ31mでそろえてあり、通りから見ると軒の線が一直線に続く',
      'KITTE (旧東京中央郵便局)': '昭和初期の郵便局舎を一部残した商業施設。屋上庭園から丸の内駅舎を見下ろせる',
      '東京駅 八重洲口 グランルーフ': '八重洲口の白い大屋根。帆のような膜屋根が長さ約230m続く',
      '皇居外苑 (皇居前広場)': '黒松が点在する広い芝生と玉砂利の広場。皇居前広場とも呼ばれる',
      '二重橋': '手前の石橋と奥の鉄橋。奥の橋がかつて橋桁を二段にした木橋だったことが名の由来とされる',
      '伏見櫓': '江戸城に今も残る数少ない櫓。京都の伏見城から移したという言い伝えがある',
      '楠木正成像': '1900年に完成した騎馬像。高村光雲らが制作にかかわった',
      '和田倉噴水公園': '1961年、皇太子 (今の上皇) ご成婚を記念してつくられた噴水の公園',
      '皇居': '江戸城の跡。お濠と石垣に囲まれた森の奥は、ふだんは入れない',
    });
    LM_ACH.push(['dome', '🧱 赤レンガのてっぺん', '東京駅 丸の内駅舎のドームの上に立つ', () => P.y > 33 && DOMES.some(([x, z]) => Math.hypot(P.x - x, P.z - z) < 6)]);
  },
});
