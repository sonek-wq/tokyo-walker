/* ============================================================
   遊び心: 名所のうんちく / ねこ / 実績 / 曜日・季節のイベント
   ============================================================ */
// ---- うんちく (エリアに入ると地名の下に表示)
const NOTES = {
  '東京タワー': '1958年完成、高さ333m。壁に向かって歩けばアンテナの先まで登れる',
  '東京タワー 大展望台': '地上150m。土曜の夜はタワーが七色の「ダイヤモンドヴェール」に',
  '東京タワー アンテナ頂上': '地上333m。ここから東京を見渡せるのはこのゲームだけ (空中で Space)',
  '増上寺': '徳川将軍家の菩提寺。6人の将軍が眠る',
  '増上寺 三解脱門': '1622年建立。戦災を免れた、東京でも有数の古い木造建築',
  '増上寺 千体子育地蔵': '赤い帽子と風車の地蔵がずらり。風車がカラカラと回る',
  '芝大門 (大門)': 'かつての増上寺の総門。いまは車が門の下をくぐる',
  '芝大神宮': '「関東のお伊勢さま」。秋の祭りは長く続くので「だらだら祭り」',
  '芝東照宮': '家康公を祀る。家光が植えたと伝わる大イチョウがある',
  '芝丸山古墳': '都内でも最大級の前方後円墳。実は公園の中の小山',
  'もみじ谷': '芝公園の中の小さな渓谷。滝と紅葉の隠れた名所',
  '愛宕山': '標高25.7m。23区で一番高い自然の山',
  '出世の石段': '86段の急な石段。曲垣平九郎が馬で駆け上がったという逸話が残る',
  '愛宕山 山頂 (愛宕神社)': '23区最高峰 (25.7m) の山頂。電動スクーターで来た人は…',
  '新橋 SL広場': '日本の鉄道発祥の地・新橋。展示されているのはC11形蒸気機関車',
  'ニュー新橋ビル': '白い格子の外壁が目印。中は飲み屋と金券ショップの迷宮',
  '新橋 烏森口 飲み屋街': '路地の奥に神社がある…かも',
  '烏森神社': '飲み屋街の路地裏にたたずむ神社。カラフルな御朱印で有名',
  '新橋 ガード下': '明治の赤レンガ高架の下に酒場が並ぶ',
  '旧新橋停車場 (0哩標識)': '1872年、日本初の鉄道はここから横浜へ。線路の起点「0哩標識」',
  '日テレ大時計': '宮崎駿デザインの巨大からくり時計。このゲームの中でも、12・15・18・20時 (週末は10時も) になると仕掛けが動き出す',
  '汐留 ペデストリアンデッキ': '超高層ビルを2階の高さで結ぶ空中回廊',
  '汐留イタリア街': '石畳とパステルカラーの街並み。東京の中のイタリア',
  '銀座 和光 (時計塔)': '1932年竣工の時計塔。針はゲーム内の時刻を指している',
  '銀座四丁目交差点': '日本一地価が高いことで知られる交差点',
  '歌舞伎座': '現在の建物は第五期 (2013年開場)。背後には歌舞伎座タワー',
  '銀座 中央通り': '週末の昼は歩行者天国になる (現実の曜日と連動)',
  '銀座 中央通り (歩行者天国)': '車道の真ん中を歩ける週末だけの特別な時間',
  '銀座八丁目': '銀座の街路樹は柳。「銀座の柳」は歌にもなった',
  '虎ノ門ヒルズ': '新虎通りの起点にそびえる超高層',
  '新虎通り': '通称「マッカーサー道路」。広い歩道の並木道',
  '竹芝桟橋': '伊豆諸島・小笠原諸島への船はここから出る',
  '築地本願寺': 'インド風の外観は伊東忠太の設計 (1934年)。寺なのにパイプオルガンがある',
  '築地場外市場': '朝が早い市場の街。ターレ (運搬車) が走り回るのは朝のうちだけ',
  '波除神社': '巨大な獅子頭が名物。白い歯の「天井大獅子」と、黒い歯の「お歯黒獅子」',
  '築地市場跡地': '2018年に市場は豊洲へ移転。広大な空き地が再開発を待っている',
  '勝どき橋': '1940年完成の跳開橋。真ん中が開いて船を通したが、1970年を最後に開いていない',
  '勝どき橋 (跳開部の真ん中)': '足元の継ぎ目から、昔はこの橋が「ハ」の字に開いた',
  '隅田川': '橋の数が多く「橋の博物館」とも呼ばれる川',
  '海岸一丁目 倉庫街': 'のこぎり屋根の倉庫とコンテナ。港の裏方の街',
  '築地七丁目': '市場の喧騒から一本入ると、静かな住宅街',
  '竹芝 伊豆諸島・小笠原 のりば': '大島・新島・神津島・三宅島・八丈島・父島…東京都の島々へ',
  '浜離宮恩賜庭園': '海水を引き込んだ「潮入の池」がある大名庭園。かつては将軍家の鷹狩場',
  '旧芝離宮恩賜庭園': '現存する最古の大名庭園のひとつ',
  '浜松町駅の小便小僧': `ホームの名物。毎月衣装が変わる (今月は「${['', '晴れ着', '鬼退治', 'ひな祭り', '桜', 'こいのぼり', 'あじさい', '七夕', '夏祭り', 'お月見', 'ハロウィン', '紅葉', 'サンタ'][MONTH]}」)`,
  '金杉橋': '屋形船の船宿が並ぶ橋。夜は提灯がともる',
  '古川の屋形船': '提灯をともした屋形船。夜の古川に浮かぶ',
  '首都高速 都心環状線': '古川の上を走る首都高。1964年の東京五輪に合わせて建設された',
  '東京プリンスホテル': '1964年、東京五輪に合わせて開業',
  '大門 商店街': '増上寺への参道でもある商店街',
  'ゆりかもめ 新橋駅': 'ゆりかもめの起点。ここから竹芝・お台場へ',
  'JR山手線・京浜東北線の線路の上': '…本当はダメです。ゲームなので',
  '新橋駅前交番': '迷ったら交番へ',
  '大門交番': '迷ったら交番へ',
};
// ---- 浜松町駅の小便小僧 (毎月衣装が変わる)
const MANNEKEN = [-450, 60];
{
  const [mx, mz] = MANNEKEN, sk = lam({ color: 0xe8c09a }), cos = lam({ color: [0, 0xc0302a, 0x3a6ab0, 0xe8a0b0, 0xf0b0c8, 0x2a7ad0, 0x6a6ab8, 0x2a8ad8, 0xe8d020, 0xd88a2a, 0xe07020, 0xb0602a, 0xd02020][MONTH] });
  const yb = 7.1 - 9; // ホーム (高さ7.1m) の上
  blk(mx - 0.6, 9 + yb, mz - 0.6, mx + 0.6, 9.6 + yb, mz + 0.6, lam({ color: 0x8a8a84 }));
  box(0.36, 0.5, 0.26, sk, mx, 9.85 + yb, mz); box(0.42, 0.4, 0.3, cos, mx, 10.25 + yb, mz); box(0.32, 0.32, 0.3, sk, mx, 10.62 + yb, mz);
  box(0.36, 0.14, 0.34, cos, mx, 10.84 + yb, mz);
  if (MONTH === 12) box(0.12, 0.12, 0.12, white, mx, 10.98 + yb, mz);  // サンタ帽のポンポン
}
// ---- 増上寺 千体子育地蔵 (赤い帽子と、回る風車)
const JIZO_LIST = [];
for (let r = 0; r < 4; r++) for (let x = JIZO[0] + 2; x < JIZO[2] - 1; x += 1.3) JIZO_LIST.push([x, JIZO[1] + 3 + r * 7.5]);
fr(...JIZO, '#b8ad92'); SPOT_AREAS.unshift(['増上寺 千体子育地蔵', ...JIZO]);
const jz = (() => {
  const d = new THREE.Object3D(), N = JIZO_LIST.length, mk = (g, m) => { const im = new THREE.InstancedMesh(g, m, N); scene.add(im); return im; };
  const body = mk(new THREE.CylinderGeometry(0.18, 0.24, 0.55, 6).translate(0, 0.28, 0), lam({ color: 0x9a968c }));
  const head = mk(new THREE.SphereGeometry(0.16, 6, 5).translate(0, 0.68, 0), lam({ color: 0x9a968c }));
  const cap = mk(new THREE.CylinderGeometry(0.1, 0.19, 0.16, 6).translate(0, 0.82, 0), lam({ color: 0xc8281e }));
  const bib = mk(new THREE.BoxGeometry(0.36, 0.22, 0.05).translate(0, 0.45, 0.2), lam({ color: 0xd8301e }));
  const stick = mk(new THREE.BoxGeometry(0.03, 0.8, 0.03).translate(0.3, 0.4, 0.15), lam({ color: 0x6a6a6a }));
  const wheel = mk(new THREE.BoxGeometry(0.34, 0.34, 0.02), lam({ color: 0xffffff }));
  JIZO_LIST.forEach(([x, z], i) => {
    d.position.set(x, 0, z); d.rotation.set(0, 0, 0); d.scale.set(1, 1, 1); d.updateMatrix();
    for (const m of [body, head, cap, bib, stick]) m.setMatrixAt(i, d.matrix);
    wheel.setColorAt(i, new THREE.Color().setHSL(rnd(), 0.8, 0.55));
    solid(x - 0.25, z - 0.25, x + 0.25, z + 0.25, 0, 0.9, true);
  });
  wheel.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  return { wheel, d };
})();
// ---- 古川の屋形船 (金杉橋のたもと)
const YAKATA = [];
{
  const shoji = tex(16, 8, x => { x.fillStyle = '#f0e8d0'; x.fillRect(0, 0, 16, 8); x.fillStyle = '#6a4a30'; for (let i = 0; i < 16; i += 4) x.fillRect(i, 0, 1, 8); x.fillRect(0, 0, 16, 1); x.fillRect(0, 7, 16, 1); });
  const shojiM = lam({ map: shoji, emissive: 0xffd890, emissiveMap: shoji, emissiveIntensity: 0 }); GLOW.push([shojiM, 1.2]);
  const hull = lam({ color: 0x5a3a28 }), roof = lam({ color: 0x3a3a40 }), lan = glow(lam({ color: 0xe04030 }), 0xff5030, 1.4);
  for (const x of [-760, -676, -638]) {
    const g = new THREE.Group(); g.position.set(x, -1.4, 300 + rr(-2, 2)); scene.add(g);
    box(16, 1.2, 3.8, hull, 0, 0.3, 0, g);
    const c = new THREE.Mesh(new THREE.BoxGeometry(12, 1.8, 3.2), [shojiM, shojiM, roof, roof, shojiM, shojiM]); c.position.set(-0.5, 1.8, 0); g.add(c);
    box(12.6, 0.25, 3.8, roof, -0.5, 2.85, 0, g);
    for (let k = -5; k <= 4; k += 1.5) for (const sd of [-1, 1]) box(0.3, 0.42, 0.3, lan, k, 2.55, sd * 1.95, g);
    YAKATA.push({ g, ph: rr(0, 6) });
  }
  SPOT_AREAS.unshift(['古川の屋形船', -780, 290, -620, 320]);
}
// ---- 竹芝: 伊豆諸島・小笠原 のりば の案内板
{
  const t = tex(256, 64, x => {
    x.fillStyle = '#1c3a6a'; x.fillRect(0, 0, 256, 64); x.fillStyle = '#ffffff'; x.font = 'bold 20px "DotGothic16", sans-serif'; x.textAlign = 'center';
    x.fillText('伊豆諸島・小笠原 のりば', 128, 24); x.font = '14px "DotGothic16", sans-serif'; x.fillStyle = '#ffd84a';
    x.fillText('大島 利島 新島 式根島 神津島 三宅島 御蔵島 八丈島 父島', 128, 50);
  });
  const bm = glow(lam({ map: t }), 0xffffff, 0.8);
  const b = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 0.2), [lam({ color: 0x1c3a6a }), lam({ color: 0x1c3a6a }), lam({ color: 0x1c3a6a }), lam({ color: 0x1c3a6a }), bm, bm]);
  b.position.set(88, 3.6, -7.6); scene.add(b);
  for (const x of [84.5, 91.5]) blk(x - 0.1, 0, -7.7, x + 0.1, 2.6, -7.5, dark, false);
  SPOT_AREAS.unshift(['竹芝 伊豆諸島・小笠原 のりば', 78, -16, 98, -2]);
}
koban(KOBAN1, 's', '大門交番');
// ---- 歩行者天国のパラソル
const PARASOLS = new THREE.Group(); scene.add(PARASOLS);
{
  const cols = [0xf4f0e8, 0x2a6ab0, 0xc0392b, 0x2f8a4a];
  for (let z = -1280; z < -520; z += 34) {
    const g = new THREE.Group(); g.position.set(-128 + rr(-4, 4), 0, z); PARASOLS.add(g);
    box(0.08, 2.4, 0.08, dark, 0, 1.2, 0, g);
    const c = new THREE.Mesh(new THREE.ConeGeometry(1.8, 0.7, 8), lam({ color: pick(cols) })); c.position.y = 2.5; g.add(c);
    box(1, 0.06, 1, white, 0, 0.75, 0, g); for (const dx of [-0.9, 0.9]) box(0.45, 0.45, 0.45, white, dx, 0.22, 0, g);
  }
}
Object.assign(NOTES, LM_NOTES);
// ---- 役立ち情報 (実際に行くときに役立つこと) と 豆知識帳 (K)
const TIPS = Object.assign({
  '東京タワー': 'メインデッキ (150m) までは、外の階段 (約600段) を歩いても上れる。足元のガラス床からは真下の地面が見える',
  '東京タワー 大展望台': 'ガラスの床「スカイウォークウィンドウ」から、真下の街をのぞける',
  '築地場外市場': '約460のお店が並ぶ食の町。朝がいちばんにぎやかで、卵焼きや海鮮の食べ歩きが楽しい',
}, LM_TIPS);
const HEE_KEY = 'tokyoWalker_hee', NOTE_LAST = {};
const HEE = new Set((() => { try { return JSON.parse(localStorage.getItem(HEE_KEY) || '[]'); } catch (e) { return []; } })());
const SHOW_TIPS = false;   // 🧭 役立ち情報 (LM_TIPS) は表示しない (データは残してある)
const NOTE_NAMES = [...new Set([...Object.keys(NOTES), ...(SHOW_TIPS ? Object.keys(TIPS) : [])])];
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
function noteFor(name) {   // エリアに入ったときの豆知識。同じ場所は90秒のあいだ出さない (行ったり来たりで邪魔にならないように)
  const hee = NOTES[name], tip = SHOW_TIPS ? TIPS[name] : null, now = performance.now() / 1000;
  if (!hee && !tip) return null;
  if (NOTE_LAST[name] && now - NOTE_LAST[name] < 90) return null;
  NOTE_LAST[name] = now;
  if (!HEE.has(name)) { HEE.add(name); try { localStorage.setItem(HEE_KEY, JSON.stringify([...HEE])); } catch (e) {} if (noteOpen) renderNotebook(); }
  const len = (hee || '').length + (tip || '').length;
  return { html: (hee ? `<div class="hee">💡 ${esc(hee)}</div>` : '') + (tip ? `<div class="tip">🧭 ${esc(tip)}</div>` : ''), sec: Math.min(9, Math.max(2.5, len / 9)) };
}
let noteOpen = false;
const notebookEl = document.getElementById('notebook');
function renderNotebook() {
  const got = [...HEE].filter(n => NOTE_NAMES.includes(n)).reverse();
  notebookEl.querySelector('.list').innerHTML = got.length ? got.map(n => `<div class="ent"><b>📍 ${esc(n)}</b>${NOTES[n] ? `<div>💡 ${esc(NOTES[n])}</div>` : ''}${SHOW_TIPS && TIPS[n] ? `<div class="tip">🧭 ${esc(TIPS[n])}</div>` : ''}</div>`).join('')
    : '<div class="ent">まだ何もない。名所を歩くと、ここに豆知識がたまっていく</div>';
  notebookEl.querySelector('.cnt').textContent = `${got.length} / ${NOTE_NAMES.length}`;
}
function toggleNotebook() {
  if (!started || albumOpen) return;
  noteOpen = !noteOpen; for (const k in keys) keys[k] = false;
  if (noteOpen) { renderNotebook(); try { document.exitPointerLock(); } catch (e) {} } else lockPointer();
  notebookEl.style.display = noteOpen ? 'flex' : 'none';
}
notebookEl.querySelector('.close').onclick = () => toggleNotebook();
notebookEl.addEventListener('click', e => { if (e.target === notebookEl && noteOpen) toggleNotebook(); });   // 外側をクリックすると閉じる
LM_ACH.push(['hee', '💡 へぇの達人', '豆知識を30個集める (K で豆知識帳)', () => [...HEE].filter(n => NOTE_NAMES.includes(n)).length >= 30]);
// 後から追加した名所も地名リスト・発見リストに反映
for (const a of SPOT_AREAS) if (!AREAS.includes(a)) { AREAS.unshift(a); ALL_NAMES.add(a[0]); }
function hokoActive() { return WEEKEND && gameH >= 12 && gameH < (MONTH >= 4 && MONTH <= 9 ? 18 : 17); }
// ---- ねこ (街のどこかに12匹)
const CAT_DEF = [[-450, -760, 0], [-575, -951, 0], [-1380, 70, 0], [-1278, -628, 26], [-246, -321, 0], [-300, 200, 0], [232, 40, 0],
  [-14, -640, 0], [-819, 204, 0], [-1566, 183, 0], [-294, -700, 7], [-1270, -285, 7.5], [196, -905, 0], [-141, 200, 5.2], [155, -1243, 26]];
CAT_DEF.push(...LM_CATS);
const CAT_KEY = 'tokyoWalker_cats';
const GOURMET_KEY = 'tokyoWalker_gourmet';
const WILD_KEY = 'tokyoWalker_wild';
const WILD_FOUND = new Set((() => { try { return JSON.parse(localStorage.getItem(WILD_KEY) || '[]'); } catch (e) { return []; } })());
const GOURMET_FOUND = new Set((() => { try { return JSON.parse(localStorage.getItem(GOURMET_KEY) || '[]'); } catch (e) { return []; } })());
const CAT_FOUND = new Set((() => { try { return JSON.parse(localStorage.getItem(CAT_KEY) || '[]'); } catch (e) { return []; } })());
const CATS = CAT_DEF.map(([x, z, y], i) => {
  const col = [0x2a2a2e, 0xe0a050, 0xf2f0ea, 0x8a8a90, 0xc87a3a, 0x3a3a3e][i % 6], m = lam({ color: col });
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rr(0, 6); scene.add(g);
  box(0.26, 0.24, 0.55, m, 0, 0.24, 0, g); box(0.24, 0.22, 0.22, m, 0, 0.46, 0.3, g);
  for (const sd of [-0.07, 0.07]) box(0.06, 0.08, 0.04, m, sd, 0.6, 0.32, g);
  for (const [lx, lz] of [[-0.09, 0.2], [0.09, 0.2], [-0.09, -0.2], [0.09, -0.2]]) box(0.06, 0.14, 0.06, m, lx, 0.07, lz, g);
  const tail = new THREE.Group(); tail.position.set(0, 0.3, -0.27); g.add(tail); box(0.05, 0.05, 0.38, m, 0, 0.06, -0.17, tail); tail.rotation.x = -0.6;
  if (col === 0xc87a3a) box(0.27, 0.06, 0.2, lam({ color: 0x2a2a2e }), 0, 0.37, -0.05, g); // 三毛っぽい模様
  return { g, tail, i, ph: rr(0, 6) };
});
// ---- 実績
const ACH = [
  ['tower', '🗼 てっぺん', '東京タワーのアンテナ頂上 (333m) に立つ'],
  ['heikuro', '🐎 平九郎の再来', '電動スクーターで愛宕山の山頂へ'],
  ['glide', '🪂 空から浜離宮へ', 'ハンググライダーで浜離宮に着地する'],
  ['rail', '🛤 線路の上の散歩者', 'JRの高架の上に立つ'],
  ['shuto', '🛣 首都高ウォーカー', '首都高の上に立つ'],
  ['shrines', '⛩ 四社めぐり', '芝大神宮・芝東照宮・愛宕神社・烏森神社をすべて訪ねる'],
  ['zero', '🚂 鉄道0マイル', '旧新橋停車場の0哩標識を訪ねる'],
  ['ginzanight', '🌃 夜の銀座', '夜 (19〜4時) の銀座四丁目交差点に立つ'],
  ['hokoten', '🚶 ホコ天', '歩行者天国の中央通りを歩く (週末の昼)'],
  ['karakuri', '🕰 からくり見物', '日テレ大時計が動くところを見る'],
  ['cats', '🐈 ねこ全員集合', `街のねこを全員 (${CAT_DEF.length}匹) 見つける`],
  ['tsuu', '🗾 東京通', 'スポットを100か所発見する'],
  ['asaichi', '🐟 早起きは築地の得', '朝 (5〜9時) の築地場外市場を歩く'],
  ['kachidoki', '🌉 開かずの跳開橋', '勝どき橋の跳開部の真ん中に立つ'],
  ['manpo', '👣 一万歩', '歩いて (乗り物なしで) 10,000歩'],
  ['densha', '🚃 線路際の撮り鉄', '走る東海道新幹線のすぐそばに立つ'],
  ['photo', '📸 じいちゃんの東京', '写真をすべて撮って、帰りの船に乗る'],
];
ACH.push(...LM_ACH.map(a => a.slice(0, 3)));
const ACH_KEY = 'tokyoWalker_ach';
const ACH_GOT = new Set((() => { try { return JSON.parse(localStorage.getItem(ACH_KEY) || '[]'); } catch (e) { return []; } })());
const achPanel = document.getElementById('achPanel');
function renderAch() {
  const gotN = ACH.filter(a => ACH_GOT.has(a[0])).length;
  achPanel.innerHTML = `<div class="ttl">🏆 実績 ${gotN} / ${ACH.length}　🐈 ねこ ${CAT_FOUND.size} / ${CAT_DEF.length}${SHOW_GOURMET_INFO ? `　🍴 グルメ ${GOURMET_FOUND.size} / ${GOURMET.length}` : ''}${SHOW_WILD_INFO ? `　🐾 いきもの ${WILD_FOUND.size} / ${WILD_SP.length}` : ''}</div>` +
    (SHOW_WILD_INFO ? `<div class="wild">${WILD_SP.map(sp => WILD_FOUND.has(sp.id) ? `<span title="${sp.fact}">${sp.emoji} ${sp.name}</span>` : '<span class="off">？？？</span>').join('')}</div>` : '') +
    ACH.map(([id, n, d]) => `<span class="a ${ACH_GOT.has(id) ? '' : 'off'}">${ACH_GOT.has(id) ? n : '🔒 ？？？'}<br><small>${d}</small></span>`).join('');
}
function achieve(id) {
  if (ACH_GOT.has(id)) return; ACH_GOT.add(id);
  try { localStorage.setItem(ACH_KEY, JSON.stringify([...ACH_GOT])); } catch (e) {}
  const a = ACH.find(q => q[0] === id); toast(`🏆 実績解除: ${a[1]}`); toastTimer = 4; renderAch();
}
// ---- 築地のターレ (朝だけ走る運搬車)
const TARES = [];
for (let i = 0; i < 7; i++) {
  const p = TARE_PATHS[i % TARE_PATHS.length], g = new THREE.Group(); scene.add(g);
  box(1.1, 0.35, 2.2, lam({ color: pick([0x2a7a5a, 0x3a5ab0, 0x8a8a8a]) }), 0, 0.4, -0.2, g);
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.1, 10), lam({ color: 0xd8d4c8 })); cyl.position.set(0, 1.1, 0.75); g.add(cyl);
  box(0.4, 1.2, 0.3, lam({ color: 0x2a3a5a }), 0, 1.15, 0.2, g); box(0.28, 0.28, 0.28, lam({ color: 0xe0b896 }), 0, 1.9, 0.2, g);
  box(0.9, 0.5, 1.1, lam({ color: 0xf4f6f8 }), 0, 0.85, -0.7, g);
  TARES.push({ g, p, t: rnd(), d: 1, v: rr(4, 6) / Math.hypot(p[2] - p[0], p[3] - p[1]) });
}
// ---- 万歩計
const STEPS_KEY = 'tokyoWalker_steps', stepsEl = document.getElementById('steps');
const STEPS = { n: (() => { try { return +localStorage.getItem(STEPS_KEY) || 0; } catch (e) { return 0; } })(), px: null, pz: null, save: 0 };
function updateSteps(dt) {
  if (STEPS.px !== null && P.grounded && !P.scooter && !P.glider) { const d = Math.hypot(P.x - STEPS.px, P.z - STEPS.pz); if (d < 2) STEPS.n += d / 0.7; }
  STEPS.px = P.x; STEPS.pz = P.z;
  if ((STEPS.save -= dt) <= 0) { STEPS.save = 3; try { localStorage.setItem(STEPS_KEY, String(Math.floor(STEPS.n))); } catch (e) {} }
  stepsEl.textContent = `👣 ${Math.floor(STEPS.n).toLocaleString()}歩 (${(STEPS.n * 0.7 / 1000).toFixed(2)}km)`;
}
let funTick = 0, prevGameH = null;
function updateFun(dt, t) {
  for (const f of LM_UPDATERS) f(dt, t);
  // 時計の針 (ゲーム内時刻)
  for (const h of HANDS) { h.m.rotation.z = -(gameH % 1) * Math.PI * 2; h.h.rotation.z = -((gameH % 12) / 12) * Math.PI * 2; }
  // 日テレ大時計のからくり
  if (prevGameH !== null) for (const sh of WEEKEND ? [10, 12, 15, 18, 20] : [12, 15, 18, 20])
    if (prevGameH < sh && gameH >= sh) { KARA.t = 25; if (Math.hypot(P.x + 242, P.z + 600) < 260) { toast('🕰 日テレ大時計のからくりが動き出した！'); } }
  prevGameH = gameH;
  if (KARA.t > 0) {
    KARA.t -= dt;
    KARA.gears.forEach((g, i) => g.rotation.y += dt * (i % 2 ? -2 : 2));
    KARA.chim.forEach((c, i) => c.scale.y = 1 + Math.abs(Math.sin(t * 6 + i)) * 0.4);
    if (Math.hypot(P.x + 242, P.z + 600) < 60) achieve('karakuri');
  }
  // 地蔵の風車
  jz.wheel.count = JIZO_LIST.length;
  JIZO_LIST.forEach(([x, z], i) => { jz.d.position.set(x + 0.3, 0.85, z + 0.15); jz.d.rotation.set(0, 0, t * 4 + i); jz.d.updateMatrix(); jz.wheel.setMatrixAt(i, jz.d.matrix); });
  jz.wheel.instanceMatrix.needsUpdate = true;
  // 屋形船
  for (const y of YAKATA) { y.g.position.y = -1.4 + Math.sin(t * 0.8 + y.ph) * 0.12; y.g.rotation.z = Math.sin(t * 0.6 + y.ph) * 0.02; }
  PARASOLS.visible = hokoActive();
  const morning = gameH >= 5 && gameH < 11;
  for (const tr of TARES) {
    if (morning) { tr.t += tr.d * tr.v * dt; if (tr.t > 1) { tr.t = 1; tr.d = -1; } if (tr.t < 0) { tr.t = 0; tr.d = 1; } }
    const [x0, z0, x1, z1] = tr.p; tr.g.position.set(x0 + (x1 - x0) * tr.t, 0, z0 + (z1 - z0) * tr.t);
    tr.g.rotation.y = Math.atan2((x1 - x0) * tr.d, (z1 - z0) * tr.d);
  }
  updateSteps(dt);
  // ねこ
  for (const c of CATS) {
    c.tail.rotation.y = Math.sin(t * 2 + c.ph) * 0.5;
    if (!CAT_FOUND.has(c.i) && Math.hypot(P.x - c.g.position.x, P.z - c.g.position.z) < 4 && Math.abs(P.y - c.g.position.y) < 3) {
      CAT_FOUND.add(c.i); try { localStorage.setItem(CAT_KEY, JSON.stringify([...CAT_FOUND])); } catch (e) {}
      toast(`🐈 ねこを見つけた！ (${CAT_FOUND.size} / ${CAT_DEF.length})`); renderAch();
      if (CAT_FOUND.size >= CAT_DEF.length) achieve('cats');
    }
  }
  // 実績の判定 (0.5秒ごと)
  if ((funTick -= dt) > 0) return; funTick = 0.5;
  // 名物グルメ: お店の前を通ると図鑑に記録
  if (SHOW_GOURMET_INFO) for (const g of GOURMET) if (!GOURMET_FOUND.has(g.name) && P.y < 4 && Math.hypot(P.x - g.x, P.z - g.z) < 11) {
    GOURMET_FOUND.add(g.name); try { localStorage.setItem(GOURMET_KEY, JSON.stringify([...GOURMET_FOUND])); } catch (e) {}
    toast(`${g.emoji} ${g.area}の名物「${g.food}」のお店を見つけた！ (グルメ図鑑 ${GOURMET_FOUND.size} / ${GOURMET.length})`); renderAch();
  }
  // 野生の生きもの: 近くで見ると図鑑に記録して、豆知識を出す
  if (SHOW_WILD_INFO) for (const sp of WILD_SP) if (!WILD_FOUND.has(sp.id) && WILD_NEAR(sp) < sp.see) {
    WILD_FOUND.add(sp.id); try { localStorage.setItem(WILD_KEY, JSON.stringify([...WILD_FOUND])); } catch (e) {}
    const key = '🐾 ' + sp.name; if (!HEE.has(key)) { HEE.add(key); try { localStorage.setItem(HEE_KEY, JSON.stringify([...HEE])); } catch (e) {} }
    toast(`${sp.emoji} ${sp.name}を見つけた！ (いきもの図鑑 ${WILD_FOUND.size} / ${WILD_SP.length})`); toastTimer = 4;
    bannerText.textContent = `${sp.emoji} ${sp.name}`; bannerSmall.textContent = '★ いきもの発見 ★'; noteEl.innerHTML = `<div class="hee">💡 ${esc(sp.fact)}</div>`;
    banner.style.opacity = 1; bannerTimer = 3 + Math.min(7, sp.fact.length / 9); renderAch(); break;
  }
  if (P.y > 330 && Math.hypot(P.x - TOWER[0], P.z - TOWER[1]) < 5) achieve('tower');
  if (P.scooter && P.y > 25 && Math.hypot(P.x - ATAGO.x, P.z - ATAGO.z) < 40) achieve('heikuro');
  if (P.y > 5.5 && inR(JR, P.x, P.z)) achieve('rail');
  if (P.y > 9.5 && P.z > 291 && P.z < 313 && P.x < -476) achieve('shuto');
  if (['芝大神宮', '芝東照宮', '愛宕山 山頂 (愛宕神社)', '烏森神社'].every(n => DISC.has(n))) achieve('shrines');
  if (DISC.has('旧新橋停車場 (0哩標識)')) achieve('zero');
  if ((gameH >= 19 || gameH < 4) && inR([-150, -1212, -106, -1178], P.x, P.z)) achieve('ginzanight');
  if (hokoActive() && inR([-140, -1300, -116, -500], P.x, P.z)) achieve('hokoten');
  if (DISC.size >= 100) achieve('tsuu');
  if (gameH >= 5 && gameH < 9 && inR(TSUKIJI_MKT, P.x, P.z)) achieve('asaichi');
  if (inR([374, -1206, 386, -1182], P.x, P.z)) achieve('kachidoki');
  if (STEPS.n >= 10000) achieve('manpo');
  for (const a of LM_ACH) if (a[3]()) achieve(a[0]);
  const sk = JR_TRAINS.find(tr => tr.name === '東海道新幹線');
  if (sk && Math.hypot(P.x - sk.head[0], P.z - sk.head[1]) < 30 && inRange(sk.u, sk.R)) achieve('densha');
}
function toggleScooter() {
  if (!started || P.glider || P.climbing || P.ride || P.boat) return;
  P.scooter = !P.scooter; P.svx = P.svz = 0;
  toast(P.scooter ? '🛴 電動スクーターに乗りました (R で降りる)' : '電動スクーターを降りました');
}
const GLIDER_MIN = 2;   // ハンググライダー (パラシュート) を開ける高さ (足もとの地面・屋上からの高さ)。ふつうのジャンプは約1.1m なので平地では開けない
function toggleGlider() {
  if (!started || P.grounded || P.climbing || P.ride || P.boat) return;   // 空中でのみ開閉できる
  if (!P.glider && P.y - floorAt(P.x, P.z, P.y) < GLIDER_MIN) { toast(`🪂 ここでは低すぎて開けない (足もとから${GLIDER_MIN}m以上の高さが必要)`); toastTimer = 2; return; }   // 平らな地面でジャンプしただけでは開かない
  P.glider = !P.glider;
  if (P.glider) {
    P.gOpen = 0;
    if (P.scooter) { P.gvx = P.svx; P.gvz = P.svz; } else { P.gvx = Math.sin(P.heading) * 5; P.gvz = Math.cos(P.heading) * 5; }
  } else { P.svx = P.gvx; P.svz = P.gvz; }
  toast(P.glider ? '🪂 ハンググライダー ON' : 'ハンググライダー OFF');
}
function rayHit(o, d, maxD) {
  let best = maxD;
  const ex = o.x + d.x * maxD, ez = o.z + d.z * maxD;
  for (const s of query(Math.min(o.x, ex), Math.min(o.z, ez), Math.max(o.x, ex), Math.max(o.z, ez))) {
    if (s[6]) continue;
    let t0 = 0, t1 = best, ok = true;
    for (const [oa, da, lo, hi] of [[o.x, d.x, s[0], s[2]], [o.y, d.y, s[4], s[5]], [o.z, d.z, s[1], s[3]]]) {
      if (Math.abs(da) < 1e-8) { if (oa < lo || oa > hi) { ok = false; break; } continue; }
      let a = (lo - oa) / da, b = (hi - oa) / da; if (a > b) [a, b] = [b, a];
      t0 = Math.max(t0, a); t1 = Math.min(t1, b); if (t0 > t1) { ok = false; break; }
    }
    if (ok && t0 > 0 && t0 < best) best = t0;
  }
  return best;
}
let camDist = 0;
const camTarget = new THREE.Vector3(), camDir = new THREE.Vector3(), camBack = new THREE.Vector3();
function updateCamera(dt, fl) {
  const tp = SET.view > 0, want = VIEWS[SET.view].dist + (P.glider ? 4 : 0) + (P.scooter ? 1.5 : 0);
  avatar.visible = blob.visible = tp;
  if (!tp) {
    camDist = 0;
    camera.position.set(P.x, P.y + 1.6 + (P.scooter && !P.glider ? 0.24 : 0) + (P.grounded && !P.scooter ? Math.sin(P.bob) * 0.06 : 0), P.z);
    camera.rotation.set(P.pitch, P.yaw, 0);
    return;
  }
  const pitch = Math.max(-1.35, Math.min(1.2, P.pitch - 0.22));
  camDir.set(-Math.sin(P.yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(P.yaw) * Math.cos(pitch));
  camTarget.set(P.x, P.y + 1.5, P.z);
  const lim = Math.max(0.6, rayHit(camTarget, camBack.copy(camDir).negate(), want) - 0.3);
  const goal = Math.min(want, lim);
  camDist = goal < camDist ? goal : camDist + (goal - camDist) * Math.min(1, dt * 3);
  camera.position.copy(camTarget).addScaledVector(camDir, -camDist);
  if (camera.position.y < 0.3) camera.position.y = 0.3;
  camera.rotation.set(pitch, P.yaw, 0);
  blob.position.set(P.x, fl + 0.04, P.z);
  blob.material.opacity = 0.35 * Math.max(0.15, 1 - (P.y - fl) / 15);
}
function animateAvatar(dt, moving) {
  const riding = P.scooter && !P.glider;
  avatar.position.set(P.x, P.y + (riding ? 0.24 : P.glider ? 0.5 : 0), P.z);
  if (moving || P.glider) { let d = P.heading - avatar.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); avatar.rotation.y += d * Math.min(1, dt * (riding ? 5 : 12)); }
  avatar.rotation.x += ((P.glider ? 0.9 : riding ? 0.06 : 0) - avatar.rotation.x) * Math.min(1, dt * 6);
  // スクーター
  scooter.visible = riding;
  if (riding) {
    scooter.position.set(P.x, P.y, P.z); scooter.rotation.y = avatar.rotation.y;
    SC.wf.rotation.x = SC.wr.rotation.x = P.wheel;
  }
  // グライダー (開く時にふわっと広がる)
  glider.visible = P.glider;
  if (P.glider) {
    P.gOpen = Math.min(1, P.gOpen + dt * 4);
    glider.position.set(P.x, P.y, P.z); glider.rotation.set(0, avatar.rotation.y, Math.sin(P.anim * 0.4) * 0.04);
    glider.scale.set(0.15 + 0.85 * P.gOpen, 0.6 + 0.4 * P.gOpen, 0.6 + 0.4 * P.gOpen);
  }
  const ph = P.anim;
  if (P.glider) {            // バーにぶら下がる
    AV.armL.rotation.x = AV.armR.rotation.x = 2.24; AV.legL.rotation.x = Math.sin(ph) * 0.15; AV.legR.rotation.x = -Math.sin(ph) * 0.15;
  } else if (riding) {       // ハンドルを握って立つ
    AV.armL.rotation.x = AV.armR.rotation.x = -0.8; AV.legL.rotation.x = -0.12; AV.legR.rotation.x = 0.12;
  } else if (P.climbing) {
    AV.armL.rotation.x = Math.PI - 0.3 + Math.sin(ph) * 0.5; AV.armR.rotation.x = Math.PI - 0.3 - Math.sin(ph) * 0.5;
    AV.legL.rotation.x = -0.4 - Math.sin(ph) * 0.4; AV.legR.rotation.x = -0.4 + Math.sin(ph) * 0.4;
  } else if (!P.grounded) {
    AV.armL.rotation.x = AV.armR.rotation.x = Math.PI * 0.8; AV.legL.rotation.x = 0.3; AV.legR.rotation.x = -0.3;
  } else {
    const sw = moving ? Math.sin(ph) * 0.7 : 0;
    AV.legL.rotation.x = sw; AV.legR.rotation.x = -sw; AV.armL.rotation.x = -sw * 0.8; AV.armR.rotation.x = sw * 0.8;
  }
}

