/* ============================================================
   JR 山手線・京浜東北線の高架 (道路はガード下をくぐる / 上に登れる)
   ============================================================ */
{
  const JRH = 6, W = JR[2] - JR[0], X = (JR[0] + JR[2]) / 2;
  const railTex = tex(16, 16, x => {
    x.fillStyle = '#5b5249'; x.fillRect(0, 0, 16, 16);
    x.fillStyle = '#6e655a'; for (let j = 0; j < 16; j += 2) x.fillRect(3, j, 10, 1);
    x.fillStyle = '#c8c8c8'; x.fillRect(5, 0, 1, 16); x.fillRect(10, 0, 1, 16);
  });
  const sideTex = tex(16, 16, x => { x.fillStyle = '#8a857c'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#6e6a62'; for (let i = 0; i < 16; i += 8) x.fillRect(i, 0, 1, 16); x.fillRect(0, 14, 16, 2); });
  const side = lam({ map: sideTex }), top = lam({ map: railTex }), fence = lam({ color: 0x4f6a52 });
  const brick = lam({ map: brickTex });
  const mats = [side, side, top, side, side, side], bmats = [brick, brick, top, brick, brick, brick];
  const seg = (z0, z1, y0) => {
    const m = new THREE.Mesh(boxGeo(W, JRH - y0, z1 - z0, 11, 11), (z0 + z1) / 2 < -650 ? bmats : mats); // 新橋付近は明治の赤レンガ高架
    m.position.set(X, (y0 + JRH) / 2, (z0 + z1) / 2); scene.add(m);
    solid(JR[0], z0, JR[2], z1, y0, JRH);
    for (const fx of [JR[0] + 0.15, JR[2] - 0.15]) box(0.2, 1.3, z1 - z0, fence, fx, JRH + 0.65, (z0 + z1) / 2);
  };
  let z = JR[1];
  for (const [a, b] of [...JR_CROSS, GADO].sort((p, q) => p[0] - q[0])) { seg(z, a, 0); seg(a, b, 4.6); z = b; } // 4.6m 上の鉄橋 = ガード
  seg(z, JR[3], 0);
}
