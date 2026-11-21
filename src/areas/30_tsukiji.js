/* ============================================================
   築地: 本願寺 / 場外市場 / 波除神社 / 市場跡地 / 勝どき橋
   ============================================================ */
const TSUKIJI_MKT = [104, -984, 286, -824], MKT_SIGNS = [], FOAM = [], TARE_PATHS = [];
const T_RES = [...N_RES];
planks(60, -1300, 80, -500, '#8a8478', '#7a7468', false);                     // 築地川の河岸 (東側)
{ // 築地本願寺 (伊東忠太設計、インド風の外観)
  const st = lam({ color: 0xd8ccb0 }), dk = lam({ color: 0x5a5048 }), gd = glow(lam({ color: 0xc8a040 }), 0xffd060, 0.5);
  tiles(104, -1216, 200, -1204, '#c8bca4', '#b4a890', 2);
  blk(116, 0, -1270, 194, 1.6, -1216, st);
  stairs([132, -1216, 178, -1209], 1.6, 'z-');
  blk(122, 1.6, -1264, 188, 15, -1222, st);
  for (let x = 128; x < 186; x += 6) box(1.2, 8, 0.4, dk, x, 7.5, -1221.8);                // 柱と窓の陰影
  const dome = new THREE.Mesh(new THREE.SphereGeometry(11, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), st); dome.position.set(155, 15, -1243); scene.add(dome);
  const fin = new THREE.Mesh(new THREE.ConeGeometry(1, 4, 8), gd); fin.position.set(155, 28, -1243); scene.add(fin);
  solid(147, -1251, 163, -1235, 15, 24); solid(150, -1248, 160, -1238, 24, 26);
  for (const x of [124, 186]) {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.4, 20, 10), st); t.position.set(x, 10, -1224); scene.add(t);
    const d2 = new THREE.Mesh(new THREE.SphereGeometry(3.4, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), st); d2.position.set(x, 20, -1224); scene.add(d2);
    solid(x - 3, -1227, x + 3, -1221, 0, 23);
  }
  fr(116, -1270, 194, -1216, '#cdbf9e');
  SPOT_AREAS.push(['築地本願寺', 104, -1276, 200, -1204]);
  for (let k = 0; k < 6; k++) ROUND.push([108 + k * 18, -1274, 1.1]);
}
residential([204, -1296, 326, -1204], T_RES, '築地七丁目', '築地児童遊園');
mixed([104, -1184, 326, -1004], T_RES); DIST_AREAS.push(['築地四丁目', 104, -1184, 326, -1004]);
function market(Rc, res, name) { // 場外市場: 低い店舗がひしめく路地
  const xs = [Rc[0]], zs = [Rc[1]];
  while (xs[xs.length - 1] + 34 < Rc[2]) xs.push(xs[xs.length - 1] + rr(24, 30)); xs.push(Rc[2]);
  while (zs[zs.length - 1] + 26 < Rc[3]) zs.push(zs[zs.length - 1] + rr(17, 22)); zs.push(Rc[3]);
  fr(...Rc, '#6a6258');
  for (let j = 1; j < zs.length - 1; j++) TARE_PATHS.push([Rc[0] + 2, zs[j], Rc[2] - 2, zs[j]]);
  for (let i = 1; i < xs.length - 1; i++) TARE_PATHS.push([xs[i], Rc[1] + 2, xs[i], Rc[3] - 2]);
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < zs.length - 1; j++) {
    const c = [xs[i] + (i ? 1.6 : 0.5), zs[j] + (j ? 1.6 : 0.5), xs[i + 1] - (i < xs.length - 2 ? 1.6 : 0.5), zs[j + 1] - (j < zs.length - 2 ? 1.6 : 0.5)];
    const zm = (c[1] + c[3]) / 2;
    for (const [z0, z1, face] of [[c[1], zm - 0.2, 'n'], [zm + 0.2, c[3], 's']]) {
      for (let x = c[0]; x < c[2] - 3;) {
        const w = Math.min(rr(3.5, 6), c[2] - x), f = [x, z0, x + w - 0.2, z1];
        if (okLot(f, res)) {
          addBuilding(...f, rr(4, 7.5), pick(SHOPS), { noRoofBox: true });
          AWNINGS.push({ x: x + w / 2, z: face === 'n' ? z0 - 0.55 : z1 + 0.55, w: w - 0.6, rot: 0, c: pick([0x2a6ab0, 0xf0f0ec, 0x1f4f90, 0xc0392b]) });
          MKT_SIGNS.push({ x: x + w / 2, z: face === 'n' ? z0 - 0.08 : z1 + 0.08, v: Math.floor(rnd() * 8) });
          const fz = face === 'n' ? z0 - 0.9 : z1 + 0.9; for (let k = 0; k < 2; k++) if (rnd() < 0.7) FOAM.push([x + 0.8 + k * 1.2, fz, rnd() < 0.3 ? 1 : 0]);
        }
        x += w;
      }
    }
  }
  SPOT_AREAS.push([name, ...Rc]);
}
market(TSUKIJI_MKT, T_RES, '築地場外市場');
{ // 店の看板 (8種類)
  const words = ['まぐろ', '玉子焼', '乾物', '包丁', '海苔', '寿司', '珈琲', '漬物'];
  words.forEach((w, v) => {
    const t = textTex(w, pick(['#f4f0e4', '#1c2a4a', '#8a1a1a']), '#ffffff', 64, 24);
    const list = MKT_SIGNS.filter(sg => sg.v === v); if (!list.length) return;
    const m = new THREE.InstancedMesh(new THREE.BoxGeometry(2, 0.7, 0.12), glow(lam({ map: t }), 0xffffff, 0.5), list.length), d = new THREE.Object3D();
    list.forEach((sg, i) => { d.position.set(sg.x, 3.9, sg.z); d.updateMatrix(); m.setMatrixAt(i, d.matrix); }); scene.add(m);
  });
  const fm = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.5, 0.65), lam({ color: 0xf4f6f8 }), FOAM.length), d = new THREE.Object3D(); // 発泡スチロールの箱
  FOAM.forEach(([x, z, k], i) => { d.position.set(x, 0.25 + k * 0.5, z); d.rotation.y = rr(-0.2, 0.2); d.updateMatrix(); fm.setMatrixAt(i, d.matrix); }); scene.add(fm);
}
{ // 波除神社 と 巨大獅子頭
  const S = [290, -884, 326, -826];
  shrine(S, '波除神社', 1);
  const shishi = (x, z, col, teeth) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
    const cm = lam({ color: col }), gd = lam({ color: 0xd8b040 }), bk = lam({ color: 0x1a1a1a });
    blk(x - 2, 0, z - 2, x + 2, 1, z + 2, lam({ color: 0x6a5a4a }));
    box(3.4, 2.6, 3, cm, 0, 2.3, 0, g); box(3.6, 0.8, 1.2, cm, 0, 3.8, -0.4, g);
    for (const sd of [-0.85, 0.85]) { box(0.8, 0.8, 0.2, gd, sd, 2.9, 1.55, g); box(0.4, 0.4, 0.22, bk, sd, 2.9, 1.6, g); }
    box(2.4, 0.5, 0.2, teeth, 0, 1.6, 1.55, g); box(1.2, 0.8, 0.3, cm, 0, 2.2, 1.6, g);
    solid(x - 1.7, z - 1.5, x + 1.7, z + 1.5, 1, 4.2);
  };
  shishi(296, -846, 0xc8281e, lam({ color: 0xf4f0e0 }));   // 天井大獅子
  shishi(320, -846, 0x2a2a2e, lam({ color: 0x1a1a1a }));   // お歯黒獅子
}
{ // 築地市場跡地 (豊洲への移転後の広大な空き地)
  const F = [106, -800, 326, -504], fence = lam({ color: 0xe8e8e4 });
  fr(...F, '#9a9284');
  for (let k = 0; k < 30; k++) { const x = rr(F[0] + 10, F[2] - 30), z = rr(F[1] + 10, F[3] - 10); fr(x, z, x + rr(8, 30), z + 0.8, '#867e70'); }
  const wall = (x0, z0, x1, z1) => blk(x0, 0, z0, x1, 2.6, z1, fence);
  wall(F[0], F[1], 200, F[1] + 0.3); wall(214, F[1], F[2], F[1] + 0.3);                 // 北側にゲート
  wall(F[0], F[3] - 0.3, F[2], F[3]); wall(F[0], F[1], F[0] + 0.3, F[3]); wall(F[2] - 0.3, F[1], F[2], F[3]);
  const sg = new THREE.Mesh(new THREE.BoxGeometry(14, 1.6, 0.1), lam({ map: textTex('築地市場跡地 再開発事業区域', '#1c3a6a', '#ffffff', 256, 28) }));
  sg.position.set(160, 1.6, F[1] - 0.12); scene.add(sg);
  const yel = lam({ color: 0xe0b020 }), dk2 = lam({ color: 0x2a2a2e });
  for (const [x, z, r] of [[180, -700, 0.4], [260, -620, -0.8], [150, -560, 2.2]]) { // ショベルカー
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = r; scene.add(g);
    box(3, 0.8, 4, dk2, 0, 0.4, 0, g); box(2.6, 1.8, 2.6, yel, 0, 1.7, 0, g);
    const arm = box(0.5, 0.5, 5, yel, 0, 3, 3, g); arm.rotation.x = -0.5;
    solid(x - 2, z - 2, x + 2, z + 2, 0, 2.6);
  }
  for (let x = 120; x < 190; x += 5) PARKED.push([x, -520, Math.PI / 2]);
  SPOT_AREAS.push(['築地市場跡地', ...F]);
}
// 勝どき橋の路面の高さ: 中央の跳開部がゆるやかに高い (水上バスが下をくぐれる)
const KACHI_Y = x => x > 330 && x < 430 ? 3.2 * Math.sin(Math.PI * (x - 330) / 100) : 0;
{ // 勝どき橋 (1940年完成の跳開橋。いまは開かない)
  const gm = lam({ color: 0xb8c4bc }), Z0 = -1206, Z1 = -1182;
  fr(330, -1200, 430, -1188, '#3c3c42'); for (let x = 330; x < 430; x += 6) fr(x, -1194.15, x + 3, -1193.85, '#e8e6dc');
  const AM = [], o = new THREE.Object3D();
  const archSeg = (xa, xb, top) => {
    for (const z of [Z0 + 0.5, Z1 - 0.5]) {
      const n = 12;
      for (let k = 0; k < n; k++) {
        const t0 = k / n, t1 = (k + 1) / n, xa0 = xa + (xb - xa) * t0, xa1 = xa + (xb - xa) * t1, y0 = 1.2 + KACHI_Y(xa0) + top * Math.sin(Math.PI * t0), y1 = 1.2 + KACHI_Y(xa1) + top * Math.sin(Math.PI * t1);
        const a = new THREE.Vector3(xa0, y0, z), b = new THREE.Vector3(xa1, y1, z);
        o.position.copy(a).add(b).multiplyScalar(0.5); o.scale.set(0.6, 0.6, a.distanceTo(b)); o.lookAt(b); o.updateMatrix(); AM.push(o.matrix.clone());
        if (k % 2 === 0 && y0 > 1.4 + KACHI_Y(xa0)) { const yb = 1.2 + KACHI_Y(xa0); o.position.set(a.x, (y0 + yb) / 2, z); o.rotation.set(0, 0, 0); o.scale.set(0.3, y0 - yb, 0.3); o.updateMatrix(); AM.push(o.matrix.clone()); }
      }
    }
  };
  archSeg(330, 364, 9); archSeg(396, 430, 9);
  const am = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), gm, AM.length); AM.forEach((m, i) => am.setMatrixAt(i, m)); scene.add(am);
  for (const x of [364, 396]) { const yb = KACHI_Y(x) - 1.4; blk(x - 2, yb, Z0 - 3, x + 2, 9 + KACHI_Y(x), Z0, gm); blk(x - 2, yb, Z1, x + 2, 9 + KACHI_Y(x), Z1 + 3, gm); } // 跳開部の運転室
  SPOT_AREAS.unshift(['勝どき橋 (跳開部の真ん中)', 374, Z0, 386, Z1]);
  SPOT_AREAS.push(['勝どき橋', 330, Z0, 430, Z1]);
}

