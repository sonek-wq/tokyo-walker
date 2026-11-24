/* 深川 (清澄白河・森下・門前仲町・木場) — 名所が空白だった隅田川の東岸
   - 小名木川と仙台堀川 (運河そのものは regions/00_geography.js)
   - 常盤: 芭蕉庵史跡展望庭園 (屋上の庭と芭蕉像)・芭蕉稲荷神社・芭蕉記念館・萬年橋
   - 清澄: 清澄庭園 (大泉水・3つの中島・磯渡り・涼亭・築山「富士山」)・仙台堀川の桜並木と採荼庵跡
   - 門前仲町: 深川不動堂 (梵字に包まれた本堂と旧本堂・参道) / 富岡八幡宮 (大鳥居・伊能忠敬像・横綱力士碑)
   - 木場: 木場公園 (木場公園大橋・イベント池の角乗・ふれあい広場・大花壇) と 東京都現代美術館 */
REGION({
  name: '深川',
  towns: [['常盤', 1238, -2118], ['富岡', 1420, -1146], ['三好', 1880, -1650], ['平野', 1660, -1620]],
  labels: [],
  build(r) {
    const { site, spot, sign, SHU, STONE, plasterWood, hall, street } = SL_KIT();
    const BRONZE = WALL.BRONZE;
    const trees = (R, n, list = ROUND, avoid = null, s0 = 0.8, s1 = 1.2, base) => {
      for (let k = 0; k < n; k++) { const x = rr(R[0] + 2, R[2] - 2), z = rr(R[1] + 2, R[3] - 2); if (avoid && avoid(x, z)) continue; list.push(base === undefined ? [x, z, rr(s0, s1)] : [x, z, rr(s0, s1), base]); }
    };
    // 2点を結ぶ細い棒 (斜張橋のケーブルなど)
    const rod = (M, a, b, rad) => {
      const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), L = d.length();
      const g = new THREE.CylinderGeometry(rad, rad, L, 4);
      g.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())));
      bake(M, g.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2));
    };
    // 座った人の像 (ry = 顔の向き。0 で北)
    const seated = (x, z, y0, s, ry, M) => {
      const c = Math.cos(ry), sn = Math.sin(ry);
      const put = (w, h, d, ox, oy, oz) => bake(M, new THREE.BoxGeometry(w * s, h * s, d * s).rotateY(ry).translate(x + (ox * c + oz * sn) * s, y0 + oy * s, z + (-ox * sn + oz * c) * s));
      put(0.9, 0.35, 0.9, 0, 0.18, 0);                       // 台 (岩)
      put(0.6, 0.25, 0.7, 0, 0.48, -0.1);                    // 組んだ脚
      put(0.5, 0.65, 0.34, 0, 0.92, 0.08);                   // 胴 (着物)
      put(0.26, 0.28, 0.26, 0, 1.38, 0.06);                  // 頭
      put(0.34, 0.06, 0.34, 0, 1.55, 0.06);                  // 頭巾
      solid(x - 0.5 * s, z - 0.5 * s, x + 0.5 * s, z + 0.5 * s, y0, y0 + 1.6 * s);
    };

    // ===== 常盤: 芭蕉庵史跡展望庭園・芭蕉稲荷神社・芭蕉記念館 (小名木川が隅田川に注ぐところ) =====
    {
      const R = [1189, -2103, 1202, -2068];
      site(R, '#a8a49a');
      pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(1190, -2090, 1201, -2070), 0, 5);
      stairs([1192.5, -2102, 1198.5, -2090], 5, 'z+');
      bake(lam({ color: 0x3d7598 }), new THREE.BoxGeometry(2.6, 0.12, 3.2).translate(1198, 5.06, -2084));   // 古池を模した水場
      seated(1193, -2076, 5, 1.15, Math.PI / 2, BRONZE);   // 隅田川を見わたす芭蕉像
      PINES.push([1198.5, -2074, 0.5, 5]);
      LM_HEIGHT_AREAS.unshift(['芭蕉庵史跡展望庭園 (屋上)', (x, z, y) => y > 4 && inR([1190, -2090, 1201, -2070], x, z)]);
      spot('芭蕉庵史跡展望庭園', R, '芭蕉庵', '🐸', '松尾芭蕉が暮らした「深川芭蕉庵」があったとされる、小名木川と隅田川の合流点。屋上の庭の芭蕉像は、仕掛けでくるりと回って向きを変える');
      LM_NOTES['芭蕉庵史跡展望庭園 (屋上)'] = LM_NOTES['芭蕉庵史跡展望庭園'];
      // 芭蕉稲荷神社
      const S = [1214, -2116, 1232, -2092];
      site(S, '#bdb4a0');
      myojinTorii(1223, -2095, true, 3, 2.6, lam({ color: 0xc8402a }), 0.16);
      pushPrism('WOOD', 'WOOD', rectPoly(1220, -2112, 1226, -2106), 0, 2.2); jRoof('RF2', 1220, -2112, 1226, -2106, 2.2, 1.2, { over: 0.4, kind: 'irimoya' });
      for (let k = 0; k < 4; k++) bake(lam({ color: k % 2 ? 0xd8c8a0 : 0xc8402a }), new THREE.BoxGeometry(0.12, 2.2, 0.5).translate(1217, 1.1, -2110 + k * 3.4));   // のぼり旗
      spot('芭蕉稲荷神社', S, '芭蕉稲荷', '⛩', '芭蕉庵の跡と伝わる場所の小さな神社。芭蕉庵はもともと門人・杉山杉風の別宅で、魚問屋だった杉風の生簀 (いけす) の跡が「古池や蛙飛びこむ水のおと」の古池だったといわれる');
      // 芭蕉記念館
      const M = [1196, -2162, 1240, -2128];
      site(M, '#b8b2a2');
      hall([1204, -2156, 1232, -2140], plasterWood('FK_BASHO', '#e8e0cc', '#4a3a2c'), 0, 4.5, 'RF2', 3.2);
      const BAN = lam({ color: 0x5a9a3a });
      for (const [x, z] of [[1200, -2134], [1236, -2134], [1200, -2158]]) {
        bake(lam({ color: 0x6a7a4a }), new THREE.CylinderGeometry(0.25, 0.3, 2.4, 6).translate(x, 1.2, z));
        for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; bake(BAN, new THREE.BoxGeometry(2.6, 0.08, 0.9).rotateZ(-0.5).rotateY(a).translate(x + Math.cos(a) * 1.1, 2.6, z - Math.sin(a) * 1.1)); }
      }
      sign(1218, -2139.6, 1, '芭蕉記念館', 8, 3.4);
      spot('芭蕉記念館', M, '芭蕉記念館', '📜', '芭蕉ゆかりの資料を集めた記念館。「芭蕉」という名前は、門人から贈られて庵に植えたバショウ (芭蕉) の木がよく茂ったことから。庭にもバショウが植えられている');
      spot('萬年橋', [1208, -2086, 1236, -2026], null, null, '小名木川が隅田川に注ぐところに架かる橋。葛飾北斎は「富嶽三十六景」で、この橋の下から富士山を望む絵を描いている');
      LM_NOTES['小名木川'] = '徳川家康が江戸に入ってすぐ、千葉の行徳でとれる塩を船で運ぶために掘らせた運河。まっすぐに東へ延び、江戸の町の物流を支えた';
    }

    // ===== 清澄: 清澄庭園 (大泉水・3つの中島・磯渡り・涼亭・築山「富士山」) =====
    {
      const R = [1310, -1846, 1442, -1716];
      site(R, '#8a9a64');
      // 周りの塀 (南と東に入口)
      for (const [x0, z0, x1, z1] of [[1310, -1846, 1442, -1845], [1310, -1717, 1370, -1716], [1382, -1717, 1442, -1716], [1310, -1846, 1311, -1716], [1441, -1846, 1442, -1800], [1441, -1790, 1442, -1716]])
        pushPrism('CONC', 'RF0', rectPoly(x0, z0, x1, z1), 0, 1.8);
      tiles(1370, -1717, 1382, -1712, '#cfc6b0', '#bdb49c', 1.5);
      const PX = 1380, PZ = -1784, PRX = 44, PRZ = 36;
      fe(PX, PZ, PRX + 4, PRZ + 4, '#b8ac8c'); fe(PX, PZ, PRX, PRZ, '#3a6a64'); PONDS.push([PX, PZ, PRX, PRZ]);
      // 3つの中島 (松が生える)
      for (const [x, z, a, b] of [[1366, -1790, 9, 6], [1392, -1772, 6, 4], [1398, -1798, 5, 3.5]]) {
        POND_LAND.push(['e', x, z, a, b]); fe(x, z, a, b, '#6a8a4a');
        pushPrism('GRASSTOP', 'GRASSTOP', regularPoly(x, z, Math.min(a, b) * 0.7, 8), 0, 0.6);
        for (let k = 0; k < 3; k++) PINES.push([x + rr(-a * 0.5, a * 0.5), z + rr(-b * 0.5, b * 0.5), rr(0.6, 0.85), 0.6]);
      }
      // 中の島へ渡る石橋
      POND_LAND.push(['r', 1364.6, -1820, 1367.4, -1795]); for (let z = -1819; z < -1796; z += 3) bake(lam({ color: 0x9a968a }), new THREE.BoxGeometry(2.6, 0.3, 3).translate(1366, 0.15, z + 1.5));
      // 磯渡り (池の東の岸ぞいに置かれた飛び石。全国から船で運んだ自然石)
      const ISO = [0x8a8478, 0x9a8a78, 0x7a8088, 0xa08070, 0x888070];
      for (let a = -1.15, k = 0; a < 1.05; a += 0.06, k++) {
        const x = PX + Math.cos(a) * (PRX - 1.6), z = PZ + Math.sin(a) * (PRZ - 1.6);
        POND_LAND.push(['e', x, z, 1.7, 1.7]);
        bake(lam({ color: ISO[k % ISO.length] }), new THREE.CylinderGeometry(rr(1.0, 1.25), rr(1.2, 1.4), 0.35, 7).translate(x, 0.18, z));
        solid(x - 0.7, z - 0.7, x + 0.7, z + 0.7, 0, 0.36);
      }
      // 涼亭 (池に張り出した数寄屋造りの建物)
      const RY = plasterWood('FK_RYOTEI', '#e8dcc4', '#5a4030');
      pushPrism(RY, 'WOOD', rectPoly(1338, -1826, 1360, -1810), 0.5, 3.6);
      for (const [x, z] of [[1346, -1811], [1352, -1811], [1359, -1811], [1359, -1818]]) bake(lam({ color: 0x4a3a2a }), new THREE.BoxGeometry(0.4, 2.2, 0.4).translate(x, -0.6, z));
      jRoof('RF0', 1338, -1826, 1360, -1810, 3.6, 2.6, { over: 1.4, kind: 'irimoya' });
      // 築山「富士山」 (園内でいちばん高い築山。つつじが植わる)
      hill(1328, -1742, 13, 5.5);
      for (let k = 0; k < 18; k++) { const a = rr(0, 6.28), d = rr(3, 11); bake(lam({ color: MONTH === 4 || MONTH === 5 ? 0xe0508a : 0x3e6a34 }), new THREE.DodecahedronGeometry(0.8, 0).scale(1, 0.6, 1).translate(1328 + Math.cos(a) * d, 5.5 * (1 - d / 13) + 0.3, -1742 + Math.sin(a) * d)); }
      // 名石と石灯籠
      for (let k = 0; k < 14; k++) { const a = rr(0, 6.28), x = PX + Math.cos(a) * (PRX + rr(5, 12)), z = PZ + Math.sin(a) * (PRZ + rr(5, 10)); if (!inR(R, x, z, -3) || Math.hypot(x - 1328, z + 1742) < 15) continue;
        bake(lam({ color: k === 0 ? 0x9a3a2a : pick([0x8a8478, 0x6a7078, 0x9a9488]) }), new THREE.DodecahedronGeometry(rr(0.7, 1.4), 0).scale(1.3, 0.8, 1).translate(x, 0.4, z)); }   // 佐渡の赤玉石もある
      STONE_LANTERNS.push([1340, -1820], [1420, -1752], [1414, -1822], [1352, -1748]);
      trees(R, 70, PINES, (x, z) => Math.hypot((x - PX) / (PRX + 6), (z - PZ) / (PRZ + 6)) < 1 || Math.hypot(x - 1328, z + 1742) < 14, 0.7, 1.1);
      trees(R, 25, MAPLES, (x, z) => Math.hypot((x - PX) / (PRX + 6), (z - PZ) / (PRZ + 6)) < 1 || Math.hypot(x - 1328, z + 1742) < 14);
      LM_PEOPLE.push([[1325, -1832, 1435, -1832], 3], [[1432, -1830, 1432, -1730], 2]);
      spot('清澄庭園', R, '清澄庭園', '🏞', '三菱をおこした岩崎弥太郎が、社員の憩いや大切なお客のもてなしのために造った庭園。全国から自分の会社の船で名石を集めて運び込んだ「石の庭」でもある');
      SPOT_AREAS.unshift(['磯渡り (清澄庭園)', 1408, -1820, 1430, -1752], ['涼亭 (清澄庭園)', 1336, -1830, 1362, -1806], ['富士山 (清澄庭園の築山)', 1315, -1755, 1341, -1729]);
      LM_NOTES['磯渡り (清澄庭園)'] = '池のふちに飛び石を並べた道。石の上を歩きながら、水面に近い目線で池を眺められる';
      LM_NOTES['涼亭 (清澄庭園)'] = '池に張り出して建つ数寄屋造りの建物。1909年、イギリスのキッチナー元帥を迎えるために岩崎家が建てた';
      LM_NOTES['富士山 (清澄庭園の築山)'] = '園内でいちばん高い築山で、その名も「富士山」。つつじやさつきが植えられている';
    }

    // ===== 仙台堀川の桜並木と採荼庵跡 (芭蕉はここから舟で「おくのほそ道」の旅に出た) =====
    {
      const P = [[1180, -1734], [1300, -1700], [1450, -1648], [1600, -1580], [1752, -1518]];
      for (let i = 0; i + 1 < P.length; i++) {
        const [ax, az] = P[i], [bx, bz] = P[i + 1], l = Math.hypot(bx - ax, bz - az), nx = -(bz - az) / l, nz = (bx - ax) / l;
        for (let s = 6; s < l - 4; s += 11) for (const sd of [-1, 1]) {
          const x = ax + (bx - ax) * s / l + nx * sd * 11, z = az + (bz - az) * s / l + nz * sd * 11;
          if (inR([1308, -1848, 1444, -1714], x, z) || inR([1752, -1740, 1990, -1110], x, z) || inR([1430, -1680, 1470, -1610], x, z)) continue;
          if (Math.abs(x % 100) < 9 || Math.abs(x % 100) > 91) continue;   // 橋のたもと
          SAKURA.push([x, z, rr(0.75, 0.95)]);
        }
      }
      LM_ZONES.push(rectPoly(1446, -1630, 1468, -1612)); fr(1446, -1630, 1468, -1612, '#bdb4a0');
      pushPrism('WOOD', 'RF0', rectPoly(1452, -1624, 1464, -1617), 0, 2.6); jRoof('RF0', 1452, -1624, 1464, -1617, 2.6, 1.6, { over: 0.6, kind: 'hip' });
      bake(lam({ color: 0x4a3a2a }), new THREE.BoxGeometry(12, 0.3, 1.6).translate(1458, 0.55, -1625.2));   // 縁側
      seated(1456, -1626.6, 0.7, 0.9, 0, BRONZE);   // 縁側に腰かけて旅立とうとする芭蕉
      spot('採荼庵跡 (さいとあん)', [1446, -1632, 1468, -1612], '採荼庵跡', '🧳', '芭蕉の門人・杉山杉風の庵の跡。1689年、芭蕉は住まいを人にゆずり、ここから舟で「おくのほそ道」の旅に出た。縁側には旅姿の芭蕉像がある');
      LM_NOTES['仙台堀川'] = '北岸に仙台藩の蔵屋敷があり、仙台から運んだ米をこの運河で運び入れたことから「仙台堀」と呼ばれた。岸の遊歩道には「おくのほそ道」の句の札が並ぶ';
    }

    // ===== 門前仲町: 深川不動堂 (成田山東京別院) と参道 =====
    {
      const BONJI = LM_MAT('FK_BONJI', (x, y) => {
        x.fillStyle = '#2a201c'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
        x.strokeStyle = '#d8b050'; x.lineWidth = 1.3; y.strokeStyle = '#5a4818'; y.lineWidth = 1.3;
        for (const [cx, cy] of [[8, 8], [24, 8], [8, 24], [24, 24]]) for (const g of [x, y]) {   // 梵字 (不動明王の真言) を思わせる文字
          g.beginPath(); g.moveTo(cx - 5, cy - 5); g.lineTo(cx + 5, cy - 5);
          g.moveTo(cx - 2, cy - 5); g.quadraticCurveTo(cx - 6, cy, cx - 1, cy + 1); g.quadraticCurveTo(cx + 5, cy + 2, cx + 1, cy + 6);
          g.moveTo(cx + 3, cy - 5); g.lineTo(cx + 3, cy + 1); g.stroke();
          g.beginPath(); g.arc(cx + 4, cy - 7, 0.9, 0, 6.3); g.stroke();
        }
      });
      const R = [1326, -1190, 1392, -1092];
      site([1326, -1132, 1392, -1092], '#c4bca8');
      // 参道 (人情深川ご利益通り)
      const F = frame(1346, -1188, 0, 1, 1, 0);
      street(F, 56, { hw: 3.6, c1: '#c8bca4', c2: '#b8ac94', ts: 1.4, gates: [[1.5, '深川不動尊 参道']] });
      // 本堂 (梵字の壁に包まれた新しい本堂) と旧本堂
      pushPrism(BONJI, 'ROOF', rectPoly(1330, -1128, 1362, -1100), 0, 11);
      jRoof('RF2', 1330, -1128, 1362, -1100, 11, 5, { over: 1.6, kind: 'irimoya' });
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(1336, -1100, 1356, -1096), 0, 0.5);
      hall([1368, -1124, 1388, -1104], 'WOOD', 0.6, 5.5, 'RF2', 4.6);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(1366, -1126, 1390, -1102), 0, 0.6);
      for (let k = 0; k < 6; k++) LANTERNS.push([1340 + k * 3.4, -1095]);
      trees([1326, -1132, 1392, -1092], 6, GINKGO, (x, z) => inR([1328, -1130, 1390, -1094], x, z));
      spot('深川不動堂', R, '深川不動堂', '🔥', '千葉の成田山新勝寺の東京別院。江戸時代、成田のお不動様を江戸で特別に公開する「出開帳」がこのあたりで開かれたのが始まり。2011年にできた本堂は、壁一面が不動明王の真言の梵字で包まれている', 1346, -1112);
    }

    // ===== 門前仲町: 富岡八幡宮 (大鳥居・伊能忠敬像・横綱力士碑) =====
    {
      const R = [1408, -1190, 1504, -1088];
      site(R, '#c2b8a0');
      tiles(1450, -1190, 1462, -1132, '#d4cab2', '#c2b8a0', 1.5);
      myojinTorii(1456, -1184, true, 9, 9, lam({ color: 0xc8402a }), 0.5);   // 大鳥居 (永代通りに面する)
      myojinTorii(1456, -1146, true, 6, 6.5, STONE, 0.35);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(1428, -1132, 1484, -1094), 0, 0.8);
      hall([1434, -1128, 1478, -1112], SHU, 0.8, 6, 'RF_COPPER', 6);   // 拝殿
      hall([1442, -1110, 1470, -1098], SHU, 0.8, 5, 'RF_COPPER', 4.5); // 本殿
      // 伊能忠敬像 (大鳥居をくぐってすぐ左)
      acStatue(1444, -1176, 0, 1.25, -Math.PI / 2, BRONZE, 'stand', { w: 1.8, h: 1.6, mat: 'TKSTONE' });
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(1438, -1172.6, 1450, -1171.6), 0, 2.4);   // 日本地図の碑
      // 横綱力士碑 (歴代横綱の名を刻んだ大きな石碑)
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(1486, -1158, 1498, -1155), 0.8, 4.6); pushPrism('TKSTONE', 'TKSTONE', rectPoly(1484, -1160, 1500, -1153), 0, 0.8);
      STONE_LANTERNS.push([1450, -1160], [1462, -1160], [1450, -1140], [1462, -1140]);
      trees(R, 18, GINKGO, (x, z) => (x > 1440 && x < 1472) || inR([1426, -1134, 1486, -1092], x, z) || inR([1482, -1162, 1502, -1150], x, z));
      LM_PEOPLE.push([[1456, -1186, 1456, -1134], 4]);
      spot('富岡八幡宮', R, '富岡八幡宮', '⛩', '「深川の八幡さま」と呼ばれる江戸最大の八幡宮。夏の深川八幡祭りは江戸三大祭りのひとつ。江戸時代に約100年間ここで勧進相撲が開かれた、大相撲発祥の地でもある', 1456, -1150);
      SPOT_AREAS.unshift(['伊能忠敬像 (富岡八幡宮)', 1436, -1182, 1452, -1168], ['横綱力士碑 (富岡八幡宮)', 1482, -1164, 1502, -1150]);
      LM_NOTES['伊能忠敬像 (富岡八幡宮)'] = '初めて実測で日本地図をつくった伊能忠敬は、門前仲町に住み、測量の旅に出る前に必ずここで旅の安全を祈った';
      LM_NOTES['横綱力士碑 (富岡八幡宮)'] = '歴代の横綱の名前が刻まれた大きな石碑。新しい横綱が生まれると、ここで土俵入りが奉納される';
    }

    // ===== 木場: 木場公園 (木場公園大橋・イベント池・ふれあい広場) と 東京都現代美術館 =====
    {
      const R = [1762, -1736, 1986, -1120], CZ = x => -1515 + (x - 1760) * 25 / 230;   // CZ: 仙台堀川の中心の z
      site(R, '#7a9a54');
      // 東京都現代美術館 (公園の北の端)
      const MOT = LM_MAT('FK_MOT', (x, y) => {
        x.fillStyle = '#b8b4ac'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#a4a098'; for (let j = 0; j < 32; j += 8) x.fillRect(0, j, 32, 1);
        x.fillStyle = '#6a7a88'; x.fillRect(0, 18, 32, 10); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); y.fillStyle = '#5a5040'; y.fillRect(0, 18, 32, 10);
        x.fillStyle = '#8a8c90'; for (let i = 0; i < 32; i += 4) x.fillRect(i, 18, 1, 10);
      });
      pushPrism(MOT, 'ROOF', rectPoly(1788, -1730, 1960, -1700), 0, 14);
      pushPrism('glass', 'ROOF', rectPoly(1800, -1700, 1950, -1692), 0, 11);   // 長いガラスのエントランス
      pushPrism(MOT, 'ROOF', rectPoly(1930, -1692, 1960, -1666), 0, 12);
      tiles(1788, -1690, 1928, -1672, '#c8c4ba', '#b8b4aa', 2);
      sign(1872, -1691.6, 1, '東京都現代美術館', 18, 9.6, '#2a2a2a', '#f0f0f0');
      spot('東京都現代美術館', [1786, -1734, 1962, -1664], '現代美術館', '🎨', '1995年開館の、現代美術専門の美術館。上野の東京府美術館から受け継いだ作品をもとにスタートし、大きな作品を展示できるよう天井の高い吹き抜けの展示室をもつ', 1872, -1710);
      // 北地区: 円形のイベント広場
      fe(1872, -1600, 22, 22, '#c8bca4'); fe(1872, -1600, 6, 6, '#a89c84');
      pushPrism('CONC', 'TKSTONE', rectPoly(1862, -1626, 1882, -1620), 0, 1.0);   // 野外ステージ
      // 中地区: 大花壇 (仙台堀川と葛西橋通りのあいだ)
      const FL = [0xe04a5a, 0xf0c040, 0xe878b8, 0xf08a3a, 0xa060d0];
      for (let k = 0; k < 9; k++) { const x0 = 1772 + k * 22; if (Math.abs(x0 + 7 - 1875) < 12) continue; fe(x0 + 7, -1450, 8, 3.5, '#5a7a3a'); for (let j = 0; j < 10; j++) bake(lam({ color: FL[(k + j) % FL.length] }), new THREE.DodecahedronGeometry(0.55, 0).scale(1, 0.45, 1).translate(x0 + 7 + rr(-6, 6), 0.25, -1450 + rr(-2.5, 2.5))); }
      // 南地区: 入口のイベント池 (木場の角乗) と ふれあい広場
      fe(1874, -1150, 24, 14, '#8a8478'); fe(1874, -1150, 21, 11, '#3d7598'); PONDS.push([1874, -1150, 21, 11]);
      const LOG = lam({ color: 0x9a7a52 });
      for (const [x, z, a] of [[1866, -1152, 0.2], [1882, -1146, -0.3], [1874, -1158, 0.05]]) bake(LOG, new THREE.BoxGeometry(9, 0.6, 0.6).rotateY(a).translate(x, 0.05, z));
      acStatue(1866, -1152, 0.35, 0.9, Math.PI / 2, lam({ color: 0x3a4a6a }), 'wave', null);   // 角材に乗る川並
      fe(1874, -1280, 70, 56, '#8ab45a');   // ふれあい広場の原っぱ
      for (let k = 0; k < 20; k++) BENCHES.push([1800 + (k % 10) * 15, k < 10 ? -1338 : -1222, k < 10 ? 0 : Math.PI]);
      // 木場公園大橋 (仙台堀川と葛西橋通りをまたぐ斜張橋)
      archBridge(1875, -1572, 1875, -1388, 8, 9, '木場公園大橋');
      const PYL = lam({ color: 0xe8e8e4 }), CAB = lam({ color: 0xd0d4d8 });
      const PYZ = -1540, deckY = z => 9 * Math.sin(Math.PI * (z + 1572) / 184) + 1.1;
      for (const sx of [-6.5, 6.5]) { rod(PYL, [1875 + sx, 0, PYZ], [1875 + sx * 0.12, 44, PYZ], 0.7); solid(1875 + sx - 0.8, PYZ - 0.8, 1875 + sx + 0.8, PYZ + 0.8, 0, 12); }
      bake(PYL, new THREE.BoxGeometry(2.4, 6, 2.4).translate(1875, 46, PYZ));
      for (const sx of [-4, 4]) for (let k = 1; k <= 7; k++) for (const sd of [-1, 1]) {
        const z = PYZ + sd * k * (sd < 0 ? 4 : 19.5); if (z < -1570 || z > -1392) continue;
        rod(CAB, [1875 + sx * 0.15, 40 + k * 0.6, PYZ], [1875 + sx, deckY(z), z], 0.12);
      }
      // 外周の厚い植栽帯 (「水と緑の森林公園」)
      for (let z = -1655; z < -1126; z += 5) for (const x of [1768, 1775, 1973, 1980]) {
        if (Math.abs(z - CZ(x)) < 13 || Math.abs(z + 1400) < 12) continue;
        ROUND.push([x + rr(-1.5, 1.5), z + rr(-1.5, 1.5), rr(0.9, 1.3)]);
      }
      for (let x = 1768; x < 1982; x += 5) { if (Math.abs(x - 1874) < 14) continue; ROUND.push([x + rr(-1.5, 1.5), -1127 + rr(-1.5, 1.5), rr(0.9, 1.3)]); }
      // 木と散歩道
      trees(R, 220, ROUND, (x, z) => z < -1660 || Math.abs(x - 1875) < 9 || Math.hypot((x - 1874) / 74, (z + 1280) / 60) < 1 || Math.hypot((x - 1872) / 25, (z + 1600) / 25) < 1 || (z > -1530 && z < -1384) || Math.hypot((x - 1874) / 27, (z + 1150) / 17) < 1, 0.9, 1.3);
      trees(R, 40, SAKURA, (x, z) => { const d = Math.abs(z - CZ(x)); return d < 12 || d > 22 || Math.abs(x - 1875) < 9 || Math.abs(x - 1800) < 8 || Math.abs(x - 1900) < 12; });
      LM_PEOPLE.push([[1780, -1600, 1965, -1600], 5], [[1790, -1280, 1960, -1280], 8], [[1875, -1560, 1875, -1400, 0], 2]);
      spot('木場公園', R, '木場公園', '🌳', '江戸時代から「材木のまち」として栄えた木場の、材木屋さんたちが新木場へ引っ越したあとの跡地を森の公園にした。真ん中のイベント池では、角材に乗って操る伝統芸「木場の角乗」が披露される', 1874, -1300);
      SPOT_AREAS.unshift(['木場公園大橋', 1868, -1574, 1882, -1386]);
      LM_NOTES['木場公園大橋'] = '仙台堀川と大通りをひとまたぎにする長さ250mの斜張橋。高い主塔から張ったケーブルで橋をつっている。東京スカイツリーのながめのよい場所でもある';
      LM_HEIGHT_AREAS.unshift(['木場公園大橋 (橋の上)', (x, z, y) => y > 3 && inR([1870, -1572, 1880, -1388], x, z)]);
      LM_NOTES['木場公園大橋 (橋の上)'] = LM_NOTES['木場公園大橋'];
    }
    bakeFlush();
  },
});
