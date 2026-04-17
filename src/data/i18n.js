// ============================================================
// FISH TYCOON 2 — LOCALIZATION FRAMEWORK
// String extraction for i18n support
// ============================================================

const LOCALES = {
  en: {
    // UI labels
    'ui.day': 'DAY',
    'ui.fish': 'FISH',
    'ui.sick': 'SICK',
    'ui.saved': 'SAVED',
    'ui.pause': 'Pause',
    'ui.resume': 'Resume',
    'ui.coins': 'coins',
    'ui.level': 'LV.',
    'ui.locked': 'LOCKED',

    // Navigation
    'nav.aquarium': 'Aquarium',
    'nav.market': 'Market',
    'nav.breeding': 'Breeding',
    'nav.records': 'Records',
    'nav.office': 'Office',

    // Office tabs
    'office.contracts': 'Contracts',
    'office.staff': 'Staff',
    'office.research': 'Research',
    'office.decor': 'Decor',
    'office.autopsy': 'Autopsy',

    // Records tabs
    'records.fishdex': 'Fishdex',
    'records.achievements': 'Achievements',
    'records.reviews': 'Reviews',
    'records.stats': 'Statistics',
    'records.magic': 'Magic Fish',

    // Staff
    'staff.title': 'STAFF',
    'staff.hire': 'Hire',
    'staff.fire': 'Fire',
    'staff.train': 'Train',
    'staff.unassigned': 'Assign to a tank to work',
    'staff.daily_wages': 'Daily wages',
    'staff.caretaker': 'Caretaker',
    'staff.technician': 'Technician',
    'staff.vet': 'Veterinarian',

    // Research
    'research.title': 'RESEARCH LAB',
    'research.subtitle': 'Invest in permanent upgrades for your aquarium',
    'research.maxed': 'Fully Researched',

    // Equipment
    'equip.title': 'EQUIPMENT',
    'equip.active': 'Active',
    'equip.broken': 'BROKEN',
    'equip.repair': 'Repair',

    // Campaign
    'campaign.title': 'CAMPAIGN',
    'campaign.subtitle': 'Complete objectives to unlock new levels',
    'campaign.start': 'Start Level',
    'campaign.back': 'Back',
    'campaign.complete': 'LEVEL COMPLETE',
    'campaign.next': 'Next',
    'campaign.map': 'Campaign Map',

    // Actions
    'action.feed': 'Feed',
    'action.sell': 'Sell',
    'action.breed': 'Breed',
    'action.medicine': 'Treat',
    'action.diagnose': 'Diagnose',
    'action.vitamins': 'Vitamins',

    // Difficulty
    'diff.easy': 'EASY',
    'diff.normal': 'NORMAL',
    'diff.hard': 'HARD',

    // Photo mode
    'photo.hint': 'PHOTO MODE — Press P to exit',

    // Amenities
    'amenity.giftshop': 'Gift Shop',
    'amenity.cafe': 'Café',
    'amenity.unlock': 'Build',
    'amenity.upgrade': 'Upgrade',
    'amenity.maxed': 'MAX LEVEL',

    // Title screen
    'title.continue': 'Continue',
    'title.campaign': 'Campaign',
    'title.sandbox': 'Sandbox',
    'title.tagline': 'Breed. Trade. Manage.',

    // Misc
    'misc.not_enough_coins': 'Not enough coins!',
    'misc.tank_full': 'All tanks are full!',
    'misc.max_level': 'Already at max level.',
  },
};

let currentLocale = 'en';

export function setLocale(locale) {
  if (LOCALES[locale]) currentLocale = locale;
}

export function t(key, fallback) {
  return LOCALES[currentLocale]?.[key] || fallback || key;
}

export function getLocale() {
  return currentLocale;
}

export function getAvailableLocales() {
  return Object.keys(LOCALES);
}

// Placeholder for future translations
export function addLocale(locale, strings) {
  LOCALES[locale] = { ...LOCALES.en, ...strings };
}
