/* ============================================
   WAVE MANAGER — Wave spawning & scheduling
   ============================================ */

import type { Wave, WaveEnemyGroup, WaveQueueEntry } from "../types";

/** Wave state */
export type WaveState = "idle" | "spawning" | "active" | "complete";

/** Wave summary statistics */
export interface WaveSummary {
  totalEnemies: number;
  enemyTypes: string[];
  estimatedDifficulty: number;
}

/**
 * WaveManager — Handles wave spawning and progression
 */
export class WaveManager {
  private waves: Wave[];
  private currentWaveIndex = 0;
  private queue: WaveQueueEntry[] = [];
  private timer = 0;
  private spawned = 0;
  private state: WaveState = "idle";
  private activeEnemyCount = 0;

  constructor(waves: Wave[]) {
    this.waves = waves;
  }

  /**
   * Start the next wave
   * @returns true if wave started, false if no more waves or already active
   */
  startWave(): boolean {
    if (this.state === "spawning" || this.state === "active") return false;
    if (this.currentWaveIndex >= this.waves.length) return false;

    const waveDef = this.waves[this.currentWaveIndex];
    this.queue = buildWaveQueue(waveDef);
    this.timer = 0;
    this.spawned = 0;
    this.state = "spawning";
    this.currentWaveIndex++;

    return true;
  }

  /**
   * Update wave state (call every frame)
   * @returns list of enemy types to spawn this frame
   */
  update(currentActiveEnemies: number): string[] {
    this.activeEnemyCount = currentActiveEnemies;
    const toSpawn: string[] = [];

    if (this.state === "spawning") {
      this.timer++;
      while (this.queue.length > 0 && this.queue[0].delay <= this.timer) {
        const entry = this.queue.shift()!;
        toSpawn.push(entry.type);
        this.spawned++;
      }

      // All spawned, transition to active (waiting for enemies to die/exit)
      if (this.queue.length === 0) {
        this.state = "active";
      }
    }

    if (this.state === "active" && currentActiveEnemies === 0) {
      this.state = this.currentWaveIndex >= this.waves.length ? "complete" : "idle";
    }

    return toSpawn;
  }

  /**
   * Get current wave state
   */
  getState(): WaveState {
    return this.state;
  }

  /**
   * Get current wave index (1-based, the wave that's currently active or was last started)
   */
  getCurrentWaveIndex(): number {
    return this.currentWaveIndex;
  }

  /**
   * Get total number of waves
   */
  getTotalWaves(): number {
    return this.waves.length;
  }

  /**
   * Check if all waves are complete
   */
  isAllComplete(): boolean {
    return this.state === "complete";
  }

  /**
   * Check if a wave is currently active (spawning or enemies still alive)
   */
  isWaveActive(): boolean {
    return this.state === "spawning" || this.state === "active";
  }

  /**
   * Get the number of enemies spawned in the current wave
   */
  getSpawnedCount(): number {
    return this.spawned;
  }

  /**
   * Get remaining enemies to spawn in current wave
   */
  getRemainingToSpawn(): number {
    return this.queue.length;
  }

  /**
   * Get wave summary for a specific wave index (0-based)
   */
  getWaveSummary(waveIndex: number): WaveSummary | null {
    if (waveIndex < 0 || waveIndex >= this.waves.length) return null;
    return summarizeWave(this.waves[waveIndex]);
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.currentWaveIndex = 0;
    this.queue = [];
    this.timer = 0;
    this.spawned = 0;
    this.state = "idle";
    this.activeEnemyCount = 0;
  }
}

/**
 * Build a spawn queue from a wave definition
 */
export function buildWaveQueue(wave: Wave): WaveQueueEntry[] {
  const queue: WaveQueueEntry[] = [];
  let offset = 0;

  for (const group of wave.enemies) {
    for (let i = 0; i < group.count; i++) {
      queue.push({
        type: group.type,
        delay: offset + group.interval * i,
      });
    }
    // Add gap between groups
    offset += group.count * group.interval + 20;
  }

  queue.sort((a, b) => a.delay - b.delay);
  return queue;
}

/**
 * Count total enemies in a wave
 */
export function countWaveEnemies(wave: Wave): number {
  return wave.enemies.reduce((sum, group) => sum + group.count, 0);
}

/**
 * Get unique enemy types in a wave
 */
export function getWaveEnemyTypes(wave: Wave): string[] {
  return [...new Set(wave.enemies.map((g) => g.type))];
}

/**
 * Summarize a wave for UI display or analysis
 */
export function summarizeWave(wave: Wave): WaveSummary {
  const totalEnemies = countWaveEnemies(wave);
  const enemyTypes = getWaveEnemyTypes(wave);
  // Simple difficulty heuristic based on enemy count and variety
  const estimatedDifficulty = totalEnemies * (1 + (enemyTypes.length - 1) * 0.2);

  return { totalEnemies, enemyTypes, estimatedDifficulty };
}

/**
 * Estimate wave duration in frames
 */
export function estimateWaveDuration(wave: Wave): number {
  let maxDelay = 0;
  let offset = 0;

  for (const group of wave.enemies) {
    const lastSpawnDelay = offset + group.interval * (group.count - 1);
    if (lastSpawnDelay > maxDelay) {
      maxDelay = lastSpawnDelay;
    }
    offset += group.count * group.interval + 20;
  }

  return maxDelay;
}

/**
 * Create a simple wave definition from enemy groups
 */
export function createWave(groups: WaveEnemyGroup[]): Wave {
  return { enemies: groups };
}

/**
 * Create an enemy group
 */
export function createEnemyGroup(type: string, count: number, interval: number): WaveEnemyGroup {
  return { type, count, interval };
}
