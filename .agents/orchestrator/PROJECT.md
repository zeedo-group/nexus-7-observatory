# Project: DIW Ultra-Smart Alien Website

## Architecture
- **Frontend**: Vite + React 19 + TypeScript + Lucide Icons + Three.js / WebGL 3D Canvas
- **State & Storage**: Custom IndexedDB Lore Database (`src/services/loreDb.ts`) + React Hooks
- **Styling**: Cybernetic alien minimalistic CSS theme with glowing neons, obsidian dark background, futuristic typography and blur filters
- **Asset Directory**: `public/assets/`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Asset Generation | Generate 15-20 alien images, save in `public/assets/`, build `assetsData.ts` | none | DONE |
| 2 | Website Expansion | Add Lore Codex, Agent Portal, Starmap, Transmissions pages & lore | M1 | DONE |
| 3 | Advanced 3D & DB | Three.js / WebGL 3D interactive model & IndexedDB backend lore database | M1, M2 | DONE |
| 4 | Audit & E2E Verification | Build verification, Reviewer check, Forensic Integrity Audit | M1, M2, M3 | DONE |

## Code Layout
- `src/components/`: Reusable UI components (Navbar, Footer, 3D Canvas, Modal, AgentConsole)
- `src/pages/`: Page views (Home, LoreCodex, AgentHub, Species, Worlds, Artifacts, Transmissions)
- `src/services/`: Database services (`loreDb.ts`), Asset loader, Agent Simulator
- `src/types/`: TypeScript interfaces and types
- `src/data/`: Static lore content & asset manifests
- `public/assets/`: Generated alien visual assets
