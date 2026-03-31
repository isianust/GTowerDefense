/* ============================================
   BOSS MECHANICS — Multi-phase boss fights
   ============================================ */

/** Boss phase definition */
export interface BossPhase {
  name: string;
  nameZh: string;
  hpThreshold: number; // HP percentage to trigger (1.0 = 100%, 0.5 = 50%)
  speedMultiplier: number;
  damageMultiplier: number;
  abilities: BossAbilityType[];
  color: string;
  icon: string;
}

/** Boss ability types */
export type BossAbilityType = "enrage" | "summon" | "shield" | "heal" | "teleport" | "aoe";

/** Boss ability definition */
export interface BossAbilityDef {
  type: BossAbilityType;
  name: string;
  nameZh: string;
  cooldown: number; // frames
  duration?: number; // frames
  value?: number; // generic value (heal amount, shield HP, etc.)
  description: string;
  descriptionZh: string;
}

/** Boss fight definition */
export interface BossFightDef {
  id: string;
  name: string;
  nameZh: string;
  baseHp: number;
  baseSpeed: number;
  baseDamage: number;
  reward: number;
  phases: BossPhase[];
  size: number;
  color: string;
}

/** Active boss ability state */
export interface ActiveBossAbility {
  type: BossAbilityType;
  cooldownRemaining: number;
  active: boolean;
  durationRemaining: number;
}

/** Boss ability definitions */
export const BOSS_ABILITIES: Record<BossAbilityType, BossAbilityDef> = {
  enrage: {
    type: "enrage",
    name: "Enrage",
    nameZh: "狂暴",
    cooldown: 600,
    duration: 180,
    value: 1.5, // speed multiplier
    description: "Boss moves 50% faster",
    descriptionZh: "首領移動速度提升50%",
  },
  summon: {
    type: "summon",
    name: "Summon Minions",
    nameZh: "召喚僕從",
    cooldown: 900,
    value: 3, // number of minions
    description: "Summons goblin minions",
    descriptionZh: "召喚哥布林僕從",
  },
  shield: {
    type: "shield",
    name: "Energy Shield",
    nameZh: "能量護盾",
    cooldown: 1200,
    duration: 300,
    value: 500, // shield HP
    description: "Absorbs damage with a shield",
    descriptionZh: "用護盾吸收傷害",
  },
  heal: {
    type: "heal",
    name: "Regeneration",
    nameZh: "再生",
    cooldown: 1500,
    value: 0.1, // heal 10% of max HP
    description: "Heals a portion of max HP",
    descriptionZh: "回復最大生命值的一部分",
  },
  teleport: {
    type: "teleport",
    name: "Teleport",
    nameZh: "瞬移",
    cooldown: 600,
    value: 3, // path cells to skip
    description: "Teleports forward on the path",
    descriptionZh: "在路徑上向前瞬移",
  },
  aoe: {
    type: "aoe",
    name: "Shockwave",
    nameZh: "衝擊波",
    cooldown: 900,
    duration: 60,
    value: 2.0, // range in grid cells
    description: "Damages nearby towers",
    descriptionZh: "對附近的防禦塔造成傷害",
  },
};

/** Predefined boss fight configurations */
export const BOSS_FIGHTS: Record<string, BossFightDef> = {
  dragon: {
    id: "dragon",
    name: "Ancient Dragon",
    nameZh: "遠古龍",
    baseHp: 2000,
    baseSpeed: 0.5,
    baseDamage: 10,
    reward: 150,
    size: 1.0,
    color: "#b91c1c",
    phases: [
      {
        name: "Awakened",
        nameZh: "覺醒",
        hpThreshold: 1.0,
        speedMultiplier: 1.0,
        damageMultiplier: 1.0,
        abilities: ["enrage"],
        color: "#b91c1c",
        icon: "🐉",
      },
      {
        name: "Fury",
        nameZh: "狂怒",
        hpThreshold: 0.5,
        speedMultiplier: 1.3,
        damageMultiplier: 1.5,
        abilities: ["enrage", "aoe"],
        color: "#dc2626",
        icon: "🔥",
      },
      {
        name: "Desperation",
        nameZh: "絕望",
        hpThreshold: 0.2,
        speedMultiplier: 1.6,
        damageMultiplier: 2.0,
        abilities: ["enrage", "aoe", "summon"],
        color: "#f97316",
        icon: "💀",
      },
    ],
  },
  lich: {
    id: "lich",
    name: "Lich King",
    nameZh: "巫妖王",
    baseHp: 3000,
    baseSpeed: 0.7,
    baseDamage: 8,
    reward: 200,
    size: 0.9,
    color: "#7c3aed",
    phases: [
      {
        name: "Risen",
        nameZh: "復甦",
        hpThreshold: 1.0,
        speedMultiplier: 1.0,
        damageMultiplier: 1.0,
        abilities: ["summon"],
        color: "#7c3aed",
        icon: "💀",
      },
      {
        name: "Necromancy",
        nameZh: "死靈術",
        hpThreshold: 0.6,
        speedMultiplier: 1.1,
        damageMultiplier: 1.3,
        abilities: ["summon", "heal"],
        color: "#6d28d9",
        icon: "☠️",
      },
      {
        name: "Undying",
        nameZh: "不朽",
        hpThreshold: 0.25,
        speedMultiplier: 1.2,
        damageMultiplier: 1.8,
        abilities: ["summon", "heal", "shield"],
        color: "#4c1d95",
        icon: "👻",
      },
    ],
  },
  titan: {
    id: "titan",
    name: "World Titan",
    nameZh: "世界泰坦",
    baseHp: 5000,
    baseSpeed: 0.4,
    baseDamage: 15,
    reward: 300,
    size: 1.1,
    color: "#d97706",
    phases: [
      {
        name: "Stonemarch",
        nameZh: "石行",
        hpThreshold: 1.0,
        speedMultiplier: 1.0,
        damageMultiplier: 1.0,
        abilities: ["shield"],
        color: "#d97706",
        icon: "🗿",
      },
      {
        name: "Earthquake",
        nameZh: "地震",
        hpThreshold: 0.5,
        speedMultiplier: 1.2,
        damageMultiplier: 1.5,
        abilities: ["shield", "aoe"],
        color: "#b45309",
        icon: "⛰️",
      },
      {
        name: "Worldbreaker",
        nameZh: "碎世者",
        hpThreshold: 0.15,
        speedMultiplier: 1.5,
        damageMultiplier: 2.5,
        abilities: ["shield", "aoe", "enrage"],
        color: "#92400e",
        icon: "🌋",
      },
    ],
  },
  phoenix: {
    id: "phoenix",
    name: "Eternal Phoenix",
    nameZh: "永恆鳳凰",
    baseHp: 4000,
    baseSpeed: 0.8,
    baseDamage: 12,
    reward: 250,
    size: 0.95,
    color: "#f97316",
    phases: [
      {
        name: "Blazing",
        nameZh: "熾烈",
        hpThreshold: 1.0,
        speedMultiplier: 1.0,
        damageMultiplier: 1.0,
        abilities: ["aoe"],
        color: "#f97316",
        icon: "🔥",
      },
      {
        name: "Inferno",
        nameZh: "煉獄",
        hpThreshold: 0.4,
        speedMultiplier: 1.4,
        damageMultiplier: 1.6,
        abilities: ["aoe", "heal"],
        color: "#ea580c",
        icon: "🌋",
      },
      {
        name: "Rebirth",
        nameZh: "重生",
        hpThreshold: 0.1,
        speedMultiplier: 2.0,
        damageMultiplier: 2.0,
        abilities: ["aoe", "heal", "teleport"],
        color: "#c2410c",
        icon: "🦅",
      },
    ],
  },
};

/**
 * BossFightManager — Manages multi-phase boss encounters
 */
export class BossFightManager {
  private bossDef: BossFightDef;
  private currentPhaseIndex = 0;
  private abilityStates: Map<BossAbilityType, ActiveBossAbility> = new Map();
  private shieldHp = 0;
  private maxHp: number;

  constructor(bossId: string) {
    const def = BOSS_FIGHTS[bossId];
    if (!def) {
      throw new Error(`Unknown boss: ${bossId}`);
    }
    this.bossDef = def;
    this.maxHp = def.baseHp;
    this.initPhase(0);
  }

  /**
   * Get current phase based on HP percentage
   */
  getCurrentPhase(currentHp: number): BossPhase {
    const hpPercent = currentHp / this.maxHp;
    let phaseIdx = 0;

    // Find the highest phase index whose threshold we've reached
    for (let i = 0; i < this.bossDef.phases.length; i++) {
      if (hpPercent <= this.bossDef.phases[i].hpThreshold) {
        phaseIdx = i;
      }
    }

    if (phaseIdx !== this.currentPhaseIndex) {
      this.transitionToPhase(phaseIdx);
    }

    return this.bossDef.phases[this.currentPhaseIndex];
  }

  /**
   * Get phase index
   */
  getPhaseIndex(): number {
    return this.currentPhaseIndex;
  }

  /**
   * Get total number of phases
   */
  getPhaseCount(): number {
    return this.bossDef.phases.length;
  }

  /**
   * Update boss abilities (call every frame)
   * @returns list of abilities that should trigger this frame
   */
  updateAbilities(): BossAbilityType[] {
    const triggered: BossAbilityType[] = [];

    for (const [type, state] of this.abilityStates) {
      if (state.active && state.durationRemaining > 0) {
        state.durationRemaining--;
        if (state.durationRemaining <= 0) {
          state.active = false;
        }
      }

      if (state.cooldownRemaining > 0) {
        state.cooldownRemaining--;
      } else {
        // Try to activate
        const def = BOSS_ABILITIES[type];
        state.cooldownRemaining = def.cooldown;
        if (def.duration) {
          state.active = true;
          state.durationRemaining = def.duration;
        }
        triggered.push(type);
      }
    }

    return triggered;
  }

  /**
   * Apply damage to boss, considering shield
   * @returns actual damage dealt (after shield absorption)
   */
  applyDamage(damage: number): number {
    if (this.shieldHp > 0) {
      const absorbed = Math.min(this.shieldHp, damage);
      this.shieldHp -= absorbed;
      return damage - absorbed;
    }
    return damage;
  }

  /**
   * Activate shield with given HP
   */
  activateShield(hp: number): void {
    this.shieldHp = hp;
  }

  /**
   * Get current shield HP
   */
  getShieldHp(): number {
    return this.shieldHp;
  }

  /**
   * Check if shield is active
   */
  hasShield(): boolean {
    return this.shieldHp > 0;
  }

  /**
   * Calculate heal amount based on boss max HP
   */
  calculateHealAmount(): number {
    const healDef = BOSS_ABILITIES.heal;
    return Math.floor(this.maxHp * (healDef.value ?? 0.1));
  }

  /**
   * Get speed multiplier for current phase
   */
  getSpeedMultiplier(): number {
    const phase = this.bossDef.phases[this.currentPhaseIndex];
    // Check if enrage is active for additional speed
    const enrageState = this.abilityStates.get("enrage");
    const enrageMult = enrageState?.active ? (BOSS_ABILITIES.enrage.value ?? 1.5) : 1.0;
    return phase.speedMultiplier * enrageMult;
  }

  /**
   * Get damage multiplier for current phase
   */
  getDamageMultiplier(): number {
    return this.bossDef.phases[this.currentPhaseIndex].damageMultiplier;
  }

  /**
   * Get the boss definition
   */
  getDefinition(): BossFightDef {
    return this.bossDef;
  }

  /**
   * Check if a specific ability is currently active
   */
  isAbilityActive(type: BossAbilityType): boolean {
    return this.abilityStates.get(type)?.active ?? false;
  }

  /**
   * Get ability state
   */
  getAbilityState(type: BossAbilityType): ActiveBossAbility | undefined {
    const state = this.abilityStates.get(type);
    return state ? { ...state } : undefined;
  }

  /**
   * Get teleport distance
   */
  getTeleportDistance(): number {
    return BOSS_ABILITIES.teleport.value ?? 3;
  }

  /**
   * Get summon count
   */
  getSummonCount(): number {
    return BOSS_ABILITIES.summon.value ?? 3;
  }

  /**
   * Reset boss fight state
   */
  reset(): void {
    this.currentPhaseIndex = 0;
    this.shieldHp = 0;
    this.initPhase(0);
  }

  // ---- Private ----

  private transitionToPhase(phaseIndex: number): void {
    this.currentPhaseIndex = phaseIndex;
    this.initPhase(phaseIndex);
  }

  private initPhase(phaseIndex: number): void {
    const phase = this.bossDef.phases[phaseIndex];
    this.abilityStates.clear();

    for (const abilityType of phase.abilities) {
      const def = BOSS_ABILITIES[abilityType];
      this.abilityStates.set(abilityType, {
        type: abilityType,
        cooldownRemaining: Math.floor(def.cooldown * 0.5), // Start with half cooldown
        active: false,
        durationRemaining: 0,
      });
    }
  }
}

/**
 * Get boss phase for a given HP percentage
 */
export function getBossPhaseForHp(bossDef: BossFightDef, hpPercent: number): BossPhase {
  let result = bossDef.phases[0];
  for (let i = 0; i < bossDef.phases.length; i++) {
    if (hpPercent <= bossDef.phases[i].hpThreshold) {
      result = bossDef.phases[i];
    }
  }
  return result;
}

/**
 * Check if a boss has a specific ability in any phase
 */
export function bossHasAbility(bossDef: BossFightDef, ability: BossAbilityType): boolean {
  return bossDef.phases.some((phase) => phase.abilities.includes(ability));
}
