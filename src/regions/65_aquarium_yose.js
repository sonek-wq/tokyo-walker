/* しながわ水族館と新宿末廣亭
   - しながわ水族館: 本当は品川駅から京急で6駅ほど南の勝島 (しながわ区民公園の中) にある。地図の外なので、
     品川区の南のはし (天王洲の南、運河ぞい) に、区民公園ごと置いている
   - 新宿末廣亭 (新宿三丁目。明治通りの東): 東京の寄席の定席でただひとつの木造の建物
   (サンシャイン水族館は regions/22_ikebukuro.js のサンシャインシティの屋上に作成済み) */
REGION({
  name: 'しながわ水族館・末廣亭',
  towns: [['勝島 (しながわ区民公園)', -650, 2360]],
  labels: [],
  build(r) {
    const { C, spot, sign, signX, windows, TREE_LISTS } = SL_KIT();
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); } if (col) fr(...R, col); };

    // ===== しながわ区民公園としながわ水族館 =====
    {
      const PARK = [-694, 2300, -602, 2387], AQ = [-694, 2408, -602, 2490];
      site(PARK, '#6a9a4a'); site(AQ, '#c8c2b0');
      // 区民公園: 海水をひきこんだ大きな池「勝島の海」と散歩道
      fe(-650, 2342, 30, 22, '#8a8068'); fe(-650, 2342, 28, 20, '#2f6a78');
      tiles(-694, 2300, -688, 2387, '#d6ccb6', '#c6bca6', 1.6); tiles(-694, 2381, -602, 2387, '#d6ccb6', '#c6bca6', 1.6);
      for (let k = 0; k < 26; k++) { const x = rr(-690, -606), z = rr(2304, 2380); if (((x + 650) / 32) ** 2 + ((z - 2342) / 24) ** 2 < 1) continue; (rnd() < 0.3 ? SAKURA : ROUND).push([x, z, rr(0.85, 1.2)]); }
      for (const [x, z, a] of [[-620, 2318, -Math.PI / 2], [-680, 2366, Math.PI / 2], [-640, 2372, 0]]) BENCHES.push([x, z, a]);
      LM_PEOPLE.push([[-690, 2304, -690, 2384], 4], [[-688, 2384, -606, 2384], 5]);
      // 水族館の建物 (白い壁に波の帯。1階が「海面フロア」、地下が「海底フロア」)
      const AQW = LM_MAT('SN_AQWALL', (x, y) => {
        x.fillStyle = '#eef2f2'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
        x.fillStyle = '#3a8ac0'; for (let i = 0; i < 32; i++) { const h = 20 + Math.round(Math.sin(i / 32 * Math.PI * 4) * 2); x.fillRect(i, h, 1, 32 - h); }
        x.fillStyle = '#7ac0e0'; for (let i = 0; i < 32; i++) { const h = 24 + Math.round(Math.sin(i / 32 * Math.PI * 4 + 1) * 2); x.fillRect(i, h, 1, 2); }
        x.fillStyle = '#3e5a6a'; for (let i = 3; i < 32; i += 8) x.fillRect(i, 7, 5, 6); y.fillStyle = '#ffe6b0'; for (let i = 3; i < 32; i += 8) y.fillRect(i, 7, 5, 6);
      });
      pushPrism(AQW, 'CONC', rectPoly(-690, 2440, -640, 2486), 0, 11);
      pushPrism(C('SN_DOME', { color: 0x4a9ac8 }), 'CONC', regularPoly(-665, 2463, 14, 16), 11, 13.5);   // 青い丸屋根
      pushPrism(C('SN_DOME', { color: 0x4a9ac8 }), 'CONC', regularPoly(-665, 2463, 9, 16), 13.5, 15.5);
      pushPrism('glass', 'CONC', rectPoly(-676, 2434, -654, 2440), 0, 6);   // エントランス
      pushPrism(C('SN_ARCH', { color: 0x2a6aa8 }), 'CONC', rectPoly(-678, 2432.5, -652, 2434), 6, 7.5);
      sign(-665, 2432.2, -1, 'しながわ水族館', 10, 8.6, '#2a6aa8', '#ffffff');
      // アザラシ館 (ガラスの丸い建物)
      pushPrism('glass', 'CONC', regularPoly(-624, 2426, 9, 14), 0, 6);
      pushPrism(C('SN_DOME', { color: 0x4a9ac8 }), 'CONC', regularPoly(-624, 2426, 9.6, 14), 6, 7);
      // イルカのプール (運河側。まわりに客席)
      fe(-622, 2466, 14, 11, '#e8eef0'); fe(-622, 2466, 12, 9, '#3aa0c8');
      for (let k = 0; k < 3; k++) pushPrism(C('SN_SEAT', { color: 0x3a6a9a }), 'CONC', rectPoly(-638 - k * 2.4, 2452, -636 - k * 2.4, 2480), 0, 0.5 + k * 0.6);
      { const DOL = lam({ color: 0x7a8a9a }); const dol = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 6).scale(1.6, 0.55, 0.5), DOL); scene.add(dol);
        LM_UPDATERS.push((dt, t) => { const k = (t % 9) / 9, j = k < 0.35 ? k / 0.35 : -1; dol.visible = j >= 0; if (j < 0) return; dol.position.set(-630 + j * 16, Math.sin(j * Math.PI) * 4.5 - 0.6, 2466); dol.rotation.z = Math.cos(j * Math.PI) * 0.9; }); }   // ときどきジャンプするイルカ
      tiles(-690, 2412, -606, 2430, '#d8d0bc', '#c8c0ac', 2);
      for (const [x, z] of [[-692, 2414], [-646, 2414], [-604, 2440], [-604, 2488], [-692, 2488]]) ROUND.push([x, z, 0.95]);
      LM_PEOPLE.push([[-688, 2422, -606, 2422], 7], [[-642, 2456, -642, 2478], 3]);
      spot('しながわ水族館', AQ, 'しながわ水族館', '🐬', '1991年10月、運河を間近に望む「しながわ区民公園」の中に開館した区立の水族館。東京湾の川や海から世界の海へ、1階の「海面フロア」から地下の「海底フロア」へと、海にもぐっていくような順路になっている。トンネル水槽やアザラシ館が人気。本当は品川駅から京急で6駅ほど南の勝島にある', -665, 2460);
      spot('しながわ区民公園', PARK, '区民公園', '🌳', '水族館のある大きな公園。海の水をひきこんだ「勝島の海」という池があり、運河ぞいを散歩できる', -650, 2342);
    }

    // ===== 新宿末廣亭 =====
    {
      const R = [-2680, -2264, -2646, -2226];
      site(R, '#b8b0a0');
      for (const A of [...TREE_LISTS, LM_STREET]) { const keep = A.filter(p => !inR([-2690, -2268, -2646, -2222], p[0], p[1])); A.length = 0; A.push(...keep); }   /* 正面をふさぐ街路樹をよける */
      const WOODF = LM_MAT('SUE_FRONT', (x, y) => {   // 木の板壁と、演者の名を書いた白い招き看板が並ぶ正面 (文字は線だけ)
        x.fillStyle = '#5a3a22'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
        x.fillStyle = '#4a2e1a'; for (let i = 0; i < 32; i += 2) x.fillRect(i, 0, 1, 32);
        for (let i = 1; i < 32; i += 3) { x.fillStyle = '#f2ece0'; x.fillRect(i, 2, 2, 14); x.fillStyle = '#1a1a1a'; for (let j = 4; j < 15; j += 3) x.fillRect(i + (j % 2 ? 0 : 1), j, 1, 2); }
        x.fillStyle = '#2a2a2a'; x.fillRect(0, 20, 32, 12); y.fillStyle = '#ffd890'; for (let i = 2; i < 32; i += 6) y.fillRect(i, 22, 4, 8);
      });
      pushPrism(WOODF, 'WOOD', rectPoly(-2676, -2260, -2650, -2230), 0, 8.5);
      jRoof('RF0', -2678, -2262, -2648, -2228, 8.5, 3.6, { over: 0.8, kind: 'irimoya' });
      // 1階の正面のひさし (明治通り側) と提灯
      pushPrism('WOOD', 'WOOD', rectPoly(-2678.6, -2259, -2676, -2231), 3.9, 4.2);
      jRoof('RF0', -2679.6, -2259.5, -2676, -2230.5, 4.2, 0.9, { over: 0.2, kind: 'hip' });
      { const RED = lam({ color: 0xd03a2a, emissive: 0x501008 }), WH = lam({ color: 0xf2ece0, emissive: 0x403830 });
        for (let z = -2257; z <= -2233; z += 3) bake((z / 3) % 2 ? RED : WH, new THREE.CylinderGeometry(0.42, 0.42, 0.85, 8).translate(-2678.3, 3.35, z)); }
      signX(-2679.8, -2245, -1, '末廣亭', 6, 6.8, '#f4ecd8', '#1a1a1a');
      for (const z of [-2263, -2227]) { pushPrism('WOOD', 'WOOD', rectPoly(-2679, z - 0.15, -2678.6, z + 0.15), 0, 3.8); }   // のぼりの竿
      LM_PEOPLE.push([[-2683, -2260, -2683, -2232], 4]);
      spot('新宿末廣亭', R, '末廣亭', '🎭', '1897年 (明治30年) に「堀江亭」として始まった寄席。戦災で焼けたあと、1946年3月にいまの木造の建物で再建された。東京の落語の定席では、ただひとつの木造の建物。落語協会と落語芸術協会が10日ずつ交代で高座をつとめ、2011年には新宿区の地域文化財の第1号になった', -2663, -2245);
    }
    bakeFlush();
  },
});
