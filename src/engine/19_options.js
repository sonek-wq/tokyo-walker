/* ============================================================
   オプション (ガタつき / ドット絵効果 / 視点)
   ============================================================ */
const PIXEL_LEVELS = [
  { name: 'なし', h: 0 }, { name: '最弱 (720p)', h: 720 }, { name: '弱 (540p)', h: 540 }, { name: '中 (360p)', h: 360 },
  { name: '強 (240p・PS1)', h: 240 }, { name: '最強 (160p)', h: 160 },
];
const VIEWS = [{ name: '一人称', dist: 0 }, { name: '三人称・近い', dist: 4 }, { name: '三人称・中', dist: 8 }, { name: '三人称・遠い', dist: 15 }];
const SET = { jitter: true, pixel: 1, view: 2 };
const SAVE_KEY = 'tokyoWalker_v1';
try { Object.assign(SET, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); } catch (e) {}
SET.pixel = Math.max(0, Math.min(PIXEL_LEVELS.length - 1, SET.pixel | 0));
SET.view = Math.max(0, Math.min(VIEWS.length - 1, SET.view | 0));
function resize() {
  const lv = PIXEL_LEVELS[SET.pixel];
  const H = lv.h ? Math.min(lv.h, innerHeight) : Math.round(innerHeight * Math.min(devicePixelRatio, 2));
  const W = Math.round(H * innerWidth / innerHeight);
  renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
  const vh = 240, vw = vh * innerWidth / innerHeight; // ガタつきは解像度に関係なく240p相当
  if (SET.jitter) SNAP.value.set(vw * 0.35, vh * 0.35); else SNAP.value.set(0, 0);
}
function applySettings() {
  SMOOTH = PIXEL_LEVELS[SET.pixel].h === 0;
  for (const t of TEXTURES) { filterTex(t); t.needsUpdate = true; }
  canvas.style.imageRendering = SMOOTH ? 'auto' : 'pixelated';
  starMat.size = SMOOTH ? 2.5 : 1.5;
  resize();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(SET)); } catch (e) {}
  const mkBtns = (el, items, cur, on) => {
    el.innerHTML = '';
    items.forEach((label, i) => { const b = document.createElement('button'); b.textContent = label; if (i === cur) b.className = 'on'; b.onclick = () => on(i); el.appendChild(b); });
  };
  mkBtns(document.getElementById('optJitter'), ['ON', 'OFF'], SET.jitter ? 0 : 1, i => { SET.jitter = i === 0; applySettings(); });
  mkBtns(document.getElementById('optPixel'), PIXEL_LEVELS.map(l => l.name), SET.pixel, i => { SET.pixel = i; applySettings(); });
  mkBtns(document.getElementById('optView'), VIEWS.map(v => v.name), SET.view, i => { SET.view = i; applySettings(); });
}
addEventListener('resize', resize);
const toastEl = document.getElementById('toast'); let toastTimer = 0;
function toast(msg) { toastEl.textContent = msg; toastEl.style.opacity = 1; toastTimer = 1.8; }

