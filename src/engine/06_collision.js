/* ============================================================
   当たり判定: [x0,z0,x1,z1,y0,y1,soft] の箱 + 空間ハッシュ
   ============================================================ */
const HG = 50, HASH = new Map();
function solid(x0, z0, x1, z1, y0, y1, soft = false) {
  const s = [x0, z0, x1, z1, y0, y1, soft];
  for (let i = Math.floor(x0 / HG); i <= Math.floor(x1 / HG); i++) for (let j = Math.floor(z0 / HG); j <= Math.floor(z1 / HG); j++) {
    const k = i * 100003 + j; let a = HASH.get(k); if (!a) HASH.set(k, a = []); a.push(s);
  }
}
function query(x0, z0, x1, z1) {
  const out = new Set();
  for (let i = Math.floor(x0 / HG); i <= Math.floor(x1 / HG); i++) for (let j = Math.floor(z0 / HG); j <= Math.floor(z1 / HG); j++) {
    const a = HASH.get(i * 100003 + j); if (a) for (const s of a) out.add(s);
  }
  return out;
}

