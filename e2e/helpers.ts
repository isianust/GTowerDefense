import type { Page } from "@playwright/test";

export const LEVEL_COUNT = 50;

interface Debug {
  wave: number;
  totalWaves: number;
  gold: number;
  lives: number;
  score: number;
  enemies: number;
  towers: number;
  running: boolean;
}

/** Wait until the shipped TD3K engine is available on window. */
export async function waitForEngine(page: Page): Promise<void> {
  await page.waitForFunction(() => !!(window as unknown as { TD3K?: unknown }).TD3K);
}

/** Boot a level by index (0-based) and switch to the game screen. */
export async function bootLevel(page: Page, index: number): Promise<void> {
  await page.evaluate((i) => (window as unknown as { TD3K: any }).TD3K.startLevel(i), index);
}

/** Returns the ratio of non-black pixels on the canvas (0..1). */
export async function nonBlackRatio(page: Page): Promise<number> {
  return page.evaluate(() => {
    const c = document.getElementById("td-canvas") as HTMLCanvasElement;
    if (!c || !c.width || !c.height) return 0;
    const ctx = c.getContext("2d")!;
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let nonBlack = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 8 || data[i + 1] > 8 || data[i + 2] > 8) nonBlack++;
    }
    return nonBlack / (data.length / 4);
  });
}

/** Snapshot of engine state; every numeric field must be finite. */
export async function debug(page: Page): Promise<Debug> {
  return page.evaluate(() => (window as unknown as { TD3K: any }).TD3K.debug());
}

export function allFinite(d: Debug): boolean {
  return [d.wave, d.totalWaves, d.gold, d.lives, d.score, d.enemies, d.towers].every((n) =>
    Number.isFinite(n),
  );
}
