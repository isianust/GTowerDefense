/* ============================================
   LEVELS — 50 unique levels with paths & waves
   ============================================ */

import type { Level } from "../types";

// Grid is 20 cols × 12 rows (each cell 48×48 at base)
// Path is array of {x, y} grid coordinates enemies walk through
// Waves define enemy types and counts

export const LEVELS: Level[] = [

    // ---- Level 1: The Meadow ----
    {
        name: "The Meadow",
        cols: 20, rows: 12,
        startGold: 150,
        lives: 20,
        path: [
            {x:0,y:5},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5},
            {x:5,y:5},{x:5,y:4},{x:5,y:3},{x:5,y:2},{x:6,y:2},
            {x:7,y:2},{x:8,y:2},{x:9,y:2},{x:10,y:2},{x:10,y:3},
            {x:10,y:4},{x:10,y:5},{x:10,y:6},{x:10,y:7},{x:11,y:7},
            {x:12,y:7},{x:13,y:7},{x:14,y:7},{x:15,y:7},{x:15,y:6},
            {x:15,y:5},{x:15,y:4},{x:16,y:4},{x:17,y:4},{x:18,y:4},{x:19,y:4}
        ],
        waves: [
            { enemies: [{ type: "goblin", count: 8, interval: 60 }] },
            { enemies: [{ type: "goblin", count: 12, interval: 50 }] },
            { enemies: [{ type: "goblin", count: 10, interval: 45 }, { type: "orc", count: 3, interval: 90 }] },
        ],
        terrain: [
            { type: "tree", cells: [{x:2,y:1},{x:3,y:8},{x:8,y:0},{x:13,y:3},{x:17,y:8}] },
            { type: "rock", cells: [{x:7,y:9},{x:16,y:1}] }
        ],
        bg: "#1a3a1a"
    },
    // ---- Level 2: Forest Trail ----
    {
        name: "Forest Trail",
        cols: 20, rows: 12,
        startGold: 175,
        lives: 20,
        path: [
            {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:3,y:2},
            {x:3,y:3},{x:3,y:4},{x:3,y:5},{x:3,y:6},{x:3,y:7},
            {x:4,y:7},{x:5,y:7},{x:6,y:7},{x:7,y:7},{x:8,y:7},
            {x:8,y:6},{x:8,y:5},{x:8,y:4},{x:8,y:3},{x:9,y:3},
            {x:10,y:3},{x:11,y:3},{x:12,y:3},{x:13,y:3},{x:13,y:4},
            {x:13,y:5},{x:13,y:6},{x:13,y:7},{x:13,y:8},{x:13,y:9},
            {x:14,y:9},{x:15,y:9},{x:16,y:9},{x:17,y:9},{x:18,y:9},{x:19,y:9}
        ],
        waves: [
            { enemies: [{ type: "goblin", count: 10, interval: 55 }] },
            { enemies: [{ type: "goblin", count: 8, interval: 50 }, { type: "orc", count: 5, interval: 80 }] },
            { enemies: [{ type: "orc", count: 8, interval: 60 }, { type: "wolf", count: 4, interval: 70 }] },
            { enemies: [{ type: "goblin", count: 15, interval: 35 }, { type: "orc", count: 5, interval: 60 }] },
        ],
        bg: "#0f2f0f"
    },
    // ---- Level 3: Desert Crossing ----
    {
        name: "Desert Crossing",
        cols: 20, rows: 12,
        startGold: 200,
        lives: 18,
        path: [
            {x:0,y:10},{x:1,y:10},{x:2,y:10},{x:3,y:10},{x:4,y:10},
            {x:5,y:10},{x:6,y:10},{x:6,y:9},{x:6,y:8},{x:6,y:7},
            {x:6,y:6},{x:6,y:5},{x:6,y:4},{x:7,y:4},{x:8,y:4},
            {x:9,y:4},{x:10,y:4},{x:11,y:4},{x:12,y:4},{x:12,y:5},
            {x:12,y:6},{x:12,y:7},{x:12,y:8},{x:13,y:8},{x:14,y:8},
            {x:15,y:8},{x:16,y:8},{x:16,y:7},{x:16,y:6},{x:16,y:5},
            {x:16,y:4},{x:16,y:3},{x:16,y:2},{x:17,y:2},{x:18,y:2},{x:19,y:2}
        ],
        waves: [
            { enemies: [{ type: "goblin", count: 12, interval: 45 }] },
            { enemies: [{ type: "orc", count: 8, interval: 60 }, { type: "wolf", count: 3, interval: 80 }] },
            { enemies: [{ type: "wolf", count: 8, interval: 50 }, { type: "goblin", count: 10, interval: 40 }] },
            { enemies: [{ type: "orc", count: 10, interval: 50 }, { type: "darkKnight", count: 2, interval: 120 }] },
        ],
        bg: "#2f2810"
    },
    // ---- Level 4: River Bridge ----
    {
        name: "River Bridge",
        cols: 20, rows: 12,
        startGold: 200,
        lives: 18,
        path: [
            {x:0,y:6},{x:1,y:6},{x:2,y:6},{x:2,y:5},{x:2,y:4},
            {x:2,y:3},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},
            {x:6,y:2},{x:7,y:2},{x:7,y:3},{x:7,y:4},{x:7,y:5},
            {x:7,y:6},{x:7,y:7},{x:7,y:8},{x:7,y:9},{x:8,y:9},
            {x:9,y:9},{x:10,y:9},{x:11,y:9},{x:12,y:9},{x:12,y:8},
            {x:12,y:7},{x:12,y:6},{x:12,y:5},{x:13,y:5},{x:14,y:5},
            {x:15,y:5},{x:16,y:5},{x:17,y:5},{x:18,y:5},{x:19,y:5}
        ],
        waves: [
            { enemies: [{ type: "goblin", count: 15, interval: 40 }] },
            { enemies: [{ type: "orc", count: 10, interval: 55 }, { type: "wolf", count: 5, interval: 65 }] },
            { enemies: [{ type: "wolf", count: 10, interval: 45 }, { type: "darkKnight", count: 3, interval: 100 }] },
            { enemies: [{ type: "darkKnight", count: 5, interval: 80 }, { type: "orc", count: 10, interval: 45 }] },
            { enemies: [{ type: "goblin", count: 20, interval: 25 }, { type: "darkKnight", count: 4, interval: 90 }] },
        ],
        terrain: [
            { type: "river", cells: [{x:9,y:0},{x:9,y:1},{x:9,y:2},{x:9,y:3},{x:9,y:4},{x:9,y:5},{x:9,y:6},{x:9,y:7},{x:9,y:8},{x:9,y:10},{x:9,y:11}] },
            { type: "bridge", cells: [{x:9,y:9}] },
            { type: "tree", cells: [{x:4,y:0},{x:16,y:8}] }
        ],
        bg: "#0f1f2f"
    },
    // ---- Level 5: Mountain Pass ----
    {
        name: "Mountain Pass",
        cols: 20, rows: 12,
        startGold: 225,
        lives: 17,
        path: [
            {x:10,y:0},{x:10,y:1},{x:10,y:2},{x:9,y:2},{x:8,y:2},
            {x:7,y:2},{x:6,y:2},{x:5,y:2},{x:4,y:2},{x:3,y:2},
            {x:3,y:3},{x:3,y:4},{x:3,y:5},{x:3,y:6},{x:4,y:6},
            {x:5,y:6},{x:6,y:6},{x:7,y:6},{x:8,y:6},{x:9,y:6},
            {x:10,y:6},{x:11,y:6},{x:12,y:6},{x:13,y:6},{x:14,y:6},
            {x:14,y:7},{x:14,y:8},{x:14,y:9},{x:14,y:10},{x:15,y:10},
            {x:16,y:10},{x:17,y:10},{x:18,y:10},{x:19,y:10}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 10, interval: 55 }, { type: "wolf", count: 5, interval: 60 }] },
            { enemies: [{ type: "wolf", count: 10, interval: 40 }, { type: "darkKnight", count: 4, interval: 80 }] },
            { enemies: [{ type: "darkKnight", count: 6, interval: 70 }, { type: "goblin", count: 15, interval: 30 }] },
            { enemies: [{ type: "troll", count: 2, interval: 150 }, { type: "orc", count: 12, interval: 40 }] },
            { enemies: [{ type: "wolf", count: 15, interval: 30 }, { type: "troll", count: 3, interval: 120 }] },
        ],
        terrain: [
            { type: "mountain", cells: [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:18,y:0},{x:19,y:0},{x:18,y:1},{x:19,y:1},{x:7,y:0},{x:8,y:0}] },
            { type: "rock", cells: [{x:5,y:8},{x:6,y:9},{x:11,y:3}] }
        ],
        bg: "#1a1a2e"
    },
    // ---- Level 6: Haunted Marsh ----
    {
        name: "Haunted Marsh",
        cols: 20, rows: 12,
        startGold: 250,
        lives: 15,
        path: [
            {x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},
            {x:4,y:3},{x:4,y:4},{x:4,y:5},{x:4,y:6},{x:4,y:7},
            {x:4,y:8},{x:5,y:8},{x:6,y:8},{x:7,y:8},{x:8,y:8},
            {x:9,y:8},{x:10,y:8},{x:10,y:7},{x:10,y:6},{x:10,y:5},
            {x:10,y:4},{x:10,y:3},{x:10,y:2},{x:11,y:2},{x:12,y:2},
            {x:13,y:2},{x:14,y:2},{x:15,y:2},{x:15,y:3},{x:15,y:4},
            {x:15,y:5},{x:15,y:6},{x:15,y:7},{x:15,y:8},{x:15,y:9},
            {x:16,y:9},{x:17,y:9},{x:18,y:9},{x:19,y:9}
        ],
        waves: [
            { enemies: [{ type: "wolf", count: 12, interval: 40 }, { type: "darkKnight", count: 5, interval: 70 }] },
            { enemies: [{ type: "darkKnight", count: 8, interval: 55 }, { type: "troll", count: 2, interval: 120 }] },
            { enemies: [{ type: "goblin", count: 25, interval: 20 }, { type: "orc", count: 10, interval: 40 }] },
            { enemies: [{ type: "troll", count: 4, interval: 90 }, { type: "darkKnight", count: 6, interval: 60 }] },
            { enemies: [{ type: "wolf", count: 15, interval: 25 }, { type: "troll", count: 3, interval: 100 }, { type: "darkKnight", count: 5, interval: 70 }] },
            { enemies: [{ type: "demon", count: 1, interval: 200 }, { type: "darkKnight", count: 8, interval: 50 }] },
        ],
        bg: "#121a12"
    },
    // ---- Level 7: Volcanic Ridge ----
    {
        name: "Volcanic Ridge",
        cols: 20, rows: 12,
        startGold: 275,
        lives: 15,
        path: [
            {x:0,y:8},{x:1,y:8},{x:2,y:8},{x:2,y:7},{x:2,y:6},
            {x:2,y:5},{x:2,y:4},{x:2,y:3},{x:3,y:3},{x:4,y:3},
            {x:5,y:3},{x:6,y:3},{x:7,y:3},{x:7,y:4},{x:7,y:5},
            {x:7,y:6},{x:7,y:7},{x:7,y:8},{x:7,y:9},{x:8,y:9},
            {x:9,y:9},{x:10,y:9},{x:11,y:9},{x:12,y:9},{x:12,y:8},
            {x:12,y:7},{x:12,y:6},{x:12,y:5},{x:12,y:4},{x:12,y:3},
            {x:13,y:3},{x:14,y:3},{x:15,y:3},{x:16,y:3},{x:17,y:3},
            {x:17,y:4},{x:17,y:5},{x:17,y:6},{x:18,y:6},{x:19,y:6}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 15, interval: 35 }, { type: "darkKnight", count: 5, interval: 60 }] },
            { enemies: [{ type: "troll", count: 4, interval: 80 }, { type: "wolf", count: 12, interval: 30 }] },
            { enemies: [{ type: "darkKnight", count: 10, interval: 45 }, { type: "troll", count: 3, interval: 100 }] },
            { enemies: [{ type: "demon", count: 2, interval: 150 }, { type: "orc", count: 15, interval: 30 }] },
            { enemies: [{ type: "wolf", count: 20, interval: 20 }, { type: "troll", count: 5, interval: 80 }] },
            { enemies: [{ type: "demon", count: 2, interval: 120 }, { type: "darkKnight", count: 10, interval: 40 }] },
        ],
        terrain: [
            { type: "mountain", cells: [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:19,y:0},{x:19,y:1},{x:10,y:0},{x:10,y:1}] },
            { type: "rock", cells: [{x:5,y:5},{x:14,y:7},{x:3,y:10},{x:16,y:10}] }
        ],
        bg: "#2a0f0f"
    },
    // ---- Level 8: Frozen Tundra ----
    {
        name: "Frozen Tundra",
        cols: 20, rows: 12,
        startGold: 300,
        lives: 14,
        path: [
            {x:19,y:1},{x:18,y:1},{x:17,y:1},{x:16,y:1},{x:15,y:1},
            {x:14,y:1},{x:13,y:1},{x:13,y:2},{x:13,y:3},{x:13,y:4},
            {x:13,y:5},{x:12,y:5},{x:11,y:5},{x:10,y:5},{x:9,y:5},
            {x:8,y:5},{x:7,y:5},{x:6,y:5},{x:6,y:6},{x:6,y:7},
            {x:6,y:8},{x:6,y:9},{x:6,y:10},{x:7,y:10},{x:8,y:10},
            {x:9,y:10},{x:10,y:10},{x:11,y:10},{x:12,y:10},{x:13,y:10},
            {x:14,y:10},{x:15,y:10},{x:16,y:10},{x:17,y:10},{x:18,y:10},{x:19,y:10}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 10, interval: 45 }, { type: "troll", count: 3, interval: 90 }] },
            { enemies: [{ type: "wolf", count: 20, interval: 20 }, { type: "orc", count: 10, interval: 35 }] },
            { enemies: [{ type: "troll", count: 5, interval: 70 }, { type: "demon", count: 2, interval: 130 }] },
            { enemies: [{ type: "goblin", count: 30, interval: 15 }, { type: "darkKnight", count: 8, interval: 50 }] },
            { enemies: [{ type: "demon", count: 3, interval: 100 }, { type: "troll", count: 5, interval: 70 }] },
            { enemies: [{ type: "darkKnight", count: 15, interval: 30 }, { type: "demon", count: 3, interval: 90 }] },
            { enemies: [{ type: "dragon", count: 1, interval: 300 }, { type: "troll", count: 5, interval: 60 }] },
        ],
        terrain: [
            { type: "river", cells: [{x:3,y:0},{x:3,y:1},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:3,y:5},{x:3,y:6},{x:3,y:7},{x:3,y:8},{x:3,y:9},{x:3,y:10},{x:3,y:11}] },
            { type: "mountain", cells: [{x:0,y:9},{x:1,y:9},{x:0,y:10},{x:0,y:11},{x:1,y:10},{x:1,y:11}] }
        ],
        bg: "#0f1a2a"
    },
    // ---- Level 9: Shadow Citadel ----
    {
        name: "Shadow Citadel",
        cols: 20, rows: 12,
        startGold: 325,
        lives: 12,
        path: [
            {x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},
            {x:4,y:1},{x:4,y:2},{x:4,y:3},{x:4,y:4},{x:3,y:4},
            {x:2,y:4},{x:1,y:4},{x:1,y:5},{x:1,y:6},{x:1,y:7},
            {x:1,y:8},{x:2,y:8},{x:3,y:8},{x:4,y:8},{x:5,y:8},
            {x:6,y:8},{x:7,y:8},{x:8,y:8},{x:9,y:8},{x:10,y:8},
            {x:10,y:7},{x:10,y:6},{x:10,y:5},{x:10,y:4},{x:11,y:4},
            {x:12,y:4},{x:13,y:4},{x:14,y:4},{x:15,y:4},{x:15,y:5},
            {x:15,y:6},{x:15,y:7},{x:15,y:8},{x:15,y:9},{x:15,y:10},
            {x:16,y:10},{x:17,y:10},{x:18,y:10},{x:19,y:10}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 12, interval: 35 }, { type: "troll", count: 5, interval: 60 }] },
            { enemies: [{ type: "demon", count: 3, interval: 90 }, { type: "wolf", count: 15, interval: 25 }] },
            { enemies: [{ type: "troll", count: 6, interval: 55 }, { type: "demon", count: 3, interval: 80 }] },
            { enemies: [{ type: "goblin", count: 40, interval: 12 }, { type: "darkKnight", count: 10, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 1, interval: 250 }, { type: "demon", count: 3, interval: 80 }, { type: "troll", count: 5, interval: 60 }] },
            { enemies: [{ type: "demon", count: 5, interval: 60 }, { type: "darkKnight", count: 15, interval: 25 }] },
            { enemies: [{ type: "dragon", count: 2, interval: 200 }, { type: "demon", count: 4, interval: 70 }] },
        ],
        bg: "#10051a"
    },
    // ---- Level 10: Dragon's Lair ----
    {
        name: "Dragon's Lair",
        cols: 20, rows: 12,
        startGold: 400,
        lives: 10,
        path: [
            {x:0,y:6},{x:1,y:6},{x:2,y:6},{x:2,y:5},{x:2,y:4},
            {x:2,y:3},{x:2,y:2},{x:2,y:1},{x:3,y:1},{x:4,y:1},
            {x:5,y:1},{x:6,y:1},{x:7,y:1},{x:8,y:1},{x:8,y:2},
            {x:8,y:3},{x:8,y:4},{x:8,y:5},{x:8,y:6},{x:8,y:7},
            {x:8,y:8},{x:8,y:9},{x:8,y:10},{x:9,y:10},{x:10,y:10},
            {x:11,y:10},{x:12,y:10},{x:12,y:9},{x:12,y:8},{x:12,y:7},
            {x:12,y:6},{x:12,y:5},{x:12,y:4},{x:12,y:3},{x:12,y:2},
            {x:12,y:1},{x:13,y:1},{x:14,y:1},{x:15,y:1},{x:16,y:1},
            {x:17,y:1},{x:17,y:2},{x:17,y:3},{x:17,y:4},{x:17,y:5},
            {x:17,y:6},{x:17,y:7},{x:17,y:8},{x:17,y:9},{x:17,y:10},
            {x:18,y:10},{x:19,y:10}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 15, interval: 30 }, { type: "troll", count: 6, interval: 55 }] },
            { enemies: [{ type: "demon", count: 4, interval: 70 }, { type: "darkKnight", count: 15, interval: 25 }] },
            { enemies: [{ type: "troll", count: 8, interval: 45 }, { type: "demon", count: 4, interval: 65 }] },
            { enemies: [{ type: "goblin", count: 50, interval: 10 }, { type: "wolf", count: 20, interval: 20 }] },
            { enemies: [{ type: "dragon", count: 2, interval: 150 }, { type: "demon", count: 5, interval: 55 }] },
            { enemies: [{ type: "demon", count: 6, interval: 50 }, { type: "troll", count: 8, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 2, interval: 120 }, { type: "demon", count: 5, interval: 50 }, { type: "darkKnight", count: 15, interval: 25 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 100 }, { type: "demon", count: 6, interval: 45 }, { type: "troll", count: 8, interval: 35 }] },
        ],
        bg: "#1a0505"
    },
    // ---- Level 11: Crystal Cave ----
    {
        name: "Crystal Cave",
        cols: 20, rows: 12,
        startGold: 200,
        lives: 18,
        path: [
            {x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},
            {x:5,y:2},{x:5,y:3},{x:5,y:4},{x:5,y:5},{x:5,y:6},
            {x:6,y:6},{x:7,y:6},{x:8,y:6},{x:9,y:6},{x:10,y:6},
            {x:11,y:6},{x:12,y:6},{x:13,y:6},{x:14,y:6},{x:14,y:7},
            {x:14,y:8},{x:14,y:9},{x:15,y:9},{x:16,y:9},{x:17,y:9},
            {x:18,y:9},{x:19,y:9}
        ],
        waves: [
            { enemies: [{ type: "goblin", count: 10, interval: 45 }, { type: "orc", count: 3, interval: 70 }] },
            { enemies: [{ type: "orc", count: 8, interval: 50 }, { type: "wolf", count: 4, interval: 60 }] },
            { enemies: [{ type: "wolf", count: 7, interval: 40 }, { type: "darkKnight", count: 3, interval: 80 }] },
            { enemies: [{ type: "darkKnight", count: 5, interval: 60 }, { type: "orc", count: 10, interval: 35 }] }
        ],
        terrain: [
            { type: "rock", cells: [{x:18,y:10},{x:2,y:6},{x:5,y:0},{x:3,y:0},{x:18,y:4},{x:8,y:2}] },
            { type: "mountain", cells: [{x:11,y:11},{x:1,y:3},{x:11,y:3}] },
            { type: "river", cells: [{x:0,y:11},{x:1,y:11},{x:2,y:11},{x:3,y:11},{x:4,y:11},{x:5,y:11},{x:6,y:11},{x:7,y:11},{x:8,y:11},{x:9,y:11},{x:10,y:11},{x:12,y:11},{x:13,y:11},{x:14,y:11},{x:15,y:11},{x:16,y:11},{x:17,y:11},{x:18,y:11},{x:19,y:11}] },
            { type: "bridge", cells: [{x:14,y:7}] }
        ],
        bg: "#1a2a3a"
    },
    // ---- Level 12: Misty Valley ----
    {
        name: "Misty Valley",
        cols: 20, rows: 12,
        startGold: 210,
        lives: 18,
        path: [
            {x:3,y:0},{x:3,y:1},{x:3,y:2},{x:3,y:3},{x:4,y:3},
            {x:5,y:3},{x:6,y:3},{x:7,y:3},{x:8,y:3},{x:9,y:3},
            {x:9,y:4},{x:9,y:5},{x:9,y:6},{x:9,y:7},{x:8,y:7},
            {x:7,y:7},{x:6,y:7},{x:5,y:7},{x:4,y:7},{x:3,y:7},
            {x:3,y:8},{x:3,y:9},{x:3,y:10},{x:3,y:11}
        ],
        waves: [
            { enemies: [{ type: "goblin", count: 12, interval: 45 }, { type: "orc", count: 3, interval: 70 }] },
            { enemies: [{ type: "orc", count: 10, interval: 50 }, { type: "wolf", count: 5, interval: 60 }] },
            { enemies: [{ type: "wolf", count: 9, interval: 40 }, { type: "darkKnight", count: 4, interval: 80 }] },
            { enemies: [{ type: "darkKnight", count: 6, interval: 60 }, { type: "orc", count: 12, interval: 35 }] }
        ],
        terrain: [
            { type: "mountain", cells: [{x:14,y:9},{x:11,y:0},{x:6,y:0}] },
            { type: "rock", cells: [{x:4,y:2},{x:11,y:11},{x:16,y:9},{x:18,y:8}] }
        ],
        bg: "#1a3a2a"
    },
    // ---- Level 13: Ancient Forest ----
    {
        name: "Ancient Forest",
        cols: 20, rows: 12,
        startGold: 221,
        lives: 17,
        path: [
            {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},
            {x:5,y:1},{x:6,y:1},{x:6,y:2},{x:6,y:3},{x:6,y:4},
            {x:6,y:5},{x:6,y:6},{x:6,y:7},{x:6,y:8},{x:6,y:9},
            {x:6,y:10},{x:7,y:10},{x:8,y:10},{x:9,y:10},{x:10,y:10},
            {x:11,y:10},{x:12,y:10},{x:13,y:10},{x:13,y:9},{x:13,y:8},
            {x:13,y:7},{x:13,y:6},{x:13,y:5},{x:13,y:4},{x:13,y:3},
            {x:14,y:3},{x:15,y:3},{x:16,y:3},{x:17,y:3},{x:18,y:3},
            {x:19,y:3}
        ],
        waves: [
            { enemies: [{ type: "goblin", count: 14, interval: 45 }, { type: "orc", count: 3, interval: 70 }] },
            { enemies: [{ type: "orc", count: 12, interval: 50 }, { type: "wolf", count: 6, interval: 60 }] },
            { enemies: [{ type: "wolf", count: 11, interval: 40 }, { type: "darkKnight", count: 5, interval: 80 }] },
            { enemies: [{ type: "darkKnight", count: 7, interval: 60 }, { type: "orc", count: 14, interval: 35 }, { type: "troll", count: 1, interval: 120 }] },
            { enemies: [{ type: "troll", count: 2, interval: 100 }, { type: "darkKnight", count: 8, interval: 50 }] }
        ],
        terrain: [
            { type: "river", cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:8,y:0},{x:9,y:0},{x:10,y:0},{x:11,y:0},{x:12,y:0},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:17,y:0},{x:18,y:0},{x:19,y:0}] },
            { type: "bridge", cells: [{x:3,y:1}] },
            { type: "tree", cells: [{x:8,y:6},{x:11,y:6},{x:4,y:5},{x:4,y:3},{x:11,y:8},{x:1,y:11}] }
        ],
        bg: "#0a2a0a"
    },
    // ---- Level 14: Coral Reef ----
    {
        name: "Coral Reef",
        cols: 20, rows: 12,
        startGold: 231,
        lives: 17,
        path: [
            {x:1,y:11},{x:1,y:10},{x:1,y:9},{x:1,y:8},{x:2,y:8},
            {x:3,y:8},{x:4,y:8},{x:5,y:8},{x:6,y:8},{x:6,y:7},
            {x:6,y:6},{x:6,y:5},{x:6,y:4},{x:6,y:3},{x:7,y:3},
            {x:8,y:3},{x:9,y:3},{x:10,y:3},{x:11,y:3},{x:11,y:4},
            {x:11,y:5},{x:11,y:6},{x:11,y:7},{x:11,y:8},{x:12,y:8},
            {x:13,y:8},{x:14,y:8},{x:15,y:8},{x:16,y:8},{x:16,y:7},
            {x:16,y:6},{x:16,y:5},{x:16,y:4},{x:16,y:3},{x:16,y:2},
            {x:16,y:1},{x:16,y:0}
        ],
        waves: [
            { enemies: [{ type: "goblin", count: 16, interval: 45 }, { type: "orc", count: 3, interval: 70 }] },
            { enemies: [{ type: "orc", count: 14, interval: 50 }, { type: "wolf", count: 7, interval: 60 }] },
            { enemies: [{ type: "wolf", count: 13, interval: 40 }, { type: "darkKnight", count: 6, interval: 80 }] },
            { enemies: [{ type: "darkKnight", count: 8, interval: 60 }, { type: "orc", count: 16, interval: 35 }, { type: "troll", count: 2, interval: 120 }] },
            { enemies: [{ type: "troll", count: 3, interval: 100 }, { type: "darkKnight", count: 9, interval: 50 }] }
        ],
        terrain: [
            { type: "bridge", cells: [{x:8,y:3}] },
            { type: "tree", cells: [{x:12,y:4},{x:7,y:0},{x:10,y:8},{x:3,y:5},{x:17,y:1},{x:12,y:6}] },
            { type: "rock", cells: [{x:5,y:1},{x:17,y:6},{x:0,y:0}] },
            { type: "mountain", cells: [{x:1,y:4},{x:1,y:1},{x:13,y:3},{x:9,y:2}] }
        ],
        bg: "#0a2a3a"
    },
    // ---- Level 15: Thunderstorm Peak ----
    {
        name: "Thunderstorm Peak",
        cols: 20, rows: 12,
        startGold: 241,
        lives: 17,
        path: [
            {x:19,y:1},{x:18,y:1},{x:17,y:1},{x:16,y:1},{x:15,y:1},
            {x:14,y:1},{x:14,y:2},{x:14,y:3},{x:14,y:4},{x:14,y:5},
            {x:13,y:5},{x:12,y:5},{x:11,y:5},{x:10,y:5},{x:9,y:5},
            {x:8,y:5},{x:7,y:5},{x:6,y:5},{x:5,y:5},{x:5,y:6},
            {x:5,y:7},{x:5,y:8},{x:5,y:9},{x:6,y:9},{x:7,y:9},
            {x:8,y:9},{x:9,y:9},{x:10,y:9},{x:11,y:9},{x:12,y:9},
            {x:13,y:9},{x:14,y:9},{x:15,y:9},{x:15,y:10},{x:15,y:11},
            {x:16,y:11},{x:17,y:11},{x:18,y:11},{x:19,y:11}
        ],
        waves: [
            { enemies: [{ type: "goblin", count: 18, interval: 45 }, { type: "orc", count: 3, interval: 70 }] },
            { enemies: [{ type: "orc", count: 16, interval: 50 }, { type: "wolf", count: 8, interval: 60 }] },
            { enemies: [{ type: "wolf", count: 15, interval: 40 }, { type: "darkKnight", count: 7, interval: 80 }] },
            { enemies: [{ type: "darkKnight", count: 9, interval: 60 }, { type: "orc", count: 18, interval: 35 }, { type: "troll", count: 3, interval: 120 }] },
            { enemies: [{ type: "troll", count: 4, interval: 100 }, { type: "darkKnight", count: 10, interval: 50 }, { type: "dragon", count: 1, interval: 250 }] }
        ],
        terrain: [
            { type: "tree", cells: [{x:19,y:5},{x:6,y:4},{x:19,y:6},{x:6,y:3},{x:12,y:6},{x:16,y:10}] },
            { type: "rock", cells: [{x:8,y:11},{x:0,y:0},{x:13,y:1}] }
        ],
        bg: "#1a1a3a"
    },
    // ---- Level 16: Goblin Fortress ----
    {
        name: "Goblin Fortress",
        cols: 20, rows: 12,
        startGold: 251,
        lives: 16,
        path: [
            {x:2,y:0},{x:2,y:1},{x:2,y:2},{x:2,y:3},{x:2,y:4},
            {x:2,y:5},{x:2,y:6},{x:2,y:7},{x:2,y:8},{x:2,y:9},
            {x:3,y:9},{x:4,y:9},{x:5,y:9},{x:6,y:9},{x:7,y:9},
            {x:8,y:9},{x:9,y:9},{x:10,y:9},{x:10,y:8},{x:10,y:7},
            {x:10,y:6},{x:10,y:5},{x:10,y:4},{x:10,y:3},{x:10,y:2},
            {x:11,y:2},{x:12,y:2},{x:13,y:2},{x:14,y:2},{x:15,y:2},
            {x:16,y:2},{x:17,y:2},{x:17,y:3},{x:17,y:4},{x:17,y:5},
            {x:17,y:6},{x:17,y:7},{x:17,y:8},{x:17,y:9},{x:17,y:10},
            {x:17,y:11}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 12, interval: 40 }, { type: "wolf", count: 8, interval: 50 }] },
            { enemies: [{ type: "darkKnight", count: 8, interval: 45 }, { type: "troll", count: 3, interval: 90 }] },
            { enemies: [{ type: "goblin", count: 22, interval: 20 }, { type: "demon", count: 2, interval: 100 }] },
            { enemies: [{ type: "demon", count: 3, interval: 80 }, { type: "troll", count: 5, interval: 70 }] },
            { enemies: [{ type: "wolf", count: 17, interval: 25 }, { type: "darkKnight", count: 10, interval: 35 }] }
        ],
        terrain: [
            { type: "rock", cells: [{x:0,y:1},{x:6,y:10},{x:5,y:8}] },
            { type: "mountain", cells: [{x:18,y:4},{x:0,y:4},{x:0,y:0},{x:5,y:11}] },
            { type: "river", cells: [{x:19,y:0},{x:19,y:1},{x:19,y:2},{x:19,y:3},{x:19,y:4},{x:19,y:5},{x:19,y:6},{x:19,y:7},{x:19,y:8},{x:19,y:9},{x:19,y:10},{x:19,y:11}] }
        ],
        bg: "#2a1a0a"
    },
    // ---- Level 17: Cursed Cemetery ----
    {
        name: "Cursed Cemetery",
        cols: 20, rows: 12,
        startGold: 262,
        lives: 16,
        path: [
            {x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},
            {x:4,y:3},{x:4,y:4},{x:4,y:5},{x:4,y:6},{x:4,y:7},
            {x:4,y:8},{x:4,y:9},{x:5,y:9},{x:6,y:9},{x:7,y:9},
            {x:8,y:9},{x:9,y:9},{x:10,y:9},{x:10,y:8},{x:10,y:7},
            {x:10,y:6},{x:10,y:5},{x:10,y:4},{x:11,y:4},{x:12,y:4},
            {x:13,y:4},{x:14,y:4},{x:15,y:4},{x:16,y:4},{x:16,y:5},
            {x:16,y:6},{x:16,y:7},{x:16,y:8},{x:16,y:9},{x:16,y:10},
            {x:16,y:11}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 14, interval: 40 }, { type: "wolf", count: 9, interval: 50 }] },
            { enemies: [{ type: "darkKnight", count: 9, interval: 45 }, { type: "troll", count: 3, interval: 90 }] },
            { enemies: [{ type: "goblin", count: 24, interval: 20 }, { type: "demon", count: 2, interval: 100 }] },
            { enemies: [{ type: "demon", count: 3, interval: 80 }, { type: "troll", count: 5, interval: 70 }] },
            { enemies: [{ type: "wolf", count: 19, interval: 25 }, { type: "darkKnight", count: 11, interval: 35 }] }
        ],
        terrain: [
            { type: "mountain", cells: [{x:3,y:1},{x:10,y:1},{x:9,y:6},{x:2,y:8}] },
            { type: "river", cells: [{x:17,y:0},{x:17,y:1},{x:17,y:2},{x:17,y:3},{x:17,y:4},{x:17,y:5},{x:17,y:6},{x:17,y:7},{x:17,y:8},{x:17,y:9},{x:17,y:10},{x:17,y:11}] },
            { type: "bridge", cells: [{x:12,y:4}] },
            { type: "tree", cells: [{x:7,y:2},{x:4,y:10},{x:5,y:0}] }
        ],
        bg: "#1a0a1a"
    },
    // ---- Level 18: Dark Swamp ----
    {
        name: "Dark Swamp",
        cols: 20, rows: 12,
        startGold: 272,
        lives: 16,
        path: [
            {x:5,y:0},{x:5,y:1},{x:5,y:2},{x:5,y:3},{x:6,y:3},
            {x:7,y:3},{x:8,y:3},{x:9,y:3},{x:10,y:3},{x:11,y:3},
            {x:12,y:3},{x:13,y:3},{x:14,y:3},{x:15,y:3},{x:15,y:4},
            {x:15,y:5},{x:15,y:6},{x:15,y:7},{x:14,y:7},{x:13,y:7},
            {x:12,y:7},{x:11,y:7},{x:10,y:7},{x:9,y:7},{x:8,y:7},
            {x:7,y:7},{x:6,y:7},{x:5,y:7},{x:5,y:8},{x:5,y:9},
            {x:5,y:10},{x:5,y:11}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 16, interval: 40 }, { type: "wolf", count: 10, interval: 50 }] },
            { enemies: [{ type: "darkKnight", count: 10, interval: 45 }, { type: "troll", count: 4, interval: 90 }] },
            { enemies: [{ type: "goblin", count: 26, interval: 20 }, { type: "demon", count: 3, interval: 100 }] },
            { enemies: [{ type: "demon", count: 4, interval: 80 }, { type: "troll", count: 6, interval: 70 }] },
            { enemies: [{ type: "wolf", count: 21, interval: 25 }, { type: "darkKnight", count: 12, interval: 35 }] }
        ],
        terrain: [
            { type: "river", cells: [{x:18,y:0},{x:18,y:1},{x:18,y:2},{x:18,y:3},{x:18,y:4},{x:18,y:5},{x:18,y:6},{x:18,y:7},{x:18,y:8},{x:18,y:9},{x:18,y:10},{x:18,y:11}] },
            { type: "bridge", cells: [{x:12,y:7}] }
        ],
        bg: "#0a1a0a"
    },
    // ---- Level 19: Underground Mine ----
    {
        name: "Underground Mine",
        cols: 20, rows: 12,
        startGold: 282,
        lives: 15,
        path: [
            {x:0,y:10},{x:1,y:10},{x:2,y:10},{x:3,y:10},{x:4,y:10},
            {x:4,y:9},{x:4,y:8},{x:4,y:7},{x:4,y:6},{x:4,y:5},
            {x:4,y:4},{x:4,y:3},{x:4,y:2},{x:5,y:2},{x:6,y:2},
            {x:7,y:2},{x:8,y:2},{x:9,y:2},{x:9,y:3},{x:9,y:4},
            {x:9,y:5},{x:9,y:6},{x:9,y:7},{x:9,y:8},{x:9,y:9},
            {x:10,y:9},{x:11,y:9},{x:12,y:9},{x:13,y:9},{x:14,y:9},
            {x:14,y:8},{x:14,y:7},{x:14,y:6},{x:14,y:5},{x:14,y:4},
            {x:14,y:3},{x:14,y:2},{x:14,y:1},{x:15,y:1},{x:16,y:1},
            {x:17,y:1},{x:18,y:1},{x:19,y:1}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 18, interval: 40 }, { type: "wolf", count: 11, interval: 50 }] },
            { enemies: [{ type: "darkKnight", count: 11, interval: 45 }, { type: "troll", count: 4, interval: 90 }] },
            { enemies: [{ type: "goblin", count: 28, interval: 20 }, { type: "demon", count: 3, interval: 100 }] },
            { enemies: [{ type: "demon", count: 4, interval: 80 }, { type: "troll", count: 6, interval: 70 }] },
            { enemies: [{ type: "wolf", count: 23, interval: 25 }, { type: "darkKnight", count: 13, interval: 35 }] },
            { enemies: [{ type: "dragon", count: 1, interval: 150 }, { type: "demon", count: 5, interval: 60 }] }
        ],
        terrain: [
            { type: "bridge", cells: [{x:14,y:4}] },
            { type: "tree", cells: [{x:13,y:4},{x:13,y:0},{x:13,y:3}] },
            { type: "rock", cells: [{x:8,y:7},{x:2,y:11},{x:17,y:7},{x:18,y:5}] }
        ],
        bg: "#1a1a0a"
    },
    // ---- Level 20: The Abyss ----
    {
        name: "The Abyss",
        cols: 20, rows: 12,
        startGold: 292,
        lives: 15,
        path: [
            {x:19,y:1},{x:18,y:1},{x:17,y:1},{x:16,y:1},{x:15,y:1},
            {x:14,y:1},{x:13,y:1},{x:12,y:1},{x:11,y:1},{x:10,y:1},
            {x:9,y:1},{x:8,y:1},{x:7,y:1},{x:6,y:1},{x:5,y:1},
            {x:4,y:1},{x:4,y:2},{x:4,y:3},{x:4,y:4},{x:4,y:5},
            {x:5,y:5},{x:6,y:5},{x:7,y:5},{x:8,y:5},{x:9,y:5},
            {x:10,y:5},{x:11,y:5},{x:12,y:5},{x:13,y:5},{x:14,y:5},
            {x:15,y:5},{x:15,y:6},{x:15,y:7},{x:15,y:8},{x:15,y:9},
            {x:14,y:9},{x:13,y:9},{x:12,y:9},{x:11,y:9},{x:10,y:9},
            {x:9,y:9},{x:8,y:9},{x:7,y:9},{x:6,y:9},{x:6,y:10},
            {x:6,y:11}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 20, interval: 40 }, { type: "wolf", count: 12, interval: 50 }] },
            { enemies: [{ type: "darkKnight", count: 12, interval: 45 }, { type: "troll", count: 5, interval: 90 }] },
            { enemies: [{ type: "goblin", count: 30, interval: 20 }, { type: "demon", count: 4, interval: 100 }] },
            { enemies: [{ type: "demon", count: 5, interval: 80 }, { type: "troll", count: 7, interval: 70 }] },
            { enemies: [{ type: "wolf", count: 25, interval: 25 }, { type: "darkKnight", count: 14, interval: 35 }, { type: "dragon", count: 1, interval: 180 }] },
            { enemies: [{ type: "dragon", count: 2, interval: 150 }, { type: "demon", count: 6, interval: 60 }, { type: "dragon", count: 2, interval: 130 }] }
        ],
        terrain: [
            { type: "tree", cells: [{x:6,y:6},{x:14,y:8},{x:14,y:7}] },
            { type: "rock", cells: [{x:11,y:3},{x:3,y:8},{x:12,y:7},{x:0,y:7}] },
            { type: "mountain", cells: [{x:2,y:5},{x:5,y:11},{x:13,y:8},{x:16,y:3},{x:16,y:7}] },
            { type: "river", cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:8,y:0},{x:9,y:0},{x:10,y:0},{x:11,y:0},{x:12,y:0},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:17,y:0},{x:18,y:0},{x:19,y:0}] }
        ],
        bg: "#0a0a1a"
    },
    // ---- Level 21: Fire Temple ----
    {
        name: "Fire Temple",
        cols: 20, rows: 12,
        startGold: 303,
        lives: 15,
        path: [
            {x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},
            {x:5,y:2},{x:6,y:2},{x:7,y:2},{x:7,y:3},{x:7,y:4},
            {x:7,y:5},{x:6,y:5},{x:5,y:5},{x:4,y:5},{x:3,y:5},
            {x:2,y:5},{x:2,y:6},{x:2,y:7},{x:2,y:8},{x:3,y:8},
            {x:4,y:8},{x:5,y:8},{x:6,y:8},{x:7,y:8},{x:8,y:8},
            {x:9,y:8},{x:10,y:8},{x:11,y:8},{x:12,y:8},{x:12,y:7},
            {x:12,y:6},{x:12,y:5},{x:12,y:4},{x:12,y:3},{x:12,y:2},
            {x:13,y:2},{x:14,y:2},{x:15,y:2},{x:16,y:2},{x:17,y:2},
            {x:18,y:2},{x:19,y:2}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 22, interval: 40 }, { type: "wolf", count: 13, interval: 50 }] },
            { enemies: [{ type: "darkKnight", count: 13, interval: 45 }, { type: "troll", count: 5, interval: 90 }] },
            { enemies: [{ type: "goblin", count: 32, interval: 20 }, { type: "demon", count: 4, interval: 100 }] },
            { enemies: [{ type: "demon", count: 5, interval: 80 }, { type: "troll", count: 7, interval: 70 }] },
            { enemies: [{ type: "wolf", count: 27, interval: 25 }, { type: "darkKnight", count: 15, interval: 35 }, { type: "dragon", count: 1, interval: 180 }] },
            { enemies: [{ type: "dragon", count: 2, interval: 150 }, { type: "demon", count: 6, interval: 60 }] }
        ],
        terrain: [
            { type: "rock", cells: [{x:0,y:11},{x:10,y:2},{x:17,y:7},{x:16,y:11}] },
            { type: "mountain", cells: [{x:13,y:9},{x:6,y:9},{x:13,y:6},{x:16,y:4},{x:0,y:9}] }
        ],
        bg: "#3a0a0a"
    },
    // ---- Level 22: Ice Cavern ----
    {
        name: "Ice Cavern",
        cols: 20, rows: 12,
        startGold: 313,
        lives: 14,
        path: [
            {x:16,y:0},{x:16,y:1},{x:16,y:2},{x:16,y:3},{x:16,y:4},
            {x:15,y:4},{x:14,y:4},{x:13,y:4},{x:12,y:4},{x:11,y:4},
            {x:10,y:4},{x:9,y:4},{x:8,y:4},{x:7,y:4},{x:6,y:4},
            {x:5,y:4},{x:4,y:4},{x:4,y:5},{x:4,y:6},{x:4,y:7},
            {x:5,y:7},{x:6,y:7},{x:7,y:7},{x:8,y:7},{x:9,y:7},
            {x:10,y:7},{x:11,y:7},{x:12,y:7},{x:13,y:7},{x:14,y:7},
            {x:15,y:7},{x:16,y:7},{x:16,y:8},{x:16,y:9},{x:16,y:10},
            {x:16,y:11}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 24, interval: 40 }, { type: "wolf", count: 14, interval: 50 }] },
            { enemies: [{ type: "darkKnight", count: 14, interval: 45 }, { type: "troll", count: 6, interval: 90 }] },
            { enemies: [{ type: "goblin", count: 34, interval: 20 }, { type: "demon", count: 5, interval: 100 }] },
            { enemies: [{ type: "demon", count: 6, interval: 80 }, { type: "troll", count: 8, interval: 70 }] },
            { enemies: [{ type: "wolf", count: 29, interval: 25 }, { type: "darkKnight", count: 16, interval: 35 }, { type: "dragon", count: 1, interval: 180 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 150 }, { type: "demon", count: 7, interval: 60 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 120 }, { type: "demon", count: 6, interval: 50 }, { type: "troll", count: 7, interval: 40 }] }
        ],
        terrain: [
            { type: "mountain", cells: [{x:18,y:5},{x:14,y:1},{x:12,y:10},{x:8,y:10},{x:2,y:0}] },
            { type: "rock", cells: [{x:10,y:3},{x:10,y:9},{x:3,y:2},{x:1,y:8},{x:4,y:1},{x:2,y:4}] },
            { type: "bridge", cells: [{x:12,y:4}] }
        ],
        bg: "#0a1a2a"
    },
    // ---- Level 23: Wind Plateau ----
    {
        name: "Wind Plateau",
        cols: 20, rows: 12,
        startGold: 323,
        lives: 14,
        path: [
            {x:10,y:0},{x:10,y:1},{x:10,y:2},{x:9,y:2},{x:8,y:2},
            {x:7,y:2},{x:6,y:2},{x:5,y:2},{x:4,y:2},{x:3,y:2},
            {x:3,y:3},{x:3,y:4},{x:3,y:5},{x:4,y:5},{x:5,y:5},
            {x:6,y:5},{x:7,y:5},{x:8,y:5},{x:9,y:5},{x:10,y:5},
            {x:11,y:5},{x:12,y:5},{x:13,y:5},{x:14,y:5},{x:15,y:5},
            {x:16,y:5},{x:17,y:5},{x:17,y:6},{x:17,y:7},{x:17,y:8},
            {x:17,y:9},{x:16,y:9},{x:15,y:9},{x:14,y:9},{x:13,y:9},
            {x:12,y:9},{x:11,y:9},{x:10,y:9},{x:9,y:9},{x:8,y:9},
            {x:8,y:10},{x:8,y:11}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 26, interval: 40 }, { type: "wolf", count: 15, interval: 50 }] },
            { enemies: [{ type: "darkKnight", count: 15, interval: 45 }, { type: "troll", count: 6, interval: 90 }] },
            { enemies: [{ type: "goblin", count: 36, interval: 20 }, { type: "demon", count: 5, interval: 100 }] },
            { enemies: [{ type: "demon", count: 6, interval: 80 }, { type: "troll", count: 8, interval: 70 }] },
            { enemies: [{ type: "wolf", count: 31, interval: 25 }, { type: "darkKnight", count: 17, interval: 35 }, { type: "dragon", count: 2, interval: 180 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 150 }, { type: "demon", count: 7, interval: 60 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 120 }, { type: "demon", count: 6, interval: 50 }, { type: "troll", count: 7, interval: 40 }] }
        ],
        terrain: [
            { type: "rock", cells: [{x:1,y:5},{x:18,y:7},{x:10,y:7},{x:19,y:4},{x:1,y:8},{x:2,y:4}] },
            { type: "bridge", cells: [{x:3,y:4}] },
            { type: "tree", cells: [{x:5,y:6},{x:0,y:2},{x:18,y:4},{x:2,y:6}] },
            { type: "rock", cells: [{x:7,y:3},{x:1,y:4},{x:9,y:0},{x:14,y:1},{x:11,y:1}] }
        ],
        bg: "#1a2a1a"
    },
    // ---- Level 24: Earth Canyon ----
    {
        name: "Earth Canyon",
        cols: 20, rows: 12,
        startGold: 333,
        lives: 14,
        path: [
            {x:0,y:6},{x:1,y:6},{x:2,y:6},{x:3,y:6},{x:4,y:6},
            {x:4,y:5},{x:4,y:4},{x:4,y:3},{x:4,y:2},{x:4,y:1},
            {x:5,y:1},{x:6,y:1},{x:7,y:1},{x:8,y:1},{x:9,y:1},
            {x:10,y:1},{x:10,y:2},{x:10,y:3},{x:10,y:4},{x:10,y:5},
            {x:10,y:6},{x:10,y:7},{x:10,y:8},{x:10,y:9},{x:10,y:10},
            {x:11,y:10},{x:12,y:10},{x:13,y:10},{x:14,y:10},{x:15,y:10},
            {x:16,y:10},{x:16,y:9},{x:16,y:8},{x:16,y:7},{x:16,y:6},
            {x:16,y:5},{x:16,y:4},{x:17,y:4},{x:18,y:4},{x:19,y:4}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 28, interval: 40 }, { type: "wolf", count: 16, interval: 50 }] },
            { enemies: [{ type: "darkKnight", count: 16, interval: 45 }, { type: "troll", count: 7, interval: 90 }] },
            { enemies: [{ type: "goblin", count: 38, interval: 20 }, { type: "demon", count: 6, interval: 100 }] },
            { enemies: [{ type: "demon", count: 7, interval: 80 }, { type: "troll", count: 9, interval: 70 }] },
            { enemies: [{ type: "wolf", count: 33, interval: 25 }, { type: "darkKnight", count: 18, interval: 35 }, { type: "dragon", count: 2, interval: 180 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 150 }, { type: "demon", count: 8, interval: 60 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 120 }, { type: "demon", count: 6, interval: 50 }, { type: "troll", count: 7, interval: 40 }] }
        ],
        terrain: [
            { type: "bridge", cells: [{x:4,y:3}] },
            { type: "tree", cells: [{x:3,y:0},{x:4,y:10},{x:18,y:1},{x:18,y:5}] }
        ],
        bg: "#2a1a0a"
    },
    // ---- Level 25: Storm Citadel ----
    {
        name: "Storm Citadel",
        cols: 20, rows: 12,
        startGold: 344,
        lives: 13,
        path: [
            {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},
            {x:5,y:1},{x:6,y:1},{x:7,y:1},{x:8,y:1},{x:9,y:1},
            {x:10,y:1},{x:11,y:1},{x:12,y:1},{x:13,y:1},{x:14,y:1},
            {x:15,y:1},{x:16,y:1},{x:17,y:1},{x:17,y:2},{x:17,y:3},
            {x:17,y:4},{x:17,y:5},{x:16,y:5},{x:15,y:5},{x:14,y:5},
            {x:13,y:5},{x:12,y:5},{x:11,y:5},{x:10,y:5},{x:9,y:5},
            {x:8,y:5},{x:7,y:5},{x:6,y:5},{x:5,y:5},{x:4,y:5},
            {x:4,y:6},{x:4,y:7},{x:4,y:8},{x:4,y:9},{x:5,y:9},
            {x:6,y:9},{x:7,y:9},{x:8,y:9},{x:9,y:9},{x:10,y:9},
            {x:11,y:9},{x:12,y:9},{x:13,y:9},{x:14,y:9},{x:14,y:10},
            {x:14,y:11}
        ],
        waves: [
            { enemies: [{ type: "orc", count: 30, interval: 40 }, { type: "wolf", count: 17, interval: 50 }] },
            { enemies: [{ type: "darkKnight", count: 17, interval: 45 }, { type: "troll", count: 7, interval: 90 }] },
            { enemies: [{ type: "goblin", count: 40, interval: 20 }, { type: "demon", count: 6, interval: 100 }] },
            { enemies: [{ type: "demon", count: 7, interval: 80 }, { type: "troll", count: 9, interval: 70 }] },
            { enemies: [{ type: "wolf", count: 35, interval: 25 }, { type: "darkKnight", count: 19, interval: 35 }, { type: "dragon", count: 2, interval: 180 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 150 }, { type: "demon", count: 8, interval: 60 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 120 }, { type: "demon", count: 6, interval: 50 }, { type: "troll", count: 7, interval: 40 }, { type: "dragon", count: 3, interval: 130 }, { type: "titan", count: 1, interval: 300 }] }
        ],
        terrain: [
            { type: "tree", cells: [{x:13,y:7},{x:1,y:2},{x:13,y:0},{x:13,y:6}] },
            { type: "rock", cells: [{x:19,y:6},{x:2,y:10},{x:3,y:10},{x:17,y:7},{x:17,y:6}] },
            { type: "mountain", cells: [{x:15,y:2},{x:11,y:2},{x:12,y:8},{x:9,y:4},{x:0,y:5},{x:19,y:10}] }
        ],
        bg: "#0a0a2a"
    },
    // ---- Level 26: Fairy Forest ----
    {
        name: "Fairy Forest",
        cols: 20, rows: 12,
        startGold: 354,
        lives: 13,
        path: [
            {x:0,y:10},{x:1,y:10},{x:2,y:10},{x:3,y:10},{x:4,y:10},
            {x:5,y:10},{x:6,y:10},{x:6,y:9},{x:6,y:8},{x:6,y:7},
            {x:6,y:6},{x:6,y:5},{x:6,y:4},{x:6,y:3},{x:7,y:3},
            {x:8,y:3},{x:9,y:3},{x:10,y:3},{x:11,y:3},{x:12,y:3},
            {x:12,y:4},{x:12,y:5},{x:12,y:6},{x:12,y:7},{x:12,y:8},
            {x:12,y:9},{x:13,y:9},{x:14,y:9},{x:15,y:9},{x:16,y:9},
            {x:17,y:9},{x:18,y:9},{x:19,y:9}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 15, interval: 35 }, { type: "demon", count: 4, interval: 60 }] },
            { enemies: [{ type: "troll", count: 6, interval: 55 }, { type: "wolf", count: 20, interval: 20 }] },
            { enemies: [{ type: "demon", count: 5, interval: 50 }, { type: "darkKnight", count: 15, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 2, interval: 120 }, { type: "demon", count: 6, interval: 45 }] },
            { enemies: [{ type: "goblin", count: 35, interval: 12 }, { type: "troll", count: 8, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 100 }, { type: "demon", count: 8, interval: 35 }] }
        ],
        terrain: [
            { type: "rock", cells: [{x:19,y:8},{x:15,y:4},{x:7,y:2},{x:8,y:9},{x:9,y:11}] },
            { type: "mountain", cells: [{x:18,y:1},{x:13,y:0},{x:8,y:6},{x:5,y:8},{x:1,y:1},{x:5,y:4}] },
            { type: "rock", cells: [{x:1,y:6},{x:3,y:2},{x:9,y:5}] },
            { type: "bridge", cells: [{x:12,y:4}] }
        ],
        bg: "#0a2a1a"
    },
    // ---- Level 27: Demon Gate ----
    {
        name: "Demon Gate",
        cols: 20, rows: 12,
        startGold: 364,
        lives: 13,
        path: [
            {x:19,y:1},{x:18,y:1},{x:17,y:1},{x:16,y:1},{x:15,y:1},
            {x:14,y:1},{x:13,y:1},{x:13,y:2},{x:13,y:3},{x:13,y:4},
            {x:12,y:4},{x:11,y:4},{x:10,y:4},{x:9,y:4},{x:8,y:4},
            {x:7,y:4},{x:6,y:4},{x:6,y:5},{x:6,y:6},{x:6,y:7},
            {x:7,y:7},{x:8,y:7},{x:9,y:7},{x:10,y:7},{x:11,y:7},
            {x:12,y:7},{x:13,y:7},{x:14,y:7},{x:14,y:8},{x:14,y:9},
            {x:14,y:10},{x:14,y:11}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 17, interval: 35 }, { type: "demon", count: 5, interval: 60 }] },
            { enemies: [{ type: "troll", count: 7, interval: 55 }, { type: "wolf", count: 22, interval: 20 }] },
            { enemies: [{ type: "demon", count: 6, interval: 50 }, { type: "darkKnight", count: 17, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 2, interval: 120 }, { type: "demon", count: 6, interval: 45 }] },
            { enemies: [{ type: "goblin", count: 37, interval: 12 }, { type: "troll", count: 9, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 100 }, { type: "demon", count: 8, interval: 35 }] }
        ],
        terrain: [
            { type: "mountain", cells: [{x:1,y:9},{x:7,y:5},{x:18,y:2},{x:5,y:9},{x:11,y:1},{x:6,y:9}] },
            { type: "river", cells: [{x:3,y:0},{x:3,y:1},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:3,y:5},{x:3,y:6},{x:3,y:7},{x:3,y:8},{x:3,y:9},{x:3,y:10},{x:3,y:11}] }
        ],
        bg: "#2a0a0a"
    },
    // ---- Level 28: Angel Falls ----
    {
        name: "Angel Falls",
        cols: 20, rows: 12,
        startGold: 374,
        lives: 12,
        path: [
            {x:8,y:0},{x:8,y:1},{x:8,y:2},{x:8,y:3},{x:7,y:3},
            {x:6,y:3},{x:5,y:3},{x:4,y:3},{x:3,y:3},{x:2,y:3},
            {x:2,y:4},{x:2,y:5},{x:2,y:6},{x:2,y:7},{x:2,y:8},
            {x:3,y:8},{x:4,y:8},{x:5,y:8},{x:6,y:8},{x:7,y:8},
            {x:8,y:8},{x:9,y:8},{x:10,y:8},{x:11,y:8},{x:11,y:7},
            {x:11,y:6},{x:11,y:5},{x:11,y:4},{x:11,y:3},{x:11,y:2},
            {x:12,y:2},{x:13,y:2},{x:14,y:2},{x:15,y:2},{x:16,y:2},
            {x:17,y:2},{x:17,y:3},{x:17,y:4},{x:17,y:5},{x:17,y:6},
            {x:17,y:7},{x:17,y:8},{x:17,y:9},{x:17,y:10},{x:17,y:11}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 19, interval: 35 }, { type: "demon", count: 6, interval: 60 }] },
            { enemies: [{ type: "troll", count: 8, interval: 55 }, { type: "wolf", count: 24, interval: 20 }] },
            { enemies: [{ type: "demon", count: 7, interval: 50 }, { type: "darkKnight", count: 19, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 120 }, { type: "demon", count: 7, interval: 45 }] },
            { enemies: [{ type: "goblin", count: 39, interval: 12 }, { type: "troll", count: 10, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 100 }, { type: "demon", count: 9, interval: 35 }] }
        ],
        terrain: [
            { type: "river", cells: [{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:1,y:5},{x:1,y:6},{x:1,y:7},{x:1,y:8},{x:1,y:9},{x:1,y:10},{x:1,y:11}] },
            { type: "bridge", cells: [{x:4,y:3}] },
            { type: "tree", cells: [{x:4,y:10},{x:2,y:1},{x:4,y:5},{x:6,y:4},{x:12,y:6}] }
        ],
        bg: "#1a1a3a"
    },
    // ---- Level 29: Dragon Valley ----
    {
        name: "Dragon Valley",
        cols: 20, rows: 12,
        startGold: 385,
        lives: 12,
        path: [
            {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},
            {x:5,y:1},{x:6,y:1},{x:7,y:1},{x:8,y:1},{x:8,y:2},
            {x:8,y:3},{x:8,y:4},{x:7,y:4},{x:6,y:4},{x:5,y:4},
            {x:4,y:4},{x:3,y:4},{x:3,y:5},{x:3,y:6},{x:3,y:7},
            {x:4,y:7},{x:5,y:7},{x:6,y:7},{x:7,y:7},{x:8,y:7},
            {x:9,y:7},{x:10,y:7},{x:11,y:7},{x:12,y:7},{x:13,y:7},
            {x:14,y:7},{x:15,y:7},{x:16,y:7},{x:16,y:8},{x:16,y:9},
            {x:16,y:10},{x:17,y:10},{x:18,y:10},{x:19,y:10}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 21, interval: 35 }, { type: "demon", count: 7, interval: 60 }] },
            { enemies: [{ type: "troll", count: 9, interval: 55 }, { type: "wolf", count: 26, interval: 20 }] },
            { enemies: [{ type: "demon", count: 8, interval: 50 }, { type: "darkKnight", count: 21, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 120 }, { type: "demon", count: 7, interval: 45 }] },
            { enemies: [{ type: "goblin", count: 41, interval: 12 }, { type: "troll", count: 11, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 100 }, { type: "demon", count: 9, interval: 35 }] },
            { enemies: [{ type: "lich", count: 1, interval: 150 }, { type: "dragon", count: 3, interval: 90 }, { type: "demon", count: 8, interval: 30 }] }
        ],
        terrain: [
            { type: "bridge", cells: [{x:12,y:7}] },
            { type: "tree", cells: [{x:17,y:2},{x:3,y:8},{x:0,y:5},{x:2,y:8},{x:1,y:3}] },
            { type: "rock", cells: [{x:4,y:6},{x:15,y:6},{x:18,y:2},{x:0,y:0},{x:18,y:9},{x:12,y:10}] },
            { type: "mountain", cells: [{x:0,y:4},{x:4,y:3},{x:19,y:7}] }
        ],
        bg: "#2a1a1a"
    },
    // ---- Level 30: Chaos Realm ----
    {
        name: "Chaos Realm",
        cols: 20, rows: 12,
        startGold: 395,
        lives: 12,
        path: [
            {x:19,y:2},{x:18,y:2},{x:17,y:2},{x:16,y:2},{x:15,y:2},
            {x:14,y:2},{x:13,y:2},{x:12,y:2},{x:11,y:2},{x:10,y:2},
            {x:9,y:2},{x:8,y:2},{x:7,y:2},{x:6,y:2},{x:5,y:2},
            {x:4,y:2},{x:4,y:3},{x:4,y:4},{x:4,y:5},{x:5,y:5},
            {x:6,y:5},{x:7,y:5},{x:8,y:5},{x:9,y:5},{x:10,y:5},
            {x:11,y:5},{x:12,y:5},{x:13,y:5},{x:14,y:5},{x:15,y:5},
            {x:15,y:6},{x:15,y:7},{x:15,y:8},{x:14,y:8},{x:13,y:8},
            {x:12,y:8},{x:11,y:8},{x:10,y:8},{x:9,y:8},{x:8,y:8},
            {x:7,y:8},{x:7,y:9},{x:7,y:10},{x:7,y:11}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 23, interval: 35 }, { type: "demon", count: 8, interval: 60 }] },
            { enemies: [{ type: "troll", count: 10, interval: 55 }, { type: "wolf", count: 28, interval: 20 }] },
            { enemies: [{ type: "demon", count: 9, interval: 50 }, { type: "darkKnight", count: 23, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 120 }, { type: "demon", count: 8, interval: 45 }] },
            { enemies: [{ type: "goblin", count: 43, interval: 12 }, { type: "troll", count: 12, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 5, interval: 100 }, { type: "demon", count: 10, interval: 35 }, { type: "lich", count: 1, interval: 200 }] },
            { enemies: [{ type: "lich", count: 2, interval: 150 }, { type: "dragon", count: 3, interval: 90 }, { type: "demon", count: 8, interval: 30 }, { type: "lich", count: 2, interval: 130 }] }
        ],
        terrain: [
            { type: "tree", cells: [{x:2,y:2},{x:10,y:6},{x:3,y:11},{x:1,y:3},{x:18,y:3}] },
            { type: "rock", cells: [{x:14,y:0},{x:8,y:11},{x:13,y:7},{x:19,y:4},{x:0,y:3},{x:1,y:8}] }
        ],
        bg: "#1a0a2a"
    },
    // ---- Level 31: Siege Wall ----
    {
        name: "Siege Wall",
        cols: 20, rows: 12,
        startGold: 405,
        lives: 11,
        path: [
            {x:2,y:11},{x:2,y:10},{x:2,y:9},{x:2,y:8},{x:2,y:7},
            {x:2,y:6},{x:3,y:6},{x:4,y:6},{x:5,y:6},{x:6,y:6},
            {x:7,y:6},{x:8,y:6},{x:8,y:5},{x:8,y:4},{x:8,y:3},
            {x:8,y:2},{x:8,y:1},{x:9,y:1},{x:10,y:1},{x:11,y:1},
            {x:12,y:1},{x:13,y:1},{x:14,y:1},{x:14,y:2},{x:14,y:3},
            {x:14,y:4},{x:14,y:5},{x:14,y:6},{x:14,y:7},{x:14,y:8},
            {x:15,y:8},{x:16,y:8},{x:17,y:8},{x:18,y:8},{x:19,y:8}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 25, interval: 35 }, { type: "demon", count: 9, interval: 60 }] },
            { enemies: [{ type: "troll", count: 11, interval: 55 }, { type: "wolf", count: 30, interval: 20 }] },
            { enemies: [{ type: "demon", count: 10, interval: 50 }, { type: "darkKnight", count: 25, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 120 }, { type: "demon", count: 8, interval: 45 }] },
            { enemies: [{ type: "goblin", count: 45, interval: 12 }, { type: "troll", count: 13, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 5, interval: 100 }, { type: "demon", count: 10, interval: 35 }, { type: "lich", count: 1, interval: 200 }] },
            { enemies: [{ type: "lich", count: 2, interval: 150 }, { type: "dragon", count: 3, interval: 90 }, { type: "demon", count: 8, interval: 30 }] }
        ],
        terrain: [
            { type: "rock", cells: [{x:15,y:1},{x:7,y:10},{x:3,y:9},{x:15,y:11},{x:3,y:8},{x:6,y:11}] },
            { type: "mountain", cells: [{x:11,y:6},{x:4,y:9},{x:0,y:7}] },
            { type: "river", cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:8,y:0},{x:9,y:0},{x:10,y:0},{x:11,y:0},{x:12,y:0},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:17,y:0},{x:18,y:0},{x:19,y:0}] }
        ],
        bg: "#2a2a1a"
    },
    // ---- Level 32: Battlefront ----
    {
        name: "Battlefront",
        cols: 20, rows: 12,
        startGold: 415,
        lives: 11,
        path: [
            {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},
            {x:5,y:1},{x:6,y:1},{x:6,y:2},{x:6,y:3},{x:6,y:4},
            {x:6,y:5},{x:5,y:5},{x:4,y:5},{x:3,y:5},{x:2,y:5},
            {x:1,y:5},{x:1,y:6},{x:1,y:7},{x:1,y:8},{x:1,y:9},
            {x:2,y:9},{x:3,y:9},{x:4,y:9},{x:5,y:9},{x:6,y:9},
            {x:7,y:9},{x:8,y:9},{x:9,y:9},{x:10,y:9},{x:10,y:8},
            {x:10,y:7},{x:10,y:6},{x:10,y:5},{x:10,y:4},{x:10,y:3},
            {x:11,y:3},{x:12,y:3},{x:13,y:3},{x:14,y:3},{x:15,y:3},
            {x:16,y:3},{x:17,y:3},{x:18,y:3},{x:19,y:3}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 27, interval: 35 }, { type: "demon", count: 10, interval: 60 }] },
            { enemies: [{ type: "troll", count: 12, interval: 55 }, { type: "wolf", count: 32, interval: 20 }] },
            { enemies: [{ type: "demon", count: 11, interval: 50 }, { type: "darkKnight", count: 27, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 5, interval: 120 }, { type: "demon", count: 9, interval: 45 }] },
            { enemies: [{ type: "goblin", count: 47, interval: 12 }, { type: "troll", count: 14, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 6, interval: 100 }, { type: "demon", count: 11, interval: 35 }, { type: "lich", count: 1, interval: 200 }] },
            { enemies: [{ type: "lich", count: 3, interval: 150 }, { type: "dragon", count: 3, interval: 90 }, { type: "demon", count: 8, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 80 }, { type: "lich", count: 2, interval: 130 }, { type: "demon", count: 10, interval: 25 }] }
        ],
        terrain: [
            { type: "mountain", cells: [{x:13,y:7},{x:18,y:2},{x:6,y:6}] },
            { type: "river", cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:8,y:0},{x:9,y:0},{x:10,y:0},{x:11,y:0},{x:12,y:0},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:17,y:0},{x:18,y:0},{x:19,y:0}] },
            { type: "bridge", cells: [{x:3,y:1}] },
            { type: "tree", cells: [{x:18,y:11},{x:19,y:2},{x:13,y:5},{x:16,y:11},{x:12,y:4},{x:10,y:2}] }
        ],
        bg: "#1a1a1a"
    },
    // ---- Level 33: War Camp ----
    {
        name: "War Camp",
        cols: 20, rows: 12,
        startGold: 426,
        lives: 11,
        path: [
            {x:19,y:10},{x:18,y:10},{x:17,y:10},{x:16,y:10},{x:15,y:10},
            {x:14,y:10},{x:14,y:9},{x:14,y:8},{x:14,y:7},{x:14,y:6},
            {x:14,y:5},{x:14,y:4},{x:14,y:3},{x:13,y:3},{x:12,y:3},
            {x:11,y:3},{x:10,y:3},{x:9,y:3},{x:8,y:3},{x:7,y:3},
            {x:7,y:4},{x:7,y:5},{x:7,y:6},{x:7,y:7},{x:7,y:8},
            {x:6,y:8},{x:5,y:8},{x:4,y:8},{x:3,y:8},{x:2,y:8},
            {x:1,y:8},{x:0,y:8}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 29, interval: 35 }, { type: "demon", count: 11, interval: 60 }] },
            { enemies: [{ type: "troll", count: 13, interval: 55 }, { type: "wolf", count: 34, interval: 20 }] },
            { enemies: [{ type: "demon", count: 12, interval: 50 }, { type: "darkKnight", count: 29, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 5, interval: 120 }, { type: "demon", count: 9, interval: 45 }] },
            { enemies: [{ type: "goblin", count: 49, interval: 12 }, { type: "troll", count: 15, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 6, interval: 100 }, { type: "demon", count: 11, interval: 35 }, { type: "lich", count: 2, interval: 200 }] },
            { enemies: [{ type: "lich", count: 3, interval: 150 }, { type: "dragon", count: 3, interval: 90 }, { type: "demon", count: 8, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 80 }, { type: "lich", count: 2, interval: 130 }, { type: "demon", count: 10, interval: 25 }] }
        ],
        terrain: [
            { type: "river", cells: [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},{x:5,y:1},{x:6,y:1},{x:7,y:1},{x:8,y:1},{x:9,y:1},{x:10,y:1},{x:11,y:1},{x:12,y:1},{x:13,y:1},{x:14,y:1},{x:15,y:1},{x:16,y:1},{x:17,y:1},{x:18,y:1},{x:19,y:1}] },
            { type: "bridge", cells: [{x:14,y:4}] }
        ],
        bg: "#2a1a1a"
    },
    // ---- Level 34: Fallen Kingdom ----
    {
        name: "Fallen Kingdom",
        cols: 20, rows: 12,
        startGold: 436,
        lives: 10,
        path: [
            {x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3},
            {x:5,y:3},{x:5,y:4},{x:5,y:5},{x:5,y:6},{x:5,y:7},
            {x:5,y:8},{x:5,y:9},{x:6,y:9},{x:7,y:9},{x:8,y:9},
            {x:9,y:9},{x:10,y:9},{x:10,y:8},{x:10,y:7},{x:10,y:6},
            {x:10,y:5},{x:10,y:4},{x:10,y:3},{x:10,y:2},{x:10,y:1},
            {x:11,y:1},{x:12,y:1},{x:13,y:1},{x:14,y:1},{x:15,y:1},
            {x:15,y:2},{x:15,y:3},{x:15,y:4},{x:15,y:5},{x:15,y:6},
            {x:15,y:7},{x:16,y:7},{x:17,y:7},{x:18,y:7},{x:19,y:7}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 31, interval: 35 }, { type: "demon", count: 12, interval: 60 }] },
            { enemies: [{ type: "troll", count: 14, interval: 55 }, { type: "wolf", count: 36, interval: 20 }] },
            { enemies: [{ type: "demon", count: 13, interval: 50 }, { type: "darkKnight", count: 31, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 6, interval: 120 }, { type: "demon", count: 10, interval: 45 }] },
            { enemies: [{ type: "goblin", count: 51, interval: 12 }, { type: "troll", count: 16, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 7, interval: 100 }, { type: "demon", count: 12, interval: 35 }, { type: "lich", count: 2, interval: 200 }] },
            { enemies: [{ type: "lich", count: 4, interval: 150 }, { type: "dragon", count: 3, interval: 90 }, { type: "demon", count: 8, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 80 }, { type: "lich", count: 2, interval: 130 }, { type: "demon", count: 10, interval: 25 }] }
        ],
        terrain: [
            { type: "bridge", cells: [{x:12,y:1}] },
            { type: "tree", cells: [{x:16,y:8},{x:5,y:2},{x:8,y:11},{x:12,y:0},{x:17,y:10},{x:12,y:10}] },
            { type: "rock", cells: [{x:12,y:7},{x:12,y:9},{x:7,y:0}] }
        ],
        bg: "#1a0a0a"
    },
    // ---- Level 35: Last Stand ----
    {
        name: "Last Stand",
        cols: 20, rows: 12,
        startGold: 446,
        lives: 10,
        path: [
            {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},
            {x:5,y:1},{x:5,y:2},{x:5,y:3},{x:5,y:4},{x:6,y:4},
            {x:7,y:4},{x:8,y:4},{x:9,y:4},{x:10,y:4},{x:11,y:4},
            {x:12,y:4},{x:13,y:4},{x:14,y:4},{x:15,y:4},{x:15,y:5},
            {x:15,y:6},{x:15,y:7},{x:14,y:7},{x:13,y:7},{x:12,y:7},
            {x:11,y:7},{x:10,y:7},{x:9,y:7},{x:8,y:7},{x:7,y:7},
            {x:6,y:7},{x:5,y:7},{x:5,y:8},{x:5,y:9},{x:5,y:10},
            {x:6,y:10},{x:7,y:10},{x:8,y:10},{x:9,y:10},{x:10,y:10},
            {x:11,y:10},{x:12,y:10},{x:13,y:10},{x:14,y:10},{x:15,y:10},
            {x:16,y:10},{x:17,y:10},{x:18,y:10},{x:19,y:10}
        ],
        waves: [
            { enemies: [{ type: "darkKnight", count: 33, interval: 35 }, { type: "demon", count: 13, interval: 60 }] },
            { enemies: [{ type: "troll", count: 15, interval: 55 }, { type: "wolf", count: 38, interval: 20 }] },
            { enemies: [{ type: "demon", count: 14, interval: 50 }, { type: "darkKnight", count: 33, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 6, interval: 120 }, { type: "demon", count: 10, interval: 45 }] },
            { enemies: [{ type: "goblin", count: 53, interval: 12 }, { type: "troll", count: 17, interval: 40 }] },
            { enemies: [{ type: "dragon", count: 7, interval: 100 }, { type: "demon", count: 12, interval: 35 }, { type: "lich", count: 2, interval: 200 }] },
            { enemies: [{ type: "lich", count: 4, interval: 150 }, { type: "dragon", count: 3, interval: 90 }, { type: "demon", count: 8, interval: 30 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 80 }, { type: "lich", count: 2, interval: 130 }, { type: "demon", count: 10, interval: 25 }, { type: "lich", count: 3, interval: 130 }, { type: "phoenix", count: 1, interval: 250 }] }
        ],
        terrain: [
            { type: "tree", cells: [{x:12,y:2},{x:7,y:2},{x:16,y:7},{x:0,y:6},{x:16,y:6},{x:6,y:0}] },
            { type: "rock", cells: [{x:0,y:4},{x:11,y:3},{x:19,y:5}] },
            { type: "mountain", cells: [{x:3,y:11},{x:1,y:7},{x:14,y:2},{x:1,y:3}] },
            { type: "rock", cells: [{x:16,y:5},{x:16,y:4},{x:8,y:6},{x:16,y:9},{x:2,y:6}] }
        ],
        bg: "#0a0a0a"
    },
    // ---- Level 36: Star Bridge ----
    {
        name: "Star Bridge",
        cols: 20, rows: 12,
        startGold: 456,
        lives: 10,
        path: [
            {x:10,y:0},{x:10,y:1},{x:10,y:2},{x:10,y:3},{x:9,y:3},
            {x:8,y:3},{x:7,y:3},{x:6,y:3},{x:5,y:3},{x:4,y:3},
            {x:4,y:4},{x:4,y:5},{x:4,y:6},{x:5,y:6},{x:6,y:6},
            {x:7,y:6},{x:8,y:6},{x:9,y:6},{x:10,y:6},{x:11,y:6},
            {x:12,y:6},{x:13,y:6},{x:14,y:6},{x:15,y:6},{x:16,y:6},
            {x:16,y:7},{x:16,y:8},{x:16,y:9},{x:15,y:9},{x:14,y:9},
            {x:13,y:9},{x:12,y:9},{x:11,y:9},{x:10,y:9},{x:9,y:9},
            {x:8,y:9},{x:7,y:9},{x:6,y:9},{x:6,y:10},{x:6,y:11}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 13, interval: 35 }, { type: "troll", count: 10, interval: 45 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 80 }, { type: "darkKnight", count: 23, interval: 25 }] },
            { enemies: [{ type: "lich", count: 2, interval: 100 }, { type: "demon", count: 15, interval: 30 }] },
            { enemies: [{ type: "troll", count: 12, interval: 35 }, { type: "dragon", count: 4, interval: 70 }] },
            { enemies: [{ type: "goblin", count: 43, interval: 10 }, { type: "demon", count: 16, interval: 25 }, { type: "lich", count: 2, interval: 120 }] },
            { enemies: [{ type: "dragon", count: 5, interval: 60 }, { type: "lich", count: 3, interval: 90 }, { type: "demon", count: 18, interval: 20 }] },
            { enemies: [{ type: "titan", count: 1, interval: 200 }, { type: "dragon", count: 5, interval: 55 }, { type: "lich", count: 3, interval: 80 }] }
        ],
        terrain: [
            { type: "rock", cells: [{x:19,y:7},{x:5,y:5},{x:2,y:9}] },
            { type: "mountain", cells: [{x:18,y:2},{x:8,y:8},{x:9,y:11},{x:16,y:3}] }
        ],
        bg: "#0a0a2a"
    },
    // ---- Level 37: Moon Temple ----
    {
        name: "Moon Temple",
        cols: 20, rows: 12,
        startGold: 467,
        lives: 9,
        path: [
            {x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:3,y:3},
            {x:3,y:4},{x:3,y:5},{x:3,y:6},{x:3,y:7},{x:3,y:8},
            {x:3,y:9},{x:3,y:10},{x:4,y:10},{x:5,y:10},{x:6,y:10},
            {x:7,y:10},{x:8,y:10},{x:9,y:10},{x:9,y:9},{x:9,y:8},
            {x:9,y:7},{x:9,y:6},{x:9,y:5},{x:9,y:4},{x:9,y:3},
            {x:9,y:2},{x:10,y:2},{x:11,y:2},{x:12,y:2},{x:13,y:2},
            {x:14,y:2},{x:15,y:2},{x:15,y:3},{x:15,y:4},{x:15,y:5},
            {x:15,y:6},{x:15,y:7},{x:15,y:8},{x:15,y:9},{x:15,y:10},
            {x:16,y:10},{x:17,y:10},{x:18,y:10},{x:19,y:10}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 15, interval: 35 }, { type: "troll", count: 11, interval: 45 }] },
            { enemies: [{ type: "dragon", count: 3, interval: 80 }, { type: "darkKnight", count: 25, interval: 25 }] },
            { enemies: [{ type: "lich", count: 2, interval: 100 }, { type: "demon", count: 17, interval: 30 }] },
            { enemies: [{ type: "troll", count: 13, interval: 35 }, { type: "dragon", count: 4, interval: 70 }] },
            { enemies: [{ type: "goblin", count: 45, interval: 10 }, { type: "demon", count: 18, interval: 25 }, { type: "lich", count: 2, interval: 120 }] },
            { enemies: [{ type: "dragon", count: 5, interval: 60 }, { type: "lich", count: 3, interval: 90 }, { type: "demon", count: 20, interval: 20 }] },
            { enemies: [{ type: "titan", count: 1, interval: 200 }, { type: "dragon", count: 5, interval: 55 }, { type: "lich", count: 3, interval: 80 }] }
        ],
        terrain: [
            { type: "mountain", cells: [{x:13,y:1},{x:2,y:11},{x:2,y:9},{x:4,y:2}] },
            { type: "rock", cells: [{x:13,y:4},{x:8,y:1},{x:4,y:3},{x:10,y:8},{x:5,y:6}] },
            { type: "bridge", cells: [{x:3,y:4}] }
        ],
        bg: "#1a0a2a"
    },
    // ---- Level 38: Sun Palace ----
    {
        name: "Sun Palace",
        cols: 20, rows: 12,
        startGold: 477,
        lives: 9,
        path: [
            {x:0,y:9},{x:1,y:9},{x:2,y:9},{x:3,y:9},{x:4,y:9},
            {x:5,y:9},{x:6,y:9},{x:7,y:9},{x:7,y:8},{x:7,y:7},
            {x:7,y:6},{x:7,y:5},{x:7,y:4},{x:7,y:3},{x:7,y:2},
            {x:8,y:2},{x:9,y:2},{x:10,y:2},{x:11,y:2},{x:12,y:2},
            {x:13,y:2},{x:13,y:3},{x:13,y:4},{x:13,y:5},{x:13,y:6},
            {x:13,y:7},{x:13,y:8},{x:13,y:9},{x:14,y:9},{x:15,y:9},
            {x:16,y:9},{x:17,y:9},{x:18,y:9},{x:19,y:9}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 17, interval: 35 }, { type: "troll", count: 12, interval: 45 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 80 }, { type: "darkKnight", count: 27, interval: 25 }] },
            { enemies: [{ type: "lich", count: 3, interval: 100 }, { type: "demon", count: 19, interval: 30 }] },
            { enemies: [{ type: "troll", count: 14, interval: 35 }, { type: "dragon", count: 5, interval: 70 }] },
            { enemies: [{ type: "goblin", count: 47, interval: 10 }, { type: "demon", count: 20, interval: 25 }, { type: "lich", count: 2, interval: 120 }] },
            { enemies: [{ type: "dragon", count: 6, interval: 60 }, { type: "lich", count: 3, interval: 90 }, { type: "demon", count: 22, interval: 20 }] },
            { enemies: [{ type: "titan", count: 1, interval: 200 }, { type: "dragon", count: 5, interval: 55 }, { type: "lich", count: 3, interval: 80 }] }
        ],
        terrain: [
            { type: "rock", cells: [{x:3,y:4},{x:18,y:6},{x:5,y:10},{x:0,y:7},{x:0,y:8}] },
            { type: "bridge", cells: [{x:4,y:9}] },
            { type: "tree", cells: [{x:10,y:3},{x:18,y:1},{x:14,y:6}] },
            { type: "rock", cells: [{x:4,y:10},{x:11,y:8},{x:17,y:2},{x:17,y:6}] }
        ],
        bg: "#3a2a0a"
    },
    // ---- Level 39: Void Gate ----
    {
        name: "Void Gate",
        cols: 20, rows: 12,
        startGold: 487,
        lives: 9,
        path: [
            {x:19,y:2},{x:18,y:2},{x:17,y:2},{x:16,y:2},{x:15,y:2},
            {x:15,y:3},{x:15,y:4},{x:15,y:5},{x:15,y:6},{x:15,y:7},
            {x:15,y:8},{x:15,y:9},{x:14,y:9},{x:13,y:9},{x:12,y:9},
            {x:11,y:9},{x:10,y:9},{x:9,y:9},{x:9,y:8},{x:9,y:7},
            {x:9,y:6},{x:9,y:5},{x:9,y:4},{x:9,y:3},{x:9,y:2},
            {x:8,y:2},{x:7,y:2},{x:6,y:2},{x:5,y:2},{x:4,y:2},
            {x:3,y:2},{x:3,y:3},{x:3,y:4},{x:3,y:5},{x:3,y:6},
            {x:3,y:7},{x:3,y:8},{x:3,y:9},{x:2,y:9},{x:1,y:9},
            {x:0,y:9}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 19, interval: 35 }, { type: "troll", count: 13, interval: 45 }] },
            { enemies: [{ type: "dragon", count: 4, interval: 80 }, { type: "darkKnight", count: 29, interval: 25 }] },
            { enemies: [{ type: "lich", count: 3, interval: 100 }, { type: "demon", count: 21, interval: 30 }] },
            { enemies: [{ type: "troll", count: 15, interval: 35 }, { type: "dragon", count: 5, interval: 70 }] },
            { enemies: [{ type: "goblin", count: 49, interval: 10 }, { type: "demon", count: 22, interval: 25 }, { type: "lich", count: 2, interval: 120 }] },
            { enemies: [{ type: "dragon", count: 6, interval: 60 }, { type: "lich", count: 4, interval: 90 }, { type: "demon", count: 24, interval: 20 }] },
            { enemies: [{ type: "titan", count: 2, interval: 200 }, { type: "dragon", count: 5, interval: 55 }, { type: "lich", count: 3, interval: 80 }] },
            { enemies: [{ type: "titan", count: 2, interval: 160 }, { type: "dragon", count: 6, interval: 50 }, { type: "demon", count: 12, interval: 20 }] }
        ],
        terrain: [
            { type: "bridge", cells: [{x:3,y:4}] },
            { type: "tree", cells: [{x:14,y:11},{x:19,y:6},{x:8,y:10}] }
        ],
        bg: "#0a0a0a"
    },
    // ---- Level 40: Cosmic Arena ----
    {
        name: "Cosmic Arena",
        cols: 20, rows: 12,
        startGold: 497,
        lives: 8,
        path: [
            {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},
            {x:5,y:1},{x:6,y:1},{x:6,y:2},{x:6,y:3},{x:6,y:4},
            {x:6,y:5},{x:7,y:5},{x:8,y:5},{x:9,y:5},{x:10,y:5},
            {x:11,y:5},{x:12,y:5},{x:13,y:5},{x:14,y:5},{x:15,y:5},
            {x:16,y:5},{x:17,y:5},{x:17,y:6},{x:17,y:7},{x:17,y:8},
            {x:17,y:9},{x:16,y:9},{x:15,y:9},{x:14,y:9},{x:13,y:9},
            {x:12,y:9},{x:11,y:9},{x:10,y:9},{x:9,y:9},{x:8,y:9},
            {x:8,y:10},{x:8,y:11}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 21, interval: 35 }, { type: "troll", count: 14, interval: 45 }] },
            { enemies: [{ type: "dragon", count: 5, interval: 80 }, { type: "darkKnight", count: 31, interval: 25 }] },
            { enemies: [{ type: "lich", count: 4, interval: 100 }, { type: "demon", count: 23, interval: 30 }] },
            { enemies: [{ type: "troll", count: 16, interval: 35 }, { type: "dragon", count: 6, interval: 70 }] },
            { enemies: [{ type: "goblin", count: 51, interval: 10 }, { type: "demon", count: 24, interval: 25 }, { type: "lich", count: 2, interval: 120 }] },
            { enemies: [{ type: "dragon", count: 7, interval: 60 }, { type: "lich", count: 4, interval: 90 }, { type: "demon", count: 26, interval: 20 }] },
            { enemies: [{ type: "titan", count: 2, interval: 200 }, { type: "dragon", count: 5, interval: 55 }, { type: "lich", count: 3, interval: 80 }] },
            { enemies: [{ type: "titan", count: 2, interval: 160 }, { type: "dragon", count: 6, interval: 50 }, { type: "demon", count: 12, interval: 20 }, { type: "titan", count: 2, interval: 120 }] }
        ],
        terrain: [
            { type: "tree", cells: [{x:9,y:3},{x:9,y:8},{x:11,y:1}] },
            { type: "rock", cells: [{x:16,y:0},{x:6,y:10},{x:10,y:1},{x:8,y:7}] },
            { type: "mountain", cells: [{x:0,y:10},{x:7,y:4},{x:16,y:1},{x:7,y:3},{x:19,y:4}] }
        ],
        bg: "#1a0a3a"
    },
    // ---- Level 41: Infinity Tower ----
    {
        name: "Infinity Tower",
        cols: 20, rows: 12,
        startGold: 508,
        lives: 8,
        path: [
            {x:2,y:11},{x:2,y:10},{x:2,y:9},{x:2,y:8},{x:3,y:8},
            {x:4,y:8},{x:5,y:8},{x:6,y:8},{x:7,y:8},{x:8,y:8},
            {x:8,y:7},{x:8,y:6},{x:8,y:5},{x:8,y:4},{x:8,y:3},
            {x:8,y:2},{x:9,y:2},{x:10,y:2},{x:11,y:2},{x:12,y:2},
            {x:13,y:2},{x:14,y:2},{x:15,y:2},{x:16,y:2},{x:16,y:3},
            {x:16,y:4},{x:16,y:5},{x:16,y:6},{x:16,y:7},{x:16,y:8},
            {x:16,y:9},{x:17,y:9},{x:18,y:9},{x:19,y:9}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 23, interval: 35 }, { type: "troll", count: 15, interval: 45 }] },
            { enemies: [{ type: "dragon", count: 5, interval: 80 }, { type: "darkKnight", count: 33, interval: 25 }] },
            { enemies: [{ type: "lich", count: 4, interval: 100 }, { type: "demon", count: 25, interval: 30 }] },
            { enemies: [{ type: "troll", count: 17, interval: 35 }, { type: "dragon", count: 6, interval: 70 }] },
            { enemies: [{ type: "goblin", count: 53, interval: 10 }, { type: "demon", count: 26, interval: 25 }, { type: "lich", count: 2, interval: 120 }] },
            { enemies: [{ type: "dragon", count: 7, interval: 60 }, { type: "lich", count: 4, interval: 90 }, { type: "demon", count: 28, interval: 20 }] },
            { enemies: [{ type: "titan", count: 2, interval: 200 }, { type: "dragon", count: 5, interval: 55 }, { type: "lich", count: 3, interval: 80 }] },
            { enemies: [{ type: "titan", count: 3, interval: 160 }, { type: "dragon", count: 6, interval: 50 }, { type: "demon", count: 12, interval: 20 }] }
        ],
        terrain: [
            { type: "rock", cells: [{x:15,y:6},{x:17,y:4},{x:9,y:3},{x:18,y:6}] },
            { type: "mountain", cells: [{x:13,y:3},{x:9,y:8},{x:3,y:9},{x:18,y:4},{x:0,y:5}] },
            { type: "river", cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:8,y:0},{x:9,y:0},{x:10,y:0},{x:11,y:0},{x:12,y:0},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:17,y:0},{x:18,y:0},{x:19,y:0}] },
            { type: "bridge", cells: [{x:9,y:2}] }
        ],
        bg: "#2a0a2a"
    },
    // ---- Level 42: Time Rift ----
    {
        name: "Time Rift",
        cols: 20, rows: 12,
        startGold: 518,
        lives: 8,
        path: [
            {x:19,y:3},{x:18,y:3},{x:17,y:3},{x:16,y:3},{x:15,y:3},
            {x:14,y:3},{x:14,y:4},{x:14,y:5},{x:14,y:6},{x:14,y:7},
            {x:14,y:8},{x:13,y:8},{x:12,y:8},{x:11,y:8},{x:10,y:8},
            {x:9,y:8},{x:8,y:8},{x:8,y:7},{x:8,y:6},{x:8,y:5},
            {x:8,y:4},{x:8,y:3},{x:8,y:2},{x:8,y:1},{x:7,y:1},
            {x:6,y:1},{x:5,y:1},{x:4,y:1},{x:3,y:1},{x:2,y:1},
            {x:2,y:2},{x:2,y:3},{x:2,y:4},{x:2,y:5},{x:2,y:6},
            {x:2,y:7},{x:2,y:8},{x:2,y:9},{x:2,y:10},{x:2,y:11}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 25, interval: 35 }, { type: "troll", count: 16, interval: 45 }] },
            { enemies: [{ type: "dragon", count: 6, interval: 80 }, { type: "darkKnight", count: 35, interval: 25 }] },
            { enemies: [{ type: "lich", count: 5, interval: 100 }, { type: "demon", count: 27, interval: 30 }] },
            { enemies: [{ type: "troll", count: 18, interval: 35 }, { type: "dragon", count: 7, interval: 70 }] },
            { enemies: [{ type: "goblin", count: 55, interval: 10 }, { type: "demon", count: 28, interval: 25 }, { type: "lich", count: 2, interval: 120 }] },
            { enemies: [{ type: "dragon", count: 8, interval: 60 }, { type: "lich", count: 5, interval: 90 }, { type: "demon", count: 30, interval: 20 }] },
            { enemies: [{ type: "titan", count: 3, interval: 200 }, { type: "dragon", count: 5, interval: 55 }, { type: "lich", count: 3, interval: 80 }] },
            { enemies: [{ type: "titan", count: 3, interval: 160 }, { type: "dragon", count: 6, interval: 50 }, { type: "demon", count: 12, interval: 20 }] },
            { enemies: [{ type: "titan", count: 3, interval: 140 }, { type: "lich", count: 4, interval: 70 }, { type: "dragon", count: 6, interval: 45 }] }
        ],
        terrain: [
            { type: "mountain", cells: [{x:11,y:6},{x:14,y:2},{x:6,y:4},{x:5,y:0},{x:19,y:2}] },
            { type: "river", cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:6,y:0},{x:7,y:0},{x:8,y:0},{x:9,y:0},{x:10,y:0},{x:11,y:0},{x:12,y:0},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:17,y:0},{x:18,y:0},{x:19,y:0}] }
        ],
        bg: "#0a1a2a"
    },
    // ---- Level 43: Mirror Realm ----
    {
        name: "Mirror Realm",
        cols: 20, rows: 12,
        startGold: 528,
        lives: 7,
        path: [
            {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},
            {x:5,y:1},{x:5,y:2},{x:5,y:3},{x:5,y:4},{x:5,y:5},
            {x:5,y:6},{x:5,y:7},{x:5,y:8},{x:5,y:9},{x:5,y:10},
            {x:6,y:10},{x:7,y:10},{x:8,y:10},{x:9,y:10},{x:10,y:10},
            {x:11,y:10},{x:11,y:9},{x:11,y:8},{x:11,y:7},{x:11,y:6},
            {x:11,y:5},{x:11,y:4},{x:11,y:3},{x:11,y:2},{x:11,y:1},
            {x:12,y:1},{x:13,y:1},{x:14,y:1},{x:15,y:1},{x:16,y:1},
            {x:17,y:1},{x:17,y:2},{x:17,y:3},{x:17,y:4},{x:17,y:5},
            {x:17,y:6},{x:17,y:7},{x:17,y:8},{x:17,y:9},{x:17,y:10},
            {x:17,y:11}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 27, interval: 35 }, { type: "troll", count: 17, interval: 45 }] },
            { enemies: [{ type: "dragon", count: 6, interval: 80 }, { type: "darkKnight", count: 37, interval: 25 }] },
            { enemies: [{ type: "lich", count: 5, interval: 100 }, { type: "demon", count: 29, interval: 30 }] },
            { enemies: [{ type: "troll", count: 19, interval: 35 }, { type: "dragon", count: 7, interval: 70 }] },
            { enemies: [{ type: "goblin", count: 57, interval: 10 }, { type: "demon", count: 30, interval: 25 }, { type: "lich", count: 2, interval: 120 }] },
            { enemies: [{ type: "dragon", count: 8, interval: 60 }, { type: "lich", count: 5, interval: 90 }, { type: "demon", count: 32, interval: 20 }] },
            { enemies: [{ type: "titan", count: 3, interval: 200 }, { type: "dragon", count: 5, interval: 55 }, { type: "lich", count: 3, interval: 80 }] },
            { enemies: [{ type: "titan", count: 3, interval: 160 }, { type: "dragon", count: 6, interval: 50 }, { type: "demon", count: 12, interval: 20 }] },
            { enemies: [{ type: "titan", count: 3, interval: 140 }, { type: "lich", count: 4, interval: 70 }, { type: "dragon", count: 6, interval: 45 }] }
        ],
        terrain: [
            { type: "river", cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:8,y:0},{x:9,y:0},{x:10,y:0},{x:11,y:0},{x:12,y:0},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:17,y:0},{x:18,y:0},{x:19,y:0}] },
            { type: "bridge", cells: [{x:12,y:1}] },
            { type: "tree", cells: [{x:16,y:4},{x:8,y:3},{x:10,y:8},{x:2,y:9}] }
        ],
        bg: "#1a2a2a"
    },
    // ---- Level 44: Phantom Citadel ----
    {
        name: "Phantom Citadel",
        cols: 20, rows: 12,
        startGold: 538,
        lives: 7,
        path: [
            {x:19,y:10},{x:18,y:10},{x:17,y:10},{x:16,y:10},{x:16,y:9},
            {x:16,y:8},{x:16,y:7},{x:16,y:6},{x:16,y:5},{x:16,y:4},
            {x:16,y:3},{x:16,y:2},{x:15,y:2},{x:14,y:2},{x:13,y:2},
            {x:12,y:2},{x:11,y:2},{x:10,y:2},{x:10,y:3},{x:10,y:4},
            {x:10,y:5},{x:10,y:6},{x:10,y:7},{x:10,y:8},{x:9,y:8},
            {x:8,y:8},{x:7,y:8},{x:6,y:8},{x:5,y:8},{x:4,y:8},
            {x:4,y:7},{x:4,y:6},{x:4,y:5},{x:4,y:4},{x:4,y:3},
            {x:4,y:2},{x:4,y:1},{x:4,y:0}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 29, interval: 35 }, { type: "troll", count: 18, interval: 45 }] },
            { enemies: [{ type: "dragon", count: 7, interval: 80 }, { type: "darkKnight", count: 39, interval: 25 }] },
            { enemies: [{ type: "lich", count: 6, interval: 100 }, { type: "demon", count: 31, interval: 30 }] },
            { enemies: [{ type: "troll", count: 20, interval: 35 }, { type: "dragon", count: 8, interval: 70 }] },
            { enemies: [{ type: "goblin", count: 59, interval: 10 }, { type: "demon", count: 32, interval: 25 }, { type: "lich", count: 2, interval: 120 }] },
            { enemies: [{ type: "dragon", count: 9, interval: 60 }, { type: "lich", count: 5, interval: 90 }, { type: "demon", count: 34, interval: 20 }] },
            { enemies: [{ type: "titan", count: 3, interval: 200 }, { type: "dragon", count: 5, interval: 55 }, { type: "lich", count: 3, interval: 80 }] },
            { enemies: [{ type: "titan", count: 4, interval: 160 }, { type: "dragon", count: 6, interval: 50 }, { type: "demon", count: 12, interval: 20 }] },
            { enemies: [{ type: "titan", count: 3, interval: 140 }, { type: "lich", count: 4, interval: 70 }, { type: "dragon", count: 6, interval: 45 }] }
        ],
        terrain: [
            { type: "bridge", cells: [{x:4,y:0}] },
            { type: "tree", cells: [{x:15,y:0},{x:13,y:6},{x:13,y:1},{x:3,y:9}] },
            { type: "rock", cells: [{x:8,y:4},{x:17,y:4},{x:17,y:2},{x:1,y:9},{x:7,y:3}] },
            { type: "mountain", cells: [{x:19,y:3},{x:19,y:6},{x:12,y:1},{x:3,y:6},{x:18,y:4},{x:12,y:7}] }
        ],
        bg: "#1a0a1a"
    },
    // ---- Level 45: Nightmare Domain ----
    {
        name: "Nightmare Domain",
        cols: 20, rows: 12,
        startGold: 549,
        lives: 7,
        path: [
            {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},
            {x:5,y:1},{x:6,y:1},{x:7,y:1},{x:7,y:2},{x:7,y:3},
            {x:7,y:4},{x:7,y:5},{x:8,y:5},{x:9,y:5},{x:10,y:5},
            {x:11,y:5},{x:12,y:5},{x:13,y:5},{x:14,y:5},{x:15,y:5},
            {x:16,y:5},{x:17,y:5},{x:17,y:6},{x:17,y:7},{x:17,y:8},
            {x:17,y:9},{x:16,y:9},{x:15,y:9},{x:14,y:9},{x:13,y:9},
            {x:12,y:9},{x:11,y:9},{x:10,y:9},{x:9,y:9},{x:8,y:9},
            {x:7,y:9},{x:6,y:9},{x:5,y:9},{x:5,y:10},{x:5,y:11}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 31, interval: 35 }, { type: "troll", count: 19, interval: 45 }] },
            { enemies: [{ type: "dragon", count: 7, interval: 80 }, { type: "darkKnight", count: 41, interval: 25 }] },
            { enemies: [{ type: "lich", count: 6, interval: 100 }, { type: "demon", count: 33, interval: 30 }] },
            { enemies: [{ type: "troll", count: 21, interval: 35 }, { type: "dragon", count: 8, interval: 70 }] },
            { enemies: [{ type: "goblin", count: 61, interval: 10 }, { type: "demon", count: 34, interval: 25 }, { type: "lich", count: 2, interval: 120 }] },
            { enemies: [{ type: "dragon", count: 9, interval: 60 }, { type: "lich", count: 6, interval: 90 }, { type: "demon", count: 36, interval: 20 }] },
            { enemies: [{ type: "titan", count: 4, interval: 200 }, { type: "dragon", count: 5, interval: 55 }, { type: "lich", count: 3, interval: 80 }] },
            { enemies: [{ type: "titan", count: 4, interval: 160 }, { type: "dragon", count: 6, interval: 50 }, { type: "demon", count: 12, interval: 20 }] },
            { enemies: [{ type: "titan", count: 3, interval: 140 }, { type: "lich", count: 4, interval: 70 }, { type: "dragon", count: 6, interval: 45 }, { type: "titan", count: 2, interval: 120 }, { type: "phoenix", count: 1, interval: 200 }] }
        ],
        terrain: [
            { type: "tree", cells: [{x:12,y:8},{x:5,y:5},{x:7,y:11},{x:8,y:1}] },
            { type: "rock", cells: [{x:14,y:6},{x:5,y:7},{x:0,y:8},{x:11,y:2},{x:6,y:3}] }
        ],
        bg: "#0a0a0a"
    },
    // ---- Level 46: Apocalypse Plain ----
    {
        name: "Apocalypse Plain",
        cols: 20, rows: 12,
        startGold: 559,
        lives: 6,
        path: [
            {x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},
            {x:5,y:2},{x:6,y:2},{x:6,y:3},{x:6,y:4},{x:6,y:5},
            {x:6,y:6},{x:6,y:7},{x:6,y:8},{x:6,y:9},{x:7,y:9},
            {x:8,y:9},{x:9,y:9},{x:10,y:9},{x:11,y:9},{x:12,y:9},
            {x:13,y:9},{x:13,y:8},{x:13,y:7},{x:13,y:6},{x:13,y:5},
            {x:13,y:4},{x:13,y:3},{x:13,y:2},{x:14,y:2},{x:15,y:2},
            {x:16,y:2},{x:17,y:2},{x:18,y:2},{x:19,y:2}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 20, interval: 25 }, { type: "dragon", count: 4, interval: 60 }] },
            { enemies: [{ type: "lich", count: 3, interval: 70 }, { type: "troll", count: 15, interval: 30 }, { type: "demon", count: 17, interval: 20 }] },
            { enemies: [{ type: "titan", count: 2, interval: 140 }, { type: "dragon", count: 5, interval: 50 }] },
            { enemies: [{ type: "dragon", count: 6, interval: 45 }, { type: "lich", count: 4, interval: 60 }, { type: "demon", count: 20, interval: 18 }] },
            { enemies: [{ type: "goblin", count: 50, interval: 8 }, { type: "darkKnight", count: 20, interval: 20 }, { type: "titan", count: 2, interval: 130 }] },
            { enemies: [{ type: "titan", count: 3, interval: 110 }, { type: "lich", count: 5, interval: 50 }, { type: "dragon", count: 6, interval: 40 }] },
            { enemies: [{ type: "phoenix", count: 1, interval: 180 }, { type: "titan", count: 3, interval: 100 }, { type: "dragon", count: 7, interval: 35 }] },
            { enemies: [{ type: "phoenix", count: 2, interval: 150 }, { type: "titan", count: 4, interval: 90 }, { type: "lich", count: 5, interval: 45 }, { type: "dragon", count: 8, interval: 30 }] }
        ],
        terrain: [
            { type: "rock", cells: [{x:10,y:0},{x:19,y:8},{x:5,y:4},{x:8,y:4},{x:10,y:6}] },
            { type: "mountain", cells: [{x:14,y:4},{x:15,y:1},{x:1,y:0},{x:14,y:5},{x:18,y:6},{x:6,y:0}] },
            { type: "rock", cells: [{x:18,y:11},{x:14,y:0},{x:3,y:7}] }
        ],
        bg: "#2a0a0a"
    },
    // ---- Level 47: Shadow Throne ----
    {
        name: "Shadow Throne",
        cols: 20, rows: 12,
        startGold: 569,
        lives: 6,
        path: [
            {x:4,y:0},{x:4,y:1},{x:4,y:2},{x:4,y:3},{x:4,y:4},
            {x:4,y:5},{x:5,y:5},{x:6,y:5},{x:7,y:5},{x:8,y:5},
            {x:9,y:5},{x:10,y:5},{x:10,y:6},{x:10,y:7},{x:10,y:8},
            {x:10,y:9},{x:10,y:10},{x:11,y:10},{x:12,y:10},{x:13,y:10},
            {x:14,y:10},{x:15,y:10},{x:16,y:10},{x:16,y:9},{x:16,y:8},
            {x:16,y:7},{x:16,y:6},{x:16,y:5},{x:16,y:4},{x:16,y:3},
            {x:17,y:3},{x:18,y:3},{x:19,y:3}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 23, interval: 25 }, { type: "dragon", count: 5, interval: 60 }] },
            { enemies: [{ type: "lich", count: 4, interval: 70 }, { type: "troll", count: 18, interval: 30 }, { type: "demon", count: 20, interval: 20 }] },
            { enemies: [{ type: "titan", count: 2, interval: 140 }, { type: "dragon", count: 6, interval: 50 }] },
            { enemies: [{ type: "dragon", count: 7, interval: 45 }, { type: "lich", count: 4, interval: 60 }, { type: "demon", count: 23, interval: 18 }] },
            { enemies: [{ type: "goblin", count: 53, interval: 8 }, { type: "darkKnight", count: 23, interval: 20 }, { type: "titan", count: 2, interval: 130 }] },
            { enemies: [{ type: "titan", count: 3, interval: 110 }, { type: "lich", count: 5, interval: 50 }, { type: "dragon", count: 6, interval: 40 }] },
            { enemies: [{ type: "phoenix", count: 1, interval: 180 }, { type: "titan", count: 3, interval: 100 }, { type: "dragon", count: 7, interval: 35 }] },
            { enemies: [{ type: "phoenix", count: 2, interval: 150 }, { type: "titan", count: 4, interval: 90 }, { type: "lich", count: 5, interval: 45 }, { type: "dragon", count: 8, interval: 30 }] }
        ],
        terrain: [
            { type: "mountain", cells: [{x:0,y:9},{x:5,y:7},{x:19,y:5},{x:6,y:9},{x:5,y:3},{x:5,y:11}] },
            { type: "river", cells: [{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:1,y:5},{x:1,y:6},{x:1,y:7},{x:1,y:8},{x:1,y:9},{x:1,y:10},{x:1,y:11}] },
            { type: "bridge", cells: [{x:4,y:0}] },
            { type: "tree", cells: [{x:12,y:8},{x:13,y:5},{x:15,y:9},{x:2,y:11},{x:7,y:2}] }
        ],
        bg: "#0a0a0a"
    },
    // ---- Level 48: Eternal Forge ----
    {
        name: "Eternal Forge",
        cols: 20, rows: 12,
        startGold: 579,
        lives: 6,
        path: [
            {x:19,y:2},{x:18,y:2},{x:17,y:2},{x:16,y:2},{x:15,y:2},
            {x:14,y:2},{x:13,y:2},{x:12,y:2},{x:11,y:2},{x:10,y:2},
            {x:9,y:2},{x:8,y:2},{x:7,y:2},{x:6,y:2},{x:5,y:2},
            {x:4,y:2},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:3,y:5},
            {x:3,y:6},{x:4,y:6},{x:5,y:6},{x:6,y:6},{x:7,y:6},
            {x:8,y:6},{x:9,y:6},{x:10,y:6},{x:11,y:6},{x:12,y:6},
            {x:13,y:6},{x:14,y:6},{x:15,y:6},{x:15,y:7},{x:15,y:8},
            {x:15,y:9},{x:15,y:10},{x:14,y:10},{x:13,y:10},{x:12,y:10},
            {x:11,y:10},{x:10,y:10},{x:9,y:10},{x:8,y:10},{x:7,y:10},
            {x:6,y:10},{x:6,y:11}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 26, interval: 25 }, { type: "dragon", count: 6, interval: 60 }] },
            { enemies: [{ type: "lich", count: 5, interval: 70 }, { type: "troll", count: 21, interval: 30 }, { type: "demon", count: 23, interval: 20 }] },
            { enemies: [{ type: "titan", count: 3, interval: 140 }, { type: "dragon", count: 7, interval: 50 }] },
            { enemies: [{ type: "dragon", count: 8, interval: 45 }, { type: "lich", count: 5, interval: 60 }, { type: "demon", count: 26, interval: 18 }] },
            { enemies: [{ type: "goblin", count: 56, interval: 8 }, { type: "darkKnight", count: 26, interval: 20 }, { type: "titan", count: 2, interval: 130 }] },
            { enemies: [{ type: "titan", count: 4, interval: 110 }, { type: "lich", count: 6, interval: 50 }, { type: "dragon", count: 6, interval: 40 }] },
            { enemies: [{ type: "phoenix", count: 2, interval: 180 }, { type: "titan", count: 3, interval: 100 }, { type: "dragon", count: 7, interval: 35 }] },
            { enemies: [{ type: "phoenix", count: 3, interval: 150 }, { type: "titan", count: 4, interval: 90 }, { type: "lich", count: 5, interval: 45 }, { type: "dragon", count: 8, interval: 30 }] },
            { enemies: [{ type: "phoenix", count: 3, interval: 120 }, { type: "titan", count: 5, interval: 80 }, { type: "dragon", count: 10, interval: 25 }, { type: "demon", count: 26, interval: 15 }] }
        ],
        terrain: [
            { type: "river", cells: [{x:2,y:0},{x:2,y:1},{x:2,y:2},{x:2,y:3},{x:2,y:4},{x:2,y:5},{x:2,y:6},{x:2,y:7},{x:2,y:8},{x:2,y:9},{x:2,y:10},{x:2,y:11}] },
            { type: "bridge", cells: [{x:3,y:4}] }
        ],
        bg: "#3a1a0a"
    },
    // ---- Level 49: Heaven's Gate ----
    {
        name: "Heaven's Gate",
        cols: 20, rows: 12,
        startGold: 590,
        lives: 5,
        path: [
            {x:3,y:11},{x:3,y:10},{x:3,y:9},{x:3,y:8},{x:3,y:7},
            {x:3,y:6},{x:3,y:5},{x:4,y:5},{x:5,y:5},{x:6,y:5},
            {x:7,y:5},{x:8,y:5},{x:9,y:5},{x:9,y:4},{x:9,y:3},
            {x:9,y:2},{x:9,y:1},{x:10,y:1},{x:11,y:1},{x:12,y:1},
            {x:13,y:1},{x:14,y:1},{x:15,y:1},{x:15,y:2},{x:15,y:3},
            {x:15,y:4},{x:15,y:5},{x:15,y:6},{x:15,y:7},{x:15,y:8},
            {x:16,y:8},{x:17,y:8},{x:18,y:8},{x:19,y:8}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 29, interval: 25 }, { type: "dragon", count: 7, interval: 60 }] },
            { enemies: [{ type: "lich", count: 6, interval: 70 }, { type: "troll", count: 24, interval: 30 }, { type: "demon", count: 26, interval: 20 }] },
            { enemies: [{ type: "titan", count: 3, interval: 140 }, { type: "dragon", count: 8, interval: 50 }] },
            { enemies: [{ type: "dragon", count: 9, interval: 45 }, { type: "lich", count: 5, interval: 60 }, { type: "demon", count: 29, interval: 18 }] },
            { enemies: [{ type: "goblin", count: 59, interval: 8 }, { type: "darkKnight", count: 29, interval: 20 }, { type: "titan", count: 2, interval: 130 }] },
            { enemies: [{ type: "titan", count: 4, interval: 110 }, { type: "lich", count: 6, interval: 50 }, { type: "dragon", count: 6, interval: 40 }] },
            { enemies: [{ type: "phoenix", count: 2, interval: 180 }, { type: "titan", count: 3, interval: 100 }, { type: "dragon", count: 7, interval: 35 }] },
            { enemies: [{ type: "phoenix", count: 3, interval: 150 }, { type: "titan", count: 4, interval: 90 }, { type: "lich", count: 5, interval: 45 }, { type: "dragon", count: 8, interval: 30 }] },
            { enemies: [{ type: "phoenix", count: 3, interval: 120 }, { type: "titan", count: 5, interval: 80 }, { type: "dragon", count: 10, interval: 25 }, { type: "demon", count: 29, interval: 15 }] }
        ],
        terrain: [
            { type: "bridge", cells: [{x:12,y:1}] },
            { type: "tree", cells: [{x:4,y:0},{x:13,y:11},{x:4,y:3},{x:18,y:7},{x:8,y:9}] },
            { type: "rock", cells: [{x:12,y:7},{x:7,y:6},{x:0,y:9},{x:8,y:10},{x:0,y:7},{x:9,y:11}] }
        ],
        bg: "#1a2a3a"
    },
    // ---- Level 50: Final Judgment ----
    {
        name: "Final Judgment",
        cols: 20, rows: 12,
        startGold: 600,
        lives: 5,
        path: [
            {x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},
            {x:5,y:1},{x:5,y:2},{x:5,y:3},{x:5,y:4},{x:6,y:4},
            {x:7,y:4},{x:8,y:4},{x:9,y:4},{x:10,y:4},{x:11,y:4},
            {x:12,y:4},{x:13,y:4},{x:14,y:4},{x:15,y:4},{x:16,y:4},
            {x:17,y:4},{x:17,y:5},{x:17,y:6},{x:17,y:7},{x:17,y:8},
            {x:16,y:8},{x:15,y:8},{x:14,y:8},{x:13,y:8},{x:12,y:8},
            {x:11,y:8},{x:10,y:8},{x:9,y:8},{x:8,y:8},{x:7,y:8},
            {x:6,y:8},{x:5,y:8},{x:4,y:8},{x:3,y:8},{x:3,y:9},
            {x:3,y:10},{x:3,y:11}
        ],
        waves: [
            { enemies: [{ type: "demon", count: 32, interval: 25 }, { type: "dragon", count: 8, interval: 60 }] },
            { enemies: [{ type: "lich", count: 7, interval: 70 }, { type: "troll", count: 27, interval: 30 }, { type: "demon", count: 29, interval: 20 }] },
            { enemies: [{ type: "titan", count: 4, interval: 140 }, { type: "dragon", count: 9, interval: 50 }] },
            { enemies: [{ type: "dragon", count: 10, interval: 45 }, { type: "lich", count: 6, interval: 60 }, { type: "demon", count: 32, interval: 18 }] },
            { enemies: [{ type: "goblin", count: 62, interval: 8 }, { type: "darkKnight", count: 32, interval: 20 }, { type: "titan", count: 2, interval: 130 }] },
            { enemies: [{ type: "titan", count: 5, interval: 110 }, { type: "lich", count: 7, interval: 50 }, { type: "dragon", count: 6, interval: 40 }] },
            { enemies: [{ type: "phoenix", count: 3, interval: 180 }, { type: "titan", count: 3, interval: 100 }, { type: "dragon", count: 7, interval: 35 }] },
            { enemies: [{ type: "phoenix", count: 4, interval: 150 }, { type: "titan", count: 4, interval: 90 }, { type: "lich", count: 5, interval: 45 }, { type: "dragon", count: 8, interval: 30 }] },
            { enemies: [{ type: "phoenix", count: 3, interval: 120 }, { type: "titan", count: 5, interval: 80 }, { type: "dragon", count: 10, interval: 25 }, { type: "demon", count: 32, interval: 15 }] },
            { enemies: [{ type: "phoenix", count: 4, interval: 100 }, { type: "titan", count: 5, interval: 70 }, { type: "lich", count: 6, interval: 40 }, { type: "dragon", count: 10, interval: 20 }, { type: "phoenix", count: 3, interval: 80 }, { type: "titan", count: 3, interval: 60 }] }
        ],
        terrain: [
            { type: "tree", cells: [{x:9,y:7},{x:2,y:7},{x:2,y:8},{x:13,y:5},{x:6,y:1}] },
            { type: "rock", cells: [{x:12,y:6},{x:9,y:1},{x:10,y:5},{x:2,y:5},{x:13,y:7}] },
            { type: "mountain", cells: [{x:9,y:9},{x:14,y:10},{x:4,y:7}] },
            { type: "river", cells: [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:8,y:0},{x:9,y:0},{x:10,y:0},{x:11,y:0},{x:12,y:0},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:17,y:0},{x:18,y:0},{x:19,y:0}] }
        ],
        bg: "#1a0a0a"
    },

];
