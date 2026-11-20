/* ============================================================
   基本ユーティリティ
   ============================================================ */
let seed = 1987;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const rr = (a, b) => a + (b - a) * rnd();
const pick = a => a[Math.floor(rnd() * a.length)];
const inR = (r, x, z, m = 0) => x > r[0] - m && x < r[2] + m && z > r[1] - m && z < r[3] + m;
const inE = (e, x, z) => ((x - e[0]) / e[2]) ** 2 + ((z - e[1]) / e[3]) ** 2 < 1;
const overlap = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
const clip = (a, b) => { const r = [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])]; return r[0] < r[2] && r[1] < r[3] ? r : null; };

/* ---- 緯度経度 → ワールド座標 (1unit = 1m, +x = 東, +z = 南)
   基準: JR浜松町駅 (35.655230, 139.757627) = ワールド (-450, 80)
   ※竹芝周辺(初期マップ)はデフォルメ配置。拡張部分はこの関数で実座標から配置する */
const GEO = { lat: 35.655230, lon: 139.757627, x: -450, z: 80 };
const geo = (lat, lon) => [GEO.x + (lon - GEO.lon) * 111320 * Math.cos(GEO.lat * Math.PI / 180), GEO.z - (lat - GEO.lat) * 110950];

/* ---- PS1風: 頂点スナップ(ガタつき) ---- */
const SNAP = { value: new THREE.Vector2(100, 80) };
function ps1(m) {
  m.onBeforeCompile = sh => {
    sh.uniforms.uSnap = SNAP;
    sh.vertexShader = 'uniform vec2 uSnap;\n' + sh.vertexShader.replace('#include <project_vertex>',
      '#include <project_vertex>\nif (uSnap.x > 0.0 && gl_Position.w > 1.0) { vec4 sp = gl_Position; sp.xy = floor(sp.xy / sp.w * uSnap + 0.5) / uSnap * sp.w; gl_Position = sp; }');
  };
  return m;
}
const lam = o => ps1(new THREE.MeshLambertMaterial(o));
// 遠景用の「霞み」: 通常の霧より遠くまで見えるが、距離に応じてきちんと霞む
// (以前は霧を無効にしていたため、遠くの構造物がくっきり見えてしまっていた)
function farHaze(m, mul = 2.6, maxH = 0.95) {
  m.fog = true; const prev = m.onBeforeCompile;
  m.onBeforeCompile = (sh, r) => {
    if (prev) prev.call(m, sh, r);
    sh.fragmentShader = sh.fragmentShader.replace('#include <fog_fragment>',
      `#ifdef USE_FOG\n gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, smoothstep(fogFar * 0.7, fogFar * ${mul.toFixed(2)}, vFogDepth) * ${maxH.toFixed(2)});\n#endif`);
  };
  m.customProgramCacheKey = () => `haze_${mul}_${maxH}_${m.type}`;
  return m;
}
const farLam = c => farHaze(lam({ color: c }));
// 現実の日付 (曜日・月で街の様子が変わる)
const NOW = new Date(), DOW = NOW.getDay(), MONTH = NOW.getMonth() + 1, WEEKEND = DOW === 0 || DOW === 6;

/* ---- テクスチャ (オプションでフィルタを切り替えるため全て登録) ---- */
const TEXTURES = [];
let SMOOTH = false, MAX_ANISO = 1;
function filterTex(t) {
  t.magFilter = SMOOTH ? THREE.LinearFilter : THREE.NearestFilter;
  t.minFilter = SMOOTH ? THREE.LinearMipmapLinearFilter : THREE.NearestMipmapNearestFilter;
  t.anisotropy = SMOOTH ? MAX_ANISO : 1;
}
function canvasTex(c, wrap = true) {
  const t = new THREE.CanvasTexture(c);
  filterTex(t);
  t.wrapS = t.wrapT = wrap ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping; t.colorSpace = THREE.SRGBColorSpace;
  TEXTURES.push(t); return t;
}
function tex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  return canvasTex(c);
}
// 32x32px = 16m x 16m (4フロア x 8スパン)。夜の窓明かり用の発光テクスチャも同時に作る
const LIT = ['#ffd890', '#fff0c8', '#ffe4a8', '#d8ecff', '#ffcf80'];
function windowTex(bg, win, alt, style) {
  const mk = () => { const c = document.createElement('canvas'); c.width = c.height = 32; return c; };
  const mc = mk(), ec = mk(), x = mc.getContext('2d'), y = ec.getContext('2d');
  x.fillStyle = bg; x.fillRect(0, 0, 32, 32); y.fillStyle = '#000'; y.fillRect(0, 0, 32, 32);
  for (let j = 0; j < 4; j++) for (let i = 0; i < 8; i++) {
    const px = i * 4, py = j * 8;
    let r = null;
    if (style === 'curtain') r = [px + 1, py + 1, 3, 7];
    else if (style === 'ribbon') r = [px, py + 3, 4, 3];
    else if (style === 'punched') r = [px + 1, py + 3, 2, 3];
    else if (style === 'balcony') r = [px + 1, py + 2, 3, 4];
    else if (style === 'theatre' && i % 2 === 0) r = [px + 1, py + 1, 1, 6];
    if (!r) continue;
    x.fillStyle = rnd() < 0.3 ? alt : win; x.fillRect(...r);
    y.fillStyle = rnd() < 0.45 ? pick(LIT) : '#000'; y.fillRect(...r);
  }
  if (style === 'balcony') { x.fillStyle = 'rgba(255,255,255,.55)'; for (let k = 6; k < 32; k += 8) x.fillRect(0, k, 32, 1); }
  if (style === 'ribbon') { x.fillStyle = bg; y.fillStyle = '#000'; for (let i = 0; i < 32; i += 4) { x.fillRect(i, 0, 1, 32); y.fillRect(i, 0, 1, 32); } }
  return { map: canvasTex(mc), emi: canvasTex(ec) };
}
// テクスチャがメートル単位で貼られるようにUVをスケーリングした箱
function boxGeo(w, h, d, tw = 16, th = 16) {
  const geo = new THREE.BoxGeometry(w, h, d), uv = geo.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) {
    const k = f * 4 + i; uv.setXY(k, uv.getX(k) * dims[f][0] / tw, uv.getY(k) * dims[f][1] / th);
  }
  return geo;
}

