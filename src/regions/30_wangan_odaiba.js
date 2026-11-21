/* 臨海副都心・湾岸・お台場 (芝浦 / 台場 / 青海 / 有明 / 東雲 / 新木場)
   基盤: レインボーブリッジ (芝浦とお台場を結ぶ。歩いて渡れる)
   作り込みの予定: お台場海浜公園・自由の女神像・フジテレビ / 青海・テレコムセンター / 東京ビッグサイト / 豊洲市場 / ゆりかもめ */
REGION({
  name: '臨海副都心・湾岸',
  towns: [['芝浦', -350, 650], ['台場', 900, 1050], ['青海', 900, 1500], ['有明', 1550, 800], ['東雲', 1950, -250], ['辰巳', 1950, 150], ['新木場', 2480, 0], ['夢の島', 2480, -850]],
  hubs: [{ x: 900, z: 1050, core: 250, town: 600 }, { x: 900, z: 1500, core: 220, town: 450 }, { x: 1700, z: 850, core: 250, town: 500 }, { x: 1950, z: -250, style: 'towers', town: 350 }],
  labels: [],
  build(r) {
    // ---- レインボーブリッジ (基盤版: 主塔・ケーブル・道路と遊歩道。芝浦側のループ橋は作り込みで)
    const Z0 = 940, Z1 = 960, DY = 50, X0 = -100, X1 = 670, RW = -560, RE = 1100;
    const deckY = x => x < X0 ? DY * (x - RW) / (X0 - RW) : x > X1 ? DY * (RE - x) / (RE - X1) : DY;
    LM_ZONES.push(rectPoly(RW - 10, Z0 - 12, RE + 10, Z1 + 12));
    const white = 'RB_WHITE'; if (!WALL[white]) { WALL[white] = lam({ color: 0xeeeeea, emissive: 0xffffff, emissiveIntensity: 0 }); GLOW.push([WALL[white], 0.55]); }
    for (let x = RW; x < RE; x += 4) {
      const y = deckY(x + 2), ya = Math.max(0.15, deckY(x)), yb = Math.max(0.15, deckY(x + 4)); if (y < 0.3 && ya < 0.3 && yb < 0.3) continue;
      pushSlope('ASPH', 'CONC', [x, 950], [x + 4, 950], 10, ya, yb, 1.4);
      for (let k = 0; k < 2; k++) solid(x + k * 2, Z0, x + k * 2 + 2, Z1, deckY(x + k * 2 + 1) - 1.4, deckY(x + k * 2 + 1));
      for (const z of [Z0 + 0.2, Z1 - 0.2]) { pushSlope(white, white, [x, z], [x + 4, z], 0.2, ya + 1.2, yb + 1.2, 1.2); solid(x, z - 0.2, x + 4, z + 0.2, y, y + 1.2); }
      if (x % 60 === 0 && (x < X0 - 20 || x > X1 + 20 || x > X0 + 40 && x < X1 - 40)) pushPrism('CONC', null, rectPoly(x, 945, x + 3, 955), -3, y - 1.4, { solid: false });   // 橋脚
    }
    for (const tx of [10, 580]) {   // 主塔 (高さ126m)
      for (const z of [Z0 - 6, Z1 + 2]) pushPrism(white, white, rectPoly(tx - 3, z, tx + 3, z + 4), -3, 126);
      for (const y of [44, 90, 122]) pushPrism(white, white, rectPoly(tx - 2.5, Z0 - 6, tx + 2.5, Z1 + 6), y, y + 3, { solid: false });
    }
    for (const ax of [-150, 720]) pushPrism('CONC', 'CONC', rectPoly(ax - 25, Z0 - 10, ax + 25, Z1 + 10), 0, 30);   // アンカレイジ
    const cp = [], cab = x => x < 10 ? 30 + 93 * ((x + 150) / 160) ** 2 : x > 580 ? 30 + 93 * ((720 - x) / 140) ** 2 : 52 + 71 * ((x - 295) / 285) ** 2;
    for (const z of [Z0 - 4, Z1 + 4]) for (let x = -150; x < 720; x += 10) {
      cp.push(x, cab(x), z, x + 10, cab(x + 10), z);
      if (x > -140 && x < 710 && x % 20 === 0) cp.push(x, cab(x), z, x, deckY(x) + 1, z);   // ハンガー
    }
    const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3));
    const cm = new THREE.LineBasicMaterial({ color: 0xf4f4f0 }); FAR.group.add(new THREE.LineSegments(cg, cm));
    LM_UPDATERS.push(() => cm.color.setHex(NIGHT > 0.5 ? 0xfff2c8 : 0xf4f4f0));   // 夜はケーブルが灯る
    fr(RW, Z0, RE, Z1, '#e4e2dc'); fr(RW, 949.7, RE, 950.3, '#9a968e');
    SPOT_AREAS.push(['レインボーブリッジ', RW, Z0 - 2, RE, Z1 + 2]);
    LM_LABELS.push(['レインボーブリッジ', 295, 920, '🌉']);
    Object.assign(LM_NOTES, { 'レインボーブリッジ': '1993年完成の吊り橋。主塔の高さ126m。歩道を歩いて芝浦からお台場へ渡れる' });
  },
});
