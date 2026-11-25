/* アニメゆかりの名所
   - 須賀神社 (四谷): 映画『君の名は。』のラストシーンの階段 (男坂)
   - 乙女ロード (池袋): 女性向けのアニメ・マンガの店が並ぶ通りと、アニメイト池袋本店
   - 麻布氷川神社 (元麻布): 『美少女戦士セーラームーン』の火川神社のモデルとされる神社
   - 既存の名所へのひとこと追加: 神田明神 (『ラブライブ!』)・四ツ谷駅 (『君の名は。』)・東京ビッグサイト (コミケ)
   キャラクターそのものは作らず、場所と建物だけを作る */
REGION({
  name: 'アニメゆかりの名所',
  towns: [['須賀町', -2230, -2180]],
  labels: [],
  build(r) {
    const { spot, sign, signX, SHU, hall, windows, TREE_LISTS } = SL_KIT();
    const site = (R, col) => { LM_ZONES.push(rectPoly(...R)); for (const A of TREE_LISTS) { const keep = A.filter(p => !inR(R, p[0], p[1])); A.length = 0; A.push(...keep); } if (col) fr(...R, col); };
    // 高さ y0 に立つ朱の鳥居 (通り道は x 方向)
    const torii = (cx, cz, y0, H, span, M) => {
      for (const s of [-1, 1]) { bake(M, new THREE.CylinderGeometry(0.32, 0.36, H, 10).translate(cx, y0 + H / 2, cz + s * span / 2)); solid(cx - 0.35, cz + s * span / 2 - 0.35, cx + 0.35, cz + s * span / 2 + 0.35, y0, y0 + H); }
      bake(M, new THREE.BoxGeometry(0.6, 0.45, span + 2.4).translate(cx, y0 + H + 0.2, cz));
      bake(lam({ color: 0x2a2420 }), new THREE.BoxGeometry(0.7, 0.2, span + 2.8).translate(cx, y0 + H + 0.5, cz));
      bake(M, new THREE.BoxGeometry(0.35, 0.3, span + 0.8).translate(cx, y0 + H - 1, cz));
    };

    // ===== 須賀神社 (四谷) と男坂 =====
    {
      const R = [-2266, -2166, -2182, -2106], TY = 6;
      site(R, '#b8b09a');
      pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(-2232, -2160, -2186, -2112), 0, TY);   // 高台の境内
      tiles(-2232, -2160, -2186, -2112, '#c8bea4', '#b8ae94', 2);
      tiles(-2266, -2142, -2232, -2130, '#b4ac98', '#a49c88', 1.5);   // 坂の下の道
      stairs([-2258, -2141, -2232, -2131], TY, 'x+');   // 男坂 (まっすぐな石段)
      // 一段ずつの石段 (見た目) と、両側の石の縁
      { const ST = lam({ color: 0xa8a49a }), ED = lam({ color: 0x8e8a80 }), N = 30;
        for (let i = 0; i < N; i++) { const x0 = -2258 + i * 26 / N, h = (i + 1) * TY / N; bake(ST, new THREE.BoxGeometry(26 / N + 0.02, h, 10).translate(x0 + 13 / N, h / 2, -2136)); }
        for (const z of [-2141.3, -2130.7]) { const g = new THREE.BoxGeometry(Math.hypot(26, TY), 0.5, 0.6).rotateZ(Math.atan2(TY, 26)).translate(-2245, TY / 2 + 0.25, z); bake(ED, g); } }
      // 石段のまんなかの手すり
      { const L = Math.hypot(26, TY), g = new THREE.BoxGeometry(L, 0.08, 0.08).rotateZ(Math.atan2(TY, 26)).translate(-2245, TY / 2 + 1, -2136); bake(lam({ color: 0xa8a8a4 }), g); for (const x of [-2257, -2245, -2233]) bake(lam({ color: 0xa8a8a4 }), new THREE.BoxGeometry(0.08, 1, 0.08).translate(x, (x + 2258) / 26 * TY + 0.5, -2136)); }
      torii(-2229, -2136, TY, 4.6, 4, WALL[SHU]);   // 石段を上りきったところの朱の鳥居
      tiles(-2229, -2140, -2206, -2132, '#d2c8b0', '#c0b69e', 1.4);
      hall([-2206, -2150, -2188, -2122], SHU, TY, 5, 'RF_COPPER', 4.5);
      STONE_LANTERNS.push([-2216, -2142], [-2216, -2130]);
      for (const [x, z] of [[-2228, -2156], [-2196, -2156], [-2228, -2116], [-2196, -2116], [-2262, -2160], [-2262, -2112], [-2240, -2162]]) ROUND.push([x, z, rr(1, 1.3)]);
      LM_PEOPLE.push([[-2265, -2133, -2236, -2133], 3]);
      spot('須賀神社 (四谷)', R, '須賀神社', '⛩', '四谷十八ヶ町の総鎮守で、1634年にこの地へ移ってきた。拝殿には1836年に奉納された「三十六歌仙絵」が掲げられている (新宿区の文化財)。参道の石段 (男坂) は、映画『君の名は。』のラストシーンの舞台として知られ、海外からも多くのファンが訪れる', -2197, -2136);
      SPOT_AREAS.unshift(['須賀神社の男坂', -2262, -2144, -2228, -2128]);
      LM_NOTES['須賀神社の男坂'] = '映画『君の名は。』のラストシーンに登場する石段。上りきって振り返ると、映画で見た景色が広がる';
    }

    // ===== 乙女ロード (池袋) とアニメイト池袋本店 =====
    {
      const R = [-2440, -4300, -2404, -4160], X0 = -2427, X1 = -2417;
      site(R, '#b8b2a6');
      tiles(X0, -4300, X1, -4160, '#cfc6b4', '#bdb4a2', 2);
      const COLS = ['#e8a0b8', '#a8c8e8', '#f0d080', '#c8a8e0', '#a0d8c0', '#f4b090', '#e8e4dc', '#8ab0d8'];
      const WORDS = ['アニメグッズ', '同人誌', 'コミック', 'コスプレ', '執事喫茶', 'ゲーム', '書店', 'キャラカフェ', 'グッズ', 'BL', '缶バッジ', 'フィギュア'];
      let wi = 0;
      for (const [x0, x1, sd] of [[-2440, X0 - 1, 1], [X1 + 1, -2404, -1]]) {
        let z = sd > 0 ? -4198 : -4160;
        while (true) {
          const len = rr(10, 15), z0 = z - len; if (z0 < -4300) break;
          const h = rr(8, 18), key = 'OT_' + (wi % 8);
          if (!WALL[key]) WALL[key] = lam({ color: new THREE.Color(COLS[wi % 8]).multiplyScalar(0.9) });
          pushPrism(windows('OT_W' + (wi % 4), ['#e8e2d6', '#d8d4ce', '#ece0e4', '#dcdce6'][wi % 4], '#4a5058', 4, 4), 'CONC', rectPoly(x0, z0 + 0.5, x1, z - 0.5), 0, h);
          const fx = sd > 0 ? x1 + 0.05 : x0 - 0.05;
          bake(WALL[key], new THREE.BoxGeometry(0.3, 1.4, len - 2).translate(fx + sd * 0.15, 3.6, (z0 + z) / 2));   // 店先の看板の帯
          signX(fx + sd * 0.35, (z0 + z) / 2, sd, WORDS[wi % WORDS.length], len - 3, 3.6, COLS[wi % 8], '#2a2430');
          wi++; z = z0;
        }
      }
      // アニメイト池袋本店 (南の端の大きなビル)
      const AN = windows('OT_ANIMATE', '#3a3a44', '#6a8ab0', 5, 6);
      pushPrism(AN, 'CONC', rectPoly(-2440, -4198, X0 - 1, -4160), 0, 40);
      bake(lam({ color: 0x2a5ab8, emissive: 0x0a1a40 }), new THREE.BoxGeometry(0.4, 22, 3).translate(X0 - 0.6, 24, -4190));   // 縦の大きな看板
      signX(X0 - 0.8, -4176, 1, 'アニメイト池袋本店', 14, 6, '#2a5ab8', '#ffffff');
      for (let z = -4296; z < -4164; z += 18) LAMPS2.push([X1 + 0.5, z]);
      LM_PEOPLE.push([[X0 + 2, -4164, X0 + 2, -4296], 14], [[X1 - 2, -4296, X1 - 2, -4164], 12]);
      spot('乙女ロード', [X0 - 1, -4300, X1 + 1, -4160], '乙女ロード', '💖', '女性ファン向けのアニメ・マンガ・ゲームの専門店が約200m続く通りで、「女性オタクの聖地」とも呼ばれる。コスプレ姿の人が行き交うのも見慣れた光景', -2422, -4230);
      SPOT_AREAS.unshift(['アニメイト池袋本店', -2440, -4198, X0 - 1, -4160]);
      LM_NOTES['アニメイト池袋本店'] = '世界最大級のアニメショップ。2023年に売り場を約2倍に広げて10階建てになり、シアターや展示スペースも備える';
    }

    // ===== 麻布氷川神社 (元麻布。仙台坂上) =====
    {
      const R = [-2008, -152, -1964, -108];
      site(R, '#c4bca8');
      tiles(-1990, -122, -1982, -108, '#d2c8b0', '#c0b69e', 1.4);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-1996, -112, -1993.5, -110), 0, 3.4);   // 入口の大きな石の社号標
      myojinTorii(-1986, -118, true, 5, 6, WALL.TKSTONE, 0.32);
      pushPrism('TKSTONE', 'TKSTONE', rectPoly(-1998, -146, -1974, -126), 0, 0.8);
      hall([-1995, -144, -1977, -130], 'WOOD', 0.8, 4.5, 'RF_COPPER', 4);
      GINKGO.push([-2002, -144, 1.1]);
      for (const [x, z] of [[-2004, -118], [-1968, -118], [-1968, -146], [-2004, -132]]) ROUND.push([x, z, rr(1, 1.2)]);
      spot('麻布氷川神社', R, '麻布氷川神社', '⛩', '麻布の総鎮守。創建は天慶5年 (942年) とも文明年間ともいわれ、江戸時代の初めに約300m北の一本松あたりから移ってきた。『美少女戦士セーラームーン』に出てくる「火川神社」のモデルといわれ、アニメの聖地巡礼の先がけになった神社のひとつ', -1986, -137);
    }

    // ===== 既存の名所への、アニメのひとこと =====
    const addNote = (name, text) => { const k = SPOT_AREAS.find(s => s[0] === name)?.[0] || name; LM_NOTES[k] = (LM_NOTES[k] ? LM_NOTES[k] + '。' : '') + text; };
    addNote('神田明神 (神田神社)', 'アニメ『ラブライブ!』の舞台としても知られ、境内に続く「男坂」はメンバーがトレーニングで駆け上がる石段のモデル');
    addNote('東京ビッグサイト', '夏と冬の「コミックマーケット」(コミケ) やアニメの大きなイベントの会場としても有名');
    addNote('四ツ谷駅 (中央線快速・中央・総武線各駅停車)', '映画『君の名は。』で主人公とバイト先の先輩が待ち合わせをする改札は、四ツ谷駅の赤坂口');
    bakeFlush();
  },
});
