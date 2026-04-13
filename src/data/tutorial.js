// ============================================================
// FISH TYCOON 2 — TUTORIAL SYSTEM
// Step-by-step onboarding with highlights and tooltips
// ============================================================

export const TUTORIAL_STEPS = [
  {
    id: 'tap_fish',
    title: '👆 Tap a Fish!',
    text: 'Tap any fish in your tank to see its info. Try it now!',
    highlight: null,
    tab: 'tank',
    action: 'selectFish',
    waitFor: (state) => true,
  },
  {
    id: 'feed_and_sell',
    title: 'Feed & Sell',
    text: 'Feed your fish to keep them healthy. List them for sale — customers arrive automatically and buy your fish for coins!',
    highlight: null,
    tab: 'tank',
    action: 'feedFish',
    waitFor: (state) => (state.player?.stats?.fishFed || 0) >= 1 || (state.shop?.listedFish?.length || 0) >= 1,
  },
  {
    id: 'breed_hint',
    title: '🧬 Try Breeding!',
    text: 'You have two adult fish — go to the Breed tab to combine their traits and discover new species!',
    highlight: 'breed',
    tab: null,
    action: 'breed',
    waitFor: (state) => state.breedingTank?.breedingStartedAt !== null,
  },
  {
    id: 'complete',
    title: 'You\'re Ready! 🎉',
    text: 'You know the basics! Keep breeding for rare fish, check Goals for direction, and explore the Fishdex to track your discoveries.',
    highlight: null,
    tab: null,
    action: null,
  },
];
