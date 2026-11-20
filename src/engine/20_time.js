/* ============================================================
   時間の経過 (現実の1分 = ゲーム内2時間)
   ============================================================ */
let gameH = 8.0; // ゲーム開始は共通で朝8時
const HOURS_PER_SEC = 2 / 60;
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const SKY_KEYS = [
  [0, '#060a1c', '#151c34'], [4.6, '#080e26', '#1e2440'], [5.6, '#2c3c78', '#e8946a'], [7, '#4a78c0', '#e6d4c4'],
  [12, '#3d6db6', '#dccbb5'], [16, '#3f6cb0', '#e0c8a8'], [17.6, '#3a4888', '#f08c58'], [18.6, '#18204e', '#6a4060'],
  [19.6, '#070b22', '#1a1e38'], [24, '#060a1c', '#151c34'],
].map(([h, a, b]) => [h, new THREE.Color(a), new THREE.Color(b)]);
const skyTop = new THREE.Color(), skyHor = new THREE.Color(), tmpC = new THREE.Color(), sunDir = new THREE.Vector3();
const C = {
  sunLow: new THREE.Color('#ff8a40'), sunHigh: new THREE.Color('#fff0d8'), moon: new THREE.Color('#8ea4d8'),
  hemiDay: new THREE.Color('#cfe0ff'), hemiNight: new THREE.Color('#3a4a78'), gDay: new THREE.Color('#6a5a48'), gNight: new THREE.Color('#141420'),
  cloudDay: new THREE.Color('#faf6ee'), cloudNight: new THREE.Color('#2a3048'),
};
const clockEl = document.getElementById('clock');
function updateTime() {
  const h = gameH;
  let i = 0; while (i < SKY_KEYS.length - 2 && h >= SKY_KEYS[i + 1][0]) i++;
  const a = SKY_KEYS[i], b = SKY_KEYS[i + 1], k = (h - a[0]) / (b[0] - a[0]);
  skyTop.copy(a[1]).lerp(b[1], k); skyHor.copy(a[2]).lerp(b[2], k);
  scene.fog.color.copy(skyHor);
  const col = skyGeo.attributes.color;
  for (let v = 0; v < skyT.length; v++) { tmpC.copy(skyHor).lerp(skyTop, skyT[v]); col.setXYZ(v, tmpC.r, tmpC.g, tmpC.b); }
  col.needsUpdate = true;
  const th = (h - 6) / 12 * Math.PI;
  sunDir.set(Math.cos(th), Math.sin(th), 0.35).normalize();
  const elev = sunDir.y, day = sstep(-0.08, 0.3, elev), night = 1 - sstep(-0.12, 0.08, elev);
  if (elev > -0.02) { sun.position.copy(sunDir); sun.color.copy(C.sunLow).lerp(C.sunHigh, sstep(0, 0.5, elev)); sun.intensity = 1.7 * sstep(-0.02, 0.15, elev); }
  else { sun.position.copy(sunDir).negate(); sun.color.copy(C.moon); sun.intensity = 0.45 * sstep(0.02, 0.2, -elev); }
  hemi.intensity = 0.35 + 0.8 * day;
  hemi.color.copy(C.hemiNight).lerp(C.hemiDay, day); hemi.groundColor.copy(C.gNight).lerp(C.gDay, day);
  for (const [m, s] of GLOW) m.emissiveIntensity = night * s;
  NIGHT = night;
  // 東京タワー: 通常はオレンジの「ランドマークライト」、土曜の夜は七色の「ダイヤモンドヴェール」
  const tt = performance.now() / 1000;
  TOWER_MATS.forEach((m, i) => { if (DOW === 6) m.emissive.setHSL((tt * 0.05 + i * 0.12) % 1, 0.75, 0.6); else m.emissive.set(0xffffff); });
  cloudMat.color.copy(C.cloudNight).lerp(C.cloudDay, day).lerp(skyHor, 0.25);
  starMat.opacity = night;
  sunDisc.visible = elev > -0.1; sunDisc.position.copy(camera.position).addScaledVector(sunDir, 3000); sunDisc.lookAt(camera.position);
  sunDisc.material.color.copy(sun.color).lerp(C.sunHigh, 0.4);
  moonDisc.visible = elev < 0.1; moonDisc.position.copy(camera.position).addScaledVector(sunDir, -3000); moonDisc.lookAt(camera.position);
  const hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
  clockEl.textContent = (elev > 0 ? '☀ ' : '☾ ') + String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
}

