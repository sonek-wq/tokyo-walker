/* 慶應義塾 三田キャンパス (図書館旧館・三田演説館・大銀杏・東門・正門) と慶應仲通り
   田町駅の西。坂を上った「丘の上」のキャンパス。東門から慶應仲通りが田町駅へ、南の正門は桜田通りに面する */
REGION({
  name: '三田',
  towns: [['三田', -1130, 480], ['三田二丁目', -1180, 560]],
  labels: [],
  build(r) {
    const K = [-1202, 418, -1060, 552];   // キャンパス
    const RB = acGothic('KO_REDBRICK', '#a24a34', '#2a2a30', '#e0d6c4', { brick: '#8e3e2c', rowH: 9, step: 5, ww: 2, wh: 6, lit: 0.4 });
    const MOD = acGothic('KO_MOD', '#c2bcb0', '#3e4a56', null, { rowH: 6, step: 3, ww: 2, wh: 3, lit: 0.55 });
    const BR = WALL.BRONZE;
    acRoad([-1210, 556, -1040, 568], 'ew', '桜田通り'); acRoad([-1058, 480, -900, 490], 'ew', '慶應仲通り', { walk: 3, trees: false });
    LM_ZONES.push(rectPoly(...K)); fr(...K, '#b0a898');
    // 慶應仲通り (田町駅へ続く商店街): 両側に小さな店
    for (let x = -1052; x < -906; x += 9) for (const [z0, z1] of [[464, 476], [494, 506]]) {
      const h = rr(8, 14), key = pick(['resi2', 'brick', 'resi', 'office']); pushPrism(key, 'ROOF', rectPoly(x, z0, x + 8, z1), 0, h);
      bake(lam({ color: pick([0xc84a3a, 0x3a7ac8, 0xe0a030, 0x48a068]) }), new THREE.BoxGeometry(7, 0.6, 1.2).translate(x + 4, 3.2, z0 < 480 ? 476.6 : 493.4));
    }
    LM_ZONES.push(rectPoly(-1058, 462, -900, 508));
    // 「丘の上」: キャンパスのふちの石垣
    const kw = (x0, z0, x1, z1) => pushPrism('ISHIGAKI', 'TKSTONE', rectPoly(x0, z0, x1, z1), 0, 2.2);
    kw(K[0], K[1], K[2], K[1] + 1); kw(K[0], K[1], K[0] + 1, K[3]); kw(K[0], K[3] - 1, -1142, K[3]); kw(-1124, K[3] - 1, K[2], K[3]);

    // ===== 東門 (東館のアーチ) =====
    {
      pushPrism(MOD, 'ROOF', rectPoly(-1074, 446, -1060, 478), 0, 26); pushPrism(MOD, 'ROOF', rectPoly(-1074, 492, -1060, 520), 0, 26);
      pushPrism(MOD, 'ROOF', rectPoly(-1074, 478, -1060, 492), 14, 26, { bottom: true });   // 大きなアーチの門 (くぐれる)
      tiles(-1100, 478, -1058, 492, '#cfc6b0', '#c0b6a0', 2);
      LM_PEOPLE.push([[-1056, 485, -1110, 485], 14], [[-1110, 483, -1056, 483], 10]);
    }
    // ===== 図書館旧館 (1912年、赤レンガ。中に福澤諭吉記念 慶應義塾史展示館) =====
    const LB = [-1112, 424, -1078, 460];
    {
      pushPrism(RB, 'ROOF', rectPoly(...LB), 0, 15);
      oHip(AXIS, 'SLATE', LB[0], LB[1], LB[2], LB[3], 15, 5, { over: 0.6 });
      const TX = LB[2] - 3, TZ = LB[3] - 1;   // 八角塔
      pushPrism(RB, 'ROOF', regularPoly(TX, TZ, 5, 8, Math.PI / 8), 0, 24);
      mesh(new THREE.ConeGeometry(5.2, 7, 8).rotateY(Math.PI / 8), WALL.SLATE, TX, 27.5, TZ);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(LB[0] + 12, LB[3], LB[0] + 22, LB[3] + 3), 0, 9);   // 正面玄関
      bake(lam({ color: 0x24201e }), new THREE.BoxGeometry(5, 5.5, 0.3).translate(LB[0] + 17, 2.75, LB[3] + 3.2));
      mesh(new THREE.CircleGeometry(1.8, 16), lam({ color: 0xf0ead8, emissive: 0x403828 }), LB[0] + 17, 12, LB[3] + 0.05);   // 大時計 (TEMPUS FUGIT)
      bake(lam({ color: 0x4a6a9a, emissive: 0x101830 }), new THREE.BoxGeometry(3.4, 5, 0.2).translate(LB[0] + 17, 8.2, LB[3] + 3.1));   // ステンドグラス
    }
    // 三田メディアセンター (図書館新館)・塾監局・校舎
    pushPrism(MOD, 'ROOF', rectPoly(-1118, 516, -1078, 550), 0, 25);
    pushPrism(RB, 'ROOF', rectPoly(-1172, 424, -1124, 446), 0, 14); oHip(AXIS, 'SLATE', -1172, 424, -1124, 446, 14, 4, { over: 0.5 });
    for (const [x0, z0, x1, z1, h] of [[-1198, 506, -1150, 548, 18], [-1198, 424, -1180, 458, 16]]) pushPrism(MOD, 'ROOF', rectPoly(x0, z0, x1, z1), 0, h);
    // ===== 大銀杏 (キャンパスのシンボル。待ち合わせ場所) =====
    const GX = -1138, GZ = 482;
    GINKGO.push([GX, GZ, 2.4]); BENCHES.push([GX - 5, GZ + 6, 0], [GX + 5, GZ + 6, 0]);
    tiles(-1176, 462, -1076, 512, '#cfc6b0', '#c0b6a0', 2); tiles(-1142, 512, -1124, 556, '#cfc6b0', '#c0b6a0', 2);
    LM_PEOPLE.push([[-1170, 490, -1120, 476], 10], [[-1133, 552, -1133, 500], 8]);
    // ===== 三田演説館 (1875年、福澤諭吉が建てた日本初の演説会堂。なまこ壁) =====
    {
      if (!WALL.KO_PLAIN) WALL.KO_PLAIN = lam({ color: 0x55595d });
      pushPrism('KO_PLAIN', 'ROOF', rectPoly(-1196, 466, -1178, 478), 0, 8);
      const nt = tex(32, 32, g => { g.fillStyle = '#55595d'; g.fillRect(0, 0, 32, 32); g.strokeStyle = '#ecebe4'; g.lineWidth = 3;
        for (let k = -32; k <= 64; k += 16) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 32, 32); g.stroke(); g.beginPath(); g.moveTo(k, 32); g.lineTo(k + 32, 0); g.stroke(); } });
      nt.wrapS = nt.wrapT = THREE.RepeatWrapping; nt.needsUpdate = true;
      const nmM = lam({ map: nt }), wf = lam({ color: 0xf0ece0 }), wd = lam({ color: 0x3a4048 });
      const face = (w, cxx, czz, ry) => { const g = new THREE.PlaneGeometry(w, 8), uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / 1.6, uv.getY(i) * 8 / 1.6); bake(nmM, g.rotateY(ry).translate(cxx, 4, czz)); };
      face(18, -1187, 465.8, Math.PI); face(18, -1187, 478.2, 0); face(12, -1196.2, 472, -Math.PI / 2); face(12, -1177.8, 472, Math.PI / 2);
      for (const z of [465.6, 478.4]) for (let x = -1193; x <= -1181; x += 4) for (const y of [2.2, 5.8]) { bake(wf, new THREE.BoxGeometry(1.8, 2.4, 0.2).translate(x, y, z)); bake(wd, new THREE.BoxGeometry(1.2, 1.8, 0.3).translate(x, y, z)); }
      oHip(AXIS, 'RF0', -1196, 466, -1178, 478, 8, 3.2, { over: 0.8 });
      for (let k = 0; k < 12; k++) ROUND.push([rr(-1200, -1176), rr(480, 500), rr(0.9, 1.2)]);
    }
    // 正門 (桜田通り側)
    for (const x of [-1144, -1123]) pushPrism('TKSTONE', 'TKSTONE', rectPoly(x, K[3] - 1.5, x + 1.6, K[3]), 0, 3.4);
    for (let k = 0; k < 40; k++) { const x = rr(K[0] + 3, K[2] - 16), z = rr(K[1] + 3, K[3] - 3); if (inR([-1180, 460, -1074, 515], x, z) || inR([-1146, 500, -1120, 556], x, z) || inR([-1120, 514, -1076, 552], x, z) || !acFree(x, z)) continue; (rnd() < 0.5 ? ROUND : GINKGO).push([x, z, rr(0.9, 1.2)]); }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['図書館旧館 (慶應義塾史展示館)', LB[0] - 2, LB[1] - 2, LB[2] + 6, LB[3] + 5], ['三田演説館', -1200, 462, -1174, 482], ['大銀杏 (慶應)', GX - 9, GZ - 9, GX + 9, GZ + 9],
      ['慶應義塾 東門', -1076, 476, -1058, 494], ['慶應義塾 正門', -1146, K[3] - 8, -1120, K[3] + 4], ['慶應仲通り', -1058, 462, -900, 508], ['慶應義塾 三田キャンパス', ...K]);
    LM_LABELS.push(['慶應義塾', -1130, 500, '🎓', '慶應義塾 三田キャンパス'], ['図書館旧館', -1095, 442, '📚', '図書館旧館 (慶應義塾史展示館)'], ['三田演説館', -1187, 472, '🎤'], ['慶應仲通り', -980, 485, '🍜']);
    Object.assign(LM_NOTES, {
      '慶應義塾 三田キャンパス': '1871年に慶應義塾が移ってきた場所。キャンパスへの道はすべて坂道で、応援歌でも「丘の上」と歌われる',
      '図書館旧館 (慶應義塾史展示館)': '1912年完成の赤レンガの図書館で、国の重要文化財。正面の大時計の文字盤には、数字の代わりにラテン語「TEMPUS FUGIT (時は過ぎゆく)」',
      '三田演説館': '1875年、福澤諭吉が建てた日本初の演説会堂。なまこ壁と洋風の窓を合わせた和洋折衷の建物で、国の重要文化財',
      '大銀杏 (慶應)': '三田キャンパスのシンボル。学生の待ち合わせ場所になっている',
      '慶應義塾 東門': '田町駅から慶應仲通りを抜けると東門。門を出ると東京タワーが見える',
      '慶應仲通り': '田町駅とキャンパスを結ぶ商店街。学生向けの飲食店が多い',
    });
    Object.assign(LM_TIPS, {
      '図書館旧館 (慶應義塾史展示館)': '10:00〜18:00 (入館17:30まで)。日曜・祝日は休館',
      '三田演説館': '建物の中は見学できない',
      '慶應義塾 正門': '正門の西側の「三田インフォメーションプラザ」で公式グッズを販売 (平日・土 10:00〜18:00、日祝 10:00〜16:00)',
    });
    LM_ACH.push(['enzetsu', '🎤 演説のはじまり', '三田演説館を訪ねる', () => inR([-1200, 462, -1174, 482], P.x, P.z)]);
    bakeFlush();
  },
});
