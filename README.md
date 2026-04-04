# 🐠 Fish Tycoon 2 — Virtual Aquarium

A browser-based fish breeding & aquarium management game built with React + Vite.

## Features (Phase 1)
- 🧬 Mendelian genetics system (6 genes, dominant/recessive)
- 🐟 32+ discoverable fish species based on trait combinations
- 🏊 Animated aquarium tank with swimming fish
- 🥚 Breeding tank with real-time egg hatching
- 🏪 Shop system with visiting customers
- ⏰ Offline progress (game runs while you're away)
- 💾 Auto-save to localStorage
- 📖 Fishdex species tracker

## Running Locally

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

1. Create a GitHub repo named `fish-tycoon-2`
2. In `vite.config.js`, set `base: '/fish-tycoon-2/'` (your repo name)
3. In GitHub repo settings → Pages → Source: **GitHub Actions**
4. Push to `main` branch — GitHub Actions will auto-deploy!

Your game will be live at:
`https://YOUR_USERNAME.github.io/fish-tycoon-2`

## Tech Stack
- React 18
- Vite 5
- Pure CSS animations (no canvas library)
- localStorage persistence
- GitHub Actions CI/CD

## Roadmap
- Phase 2: Full tank decorations & fish art upgrades
- Phase 3: Expanded genetics (400+ species)
- Phase 4: Real-time growth polish
- Phase 5: Shop upgrades & economy
- Phase 6: Fish care mini-games
- Phase 7: Full visual polish & sounds
- Phase 8: AI-powered fish names & descriptions
