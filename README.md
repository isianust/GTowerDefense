<div align="center">

# ⚔️ Guardians of the Realm ⚔️

### Enterprise-Grade Tower Defense Game Engine

[![HTML5](https://img.shields.io/badge/HTML5-Canvas-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-1534%20passed-22c55e?logo=vitest&logoColor=white)](#-testing-framework--vitest)
[![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20繁中-4FC08D)](#-internationalization)
[![Levels](https://img.shields.io/badge/Levels-50-blueviolet)](#-level-design)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![CI](https://github.com/isianust/GTowerDefense/actions/workflows/ci.yml/badge.svg)](https://github.com/isianust/GTowerDefense/actions/workflows/ci.yml)

**A high-performance, zero-dependency tower defense game engine built with vanilla HTML5 Canvas, CSS3, and JavaScript. Features 50 hand-crafted levels, 5 upgradable tower types, 10 enemy classes, bilingual UI (English / 繁體中文), and a modern glassmorphism dark-theme interface.**

[▶ Play Now](#-quick-start) · [📖 Docs](#-table-of-contents) · [🗺️ Roadmap](#-expansion-roadmap) · [🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Game Overview](#-game-overview)
- [How to Play](#-how-to-play)
- [Towers](#-towers)
- [Enemies](#-enemies)
- [Level Design](#-level-design)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Internationalization](#-internationalization)
- [Expansion Roadmap](#-expansion-roadmap)
- [Recommended Enterprise Tooling](#-recommended-enterprise-tooling)
- [Redesign Proposal](#-redesign-proposal)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Quick Start

### Development Mode (Recommended)

```bash
# Clone the repository
git clone https://github.com/isianust/GTowerDefense.git
cd GTowerDefense

# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start Vite dev server (http://localhost:3000)
npm run build        # TypeScript compile + production build
npm run preview      # Preview production build locally
npm run test         # Run all 656 tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint         # ESLint check
npm run typecheck    # TypeScript type checking
npm run format       # Auto-format with Prettier
npm run format:check # Check formatting
```

---

## 🎮 Game Overview

**Guardians of the Realm** is a classic tower defense game where players strategically place and upgrade towers to defend against waves of enemies. The game features:

- 🏰 **50 unique hand-crafted levels** with distinct terrain and pathing
- 🏗️ **5 tower types** each with 3 upgrade tiers (15 total configurations)
- 👾 **10 enemy classes** including 4 powerful bosses
- 🌐 **Bilingual interface** — English and Traditional Chinese (繁體中文)
- 🎨 **Modern dark-theme UI** with glassmorphism and smooth animations
- ⭐ **Star rating system** for level completion
- ⏩ **Fast-forward mode** for experienced players
- 💾 **LocalStorage persistence** for language preferences and progress

---

## 🕹️ How to Play

| Step | Action | Description |
|------|--------|-------------|
| 1 | **Launch** | Open `index.html` in any modern browser |
| 2 | **Start** | Click **▶ Play** → select a level from the 50-level grid |
| 3 | **Build** | Choose a tower from the shop bar → click an empty cell to place it |
| 4 | **Defend** | Press **Start Wave** to send enemies along the path |
| 5 | **Earn** | Defeat enemies to earn gold → buy more towers or upgrades |
| 6 | **Upgrade** | Click placed towers to upgrade (3 tiers) or sell them |
| 7 | **Survive** | Don't let enemies reach the end of the path! |

### Controls

| Input | Action |
|-------|--------|
| 🖱️ Click empty cell | Place selected tower |
| 🖱️ Click placed tower | Open tower info (upgrade / sell) |
| ▶ Start Wave | Begin the next enemy wave |
| ⏩ Fast Forward | Toggle 2× game speed |
| ⏸ Pause | Pause / resume the game |
| ✕ Quit | Return to main menu |

---

## 🏗️ Towers

### Tower Specifications

| Tower | Icon | Cost | Range | Damage | Fire Rate | Specialty | Upgrades |
|-------|------|------|-------|--------|-----------|-----------|----------|
| **Archer** | 🏹 | 50g | 3.0 | 8 | Fast | Rapid single-target DPS | 3 tiers |
| **Cannon** | 💣 | 75g | 2.5 | 25 | Slow | Area splash damage (1.2 cell radius) | 3 tiers |
| **Ice** | ❄️ | 60g | 2.5 | 5 | Medium | Slows enemies by 40% for 90 frames | 3 tiers |
| **Lightning** | ⚡ | 100g | 3.0 | 12 | Medium | Chain damage to 3 additional targets | 3 tiers |
| **Sniper** | 🎯 | 120g | 5.0 | 40 | Very Slow | Extreme range, high single-target damage | 3 tiers |

### Upgrade Paths

<details>
<summary>🏹 Archer Tower Upgrades</summary>

| Tier | Cost | Damage | Range | Fire Rate |
|------|------|--------|-------|-----------|
| Base | 50g | 8 | 3.0 | 30 |
| Tier 1 | +40g | 12 | 3.3 | 26 |
| Tier 2 | +80g | 18 | 3.6 | 22 |
| Tier 3 | +150g | 28 | 4.0 | 18 |

</details>

<details>
<summary>💣 Cannon Tower Upgrades</summary>

| Tier | Cost | Damage | Range | Fire Rate | Splash |
|------|------|--------|-------|-----------|--------|
| Base | 75g | 25 | 2.5 | 70 | 1.2 |
| Tier 1 | +60g | 35 | 2.8 | 65 | 1.4 |
| Tier 2 | +120g | 50 | 3.0 | 58 | 1.6 |
| Tier 3 | +200g | 75 | 3.3 | 50 | 2.0 |

</details>

<details>
<summary>❄️ Ice Tower Upgrades</summary>

| Tier | Cost | Damage | Range | Slow | Duration |
|------|------|--------|-------|------|----------|
| Base | 60g | 5 | 2.5 | 40% | 90f |
| Tier 1 | +50g | 8 | 2.8 | 50% | 110f |
| Tier 2 | +100g | 12 | 3.0 | 60% | 130f |
| Tier 3 | +170g | 18 | 3.3 | 70% | 160f |

</details>

<details>
<summary>⚡ Lightning Tower Upgrades</summary>

| Tier | Cost | Damage | Chain Targets | Chain Range |
|------|------|--------|---------------|-------------|
| Base | 100g | 12 | 3 | 2.0 |
| Tier 1 | +80g | 18 | 4 | 2.2 |
| Tier 2 | +150g | 25 | 5 | 2.5 |
| Tier 3 | +250g | 35 | 6 | 3.0 |

</details>

<details>
<summary>🎯 Sniper Tower Upgrades</summary>

| Tier | Cost | Damage | Range | Fire Rate |
|------|------|--------|-------|-----------|
| Base | 120g | 40 | 5.0 | 90 |
| Tier 1 | +100g | 60 | 5.5 | 82 |
| Tier 2 | +180g | 90 | 6.0 | 72 |
| Tier 3 | +300g | 140 | 7.0 | 60 |

</details>

---

## 👾 Enemies

### Enemy Classification

#### Standard Enemies

| Enemy | HP | Speed | Reward | Damage | Difficulty |
|-------|-----|-------|--------|--------|------------|
| 🟢 **Goblin** | 30 | 1.5 | 5g | 1 | ★☆☆☆☆ |
| 🟤 **Orc** | 80 | 1.0 | 10g | 1 | ★★☆☆☆ |
| ⚪ **Wolf** | 50 | 2.5 | 8g | 1 | ★★☆☆☆ |
| 🟣 **Dark Knight** | 180 | 0.9 | 18g | 2 | ★★★☆☆ |
| 🪨 **Troll** | 400 | 0.6 | 30g | 3 | ★★★★☆ |
| 🔴 **Demon** | 700 | 1.1 | 50g | 4 | ★★★★☆ |

#### Boss Enemies

| Boss | HP | Speed | Reward | Damage | Threat |
|------|-----|-------|--------|--------|--------|
| 🐉 **Dragon** | 2,000 | 0.5 | 150g | 10 | ★★★★★ |
| 💀 **Lich** | 3,000 | 0.7 | 200g | 8 | ★★★★★ |
| 🔥 **Phoenix** | 4,000 | 0.8 | 250g | 12 | ★★★★★+ |
| 🗿 **Titan** | 5,000 | 0.4 | 300g | 15 | ★★★★★+ |

### Enemy Progression

```
Early Game       Mid Game          Late Game           End Game
─────────────────────────────────────────────────────────────────
Goblin (30 HP)   Dark Knight       Demon (700 HP)      Phoenix (4000 HP)
  → Orc (80 HP)   (180 HP)          → Dragon Boss       → Titan Boss
    → Wolf           → Troll           (2000 HP)          (5000 HP)
      (50 HP)         (400 HP)          → Lich Boss
                                         (3000 HP)
```

---

## 🗺️ Level Design

The game features **50 hand-crafted levels** with progressive difficulty:

| Phase | Levels | Enemies | Features |
|-------|--------|---------|----------|
| **Tutorial** | 1–5 | Goblins, Orcs | Simple paths, generous gold |
| **Early** | 6–15 | +Wolves | Winding paths, terrain variety |
| **Mid** | 16–25 | +Dark Knights, Trolls | Complex layouts, decorations |
| **Late** | 26–40 | +Demons, Dragon Boss | Multi-path, restricted placement |
| **Endgame** | 41–50 | +Lich, Phoenix, Titan | Maximum difficulty, all bosses |

Each level defines:
- **Grid layout** (20×12 standard)
- **Enemy path** coordinates
- **Wave composition** (enemy types, counts, spawn intervals)
- **Terrain decorations** (trees, rocks, mountains, rivers)
- **Starting resources** (gold, lives)
- **Background theme**

---

## 🏛️ Architecture

### Current Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        index.html                            │
│                    (Entry Point / DOM)                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  i18n.js  │  │ levels.js│  │ towers.js│  │enemies.js│    │
│  │          │  │          │  │          │  │          │    │
│  │ Language  │  │ 50 Level │  │ 5 Tower  │  │10 Enemy  │    │
│  │ Strings   │  │ Configs  │  │ Configs  │  │ Configs  │    │
│  └─────┬────┘  └─────┬────┘  └────┬─────┘  └────┬─────┘    │
│        │             │            │              │           │
│  ┌─────┴─────────────┴────────────┴──────────────┴─────┐    │
│  │                     game.js                          │    │
│  │              (Core Game Engine)                       │    │
│  │                                                      │    │
│  │  • init()        • update()      • render()          │    │
│  │  • loop()        • placeTower()  • startWave()       │    │
│  │  • hitEnemy()    • spawnParticles()                   │    │
│  │  • handleClick() • handleHover()                     │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                         │                                    │
│  ┌──────────────────────┴───────────────────────────────┐    │
│  │                      ui.js                            │    │
│  │               (UI Management)                         │    │
│  │                                                       │    │
│  │  • Screen transitions   • HUD updates                 │    │
│  │  • Tower shop           • Victory/Defeat overlays     │    │
│  │  • Level select grid    • Event handlers              │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                      css/style.css                           │
│              (Glassmorphism Dark Theme)                       │
└──────────────────────────────────────────────────────────────┘
```

### Design Patterns

| Pattern | Usage |
|---------|-------|
| **IIFE** (Immediately Invoked Function Expression) | Module encapsulation for each JS file |
| **Game Loop** | `requestAnimationFrame` → `update()` → `render()` cycle |
| **Observer** | Event-driven UI updates and user input handling |
| **Data-Driven Design** | Tower/enemy/level configs as declarative data objects |
| **State Machine** | Screen management (menu → level select → game → overlay) |

### Game Loop Flow

```
requestAnimationFrame(loop)
        │
        ▼
    ┌───────┐
    │ loop()│ ◄──────────────────────┐
    └───┬───┘                        │
        │                            │
        ▼                            │
  ┌───────────┐                      │
  │ update()  │                      │
  │           │                      │
  │ • Move enemies along path        │
  │ • Tower targeting & shooting     │
  │ • Projectile physics             │
  │ • Collision detection            │
  │ • Damage application             │
  │ • Wave spawning                  │
  │ • Particle updates               │
  └─────┬─────┘                      │
        │                            │
        ▼                            │
  ┌───────────┐                      │
  │ render()  │                      │
  │           │                      │
  │ • Clear canvas                   │
  │ • Draw terrain & decorations     │
  │ • Draw grid overlay              │
  │ • Draw path                      │
  │ • Draw towers + range circles    │
  │ • Draw enemies + HP bars         │
  │ • Draw projectiles               │
  │ • Draw particles                 │
  └─────┬─────┘                      │
        │                            │
        └────────────────────────────┘
```

---

## 🔧 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Rendering** | HTML5 Canvas 2D API | Game visuals, animations, particles |
| **Logic** | TypeScript (Strict mode) | Type-safe game engine, state management |
| **Build** | Vite | Fast dev server, optimized production builds |
| **UI** | HTML5 + CSS3 | Menus, HUD, overlays, shop |
| **Styling** | CSS3 (Gradients, Glassmorphism) | Modern dark-theme interface |
| **i18n** | Custom TS module | English ↔ 繁體中文 |
| **Testing** | Vitest + jsdom | 656 unit tests, V8 coverage |
| **Linting** | ESLint + Prettier | Code quality and formatting |
| **CI/CD** | GitHub Actions | Automated lint, typecheck, test, build |
| **Storage** | LocalStorage API | Language prefs, game progress |
| **Deployment** | Static files (Vite build) | Optimized, tree-shaken, CDN-ready |

---

## 📁 Project Structure

```
GTowerDefense/
├── index.html                   # Entry point — semantic HTML5, Vite module loading
├── css/
│   └── style.css                # Dark theme, glassmorphism, animations
├── src/                         # TypeScript source (ES Modules)
│   ├── main.ts                  # Application entry point
│   ├── types.ts                 # Shared type definitions
│   ├── i18n.ts                  # Bilingual localization (EN / 繁中)
│   ├── game.ts                  # Core game engine (loop, physics, rendering)
│   ├── ui.ts                    # Screen management, HUD, shop, overlays
│   ├── data/
│   │   ├── towers.ts            # 5 tower types with 3 upgrade tiers each
│   │   ├── enemies.ts           # 10 enemy types (6 standard + 4 bosses)
│   │   └── levels.ts            # 50 level definitions (paths, waves, terrain)
│   ├── engine/                  # Core engine modules (Phase 2, 3 & 4)
│   │   ├── pathfinding.ts       # A* pathfinding algorithm (34 tests)
│   │   ├── quadtree.ts          # Quadtree spatial indexing (29 tests)
│   │   ├── saveload.ts          # Save/load system with storage abstraction (22 tests)
│   │   ├── audio.ts             # Audio manager with Web Audio API (26 tests)
│   │   ├── achievements.ts      # 52 achievements with persistent tracking (39 tests)
│   │   ├── abilities.ts         # Special abilities: meteor, freeze, gold rush (35 tests)
│   │   ├── particles.ts         # Particle engine with emitters & presets (35 tests)
│   │   ├── combat.ts            # Combat engine: damage, targeting, chain (59 tests)
│   │   ├── wavemanager.ts       # Wave spawning & scheduling system (35 tests)
│   │   ├── boss.ts              # Multi-phase boss fight mechanics (60 tests)
│   │   ├── levelgen.ts          # Procedural level generation (39 tests)
│   │   ├── hero.ts              # Hero system: 4 classes, skills, level-up (hero tests)
│   │   ├── replay.ts            # Replay recording & playback system (46 tests)
│   │   └── ecs.ts               # Entity-Component System (47 tests)
│   └── __tests__/
│       ├── towers.test.ts       # Tower data validation (261 tests — 15 types)
│       ├── enemies.test.ts      # Enemy data validation (200 tests — 25 types)
│       ├── levels.test.ts       # Level structure validation (455 tests)
│       ├── i18n.test.ts         # Localization coverage (17 tests)
│       ├── types.test.ts        # Type definition tests (10 tests)
│       ├── pathfinding.test.ts  # A* pathfinding tests (34 tests)
│       ├── quadtree.test.ts     # Quadtree spatial tests (29 tests)
│       ├── saveload.test.ts     # Save/load persistence tests (22 tests)
│       ├── audio.test.ts        # Audio system tests (26 tests)
│       ├── achievements.test.ts # Achievement system tests (39 tests)
│       ├── abilities.test.ts    # Special abilities tests (35 tests)
│       ├── particles.test.ts    # Particle engine tests (35 tests)
│       ├── combat.test.ts       # Combat engine tests (59 tests)
│       ├── wavemanager.test.ts  # Wave manager tests (35 tests)
│       ├── boss.test.ts         # Boss mechanics tests (60 tests)
│       ├── levelgen.test.ts     # Level generation tests (39 tests)
│       ├── hero.test.ts         # Hero system tests (hero tests)
│       ├── replay.test.ts       # Replay system tests (46 tests)
│       └── ecs.test.ts          # ECS tests (47 tests)
├── js/                          # Original vanilla JS (preserved for reference)
├── .github/workflows/ci.yml    # CI/CD pipeline
├── package.json                 # npm config with scripts
├── tsconfig.json                # TypeScript strict config
├── vite.config.ts               # Vite build config
├── vitest.config.ts             # Test runner config
├── eslint.config.mjs            # ESLint config
├── .prettierrc                  # Prettier config
└── README.md                    # This file
```

---

## 🌐 Internationalization

The game ships with full bilingual support:

| Language | Code | Coverage |
|----------|------|----------|
| English | `en` | 100% — all UI, towers, enemies, levels |
| 繁體中文 (Traditional Chinese) | `zh-TW` | 100% — 完整翻譯所有介面 |

Language preference is persisted in LocalStorage and can be toggled from the main menu via the 🌐 button.

---

## 🗺️ Expansion Roadmap

### Phase 1 — Foundation & Quality (Weeks 1–3)

- [x] **Modular Build System** — Migrate to ES Modules with Vite bundler
- [x] **TypeScript Migration** — Add type safety to all game modules
- [x] **Testing Framework** — Add Vitest for unit/integration tests (1534 tests, data modules at 100% coverage)
- [x] **CI/CD Pipeline** — GitHub Actions for linting, testing, building, and deployment
- [x] **Code Quality** — ESLint + Prettier for consistent code standards
- [ ] **Asset Pipeline** — Replace emoji icons with custom SVG/sprite sheet assets

### Phase 2 — Core Engine Upgrades (Weeks 4–8)

- [x] **Entity-Component System (ECS)** — Full ECS with World, Components, Systems, Tags (47 tests)
- [x] **Pathfinding Engine** — A* algorithm for dynamic path calculation (34 tests)
- [x] **Spatial Indexing** — Quadtree for efficient collision detection at scale (29 tests)
- [x] **Audio System** — Web Audio API for sound effects and background music (26 tests)
- [x] **Particle Engine** — Particle system with emitters, physics, and presets (35 tests)
- [x] **Save/Load System** — Full game state serialization with storage abstraction (22 tests)

### Phase 3 — Content Expansion (Weeks 9–14)

- [x] **Level Generator** — Procedural level generation with seeded RNG (39 tests)
- [x] **10 New Tower Types** — Flame, Mortar, Poison, Tesla, Laser, Catapult, Frost, Venom, Ballista, Rail Gun (261 total tower tests)
- [x] **15 New Enemy Types** — 10 standard (Skeleton, Harpy, Golem…) + 5 bosses (Hydra, Demon Lord, Shadow, Colossus, Overlord) (200 total enemy tests)
- [x] **Hero System** — 4 hero classes (Warrior/Mage/Ranger/Paladin) with skills, level-up, energy
- [x] **Special Abilities** — Meteor strike, freeze blast, gold rush power-ups (35 tests)
- [x] **Boss Mechanics** — Multi-phase boss fights with unique attack patterns (60 tests)
- [x] **Achievement System** — 52 achievements with persistent unlock tracking (39 tests)
- [x] **Combat Engine** — Damage calculation, targeting strategies, chain lightning (59 tests)
- [x] **Wave Manager** — Wave spawning, scheduling, and progression system (35 tests)

### Phase 4 — Multiplayer & Social (Weeks 15–20)

- [x] **Replay System** — Full game recording, serialization, and playback engine (46 tests)
- [ ] **Leaderboard System** — Global and friends leaderboards via backend API
- [ ] **Co-op Mode** — 2-player cooperative defense via WebSocket/WebRTC
- [ ] **PvP Mode** — Send custom waves against opponents
- [ ] **Community Levels** — Level editor with sharing and rating system

### Phase 5 — Platform & Distribution (Weeks 21–26)

- [ ] **Progressive Web App (PWA)** — Offline support with Service Worker
- [ ] **Mobile Optimization** — Touch controls, responsive layout, haptic feedback
- [ ] **Desktop App** — Electron or Tauri wrapper for native distribution
- [ ] **Steam / Itch.io** — Distribution platform integration
- [ ] **Analytics Dashboard** — Player behavior tracking and game balance insights

---

## 🛠️ Recommended Enterprise Tooling

### Build & Development

| Tool | Purpose | Why |
|------|---------|-----|
| [**Vite**](https://vitejs.dev/) | Build tool & dev server | Blazing fast HMR, ES Module native, zero-config |
| [**TypeScript**](https://www.typescriptlang.org/) | Type safety | Catch bugs at compile time, better IDE support |
| [**ESLint**](https://eslint.org/) | Code linting | Enforce consistent code quality standards |
| [**Prettier**](https://prettier.io/) | Code formatting | Automatic, opinionated formatting |
| [**Husky**](https://typicode.github.io/husky/) | Git hooks | Pre-commit linting and testing |

### Testing

| Tool | Purpose | Why |
|------|---------|-----|
| [**Vitest**](https://vitest.dev/) | Unit & integration tests | Vite-native, fast, Jest-compatible API |
| [**Playwright**](https://playwright.dev/) | E2E browser testing | Cross-browser, visual regression, Canvas testing |
| [**Testing Library**](https://testing-library.com/) | DOM testing utilities | User-centric testing approach |

### CI/CD & Deployment

| Tool | Purpose | Why |
|------|---------|-----|
| [**GitHub Actions**](https://github.com/features/actions) | CI/CD pipeline | Native GitHub integration, free for open source |
| [**GitHub Pages**](https://pages.github.com/) | Static hosting | Zero-config deployment from repo |
| [**Vercel**](https://vercel.com/) | Preview deployments | PR preview environments, global CDN |
| [**Codecov**](https://about.codecov.io/) | Coverage reporting | Track test coverage trends |

### Game-Specific Tools

| Tool | Purpose | Why |
|------|---------|-----|
| [**Tiled**](https://www.mapeditor.org/) | Level editor | Industry-standard 2D map editor, JSON export |
| [**Aseprite**](https://www.aseprite.org/) | Pixel art & sprites | Professional sprite sheet creation |
| [**Howler.js**](https://howlerjs.com/) | Audio library | Cross-browser Web Audio with fallback |
| [**PixiJS**](https://pixijs.com/) | 2D WebGL renderer | GPU-accelerated rendering (future upgrade path) |
| [**Matter.js**](https://brm.io/matter-js/) | Physics engine | Advanced collision detection and physics |

### Monitoring & Analytics

| Tool | Purpose | Why |
|------|---------|-----|
| [**Sentry**](https://sentry.io/) | Error tracking | Real-time error monitoring in production |
| [**Plausible**](https://plausible.io/) | Privacy-first analytics | Lightweight, GDPR-compliant player analytics |
| [**Lighthouse CI**](https://github.com/GoogleChrome/lighthouse-ci) | Performance auditing | Automated performance regression detection |

---

## 🔄 Redesign Proposal

### Current State Analysis

| Aspect | Current | Target |
|--------|---------|--------|
| **Architecture** | IIFE modules, global scope | ES Modules, ECS pattern |
| **Type Safety** | None (vanilla JS) | Full TypeScript coverage |
| **Testing** | Manual browser testing | Automated unit + E2E (80%+ coverage) |
| **Build** | None (raw files) | Vite with tree-shaking and minification |
| **CI/CD** | None | GitHub Actions (lint → test → build → deploy) |
| **Assets** | Emoji-based | Custom SVG sprites with animation |
| **Audio** | None | Web Audio API with Howler.js |
| **Rendering** | Canvas 2D | Canvas 2D + optional WebGL upgrade path |
| **Mobile** | Basic responsive | Full PWA with touch controls |
| **Multiplayer** | None | WebSocket co-op + PvP |

### Proposed Module Architecture

```
src/
├── core/
│   ├── engine.ts           # Game loop, timing, state management
│   ├── ecs.ts              # Entity-Component-System framework
│   ├── renderer.ts         # Canvas abstraction layer
│   ├── input.ts            # Unified input handling (mouse, touch, keyboard)
│   └── audio.ts            # Sound manager with Web Audio API
├── components/
│   ├── position.ts         # Position component
│   ├── health.ts           # Health component
│   ├── velocity.ts         # Movement component
│   ├── tower.ts            # Tower-specific component
│   ├── enemy.ts            # Enemy-specific component
│   └── projectile.ts       # Projectile component
├── systems/
│   ├── movement.ts         # Enemy pathfinding & movement
│   ├── targeting.ts        # Tower target acquisition
│   ├── combat.ts           # Damage calculation, effects
│   ├── spawning.ts         # Wave spawning logic
│   ├── rendering.ts        # Draw all entities
│   └── particle.ts         # Particle effects system
├── data/
│   ├── towers.ts           # Tower definitions (typed)
│   ├── enemies.ts          # Enemy definitions (typed)
│   ├── levels/             # Level data (individual files)
│   └── i18n/               # Localization files (JSON)
├── ui/
│   ├── screens/            # React/Preact screen components
│   ├── hud/                # HUD overlay components
│   └── shop/               # Tower shop components
├── utils/
│   ├── math.ts             # Vector math, geometry
│   ├── pathfinding.ts      # A* pathfinding
│   ├── spatial.ts          # Quadtree spatial indexing
│   └── storage.ts          # Save/load with IndexedDB
└── index.ts                # Application entry point
```

### Suggested CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint          # ESLint + Prettier check
      - run: npm run typecheck     # TypeScript compiler
      - run: npm run test          # Vitest unit tests
      - run: npm run test:e2e      # Playwright E2E tests
      - run: npm run build         # Production build

  deploy:
    needs: quality
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style (or ESLint rules once configured)
- Write tests for new features
- Update documentation for any API changes
- Keep commits atomic and descriptive
- Reference related issues in PR descriptions

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using vanilla HTML5, CSS3, and JavaScript**

[⬆ Back to Top](#️-guardians-of-the-realm-️)

</div>
