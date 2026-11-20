/* ============================================================
   地面 (チャンク単位のテクスチャをストリーミング)・護岸・水面・街の外周
   ============================================================ */
const lattice = (a, b, s = 10) => { const v = [a]; for (let k = Math.floor(a / s) * s + s; k < b; k += s) v.push(k); v.push(b); return v; };
function groundMesh(x0, z0, x1, z1, mat, uvf, step = 10) {
  const xs = lattice(x0, x1, step), zs = lattice(z0, z1, step), nx = xs.length;
  const pos = [], nor = [], uv = [], idx = [];
  for (const z of zs) for (const x of xs) { pos.push(x, 0, z); nor.push(0, 1, 0); uv.push(...uvf(x, z)); }
  for (let j = 0; j < zs.length - 1; j++) for (let i = 0; i < nx - 1; i++) { const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1; idx.push(a, c, b, b, c, d); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); const m = new THREE.Mesh(g, mat); scene.add(m); return m;
}
const TILE_PX = 512, TPX = TILE_PX / CH, GROUND_FALLBACK = 0x8a867d;
// 地面は深度補正なし (手前に補正すると、ガタつきON時にカメラ付近の地面が描画されず消える)。
// 代わりに水面を奥へ補正して、遠くの水面が地面を突き抜けて見えるのを防ぐ
const groundLam = o => lam(o);
const waterLam = o => lam({ ...o, polygonOffset: true, polygonOffsetFactor: 4, polygonOffsetUnits: 4 });
const GTILES = [];
// 読み込み前の仮テクスチャ (1x1)。最初から map を持たせておき、読み込み時は差し替えるだけにする
// (マテリアルのシェーダーを切り替えると、切り替え直後に地面が描画されない瞬間ができるため)
const GROUND_PLACEHOLDER = new THREE.DataTexture(new Uint8Array([138, 134, 125, 255]), 1, 1, THREE.RGBAFormat);
GROUND_PLACEHOLDER.colorSpace = THREE.SRGBColorSpace; GROUND_PLACEHOLDER.needsUpdate = true;
for (let i = Math.floor(MINX / CH); i < Math.ceil(MAXX / CH); i++) for (let j = Math.floor(MINZ / CH); j < Math.ceil(MAXZ / CH); j++) {
  const T = [i * CH, j * CH, (i + 1) * CH, (j + 1) * CH];
  const rects = WALK.map(r => clip(r, T)).filter(Boolean);
  if (!rects.length) continue;
  const t = { x0: T[0], z0: T[1], cx: T[0] + CH / 2, cz: T[1] + CH / 2, mat: groundLam({ map: GROUND_PLACEHOLDER }), tex: null };
  t.meshes = rects.map(r => groundMesh(...r, t.mat, (x, z) => [(x - t.x0) / CH, (z - t.z0) / CH])); // DataTexture は上下反転しないので v = z方向そのまま
  GTILES.push(t);
}
function loadTile(t) {
  const c = document.createElement('canvas'); c.width = c.height = TILE_PX;
  const g = c.getContext('2d');
  g.setTransform(TPX, 0, 0, TPX, -t.x0 * TPX, -t.z0 * TPX);
  g.fillStyle = '#2b5b78'; g.fillRect(t.x0, t.z0, CH, CH);
  const T = [t.x0, t.z0, t.x0 + CH, t.z0 + CH];
  for (const it of DL) if (overlap(it.bb, T)) it.f(g);
  procPaint(g, T);
  g.setTransform(1, 0, 0, 1, 0, 0);
  const id = g.getImageData(0, 0, TILE_PX, TILE_PX), d = id.data;
  for (let k = 0; k < d.length; k += 4) { const n = (Math.random() - 0.5) * 16; d[k] += n; d[k + 1] += n; d[k + 2] += n; }
  // キャンバスを直接転送すると、描画直後はGPUに中身が正しく渡らず地面が無地になることがあるため、
  // 画素データ (ImageData) から DataTexture を作って確実に転送する
  const tx = new THREE.DataTexture(d, TILE_PX, TILE_PX, THREE.RGBAFormat);
  tx.generateMipmaps = true; tx.wrapS = tx.wrapT = THREE.ClampToEdgeWrapping; tx.colorSpace = THREE.SRGBColorSpace;
  filterTex(tx); tx.needsUpdate = true; TEXTURES.push(tx);
  t.tex = tx;
  t.mat.map = t.tex;
}
function unloadTile(t) {
  t.mat.map = GROUND_PLACEHOLDER;
  t.tex.dispose(); TEXTURES.splice(TEXTURES.indexOf(t.tex), 1); t.tex = null;
}
function streamTiles(force, Rf = 380, keep = false) {
  const px = camera.position.x, pz = camera.position.z, R = force ? Rf : Math.min(1400, 480 + camera.position.y * 2);
  let todo = null, best = Infinity;
  for (const t of GTILES) {
    const d = Math.hypot(t.cx - px, t.cz - pz);
    if (t.tex && d > R + 300) { if (!keep) unloadTile(t); }
    else if (!t.tex && d < R) { if (force) loadTile(t); else if (d < best) { best = d; todo = t; } }
  }
  if (todo) loadTile(todo); // 1フレームに1枚だけ生成してカクつきを防ぐ
}

const seawall = lam({ color: 0x8c877c });
const hidden = new THREE.MeshBasicMaterial({ visible: false });
const wallNoTop = [seawall, seawall, hidden, seawall, seawall, seawall];
// ※以前は地面の下に巨大な下敷きの板を敷いていたが、巨大ポリゴンはガタつき処理で奥行きがずれて
//   カメラ付近の地面を上書きしてしまう (地面テクスチャが消える原因) ため廃止
for (const [x0, z0, x1, z1] of LAND) box(x1 - x0, 5, z1 - z0, wallNoTop, (x0 + x1) / 2, -2.5, (z0 + z1) / 2);
for (const [x0, z0, x1, z1] of BRIDGES) {
  box(x1 - x0, 1.4, z1 - z0, wallNoTop, (x0 + x1) / 2, -0.7, (z0 + z1) / 2);
  if (x1 - x0 < z1 - z0) for (const x of [x0 + 0.2, x1 - 0.2]) box(0.3, 1.1, z1 - z0, dark, x, 0.55, (z0 + z1) / 2);
  else for (const z of [z0 + 0.2, z1 - 0.2]) box(x1 - x0, 1.1, 0.3, dark, (x0 + x1) / 2, 0.55, z);
}
for (const [z0, z1] of [[-170, -30], [50, 320]]) box(0.25, 1.1, z1 - z0, dark, 139.8, 0.55, (z0 + z1) / 2);
box(0.25, 1.1, 80, dark, 239.8, 0.55, 10);
// 街の外周の地面 (100m の街区模様)
{
  const skirtTex = tex(32, 32, x => {
    x.fillStyle = '#3e3e44'; x.fillRect(0, 0, 32, 32);
    x.fillStyle = '#86827a'; x.fillRect(3, 3, 26, 26);
    x.fillStyle = '#5c5a56'; x.fillRect(5, 5, 22, 22);
  });
  const sm = groundLam({ map: skirtTex });
  const uvf = (x, z) => [x / 100, -z / 100];
  groundMesh(MINX - 1600, MINZ - 1600, MAXX + 1600, MINZ, sm, uvf, 100);   // 北
  groundMesh(MINX - 1600, MINZ, MINX, MAXZ + 1600, sm, uvf, 100);          // 西
  groundMesh(MINX, MAXZ, -600, MAXZ + 1600, sm, uvf, 100);                 // 南
  groundMesh(MAXX, MINZ, MAXX + 1600, -1300, sm, uvf, 100);                // 東 (隅田川より北)
}
const waterTex = tex(16, 16, x => {
  x.fillStyle = '#2d6585'; x.fillRect(0, 0, 16, 16);
  for (let i = 0; i < 18; i++) { x.fillStyle = rnd() < 0.5 ? '#4b88a8' : '#245572'; x.fillRect(rnd() * 16 | 0, rnd() * 16 | 0, 3 + rnd() * 4 | 0, 1); }
});
waterTex.repeat.set(800, 800);
const waterGeo = new THREE.PlaneGeometry(9000, 9000, 70, 80); waterGeo.rotateX(-Math.PI / 2); // 東京湾・隅田川 (西側・北側の街の下には敷かない)
const water = new THREE.Mesh(waterGeo, waterLam({ map: waterTex }));
water.position.set(-600 + 4500, -1.6, -1300 + 4500); scene.add(water);
const wPos = waterGeo.attributes.position, wBase = Float32Array.from(wPos.array);
// 古川 (拡張エリアの南を流れる川)
const riverTex = waterTex.clone(); riverTex.repeat.set(310, 2.6); riverTex.needsUpdate = true; TEXTURES.push(riverTex);
{
  const river = new THREE.Mesh(new THREE.PlaneGeometry(3520, 30).rotateX(-Math.PI / 2), waterLam({ map: riverTex })); river.position.set(-2240, -1.6, 305); scene.add(river);
  box(3520, 5, 1, seawall, -2240, -2.5, 320.5); box(2320, 5, 1, seawall, -2840, -2.5, 289.5);
  box(1204, 1.1, 0.12, lam({ color: 0x9aa0a4 }), -1078, 0.55, 289.7); // 河畔の手すり
}

