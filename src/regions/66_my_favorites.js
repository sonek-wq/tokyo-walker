/* 「いちばん欲しい施設」その2
   - 明治生命館 (丸の内。お濠と日比谷通りに面する。巨大なコリント式の列柱)
   - ホテルニューオータニ (紀尾井町。Y字形の本館と丸い屋上、ガーデンタワー、池泉回遊式の日本庭園・太鼓橋・大滝)
   - 小網神社 (日本橋小網町。総欅造りの小さな社殿。強運厄除けと銭洗い弁天) */
REGION({
  name: 'お気に入り (2)',
  towns: [],
  labels: [],
  build(r) {
    const { C, spot, sign, signX, windows, TREE_LISTS, SHU } = SL_KIT();
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); } if (col) fr(...R, col); };

    // ===== 明治生命館 =====
    {
      const R = [-394, -1566, -336, -1506];
      site(R, '#d4ccb8');
      const MS = windows('MS_WALL', '#e8e2d4', '#3e4650', 8, 8), GR = C('MS_GRANITE', { color: 0xddd6c6 }), COL = lam({ color: 0xeee8da });
      pushPrism(C('MS_BASE', { color: 0xcfc8b6 }), 'CONC', rectPoly(-390, -1562, -340, -1510), 0, 7);   // 2階分の基壇
      pushPrism(MS, 'CONC', rectPoly(-388, -1560, -342, -1512), 7, 31);
      pushPrism(GR, GR, rectPoly(-390.5, -1562.5, -339.5, -1509.5), 29.5, 31.5);   // 軒の帯 (軒高 約31m)
      pushPrism(MS, 'CONC', rectPoly(-384, -1556, -346, -1516), 31.5, 37);         // 上の階
      // 5層分を貫くコリント式の列柱 (お濠側の西面と北面)
      for (let z = -1557; z <= -1515; z += 4.6) { bake(COL, new THREE.CylinderGeometry(0.75, 0.85, 22, 12).translate(-390.2, 18, z)); bake(COL, new THREE.BoxGeometry(2, 1, 2).translate(-390.2, 29.3, z)); bake(COL, new THREE.BoxGeometry(2, 0.6, 2).translate(-390.2, 7.3, z)); }
      for (let x = -384; x <= -346; x += 4.75) { bake(COL, new THREE.CylinderGeometry(0.75, 0.85, 22, 12).translate(x, 18, -1562.2)); bake(COL, new THREE.BoxGeometry(2, 1, 2).translate(x, 29.3, -1562.2)); bake(COL, new THREE.BoxGeometry(2, 0.6, 2).translate(x, 7.3, -1562.2)); }
      pushPrism('glass', 'CONC', rectPoly(-394, -1540, -390, -1530), 0, 4.5);   // 入口
      signX(-394.3, -1535, -1, '明治生命館', 7, 5.6, '#e8e2d4', '#2a2a2a');
      for (const z of [-1564, -1508]) ROUND.push([-393, z, 0.9]);
      LM_PEOPLE.push([[-397, -1564, -397, -1508], 4]);
      spot('明治生命館', R, '明治生命館', '🏛', '1934年に完成した、白い花崗岩の古典主義の建物。お濠から見上げると、5階分を貫く巨大なコリント式の列柱が並ぶ。1997年、昭和の建物として初めて国の重要文化財になった。設計は鳩山会館と同じ岡田信一郎', -365, -1536);
      SPOT_AREAS.unshift(['明治生命館 (2階の会議室)', -388, -1560, -342, -1512]);
      LM_NOTES['明治生命館 (2階の会議室)'] = '戦後はGHQに接収され、2階の会議室では、アメリカ・イギリス・中国・ソ連の代表による対日理事会が開かれた。いまは建物の中に静嘉堂文庫美術館も入っている';
    }

    // ===== ホテルニューオータニ =====
    {
      const R = [-1795, -1993, -1707, -1907], cx = -1740, cz = -1968;
      site(R, '#6a8a4a');
      // ザ・メイン (真上から見るとY字形の17階建て) と、屋上の丸いレストラン
      const NO = windows('NO_MAIN', '#e6e2d8', '#4a5866', 5, 17);
      for (const a of [0, Math.PI * 2 / 3, Math.PI * 4 / 3]) {
        const dx = Math.sin(a), dz = -Math.cos(a), px = -dz, pz = dx, L = 24, W = 6;
        pushPrism(NO, 'CONC', [[cx + px * W, cz + pz * W], [cx + dx * L + px * W, cz + dz * L + pz * W], [cx + dx * L - px * W, cz + dz * L - pz * W], [cx - px * W, cz - pz * W]], 0, 66);
      }
      pushPrism(NO, 'CONC', regularPoly(cx, cz, 8, 6), 0, 66);
      pushPrism(C('NO_CROWN', { color: 0x4a6a8a }), 'CONC', regularPoly(cx, cz, 13, 20), 66, 71);   // 屋上の丸いレストラン
      pushPrism('glass', 'CONC', regularPoly(cx, cz, 12.6, 20), 67, 70.5);
      pushPrism('CONC', 'CONC', regularPoly(cx, cz, 6, 12), 71, 74);
      // ガーデンタワー (40階建て・地上144m)
      pushPrism(windows('NO_TOWER', '#d8d6d0', '#3e4a58', 4, 20), 'CONC', rectPoly(-1727, -1935, -1711, -1911), 0, 144);
      signX(-1706.7, -1923, 1, 'ホテルニューオータニ', 12, 6, '#f4f0e6', '#7a5a1a');
      // 日本庭園 (池泉回遊式。池・朱色の太鼓橋・大滝)
      fe(-1768, -1932, 22, 14, '#8a8068'); fe(-1768, -1932, 20.5, 12.5, '#2f5f5a');
      { const B = SHU, cxB = -1768, N = 9; for (let i = 0; i < N; i++) { const t0 = i / N, h = Math.sin((i + 0.5) / N * Math.PI) * 1.8; pushPrism(B, B, rectPoly(cxB - 1.4, -1945 + t0 * 26 / 1, cxB + 1.4, -1945 + (i + 1) / N * 26), h, h + 0.3); }
        for (const s of [-1, 1]) for (let i = 0; i <= N; i++) { const h = Math.sin(i / N * Math.PI) * 1.8; bake(lam({ color: 0xc8402a }), new THREE.BoxGeometry(0.15, 0.9, 0.15).translate(cxB + s * 1.35, h + 0.75, -1945 + i / N * 26)); } }   // 太鼓橋
      { const ROCK = lam({ color: 0x6a6660 }); for (let k = 0; k < 14; k++) bake(ROCK, new THREE.DodecahedronGeometry(rr(1.2, 2.4), 0).translate(-1752 + rr(-5, 5), rr(0.5, 6), -1922 + rr(-2, 2)));
        bake(lam({ color: 0xe8f2f4, emissive: 0x203038 }), new THREE.BoxGeometry(2.2, 6.2, 0.4).translate(-1752, 3.1, -1923.6)); }   // 大滝 (落差6m)
      for (let k = 0; k < 24; k++) { const x = rr(-1793, -1712), z = rr(-1948, -1909); if (((x + 1768) / 24) ** 2 + ((z + 1932) / 16) ** 2 < 1 || inR([-1729, -1937, -1709, -1909], x, z)) continue; (rnd() < 0.35 ? PINES : rnd() < 0.5 ? MAPLES : ROUND).push([x, z, rr(0.8, 1.1)]); }
      STONE_LANTERNS.push([-1790, -1945], [-1745, -1912]);
      LM_PEOPLE.push([[-1793, -1950, -1793, -1912], 3], [[-1790, -1950, -1745, -1950], 3]);
      spot('ホテルニューオータニ', R, 'ニューオータニ', '🏨', '1964年9月1日、東京オリンピックで訪れる外国人客を迎えるため、国の求めに応じて伏見宮の屋敷の跡に開業した、日本初の高層ホテル。真上から見るとY字形の本館の屋上には、丸いレストランがのっている', cx, cz);
      SPOT_AREAS.unshift(['ニューオータニの日本庭園', -1795, -1950, -1729, -1907]);
      LM_NOTES['ニューオータニの日本庭園'] = '江戸時代のはじめは加藤清正の下屋敷、その後は彦根藩井伊家の屋敷の庭だった、400年以上の歴史をもつ池泉回遊式の庭園。高さの差をいかし、86個の巨岩を使って落差6mの大滝がつくられた';
    }

    // ===== 小網神社 =====
    {
      const R = [562, -1898, 594, -1868];
      site(R, '#cfc6ae');
      tiles(574, -1898, 582, -1884, '#d6ccb4', '#c6bca4', 1.2);
      myojinTorii(578, -1896, true, 4.2, 4.6, WALL.TKSTONE, 0.25);
      const KEYAKI = C('KA_KEYAKI', { color: 0x8a6a48 });
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(568, -1884, 588, -1870), 0, 0.7);
      pushPrism(KEYAKI, 'WOOD', rectPoly(570, -1882, 586, -1872), 0.7, 5);   // 総欅造りの社殿
      jRoof('RF_COPPER', 568.6, -1884, 587.4, -1870, 5, 3, { over: 0.8, kind: 'irimoya' });
      pushPrism(KEYAKI, 'WOOD', rectPoly(586, -1894, 592.5, -1888), 0, 3.6);   // 神楽殿
      jRoof('RF_COPPER', 585.4, -1894.6, 593.1, -1887.4, 3.6, 1.8, { over: 0.4, kind: 'irimoya' });
      // 銭洗いの井 (萬福舟乗弁財天のそば)
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(566.5, -1890, 1.3, 10), 0, 0.9); fe(566.5, -1890, 0.9, 0.9, '#3a6a78');
      bake(lam({ color: 0xd8c8a0 }), new THREE.BoxGeometry(0.6, 0.15, 0.6).translate(566.5, 1.0, -1890));   // ざる
      { const RED = lam({ color: 0xf2ece0, emissive: 0x403830 }); for (const x of [571, 585]) bake(RED, new THREE.CylinderGeometry(0.4, 0.4, 0.9, 8).translate(x, 4.3, -1885)); }
      for (const [x, z] of [[564, -1872], [592, -1872]]) ROUND.push([x, z, 0.8]);
      LM_PEOPLE.push([[578, -1899, 578, -1886], 6]);   // 参拝の列
      spot('小網神社', R, '小網神社', '⛩', '1466年創建と伝わる、日本橋の「強運厄除け」の神社。第二次世界大戦では、お守りを受けた氏子の兵士が全員生還し、社殿も戦災をまぬがれたという。社殿の左右には「強運厄除けの龍」の彫刻がある', 578, -1880);
      SPOT_AREAS.unshift(['小網神社の社殿', 568, -1884, 594, -1868], ['銭洗いの井 (東京銭洗い弁天)', 564, -1893, 569, -1887]);
      Object.assign(LM_NOTES, {
        '小網神社の社殿': '社殿と神楽殿は1929年、明治神宮の造営で工匠長を務めた宮大工・内藤駒三郎の一門がつくった総欅造り。日本橋に残るただひとつの戦前の木造の神社建築',
        '銭洗いの井 (東京銭洗い弁天)': 'ざるにお金を入れてこの井戸の水で清めると、金運が上がるといわれる「東京銭洗い弁天」',
      });
    }
    bakeFlush();
  },
});
