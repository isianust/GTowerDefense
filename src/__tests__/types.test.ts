import { describe, it, expect } from "vitest";
import type {
  TowerType,
  EnemyType,
  Level,
  PlacedTower,
  ActiveEnemy,
  Projectile,
  Particle,
  GameProgress,
  Language,
} from "../types";

describe("Type Definitions", () => {
  it("should allow creating a valid TowerType object", () => {
    const tower: TowerType = {
      name: "Test Tower",
      icon: "🏗️",
      color: "#ff0000",
      cost: 100,
      range: 3,
      damage: 10,
      fireRate: 30,
      projectileSpeed: 5,
      projectileColor: "#ff0000",
      splash: 0,
      slow: 0,
      chain: 0,
      description: "A test tower",
      upgrades: [{ cost: 50, damage: 15 }],
    };
    expect(tower.name).toBe("Test Tower");
    expect(tower.cost).toBe(100);
  });

  it("should allow creating a valid EnemyType object", () => {
    const enemy: EnemyType = {
      name: "Test Enemy",
      hp: 100,
      speed: 1.0,
      reward: 10,
      color: "#00ff00",
      size: 0.5,
      damage: 1,
    };
    expect(enemy.name).toBe("Test Enemy");
    expect(enemy.hp).toBe(100);
  });

  it("should allow creating a boss EnemyType", () => {
    const boss: EnemyType = {
      name: "Test Boss",
      hp: 5000,
      speed: 0.5,
      reward: 200,
      color: "#ff0000",
      size: 1.0,
      damage: 10,
      boss: true,
    };
    expect(boss.boss).toBe(true);
  });

  it("should allow creating a valid Level object", () => {
    const level: Level = {
      name: "Test Level",
      cols: 20,
      rows: 12,
      startGold: 200,
      lives: 20,
      path: [
        { x: 0, y: 5 },
        { x: 1, y: 5 },
        { x: 2, y: 5 },
      ],
      waves: [{ enemies: [{ type: "goblin", count: 5, interval: 30 }] }],
    };
    expect(level.name).toBe("Test Level");
    expect(level.path).toHaveLength(3);
  });

  it("should allow creating a PlacedTower object", () => {
    const tower: PlacedTower = {
      type: "archer",
      gx: 5,
      gy: 3,
      level: 0,
      cooldown: 0,
      damage: 8,
      range: 3,
      fireRate: 30,
      splash: 0,
      slow: 0,
      slowDuration: 0,
      chain: 0,
      chainRange: 0,
      totalCost: 50,
    };
    expect(tower.type).toBe("archer");
    expect(tower.gx).toBe(5);
  });

  it("should allow creating an ActiveEnemy object", () => {
    const enemy: ActiveEnemy = {
      type: "goblin",
      x: 100,
      y: 200,
      hp: 30,
      maxHp: 30,
      speed: 1.5,
      baseSpeed: 1.5,
      reward: 5,
      color: "#4ade80",
      size: 0.5,
      damage: 1,
      boss: false,
      pathIndex: 0,
      slowTimer: 0,
      slowFactor: 0,
      dead: false,
    };
    expect(enemy.type).toBe("goblin");
    expect(enemy.dead).toBe(false);
  });

  it("should allow creating a Projectile object", () => {
    const enemy: ActiveEnemy = {
      type: "goblin",
      x: 100,
      y: 200,
      hp: 30,
      maxHp: 30,
      speed: 1.5,
      baseSpeed: 1.5,
      reward: 5,
      color: "#4ade80",
      size: 0.5,
      damage: 1,
      boss: false,
      pathIndex: 0,
      slowTimer: 0,
      slowFactor: 0,
      dead: false,
    };
    const tower: PlacedTower = {
      type: "archer",
      gx: 5,
      gy: 3,
      level: 0,
      cooldown: 0,
      damage: 8,
      range: 3,
      fireRate: 30,
      splash: 0,
      slow: 0,
      slowDuration: 0,
      chain: 0,
      chainRange: 0,
      totalCost: 50,
    };
    const projectile: Projectile = {
      x: 50,
      y: 50,
      target: enemy,
      speed: 6,
      damage: 8,
      color: "#22c55e",
      splash: 0,
      slow: 0,
      slowDuration: 0,
      chain: 0,
      chainRange: 0,
      tower: tower,
    };
    expect(projectile.target).toBe(enemy);
    expect(projectile.tower).toBe(tower);
  });

  it("should allow creating a Particle object", () => {
    const particle: Particle = {
      x: 100,
      y: 200,
      vx: 1.5,
      vy: -2.0,
      life: 20,
      maxLife: 30,
      color: "#ff0000",
      size: 3,
    };
    expect(particle.life).toBe(20);
  });

  it("should allow using GameProgress type", () => {
    const progress: GameProgress = {
      0: 0,
      1: 3,
      2: 2,
      3: 1,
    };
    expect(progress[0]).toBe(0);
    expect(progress[1]).toBe(3);
  });

  it("should validate Language type", () => {
    const en: Language = "en";
    const zhTW: Language = "zh-TW";
    expect(en).toBe("en");
    expect(zhTW).toBe("zh-TW");
  });
});
