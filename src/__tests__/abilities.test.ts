import { describe, it, expect, beforeEach } from "vitest";
import { AbilityManager, ABILITIES } from "../engine/abilities";
import type { AbilityType } from "../engine/abilities";

describe("Special Abilities System", () => {
  let abilities: AbilityManager;

  beforeEach(() => {
    abilities = new AbilityManager();
  });

  // ---- Ability Definitions ----
  describe("Ability Definitions", () => {
    it("should have 3 ability types", () => {
      expect(Object.keys(ABILITIES)).toHaveLength(3);
    });

    it("should contain meteor, freeze, and goldRush", () => {
      expect(ABILITIES.meteor).toBeDefined();
      expect(ABILITIES.freeze).toBeDefined();
      expect(ABILITIES.goldRush).toBeDefined();
    });

    it("meteor should have damage and radius", () => {
      expect(ABILITIES.meteor.damage).toBeGreaterThan(0);
      expect(ABILITIES.meteor.radius).toBeGreaterThan(0);
    });

    it("freeze should have slowFactor and duration", () => {
      expect(ABILITIES.freeze.slowFactor).toBe(1.0);
      expect(ABILITIES.freeze.duration).toBeGreaterThan(0);
    });

    it("goldRush should have goldMultiplier and duration", () => {
      expect(ABILITIES.goldRush.goldMultiplier).toBe(2.0);
      expect(ABILITIES.goldRush.duration).toBeGreaterThan(0);
    });

    it("all abilities should have positive cooldowns", () => {
      for (const [, def] of Object.entries(ABILITIES)) {
        expect(def.cooldown).toBeGreaterThan(0);
      }
    });

    it("all abilities should have non-negative costs", () => {
      for (const [, def] of Object.entries(ABILITIES)) {
        expect(def.cost).toBeGreaterThanOrEqual(0);
      }
    });

    it("all abilities should have names and icons", () => {
      for (const [, def] of Object.entries(ABILITIES)) {
        expect(def.name).toBeTruthy();
        expect(def.nameZh).toBeTruthy();
        expect(def.description).toBeTruthy();
        expect(def.descriptionZh).toBeTruthy();
        expect(def.icon).toBeTruthy();
      }
    });
  });

  // ---- useAbility ----
  describe("useAbility", () => {
    it("should successfully use meteor with enough gold", () => {
      const result = abilities.useAbility("meteor", 200);
      expect(result.success).toBe(true);
    });

    it("should fail with insufficient gold", () => {
      const result = abilities.useAbility("meteor", 10);
      expect(result.success).toBe(false);
      expect(result.reason).toBe("insufficient_gold");
    });

    it("should fail when on cooldown", () => {
      abilities.useAbility("meteor", 200);
      const result = abilities.useAbility("meteor", 200);
      expect(result.success).toBe(false);
      expect(result.reason).toBe("on_cooldown");
    });

    it("should handle invalid ability type", () => {
      const result = abilities.useAbility("nonexistent" as AbilityType, 1000);
      expect(result.success).toBe(false);
      expect(result.reason).toBe("invalid_ability");
    });

    it("should use freeze successfully", () => {
      const result = abilities.useAbility("freeze", 100);
      expect(result.success).toBe(true);
    });

    it("should use goldRush successfully", () => {
      const result = abilities.useAbility("goldRush", 100);
      expect(result.success).toBe(true);
    });
  });

  // ---- Cooldown ----
  describe("Cooldown", () => {
    it("should track cooldown after use", () => {
      abilities.useAbility("meteor", 200);
      expect(abilities.isOnCooldown("meteor")).toBe(true);
    });

    it("should not be on cooldown initially", () => {
      expect(abilities.isOnCooldown("meteor")).toBe(false);
    });

    it("should tick down cooldown", () => {
      abilities.useAbility("meteor", 200);
      const progressBefore = abilities.getCooldownProgress("meteor");
      expect(progressBefore).toBeCloseTo(1.0, 2);

      // Tick many frames
      for (let i = 0; i < ABILITIES.meteor.cooldown; i++) {
        abilities.update();
      }

      expect(abilities.isOnCooldown("meteor")).toBe(false);
      expect(abilities.getCooldownProgress("meteor")).toBe(0);
    });

    it("should return 0 progress for non-cooldown ability", () => {
      expect(abilities.getCooldownProgress("freeze")).toBe(0);
    });
  });

  // ---- Duration Effects ----
  describe("Duration Effects", () => {
    it("freeze should be active after use", () => {
      abilities.useAbility("freeze", 100);
      expect(abilities.isFreezeActive()).toBe(true);
      expect(abilities.isActive("freeze")).toBe(true);
    });

    it("freeze should deactivate after duration", () => {
      abilities.useAbility("freeze", 100);
      for (let i = 0; i < ABILITIES.freeze.duration; i++) {
        abilities.update();
      }
      expect(abilities.isFreezeActive()).toBe(false);
      expect(abilities.isActive("freeze")).toBe(false);
    });

    it("freeze should have slow factor when active", () => {
      abilities.useAbility("freeze", 100);
      expect(abilities.getFreezeFactor()).toBe(1.0);
    });

    it("freeze should have 0 factor when inactive", () => {
      expect(abilities.getFreezeFactor()).toBe(0);
    });

    it("goldRush should set gold multiplier", () => {
      abilities.useAbility("goldRush", 100);
      expect(abilities.getGoldMultiplier()).toBe(2.0);
    });

    it("goldRush multiplier should reset after duration", () => {
      abilities.useAbility("goldRush", 100);
      for (let i = 0; i < ABILITIES.goldRush.duration; i++) {
        abilities.update();
      }
      expect(abilities.getGoldMultiplier()).toBe(1.0);
    });

    it("duration progress should decrease over time", () => {
      abilities.useAbility("freeze", 100);
      const progressStart = abilities.getDurationProgress("freeze");
      expect(progressStart).toBe(1.0);

      for (let i = 0; i < ABILITIES.freeze.duration / 2; i++) {
        abilities.update();
      }
      const progressMid = abilities.getDurationProgress("freeze");
      expect(progressMid).toBeCloseTo(0.5, 1);
    });
  });

  // ---- State ----
  describe("State", () => {
    it("should return state for valid ability", () => {
      const state = abilities.getState("meteor");
      expect(state).toBeDefined();
      expect(state!.type).toBe("meteor");
      expect(state!.cooldownRemaining).toBe(0);
      expect(state!.active).toBe(false);
    });

    it("should return undefined for invalid ability", () => {
      expect(abilities.getState("invalid" as AbilityType)).toBeUndefined();
    });

    it("should return a copy (not reference)", () => {
      const state1 = abilities.getState("meteor");
      const state2 = abilities.getState("meteor");
      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });
  });

  // ---- Meteor Damage ----
  describe("Meteor Damage", () => {
    it("should return meteor damage info", () => {
      const info = abilities.getMeteorDamage();
      expect(info.damage).toBe(200);
      expect(info.radius).toBe(2.5);
    });
  });

  // ---- Cost ----
  describe("Cost", () => {
    it("should return correct cost for each ability", () => {
      expect(abilities.getCost("meteor")).toBe(100);
      expect(abilities.getCost("freeze")).toBe(75);
      expect(abilities.getCost("goldRush")).toBe(50);
    });

    it("should return 0 for invalid ability", () => {
      expect(abilities.getCost("invalid" as AbilityType)).toBe(0);
    });
  });

  // ---- Reset ----
  describe("reset", () => {
    it("should reset all abilities", () => {
      abilities.useAbility("meteor", 200);
      abilities.useAbility("freeze", 100);
      abilities.useAbility("goldRush", 100);

      abilities.reset();

      expect(abilities.isOnCooldown("meteor")).toBe(false);
      expect(abilities.isFreezeActive()).toBe(false);
      expect(abilities.getGoldMultiplier()).toBe(1.0);
    });
  });

  // ---- getAllTypes ----
  describe("getAllTypes", () => {
    it("should return all ability types", () => {
      const types = abilities.getAllTypes();
      expect(types).toHaveLength(3);
      expect(types).toContain("meteor");
      expect(types).toContain("freeze");
      expect(types).toContain("goldRush");
    });
  });

  // ---- Meteor as non-duration ability ----
  describe("Meteor (instant effect)", () => {
    it("should not be active (no duration)", () => {
      abilities.useAbility("meteor", 200);
      expect(abilities.isActive("meteor")).toBe(false);
    });

    it("should have 0 duration progress", () => {
      expect(abilities.getDurationProgress("meteor")).toBe(0);
    });
  });
});
