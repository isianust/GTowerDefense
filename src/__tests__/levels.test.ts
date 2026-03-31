import { describe, it, expect } from "vitest";
import { LEVELS } from "../data/levels";
import { ENEMY_TYPES } from "../data/enemies";

describe("Level Definitions", () => {
  it("should have exactly 50 levels", () => {
    expect(LEVELS).toHaveLength(50);
  });

  describe.each(LEVELS.map((level, index) => [index, level] as const))(
    "Level %i",
    (index, level) => {
      it("should have a valid name", () => {
        expect(level.name).toBeTruthy();
        expect(typeof level.name).toBe("string");
      });

      it("should have a 20x12 grid", () => {
        expect(level.cols).toBe(20);
        expect(level.rows).toBe(12);
      });

      it("should have positive starting gold", () => {
        expect(level.startGold).toBeGreaterThan(0);
      });

      it("should have positive lives", () => {
        expect(level.lives).toBeGreaterThan(0);
      });

      it("should have a path with at least 2 cells", () => {
        expect(level.path.length).toBeGreaterThanOrEqual(2);
      });

      it("should have path cells within grid bounds", () => {
        for (const cell of level.path) {
          expect(cell.x).toBeGreaterThanOrEqual(0);
          expect(cell.x).toBeLessThan(level.cols);
          expect(cell.y).toBeGreaterThanOrEqual(0);
          expect(cell.y).toBeLessThan(level.rows);
        }
      });

      it("should have at least 1 wave", () => {
        expect(level.waves.length).toBeGreaterThanOrEqual(1);
      });

      it("should have valid enemy types in all waves", () => {
        for (const wave of level.waves) {
          for (const group of wave.enemies) {
            expect(group.type).toBeTruthy();
            expect(ENEMY_TYPES[group.type]).toBeDefined();
            expect(group.count).toBeGreaterThan(0);
            expect(group.interval).toBeGreaterThan(0);
          }
        }
      });

      it("should have terrain features within grid bounds", () => {
        if (level.terrain) {
          for (const feature of level.terrain) {
            expect(["river", "bridge", "mountain", "tree", "rock"]).toContain(feature.type);
            for (const cell of feature.cells) {
              expect(cell.x).toBeGreaterThanOrEqual(0);
              expect(cell.x).toBeLessThan(level.cols);
              expect(cell.y).toBeGreaterThanOrEqual(0);
              expect(cell.y).toBeLessThan(level.rows);
            }
          }
        }
      });
    },
  );

  describe("Progression", () => {
    it("early levels should have more starting gold", () => {
      expect(LEVELS[0].startGold).toBeLessThanOrEqual(LEVELS[49].startGold);
    });

    it("early levels should have more lives", () => {
      expect(LEVELS[0].lives).toBeGreaterThanOrEqual(LEVELS[49].lives);
    });

    it("later levels should have more waves", () => {
      const earlyMaxWaves = Math.max(...LEVELS.slice(0, 10).map((l) => l.waves.length));
      const lateMaxWaves = Math.max(...LEVELS.slice(40, 50).map((l) => l.waves.length));
      expect(lateMaxWaves).toBeGreaterThanOrEqual(earlyMaxWaves);
    });

    it("level 1 should start with goblins", () => {
      const firstWave = LEVELS[0].waves[0];
      expect(firstWave.enemies[0].type).toBe("goblin");
    });
  });
});
