/* ============================================================
   遠景 (レインボーブリッジ / お台場 / 晴海 / 麻布台・虎ノ門・六本木)
   ============================================================ */
// (レインボーブリッジ・お台場・晴海の書き割りは、東側の本物の地形 (regions/) に置き換えた)
buildMerged();
// シーン直下に置いた小さな置き物 (看板・柱・像など) を、場所ごとのチャンクに移して遠くでは描かないようにする
// (マップが広くなり、遠くの置き物まで毎フレーム描くと重くなるため)。動くもの・大きなものはそのまま
{
  const DYN = new Set([...TRAIN, ...MONO_CARS, ...GULLS.map(g => g.m), cruiser]);
  for (const o of [...scene.children]) {
    if (!o.isMesh || o.isInstancedMesh || DYN.has(o)) continue;
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    if (o.geometry.boundingSphere.radius * Math.max(o.scale.x, o.scale.y, o.scale.z) > 60) continue;
    const c = chunkAt(o.position.x, o.position.z); scene.remove(o); c.group.add(o);
  }
}

