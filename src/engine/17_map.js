/* ============================================================
   全体図 (1px = 1m) → ミニマップ / 全体マップ
   ============================================================ */
const OVS = 0.25; // 全体図は 1px = 4m
const OV = document.createElement('canvas'); OV.width = Math.ceil(WW * OVS); OV.height = Math.ceil(WH * OVS);
{
  const g = OV.getContext('2d');
  g.setTransform(OVS, 0, 0, OVS, -MINX * OVS, -MINZ * OVS);
  g.fillStyle = '#2b5b78'; g.fillRect(MINX, MINZ, WW, WH);
  paintWorld(g, [MINX, MINZ, MAXX, MAXZ], true);
}
const mini = document.getElementById('mini'), mctx = mini.getContext('2d');
mctx.imageSmoothingEnabled = false;
let showMap = true;
// ミニマップ: 周囲 280m をベクター地図から描き直す (自動生成の街も含めて細かく描ける)
const miniBg = document.createElement('canvas'); miniBg.width = miniBg.height = 170;
let miniAt = [1e9, 1e9], miniTick = 0;
function drawMini(px, pz, yaw, dt) {
  const VIEW = 280, sc = 170 / VIEW;
  if ((miniTick -= dt || 0) <= 0 || Math.hypot(px - miniAt[0], pz - miniAt[1]) > 25) {
    miniTick = 0.4; miniAt = [px, pz];
    const g = miniBg.getContext('2d'), ox = px - VIEW / 2, oz = pz - VIEW / 2, W = [ox, oz, ox + VIEW, oz + VIEW];
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#2b5b78'; g.fillRect(0, 0, 170, 170);
    g.setTransform(sc, 0, 0, sc, -ox * sc, -oz * sc);
    paintWorld(g, W);
    g.strokeStyle = '#80c241'; g.lineWidth = 3 / sc; g.beginPath(); let on = false;   // 山手線
    for (let i = 0; i <= RP.length; i++) { const q = RP[i % RP.length]; if (Math.abs(q[0] - px) < 200 && Math.abs(q[1] - pz) < 200) { if (on) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); on = true; } else on = false; }
    g.stroke();
  }
  mctx.drawImage(miniBg, (miniAt[0] - px) * sc, (miniAt[1] - pz) * sc);
  mctx.save(); mctx.translate(85, 85); mctx.rotate(Math.atan2(-Math.cos(yaw), -Math.sin(yaw)));
  mctx.fillStyle = '#ffd84a'; mctx.strokeStyle = '#000'; mctx.lineWidth = 2;
  mctx.beginPath(); mctx.moveTo(8, 0); mctx.lineTo(-5, -5); mctx.lineTo(-5, 5); mctx.closePath(); mctx.stroke(); mctx.fill();
  mctx.restore();
  mctx.fillStyle = '#fff'; mctx.font = '12px DotGothic16, monospace'; mctx.fillText('N', 80, 13);
}
const bigWrap = document.getElementById('bigmap'), big = document.getElementById('big'), bctx = big.getContext('2d');
// [表示名, x, z, アイコン, 発見判定に使う地名(省略時は表示名)]
const MAP_LABELS = [
  ['竹芝桟橋', 190, 75, '⛴'], ['浜離宮恩賜庭園', -30, -440, '🌳'], ['旧芝離宮恩賜庭園', -333, 300, '🌳'], ['ポートシティ竹芝', -95, 100, '🏢', '東京ポートシティ竹芝'],
  ['竹芝駅', 15, -42, '🚉', 'ゆりかもめ 竹芝駅'], ['WATERS takeshiba', 75, -98, '🎭'], ['インターコンチ', 82, 92, '🏨', 'インターコンチネンタル東京ベイ'], ['ニューピア竹芝', 79, 226, '🏢'],
  ['浜松町駅', -450, 160, '🚉'], ['汐留', -390, -200, '🏙'], ['竹芝ふ頭公園', 60, 40, '⚓'],
  ['東京タワー', TOWER[0], TOWER[1] - 66, '🗼'], ['増上寺', -1300, -112, '🏯'], ['三解脱門', -1149, -20, '⛩', '増上寺 三解脱門'], ['芝公園', -1290, -360, '🌳'], ['大門', -860, -100, '⛩', '芝大門 (大門)'],
  ['東京プリンスホテル', -1255, 240, '🏨'], ['パークタワー', -1610, 125, '🏨', 'ザ・プリンス パークタワー東京'],
  ['芝大神宮', -799, -125, '⛩'], ['芝東照宮', -1406, -250, '⛩'], ['芝丸山古墳', -1270, -322, '⛰'], ['もみじ谷', -1566, -135, '🍁'],
  ['大門 商店街', -819, 26, '🛍'], ['港区役所', -1052, -270, '🏛'], ['バスターミナル', -556, -58, '🚌', '浜松町駅 西口バスターミナル'], ['モノレール', -470, 230, '🚝', '東京モノレール 浜松町駅'],
  ['首都高速', -1080, 302, '🛣', '首都高速 都心環状線'], ['古川', -1500, 302, '🌊', '古川 河畔'], ['大門駅', -706, -88, 'Ⓜ'], ['芝公園駅', -1080, -100, 'Ⓜ'], ['御成門駅', -1080, -200, 'Ⓜ'],
  ['新橋駅', -450, -920, '🚉'], ['SL広場', -560, -955, '🚂', '新橋 SL広場'], ['烏森口 飲み屋街', -583, -755, '🏮', '新橋 烏森口 飲み屋街'], ['ガード下', -450, -785, '🏮', '新橋 ガード下'],
  ['ニュー新橋ビル裏', -819, -950, '🏮', '新橋 ニュー新橋ビル裏'], ['汐留シオサイト', -330, -620, '🏙', 'ゆりかもめ 汐留駅'], ['日テレ大時計', -242, -585, '🕰'],
  ['イタリア街', -28, -720, '⛲', '汐留イタリア街'], ['銀座 和光', -160, -1250, '🕰', '銀座 和光 (時計塔)'], ['銀座三越', -86, -1266, '🛍'], ['歌舞伎座', -15, -1165, '🎭'],
  ['銀座四丁目交差点', -128, -1200, '✦'], ['虎ノ門ヒルズ', -1560, -970, '🏙'], ['オーバル広場', -1566, -835, '🌳', '虎ノ門ヒルズ オーバル広場'],
  ['愛宕山', ATAGO.x, ATAGO.z - 72, '⛰'], ['愛宕神社', ATAGO.x - 3, ATAGO.z - 26, '⛩', '愛宕山 山頂 (愛宕神社)'], ['出世の石段', ATAGO.x + 52, ATAGO.z + 14, '🪜'],
  ['新虎通り', -1120, -904, '🌳'], ['汐留デッキ', -294, -540, '🚶', '汐留 ペデストリアンデッキ'], ['築地川', 50, -1100, '🌊', '築地川 河岸'],
  ['東京湾', 250, 200, '🌊'],
  ['烏森神社', -598, -800, '⛩'], ['旧新橋停車場', -405, -560, '🚂', '旧新橋停車場 (0哩標識)'], ['ニュー新橋ビル', -666, -995, '🏢'],
  ['千体子育地蔵', -1380, 66, '🎐', '増上寺 千体子育地蔵'], ['小便小僧', -450, 40, '🧒', '浜松町駅の小便小僧'], ['屋形船', -700, 312, '🏮', '古川の屋形船'],
  ['竹芝 のりば', 88, -20, '🛳', '竹芝 伊豆諸島・小笠原 のりば'],
  ['築地本願寺', 155, -1260, '🛕'], ['場外市場', 195, -900, '🐟', '築地場外市場'], ['波除神社', 308, -870, '🦁'], ['市場跡地', 216, -650, '🚧', '築地市場跡地'],
  ['勝どき橋', 380, -1220, '🌉'], ['倉庫街', -141, 240, '📦', '海岸一丁目 倉庫街'],
];
MAP_LABELS.push(...LM_LABELS);
for (const st of STN) if (!st.straight) MAP_LABELS.unshift([st.name, st.x, st.z - 12, '🚉', st.name + '駅']);
// 地区の大きな名前 (地図の背景に薄く表示)
const MAP_DISTRICTS = [['築地', 210, -880], ['隅田川', 380, -700], ['竹芝', 40, -60], ['浜松町', -560, 60], ['芝大門', -830, -160], ['芝公園', -1290, -20], ['芝', -960, 200], ['新橋', -600, -700],
  ['汐留', -250, -700], ['銀座', -150, -1100], ['虎ノ門', -1500, -700], ['西新橋', -1020, -840], ['東京湾', 300, -250]];
for (const st of STN) if (!['浜松町', '新橋'].includes(st.name)) { const q = ringAt(st.s); MAP_DISTRICTS.push([st.town, st.x - q.nx * 260, st.z - q.nz * 260]); }
let showBig = false, bigBase = null, BK = 1, BW = 0, BH = 0;
function layoutBig() {
  BK = Math.min((innerWidth - 40) / WW, (innerHeight - 70) / WH);
  BW = Math.floor(WW * BK); BH = Math.floor(WH * BK);
  big.width = BW; big.height = BH; big.style.width = BW + 'px'; big.style.height = BH + 'px';
  bigBase = document.createElement('canvas'); bigBase.width = BW; bigBase.height = BH;
  const b = bigBase.getContext('2d'), mx = x => (x - MINX) * BK, mz = z => (z - MINZ) * BK;
  b.imageSmoothingEnabled = true; b.drawImage(OV, 0, 0, BW, BH);
  b.strokeStyle = '#000'; b.lineWidth = 4; b.beginPath(); YP.forEach(([x, z], i) => i ? b.lineTo(mx(x), mz(z)) : b.moveTo(mx(x), mz(z))); b.stroke();
  b.strokeStyle = '#7fd0ff'; b.lineWidth = 2; b.stroke();
  // 山手線の環と駅
  b.beginPath(); RP.forEach(([x, z], i) => i ? b.lineTo(mx(x), mz(z)) : b.moveTo(mx(x), mz(z))); b.closePath();
  b.strokeStyle = '#1a3a1a'; b.lineWidth = 6; b.stroke(); b.strokeStyle = '#80c241'; b.lineWidth = 3.5; b.stroke();
  for (const st of STN) { b.fillStyle = '#fff'; b.strokeStyle = '#2a5a2a'; b.lineWidth = 2; b.beginPath(); b.arc(mx(st.x), mz(st.z), 4, 0, 7); b.fill(); b.stroke(); }
  const fs = Math.max(10, Math.round(BH / 62));
  b.font = `${fs}px DotGothic16, monospace`; b.textAlign = 'center'; b.textBaseline = 'middle'; b.lineJoin = 'round';
  // 地区名 (大きく薄く)
  b.save(); b.font = `bold ${Math.round(fs * 1.7)}px DotGothic16, monospace`; b.fillStyle = 'rgba(255,255,255,.2)';
  for (const [t, x, z] of MAP_DISTRICTS) b.fillText(t, mx(x), mz(z)); b.restore();
  b.font = `${fs}px DotGothic16, monospace`;
  // ラベル同士が重ならないよう、上下にずらして配置 (置けなければアイコンだけ)
  const placed = [], fits = r => !placed.some(q => r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1]);
  // 見つけたねこ
  b.font = `${fs}px DotGothic16, monospace`;
  for (const c of (typeof CATS !== 'undefined' ? CATS : [])) if (CAT_FOUND.has(c.i)) b.fillText('🐈', mx(c.g.position.x), mz(c.g.position.z));
  for (const [t, x, z, icon, key] of MAP_LABELS) {
    const k = key || t, tracked = ALL_NAMES.has(k), found = !tracked || DISC.has(k);
    const label = (icon ? icon + ' ' : '') + t + (tracked && found ? ' ★' : '');
    const X = mx(x), Y = mz(z), w = b.measureText(label).width;
    b.lineWidth = 4; b.strokeStyle = '#000'; b.fillStyle = !tracked ? '#cfe8ff' : found ? '#ffe68a' : '#d8d8dc';
    let done = false;
    for (const dy of [0, -fs * 1.15, fs * 1.15, -fs * 2.3, fs * 2.3]) {
      const r = [X - w / 2 - 2, Y + dy - fs / 2 - 1, X + w / 2 + 2, Y + dy + fs / 2 + 1];
      if (fits(r)) { placed.push(r); b.strokeText(label, X, Y + dy); b.fillText(label, X, Y + dy); done = true; break; }
    }
    if (!done && icon) { b.strokeText(icon, X, Y); b.fillText(icon, X, Y); }
  }
  // タイトル
  b.textAlign = 'left'; b.font = `${fs + 2}px DotGothic16, monospace`; b.fillStyle = '#ffd84a'; b.strokeText('TOKYO WALKER MAP', 60, 22); b.fillText('TOKYO WALKER MAP', 60, 22); b.textAlign = 'center';
  b.fillStyle = '#ffd84a'; b.font = `${fs + 4}px DotGothic16, monospace`; b.lineWidth = 4; b.strokeText('▲N', 28, 22); b.fillText('▲N', 28, 22);
  const bar = 200 * BK; b.fillStyle = '#fff'; b.fillRect(BW - 14 - bar, BH - 18, bar, 4);
  b.font = `${fs}px DotGothic16, monospace`; b.textAlign = 'right'; b.strokeText('200m', BW - 14, BH - 30); b.fillText('200m', BW - 14, BH - 30);
}
function toggleBig() { showBig = !showBig; if (showBig) layoutBig(); bigWrap.style.display = showBig ? 'flex' : 'none'; }
addEventListener('resize', () => { if (showBig) layoutBig(); });
function drawBig(px, pz, yaw, t) {
  bctx.drawImage(bigBase, 0, 0);
  const x = (px - MINX) * BK, y = (pz - MINZ) * BK, s = Math.max(9, BH / 40);
  bctx.save(); bctx.translate(x, y);
  bctx.strokeStyle = `rgba(255,216,74,${0.35 + 0.35 * Math.sin(t * 5)})`; bctx.lineWidth = 2;
  bctx.beginPath(); bctx.arc(0, 0, s * 1.6, 0, 7); bctx.stroke();
  bctx.rotate(Math.atan2(-Math.cos(yaw), -Math.sin(yaw)));
  bctx.fillStyle = '#ffd84a'; bctx.strokeStyle = '#000'; bctx.lineWidth = 3; bctx.lineJoin = 'round';
  bctx.beginPath(); bctx.moveTo(s, 0); bctx.lineTo(-s * 0.7, -s * 0.7); bctx.lineTo(-s * 0.7, s * 0.7); bctx.closePath(); bctx.stroke(); bctx.fill();
  bctx.restore();
  // 走っている列車
  for (const tr of YAMA) { const q = ringAt(tr.s); bctx.fillStyle = tr.dwell > 0 ? '#ffffff' : '#c8f080'; bctx.fillRect((q.x - MINX) * BK - 2.5, (q.z - MINZ) * BK - 2.5, 5, 5); }
  for (const tr of JR_TRAINS) { bctx.fillStyle = tr.name === '京浜東北線' ? '#00b2e5' : '#ffffff'; bctx.fillRect((tr.head[0] - MINX) * BK - 2, (tr.head[1] - MINZ) * BK - 2, 4, 4); }
}

