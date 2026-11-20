/* ============================================================
   遠景 (レインボーブリッジ / お台場 / 晴海 / 麻布台・虎ノ門・六本木)
   ============================================================ */
{
  const RB = glow(farLam(0xeeeeea), 0xfff0d8, 0.55);
  box(1300, 4, 30, RB, 750, 48, 950);
  for (const tx of [500, 1000]) { for (const dz of [-14, 14]) box(6, 126, 6, RB, tx, 63, 950 + dz); box(6, 5, 34, RB, tx, 120, 950); box(6, 4, 34, RB, tx, 40, 950); }
  const cp = [];
  for (const dz of [-13, 13]) {
    const f = x => x < 500 ? 52 + 74 * ((x - 100) / 400) ** 2 : x > 1000 ? 52 + 74 * ((1400 - x) / 400) ** 2 : 52 + 74 * ((x - 750) / 250) ** 2;
    for (let x = 100; x < 1400; x += 25) cp.push(x, f(x), 950 + dz, x + 25, f(x + 25), 950 + dz);
  }
  const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3));
  scene.add(new THREE.LineSegments(cg, farHaze(new THREE.LineBasicMaterial({ color: 0xf4f4f0 }))));
  const haze = [0xc8ccd0, 0xb8c0c8, 0xd8d4cc, 0xa8b4bc];
  const farB = (w, h, d, x, z, c = pick(haze)) => box(w, h, d, glow(farLam(c), 0x8a8070, 0.3), x, h / 2, z);
  for (let i = 0; i < 26; i++) farB(rr(30, 70), rr(20, 130), rr(30, 70), rr(550, 1350), rr(1060, 1350));
  farB(70, 80, 40, 900, 1120, 0xd0d4d8);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(16, 8, 6), farLam(0xc8ccd4)); ball.position.set(900, 66, 1100); scene.add(ball);
  for (let i = 0; i < 24; i++) farB(rr(30, 50), rr(40, 190), rr(30, 50), rr(450, 1100), rr(-1100, -550));
  // 実座標の超高層 (マップ外)
  for (const [lat, lon, h, w] of []) { // (実座標の遠景ビルは、山手線の自動生成の街に置き換え)
    const [x, z] = geo(lat, lon); farB(w, h, w, x, z, 0x9aa4b0);
  }
}
buildMerged();

