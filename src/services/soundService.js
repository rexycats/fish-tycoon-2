// ============================================================
// FISH TYCOON 2 — SOUND SERVICE v2
// Synthetic audio via Web Audio API + ambient music
// ============================================================

let _ctx = null;
let _enabled = true;
let _masterVol = 0.7;
let _musicVol = 0.4;
let _sfxVol = 0.8;
let _musicGain = null;
let _sfxGain = null;
let _musicPlaying = false;
let _musicNodes = [];

function ctx() {
  if (!_ctx) {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Create master gain structure: sfx → master, music → master
    _sfxGain = _ctx.createGain();
    _sfxGain.gain.value = _sfxVol * _masterVol;
    _sfxGain.connect(_ctx.destination);
    _musicGain = _ctx.createGain();
    _musicGain.gain.value = _musicVol * _masterVol;
    _musicGain.connect(_ctx.destination);
  }
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

export function setSoundEnabled(v) { _enabled = v; if (!v) stopMusic(); }
export function setMasterVolume(v) {
  _masterVol = v;
  if (_sfxGain) _sfxGain.gain.value = _sfxVol * _masterVol;
  if (_musicGain) _musicGain.gain.value = _musicVol * _masterVol;
  try { localStorage.setItem('ft2_masterVol', v); } catch {}
}
export function setMusicVolume(v) {
  _musicVol = v;
  if (_musicGain) _musicGain.gain.value = _musicVol * _masterVol;
  try { localStorage.setItem('ft2_musicVol', v); } catch {}
}
export function setSFXVolume(v) {
  _sfxVol = v;
  if (_sfxGain) _sfxGain.gain.value = _sfxVol * _masterVol;
  try { localStorage.setItem('ft2_sfxVol', v); } catch {}
}
export function getMasterVolume() {
  try { const v = localStorage.getItem('ft2_masterVol'); if (v) _masterVol = parseFloat(v); } catch {}
  return _masterVol;
}
export function getMusicVolume() {
  try { const v = localStorage.getItem('ft2_musicVol'); if (v) _musicVol = parseFloat(v); } catch {}
  return _musicVol;
}
export function getSFXVolume() {
  try { const v = localStorage.getItem('ft2_sfxVol'); if (v) _sfxVol = parseFloat(v); } catch {}
  return _sfxVol;
}

function playSfx(fn) {
  if (!_enabled) return;
  try { const c = ctx(); fn(c, _sfxGain); } catch { /* ignore */ }
}

// ── SFX ────────────────────────────────────────────────────
export function playCoin() {
  playSfx((c, dest) => {
    [660, 1047].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = 'sine'; o.frequency.value = freq;
      const t = c.currentTime + i * 0.08;
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.start(t); o.stop(t + 0.35);
    });
  });
}

export function playBubble() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(dest);
    o.type = 'sine';
    o.frequency.setValueAtTime(900, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(300, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.08, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
    o.start(c.currentTime); o.stop(c.currentTime + 0.12);
  });
}

export function playFeed() {
  playSfx((c, dest) => {
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.08), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    const src = c.createBufferSource(); src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.value = 2500; filt.Q.value = 0.8;
    const g = c.createGain();
    src.connect(filt); filt.connect(g); g.connect(dest);
    g.gain.setValueAtTime(0.35, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
    src.start(c.currentTime); src.stop(c.currentTime + 0.12);
  });
}

export function playDiscover() {
  playSfx((c, dest) => {
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = 'triangle'; o.frequency.value = freq;
      const t = c.currentTime + i * 0.11;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.start(t); o.stop(t + 0.35);
    });
  });
}

export function playBreed() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(dest);
    o.type = 'sine';
    o.frequency.setValueAtTime(330, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(660, c.currentTime + 0.28);
    g.gain.setValueAtTime(0.18, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.45);
    o.start(c.currentTime); o.stop(c.currentTime + 0.45);
  });
}

export function playSale() {
  playSfx((c, dest) => {
    [880, 1108, 1320].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = 'sine'; o.frequency.value = freq;
      const t = c.currentTime + i * 0.07;
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.start(t); o.stop(t + 0.25);
    });
  });
}

export function playWarning() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(dest);
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(120, c.currentTime);
    g.gain.setValueAtTime(0.08, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.18);
    o.start(c.currentTime); o.stop(c.currentTime + 0.18);
  });
}

// ── Ambient Music (procedural underwater soundscape) ───────
const SCALE = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3]; // C pentatonic

function createDroneLayer(c, freq, dest) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  const lfo = c.createOscillator(), lfoG = c.createGain();
  lfo.type = 'sine'; lfo.frequency.value = 0.08; lfoG.gain.value = 3;
  lfo.connect(lfoG); lfoG.connect(o.frequency);
  lfo.start();
  g.gain.value = 0.04;
  o.connect(g); g.connect(dest);
  o.start();
  return { osc: o, gain: g, lfo };
}

function scheduleNote(c, dest) {
  if (!_musicPlaying) return;
  const freq = SCALE[Math.floor(Math.random() * SCALE.length)] * (Math.random() < 0.3 ? 0.5 : 1);
  const o = c.createOscillator(), g = c.createGain();
  o.type = Math.random() < 0.5 ? 'sine' : 'triangle';
  o.frequency.value = freq;
  const filt = c.createBiquadFilter();
  filt.type = 'lowpass'; filt.frequency.value = 800;
  o.connect(filt); filt.connect(g); g.connect(dest);
  const now = c.currentTime;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.03, now + 0.5);
  g.gain.exponentialRampToValueAtTime(0.001, now + 4);
  o.start(now); o.stop(now + 4);
  // Schedule next note
  const nextDelay = 3000 + Math.random() * 5000;
  setTimeout(() => scheduleNote(c, dest), nextDelay);
}

export function startMusic() {
  if (_musicPlaying) return;
  _musicPlaying = true;
  const c = ctx();
  const dest = _musicGain;
  // Deep bass drone
  _musicNodes.push(createDroneLayer(c, 65.4, dest));  // C2
  _musicNodes.push(createDroneLayer(c, 98.0, dest));  // G2
  // Start melodic notes
  scheduleNote(c, dest);
  setTimeout(() => scheduleNote(c, dest), 2000);
}

function stopMusic() {
  _musicPlaying = false;
  for (const node of _musicNodes) {
    try { node.osc.stop(); node.lfo.stop(); } catch {}
  }
  _musicNodes = [];
}

export function isMusicPlaying() { return _musicPlaying; }

// ── Additional SFX for polish ──────────────────────────────
export function playClick() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(dest);
    o.type = 'sine'; o.frequency.value = 1200;
    g.gain.setValueAtTime(0.06, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
    o.start(c.currentTime); o.stop(c.currentTime + 0.06);
  });
}

export function playTabSwitch() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(dest);
    o.type = 'sine'; o.frequency.value = 800;
    o.frequency.exponentialRampToValueAtTime(1100, c.currentTime + 0.08);
    g.gain.setValueAtTime(0.05, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
    o.start(c.currentTime); o.stop(c.currentTime + 0.08);
  });
}

export function playDeath() {
  playSfx((c, dest) => {
    [220, 185, 147].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = 'sine'; o.frequency.value = freq;
      const t = c.currentTime + i * 0.2;
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.start(t); o.stop(t + 0.5);
    });
  });
}

export function playSick() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(dest);
    o.type = 'sawtooth'; o.frequency.value = 200;
    o.frequency.exponentialRampToValueAtTime(150, c.currentTime + 0.2);
    g.gain.setValueAtTime(0.04, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
    o.start(c.currentTime); o.stop(c.currentTime + 0.25);
  });
}

export function playLevelUp() {
  playSfx((c, dest) => {
    [523, 659, 784, 1047, 1319].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = 'triangle'; o.frequency.value = freq;
      const t = c.currentTime + i * 0.1;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.15, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o.start(t); o.stop(t + 0.4);
    });
  });
}

export function playSplash() {
  playSfx((c, dest) => {
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.15), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
    const src = c.createBufferSource(); src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 1500;
    const g = c.createGain();
    src.connect(filt); filt.connect(g); g.connect(dest);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
    src.start(c.currentTime);
  });
}
