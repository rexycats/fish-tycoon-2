// ============================================================
// TANK BACKGROUNDS — unlockable biome themes
// ============================================================

export const TANK_BACKGROUNDS = [
  {
    id: 'tropical',
    label: 'Tropical Reef',
    emoji: '🪸',
    desc: 'Warm coral waters with swaying anemones',
    cost: 0, // default
    gradient: 'linear-gradient(180deg, #0a3060 0%, #0d2040 40%, #152838 70%, #1a2020 100%)',
    sandColor: '#c8a86a',
    ambientColor: 'rgba(80,160,220,0.04)',
  },
  {
    id: 'deep_ocean',
    label: 'Deep Ocean',
    emoji: '🌊',
    desc: 'Dark abyssal depths with bioluminescence',
    cost: 500,
    gradient: 'linear-gradient(180deg, #030818 0%, #050c20 40%, #081028 70%, #0a0818 100%)',
    sandColor: '#4a4a5a',
    ambientColor: 'rgba(40,60,120,0.06)',
  },
  {
    id: 'river',
    label: 'Freshwater River',
    emoji: '🏞️',
    desc: 'Clear flowing stream with pebbles and plants',
    cost: 800,
    gradient: 'linear-gradient(180deg, #1a4030 0%, #143828 40%, #0e2820 70%, #0a1a18 100%)',
    sandColor: '#8a7a60',
    ambientColor: 'rgba(80,160,100,0.05)',
  },
  {
    id: 'arctic',
    label: 'Arctic Waters',
    emoji: '🧊',
    desc: 'Freezing polar waters with ice crystals',
    cost: 1200,
    minPrestige: 1,
    gradient: 'linear-gradient(180deg, #1a2838 0%, #182838 40%, #203040 70%, #182028 100%)',
    sandColor: '#8090a0',
    ambientColor: 'rgba(140,180,220,0.06)',
  },
  {
    id: 'volcanic',
    label: 'Volcanic Vent',
    emoji: '🌋',
    desc: 'Hydrothermal vents with glowing minerals',
    cost: 2000,
    minPrestige: 2,
    gradient: 'linear-gradient(180deg, #1a0808 0%, #200c08 40%, #281010 70%, #1a0808 100%)',
    sandColor: '#3a2a20',
    ambientColor: 'rgba(200,60,20,0.05)',
  },
];

export function getBackground(id) {
  return TANK_BACKGROUNDS.find(b => b.id === id) || TANK_BACKGROUNDS[0];
}

export function getUnlockedBackgrounds(state) {
  const prestige = state.player?.prestigeLevel || 0;
  return TANK_BACKGROUNDS.filter(b => {
    if (b.minPrestige && prestige < b.minPrestige) return false;
    if (b.cost === 0) return true;
    return (state.player?.unlockedBackgrounds || []).includes(b.id);
  });
}
