import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { addLog } from '../data/gameState.js';
import { updateChallengeProgress } from '../systems/gameTick.js';
import { MAGIC_FISH, checkMagicFishMatch } from '../data/genetics.js';
import { REAL_SPECIES_MAP } from '../data/realSpecies.js';
import { generateFishName, generateFishLore } from '../services/aiService.js';
import { playDiscover } from '../services/soundService.js';

/**
 * useFishSelection
 *
 * Owns all state and effects related to what the player is looking at:
 *   - which fish is selected (detail panel)
 *   - which tank is active (view + supply scope)
 *   - Fishdex discovery: detects new species, writes entries, triggers AI naming
 *   - Magic fish win detection
 *   - AI lore generation (on demand)
 *
 * Receives `game` and `setGame` from useGameEngine so it can react to
 * state produced by the tick without duplicating state ownership.
 */
export function useFishSelection(game, setGame) {
  const [selectedFishId, setSelectedFishId] = useState(null);

  // Seed from the first tank that exists in the loaded save
  const [activeTankId, setActiveTankId] = useState(
    () => game.tanks?.[0]?.id ?? 'tank_0',
  );

  const [generatingLoreFor, setGeneratingLoreFor] = useState(null);
  const [aiError, setAiError]                     = useState(null);
  const [showWinModal, setShowWinModal]           = useState(false);

  // Local ref for async AI callbacks — keeps async closures from going stale.
  // useGameEngine has its own gameRef for auto-save; both track the same game
  // object. This one is intentionally private to useFishSelection.
  const gameRef = useRef(game);
  useEffect(() => { gameRef.current = game; }, [game]);

  // ── Guard: keep activeTankId valid when tanks change ────────
  useEffect(() => {
    if (!game.tanks.find(t => t.id === activeTankId)) {
      setActiveTankId(game.tanks[0]?.id ?? 'tank_0');
    }
  }, [game.tanks, activeTankId]);

  // ── Fishdex entry updater (used by AI naming + lore) ────────
  // Declared before the speciesNameKey effect so the async .then()
  // closure inside that effect can reference it without fragile hoisting.
  // setGame is stable (guaranteed by React), so dep array is [].
  const updateFishdexEntry = useCallback((speciesName, updates) => {
    setGame(prev => ({
      ...prev,
      player: {
        ...prev.player,
        fishdex: (prev.player.fishdex || []).map(e =>
          e.name === speciesName ? { ...e, ...updates } : e,
        ),
      },
    }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fishdex discovery ────────────────────────────────────────
  // Dependency: sorted set of unique species names currently alive.
  // This fires only when a genuinely new species appears — not every tick.
  const speciesNameKey = useMemo(
    () => [...new Set(
      (game.fish || []).map(f => f.species?.name).filter(Boolean),
    )].sort().join(','),
    [game.fish],
  );

  useEffect(() => {
    const knownNames = new Set((game.player.fishdex || []).map(e => e.name));
    const newEntries = [];

    for (const f of game.fish) {
      if (!f.species || knownNames.has(f.species.name)) continue;
      const realSpec = f.species.visualType === 'species' && f.species.key
        ? REAL_SPECIES_MAP[f.species.key]
        : null;
      newEntries.push({
        name:               f.species.name,
        rarity:             f.species.rarity,
        basePrice:          f.species.basePrice,
        phenotype:          f.phenotype,
        firstDiscoveredAt:  Date.now(),
        aiName:             null,
        aiLore:             null,
        colorVariant:       f.colorVariant || null,
        ...(realSpec && {
          visualType:         'species',
          speciesKey:         realSpec.key,
          scientificName:     realSpec.scientificName,
          habitat:            realSpec.habitat,
          funFact:            realSpec.funFact,
          conservationStatus: realSpec.conservationStatus,
          lore:               realSpec.lore,
        }),
      });
      knownNames.add(f.species.name);
    }

    if (newEntries.length === 0) return;

    setGame(prev => {
      let next = {
        ...prev,
        player: {
          ...prev.player,
          fishdex: [...(prev.player.fishdex || []), ...newEntries],
        },
      };
      for (const e of newEntries) next = addLog(next, `📖 New species: ${e.name}! (${e.rarity})`);
      next = updateChallengeProgress(next, 'discover');

      // Magic fish check
      const alreadyFound = new Set(prev.player.magicFishFound || []);
      const newMagic     = [];
      for (const entry of newEntries) {
        for (const mf of MAGIC_FISH) {
          if (!alreadyFound.has(mf.id) && checkMagicFishMatch(entry.phenotype, mf)) {
            alreadyFound.add(mf.id);
            newMagic.push(mf);
          }
        }
      }
      if (newMagic.length > 0) {
        const magicFishFound = [
          ...(prev.player.magicFishFound || []),
          ...newMagic.map(m => m.id),
        ];
        next = {
          ...next,
          player: {
            ...next.player,
            coins:        next.player.coins + newMagic.reduce((s, m) => s + m.reward, 0),
            magicFishFound,
          },
        };
        for (const mf of newMagic) {
          next = addLog(next, `🔮 MAGIC FISH DISCOVERED: #${mf.number} ${mf.title}! +🪙${mf.reward} reward!`);
        }
        if (magicFishFound.length === 7) {
          setTimeout(() => setShowWinModal(true), 500);
        }
      }
      return next;
    });

    // Fire sound + kick off async AI naming for each new entry
    for (const entry of newEntries) {
      playDiscover();
      generateFishName(entry.phenotype, entry.rarity, entry.name).then(aiName => {
        if (aiName) updateFishdexEntry(entry.name, { aiName });
      });
    }
  }, [speciesNameKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── On-demand AI lore generation ────────────────────────────
  const handleGenerateLore = useCallback(async (speciesName) => {
    const entry = (gameRef.current.player.fishdex || []).find(e => e.name === speciesName);
    if (!entry || entry.aiLore) return;
    setGeneratingLoreFor(speciesName);
    setAiError(null);
    try {
      const nameForLore    = entry.aiName || entry.name;
      const { text, error } = await generateFishLore(entry.phenotype, entry.rarity, nameForLore);
      if (error)      setAiError(error);
      else if (text)  updateFishdexEntry(speciesName, { aiLore: text });
    } finally {
      setGeneratingLoreFor(null);
    }
  }, [updateFishdexEntry]);

  // ── Derived selection helpers (memoized to avoid .find()/.filter() on every tick render) ──
  const activeTank = useMemo(
    () => game.tanks.find(t => t.id === activeTankId) || game.tanks[0],
    [game.tanks, activeTankId],
  );
  const tankFish = useMemo(
    () => game.fish.filter(f => f.tankId === activeTank?.id),
    [game.fish, activeTank?.id],
  );
  const selectedFish = useMemo(
    () => game.fish.find(f => f.id === selectedFishId) || null,
    [game.fish, selectedFishId],
  );
  const isListed = useMemo(
    () => selectedFish ? game.shop.listedFish.includes(selectedFish.id) : false,
    [selectedFish, game.shop.listedFish],
  );

  return {
    selectedFishId,  setSelectedFishId,
    activeTankId,    setActiveTankId,
    activeTank,      tankFish,
    selectedFish,    isListed,
    showWinModal,    setShowWinModal,
    generatingLoreFor,
    aiError,         setAiError,
    handleGenerateLore,
  };
}
