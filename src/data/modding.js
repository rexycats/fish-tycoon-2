// ============================================================
// FISH TYCOON 2 — MODDING SUPPORT
// Load custom species, decorations, and events from JSON
// ============================================================

// Custom species loaded from user JSON files
let _customSpecies = [];
let _customDecorations = [];
let _customEvents = [];

export function getCustomSpecies() { return _customSpecies; }
export function getCustomDecorations() { return _customDecorations; }
export function getCustomEvents() { return _customEvents; }

// Validate a custom species definition
function validateSpecies(spec) {
  const required = ['key', 'name', 'rarity', 'basePrice'];
  for (const field of required) {
    if (!spec[field]) return `Missing required field: ${field}`;
  }
  if (!['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(spec.rarity)) {
    return `Invalid rarity: ${spec.rarity}`;
  }
  if (typeof spec.basePrice !== 'number' || spec.basePrice <= 0) {
    return `Invalid basePrice: ${spec.basePrice}`;
  }
  return null;
}

// Load a mod from a JSON string
export function loadMod(jsonString) {
  try {
    const mod = JSON.parse(jsonString);
    const results = { species: 0, decorations: 0, events: 0, errors: [] };

    if (mod.species && Array.isArray(mod.species)) {
      for (const spec of mod.species) {
        const err = validateSpecies(spec);
        if (err) {
          results.errors.push(`Species "${spec.name || spec.key}": ${err}`);
          continue;
        }
        // Add defaults for optional fields
        const fullSpec = {
          key: spec.key,
          name: spec.name,
          scientificName: spec.scientificName || '',
          rarity: spec.rarity,
          basePrice: spec.basePrice,
          visualType: 'procedural', // custom species use procedural rendering
          lore: spec.lore || '',
          habitat: spec.habitat || '',
          funFact: spec.funFact || '',
          colorVariants: spec.colorVariants || ['default'],
          conservationStatus: spec.conservationStatus || '',
          behaviorProfile: {
            swimSpeed: spec.swimSpeed || 0.5,
            turnChance: spec.turnChance || 0.03,
            bobAmplitude: spec.bobAmplitude || 0.01,
            preferredYRange: spec.preferredYRange || [30, 70],
            idleProbability: spec.idleProbability || 0.3,
          },
          compatibility: {
            water: spec.water || 'fresh',
            temp: spec.temp || 'tropical',
            temperament: spec.temperament || 'peaceful',
            schoolSize: spec.schoolSize || 0,
          },
          isCustom: true,
        };
        _customSpecies.push(fullSpec);
        results.species++;
      }
    }

    if (mod.decorations && Array.isArray(mod.decorations)) {
      for (const dec of mod.decorations) {
        if (!dec.id || !dec.name) {
          results.errors.push(`Decoration missing id or name`);
          continue;
        }
        _customDecorations.push({
          id: `custom_${dec.id}`,
          name: dec.name,
          emoji: '',
          cost: dec.cost || 50,
          rarity: dec.rarity || 'common',
          desc: dec.desc || 'A custom decoration.',
          isCustom: true,
        });
        results.decorations++;
      }
    }

    if (mod.events && Array.isArray(mod.events)) {
      for (const evt of mod.events) {
        if (!evt.id || !evt.name || !evt.message) {
          results.errors.push(`Event missing id, name, or message`);
          continue;
        }
        _customEvents.push({
          id: `custom_${evt.id}`,
          name: evt.name,
          desc: evt.desc || '',
          message: evt.message,
          weight: evt.weight || 5,
          minRep: evt.minRep || 0,
          coinBonus: evt.coinBonus || 0,
          repBonus: evt.repBonus || 0,
          isCustom: true,
        });
        results.events++;
      }
    }

    return results;
  } catch (err) {
    return { species: 0, decorations: 0, events: 0, errors: [`JSON parse error: ${err.message}`] };
  }
}

// Clear all custom content
export function clearMods() {
  _customSpecies = [];
  _customDecorations = [];
  _customEvents = [];
}

// Export a mod template for users
export function getModTemplate() {
  return JSON.stringify({
    name: "My Custom Mod",
    author: "Your Name",
    version: "1.0",
    species: [
      {
        key: "rainbow_shrimp",
        name: "Rainbow Shrimp",
        scientificName: "Neocaridina prismatica",
        rarity: "rare",
        basePrice: 200,
        lore: "A shrimp with prismatic coloring that shifts in the light.",
        habitat: "Custom freshwater environments",
        funFact: "Changes color based on mood!",
        water: "fresh",
        temp: "tropical",
        temperament: "peaceful",
        schoolSize: 3,
        swimSpeed: 0.3,
      }
    ],
    decorations: [
      {
        id: "crystal_cave",
        name: "Crystal Cave",
        cost: 100,
        rarity: "rare",
        desc: "A glowing crystal formation.",
      }
    ],
    events: [
      {
        id: "meteor_shower",
        name: "Meteor Shower!",
        desc: "A spectacular display in the sky above your aquarium.",
        message: "Meteor shower! Visitors are amazed! +20 reputation.",
        coinBonus: 100,
        repBonus: 20,
      }
    ],
  }, null, 2);
}
