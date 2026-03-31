import { describe, it, expect } from "vitest";
import { TOWER_TYPES } from "../data/towers";

const ORIGINAL_TOWERS = ["archer", "cannon", "ice", "lightning", "sniper"];
const PHASE3_TOWERS = [
  "flame", "mortar", "poison", "tesla", "laser",
  "catapult", "frost", "venom", "ballista", "railgun",
];
const ALL_TOWERS = [...ORIGINAL_TOWERS, ...PHASE3_TOWERS];

describe("Tower Definitions", () => {
  it("should have exactly 15 tower types", () => {
    expect(Object.keys(TOWER_TYPES)).toHaveLength(15);
  });

  it("should contain all original 5 tower types", () => {
    for (const key of ORIGINAL_TOWERS) {
      expect(Object.keys(TOWER_TYPES)).toContain(key);
    }
  });

  it("should contain all 10 Phase 3 tower types", () => {
    for (const key of PHASE3_TOWERS) {
      expect(Object.keys(TOWER_TYPES)).toContain(key);
    }
  });

  it("should contain all 15 expected towers", () => {
    expect(Object.keys(TOWER_TYPES)).toEqual(ALL_TOWERS);
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

  describe("Tower Specialties (Original 5)", () => {
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
  });

  describe("Tower Specialties (Phase 3)", () => {
    it("flame should have both splash and slow (burn)", () => {
      expect(TOWER_TYPES.flame.splash).toBeGreaterThan(0);
      expect(TOWER_TYPES.flame.slow).toBeGreaterThan(0);
    });

    it("mortar should have the largest splash radius", () => {
      const mortarSplash = TOWER_TYPES.mortar.splash;
      for (const [key, tower] of Object.entries(TOWER_TYPES)) {
        if (key !== "mortar") {
          expect(mortarSplash).toBeGreaterThanOrEqual(tower.splash);
        }
      }
    });

    it("poison should have slow effect with long duration", () => {
      expect(TOWER_TYPES.poison.slow).toBeGreaterThan(0);
      expect(TOWER_TYPES.poison.slowDuration).toBeGreaterThan(150);
    });

    it("tesla should have chain + splash", () => {
      expect(TOWER_TYPES.tesla.chain).toBeGreaterThan(0);
      expect(TOWER_TYPES.tesla.splash).toBeGreaterThan(0);
    });

    it("laser should have the fastest fire rate", () => {
      const laserRate = TOWER_TYPES.laser.fireRate;
      for (const [key, tower] of Object.entries(TOWER_TYPES)) {
        if (key !== "laser") {
          expect(laserRate).toBeLessThanOrEqual(tower.fireRate);
        }
      }
    });

    it("catapult should have very high damage", () => {
      expect(TOWER_TYPES.catapult.damage).toBeGreaterThan(TOWER_TYPES.sniper.damage);
    });

    it("frost should have splash and heavy slow", () => {
      expect(TOWER_TYPES.frost.splash).toBeGreaterThan(0);
      expect(TOWER_TYPES.frost.slow).toBeGreaterThanOrEqual(0.7);
    });

    it("venom should have long slow duration", () => {
      expect(TOWER_TYPES.venom.slowDuration).toBeGreaterThan(150);
    });

    it("ballista should have longer range than sniper", () => {
      expect(TOWER_TYPES.ballista.range).toBeGreaterThan(TOWER_TYPES.sniper.range);
    });

    it("railgun should be the most expensive tower", () => {
      const railgunCost = TOWER_TYPES.railgun.cost;
      for (const [key, tower] of Object.entries(TOWER_TYPES)) {
        if (key !== "railgun") {
          expect(railgunCost).toBeGreaterThanOrEqual(tower.cost);
        }
      }
    });

    it("railgun should have the highest range", () => {
      const railgunRange = TOWER_TYPES.railgun.range;
      for (const [key, tower] of Object.entries(TOWER_TYPES)) {
        if (key !== "railgun") {
          expect(railgunRange).toBeGreaterThanOrEqual(tower.range);
        }
      }
    });

    it("railgun should have the highest base damage", () => {
      const railgunDmg = TOWER_TYPES.railgun.damage;
      for (const [key, tower] of Object.entries(TOWER_TYPES)) {
        if (key !== "railgun") {
          expect(railgunDmg).toBeGreaterThanOrEqual(tower.damage);
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
  });
});
