/* ============================================
   HERO SYSTEM — Controllable hero units
   ============================================ */

/** Hero class types */
export type HeroClass = "warrior" | "mage" | "ranger" | "paladin";

/** Hero skill definition */
export interface HeroSkillDef {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  icon: string;
  cooldown: number; // frames
  energyCost: number;
  levelRequired: number; // hero level required to unlock
}

/** Hero class definition */
export interface HeroClassDef {
  class: HeroClass;
  name: string;
  nameZh: string;
  icon: string;
  maxHp: number;
  armor: number; // damage reduction % (0-1)
  moveSpeed: number;
  attackDamage: number;
  attackRange: number;
  attackRate: number; // frames between attacks
  maxEnergy: number;
  energyRegen: number; // energy per frame
  skills: HeroSkillDef[];
}

/** Hero state (runtime) */
export interface HeroState {
  class: HeroClass;
  level: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  x: number;
  y: number;
  experience: number;
  skillCooldowns: Map<string, number>;
  alive: boolean;
}

/** Result of using a hero skill */
export interface HeroSkillResult {
  success: boolean;
  reason?: "insufficient_energy" | "on_cooldown" | "not_unlocked" | "invalid_skill" | "hero_dead";
}

/** Experience required per level (1-indexed, index 0 unused) */
const EXP_TABLE = [0, 0, 50, 130, 250, 420, 650, 950, 1320, 1760, 2400];
const MAX_HERO_LEVEL = 10;

/** All hero class definitions */
export const HERO_CLASSES: Record<HeroClass, HeroClassDef> = {
  warrior: {
    class: "warrior",
    name: "Warrior",
    nameZh: "戰士",
    icon: "⚔️",
    maxHp: 500,
    armor: 0.3,
    moveSpeed: 1.5,
    attackDamage: 40,
    attackRange: 1.5,
    attackRate: 40,
    maxEnergy: 100,
    energyRegen: 0.1,
    skills: [
      {
        id: "battle_cry",
        name: "Battle Cry",
        nameZh: "戰吼",
        description: "Boosts nearby tower damage by 20% for 5 seconds",
        descriptionZh: "提升附近防禦塔傷害20%，持續5秒",
        icon: "📣",
        cooldown: 600,
        energyCost: 40,
        levelRequired: 1,
      },
      {
        id: "shield_bash",
        name: "Shield Bash",
        nameZh: "盾擊",
        description: "Stuns all nearby enemies for 2 seconds",
        descriptionZh: "擊暈附近所有敵人2秒",
        icon: "🛡️",
        cooldown: 900,
        energyCost: 60,
        levelRequired: 3,
      },
      {
        id: "last_stand",
        name: "Last Stand",
        nameZh: "最後防線",
        description: "When below 20% HP, gain invincibility for 3 seconds",
        descriptionZh: "生命值低於20%時，獲得3秒無敵",
        icon: "💪",
        cooldown: 1800,
        energyCost: 80,
        levelRequired: 6,
      },
    ],
  },
  mage: {
    class: "mage",
    name: "Mage",
    nameZh: "法師",
    icon: "🔮",
    maxHp: 280,
    armor: 0.1,
    moveSpeed: 1.2,
    attackDamage: 25,
    attackRange: 3.5,
    attackRate: 55,
    maxEnergy: 150,
    energyRegen: 0.2,
    skills: [
      {
        id: "arcane_bolt",
        name: "Arcane Bolt",
        nameZh: "奧術閃電",
        description: "Fires a piercing bolt dealing 150 damage",
        descriptionZh: "發射穿透閃電造成150傷害",
        icon: "⚡",
        cooldown: 360,
        energyCost: 35,
        levelRequired: 1,
      },
      {
        id: "blizzard",
        name: "Blizzard",
        nameZh: "暴風雪",
        description: "Freezes all enemies on screen for 4 seconds",
        descriptionZh: "凍結螢幕上所有敵人4秒",
        icon: "❄️",
        cooldown: 1200,
        energyCost: 80,
        levelRequired: 4,
      },
      {
        id: "arcane_surge",
        name: "Arcane Surge",
        nameZh: "奧術爆發",
        description: "Doubles all tower damage for 8 seconds",
        descriptionZh: "所有防禦塔傷害翻倍8秒",
        icon: "🌟",
        cooldown: 2400,
        energyCost: 130,
        levelRequired: 7,
      },
    ],
  },
  ranger: {
    class: "ranger",
    name: "Ranger",
    nameZh: "遊俠",
    icon: "🏹",
    maxHp: 350,
    armor: 0.15,
    moveSpeed: 2.0,
    attackDamage: 30,
    attackRange: 5.0,
    attackRate: 35,
    maxEnergy: 120,
    energyRegen: 0.15,
    skills: [
      {
        id: "volley",
        name: "Volley",
        nameZh: "箭雨",
        description: "Fires 8 arrows in a spread, each dealing 60 damage",
        descriptionZh: "扇形射出8支箭，每支造成60傷害",
        icon: "🌊",
        cooldown: 480,
        energyCost: 45,
        levelRequired: 1,
      },
      {
        id: "marked_target",
        name: "Marked Target",
        nameZh: "標記目標",
        description: "Mark an enemy to take 50% more damage for 10 seconds",
        descriptionZh: "標記一個敵人，使其承受50%額外傷害10秒",
        icon: "🎯",
        cooldown: 720,
        energyCost: 55,
        levelRequired: 3,
      },
      {
        id: "eagle_eye",
        name: "Eagle Eye",
        nameZh: "鷹眼",
        description: "All towers gain +2 range for 12 seconds",
        descriptionZh: "所有防禦塔射程增加2格12秒",
        icon: "🦅",
        cooldown: 1500,
        energyCost: 90,
        levelRequired: 5,
      },
    ],
  },
  paladin: {
    class: "paladin",
    name: "Paladin",
    nameZh: "聖騎士",
    icon: "✨",
    maxHp: 450,
    armor: 0.25,
    moveSpeed: 1.3,
    attackDamage: 35,
    attackRange: 2.0,
    attackRate: 50,
    maxEnergy: 110,
    energyRegen: 0.12,
    skills: [
      {
        id: "holy_light",
        name: "Holy Light",
        nameZh: "聖光",
        description: "Heals hero for 100 HP",
        descriptionZh: "恢復英雄100生命值",
        icon: "💖",
        cooldown: 480,
        energyCost: 30,
        levelRequired: 1,
      },
      {
        id: "divine_shield",
        name: "Divine Shield",
        nameZh: "神聖護盾",
        description: "Become invulnerable for 5 seconds",
        descriptionZh: "無敵5秒",
        icon: "🛡️",
        cooldown: 1200,
        energyCost: 70,
        levelRequired: 4,
      },
      {
        id: "consecration",
        name: "Consecration",
        nameZh: "祝聖",
        description: "Deal 200 damage per second to all enemies for 6 seconds",
        descriptionZh: "對所有敵人每秒造成200傷害，持續6秒",
        icon: "☀️",
        cooldown: 2000,
        energyCost: 100,
        levelRequired: 6,
      },
    ],
  },
};

/**
 * HeroManager — Manages a hero instance
 */
export class HeroManager {
  private state: HeroState;
  private classDef: HeroClassDef;

  constructor(heroClass: HeroClass) {
    this.classDef = HERO_CLASSES[heroClass];
    this.state = this.createInitialState(heroClass);
  }

  /**
   * Get current hero state (copy)
   */
  getState(): HeroState {
    return {
      ...this.state,
      skillCooldowns: new Map(this.state.skillCooldowns),
    };
  }

  /**
   * Get hero class definition
   */
  getClassDef(): HeroClassDef {
    return this.classDef;
  }

  /**
   * Update hero state (call every frame)
   */
  update(): void {
    if (!this.state.alive) return;

    // Regenerate energy
    this.state.energy = Math.min(
      this.state.maxEnergy,
      this.state.energy + this.classDef.energyRegen,
    );

    // Tick down skill cooldowns
    for (const [id, cd] of this.state.skillCooldowns) {
      if (cd > 0) {
        this.state.skillCooldowns.set(id, cd - 1);
      }
    }
  }

  /**
   * Use a hero skill
   */
  useSkill(skillId: string): HeroSkillResult {
    if (!this.state.alive) {
      return { success: false, reason: "hero_dead" };
    }

    const skill = this.classDef.skills.find((s) => s.id === skillId);
    if (!skill) {
      return { success: false, reason: "invalid_skill" };
    }

    if (this.state.level < skill.levelRequired) {
      return { success: false, reason: "not_unlocked" };
    }

    const cooldown = this.state.skillCooldowns.get(skillId) ?? 0;
    if (cooldown > 0) {
      return { success: false, reason: "on_cooldown" };
    }

    if (this.state.energy < skill.energyCost) {
      return { success: false, reason: "insufficient_energy" };
    }

    this.state.energy -= skill.energyCost;
    this.state.skillCooldowns.set(skillId, skill.cooldown);

    return { success: true };
  }

  /**
   * Apply damage to hero
   */
  takeDamage(damage: number): void {
    if (!this.state.alive) return;
    const effectiveDamage = damage * (1 - this.classDef.armor);
    this.state.hp = Math.max(0, this.state.hp - effectiveDamage);
    if (this.state.hp <= 0) {
      this.state.alive = false;
    }
  }

  /**
   * Heal hero for given amount
   */
  heal(amount: number): void {
    if (!this.state.alive) return;
    this.state.hp = Math.min(this.state.maxHp, this.state.hp + amount);
  }

  /**
   * Add experience and handle level-up
   * @returns true if leveled up
   */
  addExperience(amount: number): boolean {
    if (this.state.level >= MAX_HERO_LEVEL) return false;

    this.state.experience += amount;
    const expNeeded = EXP_TABLE[this.state.level + 1];

    if (this.state.experience >= expNeeded) {
      this.state.level++;
      // Increase stats on level-up
      this.state.maxHp = Math.floor(this.classDef.maxHp * (1 + this.state.level * 0.1));
      this.state.hp = this.state.maxHp; // Full heal on level-up
      this.state.maxEnergy = Math.floor(this.classDef.maxEnergy * (1 + this.state.level * 0.05));
      return true;
    }

    return false;
  }

  /**
   * Move hero to new position
   */
  moveTo(x: number, y: number): void {
    this.state.x = x;
    this.state.y = y;
  }

  /**
   * Get experience needed for next level
   */
  getExpForNextLevel(): number {
    if (this.state.level >= MAX_HERO_LEVEL) return 0;
    return EXP_TABLE[this.state.level + 1];
  }

  /**
   * Get skill cooldown progress (0 = ready, 1 = just used)
   */
  getSkillCooldownProgress(skillId: string): number {
    const skill = this.classDef.skills.find((s) => s.id === skillId);
    if (!skill) return 0;
    const remaining = this.state.skillCooldowns.get(skillId) ?? 0;
    return remaining / skill.cooldown;
  }

  /**
   * Check if skill is unlocked at current level
   */
  isSkillUnlocked(skillId: string): boolean {
    const skill = this.classDef.skills.find((s) => s.id === skillId);
    if (!skill) return false;
    return this.state.level >= skill.levelRequired;
  }

  /**
   * Check if skill is on cooldown
   */
  isSkillOnCooldown(skillId: string): boolean {
    return (this.state.skillCooldowns.get(skillId) ?? 0) > 0;
  }

  /**
   * Get HP percentage
   */
  getHpPercent(): number {
    if (this.state.maxHp === 0) return 0;
    return this.state.hp / this.state.maxHp;
  }

  /**
   * Get energy percentage
   */
  getEnergyPercent(): number {
    if (this.state.maxEnergy === 0) return 0;
    return this.state.energy / this.state.maxEnergy;
  }

  /**
   * Get maximum hero level
   */
  getMaxLevel(): number {
    return MAX_HERO_LEVEL;
  }

  /**
   * Reset hero to initial state
   */
  reset(): void {
    this.state = this.createInitialState(this.classDef.class);
  }

  // ---- Private ----

  private createInitialState(heroClass: HeroClass): HeroState {
    const def = HERO_CLASSES[heroClass];
    const state: HeroState = {
      class: heroClass,
      level: 1,
      hp: def.maxHp,
      maxHp: def.maxHp,
      energy: def.maxEnergy,
      maxEnergy: def.maxEnergy,
      x: 0,
      y: 0,
      experience: 0,
      skillCooldowns: new Map(),
      alive: true,
    };
    for (const skill of def.skills) {
      state.skillCooldowns.set(skill.id, 0);
    }
    return state;
  }
}

/**
 * Get experience needed for a specific level
 */
export function getExpRequired(level: number): number {
  if (level < 1 || level > MAX_HERO_LEVEL) return 0;
  return EXP_TABLE[level] ?? 0;
}

/**
 * Get all skill IDs for a hero class
 */
export function getHeroSkillIds(heroClass: HeroClass): string[] {
  return HERO_CLASSES[heroClass].skills.map((s) => s.id);
}
