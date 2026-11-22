/* 丸の内・日比谷・八重洲・日本橋室町・浜町 (東京駅まわりの作り込みに足りない名所)
   東京国際フォーラム (有楽町駅と東京駅のあいだ、線路ぞいの船の形のガラス棟) / 東京ミッドタウン日比谷と東京宝塚劇場 /
   東京ミッドタウン八重洲とアーティゾン美術館 / COREDO室町と福徳神社 / 明治座 */
REGION({
  name: '丸の内・八重洲 (追加の名所)',
  towns: [],
  labels: [],
  build(r) {
    const C = (key, o) => { if (!WALL[key]) WALL[key] = lam(o); return key; };
    const GLASS = acGothic('MY_GLASS', '#8fb2c8', '#5e7e96', null, { rowH: 3, step: 2, ww: 2, wh: 3, lit: 0.6 });
    const sign = (x, z, ry, text, w, h, y, bg = '#1e2a3a', fg = '#ffffff') => bake(glow(new THREE.MeshLambertMaterial({ map: textTex(text, bg, fg, 192, 28) }), '#ffffff', 0.8), new THREE.PlaneGeometry(w, h).rotateY(ry).translate(x, y, z));

    // ===== 東京国際フォーラム (1996年完成。船の形をしたガラス棟は長さ200m以上、高さ約60m) =====
    // 線路 (有楽町駅 → 東京駅) にそったフレーム: u = 線路の向き、v = 西 (皇居側)
    const FF = frame(-183, -1395, 185, -344, -1, -0.5);
    const lens = (u0, u1, vc, hw, n = 14) => { const P = []; for (let k = 0; k <= n; k++) { const t = k / n, u = u0 + (u1 - u0) * t, w = hw * Math.pow(Math.sin(Math.PI * t), 0.55); P.push(FF.w(u, vc - w)); } for (let k = n - 1; k > 0; k--) { const t = k / n, u = u0 + (u1 - u0) * t, w = hw * Math.pow(Math.sin(Math.PI * t), 0.55); P.push(FF.w(u, vc + w)); } return P; };
    {
      const U0 = 38, U1 = 150, VC = 45, HW = 13;
      LM_ZONES.push(FF.rect(U0 - 6, VC - HW - 8, U1 + 6, VC + HW + 8)); polyFr(FF.rect(U0 - 4, VC - HW - 6, U1 + 4, VC + HW + 6), '#c4bcae');
      const FGL = C('MY_FORUMGL', { color: 0xa8c8dc, transparent: true, opacity: 0.55 });
      pushPrism('CONC', 'CONC', lens(U0, U1, VC, HW), 0, 1.2);
      pushPrism(FGL, null, lens(U0, U1, VC, HW), 1.2, 44, { solid: false });
      pushPrism('glass', 'ROOF', lens(U0 + 6, U1 - 6, VC, HW * 0.8), 44, 46);
      for (const t of [0.5]) { const P = lens(U0 + 10, U1 - 10, VC, HW * 0.55); pushPrism('CONC', null, P, 46, 47.2); }
      // 中の通路 (ガラスの中を斜めにのぼるブリッジ) と、外から見える骨組み
      for (let u = U0 + 8; u < U1 - 8; u += 10) { const [x, z] = FF.w(u, VC); bake(lam({ color: 0xe8ecf0 }), new THREE.BoxGeometry(0.6, 42, 0.6).translate(x, 22, z)); }
      for (let k = 0; k < 5; k++) { const u = U0 + 14 + k * 18, [x, z] = FF.w(u, VC); pushPrism('CONC', 'TKSTONE', FF.rect(u, VC - 3, u + 14, VC + 3), 6 + k * 6, 6.6 + k * 6); }
      // 地上広場 (ケヤキ並木) とホール棟
      for (let u = U0; u < U1; u += 9) ROUND.push([...FF.w(u, VC + HW + 14), 1.2]);
      const HALL = acGothic('MY_FORUMH', '#c8ccd0', '#46525e', null, { rowH: 6, step: 4, ww: 3, wh: 4, lit: 0.5 });
      for (const [u0, u1] of [[40, 62], [68, 92], [98, 120]]) { const P = FF.rect(u0, VC + HW + 22, u1, VC + HW + 40); if (P.every(([x, z]) => !zoneHitsRect([x - 1, z - 1, x + 1, z + 1]) || true)) pushPrism(HALL, 'ROOF', P, 0, 24 + (u0 % 3) * 4); }
      const [sx, sz] = FF.w(95, VC + HW + 0.4); sign(sx, sz, Math.atan2(FF.vx, FF.vz), 'TOKYO INTERNATIONAL FORUM', 20, 2, 6);
      LM_PEOPLE.push([[...FF.w(U0, VC + HW + 10), ...FF.w(U1, VC + HW + 10)], 18], [[...FF.w(U1, VC + HW + 18), ...FF.w(U0, VC + HW + 18)], 14]);
      rotSpots(FF, [['東京国際フォーラム ガラス棟', U0, VC - HW, U1, VC + HW], ['東京国際フォーラム', U0 - 4, VC - HW - 6, U1 + 4, VC + HW + 42]]);
      LM_LABELS.push(['国際フォーラム', ...FF.w(95, VC), '🚢', '東京国際フォーラム']);
      LM_HEIGHT_AREAS.unshift(['東京国際フォーラム ガラス棟の屋根の上', (x, z, y) => y > 40 && inPoly(lens(U0, U1, VC, HW), x, z)]);
    }

    // ===== 東京ミッドタウン日比谷 (2018年開業。日比谷公園の向かい、高さ約192m) と 東京宝塚劇場 =====
    {
      const MH = [-292, -1440, -246, -1386];
      LM_ZONES.push(rectPoly(MH[0] - 2, MH[1] - 2, MH[2] + 1, -1332));
      tiles(MH[0] - 2, MH[1] - 2, MH[2] + 1, -1332, '#d4ccbc', '#c4bcac', 3);
      const MHM = acGothic('LM_TOWERGL', '#b8c4cc', '#4e6274', null, { rowH: 3, step: 2, ww: 2, wh: 2, lit: 0.6 });
      pushPrism(C('MY_MHBASE', { color: 0xd8d2c4 }), 'GRASSTOP', regularPoly((MH[0] + MH[2]) / 2, (MH[1] + MH[3]) / 2, 26, 10, 0.2).map(([x, z]) => [Math.max(MH[0], Math.min(MH[2], x)), Math.max(MH[1], Math.min(MH[3], z))]), 0, 30);
      // 上の塔はくびれた形 (ダンスをしているようなカーブ)
      for (let k = 0; k < 8; k++) { const y0 = 30 + k * 20.25, rad = 15 + Math.sin(k / 7 * Math.PI) * -2.5 + (k > 5 ? 1 : 0); pushPrism(MHM, k === 7 ? 'ROOF' : null, regularPoly(-269, -1415, rad, 10, 0.2 + k * 0.03), y0, y0 + 20.25); }
      for (let k = 0; k < 10; k++) ROUND.push([rr(-290, -248), rr(-1438, -1432), 0.7, 30]);   // 6階の庭 (パークビューガーデン)
      frontSign(AXIS, -269, -1385.8, 1, 'TOKYO MIDTOWN HIBIYA', '#2a2a2e', '#f0e8d8', 16, 1.6, 8);
      roofLift([-269, -1384], [-252, 30.05, -1430], '🛗 6階の屋上庭園「パークビューガーデン」へ (日比谷公園が目の前)', '🛗 1階へ', { upPrompt: 'E　エレベーターで6階の屋上庭園へ' });
      // 東京宝塚劇場 (宝塚歌劇の東京の劇場)
      const TK = [-292, -1378, -256, -1338];
      pushPrism(C('MY_TAKARA', { color: 0xe8dcc8 }), 'ROOF', rectPoly(...TK), 0, 30);
      pushPrism('glass', null, rectPoly(TK[2] - 0.6, TK[1] + 4, TK[2], TK[3] - 4), 0.2, 9, { solid: false });
      const flower = glow(lam({ map: textTex('TAKARAZUKA', '#7a1a3a', '#ffe8f0', 160, 28) }), '#ffc8d8', 0.9);
      bake(flower, new THREE.PlaneGeometry(14, 2.4).rotateY(Math.PI / 2).translate(TK[2] + 0.1, 12, (TK[1] + TK[3]) / 2));
      LM_PEOPLE.push([[-244, -1440, -244, -1334], 16], [[-248, -1360, -248, -1440], 10]);
      SPOT_AREAS.unshift(['東京宝塚劇場', ...TK], ['東京ミッドタウン日比谷', ...MH]);
      LM_HEIGHT_AREAS.unshift(['パークビューガーデン (東京ミッドタウン日比谷)', (x, z, y) => y > 28 && y < 40 && inR(MH, x, z)]);
      LM_LABELS.push(['ミッドタウン日比谷', -269, -1413, '🏙', '東京ミッドタウン日比谷'], ['宝塚劇場', -274, -1358, '🌹', '東京宝塚劇場']);
    }

    // ===== 東京ミッドタウン八重洲 (2023年に全面開業。高さ約240m、地下に大きなバスターミナル) と アーティゾン美術館 =====
    {
      const MY = [108, -1610, 170, -1550];
      LM_ZONES.push(rectPoly(...MY)); tiles(...MY, '#d4ccbc', '#c4bcac', 3);
      pushPrism(C('MY_MYBASE', { color: 0xc8c4bc }), 'ROOF', rectPoly(MY[0] + 1, MY[1] + 1, MY[2] - 1, MY[3] - 1), 0, 40);
      const MYM = acGothic('LM_TOWERGL', '#b8c4cc', '#4e6274', null, { rowH: 3, step: 2, ww: 2, wh: 2, lit: 0.6 });
      pushPrism(MYM, 'ROOF', rectPoly(118, -1600, 160, -1566), 40, 240); pushPrism('CONC', 'ROOF', rectPoly(126, -1594, 152, -1572), 240, 248);
      frontSign(AXIS, 139, -1549.8, 1, 'TOKYO MIDTOWN YAESU', '#2a2a2e', '#f0e8d8', 18, 1.8, 10);
      frontSign(AXIS, 120, -1549.7, 1, 'バスターミナル東京八重洲', '#2a4a8a', '#ffffff', 12, 1.4, 4);
      const AZ = [112, -1505, 156, -1458];
      LM_ZONES.push(rectPoly(...AZ));
      const AZM = acGothic('LM_TOWERST', '#c4beb4', '#3e4650', null, { rowH: 3, step: 3, ww: 2, wh: 2, lit: 0.55 });
      pushPrism(AZM, 'ROOF', rectPoly(...AZ), 0, 150);
      pushPrism('glass', null, rectPoly(AZ[0], AZ[3] - 0.5, AZ[2], AZ[3]), 0.2, 6, { solid: false });
      frontSign(AXIS, 134, AZ[3] + 0.2, 1, 'ARTIZON MUSEUM', '#f4f2ee', '#2a2a2a', 12, 1.4, 7.5);
      LM_PEOPLE.push([[104, -1614, 104, -1450], 18], [[174, -1450, 174, -1614], 10]);
      SPOT_AREAS.unshift(['アーティゾン美術館', ...AZ], ['東京ミッドタウン八重洲', ...MY]);
      LM_LABELS.push(['ミッドタウン八重洲', 139, -1583, '🏙', '東京ミッドタウン八重洲'], ['アーティゾン', 134, -1480, '🖼', 'アーティゾン美術館']);
    }

    // ===== COREDO室町1 (三越の北。江戸の町の雰囲気をとりいれた日本橋の街) と 福徳神社 (芽吹稲荷) =====
    {
      const CR = [436, -2112, 520, -2034];
      LM_ZONES.push(rectPoly(CR[0], CR[1], 552, CR[3])); tiles(CR[0], CR[1], 552, CR[3], '#d0c6b2', '#c0b6a2', 3);
      pushPrism(C('MY_COREDOB', { color: 0xb8ab94 }), 'ROOF', rectPoly(CR[0] + 2, CR[1] + 2, CR[2] - 2, CR[3] - 2), 0, 24);
      pushPrism(acGothic('LM_TOWERST', '#c4beb4', '#3e4650', null, { rowH: 3, step: 3, ww: 2, wh: 2, lit: 0.55 }), 'ROOF', rectPoly(CR[0] + 10, CR[1] + 8, CR[2] - 12, CR[3] - 14), 24, 88);
      const nr = glow(lam({ map: textTex('COREDO 室町', '#3a2a1e', '#f0e0c0', 160, 28) }), '#ffe0b0', 0.8);
      bake(nr, new THREE.PlaneGeometry(14, 2.2).rotateY(Math.PI).translate(478, 8, CR[3] + 0.2));
      for (let x = CR[0] + 4; x < CR[2] - 4; x += 6) bake(glow(lam({ color: 0xf0e6d0 }), 0xffe0a0, 0.6), new THREE.BoxGeometry(4.6, 2.2, 0.2).translate(x + 2.3, 3.4, CR[3] + 0.3));   // のれん
      // 福徳神社 (ビルのあいだの小さなお稲荷さん)
      const FK = [526, -2104, 548, -2078];
      myojinTorii(537, -2076, true, 3.6, 3, lam({ color: 0xc8382a }), 0.22);
      pushPrism('WOOD', null, rectPoly(530, -2100, 544, -2090), 0, 3.6); oHip(AXIS, 'RF_COPPER', 529, -2101, 545, -2089, 3.6, 2.4, { over: 0.6 });
      for (let k = 0; k < 6; k++) ROUND.push([rr(528, 546), rr(-2104, -2082), 0.8]);
      LM_PEOPLE.push([[432, -2030, 552, -2030], 14]);
      SPOT_AREAS.unshift(['福徳神社 (芽吹稲荷)', ...FK], ['COREDO室町', ...CR]);
      LM_LABELS.push(['COREDO室町', 478, -2073, '🏮', 'COREDO室町'], ['福徳神社', 537, -2092, '⛩', '福徳神社 (芽吹稲荷)']);
    }

    // ===== 明治座 (日本橋浜町。1873年に始まった、東京でいちばん古い歴史をもつ劇場) =====
    {
      const MZ = [880, -2256, 944, -2196];
      LM_ZONES.push(rectPoly(MZ[0] - 2, MZ[1] - 2, MZ[2] + 2, MZ[3] + 8)); tiles(MZ[0] - 2, MZ[3], MZ[2] + 2, MZ[3] + 8, '#d0c6b2', '#c0b6a2', 2);
      pushPrism(C('MY_MEIJIZA', { color: 0xe4dccc }), 'ROOF', rectPoly(...MZ), 0, 24);
      pushPrism(acGothic('LM_TOWERST', '#c4beb4', '#3e4650', null, { rowH: 3, step: 3, ww: 2, wh: 2, lit: 0.55 }), 'ROOF', rectPoly(MZ[0] + 8, MZ[1] + 4, MZ[2] - 8, MZ[1] + 34), 24, 80);
      oHip(AXIS, C('MY_MZROOF', { color: 0x3a3e46 }), MZ[0] + 6, MZ[3] - 18, MZ[2] - 6, MZ[3] - 2, 24, 5, { over: 1.2 });
      frontSign(AXIS, 912, MZ[3] + 0.2, 1, '明治座', '#8a1a1a', '#fff4dc', 10, 2.6, 14, { tw: 96, th: 28 });
      const NB = [glow(lam({ color: 0xc8302a }), 0xff4020, 0.3), glow(lam({ color: 0xf0e8d0 }), 0xffe8c0, 0.3), glow(lam({ color: 0x2a4a8a }), 0x4060c0, 0.3)];
      for (let k = 0; k < 9; k++) { const x = MZ[0] + 4 + k * 7; bake(NB[k % 3], new THREE.BoxGeometry(1.2, 6, 0.08).translate(x, 4.2, MZ[3] + 5)); bake(lam({ color: 0x3a3a3a }), new THREE.CylinderGeometry(0.06, 0.06, 7.6, 4).translate(x - 0.65, 3.8, MZ[3] + 5)); }   // のぼり
      LM_PEOPLE.push([[876, -2190, 948, -2190], 10]);
      SPOT_AREAS.unshift(['明治座', MZ[0], MZ[1], MZ[2], MZ[3] + 8]);
      LM_LABELS.push(['明治座', 912, -2226, '🎭', '明治座']);
    }

    Object.assign(LM_NOTES, {
      '東京国際フォーラム': '東京都庁が新宿へ移ったあとの跡地に、1996年にできたホールと会議場の集まり。国際コンペで選ばれた建築家ラファエル・ヴィニオリの設計',
      '東京国際フォーラム ガラス棟': '船の形をした長さ200m以上のガラスの吹き抜け。壁には約2600枚のガラスが使われていて、骨組みは船の竜骨のよう。ガラス棟は線路の音をさえぎる壁の役目もしている',
      '東京国際フォーラム ガラス棟の屋根の上': 'ガラス棟の屋根の上。足もとを山手線と新幹線が走り抜けていく',
      '東京ミッドタウン日比谷': '2018年開業。日比谷公園の向かいに建つ高さ約192mのビル。ゆるやかにくびれた形は、ダンスをしている人の姿をイメージしている',
      'パークビューガーデン (東京ミッドタウン日比谷)': '6階の屋上庭園。日比谷公園の緑と皇居のお濠が目の前に広がる',
      '東京宝塚劇場': '宝塚歌劇団の東京の本拠地となる劇場。劇場の前には、公演を見に来たファンがよく集まっている',
      '東京ミッドタウン八重洲': '2023年に全面開業した高さ約240mのビル。地下には大きな高速バスのターミナルがあり、全国各地へのバスが発着する',
      'アーティゾン美術館': '1952年開館のブリヂストン美術館が、2020年に新しいビルの中で生まれ変わった美術館。名前は「ART (アート)」と「HORIZON (地平)」を合わせた言葉',
      'COREDO室町': '日本橋の三越の北に並ぶ商業施設。のれんや提灯など、江戸の町の雰囲気をとりいれた街並みになっている',
      '福徳神社 (芽吹稲荷)': 'ビルのあいだにたたずむ小さな神社。平安時代からあると伝わり、2代将軍・徳川秀忠が参拝したとき、鳥居から芽が出ていたことから「芽吹稲荷」とも呼ばれる',
      '明治座': '1873年 (明治6年) に「喜昇座」として始まった、東京でいちばん古い歴史をもつ劇場のひとつ。いまの建物はビルの中にあり、時代劇や歌舞伎、ミュージカルを上演している',
    });
    bakeFlush();
  },
});
