/* 池袋 (東口: いけふくろう・西武・サンシャイン60通り・サンシャイン60とてんぼうパーク・屋上の水族館・東池袋中央公園・南池袋公園 /
   西口: 東武・池袋西口公園 GLOBAL RING・東京芸術劇場・立教大学)
   山手線の駅の向きにそろえた座標 (u = 線路の向き、目白の方が +。v = 環の外向き = 西口の方が +) で置く */

// ---- 山手線の駅にそろえた座標系 (u = 線路の向き、v = 環の外向き)。ほかの駅のファイルでも使う
function stnFrame(name) { const st = STN.find(s => s.name === name), q = ringAt(st.s); return frame(q.x, q.z, q.tx, q.tz, q.nx, q.nz); }
// ---- 通りの両側の店 (看板つき)。F の u 方向が通り。sd = -1 / 1 の側に v0 から depth の奥行きで建てる
function shopsAlong(F, u0, u1, v0, depth, words, opt = {}) {
  const bgs = opt.bgs || [opt.bg || '#2a2420'], SWM = words.map((w, i) => glow(new THREE.MeshLambertMaterial({ map: textTex(w, bgs[i % bgs.length], opt.fg || '#fff4dc', 96, 24) }), '#ffe8c0', 0.6));
  const walls = opt.walls || ['resi2', 'office2', 'JB_KS2', 'brick'], skip = opt.skip || [];
  for (const sd of opt.sides || [-1, 1]) {
    LM_ZONES.push(F.rect(u0, sd < 0 ? -v0 - depth - 1 : v0, u1, sd < 0 ? -v0 : v0 + depth + 1));
    for (let u = u0; u < u1 - 4;) {
      const w = Math.min(rr(opt.wmin || 7, opt.wmax || 12), u1 - u); if (skip.some(([a, b, s]) => (s === undefined || s === sd) && u + w > a && u < b)) { u += w; continue; }
      oBox(F, pick(walls), u, sd * v0, u + w, sd * (v0 + depth), 0, rr(opt.hmin || 8, opt.hmax || 22));
      const [x, z] = F.w(u + w / 2, sd * (v0 - 0.1)), ry = Math.atan2(-F.vx * sd, -F.vz * sd);
      bake(pick(SWM), new THREE.PlaneGeometry(Math.min(4.5, w - 1), 1.1).rotateY(ry).translate(x, opt.signY || 3.8, z));
      u += w;
    }
  }
}
// ---- 回転した長方形の名所 (地図の発見と、地上での場所の名前)。list: [名前, u0, v0, u1, v1] を小さいものから順に
function rotSpots(F, list) {
  for (const [n, u0, v0, u1, v1] of list) { const R = F.rect(u0, v0, u1, v1); SPOT_AREAS.push([n, ...polyBB(R)]); LM_HEIGHT_AREAS.push([n, (x, z, y) => y < 4 && inPoly(R, x, z)]); }
}
// ---- 歩いて登れる築山 (見た目は段々の芝。当たり判定は 1m 角の細かい箱で、なめらかな円すいにする)。H / R は 0.4 以下に
function hill(cx, cz, R, H, opt = {}) {
  const lv = opt.levels || Math.ceil(H / 0.5);
  for (let i = 0; i < lv; i++) pushPrism(opt.key || 'GRASSTOP', opt.key || 'GRASSTOP', regularPoly(cx, cz, R * (1 - i / lv), 14), i * H / lv, (i + 1) * H / lv, { solid: false });
  for (let x = -R; x < R; x += 1) for (let z = -R; z < R; z += 1) {
    const r = Math.hypot(x + 0.5, z + 0.5); if (r > R) continue;
    const h = Math.min(H, H * (1 - (r - 0.7) / R)); solid(cx + x, cz + z, cx + x + 1, cz + z + 1, 0, h);
  }
}
// ---- 屋上へのエレベーター (1階 ⇄ 屋上)
function roofLift(base, top, upMsg, downMsg, opt = {}) {
  const [bx, bz] = base, [tx, ty, tz] = top;
  LM_ACTIONS.push({ at: () => P.y < 3 && Math.hypot(P.x - bx, P.z - bz) < (opt.r || 5), prompt: () => opt.upPrompt || 'E　エレベーターで屋上へ', act: () => lmWarp(tx, ty, tz, P.yaw, upMsg) });
  LM_ACTIONS.push({ at: () => P.y > ty - 3 && P.y < ty + 6 && Math.hypot(P.x - tx, P.z - tz) < (opt.topR || 8), prompt: () => 'E　エレベーターで1階へ', act: () => lmWarp(bx, 0, bz, P.yaw, downMsg) });
}
// ---- 建物の正面に看板を貼る (F の u0..u1 の面、v の位置、外向き = sd)
function frontSign(F, u, v, sd, text, bg, fg, w, h, y, opt = {}) {
  const [x, z] = F.w(u, v), ry = Math.atan2(F.vx * sd, F.vz * sd);
  bake(glow(new THREE.MeshLambertMaterial({ map: textTex(text, bg, fg, opt.tw || 160, opt.th || 28) }), '#ffffff', opt.k ?? 0.7), new THREE.PlaneGeometry(w, h).rotateY(ry).translate(x, y, z));
}
function sideSign(F, u, v, sd, text, bg, fg, w, h, y, opt = {}) {   // u の向きの面に貼る
  const [x, z] = F.w(u, v), ry = Math.atan2(F.ux * sd, F.uz * sd);
  bake(glow(new THREE.MeshLambertMaterial({ map: textTex(text, bg, fg, opt.tw || 160, opt.th || 28) }), '#ffffff', opt.k ?? 0.7), new THREE.PlaneGeometry(w, h).rotateY(ry).translate(x, y, z));
}

REGION({
  name: '池袋',
  towns: [['東池袋', -2330, -4640], ['西池袋', -2700, -4560], ['南池袋', -2560, -4300]],
  stations: ['池袋'],   // 駅のまわりを作り込んだ駅 (ファストトラベルで緑の枠)
  labels: [],
  build(r) {
    const F = stnFrame('池袋');
    const S60M = acGothic('IK_S60', '#d6d8d4', '#3a4652', null, { rowH: 4, step: 3, ww: 2, wh: 3, lit: 0.55 });
    const DEPT = acGothic('IK_DEPT', '#c8c0b2', '#46525e', '#a89c88', { rowH: 6, step: 8, ww: 6, wh: 3, lit: 0.5 });
    const GEI = acGothic('IK_GEI', '#b89a7a', '#3e4650', '#8a6e52', { rowH: 8, step: 6, ww: 3, wh: 4, lit: 0.4, brick: '#a0805e' });
    const RIK = acGothic('IK_RIK', '#9a4a32', '#e8e0c8', '#e8dcc0', { rowH: 8, step: 5, ww: 2, wh: 5, lit: 0.45, brick: '#7a3622' });
    const WH = lam({ color: 0xf0efe8 }), STONE = lam({ color: 0x9a968c }), DK = lam({ color: 0x2a2826 });

    // ===== 東口 (駅前広場・いけふくろう・西武) =====
    LM_ZONES.push(F.rect(18, -42, 98, -80)); oTiles(F, 18, -42, 98, -80, '#bcb4a6', '#aaa294', 3);
    {   // いけふくろう (待ち合わせの目印のフクロウの石像)
      const [x, z] = F.w(58, -60);
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(x, z, 1.3, 8), 0, 1.0);
      bake(STONE, new THREE.SphereGeometry(1.1, 8, 6).scale(1, 1.25, 0.95).translate(x, 2.2, z));
      for (const s of [-1, 1]) { const [ex, ez] = F.w(58 + s * 0.45, -60 + 0.95); bake(DK, new THREE.SphereGeometry(0.22, 6, 4).translate(ex, 2.75, ez)); bake(STONE, new THREE.ConeGeometry(0.28, 0.6, 4).translate(...F.w(58 + s * 0.6, -60).flatMap((v, i) => i ? [3.65, v] : [v]))); }
    }
    oBox(F, DEPT, -78, -62, 15, -114, 0, 42); frontSign(F, -30, -61.9, 1, 'SEIBU', '#1a3a7a', '#ffffff', 16, 3, 34);
    sideSign(F, 15.1, -88, 1, '西武池袋本店', '#ffffff', '#1a3a7a', 14, 2.6, 30);
    LM_PEOPLE.push([[...F.w(22, -50), ...F.w(94, -50)], 12], [[...F.w(94, -70), ...F.w(22, -70)], 10], [[...F.w(56, -44), ...F.w(56, -78)], 6]);

    // ===== サンシャイン60通り (東口から東へ。映画館・ゲーム・カラオケの並ぶにぎやかな通り) =====
    const RA = F.w(66, -80), RB = F.w(78, -302);
    const R = akRoad(RA, RB, 10, 'サンシャイン60通り', { trees: false }), RL = Math.hypot(RB[0] - RA[0], RB[1] - RA[1]);
    shopsAlong(R, 4, RL - 6, 10.5, 16, ['シネマ', 'ゲーム', 'カラオケ', 'ラーメン', '古着', 'カフェ', 'アニメ', '書店', '回転寿司', 'ドラッグ', 'ハンバーガー', '牛丼', 'スイーツ', '雑貨', 'CD・DVD'], { hmin: 10, hmax: 30 });
    LM_PEOPLE.push([[...R.w(3, -2), ...R.w(RL - 3, -2)], 26], [[...R.w(RL - 3, 2), ...R.w(3, 2)], 24]);

    // ===== サンシャイン60 (1978年にできた高さ約240mの超高層ビル) とサンシャインシティ =====
    const SC = F.w(66, -332);
    LM_ZONES.push(F.rect(-14, -304, 160, -424)); oTiles(F, -14, -304, 160, -356, '#c8c0b0', '#b8b0a0', 4);
    oBox(F, S60M, 42, -312, 90, -352, 0, 240);
    oBox(F, 'CONC', 44, -314, 88, -350, 240, 241.2, { top: 'GRASSTOP' });   // 屋上 (人工芝のてんぼうパークのイメージ)
    frontSign(F, 66, -311.9, 1, 'SUNSHINE 60', '#2a3a5a', '#ffffff', 14, 2.4, 12);
    const OBS = glow(lam({ color: 0xbfe0ff }), '#ffe8b0', 0.9);   // 60階の展望台の窓の帯
    for (const [u0, v0, u1, v1] of [[42, -311.9, 90, -311.9], [42, -352.1, 90, -352.1]]) { const [x, z] = F.w((u0 + u1) / 2, v0); bake(OBS, new THREE.PlaneGeometry(48, 3).rotateY(Math.atan2(F.vx * Math.sign(v0 + 330), F.vz * Math.sign(v0 + 330))).translate(x, 228, z)); }
    roofLift(F.w(66, -308), [...F.w(66, -330)].flatMap((v, i) => i ? [241.25, v] : [v]), '🛗 サンシャイン60 の上 (てんぼうパークは60階。海抜251m)', '🛗 1階 (サンシャイン60通りの突き当たり)', { upPrompt: 'E　エレベーターで60階の展望台へ' });
    // サンシャインシティ (専門店街アルパ・ワールドインポートマートビル) と屋上の水族館
    oBox(F, DEPT, -10, -356, 156, -422, 0, 36);
    frontSign(F, 120, -355.9, 1, 'SUNSHINE CITY', '#e8e4da', '#c0302a', 18, 2.6, 30);
    {
      const AQ = F.w(118, -390), TANK = new THREE.MeshLambertMaterial({ color: 0x4aa8e0, transparent: true, opacity: 0.55 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(10, 1.6, 8, 32).rotateX(Math.PI / 2), TANK); ring.position.set(AQ[0], 41.5, AQ[1]); chunkAt(...AQ).group.add(ring);
      for (let k = 0; k < 10; k++) bake(WH, new THREE.CylinderGeometry(0.3, 0.3, 4, 5).translate(AQ[0] + Math.cos(k * 0.628) * 10, 38, AQ[1] + Math.sin(k * 0.628) * 10));
      const pens = []; const PB = lam({ color: 0x1e2226 });
      for (let k = 0; k < 6; k++) { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.9), PB)); const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.6), WH); b.position.set(0, -0.12, 0.05); g.add(b); scene.add(g); pens.push([g, k / 6 * 6.283]); }
      LM_UPDATERS.push((dt, t) => { for (const [g, a0] of pens) { const a = a0 + t * 0.25; g.position.set(AQ[0] + Math.cos(a) * 10, 41.5 + Math.sin(t * 2 + a0) * 0.4, AQ[1] + Math.sin(a) * 10); g.rotation.y = -a; } });
      roofLift(F.w(158, -390), [...F.w(150, -390)].flatMap((v, i) => i ? [36.05, v] : [v]), '🛗 屋上 (サンシャイン水族館の「天空のペンギン」の水槽が見える)', '🛗 1階', { upPrompt: 'E　エレベーターで屋上の水族館のフロアへ' });
    }
    // 東池袋中央公園 (サンシャインのとなりの緑)
    LM_ZONES.push(F.rect(96, -300, 158, -350)); polyFr(F.rect(96, -300, 158, -350), '#6f9450');
    for (let k = 0; k < 30; k++) (k % 3 ? ROUND : SAKURA).push([...F.w(rr(100, 154), rr(-304, -346)), rr(0.9, 1.2)]);
    LM_PEOPLE.push([[...F.w(64, -306), ...F.w(150, -306)], 10]);

    // ===== 南池袋公園 (芝生の広場とカフェ) =====
    LM_ZONES.push(F.rect(140, -44, 232, -116)); polyFr(F.rect(140, -44, 232, -116), '#7aa058'); oTiles(F, 140, -44, 232, -50, '#c8c0b0', '#b8b0a0', 2);
    oBox(F, 'WOOD', 200, -96, 228, -112, 0, 4.5, { top: 'GRASSTOP' });
    for (let u = 144; u < 230; u += 9) for (const v of [-110, -54]) ROUND.push([...F.w(u, v), 1.1]);
    LM_PEOPLE.push([[...F.w(150, -70), ...F.w(190, -90)], 8]);

    // ===== 西口 (東武・池袋西口公園 GLOBAL RING・東京芸術劇場) =====
    oBox(F, DEPT, 15, 46, 100, 102, 0, 50); frontSign(F, 58, 102.1, 1, 'TOBU', '#ffffff', '#1a4a8a', 14, 3, 42);
    const GR = F.w(46, 145);
    LM_ZONES.push(F.rect(0, 104, 100, 168)); oTiles(F, 0, 104, 100, 168, '#c4bcae', '#b2aa9c', 3);
    {
      const RM = glow(lam({ color: 0xf4f4f0 }), '#eaf4ff', 0.9);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(17, 0.7, 6, 48).rotateX(Math.PI / 2), RM); ring.position.set(GR[0], 10, GR[1]); chunkAt(...GR).group.add(ring);
      for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283 + 0.2, x = GR[0] + Math.cos(a) * 17, z = GR[1] + Math.sin(a) * 17; bake(WH, new THREE.CylinderGeometry(0.35, 0.45, 10, 6).translate(x, 5, z)); solid(x - 0.5, z - 0.5, x + 0.5, z + 0.5, 0, 10); }
      oBox(F, 'CONC', 30, 156, 62, 166, 0, 1.2, { top: 'WOOD' });   // 野外劇場のステージ
      oBox(F, 'WOOD', 78, 150, 96, 164, 0, 4, { top: 'ROOF' });     // GLOBAL RING CAFE (木造)
    }
    LM_ZONES.push(F.rect(6, 168, 100, 238));
    oBox(F, GEI, 10, 180, 96, 236, 0, 34);
    oBox(F, 'glass', 10, 168, 96, 180, 0, 26);   // 大きなガラスのアトリウム
    frontSign(F, 53, 167.9, -1, '東京芸術劇場', '#f0ece2', '#3a2a1a', 16, 2.4, 22);
    LM_PEOPLE.push([[...F.w(6, 120), ...F.w(96, 120)], 12], [[...F.w(90, 140), ...F.w(10, 160)], 8]);

    // ===== 立教大学 (赤レンガの本館とツタ、2本のヒマラヤ杉) =====
    const RK = F.rect(110, 296, 236, 392);
    LM_ZONES.push(RK); polyFr(RK, '#7a9a5a'); oTiles(F, 160, 296, 176, 330, '#c8bca6', '#b8ac96', 2);
    oBox(F, RIK, 130, 330, 206, 348, 0, 14); oHip(F, 'RF0', 130, 330, 206, 348, 14, 5, { over: 0.6 });
    oBox(F, RIK, 163, 326, 173, 336, 0, 24); oHip(F, 'RF0', 163, 326, 173, 336, 24, 4, { over: 0.4 });
    oBox(F, RIK, 120, 350, 150, 386, 0, 13); oHip(F, 'RF0', 120, 350, 150, 386, 13, 4.5, { over: 0.5 });
    oBox(F, RIK, 186, 350, 230, 386, 0, 13); oHip(F, 'RF0', 186, 350, 230, 386, 13, 4.5, { over: 0.5 });
    const IVY = lam({ color: 0x3e6a2e });
    for (let k = 0; k < 14; k++) { const u = rr(132, 204), [x, z] = F.w(u, 329.9); bake(IVY, new THREE.PlaneGeometry(rr(3, 6), rr(4, 9)).rotateY(Math.atan2(-F.vx, -F.vz)).translate(x, rr(3, 7), z)); }
    const CED = lam({ color: 0x2e4a32 }), XMAS = true;   // ヒマラヤスギの電飾は一年中つけておく
    for (const u of [150, 186]) {
      const [x, z] = F.w(u, 314);
      for (let i = 0; i < 4; i++) bake(CED, new THREE.ConeGeometry(6 - i * 1.3, 6, 8).translate(x, 3 + i * 4, z));
      bake(lam({ color: 0x5a4632 }), new THREE.CylinderGeometry(0.5, 0.6, 3, 6).translate(x, 1.5, z)); solid(x - 0.6, z - 0.6, x + 0.6, z + 0.6, 0, 3);
      if (XMAS) for (let k = 0; k < 40; k++) { const h = rr(1, 17), rad = (6 - h / 4) * 0.95, a = rr(0, 6.28); bake(glow(lam({ color: pick([0xffe080, 0xff8080, 0x80c0ff]) }), '#ffe0a0', 1), new THREE.SphereGeometry(0.18, 4, 3).translate(x + Math.cos(a) * rad, h + 1, z + Math.sin(a) * rad)); }
    }
    LM_PEOPLE.push([[...F.w(168, 298), ...F.w(168, 328)], 8], [[...F.w(120, 318), ...F.w(230, 318)], 6]);

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    rotSpots(F, [['いけふくろう', 52, -54, 64, -66], ['池袋駅 東口', 18, -42, 98, -80], ['西武池袋本店', -78, -62, 15, -114], ['サンシャイン60', 42, -304, 92, -356], ['東池袋中央公園', 96, -300, 158, -350],
      ['サンシャインシティ', -14, -356, 160, -424], ['南池袋公園', 140, -44, 232, -116], ['東武百貨店 池袋本店', 15, 46, 100, 102], ['池袋西口公園 (GLOBAL RING)', 0, 104, 100, 168], ['東京芸術劇場', 6, 168, 100, 238], ['立教大学 池袋キャンパス', 110, 296, 236, 392]]);
    LM_HEIGHT_AREAS.unshift(['サンシャイン60 の屋上', (x, z, y) => y > 235 && inPoly(F.rect(40, -310, 92, -354), x, z)], ['サンシャインシティの屋上 (サンシャイン水族館)', (x, z, y) => y > 33 && y < 50 && inPoly(F.rect(-10, -356, 156, -422), x, z)]);
    LM_LABELS.push(['いけふくろう', ...F.w(58, -60), '🦉'], ['サンシャイン60', ...SC, '🏙'], ['西口公園', ...GR, '⭕', '池袋西口公園 (GLOBAL RING)'], ['芸術劇場', ...F.w(53, 205), '🎻', '東京芸術劇場'], ['立教大学', ...F.w(168, 340), '🎓', '立教大学 池袋キャンパス'], ['南池袋公園', ...F.w(186, -80), '🌳']);
    Object.assign(LM_NOTES, {
      '池袋駅 東口': '池袋駅は1日の乗降客数が世界でも指折りの巨大ターミナル。東口に西武、西口に東武 ——「西に東武、東に西武」と覚える',
      'いけふくろう': '駅の中にあるフクロウの石像で、待ち合わせの定番。「いけぶくろ」と「ふくろう」をかけている',
      '西武池袋本店': '駅の東口にある大きなデパート。山手線の池袋駅の発車メロディは2024年3月から、近くの家電量販店のテーマソングになった',
      'サンシャイン60通り': '東口からサンシャイン60へ向かう、映画館やゲームセンターの並ぶにぎやかな通り',
      'サンシャイン60': '1978年にできた高さ約240mの超高層ビル。できたときは日本 (アジア) でいちばん高いビルだった',
      'サンシャイン60 の屋上': '60階の展望台「てんぼうパーク」は海抜251m。人工芝の上で寝転んで景色を眺められる。晴れた日は富士山も見える',
      'サンシャインシティ': '専門店街・水族館・プラネタリウム・ホテルなどが集まる複合施設',
      'サンシャインシティの屋上 (サンシャイン水族館)': 'ビルの屋上にある水族館。ドーナツ形の水槽「天空のペンギン」では、ペンギンが頭の上を飛ぶように泳ぐ',
      '南池袋公園': '芝生の広場とカフェのある公園。2016年にリニューアルして、街の人の憩いの場になった',
      '東武百貨店 池袋本店': '駅の西口にある大きなデパート',
      '池袋西口公園 (GLOBAL RING)': '2019年に生まれ変わった劇場公園。らせん状の大きなリングの下に、オーケストラも演奏できる野外劇場がある',
      '東京芸術劇場': '1990年開館。コンサートホールには世界最大級のパイプオルガンがある',
      '立教大学 池袋キャンパス': '1874年に築地で始まった大学。ツタのからまる赤レンガの本館 (モリス館) と、クリスマスに電飾が灯る2本のヒマラヤ杉が名物',
    });
    Object.assign(LM_TIPS, {
      'サンシャイン60': '60階の展望台「てんぼうパーク」は地上251m。人工芝の上に寝ころんで空を眺められる',
      'サンシャイン60 の屋上': '晴れた日は、遠くに富士山やスカイツリーが見える。夕焼けの時間は特にきれい',
    });
    LM_ACH.push(['sunshine60', '🏙 てんぼうパーク', 'サンシャイン60 のてっぺんに立つ', () => P.y > 235 && inPoly(F.rect(40, -310, 92, -354), P.x, P.z)],
      ['ikefukuro', '🦉 いけふくろうで待ち合わせ', 'いけふくろうの前に立つ', () => P.y < 2 && Math.hypot(P.x - F.w(58, -60)[0], P.z - F.w(58, -60)[1]) < 4]);
    bakeFlush();
  },
});
