/* 赤坂見附・元赤坂 (迎賓館赤坂離宮と赤坂御用地)
   赤坂見附 (江戸城の外堀の門の石垣・弁慶堀と弁慶橋) / 豊川稲荷東京別院 / 赤坂御用地 (塀と森。園遊会の赤坂御苑) /
   迎賓館赤坂離宮 (1909年に東宮御所として建てられたネオ・バロックの宮殿。正門・前庭・主庭の噴水) / 東京ガーデンテラス紀尾井町 / 赤坂サカス
   霞が関・永田町 (stations/jy30) の西。青山通り は赤坂見附から西南西へ、青山一丁目で 外苑東通り と交わり、原宿の表参道へつながる */
const AK_ROAD = [];   // 斜めの道 (名前の表示用): [名前, frame, L, w]
function akRoad(a, b, w, name, opt = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), F = frame(a[0], a[1], b[0] - a[0], b[1] - a[1], -(b[1] - a[1]) / L, (b[0] - a[0]) / L);
  oRoad(F, 0, -w / 2, L, w / 2, true, opt.cross || []);
  if (opt.walk !== false) { oTiles(F, 0, -w / 2 - 5, L, -w / 2, '#c8c0b0', '#b6ae9e', 2); oTiles(F, 0, w / 2, L, w / 2 + 5, '#c8c0b0', '#b6ae9e', 2); }
  LM_ZONES.push(F.rect(-2, -w / 2 - 6, L + 2, w / 2 + 6));
  if (opt.trees !== false) for (let u = 8; u < L - 8; u += 11) LM_STREET.push([...F.w(u, -w / 2 - 2.5), 1.1], [...F.w(u + 5.5, w / 2 + 2.5), 1.1]);
  LM_PEOPLE.push([[...F.w(3, -w / 2 - 2.5), ...F.w(L - 3, -w / 2 - 2.5)], Math.max(4, Math.round(L / 30))], [[...F.w(L - 3, w / 2 + 2.5), ...F.w(3, w / 2 + 2.5)], Math.max(3, Math.round(L / 40))]);
  AK_ROAD.push([name, F, L, w]);
  LM_HEIGHT_AREAS.push([name, (x, z, y) => { if (y > 3) return false; const dx = x - F.ox, dz = z - F.oz, u = dx * F.ux + dz * F.uz, v = dx * F.vx + dz * F.vz; return u > -2 && u < L + 2 && Math.abs(v) < w / 2 + 5; }]);
  return F;
}
REGION({
  name: '赤坂',
  towns: [['元赤坂', -1900, -1500], ['赤坂', -1800, -1300], ['紀尾井町', -1640, -1780], ['北青山', -2250, -1150], ['信濃町', -2290, -1880]],
  labels: [],
  build(r) {
    const M = (key, bg, win, lit, cw = 2, cs = 3, rh = 3, rs = 4) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rs) for (let i = 1; i < 32; i += cs) { x.fillStyle = win; x.fillRect(i, j, cw, rh); y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, j, cw, rh); }
    });
    const water = (cx, cz, rx, rz) => { PONDS.push([cx, cz, rx, rz]); fe(cx, cz, rx, rz, '#2d6585'); };
    const GEI = LM_MAT('AK_GEI', (x, y) => {   // 迎賓館: 白い花崗岩と縦長の窓
      x.fillStyle = '#e6e0d2'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (const j of [5, 19]) for (let i = 1; i < 32; i += 4) { x.fillStyle = '#5a5a5c'; x.fillRect(i, j, 2, 8); x.fillStyle = '#f4f0e6'; x.fillRect(i - 0.5, j - 1, 3, 1); y.fillStyle = rnd() < 0.5 ? '#ffe4b0' : '#000'; y.fillRect(i, j, 2, 8); }
      x.fillStyle = '#d4cdbd'; x.fillRect(0, 15, 32, 2); x.fillRect(0, 30, 32, 2);
    });
    const SHU = lam({ color: 0xc4321c }), GOLD = lam({ color: 0xd8b040, emissive: 0x3a2a00 }), IRON = lam({ color: 0x2a2a2c });
    if (!WALL.AK_FENCE) WALL.AK_FENCE = lam({ color: 0xcfc8b8 });

    // ===== 道路 =====
    const C2 = [-1720, -1616], AO1 = [-2284, -1250];   // 赤坂見附 / 青山一丁目
    addRoads([[-1744, -1905, -1720, -1106, 'ns', '外堀通り'], [-2296, -1905, -2272, -1262, 'ns', '外苑東通り']]);
    tiles(-1750, -1905, -1744, -1106, '#c8c0b0', '#b6ae9e', 2); tiles(-1720, -1600, -1714, -1106, '#c8c0b0', '#b6ae9e', 2); tiles(-2272, -1905, -2266, -1262, '#c8c0b0', '#b6ae9e', 2);
    for (let z = -1895; z < -1110; z += 12) LM_STREET.push([-1747, z, 1.1]);
    akRoad([C2[0] - 12, C2[1]], AO1, 26, '青山通り', { cross: [6, 660] });
    akRoad(AO1, [-2380, -1060], 26, '青山通り');
    LM_PEOPLE.push([[-1747, -1900, -1747, -1110], 16], [[-2269, -1260, -2269, -1900], 10]);

    // ===== 赤坂見附 (外堀の門の石垣)・弁慶堀と弁慶橋 =====
    {
      pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(-1716, -1650, -1700, -1634), 0, 4.5);
      water(-1694, -1758, 17, 110);
      POND_LAND.push(['r', -1714, -1704, -1674, -1696]);
      tiles(-1714, -1704, -1674, -1696, '#a88a6a', '#9a7c5c', 1);
      for (const z of [-1704, -1696]) for (let x = -1712; x <= -1676; x += 6) { pushPrism('KS_SHU' in WALL ? 'KS_SHU' : 'WOOD', 'WOOD', rectPoly(x - 0.2, z - 0.2, x + 0.2, z + 0.2), 0, 1.3); mesh(new THREE.SphereGeometry(0.22, 6, 4), GOLD, x, 1.45, z); }
      for (const z of [-1704.1, -1695.9]) solid(-1714, z - 0.1, -1674, z + 0.1, 0, 1.2);
      for (let k = 0; k < 22; k++) { const z = rr(-1870, -1650); if (Math.abs(z + 1700) < 8) continue; (rnd() < 0.5 ? SAKURA : ROUND).push([-1717 + rr(-1, 1), z, rr(1, 1.3)]); }
      // 東京ガーデンテラス紀尾井町 (赤坂プリンスホテルの跡地)
      const T = [-1668, -1826, -1612, -1768];
      LM_ZONES.push(rectPoly(-1676, -1866, -1596, -1636));
      pushPrism(M('AK_TGT', '#9aa6b0', '#d0dae2', 0.6, 1, 2, 2, 3), 'ROOF', rectPoly(...T), 0, 180);
      pushPrism(M('AK_TGT2', '#c8ccd0', '#4a5868', 0.5, 2, 3, 2, 3), 'ROOF', rectPoly(-1668, -1760, -1612, -1700), 0, 30);
      fr(-1676, -1696, -1600, -1640, '#7a9a5a'); for (let k = 0; k < 18; k++) ROUND.push([rr(-1670, -1606), rr(-1690, -1646), rr(1, 1.3)]);
    }
    // ===== 豊川稲荷東京別院 (お寺だけど鳥居がある。たくさんのキツネ) =====
    const TY = [-1840, -1665, -1770, -1616];
    {
      fr(...TY, '#c8bea8');
      pushPrism(SHU, 'ROOF', rectPoly(-1826, -1660, -1790, -1636), 0, 8); jRoof('RF2', -1828, -1662, -1788, -1634, 8, 5, { over: 1.6 });
      for (const [x, z] of [[-1782, -1622], [-1782, -1638]]) myojinTorii(x, z, false, 5, 4.2, SHU, 0.28);
      const fox = lam({ color: 0xe8e2d4 });
      for (let k = 0; k < 16; k++) { const x = -1836 + (k % 8) * 3.2, z = k < 8 ? -1664 : -1631; pushPrism('TKSTONE', 'TKSTONE', rectPoly(x - 0.5, z - 0.5, x + 0.5, z + 0.5), 0, 0.8); mesh(new THREE.ConeGeometry(0.35, 1.1, 5), fox, x, 1.35, z); }
      for (let x = -1820; x < -1792; x += 3) mesh(new THREE.BoxGeometry(0.6, 2.2, 0.05), SHU, x, 1.8, -1617);   // 奉納のぼり
      LM_ZONES.push(rectPoly(...TY));
    }
    // ===== 赤坂御用地 (塀に囲まれた森。中には上皇ご夫妻のお住まいや宮邸、園遊会の赤坂御苑) =====
    const GOYO = [[-1750, -1905], [-2268, -1905], [-2268, -1290], [-1850, -1559], [-1850, -1672], [-1750, -1672]];
    const GEIR = [-2215, -1905, -2040, -1728];   // 迎賓館の敷地 (一般公開)
    const inG = (x, z) => inPoly([[-1850, -1905], [-2268, -1905], [-2268, -1290], [-1850, -1559]], x, z) || inR([-1850, -1905, -1750, -1672], x, z);
    {
      LM_ZONES.push([[-1850, -1905], [-2268, -1905], [-2268, -1290], [-1850, -1559]], rectPoly(-1850, -1905, -1750, -1672)); polyFr(GOYO, '#5f7f48');
      // 塀 (迎賓館の正門と西門は開いている)
      const wall = (a, b, gaps = []) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), F = frame(a[0], a[1], b[0] - a[0], b[1] - a[1], -(b[1] - a[1]) / L, (b[0] - a[0]) / L); let u = 0; for (const [g0, g1] of [...gaps, [L, L]]) { if (g0 > u) oBox(F, 'AK_FENCE', u, -0.4, g0, 0.4, 0, 2.6, { top: 'RF2' }); u = g1; } };
      for (let i = 0; i < GOYO.length; i++) { const a = GOYO[i], b = GOYO[(i + 1) % GOYO.length]; const gaps = i === 0 ? [[368, 387]] : i === 1 ? [[20, 30]] : []; wall(a, b, gaps); }
      wall([GEIR[0], GEIR[3]], [GEIR[2], GEIR[3]]); wall([GEIR[2], GEIR[3]], [GEIR[2], GEIR[1]]);
      // 森
      for (let k = 0; k < 1300; k++) { const x = rr(-2262, -1756), z = rr(-1900, -1300); if (!inG(x, z) || inR([GEIR[0] - 3, GEIR[1], GEIR[2] + 3, GEIR[3] + 3], x, z) || Math.hypot((x + 2090) / 70, (z + 1420) / 42) < 1) continue; (rnd() < 0.55 ? ROUND : rnd() < 0.6 ? PINES : rnd() < 0.5 ? MAPLES : GINKGO).push([x, z, rr(1.1, 1.6)]); }
      // 赤坂御苑 (園遊会の会場になる庭) の池と芝生 / 森の中のお住まい (屋根だけ見える)
      fr(-2190, -1480, -1990, -1370, '#86a65e'); water(-2090, -1420, 52, 26);
      for (const [x0, z0, x1, z1] of [[-2220, -1640, -2150, -1590], [-1930, -1760, -1870, -1720], [-2010, -1520, -1960, -1490]]) { pushPrism('AK_FENCE', 'ROOF', rectPoly(x0, z0, x1, z1), 0, 7); oHip(AXIS, 'RF1', x0, z0, x1, z1, 7, 3, { over: 1 }); }
      // 御用地の門 (青山通り側。閉まっている)
      { const F = AK_ROAD[0][1], [gx, gz] = F.w(330, -19); pushPrism('TKSTONE', 'TKSTONE', regularPoly(gx, gz, 2.5, 4, F.ang + Math.PI / 4), 0, 4); const [hx, hz] = F.w(342, -19); pushPrism('TKSTONE', 'TKSTONE', regularPoly(hx, hz, 2.5, 4, F.ang + Math.PI / 4), 0, 4); }
    }
    // ===== 迎賓館赤坂離宮 (1909年完成。日本で唯一のネオ・バロック様式の宮殿で国宝) =====
    {
      const B = [-2190, -1842, -2065, -1812], cx = (B[0] + B[2]) / 2;
      // 前庭 (砂利の広場) と正門
      fr(GEIR[0], GEIR[1], GEIR[2], -1842, '#d8d0bc'); fr(GEIR[0], -1812, GEIR[2], GEIR[3], '#7a9a5a');
      for (let x = GEIR[0] + 6; x < GEIR[2] - 4; x += 10) for (const z of [-1898, -1850]) if (Math.abs(x - cx) > 14) ROUND.push([x, z, 1.0]);
      const G0 = cx - 9, G1 = cx + 9;
      for (const x of [G0 - 2.5, G1]) { pushPrism('TKSTONE', 'TKSTONE', rectPoly(x, -1907, x + 2.5, -1903), 0, 5.2); mesh(new THREE.SphereGeometry(0.6, 8, 6), GOLD, x + 1.25, 5.8, -1905); }
      for (let x = G0; x < G1; x += 0.9) bake(IRON, new THREE.BoxGeometry(0.08, 4.2, 0.08).translate(x, 2.1, -1905));
      bake(IRON, new THREE.BoxGeometry(G1 - G0, 0.3, 0.2).translate(cx, 4.4, -1905)); bake(GOLD, new THREE.SphereGeometry(1, 10, 8).scale(1.2, 0.8, 0.3).translate(cx, 4.9, -1905));
      solid(G0, -1905.2, G1, -1904.8, 0, 4.6);   // 正門 (ふだんは閉まっている。見学は西門から)
      // 正門の前の広場 (門の外から宮殿を眺められる)
      LM_ZONES.push(rectPoly(GEIR[0], -1975, GEIR[2], -1907)); tiles(GEIR[0], -1975, GEIR[2], -1907, '#d4ccb6', '#c4bca6', 3);
      for (let x = GEIR[0] + 5; x < GEIR[2] - 3; x += 9) if (Math.abs(x - cx) > 22) GINKGO.push([x, -1940, 1.1], [x + 4, -1968, 1.1]);
      for (let x = cx - 30; x <= cx + 30; x += 60) LAMPS2.push([x, -1912]);
      LM_PEOPLE.push([[GEIR[0] + 10, -1915, GEIR[2] - 10, -1915], 10], [[cx - 40, -1955, cx + 40, -1955], 6]);
      // 本館: 中央棟と、前に弧を描くように張り出す両翼
      pushPrism(GEI, 'TKSTONE', rectPoly(...B), 0, 18);
      for (const [x0, x1] of [[B[0], B[0] + 18], [B[2] - 18, B[2]]]) { pushPrism(GEI, 'TKSTONE', rectPoly(x0, -1858, x1, -1842), 0, 16); pushPrism(GEI, 'TKSTONE', regularPoly((x0 + x1) / 2, -1858, 9, 10), 0, 16); oHip(AXIS, 'RF_COPPER', x0, -1858, x1, -1842, 16, 4, { over: 0.6 }); }
      oHip(AXIS, 'RF_COPPER', B[0], B[1], B[2], B[3], 18, 6.5, { over: 0.8 });
      // 中央の玄関とペディメント (三角の破風) と屋根の金の飾り
      pushPrism(GEI, 'TKSTONE', rectPoly(cx - 14, -1848, cx + 14, -1842), 0, 18);
      for (let x = cx - 12; x <= cx + 12; x += 4.8) bake(WALL.TKSTONE, new THREE.CylinderGeometry(0.6, 0.7, 12, 10).translate(x, 6.5, -1849));
      mesh(new THREE.CylinderGeometry(4.2, 4.2, 30, 3).rotateZ(-Math.PI / 2).rotateX(-Math.PI / 2).rotateY(Math.PI / 2).scale(1, 0.28, 1), WALL.TKSTONE, cx, 19.2, -1845);
      for (const x of [B[0] + 4, cx - 30, cx, cx + 30, B[2] - 4]) { bake(GOLD, new THREE.SphereGeometry(0.9, 8, 6).translate(x, 25.6, -1827)); bake(GOLD, new THREE.ConeGeometry(0.35, 2.4, 6).translate(x, 27.2, -1827)); }
      // 主庭の噴水と花壇
      water(cx, -1772, 16, 9); const jt = mesh(new THREE.CylinderGeometry(0.15, 0.8, 6, 6, 1, true), new THREE.MeshLambertMaterial({ color: 0xeaf6ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }), cx, 3, -1772);
      LM_UPDATERS.push((dt, t) => { jt.scale.y = 0.85 + Math.sin(t * 1.3) * 0.15; });
      for (const s of [-1, 1]) tiles(cx + s * 22 - 8, -1800, cx + s * 22 + 8, -1745, '#d84a5a', '#e8c040', 2);
      LM_PEOPLE.push([[GEIR[0] + 6, -1880, GEIR[2] - 6, -1880], 10], [[cx - 30, -1790, cx + 30, -1790], 6], [[GEIR[0] - 56, -1880, GEIR[0] + 10, -1880], 4]);
    }
    // ===== 赤坂サカス (TBS放送センター・赤坂Bizタワー) =====
    {
      const SK = [-1840, -1430, -1756, -1330];
      LM_ZONES.push(rectPoly(...SK)); fr(...SK, '#b8b2a4');
      pushPrism(M('AK_BIZ', '#7e8a94', '#cfd8e0', 0.6, 1, 2, 2, 3), 'ROOF', rectPoly(-1800, -1425, -1760, -1385), 0, 179);
      pushPrism(M('AK_TBS', '#d8d4cc', '#4a5260', 0.55, 3, 4, 2, 3), 'ROOF', rectPoly(-1838, -1380, -1786, -1336), 0, 70);
      pushPrism(M('AK_ACT', '#3a3e46', '#d8b040', 0.4, 1, 6, 2, 8), 'ROOF', rectPoly(-1838, -1428, -1806, -1396), 0, 22);
      for (let k = 0; k < 14; k++) SAKURA.push([rr(-1836, -1760), rr(-1380, -1334), rr(0.9, 1.2)]);   // さくら坂
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['弁慶橋', -1716, -1706, -1672, -1694], ['弁慶堀', -1712, -1870, -1676, -1646], ['赤坂見附 (石垣)', -1720, -1654, -1696, -1630], ['東京ガーデンテラス紀尾井町', -1676, -1866, -1596, -1636],
      ['豊川稲荷東京別院', ...TY], ['迎賓館赤坂離宮 正門', -2160, -1975, -2094, -1898], ['迎賓館前の広場', GEIR[0], -1975, GEIR[2], -1907], ['迎賓館赤坂離宮 主庭', GEIR[0], -1812, GEIR[2], GEIR[3]], ['迎賓館赤坂離宮', ...GEIR],
      ['赤坂御苑', -2190, -1480, -1990, -1370], ['赤坂サカス', -1840, -1430, -1756, -1330], ['赤坂見附', -1760, -1640, -1700, -1590]);
    LM_HEIGHT_AREAS.push(['赤坂御用地', (x, z, y) => y < 18 && inG(x, z) && !inR([GEIR[0], -1912, GEIR[2], GEIR[3]], x, z) && !inR([-2190, -1480, -1990, -1370], x, z)]);   // 斜めの境界なので四角ではなく形で判定
    LM_LABELS.push(['迎賓館', -2127, -1830, '🏛', '迎賓館赤坂離宮'], ['赤坂御用地', -2000, -1600, '🌳'], ['豊川稲荷', -1805, -1648, '🦊', '豊川稲荷東京別院'], ['弁慶堀', -1694, -1780, '🚣'], ['赤坂見附', ...C2, '🏯'], ['赤坂サカス', -1798, -1380, '📺']);
    Object.assign(LM_NOTES, {
      '迎賓館赤坂離宮': '1909年に皇太子のお住まい「東宮御所」として建てられた、日本で唯一のネオ・バロック様式の宮殿。いまは外国の国王や大統領を迎える国の迎賓施設',
      '迎賓館赤坂離宮 正門': '2009年、本館や正門などが明治以降の建物として初めて国宝に指定された',
      '迎賓館赤坂離宮 主庭': '本館の裏の主庭には大きな噴水と花壇がある。設計は、ジョサイア・コンドルに学んだ片山東熊',
      '赤坂御用地': '皇居の約半分の広さの森。上皇ご夫妻のお住まい (仙洞御所) や秋篠宮邸などの宮邸があり、迎賓館もこの一角にある',
      '赤坂御苑': '春と秋の年2回、天皇・皇后両陛下が主催する園遊会がこの庭で開かれる',
      '豊川稲荷東京別院': 'お寺 (曹洞宗) なのに鳥居がある、神仏習合の名残り。境内にはたくさんのキツネの像が並ぶ',
      '赤坂見附 (石垣)': '江戸城の外堀に設けられた門「赤坂見附」の石垣が、交差点のそばに残っている',
      '弁慶堀': '江戸城の外堀の一部。赤坂見附の門のまわりは堀が二重にめぐっていた',
      '東京ガーデンテラス紀尾井町': '赤坂プリンスホテルの跡地。紀尾井町の名は、紀州徳川家・尾張徳川家・彦根藩井伊家の屋敷があったことから',
      '赤坂サカス': 'TBSの本社と劇場・オフィスが集まる街。春は「さくら坂」の桜並木がきれい',
    });
    Object.assign(LM_TIPS, {
      '迎賓館赤坂離宮': '本館と主庭は予約なしで見学できる。外国のお客様を迎える日は休館なので、公開日を公式サイトで確認',
      '迎賓館赤坂離宮 正門': '2026年7月から、東の間や東西の玄関も見られる「プレミアム参観」が始まった',
      '赤坂御用地': 'ふだんは入れない',
    });
    const seen = new Set();
    LM_UPDATERS.push(() => { if (inR(GEIR, P.x, P.z)) seen.add('g'); if (inR(TY, P.x, P.z)) seen.add('t'); if (inR([-1716, -1706, -1672, -1694], P.x, P.z)) seen.add('b'); });
    LM_ACH.push(['geihinkan', '🏛 赤坂の宮殿', '迎賓館赤坂離宮の前庭に入る', () => seen.has('g')], ['akasaka3', '🦊 赤坂見附さんぽ', '弁慶橋・豊川稲荷・迎賓館をすべて訪ねる', () => seen.size === 3]);
    bakeFlush();
  },
});
