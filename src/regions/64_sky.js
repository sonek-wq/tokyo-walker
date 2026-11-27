/* 空を彩る乗り物と飾り (動くものは LM_UPDATERS で毎フレーム動かす)
   - 旅客機・ジャンボ (貨物機): 羽田空港に発着する。15〜19時は南風の日の「都心ルート」で新宿・渋谷・品川の上空を降りていき、
     それ以外の時間は東京湾の上を出入りする (羽田は地図の南の外)
   - 小型機 (調布の方角へ西へ)・輸送機 (横田の方角へ、高い空を北西へ)・高い空を横切る国際線
   - ヘリコプター: 東京ヘリポート (新木場の南端) から東京タワー・スカイツリーをめぐる遊覧、渋谷と新宿の上を回る報道ヘリ
   - 飛行船: 1929年に東京上空を旋回したツェッペリン伯号をイメージした銀色の硬式飛行船が、皇居・銀座・東京湾の上をゆっくり回る
   - 気球: 1877年に日本で最初の軍用気球の実験が行われた築地 (海軍省の練兵所。のちの築地市場の場所) に、係留された気球
   - 大凧と鯉のぼり: 浅草の隅田公園
   空の乗り物は霧で消えないよう fog:false。視線の先に来ると、ひとことの説明がトーストで出る */
REGION({
  name: '空',
  towns: [],
  labels: [],
  build(r) {
    const { spot, sign, windows, TREE_LISTS } = SL_KIT();
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); } if (col) fr(...R, col); };
    const MATS = {};
    const M = (c, o = {}) => MATS[c + JSON.stringify(o)] || (MATS[c + JSON.stringify(o)] = new THREE.MeshLambertMaterial({ color: c, fog: false, ...o }));
    const part = (g, geo, c, x = 0, y = 0, z = 0, o) => { const m = new THREE.Mesh(geo, M(c, o)); m.position.set(x, y, z); g.add(m); return m; };
    // 航空灯 (サイズ固定の点。夜も見える)
    const lightPts = (g, list) => {
      const geo = new THREE.BufferGeometry(), pos = [], col = [];
      for (const [x, y, z, c] of list) { pos.push(x, y, z); const cc = new THREE.Color(c); col.push(cc.r, cc.g, cc.b); }
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      const p = new THREE.Points(geo, new THREE.PointsMaterial({ size: 4, sizeAttenuation: false, vertexColors: true, fog: false, transparent: true, depthWrite: false }));
      g.add(p); return p;
    };
    const AX = new THREE.Vector3(1, 0, 0);
    // ---- 旅客機 (前が +x、右翼が +z) ----
    const airliner = ({ L = 60, span = 58, eng = 2, hump = false, tail = 0x1e4a8a, body = 0xf4f4f2, belly = 0xb4b8c0, prop = false, highWing = false }) => {
      const g = new THREE.Group(), r = L * 0.06;
      part(g, new THREE.CylinderGeometry(r, r, L * 0.72, 12).rotateZ(Math.PI / 2), body);
      part(g, new THREE.CylinderGeometry(r * 0.98, r * 0.98, L * 0.6, 12, 1, false, Math.PI * 0.75, Math.PI * 0.5).rotateZ(Math.PI / 2), belly, 0, -0.02, 0);
      part(g, new THREE.SphereGeometry(r, 12, 8).scale(1.9, 1, 1), body, L * 0.36);
      part(g, new THREE.ConeGeometry(r, L * 0.2, 12).rotateZ(Math.PI / 2), body, -L * 0.46);
      part(g, new THREE.BoxGeometry(r * 0.7, r * 0.35, r * 1.5), 0x2a3440, L * 0.43, r * 0.45);   // 操縦席の窓
      if (hump) part(g, new THREE.SphereGeometry(1, 12, 8).scale(L * 0.17, r * 0.75, r * 0.8), body, L * 0.2, r * 0.75);
      const wy = highWing ? r * 0.9 : -r * 0.35, sw = prop ? 0.05 : 0.5, ch = L * 0.16;
      for (const s of [-1, 1]) {
        const w = part(g, new THREE.BoxGeometry(ch, r * 0.18, span / 2), body, -L * 0.04 - Math.tan(sw) * span / 4, wy, s * span / 4); w.rotation.y = s * sw;
        const h = part(g, new THREE.BoxGeometry(ch * 0.55, r * 0.12, span * 0.18), body, -L * 0.44 - Math.tan(sw) * span * 0.09, r * (highWing ? 1.6 : 0.4), s * span * 0.09); h.rotation.y = s * sw;
        const EZ = eng === 4 ? [0.17, 0.33] : [0.19];
        for (const k of EZ) {
          const ex = -L * 0.04 - Math.tan(sw) * span * k + ch * 0.35, ez = s * span * k;
          if (prop) { part(g, new THREE.CylinderGeometry(r * 0.3, r * 0.3, L * 0.14, 8).rotateZ(Math.PI / 2), body, ex, wy - r * 0.1, ez); const pr = part(g, new THREE.BoxGeometry(0.15, L * 0.09, 0.4), 0x2a2a2a, ex + L * 0.075, wy - r * 0.1, ez); pr.userData.prop = true; }
          else part(g, new THREE.CylinderGeometry(r * 0.42, r * 0.36, L * 0.13, 10).rotateZ(Math.PI / 2), 0xd8dce0, ex, wy - r * 0.6, ez);
        }
      }
      part(g, new THREE.BoxGeometry(L * 0.13, L * 0.15, r * 0.18), tail, -L * 0.42, r + L * 0.07);   // 垂直尾翼
      part(g, new THREE.BoxGeometry(L * 0.72, r * 0.25, r * 0.2), tail, 0, -r * 0.2, r * 1.0);       // 胴体のライン (右)
      part(g, new THREE.BoxGeometry(L * 0.72, r * 0.25, r * 0.2), tail, 0, -r * 0.2, -r * 1.0);
      g.userData.lights = lightPts(g, [[-L * 0.04 - Math.tan(sw) * span / 2, wy, -span / 2, 0xff3030], [-L * 0.04 - Math.tan(sw) * span / 2, wy, span / 2, 0x30ff50], [-L * 0.5, r, 0, 0xffffff], [0, r + 0.3, 0, 0xff2020], [0, -r - 0.3, 0, 0xff2020]]);
      g.rotation.order = 'YZX'; g.visible = false; scene.add(g); return g;
    };
    // ---- ヘリコプター ----
    const heli = (c1, c2) => {
      const g = new THREE.Group();
      part(g, new THREE.SphereGeometry(1, 12, 8).scale(3.4, 1.6, 1.5), c1, 0, 1.6);
      part(g, new THREE.SphereGeometry(1, 10, 6).scale(1.6, 1.0, 1.25), 0x2a3a4a, 1.9, 1.95);   // 操縦席のガラス
      part(g, new THREE.BoxGeometry(6, 0.55, 0.55), c2, -5.6, 2.1);
      part(g, new THREE.BoxGeometry(1.4, 1.8, 0.2), c2, -8.4, 2.9);
      for (const z of [-1.1, 1.1]) part(g, new THREE.BoxGeometry(5, 0.12, 0.12), 0x3a3a3a, 0.2, 0, z);   // そり
      const rot = new THREE.Group(); rot.position.set(0, 3.4, 0); g.add(rot);
      for (const a of [0, Math.PI / 2]) { const b = part(rot, new THREE.BoxGeometry(11, 0.08, 0.45), 0x2a2a2a); b.rotation.y = a; }
      const tr = new THREE.Group(); tr.position.set(-8.4, 2.9, 0.25); g.add(tr);
      for (const a of [0, Math.PI / 2]) { const b = part(tr, new THREE.BoxGeometry(0.15, 2.2, 0.06), 0x2a2a2a); b.rotation.z = a; }
      g.userData.rot = rot; g.userData.tr = tr;
      g.userData.lights = lightPts(g, [[0, 0.3, 0, 0xff2020], [-8.6, 3.8, 0, 0xffffff]]);
      g.rotation.order = 'YZX'; scene.add(g); return g;
    };
    const tmpV = new THREE.Vector3(), tmpT = new THREE.Vector3();
    const orient = (g, tan, bank = 0) => { g.rotation.y = Math.atan2(-tan.z, tan.x); g.rotation.z = Math.atan2(tan.y, Math.hypot(tan.x, tan.z)); g.rotation.x = bank; };
    const blink = (g, t, ph = 0) => { const L = g.userData.lights; if (L) L.material.opacity = 0.35 + 0.65 * (Math.sin((t + ph) * 6) > 0.6 ? 1 : NIGHT > 0.3 ? 0.55 : 0.15); };
    const LOOKS = [];   // 視線の先に来たときのひとこと
    const look = (o, msg, size) => LOOKS.push({ o, msg, size, last: -999 });

    // ===== 羽田の発着 (旅客機・ジャンボ) =====
    const C3 = pts => new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
    const ROUTES = {
      city: { curve: C3([[-3500, 780, -6200], [-3200, 680, -4300], [-2950, 560, -2350], [-2900, 430, -250], [-2350, 330, 900], [-1500, 240, 1900], [-1000, 190, 2700], [-700, 150, 3400]]), speed: 72, every: 70, msg: '✈ 羽田へ降りていく旅客機。南風の日の15〜19時ごろは都心の上を通る' },
      bayIn: { curve: C3([[5200, 1100, -2600], [4000, 820, -1200], [2800, 520, 600], [1700, 330, 1900], [1100, 200, 3000], [800, 130, 3600]]), speed: 72, every: 80, msg: '✈ 東京湾の上から羽田へ降りていく旅客機' },
      bayOut: { curve: C3([[300, 120, 3500], [700, 260, 2500], [1700, 520, 1200], [3000, 820, -200], [4400, 1050, -1500], [5600, 1250, -2600]]), speed: 85, every: 95, msg: '✈ 羽田を飛び立ち、東京湾の上を上っていく' },
    };
    const LIVERY = [0x1e4a8a, 0xb02a2a, 0x1a2a4a, 0x2a7a8a, 0x6a3a8a];
    for (const [k, R] of Object.entries(ROUTES)) {
      R.len = R.curve.getLength(); R.pool = []; R.next = rr(3, 20);
      for (let i = 0; i < 4; i++) {
        const jumbo = k === 'bayOut' && i === 0;
        const g = jumbo ? airliner({ L: 70, span: 64, eng: 4, hump: true, tail: 0x3a4a5a, body: 0xf0f0ee }) : airliner({ L: i === 1 ? 66 : 44, span: i === 1 ? 62 : 36, tail: pick(LIVERY) });
        g.userData.u = -1; g.userData.jumbo = jumbo; R.pool.push(g);
        look(g, jumbo ? '✈ 4つのエンジンと2階建ての「こぶ」のジャンボ (貨物機)。旅客便ではもう日本の空から引退した' : R.msg, 40);
      }
    }
    const cityActive = () => gameH >= 15 && gameH < 19;
    LM_UPDATERS.push((dt, t) => {
      for (const [k, R] of Object.entries(ROUTES)) {
        const on = k === 'city' ? cityActive() : k === 'bayIn' ? !cityActive() : true;
        if (on && (R.next -= dt) <= 0) { const g = R.pool.find(p => p.userData.u < 0); if (g) { g.userData.u = 0; g.visible = true; } R.next = R.every * rr(0.8, 1.25); }
        for (const g of R.pool) {
          if (g.userData.u < 0) continue;
          g.userData.u += dt * R.speed / R.len;
          if (g.userData.u >= 1) { g.userData.u = -1; g.visible = false; continue; }
          R.curve.getPointAt(g.userData.u, g.position); R.curve.getTangentAt(g.userData.u, tmpT); orient(g, tmpT); blink(g, t, g.id);
        }
      }
    });

    // ===== 小型機 (調布へ)・輸送機 (横田へ)・高い空の国際線 =====
    const crossers = [
      { g: airliner({ L: 9, span: 11, eng: 1, prop: true, highWing: true, tail: 0xc03030, body: 0xf4f4f0, belly: 0xf4f4f0 }), a: [2600, 260, -1200], b: [-4600, 300, -2700], speed: 55, every: 150, msg: '🛩 西の調布飛行場のほうへ向かう小型機' },
      { g: airliner({ L: 30, span: 40, eng: 4, prop: true, highWing: true, tail: 0x6a7068, body: 0x8a9088, belly: 0x7a8078 }), a: [4400, 1300, 2800], b: [-4800, 1300, -4200], speed: 120, every: 260, msg: '✈ 高い空を北西の横田のほうへ向かう輸送機' },
      { g: airliner({ L: 64, span: 60, tail: 0x1a2a4a }), a: [-5200, 2200, 400], b: [6200, 2300, -1800], speed: 230, every: 200, msg: '✈ ずっと高い空を横切る旅客機' },
    ];
    for (const c of crossers) { c.u = -1; c.next = rr(10, 60); c.A = new THREE.Vector3(...c.a); c.B = new THREE.Vector3(...c.b); c.len = c.A.distanceTo(c.B); c.dir = c.B.clone().sub(c.A).normalize(); look(c.g, c.msg, 30); }
    LM_UPDATERS.push((dt, t) => {
      for (const c of crossers) {
        if (c.u < 0) { if ((c.next -= dt) <= 0) { c.u = 0; c.g.visible = true; } continue; }
        c.u += dt * c.speed / c.len;
        if (c.u >= 1) { c.u = -1; c.g.visible = false; c.next = c.every * rr(0.8, 1.3); continue; }
        c.g.position.lerpVectors(c.A, c.B, c.u); orient(c.g, c.dir); blink(c.g, t, 1.3);
        c.g.traverse(m => { if (m.userData.prop) m.rotation.x += dt * 40; });
      }
    });

    // ===== 東京ヘリポート (新木場の南端) =====
    const HP = [2404, 401, 2598, 447];
    {
      site(HP, '#8a8a84');
      const PADS = [[2440, 424], [2500, 424], [2560, 424]];
      for (const [x, z] of PADS) { fe(x, z, 14, 14, '#5a5c5e'); fe(x, z, 12.6, 12.6, '#f2f2ee'); fe(x, z, 12, 12, '#5a5c5e'); fr(x - 4, z - 5, x - 2.6, z + 5, '#f2f2ee'); fr(x + 2.6, z - 5, x + 4, z + 5, '#f2f2ee'); fr(x - 4, z - 0.7, x + 4, z + 0.7, '#f2f2ee'); }
      site([2602, 300, 2646, 398], '#8a8a84');
      pushPrism(windows('SKY_HANGAR', '#d8dcdc', '#4a5a66', 6, 2), 'CONC', rectPoly(2604, 330, 2644, 396), 0, 13);
      pushPrism(windows('SKY_HPTWR', '#e8e8e4', '#3a4a5a', 3, 4), 'CONC', rectPoly(2614, 304, 2634, 324), 0, 16);
      pushPrism('glass', 'CONC', rectPoly(2612, 302, 2636, 326), 16, 20);   // 対空通信室
      sign(2624, 326.4, 1, '東京ヘリポート', 9, 8, '#f4f4f0', '#1e3a6a');
      // とまっているヘリ (消防・警察)
      const fire = heli(0xd03a2a, 0xf0f0f0); fire.position.set(2560, 0, 424); fire.rotation.y = 2.4;
      // 遊覧ヘリ: パッドで待つ → 上昇 → 東京タワー・レインボーブリッジ・スカイツリーをめぐる → 降りる
      const tourPts = [[2440, 90, 424], [1800, 220, 200], [900, 240, 500], [380, 220, 820], [TOWER[0] + 220, 250, TOWER[1] + 120], [TOWER[0] + 120, 250, TOWER[1] - 220], [-300, 260, -1300], [700, 260, -2600], [1960 + 260, 300, -3296 + 120], [1960 - 160, 300, -3296 - 260], [2300, 240, -2200], [2600, 180, -400], [2440, 90, 424]];
      const tour = C3(tourPts), tourLen = tour.getLength();
      const shuttles = [{ g: heli(0x1e4a8a, 0xf0f0f0), pad: [2440, 424], ph: 0 }, { g: heli(0xf0f0f0, 0x2a7a5a), pad: [2500, 424], ph: 0.5 }];
      const SPEED = 50, T_WAIT = 25, T_UP = 14, T_CRUISE = tourLen / SPEED, T_ALL = T_WAIT + T_UP * 2 + T_CRUISE;
      for (const s of shuttles) { s.t = s.ph * T_ALL; look(s.g, '🚁 東京ヘリポートを飛び立った遊覧ヘリ。東京タワーとスカイツリーをめぐる', 12); }
      look(fire, '🚁 東京消防庁の航空隊も、この東京ヘリポートが基地のひとつ', 12);
      LM_UPDATERS.push((dt, t) => {
        for (const s of shuttles) {
          s.t = (s.t + dt) % T_ALL; const g = s.g, [px, pz] = s.pad; let spin = 1;
          const off = s === shuttles[1] ? 60 : 0;   // 2機目は少しずらしたパッドへ戻る
          if (s.t < T_WAIT) { g.position.set(px, 0, pz); spin = s.t > T_WAIT - 6 ? 0.6 : 0.15; g.rotation.set(0, 0.4, 0); }
          else if (s.t < T_WAIT + T_UP) { const k = (s.t - T_WAIT) / T_UP; g.position.set(px + (2440 - px) * k, 90 * k * k, pz); g.rotation.set(0, 0.4 + k * 2.2, 0); }
          else if (s.t < T_WAIT + T_UP + T_CRUISE) { const u = (s.t - T_WAIT - T_UP) / T_CRUISE; tour.getPointAt(u, g.position); tour.getTangentAt(u, tmpT); orient(g, tmpT, 0); g.rotation.z = -0.12; tour.getTangentAt(Math.min(1, u + 0.01), tmpV); g.rotation.x = Math.max(-0.35, Math.min(0.35, (tmpV.x * tmpT.z - tmpV.z * tmpT.x) * 25)); }
          else { const k = (s.t - T_WAIT - T_UP - T_CRUISE) / T_UP; g.position.set(2440 + (px - 2440) * k, 90 * (1 - k) * (1 - k), pz); g.rotation.set(0, 0.4, 0); }
          g.userData.rot.rotation.y += dt * 30 * spin; g.userData.tr.rotation.z += dt * 50 * spin; blink(g, t, off);
        }
      });
      spot('東京ヘリポート', [2404, 300, 2646, 447], '東京ヘリポート', '🚁', '1972年に開港した、国内最大の公共ヘリポート。遊覧飛行のほか、警視庁や東京消防庁の航空隊、新聞社・テレビ局の報道ヘリの基地にもなっている', 2500, 410);
    }

    // ===== 報道ヘリ (渋谷・新宿の上を回る) =====
    {
      const news = [{ g: heli(0xf4f4f4, 0x1e6ab0), c: [-3068, -290], r: 140, y: 230, w: 0.09 }, { g: heli(0xf4f4f4, 0xd0a020), c: [-2950, -2350], r: 180, y: 280, w: -0.07 }];
      for (const n of news) look(n.g, '🚁 上空を回る報道ヘリ', 12);
      LM_UPDATERS.push((dt, t) => {
        for (const n of news) {
          const a = t * n.w, s = Math.sign(n.w);
          n.g.position.set(n.c[0] + Math.cos(a) * n.r, n.y + Math.sin(t * 0.4) * 6, n.c[1] + Math.sin(a) * n.r);
          tmpT.set(-Math.sin(a) * s, 0, Math.cos(a) * s); orient(n.g, tmpT, 0.22 * s); n.g.rotation.z = -0.08;
          n.g.userData.rot.rotation.y += dt * 30; n.g.userData.tr.rotation.z += dt * 50; blink(n.g, t, 2);
        }
      });
    }

    // ===== 飛行船 (ツェッペリン伯号をイメージ) =====
    {
      const g = new THREE.Group(), SIL = 0xc4c8cc, L = 190, D = 26;
      part(g, new THREE.SphereGeometry(1, 24, 14).scale(L / 2, D / 2, D / 2), SIL);
      for (let k = -4; k <= 4; k++) part(g, new THREE.TorusGeometry(D / 2 * Math.sqrt(Math.max(0.02, 1 - (k * 20 / (L / 2)) ** 2)) + 0.05, 0.25, 4, 24).rotateY(Math.PI / 2), 0xa8acb0, k * 20);   // 骨組みの線
      part(g, new THREE.BoxGeometry(24, 4.2, 6).translate(0, -D / 2 - 1.6, 0), 0x8a8e92, L * 0.3);   // 前のゴンドラ
      for (const a of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) { const f = new THREE.Mesh(new THREE.BoxGeometry(22, 0.6, 12), M(SIL)); f.position.set(-L * 0.43 + Math.cos(a) * 0, Math.cos(a) * (D * 0.32 + 6), Math.sin(a) * (D * 0.32 + 6)); f.rotation.x = a; g.add(f); }
      for (const [x, s] of [[-10, 1], [-10, -1], [-40, 1], [-40, -1], [-62, 0]]) part(g, new THREE.SphereGeometry(1, 10, 6).scale(5, 2.2, 2.2), 0x8a8e92, x, -D * 0.42 - (s ? 0 : 3), s * D * 0.42);   // エンジンゴンドラ
      const win = part(g, new THREE.BoxGeometry(18, 1.2, 6.2).translate(0, -D / 2 - 1.2, 0), 0xffe0a0, L * 0.3, 0, 0, { emissive: 0xffd080, emissiveIntensity: 0 });
      g.userData.lights = lightPts(g, [[L * 0.5, 0, 0, 0xffffff], [-L * 0.5, 0, 0, 0xffffff], [0, -D / 2 - 4, D * 0.4, 0x30ff50], [0, -D / 2 - 4, -D * 0.4, 0xff3030]]);
      g.rotation.order = 'YZX'; scene.add(g);
      const C = [-250, -1350], RX = 1050, RZ = 850, Y = 420, W = 0.012;
      LM_UPDATERS.push((dt, t) => {
        const a = t * W; g.position.set(C[0] + Math.cos(a) * RX, Y + Math.sin(t * 0.05) * 15, C[1] + Math.sin(a) * RZ);
        tmpT.set(-Math.sin(a) * RX, 0, Math.cos(a) * RZ).normalize(); orient(g, tmpT, -0.03); g.rotation.z = Math.sin(t * 0.13) * 0.015;
        win.material.emissiveIntensity = NIGHT; blink(g, t, 3);
      });
      look(g, '🛸 銀色の硬式飛行船。1929年、ツェッペリン伯号が世界一周の途中で東京の上空を旋回した', 120);
    }

    // ===== 気球 (築地。1877年、日本で最初の軍用気球の実験) =====
    {
      const AXZ = [214, -652], g = new THREE.Group(), R = 10;
      const BAL = LM_MAT('SKY_BALLOON', (x) => { x.fillStyle = '#e8dcb8'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#8a6a4a'; for (let i = 0; i < 32; i += 4) { x.fillRect(i, 0, 1, 32); x.fillRect(0, i, 32, 1); } x.fillStyle = '#b8402a'; x.fillRect(0, 14, 32, 4); });
      const sph = new THREE.Mesh(new THREE.SphereGeometry(R, 18, 12), typeof BAL === 'string' ? WALL[BAL] : BAL); g.add(sph);
      part(g, new THREE.CylinderGeometry(1.3, 1.2, 1.4, 8), 0x7a5a3a, 0, -R - 4.2, 0);   // かご
      for (const a of [0.4, 2, 3.6, 5.2]) { const rp = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.6, 4), M(0x5a4a3a)); rp.position.set(Math.cos(a) * 1.1, -R - 1.6, Math.sin(a) * 1.1); rp.rotation.z = Math.cos(a) * 0.12; rp.rotation.x = -Math.sin(a) * 0.12; g.add(rp); }
      scene.add(g);
      const rope = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0x4a3a2a }));
      scene.add(rope);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(AXZ[0] - 1.5, AXZ[1] - 1.5, AXZ[0] + 1.5, AXZ[1] + 1.5), 0, 0.8);   // 綱をとめる石
      pushPrism('WOOD', 'WOOD', rectPoly(AXZ[0] + 4, AXZ[1] - 0.2, AXZ[0] + 4.3, AXZ[1] + 0.2), 0, 1.6);
      sign(AXZ[0] + 6.5, AXZ[1] + 0.3, 1, '気球の試験 (1877)', 5, 1.5, '#3a2a1a', '#f0e8d0');
      LM_UPDATERS.push((dt, t) => {
        g.position.set(AXZ[0] + Math.sin(t * 0.21) * 4, 72 + Math.sin(t * 0.33) * 2, AXZ[1] + Math.cos(t * 0.17) * 3);
        g.rotation.z = Math.sin(t * 0.21) * 0.05;
        const p = rope.geometry.attributes.position; p.setXYZ(0, AXZ[0], 0.8, AXZ[1]); p.setXYZ(1, g.position.x, g.position.y - R - 4.8, g.position.z); p.needsUpdate = true;
      });
      look(g, '🎈 築地の空の気球。1877年、ここ (海軍省の練兵所) で日本最初の軍用気球の実験が行われた', 10);
      SPOT_AREAS.unshift(['気球の試験の地 (築地)', AXZ[0] - 10, AXZ[1] - 10, AXZ[0] + 12, AXZ[1] + 10]);
      LM_NOTES['気球の試験の地 (築地)'] = '1877年5月、西南戦争で薩摩軍に囲まれた熊本城の救援に使う計画で、築地の海軍省の練兵所で日本で最初の軍用気球の実験が行われ、成功した。3代目の歌川広重も、そのようすを錦絵に描いている。空の気球は当時をイメージしたもの';
    }

    // ===== 大凧と鯉のぼり (浅草・隅田公園) =====
    {
      const kiteTex = (ch, c1, c2) => { const cv = document.createElement('canvas'); cv.width = 64; cv.height = 84; const x = cv.getContext('2d');
        x.fillStyle = '#f4ecd8'; x.fillRect(0, 0, 64, 84); x.strokeStyle = c1; x.lineWidth = 6; x.strokeRect(3, 3, 58, 78);
        x.fillStyle = c2; x.font = 'bold 44px "DotGothic16", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch, 32, 44);
        const t = new THREE.CanvasTexture(cv); t.magFilter = THREE.NearestFilter; TEXTURES.push(t); return t; };
      const kites = [[1530, -3803, '寿', '#c0282a', '#1a1a1a', 58], [1515, -3753, '龍', '#1e4a8a', '#c0282a', 70], [1500, -3703, '祭', '#2a7a3a', '#c0282a', 50]].map(([ax, az, ch, c1, c2, h], i) => {
        const g = new THREE.Group();
        const k = new THREE.Mesh(new THREE.PlaneGeometry(7, 9.2), new THREE.MeshLambertMaterial({ map: kiteTex(ch, c1, c2), side: THREE.DoubleSide, fog: false })); g.add(k);
        for (const s of [-1, 1]) { const tl = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 9), new THREE.MeshLambertMaterial({ color: c1, side: THREE.DoubleSide, fog: false })); tl.position.set(s * 2.4, -9, 0.05); g.add(tl); }
        scene.add(g);
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0x5a5a5a })); scene.add(line);
        look(g, '🪁 隅田川の上にあがる江戸凧', 8);
        return { g, line, ax, az, h, ph: i * 2.1 };
      });
      // 鯉のぼり (竿・矢車・吹き流し・真鯉・緋鯉・子鯉)
      const PX = 1488, PZ = -3603, PH = 24;
      pushPrism('WOOD', 'WOOD', rectPoly(PX - 0.25, PZ - 0.25, PX + 0.25, PZ + 0.25), 0, PH);
      const carpTex = (body, belly) => { const cv = document.createElement('canvas'); cv.width = 64; cv.height = 32; const x = cv.getContext('2d');
        x.fillStyle = body; x.fillRect(0, 0, 64, 32); x.fillStyle = belly; x.fillRect(0, 20, 64, 12);
        x.strokeStyle = 'rgba(255,255,255,0.35)'; for (let i = 14; i < 60; i += 6) for (let j = 2; j < 20; j += 6) { x.beginPath(); x.arc(i, j, 3, 0, Math.PI); x.stroke(); }
        x.fillStyle = '#fff'; x.beginPath(); x.arc(6, 8, 4, 0, 7); x.fill(); x.fillStyle = '#111'; x.beginPath(); x.arc(6, 8, 2, 0, 7); x.fill();
        const t = new THREE.CanvasTexture(cv); TEXTURES.push(t); return t; };
      const streamer = new THREE.Group(); streamer.position.set(PX, PH, PZ); scene.add(streamer);
      const flags = [];
      const fuki = new THREE.Group(); fuki.position.y = -1.2; streamer.add(fuki);
      ['#2a5ab0', '#e8e8e8', '#c0282a', '#e8c020', '#2a8a4a'].forEach((c, i) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(9, 0.45), new THREE.MeshLambertMaterial({ color: c, side: THREE.DoubleSide, fog: false })); s.position.set(4.5, -i * 0.45, 0); fuki.add(s); });
      flags.push({ o: fuki, ph: 0 });
      [['#1a1a22', '#c8a040', 10, 1.6], ['#c0282a', '#f0e0d0', 8, 1.3], ['#2a5ab0', '#e0e8f0', 6, 1.0]].forEach(([b, w, len, rad], i) => {
        const c = new THREE.Group(); c.position.y = -4 - i * 3.6; streamer.add(c);
        const m = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.55, rad, len, 12, 1, true).rotateZ(-Math.PI / 2).translate(len / 2, 0, 0), new THREE.MeshLambertMaterial({ map: carpTex(b, w), side: THREE.DoubleSide, fog: false }));
        c.add(m); flags.push({ o: c, ph: i * 0.9 }); look(c, '🎏 隅田公園の鯉のぼり', 6);
      });
      const yaguruma = new THREE.Group(); yaguruma.position.set(PX, PH + 0.6, PZ); scene.add(yaguruma);
      for (let i = 0; i < 8; i++) { const v = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 0.04), M(0xd8c040)); v.position.y = 0.7; const arm = new THREE.Group(); arm.rotation.z = i / 8 * Math.PI * 2; arm.add(v); yaguruma.add(arm); }
      LM_UPDATERS.push((dt, t) => {
        for (const k of kites) {
          k.g.position.set(k.ax + 42 + Math.sin(t * 0.5 + k.ph) * 4, k.h + Math.sin(t * 0.7 + k.ph) * 2.5, k.az + Math.cos(t * 0.37 + k.ph) * 5);
          k.g.rotation.set(-0.35 + Math.sin(t * 1.1 + k.ph) * 0.06, -Math.PI / 2 + 0.25, Math.sin(t * 0.9 + k.ph) * 0.18);
          const p = k.line.geometry.attributes.position; p.setXYZ(0, k.ax, 1, k.az); p.setXYZ(1, k.g.position.x, k.g.position.y - 3, k.g.position.z); p.needsUpdate = true;
        }
        for (const f of flags) { f.o.rotation.y = Math.sin(t * 0.8 + f.ph) * 0.25; f.o.rotation.z = -0.12 + Math.sin(t * 2.2 + f.ph) * 0.08; f.o.children.forEach((c, j) => { c.rotation.x = Math.sin(t * 3 + f.ph + j) * 0.25; }); }
        yaguruma.rotation.y += dt * 4;
      });
    }

    // ===== 視線の先の空の乗り物に、ひとこと =====
    {
      let tick = 0; const dir = new THREE.Vector3(), v = new THREE.Vector3();
      LM_UPDATERS.push((dt, t) => {
        if ((tick -= dt) > 0) return; tick = 0.3;
        camera.getWorldDirection(dir);
        for (const L of LOOKS) {
          if (!L.o.visible || t - L.last < 60) continue;
          L.o.getWorldPosition(v); v.sub(camera.position); const d = v.length(); if (d > 2600 || d < 5) continue;
          if (v.dot(dir) / d > Math.cos(Math.max(0.035, Math.atan(L.size / d)))) { L.last = t; toast(L.msg); toastTimer = 4.5; break; }
        }
      });
    }
    globalThis.__SKY = { ROUTES, crossers, LOOKS };   /* テスト用 */
    if (LM_NOTES['渋谷スクランブル交差点']) LM_NOTES['渋谷スクランブル交差点'] += '。南風の日の15〜19時ごろには、羽田空港へ着陸する旅客機が高度約750mで頭上を通る';
  },
});
