/* ============================================================
   乗り物の路線: 水上バス (隅田川ライン・東京湾ライン) と ゆりかもめ (新橋〜豊洲)
   のりば・駅の入口で E → 停まっている便に乗る。停車中に E → 降りる
   路線と のりば は regions/00_geography.js
   ============================================================ */
// 山手線以外の鉄道 (regions/01_rail_lines.js。RAIL_LINES は engine/12 で山手線の環ができたあとに作る) も同じしくみで走らせる
const TR_LINES = [...WATERBUS.lines.map(l => ({ ...l, kind: 'boat', v: 20 })), YURIKAMOME,
  ...RAIL_LINES.map(l => ({ ...l, kind: 'rail', vehicles: 0 }))].map(l => {
  const pts = l.pts.map(p => [p[0], p[1], p[2] || 0]), L = [0], flags = l.pts.map(p => p[3] || 0);
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { ...l, pts, flags, L, len: L[L.length - 1] };
});
const RAIL_TR = TR_LINES.filter(l => l.kind === 'rail'), YURI_LN = TR_LINES.find(l => l.kind === 'train');
const stopKey = (ln, n) => ln.kind === 'rail' ? `rail:${ln.id}:${n}` : ln.kind + ':' + n;
const lineLabel = ln => ln.kind === 'boat' ? '水上バス ' + ln.name : ln.kind === 'rail' ? ln.name : 'ゆりかもめ';
const lineIcon = ln => ln.kind === 'boat' ? '⛴' : ln.kind === 'rail' ? '🚃' : '🚝';
const WB_LINES = TR_LINES;   // (地図で航路・路線を描くのに使う)
// のりば: 水上バスは WATERBUS.piers、ゆりかもめは駅 (YURI_STATIONS)。名前が同じでも路線ごとに別
const STOPS = {};
for (const [n, pr] of Object.entries(WATERBUS.piers)) STOPS['boat:' + n] = { name: n, kind: 'boat', dock: pr.dock, land: pr.land, label: `水上バス ${n}のりば` };
for (const [n, [x, z, lx, lz]] of Object.entries(YURI_STATIONS)) STOPS['train:' + n] = { name: n, kind: 'train', dock: [x, z], land: [lx, lz], label: `ゆりかもめ ${n}駅` };
function trAt(ln, s) {
  s = Math.max(0, Math.min(ln.len, s)); let lo = 0, hi = ln.L.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ln.L[m] <= s) lo = m; else hi = m; }
  const a = ln.pts[lo], b = ln.pts[hi], l = ln.L[hi] - ln.L[lo] || 1, t = (s - ln.L[lo]) / l;
  return { x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, y: a[2] + (b[2] - a[2]) * t, tx: (b[0] - a[0]) / l, tz: (b[1] - a[1]) / l };
}
const wbAt = trAt;
function trProject(ln, x, z) {
  let best = 0, bd = Infinity;
  for (let i = 0; i < ln.pts.length - 1; i++) {
    const [ax, az] = ln.pts[i], [bx, bz] = ln.pts[i + 1], dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1)));
    const d = Math.hypot(x - ax - dx * t, z - az - dz * t); if (d < bd) { bd = d; best = ln.L[i] + t * (ln.L[i + 1] - ln.L[i]); }
  }
  return best;
}
// 鉄道の駅: ホームの位置・向き・乗り降りする場所 (land) を決める。終点の駅は電車がはみ出さないよう少し内側に止める
for (const ln of RAIL_TR) {
  const half = ln.cars * ln.carLen / 2 + 3;
  ln.stations = ln.stations.map(([name, x, z, opt = {}]) => {
    let s = trProject(ln, x, z); const q0 = trAt(ln, s), nx = -q0.tz, nz = q0.tx;
    let lat = (x - q0.x) * nx + (z - q0.z) * nz; lat = Math.abs(lat) < 1 ? 0 : Math.sign(lat) * Math.max(4.35, Math.abs(lat));
    s = Math.max(half, Math.min(ln.len - half, s)); const q = trAt(ln, s);
    const px = q.x - q.tz * lat, pz = q.z + q.tx * lat, out = lat >= 0 ? 1 : -1;
    const ys = opt.upper && STN.find(t => t.name === name && Math.hypot(t.x - px, t.z - pz) < 400);   // 山手線と同じ駅: 山手線の駅の入口から乗る
    let land = opt.land || [px - q.tz * out * (q.y > 3 ? 9 : 7), pz + q.tx * out * (q.y > 3 ? 9 : 7)];
    if (!opt.land && ys) {   // 山手線の入口から 36m 外側 (山手線の入口と取り合わない場所)
      const rq = ringAt(ringNearest(...ys.ent).s), dx = ys.ent[0] - rq.x, dz = ys.ent[1] - rq.z, l = Math.hypot(dx, dz) || 1;
      land = [ys.ent[0] + dx / l * 36, ys.ent[1] + dz / l * 36];
    }
    if (!opt.land && !ys && isWaterXZ(...land)) {   // 川の上に降りてしまう駅は、反対側か、もう少し外側の陸に乗り場を置く
      const c = [];
      for (const o of [-out, out]) for (let d = 7; d <= 48; d += 3) c.push([px - q.tz * o * d, pz + q.tx * o * d]);
      land = c.find(p => !isWaterXZ(...p)) || land;
    }
    return { name, s, lat, px, pz, y: q.y, tx: q.tx, tz: q.tz, opt, land };
  }).sort((a, b) => a.s - b.s);
  ln.stops = ln.stations.map(st => st.name);
  for (const st of ln.stations) STOPS[stopKey(ln, st.name)] = { name: st.name, kind: 'rail', line: ln, dock: [st.px, st.pz], land: st.land, plat: st, label: `${ln.name} ${st.name}駅` };
}
for (const ln of TR_LINES) ln.st = ln.stops.map(n => ({ name: n, key: stopKey(ln, n), s: ln.kind === 'rail' ? ln.stations.find(t => t.name === n).s : trProject(ln, ...STOPS[stopKey(ln, n)].dock) }));

// ---- 車両
function makeWaterBus(color) {
  const g = new THREE.Group(), wht = lam({ color: 0xf2f2ee }), band = lam({ color: new THREE.Color(color).getHex() });
  const glass = lam({ color: 0x2a3a4a, emissive: 0xffe8b8, emissiveIntensity: 0 }); GLOW.push([glass, 0.9]);
  box(6.4, 1.6, 22, wht, 0, -1.4, 0, g); box(6.5, 0.35, 22.2, band, 0, -1.0, 0, g);
  const bow = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 3.2, 6, 4, 1).rotateX(Math.PI / 2).rotateZ(Math.PI / 4).scale(1, 0.38, 1), wht); bow.position.set(0, -1.4, 14); g.add(bow);
  box(5.2, 1.9, 13, glass, 0, 0.35, 2.5, g); box(5.5, 0.25, 13.6, wht, 0, 1.4, 2.5, g);
  box(5.6, 0.12, 0.12, band, 0, 1.55, 9.2, g);
  scene.add(g); return [g];
}
const YC_SIDE = tex(32, 8, x => { x.fillStyle = '#f0f0ec'; x.fillRect(0, 0, 32, 8); x.fillStyle = '#2a3a4a'; for (let i = 2; i < 30; i += 5) x.fillRect(i, 1, 4, 3); x.fillStyle = '#1f6fc0'; x.fillRect(0, 5, 32, 2); });
const YC_SIDE_E = tex(32, 8, x => { x.fillStyle = '#000'; x.fillRect(0, 0, 32, 8); x.fillStyle = '#fff4d8'; for (let i = 2; i < 30; i += 5) x.fillRect(i, 1, 4, 3); });
const YC_FRONT = tex(8, 8, x => { x.fillStyle = '#f0f0ec'; x.fillRect(0, 0, 8, 8); x.fillStyle = '#22303c'; x.fillRect(1, 1, 6, 3); x.fillStyle = '#1f6fc0'; x.fillRect(0, 5, 8, 2); });
const YC_SIDE_M = lam({ map: YC_SIDE, emissive: 0xffffff, emissiveMap: YC_SIDE_E, emissiveIntensity: 0 }), YC_FRONT_M = lam({ map: YC_FRONT }), YC_TOP = lam({ color: 0xf0f0ec });
GLOW.push([YC_SIDE_M, 1]);
function makeYurikamome(n) {
  const geo = new THREE.BoxGeometry(2.6, 3, 9.2), cars = [];
  for (let i = 0; i < n; i++) { const m = new THREE.Mesh(geo, [YC_SIDE_M, YC_SIDE_M, YC_TOP, YC_TOP, YC_FRONT_M, YC_FRONT_M]); scene.add(m); cars.push(m); }
  return cars;
}
const WB_BOATS = [];   // すべての便 (船と電車)
for (const ln of RAIL_TR) {   // 鉄道: 路線ごとに1つの InstancedMesh (車両の数だけ)
  ln.vehicles = ln.fleet || Math.max(2, Math.min(4, Math.round(ln.len / 1600)));   // fleet: 路線で台数を決める (都電は短い間隔で走る)
  ln.inst = new THREE.InstancedMesh(new THREE.BoxGeometry(2.9, 3.4, ln.carLen - 0.6), trainMats(ln.body || '#c8ccd0', ln.color), ln.vehicles * ln.cars);
  ln.inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage); ln.inst.frustumCulled = false; scene.add(ln.inst);
}
for (const ln of TR_LINES) for (let k = 0, n = ln.vehicles || ln.boats; k < n; k++) {
  const st = ln.st[Math.floor(k * ln.st.length / n) % ln.st.length];
  const v = { line: ln, s: st.s, dir: k % 2 ? -1 : 1, v: 0, dwell: 4 + k * 9, at: st.name, ann: null, cars: ln.kind === 'boat' ? makeWaterBus(ln.color) : ln.kind === 'rail' ? [] : makeYurikamome(ln.cars), k };
  v.g = v.cars[0]; WB_BOATS.push(v);
}
for (const b of WB_BOATS) if ((b.s <= 1 && b.dir < 0) || (b.s >= b.line.len - 1 && b.dir > 0)) b.dir = -b.dir;
const TR_A = 1.0, TR_DWELL = 14;
function wbNextStop(b) {
  let best = null, bd = Infinity;
  for (const st of b.line.st) { const d = (st.s - b.s) * b.dir; if (d > 0.01 && d < bd) { bd = d; best = st; } }
  return [best, bd];
}
const isEnd = b => b.s <= b.line.st[0].s + 0.5 && b.dir < 0 || b.s >= b.line.st[b.line.st.length - 1].s - 0.5 && b.dir > 0;
function updateBoats(dt, t) {
  for (const b of WB_BOATS) {
    if (b.dwell > 0) {
      b.dwell -= dt;
      if (b.dwell <= 0) { if (isEnd(b)) b.dir = -b.dir; b.at = null; }
    } else {
      const [st, dist] = wbNextStop(b);
      if (!st) { b.dir = -b.dir; continue; }
      b.v = Math.min(Math.min(b.line.v, Math.sqrt(2 * TR_A * dist) + 0.6), b.v + TR_A * dt);
      const ds = Math.min(b.v * dt, dist); b.s += b.dir * ds;
      if (dist - ds < 0.05) { b.s = st.s; b.v = 0; b.dwell = TR_DWELL; b.at = st.name; }
      if (P.boat && P.boat.b === b && dist < 240 && b.ann !== st.name) { b.ann = st.name; toast(`${lineIcon(b.line)} まもなく ${st.name}`); }
    }
    if (b.line.kind === 'boat') {
      const q = trAt(b.line, b.s);
      b.g.position.set(q.x, Math.sin(t * 1.3 + b.s) * 0.08, q.z);
      const want = Math.atan2(q.tx * b.dir, q.tz * b.dir); let d = want - b.g.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
      b.g.rotation.y += d * Math.min(1, dt * 1.5);
    } else if (b.line.kind === 'rail') {   // 鉄道: トンネルの中と遠くの電車は見せない
      const ln = b.line, n = ln.cars, c = trAt(ln, b.s), far = Math.hypot(c.x - camera.position.x, c.z - camera.position.z) > 2200 && !(P.boat && P.boat.b === b);
      for (let i = 0; i < n; i++) {
        const q = trAt(ln, b.s + (i - (n - 1) / 2) * ln.carLen), hide = far || q.y < -1.2;
        RAIL_O.position.set(q.x, q.y + 1.8, q.z); RAIL_O.rotation.set(0, Math.atan2(q.tx, q.tz), 0); RAIL_O.scale.setScalar(hide ? 0 : 1); RAIL_O.updateMatrix();
        ln.inst.setMatrixAt(b.k * n + i, RAIL_O.matrix);
      }
      ln.inst.instanceMatrix.needsUpdate = true;
    } else {
      const ln = b.line, n = b.cars.length;
      b.cars.forEach((m, i) => { const q = trAt(ln, b.s + (i - (n - 1) / 2) * ln.carLen); m.position.set(q.x, q.y + 1.5, q.z); m.rotation.y = Math.atan2(q.tx, q.tz); });
    }
  }
}
const RAIL_O = new THREE.Object3D();
LM_UPDATERS.push(updateBoats);

// ---- のりば (水上バス: 浮き桟橋・屋根・看板 / ゆりかもめ: 高架の駅)
{
  const pm = lam({ color: 0x8a8e94 }), roof = lam({ color: 0x2a6ab0 });
  for (const sp of Object.values(STOPS)) {
    const [lx, lz] = sp.land, [dx, dz] = sp.dock, ang = Math.atan2(dx - lx, dz - lz);
    if (sp.kind === 'boat') {
      const pon = new THREE.Mesh(new THREE.BoxGeometry(18, 0.7, 7), lam({ color: 0x9a9a92 })); pon.position.set(lx + (dx - lx) * 0.62, -1.15, lz + (dz - lz) * 0.62); pon.rotation.y = ang + Math.PI / 2; chunkAt(lx, lz).group.add(pon);
      const gw = new THREE.Mesh(new THREE.BoxGeometry(2, 0.25, Math.hypot(dx - lx, dz - lz) * 0.5), pm); gw.position.set(lx + (dx - lx) * 0.3, -0.5, lz + (dz - lz) * 0.3); gw.rotation.set(-0.06, ang, 0); chunkAt(lx, lz).group.add(gw);
      for (const [ox, oz] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) mesh(new THREE.CylinderGeometry(0.12, 0.12, 3, 5).translate(0, 1.5, 0), pm, lx + ox, 0, lz + oz);
      mesh(new THREE.BoxGeometry(7.5, 0.25, 7.5), roof, lx, 3.1, lz);
      const sg = mesh(new THREE.BoxGeometry(5.6, 1.1, 0.15), glow(lam({ map: textTex('⛴ 水上バス ' + sp.name, '#1c4ea8', '#ffffff', 256, 28) }), 0xffffff, 0.7), lx, 3.9, lz); sg.rotation.y = ang + Math.PI;
      LM_ZONES.push(rectPoly(lx - 14, lz - 14, lx + 14, lz + 14));
      SPOT_AREAS.push([sp.label, lx - 12, lz - 12, lx + 12, lz + 12]);
      LM_LABELS.push([sp.name + 'のりば', lx, lz + 10, '⛴', sp.label]);
    } else if (sp.kind === 'train' && !['新橋', '汐留', '竹芝'].includes(sp.name)) {   // ゆりかもめの駅 (新橋〜竹芝は既存の駅舎)
      const q = trAt(YURI_LN, trProject(YURI_LN, dx, dz));
      const F = frame(q.x, q.z, q.tx, q.tz, lx - q.x, lz - q.z);
      oBox(F, 'station', -30, -10, 30, 10, 3, 8.8, { top: 'CONC' });
      for (const sd of [-1, 1]) oBox(F, 'CONC', -30, sd < 0 ? -10 : 3.6, 30, sd < 0 ? -3.6 : 10, 9.6, 10.6);   // ホーム
      oBox(F, 'CONC', -32, -11, 32, 11, 16, 16.5, { solid: false, top: 'CONC' });
      for (const u of [-28, -10, 10, 28]) for (const v of [-9.5, 9.5]) oBox(F, 'CONC', u - 0.2, v - 0.2, u + 0.2, v + 0.2, 10.6, 16, { solid: false });
      const [sx, sz] = F.w(0, 10.6), sg = mesh(new THREE.BoxGeometry(14, 1.6, 0.2), glow(lam({ map: textTex('ゆりかもめ ' + sp.name, '#1f6fc0', '#ffffff', 256, 30) }), 0xffffff, 0.7), sx, 7, sz);
      sg.rotation.y = Math.atan2(lx - q.x, lz - q.z);
      oFr(F, -30, -10, 30, 10, '#55555a');
      for (const r of [F.rect(-36, -16, 36, 16)]) LM_ZONES.push(r);
      SPOT_AREAS.push([sp.label, ...polyBB(F.rect(-32, -12, 32, 28))]);
      LM_LABELS.push([sp.name + '駅', q.x, q.z, '🚝', sp.label]);
    }
  }
}
// ---- 乗り降り
const rideCam2 = new THREE.Vector3();
// 鉄道は「地上の入口のそば」か「ホームの上」にいるとき (山手線のホームと取り合わないよう、ホームの形で判定)
function onRailPlat(sp) {
  const p = sp.plat, dx = P.x - p.px, dz = P.z - p.pz, u = dx * p.tx + dz * p.tz, v = -dx * p.tz + dz * p.tx;
  return Math.abs(P.y - (p.y + 1.1)) < 2 && Math.abs(u) < 55 && Math.abs(v) < 3.2;
}
function nearStops() {
  const out = [];
  for (const [key, sp] of Object.entries(STOPS)) {
    const d = Math.hypot(P.x - sp.land[0], P.z - sp.land[1]);
    if (sp.kind === 'rail' ? (P.y < 3 && d < 14) || onRailPlat(sp) : d < 24 && P.y < (sp.kind === 'train' ? 18 : 3)) out.push([sp.kind === 'rail' && onRailPlat(sp) ? 0 : d, key]);
  }
  return out.sort((a, b) => a[0] - b[0]).map(o => o[1]);
}
function nearStop() { return nearStops()[0] || null; }
function wbDest(b) {   // この便がこれから向かう終点
  const dir = b.dwell > 0 && isEnd(b) ? -b.dir : b.dir;
  return dir > 0 ? b.line.stops[b.line.stops.length - 1] : b.line.stops[0];
}
function wbEta(key) {   // 次の便が来るまでのおおよその時間
  let best = Infinity;
  for (const b of WB_BOATS) {
    const st = b.line.st.find(s => s.key === key); if (!st) continue;
    const ahead = (st.s - b.s) * b.dir, d = ahead >= 0 ? ahead : (b.dir > 0 ? (b.line.len - b.s) + (b.line.len - st.s) : b.s + st.s);
    const stops = b.line.st.filter(s => Math.abs(s.s - b.s) < d && s.key !== key).length;
    best = Math.min(best, Math.max(0, b.dwell) + d / (b.line.v * 0.85) + stops * TR_DWELL);
  }
  return best < 60 ? 'まもなく' : `約${Math.round(best / 60)}分`;
}
function boatAction() {
  if (P.boat) {
    const b = P.boat.b;
    if (b.dwell > 0.5 && b.at) {
      const sp = STOPS[stopKey(b.line, b.at)], from = P.boat.from; P.boat = null;
      Object.assign(P, { x: sp.land[0], z: sp.land[1], y: 0, vy: 0 }); avatar.visible = true;
      toast(b.line.kind === 'boat' ? `⛴ ${b.at}で船を降りた` : `${lineIcon(b.line)} ${lineLabel(b.line)} ${b.at}駅で降りた`);
      if (b.line.kind === 'boat' && from === '浅草' && b.at === '竹芝') achieve('sumidagawa');
      if (b.line.kind === 'train' && b.at === 'お台場海浜公園' && ['新橋', '汐留', '竹芝'].includes(from)) achieve('yurikamome');
    } else toast('走っている間は降りられない');
    return true;
  }
  const keys = nearStops(), key = keys[0]; if (!key) return false;
  const docked = WB_BOATS.filter(b => b.at && keys.includes(stopKey(b.line, b.at)) && b.dwell > 1).sort((a, c) => c.dwell - a.dwell);
  if (docked.length) {
    const b = docked[(P.wbPick = ((P.wbPick || 0) + 1)) % docked.length]; P.boat = { b, from: b.at };
    Object.assign(P, { scooter: false, glider: false }); P.rideOrb = 0; rideCam2.copy(camera.position);
    if (b.line.kind === 'rail') { (P.railSeen = P.railSeen || new Set()).add(b.line.id); if (P.railSeen.size >= 3) achieve('noritetsu'); }
    toast(b.line.kind === 'boat' ? `⛴ 水上バス ${b.line.name} (${wbDest(b)}行き) に乗った。停泊中に E で降りる` : `${lineIcon(b.line)} ${lineLabel(b.line)} (${wbDest(b)}行き) に乗った。停車中に E で降りる`); toastTimer = 4; return true;
  }
  toast(`${STOPS[key].label}: 次の便まで ${wbEta(key)}`); return true;
}
function boatPrompt() {
  if (P.boat) { const b = P.boat.b; return b.dwell > 0.5 && b.at ? `E　${b.at}で降りる` : ''; }
  const keys = nearStops(), key = keys[0]; if (!key) return '';
  const b = WB_BOATS.find(b => b.at && keys.includes(stopKey(b.line, b.at)) && b.dwell > 1), sp = STOPS[key];
  return b ? `E　${b.line.kind === 'boat' ? '水上バス' : lineLabel(b.line)}に乗る (${b.line.kind === 'boat' ? b.line.name + '・' : ''}${wbDest(b)}行き)` : `${sp.label}　次の便まで ${wbEta(key)}`;
}
function updateBoatRide(dt) {
  const b = P.boat.b, ln = b.line;
  if (ln.kind === 'boat') {
    const a = b.g.rotation.y;
    P.x = b.g.position.x - Math.sin(a) * 8; P.z = b.g.position.z - Math.cos(a) * 8; P.y = -0.6; P.vy = 0; P.grounded = true; P.climbing = false;
    if (keys.ArrowLeft) P.yaw += 1.9 * dt; if (keys.ArrowRight) P.yaw -= 1.9 * dt;
    animateAvatar(dt, false); updateCamera(dt, P.y);
  } else {   // ゆりかもめ・鉄道: 一人称は先頭からの前面展望、三人称は追いかけるカメラ (地下を走っている間は地上から追いかける)
    const q = trAt(ln, b.s), dir = b.dwell > 0 && isEnd(b) ? -b.dir : b.dir, under = q.y < -1;
    P.x = q.x; P.z = q.z; P.y = q.y + 0.2; P.vy = 0; P.grounded = true; avatar.visible = blob.visible = false;
    if (keys.ArrowLeft) P.rideOrb = (P.rideOrb || 0) + 1.5 * dt; if (keys.ArrowRight) P.rideOrb = (P.rideOrb || 0) - 1.5 * dt;
    const h = trAt(ln, b.s + dir * (ln.cars * ln.carLen / 2 + 0.4)), fx = h.tx * dir, fz = h.tz * dir;
    if (SET.view === 0 && !under) {
      P.rideOrb = Math.max(-1.4, Math.min(1.4, P.rideOrb || 0)); const ty = Math.atan2(-fx, -fz) + P.rideOrb;
      camera.position.set(h.x, h.y + 2.2, h.z); camera.rotation.set(-0.06, ty, 0); P.yaw = ty;
    } else {
      const ty = Math.atan2(-fx, -fz) + (P.rideOrb || 0), dist = VIEWS[SET.view].dist * 3 + 14;
      const qy = under ? 0 : q.y;
      rideCam2.lerp(camTarget.set(q.x + Math.sin(ty) * dist, qy + 6 + dist * 0.35 + (under ? 30 : 0), q.z + Math.cos(ty) * dist), Math.min(1, dt * 4));
      camera.position.copy(rideCam2); camera.lookAt(q.x - Math.sin(ty) * 14, qy + 2, q.z - Math.cos(ty) * 14); P.yaw = ty;
    }
  }
  const [st] = wbNextStop(b);
  modeEl.textContent = `${lineIcon(ln)} ${lineLabel(ln)}　` + (b.dwell > 0 && b.at ? `${b.at}に停車中` : `次は ${st ? st.name : ''}`) + (ln.kind === 'rail' && trAt(ln, b.s).y < -1 ? '　(地下)' : '');
}
LM_ACH.push(['noritetsu', '🚃 乗り鉄', '山手線以外の3つの路線の電車に乗る', () => false], ['sumidagawa', '⛴ 隅田川下り', '水上バスで浅草から竹芝まで乗り通す', () => false],
  ['yurikamome', '🚝 ループ橋をぐるり', 'ゆりかもめで新橋・汐留・竹芝から、ループ橋とレインボーブリッジを渡ってお台場海浜公園へ', () => false]);

// ---- ゆりかもめの延伸区間の高架 (竹芝の南から豊洲まで。新橋〜竹芝は既存の高架)
{
  const ln = YURI_LN, s0 = trProject(ln, 15, 318), d = new THREE.Object3D(), G = [], PL = [];
  const span = q => q.x > -100 && q.x < 670 && Math.abs(q.z - 936) < 20;   // レインボーブリッジの吊り橋部分 (橋脚なし)
  for (let s = s0; s < ln.len; s += 6) {
    const q = trAt(ln, s + 3), a = Math.atan2(q.tx, q.tz);
    for (const [ox, w, h, y] of [[0, 7, 1.6, q.y - 0.8], [-3.3, 0.4, 1.2, q.y + 0.4], [3.3, 0.4, 1.2, q.y + 0.4]]) {
      d.position.set(q.x + Math.cos(a) * ox, y, q.z - Math.sin(a) * ox); d.rotation.set(0, a, 0); d.scale.set(w, h, 6.2); d.updateMatrix(); G.push(d.matrix.clone());
    }
    const c = Math.abs(Math.cos(a)), sn = Math.abs(Math.sin(a)), hx = 3.5 * c + 3.1 * sn, hz = 3.5 * sn + 3.1 * c;
    solid(q.x - hx, q.z - hz, q.x + hx, q.z + hz, q.y - 1.6, q.y);
    if (Math.round((s - s0) / 6) % 5 === 0) { const e = trAt(ln, s + 30); LM_ZONES.push(rectPoly(Math.min(q.x, e.x) - 8, Math.min(q.z, e.z) - 8, Math.max(q.x, e.x) + 8, Math.max(q.z, e.z) + 8)); }
    if (Math.round((s - s0) / 6) % 4 === 0 && !span(q)) {
      const base = onLand(q.x, q.z) ? 0 : -3, h = q.y - 1.6 - base;
      d.position.set(q.x, base, q.z); d.rotation.set(0, a, 0); d.scale.set(1, h / 8.2, 1); d.updateMatrix(); PL.push(d.matrix.clone());
      solid(q.x - 1, q.z - 1, q.x + 1, q.z + 1, base, q.y - 1.6);
    }
  }
  const gi = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), concrete, G.length); G.forEach((m, i) => gi.setMatrixAt(i, m)); scene.add(gi);
  const pi = new THREE.InstancedMesh(new THREE.BoxGeometry(2, 8.2, 2).translate(0, 4.1, 0), concrete, PL.length); PL.forEach((m, i) => pi.setMatrixAt(i, m)); scene.add(pi);
  for (let s = s0; s < ln.len; s += 10) { const a = trAt(ln, s), b = trAt(ln, s + 10); ln_paint(a, b); }
  function ln_paint(a, b) { if (a.y < 20) DL.push({ bb: [Math.min(a.x, b.x) - 4, Math.min(a.z, b.z) - 4, Math.max(a.x, b.x) + 4, Math.max(a.z, b.z) + 4], f: g => { g.strokeStyle = 'rgba(70,70,76,.6)'; g.lineWidth = 7; g.beginPath(); g.moveTo(a.x, a.z); g.lineTo(b.x, b.z); g.stroke(); } }); }
}
