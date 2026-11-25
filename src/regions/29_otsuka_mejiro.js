/* 大塚・雑司が谷・目白 (大塚: 南口の広場トランパル大塚・都電とバラ・天祖神社 / 雑司が谷鬼子母神のケヤキ並木と大イチョウ /
   目白: 学習院 (正門・史料館・厩舎と森)・目白庭園)
   都電 (東京さくらトラム) の線路と停留場は regions/01_rail_lines.js。座標は山手線の駅にそろえる (u = 線路の向き、v = 環の外向き) */
REGION({
  name: '大塚・目白',
  stations: ['大塚', '目白'],   // 駅のまわりを作り込んだ駅 (ファストトラベルで緑の枠)
  towns: [['南大塚', -1840, -4420], ['雑司が谷', -2520, -3820], ['目白', -2860, -3960]],
  labels: [],
  build(r) {
    const WH = lam({ color: 0xf0ece0 }), STONE = lam({ color: 0x9a968c }), RED = lam({ color: 0xc8382a });
    const ROSE_ON = true;   // 都電沿いのバラはいつも咲いている姿にする

    // ======================= 大塚 =======================
    const A = stnFrame('大塚');
    // ---- 南口の駅前広場 (トランパル大塚) と大鳥居
    LM_ZONES.push(A.rect(-6, -18, 34, -54)); oTiles(A, -6, -18, 34, -54, '#c8c0b0', '#b8b0a0', 3);
    myojinTorii(...A.w(14, -48), Math.abs(A.ux) > Math.abs(A.uz), 6.5, 6, lam({ color: 0x8a8478 }), 0.45);   // 天祖神社の大鳥居 (石)
    for (let k = 0; k < 6; k++) BENCHES.push([...A.w(-2 + k * 6, -24), Math.atan2(-A.vx, -A.vz)]);
    LM_PEOPLE.push([[...A.w(-4, -30), ...A.w(32, -30)], 10], [[...A.w(14, -20), ...A.w(14, -52)], 6]);
    // ---- 都電の線路沿いのバラ (都内でいちばん品種が多いといわれる)
    {
      const TD = RAIL_LINES.find(l => l.id === 'toden').pts, cols = [0xd8304a, 0xf07090, 0xf4e0a0, 0xffffff, 0xe85a2a, 0xc83a8a];
      for (let i = 0; i + 1 < TD.length; i++) {
        const [ax, az] = TD[i], [bx, bz] = TD[i + 1], l = Math.hypot(bx - ax, bz - az); if (!l) continue;
        const mx = (ax + bx) / 2, mz = (az + bz) / 2; if (Math.hypot(mx + 1840, mz + 4460) > 260) continue;   // 大塚駅のまわりだけ
        const ux = (bx - ax) / l, uz = (bz - az) / l;
        for (let t = 0; t < l; t += 2.4) for (const sd of [-1, 1]) {
          const x = ax + ux * t - uz * sd * 7.2, z = az + uz * t + ux * sd * 7.2; if (ringNearest(x, z)?.d < 12) continue;
          bake(lam({ color: ROSE_ON ? cols[(i * 7 + Math.floor(t)) % cols.length] : 0x3e6a34 }), new THREE.SphereGeometry(0.75, 5, 4).scale(1, 0.8, 1).translate(x, 0.6, z));
        }
      }
    }
    // ---- 天祖神社 (旧巣鴨村の鎮守。子育て狛犬と、樹齢600年といわれる夫婦銀杏)
    const TS = A.rect(-6, -60, 30, -104);
    LM_ZONES.push(TS); oTiles(A, -6, -60, 30, -104, '#cdc3ae', '#bdb39e', 2);
    {
      myojinTorii(...A.w(12, -61), Math.abs(A.ux) > Math.abs(A.uz), 4.6, 4.4, lam({ color: 0x8a8478 }), 0.3);
      oBox(A, 'WOOD', 2, -86, 22, -100, 0, 5); oHip(A, 'RF_COPPER', 1, -85, 23, -101, 5, 3.6, { over: 0.8 });
      for (const sd of [-1, 1]) {   // 子育て狛犬 (足もとに子どもの狛犬)
        const [x, z] = A.w(12 + sd * 4, -70);
        pushPrism('TKSTONE', 'TKSTONE', regularPoly(x, z, 0.8, 4), 0, 1.0);
        bake(STONE, new THREE.BoxGeometry(0.7, 1.0, 1.1).translate(x, 1.5, z)); bake(STONE, new THREE.SphereGeometry(0.42, 6, 4).translate(x, 2.2, z));
        bake(STONE, new THREE.SphereGeometry(0.25, 5, 4).translate(x + 0.3, 1.25, z + 0.3));
      }
      for (const du of [-1, 1]) { const [x, z] = A.w(12 + du * 10, -80); GINKGO.push([x, z, 2.0]); }   // 夫婦銀杏
      hill(...A.w(26, -98), 3.6, 1.4, { key: 'TKSTONE' });   // 小さな富士塚
      LM_PEOPLE.push([[...A.w(12, -60), ...A.w(12, -84)], 5]);
    }

    // ======================= 雑司が谷鬼子母神 =======================
    const KS = [-2552, -3836, -2500, -3770], KX = (KS[0] + KS[2]) / 2;
    LM_ZONES.push(rectPoly(...KS), rectPoly(KS[2], -3808, -2432, -3796)); fr(...KS, '#cbbfa6'); fr(KS[2], -3808, -2432, -3796, '#c8bca4');
    {
      for (let x = KS[2] + 4; x < -2436; x += 8) for (const z of [-3811, -3793]) ROUND.push([x, z, 1.6]);   // 参道のケヤキ並木
      oBox(frame(KX, -3800, 1, 0, 0, 1), 'WOOD', -10, -12, 10, 12, 0, 6);
      jRoof('RF0', KX - 11, -3813, KX + 11, -3787, 6, 5, { over: 1.4 });
      GINKGO.push([KX + 4, -3826, 2.8], [KX - 14, -3780, 1.6]);   // 大イチョウ (樹齢約600年以上)
      for (let k = 0; k < 4; k++) pushPrism('WOOD', 'ROOF', rectPoly(KS[0] + 3 + k * 5, -3834, KS[0] + 7 + k * 5, -3830), 0, 2.4);   // 駄菓子屋など
      LM_PEOPLE.push([[-2436, -3802, KS[2], -3802], 6]);
    }

    // ======================= 目白 =======================
    const J = stnFrame('目白');
    akRoad(J.w(-30, 160), J.w(-30, -270), 14, '目白通り', { trees: true });
    // ---- 学習院 (1908年に目白へ。正門・史料館・厩舎など7棟が国の登録有形文化財)
    const GK = J.rect(-12, -40, 150, -200);
    LM_ZONES.push(GK); polyFr(GK, '#7a9a5a');
    {
      const BRK = acGothic('MJ_BRK', '#9a5a3e', '#2e2a28', '#d8c8a8', { rowH: 7, step: 5, ww: 2, wh: 4, lit: 0.4, brick: '#7a4228' });
      const MOD = acGothic('MJ_MOD', '#c8c4b8', '#3e4652', null, { rowH: 4, step: 3, ww: 2, wh: 3, lit: 0.55 });
      for (const v of [-58, -78]) oBox(J, 'TKSTONE', -12, v - 0.8, -10, v + 0.8, 0, 3.4);   // 正門の門柱
      oTiles(J, -12, -60, 30, -76, '#c8c0ae', '#b8b09e', 2);
      oBox(J, 'WOOD', 30, -50, 60, -66, 0, 7.5); oHip(J, 'RF0', 29, -49, 61, -67, 7.5, 3.4, { over: 0.6 });     // 史料館 (旧皇族寮。木造2階)
      oBox(J, BRK, 70, -46, 110, -66, 0, 10); oHip(J, 'RF0', 69, -45, 111, -67, 10, 3, { over: 0.4 });          // 北別館 (旧図書館)
      oBox(J, 'WOOD', 116, -170, 146, -180, 0, 4); oHip(J, 'RF0', 115, -169, 147, -181, 4, 2.4, { over: 0.6 });  // 厩舎
      oBox(J, MOD, 30, -96, 74, -124, 0, 22); oBox(J, MOD, 84, -96, 128, -124, 0, 18);
      for (let k = 0; k < 140; k++) { const [x, z] = J.w(rr(-8, 146), rr(-130, -198)); if (inPoly(J.rect(112, -166, 150, -184), x, z)) continue; (rnd() < 0.4 ? ROUND : rnd() < 0.5 ? SAKURA : MAPLES).push([x, z, rr(1.0, 1.4)]); }   // 学習院の森
      LM_PEOPLE.push([[...J.w(-10, -68), ...J.w(110, -82)], 14], [[...J.w(30, -88), ...J.w(130, -88)], 10]);
    }
    // ---- 目白庭園 (池のほとりの数寄屋「赤鳥庵」と六角浮見堂。紅葉の時期は夜のライトアップ)
    const MG = J.rect(40, 88, 104, 150);
    LM_ZONES.push(MG); polyFr(MG, '#6c9050');
    {
      for (const [u0, v0, u1, v1] of [[40, 88, 104, 89], [40, 149, 104, 150], [40, 88, 41, 150], [103, 88, 104, 112], [103, 126, 104, 150]]) oBox(J, 'IB_BLK' in WALL ? 'IB_BLK' : 'WOOD', u0, v0, u1, v1, 0, 2.6);
      oBox(J, 'WOOD', 97, 112, 104, 126, 0, 4); oHip(J, 'RF0', 96, 111, 105, 127, 4, 2, { over: 0.4 });   // 長屋門
      const [px, pz] = J.w(70, 118); fe(px, pz, 18, 14, '#a89c7c'); PONDS.push([px, pz, 16, 12]); fe(px, pz, 16, 12, '#355e58');
      oBox(J, 'WOOD', 48, 130, 66, 146, 0, 3.6); oHip(J, 'RF0', 47, 129, 67, 147, 3.6, 2.2, { over: 0.8 });   // 赤鳥庵
      const [hx, hz] = J.w(78, 112); pushPrism('WOOD', 'WOOD', regularPoly(hx, hz, 2.6, 6), 0, 0.5); pushPrism('ROOF', 'ROOF', regularPoly(hx, hz, 3.0, 6), 3.0, 3.4, { solid: false });   // 六角浮見堂
      for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; bake(lam({ color: 0x5a4632 }), new THREE.CylinderGeometry(0.12, 0.12, 2.5, 4).translate(hx + Math.cos(a) * 2.3, 1.75, hz + Math.sin(a) * 2.3)); }
      { const [qx, qz] = J.w(80, 100); POND_LAND.push(['e', hx, hz, 3.2, 3.2], ['r', Math.min(hx, qx) - 1.2, Math.min(hz, qz) - 1.2, Math.max(hx, qx) + 1.2, Math.max(hz, qz) + 1.2]); }   // 浮見堂へ渡る
      const LIT = true, LL = glow(lam({ color: 0xffe0a0 }), '#ffc870', 1);
      for (let k = 0; k < 40; k++) { const [x, z] = J.w(rr(43, 101), rr(91, 147)); if (Math.hypot(x - px, z - pz) < 17 || inPoly(J.rect(46, 128, 68, 148), x, z)) continue; MAPLES.push([x, z, rr(0.9, 1.2)]); if (LIT && k % 2) bake(LL, new THREE.SphereGeometry(0.28, 4, 3).translate(x, 0.5, z)); }
      LM_PEOPLE.push([[...J.w(100, 119), ...J.w(56, 104)], 4]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    rotSpots(A, [['子育て狛犬 (天祖神社)', 4, -66, 20, -74], ['天祖神社 (大塚)', -6, -60, 30, -104], ['トランパル大塚 (大塚駅南口)', -6, -18, 34, -54]]);
    SPOT_AREAS.unshift(['大イチョウ (鬼子母神)', KX - 4, -3834, KX + 12, -3818]); SPOT_AREAS.push(['雑司ヶ谷鬼子母神', ...KS], ['鬼子母神の参道 (ケヤキ並木)', KS[2], -3814, -2432, -3790]);
    rotSpots(J, [['学習院大学 史料館', 30, -50, 60, -66], ['学習院 (目白キャンパス)', -12, -40, 150, -200], ['赤鳥庵 (目白庭園)', 46, 128, 68, 148], ['目白庭園', 40, 88, 104, 150]]);
    LM_LABELS.push(['トランパル大塚', ...A.w(14, -36), '🚋', 'トランパル大塚 (大塚駅南口)'], ['天祖神社', ...A.w(12, -92), '⛩', '天祖神社 (大塚)'], ['鬼子母神', KX, -3800, '🌳', '雑司ヶ谷鬼子母神'], ['学習院', ...J.w(70, -150), '🎓', '学習院 (目白キャンパス)'], ['目白庭園', ...J.w(70, 118), '🍁']);
    Object.assign(LM_NOTES, {
      '大塚駅': '大塚駅の南口の前を都電 (東京さくらトラム) が走り、山手線の高架の下をくぐっていく。都電は早稲田〜三ノ輪橋の約12kmを1両の電車で結ぶ',
      'トランパル大塚 (大塚駅南口)': '大塚駅南口の駅前広場。阿波踊りやバラまつりなど街のお祭りの会場になる。都電の沿線のバラは都内でいちばん品種が多いといわれ、春 (5月) と秋に咲く',
      '天祖神社 (大塚)': '鎌倉時代の末に伊勢から天照大御神を迎えた、旧巣鴨村の鎮守。樹齢600年といわれる夫婦銀杏や富士塚がある',
      '子育て狛犬 (天祖神社)': '1852年 (嘉永5年) に奉納された狛犬。足もとで子どもの狛犬が甘えている',
      '雑司ヶ谷鬼子母神': '子育ての神様・鬼子母神をまつるお寺。参道のケヤキ並木は都の天然記念物',
      '大イチョウ (鬼子母神)': '樹齢約600年以上、高さ30mを超える大イチョウ。都内のイチョウでは麻布善福寺の次に大きい',
      '鬼子母神の参道 (ケヤキ並木)': '江戸時代から参拝の人でにぎわった参道。ケヤキの大木が並ぶ',
      '学習院 (目白キャンパス)': '1847年に京都の御所の前で始まった公家の学校が起源。1877年に東京の神田錦町で開校し、1908年に目白へ移った。正門・史料館・厩舎など7棟が国の登録有形文化財',
      '学習院大学 史料館': '1913年に皇族寮として建てられた木造2階建て。大名・公家・皇族などの史料約14万点を収める',
      '目白庭園': '1990年開園の池泉回遊式の日本庭園。数寄屋の「赤鳥庵」の名は、1918年に目白で創刊された童話雑誌『赤い鳥』にちなむ。冬は松に雪吊り',
      '赤鳥庵 (目白庭園)': '木造瓦葺き平屋の数寄屋建築。池に面した縁側から、庭を一枚の絵のように眺められる',
      '目白通り': '目白駅の前を東西に走る大通り。駅の東に学習院がある',
    });
    Object.assign(LM_TIPS, {
      '目白庭園': '池のまわりを歩く小さな日本庭園。秋の夜には灯りがともり、紅葉が池に映り込む',
      'トランパル大塚 (大塚駅南口)': '都電の停留場「大塚駅前」は広場のすぐそば。乗り降りは E',
    });
    LM_ACH.push(['koyaku', '🐕 子育て狛犬', '天祖神社の子育て狛犬に会う', () => P.y < 3 && inPoly(A.rect(4, -66, 20, -74), P.x, P.z)],
      ['toden', '🚋 チンチン電車', '都電 (東京さくらトラム) に乗る', () => P.boat && P.boat.b.line.id === 'toden']);
    bakeFlush();
  },
});
