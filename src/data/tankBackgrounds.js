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
    gradient: 'linear-gradient(180deg, #1a6ab0 0%, #155090 40%, #104078 70%, #0c3060 100%)',
    sandColor: '#c8a86a',
    ambientColor: 'rgba(80,160,220,0.04)',
  },
  {
    id: 'deep_ocean',
    label: 'Deep Ocean',
    emoji: '🌊',
    desc: 'Dark abyssal depths with bioluminescence',
    cost: 500,
    gradient: 'linear-gradient(180deg, #0c1838 0%, #0a1430 40%, #081028 70%, #060c20 100%)',
    sandColor: '#4a4a5a',
    ambientColor: 'rgba(40,60,120,0.06)',
  },
  {
    id: 'river',
    label: 'Freshwater River',
    emoji: '🏞️',
    desc: 'Clear flowing stream with pebbles and plants',
    cost: 800,
    gradient: 'linear-gradient(180deg, #2a6848 0%, #205838 40%, #184830 70%, #103828 100%)',
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
    gradient: 'linear-gradient(180deg, #2a4060 0%, #284058 40%, #304858 70%, #283848 100%)',
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
    gradient: 'linear-gradient(180deg, #3a1810 0%, #401c10 40%, #482018 70%, #301410 100%)',
    sandColor: '#3a2a20',
    ambientColor: 'rgba(200,60,20,0.05)',
  },
];

export function getBackground(id) {
  return TANK_BACKGROUNDS.find(b => b.id === id) || TANK_BACKGROUNDS[0];
}
