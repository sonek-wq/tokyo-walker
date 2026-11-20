/* ============================================================
   山手線の高架 (環) と 全30駅 / 列車 (山手線・京浜東北線・東海道新幹線)
   ============================================================ */
const onStraight = (x, z) => inR([JR[0] - 3, JR[1] - 2, JR[2] + 3, JR[3] + 2], x, z);
// 東側 (品川〜田端) は京浜東北線・新幹線と並走するので高架の幅が広い
const EAST = [STN[24].s, STN[8].s + RING_LEN], SHINK = [STN[24].s, STN[0].s + RING_LEN];
const inRange = (s, R) => { let u = wrapS(s); if (u < R[0]) u += RING_LEN; return u >= R[0] && u <= R[1]; };
const deckHalf = s => inRange(s, EAST) ? 17 : 7;
{
  const STEP = 8, M = { deck: [], par: [], bed: [], pil: [] }, o = new THREE.Object3D();
  const put = (arr, x, y, z, ang, sx, sy, sz) => { o.position.set(x, y, z); o.rotation.set(0, ang, 0); o.scale.set(sx, sy, sz); o.updateMatrix(); arr.push(o.matrix.clone()); };
  for (let s = 0; s < RING_LEN; s += STEP) {
    const q = ringAt(s + STEP / 2); if (onStraight(q.x, q.z)) continue;
    const h = deckHalf(s), w = h * 2;
    put(M.deck, q.x, 5.6, q.z, q.ang, w, 0.8, STEP + 0.3);
    for (const sd of [-1, 1]) put(M.par, q.x + q.nx * sd * (h - 0.2), 6.6, q.z + q.nz * sd * (h - 0.2), q.ang, 0.3, 1.2, STEP + 0.3);
    for (const lat of h > 10 ? [-14, -4, 4, 14] : [-4, 4]) put(M.bed, q.x + q.nx * lat, 6.03, q.z + q.nz * lat, q.ang, 2.6, 0.08, STEP + 0.3);
    const hx = Math.abs(q.tx) * STEP / 2 + Math.abs(q.nx) * h, hz = Math.abs(q.tz) * STEP / 2 + Math.abs(q.nz) * h;
    solid(q.x - hx, q.z - hz, q.x + hx, q.z + hz, 5.2, 6);
    if (Math.round(s / STEP) % 3 === 0) for (const lat of h > 10 ? [-11, 0, 11] : [0]) {
      const px = q.x + q.nx * lat, pz = q.z + q.nz * lat; put(M.pil, px, 2.6, pz, q.ang, 1.8, 5.2, 1.8); solid(px - 0.9, pz - 0.9, px + 0.9, pz + 0.9, 0, 5.2);
    }
  }
  const inst = (list, mat) => { const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat, list.length); list.forEach((x, i) => m.setMatrixAt(i, x)); scene.add(m); };
  inst(M.deck, concrete); inst(M.par, lam({ color: 0xb4b0a6 })); inst(M.bed, lam({ color: 0x4e4840 })); inst(M.pil, concrete);
}
// ---- 駅
const STN_RES = [];   // 自動生成の街で建物を置かない場所 (駅舎・駅前広場)
function stationSignTex(st) {   // 駅名標
  const prev = STN[(st.no + 28) % 30], next = STN[st.no % 30];
  return tex(256, 96, x => {
    x.fillStyle = '#f8f8f4'; x.fillRect(0, 0, 256, 96); x.fillStyle = '#80c241'; x.fillRect(0, 0, 256, 6);
    x.fillStyle = '#80c241'; x.fillRect(0, 70, 256, 26); x.fillStyle = '#222';
    x.strokeStyle = '#80c241'; x.lineWidth = 3; x.strokeRect(10, 18, 36, 42); x.textAlign = 'center';
    x.font = 'bold 11px sans-serif'; x.fillText('JY', 28, 32); x.font = 'bold 18px sans-serif'; x.fillText(st.code.slice(2), 28, 53);
    x.font = '11px "DotGothic16", sans-serif'; x.fillText(st.kana, 140, 18);
    x.font = `bold ${st.name.length > 5 ? 20 : 30}px "DotGothic16", sans-serif`; x.fillText(st.name, 140, 48);
    x.font = '11px sans-serif'; x.fillText(st.roma, 140, 63);
    x.fillStyle = '#fff'; x.font = '12px "DotGothic16", sans-serif';
    x.textAlign = 'left'; x.fillText('◀ ' + prev.name, 6, 87); x.textAlign = 'right'; x.fillText(next.name + ' ▶', 250, 87);
  });
}
{
  const M = { plat: [], roof: [], post: [], edge: [] }, o = new THREE.Object3D();
  const put = (arr, x, y, z, ang, sx, sy, sz) => { o.position.set(x, y, z); o.rotation.set(0, ang, 0); o.scale.set(sx, sy, sz); o.updateMatrix(); arr.push(o.matrix.clone()); };
  const signFrame = lam({ color: 0x5a5e64 });
  for (const st of STN) {
    const p = ringAt(st.s), h = deckHalf(st.s); st.p = p; st.straight = onStraight(p.x, p.z);
    for (let k = -100; k < 100; k += 10) {      // 島式ホーム (2本の山手線の間)
      const q = ringAt(st.s + k + 5);
      put(M.plat, q.x, 6.55, q.z, q.ang, 4.6, 1.1, 10.2);
      for (const sd of [-1, 1]) put(M.edge, q.x + q.nx * sd * 2.05, 7.11, q.z + q.nz * sd * 2.05, q.ang, 0.3, 0.02, 10.2);   // 点字ブロック
      const hx = Math.abs(q.tx) * 5 + Math.abs(q.nx) * 2.3, hz = Math.abs(q.tz) * 5 + Math.abs(q.nz) * 2.3;
      solid(q.x - hx, q.z - hz, q.x + hx, q.z + hz, 6, 7.1);
      if (k >= -80 && k < 80) { put(M.roof, q.x, 11.3, q.z, q.ang, 7, 0.3, 10.2); if (k % 20 === 0) put(M.post, q.x, 9.2, q.z, 0, 0.3, 4.2, 0.3); }
    }
    for (const k of [-45, 45]) {                    // 駅名標
      const q = ringAt(st.s + k), sm = lam({ map: stationSignTex(st), side: THREE.DoubleSide });
      const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.35), sm); b.position.set(q.x, 8.6, q.z); b.rotation.y = q.ang + Math.PI / 2; chunkAt(q.x, q.z).group.add(b);
      for (const sd of [-1.6, 1.6]) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 0.1), signFrame); m.position.set(q.x + q.tx * sd, 7.85, q.z + q.tz * sd); chunkAt(q.x, q.z).group.add(m); }
    }
    if (st.straight) { st.ent = st.ent || [st.x - 40, st.z]; if (st.build) st.build(st); continue; }
    // 駅舎 (外側) と駅前広場
    const ew = Math.abs(p.tx) > Math.abs(p.tz), w = ew ? 44 : 22, d = ew ? 22 : 44, depth = (Math.abs(p.nx) > Math.abs(p.nz) ? w : d) / 2;
    const cx = p.x + p.nx * (h + 8 + depth), cz = p.z + p.nz * (h + 8 + depth);
    const bR = [cx - w / 2, cz - d / 2, cx + w / 2, cz + d / 2];
    addBuilding(...bR, 11, 'station', { noRoofBox: true });
    const ft = textTex('JR ' + st.name + '駅', '#2f7a3a', '#ffffff', 256, 36);
    const fm = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(18, w - 2), 2.6), glow(lam({ map: ft }), 0xffffff, 0.8));
    const off = (Math.abs(p.nx) > Math.abs(p.nz) ? w : d) / 2 + 0.12;
    fm.position.set(cx + Math.sign(p.nx) * (Math.abs(p.nx) > Math.abs(p.nz) ? off : 0), 8.8, cz + Math.sign(p.nz) * (Math.abs(p.nx) > Math.abs(p.nz) ? 0 : off));
    fm.rotation.y = Math.abs(p.nx) > Math.abs(p.nz) ? Math.sign(p.nx) * Math.PI / 2 : (p.nz > 0 ? 0 : Math.PI); chunkAt(cx, cz).group.add(fm);
    const plz = Math.abs(p.nx) > Math.abs(p.nz)
      ? [Math.sign(p.nx) > 0 ? bR[2] : bR[0] - 30, cz - 22, Math.sign(p.nx) > 0 ? bR[2] + 30 : bR[0], cz + 22]
      : [cx - 22, Math.sign(p.nz) > 0 ? bR[3] : bR[1] - 30, cx + 22, Math.sign(p.nz) > 0 ? bR[3] + 30 : bR[1]];
    tiles(...plz, '#b8b0a2', '#a39a8c', 3);
    st.ent = [(plz[0] + plz[2]) / 2, (plz[1] + plz[3]) / 2];
    STN_RES.push([bR[0] - 3, bR[1] - 3, bR[2] + 3, bR[3] + 3], plz);
    SPOT_AREAS.push([st.name + '駅', Math.min(bR[0], plz[0]) - 10, Math.min(bR[1], plz[1]) - 10, Math.max(bR[2], plz[2]) + 10, Math.max(bR[3], plz[3]) + 10]);
    for (let k = 0; k < 4; k++) ROUND.push([plz[0] + 4 + k * ((plz[2] - plz[0] - 8) / 3), plz[1] + 3, 0.9]);
    if (st.build) st.build(st);   // 駅ごとの作り込み (stations/ のファイルで定義)
  }
  const inst = (list, mat) => { const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat, list.length); list.forEach((x, i) => m.setMatrixAt(i, x)); scene.add(m); };
  inst(M.plat, lam({ color: 0xa8a49c })); inst(M.roof, lam({ color: 0xdfe4e8 })); inst(M.post, white); inst(M.edge, lam({ color: 0xe8c020 }));
}
// ---- 列車
function trainMats(body, band, band2) {
  const side = tex(32, 8, x => { x.fillStyle = body; x.fillRect(0, 0, 32, 8); x.fillStyle = '#2a3440'; for (let i = 1; i < 31; i += 4) x.fillRect(i, 1, 3, 3); x.fillStyle = band; x.fillRect(0, 5, 32, 1); if (band2) { x.fillStyle = band2; x.fillRect(0, 6, 32, 1); } });
  const sideE = tex(32, 8, x => { x.fillStyle = '#000'; x.fillRect(0, 0, 32, 8); x.fillStyle = '#fff4d8'; for (let i = 1; i < 31; i += 4) x.fillRect(i, 1, 3, 3); });
  const m = lam({ map: side, emissive: 0xffffff, emissiveMap: sideE, emissiveIntensity: 0 }); GLOW.push([m, 1]);
  return [m, m, lam({ color: 0xb8bcc0 }), lam({ color: 0xb8bcc0 }), lam({ color: 0x2a3036 }), lam({ color: 0x2a3036 })];
}
// 山手線: 内回り (JY番号が増える向き・内側の線路) / 外回り 各8編成。駅ごとに停車する
const Y_CAR = 20, Y_N = 11, Y_DWELL = 12, Y_PER = 12;
const YAMA = [];
for (const dir of [1, -1]) for (let k = 0; k < Y_PER; k++) YAMA.push({ dir, s: wrapS((k + (dir < 0 ? 0.5 : 0)) / Y_PER * RING_LEN), v: 14, dwell: 0, at: null, lat: dir > 0 ? -4 : 4, name: dir > 0 ? '内回り' : '外回り', ann: null });
const yInst = new THREE.InstancedMesh(new THREE.BoxGeometry(2.9, 3.4, Y_CAR - 0.6), trainMats('#c8ccd0', '#80c241'), YAMA.length * Y_N);
yInst.instanceMatrix.setUsage(THREE.DynamicDrawUsage); yInst.frustumCulled = false; scene.add(yInst);
function nextStation(tr) {
  let best = null, bd = Infinity;
  for (const st of STN) { const d = wrapS(tr.dir * (st.s - tr.s)); if (d > 1e-3 && d < bd) { bd = d; best = st; } }
  return [best, bd];
}
// 京浜東北線 (東側を並走) / 東海道新幹線 (品川〜東京)
const JR_TRAINS = [
  { name: '京浜東北線', lat: -14, R: EAST, dir: 1, v: 18, n: 10, len: 20, mats: trainMats('#c8ccd0', '#00b2e5') },
  { name: '京浜東北線', lat: -14, R: EAST, dir: -1, v: 18, n: 10, len: 20, mats: null },
  { name: '東海道新幹線', lat: 14, R: SHINK, dir: 1, v: 32, n: 16, len: 25, mats: trainMats('#f4f4f2', '#1a3aa0', '#1a3aa0') },
];
JR_TRAINS[1].mats = JR_TRAINS[0].mats;
for (const tr of JR_TRAINS) {
  tr.u = rr(tr.R[0], tr.R[1]); tr.head = [0, 0];
  tr.inst = new THREE.InstancedMesh(new THREE.BoxGeometry(2.9, 3.4, tr.len - 0.6), tr.mats, tr.n); tr.inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage); tr.inst.frustumCulled = false; scene.add(tr.inst);
}
let annTimer = 0;
function updateTrains(dt) {
  const o = dmy; let k = 0;
  for (const tr of YAMA) {
    if (tr.dwell > 0) { tr.dwell -= dt; }
    else {
      const [st, dist] = nextStation(tr);
      const vt = Math.min(22, Math.sqrt(2 * 1.2 * dist) + 0.4);
      tr.v = Math.min(vt, tr.v + 1.2 * dt);
      const ds = Math.min(tr.v * dt, dist);
      tr.s = wrapS(tr.s + tr.dir * ds); tr.at = null;
      if (dist - ds < 0.05) { tr.s = st.s; tr.v = 0; tr.dwell = Y_DWELL; tr.at = st; }
      if (P.ride && P.ride.tr === tr && dist < 260 && tr.ann !== st) { tr.ann = st; toast(`🚃 まもなく ${st.name} (${st.code})`); }
    }
    for (let i = 0; i < Y_N; i++) {
      const q = ringAt(tr.s + (i - (Y_N - 1) / 2) * Y_CAR);
      o.position.set(q.x + q.nx * tr.lat, 7.8, q.z + q.nz * tr.lat); o.rotation.set(0, q.ang, 0); o.scale.set(1, 1, 1); o.updateMatrix(); yInst.setMatrixAt(k++, o.matrix);
    }
  }
  yInst.instanceMatrix.needsUpdate = true;
  for (const tr of JR_TRAINS) {
    tr.u += tr.dir * tr.v * dt;
    if (tr.u > tr.R[1]) tr.u = tr.R[0]; if (tr.u < tr.R[0]) tr.u = tr.R[1];
    for (let i = 0; i < tr.n; i++) {
      const u = tr.u - tr.dir * i * tr.len, q = ringAt(u), hide = u < tr.R[0] || u > tr.R[1];
      o.position.set(q.x + q.nx * tr.lat, 7.8, q.z + q.nz * tr.lat); o.rotation.set(0, q.ang, 0); o.scale.setScalar(hide ? 0 : 1); o.updateMatrix(); tr.inst.setMatrixAt(i, o.matrix);
      if (i === 0) tr.head = [o.position.x, o.position.z];
    }
    tr.inst.instanceMatrix.needsUpdate = true;
  }
}
// ---- 乗車
function updateRide(dt) {
  const tr = P.ride.tr, q = ringAt(tr.s + P.ride.off);
  P.x = q.x + q.nx * tr.lat; P.z = q.z + q.nz * tr.lat; P.y = 6.15; P.vy = 0; P.grounded = true; P.climbing = false; P.scooter = P.glider = false;
  if (SET.view === 0) {   // 一人称: 先頭車両からの前面展望 (← → で見回す)
    if (keys.ArrowLeft) P.rideOrb = Math.min(1.4, (P.rideOrb || 0) + 1.5 * dt); if (keys.ArrowRight) P.rideOrb = Math.max(-1.4, (P.rideOrb || 0) - 1.5 * dt);
    const h = ringAt(tr.s + tr.dir * ((Y_N - 1) / 2 * Y_CAR + Y_CAR / 2 + 0.3)), ty = Math.atan2(-h.tx * tr.dir, -h.tz * tr.dir) + (P.rideOrb || 0);
    avatar.visible = blob.visible = false; P.yaw = ty;
    camera.position.set(h.x + h.nx * tr.lat, 8.9, h.z + h.nz * tr.lat); camera.rotation.set(-0.04, ty, 0);
    return rideHud(tr);
  }
  // 三人称: 電車を斜め後ろから追いかけるカメラ (← → で回り込む)
  if (keys.ArrowLeft) P.rideOrb = (P.rideOrb || 0) + 1.5 * dt; if (keys.ArrowRight) P.rideOrb = (P.rideOrb || 0) - 1.5 * dt;
  const fx = q.tx * tr.dir, fz = q.tz * tr.dir, ty = Math.atan2(-fx, -fz) + (P.rideOrb || 0);
  P.yaw = ty; avatar.visible = blob.visible = false;
  const dist = VIEWS[SET.view].dist * 3 + 12, cx = P.x + Math.sin(ty) * dist, cz = P.z + Math.cos(ty) * dist;
  rideCam.lerp(camTarget.set(cx, P.y + 5 + dist * 0.35, cz), Math.min(1, dt * 4));
  camera.position.copy(rideCam); camera.lookAt(P.x - Math.sin(ty) * 14, P.y + 3, P.z - Math.cos(ty) * 14);
  rideHud(tr);
}
const rideCam = new THREE.Vector3();
function rideHud(tr) {
  const [st] = nextStation(tr);
  modeEl.textContent = `🚃 山手線 ${tr.name}　` + (tr.dwell > 0 ? `${tr.at.name}駅に停車中` : `次は ${st.name} (${st.code})`);
}
function stationAction() {   // E キー: 駅・電車まわりの操作。何もしなければ false
  if (P.ride) {
    const tr = P.ride.tr;
    if (tr.dwell > 0.5) { const q = ringAt(tr.s + P.ride.off); P.ride = null; Object.assign(P, { x: q.x, z: q.z, y: 7.1, vy: 0 }); toast(`🚉 ${tr.at.name}駅で降りた`); }
    else toast('走行中は降りられない');
    return true;
  }
  const rn = ringNearest(P.x, P.z);
  if (rn && rn.d < 2.6 && P.y > 6.5 && P.y < 8.5) {
    const st = stationAtS(rn.s);
    if (st) {
      const look = -Math.sin(P.yaw) * ringAt(rn.s).nx - Math.cos(P.yaw) * ringAt(rn.s).nz;   // 見ている側の電車に乗る
      const cand = Math.abs(look) > 0.45 ? YAMA.filter(t => t.dwell > 1 && t.at === st && Math.sign(t.lat) === Math.sign(look)) : [];
      if (cand.length) {
        const tr = cand[0]; P.ride = { tr, off: Math.max(-100, Math.min(100, sDiff(rn.s, tr.s))) };
        rideCam.copy(camera.position); P.rideOrb = 0;
        toast(`🚃 山手線 ${tr.name}に乗った (停車中に E で降りる)`); return true;
      }
      Object.assign(P, { x: st.ent[0], z: st.ent[1], y: 0, vy: 0 }); toast(`🚉 ${st.name}駅の改札を出た`); return true;
    }
  }
  if (P.y < 3) for (const st of STN) if (Math.hypot(P.x - st.ent[0], P.z - st.ent[1]) < 26) {
    const q = ringAt(st.s); Object.assign(P, { x: q.x, z: q.z, y: 7.1, vy: 0, yaw: q.ang + Math.PI, scooter: false });
    toast(`🚉 ${st.name}駅のホーム (電車が止まったら、乗りたい側を向いて E)`); toastTimer = 4; return true;
  }
  return false;
}
function stationPrompt() {
  if (P.ride) return P.ride.tr.dwell > 0.5 ? 'E　電車を降りる' : '';
  const rn = ringNearest(P.x, P.z);
  if (rn && rn.d < 2.6 && P.y > 6.5 && P.y < 8.5 && stationAtS(rn.s)) {
    const st = stationAtS(rn.s), q = ringAt(rn.s), look = -Math.sin(P.yaw) * q.nx - Math.cos(P.yaw) * q.nz;
    const t = Math.abs(look) > 0.45 && YAMA.find(t => t.dwell > 1 && t.at === st && Math.sign(t.lat) === Math.sign(look));
    return t ? `E　電車に乗る (${t.name}・${nextStation(t)[0].name}方面)` : 'E　改札を出る';
  }
  if (P.y < 3) for (const st of STN) if (Math.hypot(P.x - st.ent[0], P.z - st.ent[1]) < 26) return `E　${st.name}駅のホームへ`;
  return '';
}

