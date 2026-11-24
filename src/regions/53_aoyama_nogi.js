/* 青山霊園と乃木坂 (青山一丁目と六本木のあいだ)
   - 青山霊園: 外苑東通りと、青山一丁目から表参道へ下る道にはさまれた三角の土地に置く。
     実際の霊園 (約26ha) はもっと大きいが、このあたりはゲームの地図自体が縮んでいるので、まわりの名所との位置関係を優先して縮めた。
     南北の桜並木・東西のエンジュの並木道・大久保利通の墓・ハチ公の碑・外国人墓地
   - 乃木坂: 外苑東通りの東に 乃木神社 と 旧乃木邸 (レンガの馬小屋)。そのあいだを東へ下る坂が乃木坂 */
REGION({
  name: '青山霊園・乃木坂',
  towns: [['南青山二丁目', -2290, -1030], ['赤坂八丁目', -2140, -1240]],
  labels: [],
  build(r) {
    const { C, spot, sign, SHU, STONE, hall, TREE_LISTS } = SL_KIT();
    const clearIn = (inside) => { for (const A of TREE_LISTS) { const keep = A.filter(p => !inside(p[0], p[1])); A.length = 0; A.push(...keep); } };
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); clearIn((x, z) => inR(R, x, z)); if (col) fr(...R, col); };

    // ===== 青山霊園 (1874年に開かれた日本で最初の公営墓地) =====
    {
      const Q = [[-2297, -1166], [-2265, -1166], [-2157, -973], [-2376, -973], [-2360, -1050]];   // 凸多角形
      const inQ = (x, z) => inPoly(Q, x, z);
      LM_ZONES.push(Q); clearIn(inQ); polyFr(Q, '#8c8c7a');
      const AX = -2282, AZ = -1076;   // 南北の桜並木 (x = AX) と 東西のエンジュの並木道 (z = AZ)
      tiles(AX - 4, -1166, AX + 4, -973, '#b8ac94', '#a89c84', 3);
      tiles(-2362, AZ - 4, -2206, AZ + 4, '#b4ab98', '#a49b88', 3);
      tiles(-2374, -980, -2160, -975, '#aaa290', '#9c9482', 2.5);   // 南の端の小道 (根津美術館の側)
      for (let z = -1160; z < -978; z += 9) for (const v of [-6.5, 6.5]) if (Math.abs(z - AZ) > 8 && inQ(AX + v, z)) SAKURA.push([AX + v, z, rr(1.2, 1.45)]);
      for (let x = -2354; x < -2210; x += 10) for (const v of [-6.5, 6.5]) if (Math.abs(x - AX) > 9 && inQ(x, AZ + v)) ROUND.push([x, AZ + v, rr(0.85, 1.05)]);   // エンジュ
      // 特別な区画 (墓石を並べない)
      const OK = [-2268, -1132, -2252, -1116];       // 大久保利通の墓
      const HC = [-2300, -1124, -2290, -1112];       // 上野英三郎博士の墓とハチ公の碑
      const GA = [-2246, -1062, -2208, -1028];       // 外国人墓地
      const busy = (x, z) => Math.abs(x - AX) < 8 || Math.abs(z - AZ) < 7 || z > -984 || [OK, HC, GA].some(R => inR([R[0] - 2, R[1] - 2, R[2] + 2, R[3] + 2], x, z));
      // 墓所: 石の台と墓石。ところどころに通路を空ける
      const slab = lam({ color: 0xb4b0a6 }), st1 = lam({ color: 0x9a9a96 }), st2 = lam({ color: 0x6e6e6c }), st3 = lam({ color: 0xc8c4ba });
      let row = 0;
      for (let z = -1162; z < -986; z += 4.6, row++) {
        if (row % 5 === 4) continue;   // 東西の通路
        for (let x = -2372; x < -2160; x += 4.2) {
          if ((Math.round((x + 2372) / 4.2) % 7) === 6) continue;   // 南北の通路
          if (!inQ(x - 1.6, z - 1.6) || !inQ(x + 1.6, z + 1.6) || busy(x, z) || rnd() < 0.12) continue;
          bake(slab, new THREE.BoxGeometry(3.0, 0.22, 3.2).translate(x, 0.11, z));
          const h = rr(1.0, 1.7), m = rnd() < 0.55 ? st1 : rnd() < 0.6 ? st2 : st3;
          bake(m, new THREE.BoxGeometry(0.9, 0.3, 0.7).translate(x, 0.37, z - 0.8));
          bake(m, new THREE.BoxGeometry(0.6, h, 0.4).translate(x, 0.52 + h / 2, z - 0.8));
          if (rnd() < 0.3) ROUND.push([x + rr(-1, 1), z + 1.2, rr(0.35, 0.5)]);   // 墓所の植え込み
        }
      }
      for (let k = 0; k < 40; k++) { const x = rr(-2370, -2165), z = rr(-1160, -985); if (inQ(x, z) && !busy(x, z)) (rnd() < 0.5 ? ROUND : PINES).push([x, z, rr(0.9, 1.4)]); }
      // 大久保利通の墓 (都旧跡): 石の柵で囲み、大きな石碑
      {
        const [x0, z0, x1, z1] = OK, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
        for (const R of [[x0, z0, x1, z0 + 0.4], [x0, z0, x0 + 0.4, z1], [x1 - 0.4, z0, x1, z1], [x0, z1 - 0.4, cx - 1.5, z1], [cx + 1.5, z1 - 0.4, x1, z1]]) pushPrism('TKSTONE', 'TKSTONE', rectPoly(...R), 0, 1.1);
        pushPrism('TKSTONE', 'TKSTONE', rectPoly(cx - 3, cz - 4, cx + 3, cz + 1), 0, 0.6);
        pushPrism('TKSTONE', 'TKSTONE', rectPoly(cx - 1.4, cz - 2.6, cx + 1.4, cz - 1.4), 0.6, 5.6);   // 石碑
        pushPrism('TKSTONE', 'TKSTONE', rectPoly(cx - 1.6, cz - 2.8, cx + 1.6, cz - 1.2), 5.6, 6.0);
        PINES.push([x0 + 2, z0 + 2, 1.1], [x1 - 2, z0 + 2, 1.0]);
        spot('大久保利通の墓', [x0 - 1, z0 - 1, x1 + 1, z1 + 1], '大久保利通の墓', '🪦', '明治維新の三傑のひとり、大久保利通の墓。都の旧跡に指定されている。霊園には北里柴三郎・志賀直哉・斎藤茂吉など、歴史の教科書に出てくる人の墓が数多くある', cx, cz);
      }
      // 上野英三郎博士の墓と、となりのハチ公の碑
      {
        const [x0, z0, x1, z1] = HC, cx = (x0 + x1) / 2;
        const cz = z0 + 5;
        for (const R of [[x0 + 1, cz - 4, x1 - 1, cz - 3.7], [x0 + 1, cz - 4, x0 + 1.3, cz + 4], [x1 - 1.3, cz - 4, x1 - 1, cz + 4]]) pushPrism('TKSTONE', 'TKSTONE', rectPoly(...R), 0, 0.6);   // 低い石の柵
        bake(slab, new THREE.BoxGeometry(x1 - x0 - 2, 0.25, 8).translate(cx, 0.12, cz));
        bake(st2, new THREE.BoxGeometry(1.6, 0.4, 1.0).translate(cx - 1.8, 0.45, cz - 2.4));
        bake(st2, new THREE.BoxGeometry(1.0, 2.2, 0.5).translate(cx - 1.8, 1.75, cz - 2.4));   // 上野博士の墓
        bake(st3, new THREE.BoxGeometry(1.2, 0.4, 0.8).translate(cx + 2.2, 0.45, cz - 2.2));
        bake(st3, new THREE.BoxGeometry(0.8, 1.0, 0.3).translate(cx + 2.2, 1.15, cz - 2.2));   // ハチ公の碑
        for (const s of [-1, 1]) bake(lam({ color: 0xe8e0c8 }), new THREE.BoxGeometry(0.3, 0.6, 0.3).translate(cx + s * 3.6, 0.55, cz + 1));   // 花立て
        for (const s of [-1, 1]) bake(lam({ color: s < 0 ? 0xe86a8a : 0xf0d040 }), new THREE.BoxGeometry(0.4, 0.3, 0.4).translate(cx + s * 3.6, 1.0, cz + 1));
        spot('ハチ公の碑', [x0 - 1, z0 - 1, x1 + 1, z1 + 1], 'ハチ公の碑', '🐕', '渋谷駅で飼い主の帰りを待ち続けた忠犬ハチ公の碑。飼い主だった上野英三郎博士の墓のとなりにある。ハチの体は剥製になって、上野の国立科学博物館に残されている', cx, (z0 + z1) / 2);
      }
      // 外国人墓地 (1877年に設けられた。十字架や洋風の墓石が並ぶ)
      {
        const [x0, z0, x1, z1] = GA;
        fr(x0, z0, x1, z1, '#8e9a78');
        const marble = lam({ color: 0xece8de }), grey = lam({ color: 0xb8b8b2 });
        for (let x = x0 + 3; x < x1 - 2; x += 4.5) for (let z = z0 + 3; z < z1 - 2; z += 5) {
          if (!inQ(x + 2, z)) continue;
          const t = rnd(), m = rnd() < 0.6 ? marble : grey;
          bake(m, new THREE.BoxGeometry(2.2, 0.2, 2.6).translate(x, 0.1, z));
          if (t < 0.45) { bake(m, new THREE.BoxGeometry(0.22, 1.9, 0.22).translate(x, 1.15, z - 0.9)); bake(m, new THREE.BoxGeometry(1.0, 0.22, 0.22).translate(x, 1.55, z - 0.9)); }   // 十字架
          else if (t < 0.7) bake(m, new THREE.CylinderGeometry(0.1, 0.4, 2.6, 4).translate(x, 1.5, z - 0.9));   // オベリスク
          else { const g = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 12, 1, false, 0, Math.PI); g.rotateX(Math.PI / 2); bake(m, g.translate(x, 0.9, z - 0.9)); bake(m, new THREE.BoxGeometry(1.0, 0.8, 0.25).translate(x, 0.5, z - 0.9)); }   // 丸い頭の墓石
        }
        spot('外国人墓地 (青山霊園)', GA, '外国人墓地', '✝', '1877年に設けられた外国人の墓所。明治の日本に招かれて働いた外国人たちも眠り、十字架やオベリスクなど、日本の墓とはちがう形の墓石が並ぶ', (x0 + x1) / 2, (z0 + z1) / 2);
      }
      sign(AX + 8, -1160, 1, '都立青山霊園', 8, 2.6, '#e8e4d8', '#2a2a28');
      LM_PEOPLE.push([[AX - 2, -1160, AX - 2, -982], 10], [[AX + 2, -982, AX + 2, -1160], 8], [[-2356, AZ - 1.5, -2210, AZ - 1.5], 6]);
      // 名所の範囲 (三角の土地を4つの帯で近似)
      spot('青山霊園', [-2345, -1120, -2218, -1070], '青山霊園', '🌸', '1874年に開かれた、日本で最初の公営墓地。江戸時代はここに美濃郡上藩・青山家の下屋敷があり、「青山」の地名のもとになった。面積も利用者の数も23区でいちばん大きい霊園', AX - 30, -1100);
      SPOT_AREAS.push(['青山霊園', -2320, -1166, -2245, -1120], ['青山霊園', -2365, -1070, -2190, -1020], ['青山霊園', -2374, -1020, -2162, -973]);
      SPOT_AREAS.unshift(['青山霊園の桜並木', AX - 9, -1164, AX + 9, -984]);
      LM_NOTES['青山霊園の桜並木'] = '霊園を南北に貫く道の桜並木で、都内でも有数の花見の名所。お墓の中なので、敷物を広げずに歩きながら花を眺めるのが決まり';
      LM_LABELS.push(['桜並木', AX, -1020, '🌸', '青山霊園の桜並木']);
    }

    // ===== 乃木神社 (1923年創建。乃木希典と妻・静子をまつる) =====
    {
      const R = [-2238, -1214, -2128, -1160];
      const Q = [[-2238, -1214], [-2128, -1214], [-2128, -1160], [-2212, -1160]];   // 西の辺は外苑東通りに沿う
      LM_ZONES.push(Q); clearIn((x, z) => inPoly(Q, x, z)); polyFr(Q, '#c4bca8');
      tiles(-2226, -1191, -2156, -1183, '#d2c8b0', '#c0b69e', 1.4);   // 参道 (外苑東通りから東へ)
      myojinTorii(-2214, -1187, false, 5.2, 6, lam({ color: 0x8a7a64 }), 0.32);   // 木の鳥居
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-2160, -1204, -2132, -1170), 0, 0.8);
      hall([-2156, -1200, -2136, -1174], 'WOOD', 0.8, 5, 'RF_COPPER', 4.4);   // 社殿 (1962年に再建)
      // 境内社の赤坂王子稲荷 (朱の鳥居が続く)
      for (let x = -2190; x <= -2172; x += 3) myojinTorii(x, -1205, false, 2.6, 2.2, WALL[SHU], 0.16);
      pushPrism(SHU, 'RF2', rectPoly(-2170, -1210, -2164, -1201), 0, 2.4); jRoof('RF2', -2171, -1211, -2163, -1200, 2.4, 1.4, { over: 0.6, kind: 'irimoya' });
      STONE_LANTERNS.push([-2190, -1194], [-2190, -1180], [-2170, -1194], [-2170, -1180]);
      pushPrism('WOOD', 'RF_COPPER', rectPoly(-2182, -1176, -2174, -1170), 0, 2.6); jRoof('RF_COPPER', -2183, -1177, -2173, -1169, 2.6, 1.2, { over: 0.4 });   // 手水舎
      for (let x = -2200; x < -2134; x += 7) for (const z of [-1210, -1164]) if (inPoly(Q, x, z) && !(z < -1200 && x > -2194 && x < -2160)) ROUND.push([x + rr(-1, 1), z, rr(1.1, 1.4)]);   // 境内の森
      for (let k = 0; k < 24; k++) { const x = rr(-2202, -2130), z = rr(-1212, -1162); if (!inPoly(Q, x, z) || inR([-2162, -1206, -2130, -1168], x, z) || Math.abs(z + 1187) < 6 || z < -1199 && x < -2160) continue; ROUND.push([x, z, rr(1, 1.3)]); }
      spot('乃木神社', R, '乃木神社', '⛩', '1923年に創建された、乃木希典と妻・静子をまつる神社。社殿は空襲で焼け、1962年に再建された。夫婦の神様として、ここで結婚式を挙げる人も多い', -2146, -1187);
    }

    // ===== 乃木公園 (旧乃木邸とレンガ造りの馬小屋) と乃木坂 =====
    {
      const R = [-2166, -1150, -2104, -1088];
      const Q = [[-2206, -1150], [-2104, -1150], [-2104, -1088], [-2174, -1088]];
      LM_ZONES.push(Q); clearIn((x, z) => inPoly(Q, x, z)); polyFr(Q, '#a8b080');
      // 母屋: 坂の傾斜を生かした木造の家 (黒い下見板張り)
      const KUROITA = LM_MAT('KO_NOGI', (x, y) => {
        x.fillStyle = '#3e3430'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#2c2422'; for (let j = 0; j < 32; j += 2) x.fillRect(0, j, 32, 1);
        for (const wx of [5, 21]) { x.fillStyle = '#d8d0bc'; x.fillRect(wx - 1, 11, 8, 11); x.fillStyle = '#4a5660'; x.fillRect(wx, 12, 6, 9); x.fillStyle = '#d8d0bc'; x.fillRect(wx + 2.5, 12, 1, 9); y.fillStyle = '#000'; }
        y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      });
      pushPrism(KUROITA, 'ROOF', rectPoly(-2156, -1140, -2136, -1124), 0, 8);    // 坂の下側は3階分
      pushPrism(KUROITA, 'ROOF', rectPoly(-2152, -1124, -2140, -1116), 0, 5);    // 玄関
      jRoof('RF0', -2157, -1141, -2135, -1123, 8, 2.6, { over: 0.8, kind: 'hip' });
      jRoof('RF0', -2153, -1125, -2139, -1115, 5, 1.8, { over: 0.6, kind: 'hip' });
      // 馬小屋 (1889年。母屋より立派といわれた)
      const RB = LM_MAT('KO_NOGIBRK', (x, y) => { x.fillStyle = '#a24a34'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#86382a'; for (let j = 0; j < 32; j += 3) x.fillRect(0, j, 32, 1); x.fillStyle = '#e4dccc'; for (const wx of [6, 20]) { x.fillRect(wx, 6, 6, 3); x.fillStyle = '#2a2220'; x.fillRect(wx, 9, 6, 12); x.fillStyle = '#e4dccc'; } y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); });
      pushPrism(RB, 'ROOF', rectPoly(-2128, -1138, -2110, -1122), 0, 5);
      jRoof('RF0', -2129, -1139, -2109, -1121, 5, 2.4, { over: 0.6, kind: 'irimoya' });
      tiles(-2162, -1112, -2108, -1106, '#c4b89c', '#b4a88c', 1.5);   // 見学の通路
      for (let k = 0; k < 16; k++) { const x = rr(-2164, -2106), z = rr(-1148, -1090); if (inR([-2160, -1144, -2106, -1104], x, z)) continue; (rnd() < 0.5 ? ROUND : MAPLES).push([x, z, rr(0.9, 1.3)]); }
      spot('乃木公園 (旧乃木邸)', R, '旧乃木邸', '🏠', '明治の軍人・乃木希典が1879年から住んだ屋敷の跡。いまの母屋は1902年に将軍みずからの設計で改造したもので、坂の傾斜をうまく使った3階建て。将軍の遺志で東京市に寄付され、1913年に公園になった', -2145, -1129);
      SPOT_AREAS.unshift(['旧乃木邸の馬小屋', -2131, -1141, -2107, -1119]);
      LM_NOTES['旧乃木邸の馬小屋'] = '1889年に建てられたレンガ造りの厩。馬を大切にした将軍のこだわりで、質素な木造の母屋より立派だったため「新坂の馬屋敷」と呼ばれた';
      // 乃木坂 (旧乃木邸の南を東へ下る坂)
      const S = [-2170, -1086, -2060, -1074];
      site(S, null);
      tiles(...S, '#8a8a88', '#7e7e7c', 2);
      for (let x = -2164; x < -2064; x += 12) LAMPS2.push([x, -1085]);
      spot('乃木坂', S, '乃木坂', '⛰', 'もとは「幽霊坂」と呼ばれていた坂で、乃木希典の葬儀にあわせて「乃木坂」と名前が改められた', -2110, -1080);
    }
    bakeFlush();
  },
});
