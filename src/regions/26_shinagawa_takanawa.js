/* 品川・高輪ゲートウェイ (品川: 港南口のスカイウェイと品川インターシティ・品川シーズンテラス / 高輪口の第一京浜・品川プリンスホテル・マクセル アクアパーク品川
   高輪ゲートウェイ: 折り紙のような駅の大屋根・TAKANAWA GATEWAY CITY (THE LINKPILLAR 1・2、MoN Takanawa)・高輪築堤・泉岳寺)
   座標は山手線の駅にそろえる (u = 線路の向き、田町の方が +。v = 環の外向き = 海側が +) */

// ---- 回転した座標系のスロープ (歩いて上り下りできる)。u0..u1 の幅で、v0 → v1 に y0 → y1 と上がる
function oRampV(F, key, u0, u1, v0, v1, y0, y1) {
  const um = (u0 + u1) / 2; pushSlope(key, 'CONC', F.w(um, v0), F.w(um, v1), (u1 - u0) / 2, y0, y1, 0.6);
  const n = Math.ceil(Math.abs(v1 - v0) / 0.8);
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, v = v0 + (v1 - v0) * t, y = y0 + (y1 - y0) * t; for (let u = u0 + 0.6; u < u1; u += 1.1) { const [x, z] = F.w(u, v); solid(x - 0.55, z - 0.55, x + 0.55, z + 0.55, Math.min(y0, y1) - 0.6, y); } }
}

REGION({
  name: '品川・高輪',
  towns: [['港南', -1080, 1700], ['高輪', -1460, 1300]],
  stations: ['品川', '高輪ゲートウェイ'],   // 駅のまわりを作り込んだ駅 (ファストトラベルで緑の枠)
  labels: [],
  build(r) {
    const WH = lam({ color: 0xf2f0ea });
    const TWR = (k, bg, win) => acGothic(k, bg, win, null, { rowH: 4, step: 3, ww: 2, wh: 3, lit: 0.55 });
    const ICM = TWR('SG_IC', '#c8ccd0', '#3a4a5a'), STM = TWR('SG_ST', '#b8c4cc', '#2e3e4e'), PRM = TWR('SG_PR', '#e4e0d8', '#4a5462'), LPM = TWR('TG_LP', '#a8b4bc', '#26343e');

    // ======================= 品川 =======================
    const F = stnFrame('品川');
    // ---- 港南口: スカイウェイ (ビルをつなぐ高さ7mの歩行者デッキ) と品川インターシティ・品川シーズンテラス
    const DY = 7;
    LM_ZONES.push(F.rect(-60, 76, 90, 262));
    oBox(F, 'CONC', -2, 76, 18, 252, DY - 0.6, DY, { top: 'TKSTONE' });
    oRampV(F, 'TKSTONE', 2, 14, 46, 76, 0, DY);
    for (let v = 84; v < 250; v += 12) for (const u of [0, 16]) { const [x, z] = F.w(u, v); bake(WH, new THREE.CylinderGeometry(0.5, 0.5, DY - 0.6, 6).translate(x, (DY - 0.6) / 2, z)); solid(x - 0.5, z - 0.5, x + 0.5, z + 0.5, 0, DY - 0.6); }
    for (let v = 86; v < 248; v += 14) { const [x, z] = F.w(8, v); pushPrism('TKSTONE', 'GRASSTOP', regularPoly(x, z, 1.4, 6), DY, DY + 0.6); bake(lam({ color: 0x3e6a34 }), new THREE.SphereGeometry(1.6, 6, 4).translate(x, DY + 2.4, z)); }
    const IC = [['A', 90, 128, 144], ['B', 150, 188, 140], ['C', 210, 248, 138]];
    for (const [n, v0, v1, h] of IC) { oBox(F, ICM, -54, v0, -8, v1, 0, h); frontSign(F, -31, v0 - 0.1, -1, '品川インターシティ ' + n, '#2a3a4a', '#ffffff', 12, 1.8, DY + 4); }
    oBox(F, STM, 44, 168, 84, 210, 0, 148); frontSign(F, 64, 167.9, -1, 'SHINAGAWA SEASON TERRACE', '#1e3a2a', '#ffffff', 16, 2, DY + 4);
    polyFr(F.rect(24, 96, 86, 160), '#7aa058'); polyFr(F.rect(24, 216, 86, 250), '#7aa058');
    for (let k = 0; k < 28; k++) ROUND.push([...F.w(rr(28, 84), rr(100, 158)), rr(0.9, 1.2)]);
    LM_PEOPLE.push([[...F.w(4, 80), ...F.w(4, 250), DY], 20], [[...F.w(12, 250), ...F.w(12, 80), DY], 20]);
    // ---- 高輪口: 第一京浜・品川プリンスホテル・マクセル アクアパーク品川
    akRoad(F.w(-150, -50), F.w(150, -50), 22, '第一京浜 (国道15号)');
    LM_ZONES.push(F.rect(-90, -64, 70, -190)); oTiles(F, -90, -64, 70, -82, '#c4bcae', '#b2aa9c', 3);
    oBox(F, PRM, -80, -84, -36, -124, 0, 140); frontSign(F, -58, -83.9, 1, 'SHINAGAWA PRINCE HOTEL', '#ffffff', '#1a3a6a', 16, 2, 12);
    oBox(F, PRM, 30, -84, 66, -110, 0, 70);
    const AQ = acGothic('SG_AQ', '#2a6aa8', '#7ac8f0', null, { rowH: 8, step: 8, ww: 6, wh: 3, lit: 0.7 });
    oBox(F, AQ, -30, -86, 26, -140, 0, 18);
    frontSign(F, -2, -85.9, 1, 'aqua park 品川', '#1a5a9a', '#ffffff', 16, 2.6, 13);
    {   // 外壁のイルカとクラゲの飾り
      const DOL = lam({ color: 0x8ac8e8 });
      for (let k = 0; k < 3; k++) { const [x, z] = F.w(-18 + k * 16, -85.8); bake(DOL, new THREE.SphereGeometry(1.4, 6, 4).scale(2.2, 0.7, 0.3).rotateZ(0.4 - k * 0.3).rotateY(Math.atan2(F.vx, F.vz)).translate(x, 7 + k, z)); }
    }
    LM_PEOPLE.push([[...F.w(-86, -70), ...F.w(66, -70)], 16], [[...F.w(66, -78), ...F.w(-86, -78)], 14]);

    // ======================= 高輪ゲートウェイ =======================
    const T = stnFrame('高輪ゲートウェイ');
    // ---- 駅の大屋根 (折り紙のように折れた白い膜の屋根)
    {
      const MEM = glow(new THREE.MeshLambertMaterial({ color: 0xf4f2ec, side: THREE.DoubleSide, transparent: true, opacity: 0.92 }), '#fff4dc', 0.5);
      for (let i = 0; i < 14; i++) {
        const u0 = -70 + i * 10, up = i % 2 ? -1 : 1, [x, z] = T.w(u0 + 5, 0);
        bake(MEM, new THREE.BoxGeometry(40, 0.12, 10.3).rotateX(up * 0.22).rotateY(T.ang).translate(x, 15.5, z));
      }
      for (let u = -70; u <= 70; u += 20) for (const v of [-19, 19]) { const [x, z] = T.w(u, v); bake(WH, new THREE.CylinderGeometry(0.4, 0.5, 15, 6).translate(x, 7.5, z)); }
    }
    // ---- TAKANAWA GATEWAY CITY (THE LINKPILLAR 1・2、MoN Takanawa)
    LM_ZONES.push(T.rect(-160, -42, 70, -104)); oTiles(T, -160, -42, 70, -104, '#ccc6ba', '#bcb6aa', 3);
    oBox(T, LPM, -30, -50, 64, -98, 0, 24);
    oBox(T, LPM, -26, -54, 8, -94, 24, 165); oBox(T, LPM, 24, -54, 60, -94, 24, 158);
    frontSign(T, 17, -49.9, 1, 'TAKANAWA GATEWAY CITY', '#ffffff', '#1a1a1a', 22, 2.4, 18);
    oBox(T, LPM, -112, -52, -52, -100, 0, 136);
    frontSign(T, -82, -51.9, 1, 'THE LINKPILLAR 2', '#ffffff', '#2a2a2a', 14, 1.8, 18);
    for (let i = 0; i < 4; i++) oBox(T, 'CONC', -156, -48 - i * 3, -122, -100, 0, 28 - i * 6, { top: 'GRASSTOP' });   // MoN Takanawa (段々の屋上に畑)
    frontSign(T, -139, -47.9, 1, 'MoN Takanawa', '#2a2a2a', '#f4ecd8', 10, 1.8, 10);
    for (let k = 0; k < 20; k++) ROUND.push([...T.w(rr(-150, 66), rr(-100, -104)), 0.9]);
    LM_PEOPLE.push([[...T.w(-156, -45), ...T.w(66, -45)], 20], [[...T.w(66, -101), ...T.w(-156, -101)], 10]);
    // ---- 高輪築堤 (1872年、日本初の鉄道を海の上に通すために築いた石垣の土手)
    LM_ZONES.push(T.rect(-50, -24, 50, -40)); polyFr(T.rect(-50, -24, 50, -40), '#8a8070');
    {
      const STONE = acGothic('TG_TSUKI', '#8a8478', '#6a6458', '#9a9488', { rowH: 2, step: 3, ww: 2, wh: 1, lit: 0 });
      oBox(T, STONE, -46, -28, -6, -36, 0, 2.4); oBox(T, STONE, 6, -28, 46, -36, 0, 2.4);   // 真ん中は橋梁 (水路) の跡
      oBox(T, 'TKSTONE', -6, -28, -4.5, -36, 0, 2.4); oBox(T, 'TKSTONE', 4.5, -28, 6, -36, 0, 2.4);
      for (let u = -46; u <= 46; u += 4) for (const v of [-25, -39]) { const [x, z] = T.w(u, v); bake(lam({ color: 0x5a5e64 }), new THREE.BoxGeometry(0.12, 1.1, 0.12).translate(x, 0.55, z)); }
      polyFr(T.rect(-4.5, -28, 4.5, -36), '#3a5a6a');
    }
    // ---- 泉岳寺 (赤穂四十七士の墓のあるお寺)
    const SG = T.rect(30, -150, 110, -230);
    LM_ZONES.push(SG); oTiles(T, 30, -150, 110, -230, '#cfc6b2', '#bfb6a2', 2);
    {
      oBox(T, 'WOOD', 62, -150, 78, -156, 0, 5); oBox(T, 'WOOD', 63, -151, 77, -155, 5, 9); oHip(T, 'RF0', 61, -149, 79, -157, 9, 3.4, { over: 1.0 });   // 2層の山門
      oBox(T, 'WOOD', 56, -184, 84, -204, 0, 8); oHip(T, 'RF0', 56, -184, 84, -204, 8, 6, { over: 1.6 });   // 本堂
      acStatue(...T.w(48, -170), 0, 1.3, Math.atan2(T.vx, T.vz), WALL.BRONZE, 'stand');   // 大石内蔵助の像
      const SMOKE = lam({ color: 0xdedede, transparent: true, opacity: 0.35 });
      for (let i = 0; i < 4; i++) for (let j = 0; j < 12; j++) { const [x, z] = T.w(88 + i * 4.5, -170 - j * 4.6); bake(lam({ color: 0x8a8880 }), new THREE.BoxGeometry(0.8, 1.4, 0.8).translate(x, 0.7, z)); if ((i + j) % 3 === 0) bake(SMOKE, new THREE.SphereGeometry(0.4, 4, 3).translate(x, 1.9, z)); }
      LM_PEOPLE.push([[...T.w(70, -152), ...T.w(70, -182)], 6], [[...T.w(86, -168), ...T.w(86, -224)], 5]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    rotSpots(F, [['マクセル アクアパーク品川', -32, -84, 28, -142], ['品川プリンスホテル', -82, -82, 68, -126], ['品川インターシティ', -58, 86, -6, 252], ['品川シーズンテラス', 22, 94, 90, 252]]);
    rotSpots(T, [['高輪築堤', -50, -24, 50, -40], ['TAKANAWA GATEWAY CITY', -160, -42, 70, -104], ['泉岳寺', 30, -150, 110, -230]]);
    LM_HEIGHT_AREAS.unshift(['品川駅 港南口のスカイウェイ', (x, z, y) => y > 1 && y < DY + 3 && inPoly(F.rect(-3, 44, 19, 253), x, z)]);
    LM_LABELS.push(['インターシティ', ...F.w(-31, 170), '🏢', '品川インターシティ'], ['アクアパーク', ...F.w(-2, -112), '🐬', 'マクセル アクアパーク品川'], ['高輪GWシティ', ...T.w(17, -74), '🏙', 'TAKANAWA GATEWAY CITY'], ['高輪築堤', ...T.w(0, -32), '🧱'], ['泉岳寺', ...T.w(70, -190), '⚔']);
    Object.assign(LM_NOTES, {
      '品川駅 港南口のスカイウェイ': '港南口からオフィス街へ続く高さ7mの歩行者デッキ。朝は会社へ向かう人の波ができる。ちなみに品川駅は品川区ではなく港区にあり、北品川駅は品川駅より南にある',
      '品川インターシティ': '1998年にできた3棟のオフィスビル。昔の国鉄の車両基地の跡地を再開発した',
      '品川シーズンテラス': '広い芝生の広場があるオフィスビル。下に下水を処理する施設があり、その上にビルが建っている',
      '第一京浜 (国道15号)': '日本橋から横浜へ続く大通り。正月の箱根駅伝はここを走る',
      '品川プリンスホテル': '客室数が日本有数の大ホテル。水族館や映画館、ボウリング場もある',
      'マクセル アクアパーク品川': 'ホテルの中の水族館。音楽や光と合わせたイルカショー、クラゲの大空間など演出がにぎやか。生きものは約350種2万点',
      'TAKANAWA GATEWAY CITY': '2025年3月にまちびらき、2026年3月28日にグランドオープンした南北約1.3kmの新しい街。自動運転バスや実験的なミュージアム「MoN Takanawa」がある',
      '高輪築堤': '1872年に日本で初めての鉄道を通すため、海の上に築いた石垣の土手。駅の工事中に見つかり、2028年春には第7橋梁を保存した公園になる予定',
      '泉岳寺': '「忠臣蔵」の赤穂四十七士と、主君の浅野内匠頭が眠るお寺。1612年に徳川家康が創建。毎年12月14日などに赤穂義士祭がある。大石内蔵助の像は江戸の方角をにらんでいる',
      '高輪ゲートウェイ駅': '2020年開業の山手線でいちばん新しい駅。折り紙のような白い大屋根は隈研吾のデザイン',
    });
    Object.assign(LM_TIPS, {
      'マクセル アクアパーク品川': '大人2,800円・小中学生1,300円・幼児 (4歳以上) 800円。営業時間は時期で変わる (9:00〜21:00 など、最終入場は閉館の30分〜1時間前)。品川駅高輪口から徒歩約2分',
      '泉岳寺': '境内は無料、門は7:00〜16:00ごろ (変わることあり)。赤穂義士記念館と義士木像館は共通券で大人500円',
    });
    LM_ACH.push(['skyway', '🏢 スカイウェイ', '品川駅港南口のデッキを端まで歩く', () => P.y > DY - 1 && P.y < DY + 2 && inPoly(F.rect(-2, 240, 18, 252), P.x, P.z)],
      ['sengakuji', '⚔ 四十七士', '泉岳寺にお参りする', () => P.y < 2 && inPoly(T.rect(56, -176, 84, -206), P.x, P.z)]);
    bakeFlush();
  },
});
