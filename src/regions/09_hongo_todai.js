/* 東京大学 本郷キャンパス・弥生キャンパス
   本郷通りの東側。正門から銀杏並木がまっすぐ安田講堂へ。南に赤門 (耐震工事中で閉門)・総合研究博物館・総合図書館、東に三四郎池と東大病院
   言問通りをはさんで北が弥生キャンパス (ハチ公と上野英三郎博士の像)。東の不忍通りの向こうは上野公園 (stations/jy05_ueno.js) */
REGION({
  name: '本郷',
  towns: [['本郷', -360, -3420], ['本郷七丁目', -180, -3480], ['弥生', -180, -3740], ['本郷三丁目', -360, -3230], ['池之端', -20, -3500]],
  labels: [],
  build(r) {
    const UG = acGothic('TD_UG', '#7c4e3e', '#2a2228', '#9a6a56', { brick: '#6e4436', rowH: 8, step: 4, ww: 2, wh: 5 });   // 内田ゴシック (茶色いスクラッチタイル)
    const UG2 = acGothic('TD_UG2', '#86584a', '#2a2228', '#a8786a', { brick: '#74493c', rowH: 7, step: 5, ww: 3, wh: 5, lit: 0.5 });
    const MOD = acGothic('TD_MOD', '#b4aea4', '#3e4a56', null, { rowH: 6, step: 3, ww: 2, wh: 3, lit: 0.55 });
    const SHU = lam({ color: 0xc4402a }), DARK = lam({ color: 0x1e1a1c }), BR = WALL.BRONZE;
    if (!WALL.TD_SHU) WALL.TD_SHU = SHU;
    const C = [-326, -3660, -36, -3292], Y = [-326, -3820, -36, -3676];   // 本郷キャンパス / 弥生キャンパス
    const inC = (x, z, m = 0) => inR([C[0] + m, C[1] + m, C[2] - m, C[3] - m], x, z);

    // ===== 周りの道路 =====
    acRoad([-352, -3830, -332, -3180], 'ns', '本郷通り');
    acRoad([-326, -3676, -36, -3662], 'ew', '言問通り');
    acRoad([-36, -3830, -22, -3260], 'ns', '不忍通り', { walk: 4 });
    acRoad([-326, -3292, -36, -3280], 'ew', '春日通り');
    LM_ZONES.push(rectPoly(...C), rectPoly(...Y)); fr(...C, '#9e9a86'); fr(...Y, '#9e9a86');
    // キャンパスの塀 (門のところは開ける)
    const wall = (x0, z0, x1, z1) => pushPrism('TKSTONE', 'TKSTONE', rectPoly(x0, z0, x1, z1), 0, 1.6);
    wall(C[0], C[1] + 6, C[0] + 1, -3512); wall(C[0], -3488, C[0] + 1, -3380); wall(C[0], -3350, C[0] + 1, C[3]);
    wall(Y[0], Y[1], Y[0] + 1, Y[3]);

    // ===== 正門 (1912年、伊東忠太の設計) と銀杏並木 =====
    const AZ = -3500;
    for (const z of [AZ - 13, AZ + 12]) { pushPrism('TKSTONE', 'TKSTONE', rectPoly(C[0] - 1, z, C[0] + 2, z + 1), 0, 4.6); bake(BR, new THREE.BoxGeometry(0.8, 0.5, 1.6).translate(C[0] + 0.5, 4.85, z + 0.5)); }
    bake(DARK, new THREE.BoxGeometry(0.4, 0.8, 26).translate(C[0] + 0.5, 4.2, AZ));   // 冠木 (旭日と瑞雲の飾り)
    bake(GOLDISH(), new THREE.CircleGeometry(0.6, 10).rotateY(-Math.PI / 2).translate(C[0] + 0.25, 4.2, AZ));
    for (const s of [-1, 1]) for (let k = 0; k < 8; k++) bake(DARK, new THREE.BoxGeometry(0.06, 3.2, 0.06).translate(C[0] + 1.5 + k * 0.7, 1.6, AZ + s * 11.6));   // 開いた扉 (内側にたたんである)
    tiles(C[0], AZ - 12, -226, AZ + 12, '#cfc6b0', '#c0b6a0', 2);
    for (let x = C[0] + 6; x < -230; x += 9) GINKGO.push([x, AZ - 10, 1.25], [x + 4, AZ + 10, 1.25]);
    LM_PEOPLE.push([[C[0] + 4, AZ - 4, -232, AZ - 4], 18], [[-232, AZ + 4, C[0] + 4, AZ + 4], 14]);
    // 法文1号館 (南)・法文2号館 (北): アーチの通り抜けがある内田ゴシック
    for (const [z0, z1, nm] of [[AZ - 50, AZ - 18, 2], [AZ + 18, AZ + 50, 1]]) {
      pushPrism(UG, 'ROOF', rectPoly(-312, z0, -277, z1), 0, 22); pushPrism(UG, 'ROOF', rectPoly(-267, z0, -232, z1), 0, 22);
      pushPrism(UG, 'ROOF', rectPoly(-277, z0, -267, z1), 8.5, 22, { bottom: true });   // まん中の大アーチ (くぐって通り抜けられる)
      const az = nm === 2 ? z1 : z0;
      for (const x of [-305, -282, -262, -239]) pushPrism('ROOF', 'ROOF', rectPoly(x - 2, az - (nm === 2 ? 0.8 : -0.8) - 0.3, x + 2, az + 0.3), 22, 25);   // 屋上の小塔
    }

    // ===== 安田講堂 (大講堂。1925年完成、高さ39.7m) =====
    const YX = -212;   // 正面 (西) の壁
    {
      tiles(-232, AZ - 32, YX, AZ + 32, '#cfc6b0', '#c0b6a0', 2);   // 講堂前の広場
      pushPrism(UG2, 'ROOF', rectPoly(YX + 6, AZ - 27, YX + 44, AZ + 27), 0, 22);        // 講堂の本体
      pushPrism(UG2, 'ROOF', rectPoly(YX + 2, AZ - 27, YX + 18, AZ - 9), 0, 27);         // 塔の両わきの棟
      pushPrism(UG2, 'ROOF', rectPoly(YX + 2, AZ + 9, YX + 18, AZ + 27), 0, 27);
      pushPrism(UG2, 'ROOF', rectPoly(YX, AZ - 9, YX + 18, AZ + 9), 0, 37);              // 中央の塔
      pushPrism('ROOF', 'ROOF', rectPoly(YX + 2, AZ - 7, YX + 16, AZ + 7), 37, 39.7);
      for (const [dz, h] of [[-9, 40.6], [9, 40.6]]) for (const dx of [0, 18]) pushPrism(UG2, 'ROOF', rectPoly(YX + dx - 1, AZ + dz - 1, YX + dx + 1, AZ + dz + 1), 0, h);   // 塔の四隅の柱
      // 正面の大きな玄関 (砂岩) とアーチ
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(YX - 6, AZ - 8, YX, AZ + 8), 0, 13);
      bake(DARK, new THREE.BoxGeometry(0.3, 8, 8).translate(YX - 6.2, 4, AZ));
      bake(DARK, new THREE.CylinderGeometry(4, 4, 0.3, 12, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2).translate(YX - 6.2, 8, AZ));
      for (const dz of [-6.5, -2.2, 2.2, 6.5]) bake(DARK, new THREE.BoxGeometry(0.3, 9, 1.4).translate(YX - 0.2, 24, AZ + dz));   // 塔の縦長の窓
      for (const dz of [-6, -3, 0, 3, 6]) bake(DARK, new THREE.BoxGeometry(0.3, 1.6, 1).translate(YX - 0.2, 33.5, AZ + dz));
      mesh(new THREE.CircleGeometry(1.6, 16).rotateY(-Math.PI / 2), lam({ color: 0xe8e0c8, emissive: 0x302810 }), YX - 0.25, 31, AZ);   // 時計
      LM_PEOPLE.push([[-230, AZ - 25, -230, AZ + 25], 8]);
    }
    // ===== 総合図書館と図書館前広場 (噴水) =====
    {
      pushPrism(UG, 'ROOF', rectPoly(-252, -3438, -180, -3392), 0, 25);
      for (const x of [-246, -186]) pushPrism(UG, 'ROOF', rectPoly(x - 4, -3440, x + 4, -3436), 0, 28);
      bake(DARK, new THREE.BoxGeometry(10, 9, 0.3).translate(-216, 4.5, -3438.2));
      tiles(-256, -3468, -176, -3440, '#cfc6b0', '#c0b6a0', 2);
      PONDS.push([-216, -3454, 7, 7]); fe(-216, -3454, 7, 7, '#3d7598');
      bake(lam({ color: 0xd8e8f4, transparent: true, opacity: 0.7 }), new THREE.CylinderGeometry(0.4, 1.2, 5, 8).translate(-216, 2.5, -3454));
      LM_PEOPLE.push([[-250, -3462, -182, -3462], 8]);
    }
    // ===== 総合研究博物館 (赤門のそば) =====
    pushPrism(MOD, 'ROOF', rectPoly(-322, -3412, -290, -3384), 0, 16);
    // ===== 赤門 (1827年、加賀藩の前田家が建てた門。国の重要文化財。いまは耐震工事で閉門中) =====
    const AKZ = -3365;
    {
      const x0 = C[0] - 4, x1 = C[0] + 4;
      for (const dz of [-6, 6]) pushPrism('TD_SHU', 'TD_SHU', rectPoly(x0 + 2, AKZ + dz - 0.6, x1 - 2, AKZ + dz + 0.6), 0, 6.5);
      bake(SHU, new THREE.BoxGeometry(5, 0.8, 13).translate(C[0], 6.4, AKZ));
      for (let k = -5; k <= 5; k += 0.5) bake(SHU, new THREE.BoxGeometry(0.4, 5.6, 0.48).translate(C[0], 2.8, AKZ + k));   // 閉じた扉
      solid(x0, AKZ - 6, x1, AKZ + 6, 0, 6.5);
      jRoof('RF2', x0 - 1, AKZ - 8, x1 + 1, AKZ + 8, 6.8, 3.2, { over: 1.2, kind: 'irimoya' });
      for (const dz of [-11.5, 11.5]) { pushPrism('TD_SHU', 'TD_SHU', rectPoly(x0 + 1, AKZ + dz - 3, x1 - 1, AKZ + dz + 3), 0, 3.4); jRoof('RF2', x0, AKZ + dz - 3.5, x1, AKZ + dz + 3.5, 3.4, 1.8, { over: 0.6, kind: 'hip' }); }   // 両わきの番所
    }
    // ===== 三四郎池 (育徳園心字池) と山上会館 =====
    {
      const PX = -120, PZ = -3445;
      PONDS.push([PX, PZ, 22, 30], [PX - 14, PZ - 22, 10, 8]); fe(PX, PZ, 22, 30, '#2f5f58'); fe(PX - 14, PZ - 22, 10, 8, '#2f5f58');
      for (let k = 0; k < 160; k++) { const a = rr(0, 6.28), d = rr(1.05, 1.9); const x = PX + Math.cos(a) * 24 * d, z = PZ + Math.sin(a) * 33 * d; if (!inC(x, z, 4) || !acFree(x, z) || inR([-114, -3510, -40, -3326], x, z) || inR([-164, -3540, -112, -3504], x, z)) continue; (rnd() < 0.35 ? PINES : rnd() < 0.5 ? MAPLES : ROUND).push([x, z, rr(1, 1.5)]); }
      for (const [x, z] of [[PX + 18, PZ + 8], [PX - 19, PZ - 4], [PX + 4, PZ - 28], [PX - 8, PZ + 26]]) bake(lam({ color: 0x8a8678 }), new THREE.DodecahedronGeometry(rr(1, 1.6), 0).translate(x, 0.6, z));
      pushPrism(MOD, 'ROOF', rectPoly(-108, -3505, -76, -3484), 0, 14);
      LM_PEOPLE.push([[PX - 26, PZ + 30, PX + 24, PZ - 32], 4]);
    }
    // ===== 東大病院・ほかの校舎 =====
    pushPrism(MOD, 'ROOF', rectPoly(-110, -3392, -44, -3330), 0, 40); pushPrism(MOD, 'ROOF', rectPoly(-96, -3380, -58, -3342), 40, 62);
    for (const [x0, z0, x1, z1, h, m] of [[-316, -3652, -262, -3612, 20, UG], [-252, -3652, -192, -3612, 22, UG2], [-182, -3652, -124, -3600, 20, UG], [-114, -3652, -46, -3600, 24, UG2],
      [-316, -3600, -262, -3562, 18, UG2], [-160, -3590, -110, -3548, 22, UG], [-152, -3536, -116, -3508, 18, UG2], [-316, -3440, -290, -3420, 16, UG],
      [-276, -3372, -206, -3302, 18, UG], [-194, -3372, -126, -3302, 20, UG2], [-60, -3590, -44, -3500, 16, MOD]]) pushPrism(m, 'ROOF', rectPoly(x0, z0, x1, z1), 0, h);
    for (let k = 0; k < 520; k++) { const x = rr(C[0] + 4, C[2] - 4), z = rr(C[1] + 4, C[3] - 4); if (Math.abs(z - AZ) < 13 && x < -226) continue; if (!acFree(x, z) || inR([-258, -3470, -174, -3438], x, z) || inR([-236, AZ - 34, YX, AZ + 34], x, z)) continue; if (rnd() < 0.45) GINKGO.push([x, z, rr(1, 1.3)]); else ROUND.push([x, z, rr(1, 1.4)]); }
    for (const [x0, z0, x1, z1] of [[-316, -3560, -262, -3546], [-250, -3600, -170, -3560], [-316, -3410, -258, -3380], [-170, -3440, -150, -3380], [-150, -3300, -46, -3296]]) fr(x0, z0, x1, z1, '#7f9a5e');

    // ===== 弥生キャンパス: 農正門とハチ公と上野英三郎博士の像 (2015年) =====
    {
      for (const x of [-206, -194]) pushPrism('WOOD', 'WOOD', rectPoly(x - 0.6, Y[3] - 1.5, x + 0.6, Y[3] - 0.3), 0, 4.4);
      bake(lam({ color: 0x6a4a32 }), new THREE.BoxGeometry(15, 0.7, 1.6).translate(-200, 4.6, Y[3] - 0.9));
      tiles(-210, Y[3] - 40, -190, Y[3], '#cfc6b0', '#c0b6a0', 2);
      const HX = -250, HZ = -3712;
      tiles(HX - 10, HZ - 8, HX + 10, HZ + 8, '#cfc6b0', '#c0b6a0', 2);
      acStatue(HX + 0.6, HZ, 0, 1.0, Math.PI / 2, BR, 'reach', { w: 2.6, h: 1.0, mat: 'TKSTONE' });   // 上野博士 (両手を広げて迎える)
      const DOGM = lam({ color: 0x7a6440 }), dog = (w, h, d, x, y, z, rz = 0) => { const g = new THREE.BoxGeometry(w, h, d); if (rz) g.rotateZ(rz); bake(DOGM, g.translate(x - 0.3, y, z)); };   // 飛びつくハチ公
      dog(1.2, 0.45, 0.4, HX - 0.5, 1.75, HZ, -0.9); dog(0.4, 0.38, 0.36, HX - 0.05, 2.35, HZ); dog(0.16, 0.16, 0.36, HX + 0.15, 2.3, HZ);
      dog(0.12, 0.5, 0.12, HX - 0.9, 1.25, HZ - 0.12); dog(0.12, 0.5, 0.12, HX - 0.9, 1.25, HZ + 0.12); dog(0.1, 0.12, 0.1, HX - 0.05, 2.6, HZ - 0.12); dog(0.1, 0.12, 0.1, HX - 0.05, 2.6, HZ + 0.12);
      for (const [x0, z0, x1, z1, h, m] of [[-318, -3812, -262, -3760, 18, UG], [-236, -3760, -206, -3728, 12, MOD], [-196, -3812, -120, -3752, 20, UG2], [-110, -3800, -46, -3730, 18, UG]]) pushPrism(m, 'ROOF', rectPoly(x0, z0, x1, z1), 0, h);
      for (let k = 0; k < 90; k++) { const x = rr(Y[0] + 4, Y[2] - 4), z = rr(Y[1] + 4, Y[3] - 4); if (!acFree(x, z) || Math.hypot(x - HX, z - HZ) < 16 || (Math.abs(x + 200) < 12 && z > Y[3] - 42)) continue; (rnd() < 0.5 ? GINKGO : ROUND).push([x, z, rr(1, 1.3)]); }
      LM_PEOPLE.push([[-200, Y[3] - 6, -248, HZ + 9], 6]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    LM_HEIGHT_AREAS.unshift(['安田講堂の塔の上', (x, z, y) => y > 36 && inR([YX - 1, AZ - 10, YX + 19, AZ + 10], x, z)]);
    SPOT_AREAS.push(['赤門', C[0] - 8, AKZ - 16, C[0] + 8, AKZ + 16], ['東京大学 正門', C[0] - 10, AZ - 14, C[0] + 8, AZ + 14], ['安田講堂', YX - 22, AZ - 30, YX + 46, AZ + 30],
      ['銀杏並木 (東大)', C[0] + 8, AZ - 14, YX - 22, AZ + 14], ['法文2号館', -314, AZ - 52, -230, AZ - 14], ['法文1号館', -314, AZ + 14, -230, AZ + 52],
      ['総合図書館', -256, -3470, -176, -3390], ['東京大学総合研究博物館', -324, -3416, -286, -3380], ['三四郎池', -160, -3500, -82, -3400], ['東大病院', -112, -3395, -42, -3326],
      ['ハチ公と上野英三郎博士の像', -262, -3722, -238, -3702], ['農正門', -212, Y[3] - 6, -188, Y[3] + 2], ['東京大学 弥生キャンパス', ...Y], ['東京大学 本郷キャンパス', ...C]);
    LM_LABELS.push(['赤門', C[0], AKZ, '⛩', '赤門'], ['安田講堂', YX + 10, AZ, '🏫', '安田講堂'], ['銀杏並木', -270, AZ, '🍂', '銀杏並木 (東大)'], ['三四郎池', -120, -3445, '🐟'],
      ['総合図書館', -216, -3415, '📚'], ['ハチ公と上野博士', -250, -3712, '🐕', 'ハチ公と上野英三郎博士の像'], ['東京大学', -180, -3600, '🎓', '東京大学 本郷キャンパス']);
    Object.assign(LM_NOTES, {
      '東京大学 本郷キャンパス': '江戸時代は加賀藩前田家の屋敷だった場所。いまも赤門や三四郎池にその名残がある',
      '赤門': '1827年、加賀藩の前田家が将軍の娘・溶姫を迎えるときに建てた朱塗りの門。国の重要文化財',
      '東京大学 正門': '1912年、建築家・伊東忠太の設計。正門から銀杏並木のまっすぐ先に安田講堂が見える',
      '銀杏並木 (東大)': '秋は黄色いトンネルになる並木道。イチョウの葉は東京大学のマークにもなっている',
      '安田講堂': '1925年完成。正式な名前は「大講堂」で、建設費を寄付した実業家・安田善次郎にちなんで呼ばれる。高さ39.7m',
      '安田講堂の塔の上': '1969年の東大紛争では、学生が講堂に立てこもった。いまは卒業式などに使われている',
      '法文1号館': '設計者・内田祥三の名から「内田ゴシック」と呼ばれる、アーチの多い茶色いタイルの建物',
      '法文2号館': '真ん中の大きなアーチをくぐって、銀杏並木と反対側を行き来できる',
      '三四郎池': '夏目漱石の小説『三四郎』で、三四郎と美禰子が出会う池。もとは加賀藩邸の庭園「育徳園」の心字池',
      '総合図書館': '前の広場には噴水がある。キャンパスのまん中にある大きな図書館',
      '東京大学総合研究博物館': '大学が集めた化石・鉱物・人類学などの学術標本を見せる博物館',
      'ハチ公と上野英三郎博士の像': '2015年にできた像。渋谷で主人を待ち続けたハチ公が、やっと上野博士に飛びついて再会する姿',
      '東京大学 弥生キャンパス': '農学部などがあるキャンパス。上野博士は日本の農業土木学を開いた学者',
      '農正門': '弥生キャンパスの門。むかしはここに第一高等学校の門があった',
    });
    Object.assign(LM_TIPS, {
      '東京大学 本郷キャンパス': 'キャンパスは自由に見学できる (15人以上の団体は登録が必要)。共通テストと2次試験の日は入れない',
      '赤門': '耐震改修工事のため閉門中。工事の完了は2027年9月ごろの予定',
      '東京大学総合研究博物館': '入館無料。10:00〜17:00 (入館16:30まで)、土日祝は休館',
    });
    const seen = new Set();
    LM_UPDATERS.push(() => { if (Math.abs(P.x - C[0]) < 14 && Math.abs(P.z - AKZ) < 16) seen.add('a'); if (inR([YX - 22, AZ - 30, YX + 46, AZ + 30], P.x, P.z)) seen.add('y'); if (inR([-160, -3500, -82, -3400], P.x, P.z)) seen.add('p'); });
    LM_ACH.push(['todai3', '🎓 東大さんぽ', '赤門・安田講堂・三四郎池をすべて訪ねる', () => seen.size === 3],
      ['hachiko2', '🐕 ハチ公の再会', '弥生キャンパスのハチ公と上野博士の像に会う', () => inR([-262, -3722, -238, -3702], P.x, P.z)]);
    bakeFlush();
  },
});
// 金色の飾り (正門の旭日)
function GOLDISH() { return GOLDISH.m || (GOLDISH.m = lam({ color: 0xd8b040, emissive: 0x3a2a00 })); }
