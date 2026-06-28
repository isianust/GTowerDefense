/* ============================================
   三國塔防 — 遊戲引擎（純 HTML5 Canvas，無建置、無 Phaser 依賴）
   開檔即玩。沿用 js/levels.js 的 50 關地圖路徑，全面三國化、全繁中。
   依賴：js/levels.js（LEVELS 路徑）、js/td_data.js（武將塔/雜兵/大絕/BOSS）
   ============================================ */
(function () {
  "use strict";

  /* 取得既有 50 關路徑資料（只取路徑/格數/底色，不動其定義） */
  function getLevels() {
    try { if (typeof LEVELS !== "undefined" && LEVELS.length) return LEVELS; } catch (e) {}
    if (typeof window !== "undefined" && window.LEVELS) return window.LEVELS;
    return [];
  }

  /* ---------- 常數 ---------- */
  const BASE_FPS = 60;
  const SPEED_SCALE = 0.85;     // 敵人移動速度倍率（px = speed*CELL*SPEED_SCALE）
  const STORAGE_KEY = "td3k_progress";

  /* ---------- 全域狀態 ---------- */
  const G = {
    canvas: null, ctx: null,
    cell: 48, cols: 20, rows: 12,
    levelIndex: 0,            // 0-based
    waypoints: [],            // 像素座標路徑點
    segLen: [], totalLen: 0,
    pathCells: null,
    gold: 0, lives: 0, score: 0,
    waveIndex: 0, totalWaves: 0,
    spawnQueue: [],           // 待生成 {type,isBoss,bossDef,delay}
    waveActive: false, waveSpawned: 0,
    enemies: [], towers: [], projectiles: [], effects: [],
    selectedType: null, selectedTower: null,
    running: false, paused: false, fast: false,
    lastT: 0, acc: 0,
    bg: "#16213e",
    ult: {},                  // 大絕狀態 by id
    casting: null,            // 玩家正在施放的大絕
    towerSlowT: 0, towerSilenceT: 0,
    onEnd: null,
    rafId: 0,
  };

  /* ============================================
     初始化 / 關卡載入
     ============================================ */
  function buildPath(level) {
    const cell = G.cell;
    const wp = level.path.map(function (p) {
      return { x: p.x * cell + cell / 2, y: p.y * cell + cell / 2 };
    });
    G.waypoints = wp;
    G.segLen = []; G.totalLen = 0;
    for (let i = 1; i < wp.length; i++) {
      const d = Math.hypot(wp[i].x - wp[i - 1].x, wp[i].y - wp[i - 1].y);
      G.segLen.push(d); G.totalLen += d;
    }
    // 路徑佔用格子
    const set = new Set();
    for (let i = 0; i < level.path.length; i++) set.add(level.path[i].x + "," + level.path[i].y);
    // 補上相鄰段之間的格子，避免在路徑上建塔
    for (let i = 1; i < level.path.length; i++) {
      const a = level.path[i - 1], b = level.path[i];
      const dx = Math.sign(b.x - a.x), dy = Math.sign(b.y - a.y);
      let cx = a.x, cy = a.y;
      while (cx !== b.x || cy !== b.y) { set.add(cx + "," + cy); cx += dx; cy += dy; }
    }
    G.pathCells = set;
  }

  function posAt(dist) {
    if (dist <= 0) return { x: G.waypoints[0].x, y: G.waypoints[0].y };
    let d = dist;
    for (let i = 0; i < G.segLen.length; i++) {
      if (d <= G.segLen[i]) {
        const a = G.waypoints[i], b = G.waypoints[i + 1];
        const t = G.segLen[i] === 0 ? 0 : d / G.segLen[i];
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      }
      d -= G.segLen[i];
    }
    const last = G.waypoints[G.waypoints.length - 1];
    return { x: last.x, y: last.y };
  }

  /* 依視窗大小計算格子尺寸（桌機大畫面） */
  function computeCell(cols, rows) {
    const maxW = Math.min(window.innerWidth - 360, 1500);
    const maxH = window.innerHeight - 230;
    return Math.max(36, Math.floor(Math.min(maxW / cols, maxH / rows)));
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { maxUnlocked: 1, totalScore: 0, totalGold: 0, cleared: {} };
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) {}
  }

  /* ============================================
     波次生成（難度高、怪要多）
     ============================================ */
  function mobPoolForLevel(lv) {
    // 依關卡階段提供雜兵種類
    if (lv <= 5) return ["huangjin", "bandit", "spearman"];
    if (lv <= 10) return ["huangjin", "cavalry", "spearman", "raider"];
    if (lv <= 20) return ["cavalry", "spearman", "assassin", "deathsoldier", "raider"];
    if (lv <= 30) return ["assassin", "deathsoldier", "shaman", "elephant", "cavalry"];
    if (lv <= 40) return ["deathsoldier", "elephant", "rattan", "berserker", "shaman"];
    return ["rattan", "heavy", "elephant", "berserker", "assassin", "deathsoldier"];
  }

  function generateWaves(lv) {
    // 回傳波次陣列，每波 = {groups:[{type,count,interval}], boss?:bossDef, bossCount}
    const waves = [];
    const waveCount = Math.min(6 + Math.floor(lv / 4), 12); // 6~12 波
    const pool = mobPoolForLevel(lv);
    const hpMul = 1 + (lv - 1) * 0.12;     // 雜兵血量隨關卡上升
    const countMul = 1 + (lv - 1) * 0.06;  // 數量隨關卡上升
    for (let w = 0; w < waveCount; w++) {
      const groups = [];
      const kinds = 1 + Math.min(3, Math.floor(lv / 12) + (w % 2));
      for (let k = 0; k < kinds; k++) {
        const type = pool[(w + k) % pool.length];
        const baseCount = 8 + w * 2 + k * 3;
        const count = Math.round(baseCount * countMul);
        const interval = Math.max(18, 55 - lv * 0.4 - w * 2); // 幀：越後面越密
        groups.push({ type: type, count: count, interval: interval });
      }
      waves.push({ groups: groups, hpMul: hpMul, isBossWave: false });
    }
    // 最後一波：BOSS 來襲
    const bossDef = tdBossForLevel(lv);
    const lord = !!bossDef.lord;
    waves.push({
      groups: [{ type: pool[0], count: Math.round(14 * countMul), interval: 30 }],
      hpMul: hpMul, isBossWave: true, bossDef: bossDef, lord: lord,
    });
    // 後期關卡（>30）在倒數第二波先放一隻中BOSS，達成「後期多BOSS」
    if (lv > 30) {
      waves[waves.length - 2].isBossWave = true;
      waves[waves.length - 2].bossDef = bossDef;
      waves[waves.length - 2].midOnly = true;
    }
    return waves;
  }

  /* ============================================
     啟動關卡
     ============================================ */
  function startLevel(levelIndex0) {
    const levels = getLevels();
    if (!levels.length) { alert("找不到關卡資料（js/levels.js）"); return; }
    const li = Math.max(0, Math.min(levels.length - 1, levelIndex0));
    const level = levels[li];
    G.levelIndex = li;
    G.cols = level.cols || 20;
    G.rows = level.rows || 12;
    G.cell = computeCell(G.cols, G.rows);
    G.bg = level.bg || "#16213e";

    // 畫布
    G.canvas = document.getElementById("td-canvas");
    G.canvas.width = G.cols * G.cell;
    G.canvas.height = G.rows * G.cell;
    G.ctx = G.canvas.getContext("2d");

    buildPath(level);

    const lvNum = li + 1;
    G.gold = level.startGold || 150;
    G.lives = level.lives || 20;
    G.score = 0;
    G.enemies = []; G.towers = []; G.projectiles = []; G.effects = [];
    G.selectedType = null; G.selectedTower = null;
    G.towerSlowT = 0; G.towerSilenceT = 0;
    G.waves = generateWaves(lvNum);
    G.totalWaves = G.waves.length;
    G.waveIndex = 0; G.waveActive = false; G.spawnQueue = [];
    G.paused = false; G.fast = false;
    G.casting = null;

    // 大絕冷卻歸零
    G.ult = {};
    TD_ULTIMATES.forEach(function (u) { G.ult[u.id] = { cd: 0, def: u }; });

    buildShop();
    updateHUD();
    renderUltBar();
    hideOverlay();
    setBanner(null);

    G.running = true;
    G.lastT = performance.now();
    if (G.rafId) cancelAnimationFrame(G.rafId);
    loop(G.lastT);
  }

  /* ============================================
     主迴圈
     ============================================ */
  function loop(t) {
    if (!G.running) return;
    G.rafId = requestAnimationFrame(loop);
    let dt = (t - G.lastT) / 1000;
    G.lastT = t;
    if (dt > 0.1) dt = 0.1;
    if (!G.paused) {
      const steps = G.fast ? 3 : 1;
      for (let s = 0; s < steps; s++) update(dt);
    }
    render();
  }

  function update(dt) {
    const frame = dt * BASE_FPS; // 以「幀」為單位的計時換算

    if (G.towerSlowT > 0) G.towerSlowT -= dt;
    if (G.towerSilenceT > 0) G.towerSilenceT -= dt;

    // 玩家大絕冷卻 / 詠唱
    TD_ULTIMATES.forEach(function (u) {
      const st = G.ult[u.id];
      if (st.cd > 0) st.cd = Math.max(0, st.cd - dt);
    });
    if (G.casting) {
      G.casting.t += dt;
      if (G.casting.t >= G.casting.def.cast) {
        applyUltimate(G.casting.def);
        G.ult[G.casting.def.id].cd = G.casting.def.cd;
        G.casting = null;
      }
    }

    updateSpawning(frame);
    updateEnemies(dt, frame);
    updateTowers(dt, frame);
    updateProjectiles(dt);
    updateEffects(dt);
    updateBanner();
    checkWaveProgress();
  }

  /* ---------- 生成 ---------- */
  function startNextWave() {
    if (G.waveActive) return;
    if (G.waveIndex >= G.waves.length) return;
    const wave = G.waves[G.waveIndex];
    G.spawnQueue = [];
    // 雜兵
    wave.groups.forEach(function (g) {
      for (let i = 0; i < g.count; i++) {
        G.spawnQueue.push({ type: g.type, isBoss: false, delay: i * g.interval, hpMul: wave.hpMul });
      }
    });
    // BOSS
    if (wave.isBossWave && wave.bossDef) {
      const lvNum = G.levelIndex + 1;
      if (wave.lord) {
        // 魔王關：大BOSS + 多隻 BOSS（adds 化為 boss-lite）
        G.spawnQueue.push({ type: null, isBoss: true, bossDef: wave.bossDef, rank: "big", delay: 90, hpMul: wave.hpMul });
        (wave.bossDef.adds || []).forEach(function (nm, idx) {
          G.spawnQueue.push({ type: null, isBoss: true, bossDef: wave.bossDef, rank: "mid", addName: nm, delay: 150 + idx * 120, hpMul: wave.hpMul });
        });
      } else if (wave.midOnly) {
        G.spawnQueue.push({ type: null, isBoss: true, bossDef: wave.bossDef, rank: "mid", addName: wave.bossDef.adds[0], delay: 120, hpMul: wave.hpMul });
      } else {
        G.spawnQueue.push({ type: null, isBoss: true, bossDef: wave.bossDef, rank: "big", delay: 120, hpMul: wave.hpMul });
      }
    }
    G.spawnQueue.sort(function (a, b) { return a.delay - b.delay; });
    G.spawnTimer = 0;
    G.waveActive = true;
    updateHUD();
    setWaveBtn(false);
  }

  function updateSpawning(frame) {
    if (!G.waveActive || !G.spawnQueue.length) return;
    G.spawnTimer = (G.spawnTimer || 0) + frame;
    while (G.spawnQueue.length && G.spawnQueue[0].delay <= G.spawnTimer) {
      const s = G.spawnQueue.shift();
      if (s.isBoss) spawnBoss(s);
      else spawnMob(s.type, s.hpMul);
    }
  }

  function spawnMob(type, hpMul) {
    const def = TD_ENEMIES[type] || TD_ENEMIES.huangjin;
    const start = G.waypoints[0];
    G.enemies.push({
      x: start.x, y: start.y, dist: 0,
      def: def, type: type, isBoss: false,
      maxHp: Math.round(def.hp * hpMul), hp: Math.round(def.hp * hpMul),
      basePps: def.speed * G.cell * SPEED_SCALE,
      slowT: 0, slowAmt: 0, reward: def.reward, dmg: def.damage,
      size: def.size, color: def.color,
    });
  }

  function spawnBoss(s) {
    const b = s.bossDef;
    const start = G.waypoints[0];
    const lvNum = G.levelIndex + 1;
    const rankMul = s.rank === "big" ? 1 : 0.45;       // 中/小BOSS 血量較低
    const lordMul = b.lord ? 2.2 : 1;
    const baseHp = Math.round((360 + lvNum * 150) * rankMul * lordMul * s.hpMul);
    const speed = (s.rank === "big" ? 0.55 : 0.8);
    G.enemies.push({
      x: start.x, y: start.y, dist: 0,
      def: { name: s.addName || b.name }, isBoss: true, bossDef: b, rank: s.rank,
      bossName: s.addName || b.name,
      maxHp: baseHp, hp: baseHp,
      basePps: speed * G.cell * SPEED_SCALE,
      slowT: 0, slowAmt: 0,
      reward: Math.round((40 + lvNum * 6) * (s.rank === "big" ? 1 : 0.5)),
      dmg: s.rank === "big" ? 5 : 2,
      size: s.rank === "big" ? 1.1 : 0.8,
      color: b.lord ? "#dc2626" : "#b91c1c",
      // 詠唱/技能
      castCd: b.cd * 0.6, casting: false, castT: 0, castMax: b.cast,
      enrageT: 0, dashT: 0, shieldT: 0, healT: 0,
      phase: 1,
    });
  }

  /* ---------- 敵人更新 ---------- */
  function updateEnemies(dt, frame) {
    for (let i = G.enemies.length - 1; i >= 0; i--) {
      const e = G.enemies[i];
      // 減速
      let speedMul = 1;
      if (e.slowT > 0) { e.slowT -= dt; speedMul *= (1 - e.slowAmt); }
      // BOSS 階段 / 增益
      if (e.isBoss) updateBoss(e, dt);
      if (e.enrageT > 0) { e.enrageT -= dt; speedMul *= 1.4; }
      if (e.dashT > 0) { e.dashT -= dt; speedMul *= 1.8; }

      e.dist += e.basePps * speedMul * dt;
      const p = posAt(e.dist);
      e.x = p.x; e.y = p.y;

      if (e.dist >= G.totalLen) {
        // 抵達終點 → 扣血
        G.lives -= e.dmg;
        G.enemies.splice(i, 1);
        updateHUD();
        if (G.lives <= 0) { endGame(false); return; }
      }
    }
  }

  function updateBoss(e, dt) {
    const b = e.bossDef;
    // 階段：依血量切換（影響顏色/狂暴）
    const ratio = e.hp / e.maxHp;
    const newPhase = ratio > 0.66 ? 1 : ratio > 0.33 ? 2 : 3;
    if (newPhase !== e.phase) {
      e.phase = newPhase;
      if (newPhase >= 2) e.enrageT = Math.max(e.enrageT, 2);
      e.color = newPhase === 3 ? "#fca5a5" : newPhase === 2 ? "#ef4444" : (b.lord ? "#dc2626" : "#b91c1c");
    }
    if (e.shieldT > 0) e.shieldT -= dt;
    if (e.healT > 0) { e.healT -= dt; e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.06 * dt); }

    // 詠唱循環
    if (e.casting) {
      e.castT += dt;
      if (e.castT >= e.castMax) {
        applyBossSkill(e);
        e.casting = false; e.castT = 0;
        e.castCd = b.cd;
      }
    } else {
      e.castCd -= dt;
      if (e.castCd <= 0) { e.casting = true; e.castT = 0; }
    }
  }

  function applyBossSkill(e) {
    const b = e.bossDef;
    const lvNum = G.levelIndex + 1;
    switch (b.effect) {
      case "summon": {
        const pool = mobPoolForLevel(lvNum);
        const n = b.lord ? 8 : 5;
        for (let i = 0; i < n; i++) {
          const t = pool[i % pool.length];
          setTimeout(function () {}, 0);
          spawnMob(t, 1 + (lvNum - 1) * 0.12);
        }
        break;
      }
      case "shield": e.shieldT = 4; break;
      case "heal": e.healT = 3; break;
      case "enrage": e.enrageT = 4; break;
      case "dash": e.dashT = 3; break;
      case "slowTower": G.towerSlowT = Math.max(G.towerSlowT, 5); break;
      case "silenceTower": G.towerSilenceT = Math.max(G.towerSilenceT, 3); break;
      case "buffAll":
        G.enemies.forEach(function (en) {
          if (!en.isBoss) { en.hp = Math.round(en.hp * 1.3); en.maxHp = Math.round(en.maxHp * 1.3); en.basePps *= 1.2; }
        });
        break;
      case "aoe": {
        const dmg = b.lord ? 3 : 2;
        G.lives -= dmg;
        G.effects.push({ kind: "flash", t: 0, max: 0.5, color: "#ef4444" });
        updateHUD();
        if (G.lives <= 0) { endGame(false); return; }
        break;
      }
    }
    G.effects.push({ kind: "cast", x: e.x, y: e.y, t: 0, max: 0.6, color: "#f59e0b" });
  }

  /* ---------- 防禦塔 ---------- */
  function updateTowers(dt, frame) {
    if (G.towerSilenceT > 0) return; // 被沉默：無法攻擊
    const slowFactor = G.towerSlowT > 0 ? 1.5 : 1;
    for (let i = 0; i < G.towers.length; i++) {
      const tw = G.towers[i];
      tw.cool -= frame;
      if (tw.cool > 0) continue;
      const rangePx = tw.range * G.cell;
      // 找射程內最前方（dist 最大）敵人
      let target = null, best = -1;
      for (let j = 0; j < G.enemies.length; j++) {
        const e = G.enemies[j];
        const d = Math.hypot(tw.x - e.x, tw.y - e.y);
        if (d <= rangePx && e.dist > best) { best = e.dist; target = e; }
      }
      if (!target) continue;
      fireTower(tw, target);
      tw.cool = tw.fireRate * slowFactor;
    }
  }

  function fireTower(tw, target) {
    G.projectiles.push({
      x: tw.x, y: tw.y, target: target,
      speed: tw.projSpeed * G.cell, damage: tw.damage,
      splash: tw.splash, slow: tw.slow, slowDur: tw.slowDur,
      chain: tw.chain, chainRange: tw.chainRange, color: tw.color,
      hitList: [],
    });
  }

  function updateProjectiles(dt) {
    for (let i = G.projectiles.length - 1; i >= 0; i--) {
      const p = G.projectiles[i];
      if (!p.target || G.enemies.indexOf(p.target) === -1) {
        // 目標消失 → 移除
        G.projectiles.splice(i, 1); continue;
      }
      const dx = p.target.x - p.x, dy = p.target.y - p.y;
      const d = Math.hypot(dx, dy);
      const step = p.speed * dt;
      if (d <= step + 4) {
        impact(p);
        G.projectiles.splice(i, 1);
      } else {
        p.x += dx / d * step; p.y += dy / d * step;
      }
    }
  }

  function impact(p) {
    const hit = p.target;
    damageEnemy(hit, p.damage);
    // 濺射
    if (p.splash > 0) {
      const r = p.splash * G.cell;
      for (let j = 0; j < G.enemies.length; j++) {
        const e = G.enemies[j];
        if (e === hit) continue;
        if (Math.hypot(e.x - hit.x, e.y - hit.y) <= r) damageEnemy(e, p.damage * 0.6);
      }
      G.effects.push({ kind: "boom", x: hit.x, y: hit.y, t: 0, max: 0.3, r: r, color: p.color });
    }
    // 減速
    if (p.slow > 0 && hit.hp > 0) { hit.slowAmt = p.slow; hit.slowT = p.slowDur / BASE_FPS; }
    // 連鎖
    if (p.chain > 0) {
      let last = hit, count = p.chain;
      const done = [hit];
      while (count > 0) {
        let next = null, nd = Infinity;
        for (let j = 0; j < G.enemies.length; j++) {
          const e = G.enemies[j];
          if (done.indexOf(e) !== -1) continue;
          const dd = Math.hypot(e.x - last.x, e.y - last.y);
          if (dd <= p.chainRange * G.cell && dd < nd) { nd = dd; next = e; }
        }
        if (!next) break;
        damageEnemy(next, p.damage * 0.7);
        G.effects.push({ kind: "line", x1: last.x, y1: last.y, x2: next.x, y2: next.y, t: 0, max: 0.2, color: p.color });
        done.push(next); last = next; count--;
      }
    }
  }

  function damageEnemy(e, dmg) {
    if (e.isBoss && e.shieldT > 0) dmg *= 0.4;
    e.hp -= dmg;
    if (e.hp <= 0) killEnemy(e);
  }

  function killEnemy(e) {
    const idx = G.enemies.indexOf(e);
    if (idx === -1) return;
    G.enemies.splice(idx, 1);
    G.gold += e.reward;
    G.score += e.reward * (e.isBoss ? 5 : 1);
    G.effects.push({ kind: "die", x: e.x, y: e.y, t: 0, max: 0.3, color: e.color });
    updateHUD();
  }

  /* ---------- 效果動畫 ---------- */
  function updateEffects(dt) {
    for (let i = G.effects.length - 1; i >= 0; i--) {
      G.effects[i].t += dt;
      if (G.effects[i].t >= G.effects[i].max) G.effects.splice(i, 1);
    }
  }

  /* ---------- 波次進度 ---------- */
  function checkWaveProgress() {
    if (!G.waveActive) return;
    if (G.spawnQueue.length === 0 && G.enemies.length === 0) {
      G.waveActive = false;
      G.waveIndex++;
      updateHUD();
      if (G.waveIndex >= G.waves.length) { endGame(true); return; }
      setWaveBtn(true);
    }
  }

  /* ============================================
     玩家大絕（UIOJKL）
     ============================================ */
  function tryUltimate(id) {
    const st = G.ult[id];
    if (!st || st.cd > 0 || G.casting || !G.running || G.paused) return;
    const def = st.def;
    if (def.cast <= 0) {
      applyUltimate(def); st.cd = def.cd;
    } else {
      G.casting = { def: def, t: 0 };
    }
    renderUltBar();
  }

  function applyUltimate(def) {
    const lvNum = G.levelIndex + 1;
    const scale = 1 + lvNum * 0.6;
    G.effects.push({ kind: "ultflash", t: 0, max: 0.5, color: "#fbbf24", label: def.name });
    switch (def.effect) {
      case "burnPath": {
        const dmg = 40 * scale;
        G.enemies.forEach(function (e) { damageEnemy(e, dmg); });
        break;
      }
      case "arrowRain": {
        const dmg = 60 * scale;
        G.enemies.slice().forEach(function (e) { damageEnemy(e, dmg); });
        break;
      }
      case "lockField": {
        G.enemies.forEach(function (e) {
          e.slowAmt = 1; e.slowT = 2.5;                 // 定身
          if (e.isBoss && e.casting) { e.casting = false; e.castT = 0; e.castCd = e.bossDef.cd; } // 打斷詠唱
        });
        break;
      }
      case "healBase": {
        G.lives += 5; updateHUD();
        break;
      }
      case "thunder": {
        const dmg = 80 * scale;
        const targets = G.enemies.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 8);
        targets.forEach(function (e) {
          damageEnemy(e, dmg);
          G.effects.push({ kind: "bolt", x: e.x, y: e.y, t: 0, max: 0.3, color: "#818cf8" });
        });
        break;
      }
      case "slayBoss": {
        G.enemies.slice().forEach(function (e) {
          if (e.isBoss) damageEnemy(e, e.maxHp * 0.25 + 200 * scale);
        });
        break;
      }
    }
    setBanner({ text: "◆ 你發動【" + def.name + "】！", progress: 1, color: "#fbbf24", hold: 1.2 });
  }

  /* ============================================
     上方施法播報條
     ============================================ */
  let bannerEl = null, bannerFill = null, bannerText = null;
  let bannerHold = 0;
  function setBanner(b) {
    if (!bannerEl) { bannerEl = document.getElementById("td-banner"); bannerFill = document.getElementById("td-banner-fill"); bannerText = document.getElementById("td-banner-text"); }
    if (!bannerEl) return;
    if (!b) { bannerEl.classList.add("hidden"); bannerHold = 0; return; }
    bannerEl.classList.remove("hidden");
    bannerText.textContent = b.text;
    bannerFill.style.width = Math.round((b.progress || 0) * 100) + "%";
    bannerFill.style.background = b.color || "#f59e0b";
    bannerHold = b.hold || 0;
  }
  function updateBanner() {
    if (!bannerEl) { setBanner(null); }
    // 優先顯示玩家詠唱
    if (G.casting) {
      const d = G.casting.def;
      setBanner({ text: "◆ 你正在施放【" + d.name + "】… " + (d.cast - G.casting.t).toFixed(1) + "s", progress: G.casting.t / d.cast, color: "#fbbf24" });
      return;
    }
    // 其次顯示詠唱中、進度最高的 BOSS
    let top = null;
    for (let i = 0; i < G.enemies.length; i++) {
      const e = G.enemies[i];
      if (e.isBoss && e.casting) {
        if (!top || (e.castT / e.castMax) > (top.castT / top.castMax)) top = e;
      }
    }
    if (top) {
      setBanner({ text: "▶ " + top.bossName + " 正在詠唱【" + top.bossDef.skill + "】… " + (top.castMax - top.castT).toFixed(1) + "s", progress: top.castT / top.castMax, color: "#ef4444" });
      return;
    }
    if (bannerHold > 0) { bannerHold -= 0.016; return; }
    setBanner(null);
  }

  /* ============================================
     繪製
     ============================================ */
  function render() {
    const ctx = G.ctx; if (!ctx) return;
    const W = G.canvas.width, H = G.canvas.height, cell = G.cell;
    ctx.fillStyle = G.bg; ctx.fillRect(0, 0, W, H);

    // 網格
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
    for (let x = 0; x <= G.cols; x++) { ctx.beginPath(); ctx.moveTo(x * cell, 0); ctx.lineTo(x * cell, H); ctx.stroke(); }
    for (let y = 0; y <= G.rows; y++) { ctx.beginPath(); ctx.moveTo(0, y * cell); ctx.lineTo(W, y * cell); ctx.stroke(); }

    // 路徑
    ctx.strokeStyle = "rgba(180,120,60,0.55)"; ctx.lineWidth = cell * 0.6; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(G.waypoints[0].x, G.waypoints[0].y);
    for (let i = 1; i < G.waypoints.length; i++) ctx.lineTo(G.waypoints[i].x, G.waypoints[i].y);
    ctx.stroke();
    // 起點/終點
    drawFlag(G.waypoints[0], "#22c55e");
    drawFlag(G.waypoints[G.waypoints.length - 1], "#ef4444");

    // 選塔放置預覽
    if (G.selectedType && G.hoverCell) {
      const c = G.hoverCell;
      const ok = canPlace(c.col, c.row);
      ctx.fillStyle = ok ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)";
      ctx.fillRect(c.col * cell, c.row * cell, cell, cell);
      const t = TD_TOWERS[G.selectedType];
      ctx.strokeStyle = ok ? "rgba(34,197,94,0.6)" : "rgba(239,68,68,0.6)";
      ctx.beginPath(); ctx.arc(c.col * cell + cell / 2, c.row * cell + cell / 2, t.range * cell, 0, Math.PI * 2); ctx.stroke();
    }

    // 塔
    G.towers.forEach(function (tw) {
      ctx.fillStyle = tw.color;
      ctx.fillRect(tw.x - cell * 0.35, tw.y - cell * 0.35, cell * 0.7, cell * 0.7);
      ctx.font = Math.round(cell * 0.5) + "px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(tw.icon, tw.x, tw.y);
      // 等級點
      ctx.fillStyle = "#fde68a";
      for (let l = 0; l < tw.level; l++) ctx.fillRect(tw.x - cell * 0.3 + l * 6, tw.y + cell * 0.28, 4, 4);
    });
    if (G.selectedTower) {
      ctx.strokeStyle = "rgba(96,165,250,0.7)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(G.selectedTower.x, G.selectedTower.y, G.selectedTower.range * cell, 0, Math.PI * 2); ctx.stroke();
    }

    // 敵人
    G.enemies.forEach(function (e) { drawEnemy(ctx, e, cell); });
    // 投射物
    G.projectiles.forEach(function (p) {
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(3, cell * 0.08), 0, Math.PI * 2); ctx.fill();
    });
    // 效果
    drawEffects(ctx);

    if (G.paused) { ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#fff"; ctx.font = "bold " + cell + "px sans-serif"; ctx.textAlign = "center"; ctx.fillText("⏸ 暫停", W / 2, H / 2); }
  }

  function drawFlag(p, color) {
    const ctx = G.ctx, s = G.cell * 0.3;
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, Math.PI * 2); ctx.fill();
  }

  function drawEnemy(ctx, e, cell) {
    const r = (e.size || 0.5) * cell * 0.7;
    // 身體
    ctx.fillStyle = e.color;
    ctx.beginPath(); ctx.arc(e.x, e.y, r, 0, Math.PI * 2); ctx.fill();
    if (e.isBoss) {
      ctx.strokeStyle = "#fde047"; ctx.lineWidth = 3; ctx.stroke();
      // 護盾
      if (e.shieldT > 0) { ctx.strokeStyle = "rgba(56,189,248,0.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(e.x, e.y, r + 5, 0, Math.PI * 2); ctx.stroke(); }
      // 名稱
      ctx.fillStyle = "#fff"; ctx.font = "bold " + Math.round(cell * 0.32) + "px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.fillText(e.bossName, e.x, e.y - r - 6);
    }
    // 血條
    const w = Math.max(r * 2, cell * 0.6), hpR = Math.max(0, e.hp / e.maxHp);
    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(e.x - w / 2, e.y - r - 6, w, 4);
    ctx.fillStyle = e.isBoss ? "#f87171" : "#4ade80"; ctx.fillRect(e.x - w / 2, e.y - r - 6, w * hpR, 4);
    // 詠唱光環
    if (e.casting) { ctx.strokeStyle = "rgba(245,158,11,0.9)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(e.x, e.y, r + 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (e.castT / e.castMax)); ctx.stroke(); }
  }

  function drawEffects(ctx) {
    G.effects.forEach(function (fx) {
      const a = 1 - fx.t / fx.max;
      if (fx.kind === "boom") {
        ctx.strokeStyle = hexA(fx.color, a); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.r * (fx.t / fx.max), 0, Math.PI * 2); ctx.stroke();
      } else if (fx.kind === "die") {
        ctx.fillStyle = hexA(fx.color, a); ctx.beginPath(); ctx.arc(fx.x, fx.y, G.cell * 0.4 * (1 + fx.t), 0, Math.PI * 2); ctx.fill();
      } else if (fx.kind === "line" || fx.kind === "bolt") {
        ctx.strokeStyle = hexA(fx.color || "#818cf8", a); ctx.lineWidth = 3;
        if (fx.kind === "line") { ctx.beginPath(); ctx.moveTo(fx.x1, fx.y1); ctx.lineTo(fx.x2, fx.y2); ctx.stroke(); }
        else { ctx.beginPath(); ctx.arc(fx.x, fx.y, G.cell * 0.5, 0, Math.PI * 2); ctx.stroke(); }
      } else if (fx.kind === "cast") {
        ctx.strokeStyle = hexA(fx.color, a); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(fx.x, fx.y, G.cell * (1 + fx.t * 3), 0, Math.PI * 2); ctx.stroke();
      } else if (fx.kind === "flash" || fx.kind === "ultflash") {
        ctx.fillStyle = hexA(fx.color, a * 0.35); ctx.fillRect(0, 0, G.canvas.width, G.canvas.height);
        if (fx.label) { ctx.fillStyle = hexA("#ffffff", a); ctx.font = "bold " + G.cell + "px sans-serif"; ctx.textAlign = "center"; ctx.fillText(fx.label, G.canvas.width / 2, G.canvas.height / 2); }
      }
    });
  }
  function hexA(hex, a) {
    a = Math.max(0, Math.min(1, a));
    if (hex[0] !== "#") return hex;
    const n = parseInt(hex.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  /* ============================================
     建塔 / 升級 / 賣塔
     ============================================ */
  function canPlace(col, row) {
    if (col < 0 || col >= G.cols || row < 0 || row >= G.rows) return false;
    if (G.pathCells.has(col + "," + row)) return false;
    for (let i = 0; i < G.towers.length; i++) if (G.towers[i].col === col && G.towers[i].row === row) return false;
    return true;
  }

  function placeTower(col, row) {
    if (!G.selectedType) return;
    const def = TD_TOWERS[G.selectedType];
    if (!canPlace(col, row) || G.gold < def.cost) return;
    G.gold -= def.cost;
    G.towers.push({
      col: col, row: row, x: col * G.cell + G.cell / 2, y: row * G.cell + G.cell / 2,
      key: def.key, name: def.name, icon: def.icon, color: def.color,
      range: def.range, damage: def.damage, fireRate: def.fireRate, projSpeed: def.projSpeed,
      splash: def.splash, slow: def.slow, slowDur: def.slowDur, chain: def.chain, chainRange: def.chainRange,
      cool: 0, level: 1, totalCost: def.cost,
    });
    updateHUD();
  }

  function upgradeTower(tw) {
    if (tw.level >= 4) return;
    const cost = Math.round(tw.totalCost * 0.7);
    if (G.gold < cost) return;
    G.gold -= cost; tw.totalCost += cost; tw.level++;
    tw.damage = Math.round(tw.damage * 1.5);
    tw.range = +(tw.range * 1.08).toFixed(2);
    tw.fireRate = Math.max(6, Math.round(tw.fireRate * 0.88));
    if (tw.splash) tw.splash = +(tw.splash * 1.15).toFixed(2);
    if (tw.chain) tw.chain += 1;
    if (tw.slow) tw.slow = Math.min(0.9, +(tw.slow + 0.05).toFixed(2));
    updateHUD(); showTowerInfo(tw);
  }

  function sellTower(tw) {
    G.gold += Math.round(tw.totalCost * 0.6);
    const idx = G.towers.indexOf(tw); if (idx !== -1) G.towers.splice(idx, 1);
    G.selectedTower = null; hideTowerInfo(); updateHUD();
  }

  /* ============================================
     UI：HUD / 商店 / 塔資訊 / 大絕列 / 面板
     ============================================ */
  function updateHUD() {
    setText("td-hud-level", "📍 第 " + (G.levelIndex + 1) + " 關");
    setText("td-hud-wave", "🌊 波次 " + Math.min(G.waveIndex + (G.waveActive ? 1 : 0), G.totalWaves) + "/" + G.totalWaves);
    setText("td-hud-gold", "💰 " + G.gold);
    setText("td-hud-lives", "❤️ " + Math.max(0, G.lives));
    setText("td-hud-score", "⭐ " + G.score);
    // 商店可負擔狀態
    document.querySelectorAll(".td-shop-item").forEach(function (el) {
      const k = el.getAttribute("data-key");
      el.classList.toggle("disabled", G.gold < TD_TOWERS[k].cost);
      el.classList.toggle("selected", G.selectedType === k);
    });
  }
  function setText(id, t) { const el = document.getElementById(id); if (el) el.textContent = t; }
  function setWaveBtn(enabled) {
    const el = document.getElementById("td-btn-start-wave");
    if (el) el.disabled = !enabled;
  }

  function buildShop() {
    const box = document.getElementById("td-shop-items");
    if (!box) return;
    box.innerHTML = "";
    TD_TOWER_ORDER.forEach(function (k) {
      const t = TD_TOWERS[k];
      const el = document.createElement("div");
      el.className = "td-shop-item"; el.setAttribute("data-key", k);
      el.innerHTML = '<span class="td-shop-icon" style="color:' + t.color + '">' + t.icon + '</span>' +
        '<span class="td-shop-name">' + t.name + '</span><span class="td-shop-cost">💰' + t.cost + '</span>';
      el.addEventListener("click", function () {
        G.selectedType = (G.selectedType === k) ? null : k;
        G.selectedTower = null; hideTowerInfo(); updateHUD();
      });
      box.appendChild(el);
    });
  }

  function showTowerInfo(tw) {
    const panel = document.getElementById("td-tower-info"); if (!panel) return;
    panel.classList.remove("hidden");
    setText("td-info-name", tw.icon + " " + tw.name + " Lv." + tw.level);
    const def = TD_TOWERS[tw.key];
    document.getElementById("td-info-stats").innerHTML =
      "傷害：" + tw.damage + "<br>射程：" + tw.range.toFixed(1) + " 格<br>攻速：" + (BASE_FPS / tw.fireRate).toFixed(2) + " 次/秒" +
      (tw.splash ? "<br>濺射：" + tw.splash + " 格" : "") +
      (tw.slow ? "<br>減速：" + Math.round(tw.slow * 100) + "%" : "") +
      (tw.chain ? "<br>連鎖：" + tw.chain : "") +
      '<br><span style="color:#94a3b8">' + def.skill + "</span>";
    const upBtn = document.getElementById("td-btn-upgrade");
    if (tw.level >= 4) { upBtn.textContent = "已滿級"; upBtn.disabled = true; }
    else { upBtn.textContent = "⬆ 升級（💰" + Math.round(tw.totalCost * 0.7) + "）"; upBtn.disabled = false; }
    document.getElementById("td-btn-sell").textContent = "💰 賣出（+" + Math.round(tw.totalCost * 0.6) + "）";
  }
  function hideTowerInfo() { const p = document.getElementById("td-tower-info"); if (p) p.classList.add("hidden"); }

  function renderUltBar() {
    const bar = document.getElementById("td-ult-bar"); if (!bar) return;
    if (!bar.dataset.built) {
      bar.innerHTML = "";
      TD_ULTIMATES.forEach(function (u) {
        const el = document.createElement("div");
        el.className = "td-ult"; el.setAttribute("data-id", u.id);
        el.innerHTML = '<div class="td-ult-key">' + u.key + '</div>' +
          '<div class="td-ult-name">' + u.name + '</div>' +
          '<div class="td-ult-cd"></div>';
        el.title = u.name + "（詠唱 " + u.cast + "s／CD " + u.cd + "s）：" + u.desc;
        el.addEventListener("click", function () { tryUltimate(u.id); });
        bar.appendChild(el);
      });
      bar.dataset.built = "1";
    }
    // 更新 CD 顯示
    TD_ULTIMATES.forEach(function (u) {
      const el = bar.querySelector('[data-id="' + u.id + '"]'); if (!el) return;
      const st = G.ult[u.id];
      const cdEl = el.querySelector(".td-ult-cd");
      if (st && st.cd > 0) { el.classList.add("cooldown"); cdEl.textContent = Math.ceil(st.cd) + "s"; }
      else { el.classList.remove("cooldown"); cdEl.textContent = ""; }
    });
  }

  /* ---------- 三張資料表面板 ---------- */
  function buildTables() {
    // 技能表（武將塔）
    const skill = document.getElementById("td-table-skill");
    if (skill) {
      let h = '<table class="td-tbl"><tr><th>武將塔</th><th>花費</th><th>傷害</th><th>射程</th><th>攻速</th><th>技能</th></tr>';
      TD_TOWER_ORDER.forEach(function (k) {
        const t = TD_TOWERS[k];
        h += '<tr><td><span style="color:' + t.color + '">' + t.icon + " " + t.name + '</span></td><td>' + t.cost +
          '</td><td>' + t.damage + '</td><td>' + t.range + '</td><td>' + (BASE_FPS / t.fireRate).toFixed(2) +
          '</td><td>' + t.skill + '</td></tr>';
      });
      skill.innerHTML = h + "</table>";
    }
    // 絕招表（玩家大絕）
    const ult = document.getElementById("td-table-ult");
    if (ult) {
      let h = '<table class="td-tbl"><tr><th>熱鍵</th><th>絕招</th><th>詠唱</th><th>CD</th><th>效果</th></tr>';
      TD_ULTIMATES.forEach(function (u) {
        h += '<tr><td><b>' + u.key + '</b></td><td>' + u.name + '</td><td>' + u.cast + 's</td><td>' + u.cd + 's</td><td>' + u.desc + '</td></tr>';
      });
      ult.innerHTML = h + "</table>";
    }
    // BOSS 表（50 關圖鑑）
    const boss = document.getElementById("td-table-boss");
    if (boss) {
      let h = '<table class="td-tbl"><tr><th>關</th><th>大BOSS</th><th>招牌技</th><th>詠唱</th><th>CD</th><th>效果</th><th>同場中/小BOSS</th><th>弱點</th></tr>';
      TD_BOSSES.forEach(function (b) {
        h += '<tr' + (b.lord ? ' class="lord"' : '') + '><td>' + b.lv + '</td><td>' + (b.lord ? "👑 " : "") + b.name +
          '</td><td>' + b.skill + '</td><td>' + b.cast + 's</td><td>' + b.cd + 's</td><td>' + (TD_EFFECT_DESC[b.effect] || b.effect) +
          '</td><td>' + (b.adds || []).join("／") + '</td><td>' + b.weak + '</td></tr>';
      });
      boss.innerHTML = h + "</table>";
    }
  }

  /* ============================================
     畫布互動
     ============================================ */
  function bindCanvas() {
    const cv = G.canvas;
    cv.addEventListener("mousemove", function (ev) {
      const rect = cv.getBoundingClientRect();
      const col = Math.floor((ev.clientX - rect.left) * (cv.width / rect.width) / G.cell);
      const row = Math.floor((ev.clientY - rect.top) * (cv.height / rect.height) / G.cell);
      G.hoverCell = { col: col, row: row };
    });
    cv.addEventListener("mouseleave", function () { G.hoverCell = null; });
    cv.addEventListener("click", function (ev) {
      const rect = cv.getBoundingClientRect();
      const col = Math.floor((ev.clientX - rect.left) * (cv.width / rect.width) / G.cell);
      const row = Math.floor((ev.clientY - rect.top) * (cv.height / rect.height) / G.cell);
      if (G.selectedType) { placeTower(col, row); return; }
      // 點既有塔 → 選取
      const tw = G.towers.find(function (t) { return t.col === col && t.row === row; });
      if (tw) { G.selectedTower = tw; showTowerInfo(tw); }
      else { G.selectedTower = null; hideTowerInfo(); }
    });
  }

  /* ============================================
     遊戲結束
     ============================================ */
  function endGame(win) {
    G.running = false;
    if (G.rafId) cancelAnimationFrame(G.rafId);
    const lvNum = G.levelIndex + 1;
    const prog = loadProgress();
    if (win) {
      prog.cleared[lvNum] = Math.max(prog.cleared[lvNum] || 0, 1);
      prog.maxUnlocked = Math.max(prog.maxUnlocked, Math.min(lvNum + 1, TD_BOSSES.length));
      prog.totalScore = (prog.totalScore || 0) + G.score;     // 累加分數
      prog.totalGold = (prog.totalGold || 0) + G.gold;        // 累加金幣
      saveProgress(prog);
    }
    showOverlay(win);
  }

  function showOverlay(win) {
    const ov = document.getElementById("td-overlay"); if (!ov) return;
    ov.classList.remove("hidden");
    setText("td-ov-title", win ? "🎉 勝利！" : "💀 戰敗");
    const prog = loadProgress();
    setText("td-ov-msg", win
      ? "你守住了第 " + (G.levelIndex + 1) + " 關！本關得分 " + G.score + "（累計總分 " + (prog.totalScore || 0) + "）"
      : "基地失守了……再接再厲！");
    const nextBtn = document.getElementById("td-btn-next");
    if (nextBtn) nextBtn.style.display = (win && G.levelIndex + 1 < TD_BOSSES.length) ? "" : "none";
  }
  function hideOverlay() { const ov = document.getElementById("td-overlay"); if (ov) ov.classList.add("hidden"); }

  /* ============================================
     對外 API
     ============================================ */
  function bindControls() {
    on("td-btn-start-wave", function () { startNextWave(); });
    on("td-btn-fast", function () { G.fast = !G.fast; toggleClass("td-btn-fast", "active", G.fast); });
    on("td-btn-pause", function () { G.paused = !G.paused; toggleClass("td-btn-pause", "active", G.paused); });
    on("td-btn-retry", function () { hideOverlay(); startLevel(G.levelIndex); });
    on("td-btn-next", function () { hideOverlay(); startLevel(G.levelIndex + 1); });
    // 大絕熱鍵 U I O J K L
    document.addEventListener("keydown", function (ev) {
      if (!G.running) return;
      const map = { u: "fireChain", i: "arrowRain", o: "baguaLock", j: "healQi", k: "thunder", l: "slayBoss" };
      const id = map[ev.key.toLowerCase()];
      if (id) { tryUltimate(id); ev.preventDefault(); }
    });
    // 面板開關
    document.querySelectorAll("[data-panel]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-panel");
        const panel = document.getElementById(id);
        if (panel) panel.classList.toggle("hidden");
      });
    });
    document.querySelectorAll(".td-panel-close").forEach(function (btn) {
      btn.addEventListener("click", function () { btn.closest(".td-panel").classList.add("hidden"); });
    });
  }
  function on(id, fn) { const el = document.getElementById(id); if (el) el.addEventListener("click", fn); }
  function toggleClass(id, cls, v) { const el = document.getElementById(id); if (el) el.classList.toggle(cls, v); }

  // 每 0.25 秒刷新一次大絕 CD 顯示
  setInterval(function () { if (G.running) renderUltBar(); }, 250);

  /* 建立關卡選單 */
  function buildLevelGrid(onPick) {
    const grid = document.getElementById("td-level-grid"); if (!grid) return;
    const prog = loadProgress();
    grid.innerHTML = "";
    for (let i = 1; i <= TD_BOSSES.length; i++) {
      const b = TD_BOSSES[i - 1];
      const unlocked = i <= prog.maxUnlocked;
      const card = document.createElement("div");
      card.className = "td-level-card" + (unlocked ? "" : " locked") + (b.lord ? " lord" : "");
      card.innerHTML = '<div class="td-level-num">第 ' + i + ' 關</div>' +
        '<div class="td-level-boss">' + (b.lord ? "👑 " : "") + b.name + '</div>' +
        (unlocked ? (prog.cleared[i] ? '<div class="td-level-star">★</div>' : "") : '<div class="td-lock">🔒</div>');
      if (unlocked) card.addEventListener("click", function () { onPick(i - 1); });
      grid.appendChild(card);
    }
  }

  // 暴露
  window.TD3K = {
    startLevel: startLevel,
    initUI: function () { bindControls(); buildTables(); },
    bindCanvasAndShop: function () { G.canvas = document.getElementById("td-canvas"); if (G.canvas) bindCanvas(); },
    buildLevelGrid: buildLevelGrid,
    loadProgress: loadProgress,
    debug: function () {
      return {
        wave: G.waveIndex, totalWaves: G.totalWaves, waveActive: G.waveActive,
        gold: G.gold, lives: G.lives, score: G.score,
        enemies: G.enemies.length, bosses: G.enemies.filter(function (e) { return e.isBoss; }).length,
        towers: G.towers.length, running: G.running,
        queuedBosses: G.spawnQueue.filter(function (s) { return s.isBoss; }).length,
      };
    },
    stop: function () { G.running = false; if (G.rafId) cancelAnimationFrame(G.rafId); },
  };
})();
