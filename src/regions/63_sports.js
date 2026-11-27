/* 主要なスポーツ施設 (国立競技場・神宮球場・東京体育館・東京ドーム・両国国技館・日本武道館・代々木競技場・有明アリーナは作成済み)
   - 秩父宮ラグビー場 (神宮球場の南、いちょう並木の西): ラグビーの聖地
   - 講道館 (春日。文京シビックセンターの北東): 柔道の総本山と嘉納治五郎の像
   - 後楽園ホール (水道橋。東京ドームの南の「青いビル」の5階)
   - 有明コロシアムと有明テニスの森 (有明。開閉式の屋根のセンターコート)
   - 東京アクアティクスセンターと東京辰巳アイスアリーナ (辰巳の森海浜公園) */
REGION({
  name: 'スポーツ施設',
  towns: [],
  labels: [],
  build(r) {
    const { C, spot, sign, signX, windows, TREE_LISTS } = SL_KIT();
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); } if (col) fr(...R, col); };
    const SEAT = C('SP_SEAT', { color: 0x6a7a8a }), SEAT2 = C('SP_SEAT2', { color: 0x3a5a8a }), WHITE = lam({ color: 0xf4f4f0 });
    // 階段状の観客席: 競技場側 (side) から外へ向かって段が高くなる
    const stand = (R, side, n, rise, mat = SEAT) => {
      const [x0, z0, x1, z1] = R, W = (side === 'e' || side === 'w') ? x1 - x0 : z1 - z0, st = W / n;
      for (let i = 0; i < n; i++) {
        const q = side === 'e' ? [x0, z0, x1 - i * st, z1] : side === 'w' ? [x0 + i * st, z0, x1, z1] : side === 's' ? [x0, z0, x1, z1 - i * st] : [x0, z0 + i * st, x1, z1];
        pushPrism(mat, mat, rectPoly(...q), 0, (i + 1) * rise);
      }
    };
    const line = (x0, z0, x1, z1) => fr(x0, z0, x1, z1, '#f4f4f0');

    // ===== 秩父宮ラグビー場 =====
    {
      const R = [-2550, -1258, -2392, -1130], P = [-2506, -1244, -2436, -1144];
      site(R, '#8a8a84');
      fr(...P, '#4f8a3a');
      for (let z = P[1]; z < P[3]; z += 10) fr(P[0], z, P[2], z + 5, '#57923f');   // 芝の縞
      line(P[0], P[1], P[2], P[1] + 0.3); line(P[0], P[3] - 0.3, P[2], P[3]); line(P[0], P[1], P[0] + 0.3, P[3]); line(P[2] - 0.3, P[1], P[2], P[3]);
      for (const z of [-1234, -1194, -1154]) line(P[0], z - 0.15, P[2], z + 0.15);   // トライライン・ハーフウェーライン
      // H型のゴールポスト (南北の両端)
      for (const z of [-1234, -1154]) { for (const dx of [-2.8, 2.8]) bake(WHITE, new THREE.BoxGeometry(0.3, 13, 0.3).translate(-2471 + dx, 6.5, z)); bake(WHITE, new THREE.BoxGeometry(5.9, 0.3, 0.3).translate(-2471, 3, z)); }
      // スタンド: 西のメインスタンド (屋根つき)・東のバックスタンド・南北のゴール裏
      stand([-2546, -1248, -2510, -1140], 'e', 6, 2.4, SEAT2);
      pushPrism('CONC', 'CONC', rectPoly(-2548, -1250, -2526, -1138), 14.4, 15.2);   // メインスタンドの屋根
      for (const z of [-1246, -1220, -1194, -1168, -1142]) pushPrism('CONC', 'CONC', rectPoly(-2548, z - 0.5, -2547, z + 0.5), 0, 14.4);
      stand([-2432, -1248, -2396, -1140], 'w', 5, 1.8);
      stand([-2510, -1256, -2432, -1248], 's', 3, 1.2); stand([-2510, -1140, -2432, -1132], 'n', 3, 1.2);
      // 照明塔
      for (const [x, z] of [[-2548, -1256], [-2394, -1256], [-2548, -1132], [-2394, -1132]]) { pushPrism('CONC', 'CONC', rectPoly(x - 0.6, z - 0.6, x + 0.6, z + 0.6), 0, 30); pushPrism(C('SP_LIGHT', { color: 0xf4f0d8 }), 'CONC', rectPoly(x - 2, z - 0.4, x + 2, z + 0.4), 30, 32); }
      signX(-2550.3, -1194, -1, '秩父宮ラグビー場', 12, 4, '#1e2a4a', '#f4f0e6');
      LM_PEOPLE.push([[-2556, -1250, -2556, -1136], 6]);
      spot('秩父宮ラグビー場', R, '秩父宮ラグビー場', '🏉', '1947年に「東京ラグビー場」として完成した、東日本のラグビーの聖地。空襲で焼け野原になった女子学習院の跡地に建てられた。2026年2月には北側で国内初の屋内全天候型ラグビー場の建設が始まり、2030年の開業をめざしている', -2471, -1194);
    }

    // ===== 講道館 (春日) =====
    {
      const R = [-696, -3311, -607, -3214];
      site(R, '#c6c0b0');
      pushPrism(windows('SP_KODOKAN', '#eceae2', '#46505c', 6, 8), 'CONC', rectPoly(-690, -3302, -644, -3254), 0, 30);   // 国際柔道センター
      pushPrism(windows('SP_KODOKAN2', '#ddd8cc', '#46505c', 4, 6), 'CONC', rectPoly(-638, -3302, -612, -3256), 0, 22);   // 本館
      pushPrism('glass', 'CONC', rectPoly(-678, -3254, -656, -3250), 0, 5);
      sign(-667, -3249.6, 1, '講道館', 6, 6.2, '#f4f0e6', '#1a1a1a');
      tiles(-694, -3248, -609, -3216, '#d2ccbc', '#c2bcac', 2);
      // 嘉納治五郎の像 (台座・からだ・頭)
      { const BZ = lam({ color: 0x5a6a52 }), x = -640, z = -3232;
        pushPrism('TKSTONE', 'TKSTONE', rectPoly(x - 1.4, z - 1.4, x + 1.4, z + 1.4), 0, 2);
        bake(BZ, new THREE.CylinderGeometry(0.45, 0.6, 1.8, 8).translate(x, 2.9, z)); bake(BZ, new THREE.SphereGeometry(0.32, 8, 6).translate(x, 4.05, z)); bake(BZ, new THREE.BoxGeometry(1.3, 0.34, 0.5).translate(x, 3.6, z)); }
      for (const [x, z] of [[-690, -3222], [-620, -3222], [-610, -3240]]) ROUND.push([x, z, 1.0]);
      LM_PEOPLE.push([[-690, -3238, -650, -3238], 4]);
      spot('講道館', R, '講道館', '🥋', '1882年に嘉納治五郎が開いた、柔道の総本山。下谷の寺の一角から始まり、何度も移転して1958年にいまの春日へ。510畳の大道場がある', -650, -3270);
      SPOT_AREAS.unshift(['嘉納治五郎の像', -646, -3238, -634, -3226]);
      LM_NOTES['嘉納治五郎の像'] = '柔道の生みの親で、アジアで初めての国際オリンピック委員会 (IOC) の委員になった「日本オリンピックの父」。日本の体育・スポーツの発展にも力を注いだ';
    }

    // ===== 後楽園ホール (東京ドームシティの「青いビル」) =====
    {
      const R = [-528, -2940, -490, -2908];
      site(R);
      const BLUE = windows('SP_BLUEBLD', '#3a6ab4', '#a8c8e8', 6, 10);
      pushPrism(BLUE, 'CONC', rectPoly(-524, -2936, -494, -2912), 0, 36);
      pushPrism('CONC', 'CONC', rectPoly(-525, -2937, -493, -2911), 16, 17);   // 5階のあたりの帯
      sign(-509, -2911.6, 1, '後楽園ホール', 9, 18.6, '#f4d020', '#1a1a1a');
      LM_PEOPLE.push([[-526, -2906, -492, -2906], 4]);
      spot('後楽園ホール', R, '後楽園ホール', '🥊', '東京ドームシティの通称「青いビル」の5階にある、ボクシングとプロレスの聖地。1962年に「後楽園ジムナジアム」として開業した。窓のない遮光式のホールで、長寿番組『笑点』の収録会場としても知られる', -509, -2924);
    }

    // ===== 有明コロシアムと有明テニスの森 =====
    {
      const CC = [1805, 607, 1893, 698], cx = 1849, cz = 652.5, RO = 40, RI = 33;
      site(CC, '#b8b4a8');
      // 八角形の外壁 (高さ約20m) と、内側へ下がる観客席
      const ring = (r0, r1, y0, y1, mat) => { for (let i = 0; i < 8; i++) { const a0 = (i + 0.5) / 8 * Math.PI * 2, a1 = (i + 1.5) / 8 * Math.PI * 2; pushPrism(mat, mat, [[cx + Math.cos(a0) * r1, cz + Math.sin(a0) * r1], [cx + Math.cos(a0) * r0, cz + Math.sin(a0) * r0], [cx + Math.cos(a1) * r0, cz + Math.sin(a1) * r0], [cx + Math.cos(a1) * r1, cz + Math.sin(a1) * r1]], y0, y1); } };
      ring(RI, RO, 0, 20, windows('SP_COLI', '#e4e0d8', '#5a6470', 8, 4));
      for (let k = 0; k < 5; k++) ring(14 + k * 3.8, 14 + (k + 1) * 3.8, 0, 2.4 + k * 3.2, SEAT2);
      fr(cx - 9, cz - 15, cx + 9, cz + 15, '#2f6aa8'); fr(cx - 5.5, cz - 12, cx + 5.5, cz + 12, '#3a7ac0');   // センターコート
      line(cx - 5.5, cz - 0.1, cx + 5.5, cz + 0.1); line(cx - 0.1, cz - 12, cx + 0.1, cz + 12);
      // 開閉式の屋根 (いまは半分ほど開いている)
      pushPrism('CONC', 'CONC', [[cx - 36, cz - 22], [cx + 36, cz - 22], [cx + 36, cz - 6], [cx - 36, cz - 6]], 22, 23, { solid: false });
      pushPrism('CONC', 'CONC', [[cx - 36, cz + 14], [cx + 36, cz + 14], [cx + 36, cz + 30], [cx - 36, cz + 30]], 22, 23, { solid: false });
      for (const dx of [-36, 36]) pushPrism('CONC', 'CONC', rectPoly(cx + dx - 1, cz - 36, cx + dx + 1, cz + 36), 20, 22.2);   // 屋根のレール
      sign(cx, cz + RO * 0.924 + 0.4, 1, '有明コロシアム', 10, 12, '#1e3a6a', '#f4f0e6');
      // テニスの森の屋外コート (北の2つの街区)
      for (const B of [[1704, 527, 1793, 593], [1805, 527, 1893, 593]]) {
        site(B, '#4a7a4a');
        for (const ux of [B[0] + 4, B[0] + 46]) for (const uz of [B[1] + 4, B[1] + 35]) {
          fr(ux, uz, ux + 40, uz + 27, '#2f6a8a'); fr(ux + 8, uz + 8, ux + 32, uz + 19, '#3a7aa0');
          line(ux + 8, uz + 13.4, ux + 32, uz + 13.6); line(ux + 19.9, uz + 8, ux + 20.1, uz + 19);
          bake(lam({ color: 0x2a2a2a }), new THREE.BoxGeometry(0.06, 1, 11).translate(ux + 20, 0.5, uz + 13.5));
        }
      }
      LM_PEOPLE.push([[1712, 560, 1885, 560], 6], [[1800, 700, 1898, 700], 4]);
      spot('有明コロシアム', CC, '有明コロシアム', '🎾', '1987年に完成した、約1万人が入る「日本テニスの聖地」。1991年には当時まだ珍しかった開閉式の屋根がつき、全天候型のセンターコートになった。2012年のジャパンオープンでは、錦織圭選手が日本男子として初めてシングルスの優勝を飾った', cx, cz);
      spot('有明テニスの森公園', [1704, 527, 1893, 593], 'テニスの森', '🎾', '1983年に開設された、国内有数のテニスの拠点。東京2020パラリンピックでは国枝慎吾選手が車いすテニスで金メダルをとり、2026年には車いすテニスのナショナルトレーニングセンターにも指定された', 1798, 560);
    }

    // ===== 東京アクアティクスセンターと東京辰巳アイスアリーナ (辰巳の森海浜公園) =====
    {
      const A = [2103, 103, 2243, 196];
      site(A, '#c8c2b2');
      pushPrism(windows('SP_AQUA', '#d8dcdc', '#4a6a80', 10, 4), 'CONC', rectPoly(2112, 112, 2234, 180), 0, 26);
      pushPrism(C('SP_AQROOF', { color: 0xe8ecec }), 'CONC', rectPoly(2106, 106, 2240, 186), 30, 32.5);   // 大屋根 (外壁より大きくはみ出す)
      for (let x = 2114; x <= 2232; x += 12) { bake(lam({ color: 0xd0d4d4 }), new THREE.BoxGeometry(0.9, 31, 0.9).rotateZ(0.18).translate(x, 15.5, 184)); }   // 斜めの柱
      pushPrism('glass', 'CONC', rectPoly(2150, 180, 2196, 184), 0, 8);
      sign(2173, 186.4, 1, 'AQUATICS', 10, 10, '#f4f6f8', '#1e4a7a');
      for (let x = 2108; x < 2240; x += 14) ROUND.push([x, 192, 0.9]);
      LM_PEOPLE.push([[2110, 190, 2236, 190], 6]);
      spot('東京アクアティクスセンター', A, 'アクアティクス', '🏊', '東京2020大会の競泳・飛込・アーティスティックスイミングの会場。大会のときは約1万5000席の観客席があり、大会後に約5000席へ減らして、トップレベルの大会から市民の利用まで使える「水泳の聖地」になった', 2173, 146);
      const I = [2103, 7, 2243, 93];
      site(I, '#c8c2b2');
      pushPrism(windows('SP_ICE', '#e2e0da', '#5a6a76', 8, 3), 'CONC', rectPoly(2114, 16, 2232, 84), 0, 16);
      for (let k = 0; k < 6; k++) { const h = 16 + Math.sin((k + 0.5) / 6 * Math.PI) * 7; pushPrism('CONC', 'CONC', rectPoly(2114 + k * 19.7, 18, 2114 + (k + 1) * 19.7, 82), 16, h); }   // ゆるい弓なりの屋根
      sign(2173, 84.4, 1, 'アイスアリーナ', 10, 6, '#e8f2fa', '#1e3a6a');
      for (let x = 2110; x < 2240; x += 16) ROUND.push([x, 90, 0.85]);
      spot('東京辰巳アイスアリーナ', I, 'アイスアリーナ', '⛸', '1993年に開業した「東京辰巳国際水泳場」(東京2020大会の水球会場) を改修してできた、都立で初めてのアイスリンク。国際規格のメインリンクのほか、カーリングのシートも常設されている', 2173, 50);
    }
    bakeFlush();
  },
});
