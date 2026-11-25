/* まだ名所の少なかった街区に追加
   - 愛宕山: 山頂にNHK放送博物館の看板と塔、丹塗りの門を追加
   - 東洋文庫ミュージアム (本駒込。六義園の南東): モリソン書庫
   - 赤城神社 (神楽坂の北西): 隈研吾が手がけたガラス張りの社殿
   - 弥生美術館・竹久夢二美術館 (東大の弥生門の東) */
REGION({
  name: '愛宕山ほか',
  towns: [['赤城元町', -1380, -3080]],
  labels: [],
  build(r) {
    const { C, spot, sign, SHU, hall, windows, TREE_LISTS } = SL_KIT();
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); } if (col) fr(...R, col); };

    // ===== 愛宕山 (山は areas/10_shimbashi_ginza.js にある。山頂の博物館と神社の門を足す) =====
    {
      const cx = ATAGO.x, cz = ATAGO.z, H = 26;
      sign(cx - 15, cz + 5.7, -1, 'NHK放送博物館', 10, H + 5, '#f4f0e6', '#2a2a2a');
      pushPrism('CONC', 'CONC', rectPoly(cx - 19, cz + 9, cx - 14, cz + 14), H + 8, H + 15);   // 博物館の塔
      // 丹塗りの門 (石段を上りきった先)
      pushPrism(SHU, 'RF2', rectPoly(cx + 14, cz - 5, cx + 16, cz - 3.2), H, H + 4.4, { solid: true });
      pushPrism(SHU, 'RF2', rectPoly(cx + 14, cz + 3.2, cx + 16, cz + 5), H, H + 4.4, { solid: true });
      jRoof('RF_COPPER', cx + 13, cz - 6, cx + 17, cz + 6, H + 4.4, 1.4, { over: 0.5 });
      SPOT_AREAS.unshift(['NHK放送博物館', cx - 23, cz + 5, cx - 7, cz + 19]);
      Object.assign(LM_NOTES, { 'NHK放送博物館': '日本のラジオ放送が始まった東京放送局が置かれた「放送のふるさと」。1956年に、世界で最初の放送専門のミュージアムとして開館した' });
      Object.assign(LM_NOTES, {   /* game/30_fun.js の NOTES を上書きするので、元の文も含めて書く */
        '出世の石段': '86段、傾斜は約40度の急な石段。曲垣平九郎が馬で駆け上がったという逸話が残る。上りきると丹塗りの門が迎えてくれる',
        '愛宕山 山頂 (愛宕神社)': '23区最高峰 (25.7m) の山頂。愛宕神社は火伏せ (防火) の神様で、江戸のころは海まで見渡せる眺めの名所だった。電動スクーターで来た人は…',
      });
    }

    // ===== 東洋文庫ミュージアム (本駒込) =====
    {
      const R = [-838, -4564, -788, -4516];
      site(R, '#b8b2a2');
      const BOOKS = LM_MAT('TB_BOOKS', (x, y) => {   // ガラス越しに見える、壁一面の本棚
        x.fillStyle = '#4a3020'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
        for (let j = 1; j < 32; j += 5) { for (let i = 0; i < 32; i += 1.3) { x.fillStyle = pick(['#7a2a1e', '#2a3a5a', '#6a5a2a', '#3a4a2a', '#8a6a3a', '#5a2a3a', '#c8b07a']); x.fillRect(i, j, 1.1, 4); } y.fillStyle = '#3a2208'; y.fillRect(0, j, 32, 4); }
      });
      pushPrism(windows('TB_WALL', '#e8e4da', '#5a6068', 6, 3), 'CONC', rectPoly(-834, -4560, -800, -4536), 0, 12);
      pushPrism(BOOKS, 'CONC', rectPoly(-834, -4536.5, -808, -4535.5), 4, 11);   // 南面のガラスの奥の本棚
      pushPrism('glass', 'CONC', rectPoly(-808, -4548, -796, -4536), 0, 5);        // エントランス
      // 中庭の「シーボルト・ガルテン」
      fr(-834, -4532, -792, -4518, '#6a8a4a'); tiles(-816, -4532, -810, -4518, '#d2c8b0', '#c0b69e', 1.4);
      for (const [x, z] of [[-828, -4524], [-798, -4524], [-822, -4520], [-802, -4528]]) ROUND.push([x, z, rr(0.7, 0.9)]);
      sign(-817, -4535.6, 1, '東洋文庫', 10, 2.8, '#2a2a2a', '#f0ece0');
      spot('東洋文庫ミュージアム', R, '東洋文庫', '📚', '1924年に三菱の岩崎久彌がつくった、東洋学の研究図書館としては国内最古・最大の文庫 (蔵書は約100万冊)。2011年に開館したミュージアムの「モリソン書庫」には、オーストラリア出身のジャーナリスト、モリソンから買い取った本が壁一面に並ぶ', -817, -4548);
    }

    // ===== 赤城神社 (神楽坂) =====
    {
      const R = [-1402, -3092, -1348, -3040];
      site(R, '#cfc6b0');
      tiles(-1380, -3046, -1370, -3040, '#d8d0bc', '#c6bea8', 1.4);
      myojinTorii(-1375, -3044, true, 6, 7, WALL.TKSTONE, 0.35);   // 大鳥居
      tiles(-1380, -3074, -1370, -3046, '#d8d0bc', '#c6bea8', 1.4);
      // ガラス張りの社殿 (檜の格子と、折りたたんだ鋼板の屋根)
      const KUMA = LM_MAT('AK_KUMA', (x, y) => { x.fillStyle = '#8aa0a8'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#ffe0a8'; y.fillRect(0, 0, 32, 32); x.fillStyle = '#c89a62'; for (let i = 0; i < 32; i += 3) x.fillRect(i, 0, 1, 32); });
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-1388, -3088, -1362, -3074), 0, 0.8);
      pushPrism(KUMA, 'CONC', rectPoly(-1386, -3087, -1364, -3076), 0.8, 6);
      jRoof('RF_COPPER', -1389, -3090, -1361, -3073, 6, 3, { over: 1, kind: 'irimoya' });
      // 境内のとなりのマンション (神社と一体で建てられた)
      pushPrism(windows('AK_PARK', '#b89a74', '#3a3e44', 5, 6), 'CONC', rectPoly(-1402, -3092, -1390, -3050), 0, 22);
      for (const [x, z] of [[-1356, -3086], [-1356, -3060], [-1384, -3060]]) ROUND.push([x, z, 1.0]);
      STONE_LANTERNS.push([-1368, -3066], [-1382, -3066]);
      spot('赤城神社', R, '赤城神社', '⛩', '1300年ごろ、群馬県の赤城山のふもとの赤城神社の御分霊をまつったのがはじまりと伝わる。2010年に建築家・隈研吾の監修で建て直され、ガラス張りのモダンな社殿になった。夜は社殿が行灯のように光る', -1375, -3070);
    }

    // ===== 弥生美術館・竹久夢二美術館 (東大の弥生門の東) =====
    {
      const R = [-10, -3744, 22, -3708];
      site(R, '#b8b0a0');
      pushPrism(windows('YB_YAYOI', '#d8c8b0', '#4a4a52', 4, 3), 'ROOF', rectPoly(-6, -3740, 8, -3722), 0, 11);   // 弥生美術館 (西側)
      jRoof('RF0', -7, -3741, 9, -3721, 11, 2.2, { over: 0.6, kind: 'hip' });
      pushPrism(windows('YB_YUMEJI', '#e8dcc8', '#4a4a52', 4, 3), 'ROOF', rectPoly(8, -3738, 18, -3722), 0, 9);    // 竹久夢二美術館 (東側)
      jRoof('RF0', 7, -3739, 19, -3721, 9, 2, { over: 0.6, kind: 'hip' });
      for (const [x, z] of [[-4, -3714], [14, -3714], [20, -3740]]) ROUND.push([x, z, 0.9]);
      sign(1, -3721.6, 1, '弥生美術館', 7, 2.8, '#f0e8d8', '#4a2a2a'); sign(13, -3721.6, 1, '竹久夢二美術館', 8, 2.8, '#f0e8d8', '#4a2a2a');
      spot('弥生美術館・竹久夢二美術館', R, '弥生美術館', '🖼', '9歳のときに挿絵画家・高畠華宵の絵に感動した弁護士の鹿野琢見が、1984年に開いた美術館。1990年にはとなりに竹久夢二美術館もでき、建物の中で行き来できる。このあたりは夢二が最愛の女性・笠井彦乃と逢瀬を重ねた場所', 6, -3730);
    }
    bakeFlush();
  },
});
