import { describe, it, expect } from "vitest";
import {
  distance,
  calculateDamage,
  applyDamageToEnemy,
  applySlow,
  calculateSellRefund,
  calculateTowerDPS,
  calculateEffectiveDPS,
  findEnemiesInRange,
  findEnemiesInSplash,
  selectTarget,
  findChainTargets,
  getUpgradeCost,
  canUpgrade,
  calculateTotalInvestment,
  calculateStarRating,
  calculateWaveBonus,
} from "../engine/combat";
import type { ActiveEnemy, PlacedTower, TowerType } from "../types";

// ---- Test Helpers ----
function createEnemy(overrides: Partial<ActiveEnemy> = {}): ActiveEnemy {
  return {
    type: "goblin",
    x: 0,
    y: 0,
    hp: 100,
    maxHp: 100,
    speed: 1.5,
    baseSpeed: 1.5,
    reward: 10,
    color: "#4ade80",
    size: 0.5,
    damage: 1,
    boss: false,
    pathIndex: 0,
    slowTimer: 0,
    slowFactor: 0,
    dead: false,
    ...overrides,
  };
}

function createTower(overrides: Partial<PlacedTower> = {}): PlacedTower {
  return {
    type: "archer",
    gx: 5,
    gy: 5,
    level: 0,
    cooldown: 0,
    damage: 8,
    range: 3,
    fireRate: 30,
    splash: 0,
    slow: 0,
    slowDuration: 0,
    chain: 0,
    chainRange: 0,
    totalCost: 50,
    ...overrides,
  };
}

const mockTowerType: TowerType = {
  name: "Archer",
  icon: "🏹",
  color: "#22c55e",
  cost: 50,
  range: 3,
  damage: 8,
  fireRate: 30,
  projectileSpeed: 6,
  projectileColor: "#22c55e",
  splash: 0,
  slow: 0,
  chain: 0,
  description: "Fast attacks",
  upgrades: [
    { cost: 40, damage: 12, range: 3.3, fireRate: 26 },
    { cost: 80, damage: 18, range: 3.6, fireRate: 22 },
    { cost: 150, damage: 28, range: 4.0, fireRate: 18 },
  ],
};

describe("Combat Engine", () => {
  // ---- distance ----
  describe("distance", () => {
    it("should calculate distance between two points", () => {
      expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    });

    it("should return 0 for same point", () => {
      expect(distance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
    });

    it("should be symmetric", () => {
      const a = { x: 1, y: 2 };
      const b = { x: 4, y: 6 };
      expect(distance(a, b)).toBe(distance(b, a));
    });

    it("should handle negative coordinates", () => {
      expect(distance({ x: -3, y: -4 }, { x: 0, y: 0 })).toBe(5);
    });
  });

  // ---- calculateDamage ----
  describe("calculateDamage", () => {
    it("should return base damage with no modifiers", () => {
      expect(calculateDamage(100)).toBe(100);
    });

    it("should apply multiplier", () => {
      expect(calculateDamage(100, 1.5)).toBe(150);
    });

    it("should apply critical hit", () => {
      expect(calculateDamage(100, 1.0, true)).toBe(200);
    });

    it("should apply custom crit multiplier", () => {
      expect(calculateDamage(100, 1.0, true, 3.0)).toBe(300);
    });

    it("should combine multiplier and crit", () => {
      expect(calculateDamage(100, 1.5, true, 2.0)).toBe(300);
    });

    it("should not return negative damage", () => {
      expect(calculateDamage(-10)).toBe(0);
    });

    it("should handle zero damage", () => {
      expect(calculateDamage(0)).toBe(0);
    });
  });

  // ---- applyDamageToEnemy ----
  describe("applyDamageToEnemy", () => {
    it("should reduce enemy HP", () => {
      const enemy = createEnemy({ hp: 100 });
      const result = applyDamageToEnemy(enemy, 30);
      expect(enemy.hp).toBe(70);
      expect(result.damageDealt).toBe(30);
      expect(result.killed).toBe(false);
    });

    it("should kill enemy when HP reaches 0", () => {
      const enemy = createEnemy({ hp: 50 });
      const result = applyDamageToEnemy(enemy, 50);
      expect(result.killed).toBe(true);
      expect(result.reward).toBe(10);
      expect(enemy.dead).toBe(true);
    });

    it("should track overkill damage", () => {
      const enemy = createEnemy({ hp: 30 });
      const result = applyDamageToEnemy(enemy, 50);
      expect(result.overkill).toBe(20);
      expect(result.damageDealt).toBe(30);
    });

    it("should not give reward for non-kill", () => {
      const enemy = createEnemy({ hp: 100 });
      const result = applyDamageToEnemy(enemy, 10);
      expect(result.reward).toBe(0);
    });

    it("should not kill already dead enemy", () => {
      const enemy = createEnemy({ hp: 0, dead: true });
      const result = applyDamageToEnemy(enemy, 10);
      expect(result.killed).toBe(false);
    });
  });

  // ---- applySlow ----
  describe("applySlow", () => {
    it("should apply slow to enemy", () => {
      const enemy = createEnemy();
      applySlow(enemy, 0.4, 60);
      expect(enemy.slowFactor).toBe(0.4);
      expect(enemy.slowTimer).toBe(60);
    });

    it("should override with stronger slow", () => {
      const enemy = createEnemy({ slowFactor: 0.3, slowTimer: 30 });
      applySlow(enemy, 0.5, 60);
      expect(enemy.slowFactor).toBe(0.5);
      expect(enemy.slowTimer).toBe(60);
    });

    it("should refresh timer when slow expires", () => {
      const enemy = createEnemy({ slowFactor: 0.5, slowTimer: 0 });
      applySlow(enemy, 0.3, 60);
      expect(enemy.slowFactor).toBe(0.3);
      expect(enemy.slowTimer).toBe(60);
    });
  });

  // ---- calculateSellRefund ----
  describe("calculateSellRefund", () => {
    it("should return 60% of total cost by default", () => {
      const tower = createTower({ totalCost: 100 });
      expect(calculateSellRefund(tower)).toBe(60);
    });

    it("should use custom refund rate", () => {
      const tower = createTower({ totalCost: 100 });
      expect(calculateSellRefund(tower, 0.5)).toBe(50);
    });

    it("should floor the result", () => {
      const tower = createTower({ totalCost: 33 });
      expect(calculateSellRefund(tower)).toBe(19); // 33 * 0.6 = 19.8 → 19
    });
  });

  // ---- calculateTowerDPS ----
  describe("calculateTowerDPS", () => {
    it("should calculate DPS at 60fps", () => {
      // 8 damage every 30 frames = 16 DPS
      expect(calculateTowerDPS(8, 30)).toBe(16);
    });

    it("should handle zero fire rate", () => {
      expect(calculateTowerDPS(8, 0)).toBe(0);
    });

    it("should scale with FPS", () => {
      expect(calculateTowerDPS(10, 30, 30)).toBe(10);
    });
  });

  // ---- calculateEffectiveDPS ----
  describe("calculateEffectiveDPS", () => {
    it("should equal base DPS with no splash", () => {
      expect(calculateEffectiveDPS(8, 30, 0)).toBe(16);
    });

    it("should add splash DPS", () => {
      const baseDPS = calculateTowerDPS(25, 70);
      const effectiveDPS = calculateEffectiveDPS(25, 70, 1.2, 3);
      expect(effectiveDPS).toBeGreaterThan(baseDPS);
    });

    it("should scale with avg enemies in splash", () => {
      const dps1 = calculateEffectiveDPS(25, 70, 1.2, 1);
      const dps3 = calculateEffectiveDPS(25, 70, 1.2, 3);
      expect(dps3).toBeGreaterThan(dps1);
    });
  });

  // ---- findEnemiesInRange ----
  describe("findEnemiesInRange", () => {
    it("should find enemies within range", () => {
      const enemies = [
        createEnemy({ x: 10, y: 10 }),
        createEnemy({ x: 100, y: 100 }),
        createEnemy({ x: 15, y: 15 }),
      ];
      const result = findEnemiesInRange({ x: 10, y: 10 }, enemies, 20);
      expect(result).toHaveLength(2);
    });

    it("should exclude dead enemies", () => {
      const enemies = [
        createEnemy({ x: 10, y: 10, dead: true }),
        createEnemy({ x: 15, y: 15 }),
      ];
      const result = findEnemiesInRange({ x: 10, y: 10 }, enemies, 20);
      expect(result).toHaveLength(1);
    });

    it("should return empty for no enemies in range", () => {
      const enemies = [createEnemy({ x: 500, y: 500 })];
      const result = findEnemiesInRange({ x: 0, y: 0 }, enemies, 10);
      expect(result).toHaveLength(0);
    });
  });

  // ---- findEnemiesInSplash ----
  describe("findEnemiesInSplash", () => {
    it("should find enemies in splash range", () => {
      const target = createEnemy({ x: 50, y: 50 });
      const enemies = [
        createEnemy({ x: 55, y: 55 }),
        createEnemy({ x: 200, y: 200 }),
      ];
      const result = findEnemiesInSplash(target, enemies, 20);
      expect(result).toHaveLength(1);
    });

    it("should exclude the target", () => {
      const target = createEnemy({ x: 50, y: 50 });
      const enemies = [target, createEnemy({ x: 55, y: 55 })];
      const result = findEnemiesInSplash(target, enemies, 20, target);
      expect(result).toHaveLength(1);
      expect(result[0]).not.toBe(target);
    });
  });

  // ---- selectTarget ----
  describe("selectTarget", () => {
    const enemies = [
      createEnemy({ x: 10, y: 10, pathIndex: 5, hp: 50 }),
      createEnemy({ x: 15, y: 15, pathIndex: 3, hp: 100 }),
      createEnemy({ x: 12, y: 12, pathIndex: 7, hp: 30 }),
    ];

    it("should select enemy furthest along path (first strategy)", () => {
      const target = selectTarget({ x: 10, y: 10 }, enemies, 100, "first");
      expect(target!.pathIndex).toBe(7);
    });

    it("should select enemy least along path (last strategy)", () => {
      const target = selectTarget({ x: 10, y: 10 }, enemies, 100, "last");
      expect(target!.pathIndex).toBe(3);
    });

    it("should select strongest enemy", () => {
      const target = selectTarget({ x: 10, y: 10 }, enemies, 100, "strongest");
      expect(target!.hp).toBe(100);
    });

    it("should select weakest enemy", () => {
      const target = selectTarget({ x: 10, y: 10 }, enemies, 100, "weakest");
      expect(target!.hp).toBe(30);
    });

    it("should select closest enemy", () => {
      const target = selectTarget({ x: 10, y: 10 }, enemies, 100, "closest");
      expect(target!.x).toBe(10);
      expect(target!.y).toBe(10);
    });

    it("should return null for no enemies in range", () => {
      const target = selectTarget({ x: 1000, y: 1000 }, enemies, 1);
      expect(target).toBeNull();
    });

    it("should use 'first' strategy by default", () => {
      const target = selectTarget({ x: 10, y: 10 }, enemies, 100);
      expect(target!.pathIndex).toBe(7);
    });
  });

  // ---- findChainTargets ----
  describe("findChainTargets", () => {
    it("should find chain targets", () => {
      const origin = createEnemy({ x: 10, y: 10 });
      const enemies = [
        createEnemy({ x: 20, y: 10 }),
        createEnemy({ x: 30, y: 10 }),
        createEnemy({ x: 40, y: 10 }),
      ];
      const targets = findChainTargets(origin, enemies, 3, 15);
      expect(targets).toHaveLength(3);
    });

    it("should chain to nearest first", () => {
      const origin = createEnemy({ x: 0, y: 0 });
      const enemies = [
        createEnemy({ x: 100, y: 0 }),
        createEnemy({ x: 5, y: 0 }),
      ];
      const targets = findChainTargets(origin, enemies, 1, 200);
      expect(targets[0].x).toBe(5);
    });

    it("should not chain to dead enemies", () => {
      const origin = createEnemy({ x: 0, y: 0 });
      const enemies = [
        createEnemy({ x: 5, y: 0, dead: true }),
        createEnemy({ x: 10, y: 0 }),
      ];
      const targets = findChainTargets(origin, enemies, 2, 15);
      expect(targets).toHaveLength(1);
      expect(targets[0].x).toBe(10);
    });

    it("should not chain beyond range", () => {
      const origin = createEnemy({ x: 0, y: 0 });
      const enemies = [
        createEnemy({ x: 5, y: 0 }),
        createEnemy({ x: 100, y: 0 }),
      ];
      const targets = findChainTargets(origin, enemies, 2, 10);
      expect(targets).toHaveLength(1);
    });

    it("should not chain to origin", () => {
      const origin = createEnemy({ x: 0, y: 0 });
      const enemies = [origin, createEnemy({ x: 5, y: 0 })];
      const targets = findChainTargets(origin, enemies, 2, 10);
      expect(targets).not.toContain(origin);
    });

    it("should respect chain count", () => {
      const origin = createEnemy({ x: 0, y: 0 });
      const enemies = Array.from({ length: 10 }, (_, i) =>
        createEnemy({ x: (i + 1) * 5, y: 0 }),
      );
      const targets = findChainTargets(origin, enemies, 3, 10);
      expect(targets).toHaveLength(3);
    });
  });

  // ---- getUpgradeCost ----
  describe("getUpgradeCost", () => {
    it("should return cost for valid level", () => {
      expect(getUpgradeCost(mockTowerType, 0)).toBe(40);
      expect(getUpgradeCost(mockTowerType, 1)).toBe(80);
      expect(getUpgradeCost(mockTowerType, 2)).toBe(150);
    });

    it("should return null for max level", () => {
      expect(getUpgradeCost(mockTowerType, 3)).toBeNull();
    });
  });

  // ---- canUpgrade ----
  describe("canUpgrade", () => {
    it("should return true with enough gold", () => {
      expect(canUpgrade(mockTowerType, 0, 100)).toBe(true);
    });

    it("should return false with insufficient gold", () => {
      expect(canUpgrade(mockTowerType, 0, 10)).toBe(false);
    });

    it("should return false at max level", () => {
      expect(canUpgrade(mockTowerType, 3, 10000)).toBe(false);
    });
  });

  // ---- calculateTotalInvestment ----
  describe("calculateTotalInvestment", () => {
    it("should return base cost for level 0", () => {
      expect(calculateTotalInvestment(mockTowerType, 0)).toBe(50);
    });

    it("should include upgrade costs", () => {
      expect(calculateTotalInvestment(mockTowerType, 1)).toBe(90); // 50 + 40
      expect(calculateTotalInvestment(mockTowerType, 2)).toBe(170); // 50 + 40 + 80
      expect(calculateTotalInvestment(mockTowerType, 3)).toBe(320); // 50 + 40 + 80 + 150
    });
  });

  // ---- calculateStarRating ----
  describe("calculateStarRating", () => {
    it("should return 3 stars for full lives", () => {
      expect(calculateStarRating(20, 20)).toBe(3);
    });

    it("should return 2 stars for 50%+ lives", () => {
      expect(calculateStarRating(10, 20)).toBe(2);
      expect(calculateStarRating(15, 20)).toBe(2);
    });

    it("should return 1 star for low lives", () => {
      expect(calculateStarRating(5, 20)).toBe(1);
    });

    it("should return 0 for no lives", () => {
      expect(calculateStarRating(0, 20)).toBe(0);
    });
  });

  // ---- calculateWaveBonus ----
  describe("calculateWaveBonus", () => {
    it("should return base + per wave * index", () => {
      expect(calculateWaveBonus(0)).toBe(25);
      expect(calculateWaveBonus(1)).toBe(30);
      expect(calculateWaveBonus(5)).toBe(50);
    });

    it("should use custom parameters", () => {
      expect(calculateWaveBonus(3, 10, 10)).toBe(40);
    });
  });
});
