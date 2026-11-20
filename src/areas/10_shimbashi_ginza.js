/* ============================================================
   北エリア: 新橋 / 汐留 / 銀座 / 虎ノ門・愛宕
   ============================================================ */
// 時計: 文字盤 + ゲーム内時刻で動く針
const HANDS = [], KARA = { chim: [], gears: [], t: 0 };
function clockFaceTex(bg, fg) {
  return tex(32, 32, x => { x.fillStyle = bg; x.beginPath(); x.arc(16, 16, 15, 0, 7); x.fill(); x.strokeStyle = fg; x.lineWidth = 2; x.stroke();
    x.fillStyle = fg; for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; x.fillRect(16 + Math.sin(a) * 12 - 1, 16 - Math.cos(a) * 12 - 1, 2, 2); } });
}
function clockHands(x, y, z, ry, r) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; scene.add(g);
  const hm = lam({ color: 0x1a1a1a });
  const mk = (len, w) => { const p = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(w, len, 0.06).translate(0, len / 2, 0), hm); p.add(m); g.add(p); return p; };
  HANDS.push({ h: mk(r * 0.5, r * 0.09), m: mk(r * 0.8, r * 0.06) });
}
const stairMat = lam({ color: 0x8a8680 });
// 階段 (一段ずつ登れる)。up = 上り方向 'x+','x-','z+','z-'
function stairs(r, H, up, y0 = 0) {
  const n = Math.max(2, Math.ceil(H / 0.33)), alongX = up[0] === 'x', pos = up[1] === '+';
  const a0 = alongX ? r[0] : r[1], a1 = alongX ? r[2] : r[3], len = a1 - a0;
  for (let k = 0; k < n; k++) {
    const sp = pos ? a0 + len * k / n : a1 - len * k / n, lo = pos ? sp : a0, hi = pos ? a1 : sp;
    if (alongX) solid(lo, r[1], hi, r[3], y0, y0 + (k + 1) * H / n); else solid(r[0], lo, r[2], hi, y0, y0 + (k + 1) * H / n);
  }
  const sl = Math.hypot(len, H), ang = Math.atan2(H, len);
  const m = new THREE.Mesh(new THREE.BoxGeometry(alongX ? sl : r[2] - r[0], 0.35, alongX ? r[3] - r[1] : sl), stairMat);
  m.position.set((r[0] + r[2]) / 2, y0 + H / 2 - 0.1, (r[1] + r[3]) / 2);
  if (alongX) m.rotation.z = pos ? ang : -ang; else m.rotation.x = pos ? -ang : ang;
  scene.add(m); fr(...r, '#7a7a7e');
}
function torii(cx, cz, y, alongX, col = 0xd2452a) {
  const m = lam({ color: col }), k = lam({ color: 0x2a2a2a });
  const P = (a, b) => alongX ? [cx + a, cz + b] : [cx + b, cz + a]; // a = 柱の並び方向
  for (const a of [-3.2, 3.2]) { const [x, z] = P(a, 0); blk(x - 0.35, y, z - 0.35, x + 0.35, y + 6.2, z + 0.35, m); }
  const [x0, z0] = P(-4.6, -0.5), [x1, z1] = P(4.6, 0.5);
  blk(Math.min(x0, x1), y + 6.2, Math.min(z0, z1), Math.max(x0, x1), y + 6.8, Math.max(z0, z1), k);
}
function steamLoco(cx, cz) { // SL広場の蒸気機関車: C11形 (炭水車のないタンク機関車)
  const bk = lam({ color: 0x1a1a1e }), rd = lam({ color: 0x8a1a1a }), st = lam({ color: 0x9a968e }), gd = lam({ color: 0xc8a040 });
  blk(cx - 10, 0, cz - 2.2, cx + 10, 0.6, cz + 2.2, st);
  fr(cx - 10, cz - 2.2, cx + 10, cz + 2.2, '#5a5048');
  const boiler = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 8.5, 10), bk); boiler.rotation.z = Math.PI / 2; boiler.position.set(cx - 2.4, 3.1, cz); scene.add(boiler);
  const front = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.3, 10), bk); front.rotation.z = Math.PI / 2; front.position.set(cx - 6.7, 3.1, cz); scene.add(front);
  box(0.1, 0.45, 0.9, gd, cx - 6.9, 3.1, cz);                                                           // ナンバープレート
  const chim = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.4, 1.4, 8), bk); chim.position.set(cx - 5.4, 4.9, cz); scene.add(chim);
  const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.8, 8), bk); dome.position.set(cx - 2.6, 4.6, cz); scene.add(dome);
  for (const sd of [-1, 1]) blk(cx - 4.2, 1.9, cz + sd * 1.15 - 0.45, cx + 1.6, 3.9, cz + sd * 1.15 + 0.45, bk); // 水タンク (タンク機関車の特徴)
  blk(cx + 1.8, 1.4, cz - 1.6, cx + 5, 4.8, cz + 1.6, bk); blk(cx + 1.6, 4.8, cz - 1.8, cx + 5.2, 5.1, cz + 1.8, bk);  // 運転台
  blk(cx + 5, 1.4, cz - 1.5, cx + 7.2, 3.8, cz + 1.5, bk);                                               // 炭庫
  blk(cx - 7, 1.2, cz - 1.4, cx + 7.2, 1.9, cz + 1.4, rd, false);
  for (const x of [-4.6, -2.4, -0.2, 3.4]) for (const sd of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(x > 3 ? 0.6 : 0.85, x > 3 ? 0.6 : 0.85, 0.25, 10), rd); w.rotation.x = Math.PI / 2; w.position.set(cx + x, x > 3 ? 1.2 : 1.45, cz + sd * 1.45); scene.add(w);
  }
  solid(cx - 7, cz - 1.6, cx + 1.8, cz + 1.6, 0, 4.4); solid(cx + 1.8, cz - 1.8, cx + 7.2, cz + 1.8, 0, 5.1);
}
function koban(f, face, name) { // 交番 (赤いランプが目印)
  const [x0, z0, x1, z1] = f, wm = lam({ color: 0xe8e4dc }), rf = lam({ color: 0x5a6068 });
  blk(x0, 0, z0, x1, 3.6, z1, wm); blk(x0 - 0.3, 3.6, z0 - 0.3, x1 + 0.3, 4.0, z1 + 0.3, rf);
  const fx = face === 'e' ? x1 + 0.05 : face === 'w' ? x0 - 0.05 : (x0 + x1) / 2, fz = face === 's' ? z1 + 0.05 : face === 'n' ? z0 - 0.05 : (z0 + z1) / 2;
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), lam({ color: 0xff3020, emissive: 0xff2010, emissiveIntensity: 1 }));
  lamp.position.set(fx, 4.3, fz); scene.add(lamp);
  const sg = new THREE.Mesh(new THREE.BoxGeometry(face === 'e' || face === 'w' ? 0.1 : 2.4, 0.5, face === 'e' || face === 'w' ? 2.4 : 0.1), lam({ map: textTex('KOBAN 交番', '#f4f4f0', '#1a3a8a', 128, 24) }));
  sg.position.set(fx, 3.1, fz); scene.add(sg);
  fr(x0, z0, x1, z1, '#e8e4dc'); SPOT_AREAS.unshift([name, x0 - 4, z0 - 4, x1 + 4, z1 + 4]);
}
function yokocho(Rc, res, name) { // 細い路地にぎっしり並ぶ飲み屋
  const xs = [Rc[0]], zs = [Rc[1]];
  while (xs[xs.length - 1] + 40 < Rc[2]) xs.push(xs[xs.length - 1] + rr(26, 34)); xs.push(Rc[2]);
  while (zs[zs.length - 1] + 30 < Rc[3]) zs.push(zs[zs.length - 1] + rr(20, 26)); zs.push(Rc[3]);
  const AL = '#5a5048';
  for (let i = 1; i < xs.length - 1; i++) fr(xs[i] - 1.8, Rc[1], xs[i] + 1.8, Rc[3], AL);
  for (let j = 1; j < zs.length - 1; j++) { fr(Rc[0], zs[j] - 1.8, Rc[2], zs[j] + 1.8, AL); poleLine(Rc[0] + 2, zs[j] - 1.4, Rc[2] - 2, zs[j] - 1.4, 16); }
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < zs.length - 1; j++) {
    const c = [xs[i] + (i ? 1.8 : 0.5), zs[j] + (j ? 1.8 : 0.5), xs[i + 1] - (i < xs.length - 2 ? 1.8 : 0.5), zs[j + 1] - (j < zs.length - 2 ? 1.8 : 0.5)];
    const zm = (c[1] + c[3]) / 2;
    for (const [z0, z1, face] of [[c[1], zm - 0.2, 'n'], [zm + 0.2, c[3], 's']]) {
      for (let x = c[0]; x < c[2] - 3;) {
        const w = Math.min(rr(4, 7), c[2] - x), f = [x, z0, x + w - 0.25, z1];
        if (okLot(f, res)) {
          const h = rr(6, 12); addBuilding(...f, h, pick(SHOPS), { noRoofBox: rnd() < 0.6 });
          addSign(f, face, h); if (rnd() < 0.5) addAwning(f, face);
          if (rnd() < 0.7) LANTERNS.push([x + w / 2, face === 'n' ? z0 - 0.6 : z1 + 0.6]);
        }
        x += w;
      }
    }
  }
  SPOT_AREAS.push([name, ...Rc]);
}
function ginza(Rc, res, name) {
  placeLots(Rc, 16, 28, lot => {
    const f = inset(lot, 1); if (!okLot(f, res)) return;
    const h = rnd() < 0.75 ? rr(22, 45) : rr(45, 70), face = faceOf(f, Rc);
    addBuilding(...f, h, pick(GINZA)); if (rnd() < 0.4) addSign(f, face, 16); if (rnd() < 0.3) addAwning(f, face);
  });
  for (let x = Rc[0] + 6; x < Rc[2]; x += 18) LAMPS2.push([x, Rc[1] - 2.5], [x, Rc[3] + 2.5]);
  DIST_AREAS.push([name, ...Rc]);
}
function italian(Rc, res, name) {
  tiles(...Rc, '#b06a50', '#965840', 1.2);
  const cx = (Rc[0] + Rc[2]) / 2, cz = (Rc[1] + Rc[3]) / 2, PZ = [cx - 26, cz - 22, cx + 26, cz + 22];
  tiles(...PZ, '#cbbca4', '#b0a088', 2.4); fe(cx, cz, 9, 9, '#a89a84');
  const stone = lam({ color: 0xd8d0c0 });
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.8, 0.9, 12), stone); basin.position.set(cx, 0.45, cz); scene.add(basin);
  const wat = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.1, 12), glow(lam({ color: 0x6ab0d8 }), 0x3a80b0, 0.4)); wat.position.set(cx, 0.85, cz); scene.add(wat);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 3.2, 8), stone); col.position.set(cx, 2.4, cz); scene.add(col);
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 0.6, 0.6, 10), stone); bowl.position.set(cx, 4.1, cz); scene.add(bowl);
  solid(cx - 4.5, cz - 4.5, cx + 4.5, cz + 4.5, 0, 0.9); solid(cx - 0.7, cz - 0.7, cx + 0.7, cz + 0.7, 0.9, 4.4);
  for (const [x, z] of [[PZ[0] + 2, PZ[1] + 2], [PZ[2] - 2, PZ[1] + 2], [PZ[0] + 2, PZ[3] - 2], [PZ[2] - 2, PZ[3] - 2]]) LAMPS2.push([x, z]);
  for (let k = 0; k < 4; k++) BENCHES.push([cx + (k < 2 ? -14 : 14), cz + (k % 2 ? -10 : 10), Math.PI / 2]);
  const res2 = [...res, PZ];
  placeLots(Rc, 12, 18, lot => {
    const f = inset(lot, 1.6); if (!okLot(f, res2)) return;
    gableBuilding(f, rr(12, 20), 1.6, pick(ITAL), 'RF_TERRA');
    if (rnd() < 0.5) addAwning(f, faceOf(f, Rc));
  });
  for (let x = Rc[0] + 8; x < Rc[2]; x += 20) LAMPS2.push([x, Rc[1] + 0.8], [x, Rc[3] - 0.8]);
  SPOT_AREAS.push(['汐留イタリア街 広場', ...PZ], [name, ...Rc]);
}
function deckWalk(x0, z0, x1, z1, y, label) { // ペデストリアンデッキ (2階の空中歩廊)
  const dm = lam({ color: 0xc8ccd0 }), rm = lam({ color: 0x9fc4d4 });
  blk(x0, y - 0.7, z0, x1, y, z1, dm);
  const alongX = x1 - x0 > z1 - z0;
  if (alongX) { for (const z of [z0 + 0.1, z1 - 0.1]) box(x1 - x0, 1.1, 0.12, rm, (x0 + x1) / 2, y + 0.55, z); for (let x = x0 + 8; x < x1; x += 24) blk(x - 0.5, 0, (z0 + z1) / 2 - 0.5, x + 0.5, y - 0.7, (z0 + z1) / 2 + 0.5, dm); }
  else { for (const x of [x0 + 0.1, x1 - 0.1]) box(0.12, 1.1, z1 - z0, rm, x, y + 0.55, (z0 + z1) / 2); for (let z = z0 + 8; z < z1; z += 24) blk((x0 + x1) / 2 - 0.5, 0, z - 0.5, (x0 + x1) / 2 + 0.5, y - 0.7, z + 0.5, dm); }
  fr(x0, z0, x1, z1, '#8a96a2');
  DECKS.push([x0, z0, x1, z1, label]);
}

// ---- 区画
const NW = { W1: [-1676, -1456], W2: [-1436, -1134], W3: [-1102, -934], W4: [-914, -724], E: [-688, -476] };
const NR = { N1: [-1076, -1004], N2: [-984, -916], N3: [-892, -784], N4: [-764, -496] };
const NB = (c, r) => [NW[c][0], NR[r][0], NW[c][1], NR[r][1]];
const YURI_STRIP = [-372, -1080, -348, -480];
const TORA = [-1676, -984, -1456, -784], ATAGO = { x: -1285, z: -630 };
const N_RES = [...EXP_RES, YURI_STRIP];

// ---- 虎ノ門ヒルズ (オーバル広場と新虎通りの起点)
tiles(...TORA, '#b4aea4', '#9e988e', 3); fe(-1566, -835, 46, 26, GRASS);
addBuilding(-1600, -960, -1520, -880, 255, 'glassDark');
addBuilding(-1660, -1068, -1600, -1010, 230, 'glass');
for (let a = 0; a < Math.PI * 2; a += 0.4) ROUND.push([-1566 + Math.cos(a) * 52, -835 + Math.sin(a) * 31, 1]);
SPOT_AREAS.push(['虎ノ門ヒルズ オーバル広場', -1614, -862, -1518, -808], ['虎ノ門ヒルズ', ...TORA]);
tiles(-1500, -920, -720, -912, '#b8b0a2', '#a39a8c', 2); tiles(-1500, -896, -720, -888, '#b8b0a2', '#a39a8c', 2); // 新虎通りの広い歩道
for (let x = -1494; x < -724; x += 12) { ROUND.push([x, -916, 1.05], [x, -892, 1.05]); }
for (let x = -1488; x < -724; x += 24) BENCHES.push([x, -918.5, 0], [x, -889.5, 0]);
// ---- 愛宕山 (段々の丘。東側の急な石段で山頂の愛宕神社へ)
{
  const tiers = [[60, 7], [50, 13], [42, 19.5], [34, 26]], cx = ATAGO.x, cz = ATAGO.z;
  const hillTex = tex(16, 16, x => { x.fillStyle = '#4f7a34'; x.fillRect(0, 0, 16, 16); for (let i = 0; i < 40; i++) { x.fillStyle = rnd() < 0.5 ? '#5a8a3c' : '#43692c'; x.fillRect(rnd() * 16 | 0, rnd() * 16 | 0, 2, 1); } });
  hillTex.repeat.set(6, 1);
  const hm = lam({ map: hillTex });
  for (const [r, h] of tiers) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.082 * 0.97, r * 1.082, h, 8), hm);
    c.rotation.y = Math.PI / 8; c.position.set(cx, h / 2, cz); scene.add(c);
    for (const [hx, hz] of [[r, r * 0.41], [r * 0.41, r], [r * 0.71, r * 0.71]]) solid(cx - hx, cz - hz, cx + hx, cz + hz, 0, h);
  }
  fe(cx, cz, 62, 62, '#5f8a3e'); fe(cx, cz, 36, 36, '#6a9446');
  tiers.forEach(([r, h], k) => {
    const rin = k < tiers.length - 1 ? tiers[k + 1][0] + 2 : 0;
    for (let a = 0; a < Math.PI * 2; a += 0.32) {
      const rad = rr(rin + 1, r - 2), x = cx + Math.cos(a) * rad, z = cz + Math.sin(a) * rad;
      if (Math.abs(z - cz) < 5 && x > cx) continue;                // 石段まわりは空ける
      if (k === tiers.length - 1 && Math.hypot(x - cx, z - cz) < 20) continue;
      (rnd() < 0.5 ? PINES : ROUND).push([x, z, rr(0.9, 1.3), h]);
    }
  });
  stairs([cx + 34, cz - 2.5, cx + 69.5, cz + 2.5], 26, 'x-');      // 出世の石段 (86段の急な石段)
  torii(cx + 72, cz, 0, false); torii(cx + 30, cz, 26, false);
  const holder = chunkAt(cx, cz - 10);                               // 山頂の愛宕神社
  pushBox(bucket(holder, 'WOOD'), bucket(holder, 'ROOF'), cx - 8, 26.8, cz - 16, cx + 2, 31, cz - 4);
  pushGable(bucket(holder, 'RF_COPPER'), bucket(holder, 'WOOD'), cx - 8, 31, cz - 16, cx + 2, 34, cz - 4);
  blk(cx - 9, 26, cz - 17, cx + 3, 26.8, cz - 3, lam({ color: 0xa8a090 })); solid(cx - 8, cz - 16, cx + 2, cz - 4, 26.8, 31);
  blk(cx - 22, 26, cz + 6, cx - 8, 34, cz + 18, lam({ color: 0xd8d4c8 }));   // NHK放送博物館
  fe(cx + 2, cz, 12, 3, '#a8a090');
  SPOT_AREAS.push(['出世の石段', cx + 33, cz - 4, cx + 72, cz + 4], ['愛宕山', cx - 62, cz - 62, cx + 62, cz + 62]);
}
// ---- 新橋: SL広場 / 駅前ビル / 烏森口の飲み屋街 / ガード下
tiles(-640, -984, -482, -874, '#b8ae9c', '#a29886', 3);
steamLoco(-560, -930);
for (let k = 0; k < 6; k++) BENCHES.push([-610 + k * 18, -885, 0]);
for (let k = 0; k < 8; k++) ROUND.push([-630 + k * 20, -978, 0.9]);
addBuilding(-688, -984, -645, -900, 34, 'nsb', { noRoofBox: true }); addBuilding(-688, -894, -645, -876, 22, 'office2'); // ニュー新橋ビル / 新橋駅前ビル
koban([-506, -972, -499, -964], 'w', '新橋駅前交番');
SPOT_AREAS.push(['新橋駅', -482, -964, -418, -876], ['新橋 SL広場', -640, -984, -482, -874], ['ニュー新橋ビル', -692, -988, -641, -896], ['新橋駅前ビル', -692, -896, -641, -872]);
const KARASUMORI = [-612, -796, -584, -754];
yokocho([-688, -870, -478, -640], [...N_RES, [KARASUMORI[0] - 2, KARASUMORI[1] - 2, KARASUMORI[2] + 2, KARASUMORI[3] + 2]], '新橋 烏森口 飲み屋街');
shrine(KARASUMORI, '烏森神社', 0);   // 飲み屋街の路地の奥にたたずむ神社
mixed(NB('E', 'N1'), N_RES); DIST_AREAS.push(['新橋二丁目', ...NB('E', 'N1')]);
office([-688, -636, -476, -496], N_RES); DIST_AREAS.push(['新橋三丁目', -688, -636, -476, -496]);
{ // ガード下: 高架の下の屋台・飲み屋 (所々に抜け道)
  let n = 0;
  for (let z = GADO[0] + 1; z < GADO[1] - 4;) {
    const w = rr(5, 8), z1 = Math.min(z + w, GADO[1] - 1);
    if (n++ % 4 !== 3) for (const [x0, x1, face] of [[-472, -466, 'e'], [-434, -428, 'w']]) {
      const f = [x0, z, x1, z1 - 0.3];
      addBuilding(...f, 3.4, pick(SHOPS), { noRoofBox: true }); if (rnd() < 0.8) addAwning(f, face);
      LANTERNS.push([face === 'e' ? -465.4 : -434.6, (z + z1) / 2]);
    }
    z = z1;
  }
  SPOT_AREAS.push(['新橋 ガード下', -472, GADO[0], -428, GADO[1]]);
}
// ---- 汐留シオサイト (超高層 + 空中歩廊)
tiles(-424, -804, -304, -504, '#b8b2a8', '#a29c92', 4); tiles(-284, -804, -144, -504, '#b8b2a8', '#a29c92', 4);
for (const [x0, z0, x1, z1, h, k, nm] of [
  [-418, -776, -372, -712, 213, 'glassDark', '電通本社ビル'], [-418, -690, -380, -660, 140, 'glass', '汐留タワー'], [-346, -560, -306, -512, 197, 'glass', '汐留シティセンター'],
  [-270, -690, -214, -616, 192, 'glassDark', '日本テレビタワー'], [-270, -796, -200, -730, 200, 'glass', 'カレッタ汐留'], [-198, -572, -150, -516, 172, 'office2', '汐留メディアタワー']]) {
  addBuilding(x0, z0, x1, z1, h, k); SPOT_AREAS.push([nm, x0 - 6, z0 - 6, x1 + 6, z1 + 6]);
}
{ // 日テレ大時計 (からくり時計風)
  const br = lam({ color: 0x8a6a3a }), cu = lam({ color: 0x5a7a6a });
  blk(-252, 0, -606, -232, 8, -596, br); blk(-250, 8, -604, -234, 11, -598, cu);
  for (const x of [-249, -237]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 5, 6), br); c.position.set(x, 13, -601); scene.add(c); KARA.chim.push(c); }
  for (const [x, y] of [[-250.5, 4], [-233.5, 4], [-242, 9.5]]) { const g = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.4, 8), cu); g.rotation.x = Math.PI / 2; g.position.set(x, y, -595.6); scene.add(g); KARA.gears.push(g); }
  const face = clockFaceTex('#e8dcc0', '#3a2a1a');
  const fm = new THREE.Mesh(new THREE.CircleGeometry(3.2, 16), glow(lam({ map: face, transparent: true }), 0xfff0c0, 0.6)); fm.position.set(-242, 5, -595.9); scene.add(fm); clockHands(-242, 5, -595.8, 0, 3.2);
  fr(-252, -606, -232, -596, '#8a6a3a');
  SPOT_AREAS.unshift(['日テレ大時計', -258, -612, -226, -588]);
}
deckWalk(-372, -657, -212, -650, 7, '汐留 ペデストリアンデッキ');
deckWalk(-299, -800, -289, -510, 7, '汐留 ペデストリアンデッキ');
stairs([-299, -510, -289, -499], 7, 'z-'); stairs([-299, -811, -289, -800], 7, 'z+'); stairs([-212, -657, -200, -650], 7, 'x-');
for (let k = 0; k < 20; k++) ROUND.push([rr(-420, -308), rr(-500, -510) - rr(0, 280), 1]);
// ---- 旧新橋停車場 (1872年、日本初の鉄道の起点) と 0哩標識
{
  const sm = lam({ map: stoneTex }), hold = chunkAt(-405, -537);
  pushBox(bucket(hold, 'CONC'), bucket(hold, 'ROOF'), -420, 0, -545, -390, 0.01, -529);
  const body = new THREE.Mesh(boxGeo(30, 7, 16, 8, 8), sm); body.position.set(-405, 3.5, -537); scene.add(body);
  pushGable(bucket(hold, 'RF2'), bucket(hold, 'CONC'), -420, 7, -545, -390, 10, -529);
  solid(-420, -545, -390, -529, 0, 7); solid(-414, -541, -396, -533, 7, 9.5);
  fr(-420, -545, -390, -529, '#c8bca0');
  blk(-405.3, 0, -524.3, -404.7, 1.2, -523.7, lam({ color: 0xd8d4c8 }));                 // 0哩標識
  for (const dz of [-0.75, 0.75]) box(8, 0.15, 0.12, lam({ color: 0x8a8a8a }), -405, 0.1, -521 + dz);
  SPOT_AREAS.unshift(['旧新橋停車場 (0哩標識)', -424, -549, -386, -518]);
}
// ---- 汐留イタリア街
italian([-112, -804, 56, -504], N_RES, '汐留イタリア街');
// ---- 銀座
for (const x of [-144, -116]) tiles(x - 4 + (x === -116 ? 4 : 0), -1300, x + (x === -116 ? 4 : 0), -500, '#c4bcac', '#ae a696'.replace(' ', ''), 2);
const WAKO = [-176, -1236, -144, -1204], MITSU = [-112, -1256, -60, -1204], KABUKI = [-62, -1184, 32, -1142];
{
  addBuilding(...WAKO, 26, 'gz0', { noRoofBox: true });                          // 和光 (時計塔)
  const st = lam({ color: 0xd8d0c0 });
  const tw = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 7, 10, 10), st); tw.position.set(-152, 31, -1212); scene.add(tw);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(3, 6.5, 3, 10), lam({ color: 0x4a6a5a })); cap.position.set(-152, 37.5, -1212); scene.add(cap);
  solid(-158, -1218, -146, -1206, 26, 39);
  const face = clockFaceTex('#f4f0e4', '#222');
  for (const [x, z, ry] of [[-152, -1204.8, 0], [-144.8, -1212, Math.PI / 2]]) { const m = new THREE.Mesh(new THREE.CircleGeometry(3, 16), glow(lam({ map: face, transparent: true }), 0xfff4d8, 0.8)); m.position.set(x, 31, z); m.rotation.y = ry; scene.add(m); clockHands(x + Math.sin(ry) * 0.1, 31, z + Math.cos(ry) * 0.1, ry, 3); }
  addBuilding(...MITSU, 32, 'gz2', { noRoofBox: true });                          // 三越
  // 歌舞伎座: 白壁と大きな屋根、赤い提灯
  const wh = lam({ color: 0xf0ece0 }), rf = lam({ color: 0x3a3a40 }), rd = glow(lam({ color: 0xd03020 }), 0xff4020, 1);
  blk(KABUKI[0], 0, KABUKI[1], KABUKI[2], 12, KABUKI[3], wh); fr(...KABUKI, '#c8402a');
  for (const [x, w, y, h] of [[-15, 96, 12, 9], [-15, 40, 18, 9]]) { const r = new THREE.Mesh(new THREE.ConeGeometry(w * 0.6, h, 4), rf); r.position.set(x, y + h / 2, -1163); r.rotation.y = Math.PI / 4; r.scale.set(1, 1, 0.45); scene.add(r); }
  solid(KABUKI[0], KABUKI[1], KABUKI[2], KABUKI[3], 12, 17); solid(-40, -1175, 10, -1151, 17, 24);
  for (let x = -54; x <= 24; x += 13) { blk(x - 0.4, 0, -1187, x + 0.4, 7, -1186, lam({ color: 0x8a1a1a })); const l = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.6, 8), rd); l.position.set(x, 5, -1187.6); scene.add(l); }
  addBuilding(-52, -1136, 22, -1100, 145, 'glass');                              // 歌舞伎座タワー
  SPOT_AREAS.push(['銀座 和光 (時計塔)', -180, -1240, -140, -1200], ['銀座三越', -116, -1260, -56, -1200], ['歌舞伎座', -66, -1190, 36, -1138], ['銀座四丁目交差点', -150, -1212, -106, -1178]);
}
const G_RES = [...N_RES, [WAKO[0] - 2, WAKO[1] - 2, WAKO[2] + 2, WAKO[3] + 2], [MITSU[0] - 2, MITSU[1] - 2, MITSU[2] + 2, MITSU[3] + 2], [KABUKI[0] - 2, KABUKI[1] - 2, 36, -1096]];
ginza([-284, -1296, -144, -1204], G_RES, '銀座四丁目'); ginza([-112, -1296, 56, -1204], G_RES, '銀座四丁目 (東)');
ginza([-284, -1184, -144, -1004], G_RES, '銀座五丁目'); ginza([-112, -1184, 56, -1004], G_RES, '銀座五丁目・東銀座');
ginza([-284, -984, -144, -824], G_RES, '銀座七丁目'); ginza([-112, -984, 56, -824], G_RES, '銀座八丁目');
mixed([-424, -984, -304, -824], N_RES); DIST_AREAS.push(['新橋一丁目 (汐留口)', -424, -984, -304, -824]);
planks(40, -1300, 60, -500, '#8a8478', '#7a7468', false); SPOT_AREAS.push(['築地川 河岸', 36, -1300, 60, -500]);
// ---- 虎ノ門・西新橋・新橋 (西側)
office(NB('W1', 'N1'), N_RES); DIST_AREAS.push(['虎ノ門二丁目', ...NB('W1', 'N1')]);
mixed(NB('W1', 'N4'), N_RES); DIST_AREAS.push(['愛宕二丁目', ...NB('W1', 'N4')]);
office(NB('W2', 'N1'), N_RES); DIST_AREAS.push(['虎ノ門一丁目', ...NB('W2', 'N1')]);
office(NB('W2', 'N2'), N_RES); office(NB('W2', 'N3'), N_RES); DIST_AREAS.push(['虎ノ門 (新虎通り)', NW.W2[0], -984, NW.W2[1], -784]);
{ const a = NB('W2', 'N4'); for (let i = 0; i < 70; i++) { const x = rr(a[0] + 2, a[2] - 2), z = rr(a[1] + 2, a[3] - 2); if (Math.hypot(x - ATAGO.x, z - ATAGO.z) > 64 && !(Math.abs(z - ATAGO.z) < 5 && x > ATAGO.x)) ROUND.push([x, z, rr(0.9, 1.3)]); } fr(...a, '#4f7a34'); fe(ATAGO.x, ATAGO.z, 62, 62, '#5f8a3e'); DIST_AREAS.push(['愛宕', ...a]); }
office(NB('W3', 'N1'), N_RES); DIST_AREAS.push(['西新橋二丁目', ...NB('W3', 'N1')]);
mixed(NB('W3', 'N2'), N_RES); DIST_AREAS.push(['西新橋一丁目', ...NB('W3', 'N2')]);
office(NB('W3', 'N3'), N_RES); DIST_AREAS.push(['西新橋 (新虎通り)', ...NB('W3', 'N3')]);
residential(NB('W3', 'N4'), N_RES, '愛宕一丁目', '愛宕児童遊園');
mixed(NB('W4', 'N1'), N_RES); DIST_AREAS.push(['新橋四丁目', ...NB('W4', 'N1')]);
yokocho(NB('W4', 'N2'), N_RES, '新橋 ニュー新橋ビル裏');
mixed(NB('W4', 'N3'), N_RES); DIST_AREAS.push(['新橋五丁目', ...NB('W4', 'N3')]);
residential(NB('W4', 'N4'), N_RES, '新橋六丁目', '新橋六丁目児童遊園');

