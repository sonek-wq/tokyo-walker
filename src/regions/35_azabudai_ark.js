/* 麻布台ヒルズ (森JPタワー: 高さ約330mの日本一高いビル) と アークヒルズ (サントリーホール)
   東京タワーの北西。どちらも森ビルの「ヒルズ」。六本木ヒルズの森美術館もここで名所に加える */
REGION({
  name: '麻布台・六本木一丁目',
  towns: [['麻布台', -1760, -520], ['六本木一丁目', -1725, -700]],
  labels: [],
  build(r) {
    const C = (key, o) => { if (!WALL[key]) WALL[key] = lam(o); return key; };
    // ===== 麻布台ヒルズ =====
    const AZ = [-1828, -592, -1696, -428], TX = -1764, TZ = -526;
    LM_ZONES.push(rectPoly(...AZ)); tiles(...AZ, '#d6cebe', '#c6beae', 4);
    {
      const JP = acGothic('AZ_MORIJP', '#d4d8da', '#7890a4', null, { rowH: 3, step: 2, ww: 2, wh: 2, lit: 0.65 });
      // 角を丸めた四角い塔。上に行くほど少しだけ細くなり、てっぺんは花びらのように開く
      const sect = (rad, k) => { const P = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + Math.PI / 4, c = Math.cos(a), s = Math.sin(a), q = Math.pow(Math.abs(c) ** 4 + Math.abs(s) ** 4, -0.25); P.push([TX + c * q * rad, TZ + s * q * rad]); } return P; };
      const LV = [[0, 26], [60, 25.5], [130, 24.5], [200, 23], [260, 21.5], [300, 20]];
      for (let k = 0; k < LV.length; k++) { const [y0, rad] = LV[k], y1 = k + 1 < LV.length ? LV[k + 1][0] : 318; pushPrism(JP, k === LV.length - 1 ? 'ROOF' : null, sect(rad, k), y0, y1); }
      const PET = glow(lam({ color: 0xe8ecf0 }), 0xc8e0ff, 0.25);
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, x = TX + Math.cos(a) * 17, z = TZ + Math.sin(a) * 17; mesh(new THREE.BoxGeometry(9, 12, 0.6), PET, x, 324, z, -a + Math.PI / 2).rotation.x = 0.25; }
      pushPrism('CONC', 'ROOF', regularPoly(TX, TZ, 9, 8), 318, 330);
      // レジデンスA (約237m)
      pushPrism(acGothic('LM_TOWERST', '#c4beb4', '#3e4650', null, { rowH: 3, step: 3, ww: 2, wh: 2, lit: 0.55 }), 'ROOF', regularPoly(-1716, -452, 15, 12), 0, 237);
      // ガーデンプラザ: 緑の屋根が波のようにうねる低層の建物 (トーマス・ヘザウィックのデザイン)
      const GRN = lam({ color: 0x6a9a4a }), RIB = lam({ color: 0xe8e2d4 });
      for (const [x, z, rx, rz, h] of [[-1806, -460, 20, 26, 22], [-1800, -572, 22, 16, 18], [-1736, -584, 26, 10, 14], [-1712, -508, 12, 22, 16]]) {
        pushPrism(C('AZ_GPWALL', { color: 0xdcd4c4 }), null, regularPoly(x, z, 1, 14).map(([px, pz]) => [x + (px - x) * rx * 0.92, z + (pz - z) * rz * 0.92]), 0, h * 0.45);
        mesh(new THREE.SphereGeometry(1, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(rx, h * 0.6, rz), GRN, x, h * 0.4, z);
        for (let k = -2; k <= 2; k++) mesh(new THREE.TorusGeometry(1, 0.012, 3, 16, Math.PI).scale(rx * 1.01, h * 0.61, rz * (1 - Math.abs(k) * 0.18)), RIB, x + k * rx * 0.18, h * 0.4, z, Math.PI / 2);
        solid(x - rx * 0.6, z - rz * 0.6, x + rx * 0.6, z + rz * 0.6, 0, h * 0.45);
      }
      // 中央広場 (芝生と果樹園)
      polyFr(regularPoly(-1752, -470, 22, 12), '#6f9a4a');
      for (let k = 0; k < 24; k++) { const a = rnd() * 6.283, d = rr(4, 20); (rnd() < 0.5 ? SAKURA : ROUND).push([-1752 + Math.cos(a) * d, -470 + Math.sin(a) * d, rr(0.9, 1.2)]); }
      frontSign(AXIS, TX, TZ + 26.3, 1, 'AZABUDAI HILLS', '#2a2a2e', '#f0e8d8', 14, 1.6, 8);
      LM_PEOPLE.push([[-1826, -430, -1698, -430], 14], [[-1700, -590, -1700, -430], 10], [[-1780, -470, -1724, -470], 8]);
      roofLift([TX, TZ + 29], [TX, 330.05, TZ], '🛗 森JPタワーの屋上 (地上330m) へ。日本一高いビルのてっぺん', '🛗 1階へ', { upPrompt: 'E　エレベーターで森JPタワーの屋上へ', topR: 10 });
      SPOT_AREAS.unshift(['麻布台ヒルズ 森JPタワー', TX - 26, TZ - 26, TX + 26, TZ + 26], ['麻布台ヒルズ 中央広場', -1774, -492, -1730, -448]);
      SPOT_AREAS.push(['麻布台ヒルズ', ...AZ]);
      LM_HEIGHT_AREAS.unshift(['森JPタワーのてっぺん', (x, z, y) => y > 315 && Math.hypot(x - TX, z - TZ) < 22]);
      LM_LABELS.push(['麻布台ヒルズ', TX, TZ, '🏙', '麻布台ヒルズ 森JPタワー']);
    }
    // ===== アークヒルズ (アーク森ビル) と サントリーホール =====
    {
      const AK = [-1756, -792, -1696, -646];
      LM_ZONES.push(rectPoly(...AK)); tiles(...AK, '#cfc4b2', '#bfb4a2', 3);
      pushPrism(acGothic('LM_TOWERST', '#c4beb4', '#3e4650', null, { rowH: 3, step: 3, ww: 2, wh: 2, lit: 0.55 }), 'ROOF', rectPoly(-1754, -790, -1712, -752), 0, 153);
      const SH = [-1752, -722, -1700, -664];
      pushPrism(C('AZ_SUNTORY', { color: 0xb87a5a }), 'ROOF', rectPoly(...SH), 0, 20);   // れんが色の外壁
      pushPrism('glass', null, rectPoly(SH[2] - 0.4, -710, SH[2] + 0.1, -676), 0.2, 8, { solid: false });
      frontSign(AXIS, SH[2] + 0.2, -693, 1, 'SUNTORY HALL', '#f4ecdc', '#3a2418', 12, 1.6, 12, {});
      bake(glow(lam({ map: textTex('SUNTORY HALL', '#f4ecdc', '#3a2418', 160, 28) }), '#ffffff', 0.7), new THREE.PlaneGeometry(14, 1.8).rotateY(Math.PI / 2).translate(SH[2] + 0.2, 12, -693));
      tiles(-1712, -750, -1698, -726, '#d8ccb4', '#c8bca4', 2);   // アーク・カラヤン広場
      for (let k = 0; k < 10; k++) SAKURA.push([rr(-1754, -1700), rr(-660, -648), 1.1]);
      LM_PEOPLE.push([[-1698, -790, -1698, -650], 10]);
      SPOT_AREAS.unshift(['サントリーホール', ...SH], ['アーク・カラヤン広場', -1714, -752, -1696, -724]);
      SPOT_AREAS.push(['アークヒルズ', ...AK]);
      LM_LABELS.push(['サントリーホール', -1726, -693, '🎻', 'サントリーホール'], ['アークヒルズ', -1733, -771, '🏢']);
    }
    // ===== 森美術館 (六本木ヒルズ森タワーの53階。日本でいちばん高いところにある美術館のひとつ) =====
    LM_HEIGHT_AREAS.unshift(['森美術館・東京シティビュー (森タワー最上部)', (x, z, y) => y > 180 && inR([-2095, -510, -2035, -452], x, z)]);
    LM_LABELS.push(['森美術館', -2065, -481, '🖼', '森美術館・東京シティビュー (森タワー最上部)']);

    Object.assign(LM_NOTES, {
      '麻布台ヒルズ': '2023年11月に開業した森ビルの街。東京タワーの北西約350m。オフィス・住まい・お店・学校が集まり、約2万4000㎡の緑地には果樹園や菜園まである',
      '麻布台ヒルズ 森JPタワー': '地上64階、高さ約330m。大阪の「あべのハルカス」(約300m) をこえて、日本一高いビルになった。東京タワー (333m) とほぼ同じ高さ',
      '森JPタワーのてっぺん': '日本一高いビルのてっぺん。となりの東京タワーの展望台を見下ろす高さ',
      '麻布台ヒルズ 中央広場': '街の真ん中の緑の広場。まわりの低い建物の、波のようにうねる屋根は、ロンドンオリンピックの聖火台をデザインしたトーマス・ヘザウィックのデザイン',
      'アークヒルズ': '1986年に完成した森ビルの「ヒルズ」の第1号。オフィス・住まい・ホテル・コンサートホールが一つの街になっている',
      'サントリーホール': '1986年にできた、東京で初めてのクラシック音楽専用のコンサートホール。客席がぶどう畑の斜面のようにステージを囲む「ワインヤード型」',
      'アーク・カラヤン広場': 'サントリーホールの前の広場。ホールづくりに助言した指揮者カラヤンの名前がついている',
      '森美術館・東京シティビュー (森タワー最上部)': '森タワーの53階には「森美術館」、52階には展望台「東京シティビュー」がある。現代アートを、地上約230mの高さで見られる',
    });
    LM_ACH.push(['nihonichi', '🏙 日本一のビル', '麻布台ヒルズ 森JPタワーの屋上に立つ', () => P.y > 325 && Math.hypot(P.x - TX, P.z - TZ) < 12]);
    bakeFlush();
  },
});
