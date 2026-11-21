/* 御茶ノ水 (神田川の谷・湯島聖堂・聖橋・ニコライ堂・明治大学・東京科学大学)
   神田川 (regions/00_geography.js) が西から東へ流れ、本郷通りが聖橋で、明大通りがお茶の水橋で川をまたぐ
   北岸: 湯島聖堂 (本郷通りの東)・東京科学大学 (本郷通りの西)  /  南岸: ニコライ堂・明治大学 (リバティタワー・アカデミーコモン) */
REGION({
  name: '御茶ノ水',
  towns: [['湯島', -60, -2900], ['駿河台', -200, -2690], ['御茶ノ水', -150, -2760], ['神田淡路町', 40, -2680]],
  labels: [],
  build(r) {
    const MOD = acGothic('OC_MOD', '#c4beb2', '#3e4a56', null, { rowH: 6, step: 3, ww: 2, wh: 3, lit: 0.55 });
    const BLK = lam({ color: 0x24201e }), BLK2 = lam({ color: 0x3a3430 }), BR = WALL.BRONZE, GOLD = lam({ color: 0xc8a040, emissive: 0x302000 });
    if (!WALL.OC_BLACK) WALL.OC_BLACK = BLK;

    // ===== 道路: 本郷通り (聖橋) と明大通り (お茶の水橋) =====
    acRoad([-120, -2640, -100, -2766], 'ns', '本郷通り'); acRoad([-120, -2818, -100, -3010], 'ns', '本郷通り');
    acRoad([-238, -2640, -226, -2779], 'ns', '明大通り'); acRoad([-238, -2831, -226, -2970], 'ns', '外堀通り (湯島)');
    // 川の両岸の緑の土手 (御茶ノ水は深い谷になっている)
    {
      const R = GEO_RIVERS.find(v => v.name === '神田川'), BRS = R.bridges.map(b => [b[1], b[2]]);
      for (let i = 0; i < R.pts.length - 1; i++) {
        const [ax, az] = R.pts[i], [bx, bz] = R.pts[i + 1], l = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / l, uz = (bz - az) / l, nx = -uz, nz = ux;
        for (const sd of [-1, 1]) {
          const s0 = R.w + 6, s1 = R.w + 16, Q = [[ax + nx * sd * s0, az + nz * sd * s0], [bx + nx * sd * s0, bz + nz * sd * s0], [bx + nx * sd * s1, bz + nz * sd * s1], [ax + nx * sd * s1, az + nz * sd * s1]];
          polyFr(Q, '#5a7e44'); LM_ZONES.push(Q);
          for (let t = 4; t < l; t += 7) { const x = ax + ux * t + nx * sd * rr(s0 + 2, s1 - 1), z = az + uz * t + nz * sd * rr(s0 + 2, s1 - 1); if (BRS.some(([px, pz]) => Math.hypot(px - x, pz - z) < 18)) continue; (rnd() < 0.4 ? SAKURA : rnd() < 0.5 ? ROUND : PINES).push([x, z, rr(0.9, 1.25)]); }
        }
      }
    }

    // ===== 湯島聖堂 (1690年、5代将軍・徳川綱吉が建てた孔子廟。のちの昌平坂学問所) =====
    const SX = -46;   // 南北の軸
    {
      const S = [-94, -2882, 0, -2812];
      LM_ZONES.push(rectPoly(...S)); fr(...S, '#8a8270');
      const tw = (x0, z0, x1, z1) => pushPrism('OC_BLACK', 'ROOF', rectPoly(x0, z0, x1, z1), 0, 3);   // 黒い塀
      tw(S[0], S[1], S[2], S[1] + 0.8); tw(S[0], S[3] - 0.8, S[2], S[3]); tw(S[2] - 0.8, S[1], S[2], S[3]); tw(S[0], S[1], S[0] + 0.8, -2830); tw(S[0], -2818, S[0] + 0.8, S[3]);
      // 仰高門 (本郷通りに面した入口) と孔子像 (高さ4.57m)
      for (const z of [-2830, -2818]) pushPrism('OC_BLACK', 'OC_BLACK', rectPoly(S[0] - 0.5, z - 0.5, S[0] + 1.3, z + 0.5), 0, 4.2);
      jRoof('RF0', S[0] - 2, -2832, S[0] + 2.8, -2816, 4.2, 1.6, { over: 0.4, kind: 'hip' });
      tiles(S[0] + 1, -2830, SX - 6, -2818, '#bcb4a0', '#aca490', 2); tiles(SX - 6, -2830, SX + 6, -2812, '#bcb4a0', '#aca490', 2);
      acStatue(-80, -2840, 0, 2.5, 0, BR, 'stand', { w: 2.4, h: 1.2, mat: 'TKSTONE' });
      for (let k = 0; k < 40; k++) { const x = rr(S[0] + 3, S[2] - 3), z = rr(S[1] + 3, S[3] - 3); if (Math.abs(x - SX) < 30 && z < -2832) continue; if (Math.abs(x - SX) < 8 || (Math.abs(z + 2824) < 8 && x < SX) || !acFree(x, z)) continue; (rnd() < 0.5 ? PINES : ROUND).push([x, z, rr(0.9, 1.2)]); }
      // 入徳門 → 杏壇門 → 回廊に囲まれた庭 → 大成殿 (黒い孔子廟の正殿)
      for (const [z, w, h] of [[-2832, 6, 4], [-2846, 10, 6]]) {
        for (const dx of [-w / 2, w / 2 - 1]) pushPrism('OC_BLACK', 'OC_BLACK', rectPoly(SX + dx, z - 1, SX + dx + 1, z + 1), 0, h);
        jRoof('RF0', SX - w / 2 - 1, z - 2.4, SX + w / 2 + 1, z + 2.4, h, 2, { over: 0.6, kind: 'hip' });
      }
      const CL = [SX - 26, -2880, SX + 26, -2846];
      for (const [x0, z0, x1, z1] of [[CL[0], CL[1], CL[0] + 4, CL[3]], [CL[2] - 4, CL[1], CL[2], CL[3]], [CL[0], CL[3] - 4, SX - 6, CL[3]], [SX + 6, CL[3] - 4, CL[2], CL[3]]]) {
        pushPrism('OC_BLACK', 'ROOF', rectPoly(x0, z0, x1, z1), 0, 3.6); oHip(AXIS, 'RF0', x0, z0, x1, z1, 3.6, 1.4, { over: 0.5 });
      }
      tiles(CL[0] + 4, CL[1] + 16, CL[2] - 4, CL[3] - 4, '#9e9688', '#8e8678', 3);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(SX - 13, -2878, SX + 13, -2862), 0, 1.2);
      pushPrism('OC_BLACK', 'ROOF', rectPoly(SX - 11, -2876, SX + 11, -2864), 1.2, 9);
      jRoof('RF0', SX - 12, -2877, SX + 12, -2863, 9, 4.2, { over: 1.4, kind: 'irimoya' });
      for (const dx of [-11.5, 11.5]) bake(BLK2, new THREE.BoxGeometry(1, 1.4, 0.8).translate(SX + dx, 13.6, -2870));   // 屋根の上の鬼犾頭 (しゃちほこのような飾り)
      for (let dx = -9; dx <= 9; dx += 3) bake(GOLD, new THREE.BoxGeometry(0.3, 6, 0.3).translate(SX + dx, 4.4, -2863.8));
      stairs([SX - 4, -2862, SX + 4, -2858], 1.2, 'z-');
      LM_PEOPLE.push([[S[0] + 3, -2824, SX, -2824], 5], [[SX, -2830, SX, -2856], 4]);
    }
    // ===== ニコライ堂 (東京復活大聖堂。1891年完成の、緑のドームの教会) =====
    {
      const NX = -56, NZ = -2740;
      LM_ZONES.push(rectPoly(NX - 26, NZ - 22, NX + 26, NZ + 22)); fr(NX - 26, NZ - 22, NX + 26, NZ + 22, '#b8b0a0');
      const WT = acGothic('OC_NIK', '#d8d0bc', '#4a4038', '#bcb4a0', { rowH: 8, step: 4, ww: 2, wh: 5, lit: 0.3 });
      pushPrism(WT, 'RF_COPPER', rectPoly(NX - 16, NZ - 7, NX + 14, NZ + 7), 0, 14); pushPrism(WT, 'RF_COPPER', rectPoly(NX - 6, NZ - 14, NX + 6, NZ + 14), 0, 14);
      pushPrism(WT, 'RF_COPPER', regularPoly(NX, NZ, 8, 16), 14, 22);
      const CU = WALL.RF_COPPER; mesh(new THREE.SphereGeometry(9, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), CU, NX, 22, NZ);
      bake(GOLD, new THREE.BoxGeometry(0.3, 3.5, 0.3).translate(NX, 32.5, NZ)); bake(GOLD, new THREE.BoxGeometry(2, 0.3, 0.3).translate(NX, 33.4, NZ));
      pushPrism(WT, 'RF_COPPER', rectPoly(NX + 14, NZ - 5, NX + 22, NZ + 5), 0, 26);   // 鐘楼
      mesh(new THREE.ConeGeometry(4.2, 7, 8), CU, NX + 18, 29.5, NZ); bake(GOLD, new THREE.BoxGeometry(0.25, 2.4, 0.25).translate(NX + 18, 34, NZ));
      for (let k = 0; k < 10; k++) ROUND.push([NX + rr(-24, 24), NZ + rr(16, 21), 1]);
    }
    // ===== 東京科学大学 湯島キャンパス (2024年、東京工業大学と東京医科歯科大学が統合) =====
    {
      const T = [-216, -2960, -126, -2818];
      LM_ZONES.push(rectPoly(...T)); fr(...T, '#a8a294');
      pushPrism(MOD, 'ROOF', rectPoly(-200, -2905, -150, -2860), 0, 95); pushPrism('ROOF', 'ROOF', rectPoly(-196, -2901, -154, -2864), 95, 99);
      pushPrism(MOD, 'ROOF', rectPoly(-210, -2950, -134, -2915), 0, 36); pushPrism(MOD, 'ROOF', rectPoly(-210, -2850, -170, -2824), 0, 22);
      for (let k = 0; k < 30; k++) { const x = rr(-210, -132), z = rr(-2956, -2822); if (acFree(x, z)) ROUND.push([x, z, 1]); }
    }
    // ===== 明治大学 駿河台キャンパス (リバティタワー・アカデミーコモン = 明治大学博物館) =====
    {
      LM_ZONES.push(rectPoly(-300, -2700, -244, -2620), rectPoly(-220, -2710, -168, -2650)); fr(-300, -2700, -244, -2620, '#b8b0a0'); fr(-220, -2710, -168, -2650, '#b8b0a0');
      const LT = acGothic('OC_LIB', '#d4d2cc', '#4a5a6a', '#bcbab2', { rowH: 5, step: 3, ww: 2, wh: 3, lit: 0.55 });
      pushPrism(LT, 'ROOF', rectPoly(-292, -2680, -254, -2640), 0, 104);
      pushPrism(LT, 'ROOF', rectPoly(-286, -2674, -260, -2646), 104, 112);
      pushSlope('ROOF', 'ROOF', [-273, -2674], [-273, -2646], 13, 112, 119.6, 0.6);   // てっぺんの斜めの屋根
      pushPrism('glass', 'ROOF', rectPoly(-298, -2698, -248, -2682), 0, 9);
      pushPrism(acGothic('OC_ACM', '#cac6bc', '#3e4a56', '#b0aca2', { rowH: 6, step: 4, ww: 3, wh: 3, lit: 0.5 }), 'ROOF', rectPoly(-216, -2704, -172, -2664), 0, 45);
      pushPrism('glass', 'ROOF', rectPoly(-216, -2664, -190, -2654), 0, 6);
      LM_PEOPLE.push([[-296, -2690, -250, -2690], 8], [[-214, -2658, -176, -2658], 6]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['大成殿 (湯島聖堂)', SX - 14, -2880, SX + 14, -2856], ['孔子像 (湯島聖堂)', -88, -2848, -72, -2832], ['仰高門', -98, -2834, -88, -2814], ['湯島聖堂', -94, -2882, 0, -2812],
      ['ニコライ堂', -82, -2762, -30, -2718], ['リバティタワー (明治大学)', -300, -2700, -244, -2620], ['明治大学博物館 (アカデミーコモン)', -220, -2710, -168, -2650], ['東京科学大学 湯島キャンパス', -216, -2960, -126, -2818]);
    LM_HEIGHT_AREAS.unshift(['リバティタワーの屋上', (x, z, y) => y > 100 && inR([-294, -2682, -252, -2638], x, z)]);
    LM_LABELS.push(['湯島聖堂', SX, -2850, '📜'], ['ニコライ堂', -56, -2740, '⛪'], ['明治大学', -273, -2660, '🎓', 'リバティタワー (明治大学)'], ['明大博物館', -194, -2684, '🏛', '明治大学博物館 (アカデミーコモン)'], ['東京科学大学', -175, -2882, '🔬', '東京科学大学 湯島キャンパス']);
    Object.assign(LM_NOTES, {
      '湯島聖堂': '1690年、5代将軍・徳川綱吉が建てた孔子をまつる廟。のちに幕府の「昌平坂学問所」が置かれ、「日本の学校教育発祥の地」の碑が立つ',
      '大成殿 (湯島聖堂)': '孔子をまつる正殿。黒い建物と屋根の上の飾りが目印。受験生の合格祈願でも人気',
      '孔子像 (湯島聖堂)': '高さ4.57mで、世界最大の孔子像といわれる',
      '仰高門': '湯島聖堂の入口の門。明治になると、ここに文部省や博物館、師範学校が置かれ「近代教育発祥の地」にもなった',
      'ニコライ堂': '1891年完成の、緑のドームをもつ正教会の大聖堂。国の重要文化財',
      '聖橋': '湯島聖堂とニコライ堂、2つの「聖堂」を結ぶので聖橋。関東大震災のあとの1927年に架けられたアーチ橋',
      '神田川': '御茶ノ水の深い谷は、江戸時代に台地を掘り割ってつくったもの',
      'お茶の水橋': '明大通りが神田川を渡る橋。川沿いの崖の下を中央線が走る',
      'リバティタワー (明治大学)': '明治大学 駿河台キャンパスのシンボルの高層校舎',
      '明治大学博物館 (アカデミーコモン)': '刑事・考古・商品の3部門の大学博物館。江戸時代の捕り物道具などが見られる',
      '東京科学大学 湯島キャンパス': '2024年10月、東京工業大学と東京医科歯科大学が統合して東京科学大学になった。湯島は医学・歯学の拠点',
    });
    Object.assign(LM_TIPS, {
      '湯島聖堂': '9:00〜17:00 (冬は16:00まで)、予約不要。大成殿の中は土日祝の10:00から公開',
      '大成殿 (湯島聖堂)': '中に入れるのは土日祝 (10:00〜閉門まで)',
      '明治大学博物館 (アカデミーコモン)': '入館無料。月〜金 10:00〜17:00 (入館16:30まで)、土 10:00〜16:00、日祝は休館',
    });
    LM_ACH.push(['goukaku', '📜 合格祈願', '湯島聖堂の大成殿をお参りする', () => inR([SX - 14, -2880, SX + 14, -2856], P.x, P.z)]);
    bakeFlush();
  },
});
