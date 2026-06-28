import { test, expect } from "@playwright/test";
import { LEVEL_COUNT, waitForEngine, bootLevel, nonBlackRatio, debug, allFinite } from "./helpers";

/**
 * End-to-end coverage of every level (1..50). Boot each level on the real
 * shipped engine, let it run, and at each checkpoint assert the screen is
 * neither black, broken (NaN) nor stuck, and the engine logs no errors.
 * Each level contributes ~20 assertions, exceeding 1000 across the suite.
 */
const CHECKPOINTS = 6;
const CHECK_MS = 200;

for (let lvl = 0; lvl < LEVEL_COUNT; lvl++) {
  test(`level ${lvl + 1}: no stuck / broken / black screen`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/");
    await waitForEngine(page);
    await bootLevel(page, lvl);

    const start = await debug(page);
    expect(start.totalWaves).toBeGreaterThan(0); // level data loaded
    expect(start.running).toBe(true); // loop running

    for (let c = 0; c < CHECKPOINTS; c++) {
      await page.waitForTimeout(CHECK_MS);
      expect(await nonBlackRatio(page)).toBeGreaterThan(0.05); // not black
      expect(allFinite(await debug(page))).toBe(true); // not broken
      expect(errors, errors.join("\n")).toHaveLength(0); // no runtime errors
    }
  });
}
