/* ============================================
   PARTICLE ENGINE — Visual effects system
   ============================================ */

import type { Particle } from "../types";

/** Particle emitter configuration */
export interface EmitterConfig {
  x: number;
  y: number;
  count: number;
  color: string;
  minSpeed?: number;
  maxSpeed?: number;
  minLife?: number;
  maxLife?: number;
  minSize?: number;
  maxSize?: number;
  gravity?: number;
  spread?: number; // angle spread in radians (default: 2π = full circle)
  angle?: number; // base direction in radians (default: 0 = right)
  fadeOut?: boolean;
}

/** Particle pool for memory efficiency */
export class ParticlePool {
  private particles: Particle[] = [];
  private gravity: number;

  constructor(gravity = 0.05) {
    this.gravity = gravity;
  }

  /**
   * Emit particles from a configuration
   */
  emit(config: EmitterConfig): void {
    const {
      x,
      y,
      count,
      color,
      minSpeed = 1,
      maxSpeed = 3,
      minLife = 15,
      maxLife = 30,
      minSize = 2,
      maxSize = 5,
      spread = Math.PI * 2,
      angle = 0,
    } = config;

    for (let i = 0; i < count; i++) {
      const a = angle - spread / 2 + Math.random() * spread;
      const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
      const life = Math.floor(minLife + Math.random() * (maxLife - minLife));
      const size = minSize + Math.random() * (maxSize - minSize);

      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life,
        maxLife: life,
        color,
        size,
      });
    }
  }

  /**
   * Update all particles (physics step)
   */
  update(): void {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += this.gravity;
      p.life--;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  /**
   * Get all active particles (for rendering)
   */
  getParticles(): ReadonlyArray<Particle> {
    return this.particles;
  }

  /**
   * Get particle count
   */
  get count(): number {
    return this.particles.length;
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles = [];
  }

  /**
   * Set gravity
   */
  setGravity(g: number): void {
    this.gravity = g;
  }

  /**
   * Get gravity
   */
  getGravity(): number {
    return this.gravity;
  }
}

/**
 * Preset emitter configs for common effects
 */
export const PARTICLE_PRESETS = {
  /** Tower placement sparkle */
  towerPlace: (x: number, y: number, color: string): EmitterConfig => ({
    x,
    y,
    count: 8,
    color,
    minSpeed: 1,
    maxSpeed: 2.5,
    minLife: 12,
    maxLife: 20,
    minSize: 2,
    maxSize: 4,
  }),

  /** Enemy death burst */
  enemyDeath: (x: number, y: number, color: string): EmitterConfig => ({
    x,
    y,
    count: 10,
    color,
    minSpeed: 1.5,
    maxSpeed: 3,
    minLife: 10,
    maxLife: 25,
    minSize: 2,
    maxSize: 5,
  }),

  /** Splash damage explosion */
  splashExplosion: (x: number, y: number, color: string): EmitterConfig => ({
    x,
    y,
    count: 15,
    color,
    minSpeed: 2,
    maxSpeed: 4,
    minLife: 8,
    maxLife: 18,
    minSize: 3,
    maxSize: 6,
  }),

  /** Tower upgrade glow */
  upgradeGlow: (x: number, y: number): EmitterConfig => ({
    x,
    y,
    count: 12,
    color: "#fbbf24",
    minSpeed: 0.5,
    maxSpeed: 2,
    minLife: 15,
    maxLife: 30,
    minSize: 1,
    maxSize: 4,
    gravity: -0.02,
  }),

  /** Directional fire jet */
  fireJet: (x: number, y: number, angle: number): EmitterConfig => ({
    x,
    y,
    count: 6,
    color: "#ef4444",
    minSpeed: 3,
    maxSpeed: 5,
    minLife: 5,
    maxLife: 12,
    minSize: 2,
    maxSize: 4,
    spread: Math.PI / 4,
    angle,
  }),

  /** Meteor impact */
  meteorImpact: (x: number, y: number): EmitterConfig => ({
    x,
    y,
    count: 25,
    color: "#f97316",
    minSpeed: 3,
    maxSpeed: 6,
    minLife: 15,
    maxLife: 35,
    minSize: 3,
    maxSize: 7,
  }),

  /** Freeze blast */
  freezeBlast: (x: number, y: number): EmitterConfig => ({
    x,
    y,
    count: 20,
    color: "#7dd3fc",
    minSpeed: 2,
    maxSpeed: 5,
    minLife: 20,
    maxLife: 40,
    minSize: 2,
    maxSize: 5,
    gravity: -0.01,
  }),
};

/**
 * Calculate the alpha value for a particle based on its remaining life
 */
export function getParticleAlpha(particle: Particle): number {
  if (particle.maxLife === 0) return 0;
  return Math.max(0, Math.min(1, particle.life / particle.maxLife));
}

/**
 * Calculate the render size for a particle based on its remaining life
 */
export function getParticleRenderSize(particle: Particle): number {
  return particle.size * getParticleAlpha(particle);
}
