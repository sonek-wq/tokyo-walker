/* ============================================================
   プレイヤー・入力
   ============================================================ */
const P = { x: 176, z: -22, y: 0, vy: 0, yaw: Math.PI / 2, pitch: 0.04, bob: 0, anim: 0, heading: Math.PI / 2, grounded: true, climbing: false,
  scooter: false, glider: false, svx: 0, svz: 0, gvx: 0, gvz: 0, gOpen: 0, wheel: 0, safe: [55, 24, 0] };
const RAD = 0.35, STEP = 0.45, BODY = 1.7;
const BOUNDS = [MINX, MINZ, MAXX, MAXZ];
// 陸地か (水面・池でない)
function onLand(x, z) {
  if (BRIDGE_POLYS.some(([P]) => inPoly(P, x, z))) return true;   // 川や海に架かる橋の上
  if (!WALK.some(r => inR(r, x, z))) return false;
  if (inRiver(x, z)) return false;
  for (const p of PONDS) if (inE(p, x, z) && !inE(ISLAND, x, z) && !inR(POND_BRIDGE, x, z) && !inPondLand(x, z)) return false;
  return true;
}
function floorAt(x, z, y) {
  let f = onLand(x, z) ? groundY(x, z) : -1.4;   // 水の上なら水面 (砂浜は坂)
  for (const s of query(x - RAD, z - RAD, x + RAD, z + RAD)) if (s[5] <= y + STEP && s[5] > f && inR(s, x, z, RAD)) f = s[5];
  return f;
}
function blockedAt(x, z, y) {
  // 地上では水辺で止まる。空中 (グライダー・高所からの落下・高架の上) なら水の上へも出られる
  if (!onLand(x, z) && !(y > 1.5 && inR(BOUNDS, x, z, -2))) return 'edge';
  for (const s of query(x - RAD, z - RAD, x + RAD, z + RAD)) if (s[5] > y + STEP && s[4] < y + BODY && inR(s, x, z, RAD)) return 'wall';
  return null;
}
const keys = {};
addEventListener('keydown', e => {
  if (albumOpen) { albumKey(e); e.preventDefault(); return; }
  if (noteOpen) { if (e.code === 'KeyK' || e.code === 'Escape') toggleNotebook(); e.preventDefault(); return; }
  keys[e.code] = true;
  if (e.code === 'KeyP') { SET.pixel = (SET.pixel + 1) % PIXEL_LEVELS.length; applySettings(); toast('ドット絵効果: ' + PIXEL_LEVELS[SET.pixel].name); }
  if (e.code === 'KeyV') { SET.view = (SET.view + 1) % VIEWS.length; applySettings(); toast('視点: ' + VIEWS[SET.view].name); }
  if (e.code === 'KeyJ') { SET.jitter = !SET.jitter; applySettings(); toast('ガタつき処理: ' + (SET.jitter ? 'ON' : 'OFF')); }
  if (e.code === 'KeyR' && !e.repeat) toggleScooter();
  if ((e.code === 'Space' || e.code === 'KeyG') && !e.repeat) toggleGlider();
  if (e.code === 'KeyT') { gameH = (gameH + 1) % 24; toast('時刻を1時間進めました'); }
  if (e.code === 'Escape' && started && overlay.style.display === 'none') showPause();
  if (e.code === 'KeyN') { showMap = !showMap; mini.style.display = showMap ? 'block' : 'none'; }
  if (e.code === 'KeyM') toggleBig();
  if (['Equal', 'Semicolon', 'NumpadAdd', 'BracketRight'].includes(e.code)) zoomBig(1);   // ＋ (日本語キーボードの「;+」も)
  if (['Minus', 'NumpadSubtract', 'BracketLeft'].includes(e.code)) zoomBig(-1);
  if (e.code === 'KeyC' && !e.repeat) takePhoto();
  if (e.code === 'KeyB' && !e.repeat) toggleAlbum();
  if (e.code === 'KeyK' && !e.repeat) toggleNotebook();
  if (e.code === 'KeyE' && !e.repeat && started && !cine) { if (!boatAction() && !stationAction() && !lmAction()) tryBoard(); }
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
});
addEventListener('keyup', e => keys[e.code] = false);
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

const overlay = document.getElementById('overlay');
let started = false, dragging = false;
const startText = document.getElementById('startText');
function showPause() { overlay.style.display = 'flex'; startText.style.display = 'block'; document.getElementById('startBtns').style.display = 'none'; }
document.getElementById('settings').addEventListener('click', e => e.stopPropagation());
const lockPointer = () => { try { const r = canvas.requestPointerLock(); if (r && r.catch) r.catch(() => {}); } catch (e) {} };
overlay.addEventListener('click', () => {   // ポーズからの再開
  if (!started) return;
  overlay.style.display = 'none'; lockPointer();
});
document.getElementById('startBtns').addEventListener('click', e => e.stopPropagation());
document.getElementById('btnNew').onclick = () => { overlay.style.display = 'none'; newGame(); };
document.getElementById('btnCont').onclick = () => { overlay.style.display = 'none'; lockPointer(); continueGame(); };
document.addEventListener('pointerlockchange', () => { if (!document.pointerLockElement && started && !cine && !albumOpen && !noteOpen) showPause(); });
canvas.addEventListener('mousedown', () => dragging = true);
addEventListener('mouseup', () => dragging = false);
addEventListener('mousemove', e => {
  if (document.pointerLockElement === canvas || dragging) {
    P.yaw -= e.movementX * 0.0022; P.pitch = Math.max(-1.35, Math.min(1.35, P.pitch - e.movementY * 0.0022));
  }
});

