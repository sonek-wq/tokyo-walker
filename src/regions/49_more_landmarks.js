/* 作り忘れていた名所の補完
   - 千鳥ヶ淵 (北の丸の西のお濠と、約700mの千鳥ヶ淵緑道の桜並木・ボート場)
   - 横網町公園 (東京都慰霊堂・東京都復興記念館) / すみだ北斎美術館
   - 向島百花園
   - 月島: 西仲通り (もんじゃストリート) と旧交番 / 佃: 住吉神社
   - 深川江戸資料館 */
REGION({
  name: '名所の補完',
  towns: [['千鳥ヶ淵', -985, -2400], ['佃', 530, -1300]],
  labels: [],
  build(r) {
    const { C, site, spot, sign, signX, SHU, STONE, plasterWood, windows, hall, street } = SL_KIT();
    const trees = (R, n, list = ROUND, avoid = null, s0 = 0.8, s1 = 1.2, base) => {
      for (let k = 0; k < n; k++) { const x = rr(R[0] + 2, R[2] - 2), z = rr(R[1] + 2, R[3] - 2); if (avoid && avoid(x, z)) continue; list.push(base === undefined ? [x, z, rr(s0, s1)] : [x, z, rr(s0, s1), base]); }
    };

    // ===== 千鳥ヶ淵 (お濠と千鳥ヶ淵緑道) =====
    {
      const X0 = -992, X1 = -950, Z0 = -2506, Z1 = -2216, CX = (X0 + X1) / 2;
      LM_ZONES.push(rectPoly(-1014, Z0 - 2, X1 + 4, Z1 + 2));
      for (const A of [ROUND, PINES, MAPLES, GINKGO, SAKURA, LM_STREET, LAMPS2, BENCHES]) { const keep = A.filter(p => !inR([-1014, Z0 - 2, X1 + 4, Z1 + 2], p[0], p[1])); A.length = 0; A.push(...keep); }
      fr(-1014, Z0 - 2, X0 - 1, Z1 + 2, '#b8ae98');   // 緑道
      fr(X0 - 1, Z0, X1 + 1, Z1, '#5a6a50');           // 土手
      fr(X0 + 1.5, Z0 + 2, X1 - 1.5, Z1 - 2, '#2f5f66');  // 水面
      for (let z = Z0 + 6; z < Z1 - 4; z += 6) PONDS.push([CX, z, (X1 - X0) / 2 - 1.5, 7]);
      for (const x of [X0 - 1, X1]) pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(x, Z0, x + 1, Z1), 0, 0.3, { solid: false });
      // 緑道の桜 (お濠側にしだれかかる) と向こう岸の土手の桜
      for (let z = Z0 + 3; z < Z1; z += 5) { SAKURA.push([X0 - 3, z + rr(-1, 1), rr(0.9, 1.1)], [-1011, z + 2.5, rr(0.8, 1)]); if ((z | 0) % 2) SAKURA.push([X1 + 2.5, z + 1, rr(0.8, 1)]); }
      for (let z = Z0 + 10; z < Z1; z += 30) BENCHES.push([-1006, z, Math.PI / 2]);
      // 千鳥ヶ淵ボート場 (南のはし)
      pushPrism('WOOD', 'RF1', rectPoly(-1012, Z1 - 30, -1000, Z1 - 20), 0, 3); jRoof('RF1', -1012, Z1 - 30, -1000, Z1 - 20, 3, 1.2, { over: 0.5, kind: 'hip' });
      const BC = [0x2a6ab0, 0xe8e8e0, 0xc83a2a];
      for (let k = 0; k < 6; k++) bake(lam({ color: BC[k % 3] }), new THREE.BoxGeometry(2, 0.5, 3.6).translate(CX - 8 + (k % 3) * 8 + rr(-1, 1), 0.2, Z1 - 40 - (k >> 1) * 20 + rr(-2, 2)));
      LM_PEOPLE.push([[-1006, Z0 + 4, -1006, Z1 - 4], 8]);
      spot('千鳥ヶ淵', [-1014, Z0 - 2, X1 + 2, Z1 + 2], '千鳥ヶ淵', '🌸', '江戸城の北西のお濠。名前は、お濠の形が千鳥に似ていることから。お濠ぞいの約700mの千鳥ヶ淵緑道には約260本の桜が植えられ、春は水面にしだれる桜をボートから見上げられる', CX, -2360);
    }

    // ===== 横網町公園 (東京都慰霊堂・東京都復興記念館) =====
    {
      const R = [1290, -2862, 1402, -2772];
      site(R, '#a8a294');
      tiles(1300, -2820, 1392, -2812, '#c8c0ae', '#b8b09e', 1.6);
      // 東京都慰霊堂 (1930年、伊東忠太の設計。寺院風の講堂と三重塔)
      const IR = C('YA_IREIDO', { color: 0xbab4a6 });
      pushPrism(IR, 'ROOF', rectPoly(1316, -2852, 1356, -2828), 0, 9); jRoof('RF2', 1316, -2852, 1356, -2828, 9, 6, { over: 1.4, kind: 'irimoya' });
      pushPrism(IR, 'ROOF', rectPoly(1328, -2828, 1344, -2820), 0, 6); jRoof('RF2', 1328, -2828, 1344, -2820, 6, 2.6, { over: 1, kind: 'irimoya' });   // 正面の玄関
      for (let i = 0; i < 3; i++) { const y0 = 15 + i * 7.6, hw = 4.2 - i * 0.6; pushPrism(IR, 'ROOF', rectPoly(1362 - hw, -2846 - hw, 1362 + hw, -2846 + hw), i ? y0 : 0, y0 + 5); jRoof('RF2', 1362 - hw, -2846 - hw, 1362 + hw, -2846 + hw, y0 + 5, 1.6, { over: 1.8, kind: 'hip' }); }
      bake(WALL.BRONZE, new THREE.CylinderGeometry(0.2, 0.35, 6, 6).translate(1362, 44.6, -2846));   // 相輪 (塔の高さ約41m)
      // 東京都復興記念館
      pushPrism(windows('YA_FUKKO', '#d6ceba', '#5a5040', 6, 5), 'ROOF', rectPoly(1370, -2808, 1398, -2786), 0, 9);
      sign(1384, -2785.6, 1, '東京都復興記念館', 10, 6.4);
      // 花壇と追悼の碑
      fe(1330, -2795, 14, 8, '#6a8a4a'); for (let k = 0; k < 24; k++) bake(lam({ color: pick([0xe04a5a, 0xf0c040, 0xf0f0f0, 0xe878b8]) }), new THREE.DodecahedronGeometry(0.4, 0).translate(1330 + rr(-11, 11), 0.3, -2795 + rr(-6, 6)));
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(1328, -2797, 1332, -2793), 0, 2.2);
      trees(R, 26, GINKGO, (x, z) => inR([1312, -2856, 1370, -2816], x, z) || inR([1366, -2812, 1400, -2782], x, z) || Math.hypot((x - 1330) / 16, (z + 2795) / 10) < 1 || Math.abs(z + 2816) < 6);
      spot('横網町公園 (東京都慰霊堂)', R, '東京都慰霊堂', '🕊', '陸軍の軍服工場「被服廠」の跡地。1923年の関東大震災では、ここへ避難した大勢の人が火災旋風の犠牲になった。1930年に伊東忠太の設計で震災記念堂 (いまの東京都慰霊堂) が建てられ、のちに東京空襲の犠牲者もまつられた', 1336, -2836);
      SPOT_AREAS.unshift(['東京都復興記念館', 1366, -2812, 1402, -2782]);
      LM_NOTES['東京都復興記念館'] = '慰霊堂とともに伊東忠太が設計し、1931年に完成した展示施設。関東大震災の被害と、その後の東京の復興の歩みを伝える';
    }

    // ===== すみだ北斎美術館 (2016年開館。妹島和世の設計) =====
    {
      const R = [1442, -2694, 1494, -2640];
      site(R, '#b8b4ac');
      const AL = lam({ color: 0xb4b8bc, emissive: 0x101418 });
      const parts = [[1448, -2688, 1466, -2668, 18], [1468, -2688, 1488, -2672, 16], [1448, -2664, 1462, -2648, 15], [1466, -2668, 1488, -2648, 18]];   // スリットで分けた4つの塊
      for (const [x0, z0, x1, z1, h] of parts) { bake(AL, new THREE.BoxGeometry(x1 - x0, h, z1 - z0).translate((x0 + x1) / 2, h / 2, (z0 + z1) / 2)); solid(x0, z0, x1, z1, 0, h); }
      fr(1442, -2694, 1494, -2640, '#c8c4ba'); fe(1468, -2644, 20, 4, '#7a9a54');
      spot('すみだ北斎美術館', R, '北斎美術館', '🌊', '葛飾北斎はこの近くの本所割下水 (いまの北斎通り) で生まれ、90年の生涯で93回も引っ越したが、そのほとんどがいまの墨田区内だった。アルミのパネルでおおわれた銀色の建物は、すき間 (スリット) でいくつかの塊に分けられている');
    }

    // ===== 向島百花園 (江戸の町人がつくった花の庭) =====
    {
      const R = [1818, -4218, 1888, -4156];
      site(R, '#8a9a5a');
      fe(1850, -4192, 12, 8, '#a89c80'); fe(1850, -4192, 10, 6.5, '#3a6a64'); PONDS.push([1850, -4192, 10, 6.5]);
      POND_LAND.push(['r', 1845, -4194, 1855, -4190]); bake(lam({ color: 0x8a6a48 }), new THREE.BoxGeometry(10, 0.3, 4).translate(1850, 0.25, -4192));   // 池の橋
      // 萩のトンネル (竹のアーチ)
      const BAM = lam({ color: 0xa89060 }), HAGI = lam({ color: MONTH === 9 ? 0xc85a9a : 0x5a8a3a });
      for (let z = -4210; z < -4170; z += 3) { bake(BAM, new THREE.TorusGeometry(2.2, 0.08, 4, 10, Math.PI).translate(1878, 0, z)); for (let k = 0; k < 4; k++) bake(HAGI, new THREE.DodecahedronGeometry(0.6, 0).translate(1878 + rr(-2.2, 2.2), rr(1.2, 2.3), z + rr(-1, 1))); }
      // 庭門と茶亭
      for (const dx of [-2, 2]) pushPrism('WOOD', 'WOOD', rectPoly(1850 + dx - 0.2, -4157.4, 1850 + dx + 0.2, -4157), 0, 3);
      jRoof(C('YA_THATCH', { color: 0x8a7650 }), 1846.5, -4158.5, 1853.5, -4156, 3, 1.4, { over: 0.4, kind: 'irimoya' });
      pushPrism(plasterWood('YA_SABO', '#d8ccb0', '#4a3a2a'), 'WOOD', rectPoly(1824, -4214, 1838, -4204), 0.3, 2.8); jRoof(C('YA_THATCH', { color: 0x8a7650 }), 1824, -4214, 1838, -4204, 2.8, 2.2, { over: 0.8, kind: 'irimoya' });
      trees(R, 16, ROUND, (x, z) => Math.hypot((x - 1850) / 13, (z + 4192) / 9) < 1 || Math.abs(x - 1878) < 4 || inR([1822, -4216, 1840, -4202], x, z), 0.6, 0.9);
      for (let k = 0; k < 40; k++) { const x = rr(1822, 1872), z = rr(-4214, -4160); if (Math.hypot((x - 1850) / 13, (z + 4192) / 9) < 1) continue; bake(lam({ color: pick([0x6a8a3a, 0xb8a860, 0x8a9a4a]) }), new THREE.ConeGeometry(0.4, 1.1, 5).translate(x, 0.55, z)); }   // 草花 (七草など)
      spot('向島百花園', R, '向島百花園', '🌾', '江戸時代の後期、骨董商の佐原鞠塢が文人たちの協力を得て開いた、町人による花の庭。はじめは梅の名所で「新梅屋敷」と呼ばれ、のちに古典に詠まれた草花を集めて四季の花が咲く庭になった。秋は萩のトンネルが名物');
    }

    // ===== 月島: 西仲通り (もんじゃストリート) と旧交番 / 佃: 住吉神社 =====
    {
      const F = frame(640, -1344, 0, 1, 1, 0);
      street(F, 240, { hw: 4, c1: '#c4beb2', c2: '#b0aa9e', ts: 1.5, gates: [[2, '月島もんじゃストリート'], [238, '月島もんじゃストリート']], skip: (x, z) => x > 640 && Math.abs(z + 1224) < 8 });
      // 旧交番 (1926年の鉄筋コンクリートの交番)
      pushPrism(C('YA_KOBAN', { color: 0xd8ccb4 }), 'ROOF', rectPoly(645, -1230, 653, -1218), 0, 4.2);
      jRoof('RF0', 645, -1230, 653, -1218, 4.2, 1.2, { over: 0.4, kind: 'hip' });
      bake(lam({ color: 0xe83a2a, emissive: 0xff2010 }), new THREE.SphereGeometry(0.3, 6, 4).translate(644.6, 3.4, -1224));
      spot('月島もんじゃストリート (西仲通り)', [618, -1344, 662, -1104], 'もんじゃストリート', '🏮', '月島は明治時代に埋め立てでできた町。駅から続く西仲通り商店街は「月島もんじゃストリート」と呼ばれ、通りや路地に下町の店がぎっしり並ぶ', 640, -1224);
      SPOT_AREAS.unshift(['西仲通りの旧交番', 643, -1232, 655, -1216]);
      LM_NOTES['西仲通りの旧交番'] = '大正時代に建てられた木造の交番を、1926年に鉄筋コンクリートで建て替えたもの。都内でいちばん古い交番の建物として知られ、いまは地域の安全と観光案内の拠点';
      // 佃 住吉神社 (1646年創建。摂津の佃村から移り住んだ漁師たちの守り神)
      const S = [512, -1346, 556, -1308];
      site(S, '#c2b8a0');
      myojinTorii(534, -1312, true, 5, 5.6, STONE, 0.32);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(520, -1340, 548, -1322), 0, 0.6);
      hall([522, -1338, 546, -1326], 'WOOD', 0.6, 4.6, 'RF_COPPER', 4.2);
      pushPrism('WOOD', 'RF2', rectPoly(548, -1320, 554, -1314), 0, 2.6); jRoof('RF2', 548, -1320, 554, -1314, 2.6, 1.4, { over: 0.6, kind: 'irimoya' });   // 水盤舎
      STONE_LANTERNS.push([530, -1316], [538, -1316]);
      spot('住吉神社 (佃)', S, '住吉神社', '⛩', '徳川家康とゆかりのある摂津 (大阪) の佃村の漁師たちが江戸に移り、隅田川河口の干潟を築いて故郷の名をつけたのが佃島。その守り神として1646年に建てられた。鳥居の額は陶製でめずらしい', 534, -1330);
    }

    // ===== 深川江戸資料館 (江戸時代の深川佐賀町の町並みを、館内に実物大で再現) =====
    {
      const R = [1376, -1886, 1426, -1850];
      site(R, '#b8b2a6');
      pushPrism(windows('YA_EDOSHIRYO', '#d8d0c0', '#5a5a52', 6, 8), 'ROOF', rectPoly(1380, -1882, 1422, -1856), 0, 10);
      sign(1401, -1855.6, 1, '深川江戸資料館', 10, 6);
      // 入口の前の小さな火の見櫓 (館内の町並みにそびえる火の見やぐらにちなむ)
      for (const [dx, dz] of [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]) bake(lam({ color: 0x4a3a2a }), new THREE.BoxGeometry(0.25, 7, 0.25).translate(1388 + dx, 3.5, -1852 + dz));
      pushPrism('WOOD', 'WOOD', rectPoly(1386.6, -1853.4, 1389.4, -1850.6), 6.6, 6.8, { solid: false }); jRoof('RF2', 1386.6, -1853.4, 1389.4, -1850.6, 7, 1, { over: 0.4, kind: 'hip' });
      spot('深川江戸資料館', R, '深川江戸資料館', '🏮', '館内に、江戸時代の終わりごろの深川佐賀町の町並みを実物大で再現している。火の見やぐらのそびえる町に八百屋や船宿、長屋が並び、照明と音で朝から夜までの一日の移り変わりも演出される');
    }
    bakeFlush();
  },
});
