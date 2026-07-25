import type { MapData } from './types';

export const TILE = {
  GRASS: 0, PATH: 1, TALL_GRASS: 2, TREE: 3, WATER: 4,
  WALL: 5, FLOOR: 6, SAND: 7, FLOWER: 8, SIGN: 9,
  FENCE: 10, ROOF: 11, DOOR: 12,
  BOULDER: 13, ROCK_PATH: 14, MUD: 15, CAVE_FLOOR: 16,
  WALL_CORAL: 17, ROOF_CORAL: 18, SEAWEED: 19,
  PALM: 20, SHELL: 21, DOCK: 22, CRYSTAL: 23,
};

export const TILE_SIZE = 32;
export const TILE_SOLID = new Set([TILE.TREE, TILE.WATER, TILE.WALL, TILE.FENCE, TILE.SIGN, TILE.ROOF, TILE.BOULDER, TILE.WALL_CORAL, TILE.ROOF_CORAL, TILE.SEAWEED, TILE.PALM]);

const T = TILE.TREE, G = TILE.GRASS, P = TILE.PATH, S = TILE.TALL_GRASS;
const W = TILE.WATER, L = TILE.WALL, F = TILE.FLOOR, R = TILE.ROOF;
const D = TILE.DOOR, H = TILE.FLOWER;
const B = TILE.BOULDER, K = TILE.ROCK_PATH, M = TILE.MUD, C = TILE.CAVE_FLOOR;
const LW = TILE.WALL_CORAL, RW = TILE.ROOF_CORAL, SW = TILE.SEAWEED;
const SD = TILE.SAND;
const PM = TILE.PALM, SH = TILE.SHELL, DK = TILE.DOCK;
const FN = TILE.FENCE, CR = TILE.CRYSTAL;

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
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,FN,FN,FN,FN,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,FN,H,H,FN,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,FN,H,H,FN,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,FN,FN,FN,FN,G,G,G,T],
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
  [T,S,S,S,S,S,S,S,H,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,H,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,W,W,W,W,W,G,G,P,G,G,G,G,G,G,G,W,W,W,W,W,G,G,G,G,G,T],
  [T,G,G,G,G,G,W,W,W,W,W,G,G,P,G,G,G,G,G,G,G,W,W,W,W,W,G,G,G,G,G,T],
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
  [T,S,S,S,H,S,T,T,T,S,S,S,S,P,S,S,S,S,T,T,T,S,S,S,S,S,S,H,S,S,S,T],
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

  // Main north-south road from Route 2 entrance down through the city,
  // continuing through a gap in the south border to the new Cave Route.
  for (let y = 1; y < h; y++) { grid[y][13] = P; grid[y][14] = P; }
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

  // Glinting crystal veins — Earthenhold's signature decoration, scattered
  // through the open plaza away from roads/buildings/boulders
  const crystalSpots: [number, number][] = [
    [12, 4], [19, 15], [7, 8], [24, 19], [15, 20], [4, 10],
  ];
  for (const [x, y] of crystalSpots) if (grid[y][x] === K) grid[y][x] = CR;

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

  // A few crystal veins glinting in the dungeon rock
  const dungeonCrystals: [number, number][] = [[5, 5], [16, 6], [9, 14], [14, 16]];
  for (const [x, y] of dungeonCrystals) grid[y][x] = CR;

  // Boulder pillars lining the approach toward the Dungeon Master
  for (let y = 3; y < h - 3; y += 3) {
    grid[y][3] = B; grid[y][w - 4] = B;
  }
  // A small boulder ring around the Dungeon Master's dais
  grid[2][9] = B; grid[2][12] = B; grid[3][8] = B; grid[3][13] = B;

  return grid;
}
const EARTHEN_DUNGEON_TILES: number[][] = makeEarthenDungeonTiles();

// ─── CAVE ROUTE (22 × 20) — dry cave giving way to a Surf-gated pool ─────────
// North door connects back to Earthenhold. A rocky corridor winds south past
// boulders, then opens onto a wide water pool that blocks all further
// progress until the player has Surf. Beyond the pool, a south door leads
// deeper into the Water Cave and, eventually, the Water City.
// Carves a winding tunnel segment: for each row between y0 and y1, the
// center-x and half-width are linearly interpolated between the given
// start/end values, producing an organic, wavy passage instead of a
// uniform rectangular room.
function carveTunnel(
  grid: number[][], w: number,
  y0: number, y1: number,
  cx0: number, cx1: number,
  width0: number, width1: number,
  tile: number,
) {
  const span = Math.max(1, y1 - y0);
  for (let y = y0; y <= y1; y++) {
    const t = (y - y0) / span;
    const cx = Math.round(cx0 + (cx1 - cx0) * t);
    const halfWidth = Math.max(1, Math.round((width0 + (width1 - width0) * t) / 2));
    for (let x = Math.max(1, cx - halfWidth); x <= Math.min(w - 2, cx + halfWidth); x++) {
      grid[y][x] = tile;
    }
  }
}

function makeCaveRouteTiles(): number[][] {
  const w = 22, h = 20;
  // Start as solid rock; the tunnel is carved out of it rather than starting
  // from an open floor, so any un-carved cell reads as natural cave rock,
  // not a built room wall. Using BOULDER (not WALL) keeps the whole place
  // reading as an outdoor-style cave, the same way routes use solid TREE
  // borders rather than architecture.
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(B));

  // North opening back to Earthenhold — a plain gap in the rock, not a door,
  // exactly like a route's tree-border path opening.
  grid[0][13] = C; grid[0][14] = C;

  // Winding entry passage down to the pool — drifts left, then right, widening
  carveTunnel(grid, w, 1, 4, 13, 12, 4, 7, C);
  carveTunnel(grid, w, 4, 9, 12, 13, 7, 9, C);

  // Rocky accents and boulder obstructions through the entry passage
  const rockyAccents: [number, number][] = [[11, 2], [15, 3], [8, 5], [16, 6], [9, 8]];
  for (const [x, y] of rockyAccents) grid[y][x] = K;
  grid[2][12] = B; grid[7][10] = B; grid[8][16] = B;

  // Wide water pool blocking the corridor — impassable without Surf.
  // Spans the full carveable width so there's no dry route around it.
  for (let y = 10; y <= 13; y++) {
    for (let x = 1; x <= w - 2; x++) grid[y][x] = W;
  }

  // Winding far-bank passage from the pool down to the south door — drifts
  // left then curves back right
  carveTunnel(grid, w, 14, 16, 11, 10, 9, 6, C);
  carveTunnel(grid, w, 16, 18, 10, 13, 6, 5, C);

  const farBankAccents: [number, number][] = [[9, 15], [14, 17], [7, 17]];
  for (const [x, y] of farBankAccents) grid[y][x] = K;
  grid[17][12] = B;

  // South opening onward to the Water Cave — same plain-gap treatment
  grid[h - 1][13] = C; grid[h - 1][14] = C;

  return grid;
}
const CAVE_ROUTE_TILES: number[][] = makeCaveRouteTiles();

// ─── WATER CAVE (22 × 22) — mostly-flooded passage, Surf required throughout ──
// A winding water channel with a few rocky islands to break up the swim.
// North opening back to Cave Route; south opening onto the Water City —
// both plain gaps in the rock, not doors, so it reads as an outdoor cave
// like Cave Route rather than an indoor room.
function makeWaterCaveTiles(): number[][] {
  const w = 22, h = 22;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(W));

  for (let x = 0; x < w; x++) { grid[0][x] = B; grid[h - 1][x] = B; }
  for (let y = 0; y < h; y++) { grid[y][0] = B; grid[y][w - 1] = B; }

  grid[0][13] = K; grid[0][14] = K;
  grid[h - 1][13] = K; grid[h - 1][14] = K;

  // A short dry landing just inside the north opening (so the player isn't
  // dropped straight into deep water) and another just inside the south one
  for (let x = 11; x <= 16; x++) { grid[1][x] = K; grid[2][x] = K; }
  for (let x = 11; x <= 16; x++) { grid[h - 2][x] = K; grid[h - 3][x] = K; }

  // Scattered rocky islands to break up the swim and give the water some shape
  const islands: [number, number, number, number][] = [
    // [x, y, width, height]
    [3, 6, 3, 2], [16, 5, 3, 2], [2, 12, 2, 3], [18, 11, 2, 3],
    [8, 9, 3, 2], [12, 14, 3, 2], [5, 17, 3, 2], [15, 17, 3, 2],
  ];
  for (const [ix, iy, iw, ih] of islands) {
    for (let y = iy; y < iy + ih; y++) for (let x = ix; x < ix + iw; x++) grid[y][x] = K;
  }

  return grid;
}
const WATER_CAVE_TILES: number[][] = makeWaterCaveTiles();

// ─── WATER CITY (26 × 20) — floating island, ringed by open sea ─────────────
// A sea "moat" (2 tiles thick) wraps the island, then a sandy shoreline, then
// the plaza itself: Water Lodge (nurse/shop/move reminder) to the west,
// Water Dungeon Gate to the east — the same civic template as Earthenhold.
function makeWaterCityTiles(): number[][] {
  const w = 26, h = 20;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(SD));

  // Outer sea moat, 2 tiles thick
  for (let t = 0; t < 2; t++) {
    for (let x = 0; x < w; x++) { grid[t][x] = W; grid[h - 1 - t][x] = W; }
    for (let y = 0; y < h; y++) { grid[y][t] = W; grid[y][w - 1 - t] = W; }
  }
  // Shallow kelp fringe just inside the moat, then the sandy beach begins
  for (let x = 2; x < w - 2; x++) { grid[2][x] = SW; grid[h - 3][x] = SW; }
  for (let y = 2; y < h - 2; y++) { grid[y][2] = SW; grid[y][w - 3] = SW; }

  // North dock — the arrival point from the Water Cave
  grid[0][13] = K; grid[0][14] = K; grid[1][13] = K; grid[1][14] = K;
  grid[2][13] = P; grid[2][14] = P;

  // Main north-south road from the dock down into the plaza
  for (let y = 2; y < h - 2; y++) { grid[y][13] = P; grid[y][14] = P; }
  // East-west road connecting the Lodge and the Dungeon Gate
  for (let x = 2; x < w - 2; x++) { grid[9][x] = P; grid[10][x] = P; }

  // Interior waterway — a canal cutting across the south of the plaza, with
  // a plank bridge where the main road crosses it. Gives Waveshore its own
  // "built around the water" identity instead of reading as dry ground with
  // a moat around the edge.
  for (let y = 13; y <= 14; y++) {
    for (let x = 4; x <= w - 5; x++) grid[y][x] = W;
  }
  const kelpInCanal: [number, number][] = [[6, 13], [10, 14], [17, 13], [20, 14]];
  for (const [x, y] of kelpInCanal) grid[y][x] = SW;
  grid[13][13] = P; grid[13][14] = P; grid[14][13] = P; grid[14][14] = P; // bridge

  // ── Water Lodge (nurse/shop/move reminder), west side — coral stonework ──
  grid[3][4] = RW; grid[3][5] = RW; grid[3][6] = RW; grid[3][7] = RW; grid[3][8] = RW; grid[3][9] = RW;
  for (let y = 4; y <= 5; y++) for (let x = 4; x <= 9; x++) grid[y][x] = LW;
  grid[6][4] = LW; grid[6][5] = LW; grid[6][6] = D; grid[6][7] = LW; grid[6][8] = LW; grid[6][9] = LW;

  // ── Water Dungeon Gate, east side — coral-and-stone archway ──
  for (let x = 17; x <= w - 4; x++) grid[2][x] = RW;
  for (let y = 3; y <= 8; y++) for (let x = 18; x <= w - 5; x++) grid[y][x] = LW;
  for (let x = 18; x <= w - 5; x++) grid[9][x] = LW;
  grid[9][19] = D; grid[9][20] = D;

  // Fishing pier reaching out into the west moat — walkable over water
  // without needing Surf, since it's a built structure, not open sea
  for (let x = 0; x <= 3; x++) grid[12][x] = DK;
  grid[11][1] = DK; grid[13][1] = DK; // small T-head at the pier's outer end

  // Palm trees along the beach
  const palmSpots: [number, number][] = [[3, 11], [22, 3], [3, 16]];
  for (const [x, y] of palmSpots) if (grid[y][x] === SD) grid[y][x] = PM;

  // Shell/starfish accents scattered across the open sand
  const shellSpots: [number, number][] = [[7, 11], [16, 11], [9, 16], [17, 16], [22, 16], [5, 12]];
  for (const [x, y] of shellSpots) if (grid[y][x] === SD) grid[y][x] = SH;

  return grid;
}
const WATER_CITY_TILES: number[][] = makeWaterCityTiles();

// ─── WATER DUNGEON (24 × 22) — coral hall, single grand chamber ─────────────
// Fills a small rectangular island centered on (cx, cy) — used to give NPCs
// solid footing amid the open water.
function sandIsland(grid: number[][], cx: number, cy: number, rx: number, ry: number, tile: number = SD) {
  for (let y = cy - ry; y <= cy + ry; y++) {
    if (!grid[y]) continue;
    for (let x = cx - rx; x <= cx + rx; x++) {
      if (grid[y][x] !== undefined) grid[y][x] = tile;
    }
  }
}

function makeWaterDungeonTiles(): number[][] {
  const w = 24, h = 22;
  // The whole chamber is flooded — Surf is required to cross it, the same
  // way Water Cave works, rather than walking a dry dungeon floor.
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(W));

  for (let x = 0; x < w; x++) { grid[0][x] = L; grid[h - 1][x] = L; }
  for (let y = 0; y < h; y++) { grid[y][0] = L; grid[y][w - 1] = L; }

  // South entrance (back to Water City) — a sandy landing just inside the
  // door so the player isn't dropped straight into deep water
  grid[h - 1][11] = D; grid[h - 1][12] = D;
  sandIsland(grid, 11, 20, 3, 0);
  sandIsland(grid, 11, 19, 2, 1);

  // Trainer islands — small sandbars just big enough to stand on
  const trainerIslands: [number, number][] = [
    [5, 18], [18, 18], [5, 15], [18, 15], [5, 11], [12, 11], [18, 11],
  ];
  for (const [x, y] of trainerIslands) sandIsland(grid, x, y, 1, 1);

  // Dungeon Master's platform — wider, at the far end of the chamber
  sandIsland(grid, 12, 4, 2, 1);

  // Loose sand tufts and seaweed drifting in the open water — "a little
  // sand and seaweed here and there" rather than a uniform floor
  const sandTufts: [number, number][] = [
    [8, 7], [15, 8], [9, 13], [15, 13], [3, 16], [20, 16], [8, 4], [16, 17],
  ];
  for (const [x, y] of sandTufts) if (grid[y][x] === W) grid[y][x] = SD;

  const seaweedSpots: [number, number][] = [
    [6, 6], [14, 6], [9, 9], [16, 10], [4, 12], [19, 13], [7, 17],
    [15, 18], [10, 16], [13, 9], [3, 8], [20, 9], [6, 14], [17, 15],
  ];
  for (const [x, y] of seaweedSpots) if (grid[y][x] === W) grid[y][x] = SW;

  // A few coral-boulder outcrops in the open water for visual rhythm
  const boulders: [number, number][] = [
    [3, 6], [20, 6], [3, 13], [20, 13], [8, 2], [15, 2],
  ];
  for (const [x, y] of boulders) grid[y][x] = B;

  return grid;
}
const WATER_DUNGEON_TILES: number[][] = makeWaterDungeonTiles();

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

// Same generic interior shell reused for the Water Lodge.
const WATER_LODGE_TILES: number[][] = EARTH_LODGE_TILES;

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
        id: 'guide', name: 'Guide', x: 16, y: 13, direction: 'left', repeatable: true,
        isGuide: true,
        dialogue: ['New to Aetheria? I can walk you through anything you\'re unsure about!'],
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
    isCity: true,
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
      { creatureId: 10, minLevel: 2, maxLevel: 6, weight: 35 },
      { creatureId: 12, minLevel: 2, maxLevel: 6, weight: 35 },
      { creatureId: 16, minLevel: 3, maxLevel: 7, weight: 30 },
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
      { creatureId: 20, minLevel: 6, maxLevel: 11, weight: 30 },
      { creatureId: 18, minLevel: 7, maxLevel: 12, weight: 30 },
      { creatureId: 14, minLevel: 7, maxLevel: 13, weight: 25 },
      { creatureId: 21, minLevel: 10, maxLevel: 14, weight: 5 },
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
      { x: 13, y: 23, width: 1, height: 1, targetMap: 'caveRoute', targetX: 13, targetY: 1 },
      { x: 14, y: 23, width: 1, height: 1, targetMap: 'caveRoute', targetX: 14, targetY: 1 },
    ],
    encounters: [],
    music: 'town',
    isCity: true,
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
          { id: 50, price: 350  },
          { id: 51, price: 700  },
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
    encounters: [], isIndoor: true, isCave: true, music: 'indoor',
  },

  caveRoute: {
    id: 'caveRoute', name: 'Cave Route', width: 22, height: 20,
    tiles: CAVE_ROUTE_TILES,
    npcs: [
      {
        id: 'cave_route_sign_entry', name: 'Sign', x: 10, y: 2, direction: 'down', repeatable: true,
        dialogue: [
          '⛏️ CAVE ROUTE',
          'The path ahead is flooded. You\'ll need to SURF to cross.',
        ],
      },
      {
        id: 'cave_trainer1', name: 'Spelunker Dax', x: 12, y: 7, direction: 'down',
        dialogue: ['Careful — these tunnels aren\'t as empty as they look!', 'My Craglet has cracked tougher rocks than you.'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 22, level: 16 }, { creatureId: 27, level: 15 }],
      },
      {
        id: 'cave_route_sign_far', name: 'Sign', x: 10, y: 15, direction: 'down', repeatable: true,
        dialogue: [
          'The cave breathes cool, salt-tinged air here...',
          'A flooded passage continues south — the Water Cave, and the sea beyond it.',
        ],
      },
      {
        id: 'cave_trainer2', name: 'Miner Petra', x: 11, y: 17, direction: 'up',
        dialogue: ['You made it past the pool, huh?', 'Let\'s see if you can handle what I dug up down here.'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 26, level: 18 }, { creatureId: 23, level: 17 }],
      },
    ],
    exits: [
      { x: 13, y: 0,  width: 1, height: 1, targetMap: 'earthenhold', targetX: 13, targetY: 22 },
      { x: 14, y: 0,  width: 1, height: 1, targetMap: 'earthenhold', targetX: 14, targetY: 22 },
      { x: 13, y: 19, width: 1, height: 1, targetMap: 'waterCave', targetX: 13, targetY: 1 },
      { x: 14, y: 19, width: 1, height: 1, targetMap: 'waterCave', targetX: 14, targetY: 1 },
    ],
    encounters: [
      { creatureId: 22, minLevel: 14, maxLevel: 18, weight: 25 },
      { creatureId: 27, minLevel: 14, maxLevel: 19, weight: 20 },
      { creatureId: 26, minLevel: 15, maxLevel: 19, weight: 20 },
      { creatureId: 23, minLevel: 16, maxLevel: 19, weight: 5  },
    ],
    isCave: true, music: 'route',
  },

  waterCave: {
    id: 'waterCave', name: 'Water Cave', width: 22, height: 22,
    tiles: WATER_CAVE_TILES,
    npcs: [
      {
        id: 'water_cave_sign', name: 'Sign', x: 12, y: 2, direction: 'down', repeatable: true,
        dialogue: [
          '🌊 WATER CAVE',
          'Deep water the whole way through — keep Surfing south.',
        ],
      },
      {
        id: 'water_cave_trainer1', name: 'Diver Talia', x: 9, y: 9, direction: 'down',
        dialogue: ['You surf well! But can you battle just as well?', 'Mistfin, dive in!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 24, level: 20 }, { creatureId: 29, level: 19 }],
      },
      {
        id: 'water_cave_trainer2', name: 'Angler Boyd', x: 13, y: 14, direction: 'up',
        dialogue: ['These waters run deep, and so does my team.', 'Let\'s see what you\'ve got!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 5, level: 22 }, { creatureId: 25, level: 21 }],
      },
    ],
    exits: [
      { x: 13, y: 0,  width: 1, height: 1, targetMap: 'caveRoute', targetX: 13, targetY: 18 },
      { x: 14, y: 0,  width: 1, height: 1, targetMap: 'caveRoute', targetX: 14, targetY: 18 },
      { x: 13, y: 21, width: 1, height: 1, targetMap: 'waterCity', targetX: 13, targetY: 2 },
      { x: 14, y: 21, width: 1, height: 1, targetMap: 'waterCity', targetX: 14, targetY: 2 },
    ],
    encounters: [
      { creatureId: 24, minLevel: 18, maxLevel: 23, weight: 25 },
      { creatureId: 29, minLevel: 19, maxLevel: 24, weight: 20 },
      { creatureId: 5,  minLevel: 20, maxLevel: 24, weight: 5  },
      { creatureId: 25, minLevel: 20, maxLevel: 24, weight: 5  },
    ],
    isCave: true, music: 'route',
  },

  waterCity: {
    id: 'waterCity', name: 'Waveshore', width: 26, height: 20,
    tiles: WATER_CITY_TILES,
    npcs: [
      {
        id: 'water_villager1', name: 'Tidecaller', x: 6, y: 12, direction: 'down', repeatable: true,
        dialogue: [
          'Welcome to Waveshore, the floating city of the sea!',
          'The Water Lodge to the west has a nurse, a shopkeeper, and a Move Reminder.',
        ],
      },
      {
        id: 'water_villager2', name: 'Pearl Diver', x: 19, y: 16, direction: 'up', repeatable: true,
        dialogue: [
          'That grand archway to the east is the Water Dungeon.',
          'Trainers say its Dungeon Master commands the tides themselves.',
        ],
      },
      {
        id: 'water_lodge_sign', name: 'Sign', x: 4, y: 8, direction: 'down', repeatable: true,
        dialogue: [
          '🏥 WATER LODGE',
          'Nurse Joy heals your party for FREE.',
          'The Shopkeeper sells supplies, and the Move Reminder can restore forgotten moves.',
        ],
      },
      {
        id: 'water_dungeon_sign', name: 'Sign', x: 22, y: 8, direction: 'down', repeatable: true,
        dialogue: [
          '🌊 WATER DUNGEON',
          'Defeat all of the trainers in a single streak to face the Dungeon Master.',
          'Leaving the dungeon resets your progress!',
        ],
      },
    ],
    exits: [
      { x: 13, y: 0,  width: 1, height: 1, targetMap: 'waterCave', targetX: 13, targetY: 20 },
      { x: 14, y: 0,  width: 1, height: 1, targetMap: 'waterCave', targetX: 14, targetY: 20 },
      { x: 6,  y: 6,  width: 1, height: 1, targetMap: 'waterLodge', targetX: 6, targetY: 8 },
      { x: 19, y: 9,  width: 1, height: 1, targetMap: 'waterDungeon', targetX: 11, targetY: 20 },
      { x: 20, y: 9,  width: 1, height: 1, targetMap: 'waterDungeon', targetX: 12, targetY: 20 },
    ],
    encounters: [],
    music: 'town',
    isCity: true,
  },

  waterLodge: {
    id: 'waterLodge', name: 'Water Lodge', width: 14, height: 10,
    tiles: WATER_LODGE_TILES,
    npcs: [
      {
        id: 'water_nurse', name: 'Nurse Joy', x: 4, y: 3, direction: 'down',
        isNurse: true,
        dialogue: [
          'Welcome to the Water Lodge!',
          'I\'ll heal your creatures back to full health!',
          'Good luck out on the tides!',
        ],
      },
      {
        id: 'water_shopkeeper', name: 'Shopkeeper', x: 9, y: 3, direction: 'down',
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
          { id: 50, price: 350  },
          { id: 51, price: 700  },
        ],
        dialogue: ['Welcome! The tides bring good customers.'],
      },
      {
        id: 'move_reminder', name: 'Move Reminder', x: 9, y: 6, direction: 'down',
        dialogue: ['I can help your creatures remember forgotten moves.'],
      },
    ],
    exits: [{ x: 6, y: 9, width: 1, height: 1, targetMap: 'waterCity', targetX: 6, targetY: 7 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },

  waterDungeon: {
    id: 'waterDungeon', name: 'Water Dungeon', width: 24, height: 22,
    tiles: WATER_DUNGEON_TILES,
    npcs: [
      { id: 'water_trainer1', name: 'Tidepool Nim', x: 5, y: 18, direction: 'up', dungeonId: 'water',
        dialogue: ['The current favors me here!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 4, level: 24 }, { creatureId: 24, level: 23 }] },
      { id: 'water_trainer2', name: 'Pearl Sena', x: 18, y: 18, direction: 'up', dungeonId: 'water',
        dialogue: ['Few can out-swim me!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 5, level: 25 }, { creatureId: 4, level: 24 }] },
      { id: 'water_trainer3', name: 'Reef Kato', x: 5, y: 15, direction: 'up', dungeonId: 'water',
        dialogue: ['My creatures know these depths well!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 24, level: 26 }, { creatureId: 25, level: 25 }] },
      { id: 'water_trainer4', name: 'Undine Wren', x: 18, y: 15, direction: 'up', dungeonId: 'water',
        dialogue: ['Ripples never lie — you\'ll lose!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 5, level: 27 }, { creatureId: 29, level: 26 }] },
      { id: 'water_trainer5', name: 'Current Mira', x: 5, y: 11, direction: 'up', dungeonId: 'water',
        dialogue: ['Three tides, one relentless swell!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 4, level: 27 }, { creatureId: 25, level: 27 }, { creatureId: 5, level: 28 }] },
      { id: 'water_trainer6', name: 'Depthkeeper Sol', x: 12, y: 11, direction: 'up', dungeonId: 'water',
        dialogue: ['The dungeon judges everyone equally!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 24, level: 28 }, { creatureId: 5, level: 27 }, { creatureId: 29, level: 28 }] },
      { id: 'water_trainer7', name: 'Squallmage Iona', x: 18, y: 11, direction: 'up', dungeonId: 'water',
        dialogue: ['Wind and water — a tough combination!', 'Go, my pride and joy!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 25, level: 28 }, { creatureId: 6, level: 24 }, { creatureId: 30, level: 29 }] },
      { id: 'water_dungeon_master', name: 'Dungeon Master Nerissa', x: 12, y: 4, direction: 'down',
        dungeonId: 'water', isDungeonMaster: true, dungeonMasterRequires: 7,
        dialogue: [
          'So — you\'ve crossed the flooded cave to reach me.',
          'Beat all seven of my trainers in a single streak, and I am yours to challenge.',
          'Let\'s see if your resolve holds against the tide.',
        ],
        isTrainer: true,
        trainerCreatures: [
          { creatureId: 5, level: 32 }, { creatureId: 25, level: 32 },
          { creatureId: 24, level: 31 }, { creatureId: 6, level: 34 },
        ] },
    ],
    exits: [
      { x: 11, y: 21, width: 1, height: 1, targetMap: 'waterCity', targetX: 19, targetY: 10 },
      { x: 12, y: 21, width: 1, height: 1, targetMap: 'waterCity', targetX: 20, targetY: 10 },
    ],
    encounters: [], isIndoor: true, isCave: true, music: 'indoor',
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
          { id: 50, price: 350  },
          { id: 51, price: 700  },
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