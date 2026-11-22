/* 街の中の名所 (追加): 東京都美術館 (上野) / 根津美術館 (南青山) / 八芳園 (白金台) / TOHOシネマズ新宿 (歌舞伎町) /
   すみだ水族館 (東京ソラマチの中) / キッザニア東京 (ららぽーと豊洲の中) */
REGION({
  name: '美術館・劇場など (追加の名所)',
  towns: [],
  labels: [],
  build(r) {
    const C = (key, o) => { if (!WALL[key]) WALL[key] = lam(o); return key; };
    // ===== GINZA SIX (2017年開業。松坂屋銀座店の跡地。のれんとひさしをイメージした外観。屋上は大きな庭園) =====
    {
  const gs = LM_MAT('GZ_SIX', (x, y) => { x.fillStyle = '#d8d4cc'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
    for (let j = 0; j < 32; j += 8) { x.fillStyle = '#3a3e44'; x.fillRect(0, j + 5, 32, 3); y.fillStyle = '#ffe2b8'; y.fillRect(0, j + 5, 32, 2); x.fillStyle = '#eeeae2'; x.fillRect(0, j, 32, 2); } });
  pushPrism(gs, 'GRASSTOP', rectPoly(GSIX[0] + 2, GSIX[1] + 2, GSIX[2] - 2, GSIX[3] - 2), 0, 56);
  pushPrism(gs, 'ROOF', rectPoly(GSIX[0] + 20, GSIX[1] + 8, GSIX[2] - 50, GSIX[3] - 40), 56, 110);
  for (let k = 0; k < 6; k++) pushPrism('CONC', null, rectPoly(GSIX[2] - 2.6, GSIX[1] + 4, GSIX[2] - 1.6, GSIX[3] - 4), 5 + k * 8.5, 5.6 + k * 8.5, { solid: false });   // ひさし
  const sx = glow(new THREE.MeshLambertMaterial({ map: textTex('GINZA SIX', '#2a2a2e', '#f0e8d8', 128, 24) }), '#ffffff', 0.8);
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(12, 2.2), sx); sg.position.set(GSIX[2] - 1.5, 10, -1048); sg.rotation.y = Math.PI / 2; scene.add(sg);
  for (let k = 0; k < 14; k++) PINES.push([rr(GSIX[0] + 6, GSIX[2] - 6), rr(GSIX[1] + 6, GSIX[3] - 6), 0.6, 56]);   // 屋上庭園
  SPOT_AREAS.unshift(['GINZA SIX', ...GSIX]); LM_LABELS.push(['GINZA SIX', -214, -1048, '🛍', 'GINZA SIX']);
  LM_HEIGHT_AREAS.unshift(['GINZA SIX 屋上庭園', (x, z, y) => y > 50 && y < 60 && inR(GSIX, x, z)]);
    }
    // ===== 東京都美術館 (1926年開館。前川國男の設計の今の建物は1975年。展示室の多くは地下にある) =====
    {
      const TB = [256, -3852, 300, -3776];
      LM_ZONES.push(rectPoly(...TB)); tiles(...TB, '#c8b8a4', '#b8a894', 3);
      const BR = C('MU_TOBI', { color: 0xa0563a });   // 赤茶色のタイル
      pushPrism(BR, 'ROOF', rectPoly(258, -3850, 298, -3826), 0, 12); pushPrism(BR, 'ROOF', rectPoly(258, -3820, 284, -3796), 0, 9);
      pushPrism(BR, 'ROOF', rectPoly(286, -3820, 298, -3800), 0, 6);
      // 入口の前の、銀色の大きな球の彫刻 (「my sky hole」)
      mesh(new THREE.SphereGeometry(3, 16, 12), lam({ color: 0xd8dce0, emissive: 0x202428 }), 290, 3.2, -3786); solid(287.5, -3788.5, 292.5, -3783.5, 0, 6);
      frontSign(AXIS, 278, -3795.8, 1, '東京都美術館', '#f2eee6', '#3a2a20', 10, 1.4, 5, { tw: 160, th: 28 });
      LM_PEOPLE.push([[262, -3780, 296, -3780], 6]);
      SPOT_AREAS.unshift(['東京都美術館', ...TB]);
      LM_LABELS.push(['都美術館', 278, -3820, '🎨', '東京都美術館']);
    }
    // ===== 根津美術館 (表参道の先、南青山。竹の塀の参道と、大きな瓦屋根の建物は隈研吾の設計。奥に広い日本庭園) =====
    {
      const NZ = [-2352, -968, -2232, -870];
      LM_ZONES.push(rectPoly(...NZ)); fr(...NZ, '#6f9450');
      const RF = C('MU_NEZUROOF', { color: 0x3c3e42 });
      pushPrism(C('MU_NEZUWALL', { color: 0xd8d2c6 }), null, rectPoly(-2340, -956, -2300, -926), 0, 6);
      oHip(AXIS, RF, -2344, -960, -2296, -922, 6, 5.5, { over: 2.4 });
      tiles(-2352, -952, -2340, -930, '#c8c0b0', '#b8b0a0', 2);   // 入口の参道
      const BAM = lam({ color: 0x5a7a3a });   // 竹の塀
      for (let z = -968; z < -930; z += 0.6) bake(BAM, new THREE.CylinderGeometry(0.06, 0.06, 3.2, 4).translate(-2352.5, 1.6, z));
      solid(-2353, -968, -2352, -930, 0, 3.2);
      // 庭園 (池と茶室、石灯籠)
      PONDS.push([-2262, -900, 16, 10]); fe(-2262, -900, 18, 12, '#a89c7c'); fe(-2262, -900, 16, 10, '#355e58');
      pushPrism('WOOD', null, rectPoly(-2290, -884, -2280, -876), 0, 3); oHip(AXIS, C('MU_KAYA', { color: 0x8a7a5a }), -2291, -885, -2279, -875, 3, 2.2, { over: 0.6 });
      for (const [x, z] of [[-2280, -912], [-2246, -892], [-2276, -890]]) STONE_LANTERNS.push([x, z]);
      for (let k = 0; k < 70; k++) { const x = rr(-2296, -2234), z = rr(-966, -872); if (Math.hypot((x + 2262) / 18, (z + 900) / 12) < 1.1 || inR([-2292, -886, -2278, -874], x, z)) continue; pick([MAPLES, ROUND, PINES, ROUND]).push([x, z, rr(1, 1.4)]); }
      sideSign(AXIS, -2352.9, -948, -1, 'NEZU MUSEUM', '#2a2a2a', '#e8e0d0', 6, 0.9, 4);
      LM_PEOPLE.push([[-2348, -968, -2348, -930], 4], [[-2290, -930, -2240, -930], 3]);
      SPOT_AREAS.unshift(['根津美術館の庭園', -2296, -930, -2234, -872], ['根津美術館', ...NZ]);
      LM_LABELS.push(['根津美術館', -2320, -940, '🖼', '根津美術館']);
    }
    // ===== 八芳園 (白金台。池のまわりを歩く日本庭園と、結婚式の会場) =====
    {
      const HP = [-2044, 936, -1912, 1064];
      LM_ZONES.push(rectPoly(...HP)); fr(...HP, '#6f9450');
      pushPrism('office2', 'ROOF', rectPoly(-2040, 940, -1990, 972), 0, 18);
      frontSign(AXIS, -2015, 939.8, -1, '八芳園', '#f4efe6', '#2a2a2a', 8, 1.4, 12, { tw: 96, th: 28 });
      PONDS.push([-1960, 1010, 26, 18]); fe(-1960, 1010, 29, 21, '#a89c7c'); fe(-1960, 1010, 26, 18, '#355e58');
      pushPrism('WOOD', 'WOOD', rectPoly(-1962, 990, -1958, 1030), 0.2, 0.6, { solid: false }); POND_LAND.push(['r', -1962, 990, -1958, 1030]);
      pushPrism('WOOD', null, rectPoly(-1996, 1036, -1984, 1048), 0, 3.2); oHip(AXIS, C('MU_KAYA2', { color: 0x8a7a5a }), -1997, 1035, -1983, 1049, 3.2, 2.4, { over: 0.6 });   // 茶室
      for (const [x, z] of [[-1990, 1000], [-1930, 1030], [-1970, 1034]]) STONE_LANTERNS.push([x, z]);
      for (let k = 0; k < 90; k++) { const x = rr(-2040, -1916), z = rr(976, 1060); if (Math.hypot((x + 1960) / 30, (z - 1010) / 22) < 1.05 || inR([-1998, 1034, -1982, 1050], x, z)) continue; pick([MAPLES, PINES, ROUND, SAKURA]).push([x, z, rr(1, 1.4)]); }
      LM_PEOPLE.push([[-2040, 978, -1916, 978], 6], [[-1920, 1058, -2036, 1058], 4]);
      SPOT_AREAS.unshift(['八芳園の庭園', -1990, 986, -1930, 1034], ['八芳園', ...HP]);
      LM_LABELS.push(['八芳園', -1990, 1000, '🎋', '八芳園']);
    }
    // ===== TOHOシネマズ新宿 (新宿東宝ビル。シネシティ広場の東。8階のテラスから大きな怪獣の頭がのぞく) =====
    {
      const TO = [-2796, -2498, -2746, -2440];
      LM_ZONES.push(rectPoly(...TO));
      pushPrism(acGothic('LM_TOWERST', '#c4beb4', '#3e4650', null, { rowH: 3, step: 3, ww: 2, wh: 2, lit: 0.55 }), 'ROOF', rectPoly(...TO), 0, 32);
      pushPrism(acGothic('LM_TOWERST', '#c4beb4', '#3e4650', null, { rowH: 3, step: 3, ww: 2, wh: 2, lit: 0.55 }), 'ROOF', rectPoly(TO[0] + 6, TO[1] + 4, TO[2] - 6, TO[1] + 30), 32, 130);
      const tm = glow(lam({ map: textTex('TOHO CINEMAS', '#c81e1e', '#ffffff', 160, 28) }), '#ff4040', 1);
      bake(tm, new THREE.PlaneGeometry(16, 2.4).rotateY(-Math.PI / 2).translate(TO[0] - 0.2, 26, -2470));
      bake(tm, new THREE.PlaneGeometry(16, 2.4).translate(-2771, 26, TO[3] + 0.2));
      SPOT_AREAS.unshift(['TOHOシネマズ新宿 (新宿東宝ビル)', ...TO]);
      LM_LABELS.push(['TOHOシネマズ', -2771, -2470, '🎬', 'TOHOシネマズ新宿 (新宿東宝ビル)']);
    }
    // ===== すみだ水族館 (東京ソラマチ 西の建物の5・6階) =====
    {
      const sm = glow(lam({ map: textTex('すみだ水族館', '#1a5a9a', '#ffffff', 160, 28) }), '#80c0ff', 0.9);
      bake(sm, new THREE.PlaneGeometry(16, 2.6).rotateY(0).translate(1889, 22, -3253.6));
      const pg = glow(lam({ map: tex(32, 32, g => { g.fillStyle = '#1a5a9a'; g.fillRect(0, 0, 32, 32); g.fillStyle = '#111'; g.beginPath(); g.ellipse(16, 18, 8, 11, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(16, 20, 5, 8, 0, 0, 7); g.fill(); g.fillStyle = '#f0a030'; g.fillRect(14, 10, 4, 2); }) }), '#80c0ff', 0.6);
      bake(pg, new THREE.PlaneGeometry(4, 4).translate(1868, 22, -3253.6));
      SPOT_AREAS.unshift(['すみだ水族館 (東京ソラマチ)', 1858, -3256, 1920, -3244]);
      LM_LABELS.push(['すみだ水族館', 1889, -3262, '🐧', 'すみだ水族館 (東京ソラマチ)']);
    }
    // ===== キッザニア東京 (ららぽーと豊洲の中。子どもがいろいろな仕事を体験できる街) =====
    {
      const km = glow(lam({ map: textTex('KidZania Tokyo', '#e8a020', '#1a2a5a', 160, 28) }), '#ffd080', 0.9);
      bake(km, new THREE.PlaneGeometry(14, 2.4).translate(1290, 14, -439.6));
      SPOT_AREAS.unshift(['キッザニア東京 (ららぽーと豊洲)', 1260, -444, 1320, -432]);
      LM_LABELS.push(['キッザニア', 1290, -446, '👷', 'キッザニア東京 (ららぽーと豊洲)']);
    }
    Object.assign(LM_NOTES, {
      'GINZA SIX': '2017年に、松坂屋銀座店の跡地にできた銀座でいちばん大きな商業施設。外観は日本の「ひさし」と「のれん」がモチーフ。屋上には約4000㎡の庭園がある',
      'GINZA SIX 屋上庭園': '銀座のビルの屋上とは思えない広い庭園。銀座の街並みを見下ろせる',
      '東京都美術館': '1926年に開館した、日本で最初の公立美術館。いまの赤茶色のタイルの建物は前川國男の設計で、展示室の多くは地下にある。入口の前の銀色の球は「my sky hole」という彫刻',
      '根津美術館': '実業家・根津嘉一郎のコレクションを伝える美術館。尾形光琳の国宝「燕子花図屏風」が有名。竹の塀にそった入口の参道と、大きな瓦屋根の建物は隈研吾の設計',
      '根津美術館の庭園': '都心とは思えない、谷へ下っていく深い日本庭園。池のまわりに茶室や石灯籠が点在する',
      '八芳園': '「四方八方どこから見ても美しい」ことから名づけられた日本庭園。江戸時代のはじめ、大久保彦左衛門の屋敷があったと伝わる',
      '八芳園の庭園': '池のまわりをめぐる回遊式の庭園。池にはコイが泳ぎ、奥には茶室がたたずむ',
      'TOHOシネマズ新宿 (新宿東宝ビル)': '旧新宿コマ劇場の跡地に2015年にできた映画館とホテルのビル。8階のテラスには、実物大のゴジラの頭がビルの上からのぞいている',
      'すみだ水族館 (東京ソラマチ)': '東京ソラマチの5・6階にある水族館。屋根のない大きなプール型の水槽で、マゼランペンギンが暮らしている',
      'キッザニア東京 (ららぽーと豊洲)': '子どもが消防士やパイロット、お医者さんなど、いろいろな仕事を体験できる、子どもサイズの街',
    });
    bakeFlush();
  },
});
