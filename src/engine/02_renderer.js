/* ============================================================
   レンダラ / シーン / 空
   ============================================================ */
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(1);
MAX_ANISO = renderer.capabilities.getMaxAnisotropy();
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(new THREE.Color('#dccbb5'), 60, 680);
const camera = new THREE.PerspectiveCamera(62, 1, 0.3, 4000);
camera.rotation.order = 'YXZ';

const hemi = new THREE.HemisphereLight(0xcfe0ff, 0x6a5a48, 1.1); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffe2b8, 1.6); sun.position.set(-0.6, 1, 0.55); scene.add(sun);

const skyGeo = new THREE.SphereGeometry(3400, 16, 10), skyT = [];
{
  const p = skyGeo.attributes.position;
  for (let i = 0; i < p.count; i++) skyT.push(Math.pow(Math.max(0, p.getY(i) / 3400), 0.55));
  skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(p.count * 3), 3));
}
const sky = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
sky.renderOrder = -1; scene.add(sky);
const cloudMat = new THREE.MeshBasicMaterial({ color: 0xfaf6ee, fog: false });
for (let i = 0; i < 16; i++) {
  const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), ps1(cloudMat));
  const a = rr(0, Math.PI * 2), r = rr(900, 2300);
  c.position.set(Math.cos(a) * r, rr(380, 560), Math.sin(a) * r);
  c.scale.set(rr(60, 140), rr(10, 20), rr(40, 80)); c.rotation.y = rr(0, 3); sky.add(c);
}
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
{
  const sp = [];
  for (let i = 0; i < 450; i++) {
    const a = rr(0, Math.PI * 2), e = Math.asin(rr(0.06, 1));
    sp.push(Math.cos(a) * Math.cos(e) * 3200, Math.sin(e) * 3200, Math.sin(a) * Math.cos(e) * 3200);
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  sky.add(new THREE.Points(sg, starMat));
}
const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(80, 12), new THREE.MeshBasicMaterial({ color: 0xfff2c8, fog: false }));
const moonDisc = new THREE.Mesh(new THREE.CircleGeometry(52, 12), new THREE.MeshBasicMaterial({ color: 0xe6ecf6, fog: false }));
sunDisc.renderOrder = moonDisc.renderOrder = -1; scene.add(sunDisc, moonDisc);

// 夜に光らせるマテリアル [material, 強さ]
const GLOW = [];
const glow = (m, color, s) => { m.emissive.set(color); GLOW.push([m, s]); return m; };

