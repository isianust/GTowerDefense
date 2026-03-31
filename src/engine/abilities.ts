/* ============================================
   SPECIAL ABILITIES — Power-ups and skills
   ============================================ */

/** Ability types */
export type AbilityType = "meteor" | "freeze" | "goldRush";

/** Ability definition */
export interface AbilityDef {
  type: AbilityType;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  icon: string;
  cooldown: number; // frames (60 = 1 second)
  duration: number; // frames for duration-based abilities
  cost: number; // gold cost to use
  damage?: number; // for damage abilities
  radius?: number; // area of effect in grid cells
  slowFactor?: number; // for freeze ability
  goldMultiplier?: number; // for gold rush
}

/** All ability definitions */
export const ABILITIES: Record<AbilityType, AbilityDef> = {
  meteor: {
    type: "meteor",
    name: "Meteor Strike",
    nameZh: "流星打擊",
    description: "Calls down a devastating meteor on a target area",
    descriptionZh: "召喚毀滅性的流星打擊目標區域",
    icon: "☄️",
    cooldown: 1800, // 30 seconds
    duration: 0,
    cost: 100,
    damage: 200,
    radius: 2.5,
  },
  freeze: {
    type: "freeze",
    name: "Freeze Blast",
    nameZh: "冰霜爆發",
    description: "Freezes all enemies on the map for a duration",
    descriptionZh: "凍結地圖上所有敵人一段時間",
    icon: "❄️",
    cooldown: 2400, // 40 seconds
    duration: 300, // 5 seconds
    cost: 75,
    slowFactor: 1.0, // complete freeze
  },
  goldRush: {
    type: "goldRush",
    name: "Gold Rush",
    nameZh: "黃金狂潮",
    description: "Doubles gold earned from kills for a duration",
    descriptionZh: "一段時間內擊殺所得金幣翻倍",
    icon: "💰",
    cooldown: 3600, // 60 seconds
    duration: 600, // 10 seconds
    cost: 50,
    goldMultiplier: 2.0,
  },
};

/** Active ability state */
export interface AbilityState {
  type: AbilityType;
  cooldownRemaining: number;
  active: boolean;
  durationRemaining: number;
}

/** Result of using an ability */
export interface AbilityUseResult {
  success: boolean;
  reason?: "on_cooldown" | "insufficient_gold" | "invalid_ability" | "no_target";
}

/** Target info for abilities that need a location */
export interface AbilityTarget {
  x: number;
  y: number;
}

/**
 * AbilityManager — Manages special abilities
 */
export class AbilityManager {
  private states: Map<AbilityType, AbilityState> = new Map();
  private goldMultiplier = 1.0;

  constructor() {
    this.initStates();
  }

  private initStates(): void {
    for (const [type, def] of Object.entries(ABILITIES)) {
      this.states.set(type as AbilityType, {
        type: type as AbilityType,
        cooldownRemaining: 0,
        active: false,
        durationRemaining: 0,
      });
      // Suppress unused variable lint
      void def;
    }
  }

  /**
   * Attempt to use an ability
   */
  useAbility(
    type: AbilityType,
    currentGold: number,
    _target?: AbilityTarget,
  ): AbilityUseResult {
    const def = ABILITIES[type];
    if (!def) {
      return { success: false, reason: "invalid_ability" };
    }

    const state = this.states.get(type)!;

    if (state.cooldownRemaining > 0) {
      return { success: false, reason: "on_cooldown" };
    }

    if (currentGold < def.cost) {
      return { success: false, reason: "insufficient_gold" };
    }

    // Activate the ability
    state.cooldownRemaining = def.cooldown;

    if (def.duration > 0) {
      state.active = true;
      state.durationRemaining = def.duration;
    }

    // Apply immediate effects based on type
    if (type === "goldRush" && def.goldMultiplier) {
      this.goldMultiplier = def.goldMultiplier;
    }

    return { success: true };
  }

  /**
   * Update ability states (call every frame)
   */
  update(): void {
    for (const [type, state] of this.states) {
      // Tick cooldown
      if (state.cooldownRemaining > 0) {
        state.cooldownRemaining--;
      }

      // Tick duration
      if (state.active && state.durationRemaining > 0) {
        state.durationRemaining--;
        if (state.durationRemaining <= 0) {
          state.active = false;
          // Reset effects
          if (type === "goldRush") {
            this.goldMultiplier = 1.0;
          }
        }
      }
    }
  }

  /**
   * Get current gold multiplier
   */
  getGoldMultiplier(): number {
    return this.goldMultiplier;
  }

  /**
   * Check if freeze is active
   */
  isFreezeActive(): boolean {
    const state = this.states.get("freeze");
    return state ? state.active : false;
  }

  /**
   * Get the slow factor if freeze is active
   */
  getFreezeFactor(): number {
    if (!this.isFreezeActive()) return 0;
    return ABILITIES.freeze.slowFactor ?? 0;
  }

  /**
   * Get ability state
   */
  getState(type: AbilityType): AbilityState | undefined {
    const state = this.states.get(type);
    return state ? { ...state } : undefined;
  }

  /**
   * Check if an ability is on cooldown
   */
  isOnCooldown(type: AbilityType): boolean {
    const state = this.states.get(type);
    return state ? state.cooldownRemaining > 0 : false;
  }

  /**
   * Get cooldown progress (0 = ready, 1 = just used)
   */
  getCooldownProgress(type: AbilityType): number {
    const state = this.states.get(type);
    const def = ABILITIES[type];
    if (!state || !def || def.cooldown === 0) return 0;
    return state.cooldownRemaining / def.cooldown;
  }

  /**
   * Check if an ability is currently active
   */
  isActive(type: AbilityType): boolean {
    const state = this.states.get(type);
    return state ? state.active : false;
  }

  /**
   * Get remaining duration as fraction (1 = just started, 0 = ended)
   */
  getDurationProgress(type: AbilityType): number {
    const state = this.states.get(type);
    const def = ABILITIES[type];
    if (!state || !def || def.duration === 0) return 0;
    return state.durationRemaining / def.duration;
  }

  /**
   * Get meteor damage info for a target location
   */
  getMeteorDamage(): { damage: number; radius: number } {
    return {
      damage: ABILITIES.meteor.damage ?? 0,
      radius: ABILITIES.meteor.radius ?? 0,
    };
  }

  /**
   * Get ability cost
   */
  getCost(type: AbilityType): number {
    return ABILITIES[type]?.cost ?? 0;
  }

  /**
   * Reset all abilities (for new game)
   */
  reset(): void {
    this.goldMultiplier = 1.0;
    this.initStates();
  }

  /**
   * Get all ability types
   */
  getAllTypes(): AbilityType[] {
    return Object.keys(ABILITIES) as AbilityType[];
  }
}
