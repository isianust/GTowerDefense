/* ============================================
   COMBAT ENGINE — Damage calculation & targeting
   ============================================ */

import type { ActiveEnemy, PlacedTower, TowerType } from "../types";

/** Damage result from applying damage to an enemy */
export interface DamageResult {
  killed: boolean;
  damageDealt: number;
  overkill: number;
  reward: number;
}

/** Targeting strategy */
export type TargetingStrategy = "first" | "last" | "strongest" | "weakest" | "closest";

/** Point-like object */
interface PointLike {
  x: number;
  y: number;
}

/**
 * Calculate distance between two points
 */
export function distance(a: PointLike, b: PointLike): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Calculate damage to apply, factoring in potential modifiers
 */
export function calculateDamage(
  baseDamage: number,
  multiplier = 1.0,
  isCritical = false,
  critMultiplier = 2.0,
): number {
  let dmg = baseDamage * multiplier;
  if (isCritical) {
    dmg *= critMultiplier;
  }
  return Math.max(0, dmg);
}

/**
 * Apply damage to an enemy and return result
 */
export function applyDamageToEnemy(enemy: ActiveEnemy, damage: number): DamageResult {
  const actualDamage = Math.min(enemy.hp, damage);
  enemy.hp -= damage;

  const killed = enemy.hp <= 0 && !enemy.dead;
  if (killed) {
    enemy.dead = true;
  }

  return {
    killed,
    damageDealt: actualDamage,
    overkill: Math.max(0, -enemy.hp),
    reward: killed ? enemy.reward : 0,
  };
}

/**
 * Apply slow effect to an enemy
 */
export function applySlow(enemy: ActiveEnemy, slowFactor: number, duration: number): void {
  // Only apply if stronger or refreshing
  if (slowFactor >= enemy.slowFactor || enemy.slowTimer <= 0) {
    enemy.slowFactor = slowFactor;
    enemy.slowTimer = duration;
  }
}

/**
 * Calculate the sell refund for a tower (60% of total investment)
 */
export function calculateSellRefund(tower: PlacedTower, refundRate = 0.6): number {
  return Math.floor(tower.totalCost * refundRate);
}

/**
 * Calculate tower DPS (damage per second at 60fps)
 */
export function calculateTowerDPS(damage: number, fireRate: number, fps = 60): number {
  if (fireRate <= 0) return 0;
  return (damage / fireRate) * fps;
}

/**
 * Calculate effective DPS including splash
 */
export function calculateEffectiveDPS(
  damage: number,
  fireRate: number,
  splash: number,
  avgEnemiesInSplash = 1,
  fps = 60,
): number {
  const baseDPS = calculateTowerDPS(damage, fireRate, fps);
  const splashDamage = splash > 0 ? damage * 0.5 * Math.max(0, avgEnemiesInSplash - 1) : 0;
  const splashDPS = fireRate > 0 ? (splashDamage / fireRate) * fps : 0;
  return baseDPS + splashDPS;
}

/**
 * Find enemies within range of a position
 */
export function findEnemiesInRange(
  position: PointLike,
  enemies: ActiveEnemy[],
  range: number,
): ActiveEnemy[] {
  return enemies.filter((e) => !e.dead && distance(position, e) <= range);
}

/**
 * Find enemies within splash range of a target
 */
export function findEnemiesInSplash(
  center: PointLike,
  enemies: ActiveEnemy[],
  splashRange: number,
  excludeTarget?: ActiveEnemy,
): ActiveEnemy[] {
  return enemies.filter(
    (e) => !e.dead && e !== excludeTarget && distance(center, e) <= splashRange,
  );
}

/**
 * Select the best target based on strategy
 */
export function selectTarget(
  position: PointLike,
  enemies: ActiveEnemy[],
  range: number,
  strategy: TargetingStrategy = "first",
): ActiveEnemy | null {
  const inRange = findEnemiesInRange(position, enemies, range);
  if (inRange.length === 0) return null;

  switch (strategy) {
    case "first":
      // Furthest along path (highest pathIndex)
      return inRange.reduce((best, e) => (e.pathIndex > best.pathIndex ? e : best));

    case "last":
      // Least along path (lowest pathIndex)
      return inRange.reduce((best, e) => (e.pathIndex < best.pathIndex ? e : best));

    case "strongest":
      // Highest current HP
      return inRange.reduce((best, e) => (e.hp > best.hp ? e : best));

    case "weakest":
      // Lowest current HP
      return inRange.reduce((best, e) => (e.hp < best.hp ? e : best));

    case "closest":
      // Closest distance
      return inRange.reduce((best, e) =>
        distance(position, e) < distance(position, best) ? e : best,
      );
  }
}

/**
 * Find chain lightning targets
 */
export function findChainTargets(
  origin: ActiveEnemy,
  enemies: ActiveEnemy[],
  chainCount: number,
  chainRange: number,
): ActiveEnemy[] {
  const targets: ActiveEnemy[] = [];
  let last = origin;
  const chained = new Set<ActiveEnemy>([origin]);

  for (let i = 0; i < chainCount; i++) {
    let best: ActiveEnemy | null = null;
    let bestDist = Infinity;

    for (const e of enemies) {
      if (e.dead || chained.has(e)) continue;
      const d = distance(last, e);
      if (d <= chainRange && d < bestDist) {
        bestDist = d;
        best = e;
      }
    }

    if (!best) break;
    targets.push(best);
    chained.add(best);
    last = best;
  }

  return targets;
}

/**
 * Calculate upgrade cost for a tower at a given level
 */
export function getUpgradeCost(towerType: TowerType, currentLevel: number): number | null {
  if (currentLevel >= towerType.upgrades.length) return null;
  return towerType.upgrades[currentLevel].cost;
}

/**
 * Check if a tower can be upgraded
 */
export function canUpgrade(towerType: TowerType, currentLevel: number, gold: number): boolean {
  const cost = getUpgradeCost(towerType, currentLevel);
  if (cost === null) return false;
  return gold >= cost;
}

/**
 * Calculate total investment for a tower at a given level
 */
export function calculateTotalInvestment(towerType: TowerType, level: number): number {
  let total = towerType.cost;
  for (let i = 0; i < level && i < towerType.upgrades.length; i++) {
    total += towerType.upgrades[i].cost;
  }
  return total;
}

/**
 * Calculate star rating based on remaining lives
 */
export function calculateStarRating(currentLives: number, maxLives: number): number {
  if (currentLives <= 0) return 0;
  if (currentLives >= maxLives) return 3;
  if (currentLives >= maxLives * 0.5) return 2;
  return 1;
}

/**
 * Calculate wave bonus gold
 */
export function calculateWaveBonus(waveIndex: number, baseBonus = 25, perWave = 5): number {
  return baseBonus + waveIndex * perWave;
}
