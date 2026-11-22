/* 野生の生きもの (竹芝のカモメの仲間たち)
   エリアに合った生きものを、それぞれの場所で暮らさせる。
   - 空を回る鳥 (ユリカモメ・カラス・インコ) / 地面をつつく鳥 (ハト・スズメ・カラス。近づくといっせいに飛び立ち、しばらくすると戻ってくる)
   - 水に浮かぶ鳥 (カルガモの親子・キンクロハジロ・カワウ) / 水辺に立つサギ (近づくと別の場所へ飛んでいく) / カワセミ (ときどき水に飛び込む)
   - 池のコイ (人が近づくと寄ってくる) / 甲羅干しのカメ (近づくと水にもぐる) / 夜だけ歩くタヌキ / 庭園のアゲハチョウ
   種類ごとに1つの InstancedMesh で描き、プレイヤーから遠い群れは動かさずに隠す (遠景のチャンク分けには入らない)。
   初めて近くで見ると「いきもの図鑑」に記録される (game/30_fun.js)。 */
const WILD_SP = [];   // 図鑑の順番 [{ id, name, emoji, fact, see, list }]
let WILD_NEAR = () => Infinity;   // (種) => プレイヤーからいちばん近い、見えている1匹までの距離
REGION({
  name: '野生の生きもの',
  towns: [],
  labels: [],
  build(r) {
    const PI = Math.PI, TAU = PI * 2;
    // ---- 形: 色つきの部品を1つのジオメトリにまとめる (頂点カラー)
    const CC = new THREE.Color();
    const part = (g, col) => {
      g = g.index ? g.toNonIndexed() : g; g.deleteAttribute('uv');
      const n = g.attributes.position.count, c = new Float32Array(n * 3); CC.set(col);
      for (let i = 0; i < n; i++) { c[i * 3] = CC.r; c[i * 3 + 1] = CC.g; c[i * 3 + 2] = CC.b; }
      g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g;
    };
    const merge = parts => {
      let n = 0; for (const g of parts) n += g.attributes.position.count;
      const Pp = new Float32Array(n * 3), Nn = new Float32Array(n * 3), Cc = new Float32Array(n * 3); let o = 0;
      for (const g of parts) { if (!g.attributes.normal) g.computeVertexNormals(); Pp.set(g.attributes.position.array, o); Nn.set(g.attributes.normal.array, o); Cc.set(g.attributes.color.array, o); o += g.attributes.position.count * 3; }
      const G = new THREE.BufferGeometry();
      G.setAttribute('position', new THREE.BufferAttribute(Pp, 3)); G.setAttribute('normal', new THREE.BufferAttribute(Nn, 3)); G.setAttribute('color', new THREE.BufferAttribute(Cc, 3));
      return G;
    };
    const ell = (rx, ry, rz, x, y, z, col, seg = 6) => part(new THREE.SphereGeometry(1, seg, 4).scale(rx, ry, rz).translate(x, y, z), col);
    const bx = (w, h, d, x, y, z, col, rx = 0) => part(new THREE.BoxGeometry(w, h, d).rotateX(rx).translate(x, y, z), col);
    const beak = (rad, len, x, y, z, col, down = 0) => part(new THREE.ConeGeometry(rad, len, 4).rotateX(PI / 2 + down).translate(x, y, z + len / 2), col);
    const pair = (f, x, ...a) => [f(x), f(-x)];
    // 翼: 左右1枚ずつの三角形。付け根の高さで上下に scale.y を振ると羽ばたく (竹芝のカモメと同じしかけ)
    const wingGeo = (span, chord, col, tip, lift = 0.3) => {
      const g = new THREE.BufferGeometry(), p = [], c = [], A = new THREE.Color(col), B = new THREE.Color(tip);
      for (const sd of [-1, 1]) { p.push(0, 0, chord * 0.5, 0, 0, -chord * 0.5, sd * span, span * lift, -chord * 0.25); c.push(A.r, A.g, A.b, A.r, A.g, A.b, B.r, B.g, B.b); }
      g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); g.computeVertexNormals(); return g;
    };
    const MB = lam({ vertexColors: true }), MW = lam({ vertexColors: true, side: THREE.DoubleSide });
    // ---- 種類 (図鑑の順番)。see = 図鑑に記録される距離、wy = 翼の付け根の高さ
    const SP = {};
    const def = (id, name, emoji, o) => { SP[id] = { id, name, emoji, see: 16, wy: 0, list: [], ...o }; WILD_SP.push(SP[id]); };
    def('kamome', 'カモメ (竹芝)', '🕊', { ext: true, see: 45,
      fact: 'カモメの仲間の多くは、冬だけ日本に来る渡り鳥。一年じゅう日本の海辺にいるのはウミネコで、ネコのような声で「ミャーオ」と鳴く' });
    def('yuri', 'ユリカモメ', '🕊', { see: 45, flapK: 'glide', s: 1.7,
      fact: '冬に北の国から渡ってくる小さなカモメ。赤いくちばしと足が目印。昔の歌に出てくる「都鳥(みやこどり)」はこの鳥で、東京都の鳥にもなっている',
      body: [ell(0.12, 0.11, 0.3, 0, 0, 0, '#f4f4f0'), ell(0.09, 0.09, 0.09, 0, 0.05, 0.3, '#fbfbf8'), ...pair(x => ell(0.03, 0.03, 0.02, x, 0.07, 0.31, '#3a3a3a'), 0.07), beak(0.025, 0.12, 0, 0.04, 0.37, '#d02a20'), bx(0.16, 0.03, 0.14, 0, 0.01, -0.34, '#f0f0ee')],
      wing: wingGeo(0.95, 0.34, '#dfe4ea', '#222') });
    def('karasu', 'ハシブトガラス', '🐦‍⬛', { see: 40, wy: 0.42, flush: 6, walk: 0.9, flapF: 9, s: 1.5,
      fact: '東京の街に多いのは、くちばしの太い「ハシブトガラス」。もとは森の鳥で、高いビルを森の木のかわりにしている',
      body: [ell(0.2, 0.19, 0.36, 0, 0.42, 0, '#16161a'), ell(0.13, 0.12, 0.14, 0, 0.6, 0.3, '#141418'), beak(0.06, 0.2, 0, 0.6, 0.4, '#0e0e10'), bx(0.2, 0.04, 0.3, 0, 0.44, -0.44, '#121216', -0.2), ...pair(x => bx(0.04, 0.24, 0.04, x, 0.12, 0, '#1a1a1a'), 0.08)],
      wing: wingGeo(0.9, 0.4, '#1c1c22', '#0c0c10', 0.2) });
    def('hato', 'ドバト', '🕊', { wy: 0.3, flush: 3.5, walk: 0.7, flapF: 16, s: 1.6, see: 18,
      fact: 'もとは岩場にすむカワラバト。駅やビルのでっぱりを、ふるさとの岩だなのかわりにして暮らしている',
      body: [ell(0.16, 0.15, 0.26, 0, 0.3, 0, '#7f8492'), ell(0.11, 0.09, 0.09, 0, 0.4, 0.15, '#4f7a6e'), ell(0.09, 0.09, 0.09, 0, 0.47, 0.22, '#6a7080'), beak(0.025, 0.08, 0, 0.46, 0.3, '#d8c8b0'), bx(0.14, 0.03, 0.18, 0, 0.32, -0.3, '#555a66'), ...pair(x => bx(0.03, 0.15, 0.03, x, 0.07, 0, '#c05050'), 0.06)],
      wing: wingGeo(0.5, 0.26, '#9aa0ac', '#3a3e48') });
    def('suzume', 'スズメ', '🐤', { wy: 0.2, flush: 5, walk: 1.5, hop: true, flapF: 22, s: 1.9,
      fact: '人の暮らしのそばでしか生きられない鳥といわれる。人が住まなくなった村からは、スズメもいなくなってしまうらしい',
      body: [ell(0.1, 0.09, 0.15, 0, 0.2, 0, '#8a6440'), ell(0.098, 0.06, 0.13, 0, 0.17, 0.01, '#d8ccb8'), ell(0.075, 0.075, 0.075, 0, 0.29, 0.1, '#7a4628'), ...pair(x => ell(0.02, 0.025, 0.025, x, 0.28, 0.13, '#202020'), 0.06), ell(0.06, 0.04, 0.04, 0, 0.26, 0.15, '#f0ece0'), beak(0.02, 0.05, 0, 0.28, 0.17, '#2a2a2a'), bx(0.06, 0.02, 0.12, 0, 0.22, -0.17, '#5a3e24')],
      wing: wingGeo(0.3, 0.16, '#9a7650', '#3a2a18') });
    def('karugamo', 'カルガモ', '🦆', { flee: 5, v: 0.5, s: 1.7, see: 22,
      fact: '一年じゅう日本にいるカモ。1984年、大手町のビルの池から皇居のお濠へ引っ越す親子の行列がニュースになり、大人気になった',
      body: [ell(0.22, 0.13, 0.34, 0, 0.1, 0, '#6e5a42'), ell(0.1, 0.1, 0.11, 0, 0.3, 0.25, '#8a7a60'), bx(0.205, 0.025, 0.1, 0, 0.32, 0.27, '#3a3024'), bx(0.07, 0.035, 0.12, 0, 0.28, 0.38, '#2a2a2a'), bx(0.07, 0.037, 0.04, 0, 0.28, 0.45, '#e8c830'), bx(0.14, 0.06, 0.12, 0, 0.14, -0.36, '#3e3024', -0.4)] });
    def('kinkuro', 'キンクロハジロ', '🦆', { flee: 5, v: 0.45, s: 1.7, see: 22,
      fact: '金色の目 (キン)、黒い体 (クロ)、白い羽 (ハジロ) で「キンクロハジロ」。冬になると皇居のお濠や不忍池にたくさんやってくる',
      body: [ell(0.2, 0.12, 0.3, 0, 0.09, 0, '#1a1a1e'), ell(0.21, 0.07, 0.17, 0, 0.09, 0.01, '#f2f2f2'), ell(0.1, 0.1, 0.1, 0, 0.26, 0.22, '#141418'), bx(0.03, 0.07, 0.1, 0, 0.32, 0.13, '#141418', 0.5), ...pair(x => ell(0.022, 0.022, 0.022, x, 0.28, 0.27, '#f0c020'), 0.08), bx(0.06, 0.03, 0.1, 0, 0.24, 0.34, '#7a90a0')] });
    def('kawau', 'カワウ', '🐦‍⬛', { flee: 6, v: 0.6, wy: 0.35, s: 1.6, see: 22,
      fact: '水にもぐって魚をとる黒い鳥。羽が水をはじきにくいので、岸で翼を大きく広げて干している',
      body: [ell(0.18, 0.15, 0.4, 0, 0.16, 0, '#1e2220'), bx(0.07, 0.26, 0.07, 0, 0.35, 0.28, '#1e2220', 0.25), ell(0.07, 0.065, 0.12, 0, 0.5, 0.36, '#202422'), ell(0.04, 0.04, 0.05, 0, 0.46, 0.42, '#e8c870'), beak(0.03, 0.16, 0, 0.5, 0.45, '#3a3a30')],
      wing: wingGeo(0.7, 0.34, '#2a2e2c', '#1a1c1a', 0.1) });
    def('aosagi', 'アオサギ', '🪶', { flee: 9, wy: 0.88, s: 1.4, see: 22,
      fact: '日本でいちばん大きなサギ。水辺でじっと動かずに待ち、近づいた魚を長いくちばしで一瞬でつかまえる',
      body: [...pair(x => bx(0.035, 0.75, 0.035, x, 0.37, 0, '#a89060'), 0.06), ell(0.17, 0.19, 0.36, 0, 0.88, -0.03, '#8a929c'), ell(0.175, 0.1, 0.3, 0, 0.95, -0.06, '#646c78'), bx(0.06, 0.42, 0.06, 0, 1.15, 0.24, '#d8dce0', 0.35), ell(0.065, 0.065, 0.1, 0, 1.38, 0.32, '#f0f0f0'), bx(0.02, 0.02, 0.16, 0, 1.42, 0.2, '#202020'), beak(0.03, 0.24, 0, 1.37, 0.4, '#e0b030')],
      wing: wingGeo(1.0, 0.5, '#7a828c', '#2a2e34', 0.15) });
    def('kosagi', 'コサギ', '🪶', { flee: 8, wy: 0.6, s: 1.5, see: 22,
      fact: '真っ白なサギで、黒い足の先だけが黄色い。足で水の中をふるわせて、かくれている魚を追い出してつかまえる',
      body: [...pair(x => bx(0.03, 0.52, 0.03, x, 0.26, 0, '#1a1a1a'), 0.05), ...pair(x => bx(0.06, 0.02, 0.1, x, 0.01, 0.03, '#e8d030'), 0.05), ell(0.12, 0.13, 0.26, 0, 0.62, -0.02, '#fafafa'), bx(0.045, 0.3, 0.045, 0, 0.8, 0.18, '#f6f6f6', 0.3), ell(0.05, 0.05, 0.07, 0, 0.96, 0.24, '#fafafa'), beak(0.022, 0.18, 0, 0.95, 0.3, '#1a1a1a')],
      wing: wingGeo(0.7, 0.36, '#f4f4f4', '#e8e8e8', 0.15) });
    def('kawasemi', 'カワセミ', '💎', { flee: 5, wy: 0.12, s: 2.4, see: 16,
      fact: '「空飛ぶ宝石」と呼ばれる青い小鳥。1968年ごろには東京の山奥でしか見られなくなったが、川がきれいになって都心にも戻ってきた',
      body: [ell(0.06, 0.06, 0.1, 0, 0.1, 0, '#e07a30'), ell(0.062, 0.05, 0.1, 0, 0.13, -0.01, '#18a0d8'), ell(0.06, 0.06, 0.06, 0, 0.19, 0.08, '#1888c8'), ...pair(x => ell(0.015, 0.02, 0.02, x, 0.18, 0.1, '#f0a060'), 0.05), beak(0.018, 0.13, 0, 0.18, 0.13, '#1a1a1a'), bx(0.035, 0.02, 0.07, 0, 0.11, -0.12, '#1a70b0')],
      wing: wingGeo(0.24, 0.12, '#20a8e0', '#106090') });
    def('koi', 'コイ', '🐟', { see: 16, v: 0.5, s: 2.0,
      fact: 'じつはコイには胃がない。食べたものは、口からそのまま長い腸へ送られていく',
      body: [ell(0.13, 0.06, 0.42, 0, 0, 0, '#ffffff'), part(new THREE.ConeGeometry(0.16, 0.24, 4).rotateX(-PI / 2).scale(1, 0.25, 1).translate(0, 0, -0.5), '#ffffff'), ...pair(x => bx(0.12, 0.01, 0.08, x, -0.02, 0.18, '#ffffff'), 0.12)] });
    def('kame', 'アカミミガメ', '🐢', { see: 16, s: 1.5,
      fact: '池の石の上で甲羅干しをするのは、体を温めて甲羅を乾かすため。耳のところの赤い模様が名前の由来',
      body: [ell(0.25, 0.12, 0.3, 0, 0.1, 0, '#4a5a30', 8), ell(0.27, 0.04, 0.32, 0, 0.06, 0, '#6a6a40', 8), ell(0.06, 0.05, 0.09, 0, 0.1, 0.34, '#5a6a3a'), ...pair(x => ell(0.025, 0.02, 0.03, x, 0.12, 0.33, '#c03020'), 0.045), ...pair(x => ell(0.06, 0.03, 0.06, x, 0.04, 0.18, '#5a6a3a'), 0.2), ...pair(x => ell(0.06, 0.03, 0.06, x, 0.04, -0.2, '#5a6a3a'), 0.2)] });
    def('inko', 'ワカケホンセイインコ', '🦜', { see: 45, flapF: 13, s: 1.8,
      fact: 'インドやスリランカ生まれの大きなインコ。ペットとして日本に来たものが逃げ出して増え、東京の空で野生化している',
      body: [ell(0.1, 0.1, 0.2, 0, 0, 0, '#4cc23a'), ell(0.085, 0.085, 0.085, 0, 0.04, 0.2, '#5ad048'), beak(0.04, 0.07, 0, 0.02, 0.27, '#d82020', 0.5), bx(0.05, 0.02, 0.42, 0, 0, -0.38, '#3aa030')],
      wing: wingGeo(0.5, 0.24, '#46b836', '#2a7a20') });
    def('tanuki', 'タヌキ', '🦝', { see: 20, flee: 9, s: 1.3,
      fact: '都心でも、皇居や赤坂御用地、新宿御苑、自然教育園などの大きな緑地でタヌキが暮らしている。夜になると、こっそり歩き回る',
      body: [ell(0.25, 0.22, 0.4, 0, 0.42, 0, '#7a6448'), ell(0.2, 0.12, 0.3, 0, 0.56, -0.02, '#5a4834'), ...[[0.14, 0.22], [-0.14, 0.22], [0.14, -0.22], [-0.14, -0.22]].map(([x, z]) => bx(0.08, 0.26, 0.08, x, 0.13, z, '#2a2420')),
        ell(0.17, 0.15, 0.16, 0, 0.56, 0.38, '#8a7458'), ell(0.13, 0.06, 0.06, 0, 0.57, 0.5, '#2a2420'), ell(0.06, 0.05, 0.09, 0, 0.5, 0.55, '#d8c8a8'), ell(0.025, 0.025, 0.02, 0, 0.51, 0.64, '#151515'), ...pair(x => bx(0.07, 0.08, 0.03, x, 0.72, 0.34, '#3a3028'), 0.1), ell(0.09, 0.09, 0.2, 0, 0.42, -0.48, '#5a4834'), ell(0.07, 0.07, 0.08, 0, 0.4, -0.66, '#2a2420')] });
    def('ageha', 'アゲハチョウ', '🦋', { see: 14, wy: 0, s: 2.4, flapF: 24,
      fact: 'チョウは足の先で味が分かる。葉っぱにとまって、卵を産んでいい草かどうかを足で確かめている',
      body: [bx(0.03, 0.03, 0.24, 0, 0, 0, '#202020')],
      wing: (() => { const g = new THREE.BufferGeometry(), p = [], c = [], Y = new THREE.Color('#f0d040'), K = new THREE.Color('#1a1a1a');
        for (const sd of [-1, 1]) { p.push(0, 0, 0.1, 0, 0, -0.1, sd * 0.3, 0.1, 0.16, 0, 0, -0.1, 0, 0, 0.02, sd * 0.2, 0.06, -0.22); c.push(...[Y, Y, K, Y, Y, K].flatMap(q => [q.r, q.g, q.b])); }
        g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); g.computeVertexNormals(); return g; })() });
    // ---- 群れ (場所ごと)。位置はゲームが始まってから、近づいたときに決める (地面の高さや水辺の判定が全部そろってから)
    const COL = [];
    const col = (sp, kind, cx, cz, R, n, o = {}) => { const c = { sp: SP[sp], kind, cx, cz, R, n, ...o, A: [], on: false, init: false }; COL.push(c); return c; };
    const pondNear = (x, z) => { let best = null, bd = 1e9; for (const p of PONDS) { const d = Math.hypot(p[0] - x, p[1] - z) - Math.min(p[2], p[3]); if (d < bd) { bd = d; best = p; } } return bd < 60 ? best : null; };
    const riverNear = (x, z) => {   // いちばん近い川の区間 [始点, 終点, 川幅の半分]
      let best = null, bd = 1e9;
      for (const rv of RIVERS) for (let i = 0; i + 1 < rv.pts.length; i++) {
        const [ax, az] = rv.pts[i], [bx_, bz] = rv.pts[i + 1], dx = bx_ - ax, dz = bz - az, l2 = dx * dx + dz * dz, k = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l2));
        const d = Math.hypot(ax + dx * k - x, az + dz * k - z); if (d < bd) { bd = d; best = { ax, az, dx, dz, len: Math.sqrt(l2), w: rv.w, k }; }
      }
      return best;
    };
    // 水面: 池 (楕円) / 川 (区間) / お濠 (長方形)。inside は陸地 (島・橋) をのぞく
    const WATER = {
      pond: (x, z) => { const p = pondNear(x, z); if (!p) return null; return { y: () => groundY(p[0], p[1]) + 0.04, shape: (qx, qz) => ((qx - p[0]) / (p[2] * 0.9)) ** 2 + ((qz - p[1]) / (p[3] * 0.9)) ** 2 < 1,
        rnd: () => { const a = rnd() * TAU, k = Math.sqrt(rnd()) * 0.9; return [p[0] + Math.cos(a) * k * p[2], p[1] + Math.sin(a) * k * p[3]]; },
        edge: () => { const a = rnd() * TAU; return [p[0] + Math.cos(a) * p[2] * 0.93, p[1] + Math.sin(a) * p[3] * 0.93]; }, cx: p[0], cz: p[1] }; },
      river: (x, z, L = 70) => { const s = riverNear(x, z); if (!s) return null; const ux = s.dx / s.len, uz = s.dz / s.len, nx = -uz, nz = ux, k0 = s.k * s.len, lo = Math.max(2, k0 - L), hi = Math.min(s.len - 2, k0 + L);
        const at = (u, v) => [s.ax + ux * u + nx * v, s.az + uz * u + nz * v];
        return { y: () => -1.56, shape: (qx, qz) => { const u = (qx - s.ax) * ux + (qz - s.az) * uz, v = (qx - s.ax) * nx + (qz - s.az) * nz; return u > lo && u < hi && Math.abs(v) < s.w * 0.85; },
          rnd: () => at(rr(lo, hi), rr(-0.75, 0.75) * s.w), edge: () => at(rr(lo, hi), (rnd() < 0.5 ? -1 : 1) * (s.w - 1.3)), cx: at((lo + hi) / 2, 0)[0], cz: at((lo + hi) / 2, 0)[1] }; },
      rect: (R, y = -2.14) => ({ y: () => y, shape: (qx, qz) => qx > R[0] + 1.5 && qx < R[2] - 1.5 && qz > R[1] + 1.5 && qz < R[3] - 1.5,
        rnd: () => [rr(R[0] + 2, R[2] - 2), rr(R[1] + 2, R[3] - 2)], edge: () => { const w = R[2] - R[0] < R[3] - R[1]; return w ? [rnd() < 0.5 ? R[0] + 2 : R[2] - 2, rr(R[1] + 4, R[3] - 4)] : [rr(R[0] + 4, R[2] - 4), rnd() < 0.5 ? R[1] + 2 : R[3] - 2]; }, cx: (R[0] + R[2]) / 2, cz: (R[1] + R[3]) / 2 }),
    };
    const MOAT_E = [-372, -2150, -336, -1560], MOAT_SAKURADA = [-1054, -1500, -722, -1458], MOAT_HIBIYA = [-456, -1500, -336, -1462], MOAT_NIJU = [-680, -1880, -640, -1580];
    const fly = (sp, cx, cz, n, o = {}) => col(sp, 'circle', cx, cz, (o.r || [20, 60])[1], n, { day: true, ...o });
    const ground = (sp, cx, cz, R, n, o = {}) => col(sp, 'ground', cx, cz, R, n, { day: true, ...o });
    const swim = (sp, W, n, o = {}) => W && col(sp, 'swim', W.cx, W.cz, 40, n, { W, ...o });
    const wade = (sp, W, n, o = {}) => W && col(sp, 'wade', W.cx, W.cz, 40, n, { W, ...o });
    const bask = (sp, W, n, o = {}) => W && col(sp, 'bask', W.cx, W.cz, 40, n, { W, ...o });
    const roam = (sp, R, n) => col(sp, 'roam', (R[0] + R[2]) / 2, (R[1] + R[3]) / 2, Math.max(R[2] - R[0], R[3] - R[1]) / 2, n, { rect: R, night: true });
    const flutter = (sp, cx, cz, R, n) => col(sp, 'flutter', cx, cz, R, n, { day: true });
    const pond = WATER.pond, river = WATER.river, rect = WATER.rect;
    // ユリカモメ: 隅田川・お台場・豊洲・不忍池 (空を回るものと、水に浮かんで休むもの)
    fly('yuri', 1000, -2420, 8, { r: [25, 70], h: [8, 20] }); fly('yuri', 1330, -3200, 7, { r: [25, 60], h: [8, 18] }); fly('yuri', 600, -1460, 6, { r: [20, 60], h: [8, 18] });
    fly('yuri', 900, 880, 8, { r: [30, 80], h: [8, 22] }); fly('yuri', 1300, 190, 5, { r: [25, 60], h: [8, 18] }); fly('yuri', 110, -3440, 6, { r: [15, 45], h: [6, 14] });
    swim('yuri', pond(110, -3440), 6, { lift: 0.08 }); swim('yuri', river(1000, -2420, 90), 6, { lift: 0.08 }); swim('yuri', river(1330, -3200, 90), 5, { lift: 0.08 });
    // カラス: 渋谷・新宿・池袋の空、明治神宮・皇居・上野の森。ごみをつつきに地面にも降りてくる
    fly('karasu', -3020, -300, 4, { r: [20, 55], h: [30, 55], flapK: 'slow' }); fly('karasu', -2950, -2300, 4, { r: [25, 60], h: [40, 70], flapK: 'slow' });
    fly('karasu', -3100, -1450, 5, { r: [20, 60], h: [22, 40], flapK: 'slow' }); fly('karasu', 250, -3650, 4, { r: [20, 50], h: [20, 35], flapK: 'slow' });
    fly('karasu', -850, -1850, 5, { r: [30, 70], h: [25, 45], flapK: 'slow' }); fly('karasu', -2560, -4450, 3, { r: [20, 50], h: [35, 60], flapK: 'slow' });
    ground('karasu', -3005, -222, 6, 2); ground('karasu', 330, -3700, 9, 3); ground('karasu', -2930, -2240, 7, 2);
    // ハト: お寺や駅前の広場
    ground('hato', 1300, -3735, 10, 14); ground('hato', 335, -3685, 10, 12); ground('hato', 318, -3455, 6, 6); ground('hato', -470, -1300, 9, 8);
    ground('hato', -520, -1780, 12, 10); ground('hato', -3012, -228, 7, 8); ground('hato', -560, -930, 10, 10); ground('hato', 233, -2742, 8, 6);
    ground('hato', -2651, -4509, 10, 8); ground('hato', 1190, -2620, 10, 6); ground('hato', -3457, -2205, 8, 6); ground('hato', -3680, -2200, 12, 8);
    ground('hato', -80, -1770, 15, 10); ground('hato', -3270, -940, 14, 8);
    // スズメ: 商店街・公園・庭園の植えこみのそば
    ground('suzume', -62, -4318, 6, 6); ground('suzume', -1463, -4749, 6, 6); ground('suzume', -450, -1650, 12, 10); ground('suzume', -3300, -900, 14, 10);
    ground('suzume', -2620, -1900, 12, 8); ground('suzume', -272, -3960, 8, 6); ground('suzume', -930, -4580, 10, 6); ground('suzume', -2700, -3100, 12, 8);
    ground('suzume', -760, -2980, 8, 6); ground('suzume', -500, -1180, 10, 8); ground('suzume', 1260, -3700, 8, 6);
    // カルガモの親子 (先頭の親のあとを、子ガモが1列でついていく)
    swim('karugamo', rect(MOAT_E), 1, { family: 6 }); swim('karugamo', rect(MOAT_E), 3); swim('karugamo', river(-2200, 1680, 60), 1, { family: 5 }); swim('karugamo', river(-1500, 1918, 60), 2);
    swim('karugamo', pond(-960, -4640), 1, { family: 5 }); swim('karugamo', pond(-2575, -1758), 1, { family: 4 }); swim('karugamo', pond(110, -3440), 4); swim('karugamo', pond(110, -3440), 1, { family: 5 });
    swim('karugamo', river(-480, -2872, 60), 2); swim('karugamo', pond(-828, -3040), 3);
    // キンクロハジロ (冬にお濠や池へやってくる)
    swim('kinkuro', pond(110, -3440), 14); swim('kinkuro', rect(MOAT_E), 8); swim('kinkuro', rect(MOAT_SAKURADA), 6); swim('kinkuro', rect(MOAT_HIBIYA), 4);
    swim('kinkuro', pond(-2355, -1895), 4); swim('kinkuro', river(-1460, -2427, 80), 6); swim('kinkuro', pond(-382, -1392), 4); swim('kinkuro', rect(MOAT_NIJU), 4);
    // カワウ (泳ぐものと、岸で翼を干すもの)
    swim('kawau', pond(110, -3440), 3, { v: 0.9 }); bask('kawau', pond(110, -3440), 3, { spread: true, y: 0.3 }); swim('kawau', river(1080, -2050, 90), 3, { v: 0.9 }); swim('kawau', rect(MOAT_SAKURADA), 2, { v: 0.9 });
    // コイ (庭園の池。人が近づくと寄ってくる)
    for (const [x, z, n] of [[-828, -3040, 12], [-960, -4640, 10], [-382, -1392, 8], [-2575, -1758, 8], [-3080, -1300, 8], [-2867, -3930, 6], [-990, -5100, 6], [-120, -3445, 6], [1242, -2738, 6], [-2140, -380, 5], [-540, -1216, 4], [-2648, -1764, 6]])
      swim('koi', pond(x, z), n, { koi: true, lift: 0.02 });
    for (const [x, z, n] of [[-512, -2400, 8], [-1960, 1010, 8], [-2262, -900, 5]]) swim('koi', pond(x, z), n, { koi: true, lift: 0.02 });
    swim('karugamo', pond(-512, -2400), 1, { family: 4 }); swim('kinkuro', pond(-512, -2400), 4); wade('aosagi', pond(-1960, 1010), 1);
    ground('suzume', -600, -2330, 12, 8); ground('suzume', -880, -2300, 12, 8); ground('hato', -950, -2640, 10, 12); ground('hato', -828, -2470, 8, 8);
    fly('karasu', -1000, -2640, 4, { r: [20, 50], h: [25, 40], flapK: 'slow' }); fly('yuri', 3400, 470, 8, { r: [30, 70], h: [8, 20] });
    flutter('ageha', -1960, 980, 22, 3); flutter('ageha', -2280, -900, 18, 2);
    // カメ (池の岸で甲羅干し)
    for (const [x, z, n] of [[110, -3440, 4], [-828, -3040, 3], [-2490, -1764, 3], [-120, -3445, 2], [-382, -1392, 2], [-960, -4640, 2]]) bask('kame', pond(x, z), n, { y: 0.05, rock: true });
    // サギ (川や池のふちに立つ)
    for (const [x, z] of [[-480, -2872], [420, -2598], [560, -1800], [-2477, 1476], [-1330, 1935], [1285, -3060], [-1576, -2360]]) wade('aosagi', river(x, z, 90), 1);
    for (const [x, z] of [[110, -3440], [-828, -3040], [-960, -4640], [-2575, -1758]]) wade('aosagi', pond(x, z), 1);
    wade('aosagi', rect(MOAT_E), 1);
    for (const [x, z, n] of [[-2080, 1704, 2], [-1060, 1965, 1], [-200, -2798, 1], [880, -2610, 1], [335, -1900, 1], [1110, -1940, 1]]) wade('kosagi', river(x, z, 80), n);
    // カワセミ (池のふちにとまって、ときどき水に飛び込む)
    for (const [x, z] of [[-2131, 1053], [-960, -4640], [-2575, -1758], [-120, -3445], [-828, -3040], [-2867, -3930]]) wade('kawasemi', pond(x, z), 1, { dive: true, perchY: 0.45 });
    wade('kawasemi', river(-2357, 1616, 60), 1, { dive: true, perchY: 1.7 });
    // ワカケホンセイインコ (目黒・白金のあたりの空を、群れで飛ぶ)
    fly('inko', -2130, 1050, 12, { r: [34, 40], h: [18, 22], flock: true, w: 0.42 }); fly('inko', -2300, 1550, 8, { r: [40, 46], h: [16, 20], flock: true, w: -0.38 });
    // タヌキ (夜だけ。大きな森のある公園)
    roam('tanuki', [-3200, -1500, -3050, -1390], 3); roam('tanuki', [-2200, 990, -2060, 1120], 2); roam('tanuki', [-2870, -1880, -2725, -1724], 2);
    roam('tanuki', [-2843, -3226, -2578, -2967], 1); roam('tanuki', [-1076, -4752, -846, -4533], 1);
    // アゲハチョウ (昼の庭園や花壇)
    for (const [x, z, n] of [[-990, -5120, 4], [-2445, -1827, 4], [-470, -1300, 3], [-960, -4580, 3], [-3270, -930, 3], [-2131, 1053, 3], [-450, -1700, 2], [1510, -3700, 3], [330, -3600, 2]]) flutter('ageha', x, z, 22, n);
    // ---- インスタンスの数を数えて、種類ごとに InstancedMesh をつくる
    for (const c of COL) {
      const k = c.family ? c.n * c.family + c.n : c.n;
      for (let i = 0; i < k; i++) { const a = { c, sp: c.sp, x: c.cx, y: 0, z: c.cz, yaw: rr(0, TAU), pitch: 0, roll: 0, flap: null, ph: rr(0, TAU), s: (c.sp.s || 1) * rr(0.9, 1.1), vis: false, hidden: false }; c.A.push(a); c.sp.list.push(a); }
    }
    const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
    for (const sp of WILD_SP) {
      if (sp.ext || !sp.list.length) continue;
      const im = new THREE.InstancedMesh(merge(sp.body), MB, sp.list.length); im.frustumCulled = false; im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(im); sp.im = im;
      if (sp.wing) { const wm = new THREE.InstancedMesh(sp.wing, MW, sp.list.length); wm.frustumCulled = false; wm.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(wm); sp.wim = wm; }
      sp.list.forEach((a, i) => { a.i = i; im.setMatrixAt(i, ZERO); if (sp.wim) sp.wim.setMatrixAt(i, ZERO); });
      if (sp.id === 'koi') { const KC = ['#ff7020', '#ffffff', '#e83020', '#ffc040', '#ff9a50', '#f4f0e8', '#303030']; sp.list.forEach((a, i) => im.setColorAt(i, new THREE.Color(KC[i % KC.length]))); }
      if (sp.id === 'karugamo') sp.list.forEach((a, i) => im.setColorAt(i, new THREE.Color('#ffffff')));
    }
    // ---- 描く
    const M4 = new THREE.Matrix4(), Mw = new THREE.Matrix4(), Mf = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(0, 0, 0, 'YXZ'), V = new THREE.Vector3(), S3 = new THREE.Vector3();
    const put = a => {
      const sp = a.sp; E.set(a.pitch, a.yaw, a.roll); Q.setFromEuler(E); V.set(a.x, a.y, a.z); S3.set(a.s, a.s, a.s); M4.compose(V, Q, S3);
      sp.im.setMatrixAt(a.i, M4);
      if (sp.wim) { if (a.flap === null) sp.wim.setMatrixAt(a.i, ZERO); else { Mw.makeTranslation(0, sp.wy, 0); Mf.makeScale(1, a.flap, 1); M4.multiply(Mw).multiply(Mf); sp.wim.setMatrixAt(a.i, M4); } }
      sp.dirty = true; a.vis = true;
    };
    const hide = a => { a.sp.im.setMatrixAt(a.i, ZERO); if (a.sp.wim) a.sp.wim.setMatrixAt(a.i, ZERO); a.sp.dirty = true; a.vis = false; };
    // ---- 動き
    const smooth = k => k * k * (3 - 2 * k), lerp = (a, b, k) => a + (b - a) * k;
    const angTo = (a, b) => { let d = b - a; while (d > PI) d -= TAU; while (d < -PI) d += TAU; return d; };
    const pdist = a => Math.hypot(P.x - a.x, P.z - a.z);
    const landY = (x, z) => floorAt(x, z, groundY(x, z) + 1);
    const inWater = (W, x, z) => W.shape(x, z) && !onLand(x, z);
    const clampW = (W, tx, tz, fx, fz) => {   // (fx, fz) から (tx, tz) へ向かって、水の中にいられるところまで
      if (inWater(W, tx, tz)) return [tx, tz];
      let lo = 0, hi = 1; for (let k = 0; k < 7; k++) { const m = (lo + hi) / 2; if (inWater(W, lerp(fx, tx, m), lerp(fz, tz, m))) lo = m; else hi = m; }
      return [lerp(fx, tx, lo), lerp(fz, tz, lo)];
    };
    const wRnd = W => { for (let k = 0; k < 12; k++) { const p = W.rnd(); if (inWater(W, p[0], p[1])) return p; } return null; };
    const landNear = c => {   // 群れの中心が水の上なら、いちばん近い陸地へずらす
      if (onLand(c.cx, c.cz)) return;
      for (let d = 2; d < 60; d += 2) for (let k = 0; k < 16; k++) { const a = k / 16 * TAU, x = c.cx + Math.cos(a) * d, z = c.cz + Math.sin(a) * d; if (onLand(x, z) && onLand(x + Math.cos(a) * 4, z + Math.sin(a) * 4)) { c.cx = x + Math.cos(a) * 4; c.cz = z + Math.sin(a) * 4; return; } }
    };
    const groundPt = c => { for (let k = 0; k < 10; k++) { const a = rnd() * TAU, d = Math.sqrt(rnd()) * c.R, x = c.cx + Math.cos(a) * d, z = c.cz + Math.sin(a) * d; if (onLand(x, z) && Math.abs(landY(x, z) - c.y0) < 0.3) return [x, z]; } return [c.cx, c.cz]; };
    const rectPt = c => { const R = c.rect; for (let k = 0; k < 10; k++) { const x = rr(R[0], R[2]), z = rr(R[1], R[3]); if (onLand(x, z)) return [x, z]; } return [c.cx, c.cz]; };
    const init = c => {
      c.init = true;
      const sp = c.sp;
      if (c.kind === 'circle') {
        const w0 = c.w || (rnd() < 0.5 ? -1 : 1) * rr(0.18, 0.32), ph0 = rr(0, TAU);
        c.A.forEach((a, i) => { a.cx = c.cx + rr(-15, 15); a.cz = c.cz + rr(-15, 15); a.r = rr(...(c.r || [20, 60])); a.h = rr(...(c.h || [10, 20])); a.w = c.flock ? w0 : (rnd() < 0.5 ? -1 : 1) * rr(0.15, 0.35) * 30 / a.r;
          if (c.flock) { a.cx = c.cx; a.cz = c.cz; a.ph = ph0 + i * 0.09 + rr(-0.03, 0.03); } });
      }
      if (c.kind === 'ground') {
        landNear(c); c.y0 = landY(c.cx, c.cz); c.mode = 'ground';
        for (const a of c.A) { const [x, z] = groundPt(c); a.hx = a.x = x; a.hz = a.z = z; a.y = c.y0; a.tx = x; a.tz = z; a.wait = rr(0, 3); }
      }
      if (c.kind === 'swim') {
        const W = c.W; c.y0 = W.y() + (c.lift || 0);
        let k = 0; while (k < c.A.length) {
          const p = wRnd(W) || [W.cx, W.cz], lead = c.A[k]; lead.x = p[0]; lead.z = p[1]; lead.tx = p[0]; lead.tz = p[1]; lead.v = c.v || sp.v || 0.5; k++;
          for (let j = 0; j < (c.family || 0); j++, k++) { const ch = c.A[k]; ch.lead = c.A[k - 1]; ch.x = lead.x - Math.sin(lead.yaw) * 0.8 * (j + 1); ch.z = lead.z - Math.cos(lead.yaw) * 0.8 * (j + 1); ch.s = lead.s * 0.45; ch.chick = true; sp.im.setColorAt(ch.i, new THREE.Color('#e8d070')); }
        }
        if (sp.im.instanceColor) sp.im.instanceColor.needsUpdate = true;
      }
      if (c.kind === 'wade' || c.kind === 'bask') {
        const W = c.W; c.yw = W.y();
        for (const a of c.A) { const p = W.edge(); a.x = p[0]; a.z = p[1]; a.y = c.yw + (c.perchY || c.y || 0); a.yaw = Math.atan2(W.cx - a.x, W.cz - a.z) + rr(-0.8, 0.8); a.next = rr(2, 10); a.st = -9;
          if (c.spread) a.flap = 0.55;
          if (c.rock) { const rk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), lam({ color: 0x7a766c })); rk.scale.set(1.2, 0.35, 1.2); rk.position.set(a.x, c.yw, a.z); scene.add(rk); a.y = c.yw + 0.2; } }
      }
      if (c.kind === 'roam') for (const a of c.A) { const [x, z] = rectPt(c); a.x = a.tx = x; a.z = a.tz = z; a.y0 = landY(x, z); a.y = a.y0; a.wait = rr(0, 4); }
      if (c.kind === 'flutter') { landNear(c); c.y0 = landY(c.cx, c.cz); for (const a of c.A) { a.cx = c.cx + rr(-8, 8); a.cz = c.cz + rr(-8, 8); a.r = rr(3, 8); a.f1 = rr(0.25, 0.5); a.f2 = rr(0.25, 0.5); } }
    };
    const flapOf = (sp, c, a, t) => {
      const K = c.flapK || sp.flapK, f = sp.flapF || 7;
      if (K === 'glide') return Math.sin(t * 0.35 + a.ph) > 0.3 ? 0.35 : Math.sin(t * 7 + a.ph) * 1.1;
      if (K === 'slow') return Math.sin(t * 0.3 + a.ph) > 0 ? 0.25 : Math.sin(t * f + a.ph);
      return Math.sin(t * f + a.ph);
    };
    const startFlight = (a, t, x1, z1, y1, dur, h) => { a.fl = { t0: t, dur, x0: a.x, z0: a.z, y0: a.y, x1, z1, y1, h }; };
    const doFlight = (a, t) => {   // 飛んでいる途中なら true
      const f = a.fl; if (!f) return false;
      const k = Math.min(1, (t - f.t0) / f.dur), e = smooth(k), px = a.x, pz = a.z;
      a.x = lerp(f.x0, f.x1, e); a.z = lerp(f.z0, f.z1, e); a.y = lerp(f.y0, f.y1, e) + Math.sin(PI * k) * f.h;
      if (Math.hypot(a.x - px, a.z - pz) > 1e-4) a.yaw = Math.atan2(a.x - px, a.z - pz);
      a.flap = k > 0.85 ? 0.3 : Math.sin(t * (a.sp.flapF || 7) + a.ph); a.pitch = 0;
      if (k >= 1) { a.fl = null; a.flap = null; }
      return true;
    };
    const UPD = {
      circle(c, dt, t) {
        for (const a of c.A) {
          const ang = t * a.w + a.ph; a.x = a.cx + Math.cos(ang) * a.r; a.z = a.cz + Math.sin(ang) * a.r; a.y = a.h + Math.sin(t * 0.7 + a.ph) * 1.5;
          a.yaw = Math.atan2(-Math.sin(ang) * a.w, Math.cos(ang) * a.w); a.roll = Math.sign(a.w) * 0.3; a.flap = flapOf(a.sp, c, a, t);
        }
      },
      ground(c, dt, t) {
        const sp = c.sp, fr = sp.flush * (P.scooter ? 1.8 : 1), near = Math.hypot(P.x - c.cx, P.z - c.cz) < c.R + fr + 3 && Math.abs(P.y - c.y0) < 3;
        if (c.mode === 'ground' && near && c.A.some(a => pdist(a) < fr)) {   // いっせいに飛び立つ
          c.mode = 'fly'; c.t0 = t; c.tf = rr(5, 8); c.dir = rnd() < 0.5 ? -1 : 1;
          for (const a of c.A) { a.gx = a.x; a.gz = a.z; a.a0 = Math.atan2(a.z - c.cz, a.x - c.cx); a.fr = c.R + rr(3, 9); a.fh = rr(4, 10) * (sp.id === 'suzume' ? 0.6 : 1); a.fw = c.dir * rr(5, 8) / a.fr; a.pitch = 0; }
        }
        if (c.mode === 'fly') {
          const tau = t - c.t0;
          if (tau > c.tf && near && Math.hypot(P.x - c.cx, P.z - c.cz) < c.R + fr + 2) c.tf = tau + 0.5;   // まだ人がいるあいだは降りてこない
          const kd = tau > c.tf ? smooth(Math.min(1, (tau - c.tf) / 2.5)) : 0, ku = smooth(Math.min(1, tau / 1.4));
          for (const a of c.A) {
            const ang = a.a0 + a.fw * tau, cx = c.cx + Math.cos(ang) * a.fr, cz = c.cz + Math.sin(ang) * a.fr, cy = c.y0 + a.fh + Math.sin(t * 1.3 + a.ph) * 0.6, px = a.x, pz = a.z;
            if (kd <= 0) { a.x = lerp(a.gx, cx, ku); a.z = lerp(a.gz, cz, ku); a.y = lerp(c.y0, cy, ku); } else { a.x = lerp(cx, a.hx, kd); a.z = lerp(cz, a.hz, kd); a.y = lerp(cy, c.y0, kd); }
            if (Math.hypot(a.x - px, a.z - pz) > 1e-3) a.yaw = Math.atan2(a.x - px, a.z - pz);
            a.flap = kd > 0.8 ? 0.4 : Math.sin(t * (sp.flapF || 14) + a.ph); a.roll = kd > 0 ? 0 : -c.dir * 0.25;
          }
          if (kd >= 1) { c.mode = 'ground'; for (const a of c.A) { a.x = a.tx = a.hx; a.z = a.tz = a.hz; a.y = c.y0; a.flap = null; a.roll = 0; a.wait = rr(0.5, 3); } }
          return;
        }
        for (const a of c.A) {
          a.y = c.y0;
          if (a.wait > 0) { a.wait -= dt; a.pitch = Math.sin(t * 9 + a.ph) > 0.55 ? 0.6 : 0.05; continue; }
          const dx = a.tx - a.x, dz = a.tz - a.z, d = Math.hypot(dx, dz);
          if (d < 0.08) { a.wait = rr(0.6, 4); const p = groundPt(c); a.tx = p[0]; a.tz = p[1]; continue; }
          const st = Math.min(d, sp.walk * dt); a.x += dx / d * st; a.z += dz / d * st; a.yaw = Math.atan2(dx, dz); a.pitch = 0;
          if (sp.hop) a.y += Math.abs(Math.sin(t * 13 + a.ph)) * 0.06;
        }
      },
      swim(c, dt, t) {
        const W = c.W, sp = c.sp;
        for (const a of c.A) {
          a.y = c.y0 + Math.sin(t * 1.5 + a.ph) * 0.015;
          if (a.lead) {   // 子ガモ: 前の1羽のすぐうしろについていく
            const L = a.lead, gap = L.s * 0.75, gx = L.x - Math.sin(L.yaw) * gap, gz = L.z - Math.cos(L.yaw) * gap, dx = gx - a.x, dz = gz - a.z, d = Math.hypot(dx, dz);
            if (d > 0.02) { const st = Math.min(d, Math.max(0.3, d * 2) * dt); a.x += dx / d * st; a.z += dz / d * st; a.yaw += angTo(a.yaw, Math.atan2(dx, dz)) * Math.min(1, dt * 5); }
            continue;
          }
          const pd = pdist(a);
          if (c.koi && pd < 14 && P.y < c.y0 + 5) { if (!a.att || t > a.att) { a.att = t + rr(1, 2.5); [a.tx, a.tz] = clampW(W, P.x + rr(-2, 2), P.z + rr(-2, 2), a.x, a.z); } a.v = 0.9; }
          else if (!c.koi && pd < sp.flee && P.y < c.y0 + 4 && !(a.run > t)) { a.run = t + 1.5; [a.tx, a.tz] = clampW(W, a.x + (a.x - P.x) / pd * 6, a.z + (a.z - P.z) / pd * 6, a.x, a.z); a.v = (c.v || sp.v || 0.5) * 3; }
          const dx = a.tx - a.x, dz = a.tz - a.z, d = Math.hypot(dx, dz);
          if (d < 0.3) { if (!c.koi || pd >= 14) { const p = wRnd(W); if (p) { a.tx = p[0]; a.tz = p[1]; } a.v = (c.v || sp.v || 0.5) * rr(0.6, 1.2); } continue; }
          a.yaw += Math.max(-dt * 1.8, Math.min(dt * 1.8, angTo(a.yaw, Math.atan2(dx, dz))));
          const nx = a.x + Math.sin(a.yaw) * a.v * dt, nz = a.z + Math.cos(a.yaw) * a.v * dt;
          if (inWater(W, nx, nz)) { a.x = nx; a.z = nz; } else { const p = wRnd(W); if (p) { a.tx = p[0]; a.tz = p[1]; } }
          if (c.koi) a.yaw += Math.sin(t * 6 + a.ph) * 0.004;
        }
      },
      wade(c, dt, t) {
        const W = c.W, sp = c.sp;
        for (const a of c.A) {
          if (doFlight(a, t)) continue;
          if (pdist(a) < sp.flee && Math.abs(P.y - a.y) < 4) {   // 人が近づくと、別の場所へ飛んでいく
            let q = W.edge(); for (let k = 0; k < 6 && Math.hypot(q[0] - P.x, q[1] - P.z) < 22; k++) q = W.edge();
            startFlight(a, t, q[0], q[1], c.yw + (c.perchY || 0), rr(2.5, 4), c.dive ? 2 : rr(4, 8)); continue;
          }
          if (c.dive) {   // カワセミ: ときどき水に飛び込んで、もとの場所に戻る
            if (t > a.next) { a.next = t + rr(7, 15); a.dv = t; const p = wRnd(W) || [W.cx, W.cz]; const k = 2.5 / Math.max(1, Math.hypot(p[0] - a.x, p[1] - a.z)); a.dx = a.x + (p[0] - a.x) * k; a.dz = a.z + (p[1] - a.z) * k; a.bx = a.x; a.bz = a.z; a.by = a.y; }
            const k = a.dv != null ? (t - a.dv) / 1.3 : 2;
            if (k < 1) { const e = Math.sin(PI * k); a.x = lerp(a.bx, a.dx, e); a.z = lerp(a.bz, a.dz, e); a.y = lerp(a.by, c.yw, e); a.yaw = Math.atan2(a.dx - a.bx, a.dz - a.bz); a.flap = Math.sin(t * 30); a.pitch = k < 0.5 ? 0.6 : -0.4; }
            else { if (a.dv != null) { a.x = a.bx; a.z = a.bz; a.y = a.by; a.dv = null; } a.flap = null; a.pitch = Math.sin(t * 2 + a.ph) * 0.06; }
            continue;
          }
          if (t > a.next) { a.next = t + rr(5, 14); a.st = t; if (rnd() < 0.4) a.yaw += rr(-0.6, 0.6); }
          const ks = t - a.st; a.pitch = ks < 0.6 ? Math.sin(ks / 0.6 * PI) * 0.45 : Math.sin(t * 0.5 + a.ph) * 0.03;
        }
      },
      bask(c, dt, t) {
        for (const a of c.A) {
          const pd = pdist(a);
          if (!a.hidden && pd < (c.spread ? 6 : 5) && Math.abs(P.y - a.y) < 4) { a.hidden = true; a.until = t + rr(15, 25); }   // ぽちゃん (水にもぐる)
          if (a.hidden && t > a.until && pd > 12) a.hidden = false;
          if (c.spread) { a.flap = 0.5 + Math.sin(t * 1.2 + a.ph) * 0.08; a.pitch = -0.15; }
          else a.pitch = Math.sin(t * 0.4 + a.ph) * 0.02;
        }
      },
      roam(c, dt, t) {
        for (const a of c.A) {
          const pd = pdist(a);
          if (pd < c.sp.flee && !(a.run > t)) { a.run = t + 3; const k = 12 / Math.max(1, pd); a.tx = Math.max(c.rect[0], Math.min(c.rect[2], a.x + (a.x - P.x) * k)); a.tz = Math.max(c.rect[1], Math.min(c.rect[3], a.z + (a.z - P.z) * k)); a.wait = 0; }
          if (a.wait > 0) { a.wait -= dt; a.pitch = Math.sin(t * 3 + a.ph) > 0.7 ? 0.25 : 0; a.y = a.y0; continue; }
          const dx = a.tx - a.x, dz = a.tz - a.z, d = Math.hypot(dx, dz);
          if (d < 0.2) { a.wait = rr(2, 7); const p = rectPt(c); a.tx = p[0]; a.tz = p[1]; continue; }
          const v = a.run > t ? 3.2 : 0.8, st = Math.min(d, v * dt), nx = a.x + dx / d * st, nz = a.z + dz / d * st;
          if (onLand(nx, nz)) { a.x = nx; a.z = nz; } else { a.tx = a.x; a.tz = a.z; }
          a.yaw += angTo(a.yaw, Math.atan2(dx, dz)) * Math.min(1, dt * 6); a.pitch = 0; a.y = a.y0 + Math.abs(Math.sin(t * (v > 1 ? 14 : 7) + a.ph)) * 0.05;
        }
      },
      flutter(c, dt, t) {
        for (const a of c.A) {
          const px = a.x, pz = a.z;
          a.x = a.cx + Math.sin(t * a.f1 + a.ph) * a.r + Math.sin(t * 1.7 + a.ph * 2) * 1.2; a.z = a.cz + Math.cos(t * a.f2 + a.ph) * a.r + Math.cos(t * 1.3 + a.ph) * 1.2;
          a.y = c.y0 + 1.3 + Math.sin(t * 2.1 + a.ph) * 0.6;
          if (Math.hypot(a.x - px, a.z - pz) > 1e-4) a.yaw = Math.atan2(a.x - px, a.z - pz);
          a.flap = Math.sin(t * 24 + a.ph) * 1.4;
        }
      },
    };
    LM_UPDATERS.push((dt, t) => {
      dt = Math.min(dt, 0.1);
      const day = gameH >= 5.5 && gameH < 18.5;
      for (const sp of WILD_SP) sp.act = 0;
      for (const c of COL) {
        const want = Math.hypot(P.x - c.cx, P.z - c.cz) - c.R < 320 && (c.day ? day : c.night ? !day : true);
        if (!want) { if (c.on) { c.on = false; c.A.forEach(hide); } continue; }
        if (!c.init) init(c);
        c.on = true; c.sp.act++; UPD[c.kind](c, dt, t);
        for (const a of c.A) if (a.hidden) { if (a.vis) hide(a); } else put(a);
      }
      for (const sp of WILD_SP) if (sp.im) { sp.im.visible = sp.act > 0; if (sp.wim) sp.wim.visible = sp.act > 0; }   // 近くに群れがいない種類は描かない
      for (const sp of WILD_SP) if (sp.dirty) { sp.im.instanceMatrix.needsUpdate = true; if (sp.wim) sp.wim.instanceMatrix.needsUpdate = true; sp.dirty = false; }
    });
    WILD_NEAR = sp => {
      let best = Infinity;
      if (sp.ext) { for (const g of GULLS) best = Math.min(best, g.m.position.distanceTo(V.set(P.x, P.y + 1.5, P.z))); return best; }
      for (const a of sp.list) if (a.vis && a.c.on) best = Math.min(best, Math.hypot(P.x - a.x, P.y + 1.5 - a.y, P.z - a.z));
      return best;
    };
    for (const sp of WILD_SP) LM_NOTES['🐾 ' + sp.name] = sp.fact;   // 豆知識帳にも載る (見つけたとき)
    LM_ACH.push(['wild5', '🐦 いきもの観察', '野生の生きものを5種類見つける', () => WILD_FOUND.size >= 5],
      ['wildAll', '🔭 いきもの博士', `野生の生きものを全部 (${WILD_SP.length}種類) 見つける`, () => WILD_FOUND.size >= WILD_SP.length]);
  },
});
