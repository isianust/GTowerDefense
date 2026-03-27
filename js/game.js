/* ============================================
   GAME ENGINE — Core logic
   ============================================ */

const Game = (() => {
    // ---- Constants ----
    const BASE_CELL = 48;
    const HUD_HEIGHT = 52;
    const SHOP_HEIGHT = 72;

    // ---- State ----
    let canvas, ctx;
    let cellSize, offsetX, offsetY;
    let level, levelIndex;
    let grid;                // 2D array: null = empty, 'path', or tower object
    let towers = [];
    let enemies = [];
    let projectiles = [];
    let particles = [];
    let gold, lives, score;
    let waveIndex, waveActive, waveTimer, waveQueue;
    let totalWaves;
    let selectedTowerType;   // string key or null
    let selectedTower;       // placed tower object or null
    let paused, fastForward;
    let animFrame;
    let gameOver;
    let pathCells;           // Set of "x,y" strings for path
    let hoveredCell;         // {x,y} or null

    // ---- Initialization ----
    function init(lvlIndex) {
        levelIndex = lvlIndex;
        level = LEVELS[lvlIndex];
        canvas = document.getElementById("game-canvas");
        ctx = canvas.getContext("2d");

        resizeCanvas();

        // Build grid
        grid = [];
        for (let y = 0; y < level.rows; y++) {
            grid[y] = [];
            for (let x = 0; x < level.cols; x++) {
                grid[y][x] = null;
            }
        }
        pathCells = new Set();
        for (const p of level.path) {
            grid[p.y][p.x] = "path";
            pathCells.add(p.x + "," + p.y);
        }

        // State
        towers = [];
        enemies = [];
        projectiles = [];
        particles = [];
        gold = level.startGold;
        lives = level.lives;
        score = 0;
        waveIndex = 0;
        waveActive = false;
        waveTimer = 0;
        waveQueue = [];
        totalWaves = level.waves.length;
        selectedTowerType = null;
        selectedTower = null;
        paused = false;
        fastForward = false;
        gameOver = false;
        hoveredCell = null;

        // Events
        canvas.onmousedown = handleClick;
        canvas.onmousemove = handleHover;
        canvas.onmouseleave = () => { hoveredCell = null; };
        window.onresize = resizeCanvas;

        // Start loop
        if (animFrame) cancelAnimationFrame(animFrame);
        loop();
    }

    function resizeCanvas() {
        const w = window.innerWidth;
        const h = window.innerHeight - HUD_HEIGHT - SHOP_HEIGHT;
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";

        if (!level) return;
        const sx = w / level.cols;
        const sy = h / level.rows;
        cellSize = Math.floor(Math.min(sx, sy));
        offsetX = Math.floor((w - cellSize * level.cols) / 2);
        offsetY = Math.floor((h - cellSize * level.rows) / 2);
    }

    // ---- Coordinate helpers ----
    function gridToPixel(gx, gy) {
        return {
            x: offsetX + gx * cellSize + cellSize / 2,
            y: offsetY + gy * cellSize + cellSize / 2
        };
    }
    function pixelToGrid(px, py) {
        const gx = Math.floor((px - offsetX) / cellSize);
        const gy = Math.floor((py - offsetY) / cellSize);
        return { x: gx, y: gy };
    }
    function dist(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    // ---- Input ----
    function handleClick(e) {
        if (gameOver || paused) return;
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const g = pixelToGrid(px, py);

        if (g.x < 0 || g.x >= level.cols || g.y < 0 || g.y >= level.rows) return;

        // If a tower type is selected from shop, try to place
        if (selectedTowerType) {
            placeTower(g.x, g.y);
            return;
        }

        // If clicking on a placed tower, select it
        const cell = grid[g.y][g.x];
        if (cell && cell !== "path") {
            selectedTower = cell;
            UI.showTowerInfo(cell);
            return;
        }

        // Deselect
        selectedTower = null;
        UI.hideTowerInfo();
    }

    function handleHover(e) {
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const g = pixelToGrid(px, py);
        if (g.x >= 0 && g.x < level.cols && g.y >= 0 && g.y < level.rows) {
            hoveredCell = g;
        } else {
            hoveredCell = null;
        }
    }

    // ---- Tower Placement ----
    function placeTower(gx, gy) {
        if (grid[gy][gx] !== null) return; // occupied
        const type = TOWER_TYPES[selectedTowerType];
        if (gold < type.cost) return;

        gold -= type.cost;
        const tower = {
            type: selectedTowerType,
            gx, gy,
            level: 0,
            cooldown: 0,
            // Effective stats (base)
            damage: type.damage,
            range: type.range,
            fireRate: type.fireRate,
            splash: type.splash,
            slow: type.slow,
            slowDuration: type.slowDuration || 0,
            chain: type.chain,
            chainRange: type.chainRange || 0,
            totalCost: type.cost,
        };
        grid[gy][gx] = tower;
        towers.push(tower);
        spawnParticles(gridToPixel(gx, gy), type.color, 8);
        selectedTowerType = null;
        UI.deselectShop();
        UI.updateHUD();
    }

    function upgradeTower(tower) {
        const type = TOWER_TYPES[tower.type];
        if (tower.level >= type.upgrades.length) return;
        const upg = type.upgrades[tower.level];
        if (gold < upg.cost) return;

        gold -= upg.cost;
        tower.level++;
        tower.totalCost += upg.cost;
        // Apply upgrades
        if (upg.damage) tower.damage = upg.damage;
        if (upg.range) tower.range = upg.range;
        if (upg.fireRate) tower.fireRate = upg.fireRate;
        if (upg.splash) tower.splash = upg.splash;
        if (upg.slow) tower.slow = upg.slow;
        if (upg.slowDuration) tower.slowDuration = upg.slowDuration;
        if (upg.chain) tower.chain = upg.chain;
        if (upg.chainRange) tower.chainRange = upg.chainRange;

        spawnParticles(gridToPixel(tower.gx, tower.gy), "#fbbf24", 10);
        UI.showTowerInfo(tower);
        UI.updateHUD();
    }

    function sellTower(tower) {
        const refund = Math.floor(tower.totalCost * 0.6);
        gold += refund;
        grid[tower.gy][tower.gx] = null;
        towers = towers.filter(t => t !== tower);
        selectedTower = null;
        UI.hideTowerInfo();
        UI.updateHUD();
    }

    // ---- Waves ----
    function startWave() {
        if (waveActive || waveIndex >= totalWaves || gameOver) return;
        const waveDef = level.waves[waveIndex];
        waveQueue = [];
        for (const group of waveDef.enemies) {
            for (let i = 0; i < group.count; i++) {
                waveQueue.push({
                    type: group.type,
                    delay: group.interval * i + (waveQueue.length > 0 ? 20 : 0),
                });
            }
        }
        // Sort by delay
        waveQueue.sort((a, b) => a.delay - b.delay);
        waveTimer = 0;
        waveActive = true;
        waveIndex++;
        UI.updateHUD();
    }

    function spawnEnemy(typeName) {
        const type = ENEMY_TYPES[typeName];
        if (!type) return;
        const start = level.path[0];
        const pos = gridToPixel(start.x, start.y);
        enemies.push({
            type: typeName,
            x: pos.x,
            y: pos.y,
            hp: type.hp,
            maxHp: type.hp,
            speed: type.speed,
            reward: type.reward,
            color: type.color,
            size: type.size,
            damage: type.damage,
            boss: type.boss || false,
            pathIndex: 0,
            slowTimer: 0,
            slowFactor: 0,
            dead: false,
        });
    }

    // ---- Game Loop ----
    function loop() {
        const ticks = fastForward ? 2 : 1;
        for (let t = 0; t < ticks; t++) {
            if (!paused && !gameOver) {
                update();
            }
        }
        render();
        animFrame = requestAnimationFrame(loop);
    }

    function update() {
        // Wave spawning
        if (waveActive && waveQueue.length > 0) {
            waveTimer++;
            while (waveQueue.length > 0 && waveQueue[0].delay <= waveTimer) {
                spawnEnemy(waveQueue.shift().type);
            }
        }
        if (waveActive && waveQueue.length === 0 && enemies.length === 0) {
            waveActive = false;
            // Bonus gold between waves
            gold += 25 + waveIndex * 5;
            UI.updateHUD();
            // Check for level complete
            if (waveIndex >= totalWaves) {
                victory();
                return;
            }
        }

        // Move enemies
        for (const e of enemies) {
            if (e.dead) continue;
            const targetIdx = e.pathIndex + 1;
            if (targetIdx >= level.path.length) {
                // Enemy reached end
                lives -= e.damage;
                e.dead = true;
                spawnParticles({ x: e.x, y: e.y }, "#ef4444", 6);
                UI.updateHUD();
                if (lives <= 0) {
                    lives = 0;
                    defeat();
                    return;
                }
                continue;
            }
            const target = gridToPixel(level.path[targetIdx].x, level.path[targetIdx].y);
            const dx = target.x - e.x;
            const dy = target.y - e.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            let speed = e.speed * (cellSize / BASE_CELL);
            if (e.slowTimer > 0) {
                speed *= (1 - e.slowFactor);
                e.slowTimer--;
            }
            if (d < speed) {
                e.x = target.x;
                e.y = target.y;
                e.pathIndex = targetIdx;
            } else {
                e.x += (dx / d) * speed;
                e.y += (dy / d) * speed;
            }
        }
        enemies = enemies.filter(e => !e.dead);

        // Tower shooting
        for (const tower of towers) {
            if (tower.cooldown > 0) {
                tower.cooldown--;
                continue;
            }
            const pos = gridToPixel(tower.gx, tower.gy);
            const rangePx = tower.range * cellSize;
            // Find target
            let target = null;
            let bestProgress = -1;
            for (const e of enemies) {
                if (e.dead) continue;
                const d = dist(pos, e);
                if (d <= rangePx) {
                    // Prioritize enemy furthest along path
                    if (e.pathIndex > bestProgress) {
                        bestProgress = e.pathIndex;
                        target = e;
                    }
                }
            }
            if (target) {
                tower.cooldown = tower.fireRate;
                const type = TOWER_TYPES[tower.type];
                const pSpeed = type.projectileSpeed * (cellSize / BASE_CELL);
                projectiles.push({
                    x: pos.x,
                    y: pos.y,
                    target,
                    speed: pSpeed,
                    damage: tower.damage,
                    color: type.projectileColor,
                    splash: tower.splash,
                    slow: tower.slow,
                    slowDuration: tower.slowDuration,
                    chain: tower.chain,
                    chainRange: tower.chainRange,
                    tower,
                });
            }
        }

        // Move projectiles
        for (const p of projectiles) {
            if (p.dead) continue;
            if (p.target.dead) {
                p.dead = true;
                continue;
            }
            const dx = p.target.x - p.x;
            const dy = p.target.y - p.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < p.speed) {
                hitEnemy(p);
                p.dead = true;
            } else {
                p.x += (dx / d) * p.speed;
                p.y += (dy / d) * p.speed;
            }
        }
        projectiles = projectiles.filter(p => !p.dead);

        // Update particles
        for (const pt of particles) {
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.life--;
            pt.vy += 0.05;
        }
        particles = particles.filter(pt => pt.life > 0);
    }

    function hitEnemy(proj) {
        const e = proj.target;
        applyDamage(e, proj.damage, proj);

        // Splash
        if (proj.splash > 0) {
            const splashPx = proj.splash * cellSize;
            for (const other of enemies) {
                if (other === e || other.dead) continue;
                if (dist(e, other) <= splashPx) {
                    applyDamage(other, proj.damage * 0.5, proj);
                }
            }
            spawnParticles({ x: e.x, y: e.y }, proj.color, 12);
        }

        // Chain
        if (proj.chain > 0) {
            const chainPx = (proj.chainRange || 2) * cellSize;
            let last = e;
            let chained = new Set([e]);
            for (let i = 0; i < proj.chain; i++) {
                let best = null;
                let bestDist = Infinity;
                for (const other of enemies) {
                    if (other.dead || chained.has(other)) continue;
                    const d = dist(last, other);
                    if (d <= chainPx && d < bestDist) {
                        bestDist = d;
                        best = other;
                    }
                }
                if (!best) break;
                applyDamage(best, proj.damage * 0.6, proj);
                // Visual chain line
                particles.push({
                    x: last.x, y: last.y,
                    vx: 0, vy: 0,
                    life: 8,
                    color: proj.color,
                    chainTarget: { x: best.x, y: best.y },
                    isChain: true,
                    size: 2,
                });
                chained.add(best);
                last = best;
            }
        }
    }

    function applyDamage(enemy, damage, proj) {
        enemy.hp -= damage;
        if (proj && proj.slow > 0) {
            enemy.slowTimer = proj.slowDuration || 60;
            enemy.slowFactor = proj.slow;
        }
        if (enemy.hp <= 0 && !enemy.dead) {
            enemy.dead = true;
            gold += enemy.reward;
            score += enemy.reward;
            spawnParticles({ x: enemy.x, y: enemy.y }, enemy.color, 8);
            UI.updateHUD();
        }
    }

    // ---- Particles ----
    function spawnParticles(pos, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 2;
            particles.push({
                x: pos.x,
                y: pos.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 15 + Math.floor(Math.random() * 15),
                color,
                size: 2 + Math.random() * 3,
                isChain: false,
            });
        }
    }

    // ---- Render ----
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = level.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawGrid();
        drawPath();
        drawTowers();
        drawEnemies();
        drawProjectiles();
        drawParticles();
        drawHoverPreview();
        drawRangeIndicator();
    }

    function drawGrid() {
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;
        for (let y = 0; y <= level.rows; y++) {
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY + y * cellSize);
            ctx.lineTo(offsetX + level.cols * cellSize, offsetY + y * cellSize);
            ctx.stroke();
        }
        for (let x = 0; x <= level.cols; x++) {
            ctx.beginPath();
            ctx.moveTo(offsetX + x * cellSize, offsetY);
            ctx.lineTo(offsetX + x * cellSize, offsetY + level.rows * cellSize);
            ctx.stroke();
        }
    }

    function drawPath() {
        ctx.fillStyle = "rgba(139,92,56,0.35)";
        for (const p of level.path) {
            ctx.fillRect(
                offsetX + p.x * cellSize,
                offsetY + p.y * cellSize,
                cellSize, cellSize
            );
        }
        // Direction arrows every few cells
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.font = Math.floor(cellSize * 0.4) + "px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < level.path.length - 1; i += 3) {
            const cur = level.path[i];
            const nxt = level.path[Math.min(i + 1, level.path.length - 1)];
            const dx = nxt.x - cur.x;
            const dy = nxt.y - cur.y;
            let arrow = "→";
            if (dx === 0 && dy < 0) arrow = "↑";
            else if (dx === 0 && dy > 0) arrow = "↓";
            else if (dx < 0) arrow = "←";
            const pos = gridToPixel(cur.x, cur.y);
            ctx.fillText(arrow, pos.x, pos.y);
        }

        // Start/End markers
        const startPos = gridToPixel(level.path[0].x, level.path[0].y);
        const endPos = gridToPixel(level.path[level.path.length - 1].x, level.path[level.path.length - 1].y);
        ctx.font = Math.floor(cellSize * 0.5) + "px sans-serif";
        ctx.fillStyle = "rgba(34,197,94,0.7)";
        ctx.fillText("▶", startPos.x, startPos.y);
        ctx.fillStyle = "rgba(239,68,68,0.7)";
        ctx.fillText("🏰", endPos.x, endPos.y);
    }

    function drawTowers() {
        for (const tower of towers) {
            const pos = gridToPixel(tower.gx, tower.gy);
            const type = TOWER_TYPES[tower.type];
            const r = cellSize * 0.38;

            // Base circle
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
            ctx.fillStyle = type.color;
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.3)";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Level indicator dots
            for (let i = 0; i < tower.level; i++) {
                ctx.beginPath();
                ctx.arc(pos.x - 6 + i * 6, pos.y + r + 5, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = "#fbbf24";
                ctx.fill();
            }

            // Icon
            ctx.font = Math.floor(cellSize * 0.35) + "px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(type.icon, pos.x, pos.y);
        }
    }

    function drawEnemies() {
        for (const e of enemies) {
            if (e.dead) continue;
            const r = cellSize * 0.3 * e.size;

            // Shadow
            ctx.beginPath();
            ctx.ellipse(e.x, e.y + r * 0.8, r * 0.7, r * 0.25, 0, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fill();

            // Body
            ctx.beginPath();
            ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
            let fillColor = e.color;
            if (e.slowTimer > 0) fillColor = "#7dd3fc"; // icy blue
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,0.4)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Boss crown
            if (e.boss) {
                ctx.font = Math.floor(r * 1.2) + "px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.fillText("👑", e.x, e.y - r);
            }

            // HP bar
            const barW = r * 2.2;
            const barH = 4;
            const barX = e.x - barW / 2;
            const barY = e.y - r - 8;
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(barX, barY, barW, barH);
            const hpRatio = Math.max(0, e.hp / e.maxHp);
            const hpColor = hpRatio > 0.5 ? "#22c55e" : hpRatio > 0.25 ? "#f59e0b" : "#ef4444";
            ctx.fillStyle = hpColor;
            ctx.fillRect(barX, barY, barW * hpRatio, barH);
        }
    }

    function drawProjectiles() {
        for (const p of projectiles) {
            if (p.dead) continue;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(")", ",0.2)").replace("rgb", "rgba");
            ctx.fill();
        }
    }

    function drawParticles() {
        for (const pt of particles) {
            if (pt.isChain && pt.chainTarget) {
                ctx.beginPath();
                ctx.moveTo(pt.x, pt.y);
                ctx.lineTo(pt.chainTarget.x, pt.chainTarget.y);
                ctx.strokeStyle = pt.color;
                ctx.lineWidth = pt.size;
                ctx.globalAlpha = pt.life / 10;
                ctx.stroke();
                ctx.globalAlpha = 1;
            } else {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.size * (pt.life / 30), 0, Math.PI * 2);
                ctx.globalAlpha = pt.life / 30;
                ctx.fillStyle = pt.color;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
    }

    function drawHoverPreview() {
        if (!hoveredCell || !selectedTowerType) return;
        const { x, y } = hoveredCell;
        if (x < 0 || x >= level.cols || y < 0 || y >= level.rows) return;

        const pos = gridToPixel(x, y);
        const type = TOWER_TYPES[selectedTowerType];
        const canPlace = grid[y][x] === null && gold >= type.cost;

        // Preview cell
        ctx.fillStyle = canPlace ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)";
        ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);

        // Range preview
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, type.range * cellSize, 0, Math.PI * 2);
        ctx.strokeStyle = canPlace ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Icon preview
        ctx.globalAlpha = 0.5;
        ctx.font = Math.floor(cellSize * 0.35) + "px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(type.icon, pos.x, pos.y);
        ctx.globalAlpha = 1;
    }

    function drawRangeIndicator() {
        if (!selectedTower) return;
        const pos = gridToPixel(selectedTower.gx, selectedTower.gy);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, selectedTower.range * cellSize, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(251,191,36,0.35)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Highlight cell
        ctx.strokeStyle = "rgba(251,191,36,0.6)";
        ctx.lineWidth = 2;
        ctx.strokeRect(
            offsetX + selectedTower.gx * cellSize,
            offsetY + selectedTower.gy * cellSize,
            cellSize, cellSize
        );
    }

    // ---- Win / Lose ----
    function victory() {
        gameOver = true;
        const stars = lives >= level.lives ? 3 : lives >= level.lives * 0.5 ? 2 : 1;
        // Save progress
        const progress = loadProgress();
        if (!progress[levelIndex] || progress[levelIndex] < stars) {
            progress[levelIndex] = stars;
        }
        // Unlock next
        if (levelIndex + 1 < LEVELS.length && !progress[levelIndex + 1]) {
            progress[levelIndex + 1] = 0; // unlocked but not completed
        }
        saveProgress(progress);
        UI.showOverlay("victory", stars, score);
    }

    function defeat() {
        gameOver = true;
        UI.showOverlay("defeat", 0, score);
    }

    // ---- Progress persistence ----
    function loadProgress() {
        try {
            const data = localStorage.getItem("td_progress");
            return data ? JSON.parse(data) : { 0: 0 }; // level 0 unlocked
        } catch {
            return { 0: 0 };
        }
    }
    function saveProgress(p) {
        try {
            localStorage.setItem("td_progress", JSON.stringify(p));
        } catch {
            // ignore
        }
    }

    // ---- Public API ----
    return {
        init,
        startWave,
        upgradeTower: () => { if (selectedTower) upgradeTower(selectedTower); },
        sellTower: () => { if (selectedTower) sellTower(selectedTower); },
        selectTowerType: (type) => { selectedTowerType = type; selectedTower = null; UI.hideTowerInfo(); },
        deselectTowerType: () => { selectedTowerType = null; },
        deselectTower: () => { selectedTower = null; UI.hideTowerInfo(); },
        togglePause: () => { paused = !paused; return paused; },
        toggleFast: () => { fastForward = !fastForward; return fastForward; },
        isPaused: () => paused,
        isFast: () => fastForward,
        isWaveActive: () => waveActive,
        getGold: () => gold,
        getLives: () => lives,
        getScore: () => score,
        getWaveIndex: () => waveIndex,
        getTotalWaves: () => totalWaves,
        getLevelIndex: () => levelIndex,
        getSelectedTowerType: () => selectedTowerType,
        getSelectedTower: () => selectedTower,
        loadProgress,
        saveProgress,
        stop: () => {
            if (animFrame) cancelAnimationFrame(animFrame);
            canvas.onmousedown = null;
            canvas.onmousemove = null;
            canvas.onmouseleave = null;
        },
    };
})();
