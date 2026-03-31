/* ============================================
   REPLAY SYSTEM — Game recording & playback
   ============================================ */

/** Types of recordable game events */
export type ReplayEventType =
  | "game_start"
  | "game_end"
  | "wave_start"
  | "wave_complete"
  | "tower_place"
  | "tower_upgrade"
  | "tower_sell"
  | "ability_use"
  | "hero_skill"
  | "enemy_kill"
  | "life_lost";

/** A single recorded game event */
export interface ReplayEvent {
  frame: number;
  type: ReplayEventType;
  data: Record<string, unknown>;
}

/** Metadata attached to a replay */
export interface ReplayMetadata {
  createdAt: number;
  score: number;
  stars: number;
  duration: number; // total frames
  playerName?: string;
}

/** Serializable replay data */
export interface ReplayData {
  version: number;
  levelIndex: number;
  seed: number;
  events: ReplayEvent[];
  metadata: ReplayMetadata;
}

const REPLAY_VERSION = 1;

/**
 * ReplayRecorder — Records game events during play
 */
export class ReplayRecorder {
  private events: ReplayEvent[] = [];
  private currentFrame = 0;
  private levelIndex: number;
  private seed: number;
  private recording = false;

  constructor(levelIndex = 0, seed = Date.now()) {
    this.levelIndex = levelIndex;
    this.seed = seed;
  }

  /**
   * Start recording
   */
  start(): void {
    this.recording = true;
    this.record("game_start", {});
  }

  /**
   * Stop recording
   */
  stop(): void {
    if (this.recording) {
      this.record("game_end", { frame: this.currentFrame });
    }
    this.recording = false;
  }

  /**
   * Advance the frame counter (call every frame)
   */
  tick(): void {
    if (this.recording) {
      this.currentFrame++;
    }
  }

  /**
   * Record a game event at the current frame
   */
  record(type: ReplayEventType, data: Record<string, unknown>): void {
    if (!this.recording && type !== "game_start") return;
    this.events.push({ frame: this.currentFrame, type, data });
  }

  /**
   * Get the complete replay data
   */
  getReplay(score = 0, stars = 0, playerName?: string): ReplayData {
    return {
      version: REPLAY_VERSION,
      levelIndex: this.levelIndex,
      seed: this.seed,
      events: [...this.events],
      metadata: {
        createdAt: Date.now(),
        score,
        stars,
        duration: this.currentFrame,
        playerName,
      },
    };
  }

  /**
   * Get current frame
   */
  getCurrentFrame(): number {
    return this.currentFrame;
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.recording;
  }

  /**
   * Get number of recorded events
   */
  getEventCount(): number {
    return this.events.length;
  }

  /**
   * Reset the recorder
   */
  reset(): void {
    this.events = [];
    this.currentFrame = 0;
    this.recording = false;
  }
}

/**
 * ReplayPlayer — Plays back recorded replay data
 */
export class ReplayPlayer {
  private replay: ReplayData | null = null;
  private eventIndex = 0;

  /**
   * Load a replay for playback
   */
  loadReplay(data: ReplayData): void {
    this.replay = data;
    this.eventIndex = 0;
  }

  /**
   * Get all events that should fire at a specific frame
   */
  getEventsAtFrame(frame: number): ReplayEvent[] {
    if (!this.replay) return [];
    return this.replay.events.filter((e) => e.frame === frame);
  }

  /**
   * Get all events from frame start to frame end (inclusive)
   */
  getEventsInRange(startFrame: number, endFrame: number): ReplayEvent[] {
    if (!this.replay) return [];
    return this.replay.events.filter((e) => e.frame >= startFrame && e.frame <= endFrame);
  }

  /**
   * Advance playback and return events for the next frame
   * Returns events for `currentFrame`, then increments
   */
  nextFrameEvents(): ReplayEvent[] {
    if (!this.replay) return [];
    const events: ReplayEvent[] = [];

    while (
      this.eventIndex < this.replay.events.length &&
      this.replay.events[this.eventIndex].frame <= this.getCurrentFrame()
    ) {
      events.push(this.replay.events[this.eventIndex]);
      this.eventIndex++;
    }

    return events;
  }

  /**
   * Get the current playback frame
   */
  getCurrentFrame(): number {
    if (!this.replay || this.eventIndex === 0) return 0;
    return this.replay.events[Math.min(this.eventIndex, this.replay.events.length - 1)].frame;
  }

  /**
   * Check if replay has finished
   */
  isComplete(currentFrame: number): boolean {
    if (!this.replay) return true;
    return currentFrame >= this.replay.metadata.duration;
  }

  /**
   * Get replay duration in frames
   */
  getDuration(): number {
    return this.replay?.metadata.duration ?? 0;
  }

  /**
   * Get replay metadata
   */
  getMetadata(): ReplayMetadata | null {
    return this.replay?.metadata ?? null;
  }

  /**
   * Get level index of loaded replay
   */
  getLevelIndex(): number {
    return this.replay?.levelIndex ?? 0;
  }

  /**
   * Get total event count
   */
  getTotalEvents(): number {
    return this.replay?.events.length ?? 0;
  }

  /**
   * Check if a replay is loaded
   */
  hasReplay(): boolean {
    return this.replay !== null;
  }

  /**
   * Reset playback position to start
   */
  reset(): void {
    this.eventIndex = 0;
  }

  /**
   * Unload current replay
   */
  unload(): void {
    this.replay = null;
    this.eventIndex = 0;
  }
}

/**
 * Filter events by type from a replay
 */
export function filterEventsByType(
  replay: ReplayData,
  type: ReplayEventType,
): ReplayEvent[] {
  return replay.events.filter((e) => e.type === type);
}

/**
 * Count events of each type in a replay
 */
export function countEventsByType(
  replay: ReplayData,
): Partial<Record<ReplayEventType, number>> {
  const counts: Partial<Record<ReplayEventType, number>> = {};
  for (const event of replay.events) {
    counts[event.type] = (counts[event.type] ?? 0) + 1;
  }
  return counts;
}

/**
 * Validate a replay data structure
 */
export function isValidReplay(data: unknown): data is ReplayData {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.version === "number" &&
    d.version === REPLAY_VERSION &&
    typeof d.levelIndex === "number" &&
    typeof d.seed === "number" &&
    Array.isArray(d.events) &&
    typeof d.metadata === "object" &&
    d.metadata !== null
  );
}

/**
 * Serialize replay to JSON string
 */
export function serializeReplay(replay: ReplayData): string {
  return JSON.stringify(replay);
}

/**
 * Deserialize replay from JSON string
 */
export function deserializeReplay(json: string): ReplayData | null {
  try {
    const data = JSON.parse(json);
    if (!isValidReplay(data)) return null;
    return data;
  } catch {
    return null;
  }
}
