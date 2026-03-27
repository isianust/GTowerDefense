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
                    <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px">${LEVELS[i].name}</div>
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
            item.innerHTML = `
                <div class="shop-icon" style="background:${type.color}; display:flex; align-items:center; justify-content:center; font-size:18px;">${type.icon}</div>
                <span class="shop-name">${type.name}</span>
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
        document.getElementById("hud-level").textContent = `📍 Level ${Game.getLevelIndex() + 1}`;
        document.getElementById("hud-wave").textContent = `🌊 Wave ${Game.getWaveIndex()}/${Game.getTotalWaves()}`;
        document.getElementById("hud-gold").textContent = `💰 ${Game.getGold()}`;
        document.getElementById("hud-lives").textContent = `❤️ ${Game.getLives()}`;
        document.getElementById("hud-score").textContent = `⭐ ${Game.getScore()}`;
        updateShopAffordability();

        const waveBtn = document.getElementById("btn-start-wave");
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

        document.getElementById("info-name").textContent = `${type.icon} ${type.name} (Lv ${tower.level + 1})`;

        let statsHtml = `
            <div>⚔️ Damage: ${tower.damage}</div>
            <div>📏 Range: ${tower.range.toFixed(1)}</div>
            <div>⏱️ Fire Rate: ${tower.fireRate}</div>
        `;
        if (tower.splash > 0) statsHtml += `<div>💥 Splash: ${tower.splash.toFixed(1)}</div>`;
        if (tower.slow > 0) statsHtml += `<div>❄️ Slow: ${Math.round(tower.slow * 100)}%</div>`;
        if (tower.chain > 0) statsHtml += `<div>⚡ Chain: ${tower.chain}</div>`;
        document.getElementById("info-stats").innerHTML = statsHtml;

        // Upgrade button
        const upgradeBtn = document.getElementById("btn-upgrade");
        if (tower.level >= type.upgrades.length) {
            upgradeBtn.textContent = "MAX";
            upgradeBtn.disabled = true;
        } else {
            const cost = type.upgrades[tower.level].cost;
            upgradeBtn.textContent = `⬆ Upgrade (${cost}💰)`;
            upgradeBtn.disabled = Game.getGold() < cost;
        }

        // Sell button
        const refund = Math.floor(tower.totalCost * 0.6);
        document.getElementById("btn-sell").textContent = `💰 Sell (${refund})`;
    }

    function hideTowerInfo() {
        document.getElementById("tower-info").classList.add("hidden");
    }

    // ---- Overlay ----
    function showOverlay(type, stars, score) {
        const overlay = document.getElementById("overlay");
        overlay.classList.remove("hidden");

        if (type === "victory") {
            document.getElementById("overlay-title").textContent = "🎉 Victory!";
            document.getElementById("overlay-message").textContent = `Score: ${score}`;
            document.getElementById("overlay-stars").textContent = starString(stars);
            document.getElementById("btn-next").style.display =
                Game.getLevelIndex() + 1 < LEVELS.length ? "inline-block" : "none";
        } else {
            document.getElementById("overlay-title").textContent = "💀 Defeat";
            document.getElementById("overlay-message").textContent = "The enemy broke through!";
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
