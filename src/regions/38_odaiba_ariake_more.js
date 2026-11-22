/* お台場・有明 (追加の名所): ダイバーシティ東京 プラザ / 東京ジョイポリス (デックス東京ビーチの中) /
   有明アリーナ / 有明ガーデン (東京ガーデンシアター) / スモールワールズ TOKYO */
REGION({
  name: 'お台場・有明 (追加の名所)',
  towns: [],
  labels: [],
  build(r) {
    const C = (key, o) => { if (!WALL[key]) WALL[key] = lam(o); return key; };
    // ===== ダイバーシティ東京 プラザ (2012年開業。前の広場に実物大のロボットの立像) =====
    {
      const DV = [930, 1330, 1080, 1432];
      LM_ZONES.push(rectPoly(912, DV[1], DV[2], DV[3])); tiles(912, DV[1], 930, DV[3], '#d4ccbc', '#c4bcac', 3);
      pushPrism(acGothic('LM_TOWERGL', '#b8c4cc', '#4e6274', null, { rowH: 3, step: 2, ww: 2, wh: 2, lit: 0.6 }), 'ROOF', rectPoly(...DV), 0, 36);
      pushPrism('glass', null, rectPoly(DV[0] - 0.4, 1350, DV[0] + 0.1, 1412), 0.2, 14, { solid: false });
      const ds = glow(lam({ map: textTex('DiverCity Tokyo Plaza', '#e8e8ec', '#1a2a5a', 192, 28) }), '#ffffff', 0.8);
      bake(ds, new THREE.PlaneGeometry(22, 2.6).rotateY(-Math.PI / 2).translate(DV[0] - 0.3, 24, 1381));
      LM_PEOPLE.push([[916, 1334, 916, 1428], 14]);
      SPOT_AREAS.unshift(['ダイバーシティ東京 プラザ', 912, DV[1], DV[2], DV[3]]);
      LM_LABELS.push(['ダイバーシティ', 1005, 1381, '🛍', 'ダイバーシティ東京 プラザ']);
    }
    // ===== 東京ジョイポリス (デックス東京ビーチの3〜5階。屋内のテーマパーク) =====
    {
      const jm = glow(lam({ map: textTex('TOKYO JOYPOLIS', '#5a1a8a', '#ffe860', 160, 28) }), '#c080ff', 1);
      bake(jm, new THREE.PlaneGeometry(18, 2.6).rotateY(Math.PI).translate(800, 22, 964.6));
      SPOT_AREAS.unshift(['東京ジョイポリス (デックス東京ビーチ)', 770, 942, 830, 965]);
      LM_LABELS.push(['ジョイポリス', 800, 975, '🎢', '東京ジョイポリス (デックス東京ビーチ)']);
    }
    // ===== 有明アリーナ (2019年完成。東京2020オリンピックのバレーボール会場) =====
    {
      const AX = 1360, AZ = 470;
      LM_ZONES.push(rectPoly(AX - 64, AZ - 54, AX + 64, AZ + 54)); tiles(AX - 64, AZ - 54, AX + 64, AZ + 54, '#d0ccc4', '#c0bcb4', 4);
      const ov = (rx, rz) => regularPoly(0, 0, 1, 24).map(([x, z]) => [AX + x * rx, AZ + z * rz]);
      pushPrism(acGothic('OA_ARENA', '#c8ccd0', '#3a4652', null, { rowH: 5, step: 2, ww: 1, wh: 4, lit: 0.5 }), null, ov(56, 44), 0, 22);
      mesh(new THREE.SphereGeometry(1, 24, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(57, 14, 45), lam({ color: 0xe8eaec }), AX, 22, AZ);
      for (const [k, s] of [[0, 0.98], [1, 0.8], [2, 0.55]]) solid(AX - 40 * s, AZ - 30 * s, AX + 40 * s, AZ + 30 * s, 22, 22 + 14 * Math.sqrt(1 - (s * 0.85) ** 2));
      frontSign(AXIS, AX, AZ + 44.6, 1, 'ARIAKE ARENA', '#2a2a2e', '#f0e8d8', 14, 1.6, 12);
      LM_PEOPLE.push([[AX - 60, AZ + 50, AX + 60, AZ + 50], 10]);
      SPOT_AREAS.unshift(['有明アリーナ', AX - 57, AZ - 45, AX + 57, AZ + 45]);
      LM_HEIGHT_AREAS.unshift(['有明アリーナの屋根の上', (x, z, y) => y > 22 && Math.hypot((x - AX) / 57, (z - AZ) / 45) < 1]);
      LM_LABELS.push(['有明アリーナ', AX, AZ, '🏐', '有明アリーナ']);
    }
    // ===== 有明ガーデン (ショッピングモールと東京ガーデンシアター) =====
    {
      const GD = [1560, 414, 1720, 528];
      LM_ZONES.push(rectPoly(...GD)); tiles(...GD, '#d4ccbc', '#c4bcac', 4);
      pushPrism(acGothic('LM_TOWERST', '#c4beb4', '#3e4650', null, { rowH: 3, step: 3, ww: 2, wh: 2, lit: 0.55 }), 'GRASSTOP', rectPoly(1566, 420, 1714, 470), 0, 20);
      pushPrism(C('OA_THEATER', { color: 0x3a3e46 }), 'ROOF', rectPoly(1640, 476, 1714, 524), 0, 32);   // 東京ガーデンシアター
      frontSign(AXIS, 1677, 524.2, 1, 'TOKYO GARDEN THEATER', '#1e1e22', '#f0d890', 18, 1.8, 20);
      frontSign(AXIS, 1610, 470.2, 1, 'ARIAKE GARDEN', '#2a4a3a', '#ffffff', 14, 1.6, 12);
      for (let k = 0; k < 16; k++) ROUND.push([rr(1568, 1712), rr(422, 468), 0.8, 20]);   // 屋上の庭
      LM_PEOPLE.push([[1562, 474, 1636, 474], 10], [[1636, 526, 1562, 526], 8]);
      SPOT_AREAS.unshift(['東京ガーデンシアター', 1640, 476, 1714, 524], ['有明ガーデン', ...GD]);
      LM_LABELS.push(['ガーデンシアター', 1677, 500, '🎤', '東京ガーデンシアター'], ['有明ガーデン', 1640, 445, '🛍']);
    }
    // ===== スモールワールズ TOKYO (2020年開業。世界最大級の屋内ミニチュアのテーマパーク) =====
    {
      const SW = [1620, 562, 1700, 640];
      LM_ZONES.push(rectPoly(SW[0] - 2, SW[1] - 2, SW[2] + 2, SW[3] + 2));
      pushPrism(C('OA_SMALLW', { color: 0xe8e4dc }), 'ROOF', rectPoly(...SW), 0, 26);
      frontSign(AXIS, 1660, SW[1] - 0.2, -1, 'SMALL WORLDS TOKYO', '#f0d020', '#1a1a1a', 18, 2, 16);
      // 小さな家並み (入口の横の飾り)
      const mini = [lam({ color: 0xd84a3a }), lam({ color: 0x4a8ad8 }), lam({ color: 0xf0c040 }), lam({ color: 0x5ab060 })];
      for (let k = 0; k < 10; k++) bake(mini[k % 4], new THREE.BoxGeometry(0.8, 0.6 + (k % 3) * 0.3, 0.8).translate(1624 + k * 1.2, 0.4, SW[1] - 1.6));
      SPOT_AREAS.unshift(['スモールワールズ TOKYO', ...SW]);
      LM_LABELS.push(['スモールワールズ', 1660, 600, '🏘', 'スモールワールズ TOKYO']);
    }
    Object.assign(LM_NOTES, {
      'ダイバーシティ東京 プラザ': '2012年にできたショッピングモール。前の広場には、高さ約20mの実物大の「ユニコーンガンダム」の立像が立っている',
      '東京ジョイポリス (デックス東京ビーチ)': '1996年にできた、デックス東京ビーチの中にある屋内のテーマパーク。雨の日でもジェットコースターに乗れる',
      '有明アリーナ': '2019年に完成したアリーナ。東京2020オリンピック・パラリンピックではバレーボールと車いすバスケットボールの会場になった',
      '有明アリーナの屋根の上': '白い大屋根の上。まわりの埋立地と、海の向こうの都心のビル群が見える',
      '有明ガーデン': 'ショッピングモール・ホテル・劇場・温泉が集まった有明の街',
      '東京ガーデンシアター': '2020年にできた、約8000人が入る劇場型のホール。客席がステージを囲むように何層にも重なっている',
      'スモールワールズ TOKYO': '2020年にできた、世界最大級の屋内ミニチュアのテーマパーク。宇宙センターや空港の細かいミニチュアがあり、小さな人形の住民がいる',
    });
    bakeFlush();
  },
});
