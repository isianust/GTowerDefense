import { describe, it, expect, beforeEach } from "vitest";
import { AudioManager, DEFAULT_SOUND_CONFIGS } from "../engine/audio";
import type { SoundEvent } from "../engine/audio";

describe("Audio System", () => {
  let audio: AudioManager;

  beforeEach(() => {
    audio = new AudioManager();
  });

  // ---- Default State ----
  describe("Default State", () => {
    it("should have master volume at 1.0", () => {
      expect(audio.getMasterVolume()).toBe(1.0);
    });

    it("should have SFX volume at 1.0", () => {
      expect(audio.getSfxVolume()).toBe(1.0);
    });

    it("should have music volume at 0.5", () => {
      expect(audio.getMusicVolume()).toBe(0.5);
    });

    it("should not be muted by default", () => {
      expect(audio.isMuted()).toBe(false);
      expect(audio.isSfxMuted()).toBe(false);
      expect(audio.isMusicMuted()).toBe(false);
    });
  });

  // ---- Sound Configs ----
  describe("Sound Configs", () => {
    it("should have configs for all sound events", () => {
      const events: SoundEvent[] = [
        "tower_place",
        "tower_upgrade",
        "tower_sell",
        "enemy_hit",
        "enemy_die",
        "boss_die",
        "wave_start",
        "wave_complete",
        "victory",
        "defeat",
        "projectile_fire",
        "button_click",
        "ability_meteor",
        "ability_freeze",
        "ability_gold",
        "achievement_unlock",
      ];
      for (const event of events) {
        expect(audio.getSoundConfig(event)).toBeDefined();
      }
    });

    it("should have valid volume ranges", () => {
      for (const [, config] of Object.entries(DEFAULT_SOUND_CONFIGS)) {
        expect(config.volume).toBeGreaterThanOrEqual(0);
        expect(config.volume).toBeLessThanOrEqual(1);
      }
    });

    it("should allow custom config", () => {
      audio.setSoundConfig("tower_place", { volume: 0.9 });
      expect(audio.getSoundConfig("tower_place")!.volume).toBe(0.9);
    });
  });

  // ---- Play ----
  describe("play", () => {
    it("should play when not muted", () => {
      expect(audio.play("tower_place")).toBe(true);
    });

    it("should not play when globally muted", () => {
      audio.setMuted(true);
      expect(audio.play("tower_place")).toBe(false);
    });

    it("should not play when SFX muted", () => {
      audio.toggleSfxMute();
      expect(audio.play("tower_place")).toBe(false);
    });

    it("should respect max instances", () => {
      // enemy_hit has maxInstances: 5
      for (let i = 0; i < 5; i++) {
        expect(audio.play("enemy_hit")).toBe(true);
      }
      // 6th should be rejected
      expect(audio.play("enemy_hit")).toBe(false);
    });

    it("should allow play after resetting play log", () => {
      for (let i = 0; i < 5; i++) {
        audio.play("enemy_hit");
      }
      expect(audio.play("enemy_hit")).toBe(false);
      audio.resetPlayLog();
      expect(audio.play("enemy_hit")).toBe(true);
    });
  });

  // ---- Volume Controls ----
  describe("Volume Controls", () => {
    it("should set master volume", () => {
      audio.setMasterVolume(0.5);
      expect(audio.getMasterVolume()).toBe(0.5);
    });

    it("should clamp master volume to 0-1", () => {
      audio.setMasterVolume(-0.5);
      expect(audio.getMasterVolume()).toBe(0);
      audio.setMasterVolume(1.5);
      expect(audio.getMasterVolume()).toBe(1);
    });

    it("should set SFX volume", () => {
      audio.setSfxVolume(0.7);
      expect(audio.getSfxVolume()).toBe(0.7);
    });

    it("should clamp SFX volume", () => {
      audio.setSfxVolume(-1);
      expect(audio.getSfxVolume()).toBe(0);
      audio.setSfxVolume(2);
      expect(audio.getSfxVolume()).toBe(1);
    });

    it("should set music volume", () => {
      audio.setMusicVolume(0.8);
      expect(audio.getMusicVolume()).toBe(0.8);
    });

    it("should clamp music volume", () => {
      audio.setMusicVolume(-0.1);
      expect(audio.getMusicVolume()).toBe(0);
    });
  });

  // ---- Effective Volume ----
  describe("getEffectiveVolume", () => {
    it("should combine master and SFX volume", () => {
      audio.setMasterVolume(0.5);
      audio.setSfxVolume(0.8);
      const vol = audio.getEffectiveVolume("tower_place");
      // tower_place config volume = 0.5
      expect(vol).toBeCloseTo(0.5 * 0.8 * 0.5, 5);
    });

    it("should return 0 when muted", () => {
      audio.setMuted(true);
      expect(audio.getEffectiveVolume("tower_place")).toBe(0);
    });

    it("should return 0 when SFX muted", () => {
      audio.toggleSfxMute();
      expect(audio.getEffectiveVolume("tower_place")).toBe(0);
    });
  });

  // ---- Mute Controls ----
  describe("Mute Controls", () => {
    it("should toggle mute", () => {
      expect(audio.toggleMute()).toBe(true);
      expect(audio.isMuted()).toBe(true);
      expect(audio.toggleMute()).toBe(false);
      expect(audio.isMuted()).toBe(false);
    });

    it("should set muted directly", () => {
      audio.setMuted(true);
      expect(audio.isMuted()).toBe(true);
      audio.setMuted(false);
      expect(audio.isMuted()).toBe(false);
    });

    it("should toggle SFX mute", () => {
      expect(audio.toggleSfxMute()).toBe(true);
      expect(audio.isSfxMuted()).toBe(true);
      expect(audio.toggleSfxMute()).toBe(false);
      expect(audio.isSfxMuted()).toBe(false);
    });

    it("should toggle music mute", () => {
      expect(audio.toggleMusicMute()).toBe(true);
      expect(audio.isMusicMuted()).toBe(true);
      expect(audio.toggleMusicMute()).toBe(false);
      expect(audio.isMusicMuted()).toBe(false);
    });
  });

  // ---- Custom Config ----
  describe("Custom Config", () => {
    it("should accept custom configs in constructor", () => {
      const custom = new AudioManager({
        tower_place: { volume: 0.1 },
      });
      expect(custom.getSoundConfig("tower_place")!.volume).toBe(0.1);
      // Others should still have defaults
      expect(custom.getSoundConfig("victory")!.volume).toBe(0.8);
    });
  });
});
