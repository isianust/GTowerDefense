/* ============================================
   UI — Menus, HUD, Shop, Overlays
   ============================================ */

import type { PlacedTower } from "./types";
import { TOWER_TYPES } from "./data/towers";
import { LEVELS } from "./data/levels";
import * as I18N from "./i18n";
import * as Game from "./game";

// ---- Screen Management ----
export function showScreen(id: string): void {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const screen = document.getElementById(id);
  if (screen) screen.classList.add("active");
}

// ---- Apply Translations ----
export function applyTranslations(): void {
  const t = I18N.t;

  // Menu screen
  const gameTitle = document.querySelector(".game-title");
  if (gameTitle) gameTitle.textContent = t("title");
  const gameSubtitle = document.querySelector(".game-subtitle");
  if (gameSubtitle) gameSubtitle.textContent = t("subtitle");
  const btnPlay = document.getElementById("btn-play");
  if (btnPlay) btnPlay.textContent = t("play");
  const btnHow = document.getElementById("btn-how");
  if (btnHow) btnHow.textContent = t("howToPlay");
  const btnLang = document.getElementById("btn-lang");
  if (btnLang) btnLang.textContent = I18N.getLang() === "en" ? "🌐 繁體中文" : "🌐 English";

  // How to Play screen
  const howPanel = document.querySelector(".how-panel");
  if (howPanel) {
    const h2 = howPanel.querySelector("h2");
    if (h2) h2.textContent = t("howTitle");
    const sections = howPanel.querySelectorAll(".how-section");
    // Objective section
    if (sections[0]) {
      const h3 = sections[0].querySelector("h3");
      if (h3) h3.textContent = "🎯 " + t("objective");
      const p = sections[0].querySelector("p");
      if (p) p.textContent = t("objectiveText");
    }
    // Towers section
    if (sections[1]) {
      const h3 = sections[1].querySelector("h3");
      if (h3) h3.textContent = "🏗️ " + t("towers");
      const towerItems = sections[1].querySelectorAll("li");
      const towerDescs = ["archerDesc", "cannonDesc", "iceDesc", "lightningDesc", "sniperDesc"];
      towerItems.forEach((li, i) => {
        const icon = li.querySelector(".tower-icon");
        if (icon) {
          li.innerHTML = "";
          li.appendChild(icon);
          li.insertAdjacentHTML("beforeend", " " + t(towerDescs[i]));
        }
      });
    }
    // Controls section
    if (sections[2]) {
      const h3 = sections[2].querySelector("h3");
      if (h3) h3.textContent = "🎮 " + t("controls");
      const controlItems = sections[2].querySelectorAll("li");
      const controlKeys = ["control1", "control2", "control3", "control4"];
      controlItems.forEach((li, i) => {
        li.textContent = t(controlKeys[i]);
      });
    }
  }

  // Navigation buttons
  const btnHowBack = document.getElementById("btn-how-back");
  if (btnHowBack) btnHowBack.textContent = t("back");
  const btnLevelBack = document.getElementById("btn-level-back");
  if (btnLevelBack) btnLevelBack.textContent = t("back");

  // Level select heading
  const levelHeading = document.querySelector(".level-panel h2");
  if (levelHeading) levelHeading.textContent = t("selectLevel");

  // HUD
  const btnStartWave = document.getElementById("btn-start-wave");
  if (btnStartWave) btnStartWave.textContent = t("startWave");
  const shopTitle = document.querySelector("#tower-shop h3");
  if (shopTitle) shopTitle.textContent = t("towerShop");

  // Tower info buttons
  const btnUpgrade = document.getElementById("btn-upgrade");
  if (btnUpgrade) btnUpgrade.textContent = t("upgrade");
  const btnSell = document.getElementById("btn-sell");
  if (btnSell) btnSell.textContent = t("sell");
  const btnDeselect = document.getElementById("btn-deselect");
  if (btnDeselect) btnDeselect.textContent = t("close");

  // Overlay buttons
  const btnRetry = document.getElementById("btn-retry");
  if (btnRetry) btnRetry.textContent = t("retry");
  const btnNext = document.getElementById("btn-next");
  if (btnNext) btnNext.textContent = t("nextLevel");
  const btnMenu = document.getElementById("btn-menu");
  if (btnMenu) btnMenu.textContent = t("menu");
}

// ---- Level Grid ----
export function buildLevelGrid(): void {
  const grid = document.getElementById("level-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const progress = Game.loadProgress();
  for (let i = 0; i < LEVELS.length; i++) {
    const card = document.createElement("div");
    card.className = "level-card";
    const unlocked = i in progress;
    const stars = progress[i] || 0;

    if (!unlocked) {
      card.classList.add("locked");
      card.innerHTML = `<div class="lock-icon">🔒</div><div class="level-num">${i + 1}</div>`;
    } else {
      card.innerHTML = `
                <div class="level-num">${i + 1}</div>
                <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px">${I18N.t("level_" + i)}</div>
                <div class="level-stars">${starString(stars)}</div>
            `;
      card.onclick = () => startLevel(i);
    }
    grid.appendChild(card);
  }
}

function starString(count: number): string {
  let s = "";
  for (let i = 0; i < 3; i++) {
    s += i < count ? "⭐" : "☆";
  }
  return s;
}

// ---- Start Level ----
function startLevel(index: number): void {
  showScreen("game-screen");
  buildShop();
  Game.init(index);
  updateHUD();
  const btn = document.getElementById("btn-start-wave") as HTMLButtonElement | null;
  if (btn) btn.disabled = false;
}

// ---- Shop ----
function buildShop(): void {
  const container = document.getElementById("shop-items");
  if (!container) return;
  container.innerHTML = "";
  for (const [key, type] of Object.entries(TOWER_TYPES)) {
    const item = document.createElement("div");
    item.className = "shop-item";
    item.dataset.type = key;
    const towerName = I18N.t("tower_" + key);
    item.innerHTML = `
            <div class="shop-icon" style="background:${type.color}; display:flex; align-items:center; justify-content:center; font-size:18px;">${type.icon}</div>
            <span class="shop-name">${towerName}</span>
            <span class="shop-cost">💰 ${type.cost}</span>
        `;
    item.onclick = (e: MouseEvent) => {
      e.stopPropagation();
      toggleShopItem(key, item);
    };
    container.appendChild(item);
  }
}

function toggleShopItem(key: string, el: HTMLElement): void {
  const current = Game.getSelectedTowerType();
  deselectShop();
  if (current === key) {
    Game.deselectTowerType();
    return;
  }
  const type = TOWER_TYPES[key];
  if (Game.getGold() < type.cost) return;
  el.classList.add("selected");
  Game.selectTowerType(key);
}

export function deselectShop(): void {
  document.querySelectorAll(".shop-item").forEach((el) => el.classList.remove("selected"));
}

function updateShopAffordability(): void {
  const gold = Game.getGold();
  document.querySelectorAll(".shop-item").forEach((el) => {
    const key = (el as HTMLElement).dataset.type;
    if (!key) return;
    const type = TOWER_TYPES[key];
    if (gold < type.cost) {
      el.classList.add("disabled");
    } else {
      el.classList.remove("disabled");
    }
  });
}

// ---- HUD ----
export function updateHUD(): void {
  const hudLevel = document.getElementById("hud-level");
  if (hudLevel)
    hudLevel.textContent = `📍 ${I18N.t("level")} ${Game.getLevelIndex() + 1}`;
  const hudWave = document.getElementById("hud-wave");
  if (hudWave)
    hudWave.textContent = `🌊 ${I18N.t("wave")} ${Game.getWaveIndex()}/${Game.getTotalWaves()}`;
  const hudGold = document.getElementById("hud-gold");
  if (hudGold) hudGold.textContent = `💰 ${Game.getGold()}`;
  const hudLives = document.getElementById("hud-lives");
  if (hudLives) hudLives.textContent = `❤️ ${Game.getLives()}`;
  const hudScore = document.getElementById("hud-score");
  if (hudScore) hudScore.textContent = `⭐ ${Game.getScore()}`;
  updateShopAffordability();

  const waveBtn = document.getElementById("btn-start-wave") as HTMLButtonElement | null;
  if (waveBtn) {
    waveBtn.textContent = I18N.t("startWave");
    if (Game.isWaveActive() || Game.getWaveIndex() >= Game.getTotalWaves()) {
      waveBtn.disabled = true;
    } else {
      waveBtn.disabled = false;
    }
  }
}

// ---- Tower Info ----
export function showTowerInfo(tower: PlacedTower): void {
  const panel = document.getElementById("tower-info");
  if (!panel) return;
  const type = TOWER_TYPES[tower.type];
  panel.classList.remove("hidden");

  const towerName = I18N.t("tower_" + tower.type);
  const infoName = document.getElementById("info-name");
  if (infoName)
    infoName.textContent = `${type.icon} ${towerName} (${I18N.t("lv")} ${tower.level + 1})`;

  const t = I18N.t;
  let statsHtml = `
        <div>⚔️ ${t("damage")}: ${tower.damage}</div>
        <div>📏 ${t("range")}: ${tower.range.toFixed(1)}</div>
        <div>⏱️ ${t("fireRate")}: ${tower.fireRate}</div>
    `;
  if (tower.splash > 0) statsHtml += `<div>💥 ${t("splash")}: ${tower.splash.toFixed(1)}</div>`;
  if (tower.slow > 0)
    statsHtml += `<div>❄️ ${t("slow")}: ${Math.round(tower.slow * 100)}%</div>`;
  if (tower.chain > 0) statsHtml += `<div>⚡ ${t("chain")}: ${tower.chain}</div>`;
  const infoStats = document.getElementById("info-stats");
  if (infoStats) infoStats.innerHTML = statsHtml;

  // Upgrade button
  const upgradeBtn = document.getElementById("btn-upgrade") as HTMLButtonElement | null;
  if (upgradeBtn) {
    if (tower.level >= type.upgrades.length) {
      upgradeBtn.textContent = t("max");
      upgradeBtn.disabled = true;
    } else {
      const cost = type.upgrades[tower.level].cost;
      upgradeBtn.textContent = `${t("upgrade")} (${cost}💰)`;
      upgradeBtn.disabled = Game.getGold() < cost;
    }
  }

  // Sell button
  const refund = Math.floor(tower.totalCost * 0.6);
  const sellBtn = document.getElementById("btn-sell");
  if (sellBtn) sellBtn.textContent = `${t("sell")} (${refund})`;
}

export function hideTowerInfo(): void {
  const panel = document.getElementById("tower-info");
  if (panel) panel.classList.add("hidden");
}

// ---- Overlay ----
export function showOverlay(type: string, stars: number, score: number): void {
  const overlay = document.getElementById("overlay");
  if (!overlay) return;
  const t = I18N.t;
  overlay.classList.remove("hidden");

  if (type === "victory") {
    const overlayTitle = document.getElementById("overlay-title");
    if (overlayTitle) overlayTitle.textContent = t("victory");
    const overlayMessage = document.getElementById("overlay-message");
    if (overlayMessage) overlayMessage.textContent = `${t("score")}: ${score}`;
    const overlayStars = document.getElementById("overlay-stars");
    if (overlayStars) overlayStars.textContent = starString(stars);
    const btnNext = document.getElementById("btn-next");
    if (btnNext)
      btnNext.style.display =
        Game.getLevelIndex() + 1 < LEVELS.length ? "inline-block" : "none";
  } else {
    const overlayTitle = document.getElementById("overlay-title");
    if (overlayTitle) overlayTitle.textContent = t("defeat");
    const overlayMessage = document.getElementById("overlay-message");
    if (overlayMessage) overlayMessage.textContent = t("defeatMsg");
    const overlayStars = document.getElementById("overlay-stars");
    if (overlayStars) overlayStars.textContent = "";
    const btnNext = document.getElementById("btn-next");
    if (btnNext) btnNext.style.display = "none";
  }
}

export function hideOverlay(): void {
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.classList.add("hidden");
}

// ---- Wire up buttons ----
function bindEvents(): void {
  // Menu
  const btnPlay = document.getElementById("btn-play");
  if (btnPlay)
    btnPlay.onclick = () => {
      buildLevelGrid();
      showScreen("level-screen");
    };
  const btnHow = document.getElementById("btn-how");
  if (btnHow) btnHow.onclick = () => showScreen("how-screen");
  const btnHowBack = document.getElementById("btn-how-back");
  if (btnHowBack) btnHowBack.onclick = () => showScreen("menu-screen");
  const btnLevelBack = document.getElementById("btn-level-back");
  if (btnLevelBack) btnLevelBack.onclick = () => showScreen("menu-screen");

  // Language toggle
  const btnLang = document.getElementById("btn-lang");
  if (btnLang)
    btnLang.onclick = () => {
      const newLang = I18N.getLang() === "en" ? "zh-TW" : "en";
      I18N.setLang(newLang as "en" | "zh-TW");
      applyTranslations();
    };

  // HUD
  const btnStartWave = document.getElementById("btn-start-wave");
  if (btnStartWave)
    btnStartWave.onclick = () => {
      Game.startWave();
      updateHUD();
    };
  const btnFast = document.getElementById("btn-fast");
  if (btnFast)
    btnFast.onclick = () => {
      const fast = Game.toggleFast();
      btnFast.classList.toggle("active", fast);
    };
  const btnPause = document.getElementById("btn-pause");
  if (btnPause)
    btnPause.onclick = () => {
      const paused = Game.togglePause();
      btnPause.textContent = paused ? "▶" : "⏸";
      btnPause.classList.toggle("active", paused);
    };
  const btnQuit = document.getElementById("btn-quit");
  if (btnQuit)
    btnQuit.onclick = () => {
      Game.stop();
      hideOverlay();
      showScreen("menu-screen");
    };

  // Tower info
  const btnUpgrade = document.getElementById("btn-upgrade");
  if (btnUpgrade) btnUpgrade.onclick = () => Game.upgradeTower();
  const btnSell = document.getElementById("btn-sell");
  if (btnSell) btnSell.onclick = () => Game.sellTower();
  const btnDeselect = document.getElementById("btn-deselect");
  if (btnDeselect) btnDeselect.onclick = () => Game.deselectTower();

  // Overlay
  const btnRetry = document.getElementById("btn-retry");
  if (btnRetry)
    btnRetry.onclick = () => {
      hideOverlay();
      startLevel(Game.getLevelIndex());
    };
  const btnNext = document.getElementById("btn-next");
  if (btnNext)
    btnNext.onclick = () => {
      hideOverlay();
      const next = Game.getLevelIndex() + 1;
      if (next < LEVELS.length) startLevel(next);
    };
  const btnMenuBtn = document.getElementById("btn-menu");
  if (btnMenuBtn)
    btnMenuBtn.onclick = () => {
      Game.stop();
      hideOverlay();
      showScreen("menu-screen");
    };

  // Apply translations on load
  applyTranslations();
}

// ---- Init on load ----
export function initUI(): void {
  window.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    showScreen("menu-screen");
  });
}
