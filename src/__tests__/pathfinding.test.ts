import { describe, it, expect } from "vitest";
import {
  findPath,
  hasPath,
  createGridFromArray,
  manhattanDistance,
  euclideanDistance,
  chebyshevDistance,
  getPathLength,
} from "../engine/pathfinding";
import type { PathfindingGrid } from "../engine/pathfinding";

describe("Pathfinding — A* Algorithm", () => {
  // ---- Helper ----
  function makeGrid(map: string[]): PathfindingGrid {
    // '.' = walkable, '#' = blocked
    const data = map.map((row) => row.split("").map((c) => c === "."));
    return createGridFromArray(data);
  }

  // ---- Heuristic Functions ----
  describe("Heuristic Functions", () => {
    it("manhattanDistance should compute correctly", () => {
      expect(manhattanDistance(0, 0, 3, 4)).toBe(7);
      expect(manhattanDistance(0, 0, 0, 0)).toBe(0);
      expect(manhattanDistance(1, 1, 4, 5)).toBe(7);
      expect(manhattanDistance(5, 3, 2, 1)).toBe(5);
    });

    it("euclideanDistance should compute correctly", () => {
      expect(euclideanDistance(0, 0, 3, 4)).toBe(5);
      expect(euclideanDistance(0, 0, 0, 0)).toBe(0);
      expect(euclideanDistance(0, 0, 1, 0)).toBe(1);
    });

    it("chebyshevDistance should compute correctly", () => {
      expect(chebyshevDistance(0, 0, 3, 4)).toBe(4);
      expect(chebyshevDistance(0, 0, 0, 0)).toBe(0);
      expect(chebyshevDistance(0, 0, 5, 3)).toBe(5);
    });
  });

  // ---- createGridFromArray ----
  describe("createGridFromArray", () => {
    it("should create a grid from boolean array", () => {
      const data = [
        [true, false],
        [true, true],
      ];
      const grid = createGridFromArray(data);
      expect(grid.width).toBe(2);
      expect(grid.height).toBe(2);
      expect(grid.isWalkable(0, 0)).toBe(true);
      expect(grid.isWalkable(1, 0)).toBe(false);
      expect(grid.isWalkable(0, 1)).toBe(true);
      expect(grid.isWalkable(1, 1)).toBe(true);
    });

    it("should handle empty arrays", () => {
      const grid = createGridFromArray([]);
      expect(grid.width).toBe(0);
      expect(grid.height).toBe(0);
    });

    it("should return false for out-of-bounds", () => {
      const grid = createGridFromArray([[true]]);
      expect(grid.isWalkable(-1, 0)).toBe(false);
      expect(grid.isWalkable(0, -1)).toBe(false);
      expect(grid.isWalkable(1, 0)).toBe(false);
      expect(grid.isWalkable(0, 1)).toBe(false);
    });
  });

  // ---- findPath — Basic ----
  describe("findPath — Basic", () => {
    it("should find straight-line path", () => {
      const grid = makeGrid([".....", ".....", "....."]);
      const path = findPath(grid, 0, 1, 4, 1);
      expect(path).not.toBeNull();
      expect(path![0]).toEqual({ x: 0, y: 1 });
      expect(path![path!.length - 1]).toEqual({ x: 4, y: 1 });
    });

    it("should find path around obstacle", () => {
      const grid = makeGrid(["...", ".#.", "..."]);
      const path = findPath(grid, 0, 0, 2, 2);
      expect(path).not.toBeNull();
      expect(path![0]).toEqual({ x: 0, y: 0 });
      expect(path![path!.length - 1]).toEqual({ x: 2, y: 2 });
      // Should not go through (1,1) which is blocked
      const throughCenter = path!.some((n) => n.x === 1 && n.y === 1);
      expect(throughCenter).toBe(false);
    });

    it("should return null when no path exists", () => {
      const grid = makeGrid(["...", "###", "..."]);
      const path = findPath(grid, 0, 0, 2, 2);
      expect(path).toBeNull();
    });

    it("should return single node for same start and goal", () => {
      const grid = makeGrid(["..."]);
      const path = findPath(grid, 1, 0, 1, 0);
      expect(path).toEqual([{ x: 1, y: 0 }]);
    });

    it("should return null when start is blocked", () => {
      const grid = makeGrid(["#.."]);
      const path = findPath(grid, 0, 0, 2, 0);
      expect(path).toBeNull();
    });

    it("should return null when goal is blocked", () => {
      const grid = makeGrid(["..#"]);
      const path = findPath(grid, 0, 0, 2, 0);
      expect(path).toBeNull();
    });

    it("should return null for out-of-bounds start", () => {
      const grid = makeGrid(["..."]);
      expect(findPath(grid, -1, 0, 2, 0)).toBeNull();
      expect(findPath(grid, 0, -1, 2, 0)).toBeNull();
      expect(findPath(grid, 3, 0, 2, 0)).toBeNull();
      expect(findPath(grid, 0, 1, 2, 0)).toBeNull();
    });

    it("should return null for out-of-bounds goal", () => {
      const grid = makeGrid(["..."]);
      expect(findPath(grid, 0, 0, -1, 0)).toBeNull();
      expect(findPath(grid, 0, 0, 3, 0)).toBeNull();
    });
  });

  // ---- findPath — Complex Mazes ----
  describe("findPath — Complex", () => {
    it("should find path through a maze", () => {
      const grid = makeGrid([
        "..#..",
        ".#...",
        "..#.#",
        ".....",
        "#.#..",
      ]);
      const path = findPath(grid, 0, 0, 4, 4);
      expect(path).not.toBeNull();
      expect(path![0]).toEqual({ x: 0, y: 0 });
      expect(path![path!.length - 1]).toEqual({ x: 4, y: 4 });
    });

    it("should handle corridor paths", () => {
      const grid = makeGrid([
        ".####",
        ".#...",
        ".#.#.",
        "...#.",
        "####.",
      ]);
      const path = findPath(grid, 0, 0, 4, 4);
      expect(path).not.toBeNull();
    });

    it("should find optimal path length", () => {
      const grid = makeGrid([
        "...",
        "...",
        "...",
      ]);
      const path = findPath(grid, 0, 0, 2, 0);
      expect(path).not.toBeNull();
      expect(path!.length).toBe(3); // 3 cells: (0,0) -> (1,0) -> (2,0)
    });
  });

  // ---- findPath — Diagonal ----
  describe("findPath — Diagonal", () => {
    it("should find diagonal path when allowed", () => {
      const grid = makeGrid(["...", "...", "..."]);
      const path = findPath(grid, 0, 0, 2, 2, { allowDiagonal: true });
      expect(path).not.toBeNull();
      // Diagonal path should be shorter
      expect(path!.length).toBeLessThanOrEqual(3);
    });

    it("should not use diagonals by default", () => {
      const grid = makeGrid(["...", "...", "..."]);
      const path = findPath(grid, 0, 0, 2, 2, { allowDiagonal: false });
      expect(path).not.toBeNull();
      // Without diagonal, needs at least 5 steps
      expect(path!.length).toBeGreaterThanOrEqual(5);
    });
  });

  // ---- findPath — Options ----
  describe("findPath — Options", () => {
    it("should respect maxIterations", () => {
      const grid = makeGrid([
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
      ]);
      // Very low iteration limit should fail on large grids
      const path = findPath(grid, 0, 0, 9, 4, { maxIterations: 2 });
      expect(path).toBeNull();
    });

    it("should work with euclidean heuristic", () => {
      const grid = makeGrid(["...", "...", "..."]);
      const path = findPath(grid, 0, 0, 2, 2, { heuristic: euclideanDistance });
      expect(path).not.toBeNull();
      expect(path![0]).toEqual({ x: 0, y: 0 });
      expect(path![path!.length - 1]).toEqual({ x: 2, y: 2 });
    });

    it("should work with chebyshev heuristic", () => {
      const grid = makeGrid(["...", "...", "..."]);
      const path = findPath(grid, 0, 0, 2, 2, {
        heuristic: chebyshevDistance,
        allowDiagonal: true,
      });
      expect(path).not.toBeNull();
    });
  });

  // ---- hasPath ----
  describe("hasPath", () => {
    it("should return true when path exists", () => {
      const grid = makeGrid(["...", "...", "..."]);
      expect(hasPath(grid, 0, 0, 2, 2)).toBe(true);
    });

    it("should return false when no path exists", () => {
      const grid = makeGrid(["...", "###", "..."]);
      expect(hasPath(grid, 0, 0, 2, 2)).toBe(false);
    });

    it("should support diagonal mode", () => {
      const grid = makeGrid(["...", "...", "..."]);
      expect(hasPath(grid, 0, 0, 2, 2, true)).toBe(true);
    });
  });

  // ---- getPathLength ----
  describe("getPathLength", () => {
    it("should return 0 for empty path", () => {
      expect(getPathLength([])).toBe(0);
    });

    it("should return 0 for single node", () => {
      expect(getPathLength([{ x: 0, y: 0 }])).toBe(0);
    });

    it("should compute length for straight path", () => {
      const path = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ];
      expect(getPathLength(path)).toBe(2);
    });

    it("should compute length for L-shaped path", () => {
      const path = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ];
      expect(getPathLength(path)).toBe(2);
    });

    it("should compute length for diagonal path", () => {
      const path = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ];
      expect(getPathLength(path)).toBeCloseTo(Math.SQRT2, 5);
    });
  });

  // ---- Edge Cases ----
  describe("Edge Cases", () => {
    it("should handle 1x1 grid with same start/goal", () => {
      const grid = makeGrid(["."]);
      const path = findPath(grid, 0, 0, 0, 0);
      expect(path).toEqual([{ x: 0, y: 0 }]);
    });

    it("should handle narrow corridor", () => {
      const grid = makeGrid(["....."]);
      const path = findPath(grid, 0, 0, 4, 0);
      expect(path).not.toBeNull();
      expect(path!.length).toBe(5);
    });

    it("should handle vertical corridor", () => {
      const grid = makeGrid([".", ".", ".", ".", "."]);
      const path = findPath(grid, 0, 0, 0, 4);
      expect(path).not.toBeNull();
      expect(path!.length).toBe(5);
    });

    it("should handle large open grid", () => {
      const rows = Array(20).fill(".".repeat(20));
      const grid = makeGrid(rows);
      const path = findPath(grid, 0, 0, 19, 19);
      expect(path).not.toBeNull();
    });
  });
});
