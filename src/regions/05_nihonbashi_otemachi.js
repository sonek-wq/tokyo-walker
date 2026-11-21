/* 日本橋・兜町・大手町 (国と経済の中枢。東京駅の北と東)
   日本橋 (麒麟と獅子の石の二重アーチ橋・日本国道路元標・上を走る首都高) / 日本銀行本店本館 (上から見ると「円」の字) と貨幣博物館 /
   三井本館・日本橋三井タワー / 三越 (ライオン像) / 日本橋高島屋 / 魚河岸跡 (乙姫広場) / 東京証券取引所 (東証Arrows) と兜神社 /
   大手町 (将門塚・大手町の森・超高層ビル)
   日本橋川は regions/00_geography.js の川 (橋も自動)。ここでは日本橋 (中央通り) の向きにそろえた座標系 NB で作る: u = 北北東 (神田方面)、v = 東南東 (川下) */
REGION({
  name: '日本橋・大手町',
  towns: [['日本橋', 380, -1860], ['日本橋室町', 330, -2000], ['日本橋本石町', 250, -2060], ['兜町', 520, -1755], ['茅場町', 660, -1660], ['人形町', 600, -1960], ['小伝馬町', 480, -2120], ['大手町', -40, -2250]],
  labels: [],
  build(r) {
    const NB = frame(360, -1888, 0.428, -0.904, 0.904, 0.428), W = NB.w;
    const FT = tkyFrame(STN.find(s => s.name === '東京'));
    const vT = (x, z) => (x - FT.ox) * FT.vx + (z - FT.oz) * FT.vz, uT = (x, z) => (x - FT.ox) * FT.ux + (z - FT.oz) * FT.uz;
    const clip = (P, f) => { const o = []; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], fa = f(a), fb = f(b); if (fa >= 0) o.push(a); if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); o.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } } return o; };
    const yaesu = P => clip(P, p => -146 - vT(...p));   // 丸の内・八重洲 (東京駅のエリア) にはみ出さない
    const M = (key, bg, win, lit, cw = 2, cs = 3, rh = 3, rs = 4) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rs) for (let i = 1; i < 32; i += cs) { x.fillStyle = win; x.fillRect(i, j, cw, rh); y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, j, cw, rh); }
    });
    const BOJ = LM_MAT('NB_BOJ', (x, y) => {   // 日銀本館: 花崗岩とアーチ窓
      x.fillStyle = '#c9c3b6'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 3; j < 32; j += 11) for (let i = 2; i < 32; i += 5) { x.fillStyle = '#3e3c3a'; x.fillRect(i, j + 1, 2, 5); x.fillRect(i, j, 2, 1); y.fillStyle = rnd() < 0.4 ? '#ffe0a8' : '#000'; y.fillRect(i, j + 1, 2, 5); }
      x.fillStyle = '#b4ad9e'; x.fillRect(0, 31, 32, 1); x.fillRect(0, 9, 32, 1);
    });
    const MITSUI = LM_MAT('NB_MITSUI', (x, y) => {   // 三井本館: 列柱
      x.fillStyle = '#d8d0c0'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let i = 1; i < 32; i += 4) { x.fillStyle = '#ece6d8'; x.fillRect(i, 4, 2, 28); x.fillStyle = '#7e786c'; x.fillRect(i + 2, 6, 2, 24); y.fillStyle = rnd() < 0.5 ? '#ffd890' : '#000'; y.fillRect(i + 2, 6, 2, 24); }
    });
    const MITSUKOSHI = M('NB_MKS', '#e6dcc6', '#4e4a44', 0.6, 2, 4, 3, 5), TAKA = M('NB_TAKA', '#cdb99a', '#3e3830', 0.6, 2, 4, 3, 5), TOWER = M('NB_TWR', '#8e98a2', '#d4dde4', 0.6, 1, 2, 2, 3);
    const TSE = M('NB_TSE', '#b0a090', '#3a3634', 0.5, 1, 3, 2, 4), OFF1 = M('NB_OFF1', '#b8bcc0', '#3a4652', 0.55, 2, 3, 2, 3), OFF2 = TOWER;
    const OFF3 = OFF1, GRAN = 'TKSTONE', BR = WALL.BRONZE, SHU = lam({ color: 0xc4321c }), LAMP = glow(lam({ color: 0xfff4d8 }), 0xffe8b0, 0.9);
    const bx = (w, h, d, x, y, z, ry = 0, rz = 0) => bake(BR, new THREE.BoxGeometry(w, h, d).rotateZ(rz).rotateY(ry).translate(x, y, z));

    // ===== 日本橋 (1911年の石造りの二重アーチ橋)。橋の本体 (歩ける部分) は川の自動の橋 =====
    const DECK = u => 2.2 * Math.sin(Math.PI * Math.min(1, Math.max(0, (u + 28) / 56)));
    {
      // 川面から見える石のアーチ (両側の面) と中央の橋脚
      for (const v of [-11.4, 11.4]) {
        for (const [u0, u1] of [[-28, -22], [-2.5, 2.5], [22, 28]]) pushPrism(GRAN, GRAN, NB.rect(u0, v - 0.6, u1, v + 0.6), -1.6, Math.max(0.3, DECK((u0 + u1) / 2) - 0.6), { solid: false });
        for (const uc of [-12.2, 12.2]) { const [ax, az] = W(uc, v), a = mesh(new THREE.TorusGeometry(9.6, 0.75, 4, 12, Math.PI), WALL[GRAN], ax, -1.6, az); a.rotation.y = Math.atan2(-NB.uz, NB.ux); a.scale.set(1, 0.32, 1); }
      }
      // 親柱 (四隅。橋の名は徳川慶喜の筆) と獅子、中央の麒麟の灯柱 (翼がある)
      for (const u of [-27, 27]) for (const v of [-12.2, 12.2]) {
        const [x, z] = W(u, v); pushPrism(GRAN, GRAN, regularPoly(x, z, 1.3, 4, NB.ang + Math.PI / 4), 0, 4.2);
        bake(LAMP, new THREE.SphereGeometry(0.5, 8, 6).translate(x, 4.8, z));
        const ry = NB.ang + (u > 0 ? Math.PI : 0), sx = Math.sin(ry), cx = Math.cos(ry);   // 獅子
        bx(0.9, 0.9, 1.6, x, 4.65, z, ry); bx(0.8, 0.8, 0.7, x + sx * 0.6, 5.3, z + cx * 0.6, ry);
      }
      for (const v of [-12.2, 12.2]) {
        const [x, z] = W(0, v), y0 = DECK(0);
        pushPrism(GRAN, GRAN, regularPoly(x, z, 1.4, 4, NB.ang + Math.PI / 4), y0, y0 + 2.4);
        bake(BR, new THREE.CylinderGeometry(0.28, 0.4, 5.5, 8).translate(x, y0 + 5.1, z));
        for (const [dx, dz] of [[0.9, 0], [-0.9, 0], [0, 0.9], [0, -0.9]]) bake(LAMP, new THREE.SphereGeometry(0.42, 8, 6).translate(x + dx, y0 + 7.6, z + dz));
        const ry = NB.ang, sx = Math.sin(ry), cx = Math.cos(ry), yk = y0 + 2.4;   // 麒麟 (翼つき)
        bx(0.8, 0.9, 1.8, x, yk + 0.55, z, ry); bx(0.5, 1.0, 0.5, x + sx * 0.8, yk + 1.3, z + cx * 0.8, ry);
        for (const s of [-1, 1]) bx(1.6, 0.12, 1.0, x + cx * s * 0.9 - sx * 0.2, yk + 1.25, z - sx * s * 0.9 - cx * 0.2, ry, s * 0.55);
        solid(x - 1.4, z - 1.4, x + 1.4, z + 1.4, y0, y0 + 8);
      }
      // 日本国道路元標 (橋の真ん中、道路に埋められている)
      const pl = tex(32, 32, g => { g.fillStyle = '#6a5a3a'; g.fillRect(0, 0, 32, 32); g.fillStyle = '#c8a860'; g.fillRect(3, 3, 26, 26); g.fillStyle = '#6a5a3a'; g.fillRect(6, 6, 20, 20); g.fillStyle = '#c8a860'; g.fillRect(15, 8, 2, 16); g.fillRect(8, 15, 16, 2); });
      const [px, pz] = W(0, 0), pm = mesh(new THREE.PlaneGeometry(1.2, 1.2).rotateX(-Math.PI / 2), lam({ map: pl }), px, DECK(0) + 0.03, pz); pm.rotation.y = NB.ang;
      // 元標の広場 (北西のたもと): 東京市道路元標と複製の日本国道路元標
      oTiles(NB, 18, -42, 44, -14, '#c8c0b0', '#b6ae9e', 2);
      { const [x, z] = W(30, -26); pushPrism(GRAN, GRAN, regularPoly(x, z, 0.9, 8), 0, 1.4); mesh(new THREE.CylinderGeometry(0.22, 0.3, 3.6, 8), BR, x, 3.2, z); bake(LAMP, new THREE.SphereGeometry(0.4, 8, 6).translate(x, 5.2, z)); solid(x - 0.9, z - 0.9, x + 0.9, z + 0.9, 0, 5.4); }
      { const [x, z] = W(24, -34); const m = mesh(new THREE.BoxGeometry(1.6, 1.6, 0.25), [WALL[GRAN], WALL[GRAN], WALL[GRAN], WALL[GRAN], lam({ map: pl }), WALL[GRAN]], x, 1.2, z); m.rotation.y = NB.ang + Math.PI; }
      // 乙姫広場 (北東のたもと。魚河岸の記念碑) / 花の広場・滝の広場 (南のたもと)
      oTiles(NB, 18, 14, 44, 44, '#c8c0b0', '#b6ae9e', 2);
      { const [x, z] = W(30, 30); pushPrism(GRAN, GRAN, regularPoly(x, z, 1.6, 8), 0, 1.8); figure(x, z, 1.8, 0.75, 0x8a7a5a, 'otohime', NB.ang + Math.PI); solid(x - 1.6, z - 1.6, x + 1.6, z + 1.6, 0, 3.8); }
      oTiles(NB, -44, -42, -18, -14, '#c8c0b0', '#b6ae9e', 2); oTiles(NB, -44, 14, -18, 44, '#c8c0b0', '#b6ae9e', 2);
      for (const [u, v] of [[-30, -28], [-30, 28]]) { const [x, z] = W(u, v); ROUND.push([x, z, 1.1]); }
      // 中央通り (橋の南北)
      oRoad(NB, 28, -12, 210, 12, true, [40, 160]); oRoad(NB, -262, -12, -28, 12, true, [-44, -160]);
      for (const s of [-1, 1]) { oTiles(NB, 28, s > 0 ? 12 : -17, 210, s > 0 ? 17 : -12, '#c8c0b0', '#b6ae9e', 2); oTiles(NB, -262, s > 0 ? 12 : -17, -28, s > 0 ? 17 : -12, '#c8c0b0', '#b6ae9e', 2); }
      for (let u = 50; u < 205; u += 16) for (const v of [-14.5, 14.5]) LAMPS2.push(W(u, v));
      for (let u = -255; u < -40; u += 16) for (const v of [-14.5, 14.5]) LAMPS2.push(W(u, v));
      LM_PEOPLE.push([[...W(205, -14.5), ...W(-255, -14.5)], 30], [[...W(-255, 14.5), ...W(205, 14.5)], 30], [[...W(-26, -4), ...W(26, -4)], 6]);
    }
    // ===== 首都高 都心環状線 (日本橋川の上。1963年開通。地下に移す工事が進んでいる) =====
    {
      const R = RIVERS.find(q => q.name === '日本橋川').pts.slice(0, 5), Y = 12.5;
      for (let i = 0; i < R.length - 1; i++) {   // 橋桁・壁・橋脚 (まとめて描く)
        const [ax, az] = R[i], [bx, bz] = R[i + 1], L = Math.hypot(bx - ax, bz - az), nx = -(bz - az) / L, nz = (bx - ax) / L;
        const F2 = frame(ax, az, bx - ax, bz - az, nx, nz);
        pushPrism('CONC', 'ASPH', F2.rect(-2, -9.5, L + 2, 9.5), Y - 1.6, Y);
        for (const s of [-9.2, 9.2]) pushPrism('CONC', 'CONC', F2.rect(-2, s - 0.2, L + 2, s + 0.2), Y, Y + 1.6);
        for (let t = 0; t < L; t += 28) pushPrism('CONC', null, F2.rect(t - 1.5, -1.5, t + 1.5, 1.5), -1.6, Y - 1.6);
      }
      // 西のはし: お濠の下へ続く構造物 / 東のはし: 江戸橋ジャンクション (地下への入口)
      const [x0, z0] = R[0]; pushPrism('CONC', 'CONC', regularPoly(x0 - 4, z0 - 2, 16, 8), -3.2, Y - 1.6);
      const E = R[4], ramp = frame(E[0], E[1], 0.15, 1, 1, 0);
      for (let k = 0; k < 12; k++) { const y0 = Y - k * (Y / 12), y1 = Y - (k + 1) * (Y / 12); pushSlope('CONC', 'ASPH', ramp.w(0, k * 6), ramp.w(0, (k + 1) * 6), 8, y0, y1, 1.2); }
      oBox(ramp, 'CONC', -10, 72, -8.5, 84, 0, 5, { top: 'CONC' }); oBox(ramp, 'CONC', 8.5, 72, 10, 84, 0, 5, { top: 'CONC' }); oBox(ramp, 'CONC', -10, 82, 10, 84, 3.5, 5, { top: 'CONC' });
      oFr(ramp, -8.5, 72, 8.5, 84, '#1a1a1e');
      LM_ZONES.push(ramp.rect(-12, -4, 12, 86));
    }

    // ===== 日本銀行 (本館は1896年、辰野金吾の設計。上から見ると「円」の字) と貨幣博物館 =====
    {
      const B = [70, -170, 160, -90];
      oFr(NB, B[0] - 6, B[1] - 6, B[2] + 6, B[3] + 6, '#b4ae9e');
      for (const r of [[B[0], B[1], B[2], B[1] + 14], [B[0], B[3] - 14, B[2], B[3]], [B[2] - 14, B[1], B[2], B[3]], [108, B[1] + 14, 120, B[3] - 14], [120, -136, B[2] - 14, -124]]) oBox(NB, BOJ, ...r, 0, 20, { top: GRAN });
      const [dx, dz] = W(114, -130); mesh(new THREE.SphereGeometry(7, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), lam({ color: 0x5a8a72 }), dx, 20, dz); polySolid(regularPoly(dx, dz, 5.5, 8), 20, 26);
      mesh(new THREE.CylinderGeometry(0.9, 1.1, 2.4, 8), lam({ color: 0x5a8a72 }), dx, 28, dz);
      oBox(NB, OFF3, 172, -176, 205, -100, 0, 40);                        // 日本銀行 新館
      oBox(NB, BOJ, 30, -146, 58, -110, 0, 16, { top: GRAN });            // 貨幣博物館 (日本銀行分館)
      const sg = glow(lam({ map: textTex('貨幣博物館', '#2a3a5a', '#ffffff', 128, 24) }), 0xffffff, 0.6), [sx, sz] = W(29.7, -128); const sm = mesh(new THREE.PlaneGeometry(8, 1.5), sg, sx, 4, sz); sm.rotation.y = NB.ang + Math.PI;
      // 三井本館 (1929年) と日本橋三井タワー / 三越 (ライオン像)
      oBox(NB, MITSUI, 60, -80, 130, -20, 0, 31, { top: GRAN });
      oBox(NB, TOWER, 138, -80, 190, -26, 0, 195, { top: 'ROOF' }); oBox(NB, 'glass', 138, -80, 190, -60, 0, 31, { top: GRAN });
      oBox(NB, MITSUKOSHI, 50, 20, 150, 110, 0, 36, { top: GRAN }); oBox(NB, MITSUKOSHI, 80, 40, 120, 90, 36, 44, { top: GRAN });
      for (const u of [84, 96]) { const [x, z] = W(u, 18.5); pushPrism(GRAN, GRAN, regularPoly(x, z, 1, 4, NB.ang + Math.PI / 4), 0, 1.2); const ry = NB.ang - Math.PI / 2, sx = Math.sin(ry), cx = Math.cos(ry); bx(0.8, 0.9, 1.7, x, 1.65, z, ry); bx(1.0, 1.0, 0.8, x + sx * 0.7, 2.3, z + cx * 0.7, ry); bx(1.2, 1.2, 0.4, x + sx * 0.5, 2.4, z + cx * 0.5, ry); }
      const ms = glow(lam({ map: textTex('三越', '#f4efe4', '#a0262a', 96, 30) }), 0xffffff, 0.6), [mx, mz] = W(100, 19.7); const mm = mesh(new THREE.PlaneGeometry(10, 3), ms, mx, 30, mz); mm.rotation.y = NB.ang - Math.PI / 2;
      oBox(NB, TAKA, -240, 18, -170, 92, 0, 31, { top: GRAN }); oBox(NB, TAKA, -224, 34, -186, 76, 31, 38, { top: GRAN });   // 日本橋高島屋 (1933年)
      oBox(NB, OFF1, -150, 20, -60, 80, 0, 90); oBox(NB, OFF2, -150, -95, -50, -20, 0, 120);   // コレド日本橋 / 日本橋一丁目のビル
    }
    // 南西・南東の街区は自動生成の街に任せる (中央通りの両側だけ作り込む)
    LM_ZONES.push(yaesu(NB.rect(24, -180, 210, -14)), NB.rect(14, 14, 175, 125), NB.rect(-265, -18, 212, 18), NB.rect(-246, 12, -164, 98), NB.rect(-155, 14, -55, 86), yaesu(NB.rect(-155, -100, -45, -14)),
      NB.rect(-46, -44, -16, -14), NB.rect(-46, 14, -16, 44));

    // ===== 東京証券取引所 (兜町。東証Arrows) と兜神社 =====
    const TS = [466, -1790, 548, -1718];
    {
      fr(TS[0] - 6, TS[1] - 4, TS[2] + 4, TS[3] + 6, '#b4ae9e');
      pushPrism(TSE, 'ROOF', [[TS[0], TS[1] + 26], [TS[0] + 26, TS[1]], [TS[2], TS[1]], [TS[2], TS[3]], [TS[0], TS[3]]], 0, 42);
      const RC = [TS[0] + 20, TS[1] + 20];
      pushPrism('glass', 'ROOF', regularPoly(...RC, 18, 16), 0, 30);
      // 株価が流れる電光の帯 (チッカー)
      const tk = tex(512, 16, g => { g.fillStyle = '#05080a'; g.fillRect(0, 0, 512, 16); g.font = 'bold 12px monospace'; g.textBaseline = 'middle'; let x = 4; for (let i = 0; i < 14; i++) { const up = rnd() < 0.6, code = 1000 + Math.floor(rnd() * 8999), px = (100 + Math.floor(rnd() * 9000)).toLocaleString(); g.fillStyle = '#f0f0f0'; g.fillText(code + ' ' + px, x, 8); x += g.measureText(code + ' ' + px).width + 3; g.fillStyle = up ? '#ff5040' : '#40d070'; g.fillText((up ? '▲' : '▼') + Math.floor(rnd() * 90 + 1), x, 8); x += 34; } });
      tk.wrapS = THREE.RepeatWrapping; tk.repeat.set(3, 1);
      const tm = new THREE.MeshBasicMaterial({ map: tk }), ring = mesh(new THREE.CylinderGeometry(18.15, 18.15, 1.6, 32, 1, true), tm, RC[0], 22, RC[1]);
      LM_UPDATERS.push((dt, t) => { tk.offset.x = (t * 0.03) % 1; });
      const ts = glow(lam({ map: textTex('東京証券取引所', '#2a2a2e', '#ffffff', 192, 24) }), 0xffffff, 0.6); mesh(new THREE.PlaneGeometry(14, 1.8), ts, (TS[0] + TS[2]) / 2 + 8, 36, TS[3] + 0.1);
      // 兜神社 (兜岩をまつる、証券界の守り神)
      const KB = [452, -1823, 471, -1802];
      fr(...KB, '#c8bea8');
      pushPrism(SHU, 'ROOF', rectPoly(455, -1818, 463, -1810), 0, 3.2); jRoof('RF_COPPER', 455, -1818, 463, -1810, 3.2, 2, { over: 0.8 });
      myojinTorii(467, -1806, false, 4, 3.2, lam({ color: 0x9a9488 }), 0.22);
      mesh(new THREE.DodecahedronGeometry(0.9, 0), lam({ color: 0x6a6660 }), 460, 0.5, -1806); solid(459, -1807, 461, -1805, 0, 1);
      LM_ZONES.push(rectPoly(TS[0] - 8, TS[1] - 6, TS[2] + 6, TS[3] + 8), rectPoly(...KB));
      LM_PEOPLE.push([[TS[0] - 3, TS[3] + 3, TS[2] + 2, TS[3] + 3], 8]);
    }

    // ===== 大手町 (江戸城の大手門の前の町。将門塚・大手町の森・超高層ビル) =====
    {
      const OT = clipPolyX(FT.rect(345, 26, 520, 300), -296), w = FT.w;
      LM_ZONES.push(OT); polyFr(OT, '#a29c92');
      oRoad(FT, 345, 26, 520, 44, true, [360, 500]); oRoad(FT, 418, 44, 432, 300, false);   // 大手町のビルのあいだの道
      for (let u = 352; u < 515; u += 14) LM_STREET.push([...w(u, 47), 1.1]);
      // 将門塚 (平将門の首塚と伝わる。カエルの置物がたくさん)
      const MK = [352, 236, 372, 258];
      oTiles(FT, ...MK, '#b8b0a0', '#a8a090', 2);
      { const [x, z] = w(363, 252); pushPrism(GRAN, GRAN, regularPoly(x, z, 1.4, 6), 0, 0.8); const st = mesh(new THREE.BoxGeometry(1.2, 2.6, 0.5), lam({ color: 0x6a6660 }), x, 2.1, z); st.rotation.y = FT.ang; solid(x - 0.9, z - 0.9, x + 0.9, z + 0.9, 0, 3.4);
        for (const dv of [-6, 6]) { const [lx, lz] = w(358, 252 + dv); bake(WALL[GRAN], new THREE.BoxGeometry(0.7, 1.8, 0.7).translate(lx, 0.9, lz)); bake(WALL[GRAN], new THREE.BoxGeometry(1.2, 0.3, 1.2).translate(lx, 1.95, lz)); }
        const fg = lam({ color: 0x5a7a3a }); for (let k = 0; k < 9; k++) { const [fx, fz] = w(357 + k * 0.6, 249 + (k % 3) * 1.5); bake(fg, new THREE.SphereGeometry(0.22, 6, 4).scale(1, 0.7, 1.2).translate(fx, 0.95, fz)); } }
      for (const [u, v] of [[354, 240], [370, 240], [354, 256], [370, 256]]) PINES.push([...w(u, v), 0.9]);
      // 大手町タワーと大手町の森 / 読売新聞ビル / 経団連会館 / 大手町プレイス
      oBox(FT, OFF2, 470, 160, 512, 205, 0, 200);
      const forest = [440, 130, 518, 296];
      oFr(FT, ...forest, '#4f7a3a');
      for (let k = 0; k < 360; k++) { const u = rr(forest[0] + 2, forest[2] - 2), v = rr(forest[1] + 2, forest[3] - 2); if (u > 466 && u < 516 && v > 156 && v < 209) continue; (rnd() < 0.8 ? ROUND : PINES).push([...w(u, v), rr(1, 1.4)]); }
      oBox(FT, OFF1, 440, 50, 510, 110, 0, 200);       // 読売新聞ビル
      oBox(FT, OFF3, 380, 50, 412, 112, 0, 115);       // 経団連会館
      oBox(FT, TOWER, 350, 120, 410, 160, 0, 178); oBox(FT, TOWER, 350, 170, 410, 212, 0, 160);   // 大手町プレイス
      oBox(FT, OFF1, 380, 262, 412, 296, 0, 70);
      LM_PEOPLE.push([[...w(348, 48), ...w(515, 48)], 16], [[...w(425, 46), ...w(425, 290)], 10]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    const bb = (...r) => polyBB(NB.rect(...r));
    SPOT_AREAS.push(['日本国道路元標', ...bb(-2.5, -3, 2.5, 3)], ['麒麟の像', ...bb(-3, -14, 3, -10)], ['麒麟の像', ...bb(-3, 10, 3, 14)], ['日本橋', ...bb(-30, -14, 30, 14)],
      ['東京市道路元標 (元標の広場)', ...bb(18, -42, 44, -14)], ['日本橋魚河岸跡 (乙姫広場)', ...bb(18, 14, 44, 44)], ['花の広場', ...bb(-44, -42, -18, -14)], ['滝の広場', ...bb(-44, 14, -18, 44)],
      ['日本銀行本店本館', ...bb(64, -176, 166, -84)], ['日本銀行 新館', ...bb(170, -178, 207, -98)], ['貨幣博物館', ...bb(26, -150, 62, -106)], ['三井本館', ...bb(58, -84, 134, -18)], ['日本橋三井タワー', ...bb(136, -84, 194, -22)],
      ['三越のライオン像', ...bb(80, 14, 100, 22)], ['日本橋三越本店', ...bb(46, 16, 154, 114)], ['日本橋高島屋', ...bb(-244, 14, -166, 96)],
      ['東京証券取引所', TS[0] - 6, TS[1] - 4, TS[2] + 4, TS[3] + 6], ['兜神社', 452, -1823, 471, -1800], ['首都高 江戸橋ジャンクション', ...polyBB(frame(430, -1855, 0.15, 1, 1, 0).rect(-12, -4, 12, 86))],
      ['将門塚', ...polyBB(FT.rect(350, 234, 374, 260))], ['大手町の森', ...polyBB(FT.rect(440, 130, 518, 296))], ['読売新聞ビル', ...polyBB(FT.rect(438, 48, 512, 112))], ['経団連会館', ...polyBB(FT.rect(378, 48, 414, 114))], ['大手町プレイス', ...polyBB(FT.rect(348, 118, 412, 214))],
      ['中央通り (日本橋)', ...bb(-262, -12, 210, 12)]);
    LM_HEIGHT_AREAS.push(['首都高 都心環状線 (日本橋川の上)', (x, z, y) => y > 11 && y < 15 && riverInfo(x, z) && riverInfo(x, z).r.name === '日本橋川' && x < 440]);
    LM_LABELS.push(['日本橋', 360, -1888, '🌉'], ['道路元標', ...W(30, -26), '0️⃣', '東京市道路元標 (元標の広場)'], ['日本銀行', ...W(115, -130), '💴', '日本銀行本店本館'], ['貨幣博物館', ...W(44, -128), '🪙'],
      ['三越', ...W(100, 65), '🦁', '日本橋三越本店'], ['高島屋', ...W(-205, 55), '🏬', '日本橋高島屋'], ['東証', 507, -1754, '📈', '東京証券取引所'], ['将門塚', ...FT.w(362, 247), '🐸'], ['大手町の森', ...FT.w(480, 260), '🌳']);
    Object.assign(LM_NOTES, {
      '日本橋': '1603年に架けられ、五街道の起点になった橋。いまの石の二重アーチ橋は1911年完成で、橋の名の文字は最後の将軍・徳川慶喜の筆',
      '日本国道路元標': '1972年に橋の真ん中に埋められた、日本の道路の起点。国道の距離はここから測る',
      '東京市道路元標 (元標の広場)': 'もとは橋の真ん中に立っていた道路の起点の柱。都電の架線の柱も兼ねていた',
      '麒麟の像': '橋の中央の麒麟には翼がある。日本の道路の起点から飛び立つ、という願いがこめられている',
      '日本橋川': '江戸の町の物流を支えた川。日本橋のたもとには魚市場や問屋が並んでいた',
      '首都高 都心環状線 (日本橋川の上)': '1963年、東京オリンピックの前の年に開通。地下に移す工事が進んでいて、2040年度ごろには日本橋の上に空が戻る予定',
      '首都高 江戸橋ジャンクション': '首都高を地下へ移すトンネルは、このあたりで日本橋川を横切る計画',
      '日本橋魚河岸跡 (乙姫広場)': '関東大震災のあと築地に移るまで、日本橋の北のたもとには江戸から続く魚市場「魚河岸」があった',
      '日本銀行本店本館': '1896年完成、東京駅と同じ辰野金吾の設計。関東大震災でも倒れなかった。上から見ると「円」の字に見えることで知られる',
      '貨幣博物館': '和同開珎や大判・小判など、古代から現代までの本物のお金を展示している',
      '三井本館': '1929年完成。太い列柱が並ぶ、昭和初期の西洋建築',
      '日本橋三越本店': '1673年創業の呉服店「越後屋」がはじまり。「現金掛け値なし」(定価で現金売り) で評判になった',
      '三越のライオン像': '入口のライオン像は、ロンドンのトラファルガー広場のライオンがモデル',
      '日本橋高島屋': '1933年完成。百貨店の建物として初めて国の重要文化財に指定された',
      '東京証券取引所': 'かつては「場立ち」と呼ばれる人たちが手のサインで株を売買していたが、1999年に立会場は閉鎖。いまはすべてコンピューターで取引する',
      '兜神社': '兜町の名の由来とされる「兜岩」をまつる、証券業界の守り神',
      '将門塚': '平将門の首塚と伝わる。たくさん供えられたカエルの置物は「無事に帰る」にかけたもの',
      '大手町': '江戸城の正門「大手門」の前の町だったことが名の由来',
      '大手町の森': 'ビルの足元につくられた森。木々は千葉で育ててから移し、はじめから森の姿になるようにした',
    });
    Object.assign(LM_TIPS, {
      '日本国道路元標': '道路の真ん中にあるので近づけない。北西のたもと「元標の広場」に複製がある',
      '日本橋': '日本橋のたもとの桟橋から、日本橋川・隅田川をめぐる船が出ている',
      '日本銀行本店本館': '本店見学は無料・事前予約制 (平日、約60分。小学5年生以上)',
      '貨幣博物館': '入館無料・予約不要。9:30〜16:30 (入館は16:00まで)、月曜休館 (祝日は開館)',
      '東京証券取引所': '東証Arrowsは予約なしで無料見学できる。平日9:00〜16:30 (最終入館16:00)。売買の時間は9:00〜11:30と12:30〜15:30',
    });
    let econ = new Set();
    LM_UPDATERS.push(() => { if (inR(polyBB(NB.rect(60, -180, 170, -80)), P.x, P.z)) econ.add('日銀'); if (inR([TS[0] - 8, TS[1] - 6, TS[2] + 6, TS[3] + 8], P.x, P.z)) econ.add('東証'); if (Math.hypot(P.x - W(0, 0)[0], P.z - W(0, 0)[1]) < 4 && P.y > 1.5 && P.y < 4) econ.add('元標'); });
    LM_ACH.push(['genpyo', '0️⃣ 日本の道のはじまり', '日本橋の真ん中、日本国道路元標の上に立つ', () => econ.has('元標')],
      ['keizai', '💴 経済の中枢めぐり', '日本銀行と東京証券取引所を両方訪ねる', () => econ.has('日銀') && econ.has('東証')],
      ['shutoko_nb', '🛣 日本橋の上の首都高', '日本橋川の上の首都高に上る', () => P.y > 11 && P.y < 15 && riverInfo(P.x, P.z) && riverInfo(P.x, P.z).r.name === '日本橋川']);
    bakeFlush();
  },
});
