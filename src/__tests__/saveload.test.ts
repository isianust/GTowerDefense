import { describe, it, expect, beforeEach, vi } from "vitest";
import { SaveLoadManager, isValidSaveState } from "../engine/saveload";
import type { StorageBackend, SavedGameState } from "../engine/saveload";

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

describe("Save/Load System", () => {
  let storage: ReturnType<typeof createMockStorage>;
  let manager: SaveLoadManager;

  beforeEach(() => {
    storage = createMockStorage();
    manager = new SaveLoadManager(storage);
  });

  // ---- Progress ----
  describe("Progress", () => {
    it("should return default progress if none saved", () => {
      const progress = manager.loadProgress();
      expect(progress).toEqual({ 0: 0 });
    });

    it("should save and load progress", () => {
      manager.saveProgress({ 0: 3, 1: 2, 2: 1 });
      const loaded = manager.loadProgress();
      expect(loaded).toEqual({ 0: 3, 1: 2, 2: 1 });
    });

    it("should reset progress", () => {
      manager.saveProgress({ 0: 3, 1: 2 });
      manager.resetProgress();
      const loaded = manager.loadProgress();
      expect(loaded).toEqual({ 0: 0 });
    });

    it("should handle corrupted progress data", () => {
      storage.store["td_progress"] = "not json";
      const progress = manager.loadProgress();
      expect(progress).toEqual({ 0: 0 });
    });

    it("should handle null progress data", () => {
      storage.store["td_progress"] = "null";
      const progress = manager.loadProgress();
      expect(progress).toEqual({ 0: 0 });
    });
  });

  // ---- Game Saves ----
  describe("Game Saves", () => {
    const testState = {
      levelIndex: 5,
      gold: 250,
      lives: 15,
      score: 1200,
      waveIndex: 3,
      towers: [
        { type: "archer", gx: 5, gy: 3, level: 1, totalCost: 90 },
        { type: "cannon", gx: 8, gy: 6, level: 0, totalCost: 75 },
      ],
    };

    it("should save a game state", () => {
      const result = manager.saveGame("slot1", "My Save", testState);
      expect(result).toBe(true);
    });

    it("should load a saved game state", () => {
      manager.saveGame("slot1", "My Save", testState);
      const loaded = manager.loadGame("slot1");
      expect(loaded).not.toBeNull();
      expect(loaded!.levelIndex).toBe(5);
      expect(loaded!.gold).toBe(250);
      expect(loaded!.lives).toBe(15);
      expect(loaded!.score).toBe(1200);
      expect(loaded!.waveIndex).toBe(3);
      expect(loaded!.towers).toHaveLength(2);
      expect(loaded!.version).toBe(1);
      expect(loaded!.timestamp).toBeGreaterThan(0);
    });

    it("should return null for nonexistent slot", () => {
      expect(manager.loadGame("nonexistent")).toBeNull();
    });

    it("should overwrite existing save in same slot", () => {
      manager.saveGame("slot1", "Save 1", testState);
      manager.saveGame("slot1", "Save 2", { ...testState, gold: 500 });
      const loaded = manager.loadGame("slot1");
      expect(loaded!.gold).toBe(500);
    });

    it("should support multiple save slots", () => {
      manager.saveGame("slot1", "Save 1", testState);
      manager.saveGame("slot2", "Save 2", { ...testState, levelIndex: 10 });
      manager.saveGame("slot3", "Save 3", { ...testState, levelIndex: 20 });

      expect(manager.loadGame("slot1")!.levelIndex).toBe(5);
      expect(manager.loadGame("slot2")!.levelIndex).toBe(10);
      expect(manager.loadGame("slot3")!.levelIndex).toBe(20);
    });

    it("should delete a save", () => {
      manager.saveGame("slot1", "My Save", testState);
      expect(manager.deleteGame("slot1")).toBe(true);
      expect(manager.loadGame("slot1")).toBeNull();
    });

    it("should return false when deleting nonexistent save", () => {
      expect(manager.deleteGame("nonexistent")).toBe(false);
    });
  });

  // ---- Save Slots Metadata ----
  describe("Save Slots", () => {
    it("should return empty array when no saves", () => {
      expect(manager.getSlots()).toEqual([]);
    });

    it("should track slot metadata", () => {
      manager.saveGame("slot1", "Morning Save", {
        levelIndex: 3,
        gold: 100,
        lives: 20,
        score: 500,
        waveIndex: 2,
        towers: [],
      });

      const slots = manager.getSlots();
      expect(slots).toHaveLength(1);
      expect(slots[0].id).toBe("slot1");
      expect(slots[0].name).toBe("Morning Save");
      expect(slots[0].levelIndex).toBe(3);
      expect(slots[0].score).toBe(500);
      expect(slots[0].timestamp).toBeGreaterThan(0);
    });

    it("should check if slot exists", () => {
      manager.saveGame("slot1", "Test", {
        levelIndex: 0,
        gold: 100,
        lives: 20,
        score: 0,
        waveIndex: 0,
        towers: [],
      });
      expect(manager.hasSlot("slot1")).toBe(true);
      expect(manager.hasSlot("slot2")).toBe(false);
    });

    it("should update metadata on overwrite", () => {
      manager.saveGame("slot1", "Old Name", {
        levelIndex: 0,
        gold: 100,
        lives: 20,
        score: 0,
        waveIndex: 0,
        towers: [],
      });
      manager.saveGame("slot1", "New Name", {
        levelIndex: 5,
        gold: 200,
        lives: 15,
        score: 1000,
        waveIndex: 3,
        towers: [],
      });

      const slots = manager.getSlots();
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe("New Name");
      expect(slots[0].levelIndex).toBe(5);
    });

    it("should remove metadata on delete", () => {
      manager.saveGame("slot1", "Test", {
        levelIndex: 0,
        gold: 100,
        lives: 20,
        score: 0,
        waveIndex: 0,
        towers: [],
      });
      manager.deleteGame("slot1");
      expect(manager.getSlots()).toHaveLength(0);
      expect(manager.hasSlot("slot1")).toBe(false);
    });
  });

  // ---- isValidSaveState ----
  describe("isValidSaveState", () => {
    it("should validate correct state", () => {
      const state: SavedGameState = {
        version: 1,
        timestamp: Date.now(),
        levelIndex: 0,
        gold: 100,
        lives: 20,
        score: 0,
        waveIndex: 0,
        towers: [],
      };
      expect(isValidSaveState(state)).toBe(true);
    });

    it("should reject null", () => {
      expect(isValidSaveState(null)).toBe(false);
    });

    it("should reject non-object", () => {
      expect(isValidSaveState("string")).toBe(false);
      expect(isValidSaveState(42)).toBe(false);
      expect(isValidSaveState(undefined)).toBe(false);
    });

    it("should reject missing fields", () => {
      expect(isValidSaveState({ version: 1 })).toBe(false);
      expect(isValidSaveState({ version: 1, timestamp: 1, levelIndex: 0 })).toBe(false);
    });

    it("should reject wrong types", () => {
      expect(
        isValidSaveState({
          version: "1",
          timestamp: 1,
          levelIndex: 0,
          gold: 100,
          lives: 20,
          score: 0,
          waveIndex: 0,
          towers: [],
        }),
      ).toBe(false);
    });
  });
});
