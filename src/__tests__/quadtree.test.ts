import { describe, it, expect, beforeEach } from "vitest";
import { Quadtree } from "../engine/quadtree";
import type { Rectangle } from "../engine/quadtree";

describe("Quadtree — Spatial Indexing", () => {
  let qt: Quadtree<string>;
  const boundary: Rectangle = { x: 0, y: 0, width: 100, height: 100 };

  beforeEach(() => {
    qt = new Quadtree<string>(boundary);
  });

  // ---- Insert ----
  describe("insert", () => {
    it("should insert item within boundary", () => {
      expect(qt.insert({ x: 50, y: 50, data: "center" })).toBe(true);
      expect(qt.size).toBe(1);
    });

    it("should reject item outside boundary", () => {
      expect(qt.insert({ x: 150, y: 50, data: "out" })).toBe(false);
      expect(qt.insert({ x: -1, y: 50, data: "out" })).toBe(false);
      expect(qt.insert({ x: 50, y: -1, data: "out" })).toBe(false);
      expect(qt.insert({ x: 50, y: 150, data: "out" })).toBe(false);
      expect(qt.size).toBe(0);
    });

    it("should insert multiple items", () => {
      for (let i = 0; i < 10; i++) {
        qt.insert({ x: i * 9, y: i * 9, data: `item${i}` });
      }
      expect(qt.size).toBe(10);
    });

    it("should handle items at boundary edges", () => {
      expect(qt.insert({ x: 0, y: 0, data: "origin" })).toBe(true);
      expect(qt.insert({ x: 99, y: 99, data: "max" })).toBe(true);
      expect(qt.size).toBe(2);
    });

    it("should reject item at exact boundary extent", () => {
      // x >= rect.x + rect.width should be outside
      expect(qt.insert({ x: 100, y: 50, data: "edge" })).toBe(false);
      expect(qt.insert({ x: 50, y: 100, data: "edge" })).toBe(false);
    });

    it("should subdivide when capacity exceeded", () => {
      for (let i = 0; i < 20; i++) {
        qt.insert({ x: i * 4, y: i * 4, data: `item${i}` });
      }
      expect(qt.size).toBe(20);
    });
  });

  // ---- queryRange ----
  describe("queryRange", () => {
    beforeEach(() => {
      // Insert a grid of items
      for (let x = 5; x < 100; x += 10) {
        for (let y = 5; y < 100; y += 10) {
          qt.insert({ x, y, data: `${x},${y}` });
        }
      }
    });

    it("should find items in range", () => {
      const results = qt.queryRange({ x: 0, y: 0, width: 20, height: 20 });
      expect(results.length).toBeGreaterThan(0);
      // Should find (5,5) and (15,15) and (5,15) and (15,5)
      const coords = results.map((r) => `${r.x},${r.y}`);
      expect(coords).toContain("5,5");
      expect(coords).toContain("15,5");
      expect(coords).toContain("5,15");
      expect(coords).toContain("15,15");
    });

    it("should return empty for range with no items", () => {
      const results = qt.queryRange({ x: 200, y: 200, width: 10, height: 10 });
      expect(results).toHaveLength(0);
    });

    it("should find all items with full boundary range", () => {
      const results = qt.queryRange(boundary);
      expect(results.length).toBe(qt.size);
    });

    it("should find items in small range", () => {
      const results = qt.queryRange({ x: 4, y: 4, width: 2, height: 2 });
      expect(results.length).toBe(1);
      expect(results[0].data).toBe("5,5");
    });
  });

  // ---- queryRadius ----
  describe("queryRadius", () => {
    beforeEach(() => {
      qt.insert({ x: 50, y: 50, data: "center" });
      qt.insert({ x: 55, y: 50, data: "near" });
      qt.insert({ x: 90, y: 90, data: "far" });
      qt.insert({ x: 10, y: 10, data: "corner" });
    });

    it("should find items within radius", () => {
      const results = qt.queryRadius(50, 50, 10);
      const names = results.map((r) => r.data);
      expect(names).toContain("center");
      expect(names).toContain("near");
    });

    it("should exclude items outside radius", () => {
      const results = qt.queryRadius(50, 50, 10);
      const names = results.map((r) => r.data);
      expect(names).not.toContain("far");
      expect(names).not.toContain("corner");
    });

    it("should return empty for zero radius", () => {
      const results = qt.queryRadius(50, 50, 0);
      // Only exact matches
      expect(results.length).toBeLessThanOrEqual(1);
    });

    it("should find all items with large radius", () => {
      const results = qt.queryRadius(50, 50, 200);
      expect(results.length).toBe(4);
    });
  });

  // ---- findNearest ----
  describe("findNearest", () => {
    it("should find nearest item", () => {
      qt.insert({ x: 10, y: 10, data: "A" });
      qt.insert({ x: 90, y: 90, data: "B" });
      qt.insert({ x: 50, y: 50, data: "C" });

      const nearest = qt.findNearest(48, 48);
      expect(nearest).not.toBeNull();
      expect(nearest!.data).toBe("C");
    });

    it("should find nearest from corner", () => {
      qt.insert({ x: 10, y: 10, data: "near" });
      qt.insert({ x: 90, y: 90, data: "far" });

      const nearest = qt.findNearest(0, 0);
      expect(nearest).not.toBeNull();
      expect(nearest!.data).toBe("near");
    });

    it("should return null for empty tree", () => {
      const nearest = qt.findNearest(50, 50);
      expect(nearest).toBeNull();
    });

    it("should handle single item", () => {
      qt.insert({ x: 25, y: 75, data: "only" });
      const nearest = qt.findNearest(0, 0);
      expect(nearest).not.toBeNull();
      expect(nearest!.data).toBe("only");
    });
  });

  // ---- getAllItems ----
  describe("getAllItems", () => {
    it("should return all inserted items", () => {
      qt.insert({ x: 10, y: 10, data: "A" });
      qt.insert({ x: 50, y: 50, data: "B" });
      qt.insert({ x: 90, y: 90, data: "C" });

      const all = qt.getAllItems();
      expect(all.length).toBe(3);
      const datas = all.map((i) => i.data).sort();
      expect(datas).toEqual(["A", "B", "C"]);
    });

    it("should return empty array for empty tree", () => {
      expect(qt.getAllItems()).toHaveLength(0);
    });
  });

  // ---- clear ----
  describe("clear", () => {
    it("should remove all items", () => {
      qt.insert({ x: 10, y: 10, data: "A" });
      qt.insert({ x: 50, y: 50, data: "B" });
      expect(qt.size).toBe(2);

      qt.clear();
      expect(qt.size).toBe(0);
      expect(qt.getAllItems()).toHaveLength(0);
    });
  });

  // ---- getBoundary / getDepth ----
  describe("metadata", () => {
    it("should return correct boundary", () => {
      expect(qt.getBoundary()).toEqual(boundary);
    });

    it("should return depth 0 for root", () => {
      expect(qt.getDepth()).toBe(0);
    });

    it("should track max depth after subdivisions", () => {
      // Insert enough to force subdivisions
      for (let i = 0; i < 20; i++) {
        qt.insert({ x: i * 4 + 1, y: i * 4 + 1, data: `item${i}` });
      }
      expect(qt.getMaxLeafDepth()).toBeGreaterThan(0);
    });
  });

  // ---- Edge Cases ----
  describe("Edge Cases", () => {
    it("should handle many items at same location", () => {
      for (let i = 0; i < 20; i++) {
        qt.insert({ x: 50, y: 50, data: `dup${i}` });
      }
      expect(qt.size).toBe(20);
      const results = qt.queryRadius(50, 50, 1);
      expect(results.length).toBe(20);
    });

    it("should handle custom maxItems", () => {
      const smallQt = new Quadtree<string>(boundary, { maxItems: 2 });
      smallQt.insert({ x: 10, y: 10, data: "A" });
      smallQt.insert({ x: 20, y: 20, data: "B" });
      smallQt.insert({ x: 30, y: 30, data: "C" });
      expect(smallQt.size).toBe(3);
    });

    it("should respect maxDepth", () => {
      const shallowQt = new Quadtree<string>(boundary, { maxItems: 1, maxDepth: 2 });
      for (let i = 0; i < 10; i++) {
        shallowQt.insert({ x: i + 1, y: i + 1, data: `item${i}` });
      }
      expect(shallowQt.getMaxLeafDepth()).toBeLessThanOrEqual(2);
      expect(shallowQt.size).toBe(10);
    });

    it("should work with float coordinates", () => {
      qt.insert({ x: 33.7, y: 67.2, data: "float" });
      const results = qt.queryRange({ x: 33, y: 67, width: 1, height: 1 });
      expect(results.length).toBe(1);
    });

    it("should handle tiny boundary", () => {
      const tinyQt = new Quadtree<string>({ x: 0, y: 0, width: 1, height: 1 });
      expect(tinyQt.insert({ x: 0.5, y: 0.5, data: "tiny" })).toBe(true);
      expect(tinyQt.size).toBe(1);
    });
  });
});
