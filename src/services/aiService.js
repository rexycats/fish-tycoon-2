// ============================================================
// FISH TYCOON 2 — AI SERVICE (Phase 8)
// Claude-powered fish names & species lore
// ============================================================

const API_URL = 'https://api.anthropic.com/v1/messages';

// Exported so UI can show the right message
export const AI_ERRORS = {
  NO_API:     'no_api',
  RATE_LIMIT: 'rate_limit',
  NETWORK:    'network',
};

async function callClaude(prompt) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    phenotype.bodyShape, phenotype.primaryColor, phenotype.finType,
    phenotype.pattern,
    phenotype.glow !== 'Normal' ? phenotype.glow : null,
    phenotype.mutation !== 'None' ? phenotype.mutation : null,
    phenotype.size,
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

  const { text } = await callClaude(prompt);
  if (text && text.length < 60 && !text.includes('\n')) return text;
  return null;
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

  const { text, error } = await callClaude(prompt);
  if (error) return { text: null, error };
  return { text, error: null };
}
