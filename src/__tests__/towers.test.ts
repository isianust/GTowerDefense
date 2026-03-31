import { describe, it, expect } from "vitest";
import { TOWER_TYPES } from "../data/towers";

describe("Tower Definitions", () => {
  it("should have exactly 5 tower types", () => {
    expect(Object.keys(TOWER_TYPES)).toHaveLength(5);
  });

  it("should contain all expected tower types", () => {
    const expected = ["archer", "cannon", "ice", "lightning", "sniper"];
    expect(Object.keys(TOWER_TYPES)).toEqual(expected);
  });

  describe.each(Object.entries(TOWER_TYPES))("Tower: %s", (key, tower) => {
    it("should have a non-empty name", () => {
      expect(tower.name).toBeTruthy();
      expect(typeof tower.name).toBe("string");
    });

    it("should have a non-empty icon", () => {
      expect(tower.icon).toBeTruthy();
    });

    it("should have a valid hex color", () => {
      expect(tower.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it("should have a positive cost", () => {
      expect(tower.cost).toBeGreaterThan(0);
    });

    it("should have positive range", () => {
      expect(tower.range).toBeGreaterThan(0);
    });

    it("should have positive damage", () => {
      expect(tower.damage).toBeGreaterThan(0);
    });

    it("should have positive fire rate", () => {
      expect(tower.fireRate).toBeGreaterThan(0);
    });

    it("should have positive projectile speed", () => {
      expect(tower.projectileSpeed).toBeGreaterThan(0);
    });

    it("should have a valid projectile hex color", () => {
      expect(tower.projectileColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it("should have non-negative splash value", () => {
      expect(tower.splash).toBeGreaterThanOrEqual(0);
    });

    it("should have non-negative slow value", () => {
      expect(tower.slow).toBeGreaterThanOrEqual(0);
    });

    it("should have non-negative chain value", () => {
      expect(tower.chain).toBeGreaterThanOrEqual(0);
    });

    it("should have a description", () => {
      expect(tower.description).toBeTruthy();
    });

    it("should have exactly 3 upgrade tiers", () => {
      expect(tower.upgrades).toHaveLength(3);
    });

    it("should have increasing upgrade costs", () => {
      for (let i = 1; i < tower.upgrades.length; i++) {
        expect(tower.upgrades[i].cost).toBeGreaterThan(tower.upgrades[i - 1].cost);
      }
    });

    it("should have positive upgrade costs", () => {
      for (const upgrade of tower.upgrades) {
        expect(upgrade.cost).toBeGreaterThan(0);
      }
    });
  });

  describe("Tower Specialties", () => {
    it("archer should have no splash, slow, or chain", () => {
      expect(TOWER_TYPES.archer.splash).toBe(0);
      expect(TOWER_TYPES.archer.slow).toBe(0);
      expect(TOWER_TYPES.archer.chain).toBe(0);
    });

    it("cannon should have splash damage", () => {
      expect(TOWER_TYPES.cannon.splash).toBeGreaterThan(0);
    });

    it("ice should have slow effect", () => {
      expect(TOWER_TYPES.ice.slow).toBeGreaterThan(0);
      expect(TOWER_TYPES.ice.slowDuration).toBeGreaterThan(0);
    });

    it("lightning should have chain effect", () => {
      expect(TOWER_TYPES.lightning.chain).toBeGreaterThan(0);
      expect(TOWER_TYPES.lightning.chainRange).toBeGreaterThan(0);
    });

    it("sniper should have the highest range", () => {
      const sniperRange = TOWER_TYPES.sniper.range;
      for (const [key, tower] of Object.entries(TOWER_TYPES)) {
        if (key !== "sniper") {
          expect(sniperRange).toBeGreaterThan(tower.range);
        }
      }
    });

    it("sniper should have the highest base damage", () => {
      const sniperDamage = TOWER_TYPES.sniper.damage;
      for (const [key, tower] of Object.entries(TOWER_TYPES)) {
        if (key !== "sniper") {
          expect(sniperDamage).toBeGreaterThan(tower.damage);
        }
      }
    });
  });

  describe("Cost Balance", () => {
    it("archer should be the cheapest tower", () => {
      const archerCost = TOWER_TYPES.archer.cost;
      for (const [key, tower] of Object.entries(TOWER_TYPES)) {
        if (key !== "archer") {
          expect(archerCost).toBeLessThanOrEqual(tower.cost);
        }
      }
    });

    it("sniper should be the most expensive tower", () => {
      const sniperCost = TOWER_TYPES.sniper.cost;
      for (const [key, tower] of Object.entries(TOWER_TYPES)) {
        if (key !== "sniper") {
          expect(sniperCost).toBeGreaterThanOrEqual(tower.cost);
        }
      }
    });
  });
});
