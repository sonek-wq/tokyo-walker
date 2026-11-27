/* まだ名所の少なかった街区に追加 (2)
   - 北里研究所 (白金。古川の南): 北里本館・北里柴三郎記念室・北里柴三郎の像
   - 青山学院 (渋谷。国連大学の向かい): 正門とイチョウ並木・間島記念館・ガウチャー記念礼拝堂・マクレイ記念館
   - 鳩山会館 (音羽。音羽通りの東の高台): 英国風の洋館・ステンドグラス・バラの庭 */
REGION({
  name: '北里・青山学院・鳩山会館',
  towns: [['白金 (北里)', -2050, 400]],
  labels: [],
  build(r) {
    const { C, spot, sign, signX, windows, TREE_LISTS } = SL_KIT();
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); } if (col) fr(...R, col); };
    const ROSES = [0xd8304a, 0xf07090, 0xf4e0a0, 0xffffff, 0xe85a2a, 0xc8285a];
    const rose = (x, z, y = 0) => bake(lam({ color: pick(ROSES) }), new THREE.SphereGeometry(0.55, 5, 4).scale(1, 0.75, 1).translate(x, y + 0.45, z));
    // 人の像 (台座・からだ・頭。顔などは作らない)
    const statue = (x, z, mat) => {
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(x - 1.2, z - 1.2, x + 1.2, z + 1.2), 0, 1.8);
      bake(mat, new THREE.CylinderGeometry(0.42, 0.55, 1.7, 8).translate(x, 2.65, z));
      bake(mat, new THREE.SphereGeometry(0.3, 8, 6).translate(x, 3.75, z));
      bake(mat, new THREE.BoxGeometry(1.25, 0.32, 0.5).translate(x, 3.35, z));
    };
    const BRONZE = lam({ color: 0x5a6a52 });

    // ===== 北里研究所 (白金5丁目。古川の南岸) =====
    {
      const R = [-2094, 324, -2003, 388];
      site(R, '#c8c2b2');
      // 北里本館 (白い高層棟)
      pushPrism(windows('KT_MAIN', '#eceae4', '#5a6a78', 6, 8), 'CONC', rectPoly(-2090, 330, -2046, 358), 0, 32);
      pushPrism('glass', 'CONC', rectPoly(-2084, 358, -2060, 364), 0, 6);   // エントランス
      sign(-2072, 364.3, 1, '北里本館', 9, 7.2, '#f4f2ec', '#1e4a7a');
      // 北里柴三郎記念室 (となりの低い現代的な建物)
      pushPrism(windows('KT_MEMO', '#d8d2c4', '#4a5260', 4, 2), 'CONC', rectPoly(-2040, 332, -2010, 356), 0, 7);
      pushPrism('glass', 'CONC', rectPoly(-2036, 356, -2014, 357), 0, 3);
      sign(-2025, 357.3, 1, '北里柴三郎記念室', 11, 4.6, '#2a3a4a', '#f0ece0');
      // 前庭と像
      tiles(-2088, 364, -2008, 386, '#d2ccbc', '#c2bcac', 2);
      fr(-2036, 366, -2014, 382, '#6a8a4a');
      statue(-2025, 374, BRONZE);
      for (const [x, z] of [[-2090, 384], [-2050, 384], [-2008, 368], [-2008, 384], [-2040, 368]]) ROUND.push([x, z, rr(0.85, 1.05)]);
      for (const x of [-2076, -2062]) BENCHES.push([x, 380, 0]);
      LM_PEOPLE.push([[-2088, 372, -2040, 372], 5]);
      spot('北里研究所', R, '北里研究所', '🔬', '1914年、北里柴三郎が私財を投じてこの地につくった研究所。国の伝染病研究所が東京帝国大学の下に移されることに反対して所長を辞め、所員たちと新しく立ち上げた。のちの北里大学のはじまり', -2050, 344);
      SPOT_AREAS.unshift(['北里柴三郎記念室', -2042, 330, -2008, 360], ['北里柴三郎の像', -2038, 364, -2012, 384]);
      Object.assign(LM_NOTES, {
        '北里柴三郎記念室': '北里柴三郎の手紙や、愛用した顕微鏡、実験器具の模型などを展示する記念室。1964年に「遺品室」として開設され、2017年に新しい建物に生まれ変わった',
        '北里柴三郎の像': 'ドイツでコッホに学び、破傷風菌の純粋培養や血清療法の確立で世界に知られた細菌学者。日本医師会や慶應義塾の医学科の創設、体温計で知られるテルモの創業にも関わった。2024年からは千円札の顔',
      });
      if (LM_NOTES['青山霊園']) LM_NOTES['青山霊園'] += '。細菌学者の北里柴三郎もここに眠っている';
    }

    // ===== 青山学院 (渋谷4丁目。青山通りをはさんで国連大学の向かい) =====
    {
      const W = [-2594, -893, -2506, -813], E = [-2494, -893, -2413, -813], AX = -2552;
      site(W, '#7a9a5a'); site(E, '#c6c0b0');
      // 正門 (石の門柱と鉄の門扉) とイチョウ並木
      for (const x of [AX - 7.2, AX + 6]) pushPrism('TKSTONE', 'TKSTONE', rectPoly(x, -892.6, x + 1.2, -891.4), 0, 3);
      { const IRON = lam({ color: 0x2a2a2a }); for (const sx of [-1, 1]) { bake(IRON, new THREE.BoxGeometry(0.1, 2.2, 3.2).translate(AX + sx * 6.05, 1.1, -889.8)); } }   // 開いた門扉
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(AX - 13, -892.6, AX - 7.2, -891.4), 0, 1.6);   // 門の脇の石の塀
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(AX + 7.2, -892.6, AX + 13, -891.4), 0, 1.6);
      sign(AX - 10.1, -892.9, -1, '青山学院', 4.6, 1.9, '#e8e0cc', '#2a2a5a');
      tiles(AX - 6, -891, AX + 6, -836, '#d6ccb4', '#c6bca4', 2);
      for (let z = -886; z < -840; z += 7) GINKGO.push([AX - 8.5, z, rr(1.0, 1.15)], [AX + 8.5, z, rr(1.0, 1.15)]);
      // 間島記念館 (1929年築の旧図書館。並木の先の、柱の並ぶ洋館)
      const MJ = windows('AG_MAJIMA', '#e6dcc4', '#3e4650', 7, 3);
      pushPrism(MJ, 'ROOF', rectPoly(AX - 16, -834, AX + 16, -816), 0, 12);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(AX - 17, -835, AX + 17, -815), 12, 13);   // 軒の帯
      for (let k = 0; k < 6; k++) bake(lam({ color: 0xf0e8d6 }), new THREE.CylinderGeometry(0.45, 0.5, 8, 8).translate(AX - 7.5 + k * 3, 4, -835.5));
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(AX - 9, -837, AX + 9, -834), 8, 9);
      sign(AX, -837.3, -1, '間島記念館', 7, 10, '#e6dcc4', '#3a2a1a');
      // ガウチャー記念礼拝堂 (西側。れんが色の礼拝堂と十字架)
      pushPrism(windows('AG_CHAPEL', '#9a5a42', '#2e3a4a', 3, 2), 'ROOF', rectPoly(-2590, -876, -2572, -846), 0, 9);
      jRoof('RF0', -2591, -877, -2571, -845, 9, 6, { over: 0.4, kind: 'hip' });
      pushPrism('CONC', 'CONC', rectPoly(-2584, -882, -2578, -876), 0, 17);   // 鐘塔
      bake(lam({ color: 0xf4f0e6 }), new THREE.BoxGeometry(0.3, 3, 0.3).translate(-2581, 18.5, -879));
      bake(lam({ color: 0xf4f0e6 }), new THREE.BoxGeometry(1.8, 0.3, 0.3).translate(-2581, 19.2, -879));
      for (const [x, z] of [[-2598 + 6, -888], [-2566, -862], [-2566, -846], [-2512, -886], [-2512, -860], [-2512, -828], [-2590, -828]]) ROUND.push([x, z, rr(0.9, 1.15)]);
      for (const z of [-878, -862, -848]) BENCHES.push([AX - 11, z, Math.PI / 2], [AX + 11, z, -Math.PI / 2]);
      LM_PEOPLE.push([[AX - 3, -890, AX - 3, -840], 8], [[AX + 3, -890, AX + 3, -840], 7]);
      // マクレイ記念館 (東側。ガラスの新しい図書館) と高層の校舎
      pushPrism(windows('AG_MACLAY', '#dfe6ea', '#7a9ab0', 8, 6), 'CONC', rectPoly(-2490, -888, -2448, -846), 0, 26);
      pushPrism('glass', 'CONC', rectPoly(-2482, -846, -2456, -842), 0, 26);   // 吹き抜けのガラスの面
      sign(-2469, -888.3, -1, 'マクレイ記念館', 9, 4, '#f2f4f6', '#1e3a5a');
      pushPrism(windows('AG_17', '#d8d4ca', '#3e4650', 5, 12), 'CONC', rectPoly(-2440, -886, -2416, -840), 0, 46);
      fr(-2490, -838, -2416, -816, '#7a9a5a');
      for (const [x, z] of [[-2484, -826], [-2466, -826], [-2448, -826], [-2430, -826]]) ROUND.push([x, z, 1.0]);
      spot('青山学院', [W[0], W[1], E[2], E[3]], '青山学院', '🎓', 'アメリカのメソジスト監督教会から派遣された宣教師たちが開いた3つの学校をルーツとするミッションスクール。正門から続くイチョウ並木が名物で、毎年、待降節を前にキャンパスのクリスマスツリーに灯をともす点火祭が行われる', AX, -860);
      SPOT_AREAS.unshift(['間島記念館', AX - 17, -838, AX + 17, -814], ['ガウチャー記念礼拝堂', -2592, -884, -2570, -844], ['マクレイ記念館', -2492, -890, -2446, -840]);
      Object.assign(LM_NOTES, {
        '間島記念館': '1929年に青山学院の図書館として完成した建物。いまは青山学院の歴史を伝えるミュージアムになっている。建てたのは、となりの新しい図書館・マクレイ記念館と同じ建設会社',
        'ガウチャー記念礼拝堂': '青山キャンパスの礼拝堂。お昼にはパイプオルガンのランチタイム・コンサートが開かれることもあり、オルガニストを育てる講座の発表会の会場にもなる',
        'マクレイ記念館': 'ガラスを多く使った開放的な新しい図書館。地下から地上まで吹き抜けが続き、4〜6階には約80万冊を収められる自動書庫がある',
      });
    }

    // ===== 鳩山会館 (音羽1丁目。音羽通りの正門から、カーブした坂を上った高台) =====
    {
      const R = [-1676, -3588, -1610, -3507], P = [-1660, -3586, -1612, -3509], H = 4;
      site(R, '#6a8a4a');
      pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(...P), 0, H);   // 高台
      stairs([-1676, -3586, -1660, -3578], H, 'x+');               // 正門からの坂道
      tiles(-1676, -3586, -1660, -3578, '#cfc6b0', '#beb59f', 1.6);
      for (const z of [-3587, -3577]) pushPrism('TKSTONE', 'TKSTONE', rectPoly(-1677, z, -1675, z + 1), 0, 2.8);   // 正門の門柱
      signX(-1677.3, -3574, -1, '鳩山会館', 6, 2.4, '#ece4d0', '#3a2a1a');
      // 洋館 (石の3つの柱間とフランス窓。3階建て)
      const HT = windows('HT_HOUSE', '#eadfc6', '#3e4652', 6, 3);
      pushPrism(HT, 'ROOF', rectPoly(-1648, -3578, -1620, -3560), H, H + 11);
      jRoof('RF0', -1649.5, -3579.5, -1618.5, -3558.5, H + 11, 3.2, { over: 0.6, kind: 'hip' });
      for (const x of [-1648.3, -1638.6, -1629, -1619.7]) pushPrism('TKSTONE', 'TKSTONE', rectPoly(x, -3560.5, x + 1, -3559.6), H, H + 11);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-1648, -3560.6, -1620, -3558.8), H + 3.6, H + 3.9);   // 2階の細いバルコニー
      // ハトをモチーフにしたステンドグラス (階段室の縦長の窓)
      const SG = LM_MAT('HT_STAINED', (x, y) => {
        x.fillStyle = '#2a2a30'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
        for (let j = 1; j < 32; j += 4) for (let i = 1; i < 32; i += 4) { const c = pick(['#3a6ab0', '#e8c060', '#5aa06a', '#d86a5a', '#a8d0e8', '#f4f0e0']); x.fillStyle = c; x.fillRect(i, j, 3, 3); y.fillStyle = c; y.fillRect(i, j, 3, 3); }
        x.fillStyle = '#f8f8f4'; x.fillRect(10, 12, 12, 5); x.fillRect(18, 9, 5, 4); x.fillRect(7, 10, 6, 3);   // 白いハト
      });
      pushPrism(SG, 'CONC', rectPoly(-1636.5, -3578.6, -1631.5, -3578), H + 2, H + 10);
      // バラの庭と鯉の池 (洋館の南)
      const PATH = C('HT_PATH', { color: 0xd2c6aa }), POND = C('HT_POND', { color: 0x2f5f66 }), RIM = C('HT_RIM', { color: 0x8a8068 });
      pushPrism(PATH, PATH, rectPoly(-1638, -3558, -1630, -3512), H, H + 0.06, { solid: false });
      pushPrism(PATH, PATH, rectPoly(-1660, -3586, -1636, -3578), H, H + 0.06, { solid: false });
      for (let x = -1652; x <= -1618; x += 2.3) for (const z of [-3550, -3544, -3530]) { if (Math.abs(x + 1634) < 5) continue; rose(x, z, H); }
      pushPrism(RIM, RIM, regularPoly(-1646, -3522, 6, 12), H, H + 0.25, { solid: false }); pushPrism(POND, POND, regularPoly(-1646, -3522, 5, 12), H + 0.25, H + 0.3, { solid: false });
      for (const [x, z] of [[-1618, -3520], [-1656, -3566], [-1616, -3584], [-1668, -3540], [-1668, -3520]]) ROUND.push([x, z, rr(0.9, 1.1), x > -1660 ? H : 0]);
      BENCHES.push([-1624, -3522, -Math.PI / 2]);
      LM_PEOPLE.push([[-1650, -3537, -1620, -3537, H], 3]);
      spot('鳩山会館', R, '鳩山会館', '🕊', '1924年、のちの首相・鳩山一郎が友人の建築家・岡田信一郎の設計で建てた英国風の洋館で、「音羽御殿」とも呼ばれる。ハトをモチーフにしたステンドグラスと、90種類以上のバラが咲く庭が見どころ。鳩山家は4代にわたって政治家を出した一族', -1634, -3570);
    }
    bakeFlush();
  },
});
