// ============================================================
// FISH TYCOON 2 — DECORATION CATALOG
// ============================================================

export const DECOR_CATEGORIES = {
  substrate: { label: 'Substrate',   emoji: '🪨' },
  plant:     { label: 'Plants',      emoji: '🌿' },
  rock:      { label: 'Rocks',       emoji: '🗿' },
  structure: { label: 'Structures',  emoji: '🏛️' },
  coral:     { label: 'Coral',       emoji: '🪸' },
  special:   { label: 'Special',     emoji: '✨' },
};

// Each decoration has an SVG render function that takes (x, y, scale)
// viewBox coords: tank SVG is 800×400, decorations sit in lower half (y 200–400)
export const DECOR_CATALOG = [
  // ── Substrate ─────────────────────────────────────────────
  {
    id: 'gravel_white',
    label: 'White Gravel',
    category: 'substrate',
    cost: 0,
    startOwned: 1,
    desc: 'Clean white pebbles covering the tank floor.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y}" rx="${44*s}" ry="${14*s}" fill="#d0ccc0"/>
      <ellipse cx="${x}" cy="${y-2}" rx="${40*s}" ry="${10*s}" fill="#e8e4da"/>
      ${[[-16,0],[0,-4],[14,2],[-8,4],[10,-2]].map(([dx,dy],i)=>`<ellipse cx="${x+dx*s}" cy="${y+dy*s}" rx="${5*s}" ry="${3.5*s}" fill="${['#ccc8bc','#dedad0','#e4e0d4'][i%3]}"/>`).join('')}
    `,
  },
  {
    id: 'gravel_dark',
    label: 'Dark Gravel',
    category: 'substrate',
    cost: 20,
    startOwned: 0,
    desc: 'Volcanic black and grey pebbles.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y}" rx="${44*s}" ry="${14*s}" fill="#3a3830"/>
      <ellipse cx="${x}" cy="${y-2}" rx="${40*s}" ry="${10*s}" fill="#4a4840"/>
      ${[[-16,0],[0,-4],[14,2],[-8,4],[10,-2]].map(([dx,dy],i)=>`<ellipse cx="${x+dx*s}" cy="${y+dy*s}" rx="${5*s}" ry="${3.5*s}" fill="${['#504e46','#3c3a32','#5a5850'][i%3]}"/>`).join('')}
    `,
  },
  {
    id: 'sand',
    label: 'Golden Sand',
    category: 'substrate',
    cost: 35,
    startOwned: 0,
    desc: 'Smooth tropical sand — fish love it.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y}" rx="${46*s}" ry="${15*s}" fill="#c8a050"/>
      <ellipse cx="${x}" cy="${y-2}" rx="${42*s}" ry="${11*s}" fill="#deb860"/>
      <ellipse cx="${x+2}" cy="${y-4}" rx="${36*s}" ry="${7*s}" fill="#e8c870" opacity="0.6"/>
    `,
  },

  // ── Plants ────────────────────────────────────────────────
  {
    id: 'plant_green',
    label: 'Green Weed',
    category: 'plant',
    cost: 0,
    startOwned: 1,
    desc: 'Basic green aquatic plant.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x},${y} C${x-8*s},${y-30*s} ${x-18*s},${y-50*s} ${x-12*s},${y-70*s}" stroke="#3a8040" stroke-width="${5*s}" fill="none" stroke-linecap="round"/>
      <path d="M${x},${y} C${x+6*s},${y-25*s} ${x+16*s},${y-44*s} ${x+10*s},${y-64*s}" stroke="#2d7030" stroke-width="${5*s}" fill="none" stroke-linecap="round"/>
      <path d="M${x},${y} C${x-3*s},${y-18*s} ${x+8*s},${y-32*s} ${x+4*s},${y-48*s}" stroke="#4a9050" stroke-width="${4*s}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${x-12*s}" cy="${y-70*s}" rx="${10*s}" ry="${5*s}" fill="#50a060" transform="rotate(-20,${x-12*s},${y-70*s})"/>
      <ellipse cx="${x+10*s}" cy="${y-64*s}" rx="${10*s}" ry="${5*s}" fill="#408050" transform="rotate(15,${x+10*s},${y-64*s})"/>
    `,
  },
  {
    id: 'plant_red',
    label: 'Red Ludwigia',
    category: 'plant',
    cost: 45,
    startOwned: 0,
    desc: 'Vivid red aquatic plant — a show-stopper.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x},${y} C${x-6*s},${y-28*s} ${x-14*s},${y-48*s} ${x-8*s},${y-68*s}" stroke="#904020" stroke-width="${5*s}" fill="none" stroke-linecap="round"/>
      <path d="M${x},${y} C${x+8*s},${y-22*s} ${x+18*s},${y-40*s} ${x+12*s},${y-60*s}" stroke="#a04828" stroke-width="${5*s}" fill="none" stroke-linecap="round"/>
      <path d="M${x},${y} C${x+2*s},${y-16*s} ${x-10*s},${y-30*s} ${x-6*s},${y-46*s}" stroke="#c05030" stroke-width="${4*s}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${x-8*s}" cy="${y-68*s}" rx="${10*s}" ry="${5*s}" fill="#d06040" transform="rotate(-18,${x-8*s},${y-68*s})"/>
      <ellipse cx="${x+12*s}" cy="${y-60*s}" rx="${10*s}" ry="${5*s}" fill="#b04030" transform="rotate(14,${x+12*s},${y-60*s})"/>
    `,
  },
  {
    id: 'kelp_tall',
    label: 'Giant Kelp',
    category: 'plant',
    cost: 80,
    startOwned: 0,
    desc: 'Towering kelp sways hypnotically.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x},${y} C${x+10*s},${y-40*s} ${x-8*s},${y-80*s} ${x+12*s},${y-120*s}" stroke="#2d8050" stroke-width="${7*s}" fill="none" stroke-linecap="round"/>
      <path d="M${x+4*s},${y} C${x+16*s},${y-35*s} ${x},${y-72*s} ${x+18*s},${y-110*s}" stroke="#359060" stroke-width="${5*s}" fill="none" stroke-linecap="round"/>
      ${[0,1,2,3].map(i=>`<path d="M${x+(i%2?8:-4)*s},${y-(28+i*28)*s} Q${x+(i%2?28:-22)*s},${y-(38+i*28)*s} ${x+(i%2?18:-14)*s},${y-(28+i*28)*s}" stroke="#40a060" stroke-width="${3*s}" fill="none"/>`).join('')}
    `,
  },
  {
    id: 'grass_carpet',
    label: 'Grass Carpet',
    category: 'plant',
    cost: 120,
    startOwned: 0,
    desc: 'Dense ground-cover grass — lush and natural.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      ${Array.from({length:16},(_,i)=>{const bx=x-36*s+i*5*s; return `<path d="M${bx},${y} Q${bx+(i%2?3:-3)*s},${y-18*s} ${bx+(i%3-1)*2*s},${y-28*s}" stroke="${['#2a7030','#358040','#3a9048'][i%3]}" stroke-width="${2.5*s}" fill="none" stroke-linecap="round"/>`}).join('')}
    `,
  },

  // ── Rocks ─────────────────────────────────────────────────
  {
    id: 'rock_small',
    label: 'Small Rock',
    category: 'rock',
    cost: 15,
    startOwned: 0,
    desc: 'A smooth river stone.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y}" rx="${18*s}" ry="${12*s}" fill="#607080"/>
      <ellipse cx="${x-3*s}" cy="${y-3*s}" rx="${14*s}" ry="${8*s}" fill="#708090"/>
      <ellipse cx="${x-6*s}" cy="${y-5*s}" rx="${6*s}" ry="${3*s}" fill="#8090a0" opacity="0.6"/>
    `,
  },
  {
    id: 'rock_arch',
    label: 'Rock Arch',
    category: 'rock',
    cost: 90,
    startOwned: 0,
    desc: 'A dramatic stone arch — fish love to swim through.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x-30*s}" y="${y-50*s}" width="${18*s}" height="${50*s}" rx="${6*s}" fill="#607080"/>
      <rect x="${x+12*s}" y="${y-50*s}" width="${18*s}" height="${50*s}" rx="${6*s}" fill="#607080"/>
      <path d="M${x-30*s},${y-50*s} Q${x},${y-88*s} ${x+30*s},${y-50*s}" stroke="#708090" stroke-width="${16*s}" fill="none"/>
      <path d="M${x-26*s},${y-50*s} Q${x},${y-82*s} ${x+26*s},${y-50*s}" stroke="#8090a4" stroke-width="${6*s}" fill="none" opacity="0.5"/>
      <ellipse cx="${x-21*s}" cy="${y-4*s}" rx="${9*s}" ry="${4*s}" fill="#506070"/>
      <ellipse cx="${x+21*s}" cy="${y-4*s}" rx="${9*s}" ry="${4*s}" fill="#506070"/>
    `,
  },
  {
    id: 'pebble_cluster',
    label: 'Pebble Cluster',
    category: 'rock',
    cost: 25,
    startOwned: 0,
    desc: 'A group of colourful pebbles.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      ${[[-14,0,'#8a7060'],[-4,-5,'#607080'],[6,2,'#708870'],[-20,-3,'#706880'],[16,-2,'#806858']].map(([dx,dy,c],i)=>`<ellipse cx="${x+dx*s}" cy="${y+dy*s}" rx="${10*s}" ry="${7*s}" fill="${c}"/><ellipse cx="${x+dx*s-2*s}" cy="${y+dy*s-2*s}" rx="${5*s}" ry="${3*s}" fill="white" opacity="0.15"/>`).join('')}
    `,
  },

  // ── Structures ────────────────────────────────────────────
  {
    id: 'castle',
    label: 'Mini Castle',
    category: 'structure',
    cost: 150,
    startOwned: 0,
    desc: 'A classic aquarium castle ruin.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x-24*s}" y="${y-55*s}" width="${20*s}" height="${55*s}" rx="${2*s}" fill="#5a6878"/>
      <rect x="${x+4*s}"  y="${y-55*s}" width="${20*s}" height="${55*s}" rx="${2*s}" fill="#5a6878"/>
      <rect x="${x-32*s}" y="${y-65*s}" width="${12*s}" height="${12*s}" rx="${1*s}" fill="#4a5868"/>
      <rect x="${x-20*s}" y="${y-62*s}" width="${12*s}" height="${9*s}"  rx="${1*s}" fill="#4a5868"/>
      <rect x="${x+8*s}"  y="${y-65*s}" width="${12*s}" height="${12*s}" rx="${1*s}" fill="#4a5868"/>
      <rect x="${x+20*s}" y="${y-62*s}" width="${12*s}" height="${9*s}"  rx="${1*s}" fill="#4a5868"/>
      <rect x="${x-24*s}" y="${y-45*s}" width="${48*s}" height="${12*s}" rx="${2*s}" fill="#5a6878"/>
      <rect x="${x-8*s}"  y="${y-55*s}" width="${16*s}" height="${55*s}" rx="${2*s}" fill="#506070"/>
      <rect x="${x-6*s}"  y="${y-40*s}" width="${12*s}" height="${20*s}" rx="${2*s}" fill="#1a2838" opacity="0.8"/>
      <rect x="${x-14*s}" y="${y-30*s}" width="${8*s}"  height="${12*s}" rx="${1*s}" fill="#1a2838" opacity="0.6"/>
      <rect x="${x+6*s}"  y="${y-30*s}" width="${8*s}"  height="${12*s}" rx="${1*s}" fill="#1a2838" opacity="0.6"/>
    `,
  },
  {
    id: 'shipwreck',
    label: 'Shipwreck',
    category: 'structure',
    cost: 200,
    startOwned: 0,
    desc: 'A sunken ship — mystery beneath the waves.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x-50*s},${y} L${x-60*s},${y-22*s} L${x+60*s},${y-22*s} L${x+50*s},${y} Z" fill="#6a5040"/>
      <path d="M${x-50*s},${y} L${x-60*s},${y-22*s} L${x+60*s},${y-22*s} L${x+50*s},${y} Z" fill="none" stroke="#4a3828" stroke-width="${2*s}"/>
      <rect x="${x-10*s}" y="${y-48*s}" width="${8*s}" height="${28*s}" rx="${1*s}" fill="#584838" transform="rotate(-12,${x},${y-22*s})"/>
      <path d="M${x-8*s},${y-48*s} L${x+12*s},${y-42*s} L${x+4*s},${y-28*s} Z" fill="#7a6850" opacity="0.7"/>
      ${[[-30,-18],[-10,-16],[10,-18],[30,-16]].map(([dx,dy],i)=>`<rect x="${x+dx*s}" y="${y+dy*s}" width="${10*s}" height="${8*s}" rx="${1*s}" fill="#1a1210" opacity="0.6"/>`).join('')}
      <ellipse cx="${x}" cy="${y}" rx="${52*s}" ry="${8*s}" fill="#584838"/>
    `,
  },
  {
    id: 'treasure_chest',
    label: 'Treasure Chest',
    category: 'structure',
    cost: 110,
    startOwned: 0,
    desc: 'An open chest spilling gold coins.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x-18*s}" y="${y-20*s}" width="${36*s}" height="${20*s}" rx="${2*s}" fill="#8a5820"/>
      <path d="M${x-18*s},${y-20*s} Q${x},${y-34*s} ${x+18*s},${y-20*s}" fill="#a06828"/>
      <rect x="${x-16*s}" y="${y-18*s}" width="${32*s}" height="${3*s}" fill="#c8901c"/>
      <rect x="${x-4*s}"  y="${y-26*s}" width="${8*s}"  height="${8*s}"  rx="${2*s}" fill="#c8901c"/>
      <circle cx="${x}" cy="${y-22*s}" r="${3*s}" fill="#e8b030"/>
      ${[[-8,-2],[0,-8],[8,-2],[-4,-6],[4,-6]].map(([dx,dy])=>`<circle cx="${x+dx*s}" cy="${y+dy*s}" r="${3*s}" fill="#f0c030" opacity="0.9"/>`).join('')}
    `,
  },

  // ── Coral ─────────────────────────────────────────────────
  {
    id: 'coral_red',
    label: 'Red Coral',
    category: 'coral',
    cost: 60,
    startOwned: 0,
    desc: 'Branching red coral — a reef staple.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x},${y} L${x},${y-40*s}" stroke="#c04040" stroke-width="${5*s}" stroke-linecap="round"/>
      <path d="M${x},${y-20*s} L${x-16*s},${y-36*s}" stroke="#c04040" stroke-width="${4*s}" stroke-linecap="round"/>
      <path d="M${x},${y-20*s} L${x+14*s},${y-34*s}" stroke="#c04040" stroke-width="${4*s}" stroke-linecap="round"/>
      <path d="M${x},${y-34*s} L${x-10*s},${y-48*s}" stroke="#d04848" stroke-width="${3*s}" stroke-linecap="round"/>
      <path d="M${x-16*s},${y-36*s} L${x-22*s},${y-50*s}" stroke="#d04848" stroke-width="${3*s}" stroke-linecap="round"/>
      <path d="M${x+14*s},${y-34*s} L${x+20*s},${y-48*s}" stroke="#d04848" stroke-width="${3*s}" stroke-linecap="round"/>
      ${[[0,-40],[-16,-36],[14,-34],[-10,-48],[-22,-50],[20,-48]].map(([dx,dy])=>`<circle cx="${x+dx*s}" cy="${y+dy*s}" r="${4*s}" fill="#e05050"/>`).join('')}
    `,
  },
  {
    id: 'coral_brain',
    label: 'Brain Coral',
    category: 'coral',
    cost: 75,
    startOwned: 0,
    desc: 'A massive rounded brain coral.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y-14*s}" rx="${24*s}" ry="${18*s}" fill="#c89040"/>
      <ellipse cx="${x}" cy="${y-16*s}" rx="${22*s}" ry="${16*s}" fill="#d8a050"/>
      ${[[-10,-6],[0,-2],[10,-6],[-6,4],[6,4],[0,8],[-14,0],[14,0]].map(([dx,dy])=>`<path d="M${x+dx*s-6*s},${y+dy*s-16*s} Q${x+dx*s},${y+dy*s-20*s} ${x+dx*s+6*s},${y+dy*s-16*s}" stroke="#a07030" stroke-width="${2*s}" fill="none"/>`).join('')}
      <ellipse cx="${x}" cy="${y-4*s}" rx="${22*s}" ry="${5*s}" fill="#b87828" opacity="0.5"/>
    `,
  },
  {
    id: 'anemone',
    label: 'Anemone',
    category: 'coral',
    cost: 85,
    startOwned: 0,
    desc: 'Waving tentacles in vivid pink.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y-4*s}" rx="${18*s}" ry="${8*s}" fill="#c05090"/>
      ${Array.from({length:9},(_,i)=>{const angle=(i/9)*Math.PI; const bx=x+(Math.cos(angle)*14-7)*s; return `<path d="M${bx},${y-4*s} Q${bx+(i%2?6:-6)*s},${y-24*s} ${bx+(i%2?2:-2)*s},${y-38*s}" stroke="#e060a0" stroke-width="${3*s}" fill="none" stroke-linecap="round"/><circle cx="${bx+(i%2?2:-2)*s}" cy="${y-38*s}" r="${4.5*s}" fill="#ff80c0"/>`}).join('')}
    `,
  },

  // ── Special ───────────────────────────────────────────────
  {
    id: 'sunken_statue',
    label: 'Sunken Statue',
    category: 'special',
    cost: 250,
    startOwned: 0,
    desc: 'An ancient statue, half-buried — mysterious.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x-10*s}" y="${y-60*s}" width="${20*s}" height="${60*s}" rx="${3*s}" fill="#607858"/>
      <ellipse cx="${x}" cy="${y-60*s}" rx="${12*s}" ry="${14*s}" fill="#708060"/>
      <ellipse cx="${x}" cy="${y-62*s}" rx="${9*s}"  ry="${10*s}" fill="#809070" opacity="0.7"/>
      <rect x="${x-18*s}" y="${y-35*s}" width="${10*s}" height="${6*s}" rx="${2*s}" fill="#607858" transform="rotate(-10,${x-13*s},${y-32*s})"/>
      <rect x="${x+8*s}"  y="${y-32*s}" width="${10*s}" height="${6*s}" rx="${2*s}" fill="#607858" transform="rotate(8,${x+13*s},${y-29*s})"/>
      <ellipse cx="${x-4*s}" cy="${y-58*s}" rx="${3*s}" ry="${2*s}" fill="#1a2818" opacity="0.7"/>
      <ellipse cx="${x+4*s}" cy="${y-58*s}" rx="${3*s}" ry="${2*s}" fill="#1a2818" opacity="0.7"/>
      <path d="M${x-4*s},${y-52*s} Q${x},${y-50*s} ${x+4*s},${y-52*s}" stroke="#1a2818" stroke-width="${1.5*s}" fill="none" opacity="0.7"/>
      <ellipse cx="${x}" cy="${y}" rx="${14*s}" ry="${5*s}" fill="#506048" opacity="0.6"/>
    `,
  },
  {
    id: 'bubble_wand',
    label: 'Bubble Wand',
    category: 'special',
    cost: 55,
    startOwned: 0,
    desc: 'Creates a stream of rising bubbles.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x-3*s}" y="${y-50*s}" width="${6*s}" height="${50*s}" rx="${3*s}" fill="#4070c0"/>
      <rect x="${x-8*s}" y="${y-4*s}" width="${16*s}" height="${6*s}" rx="${3*s}" fill="#2050a0"/>
      ${[0,1,2].map(i=>`<circle cx="${x+(i%2?4:-4)*s}" cy="${y-(15+i*14)*s}" r="${(3-i*0.5)*s}" fill="none" stroke="rgba(180,220,255,0.7)" stroke-width="${1.5*s}"/>`).join('')}
    `,
  },
  {
    id: 'neon_sign',
    label: 'Neon Sign',
    category: 'special',
    cost: 180,
    startOwned: 0,
    desc: 'A glowing "FISH" neon sign. Pure vibes.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x-32*s}" y="${y-28*s}" width="${64*s}" height="${28*s}" rx="${4*s}" fill="#0a0e18" stroke="#1a2840" stroke-width="${1.5*s}"/>
      <text x="${x}" y="${y-8*s}" text-anchor="middle" font-size="${18*s}" font-weight="bold" font-family="monospace"
            fill="#ff60a0" style="filter:drop-shadow(0 0 4px #ff60a0)">FISH</text>
      <rect x="${x-32*s}" y="${y-28*s}" width="${64*s}" height="${28*s}" rx="${4*s}" fill="none" stroke="#ff60a0" stroke-width="${1.5*s}" opacity="0.4"/>
    `,
  },

  // ── Achievement-Exclusive Decorations ─────────────────────
  // These are NOT purchasable. They are granted only by specific achievements.
  // achievementId links back to the achievement that unlocks them.
  {
    id: 'golden_coral',
    label: 'Golden Coral',
    category: 'coral',
    cost: 0,
    startOwned: 0,
    achievementLocked: true,
    achievementId: 'tank_happy',
    achievementLabel: 'Happy Habitat',
    desc: 'Radiant coral carved from solid gold. Awarded for reaching 100% tank happiness.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x},${y} L${x},${y-44*s}" stroke="#c8901c" stroke-width="${5*s}" stroke-linecap="round"/>
      <path d="M${x},${y-22*s} L${x-18*s},${y-40*s}" stroke="#c8901c" stroke-width="${4*s}" stroke-linecap="round"/>
      <path d="M${x},${y-22*s} L${x+16*s},${y-38*s}" stroke="#c8901c" stroke-width="${4*s}" stroke-linecap="round"/>
      <path d="M${x},${y-38*s} L${x-12*s},${y-54*s}" stroke="#e0a830" stroke-width="${3*s}" stroke-linecap="round"/>
      <path d="M${x-18*s},${y-40*s} L${x-24*s},${y-54*s}" stroke="#e0a830" stroke-width="${3*s}" stroke-linecap="round"/>
      <path d="M${x+16*s},${y-38*s} L${x+22*s},${y-52*s}" stroke="#e0a830" stroke-width="${3*s}" stroke-linecap="round"/>
      ${[[0,-44],[-18,-40],[16,-38],[-12,-54],[-24,-54],[22,-52]].map(([dx,dy])=>`<circle cx="${x+dx*s}" cy="${y+dy*s}" r="${5*s}" fill="#f0c030"/><circle cx="${x+dx*s}" cy="${y+dy*s}" r="${2.5*s}" fill="#fff8e0" opacity="0.7"/>`).join('')}
      <ellipse cx="${x}" cy="${y}" rx="${10*s}" ry="${4*s}" fill="#a07010" opacity="0.5"/>
    `,
  },
  {
    id: 'ancient_ruin',
    label: 'Ancient Ruin',
    category: 'structure',
    cost: 0,
    startOwned: 0,
    achievementLocked: true,
    achievementId: 'species_10',
    achievementLabel: 'Geneticist',
    desc: 'A moss-covered column from a forgotten civilisation. Awarded for discovering 10 species.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x-12*s}" y="${y-72*s}" width="${24*s}" height="${72*s}" rx="${3*s}" fill="#6a7860"/>
      <rect x="${x-14*s}" y="${y-74*s}" width="${28*s}" height="${8*s}"  rx="${2*s}" fill="#5a6850"/>
      <rect x="${x-14*s}" y="${y-10*s}" width="${28*s}" height="${10*s}" rx="${2*s}" fill="#5a6850"/>
      ${[[0,28],[0,48],[0,62]].map(([_,yOff])=>`<rect x="${x-10*s}" y="${y-yOff*s}" width="${20*s}" height="${3*s}" fill="#4a5840" opacity="0.6"/>`).join('')}
      <path d="M${x-10*s},${y-60*s} Q${x-5*s},${y-55*s} ${x-8*s},${y-40*s}" stroke="#4a8040" stroke-width="${3*s}" fill="none" opacity="0.8" stroke-linecap="round"/>
      <path d="M${x+6*s},${y-50*s} Q${x+12*s},${y-44*s} ${x+9*s},${y-30*s}" stroke="#4a8040" stroke-width="${2.5*s}" fill="none" opacity="0.7" stroke-linecap="round"/>
      <ellipse cx="${x}" cy="${y}" rx="${16*s}" ry="${5*s}" fill="#4a5840" opacity="0.5"/>
    `,
  },
  {
    id: 'sunken_galleon',
    label: 'Sunken Galleon',
    category: 'structure',
    cost: 0,
    startOwned: 0,
    achievementLocked: true,
    achievementId: 'three_tanks',
    achievementLabel: 'Aquarium Baron',
    desc: 'A grand galleon lost to the deep. Awarded for unlocking all three tanks.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x-56*s},${y} L${x-66*s},${y-28*s} L${x+66*s},${y-28*s} L${x+56*s},${y} Z" fill="#6a4828"/>
      <path d="M${x-56*s},${y} L${x-66*s},${y-28*s} L${x+66*s},${y-28*s} L${x+56*s},${y} Z" fill="none" stroke="#4a3020" stroke-width="${2*s}"/>
      <rect x="${x-12*s}" y="${y-58*s}" width="${9*s}" height="${32*s}" rx="${1*s}" fill="#4a3820" transform="rotate(-10,${x},${y-28*s})"/>
      <rect x="${x+8*s}"  y="${y-52*s}" width="${7*s}" height="${26*s}" rx="${1*s}" fill="#4a3820" transform="rotate(6,${x},${y-28*s})"/>
      <path d="M${x-10*s},${y-56*s} L${x+14*s},${y-48*s} L${x+6*s},${y-32*s} Z" fill="#7a6040" opacity="0.5"/>
      ${[[-40,-24],[-20,-22],[0,-24],[20,-22],[40,-24]].map(([dx,dy])=>`<rect x="${x+dx*s}" y="${y+dy*s}" width="${10*s}" height="${8*s}" rx="${1*s}" fill="#1a1208" opacity="0.65"/>`).join('')}
      <ellipse cx="${x}" cy="${y}" rx="${58*s}" ry="${9*s}" fill="#58401e"/>
      <path d="M${x-30*s},${y-28*s} Q${x},${y-22*s} ${x+30*s},${y-28*s}" stroke="#3a2810" stroke-width="${3*s}" fill="none" opacity="0.5"/>
    `,
  },
  {
    id: 'magic_orb',
    label: 'Magic Orb',
    category: 'special',
    cost: 0,
    startOwned: 0,
    achievementLocked: true,
    achievementId: 'magic_3',
    achievementLabel: 'Halfway There',
    desc: 'A softly pulsing orb of arcane energy. Awarded for discovering 3 Magic Fish.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <circle cx="${x}" cy="${y-22*s}" r="${22*s}" fill="url(#orbGrad${x|0})" opacity="0.92"/>
      <defs>
        <radialGradient id="orbGrad${x|0}" cx="38%" cy="35%">
          <stop offset="0%"   stop-color="#e0b8ff"/>
          <stop offset="55%"  stop-color="#8840e0"/>
          <stop offset="100%" stop-color="#3010a0"/>
        </radialGradient>
      </defs>
      <circle cx="${x-6*s}" cy="${y-30*s}" r="${6*s}" fill="white" opacity="0.2"/>
      ${[0,60,120,180,240,300].map((deg,i)=>{const r2=16*s,rx=x+Math.cos(deg*Math.PI/180)*r2,ry=y-22*s+Math.sin(deg*Math.PI/180)*r2; return `<circle cx="${rx}" cy="${ry}" r="${2.5*s}" fill="#c080ff" opacity="${0.3+i*0.08}"/>`}).join('')}
      <circle cx="${x}" cy="${y-22*s}" r="${22*s}" fill="none" stroke="#b060ff" stroke-width="${1.5*s}" opacity="0.5"/>
      <rect x="${x-4*s}" y="${y-2*s}" width="${8*s}" height="${4*s}" rx="${2*s}" fill="#6030a0"/>
      <ellipse cx="${x}" cy="${y}" rx="${14*s}" ry="${4*s}" fill="#5020a0" opacity="0.4"/>
    `,
  },
  {
    id: 'legend_throne',
    label: 'Legend Throne',
    category: 'special',
    cost: 0,
    startOwned: 0,
    achievementLocked: true,
    achievementId: 'magic_7',
    achievementLabel: 'Legend of the Deep',
    desc: 'An ancient coral throne fit for the ocean\'s ruler. Awarded for discovering all 7 Magic Fish.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <!-- seat and back -->
      <rect x="${x-26*s}" y="${y-50*s}" width="${52*s}" height="${8*s}" rx="${3*s}" fill="#1a3060"/>
      <rect x="${x-22*s}" y="${y-50*s}" width="${44*s}" height="${50*s}" rx="${2*s}" fill="#1e3870"/>
      <!-- armrests -->
      <rect x="${x-32*s}" y="${y-38*s}" width="${12*s}" height="${6*s}" rx="${2*s}" fill="#1a3060"/>
      <rect x="${x+20*s}" y="${y-38*s}" width="${12*s}" height="${6*s}" rx="${2*s}" fill="#1a3060"/>
      <!-- legs -->
      <rect x="${x-20*s}" y="${y-4*s}" width="${8*s}" height="${6*s}" rx="${1*s}" fill="#162850"/>
      <rect x="${x+12*s}" y="${y-4*s}" width="${8*s}" height="${6*s}" rx="${1*s}" fill="#162850"/>
      <!-- star emblem -->
      <text x="${x}" y="${y-22*s}" text-anchor="middle" font-size="${22*s}" style="filter:drop-shadow(0 0 5px #f0c040)">🌟</text>
      <!-- crown finials -->
      ${[-20,0,20].map((dx,i)=>`<path d="M${x+dx*s},${y-50*s} L${x+dx*s},${y-62*s} L${x+(dx+6)*s},${y-56*s} L${x+(dx+12)*s},${y-62*s} L${x+(dx+12)*s},${y-50*s}" fill="${['#c8901c','#e0b030','#c8901c'][i]}" stroke="#a07010" stroke-width="${s}"/>`).join('')}
      <!-- gold trim -->
      <rect x="${x-26*s}" y="${y-52*s}" width="${52*s}" height="${3*s}" rx="${1*s}" fill="#e0b030" opacity="0.8"/>
      <rect x="${x-24*s}" y="${y-2*s}"  width="${48*s}" height="${3*s}" rx="${1*s}" fill="#e0b030" opacity="0.6"/>
    `,
  },
];

export function getDecorById(id) {
  return DECOR_CATALOG.find(d => d.id === id) || null;
}

export function getStarterOwnedDecor() {
  const owned = {};
  for (const d of DECOR_CATALOG) {
    if (d.startOwned > 0) owned[d.id] = d.startOwned;
  }
  return owned;
}

// Default decoration layout for a new tank
export function getDefaultDecorations() {
  return {
    owned: getStarterOwnedDecor(),
    placed: [
      { instanceId: 'init_gravel', type: 'gravel_white', x: 400, y: 395, scale: 1.0 },
      { instanceId: 'init_plant1', type: 'plant_green',  x: 680, y: 380, scale: 1.0 },
      { instanceId: 'init_plant2', type: 'plant_green',  x: 120, y: 375, scale: 0.85 },
    ],
  };
}
