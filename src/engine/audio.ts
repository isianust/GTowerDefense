/* ============================================
   AUDIO SYSTEM — Sound effects & music manager
   ============================================ */

/** Audio event types */
export type SoundEvent =
  | "tower_place"
  | "tower_upgrade"
  | "tower_sell"
  | "enemy_hit"
  | "enemy_die"
  | "boss_die"
  | "wave_start"
  | "wave_complete"
  | "victory"
  | "defeat"
  | "projectile_fire"
  | "button_click"
  | "ability_meteor"
  | "ability_freeze"
  | "ability_gold"
  | "achievement_unlock";

/** Audio configuration for a sound */
export interface SoundConfig {
  volume: number; // 0.0 - 1.0
  pitch?: number; // playback rate, 1.0 = normal
  loop?: boolean;
  maxInstances?: number;
}

/** Default sound configurations */
export const DEFAULT_SOUND_CONFIGS: Record<SoundEvent, SoundConfig> = {
  tower_place: { volume: 0.5 },
  tower_upgrade: { volume: 0.6 },
  tower_sell: { volume: 0.4 },
  enemy_hit: { volume: 0.2, maxInstances: 5 },
  enemy_die: { volume: 0.4, maxInstances: 8 },
  boss_die: { volume: 0.8 },
  wave_start: { volume: 0.6 },
  wave_complete: { volume: 0.7 },
  victory: { volume: 0.8 },
  defeat: { volume: 0.7 },
  projectile_fire: { volume: 0.15, maxInstances: 10 },
  button_click: { volume: 0.3 },
  ability_meteor: { volume: 0.9 },
  ability_freeze: { volume: 0.7 },
  ability_gold: { volume: 0.6 },
  achievement_unlock: { volume: 0.8 },
};

/**
 * AudioManager — Manages all game audio
 *
 * Supports sound effects, background music, volume control,
 * and mute toggling. Uses Web Audio API when available.
 */
export class AudioManager {
  private masterVolume = 1.0;
  private sfxVolume = 1.0;
  private musicVolume = 0.5;
  private muted = false;
  private sfxMuted = false;
  private musicMuted = false;
  private configs: Record<string, SoundConfig>;
  private playLog: Map<string, number[]> = new Map();

  constructor(configs?: Partial<Record<SoundEvent, SoundConfig>>) {
    this.configs = { ...DEFAULT_SOUND_CONFIGS, ...configs };
  }

  /**
   * Play a sound event
   * Returns true if the sound would play (respects max instances and muting)
   */
  play(event: SoundEvent): boolean {
    if (this.muted || this.sfxMuted) return false;

    const config = this.configs[event];
    if (!config) return false;

    // Check max instances
    if (config.maxInstances) {
      const now = Date.now();
      if (!this.playLog.has(event)) {
        this.playLog.set(event, []);
      }
      const log = this.playLog.get(event)!;
      // Remove entries older than 100ms
      const recent = log.filter((t) => now - t < 100);
      if (recent.length >= config.maxInstances) {
        this.playLog.set(event, recent);
        return false;
      }
      recent.push(now);
      this.playLog.set(event, recent);
    }

    // In a real implementation, this would trigger Web Audio API playback
    // For now, we track the intent to play
    return true;
  }

  /**
   * Get the effective volume for a sound event
   */
  getEffectiveVolume(event: SoundEvent): number {
    if (this.muted || this.sfxMuted) return 0;
    const config = this.configs[event];
    if (!config) return 0;
    return config.volume * this.sfxVolume * this.masterVolume;
  }

  // ---- Volume Controls ----

  setMasterVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  setSfxVolume(vol: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  getSfxVolume(): number {
    return this.sfxVolume;
  }

  setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  // ---- Mute Controls ----

  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  toggleSfxMute(): boolean {
    this.sfxMuted = !this.sfxMuted;
    return this.sfxMuted;
  }

  isSfxMuted(): boolean {
    return this.sfxMuted;
  }

  toggleMusicMute(): boolean {
    this.musicMuted = !this.musicMuted;
    return this.musicMuted;
  }

  isMusicMuted(): boolean {
    return this.musicMuted;
  }

  // ---- Config ----

  getSoundConfig(event: SoundEvent): SoundConfig | undefined {
    return this.configs[event];
  }

  setSoundConfig(event: SoundEvent, config: SoundConfig): void {
    this.configs[event] = config;
  }

  /**
   * Reset the play log (useful between frames)
   */
  resetPlayLog(): void {
    this.playLog.clear();
  }
}
