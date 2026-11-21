/* 臨海副都心・湾岸・お台場 (芝浦 / 台場 / 青海 / 有明 / 東雲 / 新木場)
   レインボーブリッジと芝浦のループ橋 / お台場海浜公園 (砂浜) と自由の女神像 / 第三台場 (台場公園) /
   フジテレビ (球体展望室) / 潮風公園 / 東京国際クルーズターミナル / テレコムセンター / 東京ビッグサイト
   ゆりかもめ (新橋〜豊洲) は engine/12b の乗り物の路線で走る */
REGION({
  name: '臨海副都心・湾岸',
  towns: [['芝浦', -350, 650], ['台場', 900, 1050], ['青海', 900, 1500], ['有明', 1550, 800], ['東雲', 1950, -250], ['辰巳', 1950, 150], ['新木場', 2480, 0], ['夢の島', 2480, -850]],
  hubs: [{ x: 960, z: 1100, town: 520 }, { x: 980, z: 1500, town: 450 }, { x: 1600, z: 700, core: 200, town: 500 }, { x: 1950, z: -250, style: 'towers', town: 350 }],
  labels: [],
  build(r) {
    const M = (key, bg, win, lit, step = 3, rows = 3) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rows) for (let i = 1; i < 32; i += step) { x.fillStyle = win; x.fillRect(i, j, step - 1, rows - 1); y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, j, step - 1, rows - 1); }
    });
    const white = 'RB_WHITE'; if (!WALL[white]) { WALL[white] = lam({ color: 0xeeeeea, emissive: 0xffffff, emissiveIntensity: 0 }); GLOW.push([WALL[white], 0.55]); }

    // ===== レインボーブリッジと芝浦のループ橋 =====
    const Z0 = 940, Z1 = 960, DY = 50, XL = -260, X1 = 670, RE = 1100, LC = [-260, 860], LR = 90;
    const deckY = x => x < XL ? 0 : x > X1 ? DY * (RE - x) / (RE - X1) : DY;
    LM_ZONES.push(rectPoly(XL - 300, Z0 - 12, RE + 10, Z1 + 12), regularPoly(LC[0], LC[1], LR + 14, 16));
    for (let x = XL; x < RE; x += 4) {   // 橋の上の道路 (お台場側は坂で地上へ)
      const y = deckY(x + 2), ya = Math.max(0.15, deckY(x)), yb = Math.max(0.15, deckY(x + 4));
      pushSlope('ASPH', 'CONC', [x, 950], [x + 4, 950], 10, ya, yb, 1.4);
      for (let k = 0; k < 2; k++) solid(x + k * 2, Z0, x + k * 2 + 2, Z1, deckY(x + k * 2 + 1) - 1.4, deckY(x + k * 2 + 1));
      for (const z of [Z0 + 0.2, Z1 - 0.2]) { pushSlope(white, white, [x, z], [x + 4, z], 0.2, ya + 1.2, yb + 1.2, 1.2); solid(x, z - 0.2, x + 4, z + 0.2, y, y + 1.2); }
      if (x % 60 === 0 && (x < -100 || x > X1 + 20)) pushPrism('CONC', null, rectPoly(x, 945, x + 3, 955), onLand(x, 950) ? 0 : -3, y - 1.4, { solid: false });
    }
    // ループ橋: 橋の西の端から時計回りに1周しながら地上まで下りる (下を くぐって芝浦の街へ)
    const NL = 72, ly = k => DY * (1 - k / NL), lp = (k, r) => { const a = Math.PI / 2 + k / NL * Math.PI * 2; return [LC[0] + Math.cos(a) * r, LC[1] + Math.sin(a) * r]; };
    for (let k = 0; k < NL; k++) {
      const a0 = lp(k, LR), a1 = lp(k + 1, LR), ya = Math.max(0.15, ly(k)), yb = Math.max(0.15, ly(k + 1)), ym = Math.max(0.15, ly(k + 0.5));
      pushSlope('ASPH', 'CONC', a0, a1, 10, ya, yb, 1.4);
      polySolid([lp(k, LR - 10), lp(k + 1, LR - 10), lp(k + 1, LR + 10), lp(k, LR + 10)], ym - 1.4, ym);
      for (const rr2 of [LR - 9.8, LR + 9.8]) { const b0 = lp(k, rr2), b1 = lp(k + 1, rr2); pushSlope(white, white, b0, b1, 0.2, ya + 1.2, yb + 1.2, 1.2); solid(...polyBB([b0, b1]), ym, ym + 1.2); }
      if (k % 6 === 3 && ym > 6) { const [px, pz] = lp(k + 0.5, LR); pushPrism('CONC', null, rectPoly(px - 1.5, pz - 1.5, px + 1.5, pz + 1.5), 0, ym - 1.4, { solid: false }); }
      polyFr([lp(k, LR - 10), lp(k + 1, LR - 10), lp(k + 1, LR + 10), lp(k, LR + 10)], '#5a5a60');
    }
    BRIDGE_POLYS.push([regularPoly(LC[0], LC[1], LR + 10, 24), 'レインボーブリッジ (ループ橋)']);
    fr(XL - 300, Z0, RE, Z1, '#5a5a60'); fr(XL - 300, 949.7, RE, 950.3, '#e8e6dc');
    for (const tx of [10, 580]) {   // 主塔 (高さ126m)。ゆりかもめは主塔の脚のあいだを通る
      for (const z of [922, 962]) pushPrism(white, white, rectPoly(tx - 3, z, tx + 3, z + 4), -3, 126);
      for (const y of [40, 90, 122]) pushPrism(white, white, rectPoly(tx - 2.5, 922, tx + 2.5, 966), y, y + 3, { solid: false });
    }
    for (const ax of [-150, 720]) pushPrism('CONC', 'CONC', rectPoly(ax - 25, Z0 - 10, ax + 25, Z1 + 10), 0, 30);   // アンカレイジ
    {
      const cp = [], cab = x => x < 10 ? 30 + 93 * ((x + 150) / 160) ** 2 : x > 580 ? 30 + 93 * ((720 - x) / 140) ** 2 : 52 + 71 * ((x - 295) / 285) ** 2;
      for (const z of [924, 964]) for (let x = -150; x < 720; x += 10) {
        cp.push(x, cab(x), z, x + 10, cab(x + 10), z);
        if (x > -140 && x < 710 && x % 20 === 0) cp.push(x, cab(x), z, x, deckY(x) + 1, z);   // ハンガー
      }
      const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3));
      const cm = new THREE.LineBasicMaterial({ color: 0xf4f4f0 }); FAR.group.add(new THREE.LineSegments(cg, cm));
      LM_UPDATERS.push(() => cm.color.setHex(NIGHT > 0.5 ? 0xfff2c8 : 0xf4f4f0));   // 夜はケーブルが灯る
    }

    // ===== お台場海浜公園: 砂浜・遊歩道・自由の女神像 =====
    fr(700, 840, 1100, 880, '#e2d2a4'); fr(700, 872, 1100, 880, '#d4c494');
    fr(700, 880, 1100, 935, GRASS); fr(700, 896, 1100, 906, PATH);
    for (let x = 712; x < 1095; x += 14) { if (Math.abs(x - 735) > 20) ROUND.push([x, 888, 0.9]); if (Math.abs(x + 7 - 735) > 24) ROUND.push([x + 7, 924, 1.05]); }
    for (let x = 720; x < 1090; x += 30) BENCHES.push([x, 909, Math.PI]);
    for (let x = 716; x < 1090; x += 24) LAMPS2.push([x, 893]);
    LM_PEOPLE.push([[705, 860, 1095, 860], 18], [[705, 901, 1095, 901], 16], [[640, 835, 700, 835], 4]);
    { // 自由の女神像 (レインボーブリッジの方を向く)
      const g = new THREE.Group(), cx = 735, cz = 902; g.position.set(cx, 0, cz); g.rotation.y = -2.5; chunkAt(cx, cz).group.add(g);
      const st = lam({ color: 0xd8d0bc }), pt = lam({ color: 0x6aa898 }), fl = glow(lam({ color: 0xffc040 }), 0xffa020, 1.5);
      box(7, 1.2, 7, st, 0, 0.6, 0, g); box(5, 4.5, 5, st, 0, 3.45, 0, g); box(4, 2.2, 4, st, 0, 6.8, 0, g);
      const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.5, 5.6, 8), pt); robe.position.set(0, 10.7, 0); g.add(robe);
      box(1.3, 1.3, 1.1, pt, 0, 14.1, 0, g);                                   // 頭
      for (let i = 0; i < 7; i++) { const a = (i - 3) * 0.42, c = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.9, 4), pt); c.position.set(Math.sin(a) * 0.6, 15.0, Math.cos(a) * 0.6); c.rotation.set(Math.cos(a) * 0.8, 0, -Math.sin(a) * 0.8); g.add(c); }
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.45, 3.2, 0.45), pt); arm.position.set(-0.75, 15.4, 0.1); arm.rotation.z = 0.12; g.add(arm);
      const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.2, 0.9, 6), pt); torch.position.set(-0.95, 17.3, 0.1); g.add(torch);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 6), fl); flame.position.set(-0.95, 18.15, 0.1); g.add(flame);
      box(0.9, 1.3, 0.25, pt, 0.95, 12.2, 0.55, g);                             // 独立宣言の銘板
      solid(cx - 3.5, cz - 3.5, cx + 3.5, cz + 3.5, 0, 8); solid(cx - 1.4, cz - 1.4, cx + 1.4, cz + 1.4, 8, 15);
      tiles(cx - 14, cz - 6, cx + 14, cz + 12, '#c8c0b0', '#b4ac9c', 2);
    }
    // 第三台場 (台場公園): 幕末の砲台の跡。石垣に囲まれた四角い島
    {
      const [x0, z0, x1, z1] = [540, 780, 620, 860];
      fr(x0, z0, x1, z1, '#6f6a5e'); fr(x0 + 8, z0 + 8, x1 - 8, z1 - 8, GRASS); fr(620, 826, 700, 844, '#e2d2a4');
      const wall = r => pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(...r), 0, 3.2);
      wall([x0, z0, x1, z0 + 6]); wall([x0, z1 - 6, x1, z1]); wall([x0, z0, x0 + 6, z1]); wall([x1 - 6, z0, x1, 826]); wall([x1 - 6, 844, x1, z1]);
      for (let k = 0; k < 40; k++) { const x = rr(x0 + 10, x1 - 10), z = rr(z0 + 10, z1 - 10); if (Math.abs(x - 580) > 14 || Math.abs(z - 820) > 14) (rnd() < 0.5 ? PINES : ROUND).push([x, z, rr(0.9, 1.3)]); }
      pushPrism('ISHIGAKI', 'ISHIGAKI', rectPoly(566, 806, 594, 834), 0, 0.8);   // 陣屋の跡 (礎石)
      for (const [x, z, ry] of [[548, 800, 0.8], [548, 840, -0.8], [604, 790, 2.4]]) {   // 大砲 (複製)
        const c = mesh(new THREE.CylinderGeometry(0.28, 0.42, 3.2, 8).rotateX(Math.PI / 2), WALL.BRONZE, x, 4.1, z, ry); c.rotation.x = -0.12;
        mesh(new THREE.BoxGeometry(1.4, 0.8, 2), WALL.WOOD, x, 3.6, z, ry);
      }
    }
    // デックス東京ビーチ・アクアシティお台場の場所 (海に面したショッピングモール)。2階は海を見渡す木のデッキ
    const decks = M('decks', '#b89a70', '#3a4652', 0.6, 4, 4), aqua = M('aqua', '#8aa8b8', '#c8e0ec', 0.6, 2, 3);
    addBuilding(700, 965, 840, 1060, 30, decks, { noRoofBox: true }); addBuilding(940, 965, 1080, 1080, 26, aqua, { noRoofBox: true });
    planks(700, 940, 840, 965, '#8a6c4c', '#715739', true);
    pushPrism('WOOD', 'WOOD', rectPoly(700, 942, 840, 965), 6.4, 7);
    for (let x = 704; x < 840; x += 12) pushPrism('WOOD', null, rectPoly(x, 943, x + 0.6, 943.6), 0, 6.4, { solid: false });
    stairs([670, 944, 700, 952], 7, 'x+');
    // ===== フジテレビ本社ビル (2つの棟を格子でつなぎ、球体展望室を抱える) =====
    {
      const fuji = M('fuji', '#c8ccd0', '#3a4654', 0.55, 4, 4), FX = [760, 792, 840, 872], FZ = [1100, 1222];
      pushPrism(fuji, 'ROOF', rectPoly(FX[0], FZ[0], FX[1], FZ[1]), 0, 123); pushPrism(fuji, 'ROOF', rectPoly(FX[2], FZ[0], FX[3], FZ[1]), 0, 123);
      pushPrism(fuji, 'ROOF', rectPoly(FX[1], FZ[0], FX[2], FZ[1]), 0, 27);                  // 7階の屋上庭園 (大階段で上がれる)
      for (const y of [56, 86, 116]) for (const [za, zb] of [[1100, 1114], [1158, 1172], [1208, 1222]]) pushPrism(fuji, 'ROOF', rectPoly(FX[1], za, FX[2], zb), y, y + 7);   // 空中回廊の格子
      for (const x of [800, 816, 832]) pushPrism('CONC', null, rectPoly(x - 0.6, 1100, x + 0.6, 1222), 27, 123, { solid: false });
      const sp = new THREE.Mesh(new THREE.SphereGeometry(16, 14, 10), lam({ color: 0xc8ccd2, emissive: 0x8aa0b8, emissiveIntensity: 0 })); sp.position.set(816, 101, 1136); chunkAt(816, 1136).group.add(sp); GLOW.push([sp.material, 0.25]);
      polySolid(regularPoly(816, 1136, 11, 10), 87, 117); polySolid(regularPoly(816, 1136, 5, 8), 117, 117.5);
      stairs([800, 1222, 832, 1300], 27, 'z-');
      tiles(744, 1222, 890, 1320, '#c8c4bc', '#b4b0a8', 3); fr(744, 1090, 758, 1222, '#b8b4ac');
      LM_ZONES.push(rectPoly(740, 1090, 892, 1322));
      LM_PEOPLE.push([[760, 1310, 880, 1310], 10], [[816, 1300, 816, 1224], 6]);
      LM_ACH.push(['hachitama', '🔮 球体のてっぺん', 'フジテレビの球体展望室の上に立つ', () => P.y > 116 && Math.hypot(P.x - 816, P.z - 1136) < 8]);
    }
    // 潮風公園・東京国際クルーズターミナル・テレコムセンター
    fr(655, 1250, 740, 1530, GRASS); for (let k = 0; k < 70; k++) (rnd() < 0.5 ? PINES : ROUND).push([rr(660, 735), rr(1256, 1525), rr(0.9, 1.3)]);
    LM_ZONES.push(rectPoly(650, 1245, 745, 1535));
    addBuilding(655, 1545, 760, 1640, 18, 'terminal', { noRoofBox: true }); pushPrism(white, 'CONC', rectPoly(650, 1540, 765, 1645), 18, 19.2, { solid: false });
    {
      const tel = M('telecom', '#4a6a88', '#8ab0c8', 0.6, 2, 2);
      pushPrism(tel, 'ROOF', rectPoly(960, 1555, 985, 1625), 0, 99); pushPrism(tel, 'ROOF', rectPoly(1035, 1555, 1060, 1625), 0, 99);
      pushPrism(tel, 'ROOF', rectPoly(985, 1555, 1035, 1625), 78, 99); pushPrism('CONC', 'CONC', rectPoly(985, 1555, 1035, 1625), 0, 6);   // 上でつながる門の形
      LM_ZONES.push(rectPoly(950, 1545, 1070, 1640));
    }
    // ===== 東京ビッグサイト (逆三角形を4つ並べた会議棟と、大きな展示棟) =====
    {
      const bs = M('bigsight', '#e4e8ec', '#8a9aa8', 0.5, 3, 3), H = chunkAt(1700, 950), T = bucket(H, bs), C = bucket(H, 'ROOF');
      pushPrism('glass', 'ROOF', rectPoly(1650, 900, 1750, 1000), 0, 10);
      for (const [cx, cz] of [[1670, 920], [1730, 920], [1670, 980], [1730, 980]]) {
        mesh(new THREE.CylinderGeometry(5, 6, 26, 8).translate(0, 13, 0), WALL.CONC, cx, 0, cz); polySolid(regularPoly(cx, cz, 5.5, 8), 0, 26);
        const b0 = 6, b1 = 30, y0 = 26, y1 = 58, c = (dx, dz, b, y) => [cx + dx * b, y, cz + dz * b];
        for (const [ax, az, bx, bz] of [[-1, -1, 1, -1], [1, -1, 1, 1], [1, 1, -1, 1], [-1, 1, -1, -1]]) pushFace(T, [c(ax, az, b0, y0), c(bx, bz, b0, y0), c(bx, bz, b1, y1), c(ax, az, b1, y1)], [(ax + bx) / 2, -0.3, (az + bz) / 2], 6);
        pushFace(C, [c(-1, -1, b1, y1), c(1, -1, b1, y1), c(1, 1, b1, y1), c(-1, 1, b1, y1)], [0, 1, 0]);
        for (const [ya, yb, h] of [[26, 36, 12], [36, 47, 20], [47, 58, 28]]) polySolid(rectPoly(cx - h, cz - h, cx + h, cz + h), ya, yb);
      }
      const hall = LM_MAT('hall', (x, y) => { x.fillStyle = '#ecebe6'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); x.fillStyle = '#9aa8b4'; x.fillRect(0, 26, 32, 4); y.fillStyle = '#fff0c8'; y.fillRect(0, 27, 32, 2); x.fillStyle = '#d8d8d2'; for (let i = 0; i < 32; i += 8) x.fillRect(i, 0, 1, 26); });
      gableBuilding([1260, 780, 1460, 1000], 22, 8, hall, 'RF0'); gableBuilding([1780, 700, 1890, 1150], 24, 8, hall, 'RF0');
      tiles(1600, 860, 1800, 1050, '#c4bcae', '#b0a898', 4);
      LM_ZONES.push(rectPoly(1250, 690, 1900, 1060));
      LM_PEOPLE.push([[1440, 1060, 1700, 1040], 14], [[1600, 1000, 1780, 1000], 8]);
    }

    // ===== 名所の名前・地図・うんちく =====
    SPOT_AREAS.push(['自由の女神像 (お台場)', 720, 893, 750, 915], ['お台場海浜公園 (砂浜)', 700, 840, 1100, 880], ['お台場海浜公園', 700, 880, 1100, 940],
      ['第三台場 (台場公園)', 540, 780, 620, 860], ['第三台場への砂州', 620, 826, 700, 844], ['お台場のウッドデッキ', 700, 938, 850, 967],
      ['フジテレビ 球体展望室', 798, 1118, 834, 1154], ['フジテレビ本社ビル', 744, 1090, 892, 1322], ['潮風公園', 655, 1250, 740, 1530],
      ['東京国際クルーズターミナル', 650, 1540, 765, 1645], ['テレコムセンター', 950, 1545, 1070, 1640], ['東京ビッグサイト', 1600, 860, 1800, 1060], ['東京ビッグサイト 展示棟', 1250, 690, 1900, 1160],
      ['レインボーブリッジ (ループ橋)', ...polyBB(regularPoly(LC[0], LC[1], LR + 12, 16))], ['レインボーブリッジ', XL - 300, Z0 - 2, RE, Z1 + 2]);
    LM_LABELS.push(['レインボーブリッジ', 295, 920, '🌉'], ['ループ橋', LC[0], LC[1], '🌀', 'レインボーブリッジ (ループ橋)'], ['自由の女神像', 735, 916, '🗽', '自由の女神像 (お台場)'],
      ['お台場海浜公園', 900, 868, '🏖', 'お台場海浜公園 (砂浜)'], ['台場公園', 580, 820, '🏯', '第三台場 (台場公園)'], ['フジテレビ', 816, 1160, '🔮', 'フジテレビ本社ビル'],
      ['潮風公園', 697, 1390, '🌳'], ['クルーズターミナル', 707, 1592, '🛳', '東京国際クルーズターミナル'], ['テレコムセンター', 1010, 1590, '📡'], ['ビッグサイト', 1700, 950, '🔻', '東京ビッグサイト']);
    Object.assign(LM_NOTES, {
      'レインボーブリッジ': '1993年完成の吊り橋。主塔の高さ126m。道路とゆりかもめが並んで渡り、歩いても渡れる',
      'レインボーブリッジ (ループ橋)': '芝浦側では道路もゆりかもめも、ぐるりと1周しながら橋の高さまで上がっていく',
      'お台場海浜公園 (砂浜)': '人工の砂浜。正面にレインボーブリッジと都心のビル群。波打ちぎわまで歩いて行ける',
      'お台場海浜公園': '浜辺の遊歩道。夜はレインボーブリッジのライトアップがきれい',
      '自由の女神像 (お台場)': '1998年に本家フランスの像がやって来たのがきっかけで、2000年に複製が建てられた',
      '第三台場 (台場公園)': '1853年のペリー来航のあと、江戸を守るために築かれた砲台の跡。「お台場」の名の由来',
      'お台場のウッドデッキ': '海を見下ろす2階の木のデッキ。ここからの夜景は定番の眺め',
      'フジテレビ本社ビル': '1997年に新宿区河田町から移転。丹下健三の設計で、2つの棟を空中の格子でつないでいる',
      'フジテレビ 球体展望室': '直径32mの球体。壁を登れば、球体のてっぺんにも立てる',
      'テレコムセンター': '高さ約100m。2つの塔を上でつないだ、門のような形のビル',
      '東京国際クルーズターミナル': '2020年に開業した大型客船のターミナル',
      '東京ビッグサイト': '1996年開館。逆三角形を4つ並べた会議棟が目印の、日本最大級の展示場',
      '潮風公園': 'お台場の西の海辺に広がる公園。対岸に品川の街が見える',
    });
    LM_ACH.push(['liberty', '🗽 女神とブリッジ', 'お台場の自由の女神像のそばで、夜 (19〜4時) のレインボーブリッジを眺める', () => (gameH >= 19 || gameH < 4) && Math.hypot(P.x - 735, P.z - 902) < 25],
      ['beach', '🏖 波打ちぎわ', 'お台場海浜公園の砂浜で、波打ちぎわまで歩く', () => inR([700, 840, 1100, 852], P.x, P.z) && P.y < 0]);
    LM_CATS.push([600, 812, 0], [1700, 950, 58]);
  },
});
