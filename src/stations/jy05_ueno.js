/* JY05 上野駅 (上野)
   線路の西側 (内側): 上野恩賜公園 (西郷隆盛像・さくら通りの桜・清水観音堂と月の松・不忍池と弁天堂・上野東照宮 (金色殿)・
     旧寛永寺五重塔・上野動物園・噴水広場・東京国立博物館・国立科学博物館 (シロナガスクジラ・D51)・国立西洋美術館) /
     アメ横 (上野〜御徒町の線路沿い)
   駅舎は線路の東側。線路は北北東に向かう (上野で x ≒ 463) */
STATION({
  no: 5, name: '上野', kana: 'うえの', roma: 'Ueno', town: '上野',
  lat: 35.7138, lon: 139.7773, build(st) {
    const C = (key, color, emi, k = 0) => { if (!WALL[key]) { WALL[key] = lam(emi ? { color, emissive: emi, emissiveIntensity: 0 } : { color }); if (k) GLOW.push([WALL[key], k]); } return key; };
    const SHU = C('UE_SHU', 0xc4321c, 0xff6a3a), GOLD = C('UE_GOLD', 0xd8a830, 0xffc040, 0.25), STONE = C('UE_STONE', 0xb0a898), BEIGE = C('UE_BEIGE', 0xd8ccb0), KAWARA = 'RF2';
    LM_UPDATERS.push(() => { WALL[SHU].emissiveIntensity = NIGHT > 0.05 && gameH >= 12 && gameH < 23 ? NIGHT * 0.25 : 0; });
    const M = (key, bg, win, lit, step = 3, rows = 3) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rows) for (let i = 1; i < 32; i += step) { x.fillStyle = win; x.fillRect(i, j, step - 1, rows - 1); y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, j, step - 1, rows - 1); }
    });
    const water = (cx, cz, rx, rz) => { PONDS.push([cx, cz, rx, rz]); DL.push({ bb: [cx - rx, cz - rz, cx + rx, cz + rz], f: g => { g.fillStyle = '#2d6585'; g.beginPath(); g.ellipse(cx, cz, rx, rz, 0, 0, 7); g.fill(); } }); };

    // ===== 上野恩賜公園 (1873年、日本で初めて公園に指定された5か所のひとつ) =====
    const PK1 = [20, -3930, 450, -3560], PK2 = [20, -3560, 330, -3385];
    LM_ZONES.push(rectPoly(...PK1), rectPoly(...PK2)); fr(...PK1, '#7a8a5a'); fr(...PK2, '#7a8a5a');
    const KEEP = [[316, -3744, 342, -3428], [300, -3434, 338, -3398], [236, -3480, 296, -3448], [195, -3475, 252, -3432], [140, -3640, 310, -3580], [296, -3764, 434, -3664], [326, -3934, 456, -3766], [400, -3720, 452, -3612], [354, -3646, 410, -3580], [20, -3930, 254, -3640]];   // 木を植えない所 (建物・広場・眺め)
    for (let k = 0; k < 420; k++) { const x = rr(22, 448), z = rr(-3928, -3388); if ((x > 330 && z > -3560) || (Math.hypot((x - 110) / 100, (z + 3440) / 126) < 1) || KEEP.some(r => inR(r, x, z, 3))) continue; (rnd() < 0.6 ? ROUND : rnd() < 0.5 ? PINES : GINKGO).push([x, z, rr(1, 1.5)]); }
    // さくら通り (西郷さんから噴水広場へ。両側の桜)
    const SAK = [320, -3740, 338, -3432];
    tiles(...SAK, '#c8bea8', '#b8ae98', 3);
    for (let z = SAK[1] + 4; z < SAK[3] - 4; z += 8) { SAKURA.push([SAK[0] - 4, z, rr(1.1, 1.4)]); SAKURA.push([SAK[2] + 4, z + 4, rr(1.1, 1.4)]); }
    for (let z = SAK[1] + 10; z < SAK[3] - 10; z += 24) { BENCHES.push([SAK[0] - 1, z, Math.PI / 2]); LAMPS2.push([SAK[2] + 1, z + 12]); }
    LM_PEOPLE.push([[329, -3436, 329, -3736], 30], [[324, -3736, 334, -3440], 16]);
    // 西郷隆盛像 (1898年・高村光雲。犬の名は「ツン」)
    {
      const cx = 318, cz = -3418, br = WALL.BRONZE;
      pushPrism(STONE, STONE, rectPoly(cx - 3.5, cz - 3.5, cx + 3.5, cz + 3.5), 0, 3.2); tiles(cx - 12, cz - 10, cx + 12, cz + 12, '#c0b6a4', '#aaa090', 2);
      const g = new THREE.Group(); g.position.set(cx, 3.2, cz); chunkAt(cx, cz).group.add(g);
      const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 1.05, 2.4, 8), br); robe.position.y = 1.5; g.add(robe);
      box(0.5, 0.35, 0.6, br, -0.32, 0.17, 0.1, g); box(0.5, 0.35, 0.6, br, 0.32, 0.17, 0.1, g);                 // 草履の足
      box(1.6, 0.9, 0.9, br, 0, 2.75, 0, g); box(0.85, 0.95, 0.85, br, 0, 3.55, 0.05, g); box(0.95, 0.25, 0.9, br, 0, 4.05, 0, g);   // 胸・頭・髪
      box(0.32, 1.3, 0.32, br, 0.95, 2.3, 0.2, g).rotation.z = 0.15;                                             // 右手 (犬の綱)
      const dog = new THREE.Group(); dog.position.set(1.6, 0, 0.6); g.add(dog);
      box(0.4, 0.45, 1.0, br, 0, 0.55, 0, dog); box(0.32, 0.38, 0.4, br, 0, 0.9, 0.55, dog); for (const [dx, dz] of [[-0.13, 0.35], [0.13, 0.35], [-0.13, -0.35], [0.13, -0.35]]) box(0.1, 0.35, 0.1, br, dx, 0.17, dz, dog);
      solid(cx - 1.2, cz - 1, cx + 2.2, cz + 1.2, 3.2, 7.5);
    }
    // 清水観音堂 (京都の清水寺をまねた舞台造り) と月の松 (円の中に弁天堂が見える)
    const KZ = -3465;
    {
      pushPrism(SHU, null, rectPoly(256, KZ - 7, 262, KZ + 7), 0, 2.5); pushPrism('WOOD', 'WOOD', rectPoly(254, KZ - 7, 262, KZ + 7), 2.5, 2.8);   // 舞台
      for (let z = KZ - 6; z <= KZ + 6; z += 3) pushPrism(SHU, null, rectPoly(254, z - 0.2, 254.4, z + 0.2), 2.8, 3.8, { solid: false });
      solid(254, KZ - 7, 254.3, KZ + 7, 2.8, 3.8);
      pushPrism(SHU, 'ROOF', rectPoly(262, KZ - 9, 280, KZ + 9), 0, 7.5); jRoof(KAWARA, 262, KZ - 9, 280, KZ + 9, 7.5, 5.5, { over: 2, gable: SHU });
      stairs([280, KZ - 2, 290, KZ + 2], 2.8, 'x-');
      // 月の松: 幹と、くるりと円を描く枝
      const pm = lam({ color: 0x5a4030 }), pl = lam({ color: 0x2f5a2a });
      mesh(new THREE.CylinderGeometry(0.25, 0.4, 4.5, 6), pm, 247, 2.25, KZ + 2.6);
      const ring = mesh(new THREE.TorusGeometry(1.9, 0.22, 6, 20), pm, 246, 4.3, KZ + 2.6); ring.rotation.y = Math.PI / 2 - 0.16;
      for (const [dy, dz] of [[6.5, 2.6], [5.8, 4.2], [5.6, 1.0]]) mesh(new THREE.IcosahedronGeometry(1.3, 0), pl, 247, dy, KZ + dz);
      solid(246.6, KZ + 2.2, 247.4, KZ + 3, 0, 4.5);
    }
    // 不忍池 (琵琶湖に見立てた池) と弁天堂 (竹生島に見立てた島)
    const PC = [110, -3440];
    {
      water(PC[0], PC[1], 92, 118);
      POND_LAND.push(['e', PC[0], PC[1], 20, 15], ['r', 126, PC[1] - 4, 206, PC[1] + 4]);
      DL.push({ bb: [PC[0] - 20, PC[1] - 15, 206, PC[1] + 15], f: g => { g.fillStyle = '#b8ae98'; g.beginPath(); g.ellipse(PC[0], PC[1], 20, 15, 0, 0, 7); g.fill(); g.fillRect(126, PC[1] - 4, 80, 8); } });
      for (let k = 0; k < 60; k++) { const a = rr(0, 6.28), r = rr(0.2, 0.95), x = PC[0] + Math.cos(a) * 86 * r, z = PC[1] + 30 + Math.abs(Math.sin(a)) * 80 * r; if (z > PC[1] + 20 && Math.hypot((x - PC[0]) / 92, (z - PC[1]) / 118) < 0.95) DL.push({ bb: [x - 5, z - 5, x + 5, z + 5], f: g => { g.fillStyle = '#4a8a3a'; g.beginPath(); g.arc(x, z, rr(2.5, 4.5), 0, 7); g.fill(); if (k % 3 === 0) { g.fillStyle = '#f0a8c0'; g.beginPath(); g.arc(x + 1, z - 1, 0.9, 0, 7); g.fill(); } /* ハスの葉と花 (いつも夏の姿) */ } }); }   // 蓮
      pushPrism(STONE, STONE, regularPoly(PC[0], PC[1], 9, 8), 0, 0.8);
      pushPrism(SHU, 'ROOF', regularPoly(PC[0], PC[1], 6, 8), 0.8, 5.5);
      mesh(new THREE.ConeGeometry(9, 4.5, 8), WALL[KAWARA], PC[0], 7.6, PC[1]); polySolid(regularPoly(PC[0], PC[1], 5, 8), 5.5, 8);
      mesh(new THREE.SphereGeometry(0.7, 8, 6), WALL[GOLD], PC[0], 10.2, PC[1]);
      for (const [dx, dz] of [[24, -3], [24, 3]]) pushPrism(SHU, null, rectPoly(PC[0] + dx - 0.3, PC[1] + dz - 0.3, PC[0] + dx + 0.3, PC[1] + dz + 0.3), 0, 4.5);   // 参道の門柱
      pushPrism(SHU, KAWARA, rectPoly(PC[0] + 23, PC[1] - 4, PC[0] + 25, PC[1] + 4), 4.5, 5.3, { solid: false });
      for (let x = PC[0] + 30; x < 200; x += 12) for (const dz of [-5, 5]) LANTERNS.push([x, PC[1] + dz]);
      // ボート (北西のボート池)
      const bm = lam({ color: 0xf2f0ea }), BOATS = [];
      for (let k = 0; k < 7; k++) { const g = new THREE.Group(); box(1.6, 0.7, 2.6, bm, 0, 0.1, 0, g); box(0.5, 0.9, 0.5, bm, 0, 0.8, 1.0, g); scene.add(g); BOATS.push({ g, a: rr(0, 6.28), r: rr(20, 55), w: rr(0.02, 0.05) * (rnd() < 0.5 ? 1 : -1), ph: rr(0, 6) }); }
      LM_UPDATERS.push((dt, t) => { for (const b of BOATS) { b.a += b.w * dt; b.g.position.set(PC[0] - 40 + Math.cos(b.a) * b.r * 0.7, -0.05 + Math.sin(t * 1.5 + b.ph) * 0.05, PC[1] - 50 + Math.sin(b.a) * b.r * 0.6); b.g.rotation.y = b.a + (b.w > 0 ? 0 : Math.PI); } });
      for (let k = 0; k < 40; k++) { const a = k / 40 * 6.28, x = PC[0] + Math.cos(a) * 98, z = PC[1] + Math.sin(a) * 124; if (x > 195 && z > -3475 && z < -3432) continue; if (k % 2) SAKURA.push([x, z, rr(1, 1.3)]); else ROUND.push([x, z, rr(1, 1.3)]); }
      LM_PEOPLE.push([[206, PC[1], PC[0] + 22, PC[1]], 8]);
    }
    // 上野東照宮 (1651年に徳川家光が建て替えた「金色殿」)
    {
      const SZ = -3610;
      tiles(196, SZ - 4, 304, SZ + 4, '#bdb49e', '#aaa18a', 2);
      for (let x = 202; x < 290; x += 5) for (const dz of [-6, 6]) { mesh(new THREE.BoxGeometry(0.9, 2.2, 0.9), WALL[STONE], x, 1.1, SZ + dz); mesh(new THREE.BoxGeometry(1.5, 0.35, 1.5), WALL[STONE], x, 2.4, SZ + dz); solid(x - 0.45, SZ + dz - 0.45, x + 0.45, SZ + dz + 0.45, 0, 2.6); }
      myojinTorii(292, SZ, false, 7.5, 6, lam({ color: 0x9a9488 }), 0.42);
      pushPrism(GOLD, null, rectPoly(193, SZ - 4, 196, SZ - 1.5), 0, 5); pushPrism(GOLD, null, rectPoly(193, SZ + 1.5, 196, SZ + 4), 0, 5);   // 唐門
      pushPrism(GOLD, 'ROOF', rectPoly(193, SZ - 4, 196, SZ + 4), 4.2, 5); jRoof('RF_COPPER', 192, SZ - 5, 197, SZ + 5, 5, 2.4, { over: 0.8, gable: GOLD });
      const FEN = [146, SZ - 22, 193, SZ + 22];   // 透塀 (赤・緑・金)
      for (const r of [[FEN[0], FEN[1], FEN[2], FEN[1] + 0.6], [FEN[0], FEN[3] - 0.6, FEN[2], FEN[3]], [FEN[0], FEN[1], FEN[0] + 0.6, FEN[3]], [FEN[2] - 0.6, FEN[1], FEN[2], SZ - 4], [FEN[2] - 0.6, SZ + 4, FEN[2], FEN[3]]]) { pushPrism(SHU, 'RF_COPPER', rectPoly(...r), 0, 2.6); }
      pushPrism(GOLD, 'ROOF', rectPoly(156, SZ - 12, 186, SZ + 12), 0.6, 7); jRoof(KAWARA, 155, SZ - 13, 187, SZ + 13, 7, 6, { over: 1.8, gable: GOLD });
      pushPrism(STONE, STONE, rectPoly(152, SZ - 15, 190, SZ + 15), 0, 0.6);
      fr(FEN[0], FEN[1], FEN[2], FEN[3], '#c8c0aa');
      LM_PEOPLE.push([[300, SZ, 200, SZ], 10]);
    }
    // ===== 上野動物園 (1882年開園、日本でいちばん古い動物園) =====
    const ZOO = [22, -3926, 252, -3642];
    {
      fr(...ZOO, '#6a8a4a');
      for (const r of [[ZOO[0], ZOO[1], ZOO[2], ZOO[1] + 0.5], [ZOO[0], ZOO[3] - 0.5, ZOO[2], ZOO[3]], [ZOO[0], ZOO[1], ZOO[0] + 0.5, ZOO[3]], [ZOO[2] - 0.5, ZOO[1], ZOO[2], -3712], [ZOO[2] - 0.5, -3696, ZOO[2], ZOO[3]]]) pushPrism('CONC', null, rectPoly(...r), 0, 2.6);
      // 表門
      for (const z of [-3716, -3692]) pushPrism(BEIGE, 'ROOF', rectPoly(246, z - 4, 258, z + 4), 0, 6);
      const gs = glow(lam({ map: textTex('上野動物園', '#2a6a3a', '#ffffff', 160, 28) }), 0xffffff, 0.8); mesh(new THREE.BoxGeometry(0.4, 2.2, 16), [gs, gs, WALL.CONC, WALL.CONC, WALL.CONC, WALL.CONC], 258.3, 7, -3704);
      fr(236, -3712, 262, -3696, '#c8bea8');
      // 園内の道と、動物たちの運動場
      fr(60, -3712, 246, -3696, '#c8bea8'); fr(140, -3900, 152, -3700, '#c8bea8'); fr(40, -3820, 230, -3810, '#c8bea8');
      const pen = (r, col) => { fr(...r, col); for (const s of [[r[0], r[1], r[2], r[1] + 0.3], [r[0], r[3] - 0.3, r[2], r[3]], [r[0], r[1], r[0] + 0.3, r[3]], [r[2] - 0.3, r[1], r[2], r[3]]]) pushPrism('CONC', null, rectPoly(...s), 0, 1.6); };
      pen([160, -3800, 236, -3730], '#a8986a'); pen([40, -3900, 130, -3830], '#b8a870'); pen([40, -3800, 130, -3730], '#6a8a4a'); pen([160, -3900, 236, -3830], '#8a9a6a');
      const ANI = [];
      const elephant = (x, z) => { const g = new THREE.Group(), m = lam({ color: 0x8a8a8e }); g.position.set(x, 0, z); scene.add(g); box(2.6, 2.2, 4.2, m, 0, 2.6, 0, g); box(1.8, 1.8, 1.6, m, 0, 3.2, 2.6, g); for (const s of [-1, 1]) box(0.2, 1.5, 1.3, m, s * 1.0, 3.3, 2.3, g); const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 2.2, 6), m); tr.position.set(0, 1.9, 3.4); tr.rotation.x = 0.25; g.add(tr); for (const [dx, dz] of [[-0.8, 1.4], [0.8, 1.4], [-0.8, -1.4], [0.8, -1.4]]) box(0.7, 1.6, 0.7, m, dx, 0.8, dz, g); return g; };
      const giraffe = (x, z) => { const g = new THREE.Group(), m = lam({ color: 0xd8a84a }); g.position.set(x, 0, z); scene.add(g); box(1.2, 1.3, 2.4, m, 0, 3.0, 0, g); const n = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.8, 0.45), m); n.position.set(0, 4.6, 1.2); n.rotation.x = 0.35; g.add(n); box(0.5, 0.5, 0.9, m, 0, 6.0, 1.9, g); for (const [dx, dz] of [[-0.4, 0.9], [0.4, 0.9], [-0.4, -0.9], [0.4, -0.9]]) box(0.25, 2.4, 0.25, m, dx, 1.2, dz, g); return g; };
      for (const [x, z] of [[185, -3770], [210, -3755]]) ANI.push({ g: elephant(x, z), x, z, r: 8, ph: rr(0, 6), v: 0.12 });
      for (const [x, z] of [[70, -3870], [100, -3855]]) ANI.push({ g: giraffe(x, z), x, z, r: 10, ph: rr(0, 6), v: 0.15 });
      const fl = lam({ color: 0xf0a0a8 }); for (let k = 0; k < 9; k++) { const g = new THREE.Group(); g.position.set(rr(170, 225), 0, rr(-3890, -3840)); scene.add(g); box(0.5, 0.45, 0.8, fl, 0, 1.3, 0, g); box(0.06, 1.1, 0.06, fl, 0, 0.55, 0, g); box(0.08, 0.7, 0.08, fl, 0, 1.75, 0.35, g); }
      fr(165, -3895, 230, -3835, '#2d6585');   // フラミンゴの池
      LM_UPDATERS.push((dt, t) => { for (const a of ANI) { const ang = t * a.v + a.ph; a.g.position.set(a.x + Math.cos(ang) * a.r, 0, a.z + Math.sin(ang) * a.r * 0.6); a.g.rotation.y = Math.atan2(-Math.sin(ang), Math.cos(ang) * 0.6); } });
      // 「パンダのもり」(ゲームの中ではパンダが暮らしている。本物は2026年1月に双子のパンダが中国へ返還)
      pushPrism(BEIGE, 'GRASSTOP', rectPoly(62, -3760, 122, -3735), 0, 5); fr(60, -3800, 130, -3762, '#7a9a5a');
      {
        const PY = [60, -3800, 130, -3762];   // 運動場
        for (const r of [[PY[0], PY[1], PY[2], PY[1] + 0.4], [PY[0], PY[1], PY[0] + 0.4, PY[3]], [PY[2] - 0.4, PY[1], PY[2], PY[3]]]) pushPrism('CONC', 'CONC', rectPoly(...r), 0, 1.3);   // 低い柵 (中は見える)
        for (let k = 0; k < 6; k++) PINES.push([rr(64, 126), rr(-3778, -3766), rr(0.7, 0.9)]);
        const BAM = lam({ color: 0x5a9a3a }), BAM2 = lam({ color: 0x7ab84a });
        for (let k = 0; k < 40; k++) { const x = k < 20 ? rr(62, 72) : rr(118, 128), z = rr(-3798, -3772), h = rr(4, 7); bake(BAM, new THREE.CylinderGeometry(0.08, 0.1, h, 5).translate(x, h / 2, z)); bake(BAM2, new THREE.ConeGeometry(0.7, 1.6, 5).translate(x, h, z)); }   // 竹やぶ
        const WD = lam({ color: 0x8a6a42 });   // 丸太のやぐら
        for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) mesh(new THREE.CylinderGeometry(0.22, 0.22, 2.6, 6), WD, 108 + dx, 1.3, -3788 + dz);
        pushPrism('WOOD', 'WOOD', rectPoly(105.5, -3790.5, 110.5, -3785.5), 2.4, 2.7);
        const pW = lam({ color: 0xf4f2ea }), pB = lam({ color: 0x1c1c20 });
        const panda = (s = 1) => {   // 体・足・肩の黒い帯・頭・耳・目のまわり
          const g = new THREE.Group(), b = new THREE.Group(); g.add(b); scene.add(g);
          const add = (geo, m, x, y, z, p = b) => { const o = new THREE.Mesh(geo, m); o.position.set(x * s, y * s, z * s); o.scale.setScalar(s); p.add(o); return o; };
          add(new THREE.SphereGeometry(0.75, 10, 7).scale(1, 0.85, 1.25), pW, 0, 0.95, 0);
          add(new THREE.BoxGeometry(1.55, 0.6, 0.55), pB, 0, 1.05, 0.45);
          const legs = []; for (const [lx, lz] of [[-0.45, 0.6], [0.45, 0.6], [-0.45, -0.6], [0.45, -0.6]]) legs.push(add(new THREE.BoxGeometry(0.38, 0.7, 0.42), pB, lx, 0.35, lz));
          const head = new THREE.Group(); head.position.set(0, 1.4 * s, 1.0 * s); b.add(head);
          add(new THREE.SphereGeometry(0.55, 10, 7), pW, 0, 0, 0, head);
          for (const sd of [-1, 1]) { add(new THREE.SphereGeometry(0.2, 6, 4), pB, sd * 0.4, 0.42, -0.05, head); add(new THREE.SphereGeometry(0.15, 6, 4).scale(1, 1.4, 0.6), pB, sd * 0.2, 0.05, 0.47, head); }
          add(new THREE.SphereGeometry(0.08, 5, 4), pB, 0, -0.12, 0.55, head);
          return { g, b, legs, head };
        };
        const PANDAS = [];
        { const p = panda(1); p.g.position.set(86, 0, -3778); p.b.rotation.x = -0.9; p.b.position.y = 0.55;   // すわって竹を食べる
          const bam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 5), BAM); bam.position.set(0.3, 1.9, 1.0); bam.rotation.z = 0.5; p.b.add(bam);
          PANDAS.push({ p, kind: 'eat', bam, ph: 0 }); p.g.rotation.y = 0.6; }
        { const p = panda(1); PANDAS.push({ p, kind: 'walk', cx: 96, cz: -3786, r: 9, ph: 1.5 }); }
        { const p = panda(1); p.g.position.set(108, 2.7, -3788); p.b.rotation.z = Math.PI / 2 * 0.95; p.b.position.y = 0.55; PANDAS.push({ p, kind: 'sleep', ph: 0.7 }); }   // やぐらの上で昼寝
        { const p = panda(0.5); PANDAS.push({ p, kind: 'roll', cx: 78, cz: -3790, ph: 0 }); }   // 子どものパンダがころころ
        LM_UPDATERS.push((dt, t) => {
          for (const a of PANDAS) {
            const { p } = a;
            if (a.kind === 'eat') { a.bam.position.y = 1.9 + Math.sin(t * 2.2) * 0.25; p.head.rotation.x = Math.sin(t * 2.2) * 0.15; }
            if (a.kind === 'walk') { const ang = t * 0.12 + a.ph; p.g.position.set(a.cx + Math.cos(ang) * a.r, 0, a.cz + Math.sin(ang) * a.r * 0.6); p.g.rotation.y = Math.atan2(-Math.sin(ang), Math.cos(ang) * 0.6); p.legs.forEach((l, i) => l.rotation.x = Math.sin(t * 4 + i * Math.PI / 2 * (i % 2 ? 1 : -1)) * 0.4); p.head.rotation.y = Math.sin(t * 0.7) * 0.3; }
            if (a.kind === 'sleep') { const br = 1 + Math.sin(t * 1.5) * 0.03; p.b.scale.set(br, br, 1); }
            if (a.kind === 'roll') { const k = (t * 0.25) % 2, d = k < 1 ? k : 2 - k; p.g.position.set(a.cx + d * 12, 0.35, a.cz); p.b.rotation.z = -(k < 1 ? 1 : -1) * t * 2.4; p.g.rotation.y = Math.PI / 2; }
          }
        });
        LM_PEOPLE.push([[64, -3804, 128, -3804], 12], [[128, -3806, 64, -3806], 8]);
        SPOT_AREAS.unshift(['パンダのもり (上野動物園)', 56, -3808, 134, -3735]);
        LM_LABELS.push(['パンダ', 96, -3780, '🐼', 'パンダのもり (上野動物園)']);
        LM_NOTES['パンダのもり (上野動物園)'] = 'ゲームの中では、パンダたちがのんびり暮らしている。本物の上野動物園の双子のパンダ、シャオシャオとレイレイは2026年1月27日に中国へ返還され、日本からパンダがいなくなった (1972年に初めて来日して以来はじめて)';
        LM_ACH.push(['panda', '🐼 パンダに会えた', '上野動物園のパンダのもりでパンダを見る', () => P.y < 3 && inR([56, -3810, 134, -3760], P.x, P.z)]);
      }
      // 旧寛永寺五重塔 (1639年)
      const px = 196, pz = -3668; let y = 1.2;
      pushPrism(STONE, STONE, rectPoly(px - 6, pz - 6, px + 6, pz + 6), 0, 1.2);
      for (let i = 0; i < 5; i++) { const hw = 3.4 - i * 0.32; pushPrism(SHU, null, rectPoly(px - hw, pz - hw, px + hw, pz + hw), y, y + 3.4); jRoof(KAWARA, px - hw, pz - hw, px + hw, pz + hw, y + 3.4, i < 4 ? 1.4 : 3.2, { kind: i < 4 ? 'band' : 'hip', over: 1.9 - i * 0.1, flare: i < 4 ? 1 : 0.25 }); y += 4.8; }
      mesh(new THREE.CylinderGeometry(0.16, 0.24, 9, 6), WALL.BRONZE, px, y - 4.8 + 3.4 + 3.2 + 4.5, pz);
      for (let k = 0; k < 7; k++) mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.16, 10), WALL[GOLD], px, y + 1.6 + k * 0.9, pz);
      LM_PEOPLE.push([[150, -3705, 245, -3705], 14], [[146, -3708, 146, -3890], 10], [[50, -3815, 225, -3815], 10]);
      for (let k = 0; k < 120; k++) { const x = rr(25, 248), z = rr(-3922, -3645); if ([[160, -3900, 236, -3730], [40, -3900, 130, -3730], [55, -3805, 135, -3730], [186, -3680, 252, -3600], [56, -3716, 252, -3692], [136, -3904, 156, -3696], [36, -3824, 234, -3806]].some(r => inR(r, x, z, 2))) continue; (rnd() < 0.7 ? ROUND : PINES).push([x, z, rr(1, 1.4)]); }
    }
    // 噴水広場 (寛永寺の本堂・根本中堂があった場所)
    const FN = [358, -3712];
    {
      tiles(300, -3760, 430, -3740 + 72, '#c8bea8', '#b8ae98', 3);
      water(FN[0], FN[1], 26, 12);
      const jm = new THREE.MeshLambertMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }), JETS = [];
      for (let k = -3; k <= 3; k++) { const j = mesh(new THREE.CylinderGeometry(0.15, 0.8, 6, 6, 1, true), jm, FN[0] + k * 6, 3, FN[1]); JETS.push([j, k]); }
      LM_UPDATERS.push((dt, t) => { for (const [j, k] of JETS) { const s = 0.5 + 0.5 * Math.abs(Math.sin(t * 0.8 + k * 0.6)); j.scale.set(1, s, 1); j.position.y = 3 * s; } });
      LM_PEOPLE.push([[300, -3735, 425, -3735], 14], [[300, -3690, 425, -3690], 10]);
    }
    // 東京国立博物館 (1872年創立、日本でいちばん長い歴史の博物館)。本館と表慶館
    {
      const tnm = M('UE_TNM', '#cfc4a8', '#5a5044', 0.4, 3, 4);
      fr(330, -3930, 452, -3770, '#a8a090');
      pushPrism(tnm, 'ROOF', rectPoly(345, -3886, 445, -3846), 0, 16); jRoof(KAWARA, 345, -3886, 445, -3846, 16, 9, { kind: 'hip', over: 2.2, flare: 0.25 });
      pushPrism(tnm, 'ROOF', rectPoly(386, -3846, 404, -3838), 0, 12); jRoof(KAWARA, 386, -3846, 404, -3838, 12, 4, { over: 1.4 });   // 玄関
      water(395, -3812, 12, 8); ROUND.push([395, -3826, 2.2]);
      for (const x of [383, 407]) pushPrism(STONE, 'ROOF', rectPoly(x - 1.5, -3774, x + 1.5, -3770), 0, 4);   // 正門
      pushPrism(BEIGE, 'ROOF', rectPoly(336, -3812, 362, -3796), 0, 10);
      const dome = mesh(new THREE.SphereGeometry(5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), lam({ color: 0x4a8a78 }), 349, 10, -3804); polySolid(regularPoly(349, -3804, 4, 8), 10, 14);
      LM_PEOPLE.push([[395, -3772, 395, -3836], 10]);
    }
    // 国立科学博物館 (日本館は上から見ると飛行機の形。前にシロナガスクジラの実物大模型と D51)
    {
      const kh = M('UE_KAHAKU', '#c8b898', '#6a6458', 0.4, 3, 4);
      pushPrism(kh, 'ROOF', rectPoly(406, -3700, 446, -3682), 0, 16); pushPrism(kh, 'ROOF', rectPoly(420, -3714, 432, -3664), 0, 16);   // 飛行機の形 (主翼と胴体)
      mesh(new THREE.SphereGeometry(5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), lam({ color: 0x5a7a8a }), 426, 16, -3691);
      // シロナガスクジラ (実物大)
      const wm = lam({ color: 0x3a4a5e }), g = new THREE.Group(); g.position.set(425, 4.5, -3650); g.rotation.set(0, Math.PI / 2, -0.06); chunkAt(425, -3650).group.add(g);
      const body = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), wm); body.scale.set(2.6, 2.4, 13); g.add(body);
      const tail = new THREE.Mesh(new THREE.ConeGeometry(1.4, 8, 8), wm); tail.rotation.x = -Math.PI / 2; tail.position.z = -15; g.add(tail);
      const fluke = new THREE.Mesh(new THREE.BoxGeometry(7, 0.35, 2.4), wm); fluke.position.z = -19; g.add(fluke);
      for (const s of [-1, 1]) { const fin = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 1.2), wm); fin.position.set(s * 3.2, -1.2, 5); fin.rotation.z = s * -0.4; g.add(fin); }
      for (let z = -3653; z <= -3647; z += 3) for (const x of [418, 432]) pushPrism('CONC', null, rectPoly(x - 0.3, z - 0.3, x + 0.3, z + 0.3), 0, 2.4, { solid: false });
      solid(411, -3652.5, 439, -3647.5, 2.2, 7);
      steamLoco(426, -3626);   // D51 (蒸気機関車)
      LM_PEOPLE.push([[408, -3660, 444, -3660], 8]);
    }
    // 国立西洋美術館 (ル・コルビュジエ設計。ピロティで持ち上げた展示室)
    {
      const cb = LM_MAT('UE_CORB', (x, y) => { x.fillStyle = '#b8b4a8'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let i = 0; i < 32; i += 4) for (let j = 0; j < 32; j += 4) { x.fillStyle = pick(['#a8a498', '#c4c0b4', '#9a968a']); x.fillRect(i + 1, j + 1, 2, 2); } });
      pushPrism(cb, 'ROOF', rectPoly(362, -3640, 402, -3604), 5, 15);
      pushPrism('glass', 'ROOF', rectPoly(370, -3632, 394, -3612), 0, 5);
      for (let x = 362; x <= 402; x += 8) for (const z of [-3640, -3604]) pushPrism('CONC', null, rectPoly(x - 0.4, z - 0.4, x + 0.4, z + 0.4), 0, 5);
      tiles(356, -3600, 406, -3584, '#c0b8a6', '#aea692', 3);
    }
    LM_CATS.push([250, -3470, 2.8], [120, -3445, 0]);

    // ===== アメ横 (上野〜御徒町の線路沿い。戦後の闇市から生まれた商店街) =====
    const F = frame(350, -3192, 0.3033, -0.9528, -0.9528, -0.3033), U0 = 28, U1 = 334;
    {
      oDraw(F, U0, 19.5, U1, 28.5, g => { g.fillStyle = '#9a9488'; g.fillRect(U0, 19.5, U1 - U0, 9); g.fillStyle = '#8a8478'; for (let u = U0; u < U1; u += 2.4) g.fillRect(u, 19.5, 1.2, 9); });
      const awnC = ['#d83a2a', '#2a6ab0', '#f0c020', '#2a9a5a', '#e8e0d0', '#e86a20'];
      if (!WALL.UE_AWN0) awnC.forEach((c, i) => WALL['UE_AWN' + i] = lam({ color: c }));
      const goods = LM_MAT('UE_GOODS', (x, y) => { x.fillStyle = '#5a4a3a'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let i = 0; i < 32; i++) for (let j = 0; j < 32; j++) if ((j % 8) > 1 && rnd() < 0.8) { x.fillStyle = pick(['#f04030', '#f0c030', '#e8e0d0', '#40a050', '#3a6ab0', '#f080a0', '#d87a30', '#8a5a3a']); x.fillRect(i, j, 1, 1); } y.fillStyle = '#5a4020'; y.fillRect(0, 0, 32, 32); });
      for (let u = U0; u < U1;) {   // 高架下の店 (線路側) と、向かいのビル
        const w = rr(5, 9), u1 = Math.min(u + w, U1);
        oBox(F, goods, u, 9, u1, 19.2, 0, 5);
        oBox(F, 'UE_AWN' + (Math.floor(rnd() * 6)), u, 19.2, u1, 20.6, 3.2, 3.45, { solid: false, top: 'UE_AWN' + (Math.floor(rnd() * 6)) });
        u = u1 + 0.2;
      }
      for (let u = U0; u < U1;) {
        const w = rr(6, 11), u1 = Math.min(u + w, U1), h = rr(6, 16);
        oBox(F, pick(SHOPS), u, 28.8, u1, rr(38, 44), 0, h);
        oBox(F, 'UE_AWN' + (Math.floor(rnd() * 6)), u, 27.4, u1, 28.8, 3.2, 3.45, { solid: false, top: 'UE_AWN' + (Math.floor(rnd() * 6)) });
        if (rnd() < 0.7) { const um = (u + u1) / 2; oBox(F, 'UE_AWN' + (Math.floor(rnd() * 6)), um - 0.15, 28.8 - 1.4, um + 0.15, 28.8, 4.5, 7.5, { solid: false }); }
        u = u1 + 0.3;
      }
      // 入口の看板 (上野側は「アメヤ横丁」)
      for (const [u, txt] of [[U1 - 2, 'アメヤ横丁'], [U0 + 2, 'アメ横']]) {
        const sm = glow(lam({ map: textTex(txt, '#c82a2a', '#ffffff', 160, 30) }), 0xffffff, 0.9), am = lam({ color: 0x8a8a90 });
        for (const v of [19.8, 28.2]) { const [x, z] = F.w(u, v); mesh(new THREE.BoxGeometry(0.4, 7, 0.4), am, x, 3.5, z); solid(x - 0.2, z - 0.2, x + 0.2, z + 0.2, 0, 7); }
        const [x, z] = F.w(u, 24); const b = mesh(new THREE.BoxGeometry(0.4, 1.8, 9), [sm, sm, am, am, am, am], x, 7.6, z); b.rotation.y = F.ang + Math.PI / 2;
      }
      LM_PEOPLE.push([F.w(U0 + 2, 22.5).concat(F.w(U1 - 2, 22.5)), 40], [F.w(U1 - 2, 25.5).concat(F.w(U0 + 2, 25.5)), 40]);
      LM_ZONES.push(F.rect(U0 - 2, 6, U1 + 2, 46));
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報 =====
    for (let u = U0; u < U1; u += 51) SPOT_AREAS.push(['アメ横', ...polyBB(F.rect(u, 8, Math.min(u + 51, U1), 40))]);
    SPOT_AREAS.push(['西郷隆盛像', 308, -3428, 328, -3406], ['月の松', 242, KZ - 1, 252, KZ + 6], ['清水観音堂', 252, KZ - 10, 292, KZ + 10], ['不忍池弁天堂', PC[0] - 20, PC[1] - 15, PC[0] + 20, PC[1] + 15],
      ['不忍池', PC[0] - 92, PC[1] - 118, PC[0] + 92, PC[1] + 118], ['上野東照宮', 146, -3632, 304, -3588], ['旧寛永寺五重塔', 186, -3678, 206, -3658], ['上野動物園', ...ZOO],
      ['噴水広場', 300, -3760, 430, -3668], ['東京国立博物館', 330, -3930, 452, -3770], ['シロナガスクジラの模型', 408, -3656, 442, -3644], ['国立科学博物館', 404, -3716, 448, -3620],
      ['国立西洋美術館', 356, -3642, 406, -3584], ['さくら通り', ...SAK], ['上野恩賜公園', ...PK1], ['上野恩賜公園', ...PK2]);
    LM_LABELS.push(['西郷さん', 318, -3440, '🗿', '西郷隆盛像'], ['清水観音堂', 272, KZ - 14, '🙏'], ['月の松', 246, KZ + 8, '🌕'], ['弁天堂', PC[0], PC[1] - 20, '🙏', '不忍池弁天堂'], ['不忍池', PC[0] - 40, PC[1] + 70, '🪷'],
      ['東照宮', 170, -3640, '⛩', '上野東照宮'], ['五重塔', 196, -3684, '🏯', '旧寛永寺五重塔'], ['上野動物園', 140, -3760, '🐘'], ['噴水広場', FN[0], FN[1] - 18, '⛲'],
      ['国立博物館', 395, -3895, '🏛', '東京国立博物館'], ['科学博物館', 426, -3720, '🦕', '国立科学博物館'], ['クジラ', 425, -3642, '🐋', 'シロナガスクジラの模型'], ['西洋美術館', 382, -3650, '🎨', '国立西洋美術館'],
      ['アメ横', ...F.w(180, 34), '🛍'], ['さくら通り', 329, -3600, '🌸']);
    Object.assign(LM_NOTES, {
      '上野恩賜公園': '1873年、日本で初めて公園に指定された5か所のひとつ。江戸時代はまるごと寛永寺の境内だった',
      '上野': '上野の山は江戸時代、徳川家の菩提寺・寛永寺の境内。東北や北陸への玄関口の駅でもある',
      'さくら通り': '上野は江戸時代から桜の名所。公園には約800本の桜がある',
      '西郷隆盛像': '連れている犬の名は「ツン」。除幕式で夫人が「うちの人はこんな人ではなかった」と言ったと伝わる',
      '清水観音堂': '京都の清水寺をまねて建てられた舞台造りのお堂。本尊の千手観音も清水寺から迎えたもの',
      '月の松': '枝がくるりと円を描く松。歌川広重の浮世絵にも描かれ、2012年に復活した。円の中に弁天堂が見えるしかけ',
      '不忍池': '寛永寺を開いた天海が、京都の比叡山に見立てた上野の山に合わせて、琵琶湖に見立てた池',
      '不忍池弁天堂': '琵琶湖の竹生島に見立てた島に建つ、弁才天のお堂',
      '上野東照宮': '1651年に徳川家光が建て替えた社殿は、金箔をふんだんに使った「金色殿」。戦争や大震災も乗り越えてきた',
      '旧寛永寺五重塔': '1639年に建てられた五重塔。今は上野動物園の中に立っている',
      '上野動物園': '日本でいちばん古い動物園 (1882年)。ゲームの中の「パンダのもり」にはパンダがいる (本物は2026年1月に双子のパンダが中国へ返り、日本のパンダは1972年以来はじめて0頭に)',
      '噴水広場': 'ここにはかつて寛永寺の本堂 (根本中堂) が建っていた',
      '東京国立博物館': '1872年創立。日本でいちばん長い歴史をもつ博物館で、国宝もたくさん所蔵している',
      '国立科学博物館': '1877年創立。日本館の建物は上から見ると飛行機の形。渋谷の忠犬ハチ公の剥製もここにある',
      'シロナガスクジラの模型': '国立科学博物館の前にある、実物大のシロナガスクジラ。地球でいちばん大きな動物',
      '国立西洋美術館': 'ル・コルビュジエが日本に残した唯一の建築。2016年、東京で初めての世界文化遺産になった',
      'アメ横': '戦後の闇市から生まれた商店街。名前は飴を売る店が多かったから (アメリカの品を売ったから、という説も)',
    });
    Object.assign(LM_TIPS, {
      '上野恩賜公園': '桜の見ごろは例年3月下旬〜4月上旬。約800本の桜が並ぶ「さくら通り」は花見の名所',
      '不忍池': '夏 (例年7月中旬〜8月中旬) は池一面のハスが見ごろ。ボート池ではボートに乗れる',
      '上野東照宮': '参道にずらりと並ぶ石や銅の灯籠は、全国の大名が奉納したもの',
      '上野動物園': '園内は、ゾウやトラのいる東園と、カバやキリンのいる西園に分かれている',
      '東京国立博物館': '瓦屋根をのせた本館は「帝冠様式」と呼ばれる。正面の大階段は、映画やドラマにもよく登場する',
      '国立科学博物館': '忠犬ハチ公の剥製は日本館の2階',
      'アメ横': '上野駅〜御徒町駅のあいだに約400店。年末は正月用品の買い出しでたいへん混む',
    });
    LM_ACH.push(['tsukinomatsu', '🌕 月の松', '清水観音堂の舞台から、月の松の円の中に弁天堂を見る', () => P.y > 2.3 && inR([254, KZ - 7, 262, KZ + 7], P.x, P.z) && Math.abs(((P.yaw - 1.73) % 6.283 + 9.425) % 6.283 - 3.1416) < 0.3],
      ['kujira', '🐋 クジラの背中', '国立科学博物館のシロナガスクジラの背中に乗る', () => P.y > 6.5 && inR([411, -3653, 439, -3647], P.x, P.z)],
      ['ameyoko', '🛍 アメ横を歩き通す', 'アメ横を御徒町側から上野側まで歩く', (() => { let w = 0; return () => { const dx = P.x - F.ox, dz = P.z - F.oz, u = dx * F.ux + dz * F.uz, v = dx * F.vx + dz * F.vz; if (v < 19 || v > 29) return false; if (u < U0 + 15) w = 1; return w === 1 && u > U1 - 15; }; })()]);
  },
});
