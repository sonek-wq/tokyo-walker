/* ============================================================
   木 (インスタンシング)
   ============================================================ */
const free = (x, z, m = 1.5) => WALK.some(r => inR(r, x, z)) && !inR(JR, x, z, 1) &&
  ![...query(x - m, z - m, x + m, z + m)].some(r => inR(r, x, z, m)) &&
  !ROADS.some(r => inR(r, x, z, 0.5)) && !PONDS.some(p => inE([p[0], p[1], p[2] + 3, p[3] + 3], x, z));
const scatter = (n, x0, z0, x1, z1, pineRatio, skip = () => false) => {
  for (let i = 0; i < n; i++) {
    const x = rr(x0, x1), z = rr(z0, z1);
    if (!skip(x, z) && free(x, z)) (rnd() < pineRatio ? PINES : ROUND).push([x, z, rr(0.8, 1.5)]);
  }
};
// 浜離宮・旧芝離宮
scatter(380, -270, -470, 210, -214, 0.65, (x, z) => Math.abs(Math.hypot((x - 30) / 100, (z + 330) / 75) - 1) < 0.06 || (Math.abs(x - 36) < 4 && z > -258) || (Math.abs(z + 335) < 5 && x < -68));
PINES.push([-252, -326, 2.2]); // 三百年の松
scatter(120, -398, 154, -268, 314, 0.5, (x, z) => Math.abs(Math.hypot((x + 333) / 55, (z - 234) / 45) - 1) < 0.08);
// 芝公園・増上寺・東京タワー周辺
scatter(300, -1432, -472, -1138, -176, 0.45, (x, z) => Math.abs(Math.hypot((x + 1290) / 110, (z + 300) / 90) - 1) < 0.05 || Math.abs(x + 1290) < 4 || Math.abs(z + 300) < 4 || Math.abs(z + 414) < 9 || inR(SHRINE2, x, z, 2) || Math.hypot(x + 1270, z + 285) < 30);
scatter(90, -1672, -176, -1460, -4, 0.4, (x, z) => Math.abs(Math.hypot((x + 1566) / 70, (z + 90) / 55) - 1) < 0.07 || Math.hypot((x + 1566) / 50, (z + 90) / 36) < 1);
for (let x = -1670; x < -490; x += 16) if (free(x, 281, 1)) ROUND.push([x, 281, 1]); // 河畔の並木
const JIZO = [-1424, 26, -1336, 58];
scatter(140, -1432, -144, -1138, 124, 0.6, (x, z) => inR([-1424, -136, -1134, 18], x, z) || inR(JIZO, x, z, 2));
scatter(60, -1432, 156, -1138, 252, 0.4, (x, z) => Math.abs(x + 1255) < 5);
for (let x = -1660; x < -1460; x += 16) for (const z of [-398, -186]) if (free(x, z, 1)) ROUND.push([x, z, 1]);
// 街路樹 (全道路の両側)。色は現実の季節で変わる
const STREET = [], WILLOWS = [];
for (const [x0, z0, x1, z1, d] of ROADS) {
  const put = (x, z) => { if (!free(x, z, 0.8)) return; (inR([-428, -1080, 60, -820], x, z) ? WILLOWS : STREET).push([x, z, 0.9]); }; // 銀座は柳並木
  if (d === 'ns') { for (let z = z0 + 8; z < z1; z += 18) for (const x of [x0 - 2, x1 + 2]) put(x, z); }
  else { for (let x = x0 + 8; x < x1; x += 18) for (const z of [z0 - 2, z1 + 2]) put(x, z); }
}
for (let z = -160; z < 316; z += 18) if (free(124, z, 0.5)) ROUND.push([124, z, 0.9]);
scatter(30, -145, 60, -40, 125, 0);
scatter(14, 30, 0, 110, 50, 0);

const trunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 3, 5).translate(0, 1.5, 0);
// 宙に浮いた木・水の上の木をなくす: 高さつきの木 (屋上・テラス・築山) はその場所の床の高さにそろえ、
// 地面の木で水の上にあるもの (池・川・お濠) は植えない
const floorHere = (x, z, y) => {   // (engine/18_player.js の floorAt と同じ考え方。木や街灯を置く高さを決める)
  let f = onLand(x, z) ? groundY(x, z) : -1.4;
  for (const s of query(x - 0.3, z - 0.3, x + 0.3, z + 0.3)) if (s[5] <= y + 0.45 && s[5] > f && inR(s, x, z, 0.3)) f = s[5];
  return f;
};
function settleTrees(list) {
  const keep = [];
  for (const t of list) {
    const [x, z, , h] = t;
    if (h) { const f = floorHere(x, z, h + 0.5); if (f < -0.5) continue; t[3] = f > 0.05 ? f : 0; }
    else if (!onLand(x, z) && floorHere(x, z, 0.5) < 0) continue;
    keep.push(t);
  }
  list.length = 0; list.push(...keep);
}
function plant(list, crownGeo, colors, matOpt = {}) {
  settleTrees(list);
  const dummy = new THREE.Object3D(), trunk = new THREE.InstancedMesh(trunkGeo, lam({ color: 0x5a4430 }), list.length);
  const crown = new THREE.InstancedMesh(crownGeo, lam({ color: 0xffffff, ...matOpt }), list.length);
  list.forEach(([x, z, s], i) => {
    dummy.position.set(x, list[i][3] || 0, z); dummy.scale.setScalar(s); dummy.rotation.y = rr(0, 6); dummy.updateMatrix();
    trunk.setMatrixAt(i, dummy.matrix); crown.setMatrixAt(i, dummy.matrix);
    crown.setColorAt(i, new THREE.Color(pick(typeof colors === 'function' ? colors(x, z) : colors)).multiplyScalar(rr(0.8, 1.15)));
    const ty = list[i][3] || 0; solid(x - 0.5 * s, z - 0.5 * s, x + 0.5 * s, z + 0.5 * s, ty, ty + 6.8 * s, true);
  });
  scene.add(trunk, crown);
}
// ---- 木の色は季節では変えず、場所ごとに決める: 緑が映える場所は緑、紅葉や黄葉が映える場所は紅葉・黄葉
const GREEN = ['#4f8a38', '#5f9a40', '#3f7a32', '#58923c'];
const KOUYOU = ['#c8402a', '#d8602a', '#b83020', '#e08a30', '#e0b038'];   // 紅葉 (赤・橙・黄が混ざる)
const ICHOU = ['#e8c040', '#d8b030', '#f0d050', '#e0b838'];               // イチョウの黄葉
// [名所の名前, 'momiji' (紅葉) | 'ichou' (黄葉), 園内の丸い木を色づかせる割合, 街路樹まで含める範囲の広げ方 (m)]
// ここに無い場所は緑のまま (明治神宮の森・代々木公園・表参道やけやき坂のケヤキ並木など)
const FOLIAGE = [
  ['六義園', 'momiji', 0.6, 0], ['小石川後楽園', 'momiji', 0.6, 0], ['旧古河庭園', 'momiji', 0.5, 0], ['肥後細川庭園', 'momiji', 0.6, 0],
  ['椿山荘の庭園', 'momiji', 0.5, 0], ['目白庭園', 'momiji', 0.6, 0], ['池田山公園', 'momiji', 0.6, 0], ['根津美術館の庭園', 'momiji', 0.6, 0],
  ['八芳園の庭園', 'momiji', 0.5, 0], ['旧安田庭園', 'momiji', 0.5, 0], ['清澄庭園', 'momiji', 0.35, 0], ['日本庭園', 'momiji', 0.6, 0],
  ['二の丸庭園', 'momiji', 0.5, 0], ['北の丸公園', 'momiji', 0.4, 0], ['有栖川宮記念公園', 'momiji', 0.45, 0], ['東京都庭園美術館', 'momiji', 0.4, 0],
  ['大隈庭園', 'momiji', 0.4, 0], ['おとめ山公園', 'momiji', 0.45, 0], ['小石川植物園', 'momiji', 0.3, 0], ['殿ヶ谷戸庭園', 'momiji', 0.5, 0],
  ['行幸通り', 'ichou', 1, 6], ['銀杏並木 (東大)', 'ichou', 1, 6], ['東京大学 本郷キャンパス', 'ichou', 0.35, 20], ['明治神宮外苑', 'ichou', 0.3, 20],
  ['国会議事堂', 'ichou', 0.5, 40], ['国会前庭 (北庭)', 'ichou', 0.4, 12], ['国会前庭 (南庭)', 'ichou', 0.4, 12], ['日比谷公園', 'ichou', 0.25, 0],
];
const FOL_R = [];
for (const [n, mode, p, pad] of FOLIAGE) for (const a of SPOT_AREAS) if (a[0] === n) FOL_R.push([a[1], a[2], a[3], a[4], mode, p, pad]);
const folAt = (x, z, street) => FOL_R.find(r => inR(r, x, z, street ? r[6] : 0));
const streetColors = (x, z) => { const f = folAt(x, z, true); return !f ? GREEN : f[4] === 'ichou' ? ICHOU : hash2((x * 7) | 0, (z * 7) | 0) < f[5] ? KOUYOU : GREEN; };   // 同じ場所はいつも同じ色
// 紅葉・黄葉の名所の中の丸い木は、割合に応じてモミジやイチョウに植えかえる
{ const keep = []; for (const t of ROUND) { const f = folAt(t[0], t[1]); if (f && rnd() < f[5]) (f[4] === 'ichou' ? GINKGO : MAPLES).push(t); else keep.push(t); } ROUND.length = 0; ROUND.push(...keep); }
plant(PINES, new THREE.ConeGeometry(2.8, 4.2, 6).translate(0, 4.6, 0), ['#2f5a2a', '#3a6630', '#28502a']);
plant(ROUND, new THREE.IcosahedronGeometry(2.3, 0).translate(0, 4.6, 0), GREEN);
plant(MAPLES, new THREE.IcosahedronGeometry(2.3, 0).translate(0, 4.6, 0), KOUYOU);
plant(GINKGO, new THREE.ConeGeometry(3, 6, 7).translate(0, 5.4, 0), ICHOU);
STREET.push(...LM_STREET);
plant(STREET, new THREE.IcosahedronGeometry(2.3, 0).translate(0, 4.6, 0), streetColors);
// 桜は花見の名所にだけ植えているので、いつも満開にする
const SAKURA_PINK = ['#f6c4d4', '#f0b0c6', '#fad4e0', '#f4bccc', '#fbe2ea'];
plant(SAKURA, new THREE.IcosahedronGeometry(2.5, 0).scale(1.25, 0.8, 1.25).translate(0, 4.4, 0), SAKURA_PINK, { emissive: 0x40242c });   // 影になる面も桜色に見えるよう、少し自分で光らせる
// しだれ桜: 枝が垂れ下がった釣り鐘のような形
// しだれ桜: 丸い樹冠から、花のついた枝が滝のように垂れ下がる
const SHIDARE_GEO = (() => {
  const parts = [new THREE.IcosahedronGeometry(2.4, 0).scale(1.3, 0.7, 1.3).translate(0, 5.6, 0)];
  for (let k = 0; k < 16; k++) {
    const a = k / 16 * Math.PI * 2, r = k % 2 ? 3.0 : 2.3, len = k % 2 ? 3.6 : 3.0;
    parts.push(new THREE.BoxGeometry(0.7, len, 0.5).translate(0, -len / 2, 0).rotateX(-0.12).rotateY(-a).translate(Math.sin(a) * r, 5.6, Math.cos(a) * r));
  }
  const pos = [], nor = [];
  for (const g of parts) { const n = g.index ? g.toNonIndexed() : g; n.computeVertexNormals(); pos.push(...n.attributes.position.array); nor.push(...n.attributes.normal.array); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); return g;
})();
plant(SHIDARE, SHIDARE_GEO, ['#f8cad8', '#f4b8cc', '#fad8e2'], { emissive: 0x40242c });
// 桜吹雪: 桜の近くを歩くと、花びらがひらひらと舞い落ちる
{
  const ALL = [...SAKURA, ...SHIDARE], G = new Map(), key = (i, j) => i * 100003 + j;
  for (const t of ALL) { const k = key(Math.floor(t[0] / 40), Math.floor(t[1] / 40)); if (!G.has(k)) G.set(k, []); G.get(k).push(t); }
  const N = 320, IM = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.17, 0.13), lam({ color: 0xfcdce6, side: THREE.DoubleSide }), N);
  IM.frustumCulled = false; scene.add(IM);
  const ps = Array.from({ length: N }, () => ({ x: 0, y: -99, z: 0, g: 0, vy: 0, ph: rnd() * 6.28, rest: 0 })), D = new THREE.Object3D();
  let near = [], tick = 0;
  LM_UPDATERS.push((dt, t) => {
    dt = Math.min(dt, 0.1);
    if ((tick -= dt) <= 0) {
      tick = 0.5; near = [];
      const i0 = Math.floor(P.x / 40), j0 = Math.floor(P.z / 40);
      for (let i = i0 - 2; i <= i0 + 2; i++) for (let j = j0 - 2; j <= j0 + 2; j++) for (const tr of G.get(key(i, j)) || []) if (Math.hypot(tr[0] - P.x, tr[1] - P.z) < 55 && Math.abs((tr[3] || 0) - P.y) < 25) near.push(tr);
    }
    const active = Math.min(N, near.length * 12);
    for (let k = 0; k < N; k++) {
      const p = ps[k];
      if (p.y < -50 || p.rest > 4) {   // 次の花びらを桜の枝から出す (桜から離れたら出さない。舞っている花びらは落ちきるまで動かす)
        if (k >= active || !near.length) { p.y = -99; p.rest = 0; D.position.set(0, -99, 0); D.updateMatrix(); IM.setMatrixAt(k, D.matrix); continue; }
        const tr = near[(rnd() * near.length) | 0], s = tr[2] || 1;
        p.g = tr[3] || 0; p.x = tr[0] + rr(-2.8, 2.8) * s; p.z = tr[1] + rr(-2.8, 2.8) * s; p.y = p.g + rr(3, 5.8) * s; p.vy = rr(0.45, 0.85); p.rest = 0;
      }
      if (p.y <= p.g + 0.04) { p.rest += dt; D.position.set(p.x, p.g + 0.04, p.z); D.rotation.set(-Math.PI / 2, 0, p.ph); }   // 地面に落ちた花びら
      else {
        p.y = Math.max(p.g + 0.04, p.y - p.vy * dt);
        p.x += (0.45 + Math.sin(t * 0.8 + p.ph) * 0.7) * dt; p.z += Math.cos(t * 1.3 + p.ph * 2) * 0.5 * dt;
        D.position.set(p.x, p.y, p.z); D.rotation.set(t * 2.2 + p.ph, p.ph, t * 1.7 + p.ph * 3);
      }
      D.updateMatrix(); IM.setMatrixAt(k, D.matrix);
    }
    IM.instanceMatrix.needsUpdate = true;
  });
}
plant(WILLOWS, new THREE.CylinderGeometry(0.5, 2.3, 4.8, 7).translate(0, 4.4, 0), ['#8ab84a', '#9ac85a', '#7aa840']); // しだれ柳

