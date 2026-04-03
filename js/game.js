/* ============================================
   GAME ENGINE — Phaser 3 Tower Defense Core
   Guardians of the Realm
   ============================================ */

/**
 * MainScene — 塔防核心場景
 *
 * 實作內容：
 * 1. 網格 (Grid) 繪製
 * 2. S 型敵人路徑 (Phaser.Curves.Path)
 * 3. 敵人定時生成與沿路徑移動
 * 4. 點擊建塔（藍色方塊）
 * 5. 防禦塔自動索敵與射擊（黃色投射物）
 * 6. 物件池 (Groups) 管理敵人、塔與投射物
 */
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  /* ---------- 常數 ---------- */

  /** @type {number} 網格格子大小 (px) */
  static CELL_SIZE = 48;
  /** @type {number} 網格欄數 */
  static COLS = 16;
  /** @type {number} 網格列數 */
  static ROWS = 12;
  /** @type {number} 敵人生成間隔 (ms) */
  static SPAWN_INTERVAL = 2000;
  /** @type {number} 敵人沿路徑移動總時長 (ms) */
  static ENEMY_DURATION = 12000;
  /** @type {number} 防禦塔攻擊範圍 (px) */
  static TOWER_RANGE = 150;
  /** @type {number} 防禦塔射擊間隔 (ms) */
  static TOWER_FIRE_RATE = 1000;
  /** @type {number} 投射物移動速度 (px/s) */
  static PROJECTILE_SPEED = 300;

  /* ---------- Phaser 生命週期 ---------- */

  /**
   * preload — 此遊戲使用程式繪製的幾何圖形，
   *            後續可在此處替換為自己的 Sprite 圖檔。
   *            例如: this.load.image('enemy', 'assets/enemy.png');
   */
  preload() {
    // 目前不載入外部資源；所有視覺以幾何圖形替代
  }

  /**
   * create — 初始化場景：建立網格、路徑、物件池與輸入事件
   */
  create() {
    const CELL = MainScene.CELL_SIZE;
    const COLS = MainScene.COLS;
    const ROWS = MainScene.ROWS;

    // ---- 繪製網格 ----
    this.gridGraphics = this.add.graphics();
    this.gridGraphics.lineStyle(1, 0x333333, 0.5);
    for (let x = 0; x <= COLS; x++) {
      this.gridGraphics.lineBetween(x * CELL, 0, x * CELL, ROWS * CELL);
    }
    for (let y = 0; y <= ROWS; y++) {
      this.gridGraphics.lineBetween(0, y * CELL, COLS * CELL, y * CELL);
    }

    // ---- 定義 S 型路徑 ----
    this.enemyPath = this._createPath();

    // 繪製路徑線條以便測試
    this.pathGraphics = this.add.graphics();
    this.pathGraphics.lineStyle(3, 0xffaa00, 0.8);
    this.enemyPath.draw(this.pathGraphics);

    // 記錄路徑佔用的格子 (用於阻止在路徑上建塔)
    this.pathCells = this._computePathCells();

    // ---- 物件群組 (Groups / 物件池) ----

    // 防禦塔群組 — 普通 Group（無物理）
    this.towers = this.add.group();

    // 敵人群組 — 使用 Arcade 物理
    this.enemies = this.physics.add.group();

    // 投射物群組 — 使用 Arcade 物理
    this.projectiles = this.physics.add.group();

    // ---- 碰撞偵測：投射物 overlap 敵人 ----
    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this._onProjectileHitEnemy,
      null,
      this
    );

    // ---- 敵人定時生成器 ----
    this.spawnTimer = this.time.addEvent({
      delay: MainScene.SPAWN_INTERVAL,
      callback: this._spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    // ---- 滑鼠 / 觸控 — 點擊放置防禦塔 ----
    this.input.on("pointerdown", this._onPointerDown, this);
  }

  /**
   * update — 每幀更新：防禦塔索敵射擊、投射物追蹤
   * @param {number} time  — 已經過的時間 (ms)
   * @param {number} delta — 距上一幀的時間 (ms)
   */
  update(_time, _delta) {
    // 每個防禦塔檢查範圍內敵人並射擊
    this.towers.getChildren().forEach((tower) => {
      if (!tower.active) return;
      this._towerUpdate(tower);
    });

    // 投射物追蹤目標
    this.projectiles.getChildren().forEach((proj) => {
      if (!proj.active) return;
      this._projectileUpdate(proj);
    });
  }

  /* =============================================
     私有方法 — 路徑建立
     ============================================= */

  /**
   * 建立一條 S 型路徑
   * @returns {Phaser.Curves.Path}
   */
  _createPath() {
    const CELL = MainScene.CELL_SIZE;
    const COLS = MainScene.COLS;
    const halfCell = CELL / 2;

    // S 型路線：從左側開始 → 右 → 下 → 左 → 下 → 右到終點
    const path = new Phaser.Curves.Path(0, 2 * CELL + halfCell);

    // 第一段：向右
    path.lineTo(13 * CELL + halfCell, 2 * CELL + halfCell);
    // 第二段：向下
    path.lineTo(13 * CELL + halfCell, 5 * CELL + halfCell);
    // 第三段：向左
    path.lineTo(3 * CELL + halfCell, 5 * CELL + halfCell);
    // 第四段：向下
    path.lineTo(3 * CELL + halfCell, 8 * CELL + halfCell);
    // 第五段：向右到出口
    path.lineTo(COLS * CELL, 8 * CELL + halfCell);

    return path;
  }

  /**
   * 計算路徑佔用的網格座標集合
   * @returns {Set<string>} 格式為 "col,row"
   */
  _computePathCells() {
    const CELL = MainScene.CELL_SIZE;
    const cells = new Set();
    // 取樣足夠多的點來涵蓋所有路徑格子
    const totalPoints = 300;
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const point = this.enemyPath.getPoint(t);
      const col = Math.floor(point.x / CELL);
      const row = Math.floor(point.y / CELL);
      cells.add(`${col},${row}`);
    }
    return cells;
  }

  /* =============================================
     私有方法 — 敵人生成與移動
     ============================================= */

  /**
   * 生成一個敵人（紅色圓形）並沿路徑移動
   */
  _spawnEnemy() {
    const startPoint = this.enemyPath.getStartPoint();

    // 建立敵人圓形 — 後續可替換為 this.add.sprite(startPoint.x, startPoint.y, 'enemy')
    const enemy = this.add.circle(startPoint.x, startPoint.y, 12, 0xff4444);
    this.physics.add.existing(enemy);
    enemy.setData("hp", 3); // 敵人生命值
    this.enemies.add(enemy);

    // 使用 tween + follower 模式讓敵人沿路徑移動
    const follower = { t: 0 };
    const pathTween = this.tweens.add({
      targets: follower,
      t: 1,
      duration: MainScene.ENEMY_DURATION,
      ease: "Linear",
      onUpdate: () => {
        if (!enemy.active) {
          pathTween.stop();
          return;
        }
        const point = this.enemyPath.getPoint(follower.t);
        enemy.x = point.x;
        enemy.y = point.y;
        // 同步物理 body 位置
        if (enemy.body) {
          enemy.body.reset(point.x, point.y);
        }
      },
      onComplete: () => {
        // 敵人到達終點 — 移除
        if (enemy.active) {
          this.enemies.remove(enemy, true, true);
        }
      },
    });

    // 儲存 tween 參考，讓敵人被消滅時可以停止 tween
    enemy.setData("pathTween", pathTween);
  }

  /* =============================================
     私有方法 — 建塔
     ============================================= */

  /**
   * 處理滑鼠 / 觸控點擊事件 — 放置防禦塔
   * @param {Phaser.Input.Pointer} pointer
   */
  _onPointerDown(pointer) {
    const CELL = MainScene.CELL_SIZE;
    const COLS = MainScene.COLS;
    const ROWS = MainScene.ROWS;

    const col = Math.floor(pointer.x / CELL);
    const row = Math.floor(pointer.y / CELL);

    // 邊界檢查
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;

    // 不能建在路徑上
    if (this.pathCells.has(`${col},${row}`)) return;

    // 不能重複建塔 — 檢查該格是否已有塔
    const cx = col * CELL + CELL / 2;
    const cy = row * CELL + CELL / 2;
    const existing = this.towers.getChildren().find((t) => {
      return t.active && t.x === cx && t.y === cy;
    });
    if (existing) return;

    // 建立防禦塔（藍色方塊）— 後續可替換為 this.add.sprite(cx, cy, 'tower')
    const tower = this.add.rectangle(cx, cy, CELL - 8, CELL - 8, 0x4488ff);
    tower.setData("lastFired", 0); // 上次射擊時間
    tower.setData("range", MainScene.TOWER_RANGE);
    tower.setData("fireRate", MainScene.TOWER_FIRE_RATE);
    this.towers.add(tower);

    // 繪製攻擊範圍圈（半透明藍色）
    const rangeCircle = this.add.circle(
      cx,
      cy,
      MainScene.TOWER_RANGE,
      0x4488ff,
      0.08
    );
    rangeCircle.setStrokeStyle(1, 0x4488ff, 0.3);
    tower.setData("rangeCircle", rangeCircle);
  }

  /* =============================================
     私有方法 — 自動索敵與射擊
     ============================================= */

  /**
   * 防禦塔每幀更新：檢查範圍內敵人並發射投射物
   * @param {Phaser.GameObjects.Rectangle} tower
   */
  _towerUpdate(tower) {
    const now = this.time.now;
    const lastFired = tower.getData("lastFired");
    const fireRate = tower.getData("fireRate");
    const range = tower.getData("range");

    if (now - lastFired < fireRate) return;

    // 尋找範圍內最近的敵人
    let target = null;
    let minDist = Infinity;

    this.enemies.getChildren().forEach((enemy) => {
      if (!enemy.active) return;
      const dist = Phaser.Math.Distance.Between(
        tower.x,
        tower.y,
        enemy.x,
        enemy.y
      );
      if (dist <= range && dist < minDist) {
        minDist = dist;
        target = enemy;
      }
    });

    if (!target) return;

    // 發射投射物（黃色小圓形）— 後續可替換為 sprite
    const projectile = this.add.circle(tower.x, tower.y, 5, 0xffff00);
    this.physics.add.existing(projectile);
    projectile.setData("target", target);
    projectile.setData("damage", 1);
    this.projectiles.add(projectile);

    // 使用 moveToObject 追蹤敵人
    this.physics.moveToObject(
      projectile,
      target,
      MainScene.PROJECTILE_SPEED
    );

    tower.setData("lastFired", now);
  }

  /**
   * 投射物每幀更新：持續追蹤目標方向
   * @param {Phaser.GameObjects.Arc} proj
   */
  _projectileUpdate(proj) {
    const target = proj.getData("target");

    // 目標已不存在 — 銷毀投射物
    if (!target || !target.active) {
      this.projectiles.remove(proj, true, true);
      return;
    }

    // 更新移動方向以追蹤移動中的敵人
    this.physics.moveToObject(proj, target, MainScene.PROJECTILE_SPEED);
  }

  /**
   * 投射物碰撞敵人的回呼
   * @param {Phaser.GameObjects.Arc} projectile
   * @param {Phaser.GameObjects.Arc} enemy
   */
  _onProjectileHitEnemy(projectile, enemy) {
    // 扣除敵人生命值
    const hp = enemy.getData("hp") - projectile.getData("damage");
    enemy.setData("hp", hp);

    // 銷毀投射物
    this.projectiles.remove(projectile, true, true);

    // 敵人死亡
    if (hp <= 0) {
      // 停止路徑 tween
      const pathTween = enemy.getData("pathTween");
      if (pathTween) pathTween.stop();

      // 移除攻擊範圍圈相關的 tween（如果有的話）
      this.enemies.remove(enemy, true, true);
    }
  }
}

/* ============================================
   Phaser 遊戲設定 — 由 index.html 呼叫 startGame() 啟動
   ============================================ */

/**
 * 啟動 Phaser 遊戲實體
 * @returns {Phaser.Game}
 */
function startGame() {
  const config = {
    type: Phaser.AUTO,
    width: MainScene.COLS * MainScene.CELL_SIZE,   // 768
    height: MainScene.ROWS * MainScene.CELL_SIZE,  // 576
    parent: "game-container",
    backgroundColor: "#1a1a2e",
    physics: {
      default: "arcade",
      arcade: {
        // 塔防通常不需要重力
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [MainScene],
  };

  return new Phaser.Game(config);
}
