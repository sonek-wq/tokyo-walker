/* 桜の名所を増やす (桜は一年中満開。engine/13_trees.js)
   - 増上寺: 境内の桜と、大殿の前のしだれ桜。三解脱門から見ると、大殿の後ろに東京タワーがそびえる
   - 東京ミッドタウン: ガーデンテラス前の桜並木 (約200m)
   - 六本木さくら坂: けやき坂の南に並んで通る桜並木と、さくら坂公園 (ロボットの形の塔)
   - 播磨坂: 茗荷谷と小石川植物園のあいだの、中央に緑道がある広い坂道の桜並木 */
REGION({
  name: '桜の名所',
  towns: [],
  labels: [],
  build(r) {
    const { spot, TREE_LISTS } = SL_KIT();
    const blocked = (x, z, m = 1.2) => [...query(x - m, z - m, x + m, z + m)].some(s => s[5] > 0.6 && inR(s, x, z, m));   // 建物や塀に重なる場所には植えない
    const plantAt = (L, x, z, s) => { if (!blocked(x, z)) L.push([x, z, s]); };
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); } if (col) fr(...R, col); };

    // ===== 増上寺 (境内に約200本の桜。東京タワーと桜を一緒に眺められる) =====
    {
      for (let x = -1415; x < -1150; x += 11) { plantAt(SAKURA, x + rr(-1, 1), -129, rr(1.05, 1.3)); plantAt(SAKURA, x + 5 + rr(-1, 1), 9, rr(1.05, 1.3)); }
      for (let x = -1248; x < -1176; x += 9) for (const z of [-82, -38]) plantAt(SAKURA, x + rr(-1, 1), z, rr(1.0, 1.2));
      SHIDARE.push([-1247, -110, 1.35], [-1247, -10, 1.25]);   // 大殿の前のしだれ桜
      SPOT_AREAS.unshift(['増上寺のしだれ桜', -1256, -120, -1238, -100], ['増上寺のしだれ桜', -1256, -20, -1238, 0]);
      LM_NOTES['増上寺のしだれ桜'] = '広い境内には、ソメイヨシノやしだれ桜など約200本の桜がある。春は、大殿の後ろにそびえる東京タワーと桜を一緒に眺められる';
    }

    // ===== 東京ミッドタウンの桜並木 (ガーデンテラス前。全長約200m) =====
    {
      tiles(-2084, -941, -1842, -936, '#d4ccb8', '#c4bca8', 2);
      for (let x = -2080; x < -1846; x += 8) {
        if (x > -2022 && x < -1954) continue;   // 21_21 DESIGN SIGHT の前はあける
        plantAt(SAKURA, x, -946, rr(1.05, 1.25));
        if (x < -2026 || x > -1950) plantAt(SAKURA, x + 4, -958, rr(1.0, 1.2));
      }
      LM_PEOPLE.push([[-2080, -938.5, -1846, -938.5], 8]);
      SPOT_AREAS.unshift(['ミッドタウンの桜並木', -2084, -962, -1842, -936]);
      LM_NOTES['ミッドタウンの桜並木'] = 'ミッドタウン・ガーデンに続く全長約200mの桜並木。防衛庁があったころから育ってきた桜を約40本引き継いでいて、毎年いまも花を咲かせている';
    }

    // ===== 六本木さくら坂 (けやき坂と並んで通る、ソメイヨシノ75本の桜並木) とさくら坂公園 =====
    {
      const R = [-2195, -322, -1960, -300];
      site(R, '#9aa070');
      tiles(-2195, -316, -1960, -306, '#c8bea8', '#b8ae98', 2);
      for (let x = -2190; x < -1962; x += 8) { SAKURA.push([x, -319, rr(1.0, 1.2)], [x + 4, -303, rr(1.0, 1.2)]); if ((x | 0) % 3 === 0) LAMPS2.push([x + 2, -311]); }
      LM_PEOPLE.push([[-2190, -312, -1962, -312], 8], [[-1962, -309, -2190, -309], 6]);
      spot('六本木さくら坂', R, 'さくら坂', '🌸', 'けやき坂と並んで通る坂道で、約400mにわたってソメイヨシノ75本が並ぶ。六本木ヒルズができる前から根をおろす、となりの毛利庭園の老木の桜とあわせて花見の名所になっている', -2078, -311);
      // さくら坂公園 (ブリキのおもちゃから着想を得た、ロボットの形の塔)
      const K = [-2012, -298, -1962, -264], cx = -1987, cz = -282;
      site(K, '#c8b898');
      const RB = (c, w, h, d, x, y, z) => bake(lam({ color: c }), new THREE.BoxGeometry(w, h, d).translate(x, y, z));
      RB(0xd84030, 1.4, 4, 1.4, cx - 1.6, 2, cz); RB(0xd84030, 1.4, 4, 1.4, cx + 1.6, 2, cz);   // 足
      RB(0x3a78c8, 5.2, 4.2, 3.2, cx, 6.1, cz); RB(0xf0c838, 2.2, 1.2, 0.2, cx, 6.6, cz + 1.7);   // 胴体と胸のパネル
      RB(0xe8e4dc, 3.4, 2.6, 2.8, cx, 9.6, cz); RB(0x222222, 0.6, 0.6, 0.2, cx - 0.8, 9.9, cz + 1.45); RB(0x222222, 0.6, 0.6, 0.2, cx + 0.8, 9.9, cz + 1.45);   // 頭と目
      RB(0xf0c838, 0.3, 1.4, 0.3, cx, 11.6, cz);   // アンテナ
      for (const s of [-1, 1]) RB(0x48a848, 1.0, 3.6, 1.0, cx + s * 3.2, 6.4, cz);   // 腕
      solid(cx - 2.6, cz - 1.6, cx + 2.6, cz + 1.6, 0, 11);
      // // すべり台
      for (const [a, c] of [[Math.PI / 2, 0xe8d040], [-Math.PI / 2, 0xe86a30]]) { const g = new THREE.BoxGeometry(1.4, 0.5, 9).rotateX(-0.55).translate(0, 4.2, 6.6).rotateY(a).translate(cx, 0, cz); bake(lam({ color: c }), g); }   // 左右にすべり台
      for (let k = 0; k < 8; k++) ROUND.push([K[0] + 3 + rnd() * 44, rnd() < 0.5 ? -296 : -266, rr(0.8, 1)]);
      LM_PEOPLE.push([[-2008, -270, -1966, -270], 4]);
      spot('さくら坂公園', K, 'さくら坂公園', '🤖', '六本木ヒルズの南端にある公園。ブリキのおもちゃから着想を得た、ロボットの形をした塔がシンボルで、すべり台がついている', cx, cz + 8);
    }

    // ===== 播磨坂 (茗荷谷と小石川植物園のあいだ。約120本の桜並木) =====
    {
      const X0 = -1300, X1 = -1102, R = [X0, -3716, X1, -3684];
      site(R, null);
      tiles(X0, -3716, X1, -3711, '#c8c0b0', '#b6ae9e', 2); tiles(X0, -3689, X1, -3684, '#c8c0b0', '#b6ae9e', 2);   // 歩道
      for (const [z0, z1] of [[-3711, -3704], [-3696, -3689]]) { fr(X0, z0, X1, z1, '#3c3c42'); for (let x = X0; x < X1; x += 6) fr(x, (z0 + z1) / 2 - 0.15, x + 3, (z0 + z1) / 2 + 0.15, '#e8e6dc'); }   // 車道
      fr(X0, -3704, X1, -3696, '#7e9a58');   // 中央の緑道
      tiles(X0, -3701.5, X1, -3698.5, '#c4b89c', '#b4a88c', 1.5);
      fr(-1206, -3704, -1194, -3696, '#3c3c42');   // 交差点 (緑道を切る)
      for (let x = X0 + 4; x < X1 - 2; x += 8.5) {
        SAKURA.push([x, -3713.5, rr(1.0, 1.25)], [x + 4, -3686.5, rr(1.0, 1.25)]);
        if (Math.abs(x + 1200) > 9) SAKURA.push([x + 2, x % 17 < 8.5 ? -3702.5 : -3697.5, rr(1.0, 1.2)]);
      }
      // 鬱金(うこん)桜: 淡い黄緑色の花が咲く、めずらしい八重桜
      const UK = [-1160, -3702.5];
      bake(lam({ color: 0x5a4430 }), new THREE.CylinderGeometry(0.25, 0.35, 3, 5).translate(UK[0], 1.5, UK[1]));
      bake(lam({ color: 0xe2eab0 }), new THREE.IcosahedronGeometry(2.4, 0).scale(1.2, 0.8, 1.2).translate(UK[0], 4.3, UK[1]));
      solid(UK[0] - 0.5, UK[1] - 0.5, UK[0] + 0.5, UK[1] + 0.5, 0, 6.5);
      // 彫刻 (「水と緑と彫刻のある散歩道」)
      const BZ = WALL.BRONZE, ST = lam({ color: 0xb8b4aa });
      for (const [x, kind] of [[-1272, 0], [-1236, 1], [-1132, 2]]) {
        const z = -3700; bake(ST, new THREE.BoxGeometry(1.6, 0.8, 1.6).translate(x, 0.4, z)); solid(x - 0.8, z - 0.8, x + 0.8, z + 0.8, 0, 2.6);
        if (kind === 0) bake(BZ, new THREE.TorusGeometry(0.8, 0.22, 6, 12).translate(x, 1.8, z));
        else if (kind === 1) bake(BZ, new THREE.CylinderGeometry(0.2, 0.5, 2.2, 6).rotateZ(0.3).translate(x, 1.9, z));
        else bake(ST, new THREE.SphereGeometry(0.75, 8, 6).scale(1, 1.3, 0.8).translate(x, 1.7, z));
      }
      for (const x of [-1284, -1252, -1220, -1180, -1148, -1118]) BENCHES.push([x, -3702.6, 0]);
      LM_PEOPLE.push([[X0 + 4, -3700, X1 - 4, -3700], 8], [[X1 - 2, -3713.5, X0 + 2, -3713.5], 5], [[X0 + 2, -3686.5, X1 - 2, -3686.5], 5]);
      spot('播磨坂', R, '播磨坂', '🌸', 'この地にあった松平播磨守の上屋敷にちなんだ名前の坂。1960年に坂を舗装したとき、「全区を花でうずめる運動」で桜の若木が植えられ、いまは約120本の桜並木になった。中央は彫刻の置かれた緑道', -1230, -3700);
      SPOT_AREAS.unshift(['鬱金桜 (播磨坂)', UK[0] - 3, UK[1] - 3, UK[0] + 3, UK[1] + 3]);
      LM_NOTES['鬱金桜 (播磨坂)'] = '播磨坂にはソメイヨシノのほかに、淡い黄緑色の花を咲かせる八重桜「鬱金(うこん)桜」など、めずらしい桜も植えられている';
    }
    bakeFlush();
  },
});
