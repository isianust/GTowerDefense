import { describe, it, expect, beforeEach } from "vitest";
import {
  BossFightManager,
  BOSS_FIGHTS,
  BOSS_ABILITIES,
  getBossPhaseForHp,
  bossHasAbility,
} from "../engine/boss";
import type { BossAbilityType } from "../engine/boss";

describe("Boss Mechanics", () => {
  // ---- Boss Fight Definitions ----
  describe("Boss Fight Definitions", () => {
    it("should have 4 boss fights defined", () => {
      expect(Object.keys(BOSS_FIGHTS)).toHaveLength(4);
    });

    it("should contain dragon, lich, titan, and phoenix", () => {
      expect(BOSS_FIGHTS.dragon).toBeDefined();
      expect(BOSS_FIGHTS.lich).toBeDefined();
      expect(BOSS_FIGHTS.titan).toBeDefined();
      expect(BOSS_FIGHTS.phoenix).toBeDefined();
    });

    it("all bosses should have at least 2 phases", () => {
      for (const [, boss] of Object.entries(BOSS_FIGHTS)) {
        expect(boss.phases.length).toBeGreaterThanOrEqual(2);
      }
    });

    it("all bosses should have 3 phases", () => {
      for (const [, boss] of Object.entries(BOSS_FIGHTS)) {
        expect(boss.phases).toHaveLength(3);
      }
    });

    it("phases should have decreasing HP thresholds", () => {
      for (const [, boss] of Object.entries(BOSS_FIGHTS)) {
        for (let i = 1; i < boss.phases.length; i++) {
          expect(boss.phases[i].hpThreshold).toBeLessThan(boss.phases[i - 1].hpThreshold);
        }
      }
    });

    it("all bosses should have positive base stats", () => {
      for (const [, boss] of Object.entries(BOSS_FIGHTS)) {
        expect(boss.baseHp).toBeGreaterThan(0);
        expect(boss.baseSpeed).toBeGreaterThan(0);
        expect(boss.baseDamage).toBeGreaterThan(0);
        expect(boss.reward).toBeGreaterThan(0);
        expect(boss.size).toBeGreaterThan(0);
      }
    });

    it("all bosses should have names and translations", () => {
      for (const [, boss] of Object.entries(BOSS_FIGHTS)) {
        expect(boss.name).toBeTruthy();
        expect(boss.nameZh).toBeTruthy();
        expect(boss.id).toBeTruthy();
      }
    });

    it("all phases should have names and translations", () => {
      for (const [, boss] of Object.entries(BOSS_FIGHTS)) {
        for (const phase of boss.phases) {
          expect(phase.name).toBeTruthy();
          expect(phase.nameZh).toBeTruthy();
          expect(phase.icon).toBeTruthy();
          expect(phase.color).toBeTruthy();
        }
      }
    });

    it("later phases should have higher multipliers", () => {
      for (const [, boss] of Object.entries(BOSS_FIGHTS)) {
        for (let i = 1; i < boss.phases.length; i++) {
          expect(boss.phases[i].speedMultiplier).toBeGreaterThanOrEqual(
            boss.phases[i - 1].speedMultiplier,
          );
          expect(boss.phases[i].damageMultiplier).toBeGreaterThanOrEqual(
            boss.phases[i - 1].damageMultiplier,
          );
        }
      }
    });

    it("later phases should have more or equal abilities", () => {
      for (const [, boss] of Object.entries(BOSS_FIGHTS)) {
        for (let i = 1; i < boss.phases.length; i++) {
          expect(boss.phases[i].abilities.length).toBeGreaterThanOrEqual(
            boss.phases[i - 1].abilities.length,
          );
        }
      }
    });
  });

  // ---- Boss Ability Definitions ----
  describe("Boss Ability Definitions", () => {
    it("should have 6 boss ability types", () => {
      expect(Object.keys(BOSS_ABILITIES)).toHaveLength(6);
    });

    const abilityTypes: BossAbilityType[] = [
      "enrage",
      "summon",
      "shield",
      "heal",
      "teleport",
      "aoe",
    ];

    it.each(abilityTypes)("should have '%s' ability defined", (type) => {
      expect(BOSS_ABILITIES[type]).toBeDefined();
    });

    it("all abilities should have positive cooldowns", () => {
      for (const [, ability] of Object.entries(BOSS_ABILITIES)) {
        expect(ability.cooldown).toBeGreaterThan(0);
      }
    });

    it("all abilities should have names and translations", () => {
      for (const [, ability] of Object.entries(BOSS_ABILITIES)) {
        expect(ability.name).toBeTruthy();
        expect(ability.nameZh).toBeTruthy();
        expect(ability.description).toBeTruthy();
        expect(ability.descriptionZh).toBeTruthy();
      }
    });

    it("enrage should have a speed multiplier value", () => {
      expect(BOSS_ABILITIES.enrage.value).toBeGreaterThan(1);
    });

    it("shield should have HP value", () => {
      expect(BOSS_ABILITIES.shield.value).toBeGreaterThan(0);
    });

    it("heal should have percentage value", () => {
      expect(BOSS_ABILITIES.heal.value).toBeGreaterThan(0);
      expect(BOSS_ABILITIES.heal.value).toBeLessThanOrEqual(1);
    });

    it("summon should have minion count", () => {
      expect(BOSS_ABILITIES.summon.value).toBeGreaterThan(0);
    });

    it("teleport should have distance value", () => {
      expect(BOSS_ABILITIES.teleport.value).toBeGreaterThan(0);
    });
  });

  // ---- BossFightManager ----
  describe("BossFightManager", () => {
    let manager: BossFightManager;

    beforeEach(() => {
      manager = new BossFightManager("dragon");
    });

    it("should initialize with the correct boss", () => {
      const def = manager.getDefinition();
      expect(def.id).toBe("dragon");
      expect(def.name).toBe("Ancient Dragon");
    });

    it("should throw for unknown boss ID", () => {
      expect(() => new BossFightManager("unknown")).toThrow("Unknown boss: unknown");
    });

    it("should start at phase 0", () => {
      expect(manager.getPhaseIndex()).toBe(0);
    });

    it("should report correct phase count", () => {
      expect(manager.getPhaseCount()).toBe(3);
    });

    // ---- Phase Transitions ----
    describe("Phase Transitions", () => {
      it("should stay in phase 0 at full HP", () => {
        const phase = manager.getCurrentPhase(2000);
        expect(phase.name).toBe("Awakened");
        expect(manager.getPhaseIndex()).toBe(0);
      });

      it("should transition to phase 1 at 50% HP", () => {
        const phase = manager.getCurrentPhase(1000);
        expect(phase.name).toBe("Fury");
        expect(manager.getPhaseIndex()).toBe(1);
      });

      it("should transition to phase 2 at 20% HP", () => {
        const phase = manager.getCurrentPhase(400);
        expect(phase.name).toBe("Desperation");
        expect(manager.getPhaseIndex()).toBe(2);
      });

      it("should transition to final phase at very low HP", () => {
        const phase = manager.getCurrentPhase(100);
        expect(manager.getPhaseIndex()).toBe(2);
        expect(phase.name).toBe("Desperation");
      });
    });

    // ---- Multipliers ----
    describe("Multipliers", () => {
      it("should return base speed multiplier in phase 0", () => {
        manager.getCurrentPhase(2000); // ensure phase 0
        expect(manager.getSpeedMultiplier()).toBe(1.0);
      });

      it("should return higher speed multiplier in later phases", () => {
        manager.getCurrentPhase(400); // phase 2
        expect(manager.getSpeedMultiplier()).toBeGreaterThan(1.0);
      });

      it("should return base damage multiplier in phase 0", () => {
        manager.getCurrentPhase(2000);
        expect(manager.getDamageMultiplier()).toBe(1.0);
      });

      it("should return higher damage multiplier in later phases", () => {
        manager.getCurrentPhase(400);
        expect(manager.getDamageMultiplier()).toBeGreaterThan(1.0);
      });
    });

    // ---- Shield ----
    describe("Shield", () => {
      it("should start without shield", () => {
        expect(manager.hasShield()).toBe(false);
        expect(manager.getShieldHp()).toBe(0);
      });

      it("should activate shield", () => {
        manager.activateShield(500);
        expect(manager.hasShield()).toBe(true);
        expect(manager.getShieldHp()).toBe(500);
      });

      it("should absorb damage with shield", () => {
        manager.activateShield(100);
        const actual = manager.applyDamage(80);
        expect(actual).toBe(0); // all absorbed
        expect(manager.getShieldHp()).toBe(20);
      });

      it("should pass through excess damage when shield breaks", () => {
        manager.activateShield(50);
        const actual = manager.applyDamage(80);
        expect(actual).toBe(30); // 80 - 50 shield
        expect(manager.getShieldHp()).toBe(0);
        expect(manager.hasShield()).toBe(false);
      });

      it("should pass full damage without shield", () => {
        const actual = manager.applyDamage(100);
        expect(actual).toBe(100);
      });
    });

    // ---- Heal ----
    describe("Heal", () => {
      it("should calculate heal amount based on max HP", () => {
        const healAmount = manager.calculateHealAmount();
        expect(healAmount).toBe(200); // 10% of 2000 HP
      });
    });

    // ---- Abilities ----
    describe("Ability Updates", () => {
      it("should trigger abilities after cooldown", () => {
        manager.getCurrentPhase(2000); // phase 0, has "enrage"

        // Tick through half cooldown (initial state)
        const triggered: BossAbilityType[] = [];
        for (let i = 0; i < 600; i++) {
          const t = manager.updateAbilities();
          triggered.push(...t);
        }

        expect(triggered.length).toBeGreaterThan(0);
        expect(triggered).toContain("enrage");
      });

      it("should check ability active state", () => {
        manager.getCurrentPhase(2000);
        // Initially not active
        expect(manager.isAbilityActive("enrage")).toBe(false);
      });

      it("should return ability state", () => {
        manager.getCurrentPhase(2000);
        const state = manager.getAbilityState("enrage");
        expect(state).toBeDefined();
        expect(state!.type).toBe("enrage");
      });

      it("should return undefined for unknown ability", () => {
        expect(manager.getAbilityState("summon")).toBeUndefined();
      });
    });

    // ---- Utility Methods ----
    describe("Utility Methods", () => {
      it("should return teleport distance", () => {
        expect(manager.getTeleportDistance()).toBe(3);
      });

      it("should return summon count", () => {
        expect(manager.getSummonCount()).toBe(3);
      });
    });

    // ---- Reset ----
    describe("Reset", () => {
      it("should reset to initial state", () => {
        manager.getCurrentPhase(400); // transition to phase 2
        manager.activateShield(500);

        manager.reset();

        expect(manager.getPhaseIndex()).toBe(0);
        expect(manager.hasShield()).toBe(false);
        expect(manager.getShieldHp()).toBe(0);
      });
    });
  });

  // ---- Different Bosses ----
  describe("Different Boss Types", () => {
    it("should create lich boss", () => {
      const lich = new BossFightManager("lich");
      expect(lich.getDefinition().name).toBe("Lich King");
      expect(lich.getPhaseCount()).toBe(3);
    });

    it("should create titan boss", () => {
      const titan = new BossFightManager("titan");
      expect(titan.getDefinition().name).toBe("World Titan");
      expect(titan.getDefinition().baseHp).toBe(5000);
    });

    it("should create phoenix boss", () => {
      const phoenix = new BossFightManager("phoenix");
      expect(phoenix.getDefinition().name).toBe("Eternal Phoenix");
    });

    it("each boss should have unique abilities in later phases", () => {
      const dragonManager = new BossFightManager("dragon");
      const lichManager = new BossFightManager("lich");

      dragonManager.getCurrentPhase(400); // phase 2
      lichManager.getCurrentPhase(750); // phase 2

      // Dragon has aoe, lich has shield
      expect(bossHasAbility(BOSS_FIGHTS.dragon, "aoe")).toBe(true);
      expect(bossHasAbility(BOSS_FIGHTS.lich, "heal")).toBe(true);
    });
  });

  // ---- Utility Functions ----
  describe("Utility Functions", () => {
    describe("getBossPhaseForHp", () => {
      it("should return correct phase for HP percentage", () => {
        const phase = getBossPhaseForHp(BOSS_FIGHTS.dragon, 0.8);
        expect(phase.name).toBe("Awakened");
      });

      it("should return later phase for low HP", () => {
        const phase = getBossPhaseForHp(BOSS_FIGHTS.dragon, 0.1);
        expect(phase.name).toBe("Desperation");
      });
    });

    describe("bossHasAbility", () => {
      it("should detect abilities in any phase", () => {
        expect(bossHasAbility(BOSS_FIGHTS.dragon, "enrage")).toBe(true);
        expect(bossHasAbility(BOSS_FIGHTS.dragon, "aoe")).toBe(true);
        expect(bossHasAbility(BOSS_FIGHTS.dragon, "summon")).toBe(true);
      });

      it("should return false for abilities not in any phase", () => {
        expect(bossHasAbility(BOSS_FIGHTS.dragon, "heal")).toBe(false);
        expect(bossHasAbility(BOSS_FIGHTS.dragon, "shield")).toBe(false);
      });

      it("lich should have heal and shield", () => {
        expect(bossHasAbility(BOSS_FIGHTS.lich, "heal")).toBe(true);
        expect(bossHasAbility(BOSS_FIGHTS.lich, "shield")).toBe(true);
      });

      it("titan should have shield and aoe", () => {
        expect(bossHasAbility(BOSS_FIGHTS.titan, "shield")).toBe(true);
        expect(bossHasAbility(BOSS_FIGHTS.titan, "aoe")).toBe(true);
      });

      it("phoenix should have aoe and heal and teleport", () => {
        expect(bossHasAbility(BOSS_FIGHTS.phoenix, "aoe")).toBe(true);
        expect(bossHasAbility(BOSS_FIGHTS.phoenix, "heal")).toBe(true);
        expect(bossHasAbility(BOSS_FIGHTS.phoenix, "teleport")).toBe(true);
      });
    });
  });
});
