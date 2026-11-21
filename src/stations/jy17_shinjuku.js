/* JY17 新宿駅
   西口: 西口ロータリー / 思い出横丁 / 西新宿の超高層ビル群 (都庁・コクーンタワー・住友三角ビル・三井・センタービル・京王プラザ…) / 新宿中央公園
   東口: 東口駅前広場と巨大三毛猫のビジョン / 新宿通り・伊勢丹 / 歌舞伎町一番街・東急歌舞伎町タワー / ゴールデン街・花園神社
   線路はほぼ南北 (x ≒ -3004) なので、街は東西南北にそろえて作る */
STATION({
  no: 17, name: '新宿', kana: 'しんじゅく', roma: 'Shinjuku', town: '新宿',
  lat: 35.6896, lon: 139.7006, custom: true,
  build(st) {
    const ZW = [-3800, -2440, -3040, -1960], ZE = [-2985, -2620, -2560, -1960];
    LM_ZONES.push(rectPoly(...ZW), rectPoly(...ZE));
    fr(...ZW, '#9a958c'); fr(...ZE, '#9a958c');
    const RR = [...ringRes([ZW[0], ZW[1], ZE[2], ZE[3]], 16)];

    // ---- 素材
    const M = (key, bg, win, lit, step = 3, rows = 3) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rows) for (let i = 1; i < 32; i += step) { x.fillStyle = win; x.fillRect(i, j, step - 1, rows - 1); y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, j, step - 1, rows - 1); }
    });
    const tocho = LM_MAT('tocho', (x, y) => {   // 都庁: 花崗岩の格子と細かな窓
      x.fillStyle = '#b8b4ac'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 0; j < 32; j += 4) { x.fillStyle = '#8e8a84'; x.fillRect(0, j, 32, 1); for (let i = 0; i < 32; i += 2) { x.fillStyle = (i % 8) ? '#3e4a58' : '#a8a49c'; x.fillRect(i, j + 1, 1, 2); if (i % 8 && rnd() < 0.5) { y.fillStyle = pick(LIT); y.fillRect(i, j + 1, 1, 2); } } }
    });
    const keio = M('keio', '#ecebe6', '#4a5866', 0.6, 2, 2), mitsui = M('mitsui', '#24272c', '#4e6070', 0.5, 2, 2), centerB = M('centerB', '#8a6a54', '#2e3a44', 0.5, 3, 3);
    const sumitomo = LM_MAT('sumitomo', (x, y) => { x.fillStyle = '#e4e2dc'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let i = 1; i < 32; i += 3) for (let j = 0; j < 32; j += 2) { x.fillStyle = '#3a4652'; x.fillRect(i, j, 1, 1); if (rnd() < 0.5) { y.fillStyle = pick(LIT); y.fillRect(i, j, 1, 1); } } });
    const sompo = M('sompo', '#7a6a5e', '#323c46', 0.5, 2, 3), nsB = M('nsB', '#9a5a4a', '#2a343e', 0.5, 3, 3), dept = M('dept', '#d8d0c0', '#5a6a78', 0.4, 4, 4), deptE = M('deptE', '#e4e0d8', '#7a8e9e', 0.5, 4, 3);
    const isetan = LM_MAT('isetan', (x, y) => { x.fillStyle = '#d8c8a8'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let i = 2; i < 32; i += 5) { x.fillStyle = '#c4b290'; x.fillRect(i - 1, 0, 1, 32); for (let j = 3; j < 30; j += 6) { x.fillStyle = '#3a4450'; x.fillRect(i, j, 3, 4); y.fillStyle = rnd() < 0.6 ? '#ffe4b0' : '#000'; y.fillRect(i, j, 3, 4); } } x.fillStyle = '#8a7a5a'; x.fillRect(0, 0, 32, 1); });
    const kabukiT = LM_MAT('kabukiT', (x, y) => { x.fillStyle = '#5a7890'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let j = 0; j < 32; j += 2) for (let i = 0; i < 32; i += 2) if (rnd() < 0.5) { y.fillStyle = pick(['#ff70c0', '#70d0ff', '#ffe080', '#b080ff']); y.fillRect(i, j, 1, 1); } x.strokeStyle = '#e8eef2'; x.lineWidth = 1; for (let k = -32; k < 32; k += 6) { x.beginPath(); x.moveTo(k, 32); x.quadraticCurveTo(k + 8, 16, k + 2, 0); x.stroke(); } });

    // ===== 道路 =====
    addRoads([
      [-3780, -2420, -2560, -2404, 'ew'], [-3780, -1992, -2560, -1972, 'ew'],
      [-3780, -2320, -3040, -2306, 'ew', '北通り (西新宿)'], [-3432, -2214, -3146, -2200, 'ew', '中央通り (西新宿)'], [-3780, -2104, -3040, -2090, 'ew', '南通り (西新宿)'],
      [-3172, -2404, -3158, -1992, 'ns'], [-3302, -2404, -3288, -1992, 'ns'], [-3432, -2404, -3418, -1992, 'ns', '都庁通り'], [-3582, -2404, -3568, -1992, 'ns', '公園通り (新宿中央公園)'],
      [-2950, -2194, -2560, -2178, 'ew', '新宿通り'], [-2700, -2600, -2684, -1960, 'ns', '明治通り'],
    ]);
    DIST_AREAS.push(['新宿大ガード', -3040, -2420, -2985, -2404], ['青梅街道', -3780, -2420, -3040, -2404], ['靖国通り', -2985, -2420, -2560, -2404], ['甲州街道', -3780, -1992, -2560, -1972]);

    // ===== 西口 =====
    addBuilding(-3070, -2296, -3036, -2140, 38, dept, { noRoofBox: true });                    // 西口の駅ビル (百貨店)
    { const s = new THREE.Mesh(new THREE.PlaneGeometry(22, 3), glow(lam({ map: textTex('新宿駅 西口', '#2f7a3a', '#ffffff', 192, 28) }), 0xffffff, 0.8)); s.position.set(-3070.2, 9, -2218); s.rotation.y = -Math.PI / 2; chunkAt(-3070, -2218).group.add(s); }
    tiles(-3076, -2296, -3070, -2140, '#b8b0a2', '#a39a8c', 3);
    // 西口ロータリー: 楕円の車道と、地下広場への吹き抜け
    fe(-3110, -2185, 34, 32, '#3c3c42'); se(-3110, -2185, 25, 23, 0.4, '#e8e6dc'); fe(-3110, -2185, 16, 14, '#24242a'); se(-3110, -2185, 16.5, 14.5, 1, '#b8b0a2');
    { const g = new THREE.CylinderGeometry(16.5, 16.5, 1.1, 20, 1, true).scale(1, 1, 14.5 / 16.5); mesh(g, lam({ color: 0x7a7e84, side: THREE.DoubleSide }), -3110, 0.55, -2185);
      const ring = []; for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; ring.push([-3110 + Math.cos(a) * 16, -2185 + Math.sin(a) * 14]); } polySolid(ring, 0, 1.1); }
    tiles(-3158, -2150, -3076, -2104, '#9a968c', '#888478', 4); DIST_AREAS.push(['新宿駅西口 バスのりば', -3158, -2150, -3076, -2104]);
    for (let x = -3150; x < -3080; x += 14) { const r = [x, -2134, x + 8, -2131]; pushPrism('CONC', 'CONC', rectPoly(...r), 2.6, 2.9); for (const px of [x + 0.5, x + 7.3]) pushPrism('CONC', null, rectPoly(px, -2133, px + 0.2, -2132.8), 0, 2.6, { solid: false }); }
    // 思い出横丁 (線路沿いの飲み屋街)
    yokocho([-3150, -2400, -3046, -2326], RR, '思い出横丁');
    // 西新宿の超高層ビル群
    pushPrism('glass', 'glass', regularPoly(-3230, -2352, 52, 3, -Math.PI / 2), 0, 14);       // 新宿住友ビル (三角ビル): ガラス屋根の三角広場
    pushPrism(sumitomo, 'ROOF', regularPoly(-3230, -2352, 42, 3, -Math.PI / 2), 14, 210);
    addBuilding(-3275, -2296, -3215, -2242, 225, mitsui); tiles(-3285, -2236, -3176, -2218, '#a8a090', '#948c7e', 3);     // 新宿三井ビルと55広場
    addBuilding(-3280, -2190, -3185, -2160, 178, keio, { noRoofBox: true }); addBuilding(-3250, -2154, -3190, -2112, 148, keio, { noRoofBox: true });   // 京王プラザホテル
    addBuilding(-3405, -2398, -3315, -2330, 223, centerB);                                    // 新宿センタービル
    addBuilding(-3410, -2300, -3310, -2220, 18, 'office2'); addBuilding(-3398, -2292, -3322, -2228, 200, sompo, { noRoofBox: true });   // 損保ジャパン本社ビル (裾の広がった姿)
    addBuilding(-3410, -2194, -3310, -2112, 134, nsB);                                         // 新宿NSビル
    addBuilding(-3408, -2084, -3318, -2002, 24, 'office2'); addBuilding(-3396, -2074, -3330, -2012, 210, 'glassDark');   // 新宿野村ビル
    addBuilding(-3280, -2084, -3180, -2002, 20, 'office'); addBuilding(-3266, -2070, -3200, -2016, 189, 'glass');     // 新宿アイランドタワー
    addBuilding(-3150, -2085, -3046, -2000, 40, dept);                                          // 西口南側の百貨店
    // モード学園コクーンタワー (繭の形)
    {
      const cocoon = makeTex((x, y) => { x.fillStyle = '#4a6a86'; x.fillRect(0, 0, 32, 32); for (let j = 0; j < 32; j += 2) for (let i = 0; i < 32; i += 2) if (rnd() < 0.45) { y.fillStyle = pick(LIT); y.fillRect(i, j, 1, 1); }
        x.strokeStyle = '#e8eef0'; x.lineWidth = 1.2; for (let k = -32; k < 64; k += 8) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k - 32, 32); x.moveTo(k - 32, 0); x.lineTo(k, 32); x.stroke(); } });
      for (const t of [cocoon.map, cocoon.emi]) t.repeat.set(10, 14);
      const m = lam({ map: cocoon.map, emissive: 0xffffff, emissiveMap: cocoon.emi, emissiveIntensity: 0 }); GLOW.push([m, 1]);
      const prof = [[0.01, 0], [12, 0], [15, 10], [18.5, 40], [20, 85], [19, 130], [16, 165], [11, 190], [5, 201], [0.01, 204]].map(([r, y]) => new THREE.Vector2(r, y));
      mesh(new THREE.LatheGeometry(prof, 16).scale(1, 1, 0.75), m, -3110, 0, -2268, 0, true);
      const E = r => regularPoly(-3110, -2268, r, 12).map(([x, z]) => [x, -2268 + (z + 2268) * 0.75]);
      polySolid(E(17), 0, 60); polySolid(E(19), 60, 150); polySolid(E(15), 150, 185); polySolid(E(8), 185, 201);
      fr(-3132, -2284, -3088, -2252, '#33465c');
    }
    // 東京都庁 (第一本庁舎・第二本庁舎・議会議事堂) と都民広場
    addBuilding(-3550, -2275, -3480, -2135, 160, tocho, { noRoofBox: true });
    for (const [z0, z1] of [[-2272, -2232], [-2178, -2138]]) {
      addBuilding(-3545, z0, -3485, z1, 225, tocho, { noRoofBox: true, paint: false });
      pushPrism(tocho, 'ROOF', regularPoly(-3515, (z0 + z1) / 2, 22, 4, 0), 225, 243);   // 上の方で45度ずれる塔頂部
      pushPrism('CONC', 'CONC', regularPoly(-3515, (z0 + z1) / 2, 9, 8), 243, 246);
    }
    addBuilding(-3555, -2080, -3470, -2005, 163, tocho, { noRoofBox: true });   // 第二本庁舎
    addBuilding(-3555, -2395, -3450, -2330, 40, tocho, { noRoofBox: true });    // 都議会議事堂
    {
      const cx = -3478, cz = -2205, R = 40, P = [];
      for (let i = 0; i <= 24; i++) { const a = -Math.PI / 2 + i / 24 * Math.PI; P.push([cx + Math.cos(a) * R, cz + Math.sin(a) * R]); }
      polyFr([[cx, cz - R], ...P, [cx, cz + R]], '#b8b0a2'); se(cx, cz, 20, 20, 0.6, '#9a9284');
      for (let i = 0; i <= 24; i += 2) { const [x, z] = P[i]; pushPrism('TKSTONE', 'TKSTONE', rectPoly(x - 0.6, z - 0.6, x + 0.6, z + 0.6), 0, 10); }
      for (let i = 0; i < 24; i++) { const [a, b] = [P[i], P[i + 1]], nx = b[1] - a[1], nz = a[0] - b[0], l = Math.hypot(nx, nz) / 0.9;
        pushPrism('TKSTONE', 'TKSTONE', [[a[0] + nx / l, a[1] + nz / l], [b[0] + nx / l, b[1] + nz / l], [b[0] - nx / l, b[1] - nz / l], [a[0] - nx / l, a[1] - nz / l]], 10, 11.2); }
      BENCHES.push([cx + 14, cz - 12, 0], [cx + 14, cz + 12, 0]);
    }
    // 新宿中央公園
    fr(-3780, -2404, -3582, -1992, GRASS);
    for (const [x0, z0, x1, z1] of [[-3780, -2200, -3582, -2192], [-3680, -2404, -3672, -1992]]) fr(x0, z0, x1, z1, PATH);
    fr(-3700, -2128, -3600, -2108, '#4a86a8'); pushPrism('ISHIGAKI', 'ISHIGAKI', rectPoly(-3700, -2134, -3600, -2128), 0, 4);   // 水の広場 (ナイアガラの滝)
    { const fall = mesh(new THREE.PlaneGeometry(100, 4), glow(lam({ color: 0xe8f4ff, transparent: true, opacity: 0.8 }), 0xd0e8ff, 0.4), -3650, 2, -2127.8); fall.rotation.y = 0; }
    for (let k = 0; k < 170; k++) { const x = rr(-3775, -3588), z = rr(-2400, -1998); if (Math.abs(z + 2196) < 7 || Math.abs(x + 3676) < 7 || inR([-3705, -2140, -3595, -2100], x, z) || inR([-3780, -2404, -3725, -2340], x, z)) continue; ROUND.push([x, z, rr(1, 1.5)]); }
    shrine([-3778, -2402, -3730, -2344], '熊野神社 (十二社)', 2);
    LM_CATS.push([-3640, -2260, 0]);

    // ===== 東口 =====
    addBuilding(-2980, -2290, -2950, -2130, 32, deptE, { noRoofBox: true });                  // 東口の駅ビル
    { const s = new THREE.Mesh(new THREE.PlaneGeometry(22, 3), glow(lam({ map: textTex('新宿駅 東口', '#2f7a3a', '#ffffff', 192, 28) }), 0xffffff, 0.8)); s.position.set(-2949.8, 9, -2228); s.rotation.y = Math.PI / 2; chunkAt(-2950, -2228).group.add(s); }
    tiles(-2950, -2260, -2890, -2196, '#bdb5a6', '#a8a092', 3);
    for (const [x, z] of [[-2940, -2252], [-2900, -2252], [-2940, -2204], [-2900, -2204]]) ROUND.push([x, z, 0.9]);
    // 巨大三毛猫のビジョン (クロス新宿ビジョン): L字の画面の角に座る大きな猫
    addBuilding(-2888, -2252, -2846, -2198, 42, 'glassDark', { noRoofBox: true });
    const CAT = (() => {
      const roomC = document.createElement('canvas'); roomC.width = 64; roomC.height = 40; const rg = roomC.getContext('2d');
      const grd = rg.createLinearGradient(0, 0, 0, 40); grd.addColorStop(0, '#5ab4f0'); grd.addColorStop(0.8, '#f4e2b0'); rg.fillStyle = grd; rg.fillRect(0, 0, 64, 40);   // 猫のいる部屋 (窓の外は青空)
      rg.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 64; i += 16) rg.fillRect(i, 0, 2, 30); rg.fillStyle = '#d89a58'; rg.fillRect(0, 30, 64, 10); rg.fillStyle = '#c0844a'; for (let i = 0; i < 64; i += 8) rg.fillRect(i, 30, 1, 10);
      const scr = new THREE.MeshBasicMaterial({ map: canvasTex(roomC, false) });
      const a = mesh(new THREE.PlaneGeometry(30, 18), scr, -2888.3, 27, -2237); a.rotation.y = -Math.PI / 2;
      const b = mesh(new THREE.PlaneGeometry(30, 18), scr, -2873, 27, -2252.3); b.rotation.y = Math.PI;
      pushPrism('CONC', 'CONC', rectPoly(-2904, -2268, -2872, -2236), 17.2, 18);
      const g = new THREE.Group(); g.position.set(-2886, 18, -2250); g.rotation.y = -2.356; chunkAt(-2884, -2248).group.add(g);
      const S = 28, W = lam({ color: 0xf2f0ea }), O = lam({ color: 0xd8883a }), K = lam({ color: 0x2a2a2e }), b0 = (w, h, d, m, x, y, z, p = g) => box(w * S, h * S, d * S, m, x * S, y * S, z * S, p);
      b0(0.26, 0.24, 0.55, W, 0, 0.24, 0); b0(0.27, 0.1, 0.22, O, 0, 0.33, -0.05); b0(0.2, 0.08, 0.14, K, 0.04, 0.34, -0.2);   // 胴 (白・茶・黒の三毛)
      for (const [lx, lz] of [[-0.09, 0.2], [0.09, 0.2], [-0.09, -0.2], [0.09, -0.2]]) b0(0.06, 0.14, 0.06, W, lx, 0.07, lz);
      const head = new THREE.Group(); head.position.set(0, 0.46 * S, 0.3 * S); g.add(head);
      b0(0.24, 0.22, 0.22, W, 0, 0, 0, head); b0(0.25, 0.08, 0.2, O, 0.03, 0.08, -0.01, head);
      for (const sd of [-0.07, 0.07]) b0(0.06, 0.08, 0.04, sd < 0 ? K : O, sd, 0.14, 0.02, head);
      const eyeM = glow(lam({ color: 0x9ae070 }), 0x9ae070, 1.2), eyes = [];
      for (const sd of [-0.055, 0.055]) eyes.push(b0(0.04, 0.035, 0.02, eyeM, sd, 0.03, 0.112, head));
      b0(0.03, 0.025, 0.02, lam({ color: 0xe89aa0 }), 0, -0.02, 0.114, head);
      const tail = new THREE.Group(); tail.position.set(0, 0.3 * S, -0.27 * S); g.add(tail); b0(0.05, 0.05, 0.38, O, 0, 0.06, -0.17, tail); tail.rotation.x = -0.6;
      return { g, head, tail, eyes, scr, meow: 8, str: 0 };
    })();
    solid(-2904, -2268, -2872, -2236, 17.2, 18);
    const catAwake = () => !(gameH >= 1 && gameH < 7);
    LM_UPDATERS.push((dt, t) => {
      const c = CAT, awake = catAwake(), dx = P.x - c.g.position.x, dz = P.z - c.g.position.z, d = Math.hypot(dx, dz);
      if (d > 600) return;
      let want = Math.atan2(dx, dz) - c.g.rotation.y; want = Math.atan2(Math.sin(want), Math.cos(want));
      c.head.rotation.y += ((awake ? Math.max(-0.9, Math.min(0.9, want)) : 0) - c.head.rotation.y) * Math.min(1, dt * 2);
      c.head.rotation.x += ((awake ? -0.15 : 0.45) - c.head.rotation.x) * Math.min(1, dt * 2);
      c.tail.rotation.y = Math.sin(t * (awake ? 1.6 : 0.4)) * 0.6;
      for (const e of c.eyes) e.scale.y = awake && Math.sin(t * 0.9) < 0.97 ? 1 : 0.15;   // ときどき瞬き
      c.scr.color.setHex(awake ? 0xffffff : 0x303040);
      if (c.str > 0) { c.str -= dt; c.g.scale.set(1, 1 + Math.sin((1.5 - c.str) / 1.5 * Math.PI) * 0.12, 1); }
      if (awake && d < 90 && (c.meow -= dt) <= 0) { c.meow = 30; c.str = 1.5; toast('🐈 「にゃーん」　巨大三毛猫がこっちを見ている'); }
    });
    // 新宿通り沿い・伊勢丹
    addBuilding(-2775, -2174, -2706, -2112, 34, isetan, { noRoofBox: true });
    for (let x = -2940; x < -2570; x += 18) LM_STREET.push([x, -2197, 0.9], [x, -2175, 0.9]);
    // 歌舞伎町一番街 (赤いネオンのアーチ) と歌舞伎町
    tiles(-2896, -2600, -2884, -2421, '#7a6a60', '#6a5a50', 2);
    {
      const gt = textTex('歌舞伎町一番街', '#b01820', '#fff2a0', 256, 40), red = lam({ map: gt, emissive: 0xffffff, emissiveMap: gt, emissiveIntensity: 0.3 }), gm = lam({ color: 0x8a1a20 }); GLOW.push([red, 1.1]);
      for (const x of [-2897.5, -2882.5]) pushPrism('BRONZE', 'BRONZE', rectPoly(x - 0.4, -2424.4, x + 0.4, -2423.6), 0, 8.4);
      const s = new THREE.Mesh(new THREE.BoxGeometry(16, 2.4, 0.6), [gm, gm, gm, gm, red, red]); s.position.set(-2890, 8.6, -2424); chunkAt(-2890, -2424).group.add(s);
      solid(-2898, -2424.4, -2882, -2423.6, 7.4, 9.8);
    }
    const KR = [...RR, [-2896, -2600, -2884, -2421], [-2862, -2600, -2800, -2466]];
    for (const [x0, x1, face] of [[-2916, -2897, 'e'], [-2883, -2864, 'w']]) for (let z = -2596; z < -2428;) {
      const d = rr(8, 14), f = [x0, z, x1, Math.min(z + d, -2428)], h = rr(12, 30);
      if (okLot(f, RR)) { addBuilding(...f, h, pick([...SHOPS, 'resi2', 'brick'])); addSign(f, face, h); addSign(f, face, h); if (rnd() < 0.5) addAwning(f, face); }
      z += d + 0.6;
    }
    addBuilding(-2860, -2580, -2805, -2525, 225, kabukiT, { noRoofBox: true });             // 東急歌舞伎町タワー
    tiles(-2862, -2520, -2800, -2468, '#a89c90', '#948878', 3);                              // シネシティ広場
    { const v = mesh(new THREE.PlaneGeometry(14, 8), visionMat(3), -2830, 18, -2524.6); v.rotation.y = 0; }
    mixed([-2980, -2600, -2920, -2426], KR); mixed([-2862, -2464, -2800, -2426], KR); mixed([-2862, -2600, -2800, -2584], KR);
    for (let i = 0; i < 40; i++) { const x = rr(-2975, -2805), z = rr(-2595, -2430); if (!inR([-2862, -2580, -2800, -2468], x, z)) SIGNS.push({ x, z, y: rr(6, 12), h: rr(2, 4), rot: rnd() < 0.5 ? 0 : Math.PI / 2, v: Math.floor(rnd() * 5) }); }
    yokocho([-2798, -2596, -2752, -2500], KR, '新宿ゴールデン街');
    shrine([-2748, -2596, -2706, -2496], '花園神社', 3);
    LM_CATS.push([-2727, -2508, 0]);
    // 残りの街区
    const ER = [...RR, [-2980, -2290, -2946, -2130], [-2950, -2262, -2846, -2196], [-2775, -2174, -2706, -2112]];
    mixed([-2980, -2398, -2920, -2296], ER); mixed([-2915, -2398, -2706, -2264], ER);
    office([-2946, -2172, -2780, -1998], ER); mixed([-2780, -2108, -2706, -1998], ER);
    mixed([-2680, -2600, -2565, -2424], ER); mixed([-2680, -2398, -2565, -2198], ER); office([-2680, -2172, -2565, -1998], ER);
    LM_PEOPLE.push([[-2890, -2590, -2890, -2430], 26], [[-2945, -2200, -2570, -2200], 18], [[-2945, -2172, -2570, -2172], 18], [[-2930, -2255, -2900, -2200], 8],
      [[-3074, -2290, -3074, -2145], 12], [[-3420, -2210, -3170, -2210], 10], [[-3100, -2395, -3100, -2330], 8], [[-3780, -2196, -3590, -2196], 6]);

    // ===== 名所の名前・入口・地図 =====
    st.ent = [-3073, -2190]; st.ents = [st.ent, [-2920, -2228]];
    SPOT_AREAS.push(
      ['東京都庁 第一本庁舎', -3555, -2280, -3475, -2130], ['都民広場', -3480, -2246, -3434, -2164], ['東京都庁 第二本庁舎', -3560, -2085, -3465, -2000], ['東京都議会議事堂', -3560, -2400, -3445, -2325],
      ['モード学園コクーンタワー', -3134, -2286, -3086, -2250], ['新宿住友ビル (三角ビル)', -3280, -2406, -3180, -2324], ['新宿三井ビル', -3280, -2300, -3210, -2218],
      ['京王プラザホテル', -3284, -2194, -3182, -2108], ['新宿センタービル', -3410, -2402, -3310, -2326], ['損保ジャパン本社ビル', -3414, -2304, -3306, -2216],
      ['新宿NSビル', -3414, -2198, -3306, -2108], ['新宿野村ビル', -3412, -2088, -3314, -1998], ['新宿アイランドタワー', -3284, -2088, -3176, -1998],
      ['新宿中央公園', -3780, -2404, -3582, -1992], ['新宿駅西口 ロータリー', -3146, -2219, -3074, -2151], ['新宿駅 西口', -3078, -2300, -3030, -2136],
      ['新宿東口の巨大三毛猫', -2905, -2268, -2870, -2236], ['新宿駅 東口', -2985, -2294, -2888, -2194],
      ['歌舞伎町一番街', -2900, -2600, -2880, -2421], ['東急歌舞伎町タワー', -2864, -2584, -2801, -2521], ['シネシティ広場', -2862, -2521, -2800, -2466],
      ['伊勢丹 新宿店', -2779, -2178, -2702, -2108], ['新宿東口 繁華街', -2985, -2404, -2565, -2194], ['西新宿 超高層ビル群', -3432, -2420, -3146, -1972], ['歌舞伎町', -2985, -2620, -2706, -2421], ['新宿三丁目', -2946, -2178, -2565, -1960]);
    LM_LABELS.push(['都庁', -3515, -2205, '🏛', '東京都庁 第一本庁舎'], ['コクーンタワー', -3110, -2290, '🐛', 'モード学園コクーンタワー'], ['三角ビル', -3230, -2352, '🔺', '新宿住友ビル (三角ビル)'],
      ['新宿中央公園', -3680, -2260, '🌳'], ['思い出横丁', -3098, -2363, '🏮'], ['巨大三毛猫', -2884, -2268, '🐈', '新宿東口の巨大三毛猫'], ['歌舞伎町一番街', -2890, -2440, '🌃'],
      ['歌舞伎町タワー', -2832, -2552, '🏙', '東急歌舞伎町タワー'], ['伊勢丹', -2740, -2143, '🛍', '伊勢丹 新宿店'], ['ゴールデン街', -2775, -2548, '🍶', '新宿ゴールデン街'], ['花園神社', -2727, -2546, '⛩']);
    Object.assign(LM_TIPS, { '東京都庁 第一本庁舎': '45階の展望室 (地上202m) は無料。9:30〜22:00 (入室は21:30まで)。北と南の展望室で休みの日がちがう' });
    Object.assign(LM_NOTES, {
      '東京都庁 第一本庁舎': '高さ243m、丹下健三の設計。45階の展望室は無料で上れる (ここでは壁を登ろう)',
      '都民広場': '都庁の前の半円形の広場。ぐるりと列柱が取り囲む',
      'モード学園コクーンタワー': '繭 (コクーン) の形をした高さ約204mの学校のビル',
      '新宿住友ビル (三角ビル)': '上から見ると三角形の「三角ビル」。足元はガラス屋根の三角広場',
      '京王プラザホテル': '1971年開業。西新宿の超高層ビルの第1号',
      '新宿中央公園': '西新宿の高層ビル群の隣の公園。水の広場には人工の滝がある',
      '熊野神社 (十二社)': '新宿中央公園の一角にある古い神社。このあたりの旧地名「十二社 (じゅうにそう)」の由来',
      '思い出横丁': '戦後の闇市から続く線路沿いの飲み屋街。焼き鳥の煙が路地にたちこめる',
      '新宿東口の巨大三毛猫': '街頭ビジョンから飛び出して見える「3D猫」。2021年に登場して話題になった。夜中はおやすみ中',
      '歌舞伎町一番街': '赤いネオンのアーチが目印。眠らない街・歌舞伎町の玄関口',
      '東急歌舞伎町タワー': '2023年開業、高さ約225m。ホテル・劇場・映画館が入る',
      '伊勢丹 新宿店': '1933年に建った本館はアール・デコ様式',
      '新宿ゴールデン街': '木造2階建ての小さな飲み屋が200軒以上ひしめく路地',
      '花園神社': '新宿の総鎮守。11月の酉の市は大にぎわい',
    });
    LM_ACH.push(['tocho', '🏛 都庁のてっぺん', '東京都庁 第一本庁舎の塔の上に立つ', () => P.y > 242 && Math.abs(P.x + 3515) < 30 && Math.abs(P.z + 2205) < 80],
      ['nyan', '🐈 巨大ねこと目が合う', '新宿東口の巨大三毛猫に会いに行く (起きている時間に)', () => catAwake() && Math.hypot(P.x + 2884, P.z + 2248) < 45]);
  },
});
