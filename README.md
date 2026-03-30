# ⚔️ Guardians of the Realm — Tower Defense

A classic Tower Defense game built with HTML5 Canvas, CSS, and vanilla JavaScript.  
Defend your base across **50 unique levels** by placing and upgrading towers to stop waves of enemies.

## 🎮 How to Play

1. Open `index.html` in any modern browser
2. Click **Play** → select a level
3. Choose a tower from the shop bar at the bottom
4. Click an empty cell on the map to place the tower
5. Press **Start Wave** to send enemies along the path
6. Earn gold by defeating enemies — spend it on more towers or upgrades
7. Don't let enemies reach the end of the path!

## 🏗️ Towers

| Tower     | Cost | Specialty                        |
|-----------|------|----------------------------------|
| 🏹 Archer   | 50   | Fast attack speed                |
| 💣 Cannon   | 75   | Area splash damage               |
| ❄️ Ice       | 60   | Slows enemies                    |
| ⚡ Lightning | 100  | Chain damage to multiple enemies |
| 🎯 Sniper   | 120  | Extreme range, high damage       |

Each tower can be upgraded 3 times for increased stats.

## 👾 Enemies

Goblin → Orc → Wolf → Dark Knight → Troll → Demon → Dragon (Boss)

## 📁 Project Structure

```
index.html          — Main game page
css/style.css       — Modern dark-theme styling
js/levels.js        — 50 level definitions (paths, waves)
js/towers.js        — Tower type definitions
js/enemies.js       — Enemy type definitions
js/game.js          — Core game engine (canvas, loop, logic)
js/ui.js            — UI management (menus, HUD, overlays)
```

## 🖥️ Requirements

- Any modern browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required
