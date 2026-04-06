// ============================================================
// FISH TYCOON 2 — SOUND SERVICE (Phase 7)
// Synthetic audio via Web Audio API — no external files needed
// ============================================================

let _ctx = null;
let _enabled = true;

function ctx() {
  if (!_ctx) {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

export function setSoundEnabled(v) { _enabled = v; }
export function isSoundEnabled() { return _enabled; }

function play(fn) {
  if (!_enabled) return;
  try { fn(ctx()); } catch (e) { /* ignore audio errors */ }
}

// Coin ding — two-tone ascending chime
export function playCoin() {
  play(c => {
    [660, 1047].forEach((freq, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sine';
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.08;
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.start(t); o.stop(t + 0.35);
    });
  });
}

// Bubble pop — descending pitch blip
export function playBubble() {
  play(c => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(900, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(300, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.08, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
    o.start(c.currentTime); o.stop(c.currentTime + 0.12);
  });
}

// Feed splash — short noise burst
export function playFeed() {
  play(c => {
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.08), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    const src = c.createBufferSource();
    src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.value = 2500; filt.Q.value = 0.8;
    const g = c.createGain();
    src.connect(filt); filt.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(0.35, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
    src.start(c.currentTime); src.stop(c.currentTime + 0.12);
  });
}

// Discovery fanfare — ascending arpeggio C-E-G-C
export function playDiscover() {
  play(c => {
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'triangle';
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.11;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.start(t); o.stop(t + 0.35);
    });
  });
}

// Egg collect / breed — warm rising tone
export function playBreed() {
  play(c => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(330, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(660, c.currentTime + 0.28);
    g.gain.setValueAtTime(0.18, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.45);
    o.start(c.currentTime); o.stop(c.currentTime + 0.45);
  });
}

// Sale complete — cash register style
export function playSale() {
  play(c => {
    [880, 1108, 1320].forEach((freq, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sine';
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.07;
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.start(t); o.stop(t + 0.25);
    });
  });
}

// Error / warning — low buzz
export function playWarning() {
  play(c => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(120, c.currentTime);
    g.gain.setValueAtTime(0.08, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.18);
    o.start(c.currentTime); o.stop(c.currentTime + 0.18);
  });
}
