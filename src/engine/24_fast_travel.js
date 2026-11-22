/* ファストトラベル (テストプレイ用): F キーで駅の一覧を開き、選んだ駅へ一瞬で移動する
   山手線の駅は駅前広場 (st.ent)、ほかの路線・ゆりかもめ・水上バスは乗り場 (STOPS の land) に出る */
const ftWrap = document.getElementById('ftravel'), ftList = document.getElementById('ftList'), ftQ = document.getElementById('ftQ');
let ftOpen = false, FT_ITEMS = null;
function ftBuild() {   // 行き先の一覧 (路線ごと)。作り込み済みかどうかは、まわりの名所ラベルの数で見る
  const groups = [], face = (x, z, tx, tz) => Math.atan2(-(tx - x), -(tz - z));
  const near = (x, z) => SPOT_AREAS.filter(s => typeof s[1] === 'number' && s.length >= 5 && Math.hypot((s[1] + s[3]) / 2 - x, (s[2] + s[4]) / 2 - z) < 380).length;
  const done = (x, z) => near(x, z) >= 6;
  groups.push(['🟢 山手線', STN.map(st => {
    const [x, z] = st.ent; return { name: st.name, x, z, yaw: face(x, z, st.x, st.z), done: done(x, z), msg: `🚀 ${st.name}駅 (山手線 ${st.code}) へ移動した` };
  })]);
  for (const ln of TR_LINES) {
    const items = ln.stops.map(n => {
      const sp = STOPS[stopKey(ln, n)], [x, z] = sp.land;
      return { name: n, x, z, yaw: face(x, z, ...sp.dock), done: done(x, z), msg: `🚀 ${sp.label}へ移動した` };
    });
    groups.push([`${lineIcon(ln)} ${lineLabel(ln)}`, items]);
  }
  return groups;
}
function ftRender() {
  const q = ftQ.value.trim(); ftList.textContent = ''; let first = null;
  for (const [title, items] of FT_ITEMS) {
    const hit = items.filter(it => !q || it.name.includes(q)); if (!hit.length) continue;
    const g = document.createElement('div'); g.className = 'grp'; g.textContent = title; ftList.appendChild(g);
    const row = document.createElement('div');
    for (const it of hit) {
      const b = document.createElement('button'); b.className = 'st' + (it.done ? ' done' : ''); b.textContent = it.name;
      b.onclick = () => ftGo(it); row.appendChild(b); if (!first) { first = it; if (q) b.classList.add('first'); }
    }
    ftList.appendChild(row);
  }
  return first;
}
function toggleFastTravel() {
  if (!started || cine) return;
  ftOpen = !ftOpen; ftWrap.style.display = ftOpen ? 'flex' : 'none';
  if (ftOpen) {
    if (showBig) { showBig = false; bigWrap.style.display = 'none'; }
    FT_ITEMS = FT_ITEMS || ftBuild(); ftQ.value = ''; ftRender(); ftList.scrollTop = 0;
    try { document.exitPointerLock(); } catch (e) {}
    for (const k in keys) keys[k] = false;
    setTimeout(() => ftQ.focus(), 0);
  } else { ftQ.blur(); lockPointer(); }
}
function ftGo(it) {
  toggleFastTravel();
  if (P.ride) P.ride = null; if (P.boat) P.boat = null;
  Object.assign(P, { glider: false, scooter: false, climbing: false, svx: 0, svz: 0 });
  lmWarp(it.x, floorAt(it.x, it.z, 1), it.z, it.yaw, it.msg);
}
// 開いている間は、ゲームのキー操作より先に受け取る (駅名を打てるように)
addEventListener('keydown', e => {
  if (!ftOpen) {
    if (e.code === 'KeyF' && !e.repeat && !albumOpen && !noteOpen && overlay.style.display === 'none') { toggleFastTravel(); e.preventDefault(); e.stopPropagation(); }
    return;
  }
  e.stopPropagation();
  if (e.code === 'Escape' || (e.code === 'KeyF' && e.target !== ftQ)) { toggleFastTravel(); e.preventDefault(); }
  else if (e.code === 'Enter' && !e.isComposing) { const f = ftRender(); if (f) ftGo(f); e.preventDefault(); }
}, true);
ftQ.addEventListener('input', ftRender);
ftWrap.addEventListener('click', e => { if (e.target === ftWrap) toggleFastTravel(); });
// Esc で閉じたときはブラウザがマウスの固定を許さないことがあるので、画面をクリックしたら固定し直す
canvas.addEventListener('click', () => { if (started && !document.pointerLockElement && !ftOpen && !showBig && !noteOpen && !albumOpen && !cine && overlay.style.display === 'none') lockPointer(); });
