import { describe, it, expect, beforeEach } from "vitest";
import {
  WaveManager,
  buildWaveQueue,
  countWaveEnemies,
  getWaveEnemyTypes,
  summarizeWave,
  estimateWaveDuration,
  createWave,
  createEnemyGroup,
} from "../engine/wavemanager";
import type { Wave } from "../types";

// ---- Test Data ----
const simpleWaves: Wave[] = [
  { enemies: [{ type: "goblin", count: 5, interval: 30 }] },
  { enemies: [{ type: "orc", count: 3, interval: 40 }] },
  {
    enemies: [
      { type: "goblin", count: 3, interval: 30 },
      { type: "wolf", count: 2, interval: 25 },
    ],
  },
];

describe("Wave Manager", () => {
  let manager: WaveManager;

  beforeEach(() => {
    manager = new WaveManager(simpleWaves);
  });

  // ---- Initial State ----
  describe("Initial State", () => {
    it("should start in idle state", () => {
      expect(manager.getState()).toBe("idle");
    });

    it("should report correct total waves", () => {
      expect(manager.getTotalWaves()).toBe(3);
    });

    it("should start at wave index 0", () => {
      expect(manager.getCurrentWaveIndex()).toBe(0);
    });

    it("should not be active", () => {
      expect(manager.isWaveActive()).toBe(false);
    });

    it("should not be complete", () => {
      expect(manager.isAllComplete()).toBe(false);
    });
  });

  // ---- startWave ----
  describe("startWave", () => {
    it("should start the first wave", () => {
      expect(manager.startWave()).toBe(true);
      expect(manager.getState()).toBe("spawning");
      expect(manager.getCurrentWaveIndex()).toBe(1);
    });

    it("should not start when already active", () => {
      manager.startWave();
      expect(manager.startWave()).toBe(false);
    });

    it("should track wave active state", () => {
      manager.startWave();
      expect(manager.isWaveActive()).toBe(true);
    });
  });

  // ---- update ----
  describe("update", () => {
    it("should spawn enemies over time", () => {
      manager.startWave();
      let totalSpawned: string[] = [];

      // Tick through enough frames to spawn some
      for (let i = 0; i < 200; i++) {
        const spawned = manager.update(totalSpawned.length);
        totalSpawned = totalSpawned.concat(spawned);
      }

      expect(totalSpawned.length).toBeGreaterThan(0);
      expect(totalSpawned.every((t) => t === "goblin")).toBe(true);
    });

    it("should not spawn in idle state", () => {
      const spawned = manager.update(0);
      expect(spawned).toHaveLength(0);
    });

    it("should transition from spawning to active when all spawned", () => {
      manager.startWave();
      let totalSpawned = 0;

      // Tick through enough frames
      for (let i = 0; i < 500; i++) {
        const spawned = manager.update(totalSpawned);
        totalSpawned += spawned.length;
      }

      // After all spawned, state should be "active" (enemies still alive)
      expect(manager.getState()).toBe("active");
    });

    it("should transition to idle when all enemies dead", () => {
      manager.startWave();

      // Spawn all enemies
      for (let i = 0; i < 500; i++) {
        manager.update(5);
      }

      // Now report 0 active enemies
      manager.update(0);
      expect(manager.getState()).toBe("idle");
    });

    it("should track spawned count", () => {
      manager.startWave();
      let totalSpawned = 0;

      for (let i = 0; i < 500; i++) {
        const spawned = manager.update(totalSpawned);
        totalSpawned += spawned.length;
      }

      expect(manager.getSpawnedCount()).toBe(5); // 5 goblins in wave 1
    });
  });

  // ---- Wave Progression ----
  describe("Wave Progression", () => {
    it("should progress through multiple waves", () => {
      // Wave 1
      expect(manager.startWave()).toBe(true);
      for (let i = 0; i < 500; i++) manager.update(1);
      manager.update(0); // all dead

      // Wave 2
      expect(manager.startWave()).toBe(true);
      expect(manager.getCurrentWaveIndex()).toBe(2);
    });

    it("should detect completion after all waves", () => {
      for (let w = 0; w < 3; w++) {
        manager.startWave();
        for (let i = 0; i < 500; i++) manager.update(1);
        manager.update(0);
      }

      expect(manager.isAllComplete()).toBe(true);
      expect(manager.getState()).toBe("complete");
    });

    it("should not start more waves after completion", () => {
      for (let w = 0; w < 3; w++) {
        manager.startWave();
        for (let i = 0; i < 500; i++) manager.update(1);
        manager.update(0);
      }

      expect(manager.startWave()).toBe(false);
    });
  });

  // ---- getWaveSummary ----
  describe("getWaveSummary", () => {
    it("should return summary for valid wave", () => {
      const summary = manager.getWaveSummary(0);
      expect(summary).not.toBeNull();
      expect(summary!.totalEnemies).toBe(5);
      expect(summary!.enemyTypes).toContain("goblin");
    });

    it("should return null for invalid index", () => {
      expect(manager.getWaveSummary(-1)).toBeNull();
      expect(manager.getWaveSummary(100)).toBeNull();
    });

    it("should handle multi-group waves", () => {
      const summary = manager.getWaveSummary(2);
      expect(summary!.totalEnemies).toBe(5); // 3 goblins + 2 wolves
      expect(summary!.enemyTypes).toHaveLength(2);
    });
  });

  // ---- getRemainingToSpawn ----
  describe("getRemainingToSpawn", () => {
    it("should return 0 before starting", () => {
      expect(manager.getRemainingToSpawn()).toBe(0);
    });

    it("should decrease as enemies spawn", () => {
      manager.startWave();
      const initialRemaining = manager.getRemainingToSpawn();

      for (let i = 0; i < 200; i++) {
        manager.update(0);
      }

      expect(manager.getRemainingToSpawn()).toBeLessThan(initialRemaining);
    });
  });

  // ---- reset ----
  describe("reset", () => {
    it("should reset to initial state", () => {
      manager.startWave();
      for (let i = 0; i < 100; i++) manager.update(1);

      manager.reset();

      expect(manager.getState()).toBe("idle");
      expect(manager.getCurrentWaveIndex()).toBe(0);
      expect(manager.getSpawnedCount()).toBe(0);
      expect(manager.isAllComplete()).toBe(false);
    });
  });
});

// ---- Utility Functions ----
describe("Wave Utilities", () => {
  const testWave: Wave = {
    enemies: [
      { type: "goblin", count: 10, interval: 20 },
      { type: "orc", count: 5, interval: 30 },
    ],
  };

  describe("buildWaveQueue", () => {
    it("should create queue entries for all enemies", () => {
      const queue = buildWaveQueue(testWave);
      expect(queue).toHaveLength(15); // 10 + 5
    });

    it("should sort by delay", () => {
      const queue = buildWaveQueue(testWave);
      for (let i = 1; i < queue.length; i++) {
        expect(queue[i].delay).toBeGreaterThanOrEqual(queue[i - 1].delay);
      }
    });

    it("should assign correct enemy types", () => {
      const queue = buildWaveQueue(testWave);
      const goblins = queue.filter((e) => e.type === "goblin");
      const orcs = queue.filter((e) => e.type === "orc");
      expect(goblins).toHaveLength(10);
      expect(orcs).toHaveLength(5);
    });
  });

  describe("countWaveEnemies", () => {
    it("should count total enemies", () => {
      expect(countWaveEnemies(testWave)).toBe(15);
    });

    it("should handle single group", () => {
      expect(countWaveEnemies({ enemies: [{ type: "goblin", count: 3, interval: 20 }] })).toBe(3);
    });
  });

  describe("getWaveEnemyTypes", () => {
    it("should return unique enemy types", () => {
      const types = getWaveEnemyTypes(testWave);
      expect(types).toHaveLength(2);
      expect(types).toContain("goblin");
      expect(types).toContain("orc");
    });

    it("should deduplicate types", () => {
      const wave: Wave = {
        enemies: [
          { type: "goblin", count: 5, interval: 20 },
          { type: "goblin", count: 3, interval: 20 },
        ],
      };
      expect(getWaveEnemyTypes(wave)).toHaveLength(1);
    });
  });

  describe("summarizeWave", () => {
    it("should summarize wave", () => {
      const summary = summarizeWave(testWave);
      expect(summary.totalEnemies).toBe(15);
      expect(summary.enemyTypes).toHaveLength(2);
      expect(summary.estimatedDifficulty).toBeGreaterThan(0);
    });

    it("should have higher difficulty with more enemy types", () => {
      const singleType: Wave = { enemies: [{ type: "goblin", count: 10, interval: 20 }] };
      const multiType: Wave = {
        enemies: [
          { type: "goblin", count: 5, interval: 20 },
          { type: "orc", count: 5, interval: 30 },
        ],
      };

      const s1 = summarizeWave(singleType);
      const s2 = summarizeWave(multiType);
      expect(s2.estimatedDifficulty).toBeGreaterThan(s1.estimatedDifficulty);
    });
  });

  describe("estimateWaveDuration", () => {
    it("should estimate duration in frames", () => {
      const duration = estimateWaveDuration(testWave);
      expect(duration).toBeGreaterThan(0);
    });

    it("should increase with more enemies", () => {
      const small: Wave = { enemies: [{ type: "goblin", count: 2, interval: 20 }] };
      const large: Wave = { enemies: [{ type: "goblin", count: 10, interval: 20 }] };
      expect(estimateWaveDuration(large)).toBeGreaterThan(estimateWaveDuration(small));
    });
  });

  describe("createWave", () => {
    it("should create a wave from groups", () => {
      const wave = createWave([
        createEnemyGroup("goblin", 5, 30),
        createEnemyGroup("orc", 3, 40),
      ]);
      expect(wave.enemies).toHaveLength(2);
      expect(wave.enemies[0].type).toBe("goblin");
      expect(wave.enemies[0].count).toBe(5);
    });
  });

  describe("createEnemyGroup", () => {
    it("should create an enemy group", () => {
      const group = createEnemyGroup("wolf", 10, 25);
      expect(group.type).toBe("wolf");
      expect(group.count).toBe(10);
      expect(group.interval).toBe(25);
    });
  });
});
