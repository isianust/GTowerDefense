import { test, expect } from "@playwright/test";
import { waitForEngine, bootLevel, nonBlackRatio, debug, allFinite } from "./helpers";

/**
 * Frontend smoke tests: start menu, navigation between every screen,
 * button bindings, the 50-card level grid, and an initial non-black canvas.
 */
test.describe("Frontend smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForEngine(page);
  });

  test("menu screen visible on load", async ({ page }) => {
    await expect(page.locator("#menu-screen")).toHaveClass(/active/);
    await expect(page.locator("#btn-play")).toBeVisible();
    await expect(page.locator("#btn-how")).toBeVisible();
    await expect(page.locator("#btn-codex")).toBeVisible();
  });

  test("how-to-play opens and returns", async ({ page }) => {
    await page.click("#btn-how");
    await expect(page.locator("#how-screen")).toHaveClass(/active/);
    await page.click("#btn-how-back");
    await expect(page.locator("#menu-screen")).toHaveClass(/active/);
  });

  test("codex opens and returns", async ({ page }) => {
    await page.click("#btn-codex");
    await expect(page.locator("#codex-screen")).toHaveClass(/active/);
    await page.click("#btn-codex-back");
    await expect(page.locator("#menu-screen")).toHaveClass(/active/);
  });

  test("play shows the 50-card level grid", async ({ page }) => {
    await page.click("#btn-play");
    await expect(page.locator("#level-screen")).toHaveClass(/active/);
    await expect(page.locator("#td-level-grid .td-level-card")).toHaveCount(50);
    await page.click("#btn-level-back");
    await expect(page.locator("#menu-screen")).toHaveClass(/active/);
  });

  test("level 1 renders a non-black, finite frame", async ({ page }) => {
    await bootLevel(page, 0);
    await page.waitForTimeout(700);
    expect(await nonBlackRatio(page)).toBeGreaterThan(0.05);
    expect(allFinite(await debug(page))).toBe(true);
  });
});
