/* ============================================================
   竹芝周辺の街区 (汎用ビルの羅列をやめ、性格のある街区へ)
   ============================================================ */
mixed([-400, -148, -266, -72], RESERVED); DIST_AREAS.push(['海岸一丁目 (北)', -400, -148, -266, -72]);
office([-246, -148, -36, -72], RESERVED); office([-400, -48, -266, 128], RESERVED); office([-246, -48, -36, 128], RESERVED);
const CONTAINERS = [];
function warehouses(Rc, res, name) { // 倉庫街: のこぎり屋根・コンテナ・トラック
  fr(...Rc, '#7a766e');
  placeLots(Rc, 30, 48, lot => {
    const f = inset(lot, 2.5); if (!okLot(f, res)) return;
    const q = rnd();
    if (q < 0.6) { // のこぎり屋根の倉庫
      const n = Math.max(2, Math.round((f[2] - f[0]) / 9)), w = (f[2] - f[0]) / n, key = pick(['soko0', 'soko1', 'soko2']);
      for (let k = 0; k < n; k++) gableBuilding([f[0] + k * w, f[1], f[0] + (k + 1) * w, f[3]], 9, 2.6, key, pick(['RF0', 'RF2']));
    } else if (q < 0.85) { // コンテナ置き場 (積み上げたコンテナは登れる)
      fr(...f, '#5e5a54');
      for (let x = f[0] + 1; x < f[2] - 6.5; x += 7) for (let z = f[1] + 1; z < f[3] - 3; z += 3) {
        const st = 1 + Math.floor(rnd() * 3); for (let k = 0; k < st; k++) if (rnd() < 0.85) CONTAINERS.push([x, z, k]);
      }
    } else { fr(...f, '#46464c'); for (let x = f[0] + 2; x < f[2] - 3; x += 4) if (rnd() < 0.6) PARKED.push([x + 1, (f[1] + f[3]) / 2, Math.PI / 2]); }
  });
  DIST_AREAS.push([name, ...Rc]);
}
warehouses([-246, 152, -36, 316], RESERVED, '海岸一丁目 倉庫街');
{ // コンテナ (インスタンシング)
  const cols = [0xc0392b, 0x2a6ab0, 0x2f8a4a, 0xd88a2a, 0x8a8f96, 0x6a3a8a];
  const m = new THREE.InstancedMesh(new THREE.BoxGeometry(6, 2.55, 2.4), lam({ color: 0xffffff }), CONTAINERS.length), d = new THREE.Object3D();
  CONTAINERS.forEach(([x, z, k], i) => {
    d.position.set(x + 3, k * 2.6 + 1.275, z + 1.2); d.updateMatrix(); m.setMatrixAt(i, d.matrix); m.setColorAt(i, new THREE.Color(pick(cols)));
    solid(x, z, x + 6, z + 2.4, k * 2.6, k * 2.6 + 2.55);
  });
  scene.add(m);
}

