/* 神保町・駿河台下 (古書店街・三省堂書店 神田神保町本店・すずらん通り・お茶の水楽器店街・神田スポーツ店街・学士会館)
   靖国通り (z ≒ -2532) と白山通り (x ≒ -423) が交わる神保町交差点から、駿河台下 (明大通りとの交差点) まで、靖国通りの南側に古書店が並ぶ
   明大通りを北へ上ると楽器店街を抜けて御茶ノ水 (regions/04_ochanomizu.js) */
REGION({
  name: '神保町',
  towns: [['神田神保町', -360, -2500], ['神田小川町', -160, -2520], ['一ツ橋', -380, -2400], ['西神田', -470, -2600]],
  labels: [],
  build(r) {
    const YZ0 = -2540, YZ1 = -2524;   // 靖国通り
    acRoad([-600, YZ0, -100, YZ1], 'ew', '靖国通り', { trees: false });
    acRoad([-431, -2760, -415, -2380], 'ns', '白山通り');
    acRoad([-238, -2640, -226, -2545], 'ns', '明大通り', { trees: false });
    LM_HEIGHT_AREAS.push(['神保町交差点', (x, z, y) => y < 3 && inR([-436, YZ0 - 6, -410, YZ1 + 6], x, z)], ['駿河台下 (交差点)', (x, z, y) => y < 3 && inR([-243, YZ0 - 6, -221, YZ1 + 6], x, z)]);
    const KS = (key, bg, frame) => LM_MAT(key, (x, y) => {   // 古書店: 上は窓、1階は本棚
      x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
      for (let j = 2; j < 22; j += 6) for (let i = 2; i < 32; i += 6) { x.fillStyle = '#3e4a56'; x.fillRect(i, j, 4, 4); y.fillStyle = rnd() < 0.5 ? pick(LIT) : '#000'; y.fillRect(i, j, 4, 4); }
      x.fillStyle = frame; x.fillRect(0, 24, 32, 8);
      for (let i = 1; i < 31; i++) for (const j of [25, 28]) { x.fillStyle = pick(['#8a3a2a', '#2a4a6a', '#c8b47a', '#3a5a3a', '#6a4a2a', '#d8d0c0']); x.fillRect(i, j, 1, 2); }
      y.fillStyle = '#5a4020'; y.fillRect(0, 24, 32, 8);
    });
    const KSM = [KS('JB_KS0', '#c8beac', '#4a3424'), KS('JB_KS1', '#9a9488', '#3a2a1e'), KS('JB_KS2', '#d8d2c6', '#5a3a26'), KS('JB_KS3', '#b0a08a', '#3e2e22')];
    const BOOKW = ['古書', '古本', '洋書', '和本', '美術書', '映画', '演劇', '漫画', '文学', '歴史', '地図', '絵葉書', '詩歌', '思想', '自然科学', '鉄道'];
    const signs = BOOKW.map(w => glow(new THREE.MeshLambertMaterial({ map: textTex(w, '#f2ead8', '#2a1e14', 96, 24) }), '#fff0c8', 0.5));
    const spines = tex(32, 16, g => { for (let i = 0; i < 32; i++) { g.fillStyle = pick(['#8a3a2a', '#2a4a6a', '#c8b47a', '#3a5a3a', '#6a4a2a', '#d8d0c0', '#4a3a5a']); g.fillRect(i, 0, 1, 16); } });
    const cartM = lam({ map: spines }), wood = lam({ color: 0x6a4a30 });
    // ===== 古書店街 (靖国通りの南側。北向きの店が日差しから本を守る) =====
    const ROW0 = -412, ROW1 = -246;   // 神保町交差点の東 〜 三省堂の手前
    {
      LM_ZONES.push(rectPoly(ROW0, YZ1 + 5, -240, -2478));
      for (let x = ROW0; x < ROW1 - 5;) {
        const w = Math.min(rr(6, 11), ROW1 - x), h = rr(9, 24); pushPrism(pick(KSM), 'ROOF', rectPoly(x, YZ1 + 5, x + w, -2492), 0, h);
        bake(pick(signs), new THREE.PlaneGeometry(Math.min(4.5, w - 1), 1.1).rotateY(Math.PI).translate(x + w / 2, 4.6, YZ1 + 4.9));
        bake(cartM, new THREE.BoxGeometry(Math.min(3, w - 2), 0.6, 0.7).translate(x + w / 2, 0.9, YZ1 + 4.4)); bake(wood, new THREE.BoxGeometry(Math.min(3, w - 2), 0.6, 0.7).translate(x + w / 2, 0.3, YZ1 + 4.4));   // 店先の均一本ワゴン
        solid(x + w / 2 - 1.5, YZ1 + 4, x + w / 2 + 1.5, YZ1 + 4.8, 0, 1.2);
        x += w;
      }
      LM_PEOPLE.push([[ROW0 + 2, YZ1 + 3, -246, YZ1 + 3], 22], [[-246, YZ1 + 1.5, ROW0 + 2, YZ1 + 1.5], 12]);
    }
    // ===== 三省堂書店 神田神保町本店 (2026年3月、建て替えて再開。13階建て) =====
    {
      pushPrism(acGothic('JB_SANSEIDO', '#dcd8d0', '#3e4a56', '#c8c4ba', { rowH: 4, step: 3, ww: 2, wh: 2, lit: 0.55 }), 'ROOF', rectPoly(-268, YZ1 + 5, -244, -2490), 0, 52);
      pushPrism('glass', 'ROOF', rectPoly(-268, YZ1 + 5, -244, YZ1 + 7), 0, 16, { solid: false });
      mesh(new THREE.PlaneGeometry(16, 2.4), glow(new THREE.MeshLambertMaterial({ map: textTex('三省堂書店', '#1e2c5a', '#ffffff', 128, 24) }), '#1e2c5a', 0.8), -256, 18, YZ1 + 4.8, Math.PI);
    }
    // ===== すずらん通り (古書店街の裏の通り。喫茶店やカレー屋も) =====
    {
      tiles(ROW0, -2490, -244, -2482, '#c8bca8', '#b8ac98', 2); LM_ZONES.push(rectPoly(ROW0, -2490, -244, -2458));
      const POLE = lam({ color: 0x3a3a3a }), BULB = glow(lam({ color: 0xfff4d8 }), '#fff0c8', 0.9);
      for (let x = ROW0 + 4; x < -248; x += 12) { bake(POLE, new THREE.CylinderGeometry(0.08, 0.08, 4, 5).translate(x, 2, -2489)); bake(BULB, new THREE.SphereGeometry(0.35, 6, 4).translate(x, 4.1, -2489)); }
      const SW = ['喫茶', 'カレー', '古書', '中華', 'ギャラリー', '文房具', '喫茶', 'カレー', '古書', '書店'], SWM = [...new Set(SW)].reduce((o, w) => (o[w] = glow(new THREE.MeshLambertMaterial({ map: textTex(w, '#5a2a1a', '#fff0d0', 96, 24) }), '#ffd8a0', 0.8), o), {});
      for (let x = ROW0, i = 0; x < -250; i++) {
        const w = rr(7, 12); pushPrism(pick(['resi2', 'brick', 'JB_KS2', 'JB_KS1']), 'ROOF', rectPoly(x, -2481, x + w, -2460), 0, rr(8, 18));
        bake(SWM[SW[i % SW.length]], new THREE.PlaneGeometry(Math.min(4, w - 1), 1).rotateY(Math.PI).translate(x + w / 2, 3.4, -2481.1));
        x += w + 0.5;
      }
      LM_PEOPLE.push([[ROW0 + 2, -2486, -248, -2486], 12]);
    }
    // ===== 靖国通りの北側: 神保町交差点の北の古書店と、駿河台下から小川町へのスポーツ店街 =====
    {
      LM_ZONES.push(rectPoly(-410, -2575, -244, YZ0 - 5), rectPoly(-220, -2575, -110, YZ0 - 5));
      const SPW = ['SKI', 'SPORTS', '登山', 'RUN', 'GOLF', 'SNOW', 'OUTDOOR', 'TENNIS', 'SOCCER', 'BIKE'].map((w, i) => glow(new THREE.MeshLambertMaterial({ map: textTex(w, ['#d83a2a', '#2a6ad8', '#2a9a4a', '#e8a020'][i % 4], '#ffffff', 96, 24) }), '#ffffff', 0.6));
      for (const [x0, x1, kind] of [[-410, -246, 'book'], [-220, -112, 'sports']]) for (let x = x0; x < x1 - 5;) {
        const w = Math.min(rr(7, 13), x1 - x), h = rr(12, 30);
        pushPrism(kind === 'book' ? pick(KSM) : pick(['office', 'brick', 'resi2', 'office2']), 'ROOF', rectPoly(x, -2572, x + w, YZ0 - 5), 0, h);
        const sm = kind === 'book' ? pick(signs) : pick(SPW);
        bake(sm, new THREE.PlaneGeometry(Math.min(5, w - 1), 1.3).translate(x + w / 2, 5, YZ0 - 4.9));
        x += w;
      }
      LM_PEOPLE.push([[-408, YZ0 - 3, -112, YZ0 - 3], 18]);
    }
    // ===== お茶の水楽器店街 (明大通りの坂。ショーウィンドウにギターが並ぶ) =====
    {
      LM_ZONES.push(rectPoly(-268, -2618, -243, -2546), rectPoly(-221, -2645, -196, -2546));
      const GW = ['GUITAR', 'BASS', '楽器', 'DRUMS', 'GUITAR', 'AMP', 'EFFECTOR', 'GUITAR', 'PIANO', 'UKULELE'].map(w => glow(new THREE.MeshLambertMaterial({ map: textTex(w, '#1e1e22', '#f0d080', 96, 24) }), '#f0d080', 0.8));
      const gb = [lam({ color: 0xc83a2a }), lam({ color: 0x2a2a2e }), lam({ color: 0xd8a050 }), lam({ color: 0x3a6ab8 }), lam({ color: 0xf0ece0 })];
      for (const [x0, x1, fx, ry, z0, z1] of [[-268, -243, -242.6, Math.PI / 2, -2618, -2546], [-221, -196, -221.4, -Math.PI / 2, -2645, -2546]]) for (let z = z0; z < z1 - 5;) {
        const w = Math.min(rr(7, 11), z1 - z); pushPrism(pick(['office', 'brick', 'resi2', 'office2', 'JB_KS2']), 'ROOF', rectPoly(x0, z, x1, z + w), 0, rr(12, 30));
        bake(pick(GW), new THREE.PlaneGeometry(Math.min(5, w - 1), 1.3).rotateY(ry).translate(fx, 5.5, z + w / 2));
        for (let k = 0; k < 3; k++) {   // ショーウィンドウのギター
          const gz = z + 1.5 + k * (w - 3) / 2, gx = fx + (ry > 0 ? -0.25 : 0.25), m = pick(gb);
          bake(m, new THREE.CylinderGeometry(0.32, 0.32, 0.08, 10).rotateZ(Math.PI / 2).rotateY(ry + Math.PI / 2).translate(gx, 1.3, gz));
          bake(m, new THREE.CylinderGeometry(0.25, 0.25, 0.08, 10).rotateZ(Math.PI / 2).rotateY(ry + Math.PI / 2).translate(gx, 1.75, gz));
          bake(gb[1], new THREE.BoxGeometry(0.06, 0.8, 0.06).translate(gx, 2.3, gz));
        }
        z += w;
      }
      LM_PEOPLE.push([[-240, -2548, -240, -2636], 10], [[-224, -2636, -224, -2548], 8]);
    }
    // ===== 学士会館 (1928年完成。敷地は「東京大学発祥の地」) =====
    {
      LM_ZONES.push(rectPoly(-405, -2414, -340, -2366)); fr(-405, -2414, -340, -2366, '#b8b0a0');
      pushPrism(acGothic('JB_GAKUSHI', '#8a6450', '#2a2a30', '#b09078', { brick: '#7a5644', rowH: 8, step: 4, ww: 2, wh: 5 }), 'ROOF', rectPoly(-400, -2410, -346, -2372), 0, 18);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-411, -2394, -400, -2388), 0, 1.4);   // 記念碑
      bake(lam({ color: 0x8a8678 }), new THREE.BoxGeometry(0.4, 2, 1).translate(-409, 2.4, -2391));
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['三省堂書店 神田神保町本店', -270, YZ1 + 2, -242, -2488], ['すずらん通り', ROW0, -2490, -244, -2480], ['お茶の水楽器店街', -270, -2645, -194, -2546],
      ['神田スポーツ店街', -222, -2578, -110, YZ0], ['学士会館 (東京大学発祥の地)', -412, -2414, -340, -2366], ['神保町古書店街', ROW0, -2578, -244, -2490]);
    LM_LABELS.push(['古書店街', -330, -2510, '📚', '神保町古書店街'], ['三省堂書店', -256, -2505, '📖', '三省堂書店 神田神保町本店'], ['神保町交差点', -423, -2532, '🚦'], ['楽器店街', -232, -2600, '🎸', 'お茶の水楽器店街'],
      ['スポーツ店街', -165, -2556, '⛷', '神田スポーツ店街'], ['学士会館', -372, -2391, '🎓', '学士会館 (東京大学発祥の地)']);
    Object.assign(LM_NOTES, {
      '神保町古書店街': '約130軒の古書店が集まる、世界最大級の古書店街。明治のころ、まわりに大学が次々にでき、学生向けの本屋が集まったのが始まり',
      '神保町交差点': '靖国通りと白山通りが交わる、古書店街の中心',
      '三省堂書店 神田神保町本店': '1881年に古書店として創業した書店。2022年に建て替えで一時閉店し、2026年3月19日に13階建てのビルで再開した',
      'すずらん通り': '古書店街の裏にある通り。本を買ったあとに寄る喫茶店やカレー屋が多い',
      'お茶の水楽器店街': '御茶ノ水駅から駿河台下へ下る明大通りに、楽器店がずらりと並ぶ',
      '神田スポーツ店街': '駿河台下から小川町にかけて、スキーや登山などのスポーツ用品店が並ぶ',
      '駿河台下 (交差点)': '明大通りと靖国通りの交差点。北へ上ると楽器店街、西へ行くと古書店街',
      '学士会館 (東京大学発祥の地)': '1928年完成。この場所には東京大学の前身の学校があり、「東京大学発祥の地」の碑が立っている',
      '靖国通り': '毎年秋の「神田古本まつり」では、歩道に本のワゴンが並ぶ約500mの「本の回廊」ができる',
    });
    Object.assign(LM_TIPS, {
      '神保町古書店街': '秋 (10月下旬〜11月上旬) の「東京名物 神田古本まつり」は1960年に始まった本の祭典',
      '三省堂書店 神田神保町本店': '書店のフロアは1〜3階 (4階はキャラクターグッズの店)',
    });
    const seen = new Set();
    LM_UPDATERS.push(() => { if (P.z > YZ1 && P.z < YZ1 + 6 && P.x > ROW0 && P.x < -246) { seen.add(Math.floor((P.x - ROW0) / 42)); } });
    LM_ACH.push(['koshogai', '📚 本の街を端から端まで', '神保町古書店街の歩道を端から端まで歩く', () => seen.size >= 4]);
    bakeFlush();
  },
});
