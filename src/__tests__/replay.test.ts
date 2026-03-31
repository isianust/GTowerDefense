import { describe, it, expect, beforeEach } from "vitest";
import {
  ReplayRecorder,
  ReplayPlayer,
  filterEventsByType,
  countEventsByType,
  isValidReplay,
  serializeReplay,
  deserializeReplay,
} from "../engine/replay";
import type { ReplayData } from "../engine/replay";

describe("Replay System", () => {
  // ---- ReplayRecorder ----
  describe("ReplayRecorder", () => {
    let recorder: ReplayRecorder;

    beforeEach(() => {
      recorder = new ReplayRecorder(0, 12345);
    });

    it("should start not recording", () => {
      expect(recorder.isRecording()).toBe(false);
    });

    it("should start at frame 0", () => {
      expect(recorder.getCurrentFrame()).toBe(0);
    });

    it("should have 0 events initially", () => {
      expect(recorder.getEventCount()).toBe(0);
    });

    it("should begin recording on start()", () => {
      recorder.start();
      expect(recorder.isRecording()).toBe(true);
    });

    it("should record game_start event on start()", () => {
      recorder.start();
      expect(recorder.getEventCount()).toBe(1);
    });

    it("should advance frame on tick()", () => {
      recorder.start();
      recorder.tick();
      recorder.tick();
      expect(recorder.getCurrentFrame()).toBe(2);
    });

    it("should not advance frame when not recording", () => {
      recorder.tick();
      recorder.tick();
      expect(recorder.getCurrentFrame()).toBe(0);
    });

    it("should record events when recording", () => {
      recorder.start();
      recorder.record("tower_place", { type: "archer", x: 5, y: 3 });
      expect(recorder.getEventCount()).toBe(2); // game_start + tower_place
    });

    it("should not record events when not recording", () => {
      recorder.record("tower_place", { type: "archer", x: 5, y: 3 });
      expect(recorder.getEventCount()).toBe(0);
    });

    it("should attach correct frame number to events", () => {
      recorder.start();
      recorder.tick();
      recorder.tick();
      recorder.tick();
      recorder.record("wave_start", { wave: 1 });
      const replay = recorder.getReplay();
      const waveEvent = replay.events.find((e) => e.type === "wave_start");
      expect(waveEvent!.frame).toBe(3);
    });

    it("should stop recording on stop()", () => {
      recorder.start();
      recorder.stop();
      expect(recorder.isRecording()).toBe(false);
    });

    it("should record game_end event on stop()", () => {
      recorder.start();
      recorder.stop();
      const replay = recorder.getReplay();
      const endEvent = replay.events.find((e) => e.type === "game_end");
      expect(endEvent).toBeDefined();
    });

    it("should return correct replay data", () => {
      recorder.start();
      recorder.tick();
      recorder.record("tower_place", { type: "cannon" });
      recorder.stop();

      const replay = recorder.getReplay(1234, 3, "Player1");
      expect(replay.levelIndex).toBe(0);
      expect(replay.seed).toBe(12345);
      expect(replay.metadata.score).toBe(1234);
      expect(replay.metadata.stars).toBe(3);
      expect(replay.metadata.playerName).toBe("Player1");
    });

    it("should include duration in metadata", () => {
      recorder.start();
      for (let i = 0; i < 100; i++) recorder.tick();
      recorder.stop();
      const replay = recorder.getReplay();
      expect(replay.metadata.duration).toBe(100);
    });

    it("should have correct version", () => {
      recorder.start();
      const replay = recorder.getReplay();
      expect(replay.version).toBe(1);
    });

    it("should reset on reset()", () => {
      recorder.start();
      for (let i = 0; i < 50; i++) recorder.tick();
      recorder.record("tower_place", {});
      recorder.reset();

      expect(recorder.isRecording()).toBe(false);
      expect(recorder.getCurrentFrame()).toBe(0);
      expect(recorder.getEventCount()).toBe(0);
    });

    it("should record multiple event types", () => {
      recorder.start();
      recorder.record("tower_place", { type: "archer" });
      recorder.record("wave_start", { wave: 1 });
      recorder.record("enemy_kill", { type: "goblin" });
      recorder.record("tower_upgrade", { type: "archer" });

      const replay = recorder.getReplay();
      const types = replay.events.map((e) => e.type);
      expect(types).toContain("tower_place");
      expect(types).toContain("wave_start");
      expect(types).toContain("enemy_kill");
    });
  });

  // ---- ReplayPlayer ----
  describe("ReplayPlayer", () => {
    let player: ReplayPlayer;
    let testReplay: ReplayData;

    beforeEach(() => {
      player = new ReplayPlayer();

      // Build a test replay
      const recorder = new ReplayRecorder(2, 99999);
      recorder.start();
      recorder.tick(); // frame 1
      recorder.record("tower_place", { type: "archer", gx: 5, gy: 3 });
      recorder.tick(); // frame 2
      recorder.tick(); // frame 3
      recorder.record("wave_start", { wave: 1 });
      recorder.tick(); // frame 4
      recorder.record("enemy_kill", { type: "goblin", reward: 5 });
      recorder.tick(); // frame 5
      recorder.stop();
      testReplay = recorder.getReplay(500, 2);
    });

    it("should start with no replay loaded", () => {
      expect(player.hasReplay()).toBe(false);
    });

    it("should load a replay", () => {
      player.loadReplay(testReplay);
      expect(player.hasReplay()).toBe(true);
    });

    it("should return correct level index", () => {
      player.loadReplay(testReplay);
      expect(player.getLevelIndex()).toBe(2);
    });

    it("should return correct total events", () => {
      player.loadReplay(testReplay);
      expect(player.getTotalEvents()).toBeGreaterThanOrEqual(4); // start + 3 explicit
    });

    it("should return events at a specific frame", () => {
      player.loadReplay(testReplay);
      const events = player.getEventsAtFrame(1);
      expect(events.some((e) => e.type === "tower_place")).toBe(true);
    });

    it("should return empty for frame with no events", () => {
      player.loadReplay(testReplay);
      const events = player.getEventsAtFrame(999);
      expect(events).toHaveLength(0);
    });

    it("should return events in range", () => {
      player.loadReplay(testReplay);
      const events = player.getEventsInRange(1, 4);
      expect(events.length).toBeGreaterThan(0);
      for (const e of events) {
        expect(e.frame).toBeGreaterThanOrEqual(1);
        expect(e.frame).toBeLessThanOrEqual(4);
      }
    });

    it("should return empty array when no replay loaded", () => {
      expect(player.getEventsAtFrame(0)).toHaveLength(0);
      expect(player.getEventsInRange(0, 100)).toHaveLength(0);
    });

    it("should return correct duration", () => {
      player.loadReplay(testReplay);
      expect(player.getDuration()).toBe(5);
    });

    it("should return metadata", () => {
      player.loadReplay(testReplay);
      const meta = player.getMetadata();
      expect(meta!.score).toBe(500);
      expect(meta!.stars).toBe(2);
    });

    it("should return null metadata when no replay loaded", () => {
      expect(player.getMetadata()).toBeNull();
    });

    it("should detect completion", () => {
      player.loadReplay(testReplay);
      expect(player.isComplete(3)).toBe(false);
      expect(player.isComplete(5)).toBe(true);
      expect(player.isComplete(10)).toBe(true);
    });

    it("should be complete when no replay", () => {
      expect(player.isComplete(0)).toBe(true);
    });

    it("should reset playback position", () => {
      player.loadReplay(testReplay);
      player.reset();
      expect(player.getCurrentFrame()).toBe(0);
    });

    it("should unload replay", () => {
      player.loadReplay(testReplay);
      player.unload();
      expect(player.hasReplay()).toBe(false);
      expect(player.getDuration()).toBe(0);
    });
  });

  // ---- Utility Functions ----
  describe("filterEventsByType", () => {
    it("should filter events by type", () => {
      const replay: ReplayData = {
        version: 1,
        levelIndex: 0,
        seed: 0,
        events: [
          { frame: 0, type: "game_start", data: {} },
          { frame: 1, type: "tower_place", data: { type: "archer" } },
          { frame: 2, type: "tower_place", data: { type: "cannon" } },
          { frame: 3, type: "wave_start", data: {} },
        ],
        metadata: { createdAt: 0, score: 0, stars: 0, duration: 10 },
      };

      const placements = filterEventsByType(replay, "tower_place");
      expect(placements).toHaveLength(2);
      expect(placements.every((e) => e.type === "tower_place")).toBe(true);
    });

    it("should return empty for non-existent type", () => {
      const replay: ReplayData = {
        version: 1,
        levelIndex: 0,
        seed: 0,
        events: [{ frame: 0, type: "game_start", data: {} }],
        metadata: { createdAt: 0, score: 0, stars: 0, duration: 0 },
      };
      expect(filterEventsByType(replay, "enemy_kill")).toHaveLength(0);
    });
  });

  describe("countEventsByType", () => {
    it("should count events by type", () => {
      const replay: ReplayData = {
        version: 1,
        levelIndex: 0,
        seed: 0,
        events: [
          { frame: 0, type: "tower_place", data: {} },
          { frame: 1, type: "tower_place", data: {} },
          { frame: 2, type: "enemy_kill", data: {} },
          { frame: 3, type: "tower_place", data: {} },
        ],
        metadata: { createdAt: 0, score: 0, stars: 0, duration: 0 },
      };

      const counts = countEventsByType(replay);
      expect(counts["tower_place"]).toBe(3);
      expect(counts["enemy_kill"]).toBe(1);
    });

    it("should return empty object for empty events", () => {
      const replay: ReplayData = {
        version: 1,
        levelIndex: 0,
        seed: 0,
        events: [],
        metadata: { createdAt: 0, score: 0, stars: 0, duration: 0 },
      };
      expect(Object.keys(countEventsByType(replay))).toHaveLength(0);
    });
  });

  describe("isValidReplay", () => {
    it("should validate correct replay", () => {
      const recorder = new ReplayRecorder(1, 42);
      recorder.start();
      recorder.stop();
      expect(isValidReplay(recorder.getReplay())).toBe(true);
    });

    it("should reject null", () => {
      expect(isValidReplay(null)).toBe(false);
    });

    it("should reject non-object", () => {
      expect(isValidReplay("string")).toBe(false);
      expect(isValidReplay(42)).toBe(false);
    });

    it("should reject missing version", () => {
      expect(isValidReplay({ levelIndex: 0, seed: 0, events: [], metadata: {} })).toBe(false);
    });

    it("should reject wrong version", () => {
      expect(isValidReplay({ version: 99, levelIndex: 0, seed: 0, events: [], metadata: {} })).toBe(false);
    });

    it("should reject missing events array", () => {
      expect(isValidReplay({ version: 1, levelIndex: 0, seed: 0, metadata: {} })).toBe(false);
    });
  });

  describe("serializeReplay / deserializeReplay", () => {
    it("should serialize to a JSON string", () => {
      const recorder = new ReplayRecorder(0, 42);
      recorder.start();
      recorder.tick();
      recorder.record("tower_place", { type: "archer" });
      recorder.stop();
      const json = serializeReplay(recorder.getReplay());
      expect(typeof json).toBe("string");
      expect(json.length).toBeGreaterThan(10);
    });

    it("should roundtrip serialize/deserialize", () => {
      const recorder = new ReplayRecorder(3, 777);
      recorder.start();
      recorder.record("tower_place", { type: "cannon" });
      recorder.stop();
      const original = recorder.getReplay();
      const json = serializeReplay(original);
      const parsed = deserializeReplay(json);
      expect(parsed).not.toBeNull();
      expect(parsed!.levelIndex).toBe(3);
      expect(parsed!.seed).toBe(777);
      expect(parsed!.events.length).toBe(original.events.length);
    });

    it("should return null for invalid JSON", () => {
      expect(deserializeReplay("not valid json{{{")).toBeNull();
    });

    it("should return null for valid JSON but invalid replay", () => {
      expect(deserializeReplay('{"invalid": true}')).toBeNull();
    });
  });
});
