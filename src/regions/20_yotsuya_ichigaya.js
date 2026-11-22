/* 四ツ谷・市ケ谷 (上智大学と聖イグナチオ教会・真田堀・外濠公園の桜・市ヶ谷フィッシュセンター・防衛省・法政大学)
   中央線は四ツ谷から飯田橋まで、外堀 (regions/00_geography.js) の内側の岸を走る。濠の外側 (北西) が新宿区、内側 (南東) が千代田区 */
// 中央線のおおまかな線 (regions/01_rail_lines.js の折れ線と同じ点)。fr(i, t) は i 番目の区間の t の所に、線路の向き u と内側 (右) の向き v をもつ座標系を置く
const CHUO_P = [[-2005, -2108], [-1900, -2160], [-1700, -2262], [-1560, -2330], [-1440, -2400], [-1300, -2530], [-1120, -2760], [-1030, -2862]];
function chuoFrame(i, t) {
  const [ax, az] = CHUO_P[i], [bx, bz] = CHUO_P[i + 1], l = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / l, uz = (bz - az) / l;
  return frame(ax + (bx - ax) * t, az + (bz - az) * t, ux, uz, -uz, ux);
}
REGION({
  name: '四ツ谷・市ケ谷',
  towns: [['四谷', -1960, -2040], ['紀尾井町', -1860, -1990], ['五番町', -1560, -2280], ['市谷本村町', -1760, -2450], ['市谷田町', -1480, -2440], ['富士見', -1180, -2580]],
  stations: ['四ツ谷', '市ケ谷'],   // 駅のまわりを作り込んだ駅 (ファストトラベルで緑の枠)
  labels: [],
  build(r) {
    const BR = WALL.BRONZE, WHITE = lam({ color: 0xf2eee4 }); let FISH_BB = null;
    // ===== 上智大学 四谷キャンパス と 聖イグナチオ教会 =====
    const SU = [-1966, -2096, -1888, -2008];
    {
      LM_ZONES.push(rectPoly(...SU)); fr(...SU, '#b0a898');
      const BRK = acGothic('YT_BRICK', '#9a6a52', '#2a2a30', '#b08a74', { brick: '#8a5a44', rowH: 8, step: 4, ww: 2, wh: 5 });
      const MOD = acGothic('YT_MOD', '#d0ccc4', '#3e4a56', null, { rowH: 5, step: 3, ww: 2, wh: 3, lit: 0.55 });
      // 聖イグナチオ教会 (だ円形の白い聖堂と、細い鐘楼)
      const CX = -1950, CZ = -2082, E = []; for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; E.push([CX + Math.cos(a) * 13, CZ + Math.sin(a) * 10]); }
      if (!WALL.YT_WHITE) WALL.YT_WHITE = WHITE; pushPrism('YT_WHITE', 'ROOF', E, 0, 13);
      mesh(new THREE.ConeGeometry(14, 4, 20).scale(1, 1, 10 / 13), lam({ color: 0x8a8e94 }), CX, 15, CZ);
      pushPrism('YT_WHITE', 'YT_WHITE', rectPoly(-1934, -2096, -1930, -2092), 0, 30);
      bake(lam({ color: 0xd8b040 }), new THREE.BoxGeometry(0.3, 3, 0.3).translate(-1932, 31.5, -2094)); bake(lam({ color: 0xd8b040 }), new THREE.BoxGeometry(1.8, 0.3, 0.3).translate(-1932, 32.2, -2094));
      // 校舎: 1号館 (1932年完成のれんが色の建物)・ソフィアタワー・2号館
      pushPrism(BRK, 'ROOF', rectPoly(-1962, -2060, -1942, -2014), 0, 16);
      pushPrism('glass', 'ROOF', rectPoly(-1928, -2078, -1898, -2048), 0, 72);
      pushPrism(MOD, 'ROOF', rectPoly(-1930, -2040, -1892, -2012), 0, 50);
      tiles(-1940, -2060, -1930, -2010, '#cfc6b0', '#c0b6a0', 2);
      for (let k = 0; k < 16; k++) ROUND.push([rr(-1940, -1932), rr(-2096, -2012), 1]);
      LM_PEOPLE.push([[-1936, -2096, -1936, -2014], 12]);
      // 真田堀 (外堀の一部を埋めた、上智大学のグラウンド)
      const SG = [-1882, -2098, -1838, -1912];
      LM_ZONES.push(rectPoly(...SG)); fr(...SG, '#6f9a52'); fe(-1860, -2010, 16, 60, '#b89a6a');
      for (const [x0, z0, x1, z1] of [[SG[0], SG[1], SG[2], SG[1] + 0.3], [SG[0], SG[3] - 0.3, SG[2], SG[3]], [SG[0], SG[1], SG[0] + 0.3, SG[3]], [SG[2] - 0.3, SG[1], SG[2], SG[3]]]) pushPrism('RAIL', null, rectPoly(x0, z0, x1, z1), 0, 4, { solid: true });
      for (let z = SG[1] + 4; z < SG[3]; z += 9) SAKURA.push([SG[0] - 3, z, 1.2], [SG[2] + 3, z + 4, 1.2]);
    }
    // ===== 外濠公園 (線路と外堀通りのあいだの土手の桜並木。四ツ谷〜飯田橋) =====
    for (let i = 1; i < CHUO_P.length - 1; i++) {
      const F = chuoFrame(i, 0), L = Math.hypot(CHUO_P[i + 1][0] - CHUO_P[i][0], CHUO_P[i + 1][1] - CHUO_P[i][1]);
      for (let u = 6; u < L - 6; u += 10) {
        const [x, z] = F.w(u, 14); if ([[-1500, -2365], [-1010, -2875]].some(([sx, sz]) => Math.hypot(sx - x, sz - z) < 70)) continue;
        if (inR([-1300, -2700, -1130, -2540], x, z)) continue;   // 法政大学
        SAKURA.push([x, z, 1.2]); if (u % 20 < 10) BENCHES.push([...F.w(u + 5, 11), Math.atan2(F.ux, F.uz)]);
      }
      LM_PEOPLE.push([[...F.w(4, 11), ...F.w(L - 4, 11)], 4]);
    }
    // ===== 市ヶ谷フィッシュセンター (市ケ谷駅のとなり、外堀の中の釣り堀) =====
    {
      const S0 = chuoFrame(3, 0.5), F = frame(...S0.w(30, -34), S0.ux, S0.uz, -S0.vx, -S0.vz);   // v は濠の外側 (北西) 向き
      const deck = (u0, v0, u1, v1) => {   // 細い桟橋は 2.5m 角の当たり判定では抜けるので、細かい箱を並べる
        pushPrism('WOOD', 'WOOD', F.rect(u0, v0, u1, v1), -0.2, 0.25, { solid: false });
        const L = Math.max(u1 - u0, v1 - v0), alongU = u1 - u0 >= v1 - v0;
        for (let t = 0; t < L; t += 0.8) { const [x, z] = alongU ? F.w(u0 + t + 0.4, (v0 + v1) / 2) : F.w((u0 + u1) / 2, v0 + t + 0.4); solid(x - 0.75, z - 0.75, x + 0.75, z + 0.75, -0.2, 0.25); }
      };
      deck(-26, -10, 20, -8.4); deck(-26, 8.4, 20, 10); deck(18.4, -10, 20, 10); deck(-26, -10, -24.4, 10); deck(-4, -10, -2.4, 10);   // 釣り堀のまわりと仕切りの桟橋
      for (let u = -26; u <= 20; u += 6) for (const v of [-9.2, 9.2]) { const [x, z] = F.w(u, v); bake(lam({ color: 0x5a4632 }), new THREE.BoxGeometry(0.3, 3, 0.3).translate(x, -1.6, z)); }
      pushPrism('resi2', 'ROOF', F.rect(-24, -8, -16, 0), 0.25, 3.6);   // 受付と釣り具の小屋
      const fishM = lam({ color: 0x3a5a8a }), rodM = lam({ color: 0x2a2420 });
      for (const [u, v, sd] of [[-12, -9.2, 1], [-6, -9.2, 1], [4, -9.2, 1], [10, -9.2, 1], [-10, 9.2, -1], [0, 9.2, -1], [8, 9.2, -1], [14, 9.2, -1]]) {
        const [x, z] = F.w(u, v), [tx, tz] = F.w(u, v + sd * 4);
        bake(fishM, new THREE.BoxGeometry(0.6, 0.9, 0.5).translate(x, 0.7, z)); bake(lam({ color: 0xe8c8a8 }), new THREE.BoxGeometry(0.35, 0.35, 0.35).translate(x, 1.35, z));
        const g = new THREE.CylinderGeometry(0.03, 0.03, 4.2, 4); g.rotateX(Math.PI / 2 - 0.5); g.rotateY(Math.atan2(tx - x, tz - z)); bake(rodM, g.translate((x + tx) / 2, 1.8, (z + tz) / 2));
      }
      for (let k = 0; k < 10; k++) { const [x, z] = F.w(rr(-22, 16), rr(-6, 6)); bake(lam({ color: pick([0xe87a2a, 0xf0f0e8, 0x2a2a2a]) }), new THREE.BoxGeometry(0.5, 0.05, 0.18).rotateY(rr(0, 3)).translate(x, -1.5, z)); }   // 鯉
      FISH_BB = polyBB(F.rect(-27, -11, 21, 11)); LM_HEIGHT_AREAS.unshift(['市ヶ谷フィッシュセンター', (x, z, y) => y > -1 && y < 5 && inPoly(F.rect(-27, -11, 21, 11), x, z)]);
      LM_LABELS.push(['釣り堀', ...F.w(-2, 0), '🎣', '市ヶ谷フィッシュセンター']);
    }
    // ===== 防衛省 (市ヶ谷地区。東京裁判の法廷だった大講堂を移した市ヶ谷記念館がある) =====
    const MD = [-1836, -2506, -1690, -2400];
    {
      LM_ZONES.push(rectPoly(...MD)); fr(...MD, '#a8a294');
      const fence = (x0, z0, x1, z1) => pushPrism('CONC', 'CONC', rectPoly(x0, z0, x1, z1), 0, 2.4);
      fence(MD[0], MD[3] - 0.6, -1772, MD[3]); fence(-1748, MD[3] - 0.6, MD[2], MD[3]); fence(MD[0], MD[1], MD[2], MD[1] + 0.6); fence(MD[0], MD[1], MD[0] + 0.6, MD[3]); fence(MD[2] - 0.6, MD[1], MD[2], MD[3]);
      for (const x of [-1772, -1749]) pushPrism('TKSTONE', 'TKSTONE', rectPoly(x - 0.8, MD[3] - 1.2, x + 0.8, MD[3]), 0, 3.4);   // 正門
      pushPrism(acGothic('YT_MOD2', '#b8b8b4', '#3a4450', null, { rowH: 4, step: 3, ww: 2, wh: 2, lit: 0.6 }), 'ROOF', rectPoly(-1806, -2480, -1726, -2448), 0, 88);   // A棟
      pushPrism('CONC', 'ROOF', rectPoly(-1770, -2468, -1762, -2460), 88, 96); pushPrism('RAIL', null, regularPoly(-1766, -2464, 1.2, 6), 96, 130, { solid: false });   // 屋上の通信塔
      pushPrism(acGothic('YT_KINEN', '#e6dcc4', '#4a4a50', '#cfc4aa', { rowH: 8, step: 4, ww: 2, wh: 5, lit: 0.3 }), 'ROOF', rectPoly(-1826, -2440, -1796, -2418), 0, 10);   // 市ヶ谷記念館
      pushPrism('YT_KINEN', 'ROOF', rectPoly(-1814, -2442, -1808, -2436), 10, 15);
      for (const [x0, z0, x1, z1, h] of [[-1720, -2496, -1696, -2440, 40], [-1830, -2500, -1812, -2456, 30], [-1716, -2432, -1696, -2408, 22]]) pushPrism('office', 'ROOF', rectPoly(x0, z0, x1, z1), 0, h);
      tiles(-1772, -2440, -1749, MD[3], '#c8c0b0', '#b8b0a0', 3);
      for (let k = 0; k < 40; k++) { const x = rr(MD[0] + 3, MD[2] - 3), z = rr(MD[1] + 3, MD[3] - 3); if (acFree(x, z)) ROUND.push([x, z, rr(1, 1.3)]); }
    }
    // ===== 法政大学 市ケ谷キャンパス (ボアソナード・タワー) =====
    {
      const F = chuoFrame(5, 0.4);
      LM_ZONES.push(F.rect(-48, 12, 48, 82)); polyFr(F.rect(-48, 12, 48, 82), '#b0a898');
      pushPrism(acGothic('YT_HOSEI', '#c8ccd2', '#34404c', null, { rowH: 4, step: 3, ww: 2, wh: 2, lit: 0.6 }), 'ROOF', F.rect(-16, 32, 16, 58), 0, 122);
      pushPrism('ROOF', 'ROOF', F.rect(-12, 36, 12, 54), 122, 126);
      pushPrism('YT_MOD', 'ROOF', F.rect(20, 16, 46, 44), 0, 30); pushPrism('glass', 'ROOF', F.rect(-46, 16, -22, 46), 0, 42);
      polyFr(F.rect(-18, 14, 18, 30), '#cfc6b0');
      LM_PEOPLE.push([[...F.w(-40, 20), ...F.w(40, 20)], 10]);
      SPOT_AREAS.push(['法政大学 市ケ谷キャンパス', ...polyBB(F.rect(-48, 12, 48, 82))]);
      LM_LABELS.push(['法政大学', ...F.w(0, 45), '🎓', '法政大学 市ケ谷キャンパス']);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['聖イグナチオ教会', -1966, -2098, -1928, -2066], ['上智大学 四谷キャンパス', ...SU], ['真田堀 (上智大学グラウンド)', -1884, -2100, -1836, -1910], ['防衛省 (市ヶ谷地区)', ...MD]);
    LM_LABELS.push(['上智大学', -1912, -2040, '🎓', '上智大学 四谷キャンパス'], ['イグナチオ教会', -1950, -2082, '⛪', '聖イグナチオ教会'], ['真田堀', -1860, -2010, '⚾', '真田堀 (上智大学グラウンド)'], ['防衛省', -1766, -2464, '🏛', '防衛省 (市ヶ谷地区)']);
    Object.assign(LM_NOTES, {
      '外堀': '江戸城のいちばん外側の濠。四ツ谷から飯田橋までは、市谷濠・新見附濠・牛込濠と水面が続く',
      '上智大学 四谷キャンパス': '1913年にイエズス会が開いた大学。四ツ谷駅の目の前にある',
      '聖イグナチオ教会': 'だ円形の白い聖堂のカトリック教会。結婚式や、クリスマスのミサには大勢の人が集まる',
      '真田堀 (上智大学グラウンド)': '江戸城の外堀を埋めた場所で、いまは大学のグラウンド。名前は、この堀を掘った真田家にちなむ',
      '市ヶ谷フィッシュセンター': '外堀の中にある釣り堀。中央線の電車からもよく見える',
      '防衛省 (市ヶ谷地区)': '敷地は約25ha。東京裁判の法廷になった大講堂などを移して復元した「市ヶ谷記念館」がある',
      '法政大学 市ケ谷キャンパス': '高層の「ボアソナード・タワー」は、法政大学の前身の学校で教えたフランスの法学者ボアソナードにちなむ',
      '市ケ谷橋': '市ケ谷駅の上で外堀を渡る橋',
      '新見附橋': '外堀に架かる橋。市ケ谷と飯田橋のあいだ',
    });
    Object.assign(LM_TIPS, {
      '市ヶ谷フィッシュセンター': '平日は11時から',
      '防衛省 (市ヶ谷地区)': '「市ヶ谷台ツアー」は平日の午前・午後に1回ずつ、事前予約制で見学できる',
    });
    LM_ACH.push(['tsuribori', '🎣 都心の釣り堀', '市ヶ谷フィッシュセンターの桟橋に立つ', () => P.y > 0 && P.y < 1 && FISH_BB && inR(FISH_BB, P.x, P.z)]);
    bakeFlush();
  },
});
