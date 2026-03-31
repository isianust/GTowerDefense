import { describe, it, expect } from "vitest";
import { ENEMY_TYPES } from "../data/enemies";

describe("Enemy Definitions", () => {
  it("should have exactly 10 enemy types", () => {
    expect(Object.keys(ENEMY_TYPES)).toHaveLength(10);
  });

  it("should contain all expected enemy types", () => {
    const expected = [
      "goblin",
      "orc",
      "wolf",
      "darkKnight",
      "troll",
      "demon",
      "dragon",
      "lich",
      "titan",
      "phoenix",
    ];
    expect(Object.keys(ENEMY_TYPES)).toEqual(expected);
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
    it("should have exactly 4 boss enemies", () => {
      const bosses = Object.values(ENEMY_TYPES).filter((e) => e.boss);
      expect(bosses).toHaveLength(4);
    });

    it("dragon should be a boss", () => {
      expect(ENEMY_TYPES.dragon.boss).toBe(true);
    });

    it("lich should be a boss", () => {
      expect(ENEMY_TYPES.lich.boss).toBe(true);
    });

    it("titan should be a boss", () => {
      expect(ENEMY_TYPES.titan.boss).toBe(true);
    });

    it("phoenix should be a boss", () => {
      expect(ENEMY_TYPES.phoenix.boss).toBe(true);
    });

    it("goblin should not be a boss", () => {
      expect(ENEMY_TYPES.goblin.boss).toBeFalsy();
    });

    it("orc should not be a boss", () => {
      expect(ENEMY_TYPES.orc.boss).toBeFalsy();
    });
  });

  describe("Difficulty Progression", () => {
    it("bosses should have higher HP than standard enemies", () => {
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

    it("bosses should have higher rewards than standard enemies", () => {
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

    it("titan should have the highest HP", () => {
      const titanHP = ENEMY_TYPES.titan.hp;
      for (const enemy of Object.values(ENEMY_TYPES)) {
        expect(titanHP).toBeGreaterThanOrEqual(enemy.hp);
      }
    });

    it("goblin should have the lowest HP", () => {
      const goblinHP = ENEMY_TYPES.goblin.hp;
      for (const enemy of Object.values(ENEMY_TYPES)) {
        expect(goblinHP).toBeLessThanOrEqual(enemy.hp);
      }
    });

    it("wolf should be the fastest enemy", () => {
      const wolfSpeed = ENEMY_TYPES.wolf.speed;
      for (const enemy of Object.values(ENEMY_TYPES)) {
        expect(wolfSpeed).toBeGreaterThanOrEqual(enemy.speed);
      }
    });
  });
});
