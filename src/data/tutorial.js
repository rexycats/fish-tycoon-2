// ============================================================
// FISH TYCOON 2 — TUTORIAL SYSTEM
// Step-by-step onboarding with highlights and tooltips
// ============================================================

export const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Fish Tycoon 2!',
    text: 'You run an aquarium. Buy fish, keep them healthy, breed new species, and sell to customers for profit. Let\'s start!',
    highlight: null,
    tab: null,
    waitFor: null,
  },
  {
    id: 'tap_fish',
    title: 'Tap a Fish',
    text: 'Tap any fish in your tank to open its inspector. You can see its health, genetics, and rarity — plus actions like Feed and Sell.',
    highlight: null,
    tab: 'tank',
    action: 'selectFish',
    waitFor: (state) => true,
  },
  {
    id: 'feed_and_sell',
    title: 'Feed & Sell',
    text: 'Hungry fish lose health! Press F to feed, or S to list for sale. Customers visit automatically and buy listed fish for coins.',
    highlight: null,
    tab: 'tank',
    action: 'feedFish',
    waitFor: (state) => (state.player?.stats?.fishFed || 0) >= 1 || (state.shop?.listedFish?.length || 0) >= 1,
  },
  {
    id: 'market_hint',
    title: 'Visit the Market',
    text: 'The Market (key 2) has fish to buy, supplies to stock, and upgrades. Check the Wanted Board for bounty requests with bonus rewards!',
    highlight: 'market',
    tab: null,
    waitFor: (state) => (state.player?.stats?.fishBought || 0) >= 2,
  },
  {
    id: 'breed_hint',
    title: 'Try Breeding',
    text: 'Go to the Breeding Lab (key 3). Place two adults in the parent slots — wait for eggs, then collect them! Offspring inherit traits from both parents.',
    highlight: 'breed',
    tab: null,
    action: 'breed',
    waitFor: (state) => state.breedingTank?.breedingStartedAt !== null,
  },
  {
    id: 'speed_hint',
    title: 'Speed Controls',
    text: 'Press . to speed up time (2x or 3x) and , to slow down. Breeding, customers, and growth all run faster. Press Space to pause.',
    highlight: null,
    tab: null,
    waitFor: null,
  },
  {
    id: 'office_hint',
    title: 'The Office',
    text: 'The Office (key 5) has your staff, decoration shop, contracts, and autopsy records. Hire a Caretaker to auto-feed your fish!',
    highlight: 'office',
    tab: null,
    waitFor: null,
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    text: 'You know the basics! Breed diverse fish for rare species, check the Fishdex (key 4) for your collection, and explore the Records for achievements.',
    highlight: null,
    tab: null,
    action: null,
  },
];
