/* ============================================
   SAVE / LOAD SYSTEM — Game state persistence
   ============================================ */

import type { GameProgress } from "../types";

/** Saved game state (serializable) */
export interface SavedGameState {
  version: number;
  timestamp: number;
  levelIndex: number;
  gold: number;
  lives: number;
  score: number;
  waveIndex: number;
  towers: SavedTower[];
}

/** Serializable tower data */
export interface SavedTower {
  type: string;
  gx: number;
  gy: number;
  level: number;
  totalCost: number;
}

/** Save slot metadata */
export interface SaveSlotMeta {
  id: string;
  name: string;
  timestamp: number;
  levelIndex: number;
  score: number;
}

const SAVE_VERSION = 1;
const PROGRESS_KEY = "td_progress";
const SAVES_KEY = "td_saves";
const SAVE_SLOTS_KEY = "td_save_slots";

/**
 * Storage abstraction for persistence
 */
export interface StorageBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * SaveLoadManager — Handles game state persistence
 */
export class SaveLoadManager {
  private storage: StorageBackend;

  constructor(storage?: StorageBackend) {
    this.storage = storage ?? localStorage;
  }

  // ---- Progress (star ratings, unlocks) ----

  loadProgress(): GameProgress {
    try {
      const data = this.storage.getItem(PROGRESS_KEY);
      if (!data) return { 0: 0 };
      const parsed = JSON.parse(data);
      if (typeof parsed !== "object" || parsed === null) return { 0: 0 };
      return parsed as GameProgress;
    } catch {
      return { 0: 0 };
    }
  }

  saveProgress(progress: GameProgress): void {
    try {
      this.storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage errors
    }
  }

  resetProgress(): void {
    try {
      this.storage.removeItem(PROGRESS_KEY);
    } catch {
      // Ignore
    }
  }

  // ---- Game State Saves ----

  /**
   * Save a game state to a named slot
   */
  saveGame(slotId: string, name: string, state: Omit<SavedGameState, "version" | "timestamp">): boolean {
    try {
      const fullState: SavedGameState = {
        ...state,
        version: SAVE_VERSION,
        timestamp: Date.now(),
      };

      // Save the state
      const saves = this.loadAllSaves();
      saves[slotId] = fullState;
      this.storage.setItem(SAVES_KEY, JSON.stringify(saves));

      // Update slot metadata
      const slots = this.loadSlotMetas();
      const metaIdx = slots.findIndex((s) => s.id === slotId);
      const meta: SaveSlotMeta = {
        id: slotId,
        name,
        timestamp: fullState.timestamp,
        levelIndex: state.levelIndex,
        score: state.score,
      };
      if (metaIdx >= 0) {
        slots[metaIdx] = meta;
      } else {
        slots.push(meta);
      }
      this.storage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Load a game state from a slot
   */
  loadGame(slotId: string): SavedGameState | null {
    try {
      const saves = this.loadAllSaves();
      const state = saves[slotId];
      if (!state) return null;
      if (state.version !== SAVE_VERSION) return null;
      return state;
    } catch {
      return null;
    }
  }

  /**
   * Delete a saved game
   */
  deleteGame(slotId: string): boolean {
    try {
      const saves = this.loadAllSaves();
      if (!(slotId in saves)) return false;
      delete saves[slotId];
      this.storage.setItem(SAVES_KEY, JSON.stringify(saves));

      const slots = this.loadSlotMetas().filter((s) => s.id !== slotId);
      this.storage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all save slot metadata (for UI display)
   */
  getSlots(): SaveSlotMeta[] {
    return this.loadSlotMetas();
  }

  /**
   * Check if a slot exists
   */
  hasSlot(slotId: string): boolean {
    return this.loadSlotMetas().some((s) => s.id === slotId);
  }

  // ---- Private ----

  private loadAllSaves(): Record<string, SavedGameState> {
    try {
      const data = this.storage.getItem(SAVES_KEY);
      if (!data) return {};
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  private loadSlotMetas(): SaveSlotMeta[] {
    try {
      const data = this.storage.getItem(SAVE_SLOTS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

/**
 * Validate a SavedGameState structure
 */
export function isValidSaveState(state: unknown): state is SavedGameState {
  if (typeof state !== "object" || state === null) return false;
  const s = state as Record<string, unknown>;
  return (
    typeof s.version === "number" &&
    typeof s.timestamp === "number" &&
    typeof s.levelIndex === "number" &&
    typeof s.gold === "number" &&
    typeof s.lives === "number" &&
    typeof s.score === "number" &&
    typeof s.waveIndex === "number" &&
    Array.isArray(s.towers)
  );
}
