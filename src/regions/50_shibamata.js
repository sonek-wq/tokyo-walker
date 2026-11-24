/* 柴又・葛飾 (帝釈天と江戸川の矢切の渡し。北東の端)
   - 帝釈天参道 (柴又駅から二天門までの門前町。草だんごの店は regions/90_gourmet.js)
   - 柴又帝釈天 (経栄山題経寺): 二天門・瑞龍の松・帝釈堂 (彫刻の寺)・大鐘楼・邃渓園と回廊
   - 山本亭 (大正〜昭和初期の和洋折衷の邸宅と庭園)
   - 江戸川の河川敷と矢切の渡し (Eで対岸の松戸へ渡れる。小舟が行き来する) */
REGION({
  name: '柴又・葛飾',
  towns: [['柴又', 3480, -4850], ['金町', 3450, -5200], ['高砂', 3300, -4500], ['立石', 2950, -4300], ['四つ木', 2600, -4150], ['堀切', 2350, -4650], ['お花茶屋', 2700, -4700], ['亀有', 2900, -5100], ['新宿 (にいじゅく)', 3250, -5000], ['奥戸', 3100, -3700], ['細田', 3400, -3900],
    ['下矢切 (千葉県松戸市)', 3880, -4870]],
  hubs: [{ x: 3480, z: -4850, town: 300 }, { x: 3450, z: -5200, core: 90, town: 320 }, { x: 2950, z: -4300, town: 300 }, { x: 2900, z: -5100, town: 300 }],
  labels: [],
  build(r) {
    const { C, site, spot, sign, signX, STONE, plasterWood, windows, hall, street } = SL_KIT();
    const KEYAKI = C('SB_KEYAKI', { color: 0x8a6a48 }), DARKW = C('SB_DARKW', { color: 0x4a3a2c });
    const trees = (R, n, list = ROUND, avoid = null, s0 = 0.8, s1 = 1.2, base) => {
      for (let k = 0; k < n; k++) { const x = rr(R[0] + 2, R[2] - 2), z = rr(R[1] + 2, R[3] - 2); if (avoid && avoid(x, z)) continue; list.push(base === undefined ? [x, z, rr(s0, s1)] : [x, z, rr(s0, s1), base]); }
    };
    const SZ = -4862;   // 参道と境内の中心線

    // ===== 帝釈天参道 (柴又駅から二天門まで。昔ながらの門前町) =====
    {
      const F = frame(3380, SZ, 1, 0, 0, 1);
      street(F, 120, { hw: 3.6, c1: '#c8bca4', c2: '#b4a890', ts: 1.3, gates: [[2, '帝釈天参道']],
        skip: (x, z) => z > SZ && x > 3466 && x < 3494 });   // 草だんごの店の場所はあけておく
      for (let x = 3384; x < 3496; x += 6) LANTERNS.push([x, SZ - 3.1], [x + 3, SZ + 3.1]);
      spot('帝釈天参道', [3378, SZ - 20, 3500, SZ + 20], '帝釈天参道', '🏮', '柴又駅から帝釈天の二天門まで続く、昔ながらの門前町。木造の老舗が軒を連ね、映画「男はつらいよ」の舞台としても知られる。駅前には寅さんの像が立つ', 3440, SZ);
    }

    // ===== 柴又帝釈天 (経栄山題経寺) =====
    {
      const R = [3500, -4908, 3584, -4816];
      site(R, '#c8bea8');
      tiles(3500, SZ - 4, 3532, SZ + 4, '#d6ccb4', '#c4baa2', 1.5);
      // 二天門 (1896年。日光東照宮の陽明門を模したと伝わる総欅造りの楼門。中央が通り道)
      const GX0 = 3500, GX1 = 3510;
      pushPrism(KEYAKI, 'WOOD', rectPoly(GX0, SZ - 9, GX1, SZ - 3), 0, 6); pushPrism(KEYAKI, 'WOOD', rectPoly(GX0, SZ + 3, GX1, SZ + 9), 0, 6);
      pushPrism(KEYAKI, 'WOOD', rectPoly(GX0, SZ - 3, GX1, SZ + 3), 4.6, 6);
      pushPrism(KEYAKI, 'WOOD', rectPoly(GX0 + 0.8, SZ - 7.6, GX1 - 0.8, SZ + 7.6), 6, 10);   // 上の層
      jRoof('RF2', GX0 - 0.5, SZ - 9.5, GX1 + 0.5, SZ + 9.5, 6, 1.4, { over: 1.2, kind: 'hip' });
      jRoof('RF2', GX0 + 0.8, SZ - 7.6, GX1 - 0.8, SZ + 7.6, 10, 4, { over: 1.6, kind: 'irimoya' });
      bake(lam({ color: 0x3a3a3a }), new THREE.CylinderGeometry(3.2, 3.2, 1.2, 12, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2).scale(1, 0.5, 1).translate(GX0 - 1.4, 7.6, SZ));   // 唐破風
      for (const s of [-1, 1]) acStatue(GX0 + 5, SZ + s * 6, 0, 1.4, -Math.PI / 2, lam({ color: 0x9a3a2a }), 'reach', null);   // 増長天・広目天
      // 瑞龍の松 (帝釈堂の前で横に大きく枝をのばす松。寺のはじまりの聖地)
      PINES.push([3518, SZ - 7, 1.5]);
      for (let k = 0; k < 7; k++) bake(lam({ color: 0x3e5a30 }), new THREE.DodecahedronGeometry(1.6, 0).scale(1.6, 0.5, 1).translate(3518 + k * 1.8, 5.2 - k * 0.15, SZ - 7 + Math.sin(k) * 1.5));
      // 帝釈堂 (拝殿と内殿を相の間でつなぐ権現造。外壁は法華経の説話の彫刻でおおわれる)
      const CARV = LM_MAT('SB_CARVE', (x, y) => {
        x.fillStyle = '#7a5a3e'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
        x.fillStyle = '#5a3e28'; x.fillRect(0, 0, 32, 2); x.fillRect(0, 30, 32, 2); x.fillRect(0, 0, 2, 32); x.fillRect(30, 0, 2, 32);
        for (let i = 0; i < 18; i++) { x.fillStyle = i % 2 ? '#9a7a56' : '#6a4a30'; x.beginPath(); x.arc(4 + (i * 7) % 24, 5 + (i * 11) % 22, 1.5 + (i % 3), 0, 6.3); x.fill(); }
      });
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(3524, -4884, 3566, -4840), 0, 1);
      hall([3528, -4878, 3542, -4846], KEYAKI, 1, 7, 'RF2', 6);       // 拝殿 (西向き)
      pushPrism(DARKW, 'ROOF', rectPoly(3542, -4870, 3548, -4854), 1, 7);   // 相の間
      hall([3548, -4876, 3564, -4848], CARV, 1, 7.5, 'RF2', 6.5);     // 内殿 (彫刻ギャラリー)
      stairs([3522, SZ - 5, 3528, SZ + 5], 1, 'x+');
      // 大鐘楼
      pushPrism('ISHIGAKI', 'TKSTONE', rectPoly(3510, -4904, 3520, -4894), 0, 1.6);
      for (const [dx, dz] of [[-3.6, -3.6], [3.6, -3.6], [-3.6, 3.6], [3.6, 3.6]]) bake(lam({ color: 0x5a4632 }), new THREE.BoxGeometry(0.45, 4.6, 0.45).translate(3515 + dx, 3.9, -4899 + dz));
      jRoof('RF2', 3510, -4904, 3520, -4894, 6.2, 3, { over: 1.3, kind: 'irimoya' });
      bake(WALL.BRONZE, new THREE.CylinderGeometry(1, 1.25, 2.6, 10).translate(3515, 4.4, -4899));
      // 邃渓園 (大客殿の前の池泉式庭園。まわりの回廊から眺める)
      fe(3576, -4870, 7, 16, '#a89c80'); fe(3576, -4870, 6, 14, '#3a6a64'); PONDS.push([3576, -4870, 6, 14]);
      pushPrism(DARKW, 'WOOD', rectPoly(3566, -4890, 3568, -4850), 0, 0.5); pushPrism('RF2', 'RF2', rectPoly(3565.5, -4890, 3569, -4850), 2.8, 3.1, { solid: false });   // 回廊
      for (let z = -4889; z < -4850; z += 5) bake(lam({ color: 0x4a3a2c }), new THREE.BoxGeometry(0.3, 2.4, 0.3).translate(3568.6, 1.6, z));
      trees([3570, -4900, 3584, -4840], 10, PINES, (x, z) => Math.hypot((x - 3576) / 7, (z + 4870) / 15) < 1, 0.6, 0.8);
      trees([3570, -4900, 3584, -4840], 6, MAPLES, (x, z) => Math.hypot((x - 3576) / 7, (z + 4870) / 15) < 1, 0.6, 0.8);
      STONE_LANTERNS.push([3514, SZ - 6], [3514, SZ + 6]);
      trees(R, 12, GINKGO, (x, z) => inR([3498, -4886, 3570, -4838], x, z) || inR([3508, -4906, 3522, -4892], x, z));
      LM_PEOPLE.push([[3502, SZ + 1, 3522, SZ + 1], 5]);
      spot('柴又帝釈天 (題経寺)', R, '柴又帝釈天', '🛕', '正式な名前は「経栄山題経寺」。1629年に開かれたと伝わる日蓮宗の寺で、日蓮が自ら彫ったという帝釈天の板本尊をまつる。境内のお堂は見事な彫刻で飾られ「彫刻の寺」とも呼ばれる', 3540, SZ);
      SPOT_AREAS.unshift(['二天門 (柴又帝釈天)', GX0 - 4, SZ - 11, GX1 + 2, SZ + 11], ['帝釈堂 (柴又帝釈天)', 3524, -4884, 3566, -4840], ['邃渓園 (柴又帝釈天)', 3566, -4892, 3584, -4846]);
      LM_NOTES['二天門 (柴又帝釈天)'] = '1896年に完成した総欅造りの楼門。日光東照宮の陽明門を模したと伝わり、唐破風の屋根の下に細かな彫刻がびっしり。両側に増長天と広目天をまつる';
      LM_NOTES['帝釈堂 (柴又帝釈天)'] = '拝殿と内殿を「相の間」でつなぐ権現造のお堂。内殿の外側の壁は、法華経の説話を題材にした彫刻でおおわれていて、10人の彫刻師が力を合わせてつくりあげた';
      LM_NOTES['邃渓園 (柴又帝釈天)'] = '大客殿の前に広がる池泉式の日本庭園。まわりをぐるりと囲む回廊を歩きながら眺める';
    }

    // ===== 山本亭 (カメラ部品の工場をおこした山本家の邸宅。和洋折衷の建物と書院庭園) =====
    {
      const R = [3586, -4902, 3616, -4858];
      site(R, '#8a9a64');
      const YM = plasterWood('SB_YAMAMOTO', '#e6dcc6', '#4a3a2a');
      pushPrism(YM, 'ROOF', rectPoly(3588, -4900, 3604, -4884), 0.4, 3.6); jRoof('RF2', 3588, -4900, 3604, -4884, 3.6, 2.4, { over: 0.9, kind: 'irimoya' });
      pushPrism(windows('SB_HOUOU', '#f0e8d8', '#6a8aa0', 4, 4), 'ROOF', rectPoly(3588, -4884, 3596, -4876), 0.4, 6.2); jRoof('RF0', 3588, -4884, 3596, -4876, 6.2, 1.6, { over: 0.6, kind: 'hip' });   // 洋風の「鳳凰の間」
      for (const [x0, z0, x1, z1] of [[3586, -4902, 3616, -4901.4], [3586, -4902, 3586.6, -4870], [3586, -4864, 3586.6, -4858], [3615.4, -4902, 3616, -4858], [3586, -4858.6, 3616, -4858]]) pushPrism('RF2', 'RF2', rectPoly(x0, z0, x1, z1), 0, 2);   // 長屋門風の塀 (西が入口)
      fe(3608, -4880, 5, 8, '#3a6a64'); PONDS.push([3608, -4880, 4.4, 7.4]);
      bake(lam({ color: 0xbfe4f4, transparent: true, opacity: 0.8 }), new THREE.BoxGeometry(0.4, 2, 1.6).translate(3612.6, 1, -4886));   // 滝
      trees(R, 14, PINES, (x, z) => inR([3587, -4901, 3605, -4875], x, z) || Math.hypot((x - 3608) / 6, (z + 4880) / 9) < 1, 0.6, 0.8);
      spot('山本亭', R, '山本亭', '🏡', 'カメラ部品の工場を営んだ山本家の邸宅で、大正から昭和のはじめに増改築された。書院造の和室にガラス戸や洋間を取り入れた和洋折衷の建物で、書院庭園はアメリカの日本庭園専門誌のランキングで上位の常連');
    }

    // ===== 江戸川の河川敷と矢切の渡し =====
    {
      const WZ = -4870, WP = 3652, EP = 3766;   // 柴又側・松戸側の桟橋 (川の中に突き出す先)
      const deck = (x0, x1) => { pushPrism('WOOD', 'WOOD', rectPoly(x0, WZ - 1.5, x1, WZ + 1.5), -0.3, 0.3); POND_LAND.push(['r', x0, WZ - 1.5, x1, WZ + 1.5]); };
      deck(WP - 6, WP + 4); deck(EP - 4, EP + 6);
      fr(3620, WZ - 12, 3646, WZ + 12, '#c8bca4');
      pushPrism('WOOD', 'RF2', rectPoly(3626, WZ - 10, 3634, WZ - 5), 0, 2.4); jRoof('RF2', 3626, WZ - 10, 3634, WZ - 5, 2.4, 1.2, { over: 0.5, kind: 'irimoya' });   // 渡し場の小屋
      signX(3636, WZ - 3, 1, '矢切の渡し', 6, 2.4, '#f4ecd8', '#2a2420');
      fr(3800, WZ - 14, 3830, WZ + 14, '#c8bca4');
      // 手こぎの小舟 (2つの桟橋のあいだを行き来する)
      const BOAT = new THREE.Group(); scene.add(BOAT);
      const hull = new THREE.Mesh(new THREE.BoxGeometry(7, 0.7, 2), lam({ color: 0x7a5a3a })); hull.position.y = 0.05; BOAT.add(hull);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(3, 0.12, 2.2), lam({ color: 0xd8c8a0 })); roof.position.set(-0.5, 1.8, 0); BOAT.add(roof);
      const man = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 0.5), lam({ color: 0x2a3a5a })); man.position.set(2.6, 1.2, 0); BOAT.add(man);
      const pole = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4, 0.12), lam({ color: 0x8a7050 })); pole.position.set(3.2, 1.5, 0); pole.rotation.z = 0.4; BOAT.add(pole);
      LM_UPDATERS.push((dt, t) => { const s = (Math.sin(t * 0.06) + 1) / 2; BOAT.position.set(WP + 8 + (EP - WP - 16) * s, -1.2, WZ + 3.5); BOAT.rotation.y = Math.cos(t * 0.06) > 0 ? 0 : Math.PI; });
      // 渡しに乗る (E で対岸へ)
      LM_ACTIONS.push({ at: () => P.y < 2 && Math.hypot(P.x - (WP - 2), P.z - WZ) < 6, prompt: () => 'E　矢切の渡しで松戸へ渡る', act: () => lmWarp(EP + 8, 0, WZ, -Math.PI / 2, '矢切の渡しで江戸川を渡った (千葉県松戸市 下矢切)') });
      LM_ACTIONS.push({ at: () => P.y < 2 && Math.hypot(P.x - (EP + 2), P.z - WZ) < 6, prompt: () => 'E　矢切の渡しで柴又へ戻る', act: () => lmWarp(WP - 10, 0, WZ, Math.PI / 2, '矢切の渡しで柴又に戻った') });
      spot('矢切の渡し', [3612, WZ - 16, 3660, WZ + 16], '矢切の渡し', '🛶', '柴又と対岸の千葉県松戸市を結ぶ、都内でただ一つ残る渡し船。江戸時代は川に橋をかけることが禁じられていたが、対岸に畑を持つ農民のための渡しは許されていた。小説「野菊の墓」の舞台としても知られる', 3636, WZ);
      SPOT_AREAS.unshift(['矢切の渡し (松戸側)', 3760, WZ - 16, 3832, WZ + 16]);
      LM_NOTES['矢切の渡し (松戸側)'] = '江戸川を渡ると千葉県松戸市。松戸側は伊藤左千夫の小説「野菊の墓」の舞台で、文学碑も立っている';
    }
    bakeFlush();
  },
});
