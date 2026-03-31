/* ============================================
   ACHIEVEMENT SYSTEM — Persistent unlock tracking
   ============================================ */

import type { StorageBackend } from "./saveload";

/** Achievement category */
export type AchievementCategory = "combat" | "economy" | "progression" | "mastery" | "special";

/** Achievement definition */
export interface AchievementDef {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  category: AchievementCategory;
  icon: string;
  requirement: number;
  hidden?: boolean;
}

/** Unlocked achievement record */
export interface UnlockedAchievement {
  id: string;
  unlockedAt: number;
  progress: number;
}

const ACHIEVEMENTS_KEY = "td_achievements";

/**
 * All achievement definitions (50+)
 */
export const ACHIEVEMENTS: AchievementDef[] = [
  // Combat (15)
  { id: "first_blood", name: "First Blood", nameZh: "首殺", description: "Defeat your first enemy", descriptionZh: "擊敗第一個敵人", category: "combat", icon: "⚔️", requirement: 1 },
  { id: "goblin_slayer", name: "Goblin Slayer", nameZh: "哥布林殺手", description: "Defeat 100 goblins", descriptionZh: "擊敗100隻哥布林", category: "combat", icon: "🗡️", requirement: 100 },
  { id: "orc_crusher", name: "Orc Crusher", nameZh: "獸人粉碎者", description: "Defeat 50 orcs", descriptionZh: "擊敗50隻獸人", category: "combat", icon: "🪓", requirement: 50 },
  { id: "wolf_hunter", name: "Wolf Hunter", nameZh: "獵狼人", description: "Defeat 75 wolves", descriptionZh: "擊敗75隻狼", category: "combat", icon: "🐺", requirement: 75 },
  { id: "boss_slayer", name: "Boss Slayer", nameZh: "首領殺手", description: "Defeat your first boss", descriptionZh: "擊敗第一個首領", category: "combat", icon: "👑", requirement: 1 },
  { id: "dragon_rider", name: "Dragon Rider", nameZh: "馴龍者", description: "Defeat 5 dragons", descriptionZh: "擊敗5條龍", category: "combat", icon: "🐉", requirement: 5 },
  { id: "titan_fall", name: "Titan Fall", nameZh: "泰坦隕落", description: "Defeat 3 titans", descriptionZh: "擊敗3個泰坦", category: "combat", icon: "⚡", requirement: 3 },
  { id: "kill_100", name: "Centurion", nameZh: "百夫長", description: "Defeat 100 enemies total", descriptionZh: "總共擊敗100個敵人", category: "combat", icon: "💯", requirement: 100 },
  { id: "kill_500", name: "Commander", nameZh: "指揮官", description: "Defeat 500 enemies total", descriptionZh: "總共擊敗500個敵人", category: "combat", icon: "🎖️", requirement: 500 },
  { id: "kill_1000", name: "Warlord", nameZh: "戰神", description: "Defeat 1000 enemies total", descriptionZh: "總共擊敗1000個敵人", category: "combat", icon: "🏆", requirement: 1000 },
  { id: "splash_kill_5", name: "Splash Zone", nameZh: "範圍殺傷", description: "Hit 5 enemies with one splash", descriptionZh: "一次範圍傷害擊中5個敵人", category: "combat", icon: "💥", requirement: 5 },
  { id: "chain_kill_4", name: "Chain Reaction", nameZh: "連鎖反應", description: "Chain lightning hits 4+ enemies", descriptionZh: "連鎖閃電擊中4個以上敵人", category: "combat", icon: "⚡", requirement: 4 },
  { id: "no_damage", name: "Untouchable", nameZh: "無敵", description: "Complete a level without losing lives", descriptionZh: "在不損失生命的情況下完成關卡", category: "combat", icon: "🛡️", requirement: 1 },
  { id: "close_call", name: "Close Call", nameZh: "千鈞一髮", description: "Win with exactly 1 life remaining", descriptionZh: "以剛好1條命通關", category: "combat", icon: "😰", requirement: 1 },
  { id: "boss_rush", name: "Boss Rush", nameZh: "首領衝刺", description: "Defeat 10 bosses total", descriptionZh: "總共擊敗10個首領", category: "combat", icon: "💀", requirement: 10 },

  // Economy (10)
  { id: "first_tower", name: "First Tower", nameZh: "首座防禦塔", description: "Place your first tower", descriptionZh: "放置第一座防禦塔", category: "economy", icon: "🏗️", requirement: 1 },
  { id: "tower_10", name: "Tower Builder", nameZh: "塔建築師", description: "Place 10 towers in a single game", descriptionZh: "單局放置10座防禦塔", category: "economy", icon: "🏭", requirement: 10 },
  { id: "upgrade_max", name: "Fully Loaded", nameZh: "滿級強化", description: "Fully upgrade a tower", descriptionZh: "將防禦塔升到滿級", category: "economy", icon: "⬆️", requirement: 1 },
  { id: "sell_tower", name: "Liquidator", nameZh: "清算者", description: "Sell a tower", descriptionZh: "出售一座防禦塔", category: "economy", icon: "💰", requirement: 1 },
  { id: "gold_1000", name: "Gold Hoarder", nameZh: "黃金囤積者", description: "Have 1000+ gold at once", descriptionZh: "同時擁有1000以上的金幣", category: "economy", icon: "🪙", requirement: 1000 },
  { id: "gold_earned_5000", name: "Wealthy", nameZh: "富翁", description: "Earn 5000 gold total", descriptionZh: "總共賺取5000金幣", category: "economy", icon: "💎", requirement: 5000 },
  { id: "all_towers", name: "Diverse Army", nameZh: "多元軍團", description: "Place all 5 tower types in one game", descriptionZh: "單局中放置所有5種防禦塔", category: "economy", icon: "🌈", requirement: 5 },
  { id: "tower_50", name: "Fortress Builder", nameZh: "要塞建造者", description: "Place 50 towers total", descriptionZh: "總共放置50座防禦塔", category: "economy", icon: "🏰", requirement: 50 },
  { id: "upgrade_20", name: "Upgrader", nameZh: "升級達人", description: "Perform 20 upgrades total", descriptionZh: "總共進行20次升級", category: "economy", icon: "📈", requirement: 20 },
  { id: "efficient", name: "Efficient", nameZh: "效率大師", description: "Win with 50%+ gold remaining", descriptionZh: "以50%以上金幣餘額通關", category: "economy", icon: "⚡", requirement: 1 },

  // Progression (12)
  { id: "level_1", name: "First Victory", nameZh: "初次勝利", description: "Complete level 1", descriptionZh: "完成第1關", category: "progression", icon: "🌟", requirement: 1 },
  { id: "level_10", name: "Rising Star", nameZh: "新星", description: "Complete 10 levels", descriptionZh: "完成10個關卡", category: "progression", icon: "⭐", requirement: 10 },
  { id: "level_25", name: "Veteran", nameZh: "老手", description: "Complete 25 levels", descriptionZh: "完成25個關卡", category: "progression", icon: "🎗️", requirement: 25 },
  { id: "level_50", name: "Champion", nameZh: "冠軍", description: "Complete all 50 levels", descriptionZh: "完成全部50個關卡", category: "progression", icon: "🏆", requirement: 50 },
  { id: "stars_50", name: "Star Collector", nameZh: "星星收藏家", description: "Earn 50 stars total", descriptionZh: "總共獲得50顆星", category: "progression", icon: "⭐", requirement: 50 },
  { id: "stars_100", name: "Constellation", nameZh: "星座", description: "Earn 100 stars total", descriptionZh: "總共獲得100顆星", category: "progression", icon: "✨", requirement: 100 },
  { id: "stars_150", name: "Galaxy", nameZh: "銀河", description: "Earn all 150 stars", descriptionZh: "獲得全部150顆星", category: "progression", icon: "🌌", requirement: 150 },
  { id: "perfect_3", name: "Hat Trick", nameZh: "帽子戲法", description: "Get 3 stars on 3 consecutive levels", descriptionZh: "連續3關獲得3星", category: "progression", icon: "🎩", requirement: 3 },
  { id: "score_1000", name: "High Scorer", nameZh: "高分王", description: "Reach score 1000 in a single game", descriptionZh: "單局得分達到1000", category: "progression", icon: "🏅", requirement: 1000 },
  { id: "score_5000", name: "Score Master", nameZh: "分數大師", description: "Reach score 5000 in a single game", descriptionZh: "單局得分達到5000", category: "progression", icon: "🥇", requirement: 5000 },
  { id: "no_loss", name: "Flawless", nameZh: "完美", description: "Complete 5 levels without losing a life", descriptionZh: "連續5關不損失生命", category: "progression", icon: "💪", requirement: 5 },
  { id: "speedrun", name: "Speed Runner", nameZh: "速通者", description: "Complete a level using only fast-forward", descriptionZh: "全程使用快進完成關卡", category: "progression", icon: "⏩", requirement: 1 },

  // Mastery (8)
  { id: "archer_master", name: "Archer Master", nameZh: "弓箭大師", description: "Win using only archer towers", descriptionZh: "僅使用弓箭塔通關", category: "mastery", icon: "🏹", requirement: 1 },
  { id: "cannon_master", name: "Cannon Master", nameZh: "加農砲大師", description: "Win using only cannon towers", descriptionZh: "僅使用加農砲塔通關", category: "mastery", icon: "💣", requirement: 1 },
  { id: "ice_master", name: "Ice Master", nameZh: "冰霜大師", description: "Win using only ice towers", descriptionZh: "僅使用冰霜塔通關", category: "mastery", icon: "❄️", requirement: 1 },
  { id: "lightning_master", name: "Lightning Master", nameZh: "閃電大師", description: "Win using only lightning towers", descriptionZh: "僅使用閃電塔通關", category: "mastery", icon: "⚡", requirement: 1 },
  { id: "sniper_master", name: "Sniper Master", nameZh: "狙擊大師", description: "Win using only sniper towers", descriptionZh: "僅使用狙擊塔通關", category: "mastery", icon: "🎯", requirement: 1 },
  { id: "minimalist", name: "Minimalist", nameZh: "極簡主義者", description: "Win with 3 or fewer towers", descriptionZh: "用3座以下防禦塔通關", category: "mastery", icon: "🎭", requirement: 1 },
  { id: "no_upgrade", name: "Raw Power", nameZh: "原始力量", description: "Win without upgrading any tower", descriptionZh: "不升級任何防禦塔通關", category: "mastery", icon: "💪", requirement: 1 },
  { id: "late_bloomer", name: "Late Bloomer", nameZh: "大器晚成", description: "Don't place towers until wave 3", descriptionZh: "到第3波才開始放塔", category: "mastery", icon: "🌸", requirement: 1 },

  // Special (7)
  { id: "play_1_hour", name: "Dedicated", nameZh: "專注", description: "Play for 1 hour total", descriptionZh: "總遊玩時間達1小時", category: "special", icon: "⏰", requirement: 3600 },
  { id: "retry_5", name: "Persistent", nameZh: "堅持不懈", description: "Retry a level 5 times", descriptionZh: "重試同一關5次", category: "special", icon: "🔄", requirement: 5 },
  { id: "use_all_abilities", name: "Arsenal", nameZh: "武器庫", description: "Use all special abilities", descriptionZh: "使用所有特殊能力", category: "special", icon: "🎆", requirement: 3 },
  { id: "bilingual", name: "Bilingual", nameZh: "雙語達人", description: "Switch language at least once", descriptionZh: "至少切換語言一次", category: "special", icon: "🌐", requirement: 1 },
  { id: "night_owl", name: "Night Owl", nameZh: "夜貓子", description: "Play between midnight and 5 AM", descriptionZh: "在午夜到凌晨5點之間遊玩", category: "special", icon: "🦉", requirement: 1 },
  { id: "comeback", name: "Comeback King", nameZh: "逆轉王", description: "Win after reaching 1 life", descriptionZh: "剩1條命後逆轉勝", category: "special", icon: "👑", requirement: 1 },
  { id: "completionist", name: "Completionist", nameZh: "完美主義者", description: "Unlock all other achievements", descriptionZh: "解鎖所有其他成就", category: "special", icon: "🌟", requirement: 1, hidden: true },
];

/**
 * AchievementManager — Tracks and awards achievements
 */
export class AchievementManager {
  private unlocked: Map<string, UnlockedAchievement> = new Map();
  private counters: Map<string, number> = new Map();
  private storage: StorageBackend;
  private definitions: Map<string, AchievementDef>;
  private onUnlockCallbacks: ((achievement: AchievementDef) => void)[] = [];

  constructor(storage?: StorageBackend) {
    this.storage = storage ?? localStorage;
    this.definitions = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));
    this.load();
  }

  /**
   * Increment a counter towards an achievement
   */
  increment(id: string, amount = 1): boolean {
    const def = this.definitions.get(id);
    if (!def) return false;
    if (this.unlocked.has(id)) return false;

    const current = (this.counters.get(id) || 0) + amount;
    this.counters.set(id, current);

    if (current >= def.requirement) {
      return this.unlock(id);
    }

    this.save();
    return false;
  }

  /**
   * Set a counter to an exact value (for tracking things like "current gold")
   */
  setCounter(id: string, value: number): boolean {
    const def = this.definitions.get(id);
    if (!def) return false;
    if (this.unlocked.has(id)) return false;

    this.counters.set(id, value);

    if (value >= def.requirement) {
      return this.unlock(id);
    }

    this.save();
    return false;
  }

  /**
   * Directly unlock an achievement
   */
  unlock(id: string): boolean {
    const def = this.definitions.get(id);
    if (!def) return false;
    if (this.unlocked.has(id)) return false;

    const record: UnlockedAchievement = {
      id,
      unlockedAt: Date.now(),
      progress: def.requirement,
    };
    this.unlocked.set(id, record);
    this.counters.set(id, def.requirement);
    this.save();

    // Notify listeners
    for (const cb of this.onUnlockCallbacks) {
      cb(def);
    }

    // Check completionist
    if (id !== "completionist") {
      this.checkCompletionist();
    }

    return true;
  }

  /**
   * Check if an achievement is unlocked
   */
  isUnlocked(id: string): boolean {
    return this.unlocked.has(id);
  }

  /**
   * Get current progress for an achievement
   */
  getProgress(id: string): number {
    return this.counters.get(id) || 0;
  }

  /**
   * Get all unlocked achievements
   */
  getUnlocked(): UnlockedAchievement[] {
    return Array.from(this.unlocked.values());
  }

  /**
   * Get total unlocked count
   */
  getUnlockedCount(): number {
    return this.unlocked.size;
  }

  /**
   * Get total achievement count
   */
  getTotalCount(): number {
    return this.definitions.size;
  }

  /**
   * Get achievement definition by ID
   */
  getDefinition(id: string): AchievementDef | undefined {
    return this.definitions.get(id);
  }

  /**
   * Get all definitions
   */
  getAllDefinitions(): AchievementDef[] {
    return ACHIEVEMENTS;
  }

  /**
   * Get achievements by category
   */
  getByCategory(category: AchievementCategory): AchievementDef[] {
    return ACHIEVEMENTS.filter((a) => a.category === category);
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(): number {
    if (this.definitions.size === 0) return 100;
    return Math.round((this.unlocked.size / this.definitions.size) * 100);
  }

  /**
   * Register a callback for when an achievement is unlocked
   */
  onUnlock(callback: (achievement: AchievementDef) => void): void {
    this.onUnlockCallbacks.push(callback);
  }

  /**
   * Reset all achievements and progress
   */
  reset(): void {
    this.unlocked.clear();
    this.counters.clear();
    this.save();
  }

  // ---- Private ----

  private checkCompletionist(): void {
    const totalNonHidden = ACHIEVEMENTS.filter((a) => a.id !== "completionist").length;
    const unlockedNonComp = Array.from(this.unlocked.keys()).filter(
      (id) => id !== "completionist",
    ).length;
    if (unlockedNonComp >= totalNonHidden) {
      this.unlock("completionist");
    }
  }

  private save(): void {
    try {
      const data = {
        unlocked: Array.from(this.unlocked.entries()),
        counters: Array.from(this.counters.entries()),
      };
      this.storage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  }

  private load(): void {
    try {
      const raw = this.storage.getItem(ACHIEVEMENTS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.unlocked && Array.isArray(data.unlocked)) {
        this.unlocked = new Map(data.unlocked);
      }
      if (data.counters && Array.isArray(data.counters)) {
        this.counters = new Map(data.counters);
      }
    } catch {
      // Start fresh on parse errors
    }
  }
}
