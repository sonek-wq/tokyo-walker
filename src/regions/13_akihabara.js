/* 秋葉原 (電気街・中央通りの歩行者天国・ラジオ会館・UDX・ヨドバシAkiba・万世橋とマーチエキュート (旧万世橋駅)・神田明神)
   山手線の高架 (x ≒ 250〜300) の西が電気街。中央通り (x ≒ 190) は日曜の午後に歩行者天国 (外神田5丁目〜万世橋)
   神田川 (regions/00_geography.js) の南岸に旧万世橋駅の赤レンガ高架。西の本郷通り沿いに神田明神 */
REGION({
  name: '秋葉原',
  towns: [['外神田', 160, -2780], ['外神田一丁目', 230, -2700], ['神田須田町', 170, -2540], ['神田佐久間町', 400, -2660]],
  labels: [],
  build(r) {
    const HOKO_ON = () => DOW === 0 && gameH >= 13 && gameH < (MONTH >= 4 && MONTH <= 9 ? 18 : 17);
    const CX0 = 180, CX1 = 200, CZ0 = -2925, CZ1 = -2642;   // 中央通り (歩行者天国の区間)
    acRoad([CX0, CZ0, CX1, CZ1], 'ns', '中央通り (秋葉原)', { trees: false });
    acRoad([CX0, -2604, CX1, -2430], 'ns', '中央通り (須田町)');
    HOKO_ZONES.push({ name: '秋葉原 中央通り (歩行者天国)', r: [CX0, CZ0, CX1, CZ1], on: HOKO_ON });
    for (let k = 0; k < 6; k++) { const x = CX0 + 2 + k * 3.2; LM_PEOPLE.push([[x, CZ0 + 4, x + rr(-1, 1), CZ1 - 4], 9, HOKO_ON]); }
    acRoad([112, -2925, 120, -2650], 'ns', '電気街の裏通り', { walk: 2, trees: false });
    // ===== 電気街のビル (派手な看板。夜は光る) =====
    const SH = [['#3a3e48', '#e04050'], ['#d8d4cc', '#2a8ad8'], ['#2e3238', '#f0c020'], ['#e8e2d6', '#e06a20'], ['#40444c', '#30b070'], ['#c8ccd2', '#c040a0']].map(([bg, band], i) => LM_MAT('AKB_SHOP' + i, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 2; j < 30; j += 5) for (let i2 = 1; i2 < 32; i2 += 4) { x.fillStyle = '#4e6070'; x.fillRect(i2, j, 3, 3); y.fillStyle = rnd() < 0.6 ? pick(LIT) : '#000'; y.fillRect(i2, j, 3, 3); }
      x.fillStyle = band; x.fillRect(12, 0, 6, 32); y.fillStyle = band; y.fillRect(12, 0, 6, 32);   // 縦の看板
      x.fillStyle = '#ffffff'; for (let j = 3; j < 30; j += 5) x.fillRect(14, j, 2, 3);
    }));
    const WORDS = ['PC', 'ゲーム', 'ホビー', 'アニメ', '電子部品', 'カード', 'コミック', 'オーディオ', 'カメラ', 'フィギュア', 'レトロゲーム', 'パーツ', 'スマホ', 'カフェ', '同人誌', 'プラモデル'];
    const COLS = ['#e04050', '#2a8ad8', '#f0c020', '#e06a20', '#30b070', '#c040a0', '#f0f0f0'];
    const signMats = WORDS.map((w, i) => { const c = COLS[i % COLS.length], dark = c === '#f0c020' || c === '#f0f0f0'; return glow(new THREE.MeshLambertMaterial({ map: textTex(w, c, dark ? '#202020' : '#ffffff', 128, 24) }), c, 0.9); });
    const AWN = [0xe04050, 0x2a8ad8, 0xf0c020, 0x30b070].map(c => lam({ color: c }));
    const strip = (x0, x1, z0, z1, face, wmin = 8, wmax = 14, hmin = 14, hmax = 34) => {   // face: 'E' / 'W' (中央通りに向いた側)
      for (let z = z0; z < z1 - 6;) {
        const w = Math.min(rr(wmin, wmax), z1 - z), h = rr(hmin, hmax), m = 'AKB_SHOP' + ((rnd() * 6) | 0);
        pushPrism(m, 'ROOF', rectPoly(x0, z, x1, z + w), 0, h);
        const fx = face === 'E' ? x1 + 0.3 : x0 - 0.3, ry = face === 'E' ? Math.PI / 2 : -Math.PI / 2;
        for (let k = 0; k < 2; k++) { const sm = pick(signMats), y = rr(5, Math.max(6, h - 4)); bake(sm, new THREE.PlaneGeometry(Math.min(w - 1, 8), 1.6).rotateY(ry).translate(fx + (face === 'E' ? 0.05 * k : -0.05 * k), y, z + w / 2)); }
        bake(pick(AWN), new THREE.BoxGeometry(face === 'E' ? 1.2 : 1.2, 0.5, w - 0.6).translate(face === 'E' ? x1 + 0.6 : x0 - 0.6, 3.2, z + w / 2));   // 店先のひさし
        z += w;
      }
    };
    LM_ZONES.push(rectPoly(122, -2925, 176, -2690), rectPoly(122, -2665, 176, -2645), rectPoly(204, -2925, 252, -2688), rectPoly(204, -2666, 252, -2645));   // (z -2688〜-2666 は総武線の高架)
    strip(124, 174, -2922, -2692, 'E'); strip(124, 174, -2664, -2648, 'E', 8, 14, 10, 18);
    strip(206, 248, -2922, -2836, 'W', 8, 14, 16, 40);
    strip(206, 236, -2664, -2648, 'W', 8, 12, 10, 16);
    // ラジオ会館 (電気街口の前)
    pushPrism('AKB_SHOP2', 'ROOF', rectPoly(206, -2714, 238, -2688), 0, 42);
    mesh(new THREE.PlaneGeometry(22, 3), glow(new THREE.MeshLambertMaterial({ map: textTex('ラジオ会館', '#d82a2a', '#ffffff', 160, 24) }), '#d82a2a', 0.9), 205.6, 36, -2701, -Math.PI / 2);
    // 秋葉原UDX と駅前広場
    pushPrism('glass', 'ROOF', rectPoly(208, -2830, 250, -2770), 0, 30); pushPrism('glass', 'ROOF', rectPoly(214, -2822, 246, -2786), 30, 100);
    tiles(204, -2768, 262, -2716, '#cfc6b0', '#c0b6a0', 2); LM_ZONES.push(rectPoly(204, -2768, 262, -2716));
    LM_PEOPLE.push([[206, -2742, 258, -2742], 14], [[230, -2766, 230, -2718], 8], [[200, -2700, 262, -2700], 8]);
    // ヨドバシAkiba (駅の東)
    LM_ZONES.push(rectPoly(354, -2776, 432, -2694)); pushPrism('glassDark', 'ROOF', rectPoly(356, -2774, 430, -2696), 0, 40);
    mesh(new THREE.PlaneGeometry(30, 3), glow(new THREE.MeshLambertMaterial({ map: textTex('AKIBA', '#202020', '#ffffff', 128, 24) }), '#ffffff', 0.7), 355.6, 34, -2735, -Math.PI / 2);

    // ===== 万世橋とマーチエキュート神田万世橋 (1912年完成の赤レンガ高架。旧万世橋駅) =====
    {
      const ux = 0.842, uz = 0.539, vx = -0.539, vz = 0.842, F = frame(150 + vx * 18, -2652 + vz * 18, ux, uz, vx, vz);
      const BRK = acGothic('AKB_BRICK', '#a24a34', '#2a2224', null, { brick: '#8e3e2c', rowH: 16, step: 8, ww: 6, wh: 12, lit: 0.6 });
      pushPrism(BRK, 'CONC', F.rect(-28, 0, 36, 14), 0, 8);
      for (const v of [2.5, 4, 10, 11.5]) pushPrism('RAIL', null, F.rect(-28, v - 0.1, 36, v + 0.1), 8, 8.25, { solid: false });   // 中央線の線路
      pushPrism('glass', 'ROOF', F.rect(2, 5.4, 26, 8.6), 8, 11, { solid: false });   // 2013プラットホーム (ガラスの展望デッキ)
      LM_ZONES.push(F.rect(-30, -1, 38, 16));
      const [sx, sz] = F.w(14, 15); stairs([sx - 2, sz - 1, sx + 2, sz + 5], 8, 'z-');
      LM_ACTIONS.push({ at: () => P.y < 3 && Math.hypot(P.x - sx, P.z - (sz + 3)) < 5, prompt: () => 'E　2013プラットホーム (展望デッキ) へ上がる', act: () => { const [x, z] = F.w(14, 7); lmWarp(x, 8.3, z, Math.atan2(-ux, -uz), '🚃 2013プラットホーム'); } });
      LM_HEIGHT_AREAS.unshift(['2013プラットホーム (マーチエキュート)', (x, z, y) => y > 7 && y < 12 && inPoly(F.rect(-28, 0, 36, 14), x, z)]);
      SPOT_AREAS.push(['マーチエキュート神田万世橋', ...polyBB(F.rect(-28, 0, 36, 16))]);
    }

    // ===== 神田明神 (神田神社。江戸総鎮守) =====
    const MZ = -2918;
    {
      const K = [36, -2965, 120, -2878];
      LM_ZONES.push(rectPoly(...K)); fr(...K, '#b8ae98');
      tiles(32, MZ - 4, 60, MZ + 4, '#cfc6b0', '#c0b6a0', 2);
      myojinTorii(34, MZ, false, 7.5, 7, WALL.BRONZE, r);   // 表参道の銅の鳥居
      // 隨神門 (朱塗りの二層の門)
      const SHU = lam({ color: 0xc8382a }); if (!WALL.AKB_SHU) WALL.AKB_SHU = SHU;
      for (const dz of [-6, -2.5, 2.5, 6]) pushPrism('AKB_SHU', 'AKB_SHU', rectPoly(59, MZ + dz - 0.5, 60, MZ + dz + 0.5), 0, 6);
      jRoof('RF_COPPER', 55.5, MZ - 8, 63.5, MZ + 8, 6, 2.2, { over: 0.8, kind: 'band' });
      pushPrism('AKB_SHU', 'AKB_SHU', rectPoly(57, MZ - 6.5, 62, MZ + 6.5), 8.2, 11);
      jRoof('RF_COPPER', 55, MZ - 8.5, 64, MZ + 8.5, 11, 3.2, { over: 1, kind: 'irimoya' });
      tiles(60, MZ - 18, 92, MZ + 18, '#d4ccb6', '#c4bca6', 3);
      // 御社殿 (権現造の朱の社殿)
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(90, MZ - 13, 114, MZ + 13), 0, 1);
      pushPrism('AKB_SHU', 'ROOF', rectPoly(92, MZ - 11, 112, MZ + 11), 1, 8);
      jRoof('RF_COPPER', 90, MZ - 13, 114, MZ + 13, 8, 5.5, { over: 1.6, kind: 'irimoya' });
      jRoof('RF_COPPER', 86, MZ - 6, 93, MZ + 6, 5, 2.4, { over: 0.6, kind: 'irimoya' });   // 拝殿の向拝
      for (const dz of [-3, 3]) bake(lam({ color: 0xd8b040, emissive: 0x302000 }), new THREE.BoxGeometry(0.3, 4, 0.3).translate(89.5, 3, MZ + dz));
      // 文化交流館 EDOCCO と、御神馬のいる馬舎
      pushPrism(acGothic('AKB_EDOCCO', '#e8e2d4', '#4e5a66', '#c8bca8', { rowH: 8, step: 4, ww: 2, wh: 4 }), 'ROOF', rectPoly(40, -2900, 78, -2882), 0, 12);
      pushPrism('WOOD', 'ROOF', rectPoly(96, -2944, 108, -2936), 0, 3); const pony = lam({ color: 0xe8e4dc });
      bake(pony, new THREE.BoxGeometry(1.4, 0.6, 0.5).translate(100, 1.0, -2932)); bake(pony, new THREE.BoxGeometry(0.4, 0.6, 0.4).translate(100.8, 1.5, -2932));
      for (const dx of [-0.5, 0.5]) for (const dz of [-0.18, 0.18]) bake(pony, new THREE.BoxGeometry(0.15, 0.7, 0.15).translate(100 + dx, 0.35, -2932 + dz));
      for (let k = 0; k < 40; k++) { const x = rr(K[0] + 2, K[2] - 2), z = rr(K[1] + 2, K[3] - 2); if (Math.abs(z - MZ) < 20 && x > 30 && x < 116) continue; if (!acFree(x, z)) continue; (rnd() < 0.5 ? ROUND : GINKGO).push([x, z, rr(0.9, 1.3)]); }
      LM_PEOPLE.push([[36, MZ - 2, 88, MZ - 2], 10], [[88, MZ + 2, 36, MZ + 2], 8]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['ラジオ会館', 204, -2716, 240, -2686], ['秋葉原UDX', 206, -2832, 252, -2768], ['秋葉原 電気街口の広場', 204, -2768, 262, -2716], ['ヨドバシAkiba', 354, -2776, 432, -2694],
      ['神田明神 御社殿', 86, MZ - 14, 116, MZ + 14], ['神田明神 隨神門', 54, MZ - 9, 65, MZ + 9], ['神田明神 (神田神社)', 30, -2965, 120, -2878], ['秋葉原電気街', 112, -2925, 252, -2645]);
    LM_LABELS.push(['秋葉原電気街', 160, -2800, '🎮', '秋葉原電気街'], ['ラジオ会館', 222, -2701, '📻'], ['UDX', 230, -2800, '🏢', '秋葉原UDX'], ['ヨドバシAkiba', 393, -2735, '🛒'],
      ['マーチエキュート', 160, -2620, '🧱', 'マーチエキュート神田万世橋'], ['神田明神', 100, MZ, '⛩', '神田明神 (神田神社)']);
    Object.assign(LM_NOTES, {
      '秋葉原電気街': 'かつては駅のまわり約1km四方に1,000軒もの電気店がひしめいた街。いまはPC・アニメ・ゲーム・フィギュアの専門店が集まる「世界のアキバ」',
      '秋葉原 中央通り (歩行者天国)': '外神田5丁目から万世橋までの約570mが歩行者天国になる',
      '中央通り (秋葉原)': '日曜の午後は車が通れなくなり、歩行者天国になる',
      'ラジオ会館': '電気街口の目の前に建つ、ホビーやフィギュアの店が集まるビル',
      '秋葉原 電気街口の広場': '秋葉原駅の電気街口。ここから中央通りへ電気街が広がる',
      'マーチエキュート神田万世橋': '1912年にできた赤レンガの高架橋 (旧万世橋駅)。駅は1943年に役目を終え、2013年にお店やカフェの入る施設になった',
      '2013プラットホーム (マーチエキュート)': '旧万世橋駅のホームを展望デッキにした場所。ガラスのデッキのすぐ両側を中央線の電車が走る',
      '神田明神 (神田神社)': '730年の創建と伝わる「江戸総鎮守」。神田・日本橋・秋葉原など108の町の氏神さまで、だいこく様・えびす様・まさかど様をまつる',
      '神田明神 隨神門': '朱塗りの二層の門。外側には朱雀・白虎・青龍・玄武の四神の彫刻がある',
      '神田明神 御社殿': '商売繁昌のご利益で知られる。2年に1度、5月に「神田祭」が開かれる。境内には御神馬の「あかり」ちゃんもいる',
    });
    Object.assign(LM_TIPS, {
      '秋葉原 中央通り (歩行者天国)': '日曜 13:00〜18:00 (4〜9月) / 13:00〜17:00 (10〜3月)。雨や強風の日は中止になることがある',
      '中央通り (秋葉原)': '歩行者天国は日曜 13:00〜18:00 (4〜9月) / 13:00〜17:00 (10〜3月)',
      'マーチエキュート神田万世橋': '2013プラットホームは入場無料。11:00〜22:00 (日祝は20:30まで)',
      '神田明神 (神田神社)': '境内は24時間お参りできる。お守りや御朱印は文化交流館「EDOCCO」で',
    });
    LM_ACH.push(['akihoko', '🎮 アキバの歩行者天国', '日曜午後の秋葉原 中央通りを歩く', () => HOKO_ON() && P.y < 3 && inR([CX0, CZ0, CX1, CZ1], P.x, P.z)],
      ['myojin', '⛩ 江戸総鎮守', '神田明神の御社殿にお参りする', () => inR([86, MZ - 14, 116, MZ + 14], P.x, P.z)]);
    bakeFlush();
  },
});
