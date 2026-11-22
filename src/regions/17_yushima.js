/* 湯島・池之端 (湯島天神・旧岩崎邸庭園)
   不忍池の南。本郷の不忍通りの南端から、春日通り (切通坂) を東へ御徒町まで延ばす。北側に旧岩崎邸庭園、南側に湯島天神 */
REGION({
  name: '湯島',
  towns: [['湯島三丁目', 70, -3200], ['池之端一丁目', 70, -3290], ['上野広小路', 260, -3250]],
  labels: [],
  build(r) {
    acRoad([30, -3262, 320, -3250], 'ew', '春日通り (切通坂)'); akRoad([-29, -3286], [34, -3256], 12, '春日通り (切通坂)', { walk: false, trees: false });   // 本郷 (東大の南) からつなぐ
    const BR = WALL.BRONZE, SPRING = MONTH === 2 || MONTH === 3;
    // ===== 湯島天神 (湯島天満宮。学問の神様・菅原道真をまつる) =====
    const T = [30, -3240, 112, -3165], TZ = -3203;
    {
      LM_ZONES.push(rectPoly(...T)); fr(...T, '#bcb4a2');
      tiles(T[0], TZ - 4, 70, TZ + 4, '#cfc6b0', '#c0b6a0', 2);
      myojinTorii(36, TZ, false, 6.5, 6, BR, 0.4);   // 銅の鳥居
      // 社殿 (総檜の権現造。西を向く)
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(70, TZ - 12, 94, TZ + 12), 0, 0.9);
      pushPrism('WOOD', 'ROOF', rectPoly(72, TZ - 10, 92, TZ + 10), 0.9, 7);
      jRoof('RF_COPPER', 70, TZ - 12, 94, TZ + 12, 7, 5, { over: 1.4, kind: 'irimoya' });
      jRoof('RF_COPPER', 66, TZ - 5, 73, TZ + 5, 4.4, 2.2, { over: 0.6, kind: 'irimoya' });
      const GOLD = lam({ color: 0xd8b040, emissive: 0x302000 });
      for (const dz of [-3, 3]) bake(GOLD, new THREE.BoxGeometry(0.3, 3.4, 0.3).translate(69, 2.6, TZ + dz));
      // 絵馬 (合格祈願の木の札) がびっしり掛かった棚
      const EMA = lam({ map: tex(16, 16, g => { g.fillStyle = '#c8a070'; g.fillRect(0, 0, 16, 16); for (let i = 0; i < 16; i += 4) for (let j = 0; j < 16; j += 4) { g.fillStyle = rnd() < 0.5 ? '#e0c090' : '#b88a58'; g.fillRect(i, j, 3, 3); g.fillStyle = '#3a2a1a'; g.fillRect(i + 1, j + 1, 1, 1); } }) });
      for (const z of [TZ - 18, TZ + 18]) { pushPrism('WOOD', 'ROOF', rectPoly(58, z - 0.4, 86, z + 0.4), 0, 2.4); bake(EMA, new THREE.PlaneGeometry(26, 1.8).translate(72, 1.3, z + (z < TZ ? 0.45 : -0.45)).rotateY(0)); bake(EMA, new THREE.PlaneGeometry(26, 1.8).rotateY(Math.PI).translate(72, 1.3, z + (z < TZ ? -0.45 : 0.45))); }
      // 梅園 (約300本。2〜3月は白梅が満開)
      const trunk = lam({ color: 0x4a3a2e }), blossom = lam({ color: SPRING ? 0xf4f0f0 : 0x6a8a48 }), pinkB = lam({ color: SPRING ? 0xf0a8c0 : 0x6a8a48 });
      for (let k = 0; k < 70; k++) {
        const x = rr(T[0] + 3, T[2] - 3), z = rr(T[1] + 3, T[3] - 3); if (Math.abs(z - TZ) < 9 && x < 96) continue; if (inR([56, TZ - 20, 96, TZ + 20], x, z) || !acFree(x, z, 1.5)) continue;
        bake(trunk, new THREE.CylinderGeometry(0.12, 0.18, 1.6, 5).rotateZ(rr(-0.3, 0.3)).translate(x, 0.8, z));
        bake(rnd() < 0.8 ? blossom : pinkB, new THREE.IcosahedronGeometry(rr(0.9, 1.3), 0).scale(1, SPRING ? 0.8 : 0.6, 1).translate(x, 1.9, z));
      }
      LM_PEOPLE.push([[34, TZ - 2, 66, TZ - 2], 8], [[66, TZ + 2, 34, TZ + 2], 6]);
    }
    // ===== 旧岩崎邸庭園 (1896年完成。ジョサイア・コンドル設計の洋館) =====
    const IW = [30, -3318, 112, -3266];
    {
      LM_ZONES.push(rectPoly(...IW)); fr(...IW, '#6f9a52');
      const brick = (x0, z0, x1, z1) => pushPrism('brick', 'TKSTONE', rectPoly(x0, z0, x1, z1), 0, 2.4);
      brick(IW[0], IW[3] - 0.8, 66, IW[3]); brick(74, IW[3] - 0.8, IW[2], IW[3]); brick(IW[0], IW[1], IW[0] + 0.8, IW[3]); brick(IW[2] - 0.8, IW[1], IW[2], IW[3]);
      const YK = LM_MAT('YS_IWASAKI', (x, y) => {   // 薄い黄土色の板張りと縦長の窓
        x.fillStyle = '#d8cca8'; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
        for (let j = 0; j < 32; j += 2) { x.fillStyle = '#ccc09c'; x.fillRect(0, j, 32, 1); }
        for (const j of [4, 20]) for (let i = 2; i < 32; i += 6) { x.fillStyle = '#f2ecdc'; x.fillRect(i - 1, j - 1, 4, 9); x.fillStyle = '#3e4a52'; x.fillRect(i, j, 2, 7); y.fillStyle = rnd() < 0.4 ? '#ffe0a0' : '#000'; y.fillRect(i, j, 2, 7); }
      });
      // 洋館 (木造2階建て。南側に列柱のベランダ)
      const H = [44, -3312, 80, -3296];
      pushPrism(YK, 'SLATE', rectPoly(...H), 0, 10); oHip(AXIS, 'SLATE', H[0], H[1], H[2], H[3], 10, 4, { over: 0.6 });
      pushPrism(YK, 'SLATE', rectPoly(56, -3318, 66, -3312), 0, 13); mesh(new THREE.ConeGeometry(4, 4, 4).rotateY(Math.PI / 4), WALL.SLATE, 61, 15, -3315);   // 北側の玄関の塔
      const white = lam({ color: 0xf2ecdc });
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(H[0] + 2, H[3], H[2] - 2, H[3] + 4), 4.6, 5.0, { solid: false });   // ベランダの2階の床
      for (let x = H[0] + 2.5; x <= H[2] - 2.5; x += 3.1) { bake(white, new THREE.CylinderGeometry(0.25, 0.28, 4.6, 8).translate(x, 2.3, H[3] + 3.6)); bake(white, new THREE.CylinderGeometry(0.2, 0.22, 4.4, 8).translate(x, 7.2, H[3] + 3.6)); }
      bake(white, new THREE.BoxGeometry(H[2] - H[0] - 4, 0.5, 4).translate((H[0] + H[2]) / 2, 9.6, H[3] + 2));
      // 撞球室 (スイスの山小屋風のビリヤード場) と和館
      pushPrism('WOOD', 'ROOF', rectPoly(86, -3314, 98, -3304), 0, 5); jRoof('RF0', 85, -3315, 99, -3303, 5, 3, { over: 0.8, kind: 'irimoya', flare: 0 });
      pushPrism('WOOD', 'ROOF', rectPoly(34, -3314, 44, -3300), 0, 4); jRoof('RF0', 33, -3315, 45, -3299, 4, 2.4, { over: 1, kind: 'irimoya' });
      for (let k = 0; k < 22; k++) { const x = rr(IW[0] + 3, IW[2] - 3), z = rr(-3290, IW[3] - 3); if (Math.abs(x - 70) < 18 && z > -3292) continue; ROUND.push([x, z, rr(1.1, 1.6)]); }
      tiles(66, -3296, 74, IW[3], '#cfc6b0', '#c0b6a0', 2);
      LM_PEOPLE.push([[70, IW[3] - 2, 70, -3294], 5], [[48, -3290, 92, -3290], 6]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    SPOT_AREAS.push(['湯島天神 社殿', 64, TZ - 13, 96, TZ + 13], ['湯島天神 (湯島天満宮)', ...T], ['旧岩崎邸 洋館', 42, -3320, 82, -3290], ['旧岩崎邸庭園', ...IW]);
    LM_LABELS.push(['湯島天神', 80, TZ, '🌸', '湯島天神 (湯島天満宮)'], ['旧岩崎邸庭園', 62, -3304, '🏛', '旧岩崎邸庭園']);
    Object.assign(LM_NOTES, {
      '湯島天神 (湯島天満宮)': '458年の創建と伝わる天満宮。学問の神様・菅原道真をまつり、受験シーズンは合格祈願の絵馬で埋めつくされる',
      '湯島天神 社殿': '江戸時代から梅の名所。境内には約300本の梅があり、その多くが「白加賀」という白い梅',
      '旧岩崎邸庭園': '三菱を興した岩崎家の本邸。洋館・撞球室・和館の3棟が国の重要文化財',
      '旧岩崎邸 洋館': '1896年、ジョサイア・コンドルの設計で完成。南側のベランダは、1階がトスカナ式、2階がイオニア式の柱',
      '春日通り (切通坂)': '湯島天神の北を通り、上野広小路へ下る坂',
    });
    Object.assign(LM_TIPS, {
      '湯島天神 (湯島天満宮)': '2月上旬〜3月上旬は「文京梅まつり」(2026年は2/8〜3/8)',
    });
    LM_ACH.push(['tenjin', '🌸 学問の神様', '湯島天神の社殿にお参りする', () => inR([64, TZ - 13, 96, TZ + 13], P.x, P.z)]);
    bakeFlush();
  },
});
