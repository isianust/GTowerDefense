/* ============================================
   UI — Menus, HUD, Shop, Overlays
   ============================================ */

const UI = (() => {
    // ---- Screen Management ----
    function showScreen(id) {
        document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        const screen = document.getElementById(id);
        if (screen) screen.classList.add("active");
    }

    // ---- Apply Translations ----
    function applyTranslations() {
        const t = I18N.t;

        // Menu screen
        document.querySelector(".game-title").textContent = t("title");
        document.querySelector(".game-subtitle").textContent = t("subtitle");
        document.getElementById("btn-play").textContent = t("play");
        document.getElementById("btn-how").textContent = t("howToPlay");
        document.getElementById("btn-lang").textContent =
            I18N.getLang() === "en" ? "🌐 繁體中文" : "🌐 English";

        // How to Play screen
        const howPanel = document.querySelector(".how-panel");
        howPanel.querySelector("h2").textContent = t("howTitle");
        const sections = howPanel.querySelectorAll(".how-section");
        // Objective section
        sections[0].querySelector("h3").textContent = "🎯 " + t("objective");
        sections[0].querySelector("p").textContent = t("objectiveText");
        // Towers section
        sections[1].querySelector("h3").textContent = "🏗️ " + t("towers");
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
        // Controls section
        sections[2].querySelector("h3").textContent = "🎮 " + t("controls");
        const controlItems = sections[2].querySelectorAll("li");
        const controlKeys = ["control1", "control2", "control3", "control4"];
        controlItems.forEach((li, i) => {
            li.textContent = t(controlKeys[i]);
        });

        // Navigation buttons
        document.getElementById("btn-how-back").textContent = t("back");
        document.getElementById("btn-level-back").textContent = t("back");

        // Level select heading
        document.querySelector(".level-panel h2").textContent = t("selectLevel");

        // HUD
        document.getElementById("btn-start-wave").textContent = t("startWave");
        document.querySelector("#tower-shop h3").textContent = t("towerShop");

        // Tower info buttons
        document.getElementById("btn-upgrade").textContent = t("upgrade");
        document.getElementById("btn-sell").textContent = t("sell");
        document.getElementById("btn-deselect").textContent = t("close");

        // Overlay buttons
        document.getElementById("btn-retry").textContent = t("retry");
        document.getElementById("btn-next").textContent = t("nextLevel");
        document.getElementById("btn-menu").textContent = t("menu");
    }

    // ---- Level Grid ----
    function buildLevelGrid() {
        const grid = document.getElementById("level-grid");
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

    function starString(count) {
        let s = "";
        for (let i = 0; i < 3; i++) {
            s += i < count ? "⭐" : "☆";
        }
        return s;
    }

    // ---- Start Level ----
    function startLevel(index) {
        showScreen("game-screen");
        buildShop();
        Game.init(index);
        updateHUD();
        document.getElementById("btn-start-wave").disabled = false;
    }

    // ---- Shop ----
    function buildShop() {
        const container = document.getElementById("shop-items");
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
            item.onclick = (e) => {
                e.stopPropagation();
                toggleShopItem(key, item);
            };
            container.appendChild(item);
        }
    }

    function toggleShopItem(key, el) {
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

    function deselectShop() {
        document.querySelectorAll(".shop-item").forEach(el => el.classList.remove("selected"));
    }

    function updateShopAffordability() {
        const gold = Game.getGold();
        document.querySelectorAll(".shop-item").forEach(el => {
            const key = el.dataset.type;
            const type = TOWER_TYPES[key];
            if (gold < type.cost) {
                el.classList.add("disabled");
            } else {
                el.classList.remove("disabled");
            }
        });
    }

    // ---- HUD ----
    function updateHUD() {
        document.getElementById("hud-level").textContent = `📍 ${I18N.t("level")} ${Game.getLevelIndex() + 1}`;
        document.getElementById("hud-wave").textContent = `🌊 ${I18N.t("wave")} ${Game.getWaveIndex()}/${Game.getTotalWaves()}`;
        document.getElementById("hud-gold").textContent = `💰 ${Game.getGold()}`;
        document.getElementById("hud-lives").textContent = `❤️ ${Game.getLives()}`;
        document.getElementById("hud-score").textContent = `⭐ ${Game.getScore()}`;
        updateShopAffordability();

        const waveBtn = document.getElementById("btn-start-wave");
        waveBtn.textContent = I18N.t("startWave");
        if (Game.isWaveActive() || Game.getWaveIndex() >= Game.getTotalWaves()) {
            waveBtn.disabled = true;
        } else {
            waveBtn.disabled = false;
        }
    }

    // ---- Tower Info ----
    function showTowerInfo(tower) {
        const panel = document.getElementById("tower-info");
        const type = TOWER_TYPES[tower.type];
        panel.classList.remove("hidden");

        const towerName = I18N.t("tower_" + tower.type);
        document.getElementById("info-name").textContent = `${type.icon} ${towerName} (${I18N.t("lv")} ${tower.level + 1})`;

        const t = I18N.t;
        let statsHtml = `
            <div>⚔️ ${t("damage")}: ${tower.damage}</div>
            <div>📏 ${t("range")}: ${tower.range.toFixed(1)}</div>
            <div>⏱️ ${t("fireRate")}: ${tower.fireRate}</div>
        `;
        if (tower.splash > 0) statsHtml += `<div>💥 ${t("splash")}: ${tower.splash.toFixed(1)}</div>`;
        if (tower.slow > 0) statsHtml += `<div>❄️ ${t("slow")}: ${Math.round(tower.slow * 100)}%</div>`;
        if (tower.chain > 0) statsHtml += `<div>⚡ ${t("chain")}: ${tower.chain}</div>`;
        document.getElementById("info-stats").innerHTML = statsHtml;

        // Upgrade button
        const upgradeBtn = document.getElementById("btn-upgrade");
        if (tower.level >= type.upgrades.length) {
            upgradeBtn.textContent = t("max");
            upgradeBtn.disabled = true;
        } else {
            const cost = type.upgrades[tower.level].cost;
            upgradeBtn.textContent = `${t("upgrade")} (${cost}💰)`;
            upgradeBtn.disabled = Game.getGold() < cost;
        }

        // Sell button
        const refund = Math.floor(tower.totalCost * 0.6);
        document.getElementById("btn-sell").textContent = `${t("sell")} (${refund})`;
    }

    function hideTowerInfo() {
        document.getElementById("tower-info").classList.add("hidden");
    }

    // ---- Overlay ----
    function showOverlay(type, stars, score) {
        const overlay = document.getElementById("overlay");
        const t = I18N.t;
        overlay.classList.remove("hidden");

        if (type === "victory") {
            document.getElementById("overlay-title").textContent = t("victory");
            document.getElementById("overlay-message").textContent = `${t("score")}: ${score}`;
            document.getElementById("overlay-stars").textContent = starString(stars);
            document.getElementById("btn-next").style.display =
                Game.getLevelIndex() + 1 < LEVELS.length ? "inline-block" : "none";
        } else {
            document.getElementById("overlay-title").textContent = t("defeat");
            document.getElementById("overlay-message").textContent = t("defeatMsg");
            document.getElementById("overlay-stars").textContent = "";
            document.getElementById("btn-next").style.display = "none";
        }
    }

    function hideOverlay() {
        document.getElementById("overlay").classList.add("hidden");
    }

    // ---- Wire up buttons ----
    function bindEvents() {
        // Menu
        document.getElementById("btn-play").onclick = () => {
            buildLevelGrid();
            showScreen("level-screen");
        };
        document.getElementById("btn-how").onclick = () => showScreen("how-screen");
        document.getElementById("btn-how-back").onclick = () => showScreen("menu-screen");
        document.getElementById("btn-level-back").onclick = () => showScreen("menu-screen");

        // Language toggle
        document.getElementById("btn-lang").onclick = () => {
            const newLang = I18N.getLang() === "en" ? "zh-TW" : "en";
            I18N.setLang(newLang);
            applyTranslations();
        };

        // HUD
        document.getElementById("btn-start-wave").onclick = () => {
            Game.startWave();
            updateHUD();
        };
        document.getElementById("btn-fast").onclick = () => {
            const fast = Game.toggleFast();
            document.getElementById("btn-fast").classList.toggle("active", fast);
        };
        document.getElementById("btn-pause").onclick = () => {
            const paused = Game.togglePause();
            document.getElementById("btn-pause").textContent = paused ? "▶" : "⏸";
            document.getElementById("btn-pause").classList.toggle("active", paused);
        };
        document.getElementById("btn-quit").onclick = () => {
            Game.stop();
            hideOverlay();
            showScreen("menu-screen");
        };

        // Tower info
        document.getElementById("btn-upgrade").onclick = () => Game.upgradeTower();
        document.getElementById("btn-sell").onclick = () => Game.sellTower();
        document.getElementById("btn-deselect").onclick = () => Game.deselectTower();

        // Overlay
        document.getElementById("btn-retry").onclick = () => {
            hideOverlay();
            startLevel(Game.getLevelIndex());
        };
        document.getElementById("btn-next").onclick = () => {
            hideOverlay();
            const next = Game.getLevelIndex() + 1;
            if (next < LEVELS.length) startLevel(next);
        };
        document.getElementById("btn-menu").onclick = () => {
            Game.stop();
            hideOverlay();
            showScreen("menu-screen");
        };

        // Apply translations on load
        applyTranslations();
    }

    // ---- Init on load ----
    window.addEventListener("DOMContentLoaded", () => {
        bindEvents();
        showScreen("menu-screen");
    });

    return {
        showScreen,
        buildLevelGrid,
        updateHUD,
        showTowerInfo,
        hideTowerInfo,
        showOverlay,
        hideOverlay,
        deselectShop,
    };
})();
