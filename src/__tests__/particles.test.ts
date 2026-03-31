import { describe, it, expect, beforeEach } from "vitest";
import {
  ParticlePool,
  PARTICLE_PRESETS,
  getParticleAlpha,
  getParticleRenderSize,
} from "../engine/particles";
import type { Particle } from "../types";

describe("Particle Engine", () => {
  let pool: ParticlePool;

  beforeEach(() => {
    pool = new ParticlePool();
  });

  // ---- ParticlePool ----
  describe("ParticlePool", () => {
    it("should start with zero particles", () => {
      expect(pool.count).toBe(0);
      expect(pool.getParticles()).toHaveLength(0);
    });

    it("should emit particles", () => {
      pool.emit({ x: 100, y: 100, count: 10, color: "#ff0000" });
      expect(pool.count).toBe(10);
    });

    it("should emit particles at specified position", () => {
      pool.emit({ x: 50, y: 75, count: 5, color: "#00ff00" });
      const particles = pool.getParticles();
      for (const p of particles) {
        expect(p.x).toBe(50);
        expect(p.y).toBe(75);
        expect(p.color).toBe("#00ff00");
      }
    });

    it("should emit with correct defaults", () => {
      pool.emit({ x: 0, y: 0, count: 1, color: "#fff" });
      const p = pool.getParticles()[0];
      expect(p.life).toBeGreaterThan(0);
      expect(p.maxLife).toBeGreaterThan(0);
      expect(p.size).toBeGreaterThan(0);
    });

    it("should respect custom speed range", () => {
      pool.emit({ x: 0, y: 0, count: 100, color: "#fff", minSpeed: 5, maxSpeed: 5 });
      for (const p of pool.getParticles()) {
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        expect(speed).toBeCloseTo(5, 0);
      }
    });

    it("should respect custom life range", () => {
      pool.emit({ x: 0, y: 0, count: 50, color: "#fff", minLife: 20, maxLife: 20 });
      for (const p of pool.getParticles()) {
        expect(p.life).toBe(20);
        expect(p.maxLife).toBe(20);
      }
    });

    it("should respect custom size range", () => {
      pool.emit({ x: 0, y: 0, count: 50, color: "#fff", minSize: 3, maxSize: 3 });
      for (const p of pool.getParticles()) {
        expect(p.size).toBeCloseTo(3, 1);
      }
    });

    it("should emit with directional spread", () => {
      pool.emit({
        x: 0,
        y: 0,
        count: 100,
        color: "#fff",
        angle: 0, // right
        spread: 0, // no spread
        minSpeed: 5,
        maxSpeed: 5,
      });
      for (const p of pool.getParticles()) {
        expect(p.vx).toBeCloseTo(5, 0);
        expect(p.vy).toBeCloseTo(0, 0);
      }
    });
  });

  // ---- Update / Physics ----
  describe("Update (Physics)", () => {
    it("should move particles by velocity", () => {
      pool.emit({ x: 100, y: 100, count: 1, color: "#fff", minSpeed: 0, maxSpeed: 0, minLife: 50, maxLife: 50 });
      const p = pool.getParticles()[0];
      const oldX = p.x;
      const oldY = p.y;

      // Manually set velocity
      (p as Particle).vx = 2;
      (p as Particle).vy = 3;

      pool.update();

      expect(pool.getParticles()[0].x).toBeCloseTo(oldX + 2, 1);
      expect(pool.getParticles()[0].y).toBeCloseTo(oldY + 3 + pool.getGravity(), 1);
    });

    it("should apply gravity", () => {
      pool.setGravity(0.1);
      pool.emit({ x: 0, y: 0, count: 1, color: "#fff", minSpeed: 0, maxSpeed: 0, minLife: 100, maxLife: 100 });

      const p = pool.getParticles()[0];
      (p as Particle).vx = 0;
      (p as Particle).vy = 0;

      pool.update();
      expect(pool.getParticles()[0].vy).toBeCloseTo(0.1, 5);

      pool.update();
      expect(pool.getParticles()[0].vy).toBeCloseTo(0.2, 5);
    });

    it("should decrease life each frame", () => {
      pool.emit({ x: 0, y: 0, count: 1, color: "#fff", minLife: 10, maxLife: 10 });
      const startLife = pool.getParticles()[0].life;
      pool.update();
      expect(pool.getParticles()[0].life).toBe(startLife - 1);
    });

    it("should remove dead particles", () => {
      pool.emit({ x: 0, y: 0, count: 1, color: "#fff", minLife: 2, maxLife: 2 });
      expect(pool.count).toBe(1);

      pool.update(); // life = 1
      expect(pool.count).toBe(1);

      pool.update(); // life = 0
      expect(pool.count).toBe(0);
    });

    it("should handle multiple particles dying at different times", () => {
      pool.emit({ x: 0, y: 0, count: 1, color: "#fff", minLife: 1, maxLife: 1 });
      pool.emit({ x: 0, y: 0, count: 1, color: "#fff", minLife: 3, maxLife: 3 });
      expect(pool.count).toBe(2);

      pool.update(); // first dies
      expect(pool.count).toBe(1);

      pool.update();
      expect(pool.count).toBe(1);

      pool.update(); // second dies
      expect(pool.count).toBe(0);
    });
  });

  // ---- Clear ----
  describe("clear", () => {
    it("should remove all particles", () => {
      pool.emit({ x: 0, y: 0, count: 100, color: "#fff" });
      expect(pool.count).toBe(100);
      pool.clear();
      expect(pool.count).toBe(0);
    });
  });

  // ---- Gravity ----
  describe("Gravity", () => {
    it("should default to 0.05", () => {
      expect(pool.getGravity()).toBe(0.05);
    });

    it("should be settable", () => {
      pool.setGravity(0.1);
      expect(pool.getGravity()).toBe(0.1);
    });

    it("should accept custom gravity in constructor", () => {
      const customPool = new ParticlePool(0.2);
      expect(customPool.getGravity()).toBe(0.2);
    });

    it("should support zero gravity", () => {
      const zeroG = new ParticlePool(0);
      zeroG.emit({ x: 0, y: 0, count: 1, color: "#fff", minSpeed: 0, maxSpeed: 0, minLife: 10, maxLife: 10 });
      const p = zeroG.getParticles()[0];
      (p as Particle).vy = 0;
      zeroG.update();
      expect(zeroG.getParticles()[0].vy).toBe(0);
    });
  });

  // ---- Particle Presets ----
  describe("Particle Presets", () => {
    it("towerPlace should create valid config", () => {
      const config = PARTICLE_PRESETS.towerPlace(100, 200, "#22c55e");
      expect(config.x).toBe(100);
      expect(config.y).toBe(200);
      expect(config.count).toBe(8);
      expect(config.color).toBe("#22c55e");
    });

    it("enemyDeath should create valid config", () => {
      const config = PARTICLE_PRESETS.enemyDeath(50, 50, "#ff0000");
      expect(config.count).toBe(10);
      expect(config.color).toBe("#ff0000");
    });

    it("splashExplosion should have more particles", () => {
      const config = PARTICLE_PRESETS.splashExplosion(0, 0, "#fff");
      expect(config.count).toBe(15);
    });

    it("upgradeGlow should have negative gravity", () => {
      const config = PARTICLE_PRESETS.upgradeGlow(0, 0);
      expect(config.gravity).toBeLessThan(0);
    });

    it("fireJet should have directional spread", () => {
      const config = PARTICLE_PRESETS.fireJet(0, 0, Math.PI / 2);
      expect(config.angle).toBe(Math.PI / 2);
      expect(config.spread).toBe(Math.PI / 4);
    });

    it("meteorImpact should have many particles", () => {
      const config = PARTICLE_PRESETS.meteorImpact(0, 0);
      expect(config.count).toBe(25);
    });

    it("freezeBlast should have negative gravity", () => {
      const config = PARTICLE_PRESETS.freezeBlast(0, 0);
      expect(config.gravity).toBeLessThan(0);
    });

    it("all presets should emit without errors", () => {
      pool.emit(PARTICLE_PRESETS.towerPlace(0, 0, "#fff"));
      pool.emit(PARTICLE_PRESETS.enemyDeath(0, 0, "#fff"));
      pool.emit(PARTICLE_PRESETS.splashExplosion(0, 0, "#fff"));
      pool.emit(PARTICLE_PRESETS.upgradeGlow(0, 0));
      pool.emit(PARTICLE_PRESETS.fireJet(0, 0, 0));
      pool.emit(PARTICLE_PRESETS.meteorImpact(0, 0));
      pool.emit(PARTICLE_PRESETS.freezeBlast(0, 0));

      const totalExpected = 8 + 10 + 15 + 12 + 6 + 25 + 20;
      expect(pool.count).toBe(totalExpected);
    });
  });

  // ---- Helper Functions ----
  describe("Helper Functions", () => {
    it("getParticleAlpha should return ratio of life/maxLife", () => {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, life: 15, maxLife: 30, color: "#fff", size: 2 };
      expect(getParticleAlpha(p)).toBeCloseTo(0.5, 5);
    });

    it("getParticleAlpha should return 1 for full life", () => {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, life: 30, maxLife: 30, color: "#fff", size: 2 };
      expect(getParticleAlpha(p)).toBe(1);
    });

    it("getParticleAlpha should return 0 for zero life", () => {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 30, color: "#fff", size: 2 };
      expect(getParticleAlpha(p)).toBe(0);
    });

    it("getParticleAlpha should handle zero maxLife", () => {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, life: 5, maxLife: 0, color: "#fff", size: 2 };
      expect(getParticleAlpha(p)).toBe(0);
    });

    it("getParticleRenderSize should scale with alpha", () => {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, life: 15, maxLife: 30, color: "#fff", size: 4 };
      expect(getParticleRenderSize(p)).toBeCloseTo(2, 1);
    });

    it("getParticleRenderSize should be full at full life", () => {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, life: 30, maxLife: 30, color: "#fff", size: 4 };
      expect(getParticleRenderSize(p)).toBe(4);
    });
  });

  // ---- Multiple emits ----
  describe("Multiple Emits", () => {
    it("should accumulate particles across emits", () => {
      pool.emit({ x: 0, y: 0, count: 5, color: "#fff" });
      pool.emit({ x: 0, y: 0, count: 3, color: "#000" });
      expect(pool.count).toBe(8);
    });

    it("should handle large counts", () => {
      pool.emit({ x: 0, y: 0, count: 1000, color: "#fff" });
      expect(pool.count).toBe(1000);
    });

    it("should handle zero count", () => {
      pool.emit({ x: 0, y: 0, count: 0, color: "#fff" });
      expect(pool.count).toBe(0);
    });
  });
});
