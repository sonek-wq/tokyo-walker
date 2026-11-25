/* 千駄ケ谷・信濃町・明治神宮外苑 (国立競技場・東京体育館・鳩森八幡神社と富士塚・将棋会館・聖徳記念絵画館・いちょう並木・神宮球場)
   中央線の千駄ケ谷駅 (-2600, -1700) と信濃町駅 (-2370, -1700) の南。東は外苑東通り (regions/06_akasaka.js)、いちょう並木は青山通りへ下る */
// だ円の輪を n 個の四角に分けて立てる (競技場・球場のスタンド用)。a0〜a1 の角度だけ作ることもできる
function ringSeg(cx, cz, rx0, rz0, rx1, rz1, y0, y1, wall, top, opt = {}) {
  const n = opt.n || 40, a0 = opt.a0 ?? 0, a1 = opt.a1 ?? Math.PI * 2;
  for (let k = 0; k < n; k++) {
    const a = a0 + (a1 - a0) * k / n, b = a0 + (a1 - a0) * (k + 1) / n, p = (rx, rz, t) => [cx + Math.cos(t) * rx, cz + Math.sin(t) * rz];
    pushPrism(wall, top, [p(rx1, rz1, a), p(rx1, rz1, b), p(rx0, rz0, b), p(rx0, rz0, a)], y0, y1, { solid: opt.solid !== false });
  }
}
REGION({
  name: '神宮外苑',
  towns: [['霞ヶ丘町', -2540, -1560], ['千駄ヶ谷', -2700, -1600], ['北青山', -2400, -1250], ['信濃町', -2380, -1650]],
  stations: ['千駄ケ谷', '信濃町'],   // 駅のまわりを作り込んだ駅 (ファストトラベルで緑の枠)
  labels: [],
  build(r) {
    const G = [-2674, -1686, -2302, -1266];   // 外苑
    LM_ZONES.push(rectPoly(...G), rectPoly(-2762, -1686, -2690, -1480)); fr(...G, '#a49e8c'); fr(-2762, -1686, -2690, -1480, '#a49e8c');
    acRoad([-2690, -1688, -2676, -1268], 'ns', '外苑西通り');
    const WOOD = lam({ color: 0x9a6a3e }), GRN = lam({ color: 0x4e7a34 }), WHITE = lam({ color: 0xeeeae0 });
    if (!WALL.GA_WOOD) WALL.GA_WOOD = WOOD;

    // ===== 国立競技場 (2019年完成。木の軒が重なるスタジアム。2026年から呼び名は「MUFGスタジアム」) =====
    const NC = [-2550, -1500];
    {
      tiles(NC[0] - 112, NC[1] - 100, NC[0] + 112, NC[1] + 100, '#c8c0ae', '#b8b09e', 4);
      ringSeg(...NC, 70, 58, 106, 93, 0, 5, 'CONC', 'CONC');                                     // 土台
      ringSeg(...NC, 70, 58, 80, 68, 5, 12, 'CONC', 'CONC'); ringSeg(...NC, 80, 68, 90, 78, 5, 22, 'CONC', 'CONC'); ringSeg(...NC, 90, 78, 99, 87, 5, 33, 'CONC', 'CONC');   // 段になったスタンド
      ringSeg(...NC, 97, 85, 100, 88, 5, 44, 'CONC', null);                                       // 外側の壁
      for (const y of [13, 24, 35]) ringSeg(...NC, 99, 87, 108, 96, y, y + 1.2, 'GA_WOOD', 'GA_WOOD', { solid: false });   // 木の軒 (3段)
      ringSeg(...NC, 60, 50, 106, 94, 44, 46.5, 'GA_WOOD', 'ROOF');                               // 屋根 (まん中は空いている)
      for (let k = 0; k < 90; k++) { const a = rr(0, 6.28), y = pick([14.2, 25.2, 36.2]); bake(GRN, new THREE.IcosahedronGeometry(rr(0.6, 1.0), 0).translate(NC[0] + Math.cos(a) * 104, y + 0.3, NC[1] + Math.sin(a) * 92)); }   // 軒の植物
      fe(...NC, 62, 51, '#b8503a'); fe(...NC, 52, 41, '#4e8a3a');                                 // 陸上トラックとフィールド
      const sg = glow(new THREE.MeshLambertMaterial({ map: textTex('国立競技場  MUFG STADIUM', '#3a2a1e', '#f4ead8', 256, 24) }), '#ffe8c0', 0.5);
      for (const [a, ry] of [[-Math.PI / 2, Math.PI], [Math.PI / 2, 0]]) mesh(new THREE.PlaneGeometry(26, 2.4), sg, NC[0] + Math.cos(a) * 101.2, 8, NC[1] + Math.sin(a) * 89.2, ry);
      LM_PEOPLE.push([[NC[0] - 110, NC[1] - 98, NC[0] + 110, NC[1] - 98], 14], [[NC[0] + 110, NC[1] + 98, NC[0] - 110, NC[1] + 98], 10]);
    }
    // ===== 東京体育館 (1990年、槇文彦の設計。金属の大きな屋根) =====
    {
      const T = [-2664, -1682, -2580, -1618];
      tiles(T[0] - 2, T[1] - 2, T[2] + 14, T[3] + 4, '#cfc8b8', '#bfb8a8', 3);
      pushPrism('CONC', 'CONC', rectPoly(...T), 0, 7);
      const METAL = lam({ color: 0xb8bcc0 });
      mesh(new THREE.SphereGeometry(1, 20, 8, 0, Math.PI * 2, 0, Math.PI / 2).scale(40, 16, 30), METAL, (T[0] + T[2]) / 2, 7, (T[1] + T[3]) / 2);   // メインアリーナの屋根
      pushPrism('glass', 'ROOF', regularPoly(T[2] + 6, T[3] - 10, 7, 8), 0, 9); mesh(new THREE.ConeGeometry(7.5, 6, 8), METAL, T[2] + 6, 12, T[3] - 10);   // 入口のガラスの塔
      solid(T[0] + 4, T[1] + 4, T[2] - 4, T[3] - 4, 7, 20);
    }
    // ===== 鳩森八幡神社と富士塚 (都内に残る古い富士塚のひとつ)・将棋会館 =====
    {
      const S = [-2758, -1600, -2712, -1532], SX = (S[0] + S[2]) / 2;
      tiles(SX - 3, S[3] - 30, SX + 3, S[3], '#cfc6b0', '#c0b6a0', 2);
      myojinTorii(SX, S[3] - 2, true, 4.6, 4.5, lam({ color: 0xc8382a }), 0.3);
      pushPrism('WOOD', 'ROOF', rectPoly(SX - 6, S[1] + 2, SX + 6, S[1] + 12), 0, 5); jRoof('RF_COPPER', SX - 7, S[1] + 1, SX + 7, S[1] + 13, 5, 3, { over: 1, kind: 'irimoya' });
      // 富士塚: 溶岩を積んだ小さな富士山。頂上まで登れる
      const FX = S[0] + 9, FZ = S[3] - 20;
      for (let i = 0; i < 6; i++) pushPrism('ISHIGAKI', 'ISHIGAKI', regularPoly(FX, FZ, 7 - i * 1.15, 10), i * 1.0, (i + 1) * 1.0);
      for (let k = 0; k < 16; k++) { const a = rr(0, 6.28), d = rr(2, 6.5); bake(lam({ color: 0x3a3634 }), new THREE.DodecahedronGeometry(rr(0.3, 0.6), 0).translate(FX + Math.cos(a) * d, 6 - d * 0.85, FZ + Math.sin(a) * d)); }
      for (let k = 0; k < 14; k++) ROUND.push([rr(S[0] + 2, S[2] - 2), rr(S[1] + 14, S[3] - 2), rr(0.8, 1.1)]);
      // 将棋会館 (2024年に鳩森八幡のとなりへ移った)
      pushPrism(acGothic('GA_SHOGI', '#d8d2c4', '#3e4a56', null, { rowH: 6, step: 4, ww: 3, wh: 3, lit: 0.5 }), 'ROOF', rectPoly(-2756, -1528, -2722, -1504), 0, 14);
      mesh(new THREE.PlaneGeometry(10, 1.8), glow(new THREE.MeshLambertMaterial({ map: textTex('将棋会館', '#2a2a2a', '#f8f0d8', 128, 24) }), '#fff0d0', 0.6), -2739, 4, -1503.9, 0);
      LM_PEOPLE.push([[SX, S[3] + 4, SX, S[3] - 26], 4]);
    }
    // ===== 聖徳記念絵画館 (1926年完成。花こう岩の壁と緑のドーム) と噴水の芝生 =====
    const EX = -2358, EZ0 = -1592, EZ1 = -1562;
    {
      const GR = acGothic('GA_KAIGA', '#cdbfa8', '#4a4038', '#bcae96', { rowH: 10, step: 8, ww: 2, wh: 6, lit: 0.2 });
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(EX - 44, EZ0, EX + 44, EZ1 + 4), 0, 2);
      pushPrism(GR, 'ROOF', rectPoly(EX - 42, EZ0 + 2, EX + 42, EZ1), 2, 16);
      pushPrism(GR, 'ROOF', rectPoly(EX - 10, EZ0, EX + 10, EZ1 + 2), 2, 20);
      pushPrism(GR, 'ROOF', regularPoly(EX, (EZ0 + EZ1) / 2, 8, 12), 20, 26);
      mesh(new THREE.SphereGeometry(8.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 1.15, 1), WALL.RF_COPPER, EX, 26, (EZ0 + EZ1) / 2);
      for (let dx = -8; dx <= 8; dx += 4) bake(WHITE, new THREE.CylinderGeometry(0.6, 0.6, 12, 8).translate(EX + dx, 8, EZ1 + 3));
      stairs([EX - 8, EZ1 + 4, EX + 8, EZ1 + 9], 2, 'z+');
      // 噴水の円形の芝生
      const PZ = -1505; fe(EX, PZ, 44, 40, '#7a9a54'); PONDS.push([EX, PZ, 8, 8]); fe(EX, PZ, 8, 8, '#3d7598');
      bake(lam({ color: 0xd8e8f4, transparent: true, opacity: 0.7 }), new THREE.CylinderGeometry(0.3, 1.4, 6, 8).translate(EX, 3, PZ));
      tiles(EX - 6, EZ1 + 9, EX + 6, PZ - 40, '#cfc6b0', '#c0b6a0', 2);
      for (let k = 0; k < 40; k++) { const a = k / 40 * 6.28; GINKGO.push([EX + Math.cos(a) * 47, PZ + Math.sin(a) * 43, 1.1]); }
    }
    // ===== いちょう並木 (青山通りから絵画館へまっすぐ伸びる、4列のイチョウ並木) =====
    const IZ0 = -1462, IZ1 = -1132;
    {
      addRoads([[EX - 6, IZ0, EX + 6, IZ1, 'ns', 'いちょう並木']]);
      tiles(EX - 20, IZ0, EX - 6, IZ1, '#c8bca4', '#b8ac94', 2); tiles(EX + 6, IZ0, EX + 20, IZ1, '#c8bca4', '#b8ac94', 2);
      LM_ZONES.push(rectPoly(EX - 21, G[3], EX + 21, IZ1));
      for (let z = IZ0 + 4; z < IZ1 - 2; z += 9) for (const dx of [-18, -10, 10, 18]) GINKGO.push([EX + dx, z, 1.35]);
      LM_PEOPLE.push([[EX - 14, IZ1 - 4, EX - 14, IZ0 + 4], 20], [[EX + 14, IZ0 + 4, EX + 14, IZ1 - 4], 18]);
    }
    // ===== 明治神宮野球場 (神宮球場。1926年開場) =====
    {
      const H = [-2462, -1300], AC = -Math.PI * 0.75;   // ホームベースと、センターの向き (北西)
      const P = (a, d) => [H[0] + Math.cos(a) * d, H[1] + Math.sin(a) * d];
      const fan = [H]; for (let k = 0; k <= 12; k++) fan.push(P(AC - 0.8 + 1.6 * k / 12, 96));
      polyFr(fan, '#4e8a3a'); polyFr([H, P(AC - 0.8, 30), P(AC, 40), P(AC + 0.8, 30)], '#b88a5a');
      ringSeg(...H, 98, 98, 112, 112, 0, 9, 'CONC', 'CONC', { a0: AC - 0.85, a1: AC + 0.85, n: 14 });
      ringSeg(...H, 112, 112, 124, 124, 0, 15, 'CONC', 'CONC', { a0: AC - 0.85, a1: AC + 0.85, n: 14 });
      ringSeg(...H, 14, 14, 30, 30, 0, 8, 'CONC', 'CONC', { a0: AC + 0.85, a1: AC + Math.PI * 2 - 0.85, n: 10 });   // ネット裏・内野のスタンド
      ringSeg(...H, 30, 30, 40, 40, 0, 14, 'CONC', 'ROOF', { a0: AC + 0.85, a1: AC + Math.PI * 2 - 0.85, n: 10 });
      for (const a of [AC - 0.75, AC + 0.75]) { const [x, z] = P(a, 118); pushPrism('CONC', null, regularPoly(x, z, 0.8, 6), 15, 42, { solid: false }); bake(glow(lam({ color: 0xffffff }), '#ffffff', 1), new THREE.BoxGeometry(6, 3, 0.5).rotateY(-a).translate(x, 43, z)); }   // 照明塔
      const [bx, bz] = P(AC, 122); bake(lam({ color: 0x1e2a24 }), new THREE.BoxGeometry(24, 10, 1).rotateY(-AC - Math.PI / 2).translate(bx, 20, bz));   // スコアボード
    }
    for (let k = 0; k < 160; k++) { const x = rr(G[0] + 3, G[2] - 3), z = rr(G[1] + 3, G[3] - 3); if (Math.hypot((x - NC[0]) / 120, (z - NC[1]) / 106) < 1 || inR([-2672, -1686, -2560, -1612], x, z) || Math.abs(x - EX) < 50 && z > EZ0 - 8 || Math.hypot(x + 2462, z + 1300) < 132 || !acFree(x, z)) continue; (rnd() < 0.4 ? GINKGO : ROUND).push([x, z, rr(1, 1.4)]); }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['国立競技場 (MUFGスタジアム)', NC[0] - 110, NC[1] - 98, NC[0] + 110, NC[1] + 98], ['東京体育館', -2666, -1684, -2560, -1612], ['鳩森八幡神社 (富士塚)', -2760, -1602, -2710, -1530], ['将棋会館', -2758, -1530, -2720, -1500],
      ['聖徳記念絵画館', EX - 46, EZ0 - 4, EX + 46, EZ1 + 10], ['絵画館前の噴水', EX - 46, -1548, EX + 46, IZ0], ['いちょう並木 (神宮外苑)', EX - 21, IZ0, EX + 21, IZ1], ['明治神宮野球場 (神宮球場)', -2590, -1430, -2400, -1266], ['明治神宮外苑', ...G]);
    LM_HEIGHT_AREAS.unshift(['富士塚 (鳩森八幡神社) の頂上', (x, z, y) => y > 4.5 && Math.hypot(x + 2749, z + 1552) < 3]);
    LM_LABELS.push(['国立競技場', ...NC, '🏟', '国立競技場 (MUFGスタジアム)'], ['東京体育館', -2622, -1650, '🏸'], ['鳩森八幡', -2735, -1566, '⛩', '鳩森八幡神社 (富士塚)'], ['絵画館', EX, -1577, '🖼', '聖徳記念絵画館'],
      ['いちょう並木', EX, -1300, '🍂', 'いちょう並木 (神宮外苑)'], ['神宮球場', -2530, -1360, '⚾', '明治神宮野球場 (神宮球場)']);
    Object.assign(LM_NOTES, {
      '明治神宮外苑': '明治天皇と昭憲皇太后をしのんで、絵画館を中心に競技場や野球場が造られ、1926年に明治神宮に納められた。2026年10月で100年',
      '国立競技場 (MUFGスタジアム)': '隈研吾らの設計で2019年完成。軒に47都道府県の木材が使われている。2026年1月から5年間、呼び名が「MUFGスタジアム」になった (正式名は国立競技場のまま)',
      '東京体育館': '1990年に建て替えられた、槇文彦の設計の体育館。東京2020大会では卓球の会場になった',
      '鳩森八幡神社 (富士塚)': '富士山に登れない人のために造られた、ミニチュアの富士山「富士塚」がある神社',
      '富士塚 (鳩森八幡神社) の頂上': '小さな富士山のてっぺん。昔の人はここで富士登山の気分を味わった',
      '将棋会館': '日本将棋連盟の本部。2024年に鳩森八幡神社のとなりの新しい建物へ移った。将棋の神様として、神社には将棋堂がある',
      '聖徳記念絵画館': '1926年完成の美術館で、国の重要文化財。明治天皇の生涯を描いた80枚の巨大な壁画 (日本画40枚・洋画40枚) が並ぶ',
      'いちょう並木 (神宮外苑)': '1923年に植えられた、約300mのイチョウ並木。青山通りから絵画館が正面に見える東京を代表する景色。11月下旬〜12月上旬が黄葉の見ごろ',
      '明治神宮野球場 (神宮球場)': '1926年開場の野球場。東京ヤクルトスワローズの本拠地で、大学野球の聖地でもある',
    });
    Object.assign(LM_TIPS, {
      '聖徳記念絵画館': '外苑のイチョウ並木は、絵画館に向かって木の高さを少しずつ低くして、遠近感が強く見えるように植えられている',
      'いちょう並木 (神宮外苑)': '黄葉の時期は「神宮外苑いちょう祭り」が開かれ、とても混む',
      '国立競技場 (MUFGスタジアム)': 'イベントのない日は、スタジアムツアーで中に入れることがある (日程は公式サイトで確認)',
    });
    LM_ACH.push(['ichou', '🍂 黄金のトンネル', '黄金色のいちょう並木を歩く', () => inR([EX - 21, IZ0, EX + 21, IZ1], P.x, P.z)],
      ['fujizuka', '🗻 小さな富士登山', '鳩森八幡神社の富士塚の頂上に立つ', () => P.y > 4.5 && Math.hypot(P.x + 2749, P.z + 1552) < 3]);
    bakeFlush();
  },
});
