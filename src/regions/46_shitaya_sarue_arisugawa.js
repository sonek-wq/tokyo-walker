/* 下谷・入谷・竜泉 (上野と浅草のあいだ) / 住吉 (猿江恩賜公園) / 南麻布 (有栖川宮記念公園)
   - かっぱ橋道具街 (約800mの道具の専門店街と、金色のかっぱ河太郎像)
   - 入谷鬼子母神 (7月は朝顔の鉢が並ぶ) / 子規庵 (ヘチマ棚の庭) / 鷲神社 (11月は酉の市の熊手の店) / 一葉記念館
   - 猿江恩賜公園 (日本庭園・時計塔・貯木場の面影のミニ木蔵)
   - 有栖川宮記念公園 (台地と谷の地形・渓流・滝・池・高台の都立中央図書館) */
REGION({
  name: '下谷・猿江・有栖川',
  towns: [['松が谷', 960, -3560], ['下谷 (入谷)', 760, -3880], ['根岸', 610, -4080], ['千束', 1170, -4090], ['竜泉', 1030, -4280], ['住吉', 2115, -2330], ['南麻布', -2064, 100]],
  labels: [],
  build(r) {
    const { site, spot, sign, signX, SHU, STONE, plasterWood, windows, hall, gate, street } = SL_KIT();
    const trees = (R, n, list = ROUND, avoid = null, s0 = 0.8, s1 = 1.2, base) => {
      for (let k = 0; k < n; k++) { const x = rr(R[0] + 2, R[2] - 2), z = rr(R[1] + 2, R[3] - 2); if (avoid && avoid(x, z)) continue; list.push(base === undefined ? [x, z, rr(s0, s1)] : [x, z, rr(s0, s1), base]); }
    };
    const GOLD = lam({ color: 0xd8a830, emissive: 0x3a2808 });

    // ===== かっぱ橋道具街 (上野と浅草のあいだを南北に約800m) =====
    {
      const X = 950, Z0 = -3896, L = 492, KZ = -3660;   // KZ: かっぱ橋本通りとの交差点
      const F = frame(X, Z0, 0, 1, 1, 0);
      street(F, L, { hw: 5, c1: '#c4beb4', c2: '#aea89e', ts: 1.6, gates: [[2, 'かっぱ橋道具街'], [L - 2, 'かっぱ橋道具街']],
        skip: (x, z) => Math.abs(z - KZ) < 9 || (x > X && Math.abs(z - KZ - 16) < 8) });
      // 店先の道具 (鍋・寸胴・ざる・食器の山)
      const MET = lam({ color: 0xc8ccd0 }), PL = lam({ color: 0xf0ece4 }), BAM = lam({ color: 0xc8a868 });
      for (let z = Z0 + 6; z < Z0 + L - 6; z += 7) for (const sd of [-1, 1]) {
        if (Math.abs(z - KZ) < 12 || rnd() < 0.35) continue;
        const x = X + sd * 4.4, k = (z | 0) % 3;
        if (k === 0) for (let i = 0; i < 3; i++) bake(MET, new THREE.CylinderGeometry(0.45 - i * 0.08, 0.45 - i * 0.08, 0.6, 10).translate(x, 0.3 + i * 0.6, z));
        else if (k === 1) bake(PL, new THREE.CylinderGeometry(0.5, 0.4, 0.9, 10).translate(x, 0.45, z));
        else bake(BAM, new THREE.CylinderGeometry(0.6, 0.5, 0.25, 10).translate(x, 0.6, z));
      }
      // かっぱ河太郎像 (ポケットパークに立つ金色のかっぱ)
      const [px, pz] = [X + 9, KZ + 16];
      fr(px - 5, pz - 6, px + 6, pz + 6, '#bdb6a6');
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(px, pz, 1.2, 8), 0, 0.8);
      bake(GOLD, new THREE.BoxGeometry(0.7, 0.9, 0.5).translate(px, 1.35, pz));                       // 体
      bake(GOLD, new THREE.SphereGeometry(0.42, 10, 8).translate(px, 2.05, pz));                       // 頭
      bake(GOLD, new THREE.CylinderGeometry(0.3, 0.3, 0.06, 10).translate(px, 2.46, pz));              // 頭の皿
      bake(GOLD, new THREE.BoxGeometry(0.2, 0.12, 0.3).translate(px - 0.42, 2.0, pz));                 // くちばし
      for (const s of [-1, 1]) { bake(GOLD, new THREE.BoxGeometry(0.16, 0.7, 0.16).rotateZ(s * 0.6).translate(px, 1.75, pz + s * 0.45)); bake(GOLD, new THREE.BoxGeometry(0.2, 0.6, 0.2).translate(px, 0.9, pz + s * 0.18)); }
      solid(px - 0.9, pz - 0.9, px + 0.9, pz + 0.9, 0, 2.6);
      BENCHES.push([px + 4, pz - 3, Math.PI / 2], [px + 4, pz + 3, Math.PI / 2]);
      spot('かっぱ橋道具街', [X - 20, Z0, X + 20, Z0 + L], 'かっぱ橋道具街', '🍳', '調理道具や食器、食品サンプルなど飲食店のための専門店が約170店並ぶ、全長約800mの道具街。始まりは、新堀川という川の両岸に古道具屋が店を出したこと', X, Z0 + L / 2);
      SPOT_AREAS.unshift(['かっぱ河太郎像', px - 5, pz - 6, px + 6, pz + 6]);
      LM_NOTES['かっぱ河太郎像'] = '道具街の誕生90年を記念して建てられた、高さ1.5mの金色のかっぱ。江戸時代、合羽屋喜八が堀割の工事をしたとき、隅田川のかっぱたちが手伝ったという伝説にちなむ';
    }

    // ===== 入谷鬼子母神 (真源寺) =====
    {
      const R = [740, -3937, 780, -3895];
      site(R, '#c4bca6');
      hall([748, -3931, 772, -3913], 'WOOD', 0.5, 4.5, 'RF2', 4);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(746, -3933, 774, -3911), 0, 0.5);
      for (const sx of [-1, 1]) pushPrism('WOOD', 'WOOD', rectPoly(760 + sx * 4 - 0.3, -3899.3, 760 + sx * 4 + 0.3, -3898.7), 0, 3.6);
      jRoof('RF2', 754.5, -3900.5, 765.5, -3897.5, 3.6, 1.6, { over: 0.6, kind: 'irimoya' });
      tiles(756, -3911, 764, -3895, '#d2c8b0', '#c0b69e', 1.4);
      {   // 朝顔まつり (入谷の名物なので、いつも鉢を並べておく)
        const POT = lam({ color: 0x8a5a3a }), LF = lam({ color: 0x3a7a34 }), FLW = [0x4a5ad8, 0xc84a9a, 0x8a4ad0, 0xe8e8f8];
        for (let z = -3893; z > -3940; z -= 2.2) for (const x of [738.5, 781.5]) {
          bake(POT, new THREE.CylinderGeometry(0.35, 0.25, 0.4, 8).translate(x, 0.2, z));
          bake(LF, new THREE.ConeGeometry(0.35, 1.3, 6).translate(x, 1.05, z));
          for (let k = 0; k < 3; k++) bake(lam({ color: pick(FLW) }), new THREE.SphereGeometry(0.14, 6, 4).translate(x + rr(-0.25, 0.25), rr(0.7, 1.5), z + rr(-0.25, 0.25)));
        }
      }
      trees(R, 4, ROUND, (x, z) => inR([744, -3935, 776, -3895], x, z));
      spot('入谷鬼子母神 (真源寺)', R, '入谷鬼子母神', '🌺', '「恐れ入谷の鬼子母神」のしゃれで知られる、1659年開山の寺。鬼子母神は子育ての神様になったので、ここでは角 (ツノ) のない「鬼」の字を使う。夏には境内と門前に朝顔の鉢が並ぶ「朝顔まつり」が開かれる');
    }

    // ===== 子規庵 (正岡子規が最期まで暮らした家) =====
    {
      const R = [600, -4062, 640, -4024];
      site(R, '#8a9a64');
      const SK = plasterWood('SH_SHIKI', '#d8ccb0', '#4a3a2a');
      pushPrism(SK, 'ROOF', rectPoly(606, -4056, 628, -4042), 0.4, 3.2);
      jRoof('RF2', 606, -4056, 628, -4042, 3.2, 2.2, { over: 0.8, kind: 'irimoya' });
      pushPrism('WOOD', 'WOOD', rectPoly(606, -4042, 628, -4040.6), 0, 0.45);   // 縁側
      // 黒い板塀
      for (const [x0, z0, x1, z1] of [[600, -4062, 640, -4061.5], [600, -4062, 600.5, -4024], [639.5, -4062, 640, -4024], [600, -4024.5, 616, -4024], [624, -4024.5, 640, -4024]]) pushPrism('LM_BLACK', 'LM_BLACK', rectPoly(x0, z0, x1, z1), 0, 2);
      // ヘチマ (糸瓜) の棚
      const WD = lam({ color: 0x8a7050 }), VN = lam({ color: 0x4a8a3a });
      for (const [dx, dz] of [[0, 0], [8, 0], [0, 6], [8, 6]]) bake(WD, new THREE.BoxGeometry(0.15, 2.2, 0.15).translate(610 + dx, 1.1, -4036 + dz));
      bake(VN, new THREE.BoxGeometry(8.4, 0.2, 6.4).translate(614, 2.25, -4033));
      for (let k = 0; k < 6; k++) bake(lam({ color: 0x6a9a3a }), new THREE.CylinderGeometry(0.12, 0.1, 0.8, 6).translate(611 + rr(0, 6), 1.7, -4035 + rr(0, 4)));
      trees(R, 4, ROUND, (x, z) => inR([604, -4058, 630, -4028], x, z), 0.6, 0.8);
      spot('子規庵', R, '子規庵', '🖋', '俳人・正岡子規が亡くなるまで暮らした家。病気で寝たきりになってからも、多くの俳人や歌人が集まり、俳句や短歌を新しくする運動の中心になった。戦争で焼けたあと建て直され、庭には子規が句に詠んだヘチマの棚がある');
    }

    // ===== 鷲神社 (おとりさま。11月の酉の日は酉の市で熊手の店が並ぶ) =====
    {
      const R = [1138, -4172, 1202, -4108];
      site(R, '#c2baa6');
      myojinTorii(1170, -4114, true, 6.5, 7, STONE, 0.38);
      tiles(1165, -4140, 1175, -4108, '#d2c8b0', '#c0b69e', 1.5);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(1150, -4166, 1190, -4140), 0, 0.7);
      hall([1154, -4162, 1186, -4146], SHU, 0.7, 5.5, 'RF_COPPER', 5.5);
      {   // 酉の市: 熊手の店 (鷲神社の名物なので、いつも出しておく)
        const KM = LM_MAT('SH_KUMADE', (x, y) => {
          x.fillStyle = '#3a2a1a'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
          for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
            const cx = 8 + i * 16, cy = 9 + j * 15;
            x.fillStyle = '#c8a050'; x.beginPath(); x.moveTo(cx, cy + 6); x.lineTo(cx - 7, cy - 5); x.lineTo(cx + 7, cy - 5); x.fill();
            for (const [c, dx, dy] of [['#e83a2a', -3, -2], ['#f0f0f0', 2, -3], ['#f0c020', 0, 1], ['#2a8a4a', 4, 0], ['#e85a9a', -4, 1]]) { x.fillStyle = c; x.fillRect(cx + dx - 1.5, cy + dy - 1.5, 3, 3); }
            y.fillStyle = '#5a4010'; y.fillRect(cx - 5, cy - 4, 10, 6);
          }
        });
        const stall = (x0, z0, x1, z1, face) => {
          pushPrism(KM, 'RF1', rectPoly(x0, z0, x1, z1), 0, 3.2);
          pushPrism('RF1', 'RF1', rectPoly(face === 'x+' ? x1 : x0 - 1.6, z0, face === 'x+' ? x1 + 1.6 : x0, z1), 3.0, 3.2, { solid: false });
          for (let z = z0 + 1; z < z1; z += 2.5) LANTERNS.push([face === 'x+' ? x1 + 1.4 : x0 - 1.4, z]);
        };
        for (let z = -4138; z < -4112; z += 7) { stall(1144, z, 1158, z + 6, 'x+'); stall(1182, z, 1196, z + 6, 'x-'); }
        LM_PEOPLE.push([[1170, -4112, 1170, -4140], 10]);
      }
      trees(R, 8, GINKGO, (x, z) => (x > 1142 && x < 1198) && z > -4168);
      spot('鷲神社', R, '鷲神社', '🎋', '「おとりさま」と呼ばれ、11月の酉の日の「酉の市」で知られる神社。日本武尊が戦いに勝ったお礼参りで、松の木に熊手をかけたのが酉の市の始まりと伝わる。熊手が売れると、店の人とお客がいっしょに威勢よく手締めをする', 1170, -4135);
    }

    // ===== 一葉記念館 と 一葉記念公園 =====
    {
      const R = [1006, -4260, 1054, -4212];
      site(R, '#b8b2a2');
      pushPrism(windows('SH_ICHIYO', '#e6e0d2', '#5a6470', 6, 8), 'ROOF', rectPoly(1010, -4256, 1034, -4236), 0, 11);
      pushPrism('glass', 'ROOF', rectPoly(1014, -4236, 1030, -4232), 0, 3.6);
      sign(1022, -4231.6, 1, '一葉記念館', 8, 4.4);
      fr(1036, -4256, 1052, -4216, '#8a9a64');
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(1042, -4236, 1046, -4234.8), 0, 2.4);   // たけくらべ記念碑
      trees([1036, -4256, 1052, -4216], 6, ROUND, (x, z) => Math.abs(x - 1044) < 3 && Math.abs(z + 4235) < 3);
      spot('一葉記念館', R, '一葉記念館', '📖', '1961年に開館した、女性作家ひとりのための記念館としては日本で最初の館。樋口一葉はこの町 (龍泉寺町) で駄菓子屋を営みながら暮らし、ここでの見聞をもとに「たけくらべ」を書いた。地元の人たちが土地を寄付して建てられた');
    }

    // ===== 猿江恩賜公園 (幕府の材木蔵があった場所) =====
    {
      const R = [2040, -2420, 2190, -2166];
      site(R, '#7a9a54');
      // 南園: 日本庭園の池と野球場
      fe(2078, -2226, 24, 16, '#a89c80'); fe(2078, -2226, 21, 13, '#3a6a64'); PONDS.push([2078, -2226, 21, 13]);
      POND_LAND.push(['e', 2072, -2230, 5, 3.5]); fe(2072, -2230, 5, 3.5, '#6a8a4a'); PINES.push([2071, -2230, 0.7], [2074, -2229, 0.6]);
      fe(2150, -2234, 30, 30, '#6a9a48'); fe(2150, -2222, 14, 14, '#c8a878');
      // 北園: 時計塔の中央広場・ミニ木蔵・桜山
      fe(2115, -2360, 18, 18, '#c8bca4');
      pushPrism('CONC', 'CONC', rectPoly(2113.5, -2361.5, 2116.5, -2358.5), 0, 11);
      const CLK = lam({ color: 0xfaf6ea, emissive: 0x302a20 });
      for (const [dx, dz, ry] of [[0, 1.55, 0], [0, -1.55, 0], [1.55, 0, Math.PI / 2], [-1.55, 0, Math.PI / 2]]) bake(CLK, new THREE.CylinderGeometry(1.1, 1.1, 0.1, 14).rotateX(Math.PI / 2).rotateY(ry).translate(2115 + dx, 9.6, -2360 + dz));
      jRoof('RF0', 2113, -2362, 2117, -2358, 11, 1.6, { over: 0.3, kind: 'hip' });
      pushPrism('WOOD', 'RF2', rectPoly(2050, -2410, 2074, -2394), 0, 4.5); jRoof('RF2', 2050, -2410, 2074, -2394, 4.5, 2.4, { over: 1.4, kind: 'hip' });   // ミニ木蔵
      const LOG = lam({ color: 0x9a7a52 });
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3 - (i > 1 ? 1 : 0); j++) bake(LOG, new THREE.CylinderGeometry(0.4, 0.4, 7, 8).rotateX(Math.PI / 2).translate(2078 + j * 0.85 + (i % 2) * 0.4, 0.4 + i * 0.75, -2402));
      hill(2165, -2390, 16, 3.5); for (let k = 0; k < 12; k++) { const a = rr(0, 6.28), d = rr(2, 13); SAKURA.push([2165 + Math.cos(a) * d, -2390 + Math.sin(a) * d, rr(0.75, 0.95), 3.5 * (1 - d / 16)]); }
      trees(R, 130, ROUND, (x, z) => Math.hypot((x - 2078) / 27, (z + 2226) / 19) < 1 || Math.hypot(x - 2150, z + 2234) < 32 || Math.hypot(x - 2115, z + 2360) < 20
        || inR([2046, -2414, 2084, -2390], x, z) || Math.hypot(x - 2165, z + 2390) < 17 || Math.abs(z + 2300) < 8 || Math.abs(x - 2100) < 5, 0.9, 1.3);
      LM_PEOPLE.push([[2050, -2330, 2180, -2330], 6], [[2050, -2185, 2180, -2185], 4]);
      spot('猿江恩賜公園', R, '猿江恩賜公園', '🪵', '江戸時代、幕府の材木をたくわえる「猿江御材木蔵」があった場所。昭和天皇の結婚を記念して東京市に下され、1932年に公園になった。北の園には、貯木場の面影を残す「ミニ木蔵」がある', 2115, -2300);
      SPOT_AREAS.unshift(['ミニ木蔵 (猿江恩賜公園)', 2046, -2414, 2084, -2390]);
      LM_NOTES['ミニ木蔵 (猿江恩賜公園)'] = '都が貯木場の土地を買ったとき「歴史を後の世に伝え、遺物の一部を残すこと」が条件だった。それを受けてつくられた、材木蔵の小さな再現';
    }

    // ===== 有栖川宮記念公園 (台地と谷の地形をいかした庭園。高台に都立中央図書館) =====
    {
      const R = [-2142, 36, -1986, 162];
      site(R, '#6a8a4a');
      // 東の台地 (高さ6m) と石段
      pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(-2040, 40, -1990, 158), 0, 6);
      stairs([-2052, 68, -2040, 76], 6, 'x+');
      stairs([-2052, 136, -2040, 144], 6, 'x+');
      // 都立中央図書館 (台地の上)
      pushPrism(windows('AR_LIB', '#d8d2c6', '#4a5866', 5, 6), 'ROOF', rectPoly(-2030, 46, -1996, 96), 6, 24);
      signX(-2030.4, 71, -1, '都立中央図書館', 10, 9);
      // 谷: 池と渓流と滝
      fe(-2100, 116, 22, 14, '#a89c80'); fe(-2100, 116, 19, 11, '#3a6a64'); PONDS.push([-2100, 116, 19, 11]);
      for (let k = 0; k < 9; k++) { const x = -2082 + k * 4.4, z = 116 + Math.sin(k * 0.9) * 4; fe(x, z, 3, 1.6, '#4a88b0'); PONDS.push([x, z, 2.6, 1.2]); }
      const FALL = lam({ color: 0xbfe4f4, transparent: true, opacity: 0.8 });
      bake(FALL, new THREE.BoxGeometry(0.6, 6, 3).translate(-2040.3, 3, 116));   // 台地のふちから落ちる滝
      POND_LAND.push(['r', -2088, 112, -2084, 120]); bake(lam({ color: 0x9a968a }), new THREE.BoxGeometry(4, 0.3, 3).translate(-2086, 0.3, 116));   // 石の橋
      POND_LAND.push(['r', -2062, 106, -2058, 126]); bake(lam({ color: 0x9a968a }), new THREE.BoxGeometry(4, 0.3, 20).translate(-2060, 0.2, 116));   // 渓流をまたぐ石の道
      trees([-2140, 38, -2042, 160], 50, MAPLES, (x, z) => Math.hypot((x + 2100) / 24, (z - 116) / 16) < 1 || Math.abs(z - 116) < 6 && x > -2084);
      trees([-2140, 38, -2042, 160], 30, ROUND, (x, z) => Math.hypot((x + 2100) / 24, (z - 116) / 16) < 1 || Math.abs(z - 116) < 6 && x > -2084, 1, 1.4);
      trees([-2038, 100, -1992, 156], 18, GINKGO, null, 0.9, 1.2, 6);
      LM_PEOPLE.push([[-2130, 50, -2060, 50], 3], [[-2030, 130, -2000, 130, 6], 3]);
      spot('有栖川宮記念公園', R, '有栖川宮記念公園', '🍁', '江戸時代は盛岡藩南部家の下屋敷の庭園で、明治に有栖川宮家の土地になり、1934年に公園として開かれた。台地と谷の地形をそのまま生かし、渓流や池、滝がある。池の場所は大名庭園のころとまったく同じ', -2090, 100);
      SPOT_AREAS.unshift(['都立中央図書館', -2034, 42, -1992, 100]);
      LM_NOTES['都立中央図書館'] = '有栖川宮記念公園の高台に建つ図書館。所蔵する本の多さで知られる';
      LM_HEIGHT_AREAS.unshift(['有栖川宮記念公園の高台', (x, z, y) => y > 5 && inR([-2040, 40, -1990, 158], x, z)]);
    }
    bakeFlush();
  },
});
