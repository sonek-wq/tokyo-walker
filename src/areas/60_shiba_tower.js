/* ============================================================
   拡張エリアの構造物: 芝大門 / 増上寺 / 東京タワー
   ============================================================ */
{ // 芝大門 (道路をまたぐ門)
  const gm = lam({ color: 0x5a524a }), gr = lam({ color: 0x2f3a36 });
  blk(-864, 0, -79, -856, 9, -73, gm); blk(-864, 0, -47, -856, 9, -41, gm);
  blk(-866, 9, -81, -854, 12, -39, gm); blk(-868, 12, -83, -852, 13.5, -37, gr);
  fr(-868, -83, -852, -37, '#4a3a34');
}
{ // 増上寺: 三解脱門 と 大殿
  const red = lam({ color: 0xb8321e }), roofD = lam({ color: 0x3c3a3a }), wood = lam({ color: 0x8a2a1e }), stone = lam({ color: 0xa8a090 });
  const z = ZOJO_Z, gx0 = -1158, gx1 = -1140;
  blk(gx0, 0, z - 15, gx1, 9, z - 4, red); blk(gx0, 0, z + 4, gx1, 9, z + 15, red); // 中央は通り抜けられる
  blk(gx0, 6, z - 4, gx1, 9, z + 4, red);
  blk(gx0 - 4, 9, z - 19, gx1 + 4, 11, z + 19, roofD);
  blk(gx0 + 2, 11, z - 13, gx1 - 2, 17, z + 13, red);
  const r1 = new THREE.Mesh(new THREE.ConeGeometry(21 / Math.SQRT1_2, 6, 4), roofD);
  r1.position.set((gx0 + gx1) / 2, 20, z); r1.rotation.y = Math.PI / 4; r1.scale.x = 0.62; scene.add(r1);
  solid(gx0 - 1, z - 14, gx1 + 1, z + 14, 17, 20);
  // 大殿
  const hx = -1300;
  blk(hx - 30, 0, z - 35, hx + 30, 1.2, z + 35, stone);
  blk(hx - 26, 1.2, z - 31, hx + 26, 14, z + 31, wood);
  const r2 = new THREE.Mesh(new THREE.ConeGeometry(42 / Math.SQRT1_2, 16, 4), roofD);
  r2.position.set(hx, 22, z); r2.rotation.y = Math.PI / 4; r2.scale.x = 0.85; scene.add(r2);
  solid(hx - 28, z - 33, hx + 28, z + 33, 14, 20); solid(hx - 12, z - 15, hx + 12, z + 15, 20, 26);
  blk(hx + 30, 0, z - 10, hx + 36, 0.6, z + 10, stone);
  fr(gx0 - 4, z - 19, gx1 + 4, z + 19, '#8a2a1e'); fr(hx - 30, z - 35, hx + 30, z + 35, '#6a2a20');
  // 灯籠
  for (let x = -1280; x < -1170; x += 22) for (const dz of [-9, 9]) blk(x - 0.6, 0, z + dz - 0.6, x + 0.6, 2.2, z + dz + 0.6, stone);
}
const TOWER_MATS = [];
{ // 東京タワー (フットタウン + 鉄骨 + 大展望台 + トップデッキ + アンテナ) すべて登れる
  const [TX, TZ] = TOWER;
  const lattice = tex(16, 64, x => {
    x.clearRect(0, 0, 16, 64);
    for (let b = 0; b < 4; b++) {
      const c = b % 2 ? '#f4f0e8' : '#e05a30', y0 = b * 16;
      x.fillStyle = c; x.strokeStyle = c;
      x.fillRect(0, y0, 16, 2); x.fillRect(0, y0, 2, 16);
      x.lineWidth = 1.6; x.beginPath(); x.moveTo(0, y0); x.lineTo(16, y0 + 16); x.moveTo(16, y0); x.lineTo(0, y0 + 16); x.stroke();
    }
  });
  const section = (y0, y1, h0, h1, ru, rv) => {
    const t = lattice.clone(); t.repeat.set(4 * ru, rv); t.needsUpdate = true; TEXTURES.push(t);
    const m = farHaze(ps1(new THREE.MeshLambertMaterial({ map: t, alphaTest: 0.5, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0 })), 3.6, 0.8);
    TOWER_MATS.push(m);
    GLOW.push([m, 0.95]);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(h1 / Math.SQRT1_2, h0 / Math.SQRT1_2, y1 - y0, 4, 1, true), m);
    mesh.position.set(TX, (y0 + y1) / 2, TZ); mesh.rotation.y = Math.PI / 4; scene.add(mesh);
    for (let y = y0; y < y1; y += 10) { const yt = Math.min(y + 10, y1), hw = h0 + (h1 - h0) * ((y + yt) / 2 - y0) / (y1 - y0); solid(TX - hw, TZ - hw, TX + hw, TZ + hw, y, yt); }
  };
  section(0, 60, 40, 22, 3, 1); section(60, 145, 22, 10, 2, 1.5); section(159, 248, 8, 4.5, 1, 1.5);
  const deckM = glow(farLam(0xdfe3e8), 0xffe6b0, 0.9);
  const deck = (y0, y1, hw) => { box(hw * 2, y1 - y0, hw * 2, deckM, TX, (y0 + y1) / 2, TZ); solid(TX - hw, TZ - hw, TX + hw, TZ + hw, y0, y1); };
  deck(145, 159, 15); deck(248, 256, 6);
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.6, 77, 6), glow(farLam(0xe05a30), 0xff7040, 0.8));
  ant.position.set(TX, 294.5, TZ); scene.add(ant); solid(TX - 1.6, TZ - 1.6, TX + 1.6, TZ + 1.6, 256, 333);
}

