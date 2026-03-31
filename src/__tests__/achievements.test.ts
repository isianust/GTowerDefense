import { describe, it, expect, beforeEach, vi } from "vitest";
import { AchievementManager, ACHIEVEMENTS } from "../engine/achievements";
import type { StorageBackend } from "../engine/saveload";
import type { AchievementDef } from "../engine/achievements";

function createMockStorage(): StorageBackend & { store: Record<string, string> } {
  const store: Record<string, string> = {};
  return {
    store,
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
}

describe("Achievement System", () => {
  let storage: ReturnType<typeof createMockStorage>;
  let manager: AchievementManager;

  beforeEach(() => {
    storage = createMockStorage();
    manager = new AchievementManager(storage);
  });

  // ---- Achievement Definitions ----
  describe("Achievement Definitions", () => {
    it("should have 52 achievements defined", () => {
      expect(ACHIEVEMENTS.length).toBe(52);
    });

    it("should have unique IDs", () => {
      const ids = ACHIEVEMENTS.map((a) => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have all required fields", () => {
      for (const ach of ACHIEVEMENTS) {
        expect(ach.id).toBeTruthy();
        expect(ach.name).toBeTruthy();
        expect(ach.nameZh).toBeTruthy();
        expect(ach.description).toBeTruthy();
        expect(ach.descriptionZh).toBeTruthy();
        expect(ach.icon).toBeTruthy();
        expect(ach.category).toBeTruthy();
        expect(ach.requirement).toBeGreaterThan(0);
      }
    });

    it("should have valid categories", () => {
      const validCategories = ["combat", "economy", "progression", "mastery", "special"];
      for (const ach of ACHIEVEMENTS) {
        expect(validCategories).toContain(ach.category);
      }
    });

    it("should have 15 combat achievements", () => {
      expect(ACHIEVEMENTS.filter((a) => a.category === "combat")).toHaveLength(15);
    });

    it("should have 10 economy achievements", () => {
      expect(ACHIEVEMENTS.filter((a) => a.category === "economy")).toHaveLength(10);
    });

    it("should have 12 progression achievements", () => {
      expect(ACHIEVEMENTS.filter((a) => a.category === "progression")).toHaveLength(12);
    });

    it("should have 8 mastery achievements", () => {
      expect(ACHIEVEMENTS.filter((a) => a.category === "mastery")).toHaveLength(8);
    });

    it("should have 7 special achievements", () => {
      expect(ACHIEVEMENTS.filter((a) => a.category === "special")).toHaveLength(7);
    });

    it("completionist should be hidden", () => {
      const comp = ACHIEVEMENTS.find((a) => a.id === "completionist");
      expect(comp).toBeDefined();
      expect(comp!.hidden).toBe(true);
    });
  });

  // ---- Unlock ----
  describe("unlock", () => {
    it("should unlock an achievement", () => {
      const result = manager.unlock("first_blood");
      expect(result).toBe(true);
      expect(manager.isUnlocked("first_blood")).toBe(true);
    });

    it("should not unlock same achievement twice", () => {
      manager.unlock("first_blood");
      expect(manager.unlock("first_blood")).toBe(false);
    });

    it("should reject invalid ID", () => {
      expect(manager.unlock("nonexistent")).toBe(false);
    });

    it("should increment unlocked count", () => {
      expect(manager.getUnlockedCount()).toBe(0);
      manager.unlock("first_blood");
      expect(manager.getUnlockedCount()).toBe(1);
      manager.unlock("boss_slayer");
      expect(manager.getUnlockedCount()).toBe(2);
    });
  });

  // ---- Increment ----
  describe("increment", () => {
    it("should track progress", () => {
      manager.increment("kill_100", 10);
      expect(manager.getProgress("kill_100")).toBe(10);
    });

    it("should unlock when requirement met", () => {
      manager.increment("kill_100", 100);
      expect(manager.isUnlocked("kill_100")).toBe(true);
    });

    it("should not unlock below requirement", () => {
      manager.increment("kill_100", 50);
      expect(manager.isUnlocked("kill_100")).toBe(false);
    });

    it("should accumulate across calls", () => {
      manager.increment("kill_100", 30);
      manager.increment("kill_100", 30);
      manager.increment("kill_100", 30);
      expect(manager.getProgress("kill_100")).toBe(90);
      expect(manager.isUnlocked("kill_100")).toBe(false);

      manager.increment("kill_100", 10);
      expect(manager.isUnlocked("kill_100")).toBe(true);
    });

    it("should not increment already unlocked", () => {
      manager.unlock("first_blood");
      const result = manager.increment("first_blood");
      expect(result).toBe(false);
    });

    it("should return false for invalid ID", () => {
      expect(manager.increment("nonexistent")).toBe(false);
    });
  });

  // ---- setCounter ----
  describe("setCounter", () => {
    it("should set counter to exact value", () => {
      manager.setCounter("gold_1000", 500);
      expect(manager.getProgress("gold_1000")).toBe(500);
    });

    it("should unlock when value meets requirement", () => {
      manager.setCounter("gold_1000", 1000);
      expect(manager.isUnlocked("gold_1000")).toBe(true);
    });

    it("should not unlock below requirement", () => {
      manager.setCounter("gold_1000", 999);
      expect(manager.isUnlocked("gold_1000")).toBe(false);
    });
  });

  // ---- getByCategory ----
  describe("getByCategory", () => {
    it("should return achievements by category", () => {
      const combat = manager.getByCategory("combat");
      expect(combat.length).toBe(15);
      for (const a of combat) {
        expect(a.category).toBe("combat");
      }
    });

    it("should return empty for unknown category", () => {
      // TypeScript won't allow this, but test the runtime behavior
      const unknown = manager.getByCategory("unknown" as "combat");
      expect(unknown).toHaveLength(0);
    });
  });

  // ---- Completion ----
  describe("Completion", () => {
    it("should calculate completion percentage", () => {
      expect(manager.getCompletionPercentage()).toBe(0);
    });

    it("should update percentage after unlock", () => {
      manager.unlock("first_blood");
      const pct = manager.getCompletionPercentage();
      expect(pct).toBeGreaterThan(0);
      expect(pct).toBeLessThan(100);
    });

    it("should report total count", () => {
      expect(manager.getTotalCount()).toBe(52);
    });
  });

  // ---- Persistence ----
  describe("Persistence", () => {
    it("should save unlocks to storage", () => {
      manager.unlock("first_blood");
      expect(storage.setItem).toHaveBeenCalled();
    });

    it("should load unlocks from storage", () => {
      // Manually save some data
      const data = {
        unlocked: [["first_blood", { id: "first_blood", unlockedAt: Date.now(), progress: 1 }]],
        counters: [["first_blood", 1]],
      };
      storage.store["td_achievements"] = JSON.stringify(data);

      const newManager = new AchievementManager(storage);
      expect(newManager.isUnlocked("first_blood")).toBe(true);
    });

    it("should handle corrupted storage gracefully", () => {
      storage.store["td_achievements"] = "not json";
      const newManager = new AchievementManager(storage);
      expect(newManager.getUnlockedCount()).toBe(0);
    });
  });

  // ---- Reset ----
  describe("reset", () => {
    it("should clear all unlocks and progress", () => {
      manager.unlock("first_blood");
      manager.increment("kill_100", 50);
      manager.reset();
      expect(manager.isUnlocked("first_blood")).toBe(false);
      expect(manager.getProgress("kill_100")).toBe(0);
      expect(manager.getUnlockedCount()).toBe(0);
    });
  });

  // ---- onUnlock Callback ----
  describe("onUnlock Callback", () => {
    it("should fire callback on unlock", () => {
      const callback = vi.fn();
      manager.onUnlock(callback);
      manager.unlock("first_blood");
      expect(callback).toHaveBeenCalledOnce();
      const arg: AchievementDef = callback.mock.calls[0][0];
      expect(arg.id).toBe("first_blood");
    });

    it("should not fire on duplicate unlock", () => {
      const callback = vi.fn();
      manager.onUnlock(callback);
      manager.unlock("first_blood");
      manager.unlock("first_blood");
      expect(callback).toHaveBeenCalledOnce();
    });

    it("should fire when increment reaches requirement", () => {
      const callback = vi.fn();
      manager.onUnlock(callback);
      manager.increment("first_blood", 1); // requirement is 1
      expect(callback).toHaveBeenCalledOnce();
    });
  });

  // ---- Definition Access ----
  describe("Definition Access", () => {
    it("should get definition by ID", () => {
      const def = manager.getDefinition("first_blood");
      expect(def).toBeDefined();
      expect(def!.name).toBe("First Blood");
    });

    it("should return undefined for invalid ID", () => {
      expect(manager.getDefinition("nonexistent")).toBeUndefined();
    });

    it("should return all definitions", () => {
      const all = manager.getAllDefinitions();
      expect(all.length).toBe(52);
    });

    it("should return unlocked list", () => {
      manager.unlock("first_blood");
      manager.unlock("boss_slayer");
      const unlocked = manager.getUnlocked();
      expect(unlocked.length).toBe(2);
    });
  });
});
