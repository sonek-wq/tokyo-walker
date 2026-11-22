/* 浅草・墨田 (浅草 / 蔵前 / 両国 / 錦糸町 / 押上・スカイツリー / 向島)
   作り込み済み: 雷門 (大提灯・風神雷神) / 仲見世 / 宝蔵門 (大わらじ) / 浅草寺 本堂 (おみくじ) / 五重塔 / 常香炉 / 浅草神社 /
     浅草花やしき (ローラーコースター) / 浅草文化観光センター (展望テラス) / 新仲見世・伝法院通り / 人力車 / 駒形堂 /
     吾妻橋 (赤い橋) / 東武の浅草駅と隅田川橋梁・すみだリバーウォーク・東京ミズマチ (電車が走る) / 隅田公園 (両岸の桜) / 牛嶋神社 /
     アサヒビール本社と金の炎 / 東京スカイツリー (天望デッキ・天望回廊・てっぺん、夜は「粋」と「雅」のライティング) / 東京ソラマチ
   作り込みの予定: 両国国技館 / 錦糸町 */
REGION({
  name: '浅草・墨田',
  towns: [['浅草', 1300, -3420], ['花川戸', 1380, -3580], ['蔵前', 980, -2760], ['浅草橋', 900, -2450], ['両国', 1160, -2600], ['本所', 1450, -2950], ['吾妻橋', 1560, -3330],
    ['押上', 1960, -3330], ['錦糸町', 2120, -2620], ['亀戸', 2500, -2560], ['向島', 1760, -3900], ['曳舟', 2050, -3760], ['東向島', 1950, -4250], ['鐘ヶ淵', 1900, -4700], ['菊川', 1500, -2350], ['大島', 2450, -2050]],
  hubs: [{ x: 1300, z: -3420, town: 480 }, { x: 1960, z: -3330, core: 170, town: 420 }, { x: 2120, z: -2620, core: 200, town: 520 },
    { x: 1160, z: -2600, town: 380 }, { x: 980, z: -2760, town: 300 }, { x: 2500, z: -2560, town: 360 }, { x: 2050, z: -3760, town: 300 }],
  // 浅草寺のまわり (雷門の北) は低い下町の街並み
  styles: [[[1120, -3960, 1460, -3405], 'shitamachi']],
  labels: [],
  build(r) {
    // ---- 素材 (朱塗りは日没〜23時にライトアップ)
    const C = (key, color, emi, k = 0) => { if (!WALL[key]) { WALL[key] = lam(emi ? { color, emissive: emi, emissiveIntensity: 0 } : { color }); if (k) GLOW.push([WALL[key], k]); } return key; };
    const SHU = C('AS_SHU', 0xc4321c, 0xff6a3a), WHT = C('AS_WHITE', 0xeee6d6), STONE = C('AS_STONE', 0xa8a090), BLK = C('AS_BLACK', 0x2a2624);
    if (!WALL.AS_RAILGLASS) WALL.AS_RAILGLASS = lam({ color: 0xcfe4ee, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide });   // 透明な柵
    const GOLD = C('AS_GOLD', 0xd8a830, 0xffc040, 0.3), RED = C('AS_RED', 0xd83a2a), SKYW = C('AS_SKYW', 0xe8eef4, 0xb8d8ff), GLASSR = C('AS_GLASSROOF', 0xc8d4dc), KAWARA = 'RF2';
    LM_UPDATERS.push(() => { WALL[SHU].emissiveIntensity = NIGHT > 0.05 && gameH >= 12 && gameH < 23 ? NIGHT * 0.3 : 0; });
    const M = (key, bg, win, lit, step = 3, rows = 3) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rows) for (let i = 1; i < 32; i += step) { x.fillStyle = win; x.fillRect(i, j, step - 1, rows - 1); y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, j, step - 1, rows - 1); }
    });
    const AX = 1300, KZ = -3410;   // 浅草寺の中心線 (仲見世の真ん中) と雷門の位置

    // ===== 雷門 (風雷神門): 高さ11.7m。大提灯は高さ3.9m・重さ約700kg =====
    {
      const z0 = KZ - 3.5, z1 = KZ + 3.5;
      for (const [xa, xb] of [[1294.3, 1297.6], [1302.4, 1305.7]]) {
        pushPrism(SHU, null, rectPoly(xa, z0, xb, KZ - 0.2), 0, 6.6);                          // 裏 (北) 半分は壁
        pushPrism(SHU, null, rectPoly(xa, KZ - 0.2, xa + 0.5, z1), 0, 6.6); pushPrism(SHU, null, rectPoly(xb - 0.5, KZ - 0.2, xb, z1), 0, 6.6);
        for (let x = xa + 0.75; x < xb - 0.55; x += 0.42) pushPrism(BLK, null, rectPoly(x, z1 - 0.16, x + 0.12, z1 - 0.04), 0.9, 5.8, { solid: false });   // 格子
        solid(xa, KZ - 0.2, xb, z1, 0, 6.6);
      }
      pushPrism(SHU, 'ROOF', rectPoly(1294.3, z0, 1305.7, z1), 6.6, 8.1);
      jRoof(KAWARA, 1294.3, z0, 1305.7, z1, 8.1, 3.6, { over: 1.7, gable: SHU });
      chochin(AX, 4.95, KZ, 1.65, 3.9, '雷門', '風雷神門');
      figure(1303.9, KZ + 1.6, 0.6, 0.75, 0x4a8a6a, 'fujin'); figure(1296.1, KZ + 1.6, 0.6, 0.75, 0xc0503a, 'raijin');   // 向かって右に風神、左に雷神
      tiles(1288, KZ - 6, 1312, KZ + 6, '#b8ae9c', '#a69c8a', 1.5);
    }
    // ===== 仲見世: 雷門から宝蔵門まで約250m、両側に約90軒。夜は店が閉まり、シャッターの絵が並ぶ =====
    const NK0 = -3666, NK1 = KZ - 4;
    {
      const nkTex = night => makeTex((x, y) => {
        x.fillStyle = '#3a3436'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#efe6d6'; x.fillRect(0, 19, 32, 6);
        for (let i = 0; i < 32; i += 8) { x.fillStyle = '#4a3a30'; x.fillRect(i + 2, 20, 4, 3); y.fillStyle = rnd() < 0.4 ? '#ffd890' : '#000'; y.fillRect(i + 2, 20, 4, 3); }
        x.fillStyle = '#c4321c'; x.fillRect(0, 25, 32, 1);
        for (let i = 0; i < 32; i += 8) {
          if (!night) { x.fillStyle = '#5a3a28'; x.fillRect(i, 26, 8, 6); for (let k = 0; k < 6; k++) { x.fillStyle = pick(['#e84a3a', '#f0c040', '#3a8ad0', '#f4f0e8', '#e890b0', '#4aa860', '#c87a3a']); x.fillRect(i + 1 + (k % 3) * 2, 27 + Math.floor(k / 3) * 2, 2, 2); } y.fillStyle = '#ffd890'; y.fillRect(i + 1, 26, 6, 6); }
          else { x.fillStyle = pick(['#8ab0cc', '#a8c4a0', '#e8d0a8']); x.fillRect(i, 26, 8, 6); for (let k = 0; k < 5; k++) { x.fillStyle = pick(['#3a6ab0', '#d84a3a', '#e8c040', '#4a9a5a', '#f4f0e8']); x.fillRect(i + 1 + (rnd() * 5 | 0), 27 + (rnd() * 4 | 0), 2, 2); } y.fillStyle = '#5a4838'; y.fillRect(i, 26, 8, 6); }
        }
        x.fillStyle = '#c4321c'; for (let i = 0; i < 32; i += 8) x.fillRect(i, 19, 1, 13); y.fillStyle = '#000'; for (let i = 0; i < 32; i += 8) y.fillRect(i, 19, 1, 13);
      });
      const NKM = 'AS_NAKAMISE', tD = nkTex(false), tN = nkTex(true); MATS[NKM] = wallMats(NKM, tD);
      let nkNight = null;
      LM_UPDATERS.push(() => { const n = gameH >= 19 || gameH < 9; if (n !== nkNight) { nkNight = n; const m = WALL[NKM], tt = n ? tN : tD; m.map = tt.map; m.emissiveMap = tt.emi; m.needsUpdate = true; } });
      for (const [za, zb] of [[NK0, -3604], [-3596, -3504], [-3496, NK1]]) for (const [xa, xb, ex] of [[1288, 1296, 1296], [1304, 1312, 1302.7]]) {
        pushPrism(NKM, null, rectPoly(xa, za, xb, zb), 0, 6.4);
        jRoof(KAWARA, xa, za, xb, zb, 6.4, 1.7, { kind: 'hip', over: 0.6 });
        pushPrism(KAWARA, KAWARA, rectPoly(ex, za, ex + 1.3, zb), 3.1, 3.35, { solid: false });   // 店先のひさし
        for (let z = za + 3; z < zb - 2; z += 6) LANTERNS.push([ex === 1296 ? 1297.7 : 1302.3, z]);
      }
      tiles(1296, NK0, 1304, NK1, '#b8ae9c', '#a69c8a', 1.5);
      LM_ZONES.push(rectPoly(1284, NK0, 1316, NK1 + 10));
      LM_PEOPLE.push([[1298, NK1, 1298, NK0], 34], [[1302, NK0, 1302, NK1], 34], [[1260, KZ + 8, 1340, KZ + 8], 14]);
      // 新仲見世 (アーケード) と伝法院通り
      for (const [xa, xb] of [[1212, 1288], [1312, 1336]]) {
        pushPrism(GLASSR, GLASSR, rectPoly(xa, -3503, xb, -3497), 8, 8.3, { solid: false, bottom: true });
        for (let x = xa + 2; x < xb; x += 10) for (const z of [-3503, -3497.3]) pushPrism('CONC', null, rectPoly(x, z, x + 0.3, z + 0.3), 0, 8, { solid: false });
      }
      tiles(1210, -3605, 1288, -3595, '#a89c88', '#968a76', 2); tiles(1312, -3605, 1392, -3595, '#a89c88', '#968a76', 2);
    }
    // ===== 宝蔵門: 高さ22.7mの二階建ての門。裏に長さ4.5mの大わらじ =====
    const HZ = -3680;
    {
      const z0 = HZ - 4, z1 = HZ + 4;
      for (const [xa, xb] of [[1289.5, 1296], [1304, 1310.5]]) {
        pushPrism(SHU, null, rectPoly(xa, z0, xb, HZ), 0, 8.5);
        pushPrism(SHU, null, rectPoly(xa, HZ, xa + 0.6, z1), 0, 8.5); pushPrism(SHU, null, rectPoly(xb - 0.6, HZ, xb, z1), 0, 8.5);
        for (let x = xa + 0.9; x < xb - 0.7; x += 0.45) pushPrism(BLK, null, rectPoly(x, z1 - 0.16, x + 0.12, z1 - 0.04), 1, 7.4, { solid: false });
        solid(xa, HZ, xb, z1, 0, 8.5);
        figure((xa + xb) / 2, HZ + 2, 0.8, 1.9, 0x8a3a2a, 'nio');                                            // 仁王像
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.35, 12).rotateX(Math.PI / 2).scale(1, 3, 1), lam({ color: 0xc8b070, map: tex(8, 32, g => { g.fillStyle = '#c8b070'; g.fillRect(0, 0, 8, 32); g.fillStyle = '#a89050'; for (let j = 0; j < 32; j += 3) g.fillRect(0, j, 8, 1); }) }));
        w.position.set((xa + xb) / 2, 4.3, z0 - 0.3); chunkAt(xa, z0).group.add(w);                          // 大わらじ (裏側)
      }
      pushPrism(SHU, 'ROOF', rectPoly(1289.5, z0, 1310.5, z1), 7.5, 8.5);
      jRoof(KAWARA, 1289.5, z0, 1310.5, z1, 8.5, 1.7, { kind: 'band', over: 1.8 });
      pushPrism(SHU, null, rectPoly(1291.5, z0 + 1, 1308.5, z1 - 1), 10.2, 15.6);
      jRoof(KAWARA, 1291.5, z0 + 1, 1308.5, z1 - 1, 15.6, 7.1, { over: 2.4, gable: SHU });
      chochin(AX, 5.6, HZ, 1.35, 3.75, '小舟町');
      tiles(1286, z0 - 2, 1314, z1 + 2, '#b8ae9c', '#a69c8a', 1.5);
    }
    // ===== 境内: 常香炉・手水舎・本堂・五重塔・浅草神社 =====
    tiles(1232, -3812, 1372, HZ - 4, '#bfb4a0', '#ada28e', 3);
    LM_ZONES.push(rectPoly(1230, -3815, 1375, HZ + 6));
    LM_PEOPLE.push([[1300, HZ - 6, 1300, -3756], 18], [[1270, -3700, 1330, -3740], 8], [[1330, -3700, 1270, -3745], 8]);
    for (let z = -3800; z < -3690; z += 12) { ROUND.push([1236, z, 1.1]); ROUND.push([1370, z + 6, 1.05]); }
    { // 常香炉 (煙を体の悪いところにかける)
      const cx = AX, cz = -3722, br = WALL.BRONZE;
      mesh(new THREE.CylinderGeometry(1.4, 1.7, 1.2, 8), br, cx, 0.6, cz); mesh(new THREE.CylinderGeometry(2.1, 1.3, 1.1, 8), br, cx, 1.75, cz);
      for (const [dx, dz] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) mesh(new THREE.BoxGeometry(0.18, 2.4, 0.18), br, cx + dx, 3.4, cz + dz);
      mesh(new THREE.ConeGeometry(2.6, 1.4, 4).rotateY(Math.PI / 4), br, cx, 5.2, cz);
      const smk = mesh(new THREE.CylinderGeometry(1.6, 0.6, 3.5, 8, 1, true), new THREE.MeshLambertMaterial({ color: 0xd8d8d4, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }), cx, 4, cz);
      LM_UPDATERS.push((dt, t) => { smk.rotation.y = t * 0.4; smk.scale.set(1 + Math.sin(t * 1.3) * 0.15, 1 + Math.sin(t * 0.9) * 0.1, 1); });
      solid(cx - 1.8, cz - 1.8, cx + 1.8, cz + 1.8, 0, 2.3);
      // 手水舎
      const tx = 1272, tz = -3708; mesh(new THREE.BoxGeometry(3.6, 0.9, 1.6), WALL[STONE], tx, 0.45, tz);
      for (const [dx, dz] of [[-2.2, -1.6], [2.2, -1.6], [-2.2, 1.6], [2.2, 1.6]]) pushPrism(SHU, null, rectPoly(tx + dx - 0.15, tz + dz - 0.15, tx + dx + 0.15, tz + dz + 0.15), 0, 3.2, { solid: false });
      jRoof(KAWARA, tx - 2.4, tz - 1.8, tx + 2.4, tz + 1.8, 3.2, 1.6, { over: 0.8, solid: false });
    }
    { // 本堂 (観音堂): 高さ29.4m。大提灯は「志ん橋」。屋根瓦は実はチタン製
      pushPrism(STONE, STONE, rectPoly(1279, -3810, 1321, -3766), 0, 3);
      stairs([1288, -3766, 1312, -3756], 3, 'z-');
      pushPrism(SHU, 'ROOF', rectPoly(1285, -3802, 1315, -3777), 3, 13);
      for (let x = 1285; x <= 1315; x += 6) pushPrism(SHU, null, rectPoly(x - 0.45, -3770.4, x + 0.45, -3769.5), 3, 13);   // 外陣の柱
      pushPrism(SHU, 'ROOF', rectPoly(1284.5, -3777, 1315.5, -3769.5), 12.2, 13);
      pushPrism(BLK, null, rectPoly(1285.2, -3777.2, 1314.8, -3777), 3, 12.2, { solid: false });
      jRoof(KAWARA, 1283, -3806, 1317, -3768, 13, 16.4, { over: 3.2, gable: SHU });
      chochin(AX, 9.6, -3772.5, 1.5, 4, '志ん橋');
      mesh(new THREE.BoxGeometry(5, 1.1, 1.6), WALL.WOOD, AX, 3.55, -3775); solid(AX - 2.5, -3775.8, AX + 2.5, -3774.2, 3, 4.1);   // 賽銭箱
      const omi = tex(32, 16, g => { g.fillStyle = '#6a3a22'; g.fillRect(0, 0, 32, 16); g.fillStyle = '#3a2214'; for (let i = 0; i < 32; i += 3) for (let j = 0; j < 16; j += 3) g.fillRect(i, j, 1, 1); g.fillStyle = '#e8dcc0'; for (let i = 1; i < 32; i += 3) for (let j = 1; j < 16; j += 3) g.fillRect(i, j, 2, 2); });
      for (const ox of [1290, 1310]) { mesh(new THREE.BoxGeometry(3.2, 2.2, 0.8), lam({ map: omi }), ox, 4.1, -3776.4); solid(ox - 1.6, -3776.8, ox + 1.6, -3776, 3, 5.2); }
    }
    // おみくじ: 浅草寺は昔ながらの「観音百籤」の割合どおりで、凶がおよそ3割
    const OMI = [['大吉', 17, '願いごとは思いのままに叶うでしょう'], ['吉', 35, '焦らず進めば道がひらけるでしょう'], ['半吉', 5, '半ばよし。足もとをよく見て'], ['小吉', 4, '小さな幸せが続くでしょう'],
      ['末小吉', 3, 'のちに少しずつよくなるでしょう'], ['末吉', 6, 'これからだんだんよくなるでしょう'], ['凶', 30, '慎めば災いは避けられる。境内に結んでいこう']];
    LM_ACTIONS.push({ at: () => P.y > 2.5 && P.y < 5 && [1290, 1310].some(ox => Math.hypot(P.x - ox, P.z + 3775) < 3.2), prompt: () => 'E　おみくじを引く',
      act: () => { let q = Math.random() * 100, k = 0; while (q >= OMI[k][1]) q -= OMI[k++][1]; const [n, , msg] = OMI[k]; toast(`🎋 第${1 + (Math.random() * 100 | 0)}番 ${n} ― ${msg}`); toastTimer = 5.5; if (n === '大吉') setTimeout(() => achieve('daikichi'), 3000); } });
    { // 五重塔: 高さ約53m。最上層に仏舎利
      const cx = 1256, cz = -3712;
      pushPrism(WHT, 'ROOF', rectPoly(cx - 8, cz - 8, cx + 8, cz + 8), 0, 3.6); pushPrism(SHU, null, rectPoly(cx - 8.1, cz - 8.1, cx + 8.1, cz + 8.1), 3.0, 3.6, { solid: false });
      let y = 3.6;
      for (let i = 0; i < 5; i++) {
        const hw = 4.8 - i * 0.48; pushPrism(SHU, null, rectPoly(cx - hw, cz - hw, cx + hw, cz + hw), y, y + 4.2);
        if (i < 4) jRoof(KAWARA, cx - hw, cz - hw, cx + hw, cz + hw, y + 4.2, 1.8, { kind: 'band', over: 2.4 - i * 0.12 });
        else jRoof(KAWARA, cx - hw, cz - hw, cx + hw, cz + hw, y + 4.2, 4.4, { kind: 'hip', over: 2.0, flare: 0.25 });
        y += 6;
      }
      const top = y - 6 + 4.2 + 4.4, gm = WALL[GOLD];
      mesh(new THREE.CylinderGeometry(0.22, 0.32, 53.3 - top, 6), WALL.BRONZE, cx, (top + 53.3) / 2, cz);
      for (let k = 0; k < 9; k++) mesh(new THREE.CylinderGeometry(1.05 - k * 0.03, 1.05 - k * 0.03, 0.22, 10), gm, cx, top + 2.5 + k * 1.15, cz);
      mesh(new THREE.OctahedronGeometry(0.7, 0), gm, cx, 52.6, cz);
      solid(cx - 0.4, cz - 0.4, cx + 0.4, cz + 0.4, top, 53.3);
    }
    { // 浅草神社 (三社さま)
      pushPrism(STONE, STONE, rectPoly(1336, -3802, 1360, -3784), 0, 0.6);
      pushPrism(BLK, 'ROOF', rectPoly(1338, -3800, 1358, -3786), 0.6, 6);
      for (let x = 1338; x <= 1358; x += 5) pushPrism(GOLD, null, rectPoly(x - 0.2, -3786.3, x + 0.2, -3785.9), 0.6, 6, { solid: false });
      jRoof('RF_COPPER', 1338, -3800, 1358, -3786, 6, 5, { over: 1.6, gable: GOLD });
      torii(1348, -3772, 0, true, 0x9a9488);
    }
    // ===== 浅草花やしき: 1853年開園の日本最古の遊園地。ローラーコースターは1953年生まれ (最高時速42km) =====
    {
      const [X0, Z0, X1, Z1] = [1212, -3802, 1254, -3742];
      fr(X0, Z0, X1, Z1, '#9a9488'); LM_ZONES.push(rectPoly(X0 - 2, Z0 - 2, X1 + 2, Z1 + 2));
      for (const r of [[X0, Z0, X1, Z0 + 0.6], [X0, Z0, X0 + 0.6, Z1], [X1 - 0.6, Z0, X1, Z1], [X0, Z1 - 0.6, 1228, Z1], [1236, Z1 - 0.6, X1, Z1]]) pushPrism(WHT, WHT, rectPoly(...r), 0, 2.4);
      const hana = M('AS_HANA', '#f0d8b0', '#e86a5a', 0.7, 4, 4), hana2 = M('AS_HANA2', '#a8d4e0', '#f4f0e8', 0.6, 4, 3);
      addBuilding(1214, -3800, 1226, -3784, 7, hana, { noRoofBox: true }); addBuilding(1240, -3800, 1252, -3790, 10, hana2, { noRoofBox: true });
      addBuilding(1222, -3776, 1244, -3764, 6, hana2, { noRoofBox: true }); addBuilding(1214, -3760, 1224, -3746, 5, hana, { noRoofBox: true });
      // 門と看板
      for (const x of [1227.4, 1236.6]) pushPrism(RED, null, rectPoly(x - 0.4, Z1 - 0.4, x + 0.4, Z1 + 0.4), 0, 5);
      const sgn = tex(128, 24, g => { g.fillStyle = '#f4ecd8'; g.fillRect(0, 0, 128, 24); g.fillStyle = '#c83a2a'; g.font = 'bold 15px "DotGothic16", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('浅草花やしき', 64, 12); });
      const sm = glow(lam({ map: sgn }), 0xffffff, 0.6); mesh(new THREE.BoxGeometry(9.6, 1.8, 0.3), [WALL[RED], WALL[RED], WALL[RED], WALL[RED], sm, sm], 1232, 5.4, Z1);
      // ローラーコースター: 敷地の中をくねくね走る (営業時間 10〜18時だけ動く)
      const CP = []; const NP = 120;
      for (let i = 0; i < NP; i++) { const a = i / NP * Math.PI * 2; CP.push([1233 + Math.cos(a) * 17 * (1 + 0.12 * Math.cos(3 * a)), -3772 + Math.sin(a) * 26, 4.2 + 2.6 * Math.sin(a * 3) + 1.4 * Math.sin(a * 5)]); }
      for (let i = 0; i < NP; i++) { const a = CP[i], b = CP[(i + 1) % NP]; pushSlope(RED, RED, [a[0], a[1]], [b[0], b[1]], 0.7, a[2], b[2], 0.35); if (i % 4 === 0) pushPrism(WHT, null, rectPoly(a[0] - 0.2, a[1] - 0.2, a[0] + 0.2, a[1] + 0.2), 0, a[2] - 0.35, { solid: false }); }
      const cg = new THREE.Group(); scene.add(cg); const cm = lam({ color: 0x2a6ad0 }), cs = lam({ color: 0xf0c040 });
      const cars = [0, 1, 2].map(k => { const g = new THREE.Group(); box(1.3, 0.8, 2.2, k ? cs : cm, 0, 0.5, 0, g); cg.add(g); return g; });
      let cs0 = 0;
      LM_UPDATERS.push(dt => {
        if (gameH >= 10 && gameH < 18) cs0 = (cs0 + dt * 11 / (Math.PI * 2 * 22) * NP) % NP;
        cars.forEach((g, k) => { const f = (cs0 - k * 1.1 + NP) % NP, i = Math.floor(f), a = CP[i], b = CP[(i + 1) % NP], u = f - i; g.position.set(a[0] + (b[0] - a[0]) * u, a[2] + (b[2] - a[2]) * u, a[1] + (b[1] - a[1]) * u); g.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]); });
      });
      LM_PEOPLE.push([[1230, -3748, 1238, -3796], 6]);
    }
    // ===== 浅草文化観光センター (隈研吾の設計。平屋を7つ積み重ねた形)。8階の展望テラスは無料 =====
    const TC = [1306, -3392, 1320, -3378];
    {
      const kuma = LM_MAT('AS_KUMA', (x, y) => { x.fillStyle = '#c8ccd0'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let i = 0; i < 32; i += 2) { x.fillStyle = '#a8784a'; x.fillRect(i, 0, 1, 32); } y.fillStyle = '#5a4a38'; for (let i = 1; i < 32; i += 2) y.fillRect(i, 0, 1, 32); });
      const kroof = C('AS_KROOF', 0x8a8a86);
      for (let k = 0; k < 7; k++) { const y0 = k * 4.7; pushPrism(kuma, null, rectPoly(...TC), y0, y0 + 3.7); jRoof(kroof, ...TC, y0 + 3.7, 1.0, { kind: 'hip', over: 0.5, flare: 0.6 }); }
      pushPrism('CONC', 'CONC', rectPoly(...TC), 32.4, 32.9); solid(...TC, 0, 32.9);
      for (const r of [[TC[0], TC[1], TC[2], TC[1] + 0.2], [TC[0], TC[3] - 0.2, TC[2], TC[3]], [TC[0], TC[1], TC[0] + 0.2, TC[3]], [TC[2] - 0.2, TC[1], TC[2], TC[3]]]) pushPrism('AS_RAILGLASS', null, rectPoly(...r), 32.9, 34.0);
      LM_ACTIONS.push({ at: () => P.y < 2 && Math.hypot(P.x - 1313, P.z + 3394) < 3, prompt: () => 'E　エレベーターで8階の展望テラスへ', act: () => lmWarp(1313, 32.95, -3387, 0, '🛗 8階 展望テラス。正面に雷門と仲見世、右にスカイツリー') },
        { at: () => P.y > 30 && P.y < 36 && inR(TC, P.x, P.z), prompt: () => 'E　エレベーターで1階へ', act: () => lmWarp(1313, 0, -3394.5, 0, '🛗 1階に下りた') });
      LM_HEIGHT_AREAS.push(['浅草文化観光センター 展望テラス', (x, z, y) => y > 30 && y < 37 && inR(TC, x, z)]);
      LM_ZONES.push(rectPoly(TC[0] - 2, TC[1] - 2, TC[2] + 2, TC[3] + 2));
    }
    // ===== 人力車 (雷門通りを行ったり来たり) =====
    {
      const bk = lam({ color: 0x1e1c1c }), rd = lam({ color: 0xb8302a }), sk = lam({ color: 0xe0b896 }), wh = lam({ color: 0x2a2a2e });
      const RK = [0, 1].map(k => {
        const g = new THREE.Group(); scene.add(g);
        for (const s of [-0.8, 0.8]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.1, 12), wh); w.rotation.z = Math.PI / 2; w.position.set(s, 0.75, 0); g.add(w); }
        box(1.5, 0.5, 1.0, rd, 0, 1.2, -0.1, g); box(1.5, 0.9, 0.2, bk, 0, 1.75, -0.55, g); box(1.6, 0.12, 1.2, bk, 0, 2.3, -0.3, g);
        for (const s of [-0.55, 0.55]) box(0.08, 0.08, 2.4, bk, s, 1.0, 1.3, g);
        box(0.3, 0.9, 0.3, wh, -0.16, 0.45, 2.4, g); box(0.3, 0.9, 0.3, wh, 0.16, 0.45, 2.4, g); box(0.7, 0.75, 0.4, bk, 0, 1.25, 2.4, g); box(0.34, 0.34, 0.34, sk, 0, 1.85, 2.4, g);
        const hat = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.2, 10), lam({ color: 0xd8c88a })); hat.position.set(0, 2.1, 2.4); g.add(hat);
        return { g, x: 1220 + k * 70, d: k ? -1 : 1 };
      });
      LM_UPDATERS.push(dt => { for (const r of RK) { r.x += r.d * 2.3 * dt; if (r.x > 1338) r.d = -1; if (r.x < 1212) r.d = 1; r.g.position.set(r.x, 0, -3398.6 + r.d * 1.6); r.g.rotation.y = r.d > 0 ? Math.PI / 2 : -Math.PI / 2; } });
    }

    // ===== 隅田川: 吾妻橋 (赤い橋)・東武の浅草駅と鉄橋・すみだリバーウォーク・東京ミズマチ =====
    const bankW = z => { for (let x = 1100; x < 1800; x++) if (inRiver(x, z)) return x; return 1800; };
    const bankE = z => { let x = bankW(z); while (x < 1900 && inRiver(x, z)) x++; return x; };
    { // 吾妻橋を赤く塗る (橋の両側に赤いアーチと欄干)
      const br = BRIDGE_POLYS.find(b => b[1] === '吾妻橋'); if (br) {
        const [A, B, Cc, D] = br[0], m0 = [(A[0] + D[0]) / 2, (A[1] + D[1]) / 2], m1 = [(B[0] + Cc[0]) / 2, (B[1] + Cc[1]) / 2];
        for (const [p, q] of [[A, B], [D, Cc]]) for (let k = 0; k < 24; k++) {
          const t0 = k / 24, t1 = (k + 1) / 24, a = [p[0] + (q[0] - p[0]) * t0, p[1] + (q[1] - p[1]) * t0], b = [p[0] + (q[0] - p[0]) * t1, p[1] + (q[1] - p[1]) * t1];
          const dy = t => 6 * Math.sin(Math.PI * t), arch = t => -1.6 + (dy(t) - 1.6) * Math.min(1, Math.sin(Math.PI * t) * 1.6);
          pushSlope(RED, RED, a, b, 0.35, Math.max(0.12, dy(t0)) + 1.15, Math.max(0.12, dy(t1)) + 1.15, 0.25);
          if (t0 > 0.1 && t1 < 0.9) pushSlope(RED, RED, a, b, 0.4, arch(t0), arch(t1), 0.9);
        }
        LM_LABELS.push(['吾妻橋 (赤い橋)', (m0[0] + m1[0]) / 2, (m0[1] + m1[1]) / 2 + 16, '🔴', '吾妻橋']);
      }
    }
    // 東武の浅草駅 (1931年開業。電車は2階から出て、急カーブで隅田川を渡る)
    const EK = [1338, -3472, 1398, -3410];
    {
      const eki = LM_MAT('AS_EKI', (x, y) => { x.fillStyle = '#e8dcc0'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let j = 2; j < 26; j += 8) for (let i = 1; i < 32; i += 4) { x.fillStyle = '#5a6a74'; x.fillRect(i, j + 1, 2, 5); x.fillRect(i, j, 2, 1); y.fillStyle = rnd() < 0.6 ? pick(LIT) : '#000'; y.fillRect(i, j + 1, 2, 5); } x.fillStyle = '#2a3440'; x.fillRect(0, 27, 32, 5); y.fillStyle = '#ffe2a8'; y.fillRect(0, 27, 32, 5); });
      addBuilding(...EK, 28, eki, { noRoofBox: true });
      const sgn = tex(96, 24, g => { g.fillStyle = '#1e3a6a'; g.fillRect(0, 0, 96, 24); g.fillStyle = '#ffffff'; g.font = 'bold 15px "DotGothic16", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('東武 浅草駅', 48, 12); });
      const sm = glow(lam({ map: sgn }), 0xffffff, 0.8); mesh(new THREE.BoxGeometry(0.3, 2.2, 9), [sm, sm, WALL[BLK], WALL[BLK], WALL[BLK], WALL[BLK]], EK[2] + 0.2, 13, -3422);
      LM_ZONES.push(rectPoly(EK[0] - 2, EK[1] - 2, EK[2] + 2, EK[3] + 2));
    }
    // 鉄橋 (u = 橋の向き、v = 下流側が +) とリバーウォーク (下流側に添えられた歩道橋。7〜22時)
    const FB = frame(1415, -3430, 0.866, 0.5, -0.5, 0.866), BL = 150;
    const RAILP = [[1352, -3446], [1396, -3446], [1409, -3437.5], FB.w(0, 0), FB.w(BL, 0), [1572, -3352], [1886, -3352]];
    {
      const gird = C('AS_GIRDER', 0xe8eef4, 0x6ec8ff);
      oBox(FB, gird, -6, -3.6, BL + 4, 3.6, 4.6, 7.0, { top: 'ASPH', bottom: true, solid: false });
      for (let u = -6; u < BL + 4; u += 2) { const [x, z] = FB.w(u, 0); solid(x - 1.6, z - 1.6, x + 1.6, z + 1.6, 4.6, 7.0); }
      for (const u of [38, 75, 112]) oBox(FB, 'CONC', u - 1.5, -3.4, u + 1.5, 3.4, -4, 4.6, { solid: false });
      for (let u = -6; u < BL + 4; u += 3) oBox(FB, gird, u, -3.7, u + 0.4, -3.5, 7.0, 8.6, { solid: false });   // 北側の柵
      // リバーウォーク
      const RW0 = -14, RW1 = BL + 12, VM = 5.9;
      oBox(FB, 'AS_RWDECK', RW0, 4.2, RW1, 7.6, 5.5, 6.2, { solid: false, bottom: true });
      if (!WALL.AS_RWDECK) WALL.AS_RWDECK = lam({ color: 0xb8b4ac });
      for (let u = RW0; u < RW1; u += 1) { const [x, z] = FB.w(u, VM); solid(x - 1.05, z - 1.05, x + 1.05, z + 1.05, 5.5, 6.2); }
      for (let u = RW0; u < RW1; u += 2) { oBox(FB, SKYW, u, 7.4, u + 2, 7.6, 7.25, 7.45, { solid: false }); oBox(FB, SKYW, u, 7.42, u + 0.15, 7.58, 6.2, 7.25, { solid: false }); const [x, z] = FB.w(u + 1, 7.75); solid(x - 0.3, z - 0.3, x + 0.3, z + 0.3, 6.2, 7.45); }
      for (let u = RW0; u < RW1; u += 4) { oBox(FB, 'AS_RAILGLASS', u, 4.05, u + 4, 4.2, 6.2, 7.6, { solid: false }); oBox(FB, SKYW, u, 4.0, u + 0.15, 4.25, 6.2, 7.6, { solid: false }); }
      for (const u of [52, 78, 104]) oBox(FB, 'AS_GLASSFLOOR', u, 5.0, u + 2.2, 6.8, 6.2, 6.24, { solid: false });
      if (!WALL.AS_GLASSFLOOR) WALL.AS_GLASSFLOOR = lam({ color: 0x6aa8c8, emissive: 0x4a88a8, emissiveIntensity: 0.3 });
      const W = FB.w(RW0, VM), E = FB.w(RW1, VM);
      solid(W[0] - 1.8, W[1] - 1.8, W[0] + 1.8, W[1] + 1.8, 5.5, 6.2); solid(E[0] - 1.8, E[1] - 1.8, E[0] + 1.8, E[1] + 1.8, 5.5, 6.2);
      stairs([W[0] - 1.7, W[1] + 1.2, W[0] + 1.7, W[1] + 20], 6.2, 'z-'); stairs([E[0] - 1.7, E[1] + 1.2, E[0] + 1.7, E[1] + 20], 6.2, 'z-');
      LM_HEIGHT_AREAS.push(['すみだリバーウォーク', (x, z, y) => y > 4.5 && y < 9 && (() => { const dx = x - FB.ox, dz = z - FB.oz, u = dx * FB.ux + dz * FB.uz, v = dx * FB.vx + dz * FB.vz; return u > RW0 - 2 && u < RW1 + 2 && v > 3.8 && v < 8.4; })()]);
      LM_LABELS.push(['リバーウォーク', ...FB.w(BL / 2, 14), '🚶', 'すみだリバーウォーク']);
      // 夜は鉄橋もスカイツリーと同じ色に灯る
      LM_UPDATERS.push(() => { const m = WALL[gird]; m.emissive.setHex(SKY_COL()); m.emissiveIntensity = NIGHT > 0.05 && (gameH >= 12 || gameH < 1) ? NIGHT * 0.45 : 0; });
      // 東京ミズマチ (高架下のお店) と高架・とうきょうスカイツリー駅
      pushPrism('CONC', 'ASPH', rectPoly(1560, -3357, 1890, -3347), 5.6, 7.0, { bottom: true });
      pushPrism('CONC', 'ASPH', [FB.w(BL - 2, -5), [1572, -3357], [1572, -3347], FB.w(BL - 2, 5)], 5.6, 7.0, { solid: false });
      const mzm = LM_MAT('AS_MIZUMACHI', (x, y) => { x.fillStyle = '#f2f0ea'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let i = 0; i < 32; i += 8) { x.fillStyle = '#3a4650'; x.fillRect(i + 1, 22, 6, 10); y.fillStyle = '#ffdca0'; y.fillRect(i + 1, 22, 6, 10); x.fillStyle = '#d8d4cc'; x.fillRect(i, 18, 8, 1); } });
      for (let x = 1582; x < 1830; x += 32) pushPrism(mzm, null, rectPoly(x, -3356, x + 28, -3348), 0, 5.6);
      for (let x = 1580; x < 1890; x += 32) pushPrism('CONC', null, rectPoly(x, -3357, x + 2, -3347), 0, 5.6);
      tiles(1560, -3347, 1830, -3338, '#c8c0b0', '#b8b0a0', 3);
      for (let x = 1586; x < 1826; x += 16) BENCHES.push([x, -3341, 0]);
      pushPrism('CONC', 'CONC', rectPoly(1828, -3362, 1888, -3357), 5.6, 7.6); pushPrism('CONC', 'CONC', rectPoly(1828, -3347, 1888, -3342), 5.6, 7.6);
      pushPrism(SKYW, SKYW, rectPoly(1828, -3363, 1888, -3341), 11.4, 11.8, { solid: false, bottom: true });
      LM_ZONES.push(rectPoly(1545, -3365, 1892, -3336));
      LM_PEOPLE.push([[1565, -3343, 1825, -3343], 12]);
    }
    // 東武の電車は engine/12d の鉄道のしくみで走る (regions/01_rail_lines.js の東武スカイツリーライン)
    // 隅田公園 (両岸): 桜並木は8代将軍吉宗が庶民の花見のために植えさせたのが始まり
    {
      const strip = (zA, zB, east) => {
        for (let z = zA; z > zB; z -= 50) {
          const z1 = Math.max(zB, z - 50), b0 = east ? bankE(z) : bankW(z), b1 = east ? bankE(z1) : bankW(z1), s = east ? 1 : -1;
          const P = [[b0 + s * 7, z], [b0 + s * 50, z], [b1 + s * 50, z1], [b1 + s * 7, z1]];
          polyFr(P, GRASS); polyFr([[b0 + s * 24, z], [b0 + s * 29, z], [b1 + s * 29, z1], [b1 + s * 24, z1]], PATH); LM_ZONES.push(P);
          SPOT_AREAS.push([east ? '隅田公園 (墨田区側)' : '隅田公園', Math.min(b0, b1) + (east ? 7 : -50), z1, Math.max(b0, b1) + (east ? 50 : -7), z]);
          for (let k = 0; k < 50; k += 9) { const t = k / 50, b = b0 + (b1 - b0) * t, zz = z - k; SAKURA.push([b + s * 10, zz, rr(1.0, 1.3)]); SAKURA.push([b + s * 18, zz - 4, rr(1.0, 1.25)]); if (k % 18 === 0) SAKURA.push([b + s * 40, zz - 2, rr(0.9, 1.2)]); }
          for (let k = 5; k < 50; k += 16) { const b = b0 + (b1 - b0) * k / 50; BENCHES.push([b + s * 22, z - k, east ? -Math.PI / 2 : Math.PI / 2]); LAMPS2.push([b + s * 30.5, z - k]); }
        }
      };
      strip(-3478, -3950, false); strip(-3372, -3950, true);
      LM_PEOPLE.push([[bankW(-3500) - 27, -3500, bankW(-3900) - 27, -3900], 12], [[bankE(-3400) + 27, -3400, bankE(-3900) + 27, -3900], 12]);
      LM_LABELS.push(['隅田公園', bankW(-3700) - 30, -3700, '🌸'], ['隅田公園', bankE(-3800) + 30, -3800, '🌸', '隅田公園 (墨田区側)']);
      // 牛嶋神社 (撫で牛)
      const ux = bankE(-3570) + 36, uz = -3570;
      pushPrism(STONE, STONE, rectPoly(ux - 9, uz - 8, ux + 9, uz + 4), 0, 0.5); pushPrism(BLK, 'ROOF', rectPoly(ux - 7, uz - 6, ux + 7, uz + 2), 0.5, 5);
      jRoof('RF_COPPER', ux - 7, uz - 6, ux + 7, uz + 2, 5, 4, { over: 1.4, gable: GOLD }); torii(ux, uz + 14, 0, true, 0x9a9488);
      const cow = lam({ color: 0x3a3632 }); mesh(new THREE.BoxGeometry(1.0, 0.9, 2.1), cow, ux - 5, 0.95, uz + 8); mesh(new THREE.BoxGeometry(0.7, 0.6, 0.7), cow, ux - 5, 1.2, uz + 9.3); mesh(new THREE.BoxGeometry(1.4, 0.5, 2.6), WALL[STONE], ux - 5, 0.25, uz + 8);
      solid(ux - 5.7, uz + 6.7, ux - 4.3, uz + 9.7, 0, 1.5);
      SPOT_AREAS.unshift(['牛嶋神社', ux - 10, uz - 9, ux + 10, uz + 17]);
      for (let i = SAKURA.length - 1; i >= 0; i--) if (Math.hypot(SAKURA[i][0] - ux, SAKURA[i][1] - uz - 4) < 18) SAKURA.splice(i, 1);   // 社殿の前は木を植えない
      LM_LABELS.push(['牛嶋神社', ux, uz, '⛩']);
    }
    // 駒形堂 (浅草寺の観音さまが隅田川から上陸した場所とされる)
    { const cx = 1236, cz = -3122; pushPrism(STONE, STONE, rectPoly(cx - 5, cz - 5, cx + 5, cz + 5), 0, 0.6); pushPrism(SHU, 'ROOF', rectPoly(cx - 3, cz - 3, cx + 3, cz + 3), 0.6, 4.4); jRoof(KAWARA, cx - 3, cz - 3, cx + 3, cz + 3, 4.4, 3.4, { kind: 'hip', over: 1.2 }); LM_ZONES.push(rectPoly(cx - 7, cz - 7, cx + 7, cz + 7)); }
    // アサヒビール本社 (ビールジョッキ形・上の白は泡) とスーパードライホールの「金の炎」(フィリップ・スタルク作、約360トン)
    {
      const am = M('AS_ASAHI', '#b8862a', '#e8b850', 0.55, 2, 2);
      pushPrism(am, 'ROOF', rectPoly(1552, -3292, 1584, -3256), 0, 90); pushPrism(WHT, 'ROOF', rectPoly(1551.4, -3292.6, 1584.6, -3255.4), 90, 100);
      pushPrism(BLK, 'ROOF', rectPoly(1514, -3290, 1546, -3264), 0, 22);
      const g = new THREE.Group(); g.position.set(1516, 22, -3277); chunkAt(1530, -3277).group.add(g);
      [[0, 1.6, 0, 6.2], [6.5, 2.2, 0, 5.2], [12, 3.2, 0.5, 4.1], [16.5, 4.6, 1, 3.1], [20.5, 6.4, 1.5, 2.2], [23.5, 8.6, 2, 1.4]].forEach(([dx, dy, dz, r0]) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r0, 10, 8), WALL[GOLD]); s.position.set(dx, dy, dz); s.scale.set(1.15, 0.7, 0.9); g.add(s); });
      solid(1510, -3283, 1542, -3271, 22, 26);
      LM_ZONES.push(rectPoly(1508, -3296, 1590, -3252));
    }
    // ===== 東京スカイツリー (634m): 足もとは三角形、上へいくほど丸くなる。天望デッキ (350m)・天望回廊 (450m) =====
    const SX = 1960, SZ = -3296;
    const SKY_COL = () => (new Date().getDate() % 2 ? 0x6ec8ff : 0xb07ce0);   // 1日ごとに「粋」(水色) と「雅」(紫)
    {
      const KR = [[0, 39], [80, 33], [200, 27.5], [300, 24.5], [340, 23.5], [420, 21], [497, 16]];
      const Rt = y => { for (let i = 0; i < KR.length - 1; i++) if (y <= KR[i + 1][0]) { const [y0, a] = KR[i], [y1, b] = KR[i + 1]; return a + (b - a) * (y - y0) / (y1 - y0); } return KR[KR.length - 1][1]; };
      const bl = y => Math.min(1, Math.max(0, y / 310)) ** 0.85, TH0 = -Math.PI / 2, T3 = Math.PI * 2 / 3;
      const inDeck = y => (y >= 342 && y <= 362) || (y >= 440 && y <= 456);
      const rho = (th, y) => { if (inDeck(y)) return 8.5; const R = Rt(y), ph = (((th - TH0) % T3) + T3) % T3 - Math.PI / 3, tri = Math.min(R * 0.9, (R / 2) / Math.cos(ph)); return tri + (R * 0.66 - tri) * bl(y); };
      // 鉄骨のトラス (白) と、そのすき間 (少し影になった藍白)。夜は鉄骨だけが光る
      const truss = (bg, fg) => tex(32, 32, g => { g.fillStyle = bg; g.fillRect(0, 0, 32, 32); g.fillStyle = fg; g.strokeStyle = fg; g.fillRect(0, 0, 32, 4); g.fillRect(0, 0, 4, 32); g.lineWidth = 3.2; g.beginPath(); g.moveTo(0, 0); g.lineTo(32, 32); g.moveTo(32, 0); g.lineTo(0, 32); g.stroke(); });
      const lat = truss('#b4c2ce', '#f2f6fa'), latE = truss('#000000', '#ffffff');
      const lm = farHaze(ps1(new THREE.MeshLambertMaterial({ map: lat, side: THREE.DoubleSide, emissive: 0x6ec8ff, emissiveMap: latE, emissiveIntensity: 0 })), 3.6, 0.8);
      const NS = 48, NY = 62, pos = [], uv = [], idx = [];
      for (let j = 0; j <= NY; j++) { const y = j * 8; for (let i = 0; i <= NS; i++) { const th = i / NS * Math.PI * 2, r0 = rho(th, y); pos.push(SX + Math.cos(th) * r0, y, SZ + Math.sin(th) * r0); uv.push(i / NS * 18, y / 8); } }
      for (let j = 0; j < NY; j++) for (let i = 0; i < NS; i++) { const a = j * (NS + 1) + i, b = a + NS + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
      const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); sg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); sg.setIndex(idx); sg.computeVertexNormals();
      FAR.group.add(new THREE.Mesh(sg, lm));
      const coreM = farLam(0xdfe4ea), deckM = farLam(0xd4dae0);
      mesh(new THREE.CylinderGeometry(4, 4, 375, 12), coreM, SX, 187.5, SZ, 0, true);                         // 心柱
      // ゲイン塔 (497〜634m)
      mesh(new THREE.CylinderGeometry(1.3, 6, 137, 8, 1, true), lm, SX, 565.5, SZ, 0, true); mesh(new THREE.CylinderGeometry(0.5, 2.2, 137, 6), coreM, SX, 565.5, SZ, 0, true);
      for (const y of [520, 560, 600]) mesh(new THREE.CylinderGeometry(3.2 - (y - 497) / 60, 3.2 - (y - 497) / 60, 1.2, 10), deckM, SX, y, SZ, 0, true);
      const beacon = mesh(new THREE.SphereGeometry(1.4, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff3020 }), SX, 634.5, SZ, 0, true);
      // 展望台: 床・ガラス・屋根
      const glassM = farHaze(new THREE.MeshLambertMaterial({ color: 0x9ac4dc, transparent: true, opacity: 0.32, side: THREE.DoubleSide, emissive: 0xffe0b0, emissiveIntensity: 0, depthWrite: false }), 3.6, 0.8);
      const deck = (r0, yF, hG) => {
        mesh(new THREE.CylinderGeometry(r0, r0 - 2, 4, 36), deckM, SX, yF - 2, SZ, 0, true); mesh(new THREE.CylinderGeometry(r0 + 0.3, r0 + 0.3, hG, 36, 1, true), glassM, SX, yF + hG / 2, SZ, 0, true);
        mesh(new THREE.CylinderGeometry(r0 - 1.5, r0 + 0.5, 4, 36), deckM, SX, yF + hG + 2, SZ, 0, true);
        for (let k = 0; k < 24; k++) { const a = (k + 0.5) / 24 * Math.PI * 2; mesh(new THREE.BoxGeometry(0.2, hG, 0.2), deckM, SX + Math.cos(a) * (r0 + 0.3), yF + hG / 2, SZ + Math.sin(a) * (r0 + 0.3), 0, true); const wr = r0 + 0.6; solid(SX + Math.cos(a) * wr - 0.9, SZ + Math.sin(a) * wr - 0.9, SX + Math.cos(a) * wr + 0.9, SZ + Math.sin(a) * wr + 0.9, yF, yF + hG); }   // 窓ぎわまで寄れる
        polySolid(regularPoly(SX, SZ, r0 + 1.2, 16), yF - 4, yF); polySolid(regularPoly(SX, SZ, r0 + 0.5, 16), yF + hG, yF + hG + 4);
      };
      deck(21, 350, 8); deck(16.5, 445, 7);
      GLOW.push([glassM, 0.8]);
      // 登れるように: 胴体の内側に四角い当たり判定 (展望台の高さは空けておく)
      for (let y = 0; y < 497; y += 8) { if ((y >= 330 && y < 366) || (y >= 432 && y < 456)) continue; const hs = Rt(y + 4) * (0.36 + 0.12 * bl(y + 4)); solid(SX - hs, SZ - hs, SX + hs, SZ + hs, y, y + 8); }
      solid(SX - 4, SZ - 4, SX + 4, SZ + 4, 0, 375);
      for (let y = 497; y < 634; y += 10) { const hs = 1.3 + (634 - y - 10) / 137 * 3.5; solid(SX - hs, SZ - hs, SX + hs, SZ + hs, y, Math.min(634, y + 10)); }
      // ライティング: 夜は「粋」と「雅」が1日ごとに交代。24時に消灯したあと、てっぺんは月ごとの誕生石の色
      const STONES = [0, 0xa0202a, 0x8a4ac8, 0x7ad4e0, 0xf4f8ff, 0x2ab86a, 0xf0e8e0, 0xe0203a, 0x9ad040, 0x2a50d8, 0xf0a8c8, 0xf0a020, 0x40c8d0];
      LM_UPDATERS.push((dt, t) => {
        const lit = NIGHT > 0.05 && gameH >= 12, late = NIGHT > 0.05 && gameH < 6;
        lm.emissive.setHex(SKY_COL()); lm.emissiveIntensity = lit ? NIGHT * 1.1 : 0;
        beacon.material.color.setHex(late ? STONES[MONTH] : (Math.sin(t * 3) > 0 || !NIGHT ? 0xff3020 : 0x401008));
      });
      // 足もと: 東京ソラマチ (西と東) と東タワー
      const sola = M('AS_SOLA', '#d8dde2', '#5a7088', 0.6, 3, 3);
      addBuilding(1856, -3338, 1922, -3254, 30, sola, { noRoofBox: true }); addBuilding(1998, -3338, 2112, -3254, 30, sola, { noRoofBox: true });
      addBuilding(2112, -3330, 2150, -3290, 158, M('AS_ETOWER', '#c8ced4', '#4a5a6a', 0.6, 2, 2), { noRoofBox: true });
      tiles(1922, -3340, 1998, -3250, '#c8c4bc', '#b4b0a8', 4);
      LM_ZONES.push(rectPoly(1840, -3362, 2160, -3236));
      LM_PEOPLE.push([[1925, -3256, 1995, -3256], 16], [[1930, -3330, 1930, -3256], 6]);
      // 天望シャトル (分速600m。地上から350mまで約50秒)
      LM_ACTIONS.push(
        { at: () => P.y < 3 && Math.hypot(P.x - SX, P.z - (SZ + 34)) < 4, prompt: () => 'E　天望シャトルで天望デッキ (350m) へ', act: () => lmWarp(SX, 350.05, SZ + 14, Math.PI, '🛗 天望デッキ フロア350 に到着 (分速600mで約50秒)') },
        { at: () => P.y > 349 && P.y < 352 && Math.hypot(P.x - SX, P.z - (SZ + 14)) < 3, prompt: () => 'E　エレベーターで天望回廊 (450m) へ', act: () => lmWarp(SX, 445.05, SZ + 13.5, Math.PI, '🛗 天望回廊に到着。ガラスの回廊を空中散歩') },
        { at: () => P.y > 349 && P.y < 352 && Math.hypot(P.x - SX, P.z - (SZ - 14)) < 3, prompt: () => 'E　エレベーターで地上へ', act: () => lmWarp(SX, 0, SZ + 37, Math.PI, '🛗 地上に下りた') },
        { at: () => P.y > 444 && P.y < 447 && Math.hypot(P.x - SX, P.z - (SZ + 13.5)) < 3, prompt: () => 'E　エレベーターで天望デッキ (350m) へ', act: () => lmWarp(SX, 350.05, SZ - 10, 0, '🛗 天望デッキに戻った') });
      for (const [y, z] of [[350, SZ + 14], [350, SZ - 14], [445, SZ + 13.5]]) { const d = mesh(new THREE.BoxGeometry(3, 3.2, 0.3), lam({ color: 0x8a96a2, emissive: 0x404850 }), SX, y + 1.6, z + Math.sign(z - SZ) * -1.8, 0, true); }
      LM_HEIGHT_AREAS.push(['東京スカイツリー 天望デッキ (350m)', (x, z, y) => y > 347 && y < 360 && Math.hypot(x - SX, z - SZ) < 23],
        ['東京スカイツリー 天望回廊 (450m)', (x, z, y) => y > 442 && y < 454 && Math.hypot(x - SX, z - SZ) < 19],
        ['東京スカイツリー てっぺん (634m)', (x, z, y) => y > 600 && Math.hypot(x - SX, z - SZ) < 10],
        ['東京スカイツリー', (x, z, y) => y > 12 && y < 640 && Math.hypot(x - SX, z - SZ) < 45]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報 =====
    SPOT_AREAS.push(['雷門', 1293, KZ - 5, 1307, KZ + 6], ['浅草寺 宝蔵門', 1288, HZ - 6, 1312, HZ + 6], ['浅草寺 本堂 (外陣)', 1284, -3778, 1316, -3768], ['浅草寺 本堂', 1279, -3810, 1321, -3756],
      ['浅草寺 常香炉', 1294, -3728, 1306, -3716], ['浅草寺 五重塔', 1246, -3722, 1266, -3702], ['浅草神社', 1330, -3806, 1366, -3766], ['浅草花やしき', 1210, -3804, 1256, -3740],
      ['仲見世', 1286, NK0, 1314, NK1], ['新仲見世通り', 1200, -3504, 1400, -3496], ['伝法院通り', 1200, -3606, 1400, -3594], ['浅草寺', 1230, -3815, 1375, HZ + 6],
      ['浅草文化観光センター', TC[0] - 2, TC[1] - 3, TC[2] + 2, TC[3] + 2], ['浅草駅 (東武)', EK[0] - 2, EK[1] - 2, EK[2] + 2, EK[3] + 2], ['駒形堂', 1229, -3129, 1243, -3115],
      ['アサヒビール 金の炎 (フラムドール)', 1510, -3294, 1548, -3260], ['アサヒビール本社', 1548, -3296, 1590, -3252], ['東京ミズマチ', 1560, -3362, 1830, -3336],
      ['東京スカイツリー', SX - 42, SZ - 42, SX + 42, SZ + 44], ['東京ソラマチ', 1852, -3342, 2152, -3250]);
    LM_LABELS.push(['雷門', AX, KZ + 12, '🏮'], ['仲見世', AX + 14, -3540, '🛍'], ['浅草寺', AX, -3790, '🙏', '浅草寺 本堂'], ['五重塔', 1256, -3712, '🏯', '浅草寺 五重塔'], ['浅草神社', 1348, -3793, '⛩'],
      ['花やしき', 1232, -3772, '🎢', '浅草花やしき'], ['観光センター', 1313, -3372, 'ℹ', '浅草文化観光センター'], ['東武 浅草駅', 1368, -3440, '🚉', '浅草駅 (東武)'], ['駒形堂', 1236, -3122, '🙏'],
      ['アサヒビール', 1550, -3274, '🍺', 'アサヒビール本社'], ['東京ミズマチ', 1700, -3340, '☕'], ['スカイツリー', SX, SZ, '🗼', '東京スカイツリー'], ['ソラマチ', 2050, -3296, '🛍', '東京ソラマチ']);
    Object.assign(LM_NOTES, {
      '浅草': '浅草寺の門前町。明治〜昭和には劇場や映画館が並ぶ、東京いちばんの盛り場だった',
      '雷門': '正式な名前は「風雷神門」。大提灯は高さ3.9m・重さ約700kg。今の門は1960年、松下幸之助の寄進で再建された',
      '仲見世': '日本で最も古い商店街のひとつ。雷門から宝蔵門まで約250mに、約90のお店が並ぶ',
      '新仲見世通り': '仲見世と十字に交わる、屋根つきのアーケード商店街',
      '伝法院通り': '江戸の町並み風の商店街。名前は浅草寺の本坊「伝法院」から',
      '浅草寺 宝蔵門': '裏に掛かる大わらじは長さ4.5m・重さ約500kg。山形県村山市から、ほぼ10年ごとに奉納されている',
      '浅草寺': '明治6年、浅草寺の境内は日本で最初の「公園」のひとつ (浅草公園) になった',
      '浅草寺 本堂': '都内最古のお寺。628年、隅田川で漁をしていた兄弟の網にかかった観音像が始まりと伝わる',
      '浅草寺 本堂 (外陣)': '大提灯の「志ん橋」は新橋の人たちの奉納。屋根の瓦は、見た目は瓦でも実はチタン製',
      '浅草寺 常香炉': '煙を体の悪いところにかけると良くなるといわれている',
      '浅草寺 五重塔': '高さ約53m。いちばん上の層には、お釈迦さまの遺骨 (仏舎利) が納められている',
      '浅草神社': '浅草寺の始まりに関わった3人を祀るので「三社さま」。5月の三社祭は江戸三大祭りのひとつ',
      '浅草花やしき': 'ペリー来航と同じ1853年に、花園として開園した日本最古の遊園地。ローラーコースターは1953年生まれ',
      '浅草文化観光センター': '建築家・隈研吾の設計。平屋を7つ積み重ねたような形をしている',
      '浅草文化観光センター 展望テラス': '雷門・仲見世・浅草寺・スカイツリーが一度に見渡せる',
      '浅草駅 (東武)': '1931年開業の駅ビル。電車は2階のホームを出ると、すぐ急カーブで隅田川を渡る',
      '吾妻橋': '1774年に町人が架けた橋。昔は通るのに2文かかる有料の橋だった。赤い今の橋は1931年完成',
      '言問橋': '名前は、在原業平が隅田川で都鳥に「わが思ふ人はありやなしや」と問いかけた歌にちなむ',
      '隅田川': '江戸の人は「大川」と呼んだ。夏の花火は、江戸時代の「両国の川開き」がルーツ',
      'すみだリバーウォーク': '東武線の鉄橋に、2020年に添えられた歩道橋。床のガラス窓から川面をのぞける',
      '東京ミズマチ': '東武線の高架下を使ったお店の街。2020年に生まれた',
      '隅田公園': '桜並木は8代将軍・吉宗が、庶民も花見を楽しめるように植えさせたのが始まり',
      '隅田公園 (墨田区側)': '江戸時代、ここには水戸徳川家の屋敷 (小梅御殿) があった',
      '牛嶋神社': '「撫で牛」の、自分の体の悪いところと同じ場所をなでると治るといわれる',
      '駒形堂': '浅草寺の観音さまが隅田川から上陸した場所とされる、浅草寺はじまりのお堂',
      'アサヒビール本社': 'ビールジョッキの形のビル。てっぺんの白い部分はビールの泡',
      'アサヒビール 金の炎 (フラムドール)': 'フランスのデザイナー、フィリップ・スタルクの作品。重さ約360トンで中は空洞。潜水艦をつくる技術で造られた',
      '押上': 'スカイツリーの最寄り駅。正式な駅名は「押上〈スカイツリー前〉」',
      '東京スカイツリー': '高さ634mは昔の国名「武蔵 (むさし)」の語呂合わせ。色は藍染めのいちばん薄い色「藍白」がもと',
      '東京スカイツリー 天望デッキ (350m)': '真ん中の「心柱」は五重塔と同じ考え方の仕組みで、塔の揺れを抑えている',
      '東京スカイツリー 天望回廊 (450m)': 'ここでは地上より時間がほんの少し速く進む (1日に約4ナノ秒)。超精密な「光格子時計」で確かめられた',
      '東京スカイツリー てっぺん (634m)': '24時にライトが消えたあとも、てっぺんだけは月ごとの誕生石の色に灯っている',
      '東京ソラマチ': 'スカイツリーの足もとの街。300以上のお店と、すみだ水族館がある',
    });
    Object.assign(LM_TIPS, {
      '雷門': '大提灯の真下から見上げると龍の彫刻がある。夜はライトアップされ、人が少なくて写真を撮りやすい',
      '仲見世': '歩きながら食べるのはNG。買ったお店の前で食べよう。閉店後はシャッターに描かれた浅草の絵巻が見られる',
      '浅草寺 宝蔵門': '大わらじは本堂側 (門の裏) から見える',
      '浅草寺 本堂': '本堂は6:00〜17:00 (10〜3月は6:30から)。境内はいつでも入れて、日没〜23時ごろはライトアップ',
      '浅草寺 本堂 (外陣)': '凶が出たら境内に結んでいくのが習わし',
      '浅草神社': '三社祭は例年5月の第3金・土・日曜日。約100基の神輿が町をめぐる',
      '浅草花やしき': '営業はおおむね10:00〜18:00 (日によって変わる)。ローラーコースターの最高速度は時速42km',
      '浅草文化観光センター': '仲見世とスカイツリーを一望できる穴場。E でエレベーター',
      '吾妻橋': '浅草側のたもとに水上バスののりば (隅田川ライン)',
      'すみだリバーウォーク': '通れるのは7:00〜22:00。浅草からスカイツリーへ歩く近道',
      '隅田公園': '桜の見ごろは例年3月下旬〜4月上旬。隅田川花火大会は例年7月の最終土曜日',
      '東京スカイツリー': '営業はおおむね10:00〜22:00 (土日祝は9:00から、最終入場21:00)。E で天望シャトルに乗れる',
      '東京スカイツリー 天望デッキ (350m)': '夜はライトアップされた東京タワーも見える',
    });
    // 実績
    let omairi = 0;
    LM_ACH.push(['daikichi', '🎋 大吉', '浅草寺のおみくじで大吉を引く (凶が3割の、きびしいおみくじ)', () => false],
      ['omairi', '🙏 浅草寺おまいり', '雷門 → 仲見世 → 宝蔵門 → 本堂 の順に歩いてお参りする', () => {
        const steps = [() => inR([1297.6, KZ - 3.5, 1302.4, KZ + 3.5], P.x, P.z), () => inR([1296, -3560, 1304, -3540], P.x, P.z), () => inR([1296, HZ - 4, 1304, HZ + 4], P.x, P.z), () => P.y > 2.5 && inR([1284, -3778, 1316, -3768], P.x, P.z)];
        if (omairi < 4 && steps[omairi]()) omairi++; return omairi >= 4; }],
      ['musashi', '🗼 634 (むさし)', '東京スカイツリーのてっぺん (634m) に立つ', () => P.y > 625 && Math.hypot(P.x - SX, P.z - SZ) < 8],
      ['riverwalk', '🌉 浅草からスカイツリーへ', 'すみだリバーウォークを歩いて隅田川を渡る', (() => { let w = false; return () => { if (P.y < 4.5 || P.y > 9) return false; const dx = P.x - FB.ox, dz = P.z - FB.oz, u = dx * FB.ux + dz * FB.uz, v = dx * FB.vx + dz * FB.vz; if (v < 3.8 || v > 8.4) return false; if (u < 10) w = true; return w && u > BL - 5; }; })()],
      ['twotowers', '🗼🗼 新旧タワー', '東京タワーの大展望台と、東京スカイツリーの天望デッキの両方に行く', () => DISC.has('東京タワー 大展望台') && DISC.has('東京スカイツリー 天望デッキ (350m)')]);
    LM_CATS.push([1268, -3730, 0], [bankE(-3650) + 44, -3650, 0], [1240, -3112, 0]);
  },
});
