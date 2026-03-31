/* ============================================
   A* PATHFINDING ENGINE
   ============================================ */

export interface PathNode {
  x: number;
  y: number;
}

interface AStarNode {
  x: number;
  y: number;
  g: number; // cost from start
  h: number; // heuristic cost to goal
  f: number; // total cost (g + h)
  parent: AStarNode | null;
}

export interface PathfindingGrid {
  width: number;
  height: number;
  isWalkable: (x: number, y: number) => boolean;
}

/**
 * Manhattan distance heuristic
 */
export function manhattanDistance(ax: number, ay: number, bx: number, by: number): number {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

/**
 * Euclidean distance heuristic
 */
export function euclideanDistance(ax: number, ay: number, bx: number, by: number): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

/**
 * Chebyshev distance heuristic (allows diagonal movement at cost 1)
 */
export function chebyshevDistance(ax: number, ay: number, bx: number, by: number): number {
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
}

export type HeuristicFn = (ax: number, ay: number, bx: number, by: number) => number;

// 4-directional neighbors (up, right, down, left)
const DIRS_4: [number, number][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

// 8-directional neighbors (includes diagonals)
const DIRS_8: [number, number][] = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

/**
 * A* pathfinding algorithm
 *
 * @param grid - The grid to search on
 * @param startX - Start X coordinate
 * @param startY - Start Y coordinate
 * @param goalX - Goal X coordinate
 * @param goalY - Goal Y coordinate
 * @param options - Configuration options
 * @returns Array of path nodes from start to goal, or null if no path exists
 */
export function findPath(
  grid: PathfindingGrid,
  startX: number,
  startY: number,
  goalX: number,
  goalY: number,
  options: {
    heuristic?: HeuristicFn;
    allowDiagonal?: boolean;
    maxIterations?: number;
  } = {},
): PathNode[] | null {
  const { heuristic = manhattanDistance, allowDiagonal = false, maxIterations = 10000 } = options;

  // Validate bounds
  if (
    startX < 0 ||
    startX >= grid.width ||
    startY < 0 ||
    startY >= grid.height ||
    goalX < 0 ||
    goalX >= grid.width ||
    goalY < 0 ||
    goalY >= grid.height
  ) {
    return null;
  }

  // Check if start or goal is blocked
  if (!grid.isWalkable(startX, startY) || !grid.isWalkable(goalX, goalY)) {
    return null;
  }

  // Same start and goal
  if (startX === goalX && startY === goalY) {
    return [{ x: startX, y: startY }];
  }

  const dirs = allowDiagonal ? DIRS_8 : DIRS_4;

  const openSet: AStarNode[] = [];
  const closedSet = new Set<string>();

  const startNode: AStarNode = {
    x: startX,
    y: startY,
    g: 0,
    h: heuristic(startX, startY, goalX, goalY),
    f: heuristic(startX, startY, goalX, goalY),
    parent: null,
  };

  openSet.push(startNode);

  let iterations = 0;

  while (openSet.length > 0 && iterations < maxIterations) {
    iterations++;

    // Find node with lowest f score
    let lowestIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (
        openSet[i].f < openSet[lowestIdx].f ||
        (openSet[i].f === openSet[lowestIdx].f && openSet[i].h < openSet[lowestIdx].h)
      ) {
        lowestIdx = i;
      }
    }

    const current = openSet[lowestIdx];

    // Goal reached
    if (current.x === goalX && current.y === goalY) {
      return reconstructPath(current);
    }

    // Move from open to closed
    openSet.splice(lowestIdx, 1);
    closedSet.add(`${current.x},${current.y}`);

    // Explore neighbors
    for (const [dx, dy] of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;

      // Bounds check
      if (nx < 0 || nx >= grid.width || ny < 0 || ny >= grid.height) continue;

      // Skip non-walkable
      if (!grid.isWalkable(nx, ny)) continue;

      // Skip if in closed set
      if (closedSet.has(`${nx},${ny}`)) continue;

      // Calculate costs
      const moveCost = dx !== 0 && dy !== 0 ? Math.SQRT2 : 1;
      const tentativeG = current.g + moveCost;
      const h = heuristic(nx, ny, goalX, goalY);

      // Check if already in open set with lower cost
      const existingIdx = openSet.findIndex((n) => n.x === nx && n.y === ny);
      if (existingIdx !== -1) {
        if (tentativeG < openSet[existingIdx].g) {
          openSet[existingIdx].g = tentativeG;
          openSet[existingIdx].f = tentativeG + h;
          openSet[existingIdx].parent = current;
        }
        continue;
      }

      openSet.push({
        x: nx,
        y: ny,
        g: tentativeG,
        h,
        f: tentativeG + h,
        parent: current,
      });
    }
  }

  // No path found
  return null;
}

/**
 * Reconstruct path from goal node back to start
 */
function reconstructPath(node: AStarNode): PathNode[] {
  const path: PathNode[] = [];
  let current: AStarNode | null = node;
  while (current) {
    path.unshift({ x: current.x, y: current.y });
    current = current.parent;
  }
  return path;
}

/**
 * Check if a path exists between two points (faster than findPath for existence checks)
 */
export function hasPath(
  grid: PathfindingGrid,
  startX: number,
  startY: number,
  goalX: number,
  goalY: number,
  allowDiagonal = false,
): boolean {
  return findPath(grid, startX, startY, goalX, goalY, { allowDiagonal }) !== null;
}

/**
 * Create a PathfindingGrid from a 2D boolean array
 * true = walkable, false = blocked
 */
export function createGridFromArray(data: boolean[][]): PathfindingGrid {
  const height = data.length;
  const width = height > 0 ? data[0].length : 0;
  return {
    width,
    height,
    isWalkable: (x: number, y: number) => {
      if (y < 0 || y >= height || x < 0 || x >= width) return false;
      return data[y][x];
    },
  };
}

/**
 * Get the path length (sum of segment distances)
 */
export function getPathLength(path: PathNode[]): number {
  if (path.length < 2) return 0;
  let length = 0;
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].x - path[i - 1].x;
    const dy = path[i].y - path[i - 1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}
