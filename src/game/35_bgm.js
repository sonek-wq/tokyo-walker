/* ============================================================
   BGM (Web Audio でその場で鳴らす、オリジナルのチップチューン)
   - 音色: 矩形波 (パルス幅 12.5% / 25% / 50%) のメロディと伴奏、三角波のベース、ノイズのドラム
   - エリアごとに曲が変わる (乗り物・高い所・大きな公園や寺社・夜も) 。切り替えはクロスフェード
   - 曲が始まるとき・変わるときに、画面の右上に曲名を出す
   - 楽譜の書き方:
       mel  … 小節を | で区切り、1小節は8分音符 (ワルツは6つ) 。 1〜7 = 音階の度数、' で1オクターブ上 , で下、
               # b で半音上下、 - = のばす、 . = 休み
       ch   … 1小節に1つか2つ (空白区切り) 。 度数 + 種類 (m, 7, M7, m7, sus4, add9, 6, dim, aug) 。 b7 などもOK
   ============================================================ */
const BGM_TRACKS = {
  city: { title: 'まちかどスキップ', bpm: 138, key: 5, swing: 0.12, lead: 0.25, arp: 'broken', bass: 'walk', drum: 'beat',
    ch: '1 | 6m | 2m 5 | 1 | 4 | 3m 6m | 2m | 5 | 4 | 5 | 3m | 6m | 4 | 5 | 1 6m | 2m 5',
    mel: "5 . 3 5 1' - 7 6 | 5 - 3 . 1 2 3 . | 4 . 6 . 7 . 2' . | 1' - - . 5 . . . | 6 . 4 6 1' - 6 5 | 5 - 3 . 1' - 7 6 | 6 - 5 4 2 . 4 . | 5 - - . 7, 1 2 . |" +
         "3 . 4 . 6 - 4 . | 5 . 6 . 7 - 5 . | 1' . 7 . 5 - 3 . | 6 - - - 6 . 7 . | 1' . 6 . 4 . 1' . | 2' - 1' 7 6 . 5 . | 3 . 5 . 1' . 6 . | 6 - 2' - 5 . . ." },
  marunouchi: { title: '赤レンガのファンファーレ', bpm: 116, key: -2, swing: 0, lead: 0.5, arp: 'stab', bass: 'oom', drum: 'march',
    ch: '1 | 4 | 1 | 5 | 1 | 4 | 5 | 1 | 6m | 3m | 4 | 1 | 2m | 5 | 1 4 | 5',
    mel: "1 . 1 1 5 - 5 . | 6 . 6 . 4' - 1' . | 3' - 2' 1' 5 . 3 5 | 2' - - . 7 . 5 . | 1 . 1 1 5 - 5 . | 6 . 1' . 4' - 3' 2' | 2' - 3' 2' 1' . 7 . | 1' - - . 5 . 5 . |" +
         "3' - 1' . 6 . 1' . | 7 - 5 . 3 . 5 . | 6 . 1' . 4' - 3' . | 3' - 2' . 1' - 5 . | 4' - 3' . 2' . 6 . | 5' - 4' . 2' - 7 . | 1' . 3' . 6' - 4' . | 2' - - . 2' . 7 ." },
  ginza: { title: 'ガス灯ワルツ', bpm: 150, key: 7, swing: 0, lead: 0.5, arp: 'waltz', bass: 'waltz', drum: 'waltz', meter: 6, vib: 1.3,
    ch: '1 | 5 | 4 | 1 | 2m | 5 | 1 | 5 | 6m | 3m | 4 | 1 | 4 | 4m | 1 | 1',
    mel: "3 - - - 5 - | 5 - 4 - 3 - | 6 - - - 1' - | 7 - 6 - 5 - | 4 - - - 6 - | 5 - 4 - 2 - | 3 - - - - - | 2 - 5, - 7, - |" +
         "1' - - - 3' - | 7 - 5 - 3 - | 6 - - - 1' - | 5 - 3 - 1 - | 4 - 6 - 1' - | b6 - 1' - 4' - | 3' - - - 2' - | 1' - - - . ." },
  shitamachi: { title: '下町ちょうちん通り', bpm: 128, key: 2, swing: 0.18, lead: 0.25, arp: 'stab', bass: 'oom', drum: 'festival',
    ch: '1 | 1 | 4 | 1 | 6m | 4 | 5 | 1 | 4 | 1 | 4 | 6m | 2m | 4 | 5 | 1',
    mel: "6 . 5 6 1' - 6 . | 5 . 4 5 6 - - . | 1' . 6 1' 2' - 1' . | 6 . 5 4 5 - - . | 6 . 6 5 6 1' 2' . | 1' - 6 . 5 . 4 . | 2 . 4 . 5 . 6 . | 5 - - . . . 6 1' |" +
         "2' - 1' 6 1' - 6 . | 5 . 6 . 1' - - . | 2' - 1' 6 4' - 2' . | 1' . 6 . 5 - - . | 6 . 5 4 2 - 4 . | 5 . 6 . 1' . 6 . | 5 . 4 . 2 . 4 . | 1 - - . 5, . 6, ." },
  akiba: { title: 'デンキ街ピコピコ行進曲', bpm: 152, key: 0, swing: 0, lead: 0.125, arp: 'up', bass: 'root8', drum: 'beat',
    ch: '1 | b7 | 4 | 1 | 1 | b7 | 4 | 5 | 6m | 4 | 1 | 5 | 6m | 4 | 2m | 5',
    mel: "1' 1' 5 1' 3' . 2' 1' | b7 - 5 . 2' - 1' b7 | 1' . 6 . 4 . 6 1' | 5 - - . 5 6 b7 . | 1' 1' 5 1' 3' . 5' 3' | 4' - 2' . b7 - 2' 4' | 3' . 1' . 6 . 1' . | 2' - - . 7 . 5 . |" +
         "3' . 3' 2' 1' . 6 . | 1' . 6 . 4 . 6 . | 5 . 1' . 3' . 5' . | 4' - 3' . 2' . 7 . | 3' . 3' 2' 1' . 6 . | 4' - 3' . 1' . 6 . | 2' . 4' . 6' - 4' . | 5' - - . 5 6 7 ." },
  bigcity: { title: 'スクランブルで会いましょう', bpm: 128, key: 3, swing: 0.08, lead: 0.25, arp: 'stab', bass: 'syncop', drum: 'beat',
    ch: '4M7 | 5 | 3m7 | 6m7 | 2m7 | 5 | 1M7 | 1M7 | 4M7 | 5 | 3m7 | 6m | 2m7 | 3m7 | 4M7 | 5',
    mel: ". 3 . 5 6 . 5 3 | 2 . 5, . 2 3 . 5 | . 5 - 3 2 . 1 . | 1 - - - . 3 5 6 | 1' . 6 . 5 . 4 3 | 2 - . 5 . 4 3 2 | 3 - - . . . . . | . 1 2 3 5 . 6 . |" +
         "1' . 1' . 7 6 . 5 | . 5 . 2' . 1' 7 . | 7 . 7 . 6 5 . 3 | . 3 . 1' . 7 6 . | 6 . 6 . 5 4 . 3 | . 5 - - 7 - 2' . | 3' - - - 2' . 1' . | 2' - - . 5 . 7 ." },
  bay: { title: 'しおかぜブルー', bpm: 108, key: -3, swing: 0, lead: 0.5, arp: 'up', bass: 'sparse', drum: 'light', vib: 1.2, echo: 0.3,
    ch: '1M7 | 4M7 | 1M7 | 4M7 | 6m7 | 2m7 | 4M7 | 5 | 4M7 | 3m7 | 2m7 | 1M7 | 4M7 | 3m7 | 2m7 | 5sus4',
    mel: "3 - - 5 7 - 1' . | 6 - - - 4 . 6 . | 5 - - 3 2 - 3 . | 1 - - - . . 5, 6, | 1 - 3 . 5 - 6 . | 4 - - - 3 2 1 . | 2 - - 3 4 - 6 . | 5 - - - - . . . |" +
         "6 - 5 . 4 - 3 . | 5 - - - 7, - 2 . | 4 - 3 . 2 - 1 . | 3 - - - 5 . 7 . | 1' - 7 . 6 - 4 . | 7 - 6 . 5 - 3 . | 6 - 5 . 4 - 2 . | 5 - - - 6 . 7 ." },
  park: { title: 'こもれびベンチ', bpm: 96, key: 5, swing: 0, lead: 0.5, arp: 'broken', bass: 'sparse', drum: 'none', vib: 1.4, echo: 0.25,
    ch: '1 | 3m | 4 | 1 | 4 | 5 | 3m 6m | 2m 5 | 4 | 5 | 3m | 6m | 2m | 5 | 1 | 1',
    mel: "1 - 2 - 3 - 5 - | 5 - - - 3 - - - | 4 - 3 - 4 - 6 - | 5 - - - - - . . | 6 - 5 - 4 - 6 - | 5 - 4 - 2 - - - | 3 - 5 - 1' - 7 - | 6 - - - 5 - - - |" +
         "6 - 1' - 6 - 4 - | 5 - 7 - 5 - 2 - | 3 - 5 - 7 - 5 - | 6 - - - - - . . | 4 - 6 - 1' - 6 - | 7 - - - 2' - - - | 1' - - - 5 - 3 - | 1 - - - - - . ." },
  shrine: { title: '石段とおみくじ', bpm: 84, key: 0, swing: 0, lead: 0.25, arp: 'koto', bass: 'sparse', drum: 'shrine', vib: 1.5, echo: 0.3,
    ch: '6m | 4 | 6m | 5 | 6m | 4 | 2m | 3m | 4 | 5 | 3m | 6m | 4 | 5 | 6m | 6m',
    mel: "6 - - . 1' - 6 . | 5 - 3 . 5 - - . | 6 . 1' . 2' - 1' 6 | 5 - - - - . . . | 3' - 2' . 1' - 6 . | 1' - 6 . 5 - 3 . | 2 - 3 . 5 - 6 . | 3 - - - - . . . |" +
         "6 . 5 . 6 - 1' . | 2' - 1' . 2' - 3' . | 5' - 3' . 2' - 1' . | 6 - - - . . 5 6 | 1' - 6 . 1' - 2' . | 3' - 2' 1' 2' - 5 . | 6 - - . 3' - 2' . | 6 - - - - . . ." },
  night: { title: 'ほしぞらの帰り道', bpm: 76, key: -4, swing: 0, lead: 0.5, arp: 'up', bass: 'sparse', drum: 'none', vib: 1.5, echo: 0.35, soft: 0.8,
    ch: '1 | 5 | 6m | 3m | 4 | 1 | 2m | 5 | 4 | 5 | 3m | 6m | 2m | 5 | 1 | 1',
    mel: "3 - - - 2 - 1 - | 2 - - - 7, - 5, - | 1 - - - 3 - 6 - | 5 - - - - - . . | 6 - - - 5 - 4 - | 3 - - - 1 - 3 - | 4 - - - 3 - 2 - | 2 - - - - - . . |" +
         "1' - - - 6 - 4 - | 7 - - - 5 - 2 - | 5 - - - 3 - 7 - | 6 - - - - - . . | 4 - 6 - 1' - 6 - | 5 - - - 7 - 2' - | 1' - - - - - - - | . . . . . . . ." },
  train: { title: 'ガタンゴトン山手線', bpm: 144, key: 7, swing: 0, lead: 0.25, arp: 'none', bass: 'root8', drum: 'train',
    ch: '1 | 1 | 4 | 1 | 2m | 5 | 1 | 5 | 4 | 4 | 1 | 6m | 2m | 5 | 1 | 1',
    mel: "1 3 5 1' . 5 3 . | 5 . 6 . 5 - - . | 4 6 1' 4' . 1' 6 . | 5 . 3 . 1 - - . | 2 4 6 2' . 6 4 . | 5 . 7 . 2' - - . | 1' . 5 . 3 . 5 . | 2 - - . 5, . 7, . |" +
         "6 . 6 . 6 5 4 . | 1' - 6 . 4 - - . | 5 . 5 . 5 4 3 . | 6 - 5 . 3 - - . | 4 . 4 . 4 3 2 . | 5 . 6 . 7 . 2' . | 1' - - . 5 - 3 . | 1 - - . . . . ." },
  sky: { title: 'てっぺんの風', bpm: 112, key: 0, swing: 0, lead: 0.125, arp: 'up', bass: 'sparse', drum: 'light', vib: 1.2, echo: 0.35,
    ch: '1add9 | 5 | 6m | 4 | 1 | 5 | 4 | 4 | 6m | 5 | 4 | 1 | 6m | 5 | 4 | 5sus4',
    mel: "5 - - - 1' - 2' - | 2' - - - 7 - 5 - | 1' - - - 3' - 6 - | 6 - - - - - . . | 5 - - - 1' - 2' - | 3' - - - 2' - 7 - | 1' - - - 6 - 4 - | 6 - - - - - . . |" +
         "3' - - - 3' - 2' 1' | 2' - - - 7 - 5 - | 1' - - - 1' - 6 4 | 5 - - - - - . . | 3' - - - 3' - 5' 3' | 2' - - - 7 - 2' - | 1' - - - 6 - 1' - | 2' - - - - - . ." },
};
const BGM_ZONE_LABEL = { city: '街', marunouchi: '丸の内・皇居', ginza: '銀座・有楽町', shitamachi: '下町', akiba: '秋葉原・神田', bigcity: '新宿・渋谷・池袋', bay: '湾岸', park: '公園・庭園', shrine: '寺社', night: '夜', train: '電車', sky: '高い空' };

// ---- 楽譜を読む ----
const BGM_SCALE = [0, 2, 4, 5, 7, 9, 11];
const BGM_QUAL = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10], M7: [0, 4, 7, 11], m7: [0, 3, 7, 10], sus4: [0, 5, 7], add9: [0, 4, 7, 14], 6: [0, 4, 7, 9], dim: [0, 3, 6], aug: [0, 4, 8], m6: [0, 3, 7, 9] };
function bgmDeg(tok) {   // "b6'" → 半音
  const m = /^([#b]?)([1-7])([',]*)$/.exec(tok); if (!m) return null;
  let s = BGM_SCALE[+m[2] - 1] + (m[1] === '#' ? 1 : m[1] === 'b' ? -1 : 0);
  for (const c of m[3]) s += c === "'" ? 12 : -12;
  return s;
}
function bgmParse(tr) {
  const steps = tr.meter || 8;
  const bars = tr.mel.split('|').map(b => b.trim().split(/\s+/));
  const ev = bars.map(() => []);
  let last = null;
  bars.forEach((tk, bi) => tk.forEach((t, i) => {
    if (t === '-') { if (last) last.len++; return; }
    if (t === '.') { last = null; return; }
    const s = bgmDeg(t); if (s == null) { last = null; return; }
    last = { pos: i, semi: s, len: 1 }; ev[bi].push(last);
  }));
  const chords = tr.ch.split('|').map(b => b.trim().split(/\s+/).map(c => {
    const m = /^([#b]?)([1-7])(.*)$/.exec(c);
    const root = BGM_SCALE[+m[2] - 1] + (m[1] === '#' ? 1 : m[1] === 'b' ? -1 : 0);
    return { root, tones: (BGM_QUAL[m[3]] || BGM_QUAL['']).map(v => v + root) };
  }));
  return { ...tr, steps, ev, chords, nBars: bars.length };
}
const BGM = Object.fromEntries(Object.entries(BGM_TRACKS).map(([k, t]) => [k, bgmParse(t)]));

// ---- 音を出す ----
let bgmCtx = null, bgmMaster = null, bgmTrackGain = null, bgmEcho = null, bgmNoise = null, bgmWaves = {};
let bgmCur = null, bgmStep = 0, bgmNext = 0, bgmTimer = 0, bgmPending = null, bgmFadeAt = 0, bgmShownTitle = '';
const BGM_VOLS = [{ name: '小', v: 0.2 }, { name: '中', v: 0.36 }, { name: '大', v: 0.6 }];
if (SET.bgm === undefined) SET.bgm = true;
if (SET.bgmVol === undefined) SET.bgmVol = 1;
function bgmPulse(d) {
  if (bgmWaves[d]) return bgmWaves[d];
  const N = 32, re = new Float32Array(N), im = new Float32Array(N);
  for (let n = 1; n < N; n++) { re[n] = Math.sin(2 * Math.PI * n * d) / (n * Math.PI); im[n] = (1 - Math.cos(2 * Math.PI * n * d)) / (n * Math.PI); }
  return (bgmWaves[d] = bgmCtx.createPeriodicWave(re, im));
}
function bgmInit() {
  if (bgmCtx) return true;
  try { bgmCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return false; }
  bgmMaster = bgmCtx.createGain(); bgmMaster.gain.value = 0;
  const lp = bgmCtx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6500;   // 角をすこし丸めて温かい音に
  bgmMaster.connect(lp); lp.connect(bgmCtx.destination);
  bgmTrackGain = bgmCtx.createGain(); bgmTrackGain.connect(bgmMaster);
  bgmEcho = bgmCtx.createDelay(1); bgmEcho.delayTime.value = 0.21;
  const fb = bgmCtx.createGain(); fb.gain.value = 0.28; const eo = bgmCtx.createGain(); eo.gain.value = 0.5;
  bgmEcho.connect(fb); fb.connect(bgmEcho); bgmEcho.connect(eo); eo.connect(bgmTrackGain);
  bgmEcho.send = bgmCtx.createGain(); bgmEcho.send.gain.value = 0; bgmEcho.send.connect(bgmEcho);
  const len = bgmCtx.sampleRate; bgmNoise = bgmCtx.createBuffer(1, len, bgmCtx.sampleRate);
  const nd = bgmNoise.getChannelData(0); for (let i = 0; i < len; i++) nd[i] = Math.random() * 2 - 1;
  setInterval(bgmPump, 25);
  document.addEventListener('visibilitychange', () => { if (!bgmCtx) return; if (document.hidden) bgmCtx.suspend(); else if (SET.bgm) bgmCtx.resume(); });
  return true;
}
const bgmHz = midi => 440 * Math.pow(2, (midi - 69) / 12);
function bgmTone(type, midi, t, dur, vol, o = {}) {
  const c = bgmCtx, osc = c.createOscillator(), g = c.createGain();
  if (typeof type === 'number') osc.setPeriodicWave(bgmPulse(type)); else osc.type = type;
  osc.frequency.value = bgmHz(midi);
  const a = o.a || 0.006, rel = o.rel || 0.05, sus = o.sus ?? 0.7;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + a);
  g.gain.setTargetAtTime(vol * sus, t + a, o.dec || 0.08);
  g.gain.setValueAtTime(vol * sus, t + dur); g.gain.linearRampToValueAtTime(0, t + dur + rel);
  if (o.vib && dur > 0.25) {   // あとからかかるビブラート
    const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = 5.5; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(0, t + 0.18); lg.gain.linearRampToValueAtTime(9 * o.vib, t + Math.min(dur, 0.6));
    l.connect(lg); lg.connect(osc.detune); l.start(t); l.stop(t + dur + rel + 0.02);
  }
  osc.connect(g); g.connect(bgmTrackGain); if (o.echo) g.connect(bgmEcho.send);
  osc.start(t); osc.stop(t + dur + rel + 0.02);
}
function bgmDrum(kind, t, vol) {
  const c = bgmCtx;
  if (kind === 'K' || kind === 'T') {   // キック / 太鼓 (音程の下がるサイン波)
    const o = c.createOscillator(), g = c.createGain(); const f0 = kind === 'K' ? 130 : 95, f1 = kind === 'K' ? 48 : 58, d = kind === 'K' ? 0.12 : 0.3;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + d);
    g.gain.setValueAtTime(vol * (kind === 'K' ? 1.1 : 1.3), t); g.gain.exponentialRampToValueAtTime(0.001, t + d + 0.05);
    o.connect(g); g.connect(bgmTrackGain); o.start(t); o.stop(t + d + 0.08); return;
  }
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = bgmNoise;
  const P = { H: ['highpass', 7000, 0.035, 0.35], h: ['highpass', 7000, 0.025, 0.2], S: ['bandpass', 1800, 0.13, 0.8], C: ['bandpass', 4200, 0.09, 0.45] }[kind];
  f.type = P[0]; f.frequency.value = P[1]; g.gain.setValueAtTime(vol * P[3], t); g.gain.exponentialRampToValueAtTime(0.001, t + P[2]);
  s.connect(f); f.connect(g); g.connect(bgmTrackGain); s.start(t, Math.random() * 0.5); s.stop(t + P[2] + 0.02);
}
const BGM_DRUMS = {   // 8ステップ (waltz は6)
  beat: { K: 'x...x...', S: '..x...x.', H: 'hHhHhHhH' }, march: { K: 'x...x...', S: 'x.xx..x.', H: '' }, festival: { T: 'x..x..x.', C: '..x...x.', H: '.h.h.h.h' },
  light: { K: 'x.......', H: '..h...h.' }, train: { K: 'x..x....', H: 'H.hHH.hh' }, waltz: { K: 'x.....', H: '..h.h.' }, shrine: { T: 'x.......', C: '....x...' }, none: {},
};
function bgmChordAt(tr, bar, pos) { const cs = tr.chords[bar % tr.chords.length]; return cs[cs.length > 1 && pos >= tr.steps / 2 ? 1 : 0]; }
function bgmPlayStep(tr, step, t, sd) {
  const bar = Math.floor(step / tr.steps) % tr.nBars, pos = step % tr.steps, K = tr.key, soft = tr.soft || 1;
  const ch = bgmChordAt(tr, bar, pos);
  // メロディ
  for (const e of tr.ev[bar]) if (e.pos === pos) bgmTone(tr.lead, 72 + K + e.semi, t, e.len * sd * 0.92, 0.16 * soft, { vib: tr.vib || 1, echo: tr.echo, sus: 0.65 });
  bgmEcho.send.gain.setValueAtTime(tr.echo || 0, t);
  // 伴奏 (和音のアルペジオ・きざみ)
  const tones = ch.tones.map(v => 60 + K + v).map(m => (m > 74 ? m - 12 : m));
  const arp = tr.arp;
  if (arp === 'up') bgmTone(0.125, tones[pos % tones.length] + (pos >= 4 ? 12 : 0), t, sd * 0.8, 0.045 * soft, { sus: 0.5 });
  else if (arp === 'broken') { const idx = [0, 2, 1, 2, 0, 2, 1, 2][pos]; bgmTone(0.25, tones[Math.min(idx, tones.length - 1)], t, sd * 0.85, 0.05 * soft, { sus: 0.5 }); }
  else if (arp === 'stab') { if (pos % 2 === 1) for (const m of tones.slice(0, 3)) bgmTone(0.25, m, t, sd * 0.45, 0.028 * soft, { sus: 0.4 }); }
  else if (arp === 'waltz') { if (pos === 2 || pos === 4) for (const m of tones.slice(0, 3)) bgmTone(0.25, m, t, sd * 1.4, 0.026 * soft, { sus: 0.5 }); }
  else if (arp === 'koto') { if (pos % 2 === 0) { const seq = [...tones].reverse(); bgmTone(0.125, seq[(pos / 2) % seq.length] + 12, t, sd * 1.6, 0.045, { sus: 0.25, dec: 0.15 }); } }
  // ベース (三角波)
  const r = 36 + K + ch.root + (ch.root + K < -2 ? 12 : 0), fifth = r + 7, third = r + (ch.tones[1] - ch.root), sixth = r + 9;
  const BP = { root8: [r, null, r + 12, null, r, null, r + 12, null], oom: [r, null, fifth, null, r, null, fifth, null], walk: [r, null, third, null, fifth, null, sixth, null],
    sparse: [r, null, null, null, fifth, null, null, null], syncop: [r, null, null, r, null, r + 12, null, null], waltz: [r, null, null, null, null, null] }[tr.bass];
  const bn = BP && BP[pos];
  if (bn != null) bgmTone('triangle', bn, t, sd * (tr.bass === 'sparse' ? 3.6 : tr.bass === 'waltz' ? 5 : 0.9), 0.24 * soft, { sus: 0.9, a: 0.004 });
  // ドラム
  const D = BGM_DRUMS[tr.drum] || {};
  for (const k of Object.keys(D)) { const c = D[k][pos % D[k].length]; if (c && c !== '.') bgmDrum(c === 'x' ? k : c, t, 0.09 * soft); }
}
function bgmPump() {
  if (!bgmCtx || !bgmCur || !SET.bgm) return;
  const sd = 60 / bgmCur.bpm / 2;
  while (bgmNext < bgmCtx.currentTime + 0.15) {
    if (bgmPending && bgmCtx.currentTime >= bgmFadeAt) {   // フェードアウトが終わったら次の曲へ
      bgmCur = bgmPending; bgmPending = null; bgmStep = 0; bgmNext = Math.max(bgmNext, bgmCtx.currentTime + 0.05);
      bgmTrackGain.gain.cancelScheduledValues(bgmCtx.currentTime); bgmTrackGain.gain.setValueAtTime(0, bgmCtx.currentTime); bgmTrackGain.gain.linearRampToValueAtTime(1, bgmCtx.currentTime + 1.2);
      bgmShowTitle(bgmCur.title); return;
    }
    const swing = bgmStep % 2 === 1 ? (bgmCur.swing || 0) * sd : 0;
    bgmPlayStep(bgmCur, bgmStep, bgmNext + swing, sd);
    bgmNext += sd; bgmStep++;
  }
}
function bgmSwitch(id) {
  const tr = BGM[id]; if (!tr || tr === bgmCur || tr === bgmPending) return;
  if (!bgmCur) { bgmCur = tr; bgmStep = 0; bgmNext = bgmCtx.currentTime + 0.1; bgmTrackGain.gain.setValueAtTime(1, bgmCtx.currentTime); bgmShowTitle(tr.title); return; }
  bgmPending = tr; bgmFadeAt = bgmCtx.currentTime + 1.2;
  bgmTrackGain.gain.cancelScheduledValues(bgmCtx.currentTime); bgmTrackGain.gain.setValueAtTime(bgmTrackGain.gain.value, bgmCtx.currentTime); bgmTrackGain.gain.linearRampToValueAtTime(0, bgmFadeAt);
}

// ---- 曲名の表示 ----
const bgmTitleEl = (() => {
  const el = document.createElement('div'); el.id = 'bgmTitle';
  el.style.cssText = 'position:fixed;right:16px;top:14px;background:rgba(10,14,30,.78);border:2px solid #e8e0c8;box-shadow:0 0 0 2px #1a1a2a;padding:6px 18px;font-size:15px;color:#fff;letter-spacing:2px;opacity:0;transition:opacity .6s;pointer-events:none;white-space:nowrap;z-index:20';
  document.body.appendChild(el); return el;
})();
let bgmTitleTimer = 0;
function bgmShowTitle(title) {
  if (bgmShownTitle === title && bgmTitleTimer > 0) return;
  bgmShownTitle = title; bgmTitleEl.innerHTML = '♪ <span style="color:#ffd84a">' + title + '</span>'; bgmTitleEl.style.opacity = 1; bgmTitleTimer = 4.5;
}

// ---- どの曲にするか (場所・乗り物・高さ・時刻) ----
const BGM_KW = [
  ['bay', ['竹芝', '芝浦', '台場', '有明', '豊洲', '晴海', '東雲', '辰巳', '新木場', '天王洲', '港南', '勝島', '青海', '夢の島', '埠頭', 'ふ頭', 'レインボー', '日の出', '東京湾', 'ヘリポート', '水族館', 'ビッグサイト', '浜離宮', '海浜']],
  ['shitamachi', ['浅草', '上野', '谷中', '根津', '千駄木', '日暮里', '鶯谷', '両国', '押上', '向島', '本所', '蔵前', '浅草橋', '人形町', '浜町', '森下', '清澄', '門前仲町', '深川', '月島', '佃', '柴又', '亀戸', '錦糸町', '御徒町', '湯島', '根岸', '入谷', '三ノ輪', '吾妻', '業平', '墨田', '菊川', '住吉', '隅田', 'スカイツリー', '末廣亭', 'アメ横', '合羽橋', '言問', '小網', '水天宮', '鳥越', '谷根千', '国技館', '花川戸', '雷門', '仲見世', '稲荷町', '松が谷', '駒形', '今戸', '橋場', '千束', '竜泉', '下谷', '元浅草', '小島', '寿', '三筋', '台東', '待乳山', '伝法院', '花やしき']],
  ['akiba', ['秋葉原', '神田', '御茶ノ水', 'お茶の水', '神保町', '小川町', '岩本町', '末広町', '淡路町', '駿河台', '水道橋', '後楽園', '万世橋', '東京ドーム', '外神田', '須田町', 'ニコライ', '明治大学']],
  ['ginza', ['銀座', '有楽町', '新橋', '築地', '京橋', '汐留', '八丁堀', '明石町', '歌舞伎座', '数寄屋橋', '新富', '本の森']],
  ['marunouchi', ['丸の内', '大手町', '東京駅', '日比谷', '霞が関', '霞ヶ関', '永田町', '皇居', '内幸町', '八重洲', '日本橋', '紀尾井町', '麹町', '九段', '北の丸', '竹橋', '国会', '桜田', '二重橋', '和田倉', '番町', '半蔵門', '明治生命館', '宮殿', '武道館']],
  ['bigcity', ['新宿', '歌舞伎町', '渋谷', '原宿', '神宮前', '表参道', '青山', '六本木', '赤坂', '池袋', 'サンシャイン', '代々木', '恵比寿', '道玄坂', '宇田川', '麻布', '虎ノ門', 'スクランブル', '都庁', '竹下通り', 'ハチ公', '乙女ロード']],
];
const BGM_EXACT = { '東京': 'marunouchi', '有楽町': 'ginza', '新橋': 'ginza', '神田': 'akiba', '秋葉原': 'akiba', '御徒町': 'shitamachi', '上野': 'shitamachi', '鶯谷': 'shitamachi', '日暮里': 'shitamachi', '新宿': 'bigcity', '新大久保': 'bigcity', '代々木': 'bigcity', '原宿': 'bigcity', '渋谷': 'bigcity', '池袋': 'bigcity' };
const BGM_PARK = ['公園', '庭園', '御苑', '植物園', '緑地', '霊園', 'の森', '園地'], BGM_SHRINE = ['神社', '神宮', '大社', '稲荷', '八幡', '天神', '寺', '観音', '不動', '権現', '明神', '大仏'], BGM_SHRINE_NG = ['球場', '外苑', '神宮前', '寺島', '寺田', '競技場'];
function bgmZoneOfName(n) {
  if (!n) return null;
  if (BGM_EXACT[n]) return BGM_EXACT[n];
  for (const [z, ks] of BGM_KW) if (ks.some(k => n.includes(k))) return z;
  return null;
}
let BGM_ANCH = null;
function bgmPick() {
  if (P.ride) return 'train';
  if (P.boat) return 'bay';
  if (P.glider || P.y > 70) return 'sky';
  const a = (curArea || '').replace('（屋上）', '');
  const rect = AREAS.find(r => r[0] === a), big = rect ? Math.min(Math.abs(rect[3] - rect[1]), Math.abs(rect[4] - rect[2])) : 0;
  let z = null;
  if (BGM_PARK.some(k => a.includes(k)) && big >= 50) z = 'park';
  else if (BGM_SHRINE.some(k => a.includes(k)) && !BGM_SHRINE_NG.some(k => a.includes(k)) && big >= 30) z = 'shrine';
  if (!z) z = bgmZoneOfName(a);
  if (!z) {   // いちばん近い地名・駅名から決める
    if (!BGM_ANCH) BGM_ANCH = [...TOWNS.map(t => [t[0], t[1], t[2]]), ...STN.map(s => [s.name, s.x, s.z]), ...DIST_AREAS.map(d => [d[0], (d[1] + d[3]) / 2, (d[2] + d[4]) / 2])];
    const near = BGM_ANCH.map(t => [Math.hypot(t[1] - P.x, t[2] - P.z), t[0]]).filter(t => t[0] < 900).sort((p, q) => p[0] - q[0]);
    z = 'city'; for (const [, n] of near.slice(0, 6)) { const zz = bgmZoneOfName(n); if (zz) { z = zz; break; } }
  }
  if (NIGHT > 0.7 && ['city', 'bigcity', 'ginza', 'marunouchi', 'akiba', 'bay', 'park'].includes(z)) z = 'night';
  return z;
}
let bgmWant = null, bgmWantSince = 0, bgmPickAt = 0;
function bgmUpdate(dt) {
  if (bgmTitleTimer > 0 && (bgmTitleTimer -= dt) <= 0) bgmTitleEl.style.opacity = 0;
  if (!bgmCtx || !SET.bgm || !started) return;
  const paused = overlay.style.display !== 'none';
  const vol = BGM_VOLS[SET.bgmVol].v * (paused ? 0.35 : 1);
  if (Math.abs(bgmMaster.gain.value - vol) > 0.001) bgmMaster.gain.setTargetAtTime(vol, bgmCtx.currentTime, 0.3);
  const now = performance.now() / 1000;   // 切り替えの判定は実際の時間で (重い端末でも同じ感覚に)
  if (now < bgmPickAt) return; bgmPickAt = now + 0.4;
  const z = bgmPick();
  if (z !== bgmWant) { bgmWant = z; bgmWantSince = now; }
  const quick = ['train', 'sky'].includes(z) || (bgmCur && ['train', 'sky'].includes(bgmCur.id));
  if (!bgmCur || now - bgmWantSince >= (quick ? 0.6 : 2.5)) bgmSwitch(z);
}
for (const [k, t] of Object.entries(BGM)) t.id = k;
LM_UPDATERS.push(bgmUpdate);
// 最初のクリックやキー入力で鳴らしはじめる (ブラウザの自動再生の制限のため)
const bgmKick = () => { if (!SET.bgm) return; if (bgmInit()) { bgmCtx.resume(); bgmMaster.gain.setTargetAtTime(BGM_VOLS[SET.bgmVol].v, bgmCtx.currentTime, 0.4); } };
addEventListener('pointerdown', bgmKick); addEventListener('keydown', bgmKick);
function bgmApplySettings(mkBtns) {
  mkBtns(document.getElementById('optBgm'), ['ON', 'OFF'], SET.bgm ? 0 : 1, i => {
    SET.bgm = i === 0; applySettings();
    if (!SET.bgm && bgmCtx) { bgmMaster.gain.setTargetAtTime(0, bgmCtx.currentTime, 0.1); setTimeout(() => !SET.bgm && bgmCtx.suspend(), 400); }
    if (SET.bgm) { bgmKick(); if (bgmCur) bgmShowTitle(bgmCur.title); }
  });
  mkBtns(document.getElementById('optBgmVol'), BGM_VOLS.map(v => v.name), SET.bgmVol, i => { SET.bgmVol = i; applySettings(); });
}
