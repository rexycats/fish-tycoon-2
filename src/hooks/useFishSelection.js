import { useState, useEffect, useCallback, useMemo } from 'react';
import { addLog } from '../data/gameState.js';
import { updateChallengeProgress } from '../systems/gameTick.js';
import { MAGIC_FISH, checkMagicFishMatch } from '../data/genetics.js';
import { REAL_SPECIES_MAP } from '../data/realSpecies.js';
import { generateFishName, generateFishLore } from '../services/aiService.js';
import { playDiscover } from '../services/soundService.js';
import { useGameStore } from '../store/gameStore.js';

/**
 * useFishSelection — now reads from the Zustand store.
 * Local UI state (selectedFishId, activeTankId, modals) stays in React.
 * Game mutations go through the store.
 */
export function useFishSelection() {
  const fish           = useGameStore(s => s.fish);
  const tanks          = useGameStore(s => s.tanks);
  const fishdex        = useGameStore(s => s.player.fishdex || []);
  const listedFish     = useGameStore(s => s.shop.listedFish);

  const [selectedFishId, setSelectedFishId] = useState(null);
  const [activeTankId, setActiveTankId]     = useState(() => tanks[0]?.id ?? 'tank_0');
  const [generatingLoreFor, setGeneratingLoreFor] = useState(null);
  const [aiError, setAiError]               = useState(null);
  const [showWinModal, setShowWinModal]     = useState(false);

  useEffect(() => {
    if (!tanks.find(t => t.id === activeTankId)) {
      setActiveTankId(tanks[0]?.id ?? 'tank_0');
    }
  }, [tanks, activeTankId]);

  const updateFishdexEntry = useCallback((speciesName, updates) => {
    useGameStore.setState(state => {
      state.player.fishdex = (state.player.fishdex || []).map(e =>
        e.name === speciesName ? { ...e, ...updates } : e,
      );
    });
  }, []);

  const speciesNameKey = useMemo(
    () => [...new Set(fish.map(f => f.species?.name).filter(Boolean))].sort().join(','),
    [fish],
  );

  useEffect(() => {
    const knownNames = new Set(fishdex.map(e => e.name));
    const newEntries = [];
    for (const f of fish) {
      if (!f.species || knownNames.has(f.species.name)) continue;
      const realSpec = f.species.visualType === 'species' && f.species.key
        ? REAL_SPECIES_MAP[f.species.key] : null;
      newEntries.push({
        name: f.species.name, rarity: f.species.rarity,
        basePrice: f.species.basePrice, phenotype: f.phenotype,
        firstDiscoveredAt: Date.now(), aiName: null, aiLore: null,
        colorVariant: f.colorVariant || null,
        ...(realSpec && {
          visualType: 'species', speciesKey: realSpec.key,
          scientificName: realSpec.scientificName, habitat: realSpec.habitat,
          funFact: realSpec.funFact, conservationStatus: realSpec.conservationStatus,
          lore: realSpec.lore,
        }),
      });
      knownNames.add(f.species.name);
    }
    if (newEntries.length === 0) return;

    useGameStore.setState(state => {
      state.player.fishdex = [...(state.player.fishdex || []), ...newEntries];
      for (const e of newEntries) {
        const logState = addLog(state, `📖 New species: ${e.name}! (${e.rarity})`);
        Object.assign(state, logState);
      }
      const afterChallenge = updateChallengeProgress(state, 'discover');
      Object.assign(state, afterChallenge);

      const alreadyFound = new Set(state.player.magicFishFound || []);
      const newMagic = [];
      for (const entry of newEntries) {
        for (const mf of MAGIC_FISH) {
          if (!alreadyFound.has(mf.id) && checkMagicFishMatch(entry.phenotype, mf)) {
            alreadyFound.add(mf.id);
            newMagic.push(mf);
          }
        }
      }
      if (newMagic.length > 0) {
        state.player.magicFishFound = [...(state.player.magicFishFound || []), ...newMagic.map(m => m.id)];
        state.player.coins += newMagic.reduce((s, m) => s + m.reward, 0);
        for (const mf of newMagic) {
          const logState = addLog(state, `🔮 MAGIC FISH DISCOVERED: #${mf.number} ${mf.title}! +🪙${mf.reward} reward!`);
          Object.assign(state, logState);
        }
        if (state.player.magicFishFound.length === 7) {
          setTimeout(() => setShowWinModal(true), 500);
        }
      }
    });

    for (const entry of newEntries) {
      playDiscover();
      generateFishName(entry.phenotype, entry.rarity, entry.name).then(aiName => {
        if (aiName) updateFishdexEntry(entry.name, { aiName });
      });
    }
  }, [speciesNameKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerateLore = useCallback(async (speciesName) => {
    const currentFishdex = useGameStore.getState().player.fishdex || [];
    const entry = currentFishdex.find(e => e.name === speciesName);
    if (!entry || entry.aiLore) return;
    setGeneratingLoreFor(speciesName);
    setAiError(null);
    try {
      const nameForLore = entry.aiName || entry.name;
      const { text, error } = await generateFishLore(entry.phenotype, entry.rarity, nameForLore);
      if (error) setAiError(error);
      else if (text) updateFishdexEntry(speciesName, { aiLore: text });
    } finally {
      setGeneratingLoreFor(null);
    }
  }, [updateFishdexEntry]);

  const activeTank = useMemo(
    () => tanks.find(t => t.id === activeTankId) || tanks[0],
    [tanks, activeTankId],
  );
  const tankFish = useMemo(
    () => fish.filter(f => f.tankId === activeTank?.id),
    [fish, activeTank?.id],
  );
  const selectedFish = useMemo(
    () => fish.find(f => f.id === selectedFishId) || null,
    [fish, selectedFishId],
  );
  const isListed = useMemo(
    () => selectedFish ? listedFish.includes(selectedFish.id) : false,
    [selectedFish, listedFish],
  );

  return {
    selectedFishId, setSelectedFishId,
    activeTankId,   setActiveTankId,
    activeTank,     tankFish,
    selectedFish,   isListed,
    showWinModal,   setShowWinModal,
    generatingLoreFor, aiError, setAiError,
    handleGenerateLore,
  };
}
