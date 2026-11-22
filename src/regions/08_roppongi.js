/* 六本木 (六本木交差点・東京ミッドタウン・六本木ヒルズ・国立新美術館)
   六本木通り (上を首都高3号) と 外苑東通り が交わる六本木交差点を中心に、北にミッドタウン (檜町公園・21_21 DESIGN SIGHT)、
   南西に六本木ヒルズ (森タワー・66プラザ・テレビ朝日・毛利庭園・けやき坂)、西に国立新美術館 (波打つガラスの壁)
   斜めの道は regions/06_akasaka.js の akRoad() で引く */
REGION({
  name: '六本木',
  towns: [['六本木', -1950, -600], ['赤坂九丁目', -1960, -900], ['六本木六丁目', -2080, -430], ['乃木坂', -2150, -850], ['西麻布', -2250, -480]],
  labels: [],
  build(r) {
    const M = (key, bg, win, lit, cw = 2, cs = 3, rh = 3, rs = 4) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rs) for (let i = 1; i < 32; i += cs) { x.fillStyle = win; x.fillRect(i, j, cw, rh); y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, j, cw, rh); }
    });
    const water = (cx, cz, rx, rz) => { PONDS.push([cx, cz, rx, rz]); fe(cx, cz, rx, rz, '#2d6585'); };
    const C = [-1938, -610];
    // 冬 (11月〜12月) の夜だけ灯るイルミネーション
    const ILLUM = lam({ color: 0xbcd8ff, emissive: 0x9cc8ff, emissiveIntensity: 0 }), ILLUM2 = lam({ color: 0xfff4e0, emissive: 0xffe8c0, emissiveIntensity: 0 });
    LM_UPDATERS.push(() => { const on = (MONTH === 11 || MONTH === 12) && NIGHT > 0.3 ? 1.4 : 0; ILLUM.emissiveIntensity = on; ILLUM2.emissiveIntensity = on; });

    // ===== 道路 (六本木通りと外苑東通り) と首都高3号渋谷線 =====
    LM_HEIGHT_AREAS.push(['六本木交差点', (x, z, y) => y < 3 && Math.hypot(x - C[0], z - C[1]) < 22]);
    const FNE = akRoad(C, [-1715, -1094], 30, '六本木通り', { cross: [24] });
    const FSW = akRoad(C, [-2215, -498], 30, '六本木通り', { cross: [24] });
    akRoad([-2284, -1250], C, 22, '外苑東通り', { cross: [700] });
    akRoad(C, [-1850, -420], 22, '外苑東通り', { cross: [22] });
    {
      const Y = 14;
      for (const [F, L] of [[FNE, 250], [FSW, 296]]) {
        pushPrism('CONC', 'ASPH', F.rect(-10, -9, L, 9), Y - 1.6, Y);
        for (const s of [-8.8, 8.8]) pushPrism('CONC', 'CONC', F.rect(-10, s - 0.2, L, s + 0.2), Y, Y + 1.5);
        for (let u = 18; u < L - 10; u += 30) pushPrism('CONC', null, F.rect(u - 1.2, -1.2, u + 1.2, 1.2), 0, Y - 1.6);
        pushPrism('CONC', 'CONC', F.rect(L - 6, -9, L, 9), 0, Y - 1.6);   // この先は作っていない
      }
      pushPrism('CONC', null, regularPoly(...C, 2, 8), 0, Y - 1.6);
      LM_HEIGHT_AREAS.unshift(['首都高3号渋谷線 (六本木通りの上)', (x, z, y) => { if (y < Y - 1 || y > Y + 4) return false; for (const [F, L] of [[FNE, 250], [FSW, 296]]) { const dx = x - F.ox, dz = z - F.oz, u = dx * F.ux + dz * F.uz, v = dx * F.vx + dz * F.vz; if (u > -10 && u < L && Math.abs(v) < 9.5) return true; } return false; }]);
    }

    // ===== 東京ミッドタウン (2007年開業。防衛庁の跡地) と檜町公園 =====
    const MT = [[-1997, -770], [-1891, -770], [-1753, -1070], [-2160, -1070]];
    {
      LM_ZONES.push(MT); polyFr(MT, '#b8b2a4');
      const GD = [[-2089, -940], [-1834, -940], [-1753, -1070], [-2160, -1070]]; polyFr(GD, '#86a65e');   // ミッドタウン・ガーデンと檜町公園
      oTiles(frame(-1990, -785, 1, 0, 0, 1), 0, 0, 98, 15, '#d4ccb8', '#c4bca8', 2);
      pushPrism(M('RP_MTT', '#8e98a4', '#d6dee6', 0.6, 1, 2, 2, 3), 'ROOF', rectPoly(-1935, -860, -1879, -804), 0, 248);   // ミッドタウン・タワー
      pushPrism('ROOF', 'ROOF', rectPoly(-1925, -850, -1889, -814), 248, 252);
      pushPrism(M('RP_GAL', '#c8c2b4', '#5a6470', 0.6, 3, 4, 2, 4), 'glass', rectPoly(-1990, -900, -1942, -788), 0, 26);   // ガレリア (サントリー美術館)
      pushPrism(M('RP_MTW', '#a8b0b8', '#3e4a56', 0.55, 2, 3, 2, 3), 'ROOF', rectPoly(-2060, -935, -2010, -880), 0, 80);
      pushPrism(M('RP_MTE', '#b4bcc4', '#3e4a56', 0.55, 2, 3, 2, 3), 'ROOF', rectPoly(-1880, -935, -1845, -890), 0, 90);
      pushPrism('glass', 'glass', rectPoly(-1990, -786, -1895, -772), 7.6, 8, { solid: false });   // 入口の大きな屋根
      for (let x = -1985; x <= -1885; x += 20) pushPrism('BRONZE', null, rectPoly(x - 0.3, -780, x + 0.3, -779.4), 0, 7.6, { solid: false });
      // 21_21 DESIGN SIGHT (安藤忠雄の設計。1枚の鉄板を折ったような屋根)
      pushPrism('CONC', 'CONC', rectPoly(-2010, -968, -1962, -952), 0, 3.4);
      const roof = lam({ color: 0x4a4c50 }); bake(roof, new THREE.BoxGeometry(52, 0.3, 11).rotateX(0.2).translate(-1986, 4.4, -963)); bake(roof, new THREE.BoxGeometry(30, 0.3, 9).rotateX(-0.25).rotateY(0.3).translate(-1996, 4.0, -955));
      // 檜町公園 (毛利家の屋敷の庭「清水園」の跡) の池
      water(-1960, -1030, 26, 13);
      for (let k = 0; k < 120; k++) { const x = rr(-2150, -1760), z = rr(-1066, -944); if (!inPoly(GD, x, z) || Math.hypot((x + 1960) / 32, (z + 1030) / 18) < 1 || inR([-2014, -972, -1958, -948], x, z)) continue; (rnd() < 0.45 ? SAKURA : rnd() < 0.5 ? ROUND : MAPLES).push([x, z, rr(1, 1.4)]); }
      // 芝生のイルミネーション (冬の夜)
      for (let k = 0; k < 160; k++) { const x = rr(-2030, -1830), z = rr(-1000, -945); if (!inPoly(GD, x, z)) continue; bake(k % 3 ? ILLUM : ILLUM2, new THREE.SphereGeometry(0.22, 5, 4).translate(x, 0.3, z)); }
      LM_PEOPLE.push([[-1985, -778, -1885, -778], 12], [[-2000, -990, -1820, -990], 8]);
    }
    // ===== 国立新美術館 (2007年開館、黒川紀章の設計。波打つガラスの壁) =====
    {
      const NM = [-2240, -820, -2130, -762];
      LM_ZONES.push(rectPoly(NM[0] - 8, NM[1] - 10, NM[2] + 20, NM[3] + 58)); fr(NM[0] - 8, NM[1] - 10, NM[2] + 20, NM[3] + 58, '#b8b2a4');
      pushPrism(M('RP_NACT', '#8a949c', '#c8d4dc', 0.5, 1, 2, 3, 4), 'ROOF', rectPoly(...NM), 0, 22);
      const gl = new THREE.MeshLambertMaterial({ color: 0x8ab8cc, transparent: true, opacity: 0.75 });
      for (let i = 0; i < 30; i++) { const x = NM[0] + 2 + i * 4, z = NM[3] + 7 + 6 * Math.sin(i * 0.42); bake(gl, new THREE.BoxGeometry(4.2, 22, 0.3).rotateX(-0.12 * Math.cos(i * 0.42)).translate(x, 11, z)); solid(x - 2.1, z - 0.4, x + 2.1, z + 0.4, 0, 22); }
      for (const x of [NM[0] + 30, NM[0] + 80]) bake(WALL.CONC, new THREE.ConeGeometry(6, 14, 12).rotateX(Math.PI).translate(x, 15, NM[3] + 4));   // ガラスの中の逆さ円すい
      for (let k = 0; k < 40; k++) ROUND.push([rr(NM[0] - 6, NM[2] + 18), rr(NM[3] + 20, NM[3] + 56), rr(1, 1.3)]); LM_PEOPLE.push([[NM[0], NM[3] + 16, NM[2], NM[3] + 16], 8]);
    }
    // ===== 六本木ヒルズ (2003年開業。森タワー・66プラザ・テレビ朝日・毛利庭園・けやき坂) =====
    const HZ = [[-2200, -480], [-1980, -568], [-1955, -568], [-1955, -325], [-2200, -325]];
    const TW = [-2095, -510, -2035, -452];
    {
      LM_ZONES.push(HZ); polyFr(HZ, '#b4ae9e');
      polyFr([[-2140, -504], [-1985, -566], [-1985, -500], [-2140, -500]], '#d0c8b4');   // 66プラザ
      const MORI = M('RP_MORI', '#6e7680', '#c4d0da', 0.6, 1, 2, 2, 3);
      pushPrism(MORI, 'ROOF', regularPoly((TW[0] + TW[2]) / 2, (TW[1] + TW[3]) / 2, 34, 12), 0, 222);   // 森タワー (角を落とした形)
      pushPrism('glass', 'ROOF', regularPoly((TW[0] + TW[2]) / 2, (TW[1] + TW[3]) / 2, 32, 12), 222, 236);   // 52階の展望台のあたり (ガラス)
      pushPrism('CONC', 'CONC', regularPoly((TW[0] + TW[2]) / 2, (TW[1] + TW[3]) / 2, 30, 12), 236, 238);
      mesh(new THREE.RingGeometry(9, 10.5, 24).rotateX(-Math.PI / 2), lam({ color: 0xe8e8e0 }), (TW[0] + TW[2]) / 2, 238.05, (TW[1] + TW[3]) / 2);
      pushPrism(M('RP_TVA', '#e8e8e4', '#5a6878', 0.55, 3, 4, 2, 4), 'ROOF', rectPoly(-2170, -470, -2110, -412), 0, 34);   // テレビ朝日
      pushPrism(M('RP_WW', '#c8c0b0', '#4a5260', 0.6, 2, 4, 3, 4), 'ROOF', rectPoly(-2108, -444, -2050, -418), 0, 20);    // ウェストウォーク
      pushPrism(M('RP_GH', '#b8a890', '#3e3a36', 0.6, 2, 3, 2, 3), 'ROOF', rectPoly(-2045, -440, -1995, -395), 0, 70);    // グランド ハイアット
      pushPrism(M('RP_RES', '#d4d0c8', '#46525e', 0.5, 2, 3, 2, 3), 'ROOF', rectPoly(-1990, -420, -1958, -388), 0, 150);
      pushPrism(M('RP_RES', '#d4d0c8', '#46525e', 0.5, 2, 3, 2, 3), 'ROOF', rectPoly(-1990, -378, -1958, -357), 0, 120);
      // 毛利庭園 (長府藩毛利家の屋敷の庭の跡)
      water(-2140, -380, 20, 11); for (let k = 0; k < 30; k++) { const a = rr(0, 6.28); (k % 3 ? ROUND : SAKURA).push([-2140 + Math.cos(a) * rr(25, 34), -380 + Math.sin(a) * rr(15, 22), rr(0.9, 1.2)]); }
      // けやき坂 (ケヤキ並木。冬の夜はイルミネーション)
      addRoads([[-2200, -347, -1955, -333, 'ew', 'けやき坂']]);
      tiles(-2200, -352, -1955, -347, '#c8c0b0', '#b6ae9e', 2); tiles(-2200, -333, -1955, -328, '#c8c0b0', '#b6ae9e', 2);
      for (let x = -2195; x < -1960; x += 10) for (const z of [-349.5, -330.5]) { ROUND.push([x, z, 1.1]); for (let k = 0; k < 6; k++) bake(k % 2 ? ILLUM : ILLUM2, new THREE.SphereGeometry(0.16, 4, 3).translate(x + rr(-2, 2), rr(2.5, 6), z + rr(-2, 2))); }
      LM_PEOPLE.push([[-2120, -506, -2000, -554], 14], [[-2195, -349.5, -1960, -349.5], 10], [[-1960, -330.5, -2195, -330.5], 10]);
      // 森タワーの屋上へ上がるエレベーター
      const EL = [(TW[0] + TW[2]) / 2, (TW[1] + TW[3]) / 2 - 37];
      LM_ACTIONS.push({ at: () => P.y < 3 && Math.hypot(P.x - EL[0], P.z - EL[1]) < 5, prompt: () => 'E　森タワーの屋上へ上がる',
        act: () => lmWarp((TW[0] + TW[2]) / 2 + 4, 238.2, (TW[1] + TW[3]) / 2 - 18, 0, '🛗 森タワーの屋上 (高さ238m)') });
      LM_ACTIONS.push({ at: () => P.y > 236 && Math.hypot(P.x - (TW[0] + TW[2]) / 2, P.z - (TW[1] + TW[3]) / 2) < 30, prompt: () => 'E　1階へ下りる',
        act: () => lmWarp(EL[0], 0, EL[1] - 6, 0, '🛗 1階 (66プラザ)') });
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    LM_HEIGHT_AREAS.unshift(['六本木ヒルズ森タワー 屋上', (x, z, y) => y > 236 && inR([TW[0] - 6, TW[1] - 6, TW[2] + 6, TW[3] + 6], x, z)], ['東京シティビューのあたり (森タワー52階)', (x, z, y) => y > 200 && y < 236 && inR([TW[0] - 6, TW[1] - 6, TW[2] + 6, TW[3] + 6], x, z)],
      ['ミッドタウン・タワー 屋上', (x, z, y) => y > 246 && inR([-1935, -860, -1879, -804], x, z)]);
    SPOT_AREAS.push(['21_21 DESIGN SIGHT', -2014, -972, -1958, -948], ['檜町公園', -2000, -1062, -1920, -998], ['ミッドタウン・ガーデン', -2150, -1070, -1760, -940], ['東京ミッドタウン', -2160, -1070, -1753, -770],
      ['国立新美術館', -2248, -830, -2110, -704], ['六本木ヒルズ森タワー', ...TW], ['66プラザ', -2140, -566, -1985, -500], ['テレビ朝日', -2172, -472, -2108, -410], ['毛利庭園', -2165, -395, -2115, -365], ['けやき坂', -2200, -352, -1955, -328], ['六本木ヒルズ', -2200, -568, -1955, -325]);
    LM_LABELS.push(['ミッドタウン', -1907, -832, '🏙', '東京ミッドタウン'], ['21_21', -1986, -960, '📐', '21_21 DESIGN SIGHT'], ['国立新美術館', -2185, -791, '🖼'], ['六本木ヒルズ', -2065, -481, '🌆', '六本木ヒルズ森タワー'], ['毛利庭園', -2140, -380, '🌸'], ['けやき坂', -2080, -340, '✨'], ['六本木交差点', ...C, '🚦']);
    Object.assign(LM_NOTES, {
      '六本木交差点': '六本木通りと外苑東通りが交わる交差点。真上を首都高3号渋谷線が通る',
      '東京ミッドタウン': '2007年開業。防衛庁の跡地を再開発した街で、ミッドタウン・タワーは高さ248m (2014年まで都内でいちばん高いビルだった)',
      'ミッドタウン・ガーデン': 'となりの檜町公園とつながる広い緑地。冬は芝生がイルミネーションで彩られる',
      '檜町公園': '江戸時代、長州藩毛利家の屋敷の庭「清水園」があった場所',
      '21_21 DESIGN SIGHT': '三宅一生が創立し、安藤忠雄が設計したデザイン施設。屋根は三宅の服作りの考え「一枚の布」がもとになっている',
      '国立新美術館': '2007年開館、黒川紀章の設計。自分のコレクションを持たず、展覧会を開くための場所として日本最大級の展示スペースをもつ',
      '六本木ヒルズ': '2003年開業。66プラザには、ルイーズ・ブルジョワの巨大なクモの彫刻「ママン」がある',
      '六本木ヒルズ森タワー': '高さ238m・54階建て。52階の展望台「東京シティビュー」は海抜250mにある',
      '東京シティビューのあたり (森タワー52階)': '天井の高さ11mのガラス張りの展望台。晴れた日は富士山まで見える',
      '毛利庭園': '長府藩毛利家の屋敷の庭の跡。明治の軍人・乃木希典はこの屋敷で生まれた',
      'けやき坂': 'ケヤキ並木の坂道。冬の夜はイルミネーションで青白く光る',
      'テレビ朝日': '六本木ヒルズの中にあるテレビ局の本社',
      '首都高3号渋谷線 (六本木通りの上)': '1964年の東京オリンピックに合わせてつくられた路線のひとつ',
    });
    Object.assign(LM_TIPS, {
      '六本木ヒルズ森タワー': '展望台の窓の正面に東京タワーが見え、夜は街の灯りが足元いっぱいに広がる',
      '21_21 DESIGN SIGHT': '建物の大部分は地下にあり、地上に見えているのは鉄板を折ったような大きな屋根だけ',
      '国立新美術館': '波打つガラスの外壁が目印。建物の中の逆さ円すいの上にカフェやレストランがある',
    });
    const seen = new Set();
    LM_UPDATERS.push(() => { if (inPoly(MT, P.x, P.z)) seen.add('m'); if (inPoly(HZ, P.x, P.z)) seen.add('h'); if (inR([-2248, -830, -2110, -704], P.x, P.z)) seen.add('n'); });
    LM_ACH.push(['roppongi3', '🌆 六本木アートさんぽ', '東京ミッドタウン・六本木ヒルズ・国立新美術館をすべて訪ねる', () => seen.size === 3],
      ['moritop', '🛗 森タワーのてっぺん', '六本木ヒルズ森タワーの屋上に立つ', () => P.y > 236 && inR([TW[0] - 6, TW[1] - 6, TW[2] + 6, TW[3] + 6], P.x, P.z)]);
    bakeFlush();
  },
});
