/* 谷中・根津・千駄木 (谷根千)
   本郷の不忍通りを北へ延ばし (根津 → 千駄木)、西に根津神社 (楼門・唐門・権現造の社殿・乙女稲荷の千本鳥居・つつじ苑)
   千駄木の東に谷中銀座 (よみせ通り → 谷中銀座 → 夕やけだんだん → 御殿坂 → 日暮里駅)、その南に谷中霊園 (上野公園と山手線のあいだ) */
REGION({
  name: '谷根千',
  towns: [['根津', -150, -3900], ['千駄木', -170, -4220], ['谷中', 0, -4150], ['上野桜木', 60, -3990], ['西日暮里三丁目', 40, -4380]],
  labels: [],
  build(r) {
    const SHU = lam({ color: 0xc8382a }), BLK = lam({ color: 0x24201e }), GOLD = lam({ color: 0xd8b040, emissive: 0x302000 }), APRIL = true;   // つつじはいつも咲いている姿にする
    if (!WALL.YN_SHU) WALL.YN_SHU = SHU; if (!WALL.YN_BLK) WALL.YN_BLK = BLK;
    // ===== 不忍通り (根津 → 千駄木) と団子坂 =====
    akRoad([-29, -3832], [-75, -3980], 16, '不忍通り (根津)');
    akRoad([-75, -3980], [-190, -4210], 16, '不忍通り (千駄木)');
    akRoad([-190, -4210], [-215, -4430], 16, '不忍通り (千駄木)');
    acRoad([-330, -4268, -205, -4256], 'ew', '団子坂');
    LM_ZONES.push(rectPoly(-334, -4294, -300, -4272)); pushPrism('brick', 'ROOF', rectPoly(-332, -4292, -304, -4274), 0, 8);   // 森鷗外記念館 (団子坂の上)

    // ===== 根津神社 (1706年、5代将軍綱吉が造営した権現造の社殿) =====
    const NX = -272, K = [-322, -3992, -226, -3846];
    {
      LM_ZONES.push(rectPoly(...K)); fr(...K, '#a8a088');
      tiles(NX - 3, -3930, NX + 3, K[3], '#cfc6b0', '#c0b6a0', 2);
      myojinTorii(NX, K[3] - 2, true, 6, 6, SHU, 0.38);
      // 池と神橋
      PONDS.push([NX - 10, -3868, 8, 5], [NX + 10, -3868, 8, 5]); fe(NX - 10, -3868, 8, 5, '#2f5f58'); fe(NX + 10, -3868, 8, 5, '#2f5f58');
      pushPrism('YN_SHU', 'WOOD', rectPoly(NX - 2.5, -3872, NX + 2.5, -3864), 0, 0.5);
      // 楼門 (江戸に残る唯一の楼門といわれる。二層の朱の門)
      const LZ = -3890;
      for (const dx of [-6, -2.5, 2.5, 6]) pushPrism('YN_SHU', 'YN_SHU', rectPoly(NX + dx - 0.5, LZ - 0.5, NX + dx + 0.5, LZ + 0.5), 0, 6);
      for (const dx of [-5, 5]) pushPrism('YN_SHU', 'YN_SHU', rectPoly(NX + dx - 1.5, LZ - 2, NX + dx + 1.5, LZ + 2), 0, 5.6);   // 両わきの随身の間
      jRoof('RF_COPPER', NX - 8, LZ - 3.5, NX + 8, LZ + 3.5, 6, 2, { over: 0.8, kind: 'band' });
      pushPrism('YN_SHU', 'YN_SHU', rectPoly(NX - 6.5, LZ - 2.5, NX + 6.5, LZ + 2.5), 8, 10.8);
      jRoof('RF_COPPER', NX - 8.5, LZ - 4, NX + 8.5, LZ + 4, 10.8, 3.2, { over: 1, kind: 'irimoya' });
      // 唐門と透塀 (社殿をぐるりと囲む塀)
      const KZ = -3926, E = [NX - 26, -3975, NX + 26, KZ];
      for (const dx of [-3, 3]) pushPrism('YN_BLK', 'YN_BLK', rectPoly(NX + dx - 0.5, KZ - 0.5, NX + dx + 0.5, KZ + 0.5), 0, 4.2);
      jRoof('RF_COPPER', NX - 5, KZ - 2.5, NX + 5, KZ + 2.5, 4.2, 2.4, { over: 0.6, kind: 'irimoya' });
      bake(GOLD, new THREE.BoxGeometry(6, 0.4, 0.3).translate(NX, 4, KZ + 0.6));
      const fence = (x0, z0, x1, z1) => { pushPrism('YN_SHU', 'RF_COPPER', rectPoly(x0, z0, x1, z1), 0, 2.6); };
      fence(E[0], KZ - 0.6, NX - 3.5, KZ); fence(NX + 3.5, KZ - 0.6, E[2], KZ); fence(E[0], E[1], E[2], E[1] + 0.6); fence(E[0], E[1], E[0] + 0.6, KZ); fence(E[2] - 0.6, E[1], E[2], KZ);
      tiles(E[0] + 1, E[1] + 1, E[2] - 1, KZ - 1, '#b8ae98', '#a89e88', 3);
      // 社殿: 拝殿・幣殿・本殿をつないだ総漆塗の権現造
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(NX - 14, -3970, NX + 14, -3934), 0, 0.8);
      pushPrism('YN_SHU', 'ROOF', rectPoly(NX - 12, -3950, NX + 12, -3936), 0.8, 7);   // 拝殿
      jRoof('RF_COPPER', NX - 13.5, -3951.5, NX + 13.5, -3934.5, 7, 4.4, { over: 1.2, kind: 'irimoya' });
      pushPrism('YN_BLK', 'ROOF', rectPoly(NX - 5, -3958, NX + 5, -3950), 0.8, 6.5);    // 幣殿
      pushPrism('YN_SHU', 'ROOF', rectPoly(NX - 10, -3970, NX + 10, -3958), 0.8, 7.5);  // 本殿
      jRoof('RF_COPPER', NX - 11.5, -3971.5, NX + 11.5, -3956.5, 7.5, 4.8, { over: 1.2, kind: 'irimoya' });
      jRoof('RF_COPPER', NX - 5, -3935, NX + 5, -3930, 4.6, 2, { over: 0.4, kind: 'irimoya' });
      for (let dx = -10; dx <= 10; dx += 4) bake(GOLD, new THREE.BoxGeometry(0.2, 5.6, 0.2).translate(NX + dx, 3.6, -3935.8));
      for (const dx of [-8, 8]) { bake(lam({ color: 0x4a6a5a }), new THREE.CylinderGeometry(0.5, 0.7, 3, 8).translate(NX + dx, 1.5, -3929)); }   // 青銅の灯籠
      // 乙女稲荷の千本鳥居 (西の斜面に朱の鳥居がずらりと並ぶ)
      const TX = K[0] + 10;
      for (let z = K[3] - 22; z > K[1] + 26; z -= 1.3) {
        for (const dx of [-0.9, 0.9]) bake(SHU, new THREE.BoxGeometry(0.18, 2.3, 0.18).translate(TX + dx, 1.15, z));
        bake(SHU, new THREE.BoxGeometry(2.4, 0.18, 0.26).translate(TX, 2.35, z)); bake(BLK, new THREE.BoxGeometry(2.6, 0.12, 0.3).translate(TX, 2.5, z));
      }
      tiles(TX - 0.8, K[1] + 26, TX + 0.8, K[3] - 22, '#b8ae98', '#a89e88', 2);
      pushPrism('YN_SHU', 'ROOF', rectPoly(TX - 3, K[1] + 14, TX + 3, K[1] + 22), 0, 3.2); jRoof('RF0', TX - 3.6, K[1] + 13.4, TX + 3.6, K[1] + 22.6, 3.2, 1.6, { over: 0.4 });   // 乙女稲荷の社
      // つつじ苑 (4月は約100種3,000株が咲く)
      const AZ = [lam({ color: APRIL ? 0xe84a8a : 0x4f7a34 }), lam({ color: APRIL ? 0xf0a0c8 : 0x56823a }), lam({ color: APRIL ? 0xd82a4a : 0x4a7230 }), lam({ color: APRIL ? 0xf8f0f4 : 0x5a8640 })];
      for (let k = 0; k < 260; k++) { const x = rr(K[0] + 1, TX - 2.5), z = rr(K[1] + 4, K[3] - 4); bake(pick(AZ), new THREE.IcosahedronGeometry(rr(0.5, 0.9), 0).scale(1, 0.7, 1).translate(x, 0.45, z)); }
      for (let k = 0; k < 60; k++) { const x = rr(K[0] + 1, K[2] - 1), z = rr(K[1] + 1, K[3] - 1); if (x < TX + 3 || inR([E[0] - 3, E[1] - 3, E[2] + 3, K[3]], x, z) && Math.abs(x - NX) < 30) continue; if (!acFree(x, z)) continue; (rnd() < 0.5 ? ROUND : GINKGO).push([x, z, rr(1, 1.5)]); }
      LM_PEOPLE.push([[NX - 1.5, K[3] - 2, NX - 1.5, KZ + 2], 8], [[TX, K[3] - 24, TX, K[1] + 28], 5]);
    }

    // ===== 谷中銀座 (全長約170mに約60店) と、よみせ通り・夕やけだんだん・御殿坂 =====
    const GZ = -4318, G0 = -94, G1 = -24;
    {
      acRoad([-105, -4430, -97, -4200], 'ns', 'よみせ通り', { walk: 2, trees: false });
      tiles(G0, GZ - 4, G1, GZ + 4, '#c8bca8', '#b8ac98', 2); LM_ZONES.push(rectPoly(G0, GZ - 20, 12, GZ + 20));
      const SW = ['メンチカツ', 'コロッケ', '和菓子', 'せんべい', '惣菜', '八百屋', '猫雑貨', '魚屋', '肉屋', '喫茶', 'ドーナツ', '酒屋', '豆腐', '漬物', '雑貨', 'たい焼き'];
      const SWM = SW.map(w => glow(new THREE.MeshLambertMaterial({ map: textTex(w, '#f4ecd8', '#3a2414', 96, 24) }), '#fff0c8', 0.4));
      const AWN = [0xc83a2a, 0x2a6a4a, 0x3a5a9a, 0xe0a030, 0x8a4a2a].map(c => lam({ color: c }));
      const shops = [];
      for (const side of [-1, 1]) for (let x = G0; x < G1 - 3;) {
        const w = Math.min(rr(4, 7), G1 - x), z0 = side < 0 ? GZ - 18 : GZ + 4, z1 = side < 0 ? GZ - 4 : GZ + 18, h = rr(5.5, 8.5);
        pushPrism(pick(['resi2', 'JB_KS0', 'JB_KS2', 'brick', 'resi']), 'ROOF', rectPoly(x, z0, x + w, z1), 0, h);
        const fz = side < 0 ? GZ - 3.9 : GZ + 3.9, ry = side < 0 ? 0 : Math.PI;
        bake(pick(SWM), new THREE.PlaneGeometry(Math.min(3.4, w - 0.6), 0.8).rotateY(ry).translate(x + w / 2, 3.4, fz + (side < 0 ? 0.05 : -0.05)));
        bake(pick(AWN), new THREE.BoxGeometry(w - 0.3, 0.2, 1.2).rotateX(side < 0 ? 0.25 : -0.25).translate(x + w / 2, 2.7, fz + (side < 0 ? 0.5 : -0.5)));
        shops.push([x + w / 2, side < 0 ? GZ - 11 : GZ + 11, h]);
        x += w + 0.3;
      }
      // 七福猫 (商店街のどこかの屋根にいる7匹の木彫りの猫)
      const CAT = lam({ color: 0x9a6a3a }), cats = [];
      for (let i = 0; i < 7; i++) {
        const [x, z, h] = shops[Math.floor((i + 0.5) * shops.length / 7)], y = h + 0.02;
        bake(CAT, new THREE.BoxGeometry(0.9, 0.55, 0.45).translate(x, y + 0.28, z)); bake(CAT, new THREE.BoxGeometry(0.45, 0.42, 0.42).translate(x + 0.5, y + 0.75, z));
        for (const dz of [-0.12, 0.12]) bake(CAT, new THREE.ConeGeometry(0.08, 0.18, 4).translate(x + 0.55, y + 1.05, z + dz));
        bake(CAT, new THREE.BoxGeometry(0.1, 0.6, 0.1).rotateZ(0.5).translate(x - 0.55, y + 0.6, z));
        cats.push([x, z]);
      }
      LM_PEOPLE.push([[G0 + 2, GZ - 1.5, G1 - 2, GZ - 1.5], 16], [[G1 - 2, GZ + 1.5, G0 + 2, GZ + 1.5], 14]);
      // 夕やけだんだん (商店街の東の端の石段。夕日の名所)
      stairs([G1, GZ - 4, G1 + 10, GZ + 4], 2.8, 'x+');
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(G1 + 10, GZ - 5, G1 + 18, GZ + 5), 0, 2.8);
      stairs([G1 + 18, GZ - 4, G1 + 30, GZ + 4], 2.8, 'x-');
      for (const z of [GZ - 4.6, GZ + 4.6]) bake(lam({ color: 0x6a6a68 }), new THREE.BoxGeometry(30, 0.08, 0.08).translate(G1 + 15, 3.7, z));
      acRoad([G1 + 30, GZ - 6, 140, GZ + 6], 'ew', '御殿坂');
      // 朝倉彫塑館 (彫刻家・朝倉文夫のアトリエと住まい。屋上庭園)
      LM_ZONES.push(rectPoly(58, -4364, 86, -4338)); pushPrism('CONC', 'GRASSTOP', rectPoly(60, -4362, 84, -4340), 0, 11);
      acStatue(78, -4344, 11, 1.1, Math.PI, WALL.BRONZE, 'stand', null);
      // 実績: 七福猫を探す
      const found = new Set();
      LM_UPDATERS.push(() => { cats.forEach(([x, z], i) => { if (Math.hypot(P.x - x, P.z - z) < 9) found.add(i); }); });
      LM_ACH.push(['shichifuku', '🐈 七福猫をさがせ', '谷中銀座の屋根にいる7匹の木彫りの猫を、すべて近くで見つける', () => found.size === 7],
        ['yuyake', '🌇 夕やけだんだん', '夕方 (16〜18時) に夕やけだんだんの上に立つ', () => gameH >= 16 && gameH < 18.5 && P.y > 2 && inR([G1 + 8, GZ - 6, G1 + 20, GZ + 6], P.x, P.z)]);
      LM_HEIGHT_AREAS.unshift(['夕やけだんだん', (x, z, y) => inR([G1, GZ - 5, G1 + 30, GZ + 5], x, z)]);
    }

    // ===== 谷中霊園 (桜の名所。徳川慶喜の墓・五重塔跡) =====
    const YR = [[100, -3946], [440, -3946], [360, -4090], [230, -4226], [150, -4226], [100, -4150]];
    {
      LM_ZONES.push(YR); polyFr(YR, '#8a8a76');
      const inY = (x, z) => inPoly(YR, x, z);
      // さくら通り (霊園の中を斜めに通る桜並木)
      const A = [150, -4222], B = [400, -3950], L = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / L, uz = (B[1] - A[1]) / L;
      const F = frame(A[0], A[1], ux, uz, -uz, ux); oTiles(F, 0, -4, L, 4, '#b8ac94', '#a89c84', 3);
      for (let u = 6; u < L - 4; u += 9) for (const v of [-6, 6]) SAKURA.push([...F.w(u, v), 1.3]);
      // お墓 (小さな墓石の列)
      const stone = lam({ color: 0x9a9a96 }), stone2 = lam({ color: 0x7a7a78 });
      for (let x = 104; x < 436; x += 4) for (let z = -4222; z < -3950; z += 4.5) {
        if (!inY(x, z) || !inY(x + 2, z + 2)) continue; const dx = x - A[0], dz = z - A[1], v = -dx * uz + dz * ux; if (Math.abs(v) < 9) continue;
        if (rnd() < 0.25) continue; bake(rnd() < 0.6 ? stone : stone2, new THREE.BoxGeometry(0.6, rr(1, 1.6), 0.4).translate(x + rr(-0.3, 0.3), 0.6, z));
      }
      for (let k = 0; k < 90; k++) { const x = rr(100, 440), z = rr(-4226, -3946); if (!inY(x, z)) continue; (rnd() < 0.5 ? ROUND : PINES).push([x, z, rr(1, 1.5)]); }
      // 五重塔跡 (礎石だけが残る)
      const [px, pz] = F.w(L * 0.45, 16);
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(px, pz, 6, 4, Math.PI / 4), 0, 0.5);
      for (const [dx, dz] of [[-3, -3], [3, -3], [-3, 3], [3, 3], [0, 0]]) bake(lam({ color: 0x8a8678 }), new THREE.CylinderGeometry(0.6, 0.7, 0.4, 8).translate(px + dx, 0.7, pz + dz));
      // 徳川慶喜の墓 (柵で囲まれた区画)
      const QX = 180, QZ = -3990;
      for (const [x0, z0, x1, z1] of [[QX - 8, QZ - 8, QX + 8, QZ - 7.6], [QX - 8, QZ + 7.6, QX - 1.5, QZ + 8], [QX + 1.5, QZ + 7.6, QX + 8, QZ + 8], [QX - 8, QZ - 8, QX - 7.6, QZ + 8], [QX + 7.6, QZ - 8, QX + 8, QZ + 8]]) pushPrism('YN_BLK', 'YN_BLK', rectPoly(x0, z0, x1, z1), 0, 1.6);
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(QX, QZ - 2, 2.6, 12), 0, 1.8); mesh(new THREE.SphereGeometry(2.2, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), WALL.TKSTONE ? lam({ color: 0xa8a49a }) : stone, QX, 1.8, QZ - 2);
      // 天王寺 (霊園の北の寺)
      pushPrism('WOOD', 'ROOF', rectPoly(112, -4218, 136, -4198), 0, 6); jRoof('RF0', 110, -4220, 138, -4196, 6, 4, { over: 1.2, kind: 'irimoya' });
      LM_PEOPLE.push([[...F.w(4, -2), ...F.w(L - 4, -2)], 10], [[...F.w(L - 4, 2), ...F.w(4, 2)], 8]);
      SPOT_AREAS.push(['谷中五重塔跡', px - 8, pz - 8, px + 8, pz + 8], ['徳川慶喜の墓', QX - 10, QZ - 10, QX + 10, QZ + 10], ['天王寺 (谷中)', 108, -4222, 140, -4194]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['根津神社 楼門', NX - 9, -3894, NX + 9, -3886], ['根津神社 社殿', NX - 26, -3975, NX + 26, -3926], ['乙女稲荷の千本鳥居', K[0] + 7, K[1] + 12, K[0] + 13, K[3] - 20], ['根津神社 つつじ苑', K[0], K[1], K[0] + 20, K[3]], ['根津神社', ...K],
      ['谷中銀座', G0, GZ - 18, G1, GZ + 18], ['朝倉彫塑館', 56, -4366, 88, -4336], ['森鷗外記念館', -334, -4294, -300, -4272], ['谷中霊園', 100, -4226, 440, -3946]);
    LM_LABELS.push(['根津神社', NX, -3950, '⛩'], ['千本鳥居', K[0] + 10, -3920, '⛩', '乙女稲荷の千本鳥居'], ['谷中銀座', -62, GZ, '🐈'], ['夕やけだんだん', G1 + 14, GZ, '🌇'], ['谷中霊園', 280, -4070, '🌸'],
      ['朝倉彫塑館', 72, -4351, '🗿'], ['団子坂', -260, -4262, '🍡']);
    Object.assign(LM_NOTES, {
      '根津神社': '社殿は1706年、5代将軍綱吉が造らせたもの。本殿・拝殿・唐門・楼門などが、建てられた当時のまま国の重要文化財として残る',
      '根津神社 楼門': '江戸の地で造られた楼門が残るのは、都内ではここだけといわれる',
      '根津神社 社殿': '拝殿・幣殿・本殿をつないだ総漆塗りの権現造。日光東照宮と同じ形式',
      '乙女稲荷の千本鳥居': '朱色の鳥居がトンネルのように続く参道',
      '根津神社 つつじ苑': '4月には約100種3,000株のつつじが咲き、「文京つつじまつり」が開かれる',
      '谷中銀座': '全長約170mに、惣菜や和菓子、雑貨などの店が約60軒。屋根のどこかに木彫りの猫「七福猫」が7体いて、見つけると幸せになれるといわれる',
      '夕やけだんだん': '谷中銀座の入口の石段。上から夕日に染まる商店街を見下ろせる',
      'よみせ通り': '谷中銀座の西の端につながる通り',
      '御殿坂': '日暮里駅から谷中銀座へゆるやかに上る坂。南側は谷中霊園',
      '谷中霊園': '春は満開の桜並木。江戸幕府最後の将軍・徳川慶喜など、歴史上の人物の墓がある',
      '徳川慶喜の墓': '江戸幕府15代将軍・徳川慶喜が眠る',
      '谷中五重塔跡': '幸田露伴の小説『五重塔』のモデルになった天王寺の五重塔があった場所。1957年に焼失し、礎石が残る',
      '朝倉彫塑館': '彫刻家・朝倉文夫のアトリエ兼住まい。早稲田大学の大隈重信像も朝倉の作品。大の猫好きだった',
      '団子坂': '千駄木の坂。坂の上に、森鷗外の住まいの跡に建つ「森鷗外記念館」がある',
      '不忍通り (千駄木)': '根津・千駄木を通る下町の通り。千駄木の東が谷中',
    });
    Object.assign(LM_TIPS, {
      '根津神社': 'つつじの名所で、春は約100種3000株のつつじが斜面をうめる。朱色の鳥居が続く「千本鳥居」も人気',
      '谷中銀座': '食べ歩きのごみは持ち帰るなど、マナーを守って楽しもう',
    });
    LM_ACH.push(['senbon', '⛩ 千本鳥居をくぐる', '根津神社の乙女稲荷の千本鳥居を歩く', () => inR([K[0] + 8, K[1] + 30, K[0] + 12, K[3] - 26], P.x, P.z)]);
    bakeFlush();
  },
});
