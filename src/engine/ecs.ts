/* ============================================
   ENTITY-COMPONENT SYSTEM (ECS)
   Data-oriented architecture for game objects
   ============================================ */

/** Unique entity identifier */
export type EntityId = number;

/** Component type tag (string identifier) */
export type ComponentType = string;

/** Base component interface — all components must have a `type` field */
export interface Component {
  readonly type: ComponentType;
}

/** System function — processes entities with matching components */
export type System = (world: World) => void;

/** System with optional priority for ordering */
export interface SystemEntry {
  system: System;
  priority: number;
  name: string;
}

/**
 * World — The central ECS registry
 *
 * Manages entities, components, and system execution order.
 */
export class World {
  private nextId = 1;
  private entities: Set<EntityId> = new Set();
  private components: Map<EntityId, Map<ComponentType, Component>> = new Map();
  private systems: SystemEntry[] = [];
  private tags: Map<EntityId, Set<string>> = new Map();
  private destroyQueue: EntityId[] = [];

  // ---- Entity Management ----

  /**
   * Create a new entity and return its ID
   */
  createEntity(): EntityId {
    const id = this.nextId++;
    this.entities.add(id);
    this.components.set(id, new Map());
    this.tags.set(id, new Set());
    return id;
  }

  /**
   * Destroy an entity (deferred until end of current update)
   */
  destroyEntity(id: EntityId): void {
    this.destroyQueue.push(id);
  }

  /**
   * Immediately destroy an entity (use inside systems with care)
   */
  destroyEntityNow(id: EntityId): void {
    this.entities.delete(id);
    this.components.delete(id);
    this.tags.delete(id);
  }

  /**
   * Check if an entity exists
   */
  hasEntity(id: EntityId): boolean {
    return this.entities.has(id);
  }

  /**
   * Get total active entity count
   */
  getEntityCount(): number {
    return this.entities.size;
  }

  /**
   * Get all entity IDs
   */
  getAllEntities(): EntityId[] {
    return Array.from(this.entities);
  }

  // ---- Component Management ----

  /**
   * Add a component to an entity
   */
  addComponent<T extends Component>(entity: EntityId, component: T): void {
    if (!this.entities.has(entity)) return;
    this.components.get(entity)!.set(component.type, component);
  }

  /**
   * Remove a component from an entity
   */
  removeComponent(entity: EntityId, type: ComponentType): void {
    this.components.get(entity)?.delete(type);
  }

  /**
   * Get a component from an entity
   */
  getComponent<T extends Component>(entity: EntityId, type: ComponentType): T | undefined {
    return this.components.get(entity)?.get(type) as T | undefined;
  }

  /**
   * Check if an entity has a component
   */
  hasComponent(entity: EntityId, type: ComponentType): boolean {
    return this.components.get(entity)?.has(type) ?? false;
  }

  /**
   * Get all components for an entity
   */
  getComponents(entity: EntityId): Component[] {
    return Array.from(this.components.get(entity)?.values() ?? []);
  }

  /**
   * Get all component types for an entity
   */
  getComponentTypes(entity: EntityId): ComponentType[] {
    return Array.from(this.components.get(entity)?.keys() ?? []);
  }

  // ---- Entity Queries ----

  /**
   * Get all entities that have ALL of the specified component types
   */
  getEntitiesWith(...types: ComponentType[]): EntityId[] {
    const result: EntityId[] = [];
    for (const entity of this.entities) {
      const comps = this.components.get(entity)!;
      if (types.every((t) => comps.has(t))) {
        result.push(entity);
      }
    }
    return result;
  }

  /**
   * Get all entities that have ANY of the specified component types
   */
  getEntitiesWithAny(...types: ComponentType[]): EntityId[] {
    const result: EntityId[] = [];
    for (const entity of this.entities) {
      const comps = this.components.get(entity)!;
      if (types.some((t) => comps.has(t))) {
        result.push(entity);
      }
    }
    return result;
  }

  /**
   * Get all entities that do NOT have any of the specified component types
   */
  getEntitiesWithout(...types: ComponentType[]): EntityId[] {
    const result: EntityId[] = [];
    for (const entity of this.entities) {
      const comps = this.components.get(entity)!;
      if (types.every((t) => !comps.has(t))) {
        result.push(entity);
      }
    }
    return result;
  }

  // ---- Tag Management ----

  /**
   * Add a tag to an entity (lightweight string label)
   */
  addTag(entity: EntityId, tag: string): void {
    this.tags.get(entity)?.add(tag);
  }

  /**
   * Remove a tag from an entity
   */
  removeTag(entity: EntityId, tag: string): void {
    this.tags.get(entity)?.delete(tag);
  }

  /**
   * Check if an entity has a tag
   */
  hasTag(entity: EntityId, tag: string): boolean {
    return this.tags.get(entity)?.has(tag) ?? false;
  }

  /**
   * Get all entities with a specific tag
   */
  getEntitiesByTag(tag: string): EntityId[] {
    const result: EntityId[] = [];
    for (const [entity, tagSet] of this.tags) {
      if (tagSet.has(tag)) {
        result.push(entity);
      }
    }
    return result;
  }

  /**
   * Get all tags for an entity
   */
  getTags(entity: EntityId): string[] {
    return Array.from(this.tags.get(entity) ?? []);
  }

  // ---- System Management ----

  /**
   * Add a system to the world
   */
  addSystem(system: System, name = "unnamed", priority = 0): void {
    this.systems.push({ system, name, priority });
    this.systems.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Remove a system by reference
   */
  removeSystem(system: System): void {
    this.systems = this.systems.filter((s) => s.system !== system);
  }

  /**
   * Get system count
   */
  getSystemCount(): number {
    return this.systems.length;
  }

  /**
   * Get system names in priority order
   */
  getSystemNames(): string[] {
    return this.systems.map((s) => s.name);
  }

  // ---- World Update ----

  /**
   * Run all systems once, then process deferred destroys
   */
  update(): void {
    for (const entry of this.systems) {
      entry.system(this);
    }
    this.flushDestroyQueue();
  }

  /**
   * Clear everything — entities, components, systems, tags
   */
  clear(): void {
    this.entities.clear();
    this.components.clear();
    this.tags.clear();
    this.systems = [];
    this.destroyQueue = [];
    this.nextId = 1;
  }

  // ---- Private ----

  private flushDestroyQueue(): void {
    for (const id of this.destroyQueue) {
      this.destroyEntityNow(id);
    }
    this.destroyQueue = [];
  }
}

// ---- Common Built-in Components ----

/** Position component */
export interface PositionComponent extends Component {
  readonly type: "position";
  x: number;
  y: number;
}

/** Velocity component */
export interface VelocityComponent extends Component {
  readonly type: "velocity";
  vx: number;
  vy: number;
}

/** Health component */
export interface HealthComponent extends Component {
  readonly type: "health";
  hp: number;
  maxHp: number;
}

/** Render component */
export interface RenderComponent extends Component {
  readonly type: "render";
  color: string;
  size: number;
  icon?: string;
  visible: boolean;
}

/** Timer component */
export interface TimerComponent extends Component {
  readonly type: "timer";
  remaining: number;
  total: number;
  loop: boolean;
}

/** Tag component (for type identification) */
export interface TagComponent extends Component {
  readonly type: "tag";
  value: string;
}

/**
 * Factory helpers for common components
 */
export const Components = {
  position: (x: number, y: number): PositionComponent => ({
    type: "position",
    x,
    y,
  }),

  velocity: (vx: number, vy: number): VelocityComponent => ({
    type: "velocity",
    vx,
    vy,
  }),

  health: (hp: number, maxHp?: number): HealthComponent => ({
    type: "health",
    hp,
    maxHp: maxHp ?? hp,
  }),

  render: (color: string, size: number, icon?: string): RenderComponent => ({
    type: "render",
    color,
    size,
    icon,
    visible: true,
  }),

  timer: (frames: number, loop = false): TimerComponent => ({
    type: "timer",
    remaining: frames,
    total: frames,
    loop,
  }),

  tag: (value: string): TagComponent => ({
    type: "tag",
    value,
  }),
};

// ---- Common Built-in Systems ----

/**
 * Movement system — applies velocity to position
 */
export const MovementSystem: System = (world: World) => {
  for (const entity of world.getEntitiesWith("position", "velocity")) {
    const pos = world.getComponent<PositionComponent>(entity, "position")!;
    const vel = world.getComponent<VelocityComponent>(entity, "velocity")!;
    pos.x += vel.vx;
    pos.y += vel.vy;
  }
};

/**
 * Timer system — counts down timers and destroys entity when timer hits 0 (if not loop)
 */
export const TimerSystem: System = (world: World) => {
  for (const entity of world.getEntitiesWith("timer")) {
    const timer = world.getComponent<TimerComponent>(entity, "timer")!;
    timer.remaining--;
    if (timer.remaining <= 0) {
      if (timer.loop) {
        timer.remaining = timer.total;
      } else {
        world.destroyEntity(entity);
      }
    }
  }
};

/**
 * Health system — destroys entities with HP <= 0
 */
export const HealthSystem: System = (world: World) => {
  for (const entity of world.getEntitiesWith("health")) {
    const health = world.getComponent<HealthComponent>(entity, "health")!;
    if (health.hp <= 0) {
      world.destroyEntity(entity);
    }
  }
};
