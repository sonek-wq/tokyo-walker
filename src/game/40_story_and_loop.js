/* ============================================================
   メインループ
   ============================================================ */
/* ============================================================
   旅の目的: じいちゃんの写真 / 到着と出航の演出
   ============================================================ */
// 写真の撮影地点: 視点の位置 (x, y=足元の高さ, z) と向き (yaw, pitch)。when = 'night' | 'evening' | null
const PHOTOS = [
  { id: 'pier', x: 122, y: 0, z: 31, yaw: 1.5, pitch: 0.16, memo: '島から着いた朝、桟橋で最初に撮った一枚', place: '竹芝ふ頭公園' },
  { id: 'hama', x: 40, y: 0, z: -294, yaw: 0, pitch: 0.06, memo: '海の水が入る池の、真ん中の茶屋', place: '浜離宮恩賜庭園' },
  { id: 'sl', x: -590, y: 0, z: -918, yaw: -1.19, pitch: 0.05, memo: '汽車の前は、いつも待ち合わせの人でいっぱいだった', place: '新橋 SL広場' },
  { id: 'gado', x: -450, y: 0, z: -712, yaw: 0, pitch: 0.04, memo: '夜。線路の下に赤ちょうちんが並んでいた', place: '新橋 ガード下', when: 'night' },
  { id: 'wako', x: -112, y: 0, z: -1186, yaw: 0.994, pitch: 0.42, memo: '銀座の交差点で、時計台を見上げた', place: '銀座四丁目交差点' },
  { id: 'atago', x: -1193, y: 0, z: -630, yaw: Math.PI / 2, pitch: 0.3, memo: '馬で駆け上がったという、急な石段の下から', place: '愛宕山 出世の石段' },
  { id: 'zojo', x: -1104, y: 0, z: -60, yaw: 1.094, pitch: 0.18, memo: '寺の門の向こうに、赤い塔が見えた', place: '増上寺 三解脱門' },
  { id: 'tower', x: TOWER[0] + 10, y: 159, z: TOWER[1], yaw: -Math.PI / 2, pitch: -0.35, memo: '塔の上から、夕焼けの港を眺めた', place: '東京タワー 大展望台の屋根', when: 'evening' },
];
const WHEN_OK = { night: h => h >= 18.5 || h < 4.5, evening: h => h >= 16.3 && h < 18.6 };
const WHEN_TXT = { night: '（夜）', evening: '（夕方）' };
const STORY_KEY = 'tokyoWalker_story';
const STORY = (() => { try { return JSON.parse(localStorage.getItem(STORY_KEY)) || {}; } catch (e) { return {}; } })();
STORY.photos = STORY.photos || {};   // じいちゃんの写真と一致した記録 (進行状況)
STORY.shots = STORY.shots || [];     // 撮った写真 (最大50枚)
const SHOT_MAX = 50, PER_PAGE = 8;
const saveStory = () => { try { localStorage.setItem(STORY_KEY, JSON.stringify(STORY)); } catch (e) {} };
const OLD = {};   // じいちゃんの写真 (ゲーム内の景色をセピア調で描いて作る)
let cine = null, capReq = null, albumOpen = false, albumPage = 0, pvIndex = -1;
const fadeEl = document.getElementById('fade'), flashEl = document.getElementById('flash'), hintEl = document.getElementById('photoHint'), promptEl = document.getElementById('prompt');
const letterEl = document.getElementById('letter'), albumEl = document.getElementById('album'), endingEl = document.getElementById('ending');
const yawDiff = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

// 1枚ずつ、少し間をあけて作る (画面が固まらないように)
let oldBusy = false;
function makeOldPhotos(onEach) {
  const todo = PHOTOS.filter(p => !OLD[p.id]);
  if (!todo.length) { if (onEach) onEach(); return; }
  if (oldBusy) return; oldBusy = true;
  const step = () => { renderOld(todo.shift()); if (onEach) onEach(); if (todo.length) setTimeout(step, 40); else oldBusy = false; };
  setTimeout(step, 40);
}
function renderOld(ph) {
  const saveH = gameH, sp = camera.position.clone(), sr = camera.rotation.clone(), sAsp = camera.aspect, fn = scene.fog.near, ff = scene.fog.far;
  const vis = [avatar.visible, blob.visible, scooter.visible, glider.visible];
  avatar.visible = blob.visible = scooter.visible = glider.visible = false;
  renderer.setSize(360, 240, false); camera.aspect = 1.5; camera.updateProjectionMatrix();
  gameH = ph.when === 'night' ? 20.5 : ph.when === 'evening' ? 17.3 : 10; updateTime();
  camera.position.set(ph.x, ph.y + 1.6, ph.z); camera.rotation.set(ph.pitch, ph.yaw, 0);
  sky.position.copy(camera.position);
  scene.fog.near = 60 + ph.y * 0.5; scene.fog.far = 680 + ph.y * 2;
  for (const c of CHUNKS.values()) c.group.visible = true;
  streamTiles(true, 240, true);
  renderer.render(scene, camera);
  const c = document.createElement('canvas'); c.width = 360; c.height = 240; const g = c.getContext('2d');
  g.drawImage(renderer.domElement, 0, 0, 360, 240);
  const id = g.getImageData(0, 0, 360, 240), d = id.data;
  for (let i = 0; i < d.length; i += 4) { // セピア + 退色 + 粒子 + 周辺減光
    const px = (i / 4) % 360, py = (i / 4 / 360) | 0, vx = (px - 180) / 180, vy = (py - 120) / 120, vig = 1 - 0.45 * (vx * vx + vy * vy);
    const l = (0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) * (ph.when === 'night' ? 1.35 : 0.85) + 30 + (Math.random() - 0.5) * 22;
    d[i] = Math.min(255, l * 1.08 * vig + 12); d[i + 1] = Math.min(255, l * 0.92 * vig + 6); d[i + 2] = Math.min(255, l * 0.7 * vig);
  }
  g.putImageData(id, 0, 0);
  OLD[ph.id] = c.toDataURL('image/jpeg', 0.8);
  gameH = saveH; updateTime(); camera.position.copy(sp); camera.rotation.copy(sr); camera.aspect = sAsp; scene.fog.near = fn; scene.fog.far = ff;
  [avatar.visible, blob.visible, scooter.visible, glider.visible] = vis;
  resize();
}
function photoCards(el, mode) {
  el.innerHTML = PHOTOS.map(ph => {
    const mine = STORY.photos[ph.id], w = ph.when ? WHEN_TXT[ph.when] : '';
    if (!OLD[ph.id]) return `<div class="ph"><div style="aspect-ratio:3/2;background:#d8ccb0"></div>…</div>`;
    if (mode === 'end') return `<div class="ph"><div class="pair"><img src="${OLD[ph.id]}"><img src="${mine || OLD[ph.id]}"></div>${ph.place}</div>`;
    return `<div class="ph ${mine ? 'done' : ''}"><img src="${OLD[ph.id]}">${mine && mode === 'album' ? `<img class="mine" src="${mine}">` : ''}
      「${ph.memo}」${w}${mine && mode === 'album' ? `<br><span class="ok">✓ ${ph.place}</span>` : ''}</div>`;
  }).join('');
}
function newGame() {
  STORY.begun = true; STORY.photos = {}; STORY.shots = []; STORY.cleared = false; saveStory();
  gameH = 8; Object.assign(P, { x: 176, z: -22, y: 0, vy: 0, yaw: Math.PI / 2, pitch: 0.04, scooter: false, glider: false, ride: null, boat: null });
  cine = { mode: 'arrive', t: 0 };
  bannerSmall.textContent = 'ようこそ'; bannerText.textContent = 'WELCOME TO TOKYO'; noteEl.textContent = '伊豆諸島から、竹芝桟橋へ';
}
function continueGame() {
  gameH = 8; Object.assign(P, { x: 176, z: -22, y: 0, vy: 0, yaw: Math.PI / 2, pitch: 0.04, scooter: false, glider: false });
  started = true; makeOldPhotos();
}
function startWalking() {
  letterEl.style.display = 'none'; started = true; lockPointer();
}
document.getElementById('btnWalk').onclick = startWalking;
// ---- アルバム: 0ページ目 = じいちゃんの写真 / 1ページ目以降 = 撮った写真 (8枚ずつ)
const shotPages = () => Math.max(1, Math.ceil(STORY.shots.length / PER_PAGE));
function renderAlbum() {
  const el = document.getElementById('albumPhotos'), last = shotPages();
  albumPage = Math.max(0, Math.min(albumPage, last));
  document.getElementById('albPrev').disabled = albumPage === 0;
  document.getElementById('albNext').disabled = albumPage >= last;
  if (albumPage === 0) {
    document.getElementById('albTitle').textContent = '📷 じいちゃんの写真';
    document.getElementById('albSub').textContent = `同じ景色を撮った: ${Object.keys(STORY.photos).length} / ${PHOTOS.length}　→ 撮った写真`;
    el.innerHTML = PHOTOS.map(ph => {
      const done = STORY.photos[ph.id], w = ph.when ? WHEN_TXT[ph.when] : '';
      if (!OLD[ph.id]) return `<div class="ph"><div style="aspect-ratio:3/2;background:#d8ccb0"></div>…</div>`;
      return `<div class="ph ${done ? 'done' : ''}"><img src="${OLD[ph.id]}">${done ? `<img class="mine" src="${done}">` : ''}「${ph.memo}」${w}${done ? `<br><span class="ok">✓ ${ph.place}</span>` : ''}</div>`;
    }).join('');
  } else {
    document.getElementById('albTitle').textContent = '🖼 撮った写真';
    document.getElementById('albSub').textContent = `${albumPage} / ${last} ページ　（保存 ${STORY.shots.length} / ${SHOT_MAX} 枚）`;
    const from = (albumPage - 1) * PER_PAGE, list = STORY.shots.slice(from, from + PER_PAGE);
    if (!STORY.shots.length) { el.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px 0;opacity:.7">まだ写真がありません。C で撮影しよう</div>'; return; }
    el.innerHTML = list.map((sh, k) => `<div class="ph shot" data-i="${from + k}"><img src="${sh.img}">${sh.match ? '<span class="star">★</span> ' : ''}${sh.place}<br><span style="opacity:.7">${sh.time}</span></div>`).join('')
      + Array(PER_PAGE - list.length).fill('<div class="ph empty"></div>').join('');
    el.querySelectorAll('.ph.shot').forEach(d => d.onclick = () => openPreview(+d.dataset.i));
  }
}
function openPreview(i) {
  const sh = STORY.shots[i]; if (!sh) return; pvIndex = i;
  document.getElementById('pvImg').src = sh.img;
  document.getElementById('pvCap').textContent = `${sh.place}　${sh.time}${sh.match ? '　★じいちゃんの写真と同じ景色' : ''}`;
  document.getElementById('pvDel').textContent = '🗑 この写真を削除'; document.getElementById('pvDel').dataset.confirm = '';
  document.getElementById('preview').style.display = 'flex';
}
function closePreview() { pvIndex = -1; document.getElementById('preview').style.display = 'none'; }
document.getElementById('pvBack').onclick = closePreview;
document.getElementById('pvDel').onclick = e => {   // 2回押しで削除 (誤操作防止)
  const b = e.currentTarget;
  if (!b.dataset.confirm) { b.dataset.confirm = '1'; b.textContent = '本当に削除する？ (もう一度押す)'; return; }
  STORY.shots.splice(pvIndex, 1); saveStory(); closePreview(); renderAlbum(); toast('🗑 写真を削除しました');
};
document.getElementById('albPrev').onclick = () => { albumPage--; closePreview(); renderAlbum(); };
document.getElementById('albNext').onclick = () => { albumPage++; closePreview(); renderAlbum(); };
function toggleAlbum() {
  if (!started) return;
  albumOpen = !albumOpen;
  for (const k in keys) keys[k] = false;
  if (albumOpen) {
    albumPage = 0; closePreview(); renderAlbum(); makeOldPhotos(() => { if (albumOpen && albumPage === 0) renderAlbum(); });
    try { document.exitPointerLock(); } catch (e) {}   // 写真をクリックできるようにマウスを解放
  } else { closePreview(); lockPointer(); }
  albumEl.style.display = albumOpen ? 'flex' : 'none';
}
function albumKey(e) {   // アルバム表示中のキー操作
  if (e.code === 'ArrowRight') { if (albumPage < shotPages()) { albumPage++; closePreview(); renderAlbum(); } }
  else if (e.code === 'ArrowLeft') { if (albumPage > 0) { albumPage--; closePreview(); renderAlbum(); } }
  else if (e.code === 'KeyB' || e.code === 'Escape') { if (pvIndex >= 0 && e.code === 'Escape') closePreview(); else toggleAlbum(); }
}
// 撮影: 撮った写真は必ずアルバムへ。立ち位置・向き・時間帯がじいちゃんの写真と合えば一致
function takePhoto() {
  if (!started || cine || albumOpen || noteOpen) return;
  if (STORY.shots.length >= SHOT_MAX) { toast('📷 これ以上写真を保存できない！ アルバム (B) で写真を削除しよう'); toastTimer = 3.5; return; }
  flashEl.style.transition = 'none'; flashEl.style.opacity = 0.85; requestAnimationFrame(() => { flashEl.style.transition = 'opacity .35s'; flashEl.style.opacity = 0; });
  let hit = null, msg = null;
  for (const ph of PHOTOS) {
    if (STORY.photos[ph.id]) continue;
    if (Math.hypot(P.x - ph.x, P.z - ph.z) > 12 || Math.abs(P.y - ph.y) > 3.5) continue;
    if (yawDiff(camera.rotation.y, ph.yaw) > 0.42 || Math.abs(camera.rotation.x - ph.pitch) > 0.38) continue;
    if (ph.when && !WHEN_OK[ph.when](gameH)) { msg = `📷 パシャリ… 場所はここだ。でも写真の空とは時間が違う${WHEN_TXT[ph.when]}`; continue; }
    hit = ph; break;
  }
  capReq = { id: hit ? hit.id : null };
  if (!hit) { toast(msg || `📷 パシャリ (${STORY.shots.length + 1} / ${SHOT_MAX})`); if (msg) toastTimer = 3.5; }
}
function handleCapture() {
  const req = capReq; capReq = null;
  const c = document.createElement('canvas'), W = 240, H = Math.round(240 * renderer.domElement.height / renderer.domElement.width);
  c.width = W; c.height = H; c.getContext('2d').drawImage(renderer.domElement, 0, 0, W, H);
  const img = c.toDataURL('image/jpeg', 0.7), hh = Math.floor(gameH), mm = Math.floor((gameH - hh) * 60);
  STORY.shots.push({ img, place: curArea || '東京', time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, match: req.id || null });
  if (!req.id) { saveStory(); return; }
  STORY.photos[req.id] = img; saveStory();
  const n = Object.keys(STORY.photos).length, ph = PHOTOS.find(q => q.id === req.id);
  toast(`📷 じいちゃんの写真と同じ景色だ！ (${n} / ${PHOTOS.length})`); toastTimer = 4;
  bannerSmall.textContent = '📷 ' + n + ' / ' + PHOTOS.length; bannerText.textContent = ph.place; noteEl.textContent = '「' + ph.memo + '」';
  banner.style.opacity = 1; bannerTimer = 4;
  if (n === PHOTOS.length) setTimeout(() => {
    bannerSmall.textContent = 'COMPLETE'; bannerText.textContent = '写真が全部そろった'; noteEl.textContent = '竹芝桟橋から、帰りの船に乗ろう';
    banner.style.opacity = 1; bannerTimer = 6;
  }, 4200);
}
const BOARD = [150, -30, 240, -16];
const allTaken = () => PHOTOS.every(ph => STORY.photos[ph.id]);
function tryBoard() {
  if (!started || cine || !allTaken() || !inR(BOARD, P.x, P.z) || P.y > 2) return;
  started = false; P.scooter = P.glider = false; albumOpen = false; albumEl.style.display = 'none'; noteOpen = false; notebookEl.style.display = 'none';
  cine = { mode: 'depart', t: 0 }; promptEl.style.display = 'none'; banner.style.opacity = 0; bannerTimer = 0; hintEl.textContent = '';
}
let hintTick = 0;
function updateStory(dt) {
  if ((hintTick -= dt) > 0) return; hintTick = 0.25;
  let near = null;
  if (started) for (const ph of PHOTOS) if (!STORY.photos[ph.id] && Math.hypot(P.x - ph.x, P.z - ph.z) < 28 && Math.abs(P.y - ph.y) < 8) near = ph;
  hintEl.textContent = near ? '📷 …この景色、写真で見た気がする' : '';
  const sp = started ? (boatPrompt() || stationPrompt() || lmPrompt()) : '', boat = started && allTaken() && inR(BOARD, P.x, P.z) && P.y < 2;
  promptEl.textContent = sp || 'E　帰りの船に乗る'; promptEl.style.display = sp || boat ? 'block' : 'none';
}
// 演出 (到着・出航)
const ease = x => 1 - Math.pow(1 - Math.min(1, x), 3);
const look = (x, y, z, tx, ty, tz) => { camera.position.set(x, y, z); camera.lookAt(tx, ty, tz); };
function updateCine(dt, t) {
  cine.t += dt; const sh = SHIPS[0], k = cine.t;
  avatar.visible = blob.visible = scooter.visible = glider.visible = false;
  if (cine.mode === 'arrive') {          // 東の海から、舳先の上で竹芝桟橋へ
    sh.a = Math.PI; sh.z = -40; sh.x = 760 - (760 - 196) * ease(k / 11);
    camera.rotation.order = 'YXZ'; camera.position.set(sh.x - 46, 10.5, sh.z + 2); camera.rotation.set(0.04, Math.PI / 2 + Math.sin(k * 0.3) * 0.08, 0);
    if (k < 0.1) { banner.style.opacity = 1; bannerTimer = 0; }
    if (k > 6 && k < 6.1) bannerTimer = 3;
    if (k > 11 && !cine.faded) { cine.faded = true; fadeEl.style.opacity = 1; }
    if (k > 12) {
      cine = null; fadeEl.style.opacity = 0; camera.rotation.order = 'YXZ';
      Object.assign(P, { x: 176, z: -22, y: 0, yaw: Math.PI / 2, pitch: 0.04 });
      try { document.exitPointerLock(); } catch (e) {}
      letterEl.style.display = 'flex'; document.getElementById('letterPhotos').textContent = '写真を広げています…';
      const lp = document.getElementById('letterPhotos'); photoCards(lp, 'letter'); makeOldPhotos(() => photoCards(lp, 'letter'));
    }
  } else if (cine.mode === 'depart') {   // 帰りの船: 乗船した時刻の空のまま、東京を背に島へ
    const turn = ease(k / 6);
    sh.a = Math.PI * (1 - turn); sh.z = -40 - 70 * turn; sh.x = 196 + (k > 4 ? 0.5 * Math.min(k - 4, 6) ** 2 + Math.max(0, k - 10) * 6 : 0);
    const ang = sh.a, lx = -48;                      // 船尾のデッキに立って街を振り返る
    avatar.visible = true;
    avatar.position.set(sh.x + lx * Math.cos(ang), -3.6 + 7, sh.z - lx * Math.sin(ang)); avatar.rotation.set(0, ang - Math.PI / 2, 0);
    for (const l of Object.values(AV)) l.rotation.x = 0;
    look(sh.x + 80 - k * 1.5, 16 + k * 0.6, sh.z + 34 + k, sh.x - 140, 22, sh.z - 10);
    if (k > 15 && !cine.faded) { cine.faded = true; fadeEl.style.opacity = 1; }
    if (k > 16.5) {
      cine = null; STORY.cleared = true; saveStory(); achieve('photo');
      try { document.exitPointerLock(); } catch (e) {}
      photoCards(document.getElementById('endPhotos'), 'end'); endingEl.style.display = 'flex';
    }
  }
}
document.getElementById('btnMore').onclick = () => {
  endingEl.style.display = 'none'; fadeEl.style.opacity = 0;
  const sh = SHIPS[0]; sh.x = 196; sh.z = -40; sh.a = Math.PI;
  Object.assign(P, { x: 176, z: -22, y: 0, vy: 0, yaw: Math.PI / 2 }); started = true; lockPointer();
};
document.getElementById('btnTitle').onclick = () => location.reload();
// 帰りの船へのタラップ
blk(186, 0, -33, 190, 0.3, -29.5, lam({ color: 0x9a968e }), false);
for (const x of [186.1, 189.9]) box(0.1, 1, 3.5, dark, x, 0.8, -31.2);

const clock = new THREE.Clock();
const dmy = new THREE.Object3D();
let areaTick = 0, chunkTick = 0;
function update(dt, t) {
  if (cine) updateCine(dt, t); else if (P.ride) updateRide(dt); else if (P.boat) updateBoatRide(dt); else {
  // --- プレイヤー
  if (keys.ArrowLeft) P.yaw += 1.9 * dt;
  if (keys.ArrowRight) P.yaw -= 1.9 * dt;
  const f = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
  const s = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
  const run = keys.ShiftLeft || keys.ShiftRight;
  const mx = -Math.sin(P.yaw) * f + Math.cos(P.yaw) * s, mz = -Math.cos(P.yaw) * f - Math.sin(P.yaw) * s;
  const ml = Math.hypot(mx, mz);
  P.climbing = false;
  const moving = ml > 0 && started && !albumOpen && !noteOpen;
  const ux = moving ? mx / ml : 0, uz = moving ? mz / ml : 0;
  if (moving) { P.heading = Math.atan2(mx, mz); P.anim += dt * (P.glider ? 3 : P.scooter ? 4 : run ? 13 : 9); }
  // 水平移動 (x, z を別々に判定して壁に沿って滑る)。登れる壁に当たったら true
  const tryMove = (dx, dz) => {
    let wall = false;
    if (dx) { const b = blockedAt(P.x + dx, P.z, P.y); if (!b) P.x += dx; else { wall = wall || b === 'wall'; P.svx = P.gvx = 0; } }
    if (dz) { const b = blockedAt(P.x, P.z + dz, P.y); if (!b) P.z += dz; else { wall = wall || b === 'wall'; P.svz = P.gvz = 0; } }
    return wall;
  };
  if (P.glider) {                      // ハンググライダー: ゆっくり降下しながら前へ滑空
    const tx = moving ? ux * 12 : Math.sin(P.heading) * 6, tz = moving ? uz * 12 : Math.cos(P.heading) * 6, a = Math.min(1, dt * 1.6);
    P.gvx += (tx - P.gvx) * a; P.gvz += (tz - P.gvz) * a;
    if (tryMove(P.gvx * dt, P.gvz * dt)) { P.glider = false; P.climbing = true; } // 壁にぶつかったら掴まる
  } else if (P.scooter) {              // 電動スクーター: 走りの2倍 (22m/s)。加速・惰性あり、壁は登らない
    const a = Math.min(1, dt * (moving ? 2.2 : 1.6));
    P.svx += ((moving ? ux * 22 : 0) - P.svx) * a; P.svz += ((moving ? uz * 22 : 0) - P.svz) * a;
    tryMove(P.svx * dt, P.svz * dt);
    P.wheel += Math.hypot(P.svx, P.svz) * dt / 0.22;
  } else if (moving) {
    const sp = run ? 11 : 4.5;
    if (tryMove(ux * sp * dt, uz * sp * dt)) { P.climbing = true; P.y += sp * 0.5 * dt; } // 壁に向かって歩く → 歩く速さの半分で「スイー」と登る
    else if (P.grounded) P.bob += dt * (run ? 13 : 9);
  }
  const fl = floorAt(P.x, P.z, P.y);
  if (P.climbing) { P.vy = 0; if (P.y < fl) P.y = fl; }
  else {
    if (keys.Space && P.grounded && started) P.vy = P.scooter ? 5.5 : 6.5;
    if (P.glider) P.vy += (-2.2 - P.vy) * Math.min(1, dt * 3);    // 落下速度を抑える
    else P.vy = Math.max(P.vy - 20 * dt, -55);                     // 屋上の端などから落下
    P.y += P.vy * dt;
    if (P.y <= fl) { P.y = fl; P.vy = 0; if (P.glider) { P.glider = false; toast('着地！'); if (inR([-280, -480, 220, -205], P.x, P.z)) achieve('glide'); } }
  }
  P.grounded = !P.climbing && P.vy === 0 && P.y <= fl + 1e-4;
  if (P.grounded) {
    if (fl < -0.5 && !onLand(P.x, P.z)) {   // 水に落ちたら最後に立っていた岸へ戻る (砂浜の波打ちぎわは陸)
      [P.x, P.z, P.y] = P.safe; P.vy = 0; P.svx = P.svz = 0; toast('ドボン！ 岸に戻りました');
    } else if (onLand(P.x, P.z)) P.safe = [P.x, P.z, P.y];
  }
  scene.fog.near = 60 + P.y * 0.5; scene.fog.far = 680 + P.y * 2;
  animateAvatar(dt, moving);
  updateCamera(dt, fl);
  }
  sky.position.copy(camera.position);
  updateStory(dt);

  // --- チャンクの表示切り替え・地面テクスチャのストリーミング
  if ((chunkTick -= dt) <= 0) {
    chunkTick = 0.25;
    const R = scene.fog.far + 300;
    for (const c of CHUNKS.values()) c.group.visible = Math.hypot(c.cx - camera.position.x, c.cz - camera.position.z) < R;
    for (const t of GTILES) { const v = Math.hypot(t.cx - camera.position.x, t.cz - camera.position.z) < R + 200; for (const m of t.meshes) m.visible = v; }
  }
  streamTiles(false);
  streamProc(dt);

  // --- 水面
  for (let i = 0; i < wPos.count; i++) {
    const x = wBase[i * 3], z = wBase[i * 3 + 2];
    wPos.array[i * 3 + 1] = Math.sin(x * 0.05 + t * 1.2) * 0.25 + Math.cos(z * 0.06 + t * 0.9) * 0.2;
  }
  wPos.needsUpdate = true;
  waterTex.offset.set(t * 0.004, t * 0.0025); riverTex.offset.set(t * 0.006, 0);

  updateFun(dt, t);
  // --- 東京モノレール (浜松町駅で停車 → 南へ)
  if (mono.wait > 0) mono.wait -= dt;
  else { mono.s += mono.dir * 20 * dt; if (mono.s > 1900) { mono.s = 1900; mono.dir = -1; mono.wait = 4; } if (mono.s < 30) { mono.s = 30; mono.dir = 1; mono.wait = 10; } }
  MONO_CARS.forEach((m, i) => m.position.set(MONO_X, 10.6, mono.s + i * 15.4));

  // --- 船・カモメ
  for (const sh of SHIPS) {
    sh.g.position.set(sh.x, -3.6 + Math.sin(t * 0.7 + sh.ph) * 0.25, sh.z);
    sh.g.rotation.set(Math.sin(t * 0.5 + sh.ph) * 0.012, sh.a, Math.sin(t * 0.6 + sh.ph) * 0.01);
  }
  { const a = t * 0.05, r = 150, x = 430 + Math.cos(a) * r, z = -120 + Math.sin(a) * r * 1.3;
    cruiser.position.set(x, -3.6 + Math.sin(t) * 0.2, z); cruiser.rotation.y = Math.atan2(-Math.cos(a) * r * 1.3, -Math.sin(a) * r); }
  for (const gl of GULLS) {
    const a = t * gl.sp + gl.ph;
    gl.m.position.set(gl.cx + Math.cos(a) * gl.r, gl.h + Math.sin(t * 0.7 + gl.ph) * 2, gl.cz + Math.sin(a) * gl.r);
    gl.m.rotation.y = Math.atan2(-Math.sin(a) * gl.sp, Math.cos(a) * gl.sp);
    gl.m.scale.y = Math.sin(t * 7 + gl.ph) * 1.2;
  }
  // --- 車
  CARS.forEach((c, i) => {
    const L = c.L; let mv = c.v * dt;
    for (const sp of L.stops) if (sp.red()) {   // 赤信号: 停止線 (前に車がいればその後ろ) で止まる
      const ahead = (sp.p - c.s) * L.dir;
      if (ahead > -0.5 && ahead < 45) { let q = 0; for (const o of L.cars) { const a2 = (sp.p - o.s) * L.dir; if (o !== c && a2 > -0.5 && a2 < ahead) q++; } mv = Math.min(mv, Math.max(0, ahead - q * 6.5 - 0.5)); }
    }
    c.s += L.dir * mv;
    if (c.s > L.b) c.s = L.a; if (c.s < L.a) c.s = L.b;
    if (L.ns) { dmy.position.set(L.c, L.y || 0, c.s); dmy.rotation.set(0, L.dir > 0 ? 0 : Math.PI, 0); }
    else { dmy.position.set(c.s, L.y || 0, L.c); dmy.rotation.set(0, L.dir > 0 ? Math.PI / 2 : -Math.PI / 2, 0); }
    const hide = (L.hoko && hokoActive()) || (L.hokoFn && L.hokoFn()); dmy.scale.setScalar(hide ? 0 : 1); dmy.updateMatrix();
    for (const m of carParts) m.setMatrixAt(i, dmy.matrix);
    if (c.taxi) andon.setMatrixAt(i, dmy.matrix);
  });
  andon.instanceMatrix.needsUpdate = true;
  // JRの列車
  updateTrains(dt);
  for (const m of carParts) m.instanceMatrix.needsUpdate = true;
  // --- 歩行者
  PEOPLE.forEach((pp, i) => {
    pp.t += pp.d * pp.v * dt; if (pp.t > 1) { pp.t = 1; pp.d = -1; } if (pp.t < 0) { pp.t = 0; pp.d = 1; }
    const [x0, z0, x1, z1] = pp.p;
    dmy.position.set(x0 + (x1 - x0) * pp.t, Math.abs(Math.sin(t * 7 + pp.ph)) * 0.06, z0 + (z1 - z0) * pp.t);
    dmy.rotation.set(0, Math.atan2((x1 - x0) * pp.d, (z1 - z0) * pp.d), 0); dmy.scale.setScalar((pp.hk && !hokoActive()) || (pp.hf && !pp.hf()) ? 0 : 1); dmy.updateMatrix();
    for (const m of pplParts) m.setMatrixAt(i, dmy.matrix);
  });
  for (const m of pplParts) m.instanceMatrix.needsUpdate = true;

  // --- HUD
  if ((areaTick -= dt) <= 0) {
    areaTick = 0.25;
    const a = areaAt(P.x, P.z, P.y);
    if (a !== curArea) {
      curArea = a; areaEl.textContent = '📍 ' + a;
      const isNew = started && !P.ride && !P.boat && discover(a);
      const nt = started ? noteFor(a.replace('（屋上）', '')) : null;   // 豆知識 (同じ場所は しばらく出さない)
      if (started) { bannerText.textContent = a; bannerSmall.textContent = isNew ? '★ NEW SPOT ★' : 'AREA'; noteEl.innerHTML = nt ? nt.html : ''; banner.style.opacity = 1; bannerTimer = (isNew ? 3.5 : 2.5) + (nt ? nt.sec : 0); }
    }
  }
  if (bannerTimer > 0 && (bannerTimer -= dt) <= 0) banner.style.opacity = 0;
  if (showMap) { mctx.fillStyle = '#2b5b78'; mctx.fillRect(0, 0, 170, 170); drawMini(P.x, P.z, P.yaw, dt); }
  if (showBig) drawBig(P.x, P.z, P.yaw, t);
  modeEl.textContent = P.glider ? '🪂 ハンググライダー (Space で閉じる)' : P.scooter ? `🛴 電動スクーター ${Math.round(Math.hypot(P.svx, P.svz) * 3.6)} km/h` : '';
  altEl.textContent = P.y > 0.6 ? (P.climbing ? '🧗 ' : '⬆ ') + P.y.toFixed(0) + 'm' : '';
  if (toastTimer > 0 && (toastTimer -= dt) <= 0) toastEl.style.opacity = 0;
  if (started && !albumOpen && !noteOpen && overlay.style.display === 'none') gameH = (gameH + dt * HOURS_PER_SEC) % 24;
  updateTime();
  updatePlayerLight();
}
function loop() {
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  update(dt, t);
  renderer.render(scene, camera);
  if (capReq) handleCapture();
  requestAnimationFrame(loop);
}
applySettings();
updateDiscUI();
renderAch();
if (STORY.begun) document.getElementById('btnCont').style.display = 'inline-block';
camera.position.set(P.x, 1.6, P.z);
streamTiles(true);
loop();
