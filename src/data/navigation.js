// ============================================================
// FISH TYCOON 2 — NAVIGATION DATA
// Pure data module — no component imports, no side effects
// ============================================================

export const NAV_TO_TABS = {
  aquarium: ['tank'],
  market: ['shop'],
  breeding: ['breed'],
  records: ['fishdex', 'achieve', 'magic', 'stats'],
  office: ['challenges', 'decor', 'autopsy'],
};

export function navSectionForTab(tabId) {
  for (const [nav, tabs] of Object.entries(NAV_TO_TABS)) {
    if (tabs.includes(tabId)) return nav;
  }
  return 'aquarium';
}
