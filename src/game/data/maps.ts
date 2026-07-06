import type { MapData } from './types';

export const TILE = {
  GRASS: 0, PATH: 1, TALL_GRASS: 2, TREE: 3, WATER: 4,
  WALL: 5, FLOOR: 6, SAND: 7, FLOWER: 8, SIGN: 9,
  FENCE: 10, ROOF: 11, DOOR: 12,
};

export const TILE_SIZE = 32;
export const TILE_SOLID = new Set([TILE.TREE, TILE.WATER, TILE.WALL, TILE.FENCE, TILE.SIGN, TILE.ROOF]);

const T = TILE.TREE, G = TILE.GRASS, P = TILE.PATH, S = TILE.TALL_GRASS;
const W = TILE.WATER, L = TILE.WALL, F = TILE.FLOOR, R = TILE.ROOF;
const D = TILE.DOOR, H = TILE.FLOWER;

// ─── OAKWIND VILLAGE (32 × 24) ────────────────────────────────────────────────
// Houses: left=(x:2-4,y:2-5), right=(x:19-24,y:2-5) → Pokémon Center
// Lab:    left side at y:12-16
const OAK_TILES: number[][] = [
  [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,R,R,R,G,G,G,G,G,G,G,G,G,G,G,G,G,G,R,R,R,R,R,R,G,G,G,G,G,G,T],
  [T,G,L,L,L,G,G,G,G,G,G,G,G,G,G,G,G,G,G,L,L,L,L,L,L,G,G,G,G,G,G,T],
  [T,G,L,L,L,G,G,G,G,G,G,G,G,G,G,G,G,G,G,L,L,L,L,L,L,G,G,G,G,G,G,T],
  [T,G,L,D,L,G,G,P,P,P,P,P,P,P,P,P,P,P,G,L,L,D,L,L,L,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,H,G,G,G,G,P,P,P,P,P,P,P,P,P,P,P,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,H,G,H,G,G,G,T],
  [T,R,R,R,R,R,R,R,R,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,L,L,L,L,L,L,L,L,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,L,L,L,L,L,L,L,L,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,L,L,L,L,L,L,L,L,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,L,L,L,D,L,L,L,L,G,G,G,G,G,P,P,P,P,P,P,P,P,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
];

// ─── ROUTE 1 (32 × 24) ───────────────────────────────────────────────────────
const R1_TILES: number[][] = [
  [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,T,T,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,T,T,S,S,S,S,S,S,S,T],
  [T,S,S,S,T,T,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,T,T,S,S,S,S,S,S,S,T],
  [T,G,G,G,T,T,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,T,T,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,T,T,S,S,P,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,T,T,S,S,P,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,H,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,H,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,T,T,S,S,S,S,S,P,S,S,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,T,T,S,S,S,S,S,P,S,S,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  // Row 23: path opening at x=13 leads to Route 2 (exit triggers from row 22 stepping south)
  [T,T,T,T,T,T,T,T,T,T,T,T,T,P,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
];

// ─── ROUTE 2 (32 × 24) ───────────────────────────────────────────────────────
const R2_TILES: number[][] = [
  [T,T,T,T,T,T,T,T,T,T,T,T,T,P,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,T,T,T,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,T,T,T,S,S,S,S,S,S,S,T],
  [T,S,S,T,T,T,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,T,T,T,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,W,W,W,W,W,G,G,G,G,G,G,G,P,G,G,G,G,G,G,W,W,W,W,W,G,G,G,G,G,G,T],
  [T,W,W,W,W,W,G,G,G,G,G,G,G,P,G,G,G,G,G,G,W,W,W,W,W,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,T,T,T,S,S,S,S,P,S,S,S,S,T,T,T,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,T,T,T,S,S,S,S,P,S,S,S,S,T,T,T,S,S,S,S,S,S,H,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,W,W,W,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,W,W,W,G,G,G,G,T],
  [T,W,W,W,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,W,W,W,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,T,T,S,S,S,P,S,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,T,T,S,S,S,P,S,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
];

// ─── PLAYER HOUSE INTERIOR (12 × 10) ─────────────────────────────────────────
const HOUSE_TILES: number[][] = [
  [L,L,L,L,L,L,L,L,L,L,L,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,L,L,L,L,D,L,L,L,L,L,L],
];

// ─── POKÉMON CENTER INTERIOR (14 × 10) ───────────────────────────────────────
// Right building in Oakwind (door at 21,5) → Pokémon Center
// Nurse at (4,4), Shop counter at (9,4), Door at (6,9)
const POKECENTER_TILES: number[][] = [
  [L,L,L,L,L,L,L,L,L,L,L,L,L,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,L,L,L,L,L,D,L,L,L,L,L,L,L],
];

// ─── LAB INTERIOR (16 × 12) ─────────────────────────────────────────────────
const LAB_TILES: number[][] = [
  [L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,L,L,L,L,L,L,D,L,L,L,L,L,L,L,L],
];

export const MAPS: Record<string, MapData> = {
  oakwind: {
    id: 'oakwind', name: 'Oakwind Village', width: 32, height: 24,
    tiles: OAK_TILES,
    npcs: [
      {
        id: 'npc1', name: 'Villager', x: 10, y: 8, direction: 'right', repeatable: true,
        dialogue: [
          'Welcome to Oakwind Village!',
          'The Pokémon Center to the east has a nurse who can heal your creatures for free.',
          'There\'s also a shop inside — pick up some supplies before heading into the tall grass!',
        ],
      },
      {
        id: 'npc2', name: 'Girl', x: 22, y: 18, direction: 'left', repeatable: true,
        dialogue: [
          'Route 1 to the south has lots of wild creatures!',
          'I saw a cute little Pebbit hopping around in the tall grass!',
          'There\'s even more on Route 2 beyond that...',
        ],
      },
      {
        id: 'npc3', name: 'Old Man', x: 8, y: 17, direction: 'down', repeatable: true,
        dialogue: [
          'Professor Rowan\'s lab is just to the north-west.',
          'He\'ll give you a partner creature to start your journey!',
          'Go talk to him — he\'s been waiting for a new trainer.',
        ],
      },
      {
        id: 'pokecenter_sign', name: 'Sign', x: 18, y: 7, direction: 'down', repeatable: true,
        dialogue: [
          '🏥 POKÉMON CENTER',
          'Nurse Joy will heal your party for FREE!',
          'The Shopkeeper inside sells Capture Orbs and Herbs.',
        ],
      },
    ],
    exits: [
      { x: 13, y: 22, width: 1, height: 1, targetMap: 'route1', targetX: 13, targetY: 2 },
      { x: 3,  y: 5,  width: 1, height: 1, targetMap: 'playerHouse', targetX: 5, targetY: 8 },
      { x: 21, y: 5,  width: 1, height: 1, targetMap: 'pokecenter',  targetX: 6, targetY: 8 },
      { x: 4,  y: 16, width: 1, height: 1, targetMap: 'labInterior', targetX: 7, targetY: 10 },
    ],
    encounters: [],
    music: 'town',
  },

  route1: {
    id: 'route1', name: 'Route 1', width: 32, height: 24,
    tiles: R1_TILES,
    npcs: [
      {
        id: 'trainer1', name: 'Hiker Ron', x: 8, y: 9, direction: 'down',
        dialogue: ['Hey you! Let\'s battle!', 'My Pebbit is tough as a rock!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 10, level: 5 }, { creatureId: 14, level: 4 }],
      },
      {
        id: 'route1_sign', name: 'Sign', x: 14, y: 4, direction: 'down', repeatable: true,
        dialogue: ['ROUTE 1 — Oakwind Village ↑  Ancient Ruins ↓', 'Tall grass: Level 2-7 creatures'],
      },
    ],
    exits: [
      { x: 13, y: 1,  width: 1, height: 1, targetMap: 'oakwind', targetX: 13, targetY: 21 },
      { x: 13, y: 23, width: 1, height: 1, targetMap: 'route2',  targetX: 13, targetY: 1  },
    ],
    encounters: [
      { creatureId: 10, minLevel: 2, maxLevel: 6, weight: 25 },
      { creatureId: 12, minLevel: 2, maxLevel: 5, weight: 25 },
      { creatureId: 14, minLevel: 3, maxLevel: 6, weight: 10 },
      { creatureId: 16, minLevel: 2, maxLevel: 5, weight: 15 },
      { creatureId: 18, minLevel: 3, maxLevel: 7, weight: 10 },
      { creatureId: 1, minLevel: 9, maxLevel: 15, weight: 5 },
      { creatureId: 4, minLevel: 9, maxLevel: 15, weight: 5 },
      { creatureId: 7, minLevel: 9, maxLevel: 15, weight: 5 },

    ],
    music: 'route',
  },

  route2: {
    id: 'route2', name: 'Route 2', width: 32, height: 24,
    tiles: R2_TILES,
    npcs: [
      {
        id: 'trainer2', name: 'Ranger Mia', x: 20, y: 9, direction: 'left',
        dialogue: ['I protect these wild creatures!', 'But a good battle keeps me sharp!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 22, level: 9 }, { creatureId: 24, level: 8 }],
      },
      {
        id: 'trainer3', name: 'Youngster Jay', x: 6, y: 14, direction: 'right',
        dialogue: ['I\'ve been training all week!', 'My Shadling is super spooky!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 20, level: 7 }],
      },
      {
        id: 'route2_sign', name: 'Sign', x: 14, y: 3, direction: 'down', repeatable: true,
        dialogue: ['ROUTE 2 — Ancient Ruins Ahead', 'WARNING: Strong wild creatures. Bring potions!'],
      },
    ],
    exits: [
      { x: 13, y: 1,  width: 1, height: 1, targetMap: 'route1', targetX: 13, targetY: 22 },
    ],
    encounters: [
      { creatureId: 20, minLevel: 6, maxLevel: 12, weight: 20 },
      { creatureId: 22, minLevel: 7, maxLevel: 12, weight: 15 },
      { creatureId: 24, minLevel: 6, maxLevel: 11, weight: 15 },
      { creatureId: 14, minLevel: 5, maxLevel: 10, weight: 15 },
      { creatureId: 26, minLevel: 8, maxLevel: 14, weight: 10 },
      { creatureId: 28, minLevel: 9, maxLevel: 15, weight: 10 },
      { creatureId: 27, minLevel: 9, maxLevel: 15, weight: 10 },
      { creatureId: 29, minLevel: 9, maxLevel: 15, weight: 5 },
    ],
    music: 'route',
  },

  playerHouse: {
    id: 'playerHouse', name: 'Your House', width: 12, height: 10,
    tiles: HOUSE_TILES,
    npcs: [
      {
        id: 'mom', name: 'Mom', x: 6, y: 4, direction: 'down',
        dialogue: [
          'Welcome home, dear!',
          'Professor Rowan\'s lab is just south of here — go see him!',
          'Don\'t forget to visit the Pokémon Center to heal your creatures.',
          'Stay safe out there!',
        ],
      },
    ],
    exits: [{ x: 5, y: 9, width: 1, height: 1, targetMap: 'oakwind', targetX: 3, targetY: 6 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },

  pokecenter: {
    id: 'pokecenter', name: 'Pokémon Center', width: 14, height: 10,
    tiles: POKECENTER_TILES,
    npcs: [
      {
        id: 'nurse', name: 'Nurse Joy', x: 4, y: 3, direction: 'down',
        isNurse: true,
        dialogue: [
          'Welcome to the Pokémon Center!',
          'I\'ll heal your creatures back to full health!',
          'Please come again!',
        ],
      },
      {
        id: 'shopkeeper', name: 'Shopkeeper', x: 9, y: 3, direction: 'down',
        isShop: true,
        shopItems: [
          { id: 1,  price: 200  },
          { id: 2,  price: 600  },
          { id: 3,  price: 1500 },
          { id: 10, price: 100  },
          { id: 11, price: 300  },
          { id: 12, price: 800  },
          { id: 30, price: 1000  },
          { id: 31, price: 6000 },
        ],
        dialogue: ['Welcome! Take a look at our wares!'],
      },
      {
        id: 'move_reminder', name: 'Move Reminder', x: 9, y: 6, direction: 'down',
        dialogue: ['I can help your creatures remember forgotten moves.'],
      },
    ],
    exits: [{ x: 6, y: 9, width: 1, height: 1, targetMap: 'oakwind', targetX: 21, targetY: 6 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },

  labInterior: {
    id: 'labInterior', name: 'Professor\'s Lab', width: 16, height: 12,
    tiles: LAB_TILES,
    npcs: [
      {
        id: 'rowan', name: 'Prof. Rowan', x: 8, y: 6, direction: 'down',
        triggersStarter: true,
        dialogue: [
          'Ah, there you are! I\'ve been waiting for a new trainer!',
          'The world of Aetheria is full of amazing creatures.',
          'Each one has a unique bond with their trainer.',
          'Here — choose your very first partner creature!',
        ],
      },
      {
        id: 'assistant', name: 'Lab Assistant', x: 3, y: 4, direction: 'right', repeatable: true,
        dialogue: [
          'The Professor has been researching creature energy signatures.',
          'Strange signals have been detected north of here...',
          'Something big is coming.',
        ],
      },
    ],
    exits: [{ x: 7, y: 11, width: 1, height: 1, targetMap: 'oakwind', targetX: 4, targetY: 17 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },
};
