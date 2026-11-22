/* JY19 原宿駅 (原宿)
   西側 (線路の外): 明治神宮 (代々木の杜・南参道・北参道・大鳥居・酒樽とワイン樽・南神門・回廊・拝殿・夫婦楠・御苑と清正井) /
     国立代々木競技場 (吊り屋根) / 代々木公園
   東側 (線路の内): 竹下通り / 表参道 (ケヤキ並木) と神宮前交差点 / ラフォーレ原宿 / 表参道ヒルズ / 明治通り
   線路はほぼ南北 (x ≒ -2909)。駅舎は線路の西側 */
STATION({
  no: 19, name: '原宿', kana: 'はらじゅく', roma: 'Harajuku', town: '原宿',
  lat: 35.6702, lon: 139.7027, build(st) {
    const C = (key, color, emi, k = 0) => { if (!WALL[key]) { WALL[key] = lam(emi ? { color, emissive: emi, emissiveIntensity: 0 } : { color }); if (k) GLOW.push([WALL[key], k]); } return key; };
    const HINOKI = C('MJ_HINOKI', 0xb08a62), STONE = C('MJ_STONE', 0xb0a898), DARK = C('MJ_DARK', 0x4a3a2c), COPPER = 'RF_COPPER';
    const toriiM = lam({ color: 0x8a6e52 });
    const M = (key, bg, win, lit, step = 3, rows = 3) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rows) for (let i = 1; i < 32; i += step) { x.fillStyle = win; x.fillRect(i, j, step - 1, rows - 1); y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, j, step - 1, rows - 1); }
    });
    const GRAVEL = '#cfc6b0', inRs = (rs, x, z, m = 0) => rs.some(r => inR(r, x, z, m));

    // ===== 明治神宮: 代々木の杜 (約10万本の献木で造られた人工の森) =====
    const FOREST = [-3420, -1792, -2990, -1108];
    LM_ZONES.push(rectPoly(...FOREST)); fr(...FOREST, '#3d5a2e');
    const SANDO_S = [-3017, -1404, -3003, -1112], SANDO_N = [-3016, -1792, -3004, -1386], SANDO_M = [-3109, -1404, -3003, -1386], SANDO_L = [-3109, -1428, -3091, -1386];
    const ENT = [-3003, -1132, -2984, -1112], COURT = [-3152, -1506, -3048, -1424], HONDEN = [-3122, -1540, -3078, -1508], GYOEN = [-3135, -1350, -3028, -1240];
    for (const r of [SANDO_S, SANDO_N, SANDO_M, SANDO_L, ENT]) fr(...r, GRAVEL);
    for (const r of [SANDO_S, SANDO_N]) { fr(r[0] - 1.5, r[1], r[0], r[3], '#8a7e66'); fr(r[2], r[1], r[2] + 1.5, r[3], '#8a7e66'); }   // 参道脇の溝
    // 鳥居: 一の鳥居 (南参道)・大鳥居 (高さ12m・幅17.1m、木造の明神鳥居で日本一)・三の鳥居・北参道
    myojinTorii(-3010, -1124, true, 11, 9.6, toriiM, 0.55);
    myojinTorii(-3034, -1395, false, 12, 10, toriiM, 0.6);
    myojinTorii(-3100, -1415, true, 8.5, 8, toriiM, 0.45);
    myojinTorii(-3010, -1782, true, 9, 8.4, toriiM, 0.5);
    // 酒樽 (全国の酒蔵から奉納) とワイン樽 (フランス・ブルゴーニュから奉納)
    {
      const barrels = (bg, ring, label) => { const t = tex(64, 32, g => { g.fillStyle = '#3a2a1e'; g.fillRect(0, 0, 64, 32); for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++) { const cx = i * 16 + 8, cy = j * 16 + 8; g.fillStyle = bg; g.beginPath(); g.arc(cx, cy, 7.3, 0, 7); g.fill(); g.strokeStyle = ring; g.lineWidth = 1.2; g.beginPath(); g.arc(cx, cy, 6.6, 0, 7); g.stroke(); if (label) { g.fillStyle = pick(label); g.fillRect(cx - 2, cy - 4, 4, 8); } } }); return t; };
      const sakeT = barrels('#f2ede0', '#c8a868', ['#c8302a', '#2a4a9a', '#2a2a2a', '#3a7a3a', '#c88a20']), wineT = barrels('#8a5a34', '#4a4a50', null);
      sakeT.repeat.set(30 / 3.4, 2); wineT.repeat.set(24 / 3.4, 1);
      const wood = WALL.WOOD, sm = lam({ map: sakeT }), wm = lam({ map: wineT });
      mesh(new THREE.BoxGeometry(1.6, 3.4, 30), [wood, sm, wood, wood, wood, wood], -2999.2, 1.9, -1370); solid(-3000, -1385, -2998.4, -1355, 0, 3.6);
      mesh(new THREE.BoxGeometry(1.8, 0.3, 31), WALL.ROOF, -2999.2, 3.75, -1370);
      mesh(new THREE.BoxGeometry(1.6, 1.7, 24), [wm, wood, wood, wood, wood, wood], -3020.8, 1.05, -1367); solid(-3021.6, -1379, -3020, -1355, 0, 1.9);
      mesh(new THREE.BoxGeometry(1.6, 0.2, 24), wood, -3020.8, 0.1, -1367);
    }
    // 南神門・回廊・拝殿・本殿 (檜の素木に銅板葺きの屋根)
    {
      const [X0, Z0, X1, Z1] = COURT, W = 6, gate = (cx, cz, alongX) => {   // 門: 両脇の部屋と、上に屋根
        const r = alongX ? [cx - 12, cz - 5, cx + 12, cz + 5] : [cx - 5, cz - 12, cx + 5, cz + 12];
        if (alongX) { pushPrism(HINOKI, null, rectPoly(cx - 12, cz - 4, cx - 4, cz + 4), 0, 6.5); pushPrism(HINOKI, null, rectPoly(cx + 4, cz - 4, cx + 12, cz + 4), 0, 6.5); }
        else { pushPrism(HINOKI, null, rectPoly(cx - 4, cz - 12, cx + 4, cz - 4), 0, 6.5); pushPrism(HINOKI, null, rectPoly(cx - 4, cz + 4, cx + 4, cz + 12), 0, 6.5); }
        pushPrism(HINOKI, 'ROOF', rectPoly(...r), 5.5, 6.8); jRoof(COPPER, ...r, 6.8, 4.2, { over: 1.8, gable: HINOKI });
      };
      // 回廊 (門のところは切れている)
      const wall = (x0, z0, x1, z1) => { pushPrism(HINOKI, 'ROOF', rectPoly(x0, z0, x1, z1), 0, 4.2); jRoof(COPPER, x0, z0, x1, z1, 4.2, 2.2, { kind: 'hip', over: 1.0 }); };
      const cxm = (X0 + X1) / 2, czm = (Z0 + Z1) / 2;
      wall(X0, Z1 - W, cxm - 12, Z1); wall(cxm + 12, Z1 - W, X1, Z1);                 // 南
      wall(X0, Z0, X1, Z0 + W);                                                          // 北 (拝殿の裏)
      wall(X0, Z0 + W, X0 + W, czm - 12); wall(X0, czm + 12, X0 + W, Z1 - W);          // 西
      wall(X1 - W, Z0 + W, X1, czm - 12); wall(X1 - W, czm + 12, X1, Z1 - W);          // 東
      gate(cxm, Z1 - 3, true); gate(X0 + 3, czm, false); gate(X1 - 3, czm, false);
      fr(X0 + W, Z0 + W, X1 - W, Z1 - W, '#e2dccb');
      // 拝殿
      pushPrism(STONE, STONE, rectPoly(cxm - 28, Z0 + W, cxm + 28, Z0 + W + 22), 0, 0.9);
      pushPrism(HINOKI, 'ROOF', rectPoly(cxm - 25, Z0 + W + 2, cxm + 25, Z0 + W + 14), 0.9, 8);
      for (let x = cxm - 25; x <= cxm + 25; x += 5) pushPrism(HINOKI, null, rectPoly(x - 0.35, Z0 + W + 18.6, x + 0.35, Z0 + W + 19.3), 0.9, 7.2);
      pushPrism(HINOKI, 'ROOF', rectPoly(cxm - 25.5, Z0 + W + 14, cxm + 25.5, Z0 + W + 19.5), 6.6, 7.2);
      jRoof(COPPER, cxm - 26, Z0 + W + 1, cxm + 26, Z0 + W + 19.5, 8, 9, { over: 2.8, gable: HINOKI });
      mesh(new THREE.BoxGeometry(8, 1.2, 1.8), WALL.WOOD, cxm, 1.5, Z0 + W + 17); solid(cxm - 4, Z0 + W + 16, cxm + 4, Z0 + W + 18, 0.9, 2.1);   // 賽銭箱
      // 本殿 (拝殿の奥)
      pushPrism(HINOKI, 'ROOF', rectPoly(...HONDEN), 0.9, 7); jRoof(COPPER, ...HONDEN, 7, 7, { over: 2.2, gable: HINOKI });
      pushPrism(STONE, STONE, rectPoly(HONDEN[0] - 4, HONDEN[1] - 4, HONDEN[2] + 4, HONDEN[3]), 0, 0.9);
      // 夫婦楠 (1920年に植えられた2本のクスノキ。注連縄で結ばれている)
      const KUS = [[X0 + 24, Z1 - 20], [X0 + 34, Z1 - 20]];
      for (const [x, z] of KUS) ROUND.push([x, z, 2.5]);
      mesh(new THREE.CylinderGeometry(0.12, 0.12, 10, 5).rotateZ(Math.PI / 2), lam({ color: 0xd8c890 }), X0 + 29, 4.2, Z1 - 20);
      for (const [x, z] of KUS) fr(x - 2.5, z - 2.5, x + 2.5, z + 2.5, '#8a7a5a');
      // 手水舎 (南神門の外)
      const tx = cxm + 22, tz = Z1 + 10; mesh(new THREE.BoxGeometry(4.5, 0.9, 1.8), WALL[STONE], tx, 0.45, tz);
      for (const [dx, dz] of [[-2.8, -1.8], [2.8, -1.8], [-2.8, 1.8], [2.8, 1.8]]) pushPrism(HINOKI, null, rectPoly(tx + dx - 0.2, tz + dz - 0.2, tx + dx + 0.2, tz + dz + 0.2), 0, 3.2, { solid: false });
      jRoof(COPPER, tx - 3, tz - 2, tx + 3, tz + 2, 3.2, 1.8, { over: 0.9, solid: false });
      LM_PEOPLE.push([[cxm, Z1 + 20, cxm, Z0 + W + 22], 14], [[X0 + 8, czm, X1 - 8, czm], 8]);
    }
    // 明治神宮御苑 (清正井・菖蒲田)
    {
      const [X0, Z0, X1, Z1] = GYOEN; fr(X0, Z0, X1, Z1, '#4f7a34');
      for (let x = X0 + 4; x < X1 - 4; x += 6) for (const z of [Z0 + 2, Z1 - 2]) PINES.push([x, z, rr(0.9, 1.2)]);
      const P = [-3080, -1300, 30, 13]; PONDS.push(P);
      DL.push({ bb: [P[0] - P[2], P[1] - P[3], P[0] + P[2], P[1] + P[3]], f: g => { g.fillStyle = '#2d6585'; g.beginPath(); g.ellipse(P[0], P[1], P[2], P[3], 0, 0, 7); g.fill(); } });
      for (let z = Z0 + 6; z < Z0 + 30; z += 4) { fr(-3070, z, -3040, z + 2.5, '#3a6a40'); for (let x = -3068; x < -3042; x += 3) fr(x, z + 0.6, x + 1, z + 1.6, '#7a50b0'); }   // 菖蒲田
      pushPrism(STONE, STONE, rectPoly(-3124, -1258, -3120, -1254), 0, 0.6);   // 清正井
      fr(-3135, -1300, -3017, -1294, GRAVEL);
      SPOT_AREAS.push(['清正井', -3128, -1262, -3116, -1250]);
    }
    // 森の木々 (参道・社殿・御苑のまわりは空ける)
    {
      const CLEAR = [[SANDO_S[0] - 3, SANDO_S[1], SANDO_S[2] + 3, SANDO_S[3]], [SANDO_N[0] - 3, SANDO_N[1], SANDO_N[2] + 3, SANDO_N[3]], [SANDO_M[0], SANDO_M[1] - 3, SANDO_M[2], SANDO_M[3] + 3], SANDO_L,
        [COURT[0] - 4, COURT[1] - 4, COURT[2] + 4, COURT[3] + 14], [HONDEN[0] - 8, HONDEN[1] - 8, HONDEN[2] + 8, HONDEN[3]], GYOEN, [ENT[0] - 6, ENT[1] - 4, -2988, ENT[3] + 6], [-3002, -1388, -2996, -1352], [-3024, -1382, -3017, -1352]];
      for (let k = 0; k < 2600; k++) {
        const x = rr(FOREST[0] + 3, FOREST[2] - 3), z = rr(FOREST[1] + 3, FOREST[3] - 3);
        if (inRs(CLEAR, x, z, 1.5)) continue;
        const q = rnd(); (q < 0.72 ? ROUND : q < 0.9 ? PINES : GINKGO).push([x, z, rr(1.1, 1.7)]);
      }
      for (const r of [SANDO_S, SANDO_N]) for (let z = r[1] + 4; z < r[3] - 4; z += 7) { if (z > -1412 && z < -1346) continue; ROUND.push([r[0] - 4.5, z, rr(1.3, 1.7)]); ROUND.push([r[2] + 4.5, z + 3, rr(1.3, 1.7)]); }
    }
    LM_PEOPLE.push([[-3010, -1120, -3010, -1390], 22], [[-3010, -1392, -3098, -1395], 10], [[-3010, -1400, -3010, -1780], 10]);
    LM_CATS.push([-3150, -1395, 0]);

    // ===== 国立代々木競技場 (丹下健三の吊り屋根) と代々木公園 =====
    {
      const cx = -3060, cz = -990, RX = 58, RZ = 42, H = chunkAt(cx, cz), rt = bucket(H, 'MJ_GYMROOF'), wt = bucket(H, 'CONC');
      if (!WALL.MJ_GYMROOF) WALL.MJ_GYMROOF = lam({ color: 0x8a9098, side: THREE.DoubleSide });
      const N = 24, rim = t => { const x = cx - RX + 2 * RX * t, w = RZ * Math.sqrt(Math.max(0, 1 - ((x - cx) / RX) ** 2)); return [x, w]; }, ridge = t => 40 - 15 * Math.sin(Math.PI * t);
      pushPrism('CONC', 'ROOF', regularPoly(cx, cz, 1, 24).map(([x, z]) => [cx + (x - cx) * RX * 0.97, cz + (z - cz) * RZ * 0.97]), 0, 9);
      for (let i = 0; i < N; i++) {
        const t0 = i / N, t1 = (i + 1) / N, [xa, wa] = rim(t0), [xb, wb] = rim(t1), ya = ridge(t0), yb = ridge(t1);
        for (const s of [-1, 1]) pushFace(rt, [[xa, ya, cz], [xb, yb, cz], [xb, 9 + 4 * Math.abs(xb - cx) / RX, cz + s * wb], [xa, 9 + 4 * Math.abs(xa - cx) / RX, cz + s * wa]], [0, 1, s * 0.3]);
      }
      for (const s of [-1, 1]) { mesh(new THREE.CylinderGeometry(0.9, 1.4, 42, 8), WALL.CONC, cx + s * (RX + 2), 21, cz); solid(cx + s * (RX + 2) - 1.4, cz - 1.4, cx + s * (RX + 2) + 1.4, cz + 1.4, 0, 42); }
      polySolid(regularPoly(cx, cz, 30, 12), 9, 26);
      tiles(cx - RX - 10, cz - RZ - 10, cx + RX + 10, cz + RZ + 10, '#b8b0a0', '#a69e8e', 4);
      LM_ZONES.push(rectPoly(-3135, -1108, -2988, -930));   // 競技場のまわり (駅前に高いビルを建てない)
      for (let k = 0; k < 40; k++) { const x = rr(-3130, -2992), z = rr(-1104, -934); if (!inR([cx - RX - 11, cz - RZ - 11, cx + RX + 11, cz + RZ + 11], x, z) && !inR([-3005, -1080, -2988, -1040], x, z)) ROUND.push([x, z, rr(1, 1.4)]); }
      // 代々木公園 (芝生・噴水・木立)
      const PK = [-3400, -1100, -3135, -780]; LM_ZONES.push(rectPoly(...PK)); fr(...PK, GRASS);
      for (let k = 0; k < 260; k++) { const x = rr(PK[0] + 3, PK[2] - 3), z = rr(PK[1] + 3, PK[3] - 3); if (Math.hypot(x - -3270, z - -940) < 70) continue; (rnd() < 0.7 ? ROUND : GINKGO).push([x, z, rr(1, 1.5)]); }
      const FP = [-3270, -940, 26, 18]; PONDS.push(FP);
      DL.push({ bb: [FP[0] - FP[2], FP[1] - FP[3], FP[0] + FP[2], FP[1] + FP[3]], f: g => { g.fillStyle = '#2d6585'; g.beginPath(); g.ellipse(FP[0], FP[1], FP[2], FP[3], 0, 0, 7); g.fill(); } });
      const jet = mesh(new THREE.CylinderGeometry(0.3, 1.2, 10, 8, 1, true), new THREE.MeshLambertMaterial({ color: 0xe8f4ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }), FP[0], 5, FP[1]);
      LM_UPDATERS.push((dt, t) => { const s = 0.8 + 0.25 * Math.sin(t * 1.7); jet.scale.set(1, s, 1); jet.position.y = 5 * s; });
      fr(PK[0], -945, PK[2], -935, PATH); fr(-3275, PK[1], -3265, PK[3], PATH);
      for (let x = PK[0] + 10; x < PK[2]; x += 24) BENCHES.push([x, -947, 0]);
      LM_PEOPLE.push([[PK[0] + 5, -940, PK[2] - 5, -940], 14], [[-3270, PK[1] + 5, -3270, PK[3] - 5], 8]);
    }

    // ===== 線路の東側: 竹下通り・表参道・明治通り =====
    const E = [-2893, -1262, -2380, -962];
    LM_ZONES.push(rectPoly(...E)); fr(...E, '#9a958c');
    const RR = ringRes(E, 16);
    addRoads([[-2723, -1262, -2703, -962, 'ns', '明治通り (原宿)'], [-2893, -1068, -2380, -1052, 'ew', '表参道']]);
    tiles(E[0], -1078, E[2], -1068, '#c8c0b0', '#b6ae9e', 2); tiles(E[0], -1052, E[2], -1042, '#c8c0b0', '#b6ae9e', 2);
    for (let x = E[0] + 6; x < E[2]; x += 10) if (Math.abs(x - -2713) > 14) LM_STREET.push([x, -1073, 1.2], [x + 5, -1047, 1.2]);   // ケヤキ並木
    // 神宮橋 (表参道から明治神宮の入口へ。線路の下をくぐる)
    tiles(-3003, -1078, E[0], -1042, '#c8c0b0', '#b6ae9e', 2); tiles(-3003, -1112, -2988, -1078, GRAVEL, '#bdb49e', 2);
    // 竹下通り (約350m・約130店。11〜18時は歩行者天国)
    const TK = [-2893, -1184, -2723, -1176];
    {
      const pop = (key, bg, acc) => LM_MAT(key, (x, y) => {
        x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
        for (let j = 2; j < 22; j += 6) for (let i = 1; i < 32; i += 5) { x.fillStyle = '#4a5260'; x.fillRect(i, j, 3, 3); y.fillStyle = rnd() < 0.5 ? pick(LIT) : '#000'; y.fillRect(i, j, 3, 3); }
        x.fillStyle = acc; x.fillRect(0, 22, 32, 3); y.fillStyle = acc; y.fillRect(0, 22, 32, 3);
        for (let i = 0; i < 32; i += 8) { x.fillStyle = pick(['#ffe4f0', '#e0f4ff', '#fff6c8', '#e8ffe8']); x.fillRect(i + 1, 25, 6, 7); y.fillStyle = '#ffe2c8'; y.fillRect(i + 1, 25, 6, 7); }
      });
      const POP = [pop('HJ_POP0', '#f4c8dc', '#e8388a'), pop('HJ_POP1', '#c8e4f4', '#2a9ad8'), pop('HJ_POP2', '#f8f0b8', '#f0a020'), pop('HJ_POP3', '#d8c8f0', '#8a4ad0'), pop('HJ_POP4', '#c8f0d8', '#20b070'), pop('HJ_POP5', '#ffffff', '#ff5a7a')];
      tiles(...TK, '#d8c0c8', '#c8b0b8', 1.5);
      for (const side of [-1, 1]) for (let x = TK[0] + 2; x < TK[2] - 4;) {
        const w = rr(6, 10), d = rr(10, 14), x1 = Math.min(x + w, TK[2] - 2), f = side < 0 ? [x, TK[1] - d, x1, TK[1] - 0.3] : [x, TK[3] + 0.3, x1, TK[3] + d];
        if (okLot(f, RR)) { const h = rr(7, 17); addBuilding(...f, h, pick(POP), { noRoofBox: true }); addSign(f, side < 0 ? 's' : 'n', h); if (rnd() < 0.6) addAwning(f, side < 0 ? 's' : 'n'); }
        x = x1 + 0.3;
      }
      // 入口のアーチ
      const am = lam({ color: 0xe8e0ec }), sgn = glow(lam({ map: textTex('竹下通り TAKESHITA', '#ff5aa0', '#ffffff', 192, 28) }), 0xffffff, 0.9);
      for (const z of [TK[1] - 0.2, TK[3] + 0.2]) { mesh(new THREE.BoxGeometry(0.5, 7, 0.5), am, TK[0] + 3, 3.5, z); solid(TK[0] + 2.75, z - 0.25, TK[0] + 3.25, z + 0.25, 0, 7); }
      const ab = mesh(new THREE.BoxGeometry(0.4, 1.8, 10), [sgn, sgn, am, am, am, am], TK[0] + 3, 7.6, (TK[1] + TK[3]) / 2);
      LM_PEOPLE.push([[TK[0] + 2, TK[1] + 2, TK[2] - 2, TK[1] + 2], 34], [[TK[2] - 2, TK[3] - 2, TK[0] + 2, TK[3] - 2], 34]);
    }
    // ラフォーレ原宿 (神宮前交差点の角。角が丸い) と表参道ヒルズ (同潤会青山アパートの跡地)
    {
      const laf = M('HJ_LAFORET', '#c8ccd0', '#3a4450', 0.6, 2, 4), arc = [];
      for (let k = 0; k <= 6; k++) { const a = k / 6 * Math.PI / 2; arc.push([-2737 + Math.cos(a) * 12, -1092 + Math.sin(a) * 12]); }
      const P = [[-2765, -1112], [-2725, -1112], ...arc, [-2765, -1080]];
      pushPrism(laf, 'ROOF', P, 0, 30, { fp: '#5a5e66' });
      const t = textTex('LAFORET', '#2a2a30', '#ffffff', 128, 22), sm = glow(lam({ map: t }), 0xffffff, 0.9); mesh(new THREE.BoxGeometry(14, 2.4, 0.3), [WALL.CONC, WALL.CONC, WALL.CONC, WALL.CONC, sm, sm], -2745, 24, -1079.6);
      const hills = M('HJ_HILLS', '#9a9690', '#c8d4dc', 0.7, 4, 5);
      addBuilding(-2690, -1040, -2446, -1012, 24, hills, { noRoofBox: true });
      addBuilding(-2444, -1040, -2426, -1014, 12, 'brick', { noRoofBox: true });
      for (let x = -2686; x < -2450; x += 8) pushPrism('glass', null, rectPoly(x, -1040.6, x + 7, -1040), 0.2, 4.5, { solid: false });
      LM_PEOPLE.push([[-2885, -1075, -2390, -1075], 30], [[-2390, -1045, -2885, -1045], 30], [[-2720, -1250, -2720, -970], 10]);
    }
    // 残りの街区 (原宿らしい低めの店とビル)
    const XRES = [...RR, [-2766, -1114, -2722, -1078], [-2692, -1042, -2424, -1010], TK];
    mixed([-2890, -1258, -2727, -1196], XRES); mixed([-2890, -1164, -2768, -1082], XRES); mixed([-2763, -1164, -2727, -1116], XRES);
    mixed([-2699, -1258, -2385, -1082], XRES); mixed([-2890, -1038, -2727, -966], XRES); mixed([-2699, -1008, -2385, -966], XRES);

    // ===== 名所の名前・地図・豆知識・役立ち情報 =====
    SPOT_AREAS.push(['明治神宮 拝殿', COURT[0] + 20, COURT[1] + 6, COURT[2] - 20, COURT[1] + 28], ['夫婦楠', COURT[0] + 18, COURT[3] - 26, COURT[0] + 40, COURT[3] - 14],
      ['明治神宮 南神門', (COURT[0] + COURT[2]) / 2 - 12, COURT[3] - 8, (COURT[0] + COURT[2]) / 2 + 12, COURT[3] + 4], ['明治神宮 本殿', ...HONDEN],
      ['明治神宮 大鳥居', -3044, -1406, -3024, -1384], ['奉献酒樽とワイン樽', -3025, -1388, -2995, -1350], ['明治神宮 南参道', ...SANDO_S], ['明治神宮 北参道', ...SANDO_N], ['明治神宮 正参道', ...SANDO_M],
      ['明治神宮御苑', ...GYOEN], ['明治神宮', ...FOREST], ['国立代々木競技場', -3130, -1044, -2990, -936], ['代々木公園', -3400, -1100, -3135, -780],
      ['竹下通り', TK[0], TK[1] - 14, TK[2], TK[3] + 14], ['ラフォーレ原宿', -2767, -1114, -2722, -1078], ['神宮前交差点', -2727, -1080, -2699, -1040], ['表参道ヒルズ', -2692, -1042, -2424, -1010],
      ['表参道', E[0], -1080, E[2], -1040], ['神宮橋', -3003, -1080, -2893, -1040]);
    LM_LABELS.push(['明治神宮', -3100, -1470, '⛩', '明治神宮 拝殿'], ['大鳥居', -3034, -1410, '⛩', '明治神宮 大鳥居'], ['酒樽', -3010, -1345, '🍶', '奉献酒樽とワイン樽'], ['御苑', -3080, -1320, '🌿', '明治神宮御苑'],
      ['代々木競技場', -3060, -1050, '🏟', '国立代々木競技場'], ['代々木公園', -3270, -900, '🌳'], ['竹下通り', -2810, -1196, '🍭'], ['ラフォーレ', -2745, -1120, '🛍', 'ラフォーレ原宿'],
      ['表参道', -2560, -1060, '🌳'], ['表参道ヒルズ', -2560, -1026, '🛍']);
    Object.assign(LM_NOTES, {
      '明治神宮': '1920年創建。森は全国から献木された約10万本の木を植えた人工林で、100年かけて自然の森になるよう設計された',
      '明治神宮 南参道': '参道の幅は入口ごとにちがう。南参道は8間、北参道は6間と、参拝者の数を見込んで決められた',
      '明治神宮 北参道': '代々木駅側の入口からの参道。拝殿までは、どの入口からも歩いて約10分',
      '明治神宮 正参道': '南参道と北参道が合流して、拝殿へ向かう参道。幅は10間 (約18m) ある',
      '明治神宮 大鳥居': '高さ12m・幅17.1m、木造の明神鳥居で日本一。今の鳥居は台湾の樹齢1500年のヒノキで1975年に建てられた',
      '奉献酒樽とワイン樽': '片側に全国の酒蔵から奉納された酒樽、向かいにフランス・ブルゴーニュから奉納されたワイン樽。明治天皇はワインがお好きだった',
      '明治神宮 拝殿': '明治天皇と昭憲皇太后を祀る。初詣の参拝者数は毎年日本一',
      '明治神宮 南神門': '回廊に囲まれた境内への正面の門。ここをくぐると玉砂利の広い境内',
      '明治神宮 本殿': '本殿などの社殿は空襲で焼け、1958年に再建された',
      '夫婦楠': '創建の1920年に植えられた2本のクスノキ。注連縄で結ばれ、夫婦円満・縁結びの象徴',
      '明治神宮御苑': '昭憲皇太后が愛した菖蒲の庭。この庭があったことが、ここに神宮が建てられた理由のひとつ',
      '清正井': '加藤清正が掘ったと伝わる井戸。今も水が湧き続けている',
      '国立代々木競技場': '丹下健三の設計で、1964年の東京オリンピックのために建てられた。2本の柱から吊った屋根が特徴',
      '代々木公園': '戦後は米軍の住宅「ワシントンハイツ」、1964年の東京オリンピックでは選手村になった場所',
      '竹下通り': '原宿駅の竹下口から明治通りまで約350m。クレープや大きなわたあめの店など、約130店が並ぶ',
      '表参道': '明治神宮の参道として1919年に整備された通り。ケヤキ並木は神宮創建の翌年、1920年に植えられた',
      'ラフォーレ原宿': '神宮前交差点の角に建つ、原宿ファッションの拠点',
      '表参道ヒルズ': '1926年に建てられた同潤会青山アパートの跡地に、2006年に開業した',
      '神宮橋': '表参道と明治神宮をつなぐ橋。ここから先は代々木の杜',
    });
    Object.assign(LM_TIPS, {
      '明治神宮': '参道の大鳥居は、木造の明神鳥居では日本一の大きさ。台湾の山から運んだヒノキでつくられている',
      '明治神宮 拝殿': '参拝は「二礼二拍手一礼」。初詣の時期 (元日〜三が日) はたいへん混む',
      '明治神宮御苑': '6月は花菖蒲が見ごろ',
      '竹下通り': '原宿駅の前から下り坂になっていて、入口のアーチの下から通りの奥まで人の波が見渡せる',
      '表参道': 'ケヤキ並木は冬にイルミネーションで彩られる年がある',
    });
    // 実績
    let mjStep = 0;
    LM_ACH.push(['yoyogi', '⛩ 代々木の杜を抜けて', '明治神宮の南参道から入ってお参りし、北参道へ抜ける', () => {
      const s = [() => inR(SANDO_S, P.x, P.z) && P.z > -1200, () => inR([COURT[0] + 20, COURT[1] + 20, COURT[2] - 20, COURT[1] + 34], P.x, P.z), () => inR(SANDO_N, P.x, P.z) && P.z < -1700];
      if (mjStep < 3 && s[mjStep]()) mjStep++; return mjStep >= 3; }],
      ['takeshita', '🍭 竹下通りを歩き通す', '竹下通りを端から端まで歩く', (() => { let w = 0; return () => { if (!inR([TK[0], TK[1] - 1, TK[2], TK[3] + 1], P.x, P.z)) return false; if (P.x < TK[0] + 10) w |= 1; if (P.x > TK[2] - 10) w |= 2; return w === 3; }; })()]);
  },
});
