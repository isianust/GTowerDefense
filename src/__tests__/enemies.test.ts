import { describe, it, expect } from "vitest";
import { ENEMY_TYPES } from "../data/enemies";

const ORIGINAL_ENEMIES = [
  "goblin", "orc", "wolf", "darkKnight", "troll", "demon",
  "dragon", "lich", "titan", "phoenix",
];
const PHASE3_STANDARD = [
  "skeleton", "harpy", "golem", "banshee", "vampire",
  "elemental", "ninja", "giant", "shade", "berserker",
];
const PHASE3_BOSSES = ["hydra", "demonLord", "shadow", "colossus", "overlord"];
const ALL_ENEMIES = [...ORIGINAL_ENEMIES, ...PHASE3_STANDARD, ...PHASE3_BOSSES];

describe("Enemy Definitions", () => {
  it("should have exactly 25 enemy types", () => {
    expect(Object.keys(ENEMY_TYPES)).toHaveLength(25);
  });

  it("should contain all original 10 enemy types", () => {
    for (const key of ORIGINAL_ENEMIES) {
      expect(Object.keys(ENEMY_TYPES)).toContain(key);
    }
  });

  it("should contain all 10 Phase 3 standard enemy types", () => {
    for (const key of PHASE3_STANDARD) {
      expect(Object.keys(ENEMY_TYPES)).toContain(key);
    }
  });

  it("should contain all 5 Phase 3 boss types", () => {
    for (const key of PHASE3_BOSSES) {
      expect(Object.keys(ENEMY_TYPES)).toContain(key);
    }
  });

  it("should contain all 25 expected enemies in order", () => {
    expect(Object.keys(ENEMY_TYPES)).toEqual(ALL_ENEMIES);
  });

  describe.each(Object.entries(ENEMY_TYPES))("Enemy: %s", (_key, enemy) => {
    it("should have a non-empty name", () => {
      expect(enemy.name).toBeTruthy();
      expect(typeof enemy.name).toBe("string");
    });

    it("should have positive HP", () => {
      expect(enemy.hp).toBeGreaterThan(0);
    });

    it("should have positive speed", () => {
      expect(enemy.speed).toBeGreaterThan(0);
    });

    it("should have positive reward", () => {
      expect(enemy.reward).toBeGreaterThan(0);
    });

    it("should have a valid hex color", () => {
      expect(enemy.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it("should have positive size", () => {
      expect(enemy.size).toBeGreaterThan(0);
      expect(enemy.size).toBeLessThanOrEqual(1.5);
    });

    it("should have positive damage", () => {
      expect(enemy.damage).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Boss Classification", () => {
    it("should have exactly 9 boss enemies", () => {
      const bosses = Object.values(ENEMY_TYPES).filter((e) => e.boss);
      expect(bosses).toHaveLength(9);
    });

    it("original bosses should still be bosses", () => {
      expect(ENEMY_TYPES.dragon.boss).toBe(true);
      expect(ENEMY_TYPES.lich.boss).toBe(true);
      expect(ENEMY_TYPES.titan.boss).toBe(true);
      expect(ENEMY_TYPES.phoenix.boss).toBe(true);
    });

    it("Phase 3 bosses should be marked as bosses", () => {
      for (const key of PHASE3_BOSSES) {
        expect(ENEMY_TYPES[key].boss).toBe(true);
      }
    });

    it("goblin should not be a boss", () => {
      expect(ENEMY_TYPES.goblin.boss).toBeFalsy();
    });

    it("orc should not be a boss", () => {
      expect(ENEMY_TYPES.orc.boss).toBeFalsy();
    });

    it("Phase 3 standard enemies should not be bosses", () => {
      for (const key of PHASE3_STANDARD) {
        expect(ENEMY_TYPES[key].boss).toBeFalsy();
      }
    });
  });

  describe("Difficulty Progression", () => {
    it("all bosses should have higher HP than all standard enemies", () => {
      const standardMaxHP = Math.max(
        ...Object.values(ENEMY_TYPES)
          .filter((e) => !e.boss)
          .map((e) => e.hp),
      );
      const bossMinHP = Math.min(
        ...Object.values(ENEMY_TYPES)
          .filter((e) => e.boss)
          .map((e) => e.hp),
      );
      expect(bossMinHP).toBeGreaterThan(standardMaxHP);
    });

    it("all bosses should have higher rewards than all standard enemies", () => {
      const standardMaxReward = Math.max(
        ...Object.values(ENEMY_TYPES)
          .filter((e) => !e.boss)
          .map((e) => e.reward),
      );
      const bossMinReward = Math.min(
        ...Object.values(ENEMY_TYPES)
          .filter((e) => e.boss)
          .map((e) => e.reward),
      );
      expect(bossMinReward).toBeGreaterThan(standardMaxReward);
    });

    it("overlord should have the highest HP of any enemy", () => {
      const overlordHP = ENEMY_TYPES.overlord.hp;
      for (const enemy of Object.values(ENEMY_TYPES)) {
        expect(overlordHP).toBeGreaterThanOrEqual(enemy.hp);
      }
    });

    it("skeleton should have the lowest HP of any enemy", () => {
      const skeletonHP = ENEMY_TYPES.skeleton.hp;
      for (const enemy of Object.values(ENEMY_TYPES)) {
        expect(skeletonHP).toBeLessThanOrEqual(enemy.hp);
      }
    });

    it("goblin should have lower HP than orc", () => {
      expect(ENEMY_TYPES.goblin.hp).toBeLessThan(ENEMY_TYPES.orc.hp);
    });

    it("harpy should be the fastest enemy", () => {
      const harpySpeed = ENEMY_TYPES.harpy.speed;
      for (const enemy of Object.values(ENEMY_TYPES)) {
        expect(harpySpeed).toBeGreaterThanOrEqual(enemy.speed);
      }
    });

    it("wolf should be faster than standard movement enemies", () => {
      expect(ENEMY_TYPES.wolf.speed).toBeGreaterThan(ENEMY_TYPES.goblin.speed);
      expect(ENEMY_TYPES.wolf.speed).toBeGreaterThan(ENEMY_TYPES.orc.speed);
    });

    it("titan should have highest HP among original enemies", () => {
      for (const key of ORIGINAL_ENEMIES) {
        expect(ENEMY_TYPES.titan.hp).toBeGreaterThanOrEqual(ENEMY_TYPES[key].hp);
      }
    });
  });

  describe("Phase 3 Enemy Characteristics", () => {
    it("skeleton should be fragile and fast", () => {
      expect(ENEMY_TYPES.skeleton.hp).toBeLessThan(50);
      expect(ENEMY_TYPES.skeleton.speed).toBeGreaterThan(1.5);
    });

    it("harpy should be the fastest", () => {
      expect(ENEMY_TYPES.harpy.speed).toBeGreaterThan(3.0);
    });

    it("golem should be very tanky", () => {
      expect(ENEMY_TYPES.golem.hp).toBeGreaterThan(500);
    });

    it("giant should have high HP and damage", () => {
      expect(ENEMY_TYPES.giant.hp).toBeGreaterThan(1000);
      expect(ENEMY_TYPES.giant.damage).toBeGreaterThanOrEqual(5);
    });

    it("all Phase 3 standard enemies should have positive stats", () => {
      for (const key of PHASE3_STANDARD) {
        const e = ENEMY_TYPES[key];
        expect(e.hp).toBeGreaterThan(0);
        expect(e.speed).toBeGreaterThan(0);
        expect(e.reward).toBeGreaterThan(0);
      }
    });

    it("Phase 3 bosses should have progressively higher HP", () => {
      // overlord > colossus > demonLord > shadow > hydra (roughly)
      expect(ENEMY_TYPES.overlord.hp).toBeGreaterThan(ENEMY_TYPES.colossus.hp);
      expect(ENEMY_TYPES.colossus.hp).toBeGreaterThan(ENEMY_TYPES.demonLord.hp);
    });
  });
});
