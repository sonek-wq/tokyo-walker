/* 豊洲 (豊洲市場・千客万来・チームラボプラネッツ・ららぽーと豊洲・豊洲ぐるり公園)
   豊洲の島 (regions/00_geography.js の '豊洲' [1110,-560,1600,200]) の南半分に市場、北にららぽーと。ゆりかもめは x ≒ 1520 を南北に走る
   (市場前 z ≒ 70、新豊洲 z ≒ -170、豊洲 z ≒ -420) */
REGION({
  name: '豊洲',
  towns: [['豊洲六丁目', 1380, 0], ['豊洲二丁目', 1250, -480]],
  labels: [],
  build(r) {
    const M = (key, bg, win, lit, cw = 2, cs = 3, rh = 3, rs = 4) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rs) for (let i = 1; i < 32; i += cs) { x.fillStyle = win; x.fillRect(i, j, cw, rh); y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, j, cw, rh); }
    });
    const water = (cx, cz, rx, rz) => { PONDS.push([cx, cz, rx, rz]); fe(cx, cz, rx, rz, '#2d6585'); };
    LM_ZONES.push(rectPoly(1108, -305, 1505, 200), rectPoly(1534, 12, 1600, 192), rectPoly(1112, -562, 1345, -432));
    fr(1108, -305, 1505, 200, '#a29c92'); fr(1534, 12, 1600, 192, '#a29c92');
    const MKT = M('TY_MKT', '#e4e2dc', '#6a7a86', 0.5, 6, 8, 2, 6), MKT2 = M('TY_MKT2', '#d8dcdc', '#4e6270', 0.5, 4, 6, 2, 5);

    // ===== 豊洲市場 (2018年10月、築地から移転) =====
    addRoads([[1110, -24, 1505, -4, 'ew', '市場前の通り']]);
    tiles(1110, -30, 1505, -24, '#c8c0b0', '#b6ae9e', 2); tiles(1110, -4, 1505, 2, '#c8c0b0', '#b6ae9e', 2);
    for (let x = 1116; x < 1500; x += 12) LM_STREET.push([x, -27, 1.1], [x + 6, -1, 1.1]);
    {
      // 6街区 水産仲卸売場棟 (屋上は緑化広場)
      const B6 = [1250, 20, 1500, 182];
      pushPrism(MKT, 'GRASSTOP', rectPoly(...B6), 0, 28);
      for (let x = B6[0] + 8; x < B6[2]; x += 16) pushPrism('CONC', 'CONC', rectPoly(x - 0.3, B6[1] + 2, x + 0.3, B6[3] - 2), 28, 29.1, { solid: false });
      for (const r of [[B6[0], B6[1], B6[2], B6[1] + 0.4], [B6[0], B6[3] - 0.4, B6[2], B6[3]], [B6[0], B6[1], B6[0] + 0.4, B6[3]], [B6[2] - 0.4, B6[1], B6[2], B6[3]]]) pushPrism('glass', 'CONC', rectPoly(...r), 28, 29.2);
      for (let k = 0; k < 30; k++) bake(lam({ color: 0x3f6a34 }), new THREE.IcosahedronGeometry(rr(1.4, 2.2), 0).translate(rr(B6[0] + 6, B6[2] - 6), 29.4, rr(B6[1] + 6, B6[3] - 6)));
      // 7街区 水産卸売場棟 (マグロのせり) と管理施設棟
      const B7 = [1536, 20, 1596, 182];
      pushPrism(MKT2, 'ROOF', rectPoly(...B7), 0, 26);
      pushPrism(M('TY_ADM', '#c8ccd0', '#46525e', 0.6, 2, 3, 2, 3), 'ROOF', rectPoly(1540, 30, 1592, 70), 26, 34);
      // 5街区 青果棟
      pushPrism(M('TY_SEIKA', '#e0dccf', '#7a6a4a', 0.45, 6, 8, 2, 6), 'ROOF', rectPoly(1250, -150, 1500, -38), 0, 20);
      // ゆりかもめの下をくぐる歩行者デッキ (6街区と7街区をつなぐ)
      pushPrism('CONC', 'CONC', rectPoly(1500, 62, 1536, 78), 7.4, 8.2); for (const x of [1502, 1534]) pushPrism('glass', null, rectPoly(x - 0.2, 62, x + 0.2, 78), 8.2, 9.4, { solid: false });
      for (const z of [62.2, 77.8]) solid(1500, z - 0.2, 1536, z + 0.2, 8.2, 9.3);
      // 屋上緑化広場へのエレベーター
      LM_ACTIONS.push({ at: () => P.y < 3 && Math.hypot(P.x - 1246, P.z - 100) < 5, prompt: () => 'E　屋上緑化広場へ上がる', act: () => lmWarp(1262, 29.2, 100, -Math.PI / 2, '🛗 6街区 屋上緑化広場') });
      LM_ACTIONS.push({ at: () => P.y > 27 && inR(B6, P.x, P.z) && Math.hypot(P.x - 1262, P.z - 100) < 6, prompt: () => 'E　1階へ下りる', act: () => lmWarp(1240, 0, 100, Math.PI / 2, '🛗 1階') });
      pushPrism('glass', 'ROOF', rectPoly(1242, 94, 1250, 106), 0, 31);
      // ターレ (市場の小さな運搬車) が走る
      const TA = [], tm = lam({ color: 0x3a7ac8 }), tb = lam({ color: 0xe8e4dc });
      for (let k = 0; k < 5; k++) { const g = new THREE.Group(); box(1.4, 0.6, 2.4, tb, 0, 0.6, 0, g); box(1.1, 1.2, 0.9, tm, 0, 1.3, 0.8, g); scene.add(g); TA.push({ g, x0: 1258 + k * 45, t: rnd() * 6, w: rr(0.15, 0.25) }); }
      LM_UPDATERS.push((dt, t) => { for (const a of TA) { const u = Math.sin(t * a.w + a.t); a.g.position.set(a.x0 + u * 18, 0, 10); a.g.rotation.y = Math.cos(t * a.w + a.t) > 0 ? Math.PI / 2 : -Math.PI / 2; } });
      LM_PEOPLE.push([[1255, 14, 1495, 14], 14], [[1495, 14, 1255, 14], 10], [[1255, -34, 1495, -34], 8]);
    }
    // ===== 豊洲 千客万来 (2024年開業。江戸の町並みの飲食・物販と温浴施設) =====
    {
      const ED = LM_MAT('TY_EDO', (x, y) => { x.fillStyle = '#6a4a32'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let i = 0; i < 32; i += 2) { x.fillStyle = '#5a3c28'; x.fillRect(i, 0, 1, 32); } for (let i = 2; i < 32; i += 8) { x.fillStyle = '#d8c8a0'; x.fillRect(i, 22, 5, 8); y.fillStyle = '#ffc070'; y.fillRect(i, 22, 5, 8); } x.fillStyle = '#e8e0cc'; for (let i = 1; i < 32; i += 8) x.fillRect(i, 12, 6, 4); });
      pushPrism(ED, 'ROOF', rectPoly(1140, 38, 1240, 122), 0, 9); jRoof('RF2', 1138, 36, 1242, 124, 9, 4, { over: 1.4 });
      const CH = lam({ color: 0xd8382a, emissive: 0xff6040, emissiveIntensity: 0 }); GLOW.push([CH, 0.8]); for (let x = 1145; x < 1238; x += 6) bake(CH, new THREE.CylinderGeometry(0.45, 0.45, 0.9, 8).translate(x, 3.4, 37.4));
      pushPrism(M('TY_ONSEN', '#d8ccb4', '#4e4438', 0.6, 2, 3, 2, 3), 'ROOF', rectPoly(1150, 132, 1232, 180), 0, 42);
      tiles(1134, 26, 1246, 36, '#b8ae98', '#a89e88', 2);
      LM_PEOPLE.push([[1142, 31, 1238, 31], 10]);
    }
    // ===== チームラボプラネッツ TOKYO (2018年開館。会期は2027年末まで) =====
    const TL = [1320, -300, 1470, -190];
    {
      fr(...TL, '#8a8a86');
      const blk = lam({ color: 0x1c1c20 });
      pushPrism(M('TY_TL', '#1e1e22', '#2a2a30', 0, 1, 32, 1, 32), 'ROOF', rectPoly(1326, -296, 1420, -226), 0, 11);
      pushPrism(M('TY_TL', '#1e1e22', '#2a2a30', 0, 1, 32, 1, 32), 'ROOF', rectPoly(1426, -296, 1466, -250), 0, 9);
      fr(1426, -244, 1466, -194, '#5f8a48'); for (let k = 0; k < 16; k++) ROUND.push([rr(1430, 1462), rr(-240, -198), rr(0.8, 1.1)]);   // 屋外の庭のエリア
      const sg = new THREE.MeshBasicMaterial({ map: textTex('teamLab Planets', '#1c1c20', '#f4f4f4', 192, 26) }); mesh(new THREE.PlaneGeometry(16, 2.2), sg, 1373, 7.5, -225.9);
      // 入口の上で色の変わる光 (建物の外の演出)
      const lm = new THREE.MeshBasicMaterial({ color: 0xff40a0 }); mesh(new THREE.BoxGeometry(30, 0.4, 0.2), lm, 1373, 10.2, -225.8);
      LM_UPDATERS.push((dt, t) => { lm.color.setHSL((t * 0.05) % 1, 0.8, 0.55); });
      tiles(1320, -224, 1420, -190, '#c8c0b0', '#b6ae9e', 2);
      LM_PEOPLE.push([[1330, -210, 1415, -210], 10]);
    }
    // ===== 豊洲ぐるり公園 (市場のまわりの水辺の公園) =====
    {
      tiles(1112, 186, 1505, 198, '#c8c0b0', '#b6ae9e', 3); tiles(1112, -300, 1130, 198, '#c8c0b0', '#b6ae9e', 3);
      fr(1132, -300, 1244, -32, '#7a9a5a'); fr(1112, 182, 1505, 186, '#7a9a5a');
      for (let z = -296; z < 194; z += 12) { ROUND.push([1135, z, 1.1]); if (z % 36 === 0) BENCHES.push([1124, z, Math.PI / 2]); LAMPS2.push([1128, z + 6]); }
      for (let x = 1116; x < 1500; x += 12) { if (Math.abs(x - 1350) > 12 && Math.abs(x - 1400) > 14) ROUND.push([x, 184, 1.1]); LAMPS2.push([x + 6, 196]); }
      for (let k = 0; k < 50; k++) { const x = rr(1138, 1240), z = rr(-180, -38); (rnd() < 0.5 ? ROUND : SAKURA).push([x, z, rr(1, 1.3)]); }
      LM_PEOPLE.push([[1120, -290, 1120, 192], 10], [[1120, 192, 1500, 192], 12]);
    }
    // ===== ららぽーと豊洲 (造船所の跡地。ドックとクレーンが残る) =====
    {
      pushPrism(M('TY_LALA', '#e8e4da', '#5a6672', 0.6, 3, 4, 2, 4), 'ROOF', rectPoly(1176, -555, 1335, -440), 0, 22);
      water(1140, -495, 26, 46);
      const red = lam({ color: 0xc83a2a }), wh = lam({ color: 0xece8e0 });
      for (let k = 0; k < 6; k++) bake(k % 2 ? red : wh, new THREE.BoxGeometry(2.4, 5, 2.4).translate(1172, 2.5 + k * 5, -470));
      bake(red, new THREE.BoxGeometry(34, 1.6, 1.6).translate(1160, 31, -470)); bake(wh, new THREE.BoxGeometry(6, 4, 4).translate(1176, 29, -470));
      bake(lam({ color: 0x2a2a2c }), new THREE.BoxGeometry(0.15, 14, 0.15).translate(1146, 23.5, -470));
      solid(1170.8, -471.2, 1173.2, -468.8, 0, 32);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['水産仲卸売場棟 (6街区)', 1250, 20, 1500, 182], ['水産卸売場棟 (マグロのせり)', 1536, 20, 1596, 182], ['青果棟 (5街区)', 1250, -150, 1500, -38], ['豊洲 千客万来', 1134, 26, 1246, 186],
      ['チームラボプラネッツ TOKYO', ...TL], ['ららぽーと豊洲', 1112, -560, 1340, -436], ['豊洲ぐるり公園', 1110, -300, 1132, 200], ['豊洲ぐるり公園', 1110, 182, 1505, 200], ['豊洲市場', 1240, -160, 1600, 190]);
    LM_HEIGHT_AREAS.unshift(['屋上緑化広場 (6街区)', (x, z, y) => y > 27 && y < 33 && inR([1250, 20, 1500, 182], x, z)]);
    LM_LABELS.push(['豊洲市場', 1380, 100, '🐟'], ['マグロのせり', 1566, 120, '🐟', '水産卸売場棟 (マグロのせり)'], ['千客万来', 1190, 80, '🏮', '豊洲 千客万来'], ['チームラボ', 1395, -260, '💡', 'チームラボプラネッツ TOKYO'], ['ららぽーと豊洲', 1255, -497, '🏗']);
    Object.assign(LM_NOTES, {
      '豊洲市場': '2018年10月、築地から83年ぶりに移転して開場した「日本の台所」。水産と青果の卸売市場',
      '水産卸売場棟 (マグロのせり)': '早朝、2階の見学者通路からマグロのせりが見られる。床に並ぶ冷凍マグロは霜で真っ白',
      '水産仲卸売場棟 (6街区)': '仲卸の店が集まる建物。屋上は緑化広場になっている',
      '屋上緑化広場 (6街区)': '市場の屋上の芝生広場。晴海や都心のビル、レインボーブリッジが見える',
      '青果棟 (5街区)': '野菜や果物をあつかう卸売場',
      '豊洲 千客万来': '2024年2月開業。江戸の町並みを再現した飲食・物販の店と、温浴施設がある',
      'チームラボプラネッツ TOKYO': '2018年開館。裸足になって水の中を歩く作品などに、体ごと入り込むミュージアム。2023年度の来館者は250万人を超え、ギネス世界記録に認定された',
      '豊洲ぐるり公園': '市場のまわりをぐるりと囲む水辺の公園。レインボーブリッジや都心のビル群が見える',
      'ららぽーと豊洲': '造船所 (石川島播磨重工業) の跡地。船をつくったドックと大きなクレーンが残っている',
    });
    Object.assign(LM_TIPS, {
      '豊洲市場': '見学者通路は5:00〜17:00で無料。日曜・祝日と休市日 (おもに水曜) は入れない。飲食店は早朝から昼すぎまでが中心',
      '水産卸売場棟 (マグロのせり)': 'せりを間近で見られる見学者デッキは、事前申し込みの抽選制 (5:45〜6:25、無料)',
      'チームラボプラネッツ TOKYO': '館内は裸足。水に入る作品があるので、ひざまでまくれる服装がおすすめ。会期は2027年末まで',
    });
    const seen = new Set();
    LM_UPDATERS.push(() => { if (inR([1240, -160, 1600, 190], P.x, P.z)) seen.add('m'); if (inR(TL, P.x, P.z)) seen.add('t'); if (inR([1134, 26, 1246, 186], P.x, P.z)) seen.add('s'); });
    LM_ACH.push(['toyosu3', '🐟 豊洲めぐり', '豊洲市場・千客万来・チームラボプラネッツをすべて訪ねる', () => seen.size === 3],
      ['okujo', '🌿 市場の屋上', '豊洲市場の屋上緑化広場に上がる', () => P.y > 27 && P.y < 33 && inR([1250, 20, 1500, 182], P.x, P.z)]);
    bakeFlush();
  },
});
