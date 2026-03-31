/* ============================================
   QUADTREE — Spatial Indexing
   ============================================ */

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface QuadtreeItem<T> {
  x: number;
  y: number;
  data: T;
}

const DEFAULT_MAX_ITEMS = 4;
const DEFAULT_MAX_DEPTH = 8;

/**
 * Quadtree for efficient spatial queries (range search, nearest neighbor)
 */
export class Quadtree<T> {
  private boundary: Rectangle;
  private items: QuadtreeItem<T>[] = [];
  private children: Quadtree<T>[] | null = null;
  private maxItems: number;
  private maxDepth: number;
  private depth: number;

  constructor(
    boundary: Rectangle,
    options: { maxItems?: number; maxDepth?: number; depth?: number } = {},
  ) {
    this.boundary = { ...boundary };
    this.maxItems = options.maxItems ?? DEFAULT_MAX_ITEMS;
    this.maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
    this.depth = options.depth ?? 0;
  }

  /**
   * Insert an item into the quadtree
   */
  insert(item: QuadtreeItem<T>): boolean {
    // Item must be within boundary
    if (!this.containsPoint(item.x, item.y)) {
      return false;
    }

    // If no children and not at capacity, add here
    if (this.children === null && this.items.length < this.maxItems) {
      this.items.push(item);
      return true;
    }

    // Subdivide if needed
    if (this.children === null) {
      if (this.depth >= this.maxDepth) {
        // At max depth, just add
        this.items.push(item);
        return true;
      }
      this.subdivide();
    }

    // Try to insert into a child
    for (const child of this.children!) {
      if (child.insert(item)) {
        return true;
      }
    }

    // Shouldn't happen if containsPoint passed
    return false;
  }

  /**
   * Query all items within a rectangular range
   */
  queryRange(range: Rectangle): QuadtreeItem<T>[] {
    const found: QuadtreeItem<T>[] = [];
    this.queryRangeInternal(range, found);
    return found;
  }

  private queryRangeInternal(range: Rectangle, found: QuadtreeItem<T>[]): void {
    if (!this.intersectsRect(range)) {
      return;
    }

    for (const item of this.items) {
      if (rectContainsPoint(range, item.x, item.y)) {
        found.push(item);
      }
    }

    if (this.children) {
      for (const child of this.children) {
        child.queryRangeInternal(range, found);
      }
    }
  }

  /**
   * Query all items within a circular range
   */
  queryRadius(cx: number, cy: number, radius: number): QuadtreeItem<T>[] {
    const found: QuadtreeItem<T>[] = [];
    // Use bounding box for initial cull
    const range: Rectangle = {
      x: cx - radius,
      y: cy - radius,
      width: radius * 2,
      height: radius * 2,
    };
    this.queryRadiusInternal(cx, cy, radius * radius, range, found);
    return found;
  }

  private queryRadiusInternal(
    cx: number,
    cy: number,
    radiusSq: number,
    range: Rectangle,
    found: QuadtreeItem<T>[],
  ): void {
    if (!this.intersectsRect(range)) {
      return;
    }

    for (const item of this.items) {
      const dx = item.x - cx;
      const dy = item.y - cy;
      if (dx * dx + dy * dy <= radiusSq) {
        found.push(item);
      }
    }

    if (this.children) {
      for (const child of this.children) {
        child.queryRadiusInternal(cx, cy, radiusSq, range, found);
      }
    }
  }

  /**
   * Find the nearest item to a point
   */
  findNearest(x: number, y: number): QuadtreeItem<T> | null {
    const state = { bestItem: null as QuadtreeItem<T> | null, bestDistSq: Infinity };
    this.findNearestInternal(x, y, state);
    return state.bestItem;
  }

  private findNearestInternal(
    x: number,
    y: number,
    state: { bestItem: QuadtreeItem<T> | null; bestDistSq: number },
  ): void {
    for (const item of this.items) {
      const dx = item.x - x;
      const dy = item.y - y;
      const distSq = dx * dx + dy * dy;
      if (distSq < state.bestDistSq) {
        state.bestDistSq = distSq;
        state.bestItem = item;
      }
    }

    if (this.children) {
      // Sort children by distance to search closer ones first
      const sorted = [...this.children].sort((a, b) => {
        const aDist = a.distToPointSq(x, y);
        const bDist = b.distToPointSq(x, y);
        return aDist - bDist;
      });

      for (const child of sorted) {
        // Prune if nearest point in child boundary is farther than current best
        if (child.distToPointSq(x, y) >= state.bestDistSq) {
          continue;
        }
        child.findNearestInternal(x, y, state);
      }
    }
  }

  /**
   * Get total number of items in the tree
   */
  get size(): number {
    let count = this.items.length;
    if (this.children) {
      for (const child of this.children) {
        count += child.size;
      }
    }
    return count;
  }

  /**
   * Get all items in the tree
   */
  getAllItems(): QuadtreeItem<T>[] {
    const all: QuadtreeItem<T>[] = [...this.items];
    if (this.children) {
      for (const child of this.children) {
        all.push(...child.getAllItems());
      }
    }
    return all;
  }

  /**
   * Clear all items from the tree
   */
  clear(): void {
    this.items = [];
    this.children = null;
  }

  /**
   * Get the boundary of this quadtree node
   */
  getBoundary(): Readonly<Rectangle> {
    return this.boundary;
  }

  /**
   * Get the depth of this node
   */
  getDepth(): number {
    return this.depth;
  }

  /**
   * Get the maximum depth of any leaf in the tree
   */
  getMaxLeafDepth(): number {
    if (!this.children) return this.depth;
    return Math.max(...this.children.map((c) => c.getMaxLeafDepth()));
  }

  // ---- Private ----

  private subdivide(): void {
    const { x, y, width, height } = this.boundary;
    const hw = width / 2;
    const hh = height / 2;

    const childOpts = {
      maxItems: this.maxItems,
      maxDepth: this.maxDepth,
      depth: this.depth + 1,
    };

    this.children = [
      new Quadtree<T>({ x, y, width: hw, height: hh }, childOpts), // NW
      new Quadtree<T>({ x: x + hw, y, width: hw, height: hh }, childOpts), // NE
      new Quadtree<T>({ x, y: y + hh, width: hw, height: hh }, childOpts), // SW
      new Quadtree<T>({ x: x + hw, y: y + hh, width: hw, height: hh }, childOpts), // SE
    ];

    // Redistribute existing items
    const existingItems = this.items;
    this.items = [];
    for (const item of existingItems) {
      let inserted = false;
      for (const child of this.children) {
        if (child.insert(item)) {
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        // Keep in this node (edge case: item exactly on subdivision boundary)
        this.items.push(item);
      }
    }
  }

  private containsPoint(px: number, py: number): boolean {
    return rectContainsPoint(this.boundary, px, py);
  }

  private intersectsRect(other: Rectangle): boolean {
    return !(
      other.x + other.width <= this.boundary.x ||
      other.x >= this.boundary.x + this.boundary.width ||
      other.y + other.height <= this.boundary.y ||
      other.y >= this.boundary.y + this.boundary.height
    );
  }

  private distToPointSq(px: number, py: number): number {
    const cx = Math.max(this.boundary.x, Math.min(px, this.boundary.x + this.boundary.width));
    const cy = Math.max(this.boundary.y, Math.min(py, this.boundary.y + this.boundary.height));
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy;
  }
}

function rectContainsPoint(rect: Rectangle, px: number, py: number): boolean {
  return (
    px >= rect.x &&
    px < rect.x + rect.width &&
    py >= rect.y &&
    py < rect.y + rect.height
  );
}
