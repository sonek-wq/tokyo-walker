/* 高田馬場・新大久保 (高田馬場: 早稲田通りの学生街・BIG BOX・高架下の壁画 / 戸山公園と山手線内でいちばん高い箱根山 /
   新大久保: 大久保通りのコリアンタウン・イケメン通り・皆中稲荷神社)
   座標は山手線の駅にそろえる (u = 線路の向き、新宿の方が +。v = 環の外向き = 西が +) */
REGION({
  name: '高田馬場・新大久保',
  towns: [['戸山', -2560, -3140], ['百人町', -3120, -2940], ['大久保', -2880, -2820]],
  stations: ['高田馬場', '新大久保'],   // 駅のまわりを作り込んだ駅 (ファストトラベルで緑の枠)
  labels: [],
  build(r) {
    const WH = lam({ color: 0xf0ece0 }), RED = lam({ color: 0xd8302a });

    // ======================= 高田馬場 =======================
    const T = stnFrame('高田馬場');
    // ---- 早稲田通り (駅の北を東西に走る。東へ行くと早稲田大学)。学生向けの安くて量の多い店が並ぶ
    const WA = T.w(-46, 210), WB = T.w(-46, -430);
    const W = akRoad(WA, WB, 14, '早稲田通り', { trees: false }), WL = Math.hypot(WB[0] - WA[0], WB[1] - WA[1]);
    shopsAlong(W, 238, WL - 4, 11, 16, ['ラーメン', 'つけ麺', '定食', '古本', '喫茶', '牛丼', '居酒屋', 'カラオケ', '文房具', 'カレー', '中華', '油そば', 'パン', '予備校', 'ゲーム', '大盛り'],
      { hmin: 8, hmax: 22, bgs: ['#2a2420', '#7a1a12', '#1a3a5a', '#3a2a10'] });
    shopsAlong(W, 4, 150, 11, 14, ['ラーメン', '回転寿司', 'カフェ', '書店', 'ドラッグ', 'とんかつ'], { hmin: 10, hmax: 26, sides: [1] });
    LM_PEOPLE.push([[...W.w(4, -3), ...W.w(WL - 4, -3)], 30], [[...W.w(WL - 4, 3), ...W.w(4, 3)], 30]);
    // ---- 高架下の壁画 (手塚治虫のキャラクターが描かれた壁。ゲームでは星空とロケットの絵)
    {
      const MUR = lam({ map: tex(64, 16, x => { x.fillStyle = '#2a5ab8'; x.fillRect(0, 0, 64, 16); x.fillStyle = '#fff6a0'; for (let i = 0; i < 26; i++) x.fillRect((i * 37) % 64, (i * 11) % 14, 1, 1); x.fillStyle = '#f0f0f0'; for (const [px, py] of [[10, 6], [40, 4]]) { x.fillRect(px, py, 6, 2); x.fillStyle = '#e84a3a'; x.fillRect(px - 2, py, 2, 2); x.fillStyle = '#f0f0f0'; } x.fillStyle = '#7ad87a'; x.fillRect(0, 13, 64, 3); }) });
      for (const sd of [-1, 1]) { const ry = Math.atan2(-T.ux * sd, -T.uz * sd); for (const v of [-6, 6]) { const [x, z] = T.w(-46 + sd * 13.2, v); bake(MUR, new THREE.PlaneGeometry(10, 2.6).rotateY(ry).translate(x, 1.8, z)); } }
    }
    // ---- BIG BOX (駅前の大きなビル。待ち合わせの目印)
    LM_ZONES.push(T.rect(28, 66, 70, 112));
    oBox(T, acGothic('TB_BIGBOX', '#a8583a', '#3a3a3a', '#c8b8a0', { rowH: 5, step: 5, ww: 3, wh: 3, lit: 0.5 }), 30, 68, 68, 110, 0, 34);
    frontSign(T, 49, 67.9, -1, 'BIG BOX', '#c83a2a', '#ffffff', 16, 4, 28);
    // ---- 戸山公園 (箱根山地区) と箱根山 (山手線の内側でいちばん高い、標高44.6mの山)
    const TY = T.rect(230, -130, 440, -350), HK = T.w(336, -240);
    LM_ZONES.push(TY); polyFr(TY, '#6f9450');
    hill(...HK, 34, 13.2);
    {
      const [hx, hz] = HK;
      pushPrism('TKSTONE', 'TKSTONE', regularPoly(hx, hz, 0.4, 4), 13.2, 13.7);   // 頂上の水準点
      for (let k = 0; k < 3; k++) { const a = k * 2.1, x = hx + Math.cos(a) * 2.6, z = hz + Math.sin(a) * 2.6; pushPrism('WOOD', 'WOOD', rectPoly(x - 0.9, z - 0.3, x + 0.9, z + 0.3), 13.2, 13.65); }
      for (let k = 0; k < 160; k++) {
        const [x, z] = T.w(rr(234, 436), rr(-134, -346)), d = Math.hypot(x - hx, z - hz);
        if (d < 6) continue;
        if (d < 34 && k % 3) continue;   // 山の上はまばらに
        (rnd() < 0.5 ? SAKURA : rnd() < 0.5 ? ROUND : MAPLES).push([x, z, rr(0.9, 1.3)]);
      }
      const [mx, mz] = T.w(300, -140); pushPrism('TKSTONE', 'TKSTONE', rectPoly(mx - 1.2, mz - 0.3, mx + 1.2, mz + 0.3), 0, 2.2);   // ふもとの石碑
      LM_PEOPLE.push([[...T.w(250, -140), ...T.w(420, -140)], 8], [[...T.w(250, -330), ...T.w(420, -330)], 6]);
    }

    // ======================= 新大久保 =======================
    const S = stnFrame('新大久保');
    const OA = S.w(-42, 300), OB = S.w(-42, -330);
    const O = akRoad(OA, OB, 12, '大久保通り', { trees: false }), OL = Math.hypot(OB[0] - OA[0], OB[1] - OA[1]);
    const KW = ['韓国コスメ', 'チーズハットグ', 'サムギョプサル', 'K-POP', '韓国料理', 'トッポッキ', 'ホットク', '韓国食品', 'アイドルグッズ', 'カフェ', 'チキン', 'ビビンバ', 'スンドゥブ', 'マカロン', 'チヂミ', '韓国雑貨'];
    const KB = ['#e84a8a', '#2a2a2a', '#d8302a', '#5a3ab8', '#f08a2a', '#1a8a6a'];
    shopsAlong(O, 4, OL - 4, 10, 15, KW, { bgs: KB, hmin: 8, hmax: 20, skip: [[198, 248]] });
    LM_PEOPLE.push([[...O.w(4, -2.6), ...O.w(OL - 4, -2.6)], 40], [[...O.w(OL - 4, 2.6), ...O.w(4, 2.6)], 40]);
    // ---- イケメン通り (大久保通りから南へのびる細い路地。若い人でいっぱい)
    const IA = S.w(-30, -130), IB = S.w(190, -130);
    const I = frame(...IA, IB[0] - IA[0], IB[1] - IA[1], S.vx, S.vz), IL = Math.hypot(IB[0] - IA[0], IB[1] - IA[1]);
    LM_ZONES.push(I.rect(0, -4, IL, 4)); oTiles(I, 0, -3.5, IL, 3.5, '#c8beb4', '#b8aea4', 2);
    shopsAlong(I, 6, IL, 4, 13, KW.slice().reverse(), { bgs: KB.slice().reverse(), hmin: 6, hmax: 14, wmin: 5, wmax: 9 });
    LM_PEOPLE.push([[...I.w(2, -1.2), ...I.w(IL - 2, -1.2)], 30], [[...I.w(IL - 2, 1.2), ...I.w(2, 1.2)], 30]);
    // ---- 皆中稲荷神社 (「みなあたる」。宝くじやチケットの当選祈願で人気)
    const KC = S.rect(-92, 58, -58, 96);
    LM_ZONES.push(KC); oTiles(S, -92, 58, -58, 96, '#cdc3ae', '#bdb39e', 2);
    {
      myojinTorii(...S.w(-75, 59), Math.abs(S.ux) > Math.abs(S.uz), 4.2, 4, RED, 0.25);
      oBox(S, 'WOOD', -84, 82, -66, 94, 0, 4.5); oHip(S, 'RF0', -85, 81, -65, 95, 4.5, 3, { over: 0.6 });
      const NOB = lam({ map: tex(4, 16, x => { x.fillStyle = '#d8302a'; x.fillRect(0, 0, 4, 16); x.fillStyle = '#ffffff'; x.fillRect(1, 2, 2, 12); }) });
      for (let k = 0; k < 6; k++) { const [x, z] = S.w(-88 + (k % 2) * 26, 64 + Math.floor(k / 2) * 6), ry = Math.atan2(S.ux, S.uz); bake(NOB, new THREE.PlaneGeometry(0.6, 2.4).rotateY(ry).translate(x, 2.2, z)); bake(WH, new THREE.CylinderGeometry(0.04, 0.04, 3.6, 4).translate(x, 1.8, z)); }
      LM_PEOPLE.push([[...S.w(-75, 60), ...S.w(-75, 80)], 6]);
    }

    // ===== 名所の名前・地図・豆知識・役立ち情報・実績 =====
    rotSpots(T, [['高架下の壁画 (高田馬場)', -62, -8, -30, 8], ['BIG BOX', 28, 66, 70, 112]]);
    LM_HEIGHT_AREAS.unshift(['箱根山 山頂', (x, z, y) => y > 11 && Math.hypot(x - HK[0], z - HK[1]) < 8]);
    rotSpots(T, [['箱根山', 300, -204, 372, -276], ['戸山公園', 230, -130, 440, -350]]);
    rotSpots(I, [['イケメン通り', 0, -4, IL, 4]]);
    rotSpots(S, [['皆中稲荷神社', -92, 58, -58, 96]]);
    LM_LABELS.push(['BIG BOX', ...T.w(49, 89), '🏢'], ['箱根山', ...HK, '⛰', '箱根山'], ['戸山公園', ...T.w(260, -320), '🌳'], ['イケメン通り', ...I.w(IL / 2, 0), '💄'], ['皆中稲荷神社', ...S.w(-75, 88), '🎯'], ['大久保通り', ...O.w(OL * 0.7, 0), '🇰🇷', '大久保通り']);
    Object.assign(LM_NOTES, {
      '早稲田通り': '高田馬場駅から早稲田大学へ続く通り。学生向けの量の多いラーメン屋や定食屋がひしめく、ラーメン激戦区',
      '高田馬場駅': '山手線の発車メロディは「鉄腕アトム」。手塚治虫のプロダクションがこの街にあることから、2003年から流れている',
      '高架下の壁画 (高田馬場)': '駅の高架下の壁には、手塚治虫のキャラクターたちが描かれている (ゲームでは星空とロケットの絵)',
      'BIG BOX': '駅前の大きなビル。高田馬場の待ち合わせの定番',
      '戸山公園': '江戸時代は尾張徳川家の下屋敷で、庭の8割が池という大名庭園「戸山荘」があった。春は桜の名所',
      '箱根山': '戸山荘の池を掘った土を積んでつくった築山。昔は「玉円峰」と呼ばれた。人工の山なのに、山手線の内側 (東京23区) でいちばん高い',
      '箱根山 山頂': '山頂の標高は44.6m。山手線の内側でいちばん高い場所。登ると公園のサービスセンターで「登頂証明書」がもらえる',
      '大久保通り': '新大久保駅の前の通り。韓国料理・韓国コスメ・K-POPのお店がずらりと並ぶ日本最大級のコリアンタウン',
      'イケメン通り': '大久保通りから南へのびる細い路地。韓国グルメやコスメの店が並び、いつも若い人でいっぱい',
      '皆中稲荷神社': '1533年創建。江戸時代、ここにいた鉄砲百人組の隊士が稲荷の夢を見たあと撃つと百発百中だったことから「皆中 (みなあたる)」の稲荷と呼ばれた。いまは宝くじやライブのチケットの当選祈願で人気',
    });
    Object.assign(LM_TIPS, {
      '箱根山 山頂': '登頂証明書は戸山公園のサービスセンターでもらえる (受付の時間に注意)',
      '戸山公園': '箱根山地区は西早稲田駅から徒歩8分、大久保地区は新大久保駅・高田馬場駅から徒歩10分ほど',
      '大久保通り': '土日の午後は歩道が人でいっぱいになる。平日の午前中がすいている',
    });
    LM_ACH.push(['hakoneyama', '⛰ 山手線内最高峰', '箱根山 (標高44.6m) の山頂に立つ', () => P.y > 12 && Math.hypot(P.x - HK[0], P.z - HK[1]) < 5],
      ['minaataru', '🎯 みなあたる', '皆中稲荷神社にお参りする', () => P.y < 2 && inPoly(S.rect(-84, 74, -66, 82), P.x, P.z)]);
    bakeFlush();
  },
});
