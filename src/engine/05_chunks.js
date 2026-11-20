/* ============================================================
   チャンク (200m 四方) : 遠いものは描画しない / 地面テクスチャを都度生成
   ============================================================ */
const CH = 200;
const CHUNKS = new Map();
function chunkAt(x, z) {
  const i = Math.floor(x / CH), j = Math.floor(z / CH), k = i + ',' + j;
  let c = CHUNKS.get(k);
  if (!c) { c = { cx: (i + 0.5) * CH, cz: (j + 0.5) * CH, group: new THREE.Group(), buckets: {} }; scene.add(c.group); CHUNKS.set(k, c); }
  return c;
}
const FAR = { group: new THREE.Group(), buckets: {} }; scene.add(FAR.group); // 高層ランドマーク(常に描画)

