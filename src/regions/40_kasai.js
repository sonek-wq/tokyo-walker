/* 葛西・江戸川区 (荒川と江戸川のあいだ。東西は強めに縮めてある)
   葛西臨海公園: ダイヤと花の大観覧車 (高さ117m・直径111m。ゆっくり回る) / 葛西臨海水族園 (ガラスドームとペンギン) / クリスタルビュー。
   京葉線の高架 (z ≒ 330〜410) の北に公園の大部分、南の海ぞいにクリスタルビュー。船堀タワーなどは regions/47_edogawa_east.js */
REGION({
  name: '葛西・江戸川',
  towns: [['西葛西', 3050, -900], ['葛西', 3300, -1000], ['臨海町', 3300, 40], ['船堀', 3150, -2000], ['一之江', 3450, -2150], ['瑞江', 3550, -1700], ['平井', 3000, -2950], ['小松川', 3050, -2550],
    ['新小岩', 3250, -2700], ['小岩', 3550, -2850], ['篠崎', 3600, -2250], ['葛西臨海公園', 3300, 300]],
  hubs: [{ x: 3300, z: -1000, town: 380 }, { x: 3050, z: -900, town: 300 }, { x: 3150, z: -2000, core: 100, town: 300 }, { x: 3250, z: -2700, town: 350 }, { x: 3550, z: -2850, town: 350 }],
  labels: [],
  build(r) {
    // ===== 葛西臨海公園 =====
    const PK = [2972, 70, 3632, 340];
    LM_ZONES.push(rectPoly(...PK), rectPoly(3430, 400, 3632, 478)); fr(...PK, '#6f9a4a'); fr(3430, 400, 3632, 478, '#7a9a5a');
    tiles(3130, 300, 3170, 345, '#cfc6b0', '#bfb6a0', 3); tiles(2980, 290, 3620, 302, '#cfc6b0', '#bfb6a0', 3);   // 駅前からの園路
    for (let k = 0; k < 160; k++) { const x = rr(2976, 3628), z = rr(74, 336); if (Math.hypot(x - 3060, z - 250) < 40 || Math.hypot(x - 3330, z - 220) < 46 || (z > 286 && z < 306)) continue; (rnd() < 0.55 ? PINES : rnd() < 0.5 ? ROUND : SAKURA).push([x, z, rr(1, 1.5)]); }
    // ---- ダイヤと花の大観覧車 (直径111m、高さ117m。68台のゴンドラが約17分で1周する)
    const WX = 3060, WZ = 250, WR = 55.5, WY = 61.5;
    {
      const ST = lam({ color: 0xe8ecf0 }), wheel = new THREE.Group(); wheel.position.set(WX, WY, WZ); scene.add(wheel);
      // 輪とスポークは1つのジオメトリにまとめる (描く回数を減らす)
      const parts = [], M4 = new THREE.Matrix4();
      for (const dz of [-3, 3]) parts.push(new THREE.TorusGeometry(WR, 0.5, 4, 72).translate(0, 0, dz));
      for (let k = 0; k < 34; k++) { const a = k / 34 * Math.PI * 2; parts.push(new THREE.BoxGeometry(0.25, WR, 0.25).applyMatrix4(M4.makeRotationZ(a - Math.PI / 2)).translate(Math.cos(a) * WR / 2, Math.sin(a) * WR / 2, 0)); }
      parts.push(new THREE.CylinderGeometry(3, 3, 9, 12).rotateX(Math.PI / 2));
      { let n = 0; const G = parts.map(g => g.index ? g.toNonIndexed() : g); for (const g of G) n += g.attributes.position.count;
        const Pp = new Float32Array(n * 3), Nn = new Float32Array(n * 3); let o = 0; for (const g of G) { Pp.set(g.attributes.position.array, o); Nn.set(g.attributes.normal.array, o); o += g.attributes.position.count * 3; }
        const W = new THREE.BufferGeometry(); W.setAttribute('position', new THREE.BufferAttribute(Pp, 3)); W.setAttribute('normal', new THREE.BufferAttribute(Nn, 3)); wheel.add(new THREE.Mesh(W, ST)); }
      const LED = lam({ color: 0xf0f4ff, emissive: 0xff80c0 }); LED.emissiveIntensity = 0;
      wheel.add(new THREE.Mesh(new THREE.TorusGeometry(WR - 1.2, 0.35, 3, 72), LED));
      // ゴンドラ (68台。いつも下向きにぶら下がる) は InstancedMesh で
      const GN = 68, gim = new THREE.InstancedMesh(new THREE.BoxGeometry(2.4, 2.6, 2.4), lam({ color: 0xffffff }), GN); gim.frustumCulled = false; scene.add(gim);
      const GC = ['#e84a6a', '#4a8ad8', '#f0c040', '#5ab070', '#e8e8f0']; for (let k = 0; k < GN; k++) gim.setColorAt(k, new THREE.Color(GC[k % 5]));
      const gd = new THREE.Object3D();
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, WY + 4, 6), ST); leg.position.set(WX + sx * 14, (WY) / 2, WZ + sz * 6); leg.rotation.z = -sx * 0.22; leg.rotation.x = sz * 0.08; scene.add(leg); }
      pushPrism('CONC', 'TKSTONE', rectPoly(WX - 12, WZ + 6, WX + 12, WZ + 16), 0, 1.2); stairs([WX - 4, WZ + 16, WX + 4, WZ + 22], 1.2, 'z-');   // 乗り場
      solid(WX - 18, WZ - 6, WX + 18, WZ + 6, 0, 4);
      LM_UPDATERS.push((dt, t) => {
        wheel.rotation.z = -t * Math.PI * 2 / 300;   // ゲームの中では5分で1周
        if (Math.abs(P.x - WX) < 1500 && Math.abs(P.z - WZ) < 1500) { gim.visible = true;
          for (let k = 0; k < GN; k++) { const a = k / GN * Math.PI * 2 + wheel.rotation.z; gd.position.set(WX + Math.cos(a) * (WR + 1.5), WY + Math.sin(a) * (WR + 1.5) - 1.8, WZ); gd.updateMatrix(); gim.setMatrixAt(k, gd.matrix); }
          gim.instanceMatrix.needsUpdate = true; } else gim.visible = false;
        LED.emissiveIntensity = NIGHT > 0.05 ? NIGHT * (0.7 + 0.3 * Math.sin(t * 1.5)) : 0; LED.emissive.setHSL((t * 0.05) % 1, 0.8, 0.55);
      });
    }
    // ---- 葛西臨海水族園 (ガラスドームの下が入口。マグロの大水槽と、国内最大級のペンギンの展示)
    const DX = 3330, DZ = 220;
    {
      tiles(DX - 46, DZ - 40, DX + 46, DZ + 40, '#d8d2c4', '#c8c2b4', 4);
      PONDS.push([DX, DZ + 26, 34, 8]); fe(DX, DZ + 26, 34, 8, '#3d7598');   // 海とつながって見える水の広場
      pushPrism('CONC', 'TKSTONE', regularPoly(DX, DZ - 6, 18, 12), 0, 2);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(16, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 1.75, 1), lam({ color: 0x9ac8e0, transparent: true, opacity: 0.5 }));
      dome.position.set(DX, 2, DZ - 6); scene.add(dome);
      const fw = new THREE.Mesh(new THREE.SphereGeometry(16.1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 1.75, 1), new THREE.MeshBasicMaterial({ color: 0xf0f4f8, wireframe: true }));
      fw.position.copy(dome.position); scene.add(fw);
      solid(DX - 11, DZ - 17, DX + 11, DZ + 5, 2, 26);
      pushPrism(acGothic('KS_AQUA', '#d8dcde', '#5a7088', null, { rowH: 6, step: 8, ww: 6, wh: 3, lit: 0.5 }), 'GRASSTOP', rectPoly(DX - 44, DZ - 40, DX + 44, DZ - 26), 0, 8);   // 展示棟 (半地下)
      frontSign(AXIS, DX, DZ + 12.2, 1, '葛西臨海水族園', '#1a4a7a', '#ffffff', 12, 1.6, 4, { tw: 160, th: 28 });
      // ペンギンの展示場 (岩場と水のプール。ペンギンが歩いたり泳いだりする)
      const PX = DX + 44, PZ = DZ - 6;
      PONDS.push([PX, PZ, 11, 7]); fe(PX, PZ, 13, 9, '#b8b0a0'); fe(PX, PZ, 11, 7, '#2d7ab0');
      pushPrism('CONC', null, regularPoly(PX, PZ, 14.5, 16).map(([x, z]) => [PX + (x - PX), PZ + (z - PZ) * 0.7]), 0, 1.1);
      const PB = lam({ color: 0x1c1c22 }), PW = lam({ color: 0xf2f2ee }), PY = lam({ color: 0xf0b030 }), PEN = [];
      for (let k = 0; k < 12; k++) {
        const g = new THREE.Group(); scene.add(g);
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6).scale(1, 1.6, 0.9), PB); b.position.y = 0.5; g.add(b);
        const w = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 6).scale(1, 1.5, 0.7), PW); w.position.set(0, 0.48, 0.12); g.add(w);
        const h = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), PB); h.position.set(0, 1.05, 0.04); g.add(h);
        const bk = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 4).rotateX(Math.PI / 2), PY); bk.position.set(0, 1.03, 0.26); g.add(bk);
        g.scale.setScalar(1.5);
        PEN.push({ g, a: rr(0, 6.28), sp: rr(0.15, 0.35) * (rnd() < 0.5 ? 1 : -1), swim: k % 3 === 0, ph: rr(0, 6) });
      }
      LM_UPDATERS.push((dt, t) => {
        const near = Math.abs(P.x - PX) < 300 && Math.abs(P.z - PZ) < 300; for (const p of PEN) p.g.visible = near;
        if (!near) return;
        for (const p of PEN) {
          const a = p.a + t * p.sp, rx = p.swim ? 8 : 12.5, rz = p.swim ? 4.5 : 8.4;
          p.g.position.set(PX + Math.cos(a) * rx, p.swim ? -0.55 + Math.sin(t * 2 + p.ph) * 0.05 : 0.05, PZ + Math.sin(a) * rz);
          p.g.rotation.y = Math.atan2(-Math.sin(a) * p.sp * rx, Math.cos(a) * p.sp * rz);
          p.g.rotation.z = p.swim ? 0 : Math.sin(t * 7 + p.ph) * 0.15;   // よちよち
          p.g.rotation.x = p.swim ? 1.2 : 0;
        }
      });
      LM_ACH.push(['penguin', '🐧 ペンギンに会えた', '葛西臨海水族園のペンギンの展示場を見る', () => P.y < 4 && Math.hypot(P.x - PX, P.z - PZ) < 20]);
    }
    // ---- クリスタルビュー (海を見わたすガラス張りの展望レストハウス)
    {
      const CV = [3470, 432, 3560, 450];
      pushPrism('glass', 'ROOF', rectPoly(...CV), 0, 12);
      tiles(3440, 452, 3628, 476, '#cfc6b0', '#bfb6a0', 3);
      for (let x = 3446; x < 3626; x += 3) pushPrism('CONC', null, rectPoly(x, 476.6, x + 0.2, 476.8), 0, 1.1, { solid: false });
      solid(3436, 476.5, 3632, 477, 0, 1.1);
      LM_PEOPLE.push([[3440, 464, 3628, 464], 10]);
    }
    LM_PEOPLE.push([[3150, 340, 3150, 120], 12], [[2990, 296, 3610, 296], 24], [[3600, 292, 2990, 292], 18], [[DX - 40, DZ + 40, DX + 40, DZ + 40], 10]);
    SPOT_AREAS.unshift(['ダイヤと花の大観覧車', WX - 56, WZ - 8, WX + 56, WZ + 24], ['ペンギンの展示場 (葛西臨海水族園)', DX + 28, DZ - 18, DX + 60, DZ + 6], ['葛西臨海水族園', DX - 46, DZ - 40, DX + 28, DZ + 40], ['クリスタルビュー', 3466, 428, 3564, 454]);
    SPOT_AREAS.push(['葛西臨海公園', ...PK], ['葛西臨海公園 (海ぞいの園路)', 3430, 400, 3632, 478]);
    LM_LABELS.push(['大観覧車', WX, WZ, '🎡', 'ダイヤと花の大観覧車'], ['水族園', DX, DZ, '🐟', '葛西臨海水族園'], ['ペンギン', DX + 44, DZ - 6, '🐧', 'ペンギンの展示場 (葛西臨海水族園)'], ['クリスタルビュー', 3515, 441, '🔭', 'クリスタルビュー']);
    Object.assign(LM_NOTES, {
      '葛西臨海公園': '東京湾に面した、東京ドーム約17個分の広い公園。鳥類園や芝生の広場、観覧車、水族園がある',
      'ダイヤと花の大観覧車': '高さ117m、直径111mの日本最大級の観覧車。68台のゴンドラが約17分で1周する。晴れた日は東京スカイツリーや東京タワー、遠くに富士山も見える。夜はダイヤや花の模様に光る',
      '葛西臨海水族園': '入口はガラスのドーム。大水槽をクロマグロの群れがぐるぐる泳ぎ回る。国内最大級のペンギンの展示でも知られる',
      'ペンギンの展示場 (葛西臨海水族園)': 'ペンギンが岩場を歩いたり、プールを泳いだりする姿を、すぐそばで見られる',
      'クリスタルビュー': '東京湾をながめるガラス張りの展望レストハウス。建物の向こうに海がまっすぐ続いて見える',
      '葛西臨海公園 (海ぞいの園路)': '海ぞいを歩く道。沖には人工の干潟と砂浜「葛西海浜公園」が広がる',
    });
    LM_ACH.push(['kanransha', '🎡 大観覧車の足もと', '葛西臨海公園の大観覧車の乗り場に立つ', () => P.y > 0.6 && inR([WX - 12, WZ + 6, WX + 12, WZ + 16], P.x, P.z)]);
    bakeFlush();
  },
});
