/* ============================================
   LEVELS — 10 unique levels with paths & waves
   ============================================ */

// Grid is 20 cols × 12 rows (each cell 48×48 at base)
// Path is array of {x, y} grid coordinates enemies walk through
// Waves define enemy types and counts

const LEVELS = [
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
];
