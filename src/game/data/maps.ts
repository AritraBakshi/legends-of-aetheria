import type { MapData } from './types';

export const TILE = {
  GRASS: 0, PATH: 1, TALL_GRASS: 2, TREE: 3, WATER: 4,
  WALL: 5, FLOOR: 6, SAND: 7, FLOWER: 8, SIGN: 9,
  FENCE: 10, ROOF: 11, DOOR: 12,
  BOULDER: 13, ROCK_PATH: 14, MUD: 15,
};

export const TILE_SIZE = 32;
export const TILE_SOLID = new Set([TILE.TREE, TILE.WATER, TILE.WALL, TILE.FENCE, TILE.SIGN, TILE.ROOF, TILE.BOULDER]);

const T = TILE.TREE, G = TILE.GRASS, P = TILE.PATH, S = TILE.TALL_GRASS;
const W = TILE.WATER, L = TILE.WALL, F = TILE.FLOOR, R = TILE.ROOF;
const D = TILE.DOOR, H = TILE.FLOWER;
const B = TILE.BOULDER, K = TILE.ROCK_PATH, M = TILE.MUD;

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
  [T,T,T,T,T,T,T,T,T,T,T,T,T,P,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
];

// ─── EARTHENHOLD (32 × 24) — Earth-themed dungeon city ──────────────────────
// Grayish rocky paths + mud replace most grass; boulders scattered as obstacles.
// Earth Lodge (nurse/shop/move reminder) on the west side; grandiose Dungeon
// Gate on the east side leading into the Earthen Dungeon.
function makeEarthenholdTiles(): number[][] {
  const w = 32, h = 24;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(K));

  // Border
  for (let x = 0; x < w; x++) { grid[0][x] = T; grid[h - 1][x] = T; }
  for (let y = 0; y < h; y++) { grid[y][0] = T; grid[y][w - 1] = T; }

  // Main north-south road from Route 2 entrance down through the city
  for (let y = 1; y < h - 1; y++) { grid[y][13] = P; grid[y][14] = P; }
  // East-west road connecting the Lodge and the Dungeon Gate
  for (let x = 1; x < w - 1; x++) { grid[11][x] = P; grid[12][x] = P; }

  // Scattered mud patches
  const mudSpots: [number, number][] = [
    [4, 15], [5, 15], [4, 16], [18, 6], [19, 6], [18, 7],
    [22, 16], [23, 16], [23, 17], [6, 19], [7, 19], [7, 20],
  ];
  for (const [x, y] of mudSpots) grid[y][x] = M;

  // Scattered boulders (solid obstacles) dotted around the open plaza
  // (kept clear of doors, roads, and NPC tiles)
  const boulders: [number, number][] = [
    [10, 14], [10, 15], [20, 14], [21, 19], [9, 4], [18, 14],
    [16, 16], [17, 5], [6, 20], [25, 15],
  ];
  for (const [x, y] of boulders) grid[y][x] = B;

  // A little surviving grass, much less than the village
  const grassSpots: [number, number][] = [
    [3, 3], [3, 4], [28, 3], [28, 4], [3, 20], [28, 20],
  ];
  for (const [x, y] of grassSpots) grid[y][x] = G;

  // ── Earth Lodge building (nurse/shop/move reminder), west side ──
  // Same construction as the Pokémon Center/Lab: 1 roof row + solid wall
  // rows, with the door punched only into the bottom-most wall row. No
  // "interior" tiles are ever placed here — this is an exterior facade only.
  grid[2][3] = R; grid[2][4] = R; grid[2][5] = R; grid[2][6] = R; grid[2][7] = R; grid[2][8] = R;
  for (let y = 3; y <= 4; y++) for (let x = 3; x <= 8; x++) grid[y][x] = L;
  grid[5][3] = L; grid[5][4] = L; grid[5][5] = D; grid[5][6] = L; grid[5][7] = L; grid[5][8] = L;

  // ── Grandiose Dungeon Gate, east side — a wide fortified archway ──
  // Same solid-block construction, just bigger: 1 roof row + 6 solid wall
  // rows + a bottom door row (wide double doors). The outer map border
  // (row 0) is left untouched.
  for (let x = 21; x <= 30; x++) grid[1][x] = R;
  for (let y = 2; y <= 7; y++) for (let x = 22; x <= 29; x++) grid[y][x] = L;
  for (let x = 22; x <= 29; x++) grid[8][x] = L;
  grid[8][25] = D; grid[8][26] = D; // wide double-door entrance

  return grid;
}
const EARTHENHOLD_TILES: number[][] = makeEarthenholdTiles();

// ─── EARTHEN DUNGEON (22 × 20) — single grand hall ───────────────────────────
function makeEarthenDungeonTiles(): number[][] {
  const w = 22, h = 20;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(F));

  for (let x = 0; x < w; x++) { grid[0][x] = L; grid[h - 1][x] = L; }
  for (let y = 0; y < h; y++) { grid[y][0] = L; grid[y][w - 1] = L; }

  // South entrance (back to Earthenhold)
  grid[h - 1][10] = D; grid[h - 1][11] = D;

  // Rocky ground accents — hand-placed rather than a formula, so the floor
  // reads as scattered rubble instead of a repeating diagonal stripe.
  const rockyAccents: [number, number][] = [
    [3, 4], [6, 3], [14, 4], [18, 3], [4, 8], [9, 9], [15, 8], [19, 9],
    [3, 12], [7, 13], [13, 12], [18, 13], [5, 16], [11, 15], [17, 16],
    [8, 6], [12, 6], [16, 12], [6, 11], [10, 5],
  ];
  for (const [x, y] of rockyAccents) grid[y][x] = K;

  // Boulder pillars lining the approach toward the Dungeon Master
  for (let y = 3; y < h - 3; y += 3) {
    grid[y][3] = B; grid[y][w - 4] = B;
  }
  // A small boulder ring around the Dungeon Master's dais
  grid[2][9] = B; grid[2][12] = B; grid[3][8] = B; grid[3][13] = B;

  return grid;
}
const EARTHEN_DUNGEON_TILES: number[][] = makeEarthenDungeonTiles();

// ─── EARTH LODGE INTERIOR (14 × 10) ──────────────────────────────────────────
const EARTH_LODGE_TILES: number[][] = [
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
      { x: 13, y: 23, width: 1, height: 1, targetMap: 'earthenhold', targetX: 13, targetY: 2 },
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

  earthenhold: {
    id: 'earthenhold', name: 'Earthenhold', width: 32, height: 24,
    tiles: EARTHENHOLD_TILES,
    npcs: [
      {
        id: 'earthen_villager1', name: 'Quarrier', x: 6, y: 14, direction: 'down', repeatable: true,
        dialogue: [
          'Welcome to Earthenhold, city of stone and mud!',
          'The Earth Lodge to the west has a nurse, a shopkeeper, and someone who can remind your creatures of old moves.',
        ],
      },
      {
        id: 'earthen_villager2', name: 'Mason', x: 20, y: 18, direction: 'up', repeatable: true,
        dialogue: [
          'That\'s the Earthen Dungeon gate to the east.',
          'Nine trainers guard the hall, and their Dungeon Master waits at the end.',
          'Word is you have to beat all nine in a row — leave, and you start over!',
        ],
      },
      {
        id: 'lodge_sign', name: 'Sign', x: 2, y: 6, direction: 'down', repeatable: true,
        dialogue: [
          '🏥 EARTH LODGE',
          'Nurse Joy heals your party for FREE.',
          'The Shopkeeper sells supplies, and the Move Reminder can restore forgotten moves.',
        ],
      },
      {
        id: 'earthen_sign', name: 'Sign', x: 28, y: 10, direction: 'down', repeatable: true,
        dialogue: [
          '⛰️ EARTHEN DUNGEON',
          'Defeat all 9 trainers in a single streak to face the Dungeon Master.',
          'Leaving the dungeon resets your progress!',
        ],
      },
    ],
    exits: [
      { x: 13, y: 1,  width: 1, height: 1, targetMap: 'route2', targetX: 13, targetY: 22 },
      { x: 5,  y: 5,  width: 1, height: 1, targetMap: 'earthLodge', targetX: 6, targetY: 8 },
      { x: 25, y: 8,  width: 1, height: 1, targetMap: 'earthenDungeon', targetX: 10, targetY: 18 },
      { x: 26, y: 8,  width: 1, height: 1, targetMap: 'earthenDungeon', targetX: 11, targetY: 18 },
    ],
    encounters: [],
    music: 'town',
  },

  earthLodge: {
    id: 'earthLodge', name: 'Earth Lodge', width: 14, height: 10,
    tiles: EARTH_LODGE_TILES,
    npcs: [
      {
        id: 'nurse', name: 'Nurse Joy', x: 4, y: 3, direction: 'down',
        isNurse: true,
        dialogue: [
          'Welcome to the Earth Lodge!',
          'I\'ll heal your creatures back to full health!',
          'Good luck in the dungeon!',
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
        dialogue: ['Welcome! Stocking up before the dungeon, are you?'],
      },
      {
        id: 'move_reminder', name: 'Move Reminder', x: 9, y: 6, direction: 'down',
        dialogue: ['I can help your creatures remember forgotten moves.'],
      },
    ],
    exits: [{ x: 6, y: 9, width: 1, height: 1, targetMap: 'earthenhold', targetX: 5, targetY: 6 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },

  earthenDungeon: {
    id: 'earthenDungeon', name: 'Earthen Dungeon', width: 22, height: 20,
    tiles: EARTHEN_DUNGEON_TILES,
    npcs: [
      { id: 'earth_trainer1', name: 'Digger Tam', x: 5, y: 16, direction: 'up', dungeonId: 'earthen',
        dialogue: ['You\'ll have to get through me first!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 10, level: 10 }, { creatureId: 22, level: 10 }] },
      { id: 'earth_trainer2', name: 'Miner Bo', x: 16, y: 16, direction: 'up', dungeonId: 'earthen',
        dialogue: ['These tunnels are mine to guard!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 11, level: 12 }, { creatureId: 9, level: 11 }] },
      { id: 'earth_trainer3', name: 'Crusher Vik', x: 5, y: 13, direction: 'up', dungeonId: 'earthen',
        dialogue: ['Hope your creatures can take a hit!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 23, level: 13 }, { creatureId: 26, level: 12 }] },
      { id: 'earth_trainer4', name: 'Prospector Ren', x: 16, y: 13, direction: 'up', dungeonId: 'earthen',
        dialogue: ['I\'ve struck gold in battle before!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 21, level: 13 }, { creatureId: 27, level: 12 }] },
      { id: 'earth_trainer5', name: 'Boulder Sage', x: 5, y: 10, direction: 'up', dungeonId: 'earthen',
        dialogue: ['Three creatures, one unshakable will!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 10, level: 14 }, { creatureId: 22, level: 14 }, { creatureId: 11, level: 15 }] },
      { id: 'earth_trainer6', name: 'Stonewarden Elka', x: 11, y: 10, direction: 'up', dungeonId: 'earthen',
        dialogue: ['The dungeon tests everyone equally!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 9, level: 15 }, { creatureId: 21, level: 14 }, { creatureId: 23, level: 15 }] },
      { id: 'earth_trainer7', name: 'Magmason Ito', x: 16, y: 10, direction: 'up', dungeonId: 'earthen',
        dialogue: ['Fire and stone — a tough combination!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 26, level: 15 }, { creatureId: 27, level: 15 }, { creatureId: 10, level: 16 }] },
      { id: 'earth_trainer8', name: 'Tunneler Gus', x: 5, y: 7, direction: 'up', dungeonId: 'earthen',
        dialogue: ['Almost to the Dungeon Master — almost!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 11, level: 16 }, { creatureId: 23, level: 16 }, { creatureId: 22, level: 16 }] },
      { id: 'earth_trainer9', name: 'Vanguard Priya', x: 16, y: 7, direction: 'up', dungeonId: 'earthen',
        dialogue: ['I\'m the last line before the Dungeon Master!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 22, level: 17 }, { creatureId: 21, level: 17 }, { creatureId: 11, level: 17 }] },
      { id: 'earth_dungeon_master', name: 'Dungeon Master Tarrok', x: 11, y: 4, direction: 'down',
        dungeonId: 'earthen', isDungeonMaster: true, dungeonMasterRequires: 9,
        dialogue: [
          'So — you\'ve made it this far.',
          'Beat all nine of my trainers in a single streak, and I am yours to challenge.',
          'Prove your resolve, unbroken!',
        ],
        isTrainer: true,
        trainerCreatures: [
          { creatureId: 11, level: 20 }, { creatureId: 23, level: 20 },
          { creatureId: 9, level: 20 }, { creatureId: 26, level: 22 },
        ] },
    ],
    exits: [
      { x: 10, y: 19, width: 1, height: 1, targetMap: 'earthenhold', targetX: 25, targetY: 9 },
      { x: 11, y: 19, width: 1, height: 1, targetMap: 'earthenhold', targetX: 26, targetY: 9 },
    ],
    encounters: [], isIndoor: true, music: 'indoor',
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