/* ============================================================
   水上バス (隅田川ライン: 浅草〜両国〜竹芝 / 東京湾ライン: 竹芝〜お台場〜豊洲〜葛西臨海公園)
   のりばで E → 停泊中の船に乗る。停泊中に E → 降りる。航路と のりばは regions/00_geography.js
   ============================================================ */
const WB_LINES = WATERBUS.lines.map(l => {
  const L = [0]; for (let i = 1; i < l.pts.length; i++) L.push(L[i - 1] + Math.hypot(l.pts[i][0] - l.pts[i - 1][0], l.pts[i][1] - l.pts[i - 1][1]));
  return { ...l, L, len: L[L.length - 1] };
});
function wbAt(ln, s) {
  s = Math.max(0, Math.min(ln.len, s)); let i = 0; while (i < ln.L.length - 2 && ln.L[i + 1] < s) i++;
  const a = ln.pts[i], b = ln.pts[i + 1], l = ln.L[i + 1] - ln.L[i], t = (s - ln.L[i]) / l;
  return { x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, tx: (b[0] - a[0]) / l, tz: (b[1] - a[1]) / l };
}
function wbProject(ln, x, z) {   // 航路の上でいちばん近い位置 s
  let best = 0, bd = Infinity;
  for (let i = 0; i < ln.pts.length - 1; i++) {
    const [ax, az] = ln.pts[i], [bx, bz] = ln.pts[i + 1], dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    const d = Math.hypot(x - ax - dx * t, z - az - dz * t); if (d < bd) { bd = d; best = ln.L[i] + t * (ln.L[i + 1] - ln.L[i]); }
  }
  return best;
}
for (const ln of WB_LINES) ln.st = ln.stops.map(n => ({ name: n, s: wbProject(ln, ...WATERBUS.piers[n].dock) }));
// ---- 船 (低く平たい水上バス。橋の下をくぐれる)
function makeWaterBus(color) {
  const g = new THREE.Group(), wht = lam({ color: 0xf2f2ee }), band = lam({ color: new THREE.Color(color).getHex() });
  const glass = lam({ color: 0x2a3a4a, emissive: 0xffe8b8, emissiveIntensity: 0 }); GLOW.push([glass, 0.9]);
  box(6.4, 1.6, 22, wht, 0, -1.4, 0, g); box(6.5, 0.35, 22.2, band, 0, -1.0, 0, g);
  const bow = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 3.2, 6, 4, 1).rotateX(Math.PI / 2).rotateZ(Math.PI / 4).scale(1, 0.38, 1), wht); bow.position.set(0, -1.4, 14); g.add(bow);
  box(5.2, 1.9, 13, glass, 0, 0.35, 2.5, g); box(5.5, 0.25, 13.6, wht, 0, 1.4, 2.5, g);
  box(5.6, 0.12, 0.12, band, 0, 1.55, 9.2, g);
  scene.add(g); return g;
}
const WB_BOATS = [];
for (const ln of WB_LINES) for (let k = 0; k < ln.boats; k++) {
  const st = ln.st[Math.floor(k * ln.st.length / ln.boats) % ln.st.length];
  WB_BOATS.push({ line: ln, s: st.s, dir: k % 2 ? -1 : 1, v: 0, dwell: 4 + k * 9, at: st.name, ann: null, g: makeWaterBus(ln.color) });
}
for (const b of WB_BOATS) if ((b.s <= 0.5 && b.dir < 0) || (b.s >= b.line.len - 0.5 && b.dir > 0)) b.dir = -b.dir;
const WB_V = 20, WB_A = 1.0, WB_DWELL = 14;
function wbNextStop(b) {
  let best = null, bd = Infinity;
  for (const st of b.line.st) { const d = (st.s - b.s) * b.dir; if (d > 0.01 && d < bd) { bd = d; best = st; } }
  return [best, bd];
}
function updateBoats(dt, t) {
  for (const b of WB_BOATS) {
    if (b.dwell > 0) {
      b.dwell -= dt;
      if (b.dwell <= 0) { if (b.s <= 0.5) b.dir = 1; else if (b.s >= b.line.len - 0.5) b.dir = -1; b.at = null; }
    } else {
      const [st, dist] = wbNextStop(b);
      if (!st) { b.dir = -b.dir; continue; }
      b.v = Math.min(Math.min(WB_V, Math.sqrt(2 * WB_A * dist) + 0.6), b.v + WB_A * dt);
      const ds = Math.min(b.v * dt, dist); b.s += b.dir * ds;
      if (dist - ds < 0.05) { b.s = st.s; b.v = 0; b.dwell = WB_DWELL; b.at = st.name; }
      if (P.boat && P.boat.b === b && dist < 240 && b.ann !== st.name) { b.ann = st.name; toast(`⛴ まもなく ${st.name}`); }
    }
    const q = wbAt(b.line, b.s);
    b.g.position.set(q.x, Math.sin(t * 1.3 + b.s) * 0.08, q.z);
    const want = Math.atan2(q.tx * b.dir, q.tz * b.dir); let d = want - b.g.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
    b.g.rotation.y += d * Math.min(1, dt * 1.5);
  }
}
LM_UPDATERS.push(updateBoats);
// ---- のりば (浮き桟橋と、岸の屋根・看板)
{
  const pm = lam({ color: 0x8a8e94 }), roof = lam({ color: 0x2a6ab0 });
  for (const [name, pr] of Object.entries(WATERBUS.piers)) {
    const [lx, lz] = pr.land, [dx, dz] = pr.dock, ang = Math.atan2(dx - lx, dz - lz);
    const pon = new THREE.Mesh(new THREE.BoxGeometry(18, 0.7, 7), lam({ color: 0x9a9a92 })); pon.position.set(lx + (dx - lx) * 0.62, -1.15, lz + (dz - lz) * 0.62); pon.rotation.y = ang + Math.PI / 2; chunkAt(lx, lz).group.add(pon);
    const gw = new THREE.Mesh(new THREE.BoxGeometry(2, 0.25, Math.hypot(dx - lx, dz - lz) * 0.5), pm); gw.position.set(lx + (dx - lx) * 0.3, -0.5, lz + (dz - lz) * 0.3); gw.rotation.set(-0.06, ang, 0); chunkAt(lx, lz).group.add(gw);
    for (const [ox, oz] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) mesh(new THREE.CylinderGeometry(0.12, 0.12, 3, 5).translate(0, 1.5, 0), pm, lx + ox, 0, lz + oz);
    mesh(new THREE.BoxGeometry(7.5, 0.25, 7.5), roof, lx, 3.1, lz);
    const sg = mesh(new THREE.BoxGeometry(5.6, 1.1, 0.15), glow(lam({ map: textTex('⛴ 水上バス ' + name, '#1c4ea8', '#ffffff', 256, 28) }), 0xffffff, 0.7), lx, 3.9, lz); sg.rotation.y = ang + Math.PI;
    LM_ZONES.push(rectPoly(lx - 14, lz - 14, lx + 14, lz + 14));
    SPOT_AREAS.push(['水上バス ' + name + 'のりば', lx - 12, lz - 12, lx + 12, lz + 12]);
    LM_LABELS.push([name + 'のりば', lx, lz + 10, '⛴', '水上バス ' + name + 'のりば']);
  }
}
// ---- 乗り降り
function nearPier() { if (P.y > 3) return null; for (const [name, pr] of Object.entries(WATERBUS.piers)) if (Math.hypot(P.x - pr.land[0], P.z - pr.land[1]) < 24) return name; return null; }
function wbDest(b) {   // この船がこれから向かう終点
  let dir = b.dir; if (b.dwell > 0 && (b.s <= 0.5 || b.s >= b.line.len - 0.5)) dir = b.s <= 0.5 ? 1 : -1;
  return dir > 0 ? b.line.stops[b.line.stops.length - 1] : b.line.stops[0];
}
function wbEta(pn) {   // 次の船が来るまでのおおよその秒数
  let best = Infinity;
  for (const b of WB_BOATS) {
    const st = b.line.st.find(s => s.name === pn); if (!st) continue;
    const ahead = (st.s - b.s) * b.dir, d = ahead >= 0 ? ahead : (b.dir > 0 ? (b.line.len - b.s) + (b.line.len - st.s) : b.s + st.s);
    const stops = b.line.st.filter(s => Math.abs(s.s - b.s) < d && s.name !== pn).length;
    best = Math.min(best, Math.max(0, b.dwell) + d / (WB_V * 0.85) + stops * WB_DWELL);
  }
  return best < 60 ? 'まもなく' : `約${Math.round(best / 60)}分`;
}
function boatAction() {
  if (P.boat) {
    const b = P.boat.b;
    if (b.dwell > 0.5 && b.at) {
      const pr = WATERBUS.piers[b.at], from = P.boat.from; P.boat = null;
      Object.assign(P, { x: pr.land[0], z: pr.land[1], y: 0, vy: 0 }); toast(`⛴ ${b.at}で船を降りた`);
      if (from === '浅草' && b.at === '竹芝') achieve('sumidagawa');
    } else toast('航行中は降りられない');
    return true;
  }
  const pn = nearPier(); if (!pn) return false;
  const docked = WB_BOATS.filter(b => b.at === pn && b.dwell > 1).sort((a, c) => c.dwell - a.dwell);
  if (docked.length) {
    const b = docked[(P.wbPick = ((P.wbPick || 0) + 1)) % docked.length]; P.boat = { b, from: pn };
    Object.assign(P, { scooter: false, glider: false });
    toast(`⛴ 水上バス ${b.line.name} (${wbDest(b)}行き) に乗った。停泊中に E で降りる`); toastTimer = 4; return true;
  }
  toast(`⛴ ${pn}のりば: 次の船まで ${wbEta(pn)}`); return true;
}
function boatPrompt() {
  if (P.boat) { const b = P.boat.b; return b.dwell > 0.5 && b.at ? `E　${b.at}で降りる` : ''; }
  const pn = nearPier(); if (!pn) return '';
  const b = WB_BOATS.find(b => b.at === pn && b.dwell > 1);
  return b ? `E　水上バスに乗る (${b.line.name}・${wbDest(b)}行き)` : `⛴ ${pn}のりば　次の船まで ${wbEta(pn)}`;
}
function updateBoatRide(dt) {
  const b = P.boat.b, a = b.g.rotation.y;
  P.x = b.g.position.x - Math.sin(a) * 8; P.z = b.g.position.z - Math.cos(a) * 8; P.y = -0.6; P.vy = 0; P.grounded = true; P.climbing = false;
  if (keys.ArrowLeft) P.yaw += 1.9 * dt; if (keys.ArrowRight) P.yaw -= 1.9 * dt;
  animateAvatar(dt, false); updateCamera(dt, P.y);
  const [st] = wbNextStop(b);
  modeEl.textContent = `⛴ 水上バス ${b.line.name}　` + (b.dwell > 0 && b.at ? `${b.at}に停泊中` : `次は ${st ? st.name : ''}`);
}
LM_ACH.push(['sumidagawa', '⛴ 隅田川下り', '水上バスで浅草から竹芝まで乗り通す', () => false]);
