/* ============================================================
   山手線以外の鉄道 (地下鉄以外) の基盤: 高架・地平の線路・トンネルの入口・駅 (ホーム・屋根・駅名標・駅舎)
   路線データは regions/01_rail_lines.js、電車と乗り降りは engine/12b_waterbus.js (RAIL_TR)
   - y >= 3 は高架 (8m ごとの橋桁と24m ごとの橋脚。山手線の高架の上では両側に門形の橋脚を立てる)
   - 0〜3 は地平・盛り土、0 より下はトンネル (入口に坑口を置き、地下を走る間は電車を見せない)
   - すでに作り込みでできている高架 (pts の flag = 1) は作らない
   - 線路の通り道は自動生成の街から外し、そこにある木や街灯もどける
   ============================================================ */
const RAIL_CONFLICTS = [];   // (確かめ用) 作り込み済みの場所と重なった区間
{
  const STEP = 8, o = new THREE.Object3D(), M = { deck: [], par: [], rail: [], pil: [], beam: [], bal: [], wall: [] };
  const put = (arr, x, y, z, ang, sx, sy, sz) => { o.position.set(x, y, z); o.rotation.set(0, ang, 0); o.scale.set(sx, sy, sz); o.updateMatrix(); arr.push(o.matrix.clone()); };
  const preZones = LM_ZONES.slice(), preBB = preZones.map(polyBB);
  const inPre = (x, z) => { for (let i = 0; i < preZones.length; i++) { const b = preBB[i]; if (x > b[0] && x < b[2] && z > b[1] && z < b[3] && inPoly(preZones[i], x, z)) return i; } return -1; };
  const onRoad = (x, z) => ROADS.some(r => inR(r, x, z));
  const flagAt = (ln, s) => { let lo = 0, hi = ln.L.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ln.L[m] <= s) lo = m; else hi = m; } return ln.flags[lo] && ln.flags[hi]; };
  const CORR = [];   // 線路の通り道 [x, z, 半幅] (木をどけるのに使う)
  for (const ln of RAIL_TR) {
    // ホームのある区間 (ホーム側の欄干を作らない)
    const plat = ln.stations.filter(st => !st.opt.prebuilt).map(st => [st.s, Math.sign(st.lat) || 1, Math.min(110, ln.cars * ln.carLen + 8) / 2 + 2]);
    let prevTun = null, k = 0;
    for (let s = 0; s < ln.len; s += STEP, k++) {
      const q = trAt(ln, s + STEP / 2), y = q.y, ang = Math.atan2(q.tx, q.tz), nx = -q.tz, nz = q.tx;
      const tun = y < -0.6;
      if (prevTun !== null && tun !== prevTun) {   // 坑口 (トンネルの入口)
        const p = trAt(ln, s), a = Math.atan2(p.tx, p.tz);
        for (const sd of [-1, 1]) put(M.wall, p.x - p.tz * sd * 3.9, 2.6, p.z + p.tx * sd * 3.9, a, 0.8, 5.2, 2);
        put(M.wall, p.x, 5.6, p.z, a, 8.6, 0.8, 2);
      }
      prevTun = tun;
      if (flagAt(ln, s + STEP / 2)) continue;
      if (tun) { if (y > -4.2) for (const sd of [-1, 1]) put(M.wall, q.x + nx * sd * 3.9, 0.4, q.z + nz * sd * 3.9, ang, 0.6, 0.8, STEP + 0.2); continue; }   // 掘割の両側の壁
      CORR.push([q.x, q.z, y >= 3 ? 7 : 6]);
      // (確かめ用) 作り込み済みの場所に入っていないか
      for (const v of [0, -4, 4]) { const zi = inPre(q.x + nx * v, q.z + nz * v); if (zi >= 0) { RAIL_CONFLICTS.push([ln.name, Math.round(q.x), Math.round(q.z), Math.round(y), preBB[zi].map(Math.round)]); break; } }
      if (y >= 3) {
        put(M.deck, q.x, y - 0.5, q.z, ang, 8, 0.8, STEP + 0.3);
        for (const sd of [-1, 1]) {
          if (plat.some(([ps, side, h]) => side === sd && Math.abs(s + STEP / 2 - ps) < h)) continue;
          put(M.par, q.x + nx * sd * 3.8, y + 0.4, q.z + nz * sd * 3.8, ang, 0.3, 1.0, STEP + 0.3);
        }
        const hx = Math.abs(q.tx) * STEP / 2 + Math.abs(nx) * 4, hz = Math.abs(q.tz) * STEP / 2 + Math.abs(nz) * 4;
        solid(q.x - hx, q.z - hz, q.x + hx, q.z + hz, y - 0.9, y - 0.1);
        if (k % 3 === 0) {
          const rn = ringNearest(q.x, q.z), rq = rn && ringAt(rn.s), dh = rn ? deckHalf(rn.s) : 0;
          if (rn && rn.d < dh + 5) {   // 山手線の高架の上: 両側に門形の橋脚と梁
            if (y > 11) {
              for (const sd of [-1, 1]) { const px = rq.x + rq.nx * sd * (dh + 2.5), pz = rq.z + rq.nz * sd * (dh + 2.5); put(M.pil, px, (y - 1.4) / 2, pz, rq.ang, 1.6, y - 1.4, 1.6); solid(px - 0.8, pz - 0.8, px + 0.8, pz + 0.8, 0, y - 1.4); }
              put(M.beam, rq.x, y - 1.6, rq.z, rq.ang + Math.PI / 2, 2 * (dh + 3.3), 1.2, 1.4);
            }
          } else if (!onRoad(q.x, q.z) && !STN_RES.some(r => inR(r, q.x, q.z))) {
            const base = onLand(q.x, q.z) ? 0 : -3, h = y - 0.9 - base;
            put(M.pil, q.x, base + h / 2, q.z, ang, 2, h, 2); solid(q.x - 1, q.z - 1, q.x + 1, q.z + 1, base, y - 0.9);
          }
        }
      } else {   // 地平・盛り土
        const h = Math.max(0.3, y);
        put(M.bal, q.x, h / 2, q.z, ang, 4.6, h, STEP + 0.3);
        if (h > 0.6) { const hx = Math.abs(q.tx) * STEP / 2 + Math.abs(nx) * 2.3, hz = Math.abs(q.tz) * STEP / 2 + Math.abs(nz) * 2.3; solid(q.x - hx, q.z - hz, q.x + hx, q.z + hz, 0, h); }
      }
      const ry = Math.max(0.3, y);
      for (const sd of [-1, 1]) put(M.rail, q.x + nx * sd * 0.75, ry + 0.06, q.z + nz * sd * 0.75, ang, 0.14, 0.12, STEP + 0.3);
    }
    // 地図と地面: 線路の通り道を塗り、自動生成の街から外す (40m ごと)
    for (let s = 0; s < ln.len; s += 40) {
      const a = trAt(ln, s), b = trAt(ln, Math.min(ln.len, s + 40)), ym = (a.y + b.y) / 2;
      if (ym < -0.6 || flagAt(ln, s + 20)) continue;
      const nx = -(b.z - a.z) / 40, nz = (b.x - a.x) / 40, w = ym >= 3 ? 4.4 : 3.4, W = ym >= 3 ? 7 : 6;
      const quad = (d, ex) => [[a.x - nx * d - (b.x - a.x) / 40 * ex, a.z - nz * d - (b.z - a.z) / 40 * ex], [b.x - nx * d + (b.x - a.x) / 40 * ex, b.z - nz * d + (b.z - a.z) / 40 * ex], [b.x + nx * d + (b.x - a.x) / 40 * ex, b.z + nz * d + (b.z - a.z) / 40 * ex], [a.x + nx * d - (b.x - a.x) / 40 * ex, a.z + nz * d - (b.z - a.z) / 40 * ex]];
      polyFr(quad(w, 0), ym >= 3 ? '#77736c' : '#7d6e5c');
      LM_ZONES.push(quad(W, 2));
    }
  }
  const inst = (list, mat) => { if (!list.length) return; const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat, list.length); list.forEach((x, i) => m.setMatrixAt(i, x)); scene.add(m); };
  inst(M.deck, concrete); inst(M.par, lam({ color: 0xb4b0a6 })); inst(M.rail, lam({ color: 0x5a5650 })); inst(M.pil, concrete); inst(M.beam, concrete);
  inst(M.bal, lam({ color: 0x7a7066 })); inst(M.wall, lam({ color: 0x8e8a82 }));

  // ---- 駅
  const SIGN = new Map(), signMat = (ln, name) => {   // 駅名標 (白地に路線の色の帯)
    const k = ln.id + name; if (SIGN.has(k)) return SIGN.get(k);
    const t = tex(256, 96, x => {
      x.fillStyle = '#f8f8f4'; x.fillRect(0, 0, 256, 96); x.fillStyle = ln.color; x.fillRect(0, 0, 256, 7); x.fillRect(0, 70, 256, 26);
      x.fillStyle = '#222'; x.textAlign = 'center'; x.font = `bold ${name.length > 6 ? 20 : 30}px "DotGothic16", sans-serif`; x.fillText(name, 128, 50);
      x.fillStyle = '#fff'; x.font = '13px "DotGothic16", sans-serif'; x.fillText(ln.name, 128, 88);
    });
    const m = lam({ map: t, side: THREE.DoubleSide }); SIGN.set(k, m); return m;
  };
  const postM = lam({ color: 0x8a8e94 }), edgeM = lam({ color: 0xe8c840 }), built = [], groups = [];
  for (const ln of RAIL_TR) for (const st of ln.stations) {
    const g = groups.find(g => g.name === st.name && Math.hypot(g.x - st.px, g.z - st.pz) < 160);
    const xs = [st.px, st.land[0]], zs = [st.pz, st.land[1]], bb = [Math.min(...xs) - 12, Math.min(...zs) - 12, Math.max(...xs) + 12, Math.max(...zs) + 12];
    if (g) { if (!g.lines.includes(ln.name)) g.lines.push(ln.name); g.bb = [Math.min(g.bb[0], bb[0]), Math.min(g.bb[1], bb[1]), Math.max(g.bb[2], bb[2]), Math.max(g.bb[3], bb[3])]; }
    else groups.push({ name: st.name, x: st.px, z: st.pz, lines: [ln.name], bb });
    if (st.opt.prebuilt) continue;
    const F = frame(st.px, st.pz, st.tx, st.tz, -st.tz, st.tx), y = st.y, PL = Math.min(110, ln.cars * ln.carLen + 8), out = st.lat >= 0 ? 1 : -1;
    if (y < -0.6) {   // 地下の駅: 地上の入口だけ
      const [lx, lz] = st.land, E = frame(lx, lz, st.tx, st.tz, -st.tz, st.tx);
      pushPrism('station', 'ROOF', E.rect(-3, -2.2, 3, 2.2), 0, 3.2);
      for (const sd of [-1, 1]) { const [x, z] = E.w(0, sd * 2.3), m = mesh(new THREE.PlaneGeometry(5.4, 2), signMat(ln, st.name), x, 4.4, z); m.rotation.y = Math.atan2(-st.tz * sd, st.tx * sd); }
      LM_ZONES.push(E.rect(-5, -4, 5, 4));
      LM_HEIGHT_AREAS.push([`${ln.name} ${st.name}駅 (地下) の入口`, (x, z, yy) => yy < 3 && inPoly(E.rect(-4, -3.5, 4, 3.5), x, z)]);
      continue;
    }
    // ホーム (2路線で共用する島式ホームは1つだけ作る)
    if (!built.some(b => b.name === st.name && Math.hypot(b.x - st.px, b.z - st.pz) < 6)) {
      built.push({ name: st.name, x: st.px, z: st.pz });
      const top = y + 1.1, P0 = F.rect(-PL / 2, -2.3, PL / 2, 2.3);
      pushPrism('CONC', 'CONC', P0, y < 3 ? 0 : y - 0.9, top);
      for (const sd of [-1, 1]) bake(edgeM, new THREE.BoxGeometry(0.4, 0.03, PL).rotateY(Math.atan2(st.tx, st.tz)).translate(...F.w(0, sd * 2.0).flatMap((v, i) => i ? [top + 0.02, v] : [v])));
      pushPrism('CONC', 'ROOF', F.rect(-PL * 0.36, -2.9, PL * 0.36, 2.9), y + 4.7, y + 5.0, { solid: false });
      for (let u = -PL * 0.33; u <= PL * 0.33; u += 12) { const [x, z] = F.w(u, 0); bake(postM, new THREE.BoxGeometry(0.3, 3.6, 0.3).translate(x, top + 1.8, z)); }
      const ry = Math.atan2(-st.tz, st.tx);
      for (const u of [-PL * 0.22, PL * 0.22]) { const sm = mesh(new THREE.PlaneGeometry(3.6, 1.35), signMat(ln, st.name), ...F.w(u, 0).flatMap((v, i) => i ? [top + 2.1, v] : [v])); sm.rotation.y = ry; }
      LM_HEIGHT_AREAS.push([`${st.name}駅 ${ln.name}のホーム`, (x, z, yy) => Math.abs(yy - top) < 2.5 && inPoly(P0, x, z)]);
    }
    if (!st.opt.upper) {   // 地上の駅舎 (高架の駅は高架の下、地平の駅はホームの外側)
      const ve = st.lat + out * (y >= 3 ? 7 : 8.5), hall = y >= 3 ? F.rect(-14, Math.min(st.lat - 2.3, ve), 14, Math.max(st.lat - 2.3, ve)) : F.rect(-7, Math.min(st.lat + out * 2.6, ve), 7, Math.max(st.lat + out * 2.6, ve));
      const [hx, hz] = F.w(0, (st.lat + ve) / 2);
      if (!onRoad(hx, hz)) {
        pushPrism('station', 'ROOF', hall, 0, y >= 3 ? Math.min(y - 1, 5.5) : 3.6);
        const sg = mesh(new THREE.PlaneGeometry(5.6, 2.1), signMat(ln, st.name), ...F.w(0, ve + out * 0.15).flatMap((v, i) => i ? [2.9, v] : [v])); sg.rotation.y = Math.atan2(-st.tz * out, st.tx * out);
      }
      LM_ZONES.push(F.rect(-PL / 2 - 4, Math.min(st.lat, ve) - 4, PL / 2 + 4, Math.max(st.lat, ve) + 4));
    }
  }
  // 駅の名前 (地図・エリア表示)。山手線の駅と同じ名前の駅は山手線のラベルにまかせる
  for (const g of groups) {
    const spot = `${g.name}駅 (${g.lines.join('・')})`;
    if (!STN.some(s => s.name === g.name && Math.hypot(s.x - g.x, s.z - g.z) < 400)) SPOT_AREAS.unshift([spot, ...g.bb]);   // 山手線の駅と同じ駅は、山手線の駅の名前・名所にまかせる
    if (!STN.some(s => s.name === g.name && Math.hypot(s.x - g.x, s.z - g.z) < 400)) LM_LABELS.push([g.name + '駅', g.x, g.z, '🚉', spot]);
  }
  bakeFlush();
  // 線路の上の木・街灯・ベンチをどける
  const H = new Map(), HC = 40;
  for (const c of CORR) { const k = Math.floor(c[0] / HC) * 100003 + Math.floor(c[1] / HC); let a = H.get(k); if (!a) H.set(k, a = []); a.push(c); }
  const hit = (x, z) => { const ci = Math.floor(x / HC), cj = Math.floor(z / HC); for (let i = ci - 1; i <= ci + 1; i++) for (let j = cj - 1; j <= cj + 1; j++) for (const c of H.get(i * 100003 + j) || []) if (Math.hypot(c[0] - x, c[1] - z) < c[2]) return true; return false; };
  for (const A of [ROUND, PINES, GINKGO, SAKURA, MAPLES, LM_STREET, LAMPS2, BENCHES, LANTERNS]) { const keep = A.filter(p => !hit(p[0], p[1])); A.length = 0; A.push(...keep); }
}
globalThis.RAIL_CONFLICTS = RAIL_CONFLICTS;
