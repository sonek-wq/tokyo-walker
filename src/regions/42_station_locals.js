/* 駅ごとの「その駅ならでは」の名所 (隣の駅の名所に埋もれていた駅・新しく作った路線の駅)
   信濃町 (明治記念館・慶應義塾大学病院) / 亀戸 (亀戸天神社) / 錦糸町 (錦糸公園・すみだトリフォニーホール) / 小岩 (栃錦の像) /
   新小岩 (ルミエール商店街) / 越中島 (明治丸) / 南千住 (芭蕉像・素盞雄神社) / 東向島 (東武博物館) / 新馬場 (品川神社と品川富士) /
   戸越銀座 (戸越銀座商店街) / 初台 (東京オペラシティ・新国立劇場) / 椎名町 (トキワ荘マンガミュージアム) / 中井 (林芙美子記念館) /
   下落合 (おとめ山公園) / 代官山 (旧朝倉家住宅・ヒルサイドテラス) / 祐天寺 (祐天寺) / 駒場東大前 (東大駒場キャンパス・日本民藝館) /
   代々木八幡 (代々木八幡宮と竪穴住居) / 不動前 (目黒不動尊) / 武蔵小山 (パルム商店街) / 亀戸水神 (亀戸水神社) / 天王洲アイル (モノレールの駅)
   中目黒の目黒川 (桜並木) は regions/00_geography.js の川を上流へ延ばした */
REGION({
  name: '駅ごとの名所 (追加)',
  towns: [['亀戸', 2300, -2780], ['錦糸', 2110, -2700], ['南千住', 1444, -4660], ['東向島', 1930, -4250], ['北品川', -1270, 2090], ['戸越', -2369, 2300],
    ['西新宿 (初台)', -3640, -1790], ['南長崎', -3320, -4215], ['中井', -3560, -3680], ['下落合', -3175, -3620], ['猿楽町', -2950, 360], ['中目黒', -3140, 700],
    ['駒場', -3730, -250], ['代々木 (八幡)', -3615, -1135], ['下目黒', -2640, 1930], ['小山', -2600, 2000], ['新小岩', 3080, -3580], ['越中島', 1130, -960]],
  stations: ['信濃町', '亀戸', '錦糸町', '小岩', '新小岩', '越中島', '南千住', '東向島', '新馬場', '戸越銀座', '初台', '椎名町', '中井', '下落合', '代官山', '中目黒', '祐天寺',
    '駒場東大前', '代々木八幡', '不動前', '武蔵小山', '亀戸水神', '天王洲アイル'],
  labels: [],
  build(r) {
    const C = (key, o) => { if (!WALL[key]) WALL[key] = lam(o); return key; };
    const TREE_LISTS = [ROUND, PINES, MAPLES, GINKGO, SAKURA, LM_STREET, LAMPS2, BENCHES, LANTERNS, STONE_LANTERNS];
    // 敷地: 自動生成の街から外し、そこにある木や街灯をどける
    const site = (R, col) => {
      LM_ZONES.push(rectPoly(...R));
      for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); }
      if (col) fr(...R, col);
    };
    const spot = (name, R, label, icon, note, lx, lz) => {
      SPOT_AREAS.unshift([name, ...R]);
      if (label) LM_LABELS.push([label, lx ?? (R[0] + R[2]) / 2, lz ?? (R[1] + R[3]) / 2, icon, name]);
      if (note) LM_NOTES[name] = note;
    };
    const sign = (x, z, sd, text, w = 10, y = 3.2, bg = '#f4efe2', fg = '#2a2420') => frontSign(AXIS, x, z, sd, text, bg, fg, w, Math.max(1.2, w * 0.14), y, { tw: 192, th: 28 });
    const signX = (x, z, sd, text, w = 10, y = 3.2, bg = '#f4efe2', fg = '#2a2420') => sideSign(AXIS, x, z, sd, text, bg, fg, w, Math.max(1.2, w * 0.14), y, { tw: 192, th: 28 });
    const SHU = C('SL_SHU', { color: 0xc8402a }), STONE = lam({ color: 0xa8a294 }), WHITEW = C('SL_WHITE', { color: 0xeeeae0 });
    const plasterWood = (key, bg = '#efe9dc', beam = '#4a3424') => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); x.fillStyle = beam; x.fillRect(0, 0, 32, 2); x.fillRect(0, 30, 32, 2); for (let i = 0; i < 32; i += 8) x.fillRect(i, 0, 1, 32);
      for (let i = 2; i < 32; i += 8) { x.fillStyle = '#6a5a48'; x.fillRect(i, 12, 4, 10); y.fillStyle = rnd() < 0.5 ? '#ffd8a0' : '#000'; y.fillRect(i, 12, 4, 10); }
    });
    const windows = (key, bg, win, rowH = 4, step = 4) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rowH) for (let i = 1; i < 32; i += step) { x.fillStyle = win; x.fillRect(i, j, step - 1, rowH - 2); y.fillStyle = rnd() < 0.45 ? pick(LIT) : '#000'; y.fillRect(i, j, step - 1, rowH - 2); }
    });
    // 本堂・社殿 (壁 + 入母屋の屋根)
    const hall = (R, wall, y0, h, roof = 'RF2', rh = 4) => { pushPrism(wall, 'ROOF', rectPoly(...R), y0, y0 + h); jRoof(roof, ...R, y0 + h, rh, { over: 1.4, kind: 'irimoya' }); };
    // 門 (南北に通り抜けられる): 両側の柱の部屋と、上の梁と屋根
    const gate = (R, h, roof, rh) => {
      const w = (R[2] - R[0]) * 0.3;
      pushPrism(SHU, 'ROOF', rectPoly(R[0], R[1], R[0] + w, R[3]), 0, h); pushPrism(SHU, 'ROOF', rectPoly(R[2] - w, R[1], R[2], R[3]), 0, h);
      pushPrism(SHU, 'ROOF', rectPoly(R[0] + w, R[1], R[2] - w, R[3]), h - 1.6, h);
      jRoof(roof, ...R, h, rh, { over: 1.4, kind: 'irimoya' });
    };
    // 石を積んだ小さな富士山 (富士塚)。y0 の高さから、1m ずつの段で登れる
    const fujizuka = (cx, cz, R, H, y0 = 0) => {
      for (let i = 0; i < H; i++) pushPrism('ISHIGAKI', 'ISHIGAKI', regularPoly(cx, cz, R * (1 - i / (H + 0.6)), 10), y0 + i, y0 + i + 1);
      for (let k = 0; k < 16; k++) { const a = rr(0, 6.28), d = rr(1.5, R - 0.5); bake(lam({ color: 0x3a3634 }), new THREE.DodecahedronGeometry(rr(0.3, 0.6), 0).translate(cx + Math.cos(a) * d, y0 + H * (1 - d / R) + 0.2, cz + Math.sin(a) * d)); }
    };
    // 商店街: F の u の向きに長さ L の通り。両側に店。opt.roof でアーケード、opt.gates で門 (u の位置と文字)
    const AR_ROOF = C('SL_ARCROOF', { color: 0xdfe6ea, transparent: true, opacity: 0.55 });
    const street = (F, L, opt) => {
      const hw = opt.hw || 4;
      oTiles(F, 0, -hw, L, hw, opt.c1 || '#b8ab96', opt.c2 || '#a89a84', opt.ts || 1.5);
      for (const sd of [-1, 1]) for (let u = 1.5; u < L - 3;) {
        const w = rr(6, 10), d = rr(10, 14), u1 = Math.min(u + w, L - 1.5), um = (u + u1) / 2;
        const [cx, cz] = F.w(um, sd * (hw + d / 2));
        if (!(opt.skip && opt.skip(cx, cz))) {
          const h = rr(6.5, opt.roof ? 9 : 13);
          oBox(F, pick(SHOPS), u, sd < 0 ? -hw - d : hw + 0.2, u1, sd < 0 ? -hw - 0.2 : hw + d, 0, h);
          if (!opt.roof && rnd() < 0.6) { const rk = pick(['RF0', 'RF1', 'RF2']); oBox(F, rk, u + 0.3, sd < 0 ? -hw - 1.4 : hw + 0.2, u1 - 0.3, sd < 0 ? -hw - 0.2 : hw + 1.4, 2.9, 3.1, { solid: false, top: rk }); }   // ひさし
        }
        u = u1 + 0.4;
      }
      if (opt.roof) {
        for (let u = 0; u <= L; u += 8) for (const sd of [-1, 1]) oBox(F, 'CONC', u - 0.15, sd * (hw - 0.1) - 0.15, u + 0.15, sd * (hw - 0.1) + 0.15, 0, 7.5, { top: null });
        pushPrism(AR_ROOF, AR_ROOF, F.rect(0, -hw - 0.3, L, hw + 0.3), 7.5, 7.7, { solid: false });
        pushPrism('SL_ARCROOF', 'SL_ARCROOF', F.rect(0, -hw * 0.45, L, hw * 0.45), 7.7, 8.6, { solid: false });
      } else for (let u = 6; u < L - 3; u += 14) for (const sd of [-1, 1]) { const [x, z] = F.w(u + (sd > 0 ? 7 : 0), sd * (hw - 0.6)); LAMPS2.push([x, z]); }
      for (const [u, text] of opt.gates || []) {
        for (const sd of [-1, 1]) oBox(F, 'CONC', u - 0.3, sd * (hw - 0.4) - 0.3, u + 0.3, sd * (hw - 0.4) + 0.3, 0, opt.roof ? 7.5 : 6.4, { top: null });
        oBox(F, 'LM_BLACK', u - 0.25, -hw, u + 0.25, hw, opt.roof ? 8.6 : 6.4, opt.roof ? 10.2 : 7.9, { top: 'LM_BLACK', solid: false });
        for (const sd of [-1, 1]) sideSign(F, u + sd * 0.3, 0, sd, text, '#b02a20', '#fff2c0', hw * 2 - 0.6, 1.3, opt.roof ? 9.4 : 7.15, { tw: 192, th: 26, k: 0.9 });
      }
      LM_ZONES.push(F.rect(-1, -hw - 15, L + 1, hw + 15));
      const [a0, b0] = F.w(3, -hw * 0.5), [a1, b1] = F.w(L - 3, -hw * 0.5), [c0, d0] = F.w(L - 3, hw * 0.5), [c1, d1] = F.w(3, hw * 0.5);
      LM_PEOPLE.push([[a0, b0, a1, b1], Math.round(L / 22)], [[c0, d0, c1, d1], Math.round(L / 26)]);
    };

    // ===== 信濃町: 明治記念館 (憲法記念館) と 慶應義塾大学病院 (外苑の北の端、駅の目の前) =====
    {
      const MK = [-2425, -1682, -2316, -1610];
      site(MK, '#c4bca8'); tiles(MK[0], MK[1], MK[2], -1646, '#cfc8b6', '#beb6a4', 3);
      const MW = plasterWood('SL_MEIJIKIN');
      hall([-2410, -1672, -2370, -1650], MW, 0, 6.5, 'RF2', 4.5);                                 // 本館 (1881年に赤坂仮皇居の御会食所として建った建物)
      pushPrism('WOOD', 'ROOF', rectPoly(-2398, -1681, -2382, -1672), 0, 4); jRoof('RF2', -2398, -1681, -2382, -1672, 4, 2.4, { over: 1, kind: 'irimoya' });   // 車寄せ
      pushPrism(windows('SL_MEIJINEW', '#e2d8c4', '#6a5844', 5, 4), 'ROOF', rectPoly(-2362, -1678, -2322, -1648), 0, 13);   // 宴会場の新しい建物
      fr(-2420, -1644, -2321, -1614, '#6f9a4e'); fe(-2352, -1628, 15, 8, '#3d7598'); PONDS.push([-2352, -1628, 15, 8]);   // 庭園
      for (let k = 0; k < 14; k++) { const x = rr(-2418, -2324), z = rr(-1642, -1616); if (Math.hypot((x + 2352) / 17, (z + 1628) / 10) > 1) (k % 3 ? MAPLES : PINES).push([x, z, rr(0.7, 1.1)]); }
      STONE_LANTERNS.push([-2372, -1636], [-2332, -1620]); BENCHES.push([-2395, -1620, 0]);
      sign(-2390, -1681.2, -1, '明治記念館', 9, 5.6);
      LM_PEOPLE.push([[-2418, -1640, -2326, -1640], 5]);
      spot('明治記念館', MK, '明治記念館', '🏯', '1881年に赤坂の仮皇居の「御会食所」として建てられ、大日本帝国憲法の草案を話し合う会議が開かれたので「憲法記念館」とも呼ばれた建物。外苑に移されたあと、1947年から結婚式場になった');
      const KE = [-2550, -1682, -2440, -1620];
      site(KE, '#cfc8bc');
      const HW = windows('SL_KEIOHOSP', '#eef0ee', '#5a7890', 4, 4);
      pushPrism(HW, 'ROOF', rectPoly(-2542, -1676, -2490, -1632), 0, 46); pushPrism(HW, 'ROOF', rectPoly(-2484, -1668, -2448, -1640), 0, 26);
      pushPrism('glass', 'ROOF', rectPoly(-2490, -1662, -2484, -1648), 0, 9);
      sign(-2516, -1676.2, -1, '慶應義塾大学病院', 14, 6);
      LM_PEOPLE.push([[-2545, -1679, -2445, -1679], 6]);
      spot('慶應義塾大学病院', KE, '慶應病院', '🏥', '1920年に開院した大学病院。初代の病院長は、破傷風の血清療法で世界に知られた細菌学者・北里柴三郎。給料を受け取らずに務めたという');
    }

    // ===== 亀戸: 亀戸天神社 (太宰府天満宮にならった心字池と3つの橋、藤棚) =====
    {
      const KT = [2148, -2992, 2272, -2858], CX = 2210;
      site(KT, '#c6bca2');
      tiles(CX - 3, -2893, CX + 3, -2858, '#d0c6ae', '#bdb299', 1.5); tiles(CX - 3, -2955, CX + 3, -2937, '#d0c6ae', '#bdb299', 1.5);
      myojinTorii(CX, -2864, true, 8.5, 6.5, STONE, 0.5);
      sign(CX, -2860.6, 1, '亀戸天神社', 7, 2.4, '#f2ead8', '#3a2418');
      fe(CX, -2915, 54, 22, '#3d7598'); PONDS.push([CX, -2915, 54, 22]);   // 心字池
      // 男橋 (太鼓橋)・平橋・女橋 (太鼓橋)
      const RAIL = lam({ color: 0xc8402a }), DECK = lam({ color: 0x8a4a2e });
      const arch = (z0, z1, H) => {
        const n = 16, len = (z1 - z0) / n;
        for (let k = 0; k < n; k++) {
          const t0 = k / n, t1 = (k + 1) / n, y0 = H * Math.sin(Math.PI * t0) + 0.4, y1 = H * Math.sin(Math.PI * t1) + 0.4, za = z0 + len * k, zb = za + len;
          bake(DECK, new THREE.BoxGeometry(5.4, 0.3, Math.hypot(len, y1 - y0) + 0.05).rotateX(-Math.atan2(y1 - y0, len)).translate(CX, (y0 + y1) / 2 - 0.15, (za + zb) / 2));
          for (const sd of [-1, 1]) bake(RAIL, new THREE.BoxGeometry(0.18, 0.9, Math.hypot(len, y1 - y0) + 0.05).rotateX(-Math.atan2(y1 - y0, len)).translate(CX + sd * 2.6, (y0 + y1) / 2 + 0.45, (za + zb) / 2));
          solid(CX - 2.7, Math.min(za, zb), CX + 2.7, Math.max(za, zb), 0, (y0 + y1) / 2);
        }
      };
      arch(-2893, -2911, 3.2); arch(-2921, -2939, 3.2);
      pushPrism('WOOD', 'WOOD', rectPoly(CX - 2.7, -2921, CX + 2.7, -2911), 0, 0.6);
      for (const sd of [-1, 1]) bake(RAIL, new THREE.BoxGeometry(0.18, 0.9, 10).translate(CX + sd * 2.6, 1.05, -2916));
      // 社殿
      const KS = C('SL_KTSHU', { color: 0xb8402c });
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(CX - 26, -2986, CX + 26, -2958), 0, 0.8);
      hall([CX - 22, -2982, CX + 22, -2962], KS, 0.8, 5.5, 'RF_COPPER', 5);
      for (let dx = -20; dx <= 20; dx += 5) bake(lam({ color: 0x1e1a18 }), new THREE.BoxGeometry(0.5, 5.5, 0.5).translate(CX + dx, 3.55, -2961.6));
      // 藤棚 (4月下旬〜5月は紫の花房、ほかの季節は緑の葉)
      const bloom = MONTH === 4 || MONTH === 5, FUJI = lam({ color: bloom ? 0xa682d8 : 0x5f8a3a }), POST = lam({ color: 0x6a5a48 });
      for (const [x0, z0, x1, z1] of [[2158, -2902, 2198, -2890], [2222, -2902, 2262, -2890], [2158, -2942, 2198, -2930], [2222, -2942, 2262, -2930]]) {
        pushPrism(C('SL_FUJITANA', { color: 0x7a6650 }), C(bloom ? 'SL_FUJI_B' : 'SL_FUJI_G', { color: bloom ? 0xb894e4 : 0x6a9a44 }), rectPoly(x0, z0, x1, z1), 2.5, 2.75, { solid: false });
        for (let x = x0; x <= x1; x += 8) for (const z of [z0, z1]) bake(POST, new THREE.BoxGeometry(0.25, 2.5, 0.25).translate(x, 1.25, z));
        if (bloom) for (let k = 0; k < 40; k++) bake(FUJI, new THREE.BoxGeometry(0.35, rr(0.6, 1.2), 0.35).translate(rr(x0 + 0.5, x1 - 0.5), 2.0, rr(z0 + 0.5, z1 - 0.5)));
      }
      // 神牛 (なでると良いといわれる牛の像)
      const COW = lam({ color: 0x3a3430 });
      bake(COW, new THREE.BoxGeometry(2.2, 0.8, 1.1).translate(CX + 14, 1.2, -2952)); bake(COW, new THREE.BoxGeometry(0.7, 0.6, 0.7).translate(CX + 12.6, 1.5, -2952));
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(CX + 12.6, -2953, CX + 15.6, -2951), 0, 0.8);
      for (const z of [-2875, -2885, -2945]) STONE_LANTERNS.push([CX - 5, z], [CX + 5, z]);
      for (let k = 0; k < 24; k++) { const x = rr(KT[0] + 3, KT[2] - 3), z = rr(KT[1] + 3, KT[3] - 3); if (Math.hypot((x - CX) / 58, (z + 2915) / 26) > 1 && Math.abs(x - CX) > 8 && !(z < -2955)) (k % 2 ? ROUND : PINES).push([x, z, rr(0.8, 1.2)]); }
      LM_PEOPLE.push([[CX - 1.5, -2860, CX - 1.5, -2890], 5], [[CX + 1.5, -2940, CX + 1.5, -2956], 3]);
      spot('亀戸天神社', KT, '亀戸天神', '⛩', '学問の神様・菅原道真をまつる神社。九州の太宰府天満宮にならって、心字池や太鼓橋が造られ「東の宰府」とも呼ばれた。藤の名所で、歌川広重も太鼓橋と藤を描いている');
      SPOT_AREAS.unshift(['亀戸天神の太鼓橋', CX - 3, -2940, CX + 3, -2892]);
      LM_NOTES['亀戸天神の太鼓橋'] = '池にかかる3つの橋は、手前の太鼓橋 (男橋) が「過去」、平橋が「現在」、奥の太鼓橋 (女橋) が「未来」を表すといわれる';
      LM_ACH.push(['taikobashi', '🌉 過去・現在・未来', '亀戸天神社の太鼓橋のてっぺんに立つ', () => P.y > 2.8 && Math.abs(P.x - CX) < 2.7 && (Math.abs(P.z + 2902) < 2 || Math.abs(P.z + 2930) < 2)]);
    }

    // ===== 錦糸町: 錦糸公園 と すみだトリフォニーホール (駅の北口) =====
    {
      const KP = [2038, -2776, 2136, -2648];
      site(KP, '#7a9a54'); tiles(2038, -2716, 2136, -2708, '#cfc6b0', '#bdb49c', 2); tiles(2083, -2776, 2091, -2648, '#cfc6b0', '#bdb49c', 2);
      for (let k = 0; k < 30; k++) { const x = rr(KP[0] + 3, KP[2] - 3), z = rr(KP[1] + 3, KP[3] - 3); if (Math.abs(z + 2712) > 7 && Math.abs(x - 2087) > 7) (k % 3 ? ROUND : SAKURA).push([x, z, rr(0.8, 1.2)]); }
      for (let x = 2045; x < 2130; x += 18) BENCHES.push([x, -2706, 0]);
      LM_PEOPLE.push([[2042, -2712, 2132, -2712], 6], [[2087, -2772, 2087, -2652], 5]);
      spot('錦糸公園', KP, '錦糸公園', '🌳', '錦糸町駅の北口のすぐそばの公園。春は桜が咲き、スポーツの施設もあって近所の人の憩いの場になっている');
      const TP = [2142, -2702, 2194, -2648];
      site(TP, '#cfc8b8');
      pushPrism(windows('SL_TRIPHONY', '#d8d0c0', '#5a6670', 6, 4), 'ROOF', rectPoly(2146, -2698, 2190, -2664), 0, 24);
      pushPrism('glass', 'ROOF', rectPoly(2150, -2664, 2186, -2652), 0, 11);
      sign(2168, -2651.8, 1, 'すみだトリフォニーホール', 16, 8);
      spot('すみだトリフォニーホール', TP, 'トリフォニー', '🎻', '1997年開館のコンサートホール。新日本フィルハーモニー交響楽団が本拠地にしていて、区内の学校での演奏など地域の活動もしている');
    }

    // ===== 小岩: 駅の横綱・栃錦の像 / 新小岩: ルミエール商店街 =====
    {
      const [sx, sz] = [3474 + 0.894 * 17, -4538 + 0.447 * 17];
      tiles(sx - 7, sz - 7, sx + 7, sz + 7, '#cfc6b0', '#bdb49c', 1.5); LM_ZONES.push(rectPoly(sx - 7, sz - 7, sx + 7, sz + 7));
      const BR = WALL.BRONZE || lam({ color: 0x6a5a3a }), ry = Math.atan2(0.894, 0.447);
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(sx, sz, 2.0, 4, Math.PI / 4 + ry), 0, 1.2);
      const g = new THREE.Group(); g.position.set(sx, 1.2, sz); g.rotation.y = ry;
      const bx = (w, h, d, x, y, z, m = BR) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); g.add(b); };
      bx(0.5, 0.9, 0.5, -0.35, 0.45, 0); bx(0.5, 0.9, 0.5, 0.35, 0.45, 0);                                  // 脚
      bx(1.35, 0.5, 0.85, 0, 1.05, 0, lam({ color: 0x3a3028 }));                                                 // まわし
      bx(1.3, 1.1, 0.95, 0, 1.75, 0.05); bx(0.5, 0.5, 0.5, 0, 2.55, 0); bx(0.22, 0.2, 0.36, 0, 2.86, -0.05);  // 胴・頭・まげ
      bx(0.32, 0.95, 0.32, -0.82, 1.65, 0.1); bx(0.32, 0.95, 0.32, 0.82, 1.65, 0.1);                         // 腕
      g.scale.setScalar(1.15); chunkAt(sx, sz).group.add(g); solid(sx - 1.4, sz - 1.4, sx + 1.4, sz + 1.4, 1.2, 4.6);
      spot('栃錦の像 (小岩駅)', [sx - 7, sz - 7, sx + 7, sz + 7], '栃錦の像', '🗿', '小岩出身の第44代横綱・栃錦の像。初代若乃花とともに「栃若時代」を築いた名横綱で、待ち合わせの目印になっている');
      // 新小岩 ルミエール商店街 (南口から南へ約420mのアーケード)
      const F = frame(3077, -3682, 0, 1, -1, 0);
      street(F, 205, { hw: 4, roof: true, gates: [[1.5, '新小岩ルミエール'], [203, '新小岩ルミエール']] });
      const LR = [3060, -3684, 3094, -3476];
      spot('新小岩ルミエール商店街', LR, 'ルミエール', '🛍', '1958年にアーケードができた、葛飾区で最初のアーケード商店街。約420mの通りに140ほどの店が並ぶ');
    }

    // ===== 越中島: 明治丸 (東京海洋大学 越中島キャンパス) =====
    {
      const ME = [1072, -998, 1188, -922];
      site(ME, '#7a9a54'); tiles(1072, -936, 1188, -922, '#cfc6b0', '#bdb49c', 2);
      // 船体 (長さ約68m)。舳先は東
      const HULL = C('SL_MJHULL', { color: 0x1e1e22 }), DK = C('SL_MJDECK', { color: 0xb89870 });
      const hullP = [[1091, -959.5], [1150, -959.5], [1159, -955], [1150, -950.5], [1091, -950.5], [1089, -953], [1089, -957]];
      pushPrism('TKSTONE', null, rectPoly(1094, -958, 1148, -952), 0, 1.4);   // 船台
      pushPrism(HULL, DK, hullP, 1.4, 7.2);
      pushPrism(C('SL_MJBAND', { color: 0xd8b860 }), null, hullP.map(p => [1125 + (p[0] - 1125) * 1.006, -955 + (p[1] + 955) * 1.07]), 6.2, 6.6, { solid: false });   // 舷側の金色の線
      pushPrism(C('SL_MJWHITE', { color: 0xf0ece2 }), DK, rectPoly(1110, -956.5, 1128, -953.5), 7.2, 9.4);   // 甲板の上の部屋
      const MAST = lam({ color: 0xc8a878 }), ROPE = lam({ color: 0x3a3028 });
      for (const [mx, mh] of [[1100, 24], [1120, 27], [1140, 24]]) {
        bake(MAST, new THREE.CylinderGeometry(0.28, 0.4, mh, 8).translate(mx, 7.2 + mh / 2, -955));
        for (const yy of [0.45, 0.68, 0.88]) bake(MAST, new THREE.BoxGeometry(0.25, 0.25, 14 - yy * 6).translate(mx, 7.2 + mh * yy, -955));
        for (const sd of [-1, 1]) bake(ROPE, new THREE.BoxGeometry(0.06, mh * 0.9, 0.06).rotateX(sd * 0.28).translate(mx - 1.5, 7.2 + mh * 0.45, -955 + sd * 2.6));
      }
      bake(lam({ color: 0xd8c08a }), new THREE.CylinderGeometry(0.9, 0.9, 6, 10).translate(1128, 12.4, -955));   // 煙突 (帆も使う蒸気船)
      bake(MAST, new THREE.CylinderGeometry(0.2, 0.25, 16, 6).rotateZ(-1.15).translate(1162, 9.5, -955));        // 船首の斜めの帆柱
      const UNIV = windows('SL_KAIYODAI', '#e2dccc', '#5a5248', 5, 4);
      pushPrism(UNIV, 'ROOF', rectPoly(1140, -996, 1186, -972), 0, 14);
      sign(1163, -971.8, 1, '東京海洋大学', 9, 4);
      LM_PEOPLE.push([[1076, -930, 1184, -930], 5]);
      spot('明治丸', [1086, -962, 1164, -948], '明治丸', '⛵', '1874年にイギリスで造られた灯台巡視船で、日本に残るただ一隻の鉄の船。船として初めて国の重要文化財になった。明治天皇が乗って横浜に着いた7月20日が、もとの「海の日」');
      spot('東京海洋大学 越中島キャンパス', ME, null);
      LM_HEIGHT_AREAS.unshift(['明治丸の甲板', (x, z, y) => y > 6.5 && y < 10 && inPoly(hullP, x, z)]);
    }

    // ===== 南千住: 駅前の芭蕉像 と 素盞雄神社 =====
    {
      const bx = 1444, bz = -4590;
      tiles(bx - 6, bz - 5, bx + 6, bz + 5, '#cfc6b0', '#bdb49c', 1.5); LM_ZONES.push(rectPoly(bx - 6, bz - 5, bx + 6, bz + 5));
      const BR = WALL.BRONZE || lam({ color: 0x6a5a3a });
      acStatue(bx, bz, 0, 1.05, 0, BR, 'stand');
      bake(BR, new THREE.ConeGeometry(0.55, 0.3, 10).translate(bx, 1.4 + 1.05 * 2.0, bz));   // 笠
      spot('松尾芭蕉の像 (南千住駅前)', [bx - 6, bz - 5, bx + 6, bz + 5], '芭蕉像', '🗿', '1689年、松尾芭蕉は深川から舟で隅田川をさかのぼり、千住から「おくのほそ道」の旅に出た。旅の最初の句「行く春や鳥啼魚の目は泪」をよんだ地として像が立つ');
      const SS = [1368, -4812, 1440, -4740];
      LM_ZONES.push(rectPoly(...SS));
      shrine(SS, '素盞雄神社', 2);
      bake(lam({ color: 0x6a6660 }), new THREE.DodecahedronGeometry(1.6, 0).scale(1.3, 0.8, 1).translate(1388, 0.9, -4790));   // 瑞光石
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(1420, -4760, 1423, -4758.6), 0, 2.2);   // 芭蕉の句碑
      LM_LABELS.push(['素盞雄神社', 1404, -4776, '⛩', '素盞雄神社']);
      LM_NOTES['素盞雄神社'] = '南千住の総鎮守。神様が降りたと伝わる石「瑞光石」をまつったのが始まりといわれる。境内に芭蕉の「矢立初め」の句碑がある';
    }

    // ===== 東向島: 東武博物館 (高架のとなり。外に蒸気機関車) =====
    {
      const TM = [1898, -4300, 1944, -4185];
      site(TM, '#bdb6a8');
      pushPrism(windows('SL_TOBUMU', '#e8e4da', '#3a5a8a', 6, 6), 'ROOF', rectPoly(1904, -4290, 1940, -4220), 0, 9);
      pushPrism('glass', 'ROOF', rectPoly(1916, -4220, 1932, -4212), 0, 6);
      signX(1940.2, -4255, 1, '東武博物館', 12, 6);
      steamLoco(1921, -4198);
      const RED = lam({ color: 0x8a3a2a });
      pushPrism(C('SL_DEHA', { color: 0x7a3a2a }), 'ROOF', rectPoly(1902, -4300, 1918, -4294), 0.6, 4.2);   // 古い電車
      LM_PEOPLE.push([[1900, -4207, 1942, -4207], 4]);
      spot('東武博物館', TM, '東武博物館', '🚂', '1989年、東武鉄道の創立90周年を記念して開館した博物館。1899年の開業のころに走っていたイギリス製の蒸気機関車や、東武で最初の電車などの実物が並ぶ');
    }

    // ===== 新馬場: 品川神社 (高台の上の社殿と、東京でいちばん高い富士塚「品川富士」) =====
    {
      const SJ = [-1312, 2040, -1218, 2140], TY = 6;
      site(SJ, '#b8b09a');
      pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(-1306, 2046, -1224, 2106), 0, TY);   // 高台
      tiles(-1306, 2046, -1224, 2106, '#c8bea4', '#b8ae94', 2); fr(-1270, 2046, -1260, 2106, '#cfc6ae');
      stairs([-1270, 2106, -1260, 2128], TY, 'z-');
      myojinTorii(-1265, 2132, true, 6.5, 6, STONE, 0.4);   // 双龍鳥居 (柱に龍の飾り)
      hall([-1286, 2052, -1244, 2070], SHU, TY, 5, 'RF_COPPER', 4.5);
      fujizuka(-1294, 2090, 10, 8, TY);
      for (let k = 0; k < 16; k++) { const x = rr(-1304, -1226), z = rr(2048, 2104); if (Math.hypot(x + 1294, z - 2090) > 11 && !inR([-1290, 2050, -1240, 2074], x, z) && Math.abs(x + 1265) > 6) ROUND.push([x, z, rr(0.8, 1.1), TY]); }
      STONE_LANTERNS.push([-1272, 2134], [-1258, 2134]);
      LM_PEOPLE.push([[-1265, 2100, -1265, 2076, TY], 3]);
      spot('品川神社', SJ, '品川神社', '⛩', '1187年に源頼朝が海上交通の安全を願って建てたと伝わる神社。入口の石の鳥居には龍の飾りがあり「双龍鳥居」と呼ばれる');
      LM_HEIGHT_AREAS.unshift(['品川富士の頂上', (x, z, y) => y > TY + 7 && Math.hypot(x + 1294, z - 2090) < 3], ['品川神社 (高台)', (x, z, y) => y > TY - 1 && inR(SJ, x, z)]);
      LM_NOTES['品川富士の頂上'] = '明治時代に築かれた富士塚で、本物の富士山の溶岩も使われている。都内の富士塚の中でも特に高く、昔はここから富士山が見えた';
      LM_ACH.push(['shinagawafuji', '🗻 品川富士 登頂', '品川神社の富士塚「品川富士」の頂上に立つ', () => P.y > TY + 7 && Math.hypot(P.x + 1294, P.z - 2090) < 3]);
    }

    // ===== 戸越銀座: 戸越銀座商店街 (東西に約1.3km。池上線の踏切が真ん中を横切る) =====
    {
      const F = frame(-2700, 2236, 1, 0, 0, 1), A = [-2280, 2210], B = [-2371, 2266];
      const nearTrack = (x, z) => { const dx = B[0] - A[0], dz = B[1] - A[1], t = ((x - A[0]) * dx + (z - A[1]) * dz) / (dx * dx + dz * dz); return Math.hypot(x - A[0] - dx * t, z - A[1] - dz * t) < 13; };
      street(F, 650, { hw: 4, c1: '#d8d0c0', c2: '#b8705a', ts: 2, skip: nearTrack, gates: [[2, '戸越銀座'], [356, '戸越銀座'], [400, '戸越銀座'], [648, '戸越銀座']] });
      spot('戸越銀座商店街', [-2700, 2220, -2050, 2252], '戸越銀座商店街', '🛍', '全長約1.3kmの東京屈指の長い商店街。関東大震災のあと、銀座の通りのレンガを譲り受けて水はけの悪い道に敷いたことから「戸越銀座」と名づけられ、全国の「○○銀座」の元祖ともいわれる', -2470, 2236);
    }

    // ===== 初台: 東京オペラシティ (高さ234m) と 新国立劇場 =====
    {
      const OC = [-3716, -1810, -3570, -1750];
      site(OC, '#c8c2b6'); tiles(-3646, -1810, -3640, -1750, '#d4ccbc', '#c2baaa', 2);
      const OT = windows('SL_OPERATOWER', '#a8a49c', '#2e3440', 4, 3);
      pushPrism('glass', 'ROOF', rectPoly(-3640, -1806, -3574, -1754), 0, 14);
      pushPrism(OT, 'ROOF', rectPoly(-3628, -1798, -3586, -1760), 14, 214);
      pushPrism(OT, 'ROOF', rectPoly(-3622, -1792, -3592, -1766), 214, 228); pushPrism('CONC', 'ROOF', rectPoly(-3614, -1784, -3600, -1774), 228, 234);
      const NT = windows('SL_NNTT', '#bcb4a6', '#3a3a40', 8, 8);
      pushPrism(NT, 'ROOF', rectPoly(-3712, -1806, -3648, -1756), 0, 20); pushPrism(NT, 'ROOF', rectPoly(-3694, -1796, -3666, -1770), 20, 40);
      sign(-3607, -1753.8, 1, '東京オペラシティ', 14, 7); sign(-3680, -1755.8, 1, '新国立劇場', 11, 6);
      LM_PEOPLE.push([[-3710, -1752, -3574, -1752], 7]);
      spot('東京オペラシティ', [-3642, -1810, -3570, -1750], 'オペラシティ', '🎼', '1996年完成、高さ234mの超高層ビル。コンサートホールや美術館が入っていて、となりの新国立劇場とあわせて「東京オペラシティ」と呼ぶ');
      spot('新国立劇場', [-3716, -1810, -3644, -1750], '新国立劇場', '🎭', '1997年に開場した、オペラ・バレエ・ダンス・演劇のための国の劇場。京王新線の初台駅と地下でつながっている');
      LM_HEIGHT_AREAS.unshift(['東京オペラシティ (屋上)', (x, z, y) => y > 200 && inR([-3630, -1800, -3584, -1758], x, z)]);
    }

    // ===== 椎名町: トキワ荘マンガミュージアム (南長崎花咲公園) =====
    {
      const TK = [-3344, -4240, -3290, -4192];
      site(TK, '#7a9a54'); tiles(-3330, -4212, -3300, -4192, '#cfc6b0', '#bdb49c', 1.5);
      const TW = LM_MAT('SL_TOKIWA', (x, y) => { x.fillStyle = '#d8c8a8'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#b8a888'; for (let j = 0; j < 32; j += 3) x.fillRect(0, j, 32, 1);
        for (const wx of [3, 19]) for (const wy of [4, 20]) { x.fillStyle = '#4a4038'; x.fillRect(wx, wy, 9, 7); y.fillStyle = rnd() < 0.6 ? '#ffd8a0' : '#000'; y.fillRect(wx, wy, 9, 7); } });
      gableBuilding([-3330, -4228, -3302, -4214], 6.4, 2.4, TW, 'RF1');
      sign(-3316, -4213.8, 1, 'トキワ荘マンガミュージアム', 11, 4.6, '#f4ecd8', '#3a2a1a');
      for (let k = 0; k < 14; k++) { const x = rr(TK[0] + 2, TK[2] - 2), z = rr(TK[1] + 2, TK[3] - 2); if (!inR([-3334, -4232, -3298, -4192], x, z)) (k % 2 ? SAKURA : ROUND).push([x, z, rr(0.7, 1)]); }
      BENCHES.push([-3296, -4200, 0]);
      LM_PEOPLE.push([[-3328, -4200, -3302, -4200], 3]);
      spot('トキワ荘マンガミュージアム', TK, 'トキワ荘', '📚', '手塚治虫、藤子不二雄の2人、石ノ森章太郎、赤塚不二夫らが若いころに暮らした木造アパート「トキワ荘」を、2020年に再現したミュージアム。階段がきしむ音まで再現されている');
    }

    // ===== 中井: 林芙美子記念館 / 下落合: おとめ山公園 =====
    {
      const HF = [-3580, -3708, -3526, -3660];
      site(HF, '#8a9a6a');
      const HW = plasterWood('SL_HAYASHI', '#e8dcc4', '#5a4030');
      hall([-3570, -3700, -3548, -3684], HW, 0, 3.4, 'RF2', 3); hall([-3552, -3694, -3536, -3678], HW, 0, 3.4, 'RF2', 3);
      const BAMBOO = lam({ color: 0x6a9a3a });
      for (let k = 0; k < 26; k++) { const x = rr(-3578, -3528), z = rr(-3706, -3700); bake(BAMBOO, new THREE.CylinderGeometry(0.12, 0.15, rr(6, 9), 5).translate(x, 3.8, z)); }
      for (let k = 0; k < 8; k++) MAPLES.push([rr(-3576, -3530), rr(-3676, -3663), rr(0.7, 1)]);
      sign(-3553, -3661.2, 1, '林芙美子記念館', 8, 2.6);
      spot('林芙美子記念館', HF, '林芙美子記念館', '🏠', '『放浪記』の作家・林芙美子が1941年から亡くなるまで暮らした家。建坪の制限があった時代で、自分の名前の住まいと画家の夫の名前のアトリエを別々に建て、あとでつなげた');
      const OT = [-3212, -3652, -3138, -3588];
      site(OT, '#5f8a44');
      fe(-3172, -3615, 10, 6, '#3d7598'); PONDS.push([-3172, -3615, 10, 6]);
      for (let k = 0; k < 46; k++) { const x = rr(OT[0] + 2, OT[2] - 2), z = rr(OT[1] + 2, OT[3] - 2); if (Math.hypot((x + 3172) / 13, (z + 3615) / 9) > 1) (k % 4 ? ROUND : MAPLES).push([x, z, rr(0.9, 1.4)]); }
      pushPrism('WOOD', 'WOOD', rectPoly(-3186, -3606, -3160, -3603), 0, 0.5);   // 木道
      LM_PEOPLE.push([[-3205, -3600, -3145, -3600], 3]);
      spot('おとめ山公園', OT, 'おとめ山公園', '🌳', '江戸時代は将軍家の狩り場で、人が入れない「御留山 (おとめやま)」と呼ばれた森。今も湧き水が出ていて、夏にはホタルを育てる取り組みもある');
    }

    // ===== 代官山: 旧朝倉家住宅 と ヒルサイドテラス =====
    {
      const AS = [-2968, 322, -2912, 374];
      site(AS, '#7a9a54'); tiles(-2968, 322, -2912, 332, '#cfc6b0', '#bdb49c', 1.5);
      const AW = plasterWood('SL_ASAKURA', '#d8c8a8', '#4a3424');
      hall([-2958, 336, -2930, 354], AW, 0, 6.6, 'RF2', 3.4);
      pushPrism(AW, 'ROOF', rectPoly(-2930, 340, -2920, 352), 0, 3.6); jRoof('RF2', -2930, 340, -2920, 352, 3.6, 2, { over: 1, kind: 'hip' });
      for (let k = 0; k < 12; k++) MAPLES.push([rr(-2964, -2916), rr(358, 371), rr(0.7, 1)]);
      STONE_LANTERNS.push([-2950, 366], [-2924, 362]);
      sign(-2944, 322.8, -1, '旧朝倉家住宅', 8, 2.6);
      spot('旧朝倉家住宅', AS, '旧朝倉家住宅', '🏯', '1919年に建てられた大きな木造の家で、国の重要文化財。関東大震災も戦争の空襲も奇跡的にくぐり抜けた。崖の地形をいかした回遊式の庭がある');
      const HT = [-3004, 376, -2960, 456];
      site(HT, '#d2ccc0');
      const HW = windows('SL_HILLSIDE', '#f0eee8', '#6a7a86', 6, 5);
      for (const [z0, z1, h] of [[380, 400, 9], [404, 424, 7], [428, 452, 10]]) pushPrism(HW, 'ROOF', rectPoly(-2998, z0, -2966, z1), 0, h);
      signX(-2965.8, 390, 1, 'HILLSIDE TERRACE', 10, 4.2, '#f4f2ec', '#3a4048');
      LM_PEOPLE.push([[-2962, 380, -2962, 452], 4]);
      spot('代官山ヒルサイドテラス', HT, 'ヒルサイドテラス', '🏢', '建築家・槇文彦らが1967年から約25年かけて少しずつ建てた、店・オフィス・住まいの複合施設。代官山の街の雰囲気をつくった建物として知られる');
    }

    // ===== 中目黒: 目黒川の桜並木 (川は regions/00_geography.js で上流へ延ばした) =====
    {
      SPOT_AREAS.unshift(['目黒川の桜並木 (中目黒)', -3240, 600, -3060, 800]);
      LM_LABELS.push(['目黒川の桜', -3150, 720, '🌸', '目黒川の桜並木 (中目黒)']);
      LM_NOTES['目黒川の桜並木 (中目黒)'] = '目黒川の両岸には約800本のソメイヨシノが並び、春は川の上に花のトンネルができる。夜は提灯がともり、花見の人でにぎわう';
      const RV = [[-3300, 540], [-3200, 660], [-3120, 760], [-3000, 880]];   // 川の中心線 (00_geography.js と同じ)
      for (let i = 0; i < RV.length - 1; i++) { const [ax, az] = RV[i], [bx, bz] = RV[i + 1], L = Math.hypot(bx - ax, bz - az), nx = -(bz - az) / L, nz = (bx - ax) / L;
        for (let d = 4; d < L; d += 11) for (const sd of [-1, 1]) LANTERNS.push([ax + (bx - ax) * d / L + nx * sd * 6.5, az + (bz - az) * d / L + nz * sd * 6.5]); }
    }

    // ===== 祐天寺: 祐天寺 (増上寺の高僧・祐天上人をしのんで建てられた浄土宗の寺) =====
    {
      const YT = [-3412, 1032, -3332, 1112];
      site(YT, '#c8bea6'); tiles(-3376, 1032, -3368, 1062, '#d4cab2', '#c2b8a0', 1.5);
      gate([-3382, 1034, -3362, 1042], 6, 'RF2', 3.6);   // 仁王門
      hall([-3398, 1064, -3346, 1090], 'WOOD', 0.8, 6.5, 'RF2', 7);   // 本堂
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-3400, 1062, -3344, 1092), 0, 0.8);
      hall([-3346, 1096, -3334, 1108], 'WOOD', 0, 3.4, 'RF2', 2.6);   // 地蔵堂
      for (let k = 0; k < 16; k++) { const x = rr(YT[0] + 2, YT[2] - 2), z = rr(YT[1] + 2, YT[3] - 2); if (!inR([-3402, 1032, -3330, 1094], x, z) || Math.abs(x + 3372) > 30) (k % 3 ? ROUND : SAKURA).push([x, z, rr(0.8, 1.2)]); }
      STONE_LANTERNS.push([-3378, 1052], [-3366, 1052]);
      LM_PEOPLE.push([[-3372, 1036, -3372, 1060], 3]);
      spot('祐天寺', YT, '祐天寺', '🛕', '1718年、芝・増上寺の高僧だった祐天上人の遺言を受けて弟子が開いた寺。駅名も町名もこの寺から生まれ、目黒区には「祐天寺」という住所まである');
    }

    // ===== 駒場東大前: 東京大学 駒場キャンパス (時計台の1号館) と 日本民藝館 =====
    {
      const KB = [-3780, -268, -3700, -214];
      site(KB, '#b8b2a2'); tiles(-3745, -230, -3735, -214, '#cfc6b0', '#bdb49c', 1.5);
      const KW = acGothic('SL_KOMABA', '#d8c8a8', '#4a4038', '#c0b090', { rowH: 8, step: 4, ww: 2, wh: 5, lit: 0.4 });
      pushPrism(KW, 'ROOF', rectPoly(-3776, -264, -3704, -244), 0, 14);
      pushPrism(KW, 'ROOF', rectPoly(-3746, -250, -3734, -238), 0, 26);
      for (const sd of [-1, 1]) { const m = mesh(new THREE.CircleGeometry(2.2, 16), lam({ color: 0xf0ece2, emissive: 0x202018 }), -3740, 21, sd > 0 ? -237.9 : -250.1); if (sd < 0) m.rotation.y = Math.PI; }
      for (let k = 0; k < 10; k++) GINKGO.push([rr(-3776, -3704), rr(-240, -218), rr(1, 1.3)]);
      sign(-3740, -237.8, 1, '東京大学 駒場キャンパス', 12, 5);
      LM_PEOPLE.push([[-3740, -216, -3740, -236], 3], [[-3776, -230, -3704, -230], 4]);
      spot('東京大学 駒場キャンパス', KB, '東大 駒場', '🎓', '東大の1・2年生 (教養学部) が通うキャンパス。時計台のある1号館は、旧制第一高等学校の校舎として建てられた建物');
      const MG = [-3702, -304, -3656, -268];
      site(MG, '#c6bea8');
      const MW = plasterWood('SL_MINGEI', '#f0ece2', '#3a2a20');
      hall([-3696, -298, -3664, -280], MW, 0, 7, 'SLATE', 3.2);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-3702, -270, -3656, -268.6), 0, 1.6);   // 石塀
      sign(-3680, -279.8, 1, '日本民藝館', 8, 3.2);
      spot('日本民藝館', MG, '日本民藝館', '🏺', '名もない職人が作った日用品の美しさを「民藝」と名づけた思想家・柳宗悦が、1936年に開いた美術館。建物も柳が細かいところまで設計した');
    }

    // ===== 代々木八幡: 代々木八幡宮 と 縄文時代の竪穴住居 =====
    {
      const YH = [-3656, -1170, -3584, -1104];
      site(YH, '#9aa27a'); tiles(-3624, -1140, -3616, -1104, '#cfc6b0', '#bdb49c', 1.5);
      myojinTorii(-3620, -1108, true, 6, 5, STONE, 0.38);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-3636, -1166, -3604, -1144), 0, 0.8);
      hall([-3632, -1164, -3608, -1148], 'WOOD', 0.8, 4.2, 'RF_COPPER', 3.6);
      const THATCH = lam({ color: 0x8a7048 });
      bake(THATCH, new THREE.ConeGeometry(4.2, 4.6, 9).translate(-3596, 2.3, -1150)); bake(lam({ color: 0x6a5838 }), new THREE.CylinderGeometry(4.4, 4.4, 0.5, 12).translate(-3596, 0.25, -1150));
      solid(-3599, -1153, -3593, -1147, 0, 3.2);
      for (let k = 0; k < 26; k++) { const x = rr(YH[0] + 2, YH[2] - 2), z = rr(YH[1] + 2, YH[3] - 2); if (Math.abs(x + 3620) > 6 && !inR([-3638, -1168, -3588, -1140], x, z)) ROUND.push([x, z, rr(0.9, 1.3)]); }
      spot('代々木八幡宮', YH, '代々木八幡', '⛩', '1212年の創建と伝わる神社。境内から縄文時代の住居の跡が見つかり、竪穴住居が復元されている。こんもりした森の中に、4500年前の暮らしの跡がある');
      SPOT_AREAS.unshift(['竪穴住居 (代々木八幡遺跡)', -3602, -1156, -3590, -1144]);
      LM_NOTES['竪穴住居 (代々木八幡遺跡)'] = '出てきた土器から、約4500年前 (縄文時代中期) の住居の跡とわかった。当時は丘のすぐ下まで沼が広がっていたらしい';
    }

    // ===== 不動前: 目黒不動尊 (瀧泉寺。台地の上の本堂と、湧き水の独鈷の滝) =====
    {
      const MF = [-2694, 1842, -2592, 1938], TY = 5;
      site(MF, '#c6bca2');
      pushPrism('ISHIGAKI', 'TKSTONE', rectPoly(-2688, 1846, -2598, 1878), 0, TY);   // 台地
      stairs([-2648, 1878, -2638, 1894], TY, 'z-');
      hall([-2670, 1850, -2616, 1872], SHU, TY, 6, 'RF_COPPER', 6);   // 大本堂
      gate([-2654, 1922, -2632, 1932], 6.5, 'RF_COPPER', 3.8);   // 仁王門
      tiles(-2647, 1894, -2639, 1922, '#d4cab2', '#c2b8a0', 1.5);
      for (const dx of [-7, 7]) { const g = acStatue(-2643 + dx * 1.05, 1926, 0, 1.25, Math.PI, lam({ color: 0x8a3a2a }), 'reach', null); }
      // 独鈷の滝 (石の口から落ちる湧き水) と 水かけ不動
      fe(-2676, 1888, 5, 3, '#3d7598'); PONDS.push([-2676, 1888, 5, 3]);
      const W = lam({ color: 0xcfe6f4, transparent: true, opacity: 0.75, emissive: 0x2a4050 });
      bake(W, new THREE.BoxGeometry(0.9, TY - 0.4, 0.2).translate(-2676, (TY - 0.4) / 2 + 0.2, 1918.2));
      acStatue(-2668, 1890, 0, 0.9, Math.PI, lam({ color: 0x3e4a44 }), 'stand', { w: 1.2, h: 0.8, mat: 'ISHIGAKI' });
      for (let k = 0; k < 22; k++) { const x = rr(MF[0] + 2, MF[2] - 2), z = rr(MF[1] + 2, MF[3] - 2); if (Math.abs(x + 2643) > 8 && !inR([-2690, 1844, -2596, 1880], x, z) && Math.hypot(x + 2676, z - 1888) > 7) (k % 3 ? ROUND : PINES).push([x, z, rr(0.9, 1.3)]); }
      for (let k = 0; k < 8; k++) PINES.push([rr(-2686, -2600), rr(1873, 1877), 1, TY]);
      LM_PEOPLE.push([[-2643, 1936, -2643, 1896], 3], [[-2662, 1875, -2622, 1875, TY], 3]);
      spot('目黒不動尊 (瀧泉寺)', MF, '目黒不動尊', '🛕', '808年の創建と伝わる、関東でいちばん古い不動霊場。江戸を守る「五色不動」の筆頭で、徳川家光が深く信じた。「目黒」という地名はこの寺から来たという説もある');
      SPOT_AREAS.unshift(['独鈷の滝', -2682, 1878, -2664, 1894]);
      LM_NOTES['独鈷の滝'] = 'お寺を開いた慈覚大師が、仏具の独鈷を投げたところから水が湧き出したと伝わる滝。前の「水かけ不動」に水をかけてお参りする';
      LM_HEIGHT_AREAS.unshift(['目黒不動尊 大本堂の前', (x, z, y) => y > TY - 1 && inR([-2690, 1844, -2596, 1880], x, z)]);
      SPOT_AREAS.unshift(['青木昆陽の墓 (甘藷先生)', -2604, 1846, -2598, 1852]);
      LM_NOTES['青木昆陽の墓 (甘藷先生)'] = 'サツマイモの栽培を広めて「甘藷先生」と呼ばれた学者・青木昆陽のお墓が、目黒不動尊の裏手にある';
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-2602.5, 1887.5, -2600, 1850), TY, TY + 1.6);
    }

    // ===== 武蔵小山: 武蔵小山商店街パルム (東京一長い約800mのアーケード) =====
    {
      const F = frame(-2736, 2000, 1, 0, 0, 1);
      street(F, 298, { hw: 4.5, roof: true, gates: [[1.5, 'PALM 武蔵小山'], [296.5, 'PALM 武蔵小山']] });
      spot('武蔵小山商店街パルム', [-2738, 1984, -2438, 2016], 'パルム', '🛍', '全長約800m、約250の店が並ぶ東京でいちばん長いアーケード商店街。最初のアーケードができた1956年ごろは「東洋一」の長さといわれた', -2600, 2000);
    }

    // ===== 亀戸水神: 亀戸水神社 (水害から村を守る水の神様) =====
    {
      const S = [2492, -2936, 2524, -2896];
      LM_ZONES.push(rectPoly(...S));
      shrine(S, '亀戸水神社', 1);
      LM_LABELS.push(['亀戸水神社', 2508, -2916, '⛩', '亀戸水神社']);
      LM_NOTES['亀戸水神社'] = '室町時代の創建とされ、亀戸天神より古い神社。低くて水害の多い土地だったので、水の神様がまつられた。名前が似ているので、亀戸天神と間違えて降りる人もいるという';
    }

    // ===== 天王洲アイル: 東京モノレールの駅 (京浜運河の上) と、岸へ渡る歩道橋 =====
    {
      const TN = [-507, 1830, -473, 1900];
      const st2 = new THREE.Mesh(boxGeo(TN[2] - TN[0], 7.6, TN[3] - TN[1]), MATS.station); st2.position.set(-490, 11.8, 1865); scene.add(st2);
      solid(...TN, 8, 15.6);
      for (let z = 1834; z < 1900; z += 21) for (const x of [TN[0] + 1, TN[2] - 1]) { box(1, 11, 1, concrete, x, 2.5, z); solid(x - 0.5, z - 0.5, x + 0.5, z + 0.5, -3, 8); }
      pushPrism('CONC', 'CONC', rectPoly(-628, 1858, -507, 1866), 7.4, 8);   // 岸から駅への歩道橋
      for (const sd of [-1, 1]) pushPrism('CONC', null, rectPoly(-628, 1862 + sd * 4 - 0.15, -507, 1862 + sd * 4 + 0.15), 8, 9.1, { solid: true });
      for (let x = -620; x < -510; x += 18) { box(0.8, 11, 0.8, concrete, x, 2, 1862); solid(x - 0.4, 1861.6, x + 0.4, 1862.4, -3, 7.4); }
      stairs([-656, 1858, -628, 1866], 8, 'x+');
      sign(-490, 1829.8, -1, '天王洲アイル', 12, 13.4, '#f4f6f8', '#1e4a8a');
      spot('東京モノレール 天王洲アイル駅', [-660, 1826, -470, 1904], '天王洲アイル', '🚝', '1992年に開業した東京モノレールの駅。運河に囲まれた倉庫街だったところが、再開発でオフィスやレストランの並ぶ街になった。地下にはりんかい線の駅がある', -490, 1865);
      LM_HEIGHT_AREAS.unshift(['天王洲アイル駅への歩道橋', (x, z, y) => y > 6 && y < 10 && inR([-630, 1857, -505, 1867], x, z)]);
    }
    bakeFlush();
  },
});
