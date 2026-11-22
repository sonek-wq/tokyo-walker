/* ============================================================
   川・運河・橋・東側の護岸 (地形は regions/00_geography.js)
   - 川の中だけ地面を掘り下げ (11_ground)、ここで水面・護岸・河川敷・橋を作る
   - 橋は船がくぐれるよう中央が高いアーチ形。歩いて渡れる
   ============================================================ */
// 埋立地の島の護岸
for (const [x0, z0, x1, z1] of GEO_WALLED) box(x1 - x0, 5, z1 - z0, wallNoTop, (x0 + x1) / 2, -2.5, (z0 + z1) / 2);
WALL.RIVERW = lam({ map: (() => { const t = waterTex.clone(); t.repeat.set(1, 1); t.needsUpdate = true; TEXTURES.push(t); LM_UPDATERS.push((dt, tt) => t.offset.set(tt * 0.01, tt * 0.004)); return t; })() });
WALL.RAIL = lam({ color: 0x5a6068 });
{
  const SEA_Z = -1300;   // これより南 (東京湾の水面がある範囲) は川の水面を作らない
  const wtri = (a, b, c) => {   // 水面の三角形 (y = -1.6)。チャンクごとにまとめて遠くでは描かない
    const cx = (a[0] + b[0] + c[0]) / 3, cz = (a[1] + b[1] + c[1]) / 3; if (cz > SEA_Z) return;
    let [p, q, r] = [a, b, c]; if ((q[1] - p[1]) * (r[0] - p[0]) - (q[0] - p[0]) * (r[1] - p[1]) < 0) [q, r] = [r, q];
    pushTri(bucket(chunkAt(cx, cz), 'RIVERW'), [p[0], -1.6, p[1]], [q[0], -1.6, q[1]], [r[0], -1.6, r[1]], [0, 1, 0], [p[0] / 11, -p[1] / 11, q[0] / 11, -q[1] / 11, r[0] / 11, -r[1] / 11]);
  };
  const quad = (P, step = 20) => {   // 凸四角形を細かく分ける (大きなポリゴンはガタつき処理で奥行きがずれるため)
    const [A, B, C, D] = P, nu = Math.max(1, Math.ceil(Math.hypot(B[0] - A[0], B[1] - A[1]) / step)), nv = Math.max(1, Math.ceil(Math.hypot(D[0] - A[0], D[1] - A[1]) / step));
    const at = (u, v) => [A[0] + (B[0] - A[0]) * u + (D[0] - A[0]) * v + (A[0] - B[0] + C[0] - D[0]) * u * v, A[1] + (B[1] - A[1]) * u + (D[1] - A[1]) * v + (A[1] - B[1] + C[1] - D[1]) * u * v];
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = at(i / nu, j / nv), b = at((i + 1) / nu, j / nv), c = at((i + 1) / nu, (j + 1) / nv), d = at(i / nu, (j + 1) / nv); wtri(a, b, c); wtri(a, c, d); }
  };
  for (const r of RIVERS) {
    for (let i = 0; i < r.pts.length; i++) {
      const p = r.pts[i], q = r.pts[i + 1];
      { const R = r.w / Math.cos(Math.PI / 8); for (let k = 0; k < 8; k++) { const a0 = Math.PI / 8 + k * Math.PI / 4, a1 = a0 + Math.PI / 4;   // 折れ目
        quad([[p[0], p[1]], [p[0] + Math.cos(a0) * R / 2, p[1] + Math.sin(a0) * R / 2], [p[0] + Math.cos(a0) * R, p[1] + Math.sin(a0) * R], [p[0] + Math.cos(a1) * R, p[1] + Math.sin(a1) * R]].map(x => x), 40); } }
      if (!q) continue;
      const dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz), ux = dx / l, uz = dz / l, nx = -uz, nz = ux;
      quad([[p[0] + nx * r.w, p[1] + nz * r.w], [q[0] + nx * r.w, q[1] + nz * r.w], [q[0] - nx * r.w, q[1] - nz * r.w], [p[0] - nx * r.w, p[1] - nz * r.w]]);
      // 両岸: 河川敷 (芝生) → 護岸 (川面に向かう壁と、岸の歩道)
      for (const sd of [-1, 1]) {
        const off = (a, b, s0, s1) => [[a[0] + nx * sd * s0, a[1] + nz * sd * s0], [b[0] + nx * sd * s0, b[1] + nz * sd * s0], [b[0] + nx * sd * s1, b[1] + nz * sd * s1], [a[0] + nx * sd * s1, a[1] + nz * sd * s1]];
        if (r.plain) polyFr(off(p, q, r.w, r.w + r.plain), '#5f8a3c');
        polyFr(off(p, q, r.w, r.w + 6), '#a8a49a');
        for (let s = 0; s < l; s += 40) {
          const a = [p[0] + ux * s, p[1] + uz * s], b = [p[0] + ux * Math.min(l, s + 40), p[1] + uz * Math.min(l, s + 40)];
          pushPrism('ISHIGAKI', 'CONC', off(a, b, r.w - 0.5, r.w + 6), -3.2, 0.12, { solid: false });
        }
      }
    }
    for (const P of r.polys) polyFr(P, '#2d6585');
    const mid = r.pts[Math.floor(r.pts.length / 2)];
    LM_LABELS.push([r.name, mid[0], mid[1], '🌊']);
  }
}
// ---- アーチ橋 (中央が高く、船がくぐれる)。a → b は岸から岸まで
function archBridge(ax, az, bx, bz, W, rise, name) {
  const L = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / L, uz = (bz - az) / L, vx = -uz * W / 2, vz = ux * W / 2;
  const n = Math.ceil(L / 2), y = t => rise * Math.sin(Math.PI * t), pt = t => [ax + (bx - ax) * t, az + (bz - az) * t];
  const strip = (t0, t1, s0, s1) => { const a = pt(t0), b = pt(t1); return [[a[0] + vx * s0, a[1] + vz * s0], [b[0] + vx * s0, b[1] + vz * s0], [b[0] + vx * s1, b[1] + vz * s1], [a[0] + vx * s1, a[1] + vz * s1]]; };
  const rw = 0.5 / (W / 2);
  for (let k = 0; k < n; k++) {
    const t0 = k / n, t1 = (k + 1) / n, ya = Math.max(0.12, y(t0)), yb = Math.max(0.12, y(t1)), yy = Math.max(0.12, y((t0 + t1) / 2));
    pushSlope('ASPH', 'CONC', pt(t0), pt(t1), W / 2, ya, yb, 0.8);
    polySolid(strip(t0, t1, -1, 1), yy - 0.8, yy);
    for (const sd of [-1, 1]) {
      const o = 1 - rw / 2, a = pt(t0), b = pt(t1);
      pushSlope('RAIL', 'RAIL', [a[0] + vx * sd * o, a[1] + vz * sd * o], [b[0] + vx * sd * o, b[1] + vz * sd * o], 0.25, ya + 1.1, yb + 1.1, 1.1);
      solid(...polyBB(strip(t0, t1, sd < 0 ? -1 : 1 - rw, sd < 0 ? -1 + rw : 1)), yy, yy + 1.1);
    }
  }
  for (const t of [0.3, 0.7]) pushPrism('CONC', null, strip(t - 0.015, t + 0.015, -0.7, 0.7), -4, y(t) - 0.8, { solid: false });   // 橋脚
  const P = strip(0, 1, -1, 1); BRIDGE_POLYS.push([P, name]);
  polyFr(P, '#55555c'); polyFr(strip(0, 1, -0.03, 0.03), '#e8e6dc');
  return P;
}
const BRIDGE_LIST = [];
for (const r of RIVERS) for (const [name, bx, bz] of r.bridges) {
  const h = riverInfo(bx, bz, 50); if (!h) continue;
  const [ax, az] = r.pts[h.i], [cx, cz] = r.pts[h.i + 1], l = Math.hypot(cx - ax, cz - az), nx = -(cz - az) / l, nz = (cx - ax) / l;
  const mx = ax + (cx - ax) * h.t, mz = az + (cz - az) * h.t, half = r.w + r.plain + 16;
  archBridge(mx - nx * half, mz - nz * half, mx + nx * half, mz + nz * half, 22, r.rise, name);
  BRIDGE_LIST.push([name, mx, mz, r.name]);
}
// 道路 (100m ごとの格子) と交わるところに自動でかける橋 (autoBridges を持つ川だけ)。橋は道路の向きにそろえる
for (const r of RIVERS) if (r.autoBridges) {
  const named = BRIDGE_LIST.filter(b => b[3] === r.name);
  for (let i = 0; i + 1 < r.pts.length; i++) {
    const [ax, az] = r.pts[i], [bx, bz] = r.pts[i + 1], l = Math.hypot(bx - ax, bz - az), nx = -(bz - az) / l, nz = (bx - ax) / l;
    for (const axis of ['x', 'z']) {
      const a0 = axis === 'x' ? ax : az, a1 = axis === 'x' ? bx : bz;
      for (let k = Math.ceil(Math.min(a0, a1) / 100); k * 100 <= Math.max(a0, a1); k++) {
        const t = (k * 100 - a0) / (a1 - a0); if (!(t >= 0 && t < 1)) continue;
        const mx = ax + (bx - ax) * t, mz = az + (bz - az) * t;
        if (named.some(b => Math.hypot(b[1] - mx, b[2] - mz) < 60) || ringNearest(mx, mz)?.d < 25) continue;
        // 道路は axis = k*100 の線 (x の線なら南北の道、z の線なら東西の道)
        const dx = axis === 'x' ? 0 : 1, dz = axis === 'x' ? 1 : 0, c = Math.max(0.35, Math.abs(dx * nx + dz * nz)), half = (r.w + 9) / c;
        const major = ((k % 4) + 4) % 4 === 0;
        archBridge(mx - dx * half, mz - dz * half, mx + dx * half, mz + dz * half, major ? 20 : 10, 0.8, r.autoBridges);
      }
    }
  }
}
for (const [name, ax, az, bx, bz, W, rise] of GEO_BRIDGES.arch) { archBridge(ax, az, bx, bz, W, rise, name); BRIDGE_LIST.push([name, (ax + bx) / 2, (az + bz) / 2]); }
for (const [name, x, z] of BRIDGE_LIST) LM_LABELS.push([name, x, z - 14, '🌉']);
// ---- 勝どき橋: 中央の跳開部が少し高い (水上バスが下をくぐる)
{
  const Z0 = -1206, Z1 = -1182;
  for (let x = 330; x < 430; x += 2) {
    const ya = Math.max(0.1, KACHI_Y(x)), yb = Math.max(0.1, KACHI_Y(x + 2)), yy = Math.max(0.1, KACHI_Y(x + 1));
    pushSlope('ASPH', 'CONC', [x, -1194], [x + 2, -1194], 12, ya, yb, 1.4); solid(x, Z0, x + 2, Z1, yy - 1.4, yy);
    for (const z of [Z0 + 0.2, Z1 - 0.2]) { pushSlope('RAIL', 'RAIL', [x, z], [x + 2, z], 0.2, ya + 1.1, yb + 1.1, 1.1); solid(x, z - 0.2, x + 2, z + 0.2, yy, yy + 1.1); }
  }
  pushPrism('BRONZE', null, rectPoly(379.9, Z0 + 0.5, 380.1, Z1 - 0.5), KACHI_Y(380), KACHI_Y(380) + 0.05, { solid: false });   // 跳開部の継ぎ目
}
