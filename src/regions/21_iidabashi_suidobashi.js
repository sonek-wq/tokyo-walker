/* 飯田橋・神楽坂・水道橋 (神楽坂通りと毘沙門天・かくれんぼ横丁・CANAL CAFE・東京大神宮・小石川後楽園・東京ドームとドームシティ)
   飯田橋駅の西口 (牛込橋) を渡ると神楽坂。東口の南に東京大神宮。神田川の北に小石川後楽園と東京ドーム、その東にビッグ・オーとサンダードルフィン */
REGION({
  name: '飯田橋・水道橋',
  towns: [['神楽坂', -1200, -2950], ['富士見', -970, -2730], ['後楽', -700, -3060]],
  stations: ['飯田橋', '水道橋'],   // 駅のまわりを作り込んだ駅 (ファストトラベルで緑の枠)
  labels: [],
  build(r) {
    const SHU = lam({ color: 0xc8382a }), BLK = lam({ color: 0x24201e }), GOLD = lam({ color: 0xd8b040, emissive: 0x302000 });
    if (!WALL.IB_BLK) WALL.IB_BLK = BLK; if (!WALL.IB_SHU) WALL.IB_SHU = SHU;
    // ===== 神楽坂 (牛込橋から西へ上る坂。花街の名残の石畳の路地) =====
    const KA = [-1092, -2888], KB = [-1330, -3010];
    const KF = akRoad(KA, KB, 10, '神楽坂通り', { trees: false }), KL = Math.hypot(KB[0] - KA[0], KB[1] - KA[1]);
    const BZ = 128;   // 毘沙門天 (善國寺) の位置
    LM_ZONES.push(KF.rect(0, -25, KL, 25));   // 通りの両側の店 (自動の街を重ねない)
    let ALLEY = null;
    {
      const SW = ['和菓子', '甘味処', 'そば', '天ぷら', 'うなぎ', 'ビストロ', 'ワイン', '肉まん', 'パン', '雑貨', '手ぬぐい', '喫茶', '和装小物', '料亭', 'おでん', 'ジェラート'];
      const SWM = SW.map(w => glow(new THREE.MeshLambertMaterial({ map: textTex(w, '#2a1e14', '#f4ead8', 96, 24) }), '#ffe8c0', 0.6));
      const NOREN = [lam({ color: 0x2a3a6a }), lam({ color: 0x6a2a2a }), lam({ color: 0xe8e0d0 })];
      for (const sd of [-1, 1]) for (let u = 4; u < KL - 6;) {
        const w = Math.min(rr(7, 11), KL - 4 - u); if (sd > 0 && Math.abs(u + w / 2 - BZ) < 16) { u += w; continue; }   // 毘沙門天の前はあける
        pushPrism(pick(['resi2', 'JB_KS2', 'office2', 'brick', 'IB_BLK']), 'ROOF', KF.rect(u, sd * 10.5, u + w, sd * 24), 0, rr(6, 16));
        const [x, z] = KF.w(u + w / 2, sd * 10.4), ry = Math.atan2(-KF.vx * sd, -KF.vz * sd);
        bake(pick(SWM), new THREE.PlaneGeometry(Math.min(4, w - 1), 1).rotateY(ry).translate(x, 3.6, z));
        bake(pick(NOREN), new THREE.PlaneGeometry(Math.min(2.4, w - 2), 1).rotateY(ry).translate(...KF.w(u + w / 2, sd * 10.3).flatMap((v, i) => i ? [2.3, v] : [v])));
        u += w;
      }
      // 毘沙門天 善國寺 (朱の山門と本堂)
      const M = (u0, v0, u1, v1, y0, y1, k = 'IB_SHU') => pushPrism(k, 'ROOF', KF.rect(u0, v0, u1, v1), y0, y1);
      LM_ZONES.push(KF.rect(BZ - 16, 10, BZ + 16, 46)); polyFr(KF.rect(BZ - 16, 10, BZ + 16, 46), '#c8bca6');
      for (const du of [-5, -2, 2, 5]) M(BZ + du - 0.4, 11, BZ + du + 0.4, 11.8, 0, 5);
      oHip(KF, 'RF0', BZ - 6.5, 10, BZ + 6.5, 12.8, 5, 2.2, { over: 0.6 });   // 山門の屋根
      M(BZ - 8, 30, BZ + 8, 42, 0, 6.5, 'WOOD'); oHip(KF, 'RF0', BZ - 8, 30, BZ + 8, 42, 6.5, 4, { over: 1.2 });   // 本堂
      for (let du = -6; du <= 6; du += 4) bake(SHU, new THREE.BoxGeometry(0.4, 6, 0.4).translate(...KF.w(BZ + du, 29.6).flatMap((v, i) => i ? [3, v] : [v])));
      LM_PEOPLE.push([[...KF.w(BZ, 12), ...KF.w(BZ, 28)], 4]);
      // かくれんぼ横丁 (坂の南の石畳の細い路地。黒塀と料亭)
      const AU = 92, AF = ALLEY = frame(...KF.w(AU, -10.5), -KF.vx, -KF.vz, KF.ux, KF.uz);   // u は路地の奥へ
      LM_ZONES.push(AF.rect(0, -14, 56, 14)); polyFr(AF.rect(0, -2, 52, 2), '#8a8478');
      for (let u = 0; u < 52; u += 1.2) polyFr(AF.rect(u, -1.8, u + 0.6, 1.8), '#7a746a');
      for (const sd of [-1, 1]) { pushPrism('IB_BLK', 'ROOF', AF.rect(2, sd * 2.2, 50, sd * 2.6), 0, 2.4); for (let u = 4; u < 50; u += 14) pushPrism('WOOD', 'ROOF', AF.rect(u, sd * 3, u + 11, sd * 13), 0, 6.5); }
      const LAN = glow(lam({ color: 0xfff0d0 }), '#ffd890', 0.9);
      for (let u = 6; u < 50; u += 8) { const [x, z] = AF.w(u, 2.0); bake(LAN, new THREE.BoxGeometry(0.35, 0.5, 0.35).translate(x, 1.4, z)); }
      LM_PEOPLE.push([[...AF.w(2, 0), ...AF.w(48, 0)], 3]);
      SPOT_AREAS.unshift(['かくれんぼ横丁', ...polyBB(AF.rect(0, -3, 52, 3))], ['毘沙門天 善國寺', ...polyBB(KF.rect(BZ - 16, 10, BZ + 16, 46))]);
      SPOT_AREAS.push(['神楽坂', ...polyBB(KF.rect(0, -24, KL, 24))]);
      LM_LABELS.push(['神楽坂', ...KF.w(KL / 2, 0), '🏮'], ['毘沙門天', ...KF.w(BZ, 36), '⛩', '毘沙門天 善國寺'], ['かくれんぼ横丁', ...AF.w(30, 0), '🐾']);
    }
    // ===== CANAL CAFE (牛込濠に浮かぶデッキのカフェとボート乗り場) =====
    {
      const ux = 0.67, uz = -0.745, F = frame(-1135, -2794, ux, uz, uz, -ux);   // v は濠の外側 (新宿区側) 向き
      pushPrism('WOOD', 'WOOD', F.rect(-14, 1, 12, 9), -0.3, 0.3);
      for (let u = -14; u <= 12; u += 4) for (const v of [1.5, 8.5]) { const [x, z] = F.w(u, v); bake(lam({ color: 0x5a4632 }), new THREE.BoxGeometry(0.3, 3, 0.3).translate(x, -1.7, z)); }
      const WH = lam({ color: 0xf0ece0 }), UMB = lam({ color: 0x2a6a4a });
      for (const [u, v] of [[-10, 4], [-4, 5], [2, 4], [8, 5]]) { const [x, z] = F.w(u, v); bake(WH, new THREE.CylinderGeometry(0.6, 0.6, 0.8, 8).translate(x, 0.7, z)); bake(UMB, new THREE.ConeGeometry(1.8, 0.8, 8).translate(x, 2.6, z)); bake(WH, new THREE.CylinderGeometry(0.05, 0.05, 2.2, 4).translate(x, 1.4, z)); }
      LM_ZONES.push(F.rect(-14, 12, 12, 24)); pushPrism('resi2', 'ROOF', F.rect(-12, 13, 10, 21), 0, 4.5);
      const BOAT = lam({ color: 0xe8e4da });
      for (const [u, v, a] of [[-8, -3, 0.2], [-2, -5, -0.3], [5, -2, 0.5], [9, -6, 0]]) { const [x, z] = F.w(u, v); bake(BOAT, new THREE.BoxGeometry(1.4, 0.4, 3.4).rotateY(a + Math.atan2(ux, uz)).translate(x, -1.4, z)); }
      LM_PEOPLE.push([[...F.w(-12, 6), ...F.w(10, 6)], 5]);
      LM_HEIGHT_AREAS.unshift(['CANAL CAFE', (x, z, y) => y > -1 && y < 6 && inPoly(F.rect(-15, 0, 13, 24), x, z)]);
      LM_LABELS.push(['CANAL CAFE', ...F.w(0, 8), '☕']);
    }
    // ===== 東京大神宮 (「東京のお伊勢さま」。神明造の社殿) =====
    const DJ = [-996, -2792, -944, -2738], DX = (DJ[0] + DJ[2]) / 2;
    {
      LM_ZONES.push(rectPoly(...DJ)); fr(...DJ, '#c4bca6');
      tiles(DX - 3, DJ[1], DX + 3, -2760, '#d8d0bc', '#c8c0ac', 2);
      myojinTorii(DX, DJ[1] + 2, true, 5, 5.5, lam({ color: 0xc8c0b0 }), 0.3);   // 白木の鳥居
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(DX - 10, -2760, DX + 10, -2742), 0, 0.8);
      pushPrism('WOOD', 'ROOF', rectPoly(DX - 8, -2758, DX + 8, -2744), 0.8, 6);
      jRoof('RF_COPPER', DX - 9, -2759, DX + 9, -2743, 6, 4, { over: 0.8, ins: 0.02, flare: 0 });   // 切妻の屋根
      for (const sx of [-9.6, 9.6]) for (const t of [-1, 1]) bake(BLK, new THREE.BoxGeometry(0.25, 3.2, 0.25).rotateX(t * 0.6).translate(DX + sx, 10.6, -2751 + t * 0.6));   // 千木
      for (let dx = -6; dx <= 6; dx += 3) bake(GOLD, new THREE.CylinderGeometry(0.35, 0.35, 2.6, 6).rotateX(Math.PI / 2).translate(DX + dx, 10.3, -2751));   // 鰹木
      for (let k = 0; k < 18; k++) { const x = rr(DJ[0] + 2, DJ[2] - 2), z = rr(DJ[1] + 2, DJ[3] - 2); if (Math.abs(x - DX) > 6 && !inR([DX - 11, -2761, DX + 11, -2741], x, z)) ROUND.push([x, z, rr(0.9, 1.2)]); }
      LM_PEOPLE.push([[DX - 1.5, DJ[1] + 2, DX - 1.5, -2762], 8]);
    }
    // ===== 小石川後楽園 (1629年に水戸徳川家が造り始めた大名庭園) =====
    const KG = [-930, -3126, -722, -2950];
    {
      LM_ZONES.push(rectPoly(...KG)); fr(...KG, '#6f9450');
      const wall = (x0, z0, x1, z1) => pushPrism('TKSTONE', 'ROOF', rectPoly(x0, z0, x1, z1), 0, 2.4);
      wall(KG[0], KG[1], KG[2], KG[1] + 0.8); wall(KG[0], KG[3] - 0.8, KG[2], KG[3]); wall(KG[0], KG[1], KG[0] + 0.8, -3070); wall(KG[0], -3058, KG[0] + 0.8, KG[3]);
      wall(KG[2] - 0.8, KG[1], KG[2], -3000); wall(KG[2] - 0.8, -2988, KG[2], KG[3]);   // 西門と東門のところはあける
      // 大泉水 (琵琶湖に見立てた大きな池) と蓬莱島
      fe(-828, -3040, 58, 40, '#b8a888'); PONDS.push([-828, -3040, 50, 32]); fe(-828, -3040, 50, 32, '#2f6a62');
      POND_LAND.push(['e', -836, -3042, 9, 6]); fe(-836, -3042, 9, 6, '#5a7e44'); for (let k = 0; k < 5; k++) PINES.push([-836 + rr(-5, 5), -3042 + rr(-3, 3), 0.9]);
      // 円月橋 (水面に映ると満月に見える石の橋)
      PONDS.push([-900, -3002, 4, 12]); fe(-900, -3002, 4, 12, '#2f6a62');
      bake(lam({ color: 0x9a968a }), new THREE.TorusGeometry(3.4, 0.7, 6, 14, Math.PI).translate(-900, -0.6, -3002).rotateY(0));
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-904, -3003, -896, -3001), 2.4, 2.9);
      // 通天橋 (朱塗りの橋。秋は紅葉の名所) と小廬山
      fe(-770, -3100, 30, 6, '#4a6a3a');
      for (let k = 0; k < 10; k++) { const t = k / 9, x = -770 + (t - 0.5) * 2 * 0, z = -3108 + t * 16, y = 2 + Math.sin(t * Math.PI) * 1.6; bake(SHU, new THREE.BoxGeometry(3, 0.3, 1.8).translate(x, y, z)); }
      for (let k = 0; k < 40; k++) MAPLES.push([-770 + rr(-26, 26), -3100 + rr(-10, 10), rr(0.9, 1.2)]);
      for (let i = 0; i < 4; i++) pushPrism('GRASSTOP', 'GRASSTOP', regularPoly(-880, -3092, 13 - i * 3, 10), i * 1.2, (i + 1) * 1.2);
      // 西門・東門と、まわりの木
      for (const [x, z] of [[KG[0], -3064], [KG[2], -2994]]) for (const dz of [-6.5, 6.5]) pushPrism('WOOD', 'ROOF', rectPoly(x - 0.6, z + dz - 0.6, x + 0.6, z + dz + 0.6), 0, 3.6);
      for (let k = 0; k < 200; k++) { const x = rr(KG[0] + 3, KG[2] - 3), z = rr(KG[1] + 3, KG[3] - 3); if (Math.hypot((x + 828) / 60, (z + 3040) / 42) < 1 || Math.hypot(x + 900, z + 3002) < 14 || Math.hypot((x + 770) / 30, (z + 3100) / 12) < 1 || Math.hypot(x + 880, z + 3092) < 14) continue; (rnd() < 0.35 ? PINES : rnd() < 0.5 ? MAPLES : rnd() < 0.5 ? SAKURA : ROUND).push([x, z, rr(0.9, 1.4)]); }
      LM_PEOPLE.push([[-886, -3000, -770, -3000], 5], [[-770, -3080, -886, -3080], 4], [[-780, -3000, -720, -2994], 3]);
    }
    // ===== 東京ドーム (1988年開業。白い屋根の「ビッグエッグ」) =====
    const TD = [-560, -3060];
    {
      LM_ZONES.push(rectPoly(-668, -3168, -470, -2948)); tiles(-668, -3168, -470, -2948, '#cfc8b8', '#bfb8a8', 4);
      pushPrism(acGothic('TD_WALL', '#d8d8d4', '#3e4a56', null, { rowH: 6, step: 6, ww: 4, wh: 3, lit: 0.6 }), 'ROOF', regularPoly(...TD, 95, 32), 0, 20);
      const mem = tex(64, 64, g => { g.fillStyle = '#f2f2ee'; g.fillRect(0, 0, 64, 64); g.strokeStyle = '#c8ccd0'; g.lineWidth = 1; for (let i = 0; i < 64; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 64); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(64, i); g.stroke(); } });
      mem.wrapS = mem.wrapT = THREE.RepeatWrapping; mem.repeat.set(6, 3); mem.needsUpdate = true;
      mesh(new THREE.SphereGeometry(1, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(95, 36, 95), lam({ map: mem }), TD[0], 20, TD[1]);
      const RS = [95, 92, 86, 78, 67, 52, 32, 0];   // 屋根の上を歩けるよう、だんだんの見えない床を入れる
      for (let k = 0; k < RS.length - 1; k++) for (let z = -RS[k]; z < RS[k]; z += 8) { const zm = Math.min(Math.abs(z), Math.abs(z + 8)), c = Math.sqrt(Math.max(0, RS[k] ** 2 - zm * zm)) * 0.97; solid(TD[0] - c, TD[1] + z, TD[0] + c, TD[1] + z + 8, 20, 20 + 36 * Math.sqrt(1 - (RS[k + 1] / 95) ** 2) - 0.3); }
      LM_HEIGHT_AREAS.unshift(['東京ドームの屋根の上', (x, z, y) => y > 20 && Math.hypot(x - TD[0], z - TD[1]) < 96]);
      const sg = glow(new THREE.MeshLambertMaterial({ map: textTex('TOKYO DOME', '#1e3a8a', '#ffffff', 160, 24) }), '#ffffff', 0.7);
      mesh(new THREE.PlaneGeometry(22, 3.2), sg, TD[0], 15, TD[1] + 95.4, 0);
      pushPrism(acGothic('TD_HOTEL', '#e4e2dc', '#3e4a56', null, { rowH: 4, step: 3, ww: 2, wh: 2, lit: 0.6 }), 'ROOF', regularPoly(-500, -2962, 15, 6), 0, 155);   // 東京ドームホテル
      LM_PEOPLE.push([[-660, -2954, -480, -2954], 16], [[TD[0] - 100, -3060, TD[0] - 100, -2960], 8]);
    }
    // ===== 東京ドームシティ アトラクションズ (センターレス観覧車ビッグ・オーと、その輪をくぐるサンダードルフィン) =====
    const BO = [-400, 38, -3050];
    {
      LM_ZONES.push(rectPoly(-466, -3132, -360, -2950)); tiles(-466, -3132, -360, -2950, '#d4ccbc', '#c4bcac', 3);
      pushPrism('glass', 'ROOF', rectPoly(-440, -3010, -372, -2968), 0, 28);   // LaQua
      pushPrism('CONC', 'ROOF', rectPoly(-418, -3070, -382, -3030), 0, 8);    // 観覧車の土台
      const ring = new THREE.Group(); ring.position.set(...BO); scene.add(ring);
      const rm = lam({ color: 0xe8e8ec }), gm = [lam({ color: 0xe84a5a }), lam({ color: 0x3a8ad8 }), lam({ color: 0xf0c030 }), lam({ color: 0x40b070 })];
      const tor = new THREE.Mesh(new THREE.TorusGeometry(30, 1.0, 6, 48), rm); tor.rotation.y = Math.PI / 2; ring.add(tor);
      const tor2 = new THREE.Mesh(new THREE.TorusGeometry(31.6, 0.4, 4, 48), rm); tor2.rotation.y = Math.PI / 2; ring.add(tor2);
      const gons = [];
      for (let k = 0; k < 40; k++) { const g = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 2.2), gm[k % 4]); ring.add(g); gons.push([g, k / 40 * Math.PI * 2]); }
      LM_UPDATERS.push((dt, t) => { const a0 = t * 0.02; for (const [g, a] of gons) g.position.set(0, Math.sin(a + a0) * 33, Math.cos(a + a0) * 33); });
      for (const dz of [-14, 14]) pushPrism('CONC', null, rectPoly(BO[0] - 1, BO[2] + dz - 1, BO[0] + 1, BO[2] + dz + 1), 8, 14, { solid: false });
      // サンダードルフィン (LaQua の建物とビッグ・オーの輪の中をすり抜けるコースター)
      const C = new THREE.CatmullRomCurve3([[-452, 12, -2990], [-456, 40, -3050], [-450, 72, -3110], [-430, 66, -3124], [-414, 14, -3112], [-436, 30, -3070], [-430, 38, -3050],
        [-372, 38, -3050], [-350, 26, -3010], [-366, 18, -2984], [-406, 18, -2988], [-440, 14, -2984]].map(p => new THREE.Vector3(...p)), true, 'catmullrom', 0.3);
      const red = lam({ color: 0xd8302a }), white = lam({ color: 0xf0ece0 });
      mesh(new THREE.TubeGeometry(C, 200, 0.7, 5, true), red, 0, 0, 0);
      for (let k = 0; k < 60; k++) { const p = C.getPointAt(k / 60); if (p.y > 3 && !(Math.abs(p.x - BO[0]) < 20 && Math.abs(p.z - BO[2]) < 20)) bake(white, new THREE.CylinderGeometry(0.35, 0.35, p.y - 0.7, 5).translate(p.x, (p.y - 0.7) / 2, p.z)); }
      const car = new THREE.Group(); scene.add(car); for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 2.6), i % 2 ? white : lam({ color: 0x2a6ad8 })); b.position.z = (i - 1) * 2.8; car.add(b); }
      let ct = 0; LM_UPDATERS.push(dt => { const p0 = C.getPointAt(ct); ct = (ct + dt * Math.max(0.006, Math.min(0.03, (80 - p0.y) / 2400 + 0.006))) % 1; const p = C.getPointAt(ct), q = C.getPointAt((ct + 0.002) % 1); car.position.set(p.x, p.y + 1.1, p.z); car.lookAt(q.x, q.y + 1.1, q.z); });
      LM_PEOPLE.push([[-460, -3120, -460, -2960], 12], [[-366, -2960, -366, -3120], 8]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['東京大神宮', ...DJ], ['小石川後楽園', ...KG], ['東京ドーム', -668, -3168, -470, -2948], ['ビッグ・オー (東京ドームシティ)', -420, -3080, -380, -3020], ['東京ドームシティ アトラクションズ', -466, -3132, -360, -2950]);
    SPOT_AREAS.unshift(['円月橋 (小石川後楽園)', -906, -3016, -894, -2988], ['大泉水 (小石川後楽園)', -886, -3080, -770, -3000], ['通天橋 (小石川後楽園)', -790, -3112, -750, -3088]);
    LM_LABELS.push(['東京大神宮', DX, -2751, '💕'], ['小石川後楽園', -828, -3040, '🏯'], ['東京ドーム', ...TD, '⚾'], ['ビッグ・オー', BO[0], BO[2], '🎡', 'ビッグ・オー (東京ドームシティ)']);
    Object.assign(LM_NOTES, {
      '神楽坂通り': '飯田橋駅の西口から西へ上る坂道。和菓子屋やフランス料理の店が並ぶ、粋な大人の街',
      '神楽坂': '江戸時代から栄え、明治以降は花街として知られた。いまも石畳の路地に料亭が残る',
      '毘沙門天 善國寺': '「神楽坂の毘沙門さま」として親しまれるお寺。朱色の門が目印',
      'かくれんぼ横丁': '黒塀に囲まれた石畳の細い路地。前を歩く人がすぐ角を曲がって見えなくなるので、この名がついたといわれる',
      'CANAL CAFE': '外堀 (牛込濠) に浮かぶデッキのカフェ。となりのボート乗り場は1918年開設の、東京でいちばん歴史あるボート場',
      '牛込橋': '飯田橋駅の西口の橋。渡ると神楽坂',
      '東京大神宮': '1880年、伊勢神宮を東京から拝むために創建された「東京のお伊勢さま」。日本で初めて神前結婚式を行った神社で、縁結びの神様として人気',
      '小石川後楽園': '1629年に水戸徳川家の初代・頼房が造り始め、2代・光圀が完成させた庭園。「天下の憂いに先だって憂い、天下の楽しみに後れて楽しむ」という言葉から名づけられた',
      '円月橋 (小石川後楽園)': '水面に映ると満月のような丸に見える石の橋',
      '大泉水 (小石川後楽園)': '琵琶湖に見立てた大きな池。中の島は蓬莱島',
      '通天橋 (小石川後楽園)': '京都の東福寺の通天橋にならった朱塗りの橋。秋の紅葉が見事',
      '東京ドーム': '1988年開業の、日本初の全天候型多目的スタジアム。建築面積46,755m²は「東京ドーム何個分」という広さのたとえでおなじみ。屋根は空気の圧力で膨らませている',
      '東京ドームの屋根の上': '屋根の高さは地上約56m。中の気圧をまわりより少し高くして、膜の屋根を支えている',
      'ビッグ・オー (東京ドームシティ)': '直径60mの、世界初のセンターレス大観覧車 (まん中に軸がない)',
      '東京ドームシティ アトラクションズ': '最高傾斜80度・時速130kmのコースター「サンダードルフィン」は、ビッグ・オーの輪や建物の中をすり抜ける',
    });
    Object.assign(LM_TIPS, {
      '小石川後楽園': '水戸徳川家の庭園。半円の石橋「円月橋」は、水面に映る影と合わせると満月に見える。西門は飯田橋駅、東門は水道橋駅が近い',
      '東京大神宮': '縁結びのお守りが人気。すずらんの形の鈴がついたお守りを持つ人も多い',
      '東京ドームシティ アトラクションズ': '営業時間は季節や乗り物で変わる',
    });
    LM_ACH.push(['kagurazaka', '🏮 神楽坂さんぽ', '神楽坂のかくれんぼ横丁を歩く', () => P.y < 3 && inPoly(ALLEY.rect(2, -2, 50, 2), P.x, P.z)], ['domeroof', '⚾ ビッグエッグの上', '東京ドームの屋根の上に立つ', () => P.y > 20 && Math.hypot(P.x - TD[0], P.z - TD[1]) < 90]);
    bakeFlush();
  },
});
