/* 早稲田大学 早稲田キャンパス (大隈講堂・大隈重信像・演劇博物館・村上春樹ライブラリー・會津八一記念博物館・大隈記念タワー・大隈庭園)
   正門を出た先に、少し軸をずらして大隈講堂が建つ。キャンパスの中央に大隈重信像、北西に演劇博物館と国際文学館 */
REGION({
  name: '早稲田',
  towns: [['早稲田', -2150, -3290], ['西早稲田', -2250, -3380], ['早稲田鶴巻町', -1960, -3330], ['馬場下', -2150, -3170]],
  labels: [],
  build(r) {
    const W = [-2235, -3365, -2078, -3218];   // キャンパス
    const BRK = acGothic('WS_BRK', '#8e6a56', '#2a2a30', '#a88a74', { brick: '#7e5a48', rowH: 7, step: 4, ww: 2, wh: 4 });
    const MOD = acGothic('WS_MOD', '#bcb6aa', '#3e4a56', null, { rowH: 6, step: 3, ww: 2, wh: 3, lit: 0.55 });
    const OK = acGothic('WS_OKUMA', '#b8a48c', '#2e2a30', '#d0c0a8', { rowH: 10, step: 5, ww: 3, wh: 7, lit: 0.35 });
    const BR = WALL.BRONZE, DARK = lam({ color: 0x24201e });
    acRoad([-2245, -3213, -1960, -3201], 'ew', '南門通り'); acRoad([-2078, -3375, -2066, -3213], 'ns', '早大正門の通り', { walk: 3, trees: false });
    LM_ZONES.push(rectPoly(...W), rectPoly(-2063, -3375, -1965, -3216)); fr(...W, '#a8a294'); fr(-2063, -3375, -1965, -3216, '#a8a294');

    // ===== 大隈記念講堂 (1927年完成。時計塔は高さ約38m = 125尺) =====
    const KX = -2058, KZ = -3268;   // 講堂の正面 (西) の中央
    {
      tiles(-2066, KZ - 32, KX, KZ + 30, '#cfc6b0', '#c0b6a0', 2);
      pushPrism(OK, 'ROOF', rectPoly(KX + 4, KZ - 22, KX + 46, KZ + 24), 0, 18);
      pushPrism(OK, 'ROOF', rectPoly(KX + 12, KZ - 18, KX + 46, KZ + 20), 18, 23);
      mesh(new THREE.SphereGeometry(13, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.35, 1), WALL.RF_COPPER, KX + 29, 23, KZ + 1);   // 講堂の丸い屋根
      pushPrism(OK, 'ROOF', rectPoly(KX, KZ - 12, KX + 6, KZ + 12), 0, 12);   // 玄関のアーチ
      bake(DARK, new THREE.BoxGeometry(0.3, 6, 6).translate(KX - 0.2, 3, KZ));
      bake(DARK, new THREE.CylinderGeometry(3, 3, 0.3, 12, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2).translate(KX - 0.2, 6, KZ));
      // 時計塔 (北西の角)
      const TX = KX + 4, TZ = KZ - 28;
      pushPrism(OK, 'ROOF', rectPoly(TX - 5, TZ - 5, TX + 5, TZ + 5), 0, 30);
      pushPrism(OK, 'ROOF', regularPoly(TX, TZ, 4.6, 8, Math.PI / 8), 30, 34);
      mesh(new THREE.ConeGeometry(4.2, 4, 8), WALL.RF_COPPER, TX, 36, TZ);
      bake(lam({ color: 0xc8a040, emissive: 0x302000 }), new THREE.BoxGeometry(0.2, 2, 0.2).translate(TX, 39, TZ));
      for (const [rx, ry, dx, dz] of [[0, -Math.PI / 2, -5.05, 0], [0, Math.PI / 2, 5.05, 0], [0, 0, 0, 5.05], [0, Math.PI, 0, -5.05]]) mesh(new THREE.CircleGeometry(2.4, 16).rotateY(ry), lam({ color: 0xf0ead8, emissive: 0x403828 }), TX + dx, 25, TZ + dz);
      LM_PEOPLE.push([[-2064, KZ - 28, -2064, KZ + 26], 10]);
    }
    // ===== 大隈記念タワー (26号館。2006年完成、高さ約76m = 250尺) と大隈庭園 =====
    pushPrism(MOD, 'ROOF', rectPoly(-2000, -3365, -1972, -3330), 0, 76);
    {
      fr(-2060, -3238, -1968, -3218, '#6a9a4e'); fr(-2010, -3320, -1968, -3238, '#6a9a4e');
      PONDS.push([-1990, -3262, 12, 9]); fe(-1990, -3262, 12, 9, '#2f6a72');
      for (let k = 0; k < 40; k++) { const x = rr(-2058, -1970), z = rr(-3316, -3220); if (x < -2010 && z < -3240) continue; if (!acFree(x, z)) continue; if (Math.hypot((x + 1990) / 15, (z + 3262) / 12) < 1) continue; (rnd() < 0.4 ? PINES : rnd() < 0.5 ? MAPLES : ROUND).push([x, z, rr(1, 1.4)]); }
    }
    // ===== キャンパス: 正門・大隈重信像の通り・校舎 =====
    const MZ = -3288;   // 正門から大隈像への通り
    {
      for (const z of [MZ - 9, MZ + 8]) pushPrism('TKSTONE', 'TKSTONE', rectPoly(W[2] - 1.5, z, W[2], z + 1), 0, 3.2);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(W[2] - 0.6, W[1], W[2], MZ - 9), 0, 1.4); pushPrism('TKSTONE', 'TKSTONE', rectPoly(W[2] - 0.6, MZ + 9, W[2], W[3]), 0, 1.4);
      tiles(-2160, MZ - 8, W[2], MZ + 8, '#cfc6b0', '#c0b6a0', 2);
      for (let x = -2150; x < W[2] - 4; x += 9) GINKGO.push([x, MZ - 10, 1.1], [x + 4, MZ + 10, 1.1]);
      acStatue(-2160, MZ, 0, 1.7, -Math.PI / 2, BR, 'stand', { w: 3, h: 3, mat: 'TKSTONE' });   // 大隈重信像 (正門のほうを向く)
      bake(BR, new THREE.ConeGeometry(0.75 * 1.7, 1.0 * 1.7, 8).translate(-2160, 3 + 0.55 * 1.7, MZ));   // ガウンのすそ
      LM_PEOPLE.push([[W[2] - 4, MZ - 4, -2152, MZ - 4], 14], [[-2152, MZ + 4, W[2] - 4, MZ + 4], 12]);
      // 會津八一記念博物館 (1925年完成の旧図書館)
      pushPrism(BRK, 'ROOF', rectPoly(-2124, -3336, -2088, -3302), 0, 15); pushPrism(BRK, 'ROOF', rectPoly(-2124, -3341, -2112, -3336), 0, 20);
      for (const [x0, z0, x1, z1, h, m] of [[-2230, -3272, -2186, -3226, 30, MOD], [-2176, -3272, -2130, -3226, 20, BRK], [-2120, -3272, -2086, -3244, 18, MOD], [-2160, -3362, -2128, -3332, 22, BRK],
        [-2230, -3328, -2190, -3296, 20, BRK], [-2180, -3320, -2140, -3298, 16, MOD], [-2120, -3362, -2088, -3346, 14, MOD]]) pushPrism(m, 'ROOF', rectPoly(x0, z0, x1, z1), 0, h);
      for (let k = 0; k < 90; k++) { const x = rr(W[0] + 3, W[2] - 3), z = rr(W[1] + 3, W[3] - 3); if (!acFree(x, z) || Math.abs(z - MZ) < 14 || x > -2100 || inR([-2222, -3364, -2166, -3330], x, z)) continue; (rnd() < 0.5 ? GINKGO : ROUND).push([x, z, rr(0.9, 1.2)]); }
    }
    // ===== 演劇博物館 (1928年。16世紀イギリスの劇場「フォーチュン座」がモデル) =====
    {
      const EX = -2201, EZ = -3348;
      const HT = LM_MAT('WS_ENPAKU', (x, y) => {   // 白い漆喰に焦げ茶の木組み
        x.fillStyle = '#ece6d8'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); x.fillStyle = '#4a3226';
        for (let i = 0; i < 32; i += 8) x.fillRect(i, 0, 1, 32); for (const j of [11, 21, 31]) x.fillRect(0, j, 32, 1);
        for (let i = 0; i < 32; i += 8) { x.fillRect(i + 1, 12, 1, 1); x.fillRect(i + 2, 13, 1, 1); x.fillRect(i + 3, 14, 1, 1); x.fillRect(i + 6, 12, 1, 1); x.fillRect(i + 5, 13, 1, 1); x.fillRect(i + 4, 14, 1, 1); }
        for (const j of [3, 15, 24]) for (let i = 3; i < 32; i += 8) { x.fillStyle = '#3a4048'; x.fillRect(i, j, 3, 4); y.fillStyle = rnd() < 0.4 ? '#ffd890' : '#000'; y.fillRect(i, j, 3, 4); }
      });
      pushPrism(HT, 'ROOF', rectPoly(EX - 14, EZ - 12, EX + 14, EZ + 12), 0, 14);
      jRoof('RF0', EX - 15, EZ - 13, EX + 15, EZ + 13, 14, 5, { over: 0.6, kind: 'hip', flare: 0 });
      pushPrism(HT, 'ROOF', rectPoly(EX + 14, EZ - 6, EX + 20, EZ + 6), 0, 10);   // 正面に張り出した「舞台」
      for (const dz of [-5.5, 5.5]) bake(lam({ color: 0x4a3226 }), new THREE.CylinderGeometry(0.35, 0.35, 10, 8).translate(EX + 20.5, 5, EZ + dz));
      tiles(EX + 20, EZ - 12, EX + 34, EZ + 12, '#cfc6b0', '#c0b6a0', 2);
    }
    // ===== 国際文学館 (村上春樹ライブラリー。入口は木のアーチのトンネル) =====
    {
      pushPrism(MOD, 'ROOF', rectPoly(-2233, -3362, -2222, -3300), 0, 14);
      const wood = lam({ color: 0xa8784a });
      for (let k = 0; k < 18; k++) { const z = -3337 + k * 0.6; for (let a = 0; a < 8; a++) { const t = Math.PI * (a + 0.5) / 8; bake(wood, new THREE.BoxGeometry(1.62, 0.14, 0.2).rotateZ(t + Math.PI / 2).translate(-2218 + 3.8 * Math.cos(t), 3.8 * Math.sin(t), z)); } }
      tiles(-2222, -3338, -2214, -3326, '#b89870', '#a88860', 2);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    LM_HEIGHT_AREAS.unshift(['大隈講堂の時計塔の上', (x, z, y) => y > 29 && Math.hypot(x - (KX + 4), z - (KZ - 28)) < 6]);
    SPOT_AREAS.push(['大隈記念講堂', KX - 10, KZ - 34, KX + 48, KZ + 30], ['大隈重信像', -2168, MZ - 8, -2152, MZ + 8], ['早稲田大学 正門', W[2] - 10, MZ - 10, W[2] + 4, MZ + 10],
      ['演劇博物館', -2217, -3362, -2166, -3334], ['国際文学館 (村上春樹ライブラリー)', -2235, -3364, -2212, -3298], ['會津八一記念博物館', -2126, -3343, -2086, -3300],
      ['大隈記念タワー', -2002, -3367, -1970, -3328], ['大隈庭園', -2062, -3320, -1966, -3216], ['早稲田大学 早稲田キャンパス', ...W]);
    LM_LABELS.push(['大隈講堂', KX + 24, KZ, '🕰', '大隈記念講堂'], ['大隈重信像', -2160, MZ, '🗿'], ['演劇博物館', -2201, -3348, '🎭'], ['村上春樹ライブラリー', -2226, -3320, '📖', '国際文学館 (村上春樹ライブラリー)'], ['早稲田大学', -2160, -3250, '🎓', '早稲田大学 早稲田キャンパス']);
    Object.assign(LM_NOTES, {
      '大隈記念講堂': '1927年完成のゴシック風の講堂。2007年に国の重要文化財になった',
      '大隈講堂の時計塔の上': '時計塔の高さは約38m (125尺)。創立者・大隈重信の「人は125歳まで生きられる」という説にちなむ',
      '大隈重信像': '早稲田大学の創立者で、総理大臣も務めた大隈重信の像',
      '早稲田大学 正門': '大隈講堂は、正門の真正面ではなく少しずれた位置に建っている',
      '演劇博物館': '1928年、坪内逍遙の発案で、シェイクスピアの時代のロンドンの劇場「フォーチュン座」をまねて建てられた。正面には「全世界は劇場なり」のラテン語',
      '国際文学館 (村上春樹ライブラリー)': '村上春樹さんの本や資料を集めた図書館。木のトンネルのような入口は隈研吾の設計',
      '會津八一記念博物館': '1925年完成の旧図書館の建物を使った博物館',
      '大隈記念タワー': '2006年完成、高さ約76m (250尺)。大隈講堂の時計塔のちょうど2倍の高さ',
      '大隈庭園': '大隈重信の屋敷の庭だった場所。講堂のとなりの芝生の庭',
      '早稲田大学 早稲田キャンパス': '1882年に大隈重信が開いた東京専門学校が始まり',
    });
    Object.assign(LM_TIPS, {
      '演劇博物館': '建物の正面の張り出しはそのまま舞台になり、前の広場が客席になる',
      '国際文学館 (村上春樹ライブラリー)': '隈研吾の設計。木のアーチがトンネルのように続く「階段本棚」が見どころ',
      '會津八一記念博物館': '1925年に建てられた旧図書館を使った博物館。名前は、書や歌で知られた美術史家・會津八一から',
    });
    LM_ACH.push(['okuma', '🕰 都の西北', '大隈講堂の前に立つ', () => inR([KX - 10, KZ - 34, KX, KZ + 30], P.x, P.z)]);
    bakeFlush();
  },
});
