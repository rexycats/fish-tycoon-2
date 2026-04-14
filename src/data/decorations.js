// ============================================================
// FISH TYCOON 2 — DECORATION CATALOG
// ============================================================

export const DECOR_CATEGORIES = {
  substrate: { label: 'Substrate',   emoji: '' },
  plant:     { label: 'Plants',      emoji: '' },
  rock:      { label: 'Rocks',       emoji: '' },
  structure: { label: 'Structures',  emoji: '' },
  coral:     { label: 'Coral',       emoji: '' },
  special:   { label: 'Special',     emoji: '' },
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
      ${[[-14,0,'#8a7060'],[-4,-5,'#607080'],[6,2,'#708870'],[-20,-3,'#706880'],[16,-2,'#806858']].map(([dx,dy,c],_i)=>`<ellipse cx="${x+dx*s}" cy="${y+dy*s}" rx="${10*s}" ry="${7*s}" fill="${c}"/><ellipse cx="${x+dx*s-2*s}" cy="${y+dy*s-2*s}" rx="${5*s}" ry="${3*s}" fill="white" opacity="0.15"/>`).join('')}
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
      ${[[-30,-18],[-10,-16],[10,-18],[30,-16]].map(([dx,dy],_i)=>`<rect x="${x+dx*s}" y="${y+dy*s}" width="${10*s}" height="${8*s}" rx="${1*s}" fill="#1a1210" opacity="0.6"/>`).join('')}
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
      <text x="${x}" y="${y-22*s}" text-anchor="middle" font-size="${22*s}" style="filter:drop-shadow(0 0 5px #f0c040)">★</text>
      <!-- crown finials -->
      ${[-20,0,20].map((dx,i)=>`<path d="M${x+dx*s},${y-50*s} L${x+dx*s},${y-62*s} L${x+(dx+6)*s},${y-56*s} L${x+(dx+12)*s},${y-62*s} L${x+(dx+12)*s},${y-50*s}" fill="${['#c8901c','#e0b030','#c8901c'][i]}" stroke="#a07010" stroke-width="${s}"/>`).join('')}
      <!-- gold trim -->
      <rect x="${x-26*s}" y="${y-52*s}" width="${52*s}" height="${3*s}" rx="${1*s}" fill="#e0b030" opacity="0.8"/>
      <rect x="${x-24*s}" y="${y-2*s}"  width="${48*s}" height="${3*s}" rx="${1*s}" fill="#e0b030" opacity="0.6"/>
    `,
  },
];

// ============================================================
// TANK THEMES
// Each theme is a cohesive visual package that transforms the
// whole tank at once: water colour, background scenery, and
// substrate. Individual decorations layer on top as accents.
// ============================================================

export const TANK_THEMES = [
  {
    id: 'tropical',
    label: 'Tropical Reef',
    emoji: '',
    cost: 0,
    startOwned: true,
    desc: 'Warm Caribbean blue with coral silhouettes and golden sand. The classic.',
    substrateId: 'sand',
    waterGradient: [
      { offset: '0%',   color: '#1a6ab8', opacity: 0.88 },
      { offset: '40%',  color: '#145898', opacity: 0.90 },
      { offset: '72%',  color: '#0e4480', opacity: 0.93 },
      { offset: '100%', color: '#0a2850', opacity: 0.96 },
    ],
    bgSvgFn: () => `
      <ellipse cx="100" cy="390" rx="80" ry="32" fill="#1a3050" opacity="0.30"/>
      <ellipse cx="700" cy="392" rx="90" ry="28" fill="#1a3050" opacity="0.28"/>
      <ellipse cx="400" cy="395" rx="120" ry="22" fill="#152840" opacity="0.25"/>
      <g opacity="0.28" fill="#162848">
        <path d="M30,400 Q48,360 38,322 Q55,290 42,258 Q58,278 52,322 Q65,360 78,400 Z"/>
        <path d="M350,400 Q372,378 360,348 Q382,320 365,296 Q386,318 376,354 Q390,375 402,400 Z"/>
        <path d="M680,400 Q695,370 685,342 Q700,315 690,288 Q708,310 700,348 Q714,372 724,400 Z"/>
      </g>
      ${[680,714,748].map((x,i) => `<path d="M${x},400 C${x+14},348 ${x-8},296 ${x+18},238 C${x+32},188 ${x+4},158 ${x+22},118" stroke="#1a5030" stroke-width="6" fill="none" opacity="0.22" class="kelp-sway" style="animation-delay:${i*0.8}s"/>`).join('')}
    `,
  },
  {
    id: 'deep_ocean',
    label: 'Deep Ocean',
    emoji: '',
    cost: 300,
    startOwned: false,
    desc: 'Near-black abyssal waters with bioluminescent streaks. Dramatic and moody.',
    substrateId: 'gravel_dark',
    waterGradient: [
      { offset: '0%',   color: '#0a1838', opacity: 0.92 },
      { offset: '35%',  color: '#06122c', opacity: 0.94 },
      { offset: '70%',  color: '#040e22', opacity: 0.96 },
      { offset: '100%', color: '#020818', opacity: 0.98 },
    ],
    bgSvgFn: () => `
      <ellipse cx="200" cy="388" rx="100" ry="28" fill="#0a1828" opacity="0.6"/>
      <ellipse cx="600" cy="390" rx="120" ry="24" fill="#080f1e" opacity="0.6"/>
      ${[['#00e8c8',120,280,0.12],['#40a0ff',340,200,0.10],['#80ffee',580,310,0.08],['#20d8ff',200,340,0.09],['#60c0ff',700,260,0.10]]
        .map(([c,x,y,o]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="4" fill="${c}" opacity="${o}"/>
          <ellipse cx="${x}" cy="${y}" rx="18" ry="6" fill="${c}" opacity="${o*0.4}"/>`)
        .join('')}
      <path d="M0,360 Q80,340 160,360 Q240,342 320,360 Q400,344 480,360 Q560,342 640,360 Q720,344 800,360" stroke="#00e8c8" stroke-width="1" fill="none" opacity="0.08"/>
      <g opacity="0.35" fill="#060e1c">
        <path d="M60,400 Q80,365 72,335 Q88,308 75,280 Q92,302 85,338 Q100,368 115,400 Z"/>
        <path d="M640,400 Q658,370 650,342 Q664,316 655,290 Q670,312 663,345 Q678,373 690,400 Z"/>
      </g>
    `,
  },
  {
    id: 'amazon',
    label: 'Amazon River',
    emoji: '',
    cost: 250,
    startOwned: false,
    desc: 'Teal-green jungle waters thick with roots and tropical foliage.',
    substrateId: 'gravel_dark',
    waterGradient: [
      { offset: '0%',   color: '#10583a', opacity: 0.85 },
      { offset: '40%',  color: '#0c4830', opacity: 0.88 },
      { offset: '72%',  color: '#083822', opacity: 0.92 },
      { offset: '100%', color: '#042818', opacity: 0.95 },
    ],
    bgSvgFn: () => `
      <ellipse cx="150" cy="392" rx="100" ry="24" fill="#062010" opacity="0.5"/>
      <ellipse cx="620" cy="390" rx="110" ry="22" fill="#041808" opacity="0.5"/>
      ${[60,180,320,460,580,700].map((x,i) => `
        <path d="M${x},400 C${x+10*(i%2?1:-1)},360 ${x-8*(i%3?1:-1)},310 ${x+15*(i%2?1:-1)},240 C${x+25*(i%3?1:-1)},180 ${x+5},150 ${x+18},100"
              stroke="${['#1a6030','#246838','#1c5828','#2a7040','#1e6030'][i%5]}" stroke-width="${7-i%3}" fill="none" opacity="0.30" class="kelp-sway" style="animation-delay:${i*0.5}s"/>
        <path d="M${x+20},400 C${x+30},370 ${x+40},330 ${x+15},280"
              stroke="#184820" stroke-width="4" fill="none" opacity="0.20"/>
      `).join('')}
      <g opacity="0.25" fill="#082810">
        ${[80,220,380,520,660].map((x,i) => `<ellipse cx="${x}" cy="${380+i%3*5}" rx="${55+i*8}" ry="18"/>`).join('')}
      </g>
    `,
  },
  {
    id: 'arctic',
    label: 'Arctic',
    emoji: '',
    cost: 350,
    startOwned: false,
    desc: 'Icy cyan waters with frost formations and pale volcanic floor.',
    substrateId: 'gravel_white',
    waterGradient: [
      { offset: '0%',   color: '#b8e8f8', opacity: 0.35 },
      { offset: '30%',  color: '#5abcdc', opacity: 0.72 },
      { offset: '65%',  color: '#1880b0', opacity: 0.90 },
      { offset: '100%', color: '#0a3848', opacity: 1.00 },
    ],
    bgSvgFn: () => `
      ${[[-30,340,50,160],[-10,380,30,180],[15,360,40,140],[0,400,28,200]].map(([dx,y,rx,ry],i) => `
        <ellipse cx="${150+dx+(i*180)}" cy="${y}" rx="${rx}" ry="${ry}"
                 fill="#c8ecf8" opacity="${0.12+i%3*0.04}"/>
      `).join('')}
      ${[[80,200,18],[200,180,14],[420,220,20],[560,190,16],[680,210,12]].map(([x,y,s]) => `
        <path d="M${x},${y+s} L${x},${y-s} M${x-s},${y} L${x+s},${y} M${x-s*0.7},${y-s*0.7} L${x+s*0.7},${y+s*0.7} M${x-s*0.7},${y+s*0.7} L${x+s*0.7},${y-s*0.7}"
              stroke="#a8d8f0" stroke-width="1.5" fill="none" opacity="0.18"/>
      `).join('')}
      <ellipse cx="400" cy="395" rx="430" ry="18" fill="#d0ecf8" opacity="0.14"/>
      <g opacity="0.22" fill="#8ccce8">
        ${[100,300,500,680].map((x,i) => `<path d="M${x-20},400 L${x},${370-i*5} L${x+20},400 Z"/>`).join('')}
      </g>
    `,
  },
  {
    id: 'volcanic',
    label: 'Volcanic Vent',
    emoji: '',
    cost: 500,
    startOwned: false,
    desc: 'Scorching dark waters lit by glowing vents. Maximum drama.',
    substrateId: 'gravel_dark',
    waterGradient: [
      { offset: '0%',   color: '#281210', opacity: 0.88 },
      { offset: '40%',  color: '#381808', opacity: 0.90 },
      { offset: '72%',  color: '#482006', opacity: 0.93 },
      { offset: '100%', color: '#2a0c02', opacity: 0.96 },
    ],
    bgSvgFn: () => `
      ${[[120,395,80,20,'#8a2000',0.35],[400,398,60,14,'#a03010',0.30],[660,396,70,18,'#7a1800',0.35]].map(([cx,cy,rx,ry,c,o]) => `
        <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}" opacity="${o}"/>
        <ellipse cx="${cx}" cy="${cy-2}" rx="${rx*0.7}" ry="${ry*0.6}" fill="#c04010" opacity="${o*0.5}"/>
      `).join('')}
      ${[[100,380],[420,370],[680,378]].map(([x,y],i) => `
        <path d="M${x},400 C${x-5},${y} ${x+8},${y-30} ${x+2},${y-70} C${x-4},${y-110} ${x+6},${y-130} ${x},${y-160}"
              stroke="#e04010" stroke-width="${3+i}" fill="none" opacity="0.18" class="kelp-sway" style="animation-delay:${i*0.6}s"/>
      `).join('')}
      ${[[160,360],[340,350],[540,358],[720,345]].map(([x,y],i) => `
        <ellipse cx="${x}" cy="${y}" rx="${8+i*2}" ry="${4+i}" fill="#ff6020" opacity="${0.08+i*0.02}"/>
      `).join('')}
    `,
  },
  {
    id: 'sakura',
    label: 'Sakura Pond',
    emoji: '',
    cost: 400,
    startOwned: false,
    desc: 'Soft jade-green waters with drifting cherry blossoms. Serene.',
    substrateId: 'sand',
    waterGradient: [
      { offset: '0%',   color: '#2a6840', opacity: 0.65 },
      { offset: '38%',  color: '#1e5030', opacity: 0.80 },
      { offset: '70%',  color: '#143820', opacity: 0.92 },
      { offset: '100%', color: '#0c2810', opacity: 0.95 },
    ],
    bgSvgFn: () => `
      ${[100,260,440,600,730].map((x,i) => `
        <path d="M${x},400 C${x+8*(i%2?1:-1)},350 ${x-6},290 ${x+12*(i%3?1:-1)},220 C${x+20},170 ${x+4},140 ${x+14},90"
              stroke="${['#5a9060','#4a8050','#628858','#508060','#3a7048'][i%5]}" stroke-width="${5+i%3}" fill="none" opacity="0.28" class="kelp-sway" style="animation-delay:${i*0.7}s"/>
      `).join('')}
      ${[80,200,350,480,560,680,140,310].map((x,i) => `
        <circle cx="${x}" cy="${80+i*30+(i%3)*20}" r="4" fill="#f8b8c8" opacity="${0.15+i%4*0.05}"/>
        <circle cx="${x+8}" cy="${85+i*30+(i%3)*20}" r="3" fill="#fca8b8" opacity="${0.12+i%3*0.04}"/>
        <circle cx="${x-6}" cy="${90+i*30+(i%3)*20}" r="3.5" fill="#f0b0c0" opacity="${0.10+i%4*0.03}"/>
      `).join('')}
      <ellipse cx="400" cy="395" rx="420" ry="20" fill="#2a5830" opacity="0.30"/>
      ${[60,230,460,620].map((x,i) => `
        <ellipse cx="${x}" cy="${388+i%2*4}" rx="${50+i*10}" ry="12" fill="#1e4428" opacity="0.22"/>
      `).join('')}
    `,
  },
];

export function getThemeById(id) {
  return TANK_THEMES.find(t => t.id === id) || TANK_THEMES[0];
}

export function getDecorById(id) {
  return DECOR_CATALOG.find(d => d.id === id) || null;
}

function getStarterOwnedDecor() {
  const owned = {};
  for (const d of DECOR_CATALOG) {
    if (d.startOwned > 0) owned[d.id] = d.startOwned;
  }
  return owned;
}

// Default theme state for a new tank
export function getDefaultThemes() {
  return {
    owned: ['tropical'],
    active: 'tropical',
  };
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
