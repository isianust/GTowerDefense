/* ============================================
   LEVEL GENERATOR — Procedural level creation
   ============================================ */

import type { Level, GridCell, Wave, WaveEnemyGroup, TerrainFeature } from "../types";

/** Level generation parameters */
export interface LevelGenParams {
  cols?: number;
  rows?: number;
  difficulty: number; // 1-10 scale
  seed?: number;
  minPathLength?: number;
  maxPathLength?: number;
  waveCount?: number;
  terrainDensity?: number; // 0.0 - 1.0
}

/** Seeded random number generator */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Generate next random number (0-1)
   */
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xffffffff;
    return (this.seed >>> 0) / 0xffffffff;
  }

  /**
   * Random integer in range [min, max]
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Random float in range [min, max]
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Pick a random element from an array
   */
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  /**
   * Get current seed
   */
  getSeed(): number {
    return this.seed;
  }
}

/** Available enemy types by difficulty tier */
const ENEMY_TIERS: Record<number, string[]> = {
  1: ["goblin"],
  2: ["goblin", "orc"],
  3: ["goblin", "orc", "wolf"],
  4: ["orc", "wolf", "darkKnight"],
  5: ["wolf", "darkKnight", "troll"],
  6: ["darkKnight", "troll", "demon"],
  7: ["troll", "demon"],
  8: ["demon", "dragon"],
  9: ["demon", "dragon", "lich"],
  10: ["dragon", "lich", "titan", "phoenix"],
};

/**
 * Generate a random path on a grid
 */
export function generatePath(
  cols: number,
  rows: number,
  rng: SeededRandom,
  minLength?: number,
  maxLength?: number,
): GridCell[] {
  const effectiveMinLength = minLength ?? Math.floor((cols + rows) * 0.8);
  const effectiveMaxLength = maxLength ?? Math.floor((cols + rows) * 2);

  // Start from a random edge cell on the left
  const startY = rng.nextInt(1, rows - 2);
  const path: GridCell[] = [{ x: 0, y: startY }];
  const visited = new Set<string>();
  visited.add(`0,${startY}`);

  let x = 0;
  let y = startY;

  // Generate path using random walk biased towards the right
  while (x < cols - 1 && path.length < effectiveMaxLength) {
    const moves: GridCell[] = [];

    // Bias towards right
    if (x + 1 < cols && !visited.has(`${x + 1},${y}`)) {
      moves.push({ x: x + 1, y });
      moves.push({ x: x + 1, y }); // double weight for right
    }

    // Up
    if (y - 1 > 0 && !visited.has(`${x},${y - 1}`)) {
      moves.push({ x, y: y - 1 });
    }

    // Down
    if (y + 1 < rows - 1 && !visited.has(`${x},${y + 1}`)) {
      moves.push({ x, y: y + 1 });
    }

    if (moves.length === 0) break;

    const next = rng.pick(moves);
    path.push(next);
    visited.add(`${next.x},${next.y}`);
    x = next.x;
    y = next.y;
  }

  // Ensure we reach the right edge
  if (x < cols - 1) {
    while (x < cols - 1) {
      x++;
      path.push({ x, y });
    }
  }

  // Ensure minimum length by adding zigzags if needed
  if (path.length < effectiveMinLength) {
    return path; // Accept shorter paths rather than creating invalid ones
  }

  return path;
}

/**
 * Generate waves based on difficulty
 */
export function generateWaves(
  difficulty: number,
  waveCount: number,
  rng: SeededRandom,
): Wave[] {
  const waves: Wave[] = [];
  const clampedDifficulty = Math.max(1, Math.min(10, difficulty));
  const availableEnemies = ENEMY_TIERS[clampedDifficulty] || ENEMY_TIERS[1];

  for (let w = 0; w < waveCount; w++) {
    const groups: WaveEnemyGroup[] = [];
    // Each wave gets progressively harder
    const waveDifficultyScale = 1 + (w / waveCount) * 0.5;
    const groupCount = rng.nextInt(1, Math.min(3, availableEnemies.length));

    for (let g = 0; g < groupCount; g++) {
      const enemyType = rng.pick(availableEnemies);
      const baseCount = Math.ceil(3 + clampedDifficulty * 0.5 + w * 0.3);
      const count = Math.max(1, Math.floor(baseCount * waveDifficultyScale));
      const interval = Math.max(10, 40 - clampedDifficulty * 2);

      groups.push({ type: enemyType, count, interval });
    }

    // Add boss in final wave for higher difficulties
    if (w === waveCount - 1 && clampedDifficulty >= 5) {
      const bossTypes = availableEnemies.filter((t) =>
        ["dragon", "lich", "titan", "phoenix"].includes(t),
      );
      if (bossTypes.length > 0) {
        groups.push({
          type: rng.pick(bossTypes),
          count: 1,
          interval: 60,
        });
      }
    }

    waves.push({ enemies: groups });
  }

  return waves;
}

/**
 * Generate terrain features for a level
 */
export function generateTerrain(
  cols: number,
  rows: number,
  path: GridCell[],
  density: number,
  rng: SeededRandom,
): TerrainFeature[] {
  const terrain: TerrainFeature[] = [];
  const pathSet = new Set(path.map((p) => `${p.x},${p.y}`));
  const clampedDensity = Math.max(0, Math.min(1, density));

  const terrainTypes: Array<"tree" | "rock" | "mountain"> = ["tree", "rock", "mountain"];

  const featureCount = Math.floor(cols * rows * clampedDensity * 0.05);

  for (let i = 0; i < featureCount; i++) {
    const type = rng.pick(terrainTypes);
    const x = rng.nextInt(0, cols - 1);
    const y = rng.nextInt(0, rows - 1);

    // Don't place on path
    if (pathSet.has(`${x},${y}`)) continue;

    // Create small cluster
    const cells: GridCell[] = [{ x, y }];
    if (rng.next() > 0.5 && x + 1 < cols && !pathSet.has(`${x + 1},${y}`)) {
      cells.push({ x: x + 1, y });
    }

    terrain.push({ type, cells });
  }

  return terrain;
}

/**
 * Generate a complete level
 */
export function generateLevel(params: LevelGenParams): Level {
  const {
    cols = 20,
    rows = 12,
    difficulty,
    seed = Date.now(),
    minPathLength,
    maxPathLength,
    waveCount = Math.max(3, Math.min(8, Math.floor(difficulty * 0.8))),
    terrainDensity = 0.3,
  } = params;

  const rng = new SeededRandom(seed);
  const clampedDifficulty = Math.max(1, Math.min(10, difficulty));

  // Generate path
  const path = generatePath(cols, rows, rng, minPathLength, maxPathLength);

  // Generate waves
  const waves = generateWaves(clampedDifficulty, waveCount, rng);

  // Generate terrain
  const terrain = generateTerrain(cols, rows, path, terrainDensity, rng);

  // Calculate starting resources based on difficulty
  const startGold = Math.max(100, 300 - clampedDifficulty * 15);
  const lives = Math.max(5, 25 - clampedDifficulty * 2);

  // Generate level name
  const namePrefix = [
    "Lost",
    "Ancient",
    "Cursed",
    "Forgotten",
    "Shadow",
    "Crystal",
    "Storm",
    "Fire",
    "Ice",
    "Dark",
  ];
  const nameSuffix = [
    "Valley",
    "Pass",
    "Keep",
    "Ruins",
    "Citadel",
    "Bridge",
    "Gate",
    "Tower",
    "Depths",
    "Crossing",
  ];
  const name = `${rng.pick(namePrefix)} ${rng.pick(nameSuffix)}`;

  return {
    name,
    cols,
    rows,
    startGold,
    lives,
    path,
    waves,
    terrain: terrain.length > 0 ? terrain : undefined,
  };
}

/**
 * Validate that a generated level is playable
 */
export function validateLevel(level: Level): string[] {
  const errors: string[] = [];

  if (level.path.length < 2) {
    errors.push("Path must have at least 2 cells");
  }

  if (level.waves.length === 0) {
    errors.push("Level must have at least 1 wave");
  }

  if (level.startGold <= 0) {
    errors.push("Starting gold must be positive");
  }

  if (level.lives <= 0) {
    errors.push("Lives must be positive");
  }

  // Check path connectivity
  for (let i = 1; i < level.path.length; i++) {
    const prev = level.path[i - 1];
    const curr = level.path[i];
    const dx = Math.abs(curr.x - prev.x);
    const dy = Math.abs(curr.y - prev.y);
    if (dx + dy !== 1) {
      errors.push(`Path is not connected at index ${i} (${prev.x},${prev.y}) -> (${curr.x},${curr.y})`);
    }
  }

  // Check path bounds
  for (const cell of level.path) {
    if (cell.x < 0 || cell.x >= level.cols || cell.y < 0 || cell.y >= level.rows) {
      errors.push(`Path cell (${cell.x},${cell.y}) is out of bounds`);
    }
  }

  // Check terrain doesn't overlap with path
  if (level.terrain) {
    const pathSet = new Set(level.path.map((p) => `${p.x},${p.y}`));
    for (const feature of level.terrain) {
      for (const cell of feature.cells) {
        if (pathSet.has(`${cell.x},${cell.y}`)) {
          errors.push(`Terrain feature overlaps with path at (${cell.x},${cell.y})`);
        }
      }
    }
  }

  return errors;
}

/**
 * Get the difficulty tier enemies for a given difficulty
 */
export function getEnemyTier(difficulty: number): string[] {
  const clamped = Math.max(1, Math.min(10, Math.round(difficulty)));
  return ENEMY_TIERS[clamped] || ENEMY_TIERS[1];
}
