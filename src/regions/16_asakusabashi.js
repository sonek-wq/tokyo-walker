/* 浅草橋・柳橋・両国橋西詰・蔵前 (神田川が隅田川に注ぐあたり)
   江戸通り (x ≒ 790) が浅草橋で神田川を渡る。北は人形問屋街から蔵前へ。神田川の河口の柳橋には屋形船がつながれ、南の両国橋西詰は江戸の盛り場「両国広小路」 */
REGION({
  name: '浅草橋',
  towns: [['浅草橋一丁目', 800, -2700], ['柳橋', 880, -2650], ['東日本橋', 830, -2520], ['蔵前', 900, -2800]],
  labels: [],
  build(r) {
    acRoad([780, -2900, 800, -2665], 'ns', '江戸通り (浅草橋)', { trees: false }); acRoad([780, -2613, 800, -2470], 'ns', '江戸通り');
    acRoad([640, -2470, 912, -2456], 'ew', '靖国通り (両国)'); acRoad([800, -2745, 1040, -2733], 'ew', '蔵前橋通り');
    const R = GEO_RIVERS.find(v => v.name === '神田川');
    const seg = (a, b) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L; return { L, ux, uz, F: frame(a[0], a[1], ux, uz, -uz, ux) }; };

    // ===== 人形問屋街 (江戸通りの浅草橋の北。ひな人形・五月人形の老舗が並ぶ) =====
    {
      const W = ['人形', 'ひな人形', '五月人形', '節句人形', '羽子板', 'こいのぼり', '人形', '雛', '兜'];
      const WM = W.map(w => glow(new THREE.MeshLambertMaterial({ map: textTex(w, '#8a1a1a', '#fff0d0', 96, 24) }), '#ffc8a0', 0.7));
      const red = lam({ color: 0xc8302a }), doll = [lam({ color: 0xe8202a }), lam({ color: 0x2a3a8a }), lam({ color: 0xf0d8c0 }), lam({ color: 0xd8b040 })];
      LM_ZONES.push(rectPoly(750, -2790, 778, -2676), rectPoly(802, -2790, 830, -2676));   // (北の端は総武線の高架)
      for (const [x0, x1, fx, ry] of [[752, 778, 778.3, Math.PI / 2], [802, 828, 801.7, -Math.PI / 2]]) for (let z = -2788; z < -2682;) {
        const w = Math.min(rr(8, 13), -2678 - z); pushPrism(pick(['office', 'brick', 'resi2', 'office2', 'JB_KS2']), 'ROOF', rectPoly(x0, z, x1, z + w), 0, rr(12, 30));
        bake(pick(WM), new THREE.PlaneGeometry(Math.min(5, w - 1), 1.3).rotateY(ry).translate(fx, 5.4, z + w / 2));
        // ショーウィンドウのひな壇 (赤い段に小さな人形)
        const sx = fx + (ry > 0 ? -0.6 : 0.6);
        for (let s = 0; s < 3; s++) bake(red, new THREE.BoxGeometry(0.5, 0.3, 2.4 - s * 0.5).translate(sx + (ry > 0 ? -s * 0.4 : s * 0.4), 0.5 + s * 0.3, z + w / 2));
        for (let s = 0; s < 3; s++) for (let k = 0; k < 3 - s; k++) bake(pick(doll), new THREE.BoxGeometry(0.16, 0.24, 0.16).translate(sx + (ry > 0 ? -s * 0.4 : s * 0.4), 0.78 + s * 0.3, z + w / 2 - (2 - s - 1) * 0.35 + k * 0.7 - 0.35));
        z += w;
      }
      LM_PEOPLE.push([[776, -2788, 776, -2668], 12], [[804, -2668, 804, -2788], 10]);
    }
    // ===== 柳橋の船宿と、つながれた屋形船 =====
    const S = seg(R.pts[13], R.pts[14]);   // [800,-2640] → [880,-2610]
    {
      for (let u = 42; u < S.L - 8; u += 12) {   // 北岸の船宿・料亭 (木造2階建て。西のはしは総武線の高架)
        pushPrism('WOOD', 'ROOF', S.F.rect(u, -30, u + 10, -17), 0, 7);
        oHip(S.F, 'RF0', u, -30, u + 10, -17, 7, 2.6, { over: 0.8 });
      }
      LM_ZONES.push(S.F.rect(40, -32, S.L, -16));
      const hull = lam({ color: 0x3a2a22 }), wall = lam({ color: 0xe8dcc0 }), roof = lam({ color: 0x2a2a2e }), lan = glow(lam({ color: 0xd8382a }), '#ff5030', 0.9);
      const ang = Math.atan2(-S.uz, S.ux);
      const boat = (u, v) => {   // 屋形船: 屋根の低い木の船。軒に赤い提灯
        const [x, z] = S.F.w(u, v), g = (geo, m, y) => bake(m, geo.rotateY(ang).translate(x, y, z));
        g(new THREE.BoxGeometry(15, 1.0, 3.6), hull, -1.2); g(new THREE.BoxGeometry(13, 1.6, 3.2), wall, 0.1); g(new THREE.BoxGeometry(13.8, 0.25, 3.9), roof, 1.0);
        for (let k = -6; k <= 6; k += 1.5) for (const s of [-2, 2]) { const ox = k * Math.cos(ang), oz = -k * Math.sin(ang), px = s * Math.sin(ang), pz = s * Math.cos(ang); bake(lan, new THREE.SphereGeometry(0.22, 6, 4).translate(x + ox + px, 0.7, z + oz + pz)); }
      };
      for (const [u, v] of [[14, -6.5], [32, -6.5], [52, -6.5], [22, 6.5], [44, 6.5], [66, 6.5]]) boat(u, v);
      // 柳橋 (1929年完成の緑のアーチ橋) のアーチ
      const S2 = seg(R.pts[14], R.pts[15]), YB = [905, -2594];
      const t = ((YB[0] - R.pts[14][0]) * S2.ux + (YB[1] - R.pts[14][1]) * S2.uz), cx = R.pts[14][0] + S2.ux * t, cz = R.pts[14][1] + S2.uz * t;
      const nx = -S2.uz, nz = S2.ux, green = lam({ color: 0x3a7a62 });
      for (const side of [-10.4, 10.4]) for (let k = -12; k < 12; k++) {
        const s0 = k, s1 = k + 1, y = s => 3.2 + 6.5 * (1 - (s / 13) ** 2), mid = (s0 + s1) / 2;
        const x = cx + nx * mid + S2.ux * side, z = cz + nz * mid + S2.uz * side, a = Math.atan2(y(s1) - y(s0), 1);
        bake(green, new THREE.BoxGeometry(1.05, 0.5, 0.5).rotateZ(a).rotateY(Math.atan2(-nz, nx)).translate(x, y(mid), z));
        if (k % 3 === 0) bake(green, new THREE.BoxGeometry(0.15, y(mid) - 3.2, 0.15).translate(x, 3.2 + (y(mid) - 3.2) / 2, z));
      }
      LM_PEOPLE.push([[...S.F.w(4, -14), ...S.F.w(S.L - 4, -14)], 6]);
    }
    // ===== 両国橋西詰 (江戸一番の盛り場「両国広小路」の跡) =====
    {
      const PZ = [862, -2500, 912, -2474];
      LM_ZONES.push(rectPoly(...PZ)); tiles(...PZ, '#cfc6b0', '#c0b6a0', 2);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(880, -2490, 882, -2486), 0, 2.2);   // 「両国広小路」の碑
      for (let k = 0; k < 10; k++) ROUND.push([rr(864, 910), rr(-2498, -2492), 1]);
      LM_PEOPLE.push([[864, -2480, 910, -2480], 8]);
    }
    // ===== 蔵前 (江戸幕府の米蔵「浅草御蔵」があった町。いまはカフェや革・文具の工房が多い) =====
    {
      const W = ['COFFEE', '文房具', '革小物', '手ぬぐい', 'ギャラリー', 'BEER', 'チョコレート', 'ノート', '帽子'];
      const WM = W.map(w => glow(new THREE.MeshLambertMaterial({ map: textTex(w, '#2a2a2a', '#f0e8d8', 96, 24) }), '#fff0d0', 0.6));
      LM_ZONES.push(rectPoly(750, -2898, 778, -2752), rectPoly(802, -2898, 830, -2752));
      for (const [x0, x1, fx, ry] of [[752, 778, 778.3, Math.PI / 2], [802, 828, 801.7, -Math.PI / 2]]) for (let z = -2896; z < -2756;) {
        const w = Math.min(rr(7, 12), -2752 - z); pushPrism(pick(['CONC', 'brick', 'resi2', 'office2']), 'ROOF', rectPoly(x0, z, x1, z + w), 0, rr(9, 24));
        bake(pick(WM), new THREE.PlaneGeometry(Math.min(4.5, w - 1), 1.1).rotateY(ry).translate(fx, 3.4, z + w / 2));
        z += w;
      }
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(1028, -2728, 1031, -2725), 0, 2);   // 浅草御蔵跡の碑
      LM_PEOPLE.push([[776, -2896, 776, -2756], 8], [[804, -2756, 804, -2896], 6]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['浅草橋の人形問屋街', 750, -2790, 830, -2676], ['柳橋の船宿', ...polyBB(S.F.rect(0, -32, S.L, -16))], ['両国広小路跡 (両国橋西詰)', 860, -2502, 914, -2472], ['浅草御蔵跡', 1020, -2732, 1040, -2720], ['蔵前', 750, -2898, 830, -2752]);
    LM_LABELS.push(['人形問屋街', 790, -2730, '🎎', '浅草橋の人形問屋街'], ['屋形船', ...S.F.w(40, 0), '🚣', '柳橋の船宿'], ['両国広小路跡', 886, -2488, '🎆', '両国広小路跡 (両国橋西詰)'], ['蔵前', 790, -2830, '☕']);
    Object.assign(LM_NOTES, {
      '浅草橋の人形問屋街': 'ひな人形や五月人形の老舗が並ぶ問屋街。春の節句の前はとくににぎわう',
      '浅草橋': '江戸通りが神田川を渡る橋。橋の北は人形の問屋街',
      '柳橋': '神田川が隅田川に注ぐいちばん河口の橋。1929年、関東大震災の復興で架けられた緑のアーチ橋で、永代橋のデザインがもとになっている',
      '柳橋の船宿': '江戸時代は吉原へ向かう舟の発着場。いまも船宿があり、屋根の低い屋形船がつながれている',
      '両国広小路跡 (両国橋西詰)': '明暦の大火のあと、火事の広がりを防ぐ広場として作られ、夏は見世物小屋や茶屋が並ぶ江戸一番の盛り場になった',
      '浅草御蔵跡': '江戸幕府の米蔵「浅草御蔵」が隅田川沿いに並んでいた。「蔵前」の名はここから',
      '蔵前': '倉庫や問屋の町に、コーヒー店や革・文具の工房が増え、「東京のブルックリン」とも呼ばれる',
    });
    LM_ACH.push(['yakata', '🚣 柳橋の屋形船', '柳橋の船宿の前で屋形船を見る', () => { const dx = P.x - S.F.ox, dz = P.z - S.F.oz, u = dx * S.F.ux + dz * S.F.uz, v = dx * S.F.vx + dz * S.F.vz; return u > 0 && u < S.L && v > -20 && v < -12; }]);
    bakeFlush();
  },
});
