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
function plant(list, crownGeo, colors) {
  const dummy = new THREE.Object3D(), trunk = new THREE.InstancedMesh(trunkGeo, lam({ color: 0x5a4430 }), list.length);
  const crown = new THREE.InstancedMesh(crownGeo, lam({ color: 0xffffff }), list.length);
  list.forEach(([x, z, s], i) => {
    dummy.position.set(x, list[i][3] || 0, z); dummy.scale.setScalar(s); dummy.rotation.y = rr(0, 6); dummy.updateMatrix();
    trunk.setMatrixAt(i, dummy.matrix); crown.setMatrixAt(i, dummy.matrix);
    crown.setColorAt(i, new THREE.Color(pick(colors)).multiplyScalar(rr(0.8, 1.15)));
    const ty = list[i][3] || 0; solid(x - 0.5 * s, z - 0.5 * s, x + 0.5 * s, z + 0.5 * s, ty, ty + 6.8 * s, true);
  });
  scene.add(trunk, crown);
}
plant(PINES, new THREE.ConeGeometry(2.8, 4.2, 6).translate(0, 4.6, 0), ['#2f5a2a', '#3a6630', '#28502a']);
plant(ROUND, new THREE.IcosahedronGeometry(2.3, 0).translate(0, 4.6, 0), ['#4f8a38', '#5f9a40', '#3f7a32']);
plant(MAPLES, new THREE.IcosahedronGeometry(2.3, 0).translate(0, 4.6, 0), ['#c8402a', '#d8602a', '#b83020', '#e08a30']);
plant(GINKGO, new THREE.ConeGeometry(3, 6, 7).translate(0, 5.4, 0), ['#e8c040', '#d8b030', '#f0d050']);
const SEASON = MONTH >= 3 && MONTH <= 4 ? { name: '春', street: ['#f0b8cc', '#e8a8c0', '#f4c8d8', '#5f9a40'] }        // 桜
  : MONTH >= 11 || MONTH === 12 ? { name: '秋', street: ['#e8c040', '#d8a830', '#e0b838', '#c86a28', '#5f9a40'] }    // イチョウ並木の黄葉
  : MONTH >= 10 ? { name: '秋', street: ['#a8a038', '#7a9a38', '#c8902a'] }
  : MONTH <= 2 ? { name: '冬', street: ['#6a7a4a', '#5a6a40', '#7a6a4a'] } : { name: '夏', street: ['#4f8a38', '#5f9a40', '#3f7a32'] };
STREET.push(...LM_STREET);
plant(STREET, new THREE.IcosahedronGeometry(2.3, 0).translate(0, 4.6, 0), SEASON.street);
plant(SAKURA, new THREE.IcosahedronGeometry(2.5, 0).scale(1.25, 0.8, 1.25).translate(0, 4.4, 0),
  MONTH >= 3 && MONTH <= 4 ? ['#f6c4d4', '#f0b0c6', '#fad4e0', '#f4bccc'] : MONTH >= 10 && MONTH <= 11 ? ['#c8603a', '#d8883a', '#b8502e', '#a8a038']
  : MONTH === 12 || MONTH <= 2 ? ['#8a7a5c', '#7a6c50', '#968660'] : ['#4f8a38', '#5f9a40', '#3f7a32']);
plant(WILLOWS, new THREE.CylinderGeometry(0.5, 2.3, 4.8, 7).translate(0, 4.4, 0), ['#8ab84a', '#9ac85a', '#7aa840']); // しだれ柳

