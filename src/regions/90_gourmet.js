/* 名物グルメ (歩いているだけで、その街の名物の食べものが分かる)
   エリアごとに名物のお店を1軒ずつ置く。屋根の上に大きな食べものの模型、軒先に看板とのれん、前に並ぶ人。
   近くを通ると「グルメ図鑑」に記録される (実績パネルに 🍴 の数)。お店の場所は、目印の近くの空いている場所を自動で探す */
const GOURMET = [];   // [{ name, food, area, emoji, x, z }]  (見つけたかどうかは game/30_fun.js で記録)
REGION({
  name: '名物グルメ',
  towns: [],
  labels: [],
  build(r) {
    // ---- 名物の一覧: [エリア, 食べもの, 絵文字, 目印 [x, z] か 駅名, 模型の種類, 色など, 豆知識]
    const S = n => { const st = STN.find(s => s.name === n); return [st.ent[0], st.ent[1]]; };
    const LIST = [
      ['月島', 'もんじゃ焼き', '🥘', [700, -1200], 'monja', {}, '月島の西仲通りは「もんじゃストリート」。もんじゃ焼きのお店がずらりと並ぶ。もとは駄菓子屋で子どもが小さな鉄板で焼いたおやつ'],
      ['佃', '佃煮', '🐟', [560, -1330], 'box', { c: 0x4a2a14, lid: 0xc8a050 }, '江戸のはじめ、大阪の佃村から来た漁師たちが住んだ佃島。小魚を甘辛く煮つめた保存食「佃煮」はここで生まれた'],
      ['築地', '玉子焼き', '🍳', [195, -900], 'box', { c: 0xf4d040, lid: 0xf4d040, plain: true }, '築地場外市場には玉子焼きの専門店がいくつもあり、串に刺した玉子焼きを食べ歩ける'],
      ['築地', '海鮮丼', '🐟', [150, -960], 'bowl', { top: 'kaisen' }, '市場の街・築地の朝ごはんといえば、マグロやウニ、イクラをたっぷりのせた海鮮丼'],
      ['豊洲', 'お寿司', '🍣', [1320, -260], 'sushi', {}, '豊洲市場の中には朝早くから寿司屋が並び、市場から届いたばかりのネタを食べようと行列ができる'],
      ['浅草', '雷おこし', '🍘', [1300, -3398], 'box', { c: 0xd8a848, lid: 0xd8a848, plain: true, grain: true }, '雷門にちなんだ浅草みやげ。米をはぜさせて水あめで固めたお菓子で、「家をおこす・名をおこす」縁起もの'],
      ['浅草', '人形焼', '🎎', [1314, -3540], 'dome', { c: 0xc88a40, small: true }, '七福神や雷さま、五重塔の形に焼いたカステラ生地のお菓子。仲見世では焼くところを見られる店もある'],
      ['浅草', '天丼', '🍤', [1240, -3460], 'bowl', { top: 'tempura' }, '浅草の天丼は、ごま油で揚げた色の濃い天ぷらを、甘辛いたれにくぐらせるのが江戸前のスタイル'],
      ['上野', 'パンダのパン', '🐼', [340, -3470], 'panda', {}, '上野のパン屋や和菓子屋には、パンダの顔のパンやまんじゅうが並ぶ。パンダは上野の街のシンボル'],
      ['上野・御徒町', 'とんかつ', '🐷', S('御徒町'), 'cutlet', {}, '上野・御徒町は老舗のとんかつ屋が集まる街。「上野のとんかつ御三家」と呼ばれる名店がある'],
      ['根津', 'たい焼き', '🐟', [-260, -3880], 'fish', { c: 0xc8883a }, '根津の路地のたい焼き屋。薄い皮で、しっぽの先まであんこがぎっしり。焼き上がりを待つ行列ができる'],
      ['谷中', 'メンチカツ', '🍖', [-62, -4318], 'cutlet', { round: true }, '谷中銀座は揚げたてのメンチカツや焼き鳥を食べ歩ける商店街。ねこのしっぽの形のドーナツも名物'],
      ['日暮里', '羽二重団子', '🍡', S('日暮里'), 'skewer', { balls: [0xf4f0e6, 0xf4f0e6, 0xf4f0e6, 0xf4f0e6], sauce: 0x8a5a2a }, '1819年 (文政2年) 創業の団子屋。きめ細かな団子が羽二重 (絹の布) のようだと名づけられた。正岡子規や夏目漱石の作品にも登場する'],
      ['両国', 'ちゃんこ鍋', '🍲', [1300, -2560], 'nabe', {}, '力士が毎日食べる鍋料理。両国には元力士が開いたちゃんこ屋が多い。「ちゃんこ」はお相撲さんの食事全体のこと'],
      ['両国', '国技館の焼き鳥', '🍢', [1160, -2650], 'skewer', { balls: [0x8a5a2a, 0x8a5a2a, 0x8a5a2a], cube: true }, '国技館の地下で焼かれる名物の焼き鳥。鳥は二本足で立つので「手をつかない (負けない)」縁起ものとされる'],
      ['深川・門前仲町', '深川めし', '🍚', [1300, -1220], 'bowl', { top: 'asari' }, 'あさりとねぎを味噌で煮てご飯にかけた、漁師町の深川生まれのぶっかけ飯。炊き込みご飯の深川めしもある'],
      ['人形町', '親子丼', '🍳', [600, -1960], 'bowl', { top: 'egg' }, '1891年 (明治24年)、人形町の鶏料理店で生まれたといわれる親子丼。昼どきは行列ができる'],
      ['神田', 'そば', '🍜', S('神田'), 'bowl', { top: 'soba', c: 0x2a2a2a }, '神田は江戸から続く老舗のそば屋が集まる街。せいろに盛ったもりそばを、濃いめのつゆにちょっとつけてすする'],
      ['神保町', 'カレー', '🍛', [-330, -2510], 'plate', { top: 'curry' }, '神保町はカレー屋がひしめく「カレーの街」。本を買ったあと、片手で食べられるカレーが学生や本好きに好まれたともいわれる'],
      ['秋葉原', 'おでん缶', '🥫', [160, -2800], 'can', {}, '秋葉原の自動販売機で売られる、缶に入ったおでん。電気街の名物として知られるようになった'],
      ['東京駅', '駅弁', '🍱', [36, -1726], 'box', { c: 0x2a2a2a, lid: 0xc83a2a }, '東京駅の中の駅弁屋には、日本じゅうの駅弁がずらりと並ぶ。新幹線に乗る前に選ぶのが楽しみ'],
      ['銀座', 'あんぱん', '🍞', [-144, -1300], 'dome', { c: 0xa8642a, cherry: true }, '1874年、銀座の木村屋が酒種を使ったあんぱんを考案。翌年、明治天皇に献上した、桜の花の塩漬けをのせた「桜あんぱん」が評判になった'],
      ['新橋', 'ガード下の焼き鳥', '🍢', [-720, -1080], 'skewer', { balls: [0x7a4a22, 0xe8e0c0, 0x7a4a22], cube: true }, '新橋・有楽町の高架下は、焼き鳥の煙がただよう居酒屋の街。仕事帰りの人でにぎわう'],
      ['麻布十番', 'たい焼き', '🐟', [-1830, -420], 'fish', { c: 0xb8782e }, '1909年創業のたい焼き屋がある街。たい焼きの元祖ともいわれ、歌「およげ！たいやきくん」のモデルになった'],
      ['新宿', 'もつ焼き', '🍢', [-3098, -2363], 'skewer', { balls: [0x6a3a1a, 0x6a3a1a, 0x6a3a1a, 0x6a3a1a], cube: true }, '思い出横丁は戦後の闇市から始まった細い路地の飲み屋街。もつ焼きの煙と匂いがたちこめる'],
      ['原宿', 'クレープ', '🍦', [-2810, -1196], 'cone', {}, '竹下通りは1970年代から続くクレープの街。生クリームとフルーツたっぷりのクレープを歩きながら食べる'],
      ['表参道', 'パンケーキ', '🥞', [-2560, -1060], 'stack', {}, '表参道・原宿は、ふわふわのパンケーキのお店が集まる激戦区。生クリームを山のようにのせる店も'],
      ['高田馬場', 'ラーメン', '🍜', S('高田馬場'), 'bowl', { top: 'ramen' }, '学生街の高田馬場はラーメン激戦区。こってりの家系から、つけ麺、まぜそばまで何でもある'],
      ['新大久保', 'チーズハットグ', '🧀', [-3160, -2860], 'skewer', { balls: [0xd8a040], corn: true }, '新大久保の韓国グルメの定番。かじるとチーズがびよーんとのびる'],
      ['池袋', 'つけ麺', '🍜', [-2330, -4220], 'bowl', { top: 'tsukemen' }, '東池袋は、つけ麺を広めた店があった街。池袋はラーメン店が多い激戦区として知られる'],
      ['巣鴨', '塩大福', '🍡', S('巣鴨'), 'daifuku', {}, '巣鴨地蔵通りの名物。ほんのり塩の効いた皮に、甘いあんこがたっぷり'],
      ['大塚', 'おにぎり', '🍙', S('大塚'), 'onigiri', {}, '大塚には1960年創業のおにぎり専門店があり、具がはみ出るほど大きなおにぎりに行列ができる'],
      ['目黒', 'さんま', '🐟', S('目黒'), 'sanma', {}, '落語「目黒のさんま」の街。毎年9月の「目黒のSUNまつり」では、炭火で焼いたさんまがふるまわれる'],
      ['戸越銀座', 'コロッケ', '🥔', [-2368, 2269], 'cutlet', { round: true, c: 0xc89040 }, '戸越銀座は東京有数の長い商店街。揚げたてのコロッケを食べ歩くのが名物'],
      ['清澄白河', 'コーヒー', '☕', [1310, -1760], 'cup', {}, '清澄白河は、倉庫を改装した焙煎所やカフェが集まる「コーヒーの街」'],
      ['柴又', '草だんご', '🍡', [3480, -4850], 'skewer', { balls: [0x5a8a3a, 0x5a8a3a, 0x5a8a3a], sauce: 0x3a1a1a }, '帝釈天の参道の名物。よもぎの香りの草だんごに、こしあんをのせて食べる。映画「男はつらいよ」の寅さんの実家も団子屋'],
      ['恵比寿', '横丁の焼き鳥', '🍢', S('恵比寿'), 'skewer', { balls: [0x7a4a22, 0x5a8a3a, 0x7a4a22], cube: true }, '恵比寿横丁は、ちょうちんの下で焼き鳥や小皿料理をつまむ屋台風の飲み屋街'],
      ['神楽坂', '和菓子', '🍡', [-1200, -2950], 'daifuku', { c: 0xf0b8c8, leaf: true }, '花街だった神楽坂には、老舗の和菓子屋が多い。桜もちや最中を手みやげに'],
    ];

    // ---- 空いている場所を探す (自動の街の道路・線路・川・駅前・ほかの名所をよける)
    const RL = (typeof RAIL_LINES !== 'undefined' ? RAIL_LINES : []).map(l => l.pts);
    const nearRail = (x, z, d) => RL.some(P => { for (let i = 0; i + 1 < P.length; i++) { const [ax, az] = P[i], [bx, bz] = P[i + 1], dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz || 1, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L2)); if (Math.hypot(x - ax - dx * t, z - az - dz * t) < d) return true; } return false; });
    const gridGap = (a0, a1) => { for (let k = Math.ceil((a0 - 13) / 100); k * 100 <= a1 + 13; k++) return false; return true; };
    const onRd = (x, z) => typeof ROADS !== 'undefined' && ROADS.some(q => inR(q, x, z));
    const free = (x0, z0, x1, z1) => {
      if (!gridGap(x0, x1) && !gridGap(z0, z1)) return false;   // 南北の道と東西の道の交差点の上は避ける (どちらか片方の道からは離れていれば、もう一方の道に面して建てる)
      if (zoneHitsRect([x0, z0, x1, z1])) return false;
      for (let x = x0; x <= x1; x += 3) for (let z = z0; z <= z1; z += 3) {
        if (isWaterXZ(x, z) || onRd(x, z) || ringNearest(x, z)?.d < 26 || STN_RES.some(q => inR(q, x, z, 4)) || BRIDGE_POLYS.some(([Pb]) => inPoly(Pb, x, z))) return false;
      }
      return !nearRail((x0 + x1) / 2, (z0 + z1) / 2, 18) && !GOURMET.some(g => Math.hypot(g.x - (x0 + x1) / 2, g.z - (z0 + z1) / 2) < 22);
    };
    const W = 10, D = 8;
    const find = (ax, az) => {
      for (let rad = 0; rad <= 240; rad += 6) for (let k = 0, n = Math.max(1, Math.round(rad / 4)); k < n; k++) {
        const a = k / n * 6.283 + rad * 0.37, cx = ax + Math.cos(a) * rad, cz = az + Math.sin(a) * rad;
        if (free(cx - 11, cz - 11, cx + 11, cz + 11)) return [cx, cz];
      }
      return null;
    };

    // ---- 食べものの模型 (屋根の上の看板がわり。高さ y を台にして、大きさ s で置く)
    const MC = new Map(), L = c => MC.get(c) || (MC.set(c, lam({ color: c })), MC.get(c));   // 色ごとに材質を使い回す (描画の回数を増やさない)
    let GEO = []; const bk = (m, g) => GEO.push([m, g]);   // 模型はいったん原点で作り、向きと傾きをつけてから bake する
    const MODEL = {
      bowl(x, y, z, s, o) {
        bk(L(o.c || 0xb8302a), new THREE.CylinderGeometry(1.5 * s, 0.9 * s, 1.0 * s, 12).translate(x, y + 0.5 * s, z));
        bk(L(0x1a1a1a), new THREE.CylinderGeometry(1.52 * s, 1.52 * s, 0.12 * s, 12).translate(x, y + 0.96 * s, z));
        const top = o.top, T = (c, g) => bk(L(c), g);
        const base = { ramen: 0xd8b870, tsukemen: 0xe8d090, soba: 0x5a4a3a, tempura: 0xf0ece0, egg: 0xf0ece0, kaisen: 0xf0ece0, asari: 0xf0ece0 }[top] || 0xf0ece0;
        T(base, new THREE.CylinderGeometry(1.38 * s, 1.38 * s, 0.1 * s, 12).translate(x, y + 1.0 * s, z));
        if (top === 'ramen' || top === 'tsukemen') { T(0xe8a0a0, new THREE.CylinderGeometry(0.45 * s, 0.45 * s, 0.1 * s, 10).translate(x + 0.5 * s, y + 1.08 * s, z)); T(0x3a8a3a, new THREE.BoxGeometry(0.5 * s, 0.08 * s, 0.4 * s).translate(x - 0.5 * s, y + 1.08 * s, z + 0.3 * s)); T(0xf4c030, new THREE.SphereGeometry(0.28 * s, 6, 4).scale(1, 0.5, 1).translate(x - 0.2 * s, y + 1.1 * s, z - 0.6 * s)); T(0x2a2a2a, new THREE.BoxGeometry(0.7 * s, 0.05 * s, 0.6 * s).translate(x - 0.9 * s, y + 1.4 * s, z - 0.2 * s).rotateZ(0)); }
        if (top === 'tempura') for (let k = 0; k < 3; k++) T(0xe0a040, THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.22 * s, 1.4 * s, 3, 6).rotateZ(1.1 - k * 0.2).rotateY(k * 1.0).translate(x + (k - 1) * 0.35 * s, y + 1.4 * s, z) : new THREE.BoxGeometry(0.4 * s, 1.6 * s, 0.4 * s).rotateZ(1.1).translate(x, y + 1.4 * s, z));
        if (top === 'egg') { T(0xf4c838, new THREE.CylinderGeometry(1.3 * s, 1.3 * s, 0.14 * s, 12).translate(x, y + 1.1 * s, z)); for (let k = 0; k < 5; k++) T(0xe8b060, new THREE.BoxGeometry(0.35 * s, 0.2 * s, 0.35 * s).translate(x + Math.cos(k * 1.3) * 0.7 * s, y + 1.2 * s, z + Math.sin(k * 1.3) * 0.7 * s)); T(0x3a8a3a, new THREE.BoxGeometry(0.3 * s, 0.05 * s, 0.3 * s).translate(x, y + 1.22 * s, z)); }
        if (top === 'kaisen') { const cs = [0xc8283a, 0xf08a30, 0xe85a2a, 0xf4f0e0, 0xd8a030]; for (let k = 0; k < 7; k++) T(cs[k % 5], new THREE.BoxGeometry(0.8 * s, 0.16 * s, 0.45 * s).rotateY(k * 0.9).translate(x + Math.cos(k * 0.9) * 0.75 * s, y + 1.12 * s, z + Math.sin(k * 0.9) * 0.75 * s)); T(0xe86a2a, new THREE.SphereGeometry(0.35 * s, 6, 4).translate(x, y + 1.2 * s, z)); }
        if (top === 'asari') for (let k = 0; k < 9; k++) T(k % 3 ? 0xb8a890 : 0x6a8a3a, new THREE.SphereGeometry(0.22 * s, 5, 3).scale(1, 0.45, 1).translate(x + Math.cos(k * 0.7) * 0.8 * s, y + 1.1 * s, z + Math.sin(k * 0.7) * 0.8 * s));
        if (top === 'soba') { T(0x2a2a2a, new THREE.BoxGeometry(0.06 * s, 0.06 * s, 2.4 * s).rotateX(0.5).translate(x + 0.3 * s, y + 1.6 * s, z)); T(0x2a2a2a, new THREE.BoxGeometry(0.06 * s, 0.06 * s, 2.4 * s).rotateX(0.5).translate(x + 0.5 * s, y + 1.6 * s, z)); }
        if (top === 'tsukemen') { bk(L(0x2a2a2a), new THREE.CylinderGeometry(0.7 * s, 0.6 * s, 0.7 * s, 10).translate(x + 1.9 * s, y + 0.35 * s, z)); T(0x6a3a1a, new THREE.CylinderGeometry(0.62 * s, 0.62 * s, 0.08 * s, 10).translate(x + 1.9 * s, y + 0.66 * s, z)); }
      },
      nabe(x, y, z, s) {
        bk(L(0x3a3a3e), new THREE.CylinderGeometry(1.6 * s, 1.4 * s, 0.9 * s, 12).translate(x, y + 0.45 * s, z));
        bk(L(0xd8b070), new THREE.CylinderGeometry(1.5 * s, 1.5 * s, 0.1 * s, 12).translate(x, y + 0.88 * s, z));
        const cs = [0x3a8a3a, 0xf0ece0, 0xe8a0a0, 0xe86a2a, 0x8a5a3a]; for (let k = 0; k < 10; k++) bk(L(cs[k % 5]), new THREE.BoxGeometry(0.45 * s, 0.25 * s, 0.35 * s).rotateY(k).translate(x + Math.cos(k * 0.63) * 0.9 * s, y + 1.0 * s, z + Math.sin(k * 0.63) * 0.9 * s));
        for (const sd of [-1, 1]) bk(L(0x3a3a3e), new THREE.BoxGeometry(0.5 * s, 0.2 * s, 0.3 * s).translate(x + sd * 1.7 * s, y + 0.7 * s, z));
      },
      plate(x, y, z, s, o) {
        bk(L(0xf4f2ea), new THREE.CylinderGeometry(1.9 * s, 1.6 * s, 0.2 * s, 14).translate(x, y + 0.1 * s, z));
        bk(L(0xf6f4ec), new THREE.SphereGeometry(1.0 * s, 8, 5, 0, 6.283, 0, 1.4).scale(1, 0.6, 1).translate(x - 0.5 * s, y + 0.2 * s, z));
        bk(L(0x8a4a18), new THREE.CylinderGeometry(1.1 * s, 1.1 * s, 0.25 * s, 10).translate(x + 0.6 * s, y + 0.3 * s, z));
        for (let k = 0; k < 4; k++) bk(L([0xe8902a, 0x6a3a1a, 0xc8a040][k % 3]), new THREE.BoxGeometry(0.3 * s, 0.25 * s, 0.3 * s).translate(x + (0.4 + (k % 2) * 0.4) * s, y + 0.5 * s, z + (k - 1.5) * 0.3 * s));
      },
      monja(x, y, z, s) {
        bk(L(0x2a2a2e), new THREE.BoxGeometry(3.6 * s, 0.3 * s, 2.6 * s).translate(x, y + 0.15 * s, z));
        bk(L(0x9a6a3a), new THREE.CylinderGeometry(1.0 * s, 1.1 * s, 0.1 * s, 12).scale(1.2, 1, 0.9).translate(x, y + 0.35 * s, z));
        for (let k = 0; k < 8; k++) bk(L([0x3a8a3a, 0xe8a0a0, 0xf0ece0][k % 3]), new THREE.BoxGeometry(0.2 * s, 0.1 * s, 0.2 * s).translate(x + Math.cos(k) * 0.7 * s, y + 0.42 * s, z + Math.sin(k) * 0.5 * s));
        bk(L(0xb8b8bc), new THREE.BoxGeometry(0.9 * s, 0.05 * s, 0.25 * s).rotateZ(-0.4).translate(x + 1.3 * s, y + 0.6 * s, z + 0.6 * s));   // ヘラ
      },
      skewer(x, y, z, s, o) {
        bk(L(0xd8c090), new THREE.CylinderGeometry(0.06 * s, 0.06 * s, 3.4 * s, 4).translate(x, y + 1.7 * s, z));
        const bs = o.balls || [0xf0ece0];
        bs.forEach((c, k) => { const yy = y + (1.6 + k * 0.62) * s;
          if (o.corn) { bk(L(c), THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.55 * s, 1.4 * s, 3, 8).translate(x, y + 2.2 * s, z) : new THREE.CylinderGeometry(0.55 * s, 0.55 * s, 2 * s, 8).translate(x, y + 2.2 * s, z)); bk(L(0xf8e070), new THREE.BoxGeometry(0.3 * s, 0.6 * s, 0.6 * s).translate(x + 0.55 * s, y + 2.9 * s, z)); }
          else if (o.cube) bk(L(c), new THREE.BoxGeometry(0.62 * s, 0.5 * s, 0.62 * s).rotateY(k * 0.5).translate(x, yy, z));
          else bk(L(c), new THREE.SphereGeometry(0.34 * s, 8, 6).translate(x, yy, z)); });
        if (o.sauce) bk(L(o.sauce), new THREE.BoxGeometry(0.55 * s, 0.6 * bs.length * s, 0.5 * s).translate(x + 0.04 * s, y + (1.6 + (bs.length - 1) * 0.31) * s, z + 0.12 * s));
      },
      fish(x, y, z, s, o) {   // たい焼き
        const m = L(o.c || 0xc8883a);
        bk(m, new THREE.SphereGeometry(1.2 * s, 10, 6).scale(1.4, 0.95, 0.35).translate(x, y + 1.4 * s, z));
        bk(m, new THREE.ConeGeometry(0.7 * s, 1.0 * s, 4).rotateZ(Math.PI / 2).scale(1, 1, 0.35).translate(x + 2.0 * s, y + 1.4 * s, z));
        bk(L(0x3a2a1a), new THREE.SphereGeometry(0.14 * s, 5, 4).translate(x - 1.1 * s, y + 1.7 * s, z + 0.4 * s));
        for (let k = 0; k < 4; k++) bk(L(0xa86a2a), new THREE.BoxGeometry(0.08 * s, 0.9 * s, 0.05 * s).rotateZ(0.3).translate(x + (k * 0.35 - 0.3) * s, y + 1.4 * s, z + 0.42 * s));
      },
      sanma(x, y, z, s) {
        bk(L(0xf4f2ea), new THREE.BoxGeometry(4.0 * s, 0.15 * s, 1.2 * s).translate(x, y + 0.08 * s, z));   // 長い皿
        bk(L(0x5a6470), new THREE.SphereGeometry(0.4 * s, 8, 5).scale(4.2, 0.6, 0.5).translate(x, y + 0.45 * s, z));
        for (let k = 0; k < 5; k++) bk(L(0x2a2a2a), new THREE.BoxGeometry(0.06 * s, 0.1 * s, 0.4 * s).translate(x + (k - 2) * 0.5 * s, y + 0.65 * s, z));
        bk(L(0xf4f0e8), new THREE.SphereGeometry(0.3 * s, 6, 4).translate(x + 1.4 * s, y + 0.3 * s, z + 0.35 * s));   // 大根おろし
      },
      dome(x, y, z, s, o) {
        const r0 = o.small ? 0.9 : 1.3;
        bk(L(o.c || 0xd8a040), new THREE.SphereGeometry(r0 * s, 10, 6, 0, 6.283, 0, 1.6).scale(1, 0.7, 1).translate(x, y, z));
        if (o.cherry) bk(L(0xe87a9a), new THREE.SphereGeometry(0.22 * s, 6, 4).translate(x, y + 0.92 * s, z));
        if (o.small) for (const dx of [-1.6, 1.6]) bk(L(o.c), new THREE.SphereGeometry(0.7 * s, 8, 5, 0, 6.283, 0, 1.6).scale(1, 0.8, 1).translate(x + dx * s, y, z));
      },
      panda(x, y, z, s) {
        const W_ = L(0xf4f2ea), B = L(0x1e1e22);
        bk(W_, new THREE.SphereGeometry(1.3 * s, 10, 6).scale(1, 0.85, 0.8).translate(x, y + 1.1 * s, z));
        for (const sd of [-1, 1]) { bk(B, new THREE.SphereGeometry(0.42 * s, 6, 4).translate(x + sd * 0.95 * s, y + 2.0 * s, z)); bk(B, new THREE.SphereGeometry(0.3 * s, 6, 4).scale(1, 1.3, 0.6).translate(x + sd * 0.45 * s, y + 1.25 * s, z + 0.95 * s)); }
        bk(B, new THREE.SphereGeometry(0.16 * s, 5, 4).translate(x, y + 0.9 * s, z + 1.05 * s));
      },
      cutlet(x, y, z, s, o) {
        bk(L(0xf4f2ea), new THREE.CylinderGeometry(1.8 * s, 1.5 * s, 0.18 * s, 14).translate(x, y + 0.09 * s, z));
        const c = o.c || 0xb8742a;
        if (o.round) bk(L(c), new THREE.SphereGeometry(1.0 * s, 8, 5).scale(1.2, 0.55, 1).translate(x, y + 0.6 * s, z));
        else for (let k = 0; k < 5; k++) bk(L(c), new THREE.BoxGeometry(0.5 * s, 0.5 * s, 1.6 * s).translate(x + (k - 2) * 0.55 * s, y + 0.45 * s, z));
        bk(L(0x8ac85a), new THREE.SphereGeometry(0.7 * s, 6, 4).scale(1, 0.5, 1).translate(x - 0.4 * s, y + 0.4 * s, z - 1.0 * s));   // キャベツ
      },
      sushi(x, y, z, s) {
        for (const [dx, c] of [[-1.0, 0xc8283a], [0.2, 0xf08a5a], [1.4, 0xf4f0e0]]) {
          bk(L(0xf6f4ee), new THREE.BoxGeometry(1.0 * s, 0.6 * s, 0.7 * s).translate(x + dx * s, y + 0.3 * s, z));
          bk(L(c), new THREE.BoxGeometry(1.15 * s, 0.2 * s, 0.8 * s).translate(x + dx * s, y + 0.7 * s, z));
        }
        bk(L(0x5a3a1a), new THREE.BoxGeometry(4.2 * s, 0.15 * s, 1.4 * s).translate(x + 0.2 * s, y - 0.05 * s, z));   // 寿司下駄
      },
      can(x, y, z, s) {
        bk(L(0xd8c070), new THREE.CylinderGeometry(0.9 * s, 0.9 * s, 2.2 * s, 12).translate(x, y + 1.1 * s, z));
        bk(L(0x8a2a1a), new THREE.CylinderGeometry(0.92 * s, 0.92 * s, 0.9 * s, 12).translate(x, y + 1.1 * s, z));
        bk(L(0xb8b8bc), new THREE.CylinderGeometry(0.85 * s, 0.85 * s, 0.08 * s, 12).translate(x, y + 2.22 * s, z));
      },
      cone(x, y, z, s) {
        bk(L(0xe0b070), new THREE.ConeGeometry(0.9 * s, 2.6 * s, 8).rotateX(Math.PI).translate(x, y + 1.3 * s, z));
        bk(L(0xfaf8f0), new THREE.SphereGeometry(0.9 * s, 8, 6).translate(x, y + 2.7 * s, z));
        for (let k = 0; k < 3; k++) bk(L(0xe0304a), new THREE.SphereGeometry(0.28 * s, 6, 4).translate(x + Math.cos(k * 2.1) * 0.6 * s, y + 3.2 * s, z + Math.sin(k * 2.1) * 0.6 * s));
      },
      stack(x, y, z, s) {
        bk(L(0xf4f2ea), new THREE.CylinderGeometry(1.8 * s, 1.5 * s, 0.18 * s, 14).translate(x, y + 0.09 * s, z));
        for (let k = 0; k < 3; k++) bk(L(0xd8a050), new THREE.CylinderGeometry(1.2 * s, 1.2 * s, 0.4 * s, 14).translate(x, y + (0.4 + k * 0.42) * s, z));
        bk(L(0xfaf8f0), new THREE.SphereGeometry(0.9 * s, 8, 6).scale(1, 0.8, 1).translate(x, y + 1.6 * s, z));
        bk(L(0xe0304a), new THREE.SphereGeometry(0.25 * s, 6, 4).translate(x, y + 2.35 * s, z));
      },
      onigiri(x, y, z, s) {
        bk(L(0xf8f6f0), new THREE.CylinderGeometry(1.4 * s, 1.4 * s, 0.9 * s, 3).rotateX(Math.PI / 2).translate(x, y + 1.0 * s, z));
        bk(L(0x1a2a1a), new THREE.BoxGeometry(1.0 * s, 0.9 * s, 0.95 * s).translate(x, y + 0.45 * s, z));
      },
      box(x, y, z, s, o) {
        bk(L(o.c), new THREE.BoxGeometry(2.6 * s, 0.9 * s, 1.7 * s).translate(x, y + 0.45 * s, z));
        if (!o.plain) { bk(L(o.lid), new THREE.BoxGeometry(2.7 * s, 0.2 * s, 1.8 * s).translate(x, y + 1.0 * s, z)); bk(L(0xe8d070), new THREE.BoxGeometry(0.3 * s, 0.24 * s, 1.85 * s).translate(x, y + 1.02 * s, z)); }
        if (o.grain) for (let k = 0; k < 20; k++) bk(L(0xf0d890), new THREE.BoxGeometry(0.12 * s, 0.1 * s, 0.12 * s).translate(x + rr(-1.2, 1.2) * s, y + 0.92 * s, z + rr(-0.75, 0.75) * s));
        if (o.plain && !o.grain) for (let k = 1; k < 4; k++) bk(L(0xd8b030), new THREE.BoxGeometry(0.05 * s, 0.92 * s, 1.72 * s).translate(x + (k - 2) * 0.6 * s, y + 0.45 * s, z));
      },
      cup(x, y, z, s) {
        bk(L(0xf4f2ea), new THREE.CylinderGeometry(0.9 * s, 0.75 * s, 1.6 * s, 12).translate(x, y + 0.8 * s, z));
        bk(L(0x5a3a1a), new THREE.CylinderGeometry(0.85 * s, 0.85 * s, 0.06 * s, 12).translate(x, y + 1.58 * s, z));
        bk(L(0xf4f2ea), new THREE.TorusGeometry(0.4 * s, 0.12 * s, 5, 10).translate(x + 1.0 * s, y + 0.85 * s, z));
        for (let k = 0; k < 3; k++) bk(L(0xe8e8e8), new THREE.SphereGeometry((0.25 + k * 0.08) * s, 5, 3).translate(x + Math.sin(k) * 0.2 * s, y + (2.0 + k * 0.55) * s, z));   // 湯気
      },
      daifuku(x, y, z, s, o) {
        bk(L(o.c || 0xf8f6f0), new THREE.SphereGeometry(1.1 * s, 10, 6).scale(1, 0.75, 1).translate(x, y + 0.75 * s, z));
        bk(L(0x5a2a2a), new THREE.SphereGeometry(0.35 * s, 6, 4).translate(x + 0.95 * s, y + 0.7 * s, z));   // 割ったところのあんこ
        if (o.leaf) bk(L(0x5a7a3a), new THREE.SphereGeometry(1.2 * s, 8, 5, 0, 3.2).scale(1, 0.2, 0.9).translate(x, y + 0.3 * s, z));
      },
    };

    // ---- お店を建てる
    const WALLS = ['WOOD', 'resi2', 'JB_KS2', 'office2'], NOREN = [0x2a3a6a, 0x7a2a22, 0xe8e0d0, 0x2a5a3a];
    const GLAN = glow(lam({ color: 0xf04030 }), '#ff7050', 1.0), POLE = lam({ color: 0x5a5650 });
    for (const [area, food, emoji, anc, kind, opt, note] of LIST) {
      const at = find(...anc); if (!at) { console.warn('名物グルメの場所が見つからない', area, food); continue; }
      const [cx, cz] = at, x0 = cx - W / 2, z0 = cz - D / 2, x1 = cx + W / 2, z1 = cz + D / 2;
      // 正面は目印の方 (4方向のどれか)
      const dx = anc[0] - cx, dz = anc[1] - cz, fx = Math.abs(dx) > Math.abs(dz) ? Math.sign(dx) || 1 : 0, fz = fx ? 0 : Math.sign(dz) || 1;
      const F = frame(cx, cz, -fz, fx, fx, fz);   // u = 店の幅の向き、v = 正面 (外) の向き
      LM_ZONES.push(F.rect(-W / 2 - 2, -D / 2 - 2, W / 2 + 2, D / 2 + 7));
      oBox(F, pick(WALLS), -W / 2, -D / 2, W / 2, D / 2, 0, 4.6);
      oBox(F, 'ROOF', -W / 2 - 0.4, D / 2 - 0.2, W / 2 + 0.4, D / 2 + 1.4, 3.0, 3.25, { solid: false });   // ひさし
      oTiles(F, -W / 2 - 1, D / 2, W / 2 + 1, D / 2 + 6, '#c8bea8', '#b8ae98', 2);
      frontSign(F, 0, D / 2 + 0.05, 1, food, '#2a2018', '#fff2d8', 7.5, 1.4, 3.8, { tw: 200, th: 34 });
      { const ry = Math.atan2(F.vx, F.vz), m = L(pick(NOREN)); for (const du of [-2.2, -0.75, 0.75, 2.2]) { const [nx, nz] = F.w(du, D / 2 + 0.08); bake(m, new THREE.PlaneGeometry(1.35, 1.3).rotateY(ry).translate(nx, 2.4, nz)); } }
      const LAN = GLAN; for (const du of [-W / 2 + 0.6, W / 2 - 0.6]) { const [lx, lz] = F.w(du, D / 2 + 0.5); bake(LAN, new THREE.CylinderGeometry(0.3, 0.3, 0.6, 8).translate(lx, 2.6, lz)); }
      // 屋根の上の大きな模型 (台の上にのせる)
      bake(POLE, new THREE.CylinderGeometry(0.18, 0.22, 2.2, 6).translate(...F.w(0, D / 2 - 1.5).flatMap((q, i) => i ? [5.7, q] : [q])));   // 屋根の上の支柱
      GEO = []; (MODEL[kind] || MODEL.dome)(0, 0, 0, 1, opt);
      const FLAT = ['monja', 'plate', 'sanma', 'sushi', 'box', 'cutlet', 'stack', 'nabe', 'bowl'].includes(kind);
      const [mx, mz] = F.w(0, D / 2 - 1.5), M4 = new THREE.Matrix4().compose(new THREE.Vector3(mx, 6.8, mz), new THREE.Quaternion().setFromEuler(new THREE.Euler(FLAT ? 0.55 : 0, Math.atan2(fx, fz), 0, 'YXZ')), new THREE.Vector3(1.7, 1.7, 1.7));
      for (const [m, g] of GEO) bake(m, g.applyMatrix4(M4));
      // 店の前に並ぶ人と、食べ歩きの人
      const [qa, qb] = [F.w(W / 2 - 1, D / 2 + 1.6), F.w(W / 2 + 5, D / 2 + 1.6)];
      LM_PEOPLE.push([[...qa, ...qb], 3], [[...F.w(-W / 2 - 1, D / 2 + 4.5), ...F.w(W / 2 + 1, D / 2 + 4.5)], 2]);
      // 名前・地図・豆知識
      const name = `${food} (${area}の名物)`;
      SPOT_AREAS.unshift([name, ...polyBB(F.rect(-W / 2 - 1, -D / 2 - 1, W / 2 + 1, D / 2 + 7))]);
      LM_LABELS.push([food, cx, cz, emoji, name]);
      LM_NOTES[name] = note;
      GOURMET.push({ name, food, area, emoji, x: cx, z: cz });
    }
    LM_ACH.push(['gourmet5', '🍴 食べ歩き', '名物グルメのお店を5軒見つける', () => typeof GOURMET_FOUND !== 'undefined' && GOURMET_FOUND.size >= 5],
      ['gourmet20', '🍱 食べ歩きの達人', '名物グルメのお店を20軒見つける', () => typeof GOURMET_FOUND !== 'undefined' && GOURMET_FOUND.size >= 20],
      ['gourmetAll', '👑 東京グルメ図鑑', '名物グルメのお店をすべて見つける', () => typeof GOURMET_FOUND !== 'undefined' && GOURMET_FOUND.size >= GOURMET.length]);
    bakeFlush();
  },
});
