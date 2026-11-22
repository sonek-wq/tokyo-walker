/* 九段・北の丸・皇居東御苑
   皇居の森 (stations/jy01_tokyo.js) の北に、江戸城の本丸・二の丸の跡の「皇居東御苑」(天守台・富士見櫓・百人番所・大手門・二の丸庭園)、
   その西に北の丸公園と日本武道館 (田安門から九段坂へ)、九段坂をのぼった北側に靖国神社 (大鳥居・神門・拝殿)。
   座標は回転なし (x = 東、z = 南)。地図の縮め方に合わせて、神保町から続く靖国通り (z ≒ -2532) を九段坂として西へのばす */
REGION({
  name: '九段・北の丸',
  towns: [['九段北', -1000, -2690], ['北の丸公園', -830, -2330], ['大手町 (北)', -420, -2260]],
  labels: [],
  build(r) {
    const C = (key, o) => { if (!WALL[key]) WALL[key] = lam(o); return key; };
    const WHITE = C('KD_SHIKKUI', { color: 0xf2f0ea }), KAWARA = C('KD_KAWARA', { color: 0x4a4e56 }), GOLD = glow(lam({ color: 0xd8b040 }), 0xb08a20, 0.25);
    const trees = (R, n, kinds, keep = []) => { for (let k = 0; k < n; k++) { const x = rr(R[0] + 2, R[2] - 2), z = rr(R[1] + 2, R[3] - 2); if (keep.some(q => inR(q, x, z, 2))) continue; pick(kinds).push([x, z, rr(1, 1.5)]); } };
    // 白壁に黒い瓦の櫓 (寄棟の屋根を段々に重ねる)
    const yagura = (x, z, w, d, y0, tiers, th = 5) => {
      for (let k = 0; k < tiers; k++) {
        const s = 1 - k * 0.22, hw = w / 2 * s, hd = d / 2 * s, y = y0 + k * th;
        pushPrism(WHITE, null, rectPoly(x - hw, z - hd, x + hw, z + hd), y, y + th - 1.2);
        oHip(AXIS, KAWARA, x - hw - 0.8, z - hd - 0.8, x + hw + 0.8, z + hd + 0.8, y + th - 1.2, k === tiers - 1 ? 3.2 : 1.6, { over: 0.8 });
      }
    };

    // ===== 九段坂 (靖国通り。神保町から西へ、坂の上に靖国神社) =====
    akRoad([-600, -2532], [-1130, -2532], 16, '九段坂 (靖国通り)', { trees: false });

    // ===== 皇居東御苑 (江戸城の本丸・二の丸・三の丸の跡) =====
    const EG = [-690, -2448, -452, -2212];
    LM_ZONES.push(rectPoly(...EG)); fr(...EG, '#8a9a6a');
    // まわりの石垣 (東の大手門と北の平川門だけ開いている)
    for (const [x0, z0, x1, z1] of [[-690, -2212, -452, -2206], [-696, -2448, -690, -2206], [-690, -2454, -560, -2448], [-540, -2454, -452, -2448], [-452, -2454, -446, -2348], [-452, -2312, -446, -2206]])
      pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(x0, z0, x1, z1), 0, 4.5);
    polyFr(rectPoly(-686, -2420, -566, -2232), '#6f9a4a');   // 本丸の大芝生
    tiles(-560, -2340, -456, -2320, '#c8bca4', '#b8ac94', 3); tiles(-572, -2444, -556, -2232, '#c8bca4', '#b8ac94', 3);   // 園路
    // 大手門 (江戸城の正門。高麗門の奥に、白壁の渡櫓門がかぶさる枡形)
    {
      const gx = -449, gz = -2330;
      for (const z of [gz - 12, gz + 12]) pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(gx - 8, z - 6, gx + 8, z + 6), 0, 6);
      pushPrism(WHITE, null, rectPoly(gx - 7, gz - 18, gx + 7, gz + 18), 6, 11.5);   // 渡櫓 (下をくぐる)
      oHip(AXIS, KAWARA, gx - 7.8, gz - 18.8, gx + 7.8, gz + 18.8, 11.5, 3.6, { over: 0.8 });
      for (const z of [gz - 5.6, gz + 5.6]) pushPrism('WOOD', 'WOOD', rectPoly(gx + 9, z - 0.5, gx + 10, z + 0.5), 0, 6);   // 高麗門
      bake(lam({ color: 0x2a2420 }), new THREE.BoxGeometry(2.4, 0.8, 14).translate(gx + 9.5, 6.4, gz));
      frontSign(AXIS, gx + 10.1, gz, 1, '大手門', '#2a2018', '#f0e0b0', 4, 1, 4.6, { tw: 96, th: 24 });
    }
    // 百人番所 (鉄砲百人組が交代で守った、長さ50mほどの番所)
    pushPrism('WOOD', null, rectPoly(-530, -2308, -476, -2300), 0, 4); oHip(AXIS, KAWARA, -531, -2309, -475, -2299, 4, 2.2, { over: 0.6 });
    // 富士見櫓 (天守が焼けたあと、天守の代わりとされた三重櫓。どこから見ても同じ形に見える「八方正面の櫓」)
    pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(-640, -2240, -616, -2216), 0, 10); yagura(-628, -2228, 14, 14, 10, 3, 5.2);
    // 天守台 (1657年の明暦の大火で天守が焼け、土台だけがつくり直されて天守は建てられなかった)。南のスロープから上がれる
    const TS = [-684, -2444, -642, -2400];
    pushPrism('ISHIGAKI', 'TKSTONE', rectPoly(...TS), 0, 11);
    pushPrism('ISHIGAKI', 'TKSTONE', rectPoly(-676, -2400, -650, -2384), 0, 6);   // 小天守台
    stairs([-672, -2384, -654, -2352], 6, 'z-'); stairs([-672, -2399.5, -654, -2384], 5, 'z-', 6);
    // 二の丸庭園 (小堀遠州の作といわれる庭を、昔の絵図をもとに再現した回遊式庭園)
    PONDS.push([-512, -2400, 24, 13]); fe(-512, -2400, 27, 16, '#a89c7c'); fe(-512, -2400, 24, 13, '#355e58');
    pushPrism('WOOD', 'WOOD', rectPoly(-514, -2414, -510, -2386), 0.2, 0.6, { solid: false }); POND_LAND.push(['r', -514, -2414, -510, -2386]);   // 池の橋
    for (const [x, z] of [[-540, -2380], [-486, -2418], [-500, -2382]]) LANTERNS.push([x, z]);
    trees([-550, -2444, -456, -2350], 50, [PINES, MAPLES, ROUND, SAKURA], [[-540, -2416, -484, -2384]]);
    trees([-690, -2230, -566, -2212], 10, [PINES, ROUND]); trees([-560, -2296, -456, -2212], 22, [PINES, SAKURA, ROUND], [[-531, -2309, -475, -2299], [-560, -2340, -456, -2320]]);
    LM_PEOPLE.push([[-446, -2330, -560, -2330], 8], [[-564, -2440, -564, -2236], 6], [[-680, -2300, -580, -2300], 5]);

    // ===== 北の丸公園と日本武道館 =====
    const KP = [-940, -2516, -700, -2212];
    LM_ZONES.push(rectPoly(...KP)); fr(...KP, '#6f9450');
    const BX = -828, BZ = -2410, BR = 42;   // 武道館: 一辺約33mの正八角形 (外接円の半径 約43m)
    {
      tiles(BX - 56, BZ - 56, BX + 56, BZ + 56, '#c8c0ae', '#b8b09e', 3);
      const oct = regularPoly(BX, BZ, BR, 8, Math.PI / 8);
      pushPrism(C('KD_BUDOKAN', { color: 0xe4dcc8 }), null, oct, 0, 14);
      pushPrism('CONC', null, regularPoly(BX, BZ, BR + 1.2, 8, Math.PI / 8), 13.4, 14.4);
      // 富士山の裾野のような、ゆるく反った八角形の大屋根 (2段) と、てっぺんの金色の擬宝珠
      const RFM = lam({ color: 0x6a7a72 });
      mesh(new THREE.CylinderGeometry(BR * 0.55, BR + 3, 12, 8, 1).rotateY(Math.PI / 8), RFM, BX, 20, BZ);
      mesh(new THREE.CylinderGeometry(BR * 0.12, BR * 0.55, 12, 8, 1).rotateY(Math.PI / 8), RFM, BX, 32, BZ);
      mesh(new THREE.CylinderGeometry(0.5, 2.2, 3, 8), RFM, BX, 39.5, BZ);
      mesh(new THREE.SphereGeometry(2.2, 10, 8), GOLD, BX, 42.2, BZ); mesh(new THREE.ConeGeometry(1.1, 2.4, 8), GOLD, BX, 45.2, BZ);
      for (let k = 0; k < 5; k++) { const rr0 = BR * (1 - k * 0.2), y = 14 + k * 5.6; solid(BX - rr0 * 0.7, BZ - rr0 * 0.7, BX + rr0 * 0.7, BZ + rr0 * 0.7, y, y + 5.6); }   // 屋根の上も歩ける
      frontSign(AXIS, BX, BZ - BR * 0.93 - 0.2, -1, '日本武道館', '#f4efe2', '#2a2a2a', 14, 2.6, 10, { tw: 160, th: 28 });
      LM_HEIGHT_AREAS.unshift(['日本武道館の屋根の上', (x, z, y) => y > 14 && Math.hypot(x - BX, z - BZ) < BR + 3]);
    }
    // 田安門 (北の丸の北の入口。九段坂に面した、江戸城で現存するいちばん古い門のひとつ)
    {
      const gx = -828, gz = -2513;
      for (const x of [gx - 13, gx + 13]) pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(x - 6, gz - 7, x + 6, gz + 7), 0, 6);
      pushPrism(WHITE, null, rectPoly(gx - 19, gz - 6, gx + 19, gz + 6), 6, 11); oHip(AXIS, KAWARA, gx - 19.8, gz - 6.8, gx + 19.8, gz + 6.8, 11, 3.4, { over: 0.8 });
      for (const x of [gx - 6, gx + 6]) pushPrism('WOOD', 'WOOD', rectPoly(x - 0.5, gz - 9, x + 0.5, gz - 8), 0, 6);
      bake(lam({ color: 0x2a2420 }), new THREE.BoxGeometry(14, 0.8, 2.4).translate(gx, 6.4, gz - 8.5));
      tiles(gx - 7, gz - 2, gx + 7, BZ - BR - 4, '#c8bca4', '#b8ac94', 3);
    }
    trees([-938, -2508, -704, -2214], 120, [SAKURA, ROUND, MAPLES, PINES, GINKGO], [[BX - 58, BZ - 58, BX + 58, BZ + 58], [-842, -2516, -814, -2460]]);
    LM_PEOPLE.push([[-828, -2524, -828, -2470], 16], [[BX - 54, BZ + 54, BX + 54, BZ + 54], 10], [[-930, -2240, -720, -2240], 6]);

    // ===== 靖国神社 (九段坂の上。東から 大鳥居 → 大村益次郎像 → 第二鳥居 → 神門 → 拝殿) =====
    const YS = [-1124, -2734, -866, -2552], AZ = -2640;
    LM_ZONES.push(rectPoly(...YS)); fr(...YS, '#9a9278');
    tiles(-1060, AZ - 9, -866, AZ + 9, '#cfc6b0', '#bfb6a0', 3);   // 参道
    tiles(-880, -2552, -866, AZ, '#cfc6b0', '#bfb6a0', 3);
    const STEEL = lam({ color: 0x6a6660 }), BRONZE = lam({ color: 0x4a5a4e }), HINOKI = lam({ color: 0xc8a878 });
    myojinTorii(-884, AZ, false, 25, 21, STEEL, 1.25);    // 第一鳥居 (大鳥居): 高さ25m。東京でいちばん大きな鳥居
    myojinTorii(-990, AZ, false, 12, 10, BRONZE, 0.6);    // 第二鳥居 (青銅)
    acStatue(-940, AZ, 0, 1.8, -Math.PI / 2, BRONZE, 'stand', { w: 3.4, h: 7, mat: 'TKSTONE' });   // 大村益次郎像 (日本で最初の西洋式の銅像)
    {   // 神門 (ヒノキの門。とびらに大きな菊の紋)
      const gx = -1022;
      pushPrism('WOOD', null, rectPoly(gx - 4, AZ - 13, gx + 4, AZ - 5), 0, 8); pushPrism('WOOD', null, rectPoly(gx - 4, AZ + 5, gx + 4, AZ + 13), 0, 8);
      oHip(AXIS, 'RF_COPPER', gx - 6, AZ - 15, gx + 6, AZ + 15, 8, 4.5, { over: 1 });
      const kiku = glow(lam({ map: tex(32, 32, g => { g.fillStyle = '#c8a878'; g.fillRect(0, 0, 32, 32); g.fillStyle = '#e0b840'; g.beginPath(); g.arc(16, 16, 12, 0, 7); g.fill(); g.strokeStyle = '#a07820'; for (let k = 0; k < 16; k++) { const a = k / 16 * 6.283; g.beginPath(); g.moveTo(16, 16); g.lineTo(16 + Math.cos(a) * 12, 16 + Math.sin(a) * 12); g.stroke(); } g.fillStyle = '#a07820'; g.beginPath(); g.arc(16, 16, 3, 0, 7); g.fill(); }) }), 0xffd870, 0.3);
      for (const z of [AZ - 2.5, AZ + 2.5]) mesh(new THREE.PlaneGeometry(4.6, 4.6), kiku, gx + 4.05, 4, z, Math.PI / 2);
    }
    myojinTorii(-1046, AZ, false, 8, 7, HINOKI, 0.45);   // 中門鳥居
    // 拝殿
    {
      tiles(-1104, AZ - 24, -1056, AZ + 24, '#d8d0bc', '#c8c0ac', 3);
      pushPrism('WOOD', null, rectPoly(-1100, AZ - 20, -1072, AZ + 20), 0, 7.5);
      oHip(AXIS, 'RF_COPPER', -1102, AZ - 22, -1070, AZ + 22, 7.5, 7, { over: 1.4 });
      bake(lam({ color: 0xf2f0ea }), new THREE.BoxGeometry(0.3, 2.4, 22).translate(-1071.6, 6, AZ));   // 白い幕
      pushPrism('WOOD', null, rectPoly(-1120, AZ - 12, -1104, AZ + 12), 0, 7); oHip(AXIS, 'RF_COPPER', -1121, AZ - 13, -1103, AZ + 13, 7, 5, { over: 0.8 });   // 本殿
    }
    // 境内の桜 (気象庁が東京の桜の開花を決める「標本木」がある)
    const HY = [-960, -2676];
    for (let x = -1050; x < -876; x += 9) for (const z of [AZ - 16, AZ + 16]) SAKURA.push([x + rr(-2, 2), z + rr(-2, 2), rr(1.1, 1.4)]);
    trees([-1120, -2732, -880, -2662], 40, [SAKURA, GINKGO, ROUND], [[HY[0] - 4, HY[1] - 4, HY[0] + 4, HY[1] + 4]]);
    trees([-1120, -2618, -900, -2556], 34, [SAKURA, GINKGO, ROUND]);
    SAKURA.push([HY[0], HY[1], 1.6]); pushPrism('WOOD', null, rectPoly(HY[0] - 3.2, HY[1] - 3.2, HY[0] + 3.2, HY[1] - 3), 0, 0.9);   // 標本木 (まわりの柵)
    for (const [dx, dz] of [[-3.2, -3.2], [3.2, -3.2], [-3.2, 3.2], [3.2, 3.2]]) pushPrism('WOOD', null, rectPoly(HY[0] + dx - 0.1, HY[1] + dz - 0.1, HY[0] + dx + 0.1, HY[1] + dz + 0.1), 0, 1);
    LM_PEOPLE.push([[-868, -2548, -868, AZ], 10], [[-870, AZ - 4, -1060, AZ - 4], 18], [[-1060, AZ + 4, -870, AZ + 4], 14]);

    // ===== 名所の名前・地図・豆知識 =====
    SPOT_AREAS.unshift(['天守台 (江戸城)', ...TS], ['富士見櫓', -640, -2240, -616, -2216], ['百人番所', -532, -2312, -474, -2296], ['大手門', -462, -2348, -440, -2312], ['二の丸庭園', -540, -2418, -484, -2382],
      ['日本武道館', BX - BR, BZ - BR, BX + BR, BZ + BR], ['田安門', -848, -2520, -808, -2506],
      ['靖国神社 大鳥居 (第一鳥居)', -892, AZ - 14, -876, AZ + 14], ['大村益次郎像', -946, AZ - 6, -934, AZ + 6], ['靖国神社 神門', -1028, AZ - 15, -1016, AZ + 15], ['靖国神社 拝殿', -1104, AZ - 22, -1070, AZ + 22], ['桜の標本木 (靖国神社)', HY[0] - 5, HY[1] - 5, HY[0] + 5, HY[1] + 5]);
    SPOT_AREAS.push(['皇居東御苑', ...EG], ['北の丸公園', ...KP], ['靖国神社', ...YS]);
    LM_HEIGHT_AREAS.unshift(['天守台の上', (x, z, y) => y > 9 && inR(TS, x, z)]);
    LM_LABELS.push(['皇居東御苑', -570, -2330, '🏯'], ['天守台', -663, -2422, '🏯', '天守台 (江戸城)'], ['大手門', -449, -2330, '⛩', '大手門'],
      ['武道館', BX, BZ, '🥋', '日本武道館'], ['北の丸公園', -900, -2250, '🌳'], ['靖国神社', -1000, AZ, '⛩'], ['標本木', HY[0], HY[1], '🌸', '桜の標本木 (靖国神社)']);
    Object.assign(LM_NOTES, {
      '皇居東御苑': '江戸城の本丸・二の丸・三の丸の跡を、皇居の東側の庭園として公開している。石垣や門、櫓など、江戸城の名残がたくさん残る',
      '天守台 (江戸城)': '江戸城の天守は、高さ約51mで日本でいちばん高かったといわれる。1657年の明暦の大火で焼けたあと、土台だけが築き直されたが、「平和な世にはもういらない」として天守は建てられなかった',
      '天守台の上': '天守台の上に立つと、本丸の大芝生と東御苑の森が見渡せる。明治のはじめには、ここに天文台が置かれたこともある',
      '富士見櫓': '江戸城に残るただひとつの三重櫓。どこから見ても同じような形に見えるので「八方正面の櫓」とも呼ばれる。将軍はここから富士山や両国の花火を眺めたという',
      '百人番所': '鉄砲を持った「百人組」が昼も夜も交代で詰めて、本丸を守った番所。長さは50mもある',
      '大手門': '江戸城の正門。大名たちはここから登城した。門の内側は、敵をまっすぐ通さないように四角く囲んだ「枡形」になっている',
      '二の丸庭園': '江戸時代の庭の絵図をもとによみがえらせた、池をめぐる日本庭園。春はツツジ、初夏はハナショウブがきれい',
      '日本武道館': '1964年の東京オリンピックで、この年に初めてオリンピックの種目になった柔道の会場として建てられた。八角形の形は法隆寺の夢殿がもと、ゆるやかな屋根は富士山の裾野をイメージしたといわれる',
      '日本武道館の屋根の上': 'てっぺんの金色の玉ねぎのような飾りは「擬宝珠 (ぎぼし)」。雷よけの避雷針の役目もしている',
      '田安門': '1636年に建てられた、江戸城に残るいちばん古い建物のひとつ。北の丸公園と武道館の入口',
      '北の丸公園': '江戸城の北の丸の跡。明治から戦争の終わりまでは近衛師団の兵営があった場所で、いまは日本武道館や科学技術館のある森の公園',
      '九段坂 (靖国通り)': '昔はとても急な坂で、坂に沿って9段の石段のように屋敷が並んでいたことから「九段」と呼ばれるようになったといわれる',
      '靖国神社': '1869年、明治天皇の考えで「東京招魂社」として建てられ、1879年に今の名前になった。境内は都内でも有名な桜の名所',
      '靖国神社 大鳥居 (第一鳥居)': '高さ25m、上の横木の長さ約34m、重さ100t。東京でいちばん大きな鳥居で、さびに強い特別な鋼でできている',
      '大村益次郎像': '1893年に建てられた、日本で最初の西洋式の銅像。上野の西郷隆盛像、皇居外苑の楠木正成像とあわせて「東京三大銅像」と呼ばれる',
      '靖国神社 神門': 'ヒノキでできた大きな門。とびらには直径1.5mほどの菊の紋がかがやく',
      '靖国神社 拝殿': '白い幕がかかった拝殿。奥には本殿がある',
      '桜の標本木 (靖国神社)': 'このソメイヨシノは、気象台が東京の桜の「開花」と「満開」を決めるときに見る標本木。5〜6輪咲くと、東京の桜の開花が発表される',
    });
    LM_ACH.push(['tenshudai', '🏯 幻の天守', '江戸城の天守台の上に立つ', () => P.y > 9 && inR(TS, P.x, P.z)],
      ['budokan', '🥋 武道館の屋根', '日本武道館の屋根の上に立つ', () => P.y > 30 && Math.hypot(P.x - BX, P.z - BZ) < 12]);
    bakeFlush();
  },
});
