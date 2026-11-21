/* 日本科学未来館 (青海。先端科学のミュージアム。吹き抜けに浮かぶ地球ディスプレイ「ジオ・コスモス」)
   ゆりかもめ (x ≒ 900) の西、潮風公園の東。ガラス張りの建物の中で、光る地球がゆっくり回る */
REGION({
  name: '日本科学未来館',
  towns: [],
  labels: [],
  build(r) {
    const B = [776, 1462, 874, 1514], cx = (B[0] + B[2]) / 2, cz = (B[1] + B[3]) / 2;
    LM_ZONES.push(rectPoly(B[0] - 10, B[1] - 12, B[2] + 8, B[3] + 40)); fr(B[0] - 10, B[1] - 12, B[2] + 8, B[3] + 40, '#b8b4aa');
    tiles(B[0] - 10, B[3], B[2] + 8, B[3] + 40, '#d4d0c6', '#c4c0b6', 3);
    // ガラスの箱 (中が見えるよう半透明) と床・柱
    const gl = new THREE.MeshLambertMaterial({ color: 0x8cb8d0, transparent: true, opacity: 0.5, depthWrite: false });
    const H = 40;
    for (const [w, d, x, z] of [[B[2] - B[0], 0.3, cx, B[1]], [B[2] - B[0], 0.3, cx, B[3]], [0.3, B[3] - B[1], B[0], cz], [0.3, B[3] - B[1], B[2], cz]]) mesh(new THREE.BoxGeometry(w, H, d), gl, x, H / 2, z);
    for (const [x0, z0, x1, z1] of [[B[0], B[1], B[2], B[1] + 0.4], [B[0], B[3] - 0.4, cx - 4, B[3]], [cx + 4, B[3] - 0.4, B[2], B[3]], [B[0], B[1], B[0] + 0.4, B[3]], [B[2] - 0.4, B[1], B[2], B[3]]]) solid(x0, z0, x1, z1, 0, H);
    for (let y = 8; y < H; y += 8) for (const [x0, x1] of [[B[0], cx - 14], [cx + 14, B[2]]]) pushPrism('CONC', 'CONC', rectPoly(x0 + 0.5, B[1] + 0.5, x1, B[3] - 0.5), y - 0.6, y, { bottom: true, solid: false });   // 吹き抜けの左右の床
    for (let x = B[0]; x <= B[2]; x += 14) for (const z of [B[1], B[3]]) pushPrism('CONC', null, rectPoly(x - 0.4, z - 0.4, x + 0.4, z + 0.4), 0, H, { solid: false });
    pushPrism('CONC', 'ROOF', rectPoly(B[0] - 1, B[1] - 1, B[2] + 1, B[3] + 1), H, H + 1.2);
    // ジオ・コスモス (直径約6mの地球) が吹き抜けに浮かぶ
    const earth = tex(128, 64, g => {
      g.fillStyle = '#1e5a9a'; g.fillRect(0, 0, 128, 64);
      g.fillStyle = '#4a8a3c'; for (const [x, y, w, h] of [[14, 14, 22, 18], [28, 32, 10, 22], [56, 12, 20, 14], [60, 26, 14, 22], [80, 10, 34, 18], [100, 36, 12, 8], [40, 6, 8, 4]]) g.fillRect(x, y, w, h);
      g.fillStyle = '#c8b47a'; g.fillRect(62, 20, 10, 6); g.fillRect(86, 18, 12, 5);
      g.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 40; i++) g.fillRect(rnd() * 128 | 0, rnd() * 64 | 0, 6 + (rnd() * 10 | 0), 2);
      g.fillStyle = '#e8eef4'; g.fillRect(0, 0, 128, 3); g.fillRect(0, 61, 128, 3);
    });
    const em = new THREE.MeshBasicMaterial({ map: earth });
    const EG = mesh(new THREE.SphereGeometry(3, 20, 12), em, cx, 22, cz);
    LM_UPDATERS.push((dt) => { if (EG) EG.rotation.y += dt * 0.1; });
    LM_PEOPLE.push([[B[0] - 6, B[3] + 10, B[2] + 4, B[3] + 10], 10]);
    // 名所の名前・豆知識・役立ち情報
    SPOT_AREAS.unshift(['ジオ・コスモス (日本科学未来館)', cx - 10, cz - 10, cx + 10, cz + 10]);
    SPOT_AREAS.push(['日本科学未来館', B[0] - 10, B[1] - 12, B[2] + 8, B[3] + 40]);
    LM_LABELS.push(['日本科学未来館', cx, cz, '🌏']);
    Object.assign(LM_NOTES, {
      '日本科学未来館': 'ロボットや宇宙、地球環境など、いまの科学技術を体験できる国立のミュージアム',
      'ジオ・コスモス (日本科学未来館)': '直径約6mの地球ディスプレイ。人工衛星のデータから、毎日の雲のようすを映している',
    });
    Object.assign(LM_TIPS, { '日本科学未来館': '10:00〜17:00 (入館券の販売は閉館30分前まで)。火曜休館 (祝日なら開館)' });
    LM_ACH.push(['geocosmos', '🌏 地球を見下ろす', '日本科学未来館のジオ・コスモスを見に行く', () => inR([cx - 10, cz - 10, cx + 10, cz + 10], P.x, P.z)]);
  },
});
