/* 明石町 (築地外国人居留地の跡)。佃大橋の西のたもと、隅田川べり
   聖路加国際病院の旧館 (十字架の塔)・聖路加タワー・トイスラー記念館・慶應義塾発祥の地と日本洋学発祥の地の碑・アメリカ公使館跡の碑 */
REGION({
  name: '明石町',
  towns: [['明石町', 330, -1420]],
  labels: [],
  build(r) {
    const { spot, sign, TREE_LISTS } = SL_KIT();
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); } if (col) fr(...R, col); };
    const R = [308, -1494, 384, -1432], R2 = [308, -1432, 370, -1410];
    site(R, '#c8c2b2'); site(R2, '#c8c2b2');
    tiles(308, -1464, 384, -1458, '#d6cebc', '#c4bcaa', 1.6);   // 聖ルカ通りに見立てた歩道
    // ---- 聖路加国際病院 旧館 (1933年) と十字架の塔
    const OLD = LM_MAT('AK_SEIRUKA', (x, y) => {
      x.fillStyle = '#e8e0cc'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      x.fillStyle = '#d8ceb6'; for (let j = 0; j < 32; j += 4) x.fillRect(0, j, 32, 1);
      for (const i of [3, 13, 23]) for (const j0 of [5, 19]) { x.fillStyle = '#3e4852'; x.fillRect(i, j0, 6, 9); x.beginPath(); x.arc(i + 3, j0, 3, Math.PI, 0); x.fill(); y.fillStyle = rnd() < 0.6 ? '#ffe0a8' : '#000'; y.fillRect(i, j0, 6, 9); }
    });
    pushPrism(OLD, 'ROOF', rectPoly(312, -1492, 352, -1468), 0, 14);
    jRoof('SLATE', 311, -1493, 353, -1467, 14, 3.5, { over: 0.6, kind: 'hip' });
    pushPrism(OLD, 'TKSTONE', rectPoly(327, -1472, 337, -1464), 0, 30);       // 正面の塔
    pushPrism(OLD, 'TKSTONE', rectPoly(328.5, -1470.5, 335.5, -1465.5), 30, 36);
    jRoof('SLATE', 328, -1471, 336, -1465, 36, 4, { over: 0.3, kind: 'hip' });
    { const M = lam({ color: 0xf0ece0, emissive: 0x30302a }); bake(M, new THREE.BoxGeometry(0.4, 4, 0.4).translate(332, 42, -1468)); bake(M, new THREE.BoxGeometry(2.2, 0.4, 0.4).translate(332, 42.8, -1468)); }   // 十字架
    sign(332, -1463.7, 1, '聖路加国際病院', 9, 1.6, '#f4f0e6', '#3a3a38');
    // ---- 聖路加タワー (佃大橋のたもと)
    pushPrism('glass', 'CONC', rectPoly(356, -1494, 380, -1474), 0, 160);
    pushPrism('CONC', 'CONC', rectPoly(358, -1492, 378, -1476), 160, 166);
    // ---- トイスラー記念館 (1933年の宣教師館を移築・復原した木造の洋館)
    const CLAP = LM_MAT('AK_TEUSLER', (x, y) => {
      x.fillStyle = '#f0ead8'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      x.fillStyle = '#d6ceb8'; for (let j = 0; j < 32; j += 3) x.fillRect(0, j, 32, 1);
      for (const i of [5, 19]) { x.fillStyle = '#5a6a58'; x.fillRect(i - 1, 8, 10, 14); x.fillStyle = '#3a4650'; x.fillRect(i, 9, 8, 12); y.fillStyle = rnd() < 0.5 ? '#ffe0a8' : '#000'; y.fillRect(i, 9, 8, 12); }
    });
    pushPrism(CLAP, 'ROOF', rectPoly(354, -1452, 370, -1438), 0, 7.5);
    jRoof('RF0', 353, -1453, 371, -1437, 7.5, 3.4, { over: 0.7, kind: 'irimoya' });
    pushPrism('tkBrick', 'TKSTONE', rectPoly(366, -1448, 368, -1446), 7.5, 12);   // 煙突
    // ---- 記念碑の広場
    const BK = lam({ color: 0x24221f }), GR = lam({ color: 0x9a6a4a }), ST = lam({ color: 0xb8b4aa });
    const monu = (x, z, kind) => {
      if (kind === 'book') { bake(BK, new THREE.BoxGeometry(2.6, 1.0, 1.6).translate(x, 0.5, z)); bake(GR, new THREE.BoxGeometry(2.0, 0.5, 1.4).rotateZ(0.12).translate(x, 1.3, z)); }
      else if (kind === 'stele') { bake(ST, new THREE.BoxGeometry(1.0, 0.4, 0.8).translate(x, 0.2, z)); bake(ST, new THREE.BoxGeometry(0.8, 1.6, 0.3).translate(x, 1.2, z)); }
      else { bake(ST, new THREE.BoxGeometry(1.4, 1.2, 1.0).translate(x, 0.6, z)); bake(lam({ color: 0xe8e4da }), new THREE.SphereGeometry(0.45, 6, 4).translate(x, 1.6, z)); }
      solid(x - 0.9, z - 0.6, x + 0.9, z + 0.6, 0, 1.6);
    };
    monu(318, -1450, 'book'); monu(324, -1450, 'book');          // 慶應義塾発祥の地 / 日本洋学発祥の地
    monu(336, -1446, 'stele'); monu(342, -1446, 'stele'); monu(330, -1440, 'stele'); monu(318, -1418, 'stele');   // 学校の発祥の地の碑
    monu(362, -1426, 'eagle'); monu(366, -1430, 'eagle');        // アメリカ公使館跡の石の彫刻
    for (const [x, z] of [[312, -1454], [348, -1452], [312, -1436], [350, -1420], [360, -1416], [340, -1414], [376, -1436]]) ROUND.push([x, z, rr(0.9, 1.2)]);
    for (const [x, z] of [[326, -1426], [340, -1428]]) BENCHES.push([x, z, 0]);
    LM_PEOPLE.push([[310, -1461, 382, -1461], 8], [[320, -1456, 320, -1414], 4]);
    // ---- 名所の範囲と説明
    spot('明石町 (築地居留地跡)', [R[0], R[1], R[2], R2[3]], '明石町', '⛪', '明治時代に外国人居留地が置かれた町 (1899年に廃止)。立教・明治学院・青山学院・女子学院など多くのミッションスクールがここで生まれ、あちこちに「発祥の地」の碑が立つ', 340, -1440);
    SPOT_AREAS.unshift(['聖路加国際病院 旧館', 310, -1494, 354, -1462], ['聖路加タワー', 354, -1496, 382, -1472], ['トイスラー記念館', 352, -1454, 372, -1436],
      ['慶應義塾発祥の地の碑', 314, -1454, 328, -1446], ['アメリカ公使館跡の碑', 358, -1434, 370, -1422]);
    Object.assign(LM_NOTES, {
      '聖路加国際病院 旧館': 'アメリカ聖公会の宣教医師トイスラーが開いた病院がはじまりで、1902年に聖路加病院となった。旧館の十字架の塔からは、1日3回、カリヨンの鐘で聖歌のメロディーが流れる。「せいろか」ではなく「せいるか」と読む',
      '聖路加タワー': '佃大橋のたもと、隅田川べりにそびえる高層ビル。明石町の外国人居留地の時代には、このあたりにアメリカ公使館があった',
      'トイスラー記念館': '1933年に建てられた宣教師館を、1998年に移築・復原した木造の洋館。中央区の有形文化財',
      '慶應義塾発祥の地の碑': '1858年、この地にあった中津藩の中屋敷で福澤諭吉が蘭学を教えはじめたのが慶應義塾の起源。本の形の石に「天は人の上に人を造らず」と刻まれ、となりには『解体新書』の翻訳にちなむ日本洋学発祥の地の碑が並ぶ',
      'アメリカ公使館跡の碑': '1874年から1890年まで、居留地にはアメリカ公使館があった。建物を飾っていた白頭鷲や星条旗の石の彫刻が、記念碑として残されている',
    });
    LM_LABELS.push(['聖路加', 332, -1500, '⛪', '聖路加国際病院 旧館']);
    bakeFlush();
  },
});
