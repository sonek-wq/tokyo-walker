/* JY20 渋谷駅
   スクランブル交差点 (全方向が青になると人の波が一斉に渡る。車は信号で止まる) / ハチ公像とハチ公前広場 /
   QFRONTと大型ビジョン / 渋谷センター街 / SHIBUYA109 / 道玄坂・宮益坂 / MIYASHITA PARK (屋上公園) /
   渋谷スクランブルスクエア (屋上展望 SHIBUYA SKY) / 渋谷ヒカリエ / 渋谷ストリーム */
STATION({
  no: 20, name: '渋谷', kana: 'しぶや', roma: 'Shibuya', town: '渋谷',
  lat: 35.6580, lon: 139.7016, custom: true,
  build(st) {
    const Z = [-3400, -700, -2800, 0];
    LM_ZONES.push(rectPoly(...Z)); fr(...Z, '#9a958c');
    const RR = ringRes(Z, 16);
    const M = (key, bg, win, lit, step = 3, rows = 3) => LM_MAT(key, (x, y) => {
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 1; j < 32; j += rows) for (let i = 1; i < 32; i += step) { x.fillStyle = win; x.fillRect(i, j, step - 1, rows - 1); y.fillStyle = rnd() < lit ? pick(LIT) : '#000'; y.fillRect(i, j, step - 1, rows - 1); }
    });
    const ichimaru = LM_MAT('ichimaru', (x, y) => { x.fillStyle = '#c8ccd0'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let i = 0; i < 32; i += 4) { x.fillStyle = '#9aa0a6'; x.fillRect(i, 0, 1, 32); x.fillStyle = '#5a6670'; x.fillRect(i + 2, 0, 1, 32); if (rnd() < 0.6) { y.fillStyle = '#ffe8c8'; y.fillRect(i + 2, 0, 1, 32); } } });
    const hikarie = LM_MAT('hikarie', (x, y) => { x.fillStyle = '#5a7890'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32); for (let j = 0; j < 32; j += 2) for (let i = 0; i < 32; i += 2) if (rnd() < 0.5) { y.fillStyle = pick(LIT); y.fillRect(i, j, 1, 1); } x.strokeStyle = '#e8eef0'; x.lineWidth = 1.5; for (let k = -32; k < 64; k += 11) { x.beginPath(); x.moveTo(k, 32); x.lineTo(k + 16, 0); x.stroke(); } });
    const miyashita = M('miyashita', '#a8a8a0', '#4a6a4a', 0.4, 4, 4), qfront = M('qfront', '#3a4a58', '#6a8aa0', 0.6, 2, 2);

    // ===== 道路とスクランブル交差点 =====
    addRoads([[-3400, -298, -2800, -274, 'ew'], [-3080, -700, -3056, 0, 'ns', '井ノ頭通り・渋谷駅前の通り'], [-2884, -700, -2864, 0, 'ns', '明治通り (渋谷)']]);
    DIST_AREAS.push(['道玄坂', -3400, -298, -3086, -274], ['宮益坂', -2960, -298, -2800, -274], ['渋谷駅前 (ガード下)', -2990, -298, -2960, -274]);
    const XR = [-3080, -298, -3056, -274], XC = [-3068, -286];
    for (const d of [[1, 1], [1, -1]]) {   // 斜めの横断歩道
      const F = frame(XC[0], XC[1], d[0], d[1], -d[1], d[0]), L = 44;
      oDraw(F, -L / 2, -2.4, L / 2, 2.4, g => { g.fillStyle = '#e8e6dc'; for (let u = -L / 2; u < L / 2; u += 1.6) g.fillRect(u, -2.2, 0.8, 4.4); });
    }
    let sbyT = 0;
    const phase = () => { const p = sbyT % 64; return p < 18 ? 'EW' : p < 20 ? '-' : p < 38 ? 'NS' : p < 40 ? '-' : p < 62 ? 'WALK' : '-'; };
    ROAD_STOPS.push({ rect: [XR[0] - 7, XR[1] - 7, XR[2] + 7, XR[3] + 7], red: ns => phase() !== (ns ? 'NS' : 'EW') });
    // 歩行者用の信号 (角ごと)
    const walkM = lam({ color: 0xff4030, emissive: 0xff2010, emissiveIntensity: 1 }), poleM = lam({ color: 0x8a8e94 });
    const CORN = [[-3086, -304, -1, -1], [-3050, -304, 1, -1], [-3086, -268, -1, 1], [-3050, -268, 1, 1]];
    for (const [x, z] of CORN) { mesh(new THREE.CylinderGeometry(0.1, 0.12, 3.4, 5).translate(0, 1.7, 0), poleM, x, 0, z); mesh(new THREE.BoxGeometry(0.5, 0.9, 0.5), walkM, x, 3, z); solid(x - 0.2, z - 0.2, x + 0.2, z + 0.2, 0, 3.4, true); }
    // 人の波: 4つの角で信号待ちをして、全方向が青になると一斉に (斜めにも) 渡る
    const N = 168, CR = [], spot = c => { const [x, z, sx, sz] = CORN[c]; return [x + sx * rr(0.5, 9), z + sz * rr(0.5, 9)]; };
    for (let i = 0; i < N; i++) { const c = i % 4, [x, z] = spot(c); CR.push({ x, z, c, walk: false, tx: x, tz: z, v: 0, delay: 0, ph: rr(0, 6), ry: rr(0, 6) }); }
    const parts = [
      new THREE.InstancedMesh(new THREE.BoxGeometry(0.42, 0.8, 0.26).translate(0, 0.4, 0), lam({ color: 0xffffff }), N),
      new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.7, 0.3).translate(0, 1.15, 0), lam({ color: 0xffffff }), N),
      new THREE.InstancedMesh(new THREE.BoxGeometry(0.28, 0.3, 0.28).translate(0, 1.68, 0), lam({ color: 0xe0b896 }), N),
      new THREE.InstancedMesh(new THREE.BoxGeometry(0.3, 0.1, 0.3).translate(0, 1.86, 0), lam({ color: 0x201810 }), N),
    ];
    CR.forEach((p, i) => { parts[0].setColorAt(i, new THREE.Color(pick([0x2a2a35, 0x404a60, 0x6a5a48, 0x1a1a1e]))); parts[1].setColorAt(i, new THREE.Color(pick([0xd04030, 0x3060b0, 0xe8e0d0, 0x40a060, 0xe0b030, 0x303038, 0x8a5aa0, 0xf0a0b0, 0xf2f2ee, 0x1a1a1e]))); });
    for (const m of parts) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; scene.add(m); }
    let prevPh = '', dmyS = new THREE.Object3D();
    LM_UPDATERS.push((dt, t) => {
      sbyT = t; const ph = phase(), near = Math.hypot(P.x - XC[0], P.z - XC[1]) < 450;
      walkM.color.setHex(ph === 'WALK' ? 0x30e070 : 0xff4030); walkM.emissive.setHex(ph === 'WALK' ? 0x20c060 : 0xff2010);
      if (ph === 'WALK' && prevPh !== 'WALK') {
        for (const p of CR) if (rnd() < 0.88) { let c = Math.floor(rnd() * 3); if (c >= p.c) c++; p.c = c; [p.tx, p.tz] = spot(c); p.walk = true; p.delay = rr(0, 3); p.v = Math.hypot(p.tx - p.x, p.tz - p.z) / rr(11, 17); p.ry = Math.atan2(p.tx - p.x, p.tz - p.z); }
        if (Math.hypot(P.x - XC[0], P.z - XC[1]) < 90) toast('🚦 全方向の歩行者信号が青に！');
      }
      prevPh = ph;
      parts.forEach(m => m.visible = near); if (!near) return;
      CR.forEach((p, i) => {
        let bob = 0;
        if (p.walk) {
          if ((p.delay -= dt) <= 0) { const dx = p.tx - p.x, dz = p.tz - p.z, d = Math.hypot(dx, dz), s = p.v * dt;
            if (d <= s) { p.x = p.tx; p.z = p.tz; p.walk = false; p.ry += rr(-1, 1); } else { p.x += dx / d * s; p.z += dz / d * s; bob = Math.abs(Math.sin(t * 7 + p.ph)) * 0.06; } }
        }
        dmyS.position.set(p.x, bob, p.z); dmyS.rotation.set(0, p.ry, 0); dmyS.updateMatrix();
        for (const m of parts) m.setMatrixAt(i, dmyS.matrix);
      });
      for (const m of parts) m.instanceMatrix.needsUpdate = true;
    });

    // ===== ハチ公前広場 =====
    tiles(-3050, -268, -2992, -200, '#c0b6a4', '#aaa090', 2.5);
    for (const [x, z] of [[-3044, -206], [-3000, -206], [-3044, -262]]) ROUND.push([x, z, 0.9]);
    { // 忠犬ハチ公像 (秋田犬がお座りして駅の方を向く)
      const cx = -3030, cz = -236, H = chunkAt(cx, cz), b = (x0, y0, z0, x1, y1, z1) => pushBox(bucket(H, 'BRONZE'), bucket(H, 'BRONZE'), cx + x0, y0, cz + z0, cx + x1, y1, cz + z1);
      pushPrism('ISHIGAKI', 'ISHIGAKI', rectPoly(cx - 1.6, cz - 1, cx + 1.6, cz + 1), 0, 1.9);
      b(-0.7, 1.9, -0.32, 0.5, 2.5, 0.32); b(0.1, 2.3, -0.3, 0.6, 3.2, 0.3);          // 腰と胸
      b(0.55, 2.1, -0.25, 0.75, 2.6, -0.12); b(0.55, 2.1, 0.12, 0.75, 2.6, 0.25);    // 前脚
      b(0.35, 3.1, -0.22, 0.85, 3.55, 0.22); b(0.85, 3.15, -0.12, 1.05, 3.4, 0.12);  // 頭と鼻先
      b(0.4, 3.55, -0.2, 0.55, 3.8, -0.08); b(0.4, 3.55, 0.08, 0.55, 3.8, 0.2);      // 耳 (左耳は少し垂れている)
      b(-0.8, 2.3, -0.08, -0.6, 2.9, 0.08);                                           // 巻いた尾
      solid(cx - 1.6, cz - 1, cx + 1.6, cz + 1, 0, 3.8);
    }
    addBuilding(-2990, -262, -2978, -140, 12, 'station', { noRoofBox: true });             // JR渋谷駅 ハチ公口
    { const s = new THREE.Mesh(new THREE.PlaneGeometry(14, 2.4), glow(lam({ map: textTex('JR 渋谷駅 ハチ公口', '#2f7a3a', '#ffffff', 192, 26) }), 0xffffff, 0.8)); s.position.set(-2990.2, 8, -230); s.rotation.y = -Math.PI / 2; chunkAt(-2990, -230).group.add(s); }

    // ===== 交差点の四隅のビル =====
    addBuilding(-3122, -352, -3086, -304, 34, qfront, { noRoofBox: true });                // QFRONT
    { const v = mesh(new THREE.PlaneGeometry(40, 22), visionMat(0), -3085.7, 19, -328); v.rotation.y = Math.PI / 2; }
    { const v = mesh(new THREE.PlaneGeometry(26, 9), visionMat(2), -3104, 26, -303.7); }
    addBuilding(-3050, -352, -2992, -304, 28, 'office2', { noRoofBox: true });             // 駅前のビル (3面の大型ビジョン)
    for (const [x, s] of [[-3040, 4], [-3021, 1], [-3002, 6]]) { const v = mesh(new THREE.PlaneGeometry(16, 9), visionMat(s), x, 18, -303.7); }
    addBuilding(-3124, -268, -3086, -230, 30, 'glass', { noRoofBox: true });               // 交差点を見下ろす屋上のあるビル
    for (const r of [[-3124, -268, -3086, -267.4], [-3124, -230.6, -3086, -230], [-3124, -268, -3123.4, -230], [-3086.6, -268, -3086, -230]]) pushPrism('CONC', null, rectPoly(...r), 30, 31.2);
    stairs([-3130, -268, -3124, -232], 30, 'z-');
    addBuilding(-3220, -268, -3130, -236, 40, 'glass', { noRoofBox: true }); addBuilding(-3205, -264, -3165, -240, 130, 'glassDark');   // 渋谷マークシティ
    // SHIBUYA109 (道玄坂と文化村通りの分かれ目の円筒)
    pushPrism(ichimaru, 'ROOF', [[-3275, -303], [-3205, -303], [-3215, -333], [-3265, -338]], 0, 14);
    pushPrism(ichimaru, 'ROOF', regularPoly(-3240, -322, 15, 12), 0, 46);
    { const t = tex(256, 32, x => { x.fillStyle = '#d8dce0'; x.fillRect(0, 0, 256, 32); x.fillStyle = '#c81e5a'; x.font = 'bold 26px sans-serif'; x.textBaseline = 'middle'; for (let i = 0; i < 3; i++) x.fillText('109', 20 + i * 86, 17); });
      const m = glow(lam({ map: t, side: THREE.DoubleSide }), 0xffffff, 0.9); mesh(new THREE.CylinderGeometry(15.6, 15.6, 6, 12, 1, true), m, -3240, 42, -322); }
    // 渋谷センター街 (アーチの門と細い商店街)
    const XRES = [...RR, [-3124, -354, -3084, -302], [-3257, -340, -3200, -300]];
    shotengai([-3300, -432, -3092, -306], XRES, '渋谷センター街', '渋谷センター街');
    mixed([-3400, -700, -3086, -440], XRES); mixed([-3400, -432, -3306, -306], XRES);
    mixed([-3400, -268, -3226, 0], XRES); mixed([-3220, -228, -3086, 0], [...XRES, [-3132, -270, -3122, -228]]); mixed([-3050, -195, -2990, 0], [...RR, [-2992, -262, -2976, -140]]);
    // MIYASHITA PARK (線路沿いの細長い建物の屋上が公園)
    pushPrism(miyashita, 'GRASSTOP', rectPoly(-3045, -640, -2992, -420), 0, 17);
    for (let z = -632; z < -425; z += 13) ROUND.push([-3036, z, 0.85, 17], [-3001, z, 0.85, 17]);
    for (const r of [[-3045, -640, -2992, -639.4], [-3045, -640, -3044.4, -420], [-2992.6, -640, -2992, -420]]) pushPrism('CONC', null, rectPoly(...r), 17, 18.2);
    stairs([-3040, -420, -3030, -372], 17, 'z-');
    LM_CATS.push([-3018, -560, 17]);

    // ===== 線路の東側 =====
    addBuilding(-2950, -232, -2898, -168, 60, 'glass', { noRoofBox: true });             // 渋谷スクランブルスクエア
    addBuilding(-2944, -226, -2904, -174, 229, 'glassDark', { noRoofBox: true, paint: false });
    for (const r of [[-2944, -226, -2904, -225.4], [-2944, -174.6, -2904, -174], [-2944, -226, -2943.4, -174], [-2904.6, -226, -2904, -174]]) pushPrism('glass', null, rectPoly(...r), 229, 230.6);   // 屋上展望 SHIBUYA SKY のガラスの柵
    { const H = FAR, c = bucket(H, 'CONC'); pushBox(c, c, -2932, 229, -206, -2916, 232, -194); solid(-2932, -206, -2916, -194, 229, 232); }
    addBuilding(-2858, -206, -2806, -136, 40, 'glass', { noRoofBox: true }); addBuilding(-2852, -200, -2812, -142, 182, hikarie, { noRoofBox: true, paint: false });   // 渋谷ヒカリエ
    addBuilding(-2924, -128, -2892, -64, 180, 'glass');                                    // 渋谷ストリーム
    mixed([-2950, -700, -2888, -306], RR); mixed([-2860, -700, -2806, -306], RR); mixed([-2860, -268, -2806, -212], RR); office([-2860, -130, -2806, 0], RR);
    for (let z = -690; z < 0; z += 18) LM_STREET.push([-2887, z, 0.9], [-2861, z, 0.9]);

    LM_PEOPLE.push([[-3292, -368, -3096, -368], 30], [[-3390, -302, -3090, -302], 14], [[-3390, -270, -3130, -270], 12], [[-3046, -265, -2996, -205], 12],
      [[-2954, -302, -2810, -302], 10], [[-2888, -690, -2888, -10], 10], [[-2860, -690, -2860, -10], 10], [[-3084, -690, -3084, -310], 10], [[-3052, -690, -3052, -310], 8]);

    // ===== 名所の名前・入口・地図 =====
    st.ent = [-3014, -232]; st.ents = [st.ent, [-2925, -158]];
    SPOT_AREAS.push(
      ['渋谷スクランブル交差点', XR[0] - 6, XR[1] - 6, XR[2] + 6, XR[3] + 6], ['忠犬ハチ公像', -3036, -242, -3024, -230], ['ハチ公前広場', -3050, -268, -2978, -200],
      ['QFRONT', -3124, -354, -3084, -302], ['SHIBUYA109', -3260, -340, -3200, -300], ['渋谷マークシティ', -3222, -270, -3128, -234],
      ['スクランブル交差点を見下ろす屋上', -3126, -270, -3084, -228], ['MIYASHITA PARK (屋上公園)', -3047, -642, -2990, -418],
      ['渋谷スクランブルスクエア', -2952, -234, -2896, -166], ['渋谷ヒカリエ', -2860, -208, -2804, -134], ['渋谷ストリーム', -2926, -130, -2890, -62]);
    LM_LABELS.push(['スクランブル交差点', -3068, -310, '🚦', '渋谷スクランブル交差点'], ['ハチ公', -3030, -222, '🐕', '忠犬ハチ公像'], ['109', -3240, -345, '🛍', 'SHIBUYA109'],
      ['センター街', -3200, -380, '🛍', '渋谷センター街'], ['MIYASHITA PARK', -3018, -530, '🌳', 'MIYASHITA PARK (屋上公園)'], ['スクランブルスクエア', -2924, -245, '🏙', '渋谷スクランブルスクエア'],
      ['ヒカリエ', -2832, -215, '🏙', '渋谷ヒカリエ'], ['QFRONT', -3104, -360, '📺']);
    Object.assign(LM_NOTES, {
      '渋谷スクランブル交差点': '全方向の歩行者信号が一斉に青になる交差点。1回の青で最大3000人が渡るともいわれる',
      '忠犬ハチ公像': '亡くなった飼い主を渋谷駅で待ち続けた秋田犬。今の像は1948年の2代目',
      'ハチ公前広場': '待ち合わせの定番。像の前はいつも誰かが誰かを待っている',
      'QFRONT': '大きなビジョンがスクランブル交差点を見下ろす、渋谷の顔',
      'SHIBUYA109': '1979年開業。円筒形のタワーが道玄坂と文化村通りの分かれ目に立つ',
      '渋谷センター街': 'ファストフードと古着とゲームセンター。若者文化の発信地',
      'スクランブル交差点を見下ろす屋上': 'ここから見ると、青信号のたびに人の波が交差するのがよく分かる',
      'MIYASHITA PARK (屋上公園)': '線路沿いの細長い建物の屋上が公園になっている。2020年に生まれ変わった',
      '渋谷スクランブルスクエア': '高さ約230m。屋上の展望空間「SHIBUYA SKY」は渋谷でいちばん高い場所',
      '渋谷ヒカリエ': '2012年開業の高さ約183mの複合ビル。東急文化会館の跡地に建つ',
      '道玄坂': '鎌倉時代の武将・大和田道玄にちなむという坂。登った先は百軒店',
      '宮益坂': '坂の途中にある御嶽神社の門前町として栄えたことが名の由来',
    });
    LM_ACH.push(['scramble', '🚦 スクランブル', '渋谷スクランブル交差点を、全方向が青のときに真ん中で渡る', () => phase() === 'WALK' && Math.hypot(P.x - XC[0], P.z - XC[1]) < 7 && P.y < 2],
      ['shibuyasky', '🌆 渋谷のいちばん上', '渋谷スクランブルスクエアの屋上に立つ', () => P.y > 228 && inR([-2944, -226, -2904, -174], P.x, P.z)]);
  },
});
