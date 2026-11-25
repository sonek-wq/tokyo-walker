/* 目白台・関口 (神田川の上流ぞい。川は regions/00_geography.js)
   - 江戸川公園と神田川の桜並木
   - ホテル椿山荘東京の庭園 (三重塔「圓通閣」・雲錦池・霧の「雲海」)
   - 関口芭蕉庵 / 肥後細川庭園 (池泉回遊式庭園・松聲閣・冬の雪吊り) と永青文庫
   - 東京カテドラル聖マリア大聖堂 (丹下健三。ステンレスの曲面が頂上で十字を描く) と鐘塔 */
REGION({
  name: '目白台・関口',
  towns: [['関口', -1700, -3470], ['目白台', -1960, -3580], ['水道 (江戸川橋)', -1420, -3200]],
  labels: [],
  build(r) {
    const { C, site, spot, sign, SHU, STONE, plasterWood, windows, hall } = SL_KIT();
    const trees = (R, n, list = ROUND, avoid = null, s0 = 0.8, s1 = 1.2, base) => {
      for (let k = 0; k < n; k++) { const x = rr(R[0] + 2, R[2] - 2), z = rr(R[1] + 2, R[3] - 2); if (avoid && avoid(x, z)) continue; list.push(base === undefined ? [x, z, rr(s0, s1)] : [x, z, rr(s0, s1), base]); }
    };
    const tri = (v, a, b, c) => v.push(...a, ...b, ...c);
    const geoOf = v => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.computeVertexNormals(); return g; };

    // ===== 神田川の桜並木と江戸川公園 =====
    {
      const P = [[-1022, -3060], [-1300, -3150], [-1540, -3250], [-1820, -3400], [-2000, -3420], [-2200, -3436], [-2390, -3449]];
      for (let i = 0; i + 1 < P.length; i++) {
        const [ax, az] = P[i], [bx, bz] = P[i + 1], l = Math.hypot(bx - ax, bz - az), nx = -(bz - az) / l, nz = (bx - ax) / l;
        for (let s = 5; s < l - 4; s += 9) for (const sd of [-1, 1]) {
          const x = ax + (bx - ax) * s / l + nx * sd * 10, z = az + (bz - az) * s / l + nz * sd * 10;
          const mx = ((x % 100) + 100) % 100, mz = ((z % 100) + 100) % 100;
          if (mx < 12 || mx > 88 || mz < 12 || mz > 88) continue;   // 橋のたもと
          if (Math.hypot(x + 1545, z + 3253) < 30 || Math.hypot(x + 2398, z + 3450) < 30) continue;
          SAKURA.push([x, z, rr(0.75, 0.95)]);
        }
      }
      // 江戸川公園 (江戸川橋から椿山荘の下まで、北岸の細長い公園)
      for (let k = 0; k < 10; k++) { const t = k / 10, x = -1560 - t * 240, z = -3262 - t * 136 - 18; BENCHES.push([x, z, Math.atan2(-0.49, 0.87)]); }
      spot('江戸川公園', [-1800, -3420, -1560, -3262], null, null, '神田川の北岸に細長く続く公園。江戸時代、このあたりの川には井の頭池から江戸の町へ飲み水を運ぶ「神田上水」の取水口 (大洗堰) があった');
      LM_NOTES['神田川'] = LM_NOTES['神田川'] || '井の頭池から流れ出し、隅田川へ注ぐ川。江戸川橋から面影橋のあたりは、春には両岸の桜が川面をおおう';
    }

    // ===== ホテル椿山荘東京の庭園 (三重塔「圓通閣」と雲錦池) =====
    {
      const R = [-1890, -3530, -1770, -3418];
      site(R, '#6a8a4a');
      // ホテルの建物 (北の目白通りぞい)
      pushPrism(windows('MJ_CHINZAN', '#e4dccc', '#4a5260', 5, 5), 'ROOF', rectPoly(-1886, -3528, -1820, -3506), 0, 26);
      pushPrism('glass', 'ROOF', rectPoly(-1880, -3506, -1828, -3498), 0, 6);
      // 雲錦池と滝
      fe(-1835, -3460, 20, 11, '#a89c80'); fe(-1835, -3460, 17, 9, '#3a6a64'); PONDS.push([-1835, -3460, 17, 9]);
      bake(lam({ color: 0xbfe4f4, transparent: true, opacity: 0.8 }), new THREE.BoxGeometry(2.4, 3.6, 0.5).translate(-1846, 1.8, -3469.6));
      pushPrism('ISHIGAKI', 'GRASSTOP', rectPoly(-1852, -3474, -1840, -3470), 0, 3.6);
      // 丘の上の三重塔「圓通閣」(室町時代の塔を広島の竹林寺から移した)
      const PX = -1792, PZ = -3488;
      hill(PX, PZ, 18, 5);
      const TW = C('MJ_PAGODA', { color: 0x6a3a2a });
      for (let i = 0; i < 3; i++) {
        const y0 = 5 + i * 5, hw = 3.2 - i * 0.45;
        pushPrism(TW, 'WOOD', rectPoly(PX - hw, PZ - hw, PX + hw, PZ + hw), y0, y0 + 3.4);
        jRoof('RF_COPPER' in WALL ? 'RF_COPPER' : 'RF2', PX - hw, PZ - hw, PX + hw, PZ + hw, y0 + 3.4, 1.3, { over: 2.2 - i * 0.2, kind: 'hip' });
      }
      bake(WALL.BRONZE, new THREE.CylinderGeometry(0.18, 0.3, 6, 6).translate(PX, 23.7, PZ));   // 相輪
      for (let k = 0; k < 7; k++) bake(WALL.BRONZE, new THREE.TorusGeometry(0.42, 0.08, 4, 8).rotateX(Math.PI / 2).translate(PX, 21.6 + k * 0.6, PZ));
      // 霧の演出「東京雲海」(谷に白い霧がゆっくりただよう)
      const MIST = lam({ color: 0xf4f6f8, transparent: true, opacity: 0.25, depthWrite: false });
      const mists = [];
      for (let k = 0; k < 7; k++) { const m = mesh(new THREE.BoxGeometry(rr(18, 30), 1.6, rr(10, 16)), MIST, -1840 + rr(-20, 25), rr(0.8, 2.2), -3455 + rr(-14, 14)); mists.push([m, m.position.x, rr(0, 6)]); }
      LM_UPDATERS.push((dt, t) => { for (const [m, x0, ph] of mists) { m.position.x = x0 + Math.sin(t * 0.07 + ph) * 6; m.material.opacity = 0.22 + 0.12 * Math.sin(t * 0.11 + ph); } });
      trees(R, 70, ROUND, (x, z) => inR([-1888, -3530, -1818, -3494], x, z) || Math.hypot((x + 1835) / 22, (z + 3460) / 13) < 1 || Math.hypot(x - PX, z - PZ) < 7, 0.8, 1.2);
      trees(R, 30, MAPLES, (x, z) => inR([-1888, -3530, -1818, -3494], x, z) || Math.hypot((x + 1835) / 22, (z + 3460) / 13) < 1 || Math.hypot(x - PX, z - PZ) < 7);
      spot('椿山荘の庭園', R, '椿山荘', '🏯', '昔から椿が自然に生える「つばきやま」と呼ばれた土地を、明治の政治家・山県有朋が買って屋敷と庭をつくり「椿山荘」と名づけた。いまはホテルの庭園で、谷に霧を流して雲海を見せる演出がある', -1830, -3470);
      SPOT_AREAS.unshift(['三重塔「圓通閣」 (椿山荘)', PX - 10, PZ - 10, PX + 10, PZ + 10]);
      LM_NOTES['三重塔「圓通閣」 (椿山荘)'] = '室町時代に建てられたとみられる塔で、1925年に広島の竹林寺から譲り受けてここへ移した。国の登録有形文化財';
    }

    // ===== 関口芭蕉庵 =====
    {
      const R = [-1918, -3444, -1893, -3424];
      site(R, '#7a8a5a');
      pushPrism(plasterWood('MJ_BASHOAN', '#d8ccb0', '#4a3a2a'), 'WOOD', rectPoly(-1913, -3440, -1901, -3432), 0.3, 2.8);
      jRoof(C('MJ_THATCH', { color: 0x8a7650 }), -1913, -3440, -1901, -3432, 2.8, 2.6, { over: 0.9, kind: 'irimoya' });
      fe(-1898, -3428, 3.5, 2.2, '#3a6a64'); PONDS.push([-1898, -3428, 3.2, 1.9]);
      trees(R, 6, ROUND, (x, z) => inR([-1915, -3442, -1899, -3430], x, z) || Math.hypot(x + 1898, z + 3428) < 5, 0.6, 0.9);
      spot('関口芭蕉庵', R, '芭蕉庵', '🐸', '松尾芭蕉が、椿山荘の庭を見下ろすこの場所の庵に4年ほど住んだと伝わる。芭蕉はこのころ、神田上水の工事にかかわっていたといわれる');
    }

    // ===== 肥後細川庭園 と 永青文庫 =====
    {
      const R = [-2010, -3552, -1930, -3434];
      site(R, '#6a8a4a');
      fe(-1972, -3460, 20, 12, '#a89c80'); fe(-1972, -3460, 17, 10, '#3a6a64'); PONDS.push([-1972, -3460, 17, 10]);
      POND_LAND.push(['r', -1975, -3471, -1971, -3449]); bake(lam({ color: 0x9a968a }), new THREE.BoxGeometry(4, 0.3, 22).translate(-1973, 0.2, -3460));   // 池をわたる石橋
      // 松聲閣 (大正時代の建物。細川家の学問所だった)
      const SW = plasterWood('MJ_SHOSEI', '#e6dcc4', '#4a3424');
      pushPrism(SW, 'ROOF', rectPoly(-2000, -3496, -1976, -3482), 0.5, 6.5);
      jRoof('RF2', -2000, -3496, -1976, -3482, 6.5, 3, { over: 1.2, kind: 'irimoya' });
      // 斜面の森 (台地から川へ下る)
      hill(-1950, -3510, 22, 4);
      // 永青文庫 (細川家の美術品を収める)
      pushPrism(windows('MJ_EISEI', '#ece8dc', '#5a5a52', 6, 6), 'RF2', rectPoly(-2004, -3548, -1978, -3532), 0, 9);
      jRoof('RF2', -2004, -3548, -1978, -3532, 9, 2.4, { over: 0.6, kind: 'hip' });
      // 雪吊り (松に放射状の縄を張る。冬の風物詩だが、庭の見どころとしていつも張っておく)
      const winter = true;
      const ROPE = lam({ color: 0xd8c8a0 });
      for (const [x, z] of [[-1990, -3470], [-1952, -3474], [-1958, -3444], [-1940, -3462]]) {
        PINES.push([x, z, 0.9]);
        if (!winter) continue;
        bake(ROPE, new THREE.CylinderGeometry(0.08, 0.08, 9, 4).translate(x, 4.5, z));
        for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283, d = new THREE.Vector3(Math.cos(a) * 3.6, -6, Math.sin(a) * 3.6), L = d.length(); const g = new THREE.CylinderGeometry(0.03, 0.03, L, 3);
          g.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()))); bake(ROPE, g.translate(x + d.x / 2, 9 + d.y / 2, z + d.z / 2)); }
      }
      trees(R, 50, MAPLES, (x, z) => Math.hypot((x + 1972) / 21, (z + 3460) / 13) < 1 || inR([-2003, -3550, -1974, -3480], x, z), 0.8, 1.2);
      trees(R, 30, ROUND, (x, z) => Math.hypot((x + 1972) / 21, (z + 3460) / 13) < 1 || inR([-2003, -3550, -1974, -3480], x, z), 0.9, 1.3);
      spot('肥後細川庭園', R, '肥後細川庭園', '🍁', '熊本藩主・細川家の屋敷の庭だったところ。台地から神田川へ下る斜面と湧き水をいかした池泉回遊式の日本庭園で、池のほとりの松聲閣は大正時代に建てられ、細川家の学問所として使われた', -1972, -3478);
      SPOT_AREAS.unshift(['永青文庫', -2006, -3552, -1976, -3528]);
      LM_NOTES['永青文庫'] = '細川家に伝わる美術品や歴史資料を収める美術館。肥後細川庭園の上の台地に建っている';
    }

    // ===== 東京カテドラル聖マリア大聖堂 (丹下健三、1964年) =====
    {
      const R = [-1818, -3628, -1732, -3548];
      site(R, '#b8b4aa');
      const CX = -1778, CZ = -3592, TOP = 39.4, ARM = 24, HW = 8;
      const SS = lam({ color: 0xcdd3d8, emissive: 0x202428, side: THREE.DoubleSide });
      const v = [];
      for (const [ux, uz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const vx = -uz, vz = ux, L = ux ? ARM : ARM * 0.85;
        const P = (u, s, y) => [CX + ux * u + vx * s, y, CZ + uz * u + vz * s];
        for (const sd of [-1, 1]) {   // 2枚の傾いた曲面 (地面の端から、頂上の十字の割れ目へ)
          const n = 6;
          for (let i = 0; i < n; i++) {
            const u0 = L * i / n, u1 = L * (i + 1) / n, h0 = TOP - (TOP - 14) * (u0 / L) ** 1.4, h1 = TOP - (TOP - 14) * (u1 / L) ** 1.4;
            const w0 = HW * (0.35 + 0.65 * u0 / L), w1 = HW * (0.35 + 0.65 * u1 / L);
            tri(v, P(u0, sd * w0, 0), P(u1, sd * w1, 0), P(u1, sd * 0.9, h1)); tri(v, P(u0, sd * w0, 0), P(u1, sd * 0.9, h1), P(u0, sd * 0.9, h0));
          }
        }
        // 腕の先の面 (ガラス)
        tri(v, P(L, -HW, 0), P(L, HW, 0), P(L, 0.9, 14)); tri(v, P(L, -HW, 0), P(L, 0.9, 14), P(L, -0.9, 14));
        polySolid([[...P(0, -HW, 0)].filter((_, k) => k !== 1), [...P(L, -HW, 0)].filter((_, k) => k !== 1), [...P(L, HW, 0)].filter((_, k) => k !== 1), [...P(0, HW, 0)].filter((_, k) => k !== 1)], 0, 12);
      }
      bake(SS, geoOf(v));
      // 頂上の十字のトップライト (曲面の割れ目にはめたガラス)
      const gv = [];
      for (const [ux, uz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const vx = -uz, vz = ux, L = ux ? ARM : ARM * 0.85, P = (u, s, y) => [CX + ux * u + vx * s, y, CZ + uz * u + vz * s];
        for (let i = 0; i < 6; i++) { const u0 = L * i / 6, u1 = L * (i + 1) / 6, h0 = TOP - (TOP - 14) * (u0 / L) ** 1.4, h1 = TOP - (TOP - 14) * (u1 / L) ** 1.4;
          tri(gv, P(u0, -0.9, h0), P(u1, -0.9, h1), P(u1, 0.9, h1)); tri(gv, P(u0, -0.9, h0), P(u1, 0.9, h1), P(u0, 0.9, h0)); }
      }
      bake(lam({ color: 0xe8f4ff, emissive: 0x3a4a5a, side: THREE.DoubleSide }), geoOf(gv));
      // 鐘塔 (高さ61.68m)
      const BT = [-1742, -3560];
      pushPrism('CONC', 'CONC', rectPoly(BT[0] - 1.6, BT[1] - 2.4, BT[0] + 1.6, BT[1] + 2.4), 0, 61.7);
      bake(lam({ color: 0xf0f0ec }), new THREE.BoxGeometry(0.4, 4, 0.4).translate(BT[0], 63.7, BT[1])); bake(lam({ color: 0xf0f0ec }), new THREE.BoxGeometry(0.4, 0.4, 2.4).translate(BT[0], 64.6, BT[1]));
      tiles(-1800, -3566, -1756, -3552, '#cfcac0', '#bfbab0', 2);
      trees(R, 14, ROUND, (x, z) => Math.abs(x - CX) < 28 && Math.abs(z - CZ) < 26 || Math.hypot(x - BT[0], z - BT[1]) < 5);
      LM_PEOPLE.push([[-1798, -3558, -1758, -3558], 3]);
      spot('東京カテドラル聖マリア大聖堂', R, 'カテドラル', '⛪', '丹下健三が設計し、1964年に完成したカトリックの大聖堂。ステンレスでおおわれた8枚の曲面が空に向かって立ち、上から見ると大きな十字架の形になる。そばの鐘塔は高さ61.68m', CX, CZ);
    }
    bakeFlush();
  },
});
