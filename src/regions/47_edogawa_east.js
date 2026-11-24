/* 荒川の両岸と江戸川区 (東西を強めに縮めたエリア)
   - 大島小松川公園: 旧小松川閘門 (3分の2が土に埋まった閘門)・中川番所跡・荒川ぞいの小松川千本桜
   - 船堀: タワーホール船堀 (高さ115mの塔。高さ103mの展望室へエレベーターで上れる)
   - 新川 (運河は regions/00_geography.js): 新川千本桜・新川西水門広場の火の見櫓 (上れる)
   - 一之江名主屋敷 (茅葺きの主屋と長屋門・屋敷林) / 葛西: 地下鉄博物館 (日本初の地下鉄車両1001号車) */
REGION({
  name: '江戸川区・荒川の両岸',
  towns: [['大島 (小松川)', 2610, -2290], ['春江町', 3428, -2300]],
  labels: [],
  build(r) {
    const { C, site, spot, sign, signX, STONE, plasterWood, windows, hall } = SL_KIT();
    const trees = (R, n, list = ROUND, avoid = null, s0 = 0.8, s1 = 1.2, base) => {
      for (let k = 0; k < n; k++) { const x = rr(R[0] + 2, R[2] - 2), z = rr(R[1] + 2, R[3] - 2); if (avoid && avoid(x, z)) continue; list.push(base === undefined ? [x, z, rr(s0, s1)] : [x, z, rr(s0, s1), base]); }
    };

    // ===== 大島小松川公園: 旧小松川閘門・中川番所跡 =====
    {
      const R = [2550, -2330, 2670, -2218];
      site(R, '#7a9a54');
      // 旧小松川閘門 (土の丘から上の3分の1だけ顔を出す閘門の塔)
      const KX = 2632, KZ = -2272;
      hill(KX, KZ, 16, 2.5);
      const BR = LM_MAT('EG_KOMON', (x, y) => { x.fillStyle = '#b8a890'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#a49480'; for (let j = 0; j < 32; j += 4) x.fillRect(0, j, 32, 1); x.fillStyle = '#5a4a3a'; x.fillRect(10, 8, 12, 14); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); });
      for (const dz of [-7, 7]) { pushPrism(BR, 'CONC', rectPoly(KX - 3.5, KZ + dz - 3, KX + 3.5, KZ + dz + 3), 0, 11); jRoof('RF0', KX - 4, KZ + dz - 3.5, KX + 4, KZ + dz + 3.5, 11, 1.6, { over: 0.4, kind: 'hip' }); }
      pushPrism(BR, 'CONC', rectPoly(KX - 2.5, KZ - 4, KX + 2.5, KZ + 4), 8.4, 10.2);   // 2本の塔をつなぐ梁
      spot('旧小松川閘門', [KX - 17, KZ - 17, KX + 17, KZ + 17], '旧小松川閘門', '🚪', '荒川と旧中川の水位の差 (最大3.1m) をこえて船を通すため、1930年に完成した閘門。いまは2つの門のうち1つだけが残され、しかも全体の3分の2ほどは土の中に埋まっている', KX, KZ);
      // 中川番所跡 (小名木川を通る船を調べた川の関所)
      const BW = plasterWood('EG_BANSHO', '#e2d6bc', '#3a2a1e');
      hall([2558, -2246, 2580, -2232], BW, 0.4, 3.4, 'RF2', 2.6);
      for (let x = 2556; x < 2596; x += 2.4) pushPrism('WOOD', 'WOOD', rectPoly(x, -2226.3, x + 0.3, -2226), 0, 1.4);   // 柵
      spot('中川番所跡', [2552, -2250, 2598, -2222], '中川番所', '⛵', '江戸時代、小名木川が中川に出るところに置かれた「川の関所」。江戸に出入りする船の荷物や旅人をここで調べた。行徳の塩や成田詣での人を乗せた船もここを通った');
      trees(R, 30, ROUND, (x, z) => Math.hypot(x - KX, z - KZ) < 18 || inR([2554, -2250, 2598, -2222], x, z), 0.9, 1.2);
      LM_PEOPLE.push([[2560, -2300, 2660, -2300], 4]);
      spot('大島小松川公園', R, null, null, '旧中川をはさんで江東区と江戸川区にまたがる防災公園。災害のときには大勢の人の避難場所になる');
      // 小松川千本桜 (荒川の西岸を南北に約2km)
      for (let z = -2930; z < -2240; z += 9) for (const x of [2681, 2690]) SAKURA.push([x + rr(-1, 1), z + rr(-1.5, 1.5) + (x > 2685 ? 4.5 : 0), rr(0.8, 1)]);
      SPOT_AREAS.unshift(['小松川千本桜', 2676, -2940, 2696, -2232]);
      LM_NOTES['小松川千本桜'] = '荒川の堤防を整えたのに合わせて、南北約2kmにわたって1000本あまりの桜が植えられた。新川千本桜と並ぶ江戸川区の桜の名所';
    }

    // ===== 船堀: タワーホール船堀 (高さ115mの塔と、高さ103mの展望室) =====
    {
      const R = [3140, -1908, 3200, -1852];
      site(R, '#b8b4aa');
      const HW = windows('EG_TOWERHALL', '#dcd8d0', '#4a5868', 5, 6);
      // 「区民の乗合船」: 船の形の建物
      pushPrism(HW, 'ROOF', [[3146, -1900], [3190, -1900], [3196, -1880], [3190, -1860], [3146, -1860]], 0, 30);
      pushPrism('glass', 'ROOF', rectPoly(3150, -1862, 3186, -1856), 0, 8);
      // 塔 (マスト)
      const TX = 3168, TZ = -1880;
      pushPrism(C('EG_MAST', { color: 0xe8e8e6 }), 'CONC', rectPoly(TX - 4, TZ - 4, TX + 4, TZ + 4), 30, 101.5);
      pushPrism('CONC', 'CONC', rectPoly(TX - 7, TZ - 7, TX + 7, TZ + 7), 101, 103);   // 展望室の床
      for (const [x0, z0, x1, z1] of [[TX - 7, TZ - 7, TX + 7, TZ - 6.6], [TX - 7, TZ + 6.6, TX + 7, TZ + 7], [TX - 7, TZ - 7, TX - 6.6, TZ + 7], [TX + 6.6, TZ - 7, TX + 7, TZ + 7]])
        pushPrism('glass', 'glass', rectPoly(x0, z0, x1, z1), 103, 106.5);
      pushPrism('CONC', 'ROOF', rectPoly(TX - 7.4, TZ - 7.4, TX + 7.4, TZ + 7.4), 106.5, 107.5);
      bake(lam({ color: 0xd8d8d8 }), new THREE.CylinderGeometry(0.3, 0.5, 8, 6).translate(TX, 111.5, TZ));
      const RED = lam({ color: 0xff3a2a, emissive: 0xff2010 }); bake(RED, new THREE.SphereGeometry(0.5, 6, 4).translate(TX, 115.4, TZ));
      roofLift([TX, -1853], [TX - 4.5, 103, TZ], '展望室 (高さ103m) に着いた', '1階におりた', { r: 5, topR: 6, upPrompt: 'E　エレベーターで展望室へ' });
      sign(3168, -1855.6, 1, 'タワーホール船堀', 12, 9);
      LM_PEOPLE.push([[3146, -1850, 3190, -1850], 4]);
      spot('タワーホール船堀', R, '船堀タワー', '🗼', '水辺の街・江戸川区にちなむ「区民の乗合船」がテーマの建物で、マストのようにのびる塔の高さは115m。高さ103mの展望室からは東京スカイツリーや葛西臨海公園の大観覧車、天気がよければ富士山も見える', TX, TZ);
      LM_HEIGHT_AREAS.unshift(['船堀タワー展望室 (高さ103m)', (x, z, y) => y > 100 && inR([TX - 7, TZ - 7, TX + 7, TZ + 7], x, z)]);
      LM_NOTES['船堀タワー展望室 (高さ103m)'] = '一般に公開されている展望室としては都内でも上位の高さ。足もとには荒川や鉄道の鉄橋が見わたせる';
    }

    // ===== 新川: 新川千本桜と新川西水門広場の火の見櫓 =====
    {
      const CZ = x => -1706 + (x - 2860) * 12 / 840;   // 新川の中心の z
      for (let x = 2935; x < 3655; x += 9) {
        if (((x % 100) + 100) % 100 < 12 || ((x % 100) + 100) % 100 > 88) continue;   // 橋のたもと
        for (const sd of [-1, 1]) SAKURA.push([x + (sd > 0 ? 4.5 : 0), CZ(x) + sd * 11.5, rr(0.75, 0.95)]);
      }
      // 火の見櫓 (大名櫓をモデルにした高さ15.5mの櫓。上の展望室まで上れる)
      const HX = 2950, HZ = -1730;
      LM_ZONES.push(rectPoly(2932, -1752, 2972, -1716)); fr(2932, -1752, 2972, -1716, '#c8bca4');
      pushPrism('ISHIGAKI', 'TKSTONE', rectPoly(HX - 5, HZ - 5, HX + 5, HZ + 5), 0, 3);
      const YG = plasterWood('EG_YAGURA', '#f0ece2', '#2a2420');
      pushPrism(YG, 'ROOF', rectPoly(HX - 4, HZ - 4, HX + 4, HZ + 4), 3, 8);
      jRoof('RF2', HX - 4, HZ - 4, HX + 4, HZ + 4, 8, 1.6, { over: 0.9, kind: 'hip' });
      pushPrism('WOOD', 'WOOD', rectPoly(HX - 3.2, HZ - 3.2, HX + 3.2, HZ + 3.2), 9.3, 9.6);   // 上の展望の床
      for (const [dx, dz] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) { bake(lam({ color: 0x2a2420 }), new THREE.BoxGeometry(0.35, 3, 0.35).translate(HX + dx, 11.1, HZ + dz)); solid(HX + dx - 0.2, HZ + dz - 0.2, HX + dx + 0.2, HZ + dz + 0.2, 9.6, 12.6); }
      for (const [x0, z0, x1, z1] of [[HX - 3.2, HZ - 3.2, HX + 3.2, HZ - 3], [HX - 3.2, HZ + 3, HX + 3.2, HZ + 3.2], [HX - 3.2, HZ - 3.2, HX - 3, HZ + 3.2], [HX + 3, HZ - 3.2, HX + 3.2, HZ + 3.2]]) pushPrism('WOOD', 'WOOD', rectPoly(x0, z0, x1, z1), 9.6, 10.6);   // 手すり
      jRoof('RF2', HX - 3, HZ - 3, HX + 3, HZ + 3, 12.6, 2.6, { over: 0.8, kind: 'irimoya' });
      bake(WALL.BRONZE, new THREE.CylinderGeometry(0.4, 0.5, 0.8, 8).translate(HX, 12.0, HZ));   // 半鐘
      roofLift([HX, HZ + 6], [HX + 1.5, 9.6, HZ + 1.5], '火の見櫓の上に着いた', '広場におりた', { r: 4, topR: 4, upPrompt: 'E　火の見櫓に上る' });
      spot('新川千本桜 (火の見櫓)', [2932, -1752, 2972, -1716], '火の見櫓', '🌸', '新川は、行徳の塩を江戸へ運ぶ「塩の道」だった運河。いまは両岸の約3kmに700本あまりの桜が植えられ、起点の広場には大名櫓をモデルにした高さ15.5mの火の見櫓が建つ', HX, HZ);
      LM_NOTES['新川'] = '徳川家康が小名木川と同じころに掘らせた、行徳への塩の船の道。川ぞいには味噌や醤油を売る店や料理屋が並んでにぎわった';
    }

    // ===== 一之江名主屋敷 (茅葺きの主屋・長屋門・屋敷林と堀) =====
    {
      const R = [3400, -2282, 3456, -2224];
      site(R, '#8a9a5a');
      for (const [x0, z0, x1, z1] of [[3400, -2282, 3456, -2279], [3400, -2227, 3424, -2224], [3432, -2227, 3456, -2224], [3400, -2282, 3403, -2224], [3453, -2282, 3456, -2224]]) fr(x0, z0, x1, z1, '#3d6a70');   // 堀
      const THATCH = C('EG_THATCH', { color: 0x8a7650 });
      const NW = plasterWood('EG_NANUSHI', '#d8c8a8', '#3a2a20');
      pushPrism(NW, 'ROOF', rectPoly(3412, -2266, 3442, -2250), 0.5, 3.6);
      jRoof(THATCH, 3412, -2266, 3442, -2250, 3.6, 6.5, { over: 1.6, kind: 'irimoya' });
      pushPrism(NW, 'ROOF', rectPoly(3418, -2236, 3425.5, -2230), 0, 3); pushPrism(NW, 'ROOF', rectPoly(3430.5, -2236, 3438, -2230), 0, 3);   // 長屋門 (まん中が通り道)
      pushPrism('WOOD', 'WOOD', rectPoly(3425.5, -2236, 3430.5, -2230), 2.4, 3);
      jRoof('RF2', 3418, -2236, 3438, -2230, 3, 1.8, { over: 0.6, kind: 'irimoya' });
      trees(R, 40, ROUND, (x, z) => inR([3408, -2270, 3446, -2228], x, z), 1, 1.4);
      trees([3404, -2278, 3452, -2228], 10, PINES, (x, z) => inR([3408, -2270, 3446, -2228], x, z));
      spot('一之江名主屋敷', R, '名主屋敷', '🌾', '江戸時代のはじめにこの地で新田を開いた田島家の屋敷で、代々一之江新田の名主をつとめた。茅葺きの主屋は1770年代の再建で、まわりを堀と屋敷林で囲む構えは創建当初のようすを伝えている');
    }

    // ===== 葛西: 地下鉄博物館 (日本初の地下鉄車両1001号車) =====
    {
      const R = [3284, -786, 3330, -736];
      site(R, '#b8b4aa');
      pushPrism(windows('EG_METROMUS', '#e0dcd4', '#3a4a5a', 4, 6), 'ROOF', rectPoly(3288, -782, 3326, -762), 0, 7);
      pushPrism('glass', 'ROOF', rectPoly(3290, -762, 3324, -754), 0, 5);   // ガラスの展示室
      const YL = lam({ color: 0xf2c820 }), BRN = lam({ color: 0x5a3a2a }), WIN = lam({ color: 0x2a3440 });
      bake(YL, new THREE.BoxGeometry(16.3, 2.6, 2.6).translate(3307, 1.9, -745)); solid(3298.8, -746.3, 3315.2, -743.7, 0, 3.6);
      bake(BRN, new THREE.BoxGeometry(16.3, 0.4, 2.4).translate(3307, 3.4, -745));
      bake(WIN, new THREE.BoxGeometry(14.6, 0.8, 2.64).translate(3307, 2.4, -745));
      bake(lam({ color: 0x2a2a2a }), new THREE.BoxGeometry(16, 0.6, 2).translate(3307, 0.3, -745));
      for (const dx of [-8.5, 8.5]) pushPrism('CONC', 'CONC', rectPoly(3307 + dx - 0.2, -747.2, 3307 + dx + 0.2, -742.8), 0, 4.6);
      pushPrism('ROOF', 'ROOF', rectPoly(3298, -748, 3316, -742), 4.6, 5, { solid: false });   // 展示の屋根
      sign(3307, -753.6, 1, '地下鉄博物館', 10, 6);
      spot('地下鉄博物館', R, '地下鉄博物館', '🚇', '1927年に上野〜浅草間を走った、日本初の地下鉄車両「1001号車」を展示している。地下でも明るく見えるよう、ベルリンの地下鉄にならってレモンイエローに塗られた。電車として初めて国の重要文化財になった');
    }
    bakeFlush();
  },
});
