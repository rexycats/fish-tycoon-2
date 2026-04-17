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

// Chord progression for ambient pads (Cmaj7 → Am7 → Fmaj7 → G)
const CHORD_PROGRESSION = [
  [130.8, 164.8, 196.0, 246.9],  // Cmaj7
  [110.0, 130.8, 164.8, 196.0],  // Am7
  [87.3,  110.0, 130.8, 164.8],  // Fmaj7
  [98.0,  123.5, 146.8, 174.6],  // G
];
let _chordIndex = 0;

function schedulePadChord(c, dest) {
  if (!_musicPlaying) return;
  const chord = CHORD_PROGRESSION[_chordIndex % CHORD_PROGRESSION.length];
  _chordIndex++;
  const now = c.currentTime;
  for (const freq of chord) {
    const o = c.createOscillator();
    const g = c.createGain();
    const filt = c.createBiquadFilter();
    o.type = 'sine';
    o.frequency.value = freq;
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(300, now);
    filt.frequency.linearRampToValueAtTime(600, now + 4);
    filt.frequency.linearRampToValueAtTime(200, now + 8);
    o.connect(filt);
    filt.connect(g);
    g.connect(dest);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.012, now + 2);
    g.gain.setValueAtTime(0.012, now + 6);
    g.gain.exponentialRampToValueAtTime(0.001, now + 9);
    o.start(now);
    o.stop(now + 9);
  }
  // Next chord in 8-12 seconds
  setTimeout(() => schedulePadChord(c, dest), 8000 + Math.random() * 4000);
}

function scheduleShimmer(c, dest) {
  if (!_musicPlaying) return;
  // High sparkle notes - like light through water
  const shimmerFreqs = [1047, 1175, 1319, 1568, 1760];
  const freq = shimmerFreqs[Math.floor(Math.random() * shimmerFreqs.length)];
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine';
  o.frequency.value = freq;
  o.connect(g);
  g.connect(dest);
  const now = c.currentTime;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.006, now + 0.1);
  g.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
  o.start(now);
  o.stop(now + 1.5);
  setTimeout(() => scheduleShimmer(c, dest), 5000 + Math.random() * 10000);
}

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
  // Ambient pad chords
  setTimeout(() => schedulePadChord(c, dest), 3000);
  // High shimmer sparkles
  setTimeout(() => scheduleShimmer(c, dest), 6000);
  // Ambient underwater noise — filtered white noise
  startAmbientNoise(c, dest);
  // Ambient bubble pops
  scheduleAmbientBubble(c, dest);
}

function startAmbientNoise(c, dest) {
  const bufferSize = c.sampleRate * 2;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = c.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  // Low-pass filter: deep underwater rumble
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 200;
  lp.Q.value = 1;
  // Slow modulation on cutoff
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 80;
  lfo.connect(lfoGain);
  lfoGain.connect(lp.frequency);
  lfo.start();
  const g = c.createGain();
  g.gain.value = 0.025;
  noise.connect(lp);
  lp.connect(g);
  g.connect(dest);
  noise.start();
  _musicNodes.push({ osc: noise, lfo });
}

function scheduleAmbientBubble(c, dest) {
  if (!_musicPlaying) return;
  const delay = 3 + Math.random() * 8;
  setTimeout(() => {
    if (!_musicPlaying) return;
    // Soft bubble pop
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(dest);
    o.type = 'sine';
    const freq = 400 + Math.random() * 600;
    o.frequency.setValueAtTime(freq, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq * 0.3, c.currentTime + 0.15);
    g.gain.setValueAtTime(0.015, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.15);
    scheduleAmbientBubble(c, dest);
  }, delay * 1000);
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

// ── JUICE LAYER: Scaled sound effects ──────────────────────

let _lastSfxType = '';
let _lastSfxTime = 0;

function sfxThrottle(type) {
  const now = Date.now();
  if (type === _lastSfxType && now - _lastSfxTime < 50) return false;
  _lastSfxType = type;
  _lastSfxTime = now;
  return true;
}

export function playSaleScaled(value) {
  if (!sfxThrottle('sale')) return;
  if (value >= 500) {
    // Legendary sale — full chord + shimmer
    playSfx((c, dest) => {
      [660, 830, 990, 1320, 1580].forEach((freq, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.connect(g); g.connect(dest);
        o.type = i < 3 ? 'sine' : 'triangle';
        o.frequency.value = freq;
        const t = c.currentTime + i * 0.06;
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        o.start(t); o.stop(t + 0.5);
      });
    });
  } else if (value >= 200) {
    // Big sale — 4-note arpeggio + ring
    playSfx((c, dest) => {
      [880, 1108, 1320, 1760].forEach((freq, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.connect(g); g.connect(dest);
        o.type = 'sine'; o.frequency.value = freq;
        const t = c.currentTime + i * 0.065;
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        o.start(t); o.stop(t + 0.35);
      });
    });
  } else if (value >= 50) {
    // Medium sale — ka-ching
    playSale();
  } else {
    // Small sale — single ding
    playSfx((c, dest) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.1, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
      o.start(c.currentTime); o.stop(c.currentTime + 0.2);
    });
  }
}

export function playDiscoverScaled(rarity) {
  if (!sfxThrottle('discover')) return;
  const rarityNotes = {
    common:    [[523, 659], 'triangle', 0.12, 0.3],
    uncommon:  [[523, 659, 784], 'triangle', 0.14, 0.35],
    rare:      [[523, 659, 784, 1047], 'triangle', 0.16, 0.4],
    epic:      [[440, 554, 659, 880, 1047], 'sine', 0.18, 0.5],
    legendary: [[392, 494, 587, 784, 988, 1175, 1568, 1976], 'sine', 0.15, 0.45],
  };
  const [notes, wave, vol, dur] = rarityNotes[rarity] || rarityNotes.common;
  playSfx((c, dest) => {
    notes.forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = wave; o.frequency.value = freq;
      const t = c.currentTime + i * 0.1;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.start(t); o.stop(t + dur);
    });
  });
}

export function playCoinScaled(amount) {
  if (!sfxThrottle('coin')) return;
  if (amount >= 500) {
    playSfx((c, dest) => {
      [660, 880, 1047, 1320, 1568].forEach((freq, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.connect(g); g.connect(dest);
        o.type = 'sine'; o.frequency.value = freq;
        const t = c.currentTime + i * 0.05;
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.start(t); o.stop(t + 0.3);
      });
    });
  } else if (amount >= 100) {
    playCoin();
  } else {
    playSfx((c, dest) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.06, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
      o.start(c.currentTime); o.stop(c.currentTime + 0.15);
    });
  }
}

export function playFishSelect(rarity) {
  if (!sfxThrottle('fishSelect')) return;
  const freqs = {
    common:    [600],
    uncommon:  [600, 800],
    rare:      [500, 700, 900],
    epic:      [440, 660, 880],
    legendary: [440, 554, 659, 880],
  };
  const notes = freqs[rarity] || freqs.common;
  playSfx((c, dest) => {
    notes.forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = notes.length > 2 ? 'triangle' : 'sine';
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.06;
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.start(t); o.stop(t + 0.18);
    });
  });
}

export function playAscension() {
  playSfx((c, dest) => {
    // Deep rising chord — ceremonial
    [261, 329, 392, 523, 659, 784, 1047, 1318].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = i < 4 ? 'sine' : 'triangle';
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.15;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      o.start(t); o.stop(t + 0.8);
    });
  });
}

export function playEquipInstall() {
  playSfx((c, dest) => {
    // Mechanical click + hum
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(dest);
    o.type = 'square';
    o.frequency.setValueAtTime(180, c.currentTime);
    o.frequency.linearRampToValueAtTime(120, c.currentTime + 0.15);
    g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
    o.start(); o.stop(c.currentTime + 0.2);
    // Confirmation tone
    const o2 = c.createOscillator(), g2 = c.createGain();
    o2.connect(g2); g2.connect(dest);
    o2.type = 'sine';
    o2.frequency.value = 660;
    g2.gain.setValueAtTime(0, c.currentTime + 0.15);
    g2.gain.linearRampToValueAtTime(0.1, c.currentTime + 0.18);
    g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
    o2.start(c.currentTime + 0.15); o2.stop(c.currentTime + 0.4);
  });
}

export function playRepair() {
  playSfx((c, dest) => {
    [400, 500, 600].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = 'triangle';
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.08;
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      o.start(t); o.stop(t + 0.12);
    });
  });
}

export function playHire() {
  playSfx((c, dest) => {
    // Warm welcome chord
    [330, 415, 494].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = 'sine';
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.06;
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.start(t); o.stop(t + 0.3);
    });
  });
}

export function playResearch() {
  playSfx((c, dest) => {
    // Ascending discovery sparkle
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = 'sine';
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.1;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.08, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.start(t); o.stop(t + 0.25);
    });
  });
}

export function playHatch() {
  playSfx((c, dest) => {
    // Crack + chime
    const noise = c.createBufferSource();
    const buf = c.createBuffer(1, c.sampleRate * 0.1, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.02));
    noise.buffer = buf;
    const ng = c.createGain();
    noise.connect(ng); ng.connect(dest);
    ng.gain.value = 0.15;
    noise.start();
    // Chime after crack
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(dest);
    o.type = 'sine';
    o.frequency.value = 880;
    const t = c.currentTime + 0.08;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.1, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    o.start(t); o.stop(t + 0.4);
  });
}

export function playVictory() {
  playSfx((c, dest) => {
    // Triumphant fanfare
    const notes = [523, 659, 784, 1047, 784, 1047, 1318];
    notes.forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = i < 4 ? 'sine' : 'triangle';
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.12;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.start(t); o.stop(t + 0.35);
    });
  });
}

export function playNotif() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(dest);
    o.type = 'sine';
    o.frequency.setValueAtTime(600, c.currentTime);
    o.frequency.linearRampToValueAtTime(800, c.currentTime + 0.08);
    g.gain.setValueAtTime(0.08, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
    o.start(); o.stop(c.currentTime + 0.15);
  });
}

export function playAchievement() {
  playSfx((c, dest) => {
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(dest);
      o.type = 'triangle';
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.08;
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.start(t); o.stop(t + 0.5);
    });
  });
}
