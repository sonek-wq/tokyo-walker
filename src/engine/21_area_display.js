/* ============================================================
   エリア表示
   ============================================================ */
const areaEl = document.getElementById('area'), banner = document.getElementById('banner'), bannerText = document.getElementById('bannerText'), bannerSmall = banner.querySelector('small');
let curArea = '', bannerTimer = 0;
const altEl = document.getElementById('alt'), modeEl = document.getElementById('mode'), noteEl = document.getElementById('note');
AREAS.push(...SPOT_AREAS,
  ['増上寺 三解脱門', -1168, -85, -1132, -35], ['増上寺 大殿', -1340, -100, -1258, -20], ['増上寺', -1436, -148, -1134, 128],
  ['東京タワー フットタウン', TOWER[0] - 45, TOWER[1] - 45, TOWER[0] + 45, TOWER[1] + 45], ['東京タワー', -1676, -404, -1456, -180],
  ['ザ・プリンス パークタワー東京', -1676, 0, -1456, 110], ['東京プリンスホテル', -1436, 148, -1134, 260], ['芝大門 (大門)', -880, -92, -840, -28],
  ['御成門 交差点', -1140, -180, -1096, -140], ['大門 交差点', -730, -78, -682, -42],
  ...DIST_AREAS,
  ['第一京浜', -724, -480, -688, 320], ['日比谷通り', -1134, -480, -1102, 320], ['東京タワー通り', -1456, -480, -1436, 290],
  ['大門通り', -1106, -72, -476, -48], ['御成門通り', -1440, -172, -476, -148], ['古川沿いの道', -1680, 256, -476, 276],
  ['新虎通り', -1500, -920, -720, -888], ['晴海通り', -300, -1204, 330, -1184], ['みゆき通り', -300, -1004, 330, -984], ['烏森通り', -1680, -1004, -476, -984], ['銀座 中央通り', -144, -1300, -112, -500],
  ['浜松町駅 西口', -510, -172, -476, 290], ['浜松町', -688, -480, -476, 290],
  ['隅田川', 330, -1300, 430, -500], ['新大橋通り', 84, -1300, 100, -500], ['築地', 80, -1300, 330, -500],
  ['新橋', -720, -1080, -428, -480], ['汐留', -428, -820, 60, -480], ['銀座', -300, -1300, 60, -820], ['虎ノ門', -1680, -1080, -1134, -480], ['西新橋', -1134, -1080, -720, -480], ['芝公園４号地', -1676, -180, -1456, 0], ['芝公園', -1680, -480, -1134, 128], ['芝', -1680, 128, -1102, 320]);
// 発見したスポット (ブラウザに保存)
const DISC_KEY = 'tokyoWalker_disc';
const DISC = new Set((() => { try { return JSON.parse(localStorage.getItem(DISC_KEY) || '[]'); } catch (e) { return []; } })());
const SPECIAL_NAMES = ['浜松町駅の小便小僧', '銀座 中央通り (歩行者天国)', '首都高速 都心環状線', '東京タワー 鉄塔', '東京タワー 大展望台', '東京タワー トップデッキ', '東京タワー アンテナ頂上', 'JR山手線・京浜東北線の線路の上',
  '東京モノレール 浜松町駅の屋根', '東京モノレールの軌道', '歩道橋 (第一京浜)', '歩道橋 (日比谷通り)', '汐留 ペデストリアンデッキ', '愛宕山 山頂 (愛宕神社)', '新橋 ガード下 (屋台の屋根)'];
const ALL_NAMES = new Set([...AREAS.map(a => a[0]), ...SPECIAL_NAMES, ...STN.map(st => st.town)]);
const discEl = document.getElementById('disc'), discCap = document.getElementById('discCap');
function updateDiscUI() {
  const n = [...DISC].filter(k => ALL_NAMES.has(k)).length;
  discEl.textContent = `★ 発見したスポット ${n} / ${ALL_NAMES.size}`;
  discCap.textContent = `全体マップ ― ★ 発見 ${n} / ${ALL_NAMES.size}`;
}
function discover(name) {
  const base = name.replace('（屋上）', '');
  if (!ALL_NAMES.has(base) || DISC.has(base)) return false;
  DISC.add(base); try { localStorage.setItem(DISC_KEY, JSON.stringify([...DISC])); } catch (e) {}
  updateDiscUI(); if (showBig) layoutBig(); return true;
}
function areaAt(x, z, y) {
  if (y > 9.5 && z > 291 && z < 313 && x < -476) return '首都高速 都心環状線';
  if (Math.abs(x - TOWER[0]) < 42 && Math.abs(z - TOWER[1]) < 42 && y > 19)
    return y > 300 ? '東京タワー アンテナ頂上' : y > 245 ? '東京タワー トップデッキ' : y > 140 ? '東京タワー 大展望台' : '東京タワー 鉄塔';
  if (y > 5.5 && inR(JR, x, z)) return 'JR山手線・京浜東北線の線路の上';
  if (y > 7.5 && inR(MONO, x, z)) return '東京モノレール 浜松町駅の屋根';
  if (y > 8 && y < 11 && Math.abs(x - MONO_X) < 1) return '東京モノレールの軌道';
  for (const h of HODO) if (y > 4.5 && y < 7 && inR(h, x, z)) return h[4];
  for (const h of DECKS) if (y > 5.5 && y < 9 && inR(h, x, z)) return h[4];
  if (y > 25 && Math.hypot(x - ATAGO.x, z - ATAGO.z) < 40) return '愛宕山 山頂 (愛宕神社)';
  if (y > 6.5 && Math.hypot(x - MANNEKEN[0], z - MANNEKEN[1]) < 8) return '浜松町駅の小便小僧';
  if (hokoActive() && inR([-140, -1300, -116, -500], x, z)) return '銀座 中央通り (歩行者天国)';
  if (y > 3 && y < 4.6 && inR([JR[0], GADO[0], JR[2], GADO[1]], x, z)) return '新橋 ガード下 (屋台の屋根)';
  if (P.ride) return '山手線 車内';
  const rn = ringNearest(x, z);
  if (rn && rn.d < 9 && y > 5) { const st = stationAtS(rn.s); return st ? `${st.name}駅 ${rn.d < 2.8 ? 'ホーム' : '(線路の上)'}` : '山手線の高架の上'; }
  let name = null;
  for (const a of AREAS) if (inR(a.slice(1), x, z)) { name = a[0]; break; }
  if (!name) { const [st, d] = nearestStn(x, z); name = d < 1600 ? st.town : "東京"; }
  return y > 18 ? name + '（屋上）' : name;
}

