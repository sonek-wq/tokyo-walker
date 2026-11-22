/* 竹芝・浜松町・日の出・汐留 (スタート地点のまわりの作り込み)
   - 東京ポートシティ竹芝: 海へ向かって段々にのぼる緑のテラス「スキップテラス」(竹芝新八景: 雨・菜園・水田・蜂…)。ゆりかもめ竹芝駅からの竹芝デッキとつながる
   - 竹芝デッキ: 駅から海岸通りの上を渡って、竹芝ふ頭公園へ降りる
   - WATERS takeshiba: ホテルのタワー、劇団四季の劇場 [春][秋]、水辺の階段広場と竹芝干潟 (カニが歩く)
   - 竹芝客船ターミナル: 帆のような白い屋根。桟橋の先にはジェットフォイルが停まり、ときどき海面から浮き上がって東京湾をひと回りする
   - 日の出桟橋と御座船「安宅丸」/ 旧芝離宮恩賜庭園の大山 / 汐留の歩行者デッキ
   (竹芝の元のただの箱のビルは engine/04_ring.js の LANDMARKS で材質を null にして置かないようにしてある) */
REGION({
  name: '竹芝・浜松町・汐留',
  towns: [],
  labels: [],
  build(r) {
    const C = (key, o) => { if (!WALL[key]) WALL[key] = lam(o); return key; };
    const sgn = (text, bg, fg, w, h, x, y, z, ry = 0, k = 0.9, tw = 192) => bake(glow(new THREE.MeshLambertMaterial({ map: textTex(text, bg, fg, tw, 28) }), '#ffffff', k), new THREE.PlaneGeometry(w, h).rotateY(ry).translate(x, y, z));
    const WOODK = C('TK_DECKWOOD', { color: 0x9a7650 });

    // ===================== 東京ポートシティ竹芝 =====================
    // オフィスタワー (西) と、東へ向かって段々に低くなるスキップテラス。いちばん下のテラスが竹芝デッキ (高さ9m) につながる
    const PC = { x0: -150, x1: -36, z0: -32, z1: 62 };
    tiles(PC.x0, -48, PC.x1, 128, '#d2cabb', '#c2baab', 3);
    const TOWERM = acGothic('TK_PORTCITY', '#c9d0d6', '#56708a', '#e8ecf0', { rowH: 3, step: 2, ww: 1, wh: 2, lit: 0.62 });
    pushPrism(C('TK_PCPODIUM', { color: 0xd6d0c4 }), 'GRASSTOP', rectPoly(PC.x0, PC.z0, -98, PC.z1), 0, 29);
    pushPrism(TOWERM, 'ROOF', rectPoly(PC.x0, -24, -102, 32), 29, 165);
    for (let y = 40; y < 165; y += 12) pushPrism('CONC', null, rectPoly(-102, -24, -100.8, 32), y, y + 0.6, { solid: false });   // 東の面の白いひさし
    pushPrism('CONC', 'ROOF', rectPoly(-140, -16, -112, 24), 165, 172);
    sgn('TOKYO PORTCITY TAKESHIBA', '#1e2430', '#f0f4f8', 26, 2.2, -100.6, 150, 4, Math.PI / 2);
    const TER = [   // [x0, x1, 天井の高さ, 名前, 景]
      [-62, -36, 6, '竹芝新八景「雨」(スキップテラス)', 'rain'],
      [-74, -62, 10, '竹芝新八景「菜園」(スキップテラス)', 'veg'],
      [-86, -74, 14, '竹芝新八景「水田」(スキップテラス)', 'rice'],
      [-98, -86, 18, '竹芝新八景「蜂」(スキップテラス)', 'bee'],
    ];
    const GLS = C('TK_TERGL', { color: 0x9ab8c8 });
    for (const [x0, x1, y] of TER) {
      pushPrism(GLS, 'GRASSTOP', rectPoly(x0, PC.z0, x1, PC.z1), 0, y);
      pushPrism('CONC', null, rectPoly(x1 - 0.3, PC.z0, x1, PC.z1), y, y + 1.05, { solid: false });   // 手すり (東の縁)
    }
    solid(-36.3, PC.z0, -36, 44, 6, 7.1); solid(-36.3, 52, -36, PC.z1, 6, 7.1);   // いちばん下の手すり (デッキの入口はあけておく)
    for (let k = 0; k < TER.length - 1; k++) { const [x0, , y] = TER[k]; stairs([x0, 30, x0 + 6, 36], TER[k + 1][2] - y, 'x-', y); }
    stairs([-58, PC.z1, -44, PC.z1 + 12], 6, 'z-');   // 地上 (南の広場) から いちばん下のテラスへ
    // テラスの植えこみ (いろいろな在来の木)
    for (const [x0, x1, y] of TER) for (let k = 0; k < 7; k++) pick([ROUND, MAPLES, ROUND]).push([rr(x0 + 2, x1 - 2), rr(PC.z0 + 3, 36), rr(0.55, 0.8), y]);
    for (let k = 0; k < 10; k++) ROUND.push([rr(-148, -100), rr(36, 60), 0.7, 29]);   // 低層部の屋上 (竹芝新八景「空」)
    // 「菜園」: 畑のうね
    for (let z = PC.z0 + 4; z < 30; z += 3) bake(lam({ color: 0x6a4a30 }), new THREE.BoxGeometry(9, 0.3, 1.4).translate(-68, 10.15, z));
    for (let k = 0; k < 40; k++) bake(lam({ color: pick([0x4a9a3a, 0x6ab048, 0xd04030]) }), new THREE.ConeGeometry(0.3, 0.6, 4).translate(rr(-72, -64), 10.6, PC.z0 + 4 + Math.floor(rr(0, 9)) * 3));
    // 「水田」: テラスの上の田んぼ (秋は黄金色の稲)
    {
      const PAD = [-85, PC.z0 + 2, -75, 30];
      bake(lam({ color: 0x4a7a8a }), new THREE.PlaneGeometry(PAD[2] - PAD[0], PAD[3] - PAD[1]).rotateX(-Math.PI / 2).translate((PAD[0] + PAD[2]) / 2, 14.08, (PAD[1] + PAD[3]) / 2));
      const RICE = new THREE.InstancedMesh(new THREE.ConeGeometry(0.16, 0.8, 4).translate(0, 0.4, 0), lam({ color: 0xd8b848 }), 220), d = new THREE.Object3D(); let n = 0;
      for (let x = PAD[0] + 0.6; x < PAD[2] - 0.4 && n < 220; x += 0.9) for (let z = PAD[1] + 0.6; z < PAD[3] - 0.4 && n < 220; z += 1.6) { d.position.set(x, 14, z); d.rotation.z = rr(-0.15, 0.15); d.updateMatrix(); RICE.setMatrixAt(n++, d.matrix); }
      RICE.count = n; scene.add(RICE);
      for (const x of [PAD[0], PAD[2]]) bake(lam({ color: 0x8a6a48 }), new THREE.BoxGeometry(0.4, 0.4, PAD[3] - PAD[1]).translate(x, 14.2, (PAD[1] + PAD[3]) / 2));   // あぜ
    }
    // 「蜂」: ミツバチの巣箱と、まわりを飛ぶハチ
    const HIVES = [[-94, -20], [-94, -12], [-90, -20]], BEES = [];
    {
      for (const [x, z] of HIVES) { bake(lam({ color: 0xe8d8b0 }), new THREE.BoxGeometry(1.4, 1.2, 1.1).translate(x, 18.6, z)); bake(lam({ color: 0x6a8a5a }), new THREE.BoxGeometry(1.6, 0.15, 1.3).translate(x, 19.28, z)); }
      for (let k = 0; k < 24; k++) { const fl = new THREE.Mesh(new THREE.SphereGeometry(0.45, 5, 4), lam({ color: pick([0xf0d040, 0xe880a0, 0xb070e0, 0xffffff]) })); fl.position.set(rr(-97, -87), 18.3, rr(-4, 34)); fl.scale.y = 0.6; scene.add(fl); }
      const bm = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 4, 3).scale(1, 0.8, 1.5), lam({ color: 0xe8b020, emissive: 0x302000 }), 18); bm.frustumCulled = false; scene.add(bm);
      const d = new THREE.Object3D();
      LM_UPDATERS.push((dt, t) => {
        if (Math.abs(P.x + 92) > 120 || Math.abs(P.z) > 140 || NIGHT > 0.5) { bm.visible = false; return; } bm.visible = true;
        for (let i = 0; i < 18; i++) { const [hx, hz] = HIVES[i % 3], a = t * (1.6 + (i % 5) * 0.3) + i * 2.1, rad = 1.5 + (i % 4) * 0.9; d.position.set(hx + Math.cos(a) * rad, 19.2 + Math.sin(t * 3 + i) * 0.5, hz + Math.sin(a * 1.3) * rad); d.rotation.y = -a; d.updateMatrix(); bm.setMatrixAt(i, d.matrix); }
        bm.instanceMatrix.needsUpdate = true;
      });
    }
    // 「雨」: 雨水をしみこませる庭 (砂利と石)
    for (let k = 0; k < 14; k++) bake(lam({ color: pick([0x9a968e, 0x8a867e, 0xb0aca4]) }), new THREE.DodecahedronGeometry(rr(0.4, 0.9), 0).translate(rr(-60, -40), 6.2, rr(-28, 28)));
    LM_PEOPLE.push([[-58, 20, -38, 20, 6], 5], [[-72, 0, -64, 0, 10], 2], [[-96, 24, -88, 24, 18], 2], [[-150, 100, -40, 100], 12], [[-40, 70, -40, 126], 6]);

    // ===================== 竹芝デッキ (スキップテラス → 海岸通りとゆりかもめの高架の下 → 竹芝ふ頭公園) =====================
    {
      const DY = 6, DZ0 = 44, DZ1 = 52, X0 = -36, X1 = 62;
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(X0, DZ0, X1, DZ1), DY - 0.8, DY);
      for (const z of [DZ0, DZ1 - 0.3]) pushPrism(C('TK_RAILGL', { color: 0x9fc4d4, transparent: true, opacity: 0.6 }), null, rectPoly(X0, z, X1, z + 0.3), DY, DY + 1.1);
      for (const x of [-22, 30, 52]) pushPrism('CONC', null, rectPoly(x - 0.8, 47.2, x + 0.8, 48.8), 0, DY - 0.8);
      stairs([X1, DZ0, X1 + 18, DZ1], DY, 'x-');
      sgn('竹芝デッキ  TAKESHIBA DECK', '#24405a', '#ffffff', 10, 1.1, -14, DY + 2.2, DZ0 - 0.05, Math.PI, 0.8, 192);
      sgn('竹芝デッキ  TAKESHIBA DECK', '#24405a', '#ffffff', 10, 1.1, 40, DY + 2.2, DZ1 + 0.05, 0, 0.8, 192);
      for (let x = X0 + 8; x < X1; x += 16) LAMPS2.push([x, DZ1 - 0.9, DY]);
      LM_PEOPLE.push([[X0 - 20, 48, X1, 48, DY], 10], [[X1, 50, X0 - 20, 50, DY], 8]);
      LM_HEIGHT_AREAS.unshift(['竹芝デッキ', (x, z, y) => y > DY - 1 && y < DY + 3 && x > X0 - 1 && x < X1 + 18 && z > DZ0 - 1 && z < DZ1 + 1]);
      LM_LABELS.push(['竹芝デッキ', 12, 48, '🌉', '竹芝デッキ']);
    }

    // ===================== 竹芝客船ターミナル (帆のような白い屋根) =====================
    {
      const TM = [60, -45, 116, -10];
      pushPrism('glass', 'ROOF', rectPoly(...TM), 0, 9);
      const SAIL = lam({ color: 0xf6f6f2, side: THREE.DoubleSide, emissive: 0x303030 });
      for (let k = 0; k < 4; k++) {
        const x = 67 + k * 14, g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute([x - 6, 9, -42, x + 6, 9, -42, x, 19, -30, x - 6, 9, -13, x + 6, 9, -13, x, 19, -30, x - 6, 9, -42, x - 6, 9, -13, x, 19, -30, x + 6, 9, -42, x + 6, 9, -13, x, 19, -30], 3));
        g.computeVertexNormals(); const m = new THREE.Mesh(g, SAIL); scene.add(m);
        mesh(new THREE.CylinderGeometry(0.15, 0.15, 3, 4), lam({ color: 0xc0c4c8 }), x, 20.3, -30);
      }
      solid(TM[0], TM[1], TM[2], TM[3], 9, 12);
      sgn('竹芝客船ターミナル', '#1a3a6a', '#ffffff', 16, 1.8, 88, 7, TM[3] + 0.12, 0, 0.9, 192);
      sgn('伊豆諸島・小笠原諸島へ', '#f0f0ea', '#1a3a6a', 12, 1.1, 88, 4.6, TM[3] + 0.12, 0, 0.7, 192);
    }

    // ===================== WATERS takeshiba (ホテルのタワー・四季劇場・水辺の広場・竹芝干潟) =====================
    {
      const WT = acGothic('TK_WATERS', '#bcc8cc', '#4a6272', null, { rowH: 3, step: 2, ww: 2, wh: 2, lit: 0.6 });
      pushPrism(WT, 'ROOF', rectPoly(30, -150, 70, -110), 0, 110);
      pushPrism('CONC', 'ROOF', rectPoly(36, -144, 64, -116), 110, 114);
      sgn('WATERS takeshiba', '#e8eef0', '#1e3a4a', 16, 1.8, 50, 104, -109.9, 0, 0.8, 192);
      // シアター棟 (劇団四季の専用劇場が2つ)
      pushPrism(C('TK_SHIKI', { color: 0xd8d2c8 }), 'ROOF', rectPoly(76, -150, 116, -82), 0, 26);
      pushPrism('glass', null, rectPoly(115.7, -146, 116.2, -86), 0.2, 10, { solid: false });
      sgn('JR東日本四季劇場 [春]', '#7a1e2a', '#fff0d8', 18, 2, 116.3, 18, -132, Math.PI / 2, 1);
      sgn('JR東日本四季劇場 [秋]', '#5a3a14', '#fff0d8', 18, 2, 116.3, 18, -100, Math.PI / 2, 1);
      // 水辺の階段広場 (海へ下りる木の段)
      for (let k = 0; k < 4; k++) pushPrism(WOODK, WOODK, rectPoly(118 + k * 5.5, -158, 123.5 + k * 5.5, -86), 0, 0.6 - k * 0.15, { solid: false });
      tiles(116, -170, 140, -80, '#a88a64', '#987a54', 1.5);
      // 竹芝干潟 (海とつながる人工の干潟。潮だまりとヨシ)
      const HG = [140, -160, 172, -112];
      LAND.push(HG); WALK.push(HG);
      pushPrism(C('TK_MUD', { color: 0x7a6a52 }), C('TK_MUDTOP', { color: 0x8a7a5e }), rectPoly(...HG), -1.6, 0, { solid: false });
      for (const [x, z, rx, rz] of [[150, -140, 5, 3], [162, -126, 4, 2.5], [158, -150, 3, 2]]) bake(lam({ color: 0x4a7088 }), new THREE.CircleGeometry(1, 10).scale(rx, rz, 1).rotateX(-Math.PI / 2).translate(x, 0.03, z));
      for (let k = 0; k < 40; k++) { const x = rr(142, 170), z = rr(-158, -114); if (rnd() < 0.5) bake(lam({ color: 0x8aa04a }), new THREE.ConeGeometry(0.25, rr(1.2, 2), 4).translate(x, 0.8, z)); }
      for (let k = 0; k < 10; k++) bake(lam({ color: 0x6a665e }), new THREE.DodecahedronGeometry(rr(0.4, 0.8), 0).translate(rr(142, 170), 0.2, rr(-158, -114)));
      for (const z of [-160, -112]) pushPrism('CONC', null, rectPoly(140, z - 0.3, 172, z), 0, 0.9);
      pushPrism('CONC', null, rectPoly(171.7, -160, 172, -112), 0, 0.9);
      // カニ (近づくと穴にかくれる)
      const CRAB = new THREE.InstancedMesh((() => { const parts = [new THREE.BoxGeometry(0.5, 0.18, 0.36).translate(0, 0.14, 0)]; for (const sx of [-1, 1]) { parts.push(new THREE.BoxGeometry(0.28, 0.06, 0.06).translate(sx * 0.36, 0.08, 0.12)); parts.push(new THREE.BoxGeometry(0.28, 0.06, 0.06).translate(sx * 0.36, 0.08, -0.1)); parts.push(new THREE.BoxGeometry(0.16, 0.12, 0.12).translate(sx * 0.18, 0.24, 0.26)); }
        let n = 0; const G = parts.map(g => g.toNonIndexed()); for (const g of G) n += g.attributes.position.count; const Pp = new Float32Array(n * 3), Nn = new Float32Array(n * 3); let o = 0; for (const g of G) { Pp.set(g.attributes.position.array, o); Nn.set(g.attributes.normal.array, o); o += g.attributes.position.count * 3; }
        const M = new THREE.BufferGeometry(); M.setAttribute('position', new THREE.BufferAttribute(Pp, 3)); M.setAttribute('normal', new THREE.BufferAttribute(Nn, 3)); return M; })(), lam({ color: 0xc8402a }), 14);
      CRAB.frustumCulled = false; scene.add(CRAB);
      const CR = Array.from({ length: 14 }, () => ({ hx: rr(143, 169), hz: rr(-157, -115), ph: rr(0, 6), hide: 0 })), d = new THREE.Object3D();
      LM_UPDATERS.push((dt, t) => {
        if (Math.abs(P.x - 156) > 200 || Math.abs(P.z + 136) > 200) { CRAB.visible = false; return; } CRAB.visible = true;
        CR.forEach((c, i) => {
          const near = Math.hypot(P.x - c.hx, P.z - c.hz) < 3.5; if (near) c.hide = 6; else if (c.hide > 0) c.hide -= dt;
          const s = Math.sin(t * 0.5 + c.ph) * 2.2;   // 横歩き
          d.position.set(c.hx + s, c.hide > 0 ? -0.5 : 0, c.hz); d.rotation.y = c.ph; d.scale.setScalar(1.4); d.updateMatrix(); CRAB.setMatrixAt(i, d.matrix);
        });
        CRAB.instanceMatrix.needsUpdate = true;
      });
      LM_PEOPLE.push([[118, -168, 118, -84], 6], [[138, -84, 138, -168], 4]);
    }

    // ===================== ジェットフォイル (海を飛ぶ船。桟橋の先に停まり、ときどき東京湾をひと回りする) =====================
    const JF = { g: new THREE.Group(), foil: false };
    {
      const g = JF.g; scene.add(g);
      const WH = lam({ color: 0xf4f4f2 }), BL = lam({ color: 0x1e4a9a }), RD = lam({ color: 0xd03a3a }), WIN = lam({ color: 0x24303c, emissive: 0x403020 }), STRUT = lam({ color: 0x5a5e66 });
      const hull = new THREE.Mesh(new THREE.BoxGeometry(27, 2.6, 8.5), WH); hull.position.y = 1.3; g.add(hull);
      const bow = new THREE.Mesh(new THREE.CylinderGeometry(4.25, 4.25, 2.6, 3, 1, false, -Math.PI / 6, Math.PI * 2).scale(1.2, 1, 1), WH); bow.position.set(13.5, 1.3, 0); bow.rotation.y = 0; g.add(bow);
      const deck = new THREE.Mesh(new THREE.BoxGeometry(22, 2.2, 7.6), WH); deck.position.set(-1, 3.7, 0); g.add(deck);
      for (const sd of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(20, 0.9, 0.1), WIN); w.position.set(-1, 3.9, sd * 3.82); g.add(w); const st = new THREE.Mesh(new THREE.BoxGeometry(27, 0.5, 0.1), BL); st.position.set(0, 1.6, sd * 4.27); g.add(st); const st2 = new THREE.Mesh(new THREE.BoxGeometry(27, 0.25, 0.1), RD); st2.position.set(0, 1.0, sd * 4.27); g.add(st2); }
      const cab = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 4.6), WH); cab.position.set(6.5, 5.4, 0); g.add(cab);
      const cw = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 4.2), WIN); cw.position.set(9.05, 5.5, 0); g.add(cw);
      for (const [x, w] of [[9, 3.4], [-9, 8.2]]) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.2, 0.6), STRUT); s.position.set(x, -1.2, 0); g.add(s); const f = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, w), STRUT); f.position.set(x, -2.8, 0); g.add(f); }
      const nm = glow(lam({ map: textTex('セブンアイランド', '#f4f4f2', '#1e4a9a', 160, 28) }), '#ffffff', 0.3);
      for (const sd of [-1, 1]) { const n = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.2), nm); n.position.set(-2, 2.4, sd * 4.29); n.rotation.y = sd > 0 ? 0 : Math.PI; g.add(n); }
      const spray = new THREE.Mesh(new THREE.ConeGeometry(2.6, 16, 6, 1, true).rotateZ(Math.PI / 2), lam({ color: 0xffffff, transparent: true, opacity: 0.55, side: THREE.DoubleSide })); spray.position.set(-21, -0.6, 0); g.add(spray);
      JF.spray = spray;
      // 航路: 桟橋の先 (東向き) → 東京湾をひと回り → 戻る
      const PTS = [[262, 22], [320, 26], [430, 30], [560, 0], [700, 40], [760, 150], [690, 270], [520, 280], [380, 200], [300, 110], [262, 22]];
      const curve = new THREE.CatmullRomCurve3(PTS.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
      const LEN = curve.getLength(), CYCLE = 150, MOOR = 50;
      const tg = new THREE.Vector3(), pp = new THREE.Vector3(); let yaw = 0;
      LM_UPDATERS.push((dt, t) => {
        const c = (t + 20) % CYCLE; let u = 0, speed = 0;
        if (c > MOOR) {   // 出港 → ゆっくり加速 → 翼走 → 減速して戻る
          const k = (c - MOOR) / (CYCLE - MOOR), A = 0.1;
          u = k < A ? 0.5 * A * (k / A) ** 2 : k > 1 - A ? 1 - 0.5 * A * ((1 - k) / A) ** 2 : 0.5 * A + (k - A);
          u /= (1 - A); speed = k < A ? k / A : k > 1 - A ? (1 - k) / A : 1;
          u = Math.min(0.999, Math.max(0.001, u));
          curve.getPointAt(u, pp); curve.getTangentAt(u, tg); yaw = Math.atan2(-tg.z, tg.x);
        } else {          // 桟橋: 東向きにゆっくり向きを直して待つ
          pp.set(PTS[0][0], 0, PTS[0][1]); let dy = -yaw; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2; yaw += Math.max(-dt * 0.15, Math.min(dt * 0.15, dy));
        }
        const lift = Math.max(0, Math.min(1, (speed - 0.35) / 0.3)); JF.foil = lift > 0.5;
        g.position.set(pp.x, -1.2 + lift * 2.4 + Math.sin(t * 1.3) * 0.08 * (1 - lift), pp.z); g.rotation.set(0, yaw, 0);
        spray.visible = speed > 0.2; spray.scale.set(0.4 + speed, 0.3 + lift * 0.7, 0.4 + speed);
      });
      SPOT_AREAS.unshift(['ジェットフォイルのりば (竹芝桟橋)', 214, 6, 240, 46]); LM_LABELS.push(['ジェットフォイル', 250, 22, '🚤', 'ジェットフォイルのりば (竹芝桟橋)']);
    }

    // ===================== 日の出桟橋と御座船「安宅丸」 =====================
    {
      const HP = [140, 276, 196, 288];
      LAND.push(HP); WALK.push(HP);
      pushPrism(C('TK_PIER', { color: 0x9a968e }), 'TKSTONE', rectPoly(...HP), -1.6, 0, { solid: false });
      pushPrism('glass', 'ROOF', rectPoly(150, 277, 170, 287), 0, 4); sgn('日の出桟橋', '#1a3a6a', '#ffffff', 8, 1, 160, 4.8, 287.1, 0, 0.8, 128);
      for (let x = 142; x < 196; x += 3) pushPrism('CONC', null, rectPoly(x, 287.7, x + 0.2, 288), 0, 1);
      solid(140, 287.6, 196, 288, 0, 1.1);
      // 安宅丸: 朱色の船体に金の飾り、瓦屋根の屋形、三つ葉葵の帆
      const g = new THREE.Group(); g.position.set(170, -1.6, 298); scene.add(g);
      const RED = lam({ color: 0xa82a1e }), GOLD = glow(lam({ color: 0xd8b040 }), 0xb08a20, 0.3), BLK = lam({ color: 0x2a2626 }), WH = lam({ color: 0xf0ead8 }), KW = lam({ color: 0x3a3e46 });
      const sh = new THREE.Shape(); sh.moveTo(-24, -6); sh.lineTo(18, -6); sh.lineTo(27, 0); sh.lineTo(18, 6); sh.lineTo(-24, 6); sh.closePath();
      const hg = new THREE.ExtrudeGeometry(sh, { depth: 4, bevelEnabled: false }); hg.rotateX(-Math.PI / 2);
      g.add(new THREE.Mesh(hg, RED));
      const gb = new THREE.Mesh(new THREE.BoxGeometry(50, 0.5, 12.4), GOLD); gb.position.set(-2, 4.1, 0); g.add(gb);
      for (const [l, w, y, x] of [[36, 9, 6.5, -4], [22, 7, 10.5, -6]]) { const cb = new THREE.Mesh(new THREE.BoxGeometry(l, 3.6, w), WH); cb.position.set(x, y - 0.5, 0); g.add(cb);
        const rf = new THREE.Mesh(new THREE.ConeGeometry(Math.hypot(l, w) / 2 * 1.05, 2.4, 4).rotateY(Math.PI / 4).scale(l / Math.hypot(l, w) * 1.45, 1, w / Math.hypot(l, w) * 1.45), KW); rf.position.set(x, y + 2.4, 0); g.add(rf); }
      for (let x = -20; x <= 12; x += 4) for (const sd of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3, 0.3), BLK); p.position.set(x, 6, sd * 4.4); g.add(p); }
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 18, 6), BLK); mast.position.set(8, 13, 0); g.add(mast);
      const sail = new THREE.Mesh(new THREE.PlaneGeometry(11, 11), lam({ map: tex(32, 32, x => { x.fillStyle = '#f2ecd8'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#2a2a2a'; for (let i = 0; i < 32; i += 6) x.fillRect(i, 0, 1, 32); x.beginPath(); x.arc(16, 16, 7, 0, 7); x.fillStyle = '#2a2a2a'; x.fill(); x.fillStyle = '#f2ecd8'; for (const a of [0, 2.1, 4.2]) { x.beginPath(); x.ellipse(16 + Math.cos(a - 1.57) * 3.2, 16 + Math.sin(a - 1.57) * 3.2, 2.2, 2.8, a, 0, 7); x.fill(); } }), side: THREE.DoubleSide }));
      sail.position.set(8.4, 14, 0); sail.rotation.y = Math.PI / 2; g.add(sail);
      const head = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 6), GOLD); head.position.set(27, 5.2, 0); g.add(head);
      const lan = glow(lam({ color: 0xe04030 }), 0xff5030, 1.2);
      for (let x = -20; x <= 14; x += 3.4) for (const sd of [-1, 1]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.7, 6), lan); l.position.set(x, 4.7, sd * 6.3); g.add(l); }
      LM_UPDATERS.push((dt, t) => { if (Math.abs(P.x - 170) < 600 && Math.abs(P.z - 298) < 600) { g.position.y = -1.6 + Math.sin(t * 0.9) * 0.12; g.rotation.x = Math.sin(t * 0.7) * 0.01; } });
      SPOT_AREAS.unshift(['日の出桟橋', ...HP]);
      LM_LABELS.push(['日の出桟橋', 168, 282, '⛴', '日の出桟橋'], ['安宅丸', 170, 298, '🏯', '日の出桟橋']);
    }

    // ===================== 旧芝離宮恩賜庭園の「大山」(登れる築山) と中島 =====================
    {
      hill(-380, 290, 16, 6.5, {});
      for (let k = 0; k < 10; k++) { const a = rnd() * 6.283, dd = rr(4, 14); (rnd() < 0.5 ? PINES : MAPLES).push([-380 + Math.cos(a) * dd, 290 + Math.sin(a) * dd, rr(0.7, 1), 6.5 * Math.max(0, 1 - (dd - 0.7) / 16)]); }
      // 中島へ渡る石の堤 (中国の西湖の堤をまねたといわれる)
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-338, 226, -310, 230), 0, 0.4); POND_LAND.push(['r', -338, 226, -310, 230]);
      STONE_LANTERNS.push([-336, 228], [-312, 228]);
      LM_HEIGHT_AREAS.unshift(['大山 (旧芝離宮恩賜庭園)', (x, z, y) => y > 3 && Math.hypot(x + 380, z - 290) < 14]);
      LM_LABELS.push(['大山', -380, 290, '⛰', '大山 (旧芝離宮恩賜庭園)']);
    }

    // ===================== 汐留の歩行者デッキ (高層ビルのあいだを2階の高さでつなぐ) =====================
    {
      const DY = 6, W = 6, SX = -306;
      const deck = (x0, z0, x1, z1) => { pushPrism('TKSTONE', 'TKSTONE', rectPoly(x0, z0, x1, z1), DY - 0.6, DY); };
      deck(SX, -612, SX + W, -236);                     // 南北の背骨 (浜離宮のお濠ぞい)
      deck(-348, -612, SX, -606);                       // ゆりかもめ 汐留駅へ
      deck(-310, -420, SX, -414); deck(-310, -282, SX, -276);   // ビルの入口へ
      for (const z of [-600, -560, -500, -440, -380, -320, -260]) pushPrism('CONC', null, rectPoly(SX + 2.3, z, SX + 3.7, z + 1.4), 0, DY - 0.6);
      for (const [x0, x1] of [[SX - 0.3, SX], [SX + W, SX + W + 0.3]]) { pushPrism(C('TK_RAILGL', { color: 0x9fc4d4, transparent: true, opacity: 0.6 }), null, rectPoly(x0, -600, x1, -430), DY, DY + 1.1); }
      stairs([SX, -236, SX + W, -220], DY, 'z-');
      stairs([SX, -628, SX + W, -612], DY, 'z+');
      for (let z = -600; z < -240; z += 20) LAMPS2.push([SX + W - 0.6, z, DY]);
      LM_PEOPLE.push([[SX + 2, -610, SX + 2, -238, DY], 14], [[SX + 4, -238, SX + 4, -610, DY], 12]);
      LM_HEIGHT_AREAS.unshift(['汐留の歩行者デッキ', (x, z, y) => y > DY - 1 && y < DY + 3 && x > -350 && x < SX + W + 1 && z > -630 && z < -218]);
    }

    // ===================== 名所の名前・地図・豆知識・実績 =====================
    for (const [x0, x1, y, name] of TER) LM_HEIGHT_AREAS.unshift([name, (x, z, yy) => yy > y - 1 && yy < y + 3 && x > x0 && x < x1 && z > PC.z0 && z < PC.z1]);
    LM_HEIGHT_AREAS.unshift(['竹芝新八景「空」(低層部の屋上)', (x, z, y) => y > 28 && y < 33 && x > PC.x0 && x < -98 && z > 30 && z < PC.z1]);
    SPOT_AREAS.unshift(['竹芝干潟', 140, -160, 172, -112], ['JR東日本四季劇場 [春][秋]', 76, -150, 116, -82], ['水辺の階段広場 (WATERS takeshiba)', 116, -170, 140, -80]);
    LM_LABELS.push(['スキップテラス', -70, 14, '🌾', '竹芝新八景「水田」(スキップテラス)'], ['竹芝干潟', 156, -136, '🦀', '竹芝干潟'], ['四季劇場', 96, -116, '🎭', 'JR東日本四季劇場 [春][秋]'], ['汐留デッキ', -303, -420, '🚶', '汐留の歩行者デッキ']);
    Object.assign(LM_NOTES, {
      '東京ポートシティ竹芝': '2020年に完成した40階建てのビル。ソフトバンクの本社がある。海へ向かって段々にのぼる緑のテラスが目印',
      '竹芝デッキ': '浜松町駅から竹芝ふ頭までは、全長約500mの歩行者デッキでつながっている。車道を渡らずに海まで歩ける',
      '竹芝新八景「雨」(スキップテラス)': '2〜6階のテラスには150種類以上の植物が植えられ、「雨・水・島・水田・香・菜園・蜂・空」の「竹芝新八景」が散らばっている。ここは雨水を地面にしみこませる庭',
      '竹芝新八景「菜園」(スキップテラス)': 'ビルのテラスの畑。季節の野菜やハーブが育てられている',
      '竹芝新八景「水田」(スキップテラス)': 'ビルのテラスに田んぼ！ 日本の稲作の文化を、海の見えるビルの上で体験できる',
      '竹芝新八景「蜂」(スキップテラス)': 'ミツバチの巣箱が置かれている。ミツバチは花粉を運んで、まわりの植物が実をつけるのを手伝う',
      '竹芝新八景「空」(低層部の屋上)': 'テラスのいちばん上。東京湾と浜離宮の森を見下ろせる',
      'WATERS takeshiba': '2020年に開業した、ホテル・劇場・お店の街。浜離宮恩賜庭園の目の前で、水辺の広場には船着場や干潟がある',
      'JR東日本四季劇場 [春][秋]': '劇団四季の専用劇場が2つ並ぶ。[春] の最初の演目は「アナと雪の女王」、[秋] は「オペラ座の怪人」だった',
      '水辺の階段広場 (WATERS takeshiba)': '海へ向かって下りていく木の階段。座って、浜離宮の森と行き交う船を眺められる',
      '竹芝干潟': 'ビルの前の海につくられた人工の干潟。潮だまりやヨシのあいだで、カニが横歩きしている (近づくと穴にかくれる)',
      '日の出桟橋': '東京の桟橋の中でいちばん古いといわれる桟橋。水上バスや東京湾をめぐる船が発着する',
      '大山 (旧芝離宮恩賜庭園)': '庭園でいちばん高い築山。登ると池と中島、まわりの高層ビルがぐるりと見渡せる',
      '汐留の歩行者デッキ': '汐留の高層ビルは2階の高さの歩行者デッキでつながっていて、車道を渡らずに駅からビルへ歩ける',
    });
    LM_NOTES['ジェットフォイルのりば (竹芝桟橋)'] = 'ジェットフォイルは、水中翼で船体を海面から浮かせて時速約80kmで走る「海を飛ぶ船」。竹芝から伊豆大島までの約120kmを1時間45分で結ぶ。ときどき東京湾へ飛び出していく';
    LM_NOTES['日の出桟橋'] += '。停まっている朱色の船は御座船「安宅丸」。3代将軍・徳川家光がつくらせた巨大な船を、いまの観光船としてよみがえらせたもの';
    LM_ACH.push(['jetfoil', '🚤 海を飛ぶ船', 'ジェットフォイルが海面から浮き上がって走るところを近くで見る', () => JF.foil && Math.hypot(P.x - JF.g.position.x, P.z - JF.g.position.z) < 160],
      ['tanbo', '🌾 ビルの上の田んぼ', '東京ポートシティ竹芝のスキップテラスの田んぼに立つ', () => P.y > 13 && P.y < 16 && P.x > -86 && P.x < -74 && P.z > PC.z0 && P.z < PC.z1]);
    bakeFlush();
  },
});
