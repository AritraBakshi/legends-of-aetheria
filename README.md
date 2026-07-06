# Legends of Aetheria

A monster-collecting RPG built with **Phaser 4**, **React 19**, and **TypeScript** —
inspired by classic creature-battler games, with an original world, creature
roster, and battle system.

🔗 **Play it here:** [legends-of-aetheria-aritra.vercel.app](https://legends-of-aetheria-aritra.vercel.app)

---

## ⚠️ License & Usage Notice

This project and **all of its assets (sprites, art, branding, world/creature
designs)** are proprietary and © Aritra Bakshi. This repository is public
for portfolio and reference purposes only.

**You may not copy, redistribute, or reuse the source code or any art
assets** (including creature sprites) in your own projects without
explicit written permission. See [`LICENSE.md`](./LICENSE.md) and
[`ASSETS_LICENSE.md`](./ASSETS_LICENSE.md) for full terms.

If you'd like to use anything from this project, please reach out first.

---

## Overview

Legends of Aetheria is a from-scratch creature-battler featuring:

- An original world with multiple explorable maps (village, routes, interiors)
- 30 original creatures with evolutions, learnsets, and typing across 9
  elemental types
- A Gen-style turn-based battle system (STAB, type effectiveness, crits,
  stat stages, status effects, catch mechanics)
- Starter selection, wild encounters, trainer battles, shops, and save/load

## Tech Stack

| Layer      | Tech |
|------------|------|
| Game engine | [Phaser 4](https://phaser.io/) |
| UI shell    | React 19 + Vite |
| Styling     | Tailwind CSS + shadcn/ui |
| Language    | TypeScript |
| API layer (scaffolded) | OpenAPI + Zod + Drizzle ORM |
| Deployment  | Vercel |

## Project Structure

```
src/
├── game/
│   ├── config.ts          # Phaser game config & scene registry
│   ├── GameState.ts        # Global game state singleton (party, inventory, flags)
│   ├── data/               # Game content: creatures, moves, items, maps, type chart
│   ├── systems/             # Pure logic: battle math, save/load
│   └── scenes/               # Phaser scenes (Title, Overworld, Battle, Menu, etc.)
├── components/ui/          # shadcn/ui component library
├── hooks/                  # React hooks
└── App.tsx                 # Mounts the Phaser game inside React

lib/
├── api-spec/                # OpenAPI schema
├── api-zod/                 # Generated Zod validators
├── api-client-react/        # Generated typed API client
└── db/                       # Drizzle ORM schema (scaffolded, not yet in use)

public/assets/creatures/     # Creature sprite assets (front & back)
```

## Getting Started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Type-check
npm run typecheck

# Build for production
npm run build
```

## Development Notes

- Game content (creatures, moves, items, maps) is data-driven — see
  `src/game/data/`. Adding a new creature or move generally means adding an
  entry to the relevant array; no scene changes required unless it introduces
  new mechanics.
- Battle logic (`src/game/systems/BattleSystem.ts`) is pure and
  scene-agnostic, making it straightforward to test or extend independently
  of rendering.
- The `lib/` API/DB scaffolding is currently minimal (a health-check
  endpoint only) and is reserved for future features such as cloud saves.

## Roadmap

- [ ] Additional creatures, moves, and maps
- [ ] Abilities and held items
- [ ] Trainer AI improvements
- [ ] Possible cloud save / account system

## Contributing

This is currently a solo/personal project. Bug reports and suggestions are
welcome via Issues, but please note the licensing terms above before
submitting art or code contributions.

## License

Proprietary — see [`LICENSE.md`](./LICENSE.md) and
[`ASSETS_LICENSE.md`](./ASSETS_LICENSE.md). All rights reserved.
