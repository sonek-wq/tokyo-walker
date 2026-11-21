/* 両国 (隅田川の東。相撲と江戸の町)
   両国国技館 (緑の大屋根。本場所の月はのぼりと櫓) / 江戸東京博物館 (高床の倉庫の形。2026年3月にリニューアル) / 旧安田庭園 /
   両国駅 (1929年の旧駅舎) と総武線の高架・隅田川橋梁 (黄色い電車が走る) / 回向院 (鼠小僧の墓・力塚) / 吉良邸跡 / お相撲さんが歩く町
   座標は浅草と同じ縮め方。隅田川の東岸は x ≒ 1050 (両国橋) 〜 1170 (安田庭園) */
REGION({
  name: '両国',
  towns: [['横網', 1260, -2700], ['両国三丁目', 1300, -2420], ['亀沢', 1480, -2660]],
  labels: [],
  build(r) {
    const M = (key, bg, win, lit, cw = 2, cs = 3, rh = 3, rs = 4) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rs) for (let i = 1; i < 32; i += cs) { x.fillStyle = win; x.fillRect(i, j, cw, rh); y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, j, cw, rh); }
    });
    const water = (cx, cz, rx, rz) => { PONDS.push([cx, cz, rx, rz]); fe(cx, cz, rx, rz, '#2d6585'); };
    const RZ = [1100, -2768, 1432, -2408], RAIL = [850, -2576, 1432, -2560], RY = 8;
    LM_ZONES.push(rectPoly(...RZ), rectPoly(...RAIL));
    fr(1100, -2768, 1432, -2408, '#a29c92');
    const KOKU = M('RG_KOKU', '#c8b898', '#5a4a3a', 0.3, 2, 6, 2, 8), EDO = M('RG_EDO', '#7a7c80', '#3a3e44', 0.3, 1, 4, 1, 6), STA = M('RG_STA', '#e8dcc0', '#4a3a2a', 0.6, 2, 5, 4, 8);
    const OFF = M('RG_OFF', '#b8b4ac', '#3e4852', 0.5, 2, 3, 2, 3), GREEN = lam({ color: 0x5a8a6e }), SHU = lam({ color: 0xc4321c });
    // ---- 道路
    addRoads([[1052, -2462, 1432, -2446, 'ew', '京葉道路'], [1414, -2768, 1432, -2462, 'ns', '清澄通り']]);
    tiles(1100, -2446, 1414, -2440, '#c8c0b0', '#b6ae9e', 2); tiles(1100, -2468, 1414, -2462, '#c8c0b0', '#b6ae9e', 2);
    for (let x = 1060; x < 1410; x += 12) LM_STREET.push([x, -2465, 1.1], [x + 6, -2443, 1.1]);
    LM_PEOPLE.push([[1056, -2465, 1410, -2465], 14], [[1410, -2443, 1060, -2443], 12]);

    // ===== 総武線の高架と隅田川橋梁、両国駅 (1929年の旧駅舎) =====
    {
      const cz = (RAIL[1] + RAIL[3]) / 2, bank = [945, 1070];   // 隅田川の両岸
      for (const [x0, x1] of [[RAIL[0], bank[0]], [bank[1], RAIL[2]]]) { pushPrism('CONC', 'CONC', rectPoly(x0, RAIL[1], x1, RAIL[3]), RY - 1.4, RY); for (let x = x0 + 8; x < x1; x += 16) pushPrism('CONC', null, rectPoly(x - 1.2, cz - 5, x + 1.2, cz + 5), 0, RY - 1.4); }
      // 鉄橋 (トラス)。斜めの部材は1つの形にまとめる
      if (!WALL.RG_TRUSS) WALL.RG_TRUSS = lam({ color: 0x5a6a7a });
      pushPrism('RG_TRUSS', 'CONC', rectPoly(bank[0], RAIL[1], bank[1], RAIL[3]), RY - 1.2, RY);
      const diag = [];
      for (const z of [RAIL[1] + 0.3, RAIL[3] - 0.3]) {
        pushPrism('RG_TRUSS', 'RG_TRUSS', rectPoly(bank[0], z - 0.25, bank[1], z + 0.25), RY + 5.8, RY + 6.3, { solid: false });
        for (let x = bank[0]; x < bank[1]; x += 10) { pushPrism('RG_TRUSS', 'RG_TRUSS', rectPoly(x - 0.2, z - 0.2, x + 0.2, z + 0.2), RY, RY + 6, { solid: false }); diag.push(new THREE.BoxGeometry(0.4, 7.5, 0.4).rotateZ((Math.floor((x - bank[0]) / 10) % 2 ? 1 : -1) * 0.6).translate(x + 5, RY + 3, z).toNonIndexed()); }
      }
      { const g = new THREE.BufferGeometry(), at = { position: [], normal: [], uv: [] }; for (const q of diag) for (const k in at) at[k].push(...q.attributes[k].array); for (const k in at) g.setAttribute(k, new THREE.Float32BufferAttribute(at[k], k === 'uv' ? 2 : 3)); scene.add(new THREE.Mesh(g, WALL.RG_TRUSS)); }
      for (const x of [990, 1025]) pushPrism('CONC', null, rectPoly(x - 2, cz - 6, x + 2, cz + 6), -3.2, RY - 1.2);
      for (const x of [RAIL[0], RAIL[2] - 2]) pushPrism('CONC', 'CONC', rectPoly(x, RAIL[1], x + 2, RAIL[3]), RY, RY + 3);   // 端 (この先は作っていない)
      // ホームと屋根
      pushPrism('CONC', 'CONC', rectPoly(1180, RAIL[1] - 6, 1300, RAIL[1]), RY - 1.4, RY + 0.9);
      pushPrism('CONC', 'ROOF', rectPoly(1184, RAIL[1] - 5, 1296, RAIL[1] + 3), RY + 4.2, RY + 4.6, { solid: false });
      for (let x = 1188; x < 1296; x += 12) pushPrism('CONC', null, rectPoly(x - 0.2, RAIL[1] - 3.2, x + 0.2, RAIL[1] - 2.8), RY + 0.9, RY + 4.2, { solid: false });
      // 黄色い電車 (総武線各駅停車) が両国駅に止まりながら行き来する
      const yl = lam({ color: 0xf0c020 }), gr = lam({ color: 0xc8ccd0 }), win = lam({ color: 0x2a3440 }), TR = new THREE.Group(); scene.add(TR);
      for (let i = 0; i < 4; i++) { const g = new THREE.Group(); g.position.x = i * 20.5; TR.add(g); box(20, 3.2, 2.9, gr, 0, 1.9, 0, g); box(20.05, 0.5, 2.95, yl, 0, 2.6, 0, g); box(19, 0.9, 2.95, win, 0, 2.2, 0, g); }
      const L0 = RAIL[0] + 6, L1 = RAIL[2] - 90, STOP = 1196;
      let tx = L0, dir = 1, wait = 0;
      LM_UPDATERS.push(dt => { if (wait > 0) { wait -= dt; } else { const prev = tx; tx += dir * 9 * dt; if ((prev - STOP) * (tx - STOP) <= 0 && Math.abs(prev - tx) < 5) { tx = STOP; wait = 12; } if (tx > L1) { tx = L1; dir = -1; wait = 4; } if (tx < L0) { tx = L0; dir = 1; wait = 4; } } TR.position.set(tx, RY, cz - 4); });
      // 旧駅舎 (いまは飲食店街「両国 江戸NOREN」)
      const S = [1180, -2600, 1238, -2580];
      pushPrism(STA, 'ROOF', rectPoly(...S), 0, 11); oHip(AXIS, 'RF1', ...S, 11, 3.2, { over: 0.8 });
      pushPrism(STA, 'ROOF', rectPoly(1200, -2606, 1218, -2600), 0, 13); oHip(AXIS, 'RF1', 1200, -2606, 1218, -2600, 13, 2.4, { over: 0.6 });
      const ck = tex(64, 64, g => { g.fillStyle = '#f4f0e2'; g.beginPath(); g.arc(32, 32, 28, 0, 7); g.fill(); g.strokeStyle = '#222'; g.lineWidth = 4; g.beginPath(); g.moveTo(32, 32); g.lineTo(32, 12); g.moveTo(32, 32); g.lineTo(44, 40); g.stroke(); });
      mesh(new THREE.CircleGeometry(1.6, 16), glow(lam({ map: ck }), 0xfff0d0, 0.6), 1209, 11.2, -2606.05, Math.PI);
      const sg = glow(lam({ map: textTex('両国駅', '#1a5a2a', '#ffffff', 128, 30) }), 0xffffff, 0.7); mesh(new THREE.PlaneGeometry(6, 1.4), sg, 1209, 8.6, -2606.05, Math.PI);
      tiles(1110, -2640, 1270, -2600, '#c8c0b0', '#b6ae9e', 3);
      LM_PEOPLE.push([[1209, -2604, 1209, -2640], 12], [[1120, -2620, 1265, -2620], 12]);
    }
    // ===== 両国国技館 (1985年完成。緑の大屋根) =====
    const KG = [1172, -2700, 1266, -2648];
    {
      pushPrism(KOKU, 'ROOF', rectPoly(...KG), 0, 16);
      oHip(AXIS, 'RF_COPPER', ...KG, 16, 16, { over: 2 });
      oHip(AXIS, 'RF_COPPER', KG[0] + 30, KG[1] + 14, KG[2] - 30, KG[3] - 14, 30, 9, { over: 1 });
      mesh(new THREE.SphereGeometry(1.2, 8, 6), lam({ color: 0xd8a830, emissive: 0x3a2a00 }), (KG[0] + KG[2]) / 2, 40, (KG[1] + KG[3]) / 2);
      // 正面入口 (駅の側) の門
      pushPrism(KOKU, 'RF_COPPER', rectPoly(1205, -2648, 1233, -2640), 0, 7); jRoof('RF_COPPER', 1203, -2650, 1235, -2638, 7, 3, { over: 1.2 });
      const ks = glow(lam({ map: textTex('國技館', '#f4efe2', '#2a2a2a', 128, 30) }), 0xffffff, 0.5); mesh(new THREE.PlaneGeometry(7, 1.6), ks, 1219, 5.6, -2639.9);
      // 本場所 (1月・5月・9月) の月は、のぼりと櫓
      if ([1, 5, 9].includes(MONTH)) {
        const cols = [0xc82a2a, 0x2a5aa8, 0xe8c030, 0x2a8a4a, 0xf0ece0, 0x8a3aa0];
        cols.forEach((c, i) => { if (!WALL['RG_NOBORI' + i]) WALL['RG_NOBORI' + i] = lam({ color: c }); });
        for (let x = 1112; x < 1268; x += 4.5) for (const z of [-2636, -2626]) { pushPrism('BRONZE', null, rectPoly(x - 0.06, z - 0.06, x + 0.06, z + 0.06), 0, 6, { solid: false }); const k = 'RG_NOBORI' + Math.floor(rnd() * cols.length); pushPrism(k, k, rectPoly(x + 0.06, z - 0.03, x + 0.96, z + 0.03), 1.5, 5.7, { solid: false }); }
        const Y = [1250, -2632]; for (const [dx, dz] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) mesh(new THREE.CylinderGeometry(0.2, 0.25, 16, 6), WALL.WOOD, Y[0] + dx, 8, Y[1] + dz);
        pushPrism('WOOD', 'WOOD', rectPoly(Y[0] - 2, Y[1] - 2, Y[0] + 2, Y[1] + 2), 15, 17.5); mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.4, 10).rotateZ(Math.PI / 2), lam({ color: 0xa8682a }), Y[0], 16.6, Y[1]);
      }
    }
    // ===== 江戸東京博物館 (4本の脚で持ち上げた、高床の倉庫の形) =====
    const EB = [1290, -2700, 1406, -2600];
    {
      tiles(EB[0] - 6, EB[1] - 4, EB[2] + 6, EB[3] + 16, '#c0b8a8', '#b0a898', 4);
      pushPrism('CONC', 'TKSTONE', rectPoly(EB[0], EB[1], EB[2], EB[3]), 0, 12);   // 3階の「江戸東京ひろば」の高さまで
      stairs([1300, -2600, 1330, -2580], 12, 'z-');                                 // ひろばへの大階段
      for (const [x, z] of [[1312, -2682], [1384, -2682], [1312, -2618], [1384, -2618]]) pushPrism(EDO, 'CONC', rectPoly(x - 7, z - 7, x + 7, z + 7), 12, 30);
      pushPrism(EDO, 'ROOF', rectPoly(1296, -2694, 1400, -2606), 30, 52);
      pushPrism(EDO, 'ROOF', rectPoly(1292, -2698, 1404, -2602), 52, 58);
      oHip(AXIS, 'RF0', 1294, -2696, 1402, -2604, 58, 4.2, { over: 1 });
      mesh(new THREE.BoxGeometry(4, 0.6, 46).rotateX(-0.52), lam({ color: 0xc8322a }), 1348, 20.5, -2650);   // 赤いエスカレーター (ひろばから上の展示室へ)
      const es = glow(lam({ map: textTex('江戸東京博物館', '#f0ece2', '#2a2a2a', 160, 26) }), 0xffffff, 0.5); mesh(new THREE.PlaneGeometry(14, 2.2), es, 1348, 9, -2599.9);
    }
    // ===== 旧安田庭園 (隅田川の水を引いた「潮入り回遊式庭園」だった) =====
    const YS = [1206, -2765, 1278, -2708];
    {
      fr(...YS, '#6f9a4e'); water(1242, -2738, 24, 14); POND_LAND.push(['e', 1244, -2740, 6, 4], ['r', 1228, -2742, 1238, -2738]);
      tiles(1228, -2742, 1238, -2738, '#b8ae98', '#a89e88', 1);
      for (const [x, z] of [[1216, -2722], [1270, -2725], [1222, -2756], [1262, -2758]]) LANTERNS.push([x, z]);
      for (let k = 0; k < 40; k++) { const a = rr(0, 6.28), x = 1242 + Math.cos(a) * rr(28, 36), z = -2738 + Math.sin(a) * rr(18, 26); if (inR(YS, x, z, -2)) (rnd() < 0.5 ? PINES : rnd() < 0.5 ? MAPLES : ROUND).push([x, z, rr(0.9, 1.2)]); }
    }
    // ===== 回向院 (江戸の勧進相撲の地。鼠小僧の墓と力塚) =====
    const EK = [1108, -2548, 1168, -2474];
    {
      fr(...EK, '#c0b8a6');
      pushPrism(M('RG_EKO', '#d8d2c4', '#3a3632', 0.3, 2, 6, 3, 8), 'ROOF', rectPoly(1118, -2540, 1158, -2512), 0, 12); jRoof('RF2', 1116, -2542, 1160, -2510, 12, 5, { over: 1.4 });
      pushPrism('WOOD', 'ROOF', rectPoly(1130, -2478, 1146, -2472), 0, 5); jRoof('RF2', 1128, -2480, 1148, -2470, 5, 2.2, { over: 1 });   // 山門
      const st = lam({ color: 0x8a8680 });
      mesh(new THREE.BoxGeometry(2.2, 3.4, 0.7), st, 1114, 1.7, -2500); solid(1113, -2500.4, 1115, -2499.6, 0, 3.4);           // 力塚
      mesh(new THREE.BoxGeometry(1.0, 1.8, 0.6), st, 1162, 0.9, -2500); mesh(new THREE.BoxGeometry(0.6, 0.7, 0.5), lam({ color: 0xd8d4cc }), 1162, 0.35, -2498.6);   // 鼠小僧の墓と「お前立ち」の白い石
    }
    // ===== 吉良邸跡 (本所松坂町公園。なまこ壁) =====
    const KR = [1328, -2440, 1354, -2416];
    {
      const nm = LM_MAT('RG_NAMAKO', (x, y) => { x.fillStyle = '#e8e4dc'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let i = 0; i < 32; i += 4) for (let j = 16; j < 32; j += 4) { x.fillStyle = '#3a3a3e'; x.fillRect(i + ((j / 4) % 2 ? 2 : 0), j, 2, 2); } x.fillStyle = '#3a3a3e'; x.fillRect(0, 0, 32, 3); });
      for (const r of [[KR[0], KR[1], KR[2], KR[1] + 0.6], [KR[0], KR[3] - 0.6, 1338, KR[3]], [1344, KR[3] - 0.6, KR[2], KR[3]], [KR[0], KR[1], KR[0] + 0.6, KR[3]], [KR[2] - 0.6, KR[1], KR[2], KR[3]]]) pushPrism(nm, 'RF2', rectPoly(...r), 0, 3);
      fr(...KR, '#c8bea8'); pushPrism('WOOD', 'ROOF', rectPoly(1340, -2436, 1346, -2430), 0, 2.6); jRoof('RF2', 1339, -2437, 1347, -2429, 2.6, 1.4, { over: 0.6 });
    }
    // ===== 残りの街区 =====
    const RES = [EK, KR, [1172, -2604, 1270, -2575], [1100, -2470, 1432, -2440], [1242, -2604, 1258, -2462]];
    tiles(1244, -2556, 1256, -2468, '#c8c0b0', '#b6ae9e', 2);
    mixed([1176, -2556, 1410, -2472], RES); mixed([1060, -2438, 1410, -2410], RES); mixed([1284, -2768, 1410, -2708], RES);
    for (let x = 1275; x < 1410; x += 10) ROUND.push([x, -2591, 1.1]);
    // ===== お相撲さん (浴衣で町を歩く) =====
    {
      const RK = [], cols = [0x3a5a8a, 0xe8e0c8, 0x6a3a5a, 0x2a6a5a, 0xa85a3a], skin = lam({ color: 0xe0b090 }), hair = lam({ color: 0x1a1a1a });
      const routes = [[[1120, -2620], [1265, -2620]], [[1250, -2600], [1250, -2470]], [[1070, -2443], [1400, -2443]], [[1275, -2595], [1400, -2595]], [[1180, -2465], [1400, -2465]]];
      routes.forEach(([a, b], i) => {
        const g = new THREE.Group(), m = lam({ color: cols[i % cols.length] }); scene.add(g);
        box(1.3, 1.5, 1.0, m, 0, 1.05, 0, g); box(1.5, 0.9, 1.3, m, 0, 2.05, 0, g); box(0.62, 0.62, 0.6, skin, 0, 2.85, 0, g); box(0.3, 0.3, 0.45, hair, 0, 3.25, -0.12, g);   // 体・頭・まげ
        box(0.5, 0.35, 0.5, lam({ color: 0x6a4a2a }), -0.35, 0.18, 0, g); box(0.5, 0.35, 0.5, lam({ color: 0x6a4a2a }), 0.35, 0.18, 0, g);
        RK.push({ g, a, b, t: rnd(), v: 0.9 / Math.hypot(b[0] - a[0], b[1] - a[1]), d: 1 });
      });
      let met = false;
      LM_UPDATERS.push(dt => { for (const k of RK) { k.t += k.d * k.v * dt; if (k.t > 1) { k.t = 1; k.d = -1; } if (k.t < 0) { k.t = 0; k.d = 1; } const x = k.a[0] + (k.b[0] - k.a[0]) * k.t, z = k.a[1] + (k.b[1] - k.a[1]) * k.t; k.g.position.set(x, Math.abs(Math.sin(k.t * 80)) * 0.05, z); k.g.rotation.y = Math.atan2((k.b[0] - k.a[0]) * k.d, (k.b[1] - k.a[1]) * k.d); if (!met && Math.hypot(P.x - x, P.z - z) < 3 && P.y < 2) met = true; } });
      LM_ACH.push(['rikishi', '🍲 両国でお相撲さんに会う', '両国の町を歩くお相撲さんのそばまで行く', () => met]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['両国国技館', KG[0] - 4, KG[1] - 4, KG[2] + 4, -2626], ['江戸東京博物館', EB[0] - 6, EB[1] - 4, EB[2] + 6, EB[3] + 16], ['旧安田庭園', ...YS], ['両国駅', 1176, -2612, 1242, -2576],
      ['総武線 隅田川橋梁', 945, -2580, 1070, -2556], ['回向院', ...EK], ['吉良邸跡 (本所松坂町公園)', ...KR], ['両国駅前', 1110, -2640, 1270, -2600]);
    LM_HEIGHT_AREAS.push(['江戸東京ひろば (江戸東京博物館 3階)', (x, z, y) => y > 11 && y < 14 && inR(EB, x, z)], ['総武線の高架', (x, z, y) => y > RY - 1 && y < RY + 3 && inR(RAIL, x, z)]);
    LM_LABELS.push(['国技館', 1219, -2674, '🏟', '両国国技館'], ['江戸博', 1348, -2650, '🏯', '江戸東京博物館'], ['安田庭園', 1242, -2738, '🌳', '旧安田庭園'], ['両国駅', 1209, -2590, '🚉'], ['回向院', 1138, -2526, '🙏'], ['吉良邸跡', 1341, -2428, '⚔', '吉良邸跡 (本所松坂町公園)']);
    Object.assign(LM_NOTES, {
      '両国国技館': '1985年完成の2代目の両国国技館。大相撲の東京場所は年3回 (1月・5月・9月)',
      '江戸東京博物館': '高床式の倉庫をイメージした建物。高さ62.2mは、江戸城の天守閣とほぼ同じ',
      '江戸東京ひろば (江戸東京博物館 3階)': '約4年の改修を終え、2026年3月31日にリニューアルオープン。銀座の服部時計店を原寸大で再現した展示も',
      '旧安田庭園': '隅田川の水を引き、潮の満ち引きで池の景色が変わる「潮入り回遊式庭園」だった',
      '両国駅': '1929年完成の駅舎。いまは江戸の味を楽しめる飲食店街「両国 江戸NOREN」になっている',
      '総武線の高架': '両国駅の3番線は、かつて房総方面への列車が発着した「幻のホーム」。いまはイベントで使われる',
      '両国橋': '武蔵国と下総国、2つの国を結んだので「両国橋」。町の名もここから',
      '回向院': '江戸時代に境内で勧進相撲が開かれ、1909年には最初の国技館がここに建てられた',
      '吉良邸跡 (本所松坂町公園)': '1702年、赤穂浪士が討ち入った吉良上野介の屋敷の跡。公園の広さは屋敷の86分の1ほど',
    });
    Object.assign(LM_TIPS, {
      '両国国技館': '国技館1階の相撲博物館は入館無料 (10:00〜16:30、土日祝休み)。本場所中は大相撲の観覧券が必要',
      '江戸東京博物館': '常設展の観覧料は一般800円',
      '両国駅前': '両国はちゃんこ鍋のお店が多い町。相撲部屋も近くにあり、浴衣姿のお相撲さんに出会うことも',
      '回向院': '鼠小僧の墓の前の白い石「お前立ち」を削って持ち帰ると、運がつくといわれる',
    });
    const seen = new Set();
    LM_UPDATERS.push(() => { if (inR([KG[0] - 4, KG[1] - 4, KG[2] + 4, -2626], P.x, P.z)) seen.add('k'); if (inR(EB, P.x, P.z)) seen.add('e'); if (inR(EK, P.x, P.z)) seen.add('o'); });
    LM_ACH.push(['ryogoku', '🏟 両国さんぽ', '国技館・江戸東京博物館・回向院をすべて訪ねる', () => seen.size === 3]);
  },
});
