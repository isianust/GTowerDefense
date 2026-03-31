import { describe, it, expect } from "vitest";
import {
  generateLevel,
  generatePath,
  generateWaves,
  generateTerrain,
  validateLevel,
  getEnemyTier,
  SeededRandom,
} from "../engine/levelgen";

describe("Level Generator", () => {
  // ---- SeededRandom ----
  describe("SeededRandom", () => {
    it("should produce deterministic results", () => {
      const rng1 = new SeededRandom(42);
      const rng2 = new SeededRandom(42);

      for (let i = 0; i < 100; i++) {
        expect(rng1.next()).toBe(rng2.next());
      }
    });

    it("should produce values in [0, 1)", () => {
      const rng = new SeededRandom(123);
      for (let i = 0; i < 1000; i++) {
        const v = rng.next();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      }
    });

    it("nextInt should produce values in range", () => {
      const rng = new SeededRandom(456);
      for (let i = 0; i < 100; i++) {
        const v = rng.nextInt(5, 10);
        expect(v).toBeGreaterThanOrEqual(5);
        expect(v).toBeLessThanOrEqual(10);
        expect(Number.isInteger(v)).toBe(true);
      }
    });

    it("nextFloat should produce values in range", () => {
      const rng = new SeededRandom(789);
      for (let i = 0; i < 100; i++) {
        const v = rng.nextFloat(2.0, 5.0);
        expect(v).toBeGreaterThanOrEqual(2.0);
        expect(v).toBeLessThanOrEqual(5.0);
      }
    });

    it("pick should return element from array", () => {
      const rng = new SeededRandom(101);
      const arr = ["a", "b", "c", "d"];
      for (let i = 0; i < 50; i++) {
        expect(arr).toContain(rng.pick(arr));
      }
    });

    it("different seeds should produce different sequences", () => {
      const rng1 = new SeededRandom(1);
      const rng2 = new SeededRandom(2);
      let same = 0;
      for (let i = 0; i < 100; i++) {
        if (rng1.next() === rng2.next()) same++;
      }
      expect(same).toBeLessThan(10); // Very unlikely to have many matches
    });

    it("getSeed should return current seed state", () => {
      const rng = new SeededRandom(42);
      rng.next();
      // Seed should have changed
      expect(rng.getSeed()).not.toBe(42);
    });
  });

  // ---- generatePath ----
  describe("generatePath", () => {
    it("should generate a valid path", () => {
      const rng = new SeededRandom(42);
      const path = generatePath(20, 12, rng);

      expect(path.length).toBeGreaterThanOrEqual(2);
      expect(path[0].x).toBe(0); // starts at left edge
      expect(path[path.length - 1].x).toBe(19); // ends at right edge
    });

    it("should produce connected path", () => {
      const rng = new SeededRandom(100);
      const path = generatePath(20, 12, rng);

      for (let i = 1; i < path.length; i++) {
        const dx = Math.abs(path[i].x - path[i - 1].x);
        const dy = Math.abs(path[i].y - path[i - 1].y);
        expect(dx + dy).toBe(1); // Adjacent cells
      }
    });

    it("should produce paths within bounds", () => {
      const rng = new SeededRandom(200);
      const cols = 15;
      const rows = 10;
      const path = generatePath(cols, rows, rng);

      for (const cell of path) {
        expect(cell.x).toBeGreaterThanOrEqual(0);
        expect(cell.x).toBeLessThan(cols);
        expect(cell.y).toBeGreaterThanOrEqual(0);
        expect(cell.y).toBeLessThan(rows);
      }
    });

    it("should produce different paths for different seeds", () => {
      const path1 = generatePath(20, 12, new SeededRandom(1));
      const path2 = generatePath(20, 12, new SeededRandom(2));

      // Paths should differ (at least in some cells)
      const same = path1.filter(
        (c, i) => i < path2.length && c.x === path2[i].x && c.y === path2[i].y,
      );
      expect(same.length).toBeLessThan(path1.length);
    });

    it("should handle small grids", () => {
      const rng = new SeededRandom(42);
      const path = generatePath(3, 3, rng);
      expect(path.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ---- generateWaves ----
  describe("generateWaves", () => {
    it("should generate the requested number of waves", () => {
      const rng = new SeededRandom(42);
      const waves = generateWaves(5, 5, rng);
      expect(waves).toHaveLength(5);
    });

    it("all waves should have enemies", () => {
      const rng = new SeededRandom(42);
      const waves = generateWaves(3, 4, rng);
      for (const wave of waves) {
        expect(wave.enemies.length).toBeGreaterThan(0);
        for (const group of wave.enemies) {
          expect(group.count).toBeGreaterThan(0);
          expect(group.interval).toBeGreaterThan(0);
          expect(group.type).toBeTruthy();
        }
      }
    });

    it("higher difficulty should use stronger enemies", () => {
      const rng1 = new SeededRandom(42);
      const wavesEasy = generateWaves(1, 3, rng1);
      const rng2 = new SeededRandom(42);
      const wavesHard = generateWaves(10, 3, rng2);

      const easyTypes = wavesEasy.flatMap((w) => w.enemies.map((e) => e.type));
      const hardTypes = wavesHard.flatMap((w) => w.enemies.map((e) => e.type));

      expect(easyTypes.every((t) => t === "goblin")).toBe(true);
      expect(hardTypes.some((t) => ["dragon", "lich", "titan", "phoenix"].includes(t))).toBe(true);
    });

    it("difficulty 5+ should include boss in final wave", () => {
      const rng = new SeededRandom(42);
      const waves = generateWaves(8, 5, rng);
      const lastWave = waves[waves.length - 1];
      const bossTypes = ["dragon", "lich", "titan", "phoenix"];
      const hasBoss = lastWave.enemies.some((g) => bossTypes.includes(g.type));
      expect(hasBoss).toBe(true);
    });

    it("difficulty is clamped to 1-10", () => {
      const rng = new SeededRandom(42);
      expect(() => generateWaves(0, 3, rng)).not.toThrow();
      expect(() => generateWaves(15, 3, rng)).not.toThrow();
    });
  });

  // ---- generateTerrain ----
  describe("generateTerrain", () => {
    it("should generate terrain features", () => {
      const rng = new SeededRandom(42);
      const path = [
        { x: 0, y: 5 },
        { x: 1, y: 5 },
        { x: 2, y: 5 },
      ];
      const terrain = generateTerrain(20, 12, path, 0.5, rng);
      expect(terrain.length).toBeGreaterThanOrEqual(0);
    });

    it("should not place terrain on path", () => {
      const rng = new SeededRandom(42);
      const path = Array.from({ length: 20 }, (_, i) => ({ x: i, y: 5 }));
      const terrain = generateTerrain(20, 12, path, 1.0, rng);

      const pathSet = new Set(path.map((p) => `${p.x},${p.y}`));
      for (const feature of terrain) {
        for (const cell of feature.cells) {
          expect(pathSet.has(`${cell.x},${cell.y}`)).toBe(false);
        }
      }
    });

    it("should have valid terrain types", () => {
      const rng = new SeededRandom(42);
      const terrain = generateTerrain(20, 12, [{ x: 0, y: 5 }], 0.5, rng);
      const validTypes = ["tree", "rock", "mountain"];
      for (const feature of terrain) {
        expect(validTypes).toContain(feature.type);
      }
    });

    it("should generate no terrain with density 0", () => {
      const rng = new SeededRandom(42);
      const terrain = generateTerrain(20, 12, [{ x: 0, y: 5 }], 0, rng);
      expect(terrain).toHaveLength(0);
    });
  });

  // ---- generateLevel ----
  describe("generateLevel", () => {
    it("should generate a complete level", () => {
      const level = generateLevel({ difficulty: 5, seed: 42 });
      expect(level.name).toBeTruthy();
      expect(level.cols).toBe(20);
      expect(level.rows).toBe(12);
      expect(level.path.length).toBeGreaterThanOrEqual(2);
      expect(level.waves.length).toBeGreaterThan(0);
      expect(level.startGold).toBeGreaterThan(0);
      expect(level.lives).toBeGreaterThan(0);
    });

    it("should produce deterministic results with same seed", () => {
      const level1 = generateLevel({ difficulty: 5, seed: 42 });
      const level2 = generateLevel({ difficulty: 5, seed: 42 });
      expect(level1.name).toBe(level2.name);
      expect(level1.path).toEqual(level2.path);
      expect(level1.waves).toEqual(level2.waves);
    });

    it("should use custom grid size", () => {
      const level = generateLevel({ difficulty: 3, cols: 15, rows: 8, seed: 42 });
      expect(level.cols).toBe(15);
      expect(level.rows).toBe(8);
    });

    it("should have harder settings at higher difficulty", () => {
      const easy = generateLevel({ difficulty: 1, seed: 42 });
      const hard = generateLevel({ difficulty: 10, seed: 42 });

      expect(hard.startGold).toBeLessThanOrEqual(easy.startGold);
      expect(hard.lives).toBeLessThanOrEqual(easy.lives);
    });

    it("should generate valid levels", () => {
      for (let diff = 1; diff <= 10; diff++) {
        const level = generateLevel({ difficulty: diff, seed: diff * 100 });
        const errors = validateLevel(level);
        expect(errors).toHaveLength(0);
      }
    });

    it("should handle custom wave count", () => {
      const level = generateLevel({ difficulty: 5, waveCount: 10, seed: 42 });
      expect(level.waves).toHaveLength(10);
    });
  });

  // ---- validateLevel ----
  describe("validateLevel", () => {
    it("should pass for valid generated levels", () => {
      const level = generateLevel({ difficulty: 5, seed: 42 });
      expect(validateLevel(level)).toHaveLength(0);
    });

    it("should detect too-short path", () => {
      const errors = validateLevel({
        name: "test",
        cols: 20,
        rows: 12,
        startGold: 200,
        lives: 20,
        path: [{ x: 0, y: 5 }],
        waves: [{ enemies: [{ type: "goblin", count: 5, interval: 30 }] }],
      });
      expect(errors.some((e) => e.includes("at least 2"))).toBe(true);
    });

    it("should detect no waves", () => {
      const errors = validateLevel({
        name: "test",
        cols: 20,
        rows: 12,
        startGold: 200,
        lives: 20,
        path: [
          { x: 0, y: 5 },
          { x: 1, y: 5 },
        ],
        waves: [],
      });
      expect(errors.some((e) => e.includes("at least 1 wave"))).toBe(true);
    });

    it("should detect non-positive gold", () => {
      const errors = validateLevel({
        name: "test",
        cols: 20,
        rows: 12,
        startGold: 0,
        lives: 20,
        path: [
          { x: 0, y: 5 },
          { x: 1, y: 5 },
        ],
        waves: [{ enemies: [{ type: "goblin", count: 1, interval: 30 }] }],
      });
      expect(errors.some((e) => e.includes("gold"))).toBe(true);
    });

    it("should detect non-positive lives", () => {
      const errors = validateLevel({
        name: "test",
        cols: 20,
        rows: 12,
        startGold: 200,
        lives: 0,
        path: [
          { x: 0, y: 5 },
          { x: 1, y: 5 },
        ],
        waves: [{ enemies: [{ type: "goblin", count: 1, interval: 30 }] }],
      });
      expect(errors.some((e) => e.includes("Lives"))).toBe(true);
    });

    it("should detect disconnected path", () => {
      const errors = validateLevel({
        name: "test",
        cols: 20,
        rows: 12,
        startGold: 200,
        lives: 20,
        path: [
          { x: 0, y: 5 },
          { x: 5, y: 5 }, // gap!
        ],
        waves: [{ enemies: [{ type: "goblin", count: 1, interval: 30 }] }],
      });
      expect(errors.some((e) => e.includes("not connected"))).toBe(true);
    });

    it("should detect out-of-bounds path cells", () => {
      const errors = validateLevel({
        name: "test",
        cols: 20,
        rows: 12,
        startGold: 200,
        lives: 20,
        path: [
          { x: -1, y: 5 },
          { x: 0, y: 5 },
        ],
        waves: [{ enemies: [{ type: "goblin", count: 1, interval: 30 }] }],
      });
      expect(errors.some((e) => e.includes("out of bounds"))).toBe(true);
    });

    it("should detect terrain overlapping path", () => {
      const errors = validateLevel({
        name: "test",
        cols: 20,
        rows: 12,
        startGold: 200,
        lives: 20,
        path: [
          { x: 0, y: 5 },
          { x: 1, y: 5 },
        ],
        waves: [{ enemies: [{ type: "goblin", count: 1, interval: 30 }] }],
        terrain: [{ type: "tree", cells: [{ x: 0, y: 5 }] }],
      });
      expect(errors.some((e) => e.includes("overlaps"))).toBe(true);
    });
  });

  // ---- getEnemyTier ----
  describe("getEnemyTier", () => {
    it("should return goblin for difficulty 1", () => {
      expect(getEnemyTier(1)).toContain("goblin");
    });

    it("should return bosses for difficulty 10", () => {
      const tier = getEnemyTier(10);
      expect(tier.some((t) => ["dragon", "lich", "titan", "phoenix"].includes(t))).toBe(true);
    });

    it("should clamp values", () => {
      expect(getEnemyTier(0)).toEqual(getEnemyTier(1));
      expect(getEnemyTier(15)).toEqual(getEnemyTier(10));
    });

    it("should have increasing difficulty with higher tiers", () => {
      const tier1 = getEnemyTier(1);
      const tier10 = getEnemyTier(10);
      expect(tier1.includes("dragon")).toBe(false);
      expect(tier10.includes("goblin")).toBe(false);
    });
  });
});
