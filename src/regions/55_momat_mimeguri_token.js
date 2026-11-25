/* 北の丸・向島・両国に名所を追加
   - 東京国立近代美術館 (北の丸公園の東、皇居東御苑の北。日本で最初の国立美術館)
   - 三囲神社 (向島。隅田公園の東。三柱鳥居と、池袋の三越にあったライオン像)
   - 刀剣博物館 (両国。旧安田庭園の北。旧両国公会堂の形を受け継いだ円筒の建物) */
REGION({
  name: '近代美術館・三囲神社・刀剣博物館',
  towns: [['向島二丁目', 1800, -3770]],
  labels: [],
  build(r) {
    const { spot, sign, SHU, hall, windows, TREE_LISTS } = SL_KIT();
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); } if (col) fr(...R, col); };

    // ===== 東京国立近代美術館 =====
    {
      const R = [-698, -2514, -606, -2454];
      site(R, '#c8c2b4');
      tiles(-698, -2514, -606, -2506, '#bab4a6', '#aca698', 2);   // 北側の歩道
      const WL = windows('KM_MOMAT', '#6e6a62', '#3a4048', 8, 3);
      if (!WALL.KM_MOMATG) WALL.KM_MOMATG = lam({ color: 0x5a6e7a, emissive: 0x101820 });
      pushPrism('KM_MOMATG', 'CONC', rectPoly(-686, -2500, -620, -2472), 0, 4.5);   // 1階: ガラス張りのロビー
      pushPrism(WL, 'CONC', rectPoly(-690, -2504, -616, -2468), 4.5, 15);
      pushPrism('CONC', 'CONC', rectPoly(-694, -2508, -612, -2464), 15, 15.8);   // 水平に張り出す屋根
      pushPrism('CONC', 'CONC', rectPoly(-670, -2496, -636, -2476), 15.8, 19);   // 屋上の「眺めのよい部屋」
      for (const x of [-674, -632]) pushPrism('CONC', 'CONC', rectPoly(x - 0.6, -2507, x + 0.6, -2505.8), 0, 15);   // 庇を支える柱
      sign(-653, -2507.5, -1, '東京国立近代美術館', 14, 2.2, '#2a2a28', '#f0ece0');
      for (let x = -694; x < -608; x += 9) ROUND.push([x, -2459, rr(1, 1.3)]);
      LM_PEOPLE.push([[-696, -2510, -608, -2510], 6]);
      spot('東京国立近代美術館', R, '近代美術館', '🖼', '1952年に日本で最初の国立美術館として京橋で開館し、1969年にいまの北の丸公園へ移った。建物は谷口吉郎の設計。入口の前には、空を指さすような2本の柱、イサム・ノグチの彫刻「門」が立つ', -653, -2486);
    }

    // ===== 三囲神社 (向島) =====
    {
      const R = [1728, -3802, 1792, -3746], CZ = -3774;
      site(R, '#c4bca6');
      tiles(1728, CZ - 4, 1768, CZ + 4, '#d2c8b0', '#c0b69e', 1.4);
      myojinTorii(1734, CZ, false, 5, 6, WALL.TKSTONE, 0.32);   // 墨堤に面した石の鳥居
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(1766, CZ - 12, 1790, CZ + 12), 0, 0.8);
      hall([1770, CZ - 9, 1788, CZ + 9], 'WOOD', 0.8, 5, 'RF_COPPER', 4.6);
      // 三柱鳥居: 3つの鳥居を三角形に組み合わせた珍しい形
      {
        const cx = 1748, cz = -3792, Rr = 2.2, H = 3.4, M = WALL.TKSTONE, P = [];
        for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI * 2 + Math.PI / 2; P.push([cx + Math.cos(a) * Rr, cz + Math.sin(a) * Rr]); }
        for (const [x, z] of P) { bake(M, new THREE.CylinderGeometry(0.16, 0.2, H, 8).translate(x, H / 2, z)); solid(x - 0.2, z - 0.2, x + 0.2, z + 0.2, 0, H); }
        for (let k = 0; k < 3; k++) {
          const [ax, az] = P[k], [bx, bz] = P[(k + 1) % 3], L = Math.hypot(bx - ax, bz - az) + 0.8, ang = Math.atan2(bz - az, bx - ax);
          bake(M, new THREE.BoxGeometry(L, 0.22, 0.3).rotateY(-ang).translate((ax + bx) / 2, H + 0.1, (az + bz) / 2));       // 笠木
          bake(M, new THREE.BoxGeometry(L - 0.9, 0.14, 0.18).rotateY(-ang).translate((ax + bx) / 2, H - 0.6, (az + bz) / 2)); // 貫
        }
        pushPrism('TKSTONE', 'TKSTONE', regularPoly(cx, cz, 0.6, 8), 0, 0.7);   // 中央の石
        SPOT_AREAS.unshift(['三柱鳥居 (三囲神社)', cx - 4, cz - 4, cx + 4, cz + 4]);
        LM_NOTES['三柱鳥居 (三囲神社)'] = '3つの鳥居を上から見て三角形になるように組み合わせた、めずらしい形の鳥居。三井家の屋敷にあったものが神社に寄贈された';
      }
      // ライオン像 (池袋の三越にあったもの)
      {
        const lx = 1750, lz = -3757, BR = WALL.BRONZE;
        pushPrism('TKSTONE', 'TKSTONE', rectPoly(lx - 1.2, lz - 2.2, lx + 1.2, lz + 2.2), 0, 1.2);
        bake(BR, new THREE.BoxGeometry(1.4, 0.7, 3.2).translate(lx, 1.55, lz + 0.2));      // 伏せた体
        bake(BR, new THREE.BoxGeometry(1.2, 1.2, 1.0).translate(lx, 2.1, lz - 1.3));       // たてがみ
        bake(BR, new THREE.BoxGeometry(0.7, 0.6, 0.5).translate(lx, 2.0, lz - 1.95));      // 鼻づら
        for (const s of [-1, 1]) bake(BR, new THREE.BoxGeometry(0.35, 0.3, 1.1).translate(lx + s * 0.45, 1.35, lz - 2.0));   // 前足
        SPOT_AREAS.unshift(['三囲神社のライオン像', lx - 3, lz - 3, lx + 3, lz + 3]);
        LM_NOTES['三囲神社のライオン像'] = '池袋の三越の玄関にいたライオン像。店が閉まったあと、三井家とゆかりの深いこの神社にやってきた';
      }
      // コンコンさん (狐の像)
      for (const s of [-1, 1]) { const x = 1764, z = CZ + s * 6; pushPrism('TKSTONE', 'TKSTONE', rectPoly(x - 0.6, z - 0.6, x + 0.6, z + 0.6), 0, 1.1); const W = lam({ color: 0xe8e4da }); bake(W, new THREE.BoxGeometry(0.5, 0.8, 0.7).translate(x, 1.5, z)); bake(W, new THREE.ConeGeometry(0.28, 0.6, 4).rotateZ(Math.PI / 2).translate(x - 0.5, 2.0, z)); }
      GINKGO.push([1736, -3798, 1.2], [1786, -3798, 1.1], [1736, -3750, 1.1]);
      for (let k = 0; k < 8; k++) { const x = rr(1740, 1790), z = rr(-3800, -3748); if (Math.abs(z - CZ) > 12 && !inR([1742, -3798, 1756, -3786], x, z) && !inR([1746, -3762, 1756, -3752], x, z)) ROUND.push([x, z, rr(0.9, 1.2)]); }
      LM_PEOPLE.push([[1730, CZ + 1.5, 1766, CZ + 1.5], 4]);
      spot('三囲神社', R, '三囲神社', '⛩', '名前は、土の中から見つかった神像のまわりを白い狐が3回めぐったという言い伝えから。「囲」の字が「井」を囲むことから「三井を守る」とされ、江戸時代から三井家の守り神としてあつく信仰されてきた', 1779, CZ);
    }

    // ===== 刀剣博物館 (両国。旧安田庭園の北) =====
    {
      const R = [1250, -2808, 1290, -2770];
      site(R, '#c8c4b8');
      const WH = windows('RG_TOKEN', '#e4e2dc', '#4a525a', 6, 2);
      pushPrism(WH, 'CONC', rectPoly(1252, -2802, 1288, -2786), 0, 9);   // 東西にのびる翼部
      pushPrism(WH, 'CONC', regularPoly(1270, -2780, 7, 20), 0, 12);   // 庭園の池に向かって張り出す円筒部
      // 最上階の展示室は、かまぼこ型のヴォールト屋根 (屋上庭園になっている)
      const v = new THREE.CylinderGeometry(4.5, 4.5, 34, 16, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateX(Math.PI / 2);
      bake(lam({ color: 0xd8d8d2 }), v.translate(1270, 9, -2794));
      solid(1252, -2798.5, 1288, -2789.5, 9, 13.5);
      sign(1270, -2803, -1, '刀剣博物館', 9, 1.8, '#f0ece0', '#2a2a28');
      spot('刀剣博物館', R, '刀剣博物館', '⚔', '日本刀を守り伝える博物館。1968年に代々木で開館し、2018年に旧安田庭園の中の旧両国公会堂の跡地へ移った。池に張り出した円筒形の部分は、大正時代の公会堂の形を受け継いでいる', 1270, -2794);
    }
    bakeFlush();
  },
});
