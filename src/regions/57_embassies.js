/* 大使館と国際機関
   - アメリカ大使館 (赤坂1丁目。アークヒルズの北東)
   - 英国大使館 (一番町。千鳥ヶ淵の西) と半蔵門園地 (返還された大使館の敷地の公園)
   - イタリア大使館 (三田2丁目。慶應の北西。赤穂浪士 大石主税ら10人の切腹の地)
   - 国連大学 (神宮前5丁目。表参道の交差点の南西)
   大使館の敷地の中は入れないので、塀で囲み、門の前から眺める形にする */
REGION({
  name: '大使館と国連大学',
  towns: [['一番町', -1070, -2320], ['赤坂一丁目', -1720, -900], ['神宮前五丁目', -2450, -880]],
  labels: [],
  build(r) {
    const { spot, sign, TREE_LISTS } = SL_KIT();
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); } if (col) fr(...R, col); };
    // 塀 (門のところだけあける)
    const wall = (R, gate, h = 2.4, key = 'TKSTONE') => {
      const [x0, z0, x1, z1] = R, t = 0.5;
      const seg = (a, b, c, d) => { if (c - a > 0.2 && d - b > 0.2) pushPrism(key, key, rectPoly(a, b, c, d), 0, h); };
      for (const [side, a, b] of [['n', x0, x1], ['s', x0, x1], ['w', z0, z1], ['e', z0, z1]]) {
        const g = gate && gate[0] === side ? [gate[1] - gate[2] / 2, gate[1] + gate[2] / 2] : null;
        const parts = g ? [[a, g[0]], [g[1], b]] : [[a, b]];
        for (const [p, q] of parts) {
          if (side === 'n') seg(p, z0, q, z0 + t); else if (side === 's') seg(p, z1 - t, q, z1);
          else if (side === 'w') seg(x0, p, x0 + t, q); else seg(x1 - t, p, x1, q);
        }
      }
    };
    // 旗 (旗竿と、絵を描いた旗)
    const flag = (x, z, h, key, draw, ry = 0) => {
      bake(lam({ color: 0xd8d8d4 }), new THREE.CylinderGeometry(0.08, 0.1, h, 6).translate(x, h / 2, z));
      if (!WALL[key]) { const c = document.createElement('canvas'); c.width = 48; c.height = 32; draw(c.getContext('2d')); const tx = new THREE.CanvasTexture(c); tx.magFilter = THREE.NearestFilter; WALL[key] = lam({ map: tx, side: THREE.DoubleSide }); }
      bake(WALL[key], new THREE.PlaneGeometry(3, 2).translate(1.5, 0, 0).rotateY(ry).translate(x, h - 1.2, z));
    };
    const grid = (key, wall, win, cols, rows, band) => LM_MAT(key, (x, y) => {
      x.fillStyle = wall; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      const cw = 32 / cols, rh = 32 / rows;
      for (let j = 0; j < rows; j++) { if (band) { x.fillStyle = win; x.fillRect(0, j * rh + rh * 0.3, 32, rh * 0.45); y.fillStyle = rnd() < 0.5 ? '#ffe8b8' : '#000'; y.fillRect(0, j * rh + rh * 0.3, 32, rh * 0.45); continue; }
        for (let i = 0; i < cols; i++) { x.fillStyle = win; x.fillRect(i * cw + cw * 0.2, j * rh + rh * 0.25, cw * 0.6, rh * 0.55); y.fillStyle = rnd() < 0.5 ? '#ffe8b8' : '#000'; y.fillRect(i * cw + cw * 0.2, j * rh + rh * 0.25, cw * 0.6, rh * 0.55); } }
    });

    // ===== アメリカ大使館 =====
    {
      const R = [-1762, -884, -1694, -806];
      site(R, '#b8b2a6');
      wall(R, ['s', -1728, 10], 2.6);
      const US = grid('EM_US', '#8a6e5c', '#3a3a3e', 1, 6, true);   // 茶色の外壁に、水平に続く窓
      pushPrism(US, 'CONC', rectPoly(-1752, -874, -1704, -836), 0, 38);
      pushPrism(US, 'CONC', rectPoly(-1748, -836, -1708, -826), 0, 9);   // 低層部
      tiles(-1734, -826, -1722, -806, '#cfc8b8', '#bab2a2', 1.5);
      flag(-1740, -816, 10, 'EM_USFLAG', g => { for (let j = 0; j < 13; j++) { g.fillStyle = j % 2 ? '#ffffff' : '#b22234'; g.fillRect(0, j * 32 / 13, 48, 32 / 13 + 0.3); } g.fillStyle = '#3c3b6e'; g.fillRect(0, 0, 20, 17); g.fillStyle = '#fff'; for (let j = 0; j < 4; j++) for (let i = 0; i < 5; i++) g.fillRect(2 + i * 4, 2 + j * 4, 1, 1); });
      for (let x = R[0] + 4; x < R[2] - 2; x += 9) ROUND.push([x, R[3] - 4, 1.0]);
      sign(-1748, -805.5, 1, 'アメリカ大使館', 9, 1.6, '#e8e4da', '#2a2a2a');
      spot('アメリカ大使館', R, 'アメリカ大使館', '🇺🇸', '幕末に麻布の善福寺に置かれたアメリカ公使館は、築地の居留地を経て1890年にこの地へ移り、1906年に大使館になった。今の建物は1976年に完成したもので、シーザー・ペリらの設計', -1728, -850);
    }

    // ===== 英国大使館と半蔵門園地 =====
    {
      const R = [-1112, -2304, -1032, -2232], P = [-1112, -2232, -1032, -2214];
      site(R, '#a8b088'); site(P, '#94b070');
      wall(R, ['e', -2268, 10], 2.4);
      const UK = grid('EM_UK', '#dedad0', '#4a5058', 6, 3);
      // 中央棟 (ギリシャ神殿風の三角の破風) と左右の棟
      pushPrism(UK, 'CONC', rectPoly(-1078, -2280, -1062, -2256), 0, 12);
      pushPrism(UK, 'CONC', rectPoly(-1084, -2296, -1066, -2280), 0, 10); pushPrism(UK, 'CONC', rectPoly(-1084, -2256, -1066, -2240), 0, 10);
      const GRN = lam({ color: 0x5a8a6a });
      for (const [z0, z1] of [[-2297, -2279], [-2257, -2239]]) jRoof('RF_COPPER', -1085, z0, -1065, z1, 10, 3, { over: 0.6, kind: 'hip' });
      { const s = new THREE.Shape([new THREE.Vector2(-13, 0), new THREE.Vector2(13, 0), new THREE.Vector2(0, 4.5)].map(p => p)); const g = new THREE.ExtrudeGeometry(s, { depth: 17, bevelEnabled: false }); g.rotateY(Math.PI / 2); bake(GRN, g.translate(-1078.5, 12, -2268)); }   // 切妻屋根
      { const s = new THREE.Shape([new THREE.Vector2(-12, 0), new THREE.Vector2(12, 0), new THREE.Vector2(0, 4)]); const g = new THREE.ExtrudeGeometry(s, { depth: 0.6, bevelEnabled: false }); g.rotateY(Math.PI / 2); bake(lam({ color: 0xe8e4da }), g.translate(-1061.5, 12, -2268)); }   // 正面の破風
      for (const z of [-2276, -2271, -2265, -2260]) bake(lam({ color: 0xece8de }), new THREE.CylinderGeometry(0.5, 0.55, 10, 8).translate(-1060.5, 5, z));   // 列柱
      tiles(-1060, -2272, -1032, -2264, '#d4ccb8', '#c0b8a4', 1.5);
      flag(-1048, -2276, 10, 'EM_UKFLAG', g => {
        g.fillStyle = '#012169'; g.fillRect(0, 0, 48, 32);
        g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 0); g.lineTo(48, 32); g.moveTo(48, 0); g.lineTo(0, 32); g.stroke();
        g.strokeStyle = '#c8102e'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(48, 32); g.moveTo(48, 0); g.lineTo(0, 32); g.stroke();
        g.fillStyle = '#fff'; g.fillRect(19, 0, 10, 32); g.fillRect(0, 11, 48, 10); g.fillStyle = '#c8102e'; g.fillRect(21, 0, 6, 32); g.fillRect(0, 13, 48, 6);
      });
      // 大使館の前の桜 (1881年にアーネスト・サトウが植えたのがはじまり)
      for (let z = -2300; z < -2236; z += 8) SAKURA.push([-1036, z, rr(1.0, 1.2)]);
      for (let k = 0; k < 10; k++) ROUND.push([rr(-1108, -1090), rr(-2300, -2238), rr(1, 1.3)]);
      // 半蔵門園地 (2015年に返還された敷地の一部。イングリッシュガーデン風の公園)
      tiles(-1112, -2224, -1032, -2220, '#d8cfb8', '#c6bda6', 1.5);
      SAKURA.push([-1046, -2218, 1.2]);   // 太白 (2015年にウィリアム王子がお手植え)
      for (const x of [-1100, -1088, -1076, -1064]) SAKURA.push([x, -2216, rr(0.9, 1.1)]);
      const ROSE = [0xd8304a, 0xf07090, 0xffffff, 0xf4e0a0];
      for (let x = -1110; x < -1050; x += 2) bake(lam({ color: pick(ROSE) }), new THREE.SphereGeometry(0.5, 5, 4).scale(1, 0.7, 1).translate(x, 0.4, -2228.5));
      for (const x of [-1094, -1070]) BENCHES.push([x, -2222, 0]);
      LM_PEOPLE.push([[-1110, -2222, -1034, -2222], 4]);
      spot('英国大使館', R, '英国大使館', '🇬🇧', '1872年に明治政府から借り受けた土地に、1875年に公使館が移ってきた。今の建物は昭和のはじめに建てられたもので、英国王室の紋章を飾った神殿風の中央棟が目印。大使館の前の桜は、1881年に館員のアーネスト・サトウが植えたのがはじまり', -1072, -2268);
      spot('半蔵門園地', P, '半蔵門園地', '🌳', '2015年に日本へ返された英国大使館の敷地の一部 (約5分の1) を公園にしたもの。イングリッシュガーデン風に整えられ、大使館の敷地だった2015年にウィリアム王子がお手植えした桜「太白」が植えられている', -1072, -2222);
    }

    // ===== イタリア大使館 (三田) =====
    {
      const R = [-1300, 296, -1218, 384];
      site(R, '#9aa878');
      wall(R, ['e', 340, 8], 2.4, 'CONC');
      const IT = grid('EM_IT', '#eeebe2', '#4a5258', 8, 2);
      pushPrism(IT, 'CONC', rectPoly(-1262, 304, -1226, 326), 0, 9);   // 公邸 (1965年完成)
      pushPrism('CONC', 'CONC', rectPoly(-1264, 302, -1224, 328), 9, 9.6);
      // 日本庭園: 池と築山
      const [px, pz] = [-1270, 356];
      fe(px, pz, 15, 10, '#9a8e70'); PONDS.push([px, pz, 13, 8]); fe(px, pz, 13, 8, '#355e58');
      hill(-1286, 334, 9, 3);
      STONE_LANTERNS.push([-1252, 352], [-1286, 370]);
      for (let k = 0; k < 22; k++) { const x = rr(-1296, -1222), z = rr(330, 380); if (Math.hypot((x - px) / 16, (z - pz) / 11) < 1) continue; (rnd() < 0.4 ? PINES : rnd() < 0.5 ? MAPLES : ROUND).push([x, z, rr(0.8, 1.2)]); }
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-1234, 360, -1232, 361.5), 0, 1.8);   // 切腹の地の碑
      flag(-1226, 340, 9, 'EM_ITFLAG', g => { g.fillStyle = '#009246'; g.fillRect(0, 0, 16, 32); g.fillStyle = '#f1f2f1'; g.fillRect(16, 0, 16, 32); g.fillStyle = '#ce2b37'; g.fillRect(32, 0, 16, 32); });
      spot('イタリア大使館', R, 'イタリア大使館', '🇮🇹', '江戸時代は伊予松山藩・松平隠岐守の中屋敷で、1703年、赤穂浪士のうち最年少16歳の大石主税を含む10人がここで切腹した。のちに松方正義の屋敷となり、昭和のはじめに土地の交換でイタリア大使館が移ってきた。江戸時代にさかのぼるという日本庭園が残る', -1244, 315);
    }

    // ===== 国連大学 (表参道の交差点の南西) =====
    {
      const R = [-2498, -958, -2406, -906];
      site(R, '#cfc8b8');
      const UN = grid('EM_UNU', '#a8a49c', '#3e4650', 6, 4);
      // 丹下健三の設計: 階段状に高くなる本館 (14階建て)
      const T = [[-2490, -958, -2414, -934, 10], [-2484, -958, -2420, -940, 22], [-2476, -958, -2428, -944, 34], [-2468, -958, -2436, -948, 50]];
      for (const [a, b, c, d, h] of T) pushPrism(UN, 'CONC', rectPoly(a, b, c, d), 0, h);
      pushPrism('glass', 'CONC', rectPoly(-2460, -934, -2444, -926), 0, 14);   // ガラスのエントランス
      tiles(-2498, -930, -2406, -906, '#d8d2c4', '#c6c0b2', 2);   // 前庭の広場
      for (const x of [-2486, -2474, -2462, -2450, -2438, -2426]) bake(lam({ color: 0xd8d8d4 }), new THREE.CylinderGeometry(0.08, 0.1, 9, 6).translate(x, 4.5, -910));   // 前庭の旗竿
      for (const x of [-2494, -2410]) for (const z of [-926, -914]) ROUND.push([x, z, 1.0]);
      LM_PEOPLE.push([[-2496, -918, -2408, -918], 8]);
      spot('国連大学', R, '国連大学', '🇺🇳', '日本に本部を置くただ一つの国連機関。地球規模の問題を研究する国連のシンクタンクで、1975年に東京で活動を始めた。本部ビルは丹下健三の設計で、1992年に完成した14階建て。土地はもと都電の青山車庫', -2452, -930);
    }
    bakeFlush();
  },
});
