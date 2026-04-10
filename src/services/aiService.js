// ============================================================
// FISH TYCOON 2 — AI SERVICE (Phase 8)
// Claude-powered fish names & species lore
// ============================================================

const API_URL = 'https://api.anthropic.com/v1/messages';
const LS_KEY  = 'fishtycoon_api_key';

// ── API key management ────────────────────────────────────
export function getApiKey()          { return localStorage.getItem(LS_KEY) || ''; }
export function setApiKey(key)       { if (key) localStorage.setItem(LS_KEY, key.trim()); else localStorage.removeItem(LS_KEY); }

// Exported so UI can show the right message

// ── Serial request queue ──────────────────────────────────
// Naming calls are fired one-at-a-time with a MIN_GAP_MS cooldown
// between completions. At most MAX_DEPTH pending jobs are kept so a
// burst of discoveries (e.g. offline catch-up) doesn't pile up.
const MIN_GAP_MS = 1200;
const MAX_DEPTH  = 10;

const _queue   = [];          // { fn, resolve, reject }[]
const _pending = new Set();   // dedup keys currently queued or running
let   _running = false;
let   _lastEnd = 0;

function _enqueue(key, fn) {
  if (_pending.has(key)) return Promise.resolve(null); // already queued
  if (_queue.length >= MAX_DEPTH) return Promise.resolve(null);  // queue full, skip

  _pending.add(key);
  return new Promise((resolve, reject) => {
    _queue.push({ key, fn, resolve, reject });
    if (!_running) _drain();
  });
}

async function _drain() {
  _running = true;
  while (_queue.length > 0) {
    const gap = MIN_GAP_MS - (Date.now() - _lastEnd);
    if (gap > 0) await new Promise(r => setTimeout(r, gap));

    const job = _queue.shift();
    _pending.delete(job.key);
    try {
      job.resolve(await job.fn());
    } catch (err) {
      job.reject(err);
    }
    _lastEnd = Date.now();
  }
  _running = false;
}

async function callClaude(prompt) {
  const apiKey = getApiKey();
  if (!apiKey) return { error: AI_ERRORS.NO_KEY, text: null };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (res.status === 401 || res.status === 403) {
      return { error: AI_ERRORS.NO_API, text: null };
    }
    if (res.status === 429) {
      return { error: AI_ERRORS.RATE_LIMIT, text: null };
    }
    if (!res.ok) {
      return { error: AI_ERRORS.NETWORK, text: null };
    }

    const data = await res.json();
    const text = data.content?.[0]?.text?.trim() || null;
    return { error: null, text };
  } catch (err) {
    console.warn('[AI] Request failed:', err.message);
    return { error: AI_ERRORS.NETWORK, text: null };
  }
}

export async function generateFishName(phenotype, rarity, geneticName) {
  const traits = [
    phenotype?.bodyShape, phenotype?.primaryColor, phenotype?.finType,
    phenotype?.pattern,
    phenotype?.glow && phenotype.glow !== 'Normal' ? phenotype.glow : null,
    phenotype?.mutation && phenotype.mutation !== 'None' ? phenotype.mutation : null,
    phenotype?.size,
  ].filter(Boolean).join(', ');

  const rarityHint =
    rarity === 'epic'     ? 'mythical and legendary-sounding' :
    rarity === 'rare'     ? 'exotic and dramatic' :
    rarity === 'uncommon' ? 'evocative and interesting' :
    'simple and charming';

  const prompt =
    `You are naming a newly discovered tropical fish species for an aquarium game.\n\n` +
    `Genetic classification: ${geneticName}\n` +
    `Physical traits: ${traits}\n` +
    `Rarity tier: ${rarity} — make the name ${rarityHint}.\n\n` +
    `Rules:\n- 2–4 words maximum\n` +
    `- Can be Latin-style, poetic common name, or mythological reference\n` +
    `- Must reflect the traits (color, shape, glow, mutation)\n` +
    `- Do NOT use the word "fish"\n` +
    `- Return ONLY the name, nothing else — no quotes, no explanation`;

  // Queue under the genetic name so the same species is never requested twice
  const result = await _enqueue(`name:${geneticName}`, async () => {
    const { text } = await callClaude(prompt);
    if (text && text.length < 60 && !text.includes('\n')) return text;
    return null;
  });
  return result ?? null;
}

export async function generateFishLore(phenotype, rarity, name) {
  const traits = [
    `Body: ${phenotype.bodyShape}`, `Color: ${phenotype.primaryColor}`,
    `Fins: ${phenotype.finType}`,   `Pattern: ${phenotype.pattern}`,
    phenotype.glow !== 'Normal'     ? `Glow: ${phenotype.glow}`         : null,
    phenotype.mutation !== 'None'   ? `Mutation: ${phenotype.mutation}`  : null,
    `Size: ${phenotype.size}`, `Secondary color: ${phenotype.secondaryColor}`,
  ].filter(Boolean).join('; ');

  const rarityNote =
    rarity === 'epic'     ? 'This is an extremely rare species with near-mythical status.' :
    rarity === 'rare'     ? 'This is a rare species, prized by collectors.' :
    rarity === 'uncommon' ? 'This species is somewhat uncommon in the wild.' :
    'This is a relatively common species.';

  const prompt =
    `Write a short Fishdex entry for a fish species named "${name}".\n\n` +
    `Traits: ${traits}\n${rarityNote}\n\n` +
    `Rules:\n- Exactly 2–3 sentences\n` +
    `- Aquarium game style: evocative, scientific-ish, a little whimsical\n` +
    `- Mention habitat, behavior, or special biological quirks\n` +
    `- Reference specific traits (color, glow, shape) organically\n` +
    `- Return ONLY the lore text — no title, no labels, no quotes`;

  // Queue under the species name — dedup prevents concurrent lore requests for same species
  const result = await _enqueue(`lore:${name}`, () => callClaude(prompt));
  if (!result) return { text: null, error: null };
  const { text, error } = result;
  if (error) return { text: null, error };
  return { text, error: null };
}
