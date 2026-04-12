// ============================================================
// FISH TYCOON 2 — TUTORIAL SYSTEM
// Step-by-step onboarding with highlights and tooltips
// ============================================================

export const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Fish Tycoon! 🐠',
    text: 'You\'re the owner of a small aquarium shop. Buy fish, care for them, breed rare species, and sell to customers for profit!',
    highlight: null,
    tab: null,
    action: null,
  },
  {
    id: 'buy_first_fish',
    title: 'Step 1: Buy Your First Fish',
    text: 'Go to the Shop tab and buy a fish. Start with a Common Fish for 🪙50 — they\'re cheap and great for learning.',
    highlight: 'shop',
    tab: 'shop',
    action: 'buyFish',
    waitFor: (state) => state.fish.length >= 4, // starts with 3, need 4
  },
  {
    id: 'view_tank',
    title: 'Step 2: Check Your Tank',
    text: 'Switch to the Tank tab to see your fish swimming! Click on a fish to see its stats, health, and personality.',
    highlight: 'tank',
    tab: 'tank',
    action: 'selectFish',
    waitFor: (state) => true, // just viewing
  },
  {
    id: 'feed_fish',
    title: 'Step 3: Feed Your Fish',
    text: 'Hungry fish lose health! Click the Feed button in the fish panel or use the + Food button in the top bar to buy food, then Feed All.',
    highlight: 'feed',
    tab: 'tank',
    action: 'feedFish',
    waitFor: (state) => (state.player?.stats?.fishFed || 0) >= 1,
  },
  {
    id: 'list_for_sale',
    title: 'Step 4: Sell a Fish',
    text: 'Select a fish and click "List for Sale" to put it in your shop window. Customers will visit and buy your listed fish automatically!',
    highlight: 'sell',
    tab: 'tank',
    action: 'toggleSellFish',
    waitFor: (state) => (state.shop?.listedFish?.length || 0) >= 1,
  },
  {
    id: 'wait_for_sale',
    title: 'Step 5: Wait for a Customer',
    text: 'Customers arrive every 15-30 seconds. Watch the log for sales! Some customers will haggle — you can accept or counter their offer.',
    highlight: null,
    tab: null,
    action: 'sale',
    waitFor: (state) => (state.player?.stats?.fishSold || 0) >= 1,
  },
  {
    id: 'breeding',
    title: 'Step 6: Start Breeding',
    text: 'Go to the Breed tab. Select two adult fish as parents to create offspring with mixed traits. This is how you discover rare species!',
    highlight: 'breed',
    tab: 'breed',
    action: 'breed',
    waitFor: (state) => state.breedingTank?.breedingStartedAt !== null,
  },
  {
    id: 'goals',
    title: 'Step 7: Check Your Goals',
    text: 'The Goals tab has daily orders, research upgrades, and your discovery journal. Complete special orders for bonus coins!',
    highlight: 'challenges',
    tab: 'challenges',
    action: null,
    waitFor: (state) => true,
  },
  {
    id: 'complete',
    title: 'You\'re Ready! 🎉',
    text: 'You know the basics! Keep breeding to discover rare fish, upgrade your shop, unlock new tanks, and work toward becoming a Legendary Aquarist. Good luck!',
    highlight: null,
    tab: null,
    action: null,
  },
];
