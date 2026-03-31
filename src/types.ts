/* ============================================
   SHARED TYPE DEFINITIONS
   ============================================ */

/** Upgrade tier for a tower */
export interface TowerUpgrade {
  cost: number;
  damage?: number;
  range?: number;
  fireRate?: number;
  splash?: number;
  slow?: number;
  slowDuration?: number;
  chain?: number;
  chainRange?: number;
}

/** Tower type definition */
export interface TowerType {
  name: string;
  icon: string;
  color: string;
  cost: number;
  range: number;
  damage: number;
  fireRate: number;
  projectileSpeed: number;
  projectileColor: string;
  splash: number;
  slow: number;
  slowDuration?: number;
  chain: number;
  chainRange?: number;
  description: string;
  upgrades: TowerUpgrade[];
}

/** Enemy type definition */
export interface EnemyType {
  name: string;
  hp: number;
  speed: number;
  reward: number;
  color: string;
  size: number;
  damage: number;
  boss?: boolean;
}

/** Grid coordinate */
export interface GridCell {
  x: number;
  y: number;
}

/** Wave enemy group definition */
export interface WaveEnemyGroup {
  type: string;
  count: number;
  interval: number;
}

/** Wave definition */
export interface Wave {
  enemies: WaveEnemyGroup[];
}

/** Terrain feature */
export interface TerrainFeature {
  type: "river" | "bridge" | "mountain" | "tree" | "rock";
  cells: GridCell[];
}

/** Level definition */
export interface Level {
  name: string;
  cols: number;
  rows: number;
  startGold: number;
  lives: number;
  path: GridCell[];
  waves: Wave[];
  terrain?: TerrainFeature[];
  bg?: string;
}

/** Placed tower instance */
export interface PlacedTower {
  type: string;
  gx: number;
  gy: number;
  level: number;
  cooldown: number;
  damage: number;
  range: number;
  fireRate: number;
  splash: number;
  slow: number;
  slowDuration: number;
  chain: number;
  chainRange: number;
  totalCost: number;
}

/** Active enemy instance */
export interface ActiveEnemy {
  type: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  baseSpeed: number;
  reward: number;
  color: string;
  size: number;
  damage: number;
  boss: boolean;
  pathIndex: number;
  slowTimer: number;
  slowFactor: number;
  dead: boolean;
}

/** Projectile instance */
export interface Projectile {
  x: number;
  y: number;
  target: ActiveEnemy;
  speed: number;
  damage: number;
  color: string;
  splash: number;
  slow: number;
  slowDuration: number;
  chain: number;
  chainRange: number;
  tower: PlacedTower;
}

/** Particle instance */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

/** Wave queue entry */
export interface WaveQueueEntry {
  type: string;
  delay: number;
}

/** Grass tile decoration */
export interface GrassTile {
  x: number;
  y: number;
  shade: number;
  deco: string | null;
  decoX: number;
  decoY: number;
}

/** Game progress (level index → star count) */
export type GameProgress = Record<number, number>;

/** Supported languages */
export type Language = "en" | "zh-TW";

/** Grid cell content */
export type GridCellContent = null | "path" | "terrain" | PlacedTower;
