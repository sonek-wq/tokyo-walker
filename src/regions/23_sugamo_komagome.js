/* 巣鴨・駒込 (巣鴨地蔵通り商店街・とげぬき地蔵 高岩寺・真性寺の江戸六地蔵・4のつく日の縁日 / 六義園・駒込駅のつつじ・旧古河庭園)
   どちらも山手線の駅にそろえた座標 (u = 線路の向き、v = 環の外向き = 北) で置く */
REGION({
  name: '巣鴨・駒込',
  towns: [['巣鴨', -1340, -4760], ['本駒込', -1000, -4620], ['西ケ原', -960, -5160]],
  stations: ['巣鴨', '駒込'],   // 駅のまわりを作り込んだ駅 (ファストトラベルで緑の枠)
  labels: [],
  build(r) {
    const BR = WALL.BRONZE, WH = lam({ color: 0xf0ece0 }), RED = lam({ color: 0xc8302a });
    const ENNICHI = NOW.getDate() % 10 === 4;   // 毎月4日・14日・24日は縁日
    const BLOOM_TSUTSUJI = true, ROSE_ON = true;   // 季節では変えない: つつじもバラも、いちばん見ばえのする花の姿にする
    const flowerBush = (x, z, s, on, cols) => bake(lam({ color: on ? pick(cols) : 0x3e6a34 }), new THREE.SphereGeometry(s, 6, 4).scale(1, 0.6, 1).translate(x, s * 0.5, z));

    // ===== 巣鴨地蔵通り商店街 (「おばあちゃんの原宿」) =====
    const FS = stnFrame('巣鴨');
    const RA = FS.w(30, 74), RB = FS.w(300, 268), RL = Math.hypot(RB[0] - RA[0], RB[1] - RA[1]);
    const R = akRoad(RA, RB, 8, '巣鴨地蔵通り商店街', { trees: false });
    const KG = [150, 188];   // 高岩寺の前 (u の範囲。+v の側)
    shopsAlong(R, 4, RL - 26, 9, 14, ['塩大福', '赤パンツ', '漬物', '甘味処', 'せんべい', '和菓子', 'うなぎ', '衣料品', '帽子', '杖・靴', '金物', '佃煮', '茶舗', '薬局', 'カレーパン', '手芸'],
      { hmin: 6, hmax: 13, wmin: 6, wmax: 10, skip: [[2, 36, -1], [KG[0], KG[1], 1]] });
    // 真性寺 (江戸六地蔵のひとつ。大きな銅の地蔵が座る)
    LM_ZONES.push(R.rect(2, -9, 36, -36)); oTiles(R, 2, -9, 36, -36, '#c8bca6', '#b8ac96', 2);
    {
      const [x, z] = R.w(18, -24), ry = Math.atan2(-R.vx, -R.vz);
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(x, z, 2.2, 8), 0, 1.6);
      bake(BR, new THREE.CylinderGeometry(1.3, 1.6, 1.1, 8).translate(x, 2.15, z));          // 蓮台にすわる脚
      bake(BR, new THREE.CylinderGeometry(0.75, 1.1, 1.8, 8).translate(x, 3.6, z));           // 胴
      bake(BR, new THREE.SphereGeometry(0.55, 8, 6).translate(x, 4.85, z));                    // 頭
      bake(BR, new THREE.CylinderGeometry(0.05, 0.05, 2.6, 4).translate(...R.w(19.2, -23.3).flatMap((v, i) => i ? [4, v] : [v])));   // 錫杖
      void ry;
      oBox(R, 'WOOD', 6, -30, 30, -36, 0, 5); oHip(R, 'RF0', 6, -30, 30, -36, 5, 3, { over: 1 });
    }
    // とげぬき地蔵 高岩寺 (山門・本堂・洗い観音)
    LM_ZONES.push(R.rect(KG[0], 9, KG[1], 50)); oTiles(R, KG[0], 9, KG[1], 50, '#ccc2ac', '#bcb29c', 2);
    for (const du of [-6, 6]) oBox(R, 'WOOD', 169 + du - 0.5, 9.5, 169 + du + 0.5, 10.5, 0, 6);
    oHip(R, 'RF0', 160, 8.4, 178, 11.6, 6, 2.6, { over: 0.8 });
    oBox(R, 'WOOD', 156, 32, 182, 48, 0, 8); oHip(R, 'RF0', 156, 32, 182, 48, 8, 5.5, { over: 1.4 });
    frontSign(R, 169, 31.9, -1, 'とげぬき地蔵尊', '#f4ecd8', '#5a2a1a', 6, 1.2, 6.8, { tw: 120, th: 26 });
    {   // 洗い観音 (像に水をかけ、自分の治したいところと同じ場所を洗う)
      const [x, z] = R.w(161, 22);
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(x, z, 1.2, 6), 0, 1.2);
      acStatue(x, z, 1.2, 0.85, Math.atan2(-R.vx, -R.vz), lam({ color: 0xc8c4bc }), 'stand', null);
      for (let k = 0; k < 6; k++) figure(...R.w(161 + k * 1.4 - 3.5, 17.5 - (k % 2) * 0.8), 0, 0.6, pick([0x8a6a7a, 0x6a6a8a, 0x9a7a5a, 0x7a8a6a]), null, Math.atan2(R.vx, R.vz));
      const smoke = lam({ color: 0xd8d8d8, transparent: true, opacity: 0.35 });
      const [cx, cz] = R.w(169, 26); bake(BR, new THREE.CylinderGeometry(1.2, 1.0, 1.0, 8).translate(cx, 0.9, cz));   // 常香炉
      for (let k = 0; k < 5; k++) bake(smoke, new THREE.SphereGeometry(0.5 + k * 0.15, 5, 4).translate(cx + rr(-0.3, 0.3), 1.8 + k * 0.7, cz + rr(-0.3, 0.3)));
    }
    // 4のつく日の縁日: 通りに露店が並び、人であふれる
    if (ENNICHI) {
      const STR = tex(16, 16, x => { for (let i = 0; i < 16; i += 4) { x.fillStyle = '#d83a2a'; x.fillRect(i, 0, 2, 16); x.fillStyle = '#f4f0e6'; x.fillRect(i + 2, 0, 2, 16); } });
      const CAN = lam({ map: STR });
      for (let u = 40; u < RL - 10; u += 7) for (const sd of [-1, 1]) {
        if (sd > 0 && u > KG[0] - 4 && u < KG[1] + 4) continue;
        const [x, z] = R.w(u, sd * 2.6), ry = Math.atan2(R.ux, R.uz);
        bake(CAN, new THREE.BoxGeometry(2.4, 0.2, 4.6).rotateY(ry).translate(x, 2.4, z));
        bake(lam({ color: 0x8a6a4a }), new THREE.BoxGeometry(1.4, 0.9, 4).rotateY(ry).translate(x, 0.45, z));
        solid(x - 0.8, z - 0.8, x + 0.8, z + 0.8, 0, 0.9, true);
      }
      LM_PEOPLE.push([[...R.w(4, -0.6), ...R.w(RL - 4, -0.6)], 40], [[...R.w(RL - 4, 0.6), ...R.w(4, 0.6)], 40]);
    }
    LM_PEOPLE.push([[...R.w(4, -3), ...R.w(RL - 4, -3)], 18], [[...R.w(RL - 4, 3), ...R.w(4, 3)], 18], [[...R.w(169, 12), ...R.w(169, 30)], 6]);

    // ===== 駒込駅のつつじ (線路沿いの土手) =====
    const FK = stnFrame('駒込');
    for (let u = -110; u <= 110; u += 3.2) for (const v of [-10.5, 10.5, -12.5, 12.5]) { if (Math.abs(v) > 11 && (u % 6.4 + 6.4) % 6.4 < 3) continue; flowerBush(...FK.w(u + rr(-0.8, 0.8), v), rr(0.8, 1.2), BLOOM_TSUTSUJI, [0xe84a8a, 0xf070a8, 0xf4f0f0, 0xd8306a]); }

    // ===== 六義園 (1695年に柳沢吉保がつくった、和歌の景色を写した大名庭園) =====
    const RG = FK.rect(0, -56, 190, -232), RGC = FK.w(96, -145);
    LM_ZONES.push(RG); polyFr(RG, '#6c9050');
    const OPEN_SOMEI = false;   // 染井門はふだん閉まっている (出入りは正門から)
    {
      const w = (u0, v0, u1, v1) => oBox(FK, 'TKSTONE', u0, v0, u1, v1, 0, 2.4, { top: 'ROOF' });
      w(0, -56, 26, -57); w(OPEN_SOMEI ? 33 : 26, -56, 190, -57);              // 北 (染井門)
      w(0, -231, 64, -232); w(76, -231, 190, -232);                            // 南 (正門)
      w(0, -56, 1, -232); w(189, -56, 190, -232);
      for (const [u, v] of [[26, -56.5], [33, -56.5], [64, -231.5], [76, -231.5]]) oBox(FK, 'WOOD', u - 0.6, v - 0.6, u + 0.6, v + 0.6, 0, 3.6);
      oHip(FK, 'RF0', 62, -230, 78, -233, 3.6, 1.6, { over: 0.6 }); oHip(FK, 'RF0', 24, -55, 35, -58, 3.6, 1.4, { over: 0.6 });
      if (!OPEN_SOMEI) oBox(FK, 'WOOD', 26, -56.2, 33, -56.8, 0, 3);
      // 大泉水と中の島 (妹山・背山)、渡月橋
      const [px, pz] = RGC, [ix, iz] = FK.w(92, -140);
      fe(px, pz, 50, 36, '#b8ac8c'); PONDS.push([px, pz, 45, 31]); fe(px, pz, 45, 31, '#3a6a64');
      POND_LAND.push(['e', ix, iz, 10, 7]); fe(ix, iz, 10, 7, '#5a7e44');
      for (const [dx, dz, rr0] of [[-3, -1, 5], [4, 1, 4]]) for (let i = 0; i < 3; i++) pushPrism('GRASSTOP', 'GRASSTOP', regularPoly(ix + dx, iz + dz, rr0 - i * 1.4, 8), i * 0.6, (i + 1) * 0.6);
      POND_LAND.push(['r', ix - 1.3, iz + 6, ix + 1.3, pz + 33]);
      for (let z = iz + 6; z < pz + 33; z += 3) bake(lam({ color: 0x9a968a }), new THREE.BoxGeometry(2.6, 0.3, 3).translate(ix, 0.15, z + 1.5));
      for (let k = 0; k < 6; k++) PINES.push([ix + rr(-7, 7), iz + rr(-4, 4), rr(0.8, 1)]);
      // 藤代峠 (園内でいちばん高い築山。てっぺんは富士見山)
      const [fx, fz] = FK.w(160, -196);
      hill(fx, fz, 19, 6.6);
      // しだれ桜 (内庭大門の近く)
      const [sx, sz] = FK.w(70, -210), PINK = lam({ color: 0xf6c8d8 });   // しだれ桜は一年中満開にする
      bake(lam({ color: 0x5a4632 }), new THREE.CylinderGeometry(0.6, 0.8, 5, 6).translate(sx, 2.5, sz)); solid(sx - 0.8, sz - 0.8, sx + 0.8, sz + 0.8, 0, 5);
      bake(PINK, new THREE.SphereGeometry(5, 8, 5, 0, 6.283, 0, 1.4).translate(sx, 3.5, sz));
      for (let k = 0; k < 36; k++) { const a = k / 36 * 6.283, rad = rr(3.5, 7); bake(PINK, new THREE.BoxGeometry(0.4, rr(3, 5.5), 0.4).translate(sx + Math.cos(a) * rad, rr(2.5, 4.5), sz + Math.sin(a) * rad)); }
      // 吹上茶屋 (池のほとりの茶屋)
      oBox(FK, 'WOOD', 140, -108, 152, -116, 0, 3); oHip(FK, 'RF_THATCH' in WALL ? 'RF_THATCH' : 'RF0', 140, -108, 152, -116, 3, 2.4, { over: 0.8 });
      // 木とつつじ
      for (let k = 0; k < 260; k++) {
        const u = rr(4, 186), v = rr(-60, -228), [x, z] = FK.w(u, v);
        if (Math.hypot((x - px) / 54, (z - pz) / 40) < 1 || Math.hypot(x - fx, z - fz) < 20 || Math.hypot(x - sx, z - sz) < 9) continue;
        if (k % 4 === 0) flowerBush(x, z, rr(0.9, 1.4), BLOOM_TSUTSUJI, [0xe84a8a, 0xf070a8, 0xf4f0f0]);
        else (rnd() < 0.35 ? PINES : rnd() < 0.55 ? MAPLES : rnd() < 0.3 ? SAKURA : ROUND).push([x, z, rr(0.9, 1.3)]);
      }
      LM_PEOPLE.push([[...FK.w(70, -226), ...FK.w(70, -186)], 5], [[...FK.w(40, -190), ...FK.w(160, -110)], 6], [[...FK.w(30, -60), ...FK.w(30, -100)], OPEN_SOMEI ? 5 : 1]);
    }

    // ===== 旧古河庭園 (丘の上の洋館・バラの洋風庭園・低地の日本庭園) =====
    const KF = FK.rect(-90, 228, 70, 384);
    LM_ZONES.push(KF); polyFr(KF, '#6f9450');
    {
      const STN2 = acGothic('KF_STONE', '#5a524c', '#2a2a30', '#8a8278', { rowH: 8, step: 6, ww: 3, wh: 5, lit: 0.3 });
      oBox(FK, 'TKSTONE', -40, 340, 40, 372, 0, 3, { top: 'TKSTONE' });
      oBox(FK, STN2, -34, 344, 34, 368, 3, 13); oHip(FK, 'RF0', -34, 344, 34, 368, 13, 6, { over: 0.6 });
      for (const u of [-24, 0, 24]) { oBox(FK, STN2, u - 5, 340, u + 5, 344, 3, 11); oHip(FK, 'RF0', u - 5, 339, u + 5, 345, 11, 3, { over: 0.4 }); }   // 張り出し窓
      // バラのテラス (斜面に3段)
      for (const [v0, v1, h] of [[318, 340, 2.2], [298, 318, 1.4], [280, 298, 0.7]]) {
        oBox(FK, 'TKSTONE', -40, v0, 40, v1, 0, h, { top: 'GRASSTOP' });
        for (let u = -36; u <= 36; u += 3) for (const dv of [0.3, 0.7]) bake(lam({ color: ROSE_ON ? pick([0xd8304a, 0xf07090, 0xf4e0a0, 0xffffff, 0xe85a2a]) : 0x3e6a34 }), new THREE.SphereGeometry(0.7, 5, 4).translate(...FK.w(u + rr(-0.5, 0.5), v0 + (v1 - v0) * dv).flatMap((v, i) => i ? [h + 0.5, v] : [v])));
      }
      // 日本庭園の心字池
      const [jx, jz] = FK.w(-20, 252);
      fe(jx, jz, 34, 16, '#b8ac8c'); PONDS.push([jx, jz, 30, 13]); fe(jx, jz, 30, 13, '#3a6a64');
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(...FK.w(14, 262), 0.8, 6), 0, 2.4);   // 雪見灯籠
      for (let k = 0; k < 90; k++) { const [x, z] = FK.w(rr(-86, 66), rr(232, 380)); if (Math.hypot((x - jx) / 36, (z - jz) / 18) < 1 || inPoly(FK.rect(-44, 276, 44, 374), x, z)) continue; (rnd() < 0.4 ? PINES : rnd() < 0.5 ? MAPLES : ROUND).push([x, z, rr(0.9, 1.3)]); }
      LM_PEOPLE.push([[...FK.w(-40, 276), ...FK.w(40, 276)], 6], [[...FK.w(-60, 240), ...FK.w(30, 240)], 4]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    rotSpots(R, [['とげぬき地蔵 高岩寺', KG[0], 8, KG[1], 50], ['真性寺 (江戸六地蔵)', 2, -9, 36, -36]]);
    rotSpots(FK, [['藤代峠 (六義園)', 140, -176, 180, -216], ['大泉水 (六義園)', 46, -112, 146, -178], ['六義園', 0, -56, 190, -232], ['洋館とバラ園 (旧古河庭園)', -44, 278, 44, 374], ['旧古河庭園', -90, 228, 70, 384]]);
    LM_HEIGHT_AREAS.unshift(['藤代峠 (六義園)', (x, z, y) => y > 2 && Math.hypot(x - FK.w(160, -196)[0], z - FK.w(160, -196)[1]) < 18]);
    LM_LABELS.push(['地蔵通り', ...R.w(RL / 2, 0), '🛍', '巣鴨地蔵通り商店街'], ['とげぬき地蔵', ...R.w(169, 36), '🙏', 'とげぬき地蔵 高岩寺'], ['六義園', ...RGC, '🌲'], ['旧古河庭園', ...FK.w(0, 330), '🌹']);
    Object.assign(LM_NOTES, {
      '巣鴨地蔵通り商店街': '旧中山道に沿った約780mの商店街。塩大福や漬物、赤い下着の店など約200店が並び、「おばあちゃんの原宿」と呼ばれる',
      'とげぬき地蔵 高岩寺': '「とげぬき地蔵」の名で知られるお寺。1891年 (明治24年) に下谷から巣鴨へ移ってきた。本堂の横の「洗い観音」に水をかけ、自分の治したいところと同じ場所を洗うと良くなるといわれる',
      '真性寺 (江戸六地蔵)': '江戸の入口6か所に置かれた大きな銅の地蔵「江戸六地蔵」のひとつ。中山道の旅人を見守った',
      '六義園': '1695年、5代将軍綱吉の側用人・柳沢吉保がつくった庭園。和歌に詠まれた紀州「和歌の浦」などの景色を写している。明治には三菱の岩崎彌太郎の別邸になった',
      '大泉水 (六義園)': '庭の中心の大きな池。中の島には妹山・背山の2つの小山がある',
      '藤代峠 (六義園)': '園内でいちばん高い築山で、標高は35m。てっぺんは「富士見山」と呼ばれる',
      '旧古河庭園': '明治の元勲・陸奥宗光の屋敷だった場所。丘の上にジョサイア・コンドル設計の洋館、斜面にバラの洋風庭園、低いところに日本庭園がある',
      '洋館とバラ園 (旧古河庭園)': '約100種200株のバラが、春 (5〜6月) と秋 (10〜11月) に咲く',
    });
    Object.assign(LM_TIPS, {
      '巣鴨地蔵通り商店街': '毎月4・14・24日は「4のつく日」の縁日で、露店がずらりと並ぶ。1・5・9月の24日は大祭' + (ENNICHI ? '。今日は縁日！' : ''),
      '六義園': '柳沢吉保が7年かけてつくった大名庭園。和歌に出てくる名所を「八十八境」の景色で表している。正門は南側 (駒込駅から徒歩7分)',
      '旧古河庭園': '丘の上の洋館とバラの庭、その下に日本庭園が続く。洋館はジョサイア・コンドル、日本庭園は小川治兵衛の作。駒込駅北口から徒歩12分',
    });
    LM_ACH.push(['jizodori', '🙏 おばあちゃんの原宿', 'とげぬき地蔵の洗い観音にお参りする', () => P.y < 2 && Math.hypot(P.x - R.w(161, 19)[0], P.z - R.w(161, 19)[1]) < 4],
      ['fujishiro', '⛰ 藤代峠', '六義園の藤代峠のてっぺんに立つ', () => P.y > 5.5 && Math.hypot(P.x - FK.w(160, -196)[0], P.z - FK.w(160, -196)[1]) < 4]);
    bakeFlush();
  },
});
