import { describe, it, expect, beforeEach } from "vitest";
import {
  World,
  Components,
  MovementSystem,
  TimerSystem,
  HealthSystem,
} from "../engine/ecs";
import type {
  EntityId,
  PositionComponent,
  TimerComponent,
  System,
} from "../engine/ecs";

describe("Entity-Component System (ECS)", () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  // ---- Entity Management ----
  describe("Entity Management", () => {
    it("should start with 0 entities", () => {
      expect(world.getEntityCount()).toBe(0);
    });

    it("should create entities with unique IDs", () => {
      const e1 = world.createEntity();
      const e2 = world.createEntity();
      const e3 = world.createEntity();
      expect(e1).not.toBe(e2);
      expect(e2).not.toBe(e3);
      expect(e1).not.toBe(e3);
    });

    it("should increment entity count on create", () => {
      world.createEntity();
      expect(world.getEntityCount()).toBe(1);
      world.createEntity();
      expect(world.getEntityCount()).toBe(2);
    });

    it("should check entity existence", () => {
      const e = world.createEntity();
      expect(world.hasEntity(e)).toBe(true);
      expect(world.hasEntity(999)).toBe(false);
    });

    it("should destroy entity immediately", () => {
      const e = world.createEntity();
      world.destroyEntityNow(e);
      expect(world.hasEntity(e)).toBe(false);
      expect(world.getEntityCount()).toBe(0);
    });

    it("should defer destroy until after update", () => {
      const e = world.createEntity();
      world.destroyEntity(e);
      expect(world.hasEntity(e)).toBe(true); // still exists before update
      world.update(); // flush
      expect(world.hasEntity(e)).toBe(false);
    });

    it("should get all entities", () => {
      const e1 = world.createEntity();
      const e2 = world.createEntity();
      const all = world.getAllEntities();
      expect(all).toContain(e1);
      expect(all).toContain(e2);
      expect(all).toHaveLength(2);
    });
  });

  // ---- Component Management ----
  describe("Component Management", () => {
    let entity: EntityId;

    beforeEach(() => {
      entity = world.createEntity();
    });

    it("should add a component", () => {
      world.addComponent(entity, Components.position(10, 20));
      expect(world.hasComponent(entity, "position")).toBe(true);
    });

    it("should get a component", () => {
      world.addComponent(entity, Components.position(5, 10));
      const pos = world.getComponent<PositionComponent>(entity, "position");
      expect(pos!.x).toBe(5);
      expect(pos!.y).toBe(10);
    });

    it("should return undefined for missing component", () => {
      expect(world.getComponent(entity, "position")).toBeUndefined();
    });

    it("should remove a component", () => {
      world.addComponent(entity, Components.position(0, 0));
      world.removeComponent(entity, "position");
      expect(world.hasComponent(entity, "position")).toBe(false);
    });

    it("should overwrite component on re-add", () => {
      world.addComponent(entity, Components.position(5, 5));
      world.addComponent(entity, Components.position(10, 10));
      const pos = world.getComponent<PositionComponent>(entity, "position");
      expect(pos!.x).toBe(10);
    });

    it("should list all component types", () => {
      world.addComponent(entity, Components.position(0, 0));
      world.addComponent(entity, Components.velocity(1, 2));
      const types = world.getComponentTypes(entity);
      expect(types).toContain("position");
      expect(types).toContain("velocity");
    });

    it("should list all components", () => {
      world.addComponent(entity, Components.position(0, 0));
      world.addComponent(entity, Components.health(100));
      const comps = world.getComponents(entity);
      expect(comps).toHaveLength(2);
    });

    it("should not add component to non-existent entity", () => {
      world.addComponent(999, Components.position(0, 0));
      expect(world.hasComponent(999, "position")).toBe(false);
    });
  });

  // ---- Entity Queries ----
  describe("Entity Queries", () => {
    it("getEntitiesWith should find matching entities", () => {
      const e1 = world.createEntity();
      const e2 = world.createEntity();
      const e3 = world.createEntity();

      world.addComponent(e1, Components.position(0, 0));
      world.addComponent(e1, Components.velocity(1, 1));
      world.addComponent(e2, Components.position(5, 5));
      world.addComponent(e3, Components.health(100));

      const withPos = world.getEntitiesWith("position");
      expect(withPos).toContain(e1);
      expect(withPos).toContain(e2);
      expect(withPos).not.toContain(e3);

      const withPosVel = world.getEntitiesWith("position", "velocity");
      expect(withPosVel).toContain(e1);
      expect(withPosVel).not.toContain(e2);
    });

    it("getEntitiesWithAny should find entities with at least one component", () => {
      const e1 = world.createEntity();
      const e2 = world.createEntity();
      world.addComponent(e1, Components.position(0, 0));
      world.addComponent(e2, Components.health(50));

      const result = world.getEntitiesWithAny("position", "health");
      expect(result).toContain(e1);
      expect(result).toContain(e2);
    });

    it("getEntitiesWithout should exclude entities with given components", () => {
      const e1 = world.createEntity();
      const e2 = world.createEntity();
      world.addComponent(e1, Components.position(0, 0));
      // e2 has no components

      const withoutPos = world.getEntitiesWithout("position");
      expect(withoutPos).not.toContain(e1);
      expect(withoutPos).toContain(e2);
    });

    it("should return empty for non-matching query", () => {
      const e = world.createEntity();
      world.addComponent(e, Components.position(0, 0));
      expect(world.getEntitiesWith("velocity")).toHaveLength(0);
    });
  });

  // ---- Tag Management ----
  describe("Tag Management", () => {
    it("should add and check tags", () => {
      const e = world.createEntity();
      world.addTag(e, "enemy");
      expect(world.hasTag(e, "enemy")).toBe(true);
      expect(world.hasTag(e, "player")).toBe(false);
    });

    it("should remove tags", () => {
      const e = world.createEntity();
      world.addTag(e, "enemy");
      world.removeTag(e, "enemy");
      expect(world.hasTag(e, "enemy")).toBe(false);
    });

    it("should find entities by tag", () => {
      const e1 = world.createEntity();
      const e2 = world.createEntity();
      const e3 = world.createEntity();

      world.addTag(e1, "enemy");
      world.addTag(e2, "enemy");
      world.addTag(e3, "player");

      const enemies = world.getEntitiesByTag("enemy");
      expect(enemies).toContain(e1);
      expect(enemies).toContain(e2);
      expect(enemies).not.toContain(e3);
    });

    it("should list all tags for an entity", () => {
      const e = world.createEntity();
      world.addTag(e, "enemy");
      world.addTag(e, "flying");
      world.addTag(e, "boss");
      const tags = world.getTags(e);
      expect(tags).toContain("enemy");
      expect(tags).toContain("flying");
      expect(tags).toContain("boss");
    });
  });

  // ---- System Management ----
  describe("System Management", () => {
    it("should add a system", () => {
      const sys: System = () => {};
      world.addSystem(sys, "TestSystem");
      expect(world.getSystemCount()).toBe(1);
    });

    it("should remove a system", () => {
      const sys: System = () => {};
      world.addSystem(sys);
      world.removeSystem(sys);
      expect(world.getSystemCount()).toBe(0);
    });

    it("should sort systems by priority", () => {
      const s1: System = () => {};
      const s2: System = () => {};
      const s3: System = () => {};
      world.addSystem(s3, "s3", 30);
      world.addSystem(s1, "s1", 10);
      world.addSystem(s2, "s2", 20);
      expect(world.getSystemNames()).toEqual(["s1", "s2", "s3"]);
    });

    it("should execute all systems on update", () => {
      const calls: string[] = [];
      const s1: System = () => { calls.push("s1"); };
      const s2: System = () => { calls.push("s2"); };
      world.addSystem(s1, "s1");
      world.addSystem(s2, "s2");
      world.update();
      expect(calls).toEqual(["s1", "s2"]);
    });
  });

  // ---- Built-in Systems ----
  describe("MovementSystem", () => {
    it("should move entities by velocity", () => {
      world.addSystem(MovementSystem);
      const e = world.createEntity();
      world.addComponent(e, Components.position(10, 20));
      world.addComponent(e, Components.velocity(3, -2));

      world.update();

      const pos = world.getComponent<PositionComponent>(e, "position")!;
      expect(pos.x).toBe(13);
      expect(pos.y).toBe(18);
    });

    it("should not affect entities without velocity", () => {
      world.addSystem(MovementSystem);
      const e = world.createEntity();
      world.addComponent(e, Components.position(5, 5));

      world.update();

      const pos = world.getComponent<PositionComponent>(e, "position")!;
      expect(pos.x).toBe(5);
      expect(pos.y).toBe(5);
    });
  });

  describe("TimerSystem", () => {
    it("should count down timer", () => {
      world.addSystem(TimerSystem);
      const e = world.createEntity();
      world.addComponent(e, Components.timer(5, false));

      world.update();

      const timer = world.getComponent<TimerComponent>(e, "timer");
      if (timer) {
        expect(timer.remaining).toBe(4);
      }
    });

    it("should destroy entity when timer expires (non-looping)", () => {
      world.addSystem(TimerSystem);
      const e = world.createEntity();
      world.addComponent(e, Components.timer(2, false));

      world.update(); // remaining = 1
      world.update(); // remaining = 0 → destroys (deferred)
      world.update(); // flush

      expect(world.hasEntity(e)).toBe(false);
    });

    it("should reset looping timer", () => {
      world.addSystem(TimerSystem);
      const e = world.createEntity();
      world.addComponent(e, Components.timer(3, true));

      // Tick through complete cycle
      world.update(); // 2
      world.update(); // 1
      world.update(); // 0 → reset to 3
      world.update(); // 2

      const timer = world.getComponent<TimerComponent>(e, "timer");
      expect(timer).toBeDefined();
      expect(world.hasEntity(e)).toBe(true);
      expect(timer!.remaining).toBe(2);
    });
  });

  describe("HealthSystem", () => {
    it("should destroy entity with 0 HP", () => {
      world.addSystem(HealthSystem);
      const e = world.createEntity();
      world.addComponent(e, Components.health(0));

      world.update(); // deferred destroy
      world.update(); // flush

      expect(world.hasEntity(e)).toBe(false);
    });

    it("should keep entity with positive HP", () => {
      world.addSystem(HealthSystem);
      const e = world.createEntity();
      world.addComponent(e, Components.health(100));

      world.update();

      expect(world.hasEntity(e)).toBe(true);
    });
  });

  // ---- Components Factory ----
  describe("Components Factory", () => {
    it("position should have correct type and values", () => {
      const c = Components.position(3, 7);
      expect(c.type).toBe("position");
      expect(c.x).toBe(3);
      expect(c.y).toBe(7);
    });

    it("velocity should have correct type and values", () => {
      const c = Components.velocity(2, -1);
      expect(c.type).toBe("velocity");
      expect(c.vx).toBe(2);
      expect(c.vy).toBe(-1);
    });

    it("health should use maxHp = hp by default", () => {
      const c = Components.health(50);
      expect(c.type).toBe("health");
      expect(c.hp).toBe(50);
      expect(c.maxHp).toBe(50);
    });

    it("health should support custom maxHp", () => {
      const c = Components.health(30, 100);
      expect(c.hp).toBe(30);
      expect(c.maxHp).toBe(100);
    });

    it("render should have correct type and values", () => {
      const c = Components.render("#ff0000", 10, "🐉");
      expect(c.type).toBe("render");
      expect(c.color).toBe("#ff0000");
      expect(c.size).toBe(10);
      expect(c.icon).toBe("🐉");
      expect(c.visible).toBe(true);
    });

    it("timer should have correct type and values", () => {
      const c = Components.timer(30, true);
      expect(c.type).toBe("timer");
      expect(c.remaining).toBe(30);
      expect(c.total).toBe(30);
      expect(c.loop).toBe(true);
    });

    it("timer should default to non-looping", () => {
      const c = Components.timer(10);
      expect(c.loop).toBe(false);
    });

    it("tag should have correct type and value", () => {
      const c = Components.tag("enemy");
      expect(c.type).toBe("tag");
      expect(c.value).toBe("enemy");
    });
  });

  // ---- World Clear ----
  describe("World Clear", () => {
    it("should clear all entities, components, systems, tags", () => {
      const e = world.createEntity();
      world.addComponent(e, Components.position(0, 0));
      world.addTag(e, "test");
      world.addSystem(() => {});

      world.clear();

      expect(world.getEntityCount()).toBe(0);
      expect(world.getSystemCount()).toBe(0);
    });

    it("should allow creating entities after clear", () => {
      world.createEntity();
      world.clear();
      const newEntity = world.createEntity();
      expect(world.hasEntity(newEntity)).toBe(true);
      expect(world.getEntityCount()).toBe(1);
    });
  });

  // ---- Complex Integration ----
  describe("ECS Integration", () => {
    it("should run movement + health systems together", () => {
      world.addSystem(MovementSystem);
      world.addSystem(HealthSystem);

      // Living moving entity
      const moving = world.createEntity();
      world.addComponent(moving, Components.position(0, 0));
      world.addComponent(moving, Components.velocity(1, 0));
      world.addComponent(moving, Components.health(100));

      // Dead entity (HP = 0)
      const dead = world.createEntity();
      world.addComponent(dead, Components.position(5, 5));
      world.addComponent(dead, Components.health(0));

      // One update: moving entity moves, dead entity is queued for destroy, flush runs
      world.update();

      // Moving entity should have moved to (1, 0)
      const pos = world.getComponent<PositionComponent>(moving, "position")!;
      expect(pos.x).toBe(1);

      // Dead entity should be destroyed (flushed in same update)
      expect(world.hasEntity(dead)).toBe(false);
    });

    it("should handle many entities efficiently", () => {
      world.addSystem(MovementSystem);
      const entities: EntityId[] = [];
      for (let i = 0; i < 1000; i++) {
        const e = world.createEntity();
        world.addComponent(e, Components.position(i, 0));
        world.addComponent(e, Components.velocity(1, 0));
        entities.push(e);
      }

      world.update();

      // Check first and last
      const firstPos = world.getComponent<PositionComponent>(entities[0], "position")!;
      const lastPos = world.getComponent<PositionComponent>(entities[999], "position")!;
      expect(firstPos.x).toBe(1);
      expect(lastPos.x).toBe(1000);
    });

    it("should query by multiple component types", () => {
      for (let i = 0; i < 10; i++) {
        const e = world.createEntity();
        world.addComponent(e, Components.position(i, 0));
        if (i % 2 === 0) world.addComponent(e, Components.velocity(1, 0));
        if (i % 3 === 0) world.addComponent(e, Components.health(100));
      }

      const withBoth = world.getEntitiesWith("position", "velocity", "health");
      // entities 0, 6 have position + velocity + health (0%2=0 and 0%3=0, 6%2=0 and 6%3=0)
      expect(withBoth).toHaveLength(2);
    });
  });
});
