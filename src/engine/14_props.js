/* ============================================================
   街の小物 (インスタンシング): 看板 / 日よけ / 電柱と電線 / 自販機 / 提灯 / ベンチ / 信号機
   ============================================================ */
{
  const d = new THREE.Object3D();
  const inst = (geo, mat, list, setup) => { if (!list.length) return null; const m = new THREE.InstancedMesh(geo, mat, list.length); list.forEach((it, i) => { d.position.set(0, 0, 0); d.rotation.set(0, 0, 0); d.scale.set(1, 1, 1); setup(it, i, m); d.updateMatrix(); m.setMatrixAt(i, d.matrix); }); scene.add(m); return m; };
  // 縦看板 (5種類のデザイン。夜は光る)
  for (let v = 0; v < 5; v++) {
    const t = tex(8, 32, x => {
      const bgs = ['#c0302a', '#2a5ab0', '#f0f0e8', '#e0b020', '#2a8a4a'];
      x.fillStyle = bgs[v]; x.fillRect(0, 0, 8, 32); x.fillStyle = v === 2 || v === 3 ? '#202020' : '#fff8e0';
      for (let k = 0; k < 5; k++) for (let n = 0; n < 6; n++) if (rnd() < 0.55) x.fillRect(2 + (n % 2) * 2, 2 + k * 6 + (n >> 1) * 2 - 1, 2, 1);
    });
    const m = lam({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0 }); GLOW.push([m, 0.9]);
    inst(new THREE.BoxGeometry(0.3, 1, 1.1), m, SIGNS.filter(s => s.v === v), it => { d.position.set(it.x, it.y, it.z); d.rotation.y = it.rot; d.scale.set(1, it.h, 1); });
  }
  const aw = inst(new THREE.BoxGeometry(1, 0.15, 1.1), lam({ color: 0xffffff }), AWNINGS, (it, i, m) => { d.position.set(it.x, 3.2, it.z); d.rotation.y = it.rot; d.scale.set(it.w, 1, 1); m.setColorAt(i, new THREE.Color(it.c)); });
  // 電柱・電線
  const pm = lam({ color: 0x9a968e });
  inst(new THREE.CylinderGeometry(0.13, 0.17, 9, 5).translate(0, 4.5, 0), pm, POLES, it => d.position.set(it[0], 0, it[1]));
  inst(new THREE.BoxGeometry(1.8, 0.12, 0.12).translate(0, 8.2, 0), pm, POLES, it => { d.position.set(it[0], 0, it[1]); d.rotation.y = it[2]; });
  inst(new THREE.CylinderGeometry(0.35, 0.35, 1, 6).translate(0.45, 7, 0), lam({ color: 0x7a7a74 }), POLES.filter((_, i) => i % 3 === 0), it => { d.position.set(it[0], 0, it[1]); d.rotation.y = it[2]; });
  const wp = [];
  for (const [a, b] of WIRES) for (const off of [-0.75, 0, 0.75]) {
    const ox = Math.cos(a[2]) * off, oz = -Math.sin(a[2]) * off, y = off === 0 ? 8.9 : 8.25;
    const mx = (a[0] + b[0]) / 2 + ox, mz = (a[1] + b[1]) / 2 + oz, my = y - 0.45;
    wp.push(a[0] + ox, y, a[1] + oz, mx, my, mz, mx, my, mz, b[0] + ox, y, b[1] + oz);
  }
  for (let i = 0; i < LANTERNS.length - 1; i++) { const a = LANTERNS[i], b = LANTERNS[i + 1]; if (Math.abs(a[1] - b[1]) < 0.1 && Math.abs(a[0] - b[0]) < 6) wp.push(a[0], 4.6, a[1], b[0], 4.6, b[1]); }
  const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(wp, 3));
  scene.add(new THREE.LineSegments(wg, new THREE.LineBasicMaterial({ color: 0x202024 })));
  // 自販機
  const vt = tex(8, 16, x => { x.fillStyle = '#f4f4f0'; x.fillRect(0, 0, 8, 16); x.fillStyle = '#9ac8e8'; x.fillRect(1, 1, 6, 6); x.fillStyle = '#d04030'; for (let i = 0; i < 6; i++) x.fillRect(1 + i, 2 + (i % 3) * 2, 1, 1); x.fillStyle = '#333'; x.fillRect(2, 11, 4, 2); });
  const vm = lam({ map: vt, emissive: 0xffffff, emissiveMap: vt, emissiveIntensity: 0 }); GLOW.push([vm, 0.8]);
  const vg = new THREE.BoxGeometry(1, 1.85, 0.75).translate(0, 0.925, 0);
  inst(vg, vm, VENDS, (it, i, m) => { d.position.set(it[0], 0, it[1]); d.rotation.y = it[2]; m.setColorAt(i, new THREE.Color(pick([0xffffff, 0xff8080, 0x80a0ff]))); solid(it[0] - 0.6, it[1] - 0.6, it[0] + 0.6, it[1] + 0.6, 0, 1.85); });
  // 提灯
  inst(new THREE.BoxGeometry(0.42, 0.6, 0.42), glow(lam({ color: 0xe04030 }), 0xff5030, 1.2), LANTERNS, it => d.position.set(it[0], 4.2, it[1]));
  // イタリア街・銀座の街灯
  inst(new THREE.CylinderGeometry(0.09, 0.12, 4.2, 5).translate(0, 2.1, 0), lam({ color: 0x1c1c20 }), LAMPS2, it => d.position.set(it[0], 0, it[1]));
  inst(new THREE.BoxGeometry(0.5, 0.6, 0.5).translate(0, 4.4, 0), glow(lam({ color: 0xfff0c0 }), 0xffe0a0, 1.5), LAMPS2, it => d.position.set(it[0], 0, it[1]));
  // ベンチ
  inst(new THREE.BoxGeometry(1.8, 0.45, 0.55).translate(0, 0.45, 0), lam({ color: 0x8a6a48 }), BENCHES, it => { d.position.set(it[0], 0, it[1]); d.rotation.y = it[2]; });
  // 信号機 (交差点の四隅)
  const SIG = [];
  for (const a of ROADS.filter(r => r[4] === 'ns')) for (const b of ROADS.filter(r => r[4] === 'ew')) {
    const o = clip(a, b); if (!o) continue;
    SIG.push([o[0] - 1.6, o[1] - 1.6, 0], [o[2] + 1.6, o[3] + 1.6, Math.PI], [o[2] + 1.6, o[1] - 1.6, -Math.PI / 2], [o[0] - 1.6, o[3] + 1.6, Math.PI / 2]);
  }
  const sigOk = SIG.filter(([x, z]) => WALK.some(r => inR(r, x, z)) && !inR(JR, x, z, 1));
  const st = tex(16, 4, x => { x.fillStyle = '#2a2a2e'; x.fillRect(0, 0, 16, 4); for (const [i, c] of [[1, '#30e0a0'], [6, '#403a20'], [11, '#401a1a']]) { x.fillStyle = c; x.fillRect(i, 1, 3, 2); } });
  const sm = lam({ map: st, emissive: 0xffffff, emissiveMap: st, emissiveIntensity: 0.7 });
  inst(new THREE.CylinderGeometry(0.1, 0.12, 5.6, 5).translate(0, 2.8, 0), pm, sigOk, it => d.position.set(it[0], 0, it[1]));
  inst(new THREE.BoxGeometry(0.1, 0.1, 3.6).translate(0, 5.3, 1.8), pm, sigOk, it => { d.position.set(it[0], 0, it[1]); d.rotation.y = it[2]; });
  inst(new THREE.BoxGeometry(1.3, 0.42, 0.32).translate(0, 5.1, 3.4), sm, sigOk, it => { d.position.set(it[0], 0, it[1]); d.rotation.y = it[2] + 0; });
  for (const [x, z] of sigOk) solid(x - 0.2, z - 0.2, x + 0.2, z + 0.2, 0, 5.6, true);
  // 郵便ポスト (交差点の角のいくつかに)
  const posts = sigOk.filter((_, i) => i % 6 === 2).map(([x, z, r]) => [x + Math.cos(r) * 1.8, z - Math.sin(r) * 1.8]).filter(([x, z]) => free(x, z, 0.4));
  inst(new THREE.CylinderGeometry(0.28, 0.28, 1.1, 8).translate(0, 0.55, 0), lam({ color: 0xd0201a }), posts, it => d.position.set(it[0], 0, it[1]));
  inst(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 8).translate(0, 1.16, 0), lam({ color: 0xd0201a }), posts, it => d.position.set(it[0], 0, it[1]));
  for (const [x, z] of posts) solid(x - 0.3, z - 0.3, x + 0.3, z + 0.3, 0, 1.2, true);
  // 道路の案内標識 (青看板)。方角と距離は実際の位置から自動計算
  const DEST = [['東京タワー', ...TOWER], ['新橋', -560, -930], ['銀座', -128, -1195], ['竹芝', 100, 20], ['浜松町', -450, 80], ['虎ノ門', -1566, -900], ['築地', 200, -900], ['増上寺', -1300, -60], ['愛宕山', ATAGO.x, ATAGO.z], ['汐留', -300, -650]];
  const ARW = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const guide = (x, z) => {
    const ds = DEST.map(([n, X, Z]) => [n, Math.hypot(X - x, Z - z), ARW[(Math.round(Math.atan2(X - x, -(Z - z)) / (Math.PI / 4)) + 8) % 8]]).filter(q => q[1] > 180).sort((a, b) => a[1] - b[1]).slice(0, 3);
    const t = tex(128, 64, c => {
      c.fillStyle = '#1c4ea8'; c.fillRect(0, 0, 128, 64); c.strokeStyle = '#fff'; c.lineWidth = 2; c.strokeRect(2, 2, 124, 60);
      c.fillStyle = '#fff'; c.font = '14px "DotGothic16", sans-serif'; c.textBaseline = 'middle';
      ds.forEach(([n, dd, a], i) => { c.textAlign = 'left'; c.fillText(`${a} ${n}`, 8, 14 + i * 18); c.textAlign = 'right'; c.fillText(`${(dd / 1000).toFixed(1)}km`, 120, 14 + i * 18); });
    });
    const sm = glow(lam({ map: t }), 0xffffff, 0.35);
    const bd = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.1, 0.12), [pm, pm, pm, pm, sm, pm]); bd.position.set(x, 5.6, z - 0.2); scene.add(bd);
    blk(x - 0.1, 0, z - 0.1, x + 0.1, 5, z + 0.1, pm, false);
  };
  for (const [x, z] of [[-689, -40], [-1104, -144], [-1104, -764], [-689, -764], [-689, 152], [-286, -980], [-113, -804], [102, -980], [-1103, 52], [-5, -50], [-249, 152]]) guide(x, z);
}

