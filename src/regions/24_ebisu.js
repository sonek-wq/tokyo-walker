/* 恵比寿 (西口のゑびす像・恵比寿横丁 / 東口から動く歩道の恵比寿スカイウォーク・恵比寿ガーデンプレイス:
   センター広場の大屋根・ガーデンプレイスタワー・シャトー・YEBISU BREWERY TOKYO・東京都写真美術館・恵比寿神社)
   座標は山手線の駅にそろえる (u = 線路の向き、目黒の方が +。v = 環の外向き = 西口の方が +) */
REGION({
  name: '恵比寿',
  towns: [['恵比寿南', -2700, 700], ['恵比寿 (ガーデンプレイス)', -2300, 700]],
  stations: ['恵比寿'],   // 駅のまわりを作り込んだ駅 (ファストトラベルで緑の枠)
  labels: [],
  build(r) {
    const F = stnFrame('恵比寿');
    const BRONZE = WALL.BRONZE, RED = lam({ color: 0xd83a2a }), WH = lam({ color: 0xf2f0ea });
    const GPT = acGothic('EB_TOWER', '#c8c4bc', '#3a4652', null, { rowH: 4, step: 3, ww: 2, wh: 3, lit: 0.55 });
    const BRICK = acGothic('EB_BRICK', '#8a3a28', '#2a2a2a', '#d8c8a8', { rowH: 8, step: 6, ww: 3, wh: 5, lit: 0.5, brick: '#6a2a1a' });
    const CHAT = acGothic('EB_CHAT', '#e2d6bc', '#4a5260', '#f4ecd8', { rowH: 8, step: 5, ww: 2, wh: 5, lit: 0.5 });
    const PHOTO = acGothic('EB_PHOTO', '#b8b4ac', '#4a5058', null, { rowH: 8, step: 8, ww: 6, wh: 4, lit: 0.3 });

    // ===== 西口: ゑびす像 (待ち合わせの目印) =====
    {
      const [x, z] = F.w(2, 46), ry = Math.atan2(F.ux, F.uz);
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(x, z, 1.6, 8), 0, 1.2);
      bake(BRONZE, new THREE.SphereGeometry(1.0, 8, 6).scale(1, 0.9, 0.9).translate(x, 2.0, z));    // ふくよかな体
      bake(BRONZE, new THREE.SphereGeometry(0.55, 8, 6).translate(x, 3.15, z));                       // 頭
      bake(BRONZE, new THREE.CylinderGeometry(0.35, 0.5, 0.5, 6).translate(x, 3.65, z));             // 烏帽子
      bake(RED, new THREE.SphereGeometry(0.5, 6, 4).scale(1.6, 0.8, 0.5).rotateY(ry).translate(...F.w(2.9, 46.4).flatMap((v, i) => i ? [2.0, v] : [v])));   // 小脇に抱えた鯛
      bake(lam({ color: 0x6a5032 }), new THREE.CylinderGeometry(0.04, 0.04, 3.4, 4).rotateZ(0.6).rotateY(ry).translate(...F.w(1.2, 46).flatMap((v, i) => i ? [3.2, v] : [v])));   // 釣竿
    }
    // ===== 恵比寿横丁 (ちょうちんの下がる屋根つきの飲み屋横丁) =====
    const YK = [-86, 100, -34, 114];
    LM_ZONES.push(F.rect(YK[0] - 2, YK[1] - 14, YK[2] + 2, YK[3] + 14)); oTiles(F, YK[0], 104, YK[2], 110, '#7a7268', '#6a6258', 1.5);
    {
      const LAN = glow(lam({ color: 0xf04030 }), '#ff7050', 1.0), LAN2 = glow(lam({ color: 0xfff0d0 }), '#ffd890', 0.9);
      for (const sd of [-1, 1]) for (let u = YK[0]; u < YK[2]; u += 6.5) {
        oBox(F, pick(['resi2', 'IB_BLK' in WALL ? 'IB_BLK' : 'WOOD', 'WOOD']), u, sd > 0 ? 110 : 90, u + 6, sd > 0 ? 124 : 104, 0, rr(4, 7));
        const [x, z] = F.w(u + 3, sd > 0 ? 109.6 : 104.4); bake(rnd() < 0.6 ? LAN : LAN2, new THREE.CylinderGeometry(0.28, 0.28, 0.55, 8).translate(x, 2.4, z));
      }
      oBox(F, 'ROOF', YK[0], 103.5, YK[2], 110.5, 3.6, 3.9, { solid: false });   // 通りをおおう屋根
      LM_PEOPLE.push([[...F.w(YK[0] + 2, 107), ...F.w(YK[2] - 2, 107)], 10]);
    }

    // ===== 恵比寿スカイウォーク (東口からガーデンプレイスへの動く歩道) =====
    const WA = F.w(8, -14), WB = F.w(150, -72), WL = Math.hypot(WB[0] - WA[0], WB[1] - WA[1]);
    const W = frame(...WA, WB[0] - WA[0], WB[1] - WA[1], F.vx, F.vz);
    LM_ZONES.push(W.rect(-2, -7, WL + 2, 7)); oTiles(W, 0, -4.5, WL, 4.5, '#d4d0c8', '#c4c0b8', 2);
    {
      const glass = new THREE.MeshLambertMaterial({ color: 0xbcd8e8, transparent: true, opacity: 0.4 });
      for (const sd of [-1, 1]) { oBox(W, 'CONC', 0, sd * 4.5, WL, sd * 4.8, 0, 1.0, { solid: false }); const [x, z] = W.w(WL / 2, sd * 4.65); bake(glass, new THREE.BoxGeometry(0.1, 2.6, WL).rotateY(W.ang).translate(x, 2.3, z)); }
      const [rx, rz] = W.w(WL / 2, 0); bake(glass, new THREE.BoxGeometry(9.6, 0.15, WL).rotateY(W.ang).translate(rx, 3.9, rz));
      for (let u = 0; u <= WL; u += 8) for (const sd of [-1, 1]) { const [x, z] = W.w(u, sd * 4.65); bake(WH, new THREE.BoxGeometry(0.2, 3.9, 0.2).translate(x, 1.95, z)); }
      // 動く歩道 (2本。行きと帰り)。帯の模様を動かし、乗った人を運ぶ
      const BELTS = [], mk = () => { const t = tex(8, 32, x => { x.fillStyle = '#3a3c40'; x.fillRect(0, 0, 8, 32); x.fillStyle = '#56585c'; for (let j = 0; j < 32; j += 4) x.fillRect(0, j, 8, 1); }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 20); return t; };
      for (const [v, dir] of [[-1.9, 1], [1.9, -1]]) {
        const t = mk(), m = lam({ map: t }), [x, z] = W.w(WL / 2, v);
        mesh(new THREE.PlaneGeometry(1.4, WL - 6).rotateX(-Math.PI / 2).rotateY(W.ang).translate(0, 0.06, 0), m, x, 0, z);
        for (const sd of [-1, 1]) bake(lam({ color: 0x2a2c30 }), new THREE.BoxGeometry(0.15, 1.0, WL - 6).rotateY(W.ang).translate(...W.w(WL / 2, v + sd * 0.85).flatMap((q, i) => i ? [0.5, q] : [q])));
        BELTS.push({ v, dir, t });
      }
      const SPD = 1.4;
      LM_UPDATERS.push(dt => {
        for (const b of BELTS) b.t.offset.y -= b.dir * dt * SPD / ((WL - 6) / 20) * 1;
        if (P.ride || P.boat || P.glider || P.y > 0.7) return;
        const dx = P.x - W.ox, dz = P.z - W.oz, u = dx * W.ux + dz * W.uz, v = dx * W.vx + dz * W.vz;
        if (u < 3 || u > WL - 3) return;
        for (const b of BELTS) if (Math.abs(v - b.v) < 0.75) {
          const mx = W.ux * b.dir * SPD * dt, mz = W.uz * b.dir * SPD * dt;
          if (!blockedAt(P.x + mx, P.z, P.y)) P.x += mx; if (!blockedAt(P.x, P.z + mz, P.y)) P.z += mz;
          P.onBelt = (P.onBelt || 0) + dt;
        }
      });
      LM_PEOPLE.push([[...W.w(2, -3.2), ...W.w(WL - 2, -3.2)], 10], [[...W.w(WL - 2, 3.2), ...W.w(2, 3.2)], 10]);
    }

    // ===== 恵比寿ガーデンプレイス (1994年、ビール工場の跡地にできた街) =====
    const GP = F.rect(118, -66, 300, -246);
    LM_ZONES.push(GP); oTiles(F, 118, -66, 300, -246, '#c8bca8', '#b8ac98', 3);
    // センター広場の大きなガラスの屋根 (アーチ)
    {
      const RIB = lam({ color: 0xe8e8e4 }), GL = new THREE.MeshLambertMaterial({ color: 0xcfe4f0, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
      const th = Math.atan2(-F.vz, F.vx);
      for (let u = 150; u <= 212; u += 6) { const [x, z] = F.w(u, -130); bake(RIB, new THREE.TorusGeometry(22, 0.35, 4, 18, Math.PI).rotateY(th).translate(x, 0, z)); }
      for (let k = 1; k < 9; k++) { const a = k / 9 * Math.PI, [x, z] = F.w(181, -130 + Math.cos(a) * 22); bake(RIB, new THREE.BoxGeometry(0.25, 0.25, 62).rotateY(F.ang).translate(x, Math.sin(a) * 22, z)); }
      const sv = Math.sign(F.uz * F.vx - F.ux * F.vz) || 1;   // 箱の x 軸が +v / -v のどちらを向くか
      for (let k = 0; k < 9; k++) {
        const a0 = k / 9 * Math.PI, a1 = (k + 1) / 9 * Math.PI, am = (a0 + a1) / 2, w = 2 * 22 * Math.sin((a1 - a0) / 2), [x, z] = F.w(181, -130 + Math.cos(am) * 22);
        bake(GL, new THREE.BoxGeometry(w, 0.05, 62).rotateZ(Math.atan2(-sv * Math.cos(am), Math.sin(am))).rotateY(F.ang).translate(x, Math.sin(am) * 22, z));
      }
      // 冬 (11〜12月) は木に電飾
      const ILL = glow(lam({ color: 0xfff0c0 }), '#ffe8a0', 1.0);
      for (let u = 128; u < 296; u += 12) for (const v of [-74, -240]) { const [x, z] = F.w(u, v); ROUND.push([x, z, 1.0]); if (MONTH === 11 || MONTH === 12) for (let k = 0; k < 8; k++) bake(ILL, new THREE.SphereGeometry(0.15, 4, 3).translate(x + rr(-2, 2), rr(2.5, 6), z + rr(-2, 2))); }
    }
    oBox(F, GPT, 222, -96, 258, -132, 0, 167); oBox(F, 'CONC', 224, -98, 256, -130, 167, 168, { top: 'CONC' });
    frontSign(F, 240, -95.9, 1, 'YEBISU GARDEN PLACE', '#2a2a2a', '#e8c878', 18, 2.2, 12);
    roofLift(F.w(240, -92), [...F.w(240, -114)].flatMap((v, i) => i ? [168.05, v] : [v]), '🛗 恵比寿ガーデンプレイスタワーの上 (高さ167m)', '🛗 1階 (ガーデンプレイス)');
    // シャトー (フランスの城館を思わせる洋館のレストラン)
    oBox(F, CHAT, 228, -168, 268, -202, 0, 12); oHip(F, 'RF0', 228, -168, 268, -202, 12, 7, { over: 0.4 });
    for (const u of [236, 248, 260]) { oBox(F, CHAT, u - 2, -167, u + 2, -169, 12, 15); }
    // YEBISU BREWERY TOKYO (ヱビスビールの醸造所とミュージアム)
    oBox(F, BRICK, 156, -168, 204, -206, 0, 14); oHip(F, 'RF0', 156, -168, 204, -206, 14, 3, { over: 0.4 });
    frontSign(F, 180, -167.9, 1, 'YEBISU BREWERY TOKYO', '#5a1a12', '#e8c878', 14, 2, 10);
    // 東京都写真美術館
    oBox(F, PHOTO, 122, -168, 150, -214, 0, 16);
    for (let k = 0; k < 3; k++) { const [x, z] = F.w(150.1, -176 - k * 13), ry = Math.atan2(F.ux, F.uz); bake(lam({ color: [0x3a6a8a, 0x8a5a3a, 0x5a7a4a][k] }), new THREE.PlaneGeometry(10, 9).rotateY(ry).translate(x, 6, z)); }
    sideSign(F, 150.15, -200, 1, '東京都写真美術館', '#f0ece4', '#2a2a2a', 10, 1.6, 13.5);
    // 恵比寿神社 (ビール工場が商売繁盛の恵比寿さまを迎えた小さな神社)
    {
      const [x, z] = F.w(212, -228);
      oBox(F, 'WOOD', 208, -224, 216, -232, 0, 3.2); oHip(F, 'RF0', 207, -223, 217, -233, 3.2, 1.8, { over: 0.3 });
      myojinTorii(...F.w(212, -219), Math.abs(F.ux) > Math.abs(F.uz), 3.4, 3, lam({ color: 0xc8382a }), 0.2);
      void x; void z;
    }
    LM_PEOPLE.push([[...F.w(150, -120), ...F.w(212, -140)], 16], [[...F.w(212, -150), ...F.w(150, -110)], 14], [[...F.w(130, -160), ...F.w(290, -160)], 12], [[...F.w(270, -90), ...F.w(270, -230)], 8]);

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    rotSpots(F, [['ゑびす像', -4, 40, 8, 52], ['恵比寿神社', 204, -216, 220, -236], ['恵比寿横丁', YK[0], 90, YK[2], 124], ['センター広場 (ガーデンプレイス)', 150, -106, 212, -154], ['恵比寿ガーデンプレイスタワー', 222, -96, 258, -132],
      ['シャトー (ガーデンプレイス)', 228, -166, 268, -202], ['YEBISU BREWERY TOKYO', 156, -166, 204, -206], ['東京都写真美術館', 122, -166, 150, -214], ['恵比寿ガーデンプレイス', 118, -66, 300, -246]]);
    rotSpots(W, [['恵比寿スカイウォーク', 0, -5, WL, 5]]);
    LM_HEIGHT_AREAS.unshift(['恵比寿ガーデンプレイスタワーの上', (x, z, y) => y > 160 && inPoly(F.rect(220, -94, 260, -134), x, z)]);
    LM_LABELS.push(['ゑびす像', ...F.w(2, 46), '🎣'], ['恵比寿横丁', ...F.w(-60, 107), '🏮'], ['スカイウォーク', ...W.w(WL / 2, 0), '➡', '恵比寿スカイウォーク'], ['ガーデンプレイス', ...F.w(181, -130), '🍺', '恵比寿ガーデンプレイス'], ['YEBISU BREWERY', ...F.w(180, -186), '🍺', 'YEBISU BREWERY TOKYO']);
    Object.assign(LM_NOTES, {
      'ゑびす像': '西口の待ち合わせの目印。意外と目立たない場所にある。釣竿と鯛を持った恵比寿さま',
      '恵比寿横丁': 'ちょうちんの下がる屋根つきの横丁に、小さな飲み屋がぎっしり並ぶ',
      '恵比寿スカイウォーク': '東口から恵比寿ガーデンプレイスへ続く、動く歩道のある屋根つきの通路。昔はここにビールを積み出す貨物の線路があった',
      '恵比寿ガーデンプレイス': '1994年、サッポロビール恵比寿工場の跡地にできた街。地名の「恵比寿」は、ここで造られたビール「ヱビス」から生まれた',
      'センター広場 (ガーデンプレイス)': 'ガラスの大きなアーチ屋根の広場。冬はイルミネーションで彩られる',
      '恵比寿ガーデンプレイスタワー': '高さ167m、40階建ての超高層ビル',
      'シャトー (ガーデンプレイス)': 'フランスの城館を思わせる洋館。中はフランス料理のレストラン',
      'YEBISU BREWERY TOKYO': '2024年4月にできた、ヱビスビールの醸造所とミュージアム。館内のどこかに、数百本に1本の「ラッキーヱビス」の瓶が7つ隠れている',
      '東京都写真美術館': '写真と映像の美術館。外の壁に大きな写真が飾られている',
      '恵比寿神社': 'ビールの発売後の1893年、ビール会社が恵比寿さまの総本宮・西宮神社から迎えた神社。神社がもとで「恵比寿」になったのではない',
      '恵比寿駅': '駅名はビール「ヱビス」から。1901年2月25日、ビールを積み出すための貨物駅として開業した。発車メロディはヱビスビールのCMでおなじみの映画「第三の男」のテーマ',
    });
    Object.assign(LM_TIPS, {
      'YEBISU BREWERY TOKYO': '入場無料。平日12:00〜20:00、土日祝11:00〜19:00、火曜休み。ガイドツアー (約45分) は20歳以上1,800円で、公式サイトから予約。館内は現金が使えない',
    });
    LM_ACH.push(['skywalk', '➡ 動く歩道', '恵比寿スカイウォークの動く歩道に乗る', () => (P.onBelt || 0) > 8],
      ['ebisuzo', '🎣 ゑびす像', '恵比寿駅西口のゑびす像の前に立つ', () => P.y < 2 && Math.hypot(P.x - F.w(2, 46)[0], P.z - F.w(2, 46)[1]) < 4]);
    bakeFlush();
  },
});
