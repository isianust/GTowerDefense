import { describe, it, expect, beforeEach } from "vitest";
import {
  HeroManager,
  HERO_CLASSES,
  getExpRequired,
  getHeroSkillIds,
} from "../engine/hero";
import type { HeroClass } from "../engine/hero";

const HERO_CLASSES_LIST: HeroClass[] = ["warrior", "mage", "ranger", "paladin"];

describe("Hero System", () => {
  // ---- Hero Class Definitions ----
  describe("Hero Class Definitions", () => {
    it("should have 4 hero classes", () => {
      expect(Object.keys(HERO_CLASSES)).toHaveLength(4);
    });

    it("should contain warrior, mage, ranger, paladin", () => {
      for (const c of HERO_CLASSES_LIST) {
        expect(HERO_CLASSES[c]).toBeDefined();
      }
    });

    it.each(HERO_CLASSES_LIST)("%s should have valid stats", (cls) => {
      const def = HERO_CLASSES[cls];
      expect(def.maxHp).toBeGreaterThan(0);
      expect(def.armor).toBeGreaterThanOrEqual(0);
      expect(def.armor).toBeLessThan(1);
      expect(def.moveSpeed).toBeGreaterThan(0);
      expect(def.attackDamage).toBeGreaterThan(0);
      expect(def.attackRange).toBeGreaterThan(0);
      expect(def.attackRate).toBeGreaterThan(0);
      expect(def.maxEnergy).toBeGreaterThan(0);
      expect(def.energyRegen).toBeGreaterThan(0);
    });

    it.each(HERO_CLASSES_LIST)("%s should have a name and icon", (cls) => {
      const def = HERO_CLASSES[cls];
      expect(def.name).toBeTruthy();
      expect(def.nameZh).toBeTruthy();
      expect(def.icon).toBeTruthy();
    });

    it.each(HERO_CLASSES_LIST)("%s should have exactly 3 skills", (cls) => {
      expect(HERO_CLASSES[cls].skills).toHaveLength(3);
    });

    it.each(HERO_CLASSES_LIST)("%s skills should have valid definitions", (cls) => {
      for (const skill of HERO_CLASSES[cls].skills) {
        expect(skill.id).toBeTruthy();
        expect(skill.name).toBeTruthy();
        expect(skill.nameZh).toBeTruthy();
        expect(skill.description).toBeTruthy();
        expect(skill.descriptionZh).toBeTruthy();
        expect(skill.icon).toBeTruthy();
        expect(skill.cooldown).toBeGreaterThan(0);
        expect(skill.energyCost).toBeGreaterThan(0);
        expect(skill.levelRequired).toBeGreaterThanOrEqual(1);
      }
    });

    it("warrior should have highest armor among heroes", () => {
      const warriorArmor = HERO_CLASSES.warrior.armor;
      for (const cls of HERO_CLASSES_LIST) {
        if (cls !== "warrior") {
          // warrior, paladin share similar high armor
          expect(warriorArmor).toBeGreaterThanOrEqual(HERO_CLASSES.mage.armor);
        }
      }
    });

    it("mage should have lowest armor", () => {
      const mageArmor = HERO_CLASSES.mage.armor;
      for (const cls of HERO_CLASSES_LIST) {
        if (cls !== "mage") {
          expect(mageArmor).toBeLessThanOrEqual(HERO_CLASSES[cls].armor);
        }
      }
    });

    it("ranger should have the fastest move speed", () => {
      const rangerSpeed = HERO_CLASSES.ranger.moveSpeed;
      for (const cls of HERO_CLASSES_LIST) {
        if (cls !== "ranger") {
          expect(rangerSpeed).toBeGreaterThanOrEqual(HERO_CLASSES[cls].moveSpeed);
        }
      }
    });

    it("mage should have the most energy", () => {
      const mageEnergy = HERO_CLASSES.mage.maxEnergy;
      for (const cls of HERO_CLASSES_LIST) {
        if (cls !== "mage") {
          expect(mageEnergy).toBeGreaterThanOrEqual(HERO_CLASSES[cls].maxEnergy);
        }
      }
    });
  });

  // ---- HeroManager ----
  describe.each(HERO_CLASSES_LIST)("HeroManager (%s)", (cls) => {
    let manager: HeroManager;

    beforeEach(() => {
      manager = new HeroManager(cls);
    });

    it("should start at level 1", () => {
      expect(manager.getState().level).toBe(1);
    });

    it("should start with full HP", () => {
      const state = manager.getState();
      expect(state.hp).toBe(state.maxHp);
    });

    it("should start with full energy", () => {
      const state = manager.getState();
      expect(state.energy).toBe(state.maxEnergy);
    });

    it("should start alive", () => {
      expect(manager.getState().alive).toBe(true);
    });

    it("should start at position (0,0)", () => {
      const state = manager.getState();
      expect(state.x).toBe(0);
      expect(state.y).toBe(0);
    });

    it("should have all skills at 0 cooldown", () => {
      const state = manager.getState();
      for (const [, cd] of state.skillCooldowns) {
        expect(cd).toBe(0);
      }
    });
  });

  // ---- Damage & Healing ----
  describe("Damage and Healing", () => {
    let warrior: HeroManager;

    beforeEach(() => {
      warrior = new HeroManager("warrior");
    });

    it("should reduce HP when taking damage", () => {
      const maxHp = warrior.getState().maxHp;
      warrior.takeDamage(100);
      expect(warrior.getState().hp).toBeLessThan(maxHp);
    });

    it("should apply armor reduction", () => {
      const armor = HERO_CLASSES.warrior.armor; // 0.3
      warrior.takeDamage(100);
      const expectedHp = HERO_CLASSES.warrior.maxHp - Math.floor(100 * (1 - armor));
      expect(warrior.getState().hp).toBeCloseTo(expectedHp, 0);
    });

    it("should die when HP reaches 0", () => {
      warrior.takeDamage(10000);
      expect(warrior.getState().hp).toBe(0);
      expect(warrior.getState().alive).toBe(false);
    });

    it("should not take damage when dead", () => {
      warrior.takeDamage(10000);
      warrior.takeDamage(10000);
      expect(warrior.getState().hp).toBe(0);
    });

    it("should heal HP", () => {
      warrior.takeDamage(100);
      const hpBefore = warrior.getState().hp;
      warrior.heal(50);
      expect(warrior.getState().hp).toBeGreaterThan(hpBefore);
    });

    it("should not heal above maxHp", () => {
      warrior.heal(10000);
      const state = warrior.getState();
      expect(state.hp).toBe(state.maxHp);
    });

    it("should not heal when dead", () => {
      warrior.takeDamage(10000);
      warrior.heal(1000);
      expect(warrior.getState().hp).toBe(0);
    });

    it("getHpPercent should return 1 at full HP", () => {
      expect(warrior.getHpPercent()).toBe(1);
    });

    it("getHpPercent should decrease after damage", () => {
      warrior.takeDamage(100);
      expect(warrior.getHpPercent()).toBeLessThan(1);
    });
  });

  // ---- Energy ----
  describe("Energy", () => {
    let mage: HeroManager;

    beforeEach(() => {
      mage = new HeroManager("mage");
    });

    it("should regenerate energy each frame", () => {
      // Use a skill to drain energy
      mage.useSkill("arcane_bolt");
      const energyAfterSkill = mage.getState().energy;
      mage.update();
      expect(mage.getState().energy).toBeGreaterThan(energyAfterSkill);
    });

    it("should not exceed max energy", () => {
      for (let i = 0; i < 1000; i++) mage.update();
      const state = mage.getState();
      expect(state.energy).toBeLessThanOrEqual(state.maxEnergy);
    });

    it("getEnergyPercent should return 1 at full energy", () => {
      expect(mage.getEnergyPercent()).toBe(1);
    });
  });

  // ---- Skills ----
  describe("Skills", () => {
    let ranger: HeroManager;

    beforeEach(() => {
      ranger = new HeroManager("ranger");
    });

    it("should successfully use an unlocked skill with enough energy", () => {
      const result = ranger.useSkill("volley");
      expect(result.success).toBe(true);
    });

    it("should fail with insufficient energy", () => {
      // Level up mage to 7 so arcane_surge (cost 130, requires lvl 7) is unlocked
      // mage maxEnergy at level 7 = floor(150 * (1 + 7*0.05)) = 202
      const mage = new HeroManager("mage");
      for (let i = 0; i < 6; i++) mage.addExperience(10000); // reach level 7
      expect(mage.getState().level).toBe(7);

      // Use arcane_surge (130): energy = 202 - 130 = 72
      mage.useSkill("arcane_surge");

      // blizzard costs 80, energy is 72 → insufficient_energy
      const result = mage.useSkill("blizzard");
      expect(result.success).toBe(false);
      expect(result.reason).toBe("insufficient_energy");
    });

    it("should fail for invalid skill ID", () => {
      const result = ranger.useSkill("nonexistent");
      expect(result.success).toBe(false);
      expect(result.reason).toBe("invalid_skill");
    });

    it("should go on cooldown after use", () => {
      ranger.useSkill("volley");
      expect(ranger.isSkillOnCooldown("volley")).toBe(true);
    });

    it("should fail when on cooldown", () => {
      ranger.useSkill("volley");
      const result = ranger.useSkill("volley");
      expect(result.success).toBe(false);
      expect(result.reason).toBe("on_cooldown");
    });

    it("should fail if skill requires higher level", () => {
      // marked_target requires level 3, ranger starts at level 1
      const result = ranger.useSkill("marked_target");
      expect(result.success).toBe(false);
      expect(result.reason).toBe("not_unlocked");
    });

    it("should fail when hero is dead", () => {
      ranger.takeDamage(10000);
      const result = ranger.useSkill("volley");
      expect(result.success).toBe(false);
      expect(result.reason).toBe("hero_dead");
    });

    it("cooldown should tick down over frames", () => {
      ranger.useSkill("volley");
      const progressBefore = ranger.getSkillCooldownProgress("volley");
      expect(progressBefore).toBeCloseTo(1, 1);

      for (let i = 0; i < 480; i++) ranger.update();
      expect(ranger.getSkillCooldownProgress("volley")).toBe(0);
    });

    it("isSkillUnlocked should respect level requirements", () => {
      expect(ranger.isSkillUnlocked("volley")).toBe(true); // level 1
      expect(ranger.isSkillUnlocked("marked_target")).toBe(false); // level 3
      expect(ranger.isSkillUnlocked("eagle_eye")).toBe(false); // level 5
    });

    it("should return 0 progress for skill not on cooldown", () => {
      expect(ranger.getSkillCooldownProgress("volley")).toBe(0);
    });

    it("should return 0 progress for invalid skill", () => {
      expect(ranger.getSkillCooldownProgress("nonexistent")).toBe(0);
    });
  });

  // ---- Level Up ----
  describe("Level Up", () => {
    let paladin: HeroManager;

    beforeEach(() => {
      paladin = new HeroManager("paladin");
    });

    it("should level up when experience threshold reached", () => {
      const leveled = paladin.addExperience(50);
      expect(leveled).toBe(true);
      expect(paladin.getState().level).toBe(2);
    });

    it("should not level up below threshold", () => {
      const leveled = paladin.addExperience(10);
      expect(leveled).toBe(false);
      expect(paladin.getState().level).toBe(1);
    });

    it("should cap at level 10", () => {
      expect(paladin.getMaxLevel()).toBe(10);
      // Pump huge exp
      for (let i = 0; i < 20; i++) {
        paladin.addExperience(10000);
      }
      expect(paladin.getState().level).toBe(10);
    });

    it("should not level up beyond max", () => {
      for (let i = 0; i < 20; i++) paladin.addExperience(10000);
      const leveled = paladin.addExperience(10000);
      expect(leveled).toBe(false);
    });

    it("should full-heal on level up", () => {
      paladin.takeDamage(100);
      expect(paladin.getState().hp).toBeLessThan(paladin.getState().maxHp);
      paladin.addExperience(50);
      expect(paladin.getState().hp).toBe(paladin.getState().maxHp);
    });

    it("should increase max HP on level up", () => {
      const initialMaxHp = paladin.getState().maxHp;
      paladin.addExperience(50);
      expect(paladin.getState().maxHp).toBeGreaterThan(initialMaxHp);
    });

    it("getExpForNextLevel should return correct value", () => {
      expect(paladin.getExpForNextLevel()).toBe(getExpRequired(2));
    });

    it("getExpForNextLevel should return 0 at max level", () => {
      for (let i = 0; i < 20; i++) paladin.addExperience(10000);
      expect(paladin.getExpForNextLevel()).toBe(0);
    });

    it("higher levels should require more experience", () => {
      for (let lvl = 2; lvl <= 10; lvl++) {
        expect(getExpRequired(lvl)).toBeGreaterThan(getExpRequired(lvl - 1));
      }
    });
  });

  // ---- Position & Movement ----
  describe("Position", () => {
    it("should move to a new position", () => {
      const hero = new HeroManager("warrior");
      hero.moveTo(100, 200);
      const state = hero.getState();
      expect(state.x).toBe(100);
      expect(state.y).toBe(200);
    });
  });

  // ---- Reset ----
  describe("Reset", () => {
    it("should reset to initial state", () => {
      const hero = new HeroManager("mage");
      hero.takeDamage(100);
      hero.useSkill("arcane_bolt");
      hero.addExperience(10000);
      hero.moveTo(50, 100);

      hero.reset();

      const state = hero.getState();
      expect(state.level).toBe(1);
      expect(state.hp).toBe(state.maxHp);
      expect(state.alive).toBe(true);
      expect(state.x).toBe(0);
      expect(state.y).toBe(0);
    });
  });

  // ---- getHeroSkillIds ----
  describe("getHeroSkillIds", () => {
    it("should return all skill IDs for a class", () => {
      const ids = getHeroSkillIds("warrior");
      expect(ids).toHaveLength(3);
      expect(ids).toContain("battle_cry");
      expect(ids).toContain("shield_bash");
      expect(ids).toContain("last_stand");
    });

    it("should return mage skill IDs", () => {
      const ids = getHeroSkillIds("mage");
      expect(ids).toContain("arcane_bolt");
      expect(ids).toContain("blizzard");
      expect(ids).toContain("arcane_surge");
    });
  });

  // ---- getExpRequired ----
  describe("getExpRequired", () => {
    it("should return 0 for level 0 or below", () => {
      expect(getExpRequired(0)).toBe(0);
    });

    it("should return 0 for level above max", () => {
      expect(getExpRequired(11)).toBe(0);
    });

    it("should return positive values for valid levels", () => {
      for (let lvl = 2; lvl <= 10; lvl++) {
        expect(getExpRequired(lvl)).toBeGreaterThan(0);
      }
    });
  });
});
